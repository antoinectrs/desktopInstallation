// ---------------- MOBILE -----------------    
class MOBILE {
    constructor(myMap, point, noPoint) {
        this.myMap = myMap;
        // this.mapDom = searchHtml("#map .leaflet-pane");
        // hideBlur(this.mapDom, "add");
        this.targetMap = null;

        this.point = point;
        this.noPoint = noPoint;
        this.preset;
        this.myCompass;
        this.myPosition();
        this.autorisePlay = false;
        // this.myConsole();
        this.spaceRadius = 4500;
        this.createMap = false;
        this.partition = {
            title: {
                element: searchHtml("#title"),
                content: null,
            },
            verse: {
                element: searchHtmlArray(".dynamic p"),
                content: null,
            },
        }

    }

    checkRoad() { this.autorisePlay = true }
    myPosition() {
        navigator.geolocation.watchPosition(pos => {
            if (this.autorisePlay) this.manager(pos);
        })
    }
    manager(pos) {
        if (this.createMap == false) {
            this.myMap.init(pos.coords.latitude, pos.coords.longitude, 10);
            this.myMap.boxTest();
            this.myCompass = new myCompass();
            // this.listenMyCompass(pos);
            this.createMap = true;
        }
        this.getAltittude(pos);
        this.centerMap(pos);
        const myLatlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
        const catchCloserPoint = this.closerPoint(myLatlng, this.spaceRadius); // / console.log(this.myMap.distance*4000);

        if (catchCloserPoint != "tofar") {
            console.log("inside");
            this.renderPoint(catchCloserPoint.index);
            this.setTitlePartition(catchCloserPoint.index);
            this.setVersePartition(catchCloserPoint.index);
            this.listenMyCompass(catchCloserPoint.hitBoxNear);
            // hideBlur(this.mapDom, "remove");
        }
        else {
            this.releasePoint();
            // this.myDebug("range", "tofar");
            // hideBlur(this.mapDom, "add");
        }
    }
    getAltittude(pos) {
        // console.log(pos.coords.accuracy);
        const altitude = pos.coords.altitude
        if (altitude) {
            // this.myDebug("alt", altitude)
            return altitude;
        }
    }
    centerMap(pos) {
        const convertPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        }
        console.log("new");
        // this.myMap.map.setView(convertPos, this.myMap.map.getZoom(), {
        //     "animate": true,
        //     "pan": {
        //         "duration": 10
        //     }
        // });
        // this.myMap.map.setBearing(90);
        this.myMap.map.flyTo(convertPos, 18, {
            animate: true,
            duration: 1.5
        });
    }
    closerPoint(myLatlng, spaceRadius) {
        const hitBoxArray = this.myMap.hitBox.map(element => this.syncDistance(element, myLatlng, 70))
        const closer = Math.min(...hitBoxArray);
        const index = hitBoxArray.indexOf(closer);
        const centerHitBoxNear = this.centerBox(this.myMap.hitBox, index);
        if (closer <= spaceRadius)
            return { index: index, value: closer, hitBoxNear: centerHitBoxNear };
        return "tofar";
    }
    centerBox(element, index) {
        if (element[index] != undefined)
            return element[index].getBounds().getCenter()
    }
    syncDistance(box, myPos) {
        const centerL = box.getBounds().getCenter();
        return myPos.distanceTo(centerL);
    }
    renderPoint(boxIndex) {
        this.point.forEach((element, index) => {
            if (element.sample.audio.state != "suspended") {
                this.asignPreset(index, boxIndex, element);
            };
        })
        if (this.noPoint.sample.audio.state != "suspended") this.noPoint.sample.render(0, 1);
        // this.idRoute = boxIndex;
    }
    releasePoint() {
        if (this.noPoint.sample.audio.state != "suspended") this.noPoint.sample.render(5000, 1);
        this.point.forEach(element => {
            if (element.sample.audio.state != "suspended") element.sample.render(0, 0)
        })
    }
    asignPreset(index, boxIndex, element) {
        const targetVolume = this.preset[index].volume;
        const scale = Math.round(mapRange(boxIndex, 0, this.myMap.hitBox.length, 0, targetVolume.length));
        const presetVolume = targetVolume[scale];

        const targetSpeed = this.preset[index].mySpeed;
        const presetSpeed = targetSpeed[scale];

        // this.myDebug("range", scale);
        element.sample.render(presetVolume, 1);
        element.sample.initSpeed(presetSpeed)
    }

    listenMyCompass(hitBoxNear) {
        const search = () => {
            setTimeout(() => {

                const orientation = this.myCompass.compassLoad()
                if (orientation != undefined) {
                    this.myMap.changeOrientation(orientation);
                    this.compassPoint(hitBoxNear);
                };
                requestAnimationFrame(search)
            }, 1000 / 15);
        }
        search();
    }
    compassPoint(hitBoxNear) {
        const comp = this.myCompass.myCompass;
        const compassP = comp.position.coords
        const currentPosition = { lat: compassP.latitude, lng: compassP.longitude };

        const targetAngle = comp.getBearingToDestination(currentPosition, { lat: hitBoxNear.lat, lng: hitBoxNear.lng })
        myRotate(this.partition.title.element, targetAngle); // default remplacer par "orientation" 
    }
    myConsole() {
        const myButton = document.querySelector("#myConsole");
        myButton.addEventListener("click", e => {
            const myConsol = document.querySelector(".console input");
            const wordData = myConsol.value.split(',')
            const pos = {
                coords: {
                    latitude: wordData[0],
                    longitude: wordData[1]
                }
            };
            this.manager(pos);
        })
    }
    myDebug(target, value) {
        searchHtml("#" + target).innerHTML = value;
        // document.getElementById(target).innerHTML = value;
    }

    //  ----------- DOM --------------------
    setTitlePartition(indexZone) {
        const changeDom = this.preset[indexZone].title;
        this.partition.title.element.innerHTML = changeDom;
    };
    setVersePartition(indexZone) {
        // const changeDom = this.preset[indexZone].verse;
        // this.partition.verse.element[indexZone].innerHTML = changeDom;
        const target = this.partition.verse.element[indexZone];
        const debugT = document.getElementById("myEnd");
        const toScroll = document.querySelector(".dynamic");
        SmoothVerticalScrolling(debugT,toScroll, 4000, "top")
        this.preset.forEach((e, index) => {
            const myString = String(e.verse);
            const htmlString = this.partition.verse.element[index].textContent;
            //REMPLACE TEXT 
            if(myString!=htmlString){
                this.partition.verse.element[index].innerHTML=e.verse;
            }
        });
        
    };
}
