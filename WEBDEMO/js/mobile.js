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
        this.myConsole();
        this.spaceRadius = 50;
        this.createMap = false;
        this.inPath = false;
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
            // console.log("inside");
            this.inPath = true;
          
            this.renderPoint(catchCloserPoint.index);
            this.setTitlePartition(catchCloserPoint.index);
            this.setVersePartition(catchCloserPoint.index);
            this.listenMyCompass(catchCloserPoint.hitBoxNear);
            // hideBlur(this.mapDom, "remove");
        }
        else {
            this.inPath = false;
            this.releasePoint();
            // hideBlur(this.mapDom, "add");
        }
        myDebug("path", this.inPath);
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
        let targetAngle = 0;
        if (this.inPath==false) {
            targetAngle = comp.getBearingToDestination(currentPosition, { lat: hitBoxNear.lat, lng: hitBoxNear.lng });
            console.log(targetAngle);
        }
        myRotate(this.partition.title.element, targetAngle);
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
    //  ----------- DOM --------------------
    setTitlePartition(indexZone) {
        const changeDom = this.preset[indexZone].title;
        this.partition.title.element.innerHTML = changeDom;
    };
    checkContentText(e, index) {
        const myString = String(e.verse);
        const pointHtml = this.partition.verse.element[index];
        const htmlString = pointHtml.textContent;
        if (myString != htmlString)      //REMPLACE TEXT 
            pointHtml.innerHTML = e.verse;
    }
    // searchIdScroll(element) {
    //     const pointHtml = this.partition.verse.element[index];
    //     if (element ==pointHtml)
    // }
    setVersePartition(indexZone) {
        this.preset.forEach((e, index) => { this.checkContentText(e, index) });
        // this.searchIdScroll();

        const target = this.partition.verse.element[indexZone];
        console.log(target);
        // myDebug("range", target);
        // const debugT = document.getElementById("myEnd");
        const toScroll = document.querySelector(".dynamic");
        SmoothVerticalScrolling(target, toScroll, 10000, "top")
    };
}
