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
    }

    checkRoad() { this.autorisePlay = true }
    myPosition() {
        navigator.geolocation.watchPosition(pos => {
            if (this.autorisePlay) this.manager(pos);
        })
    }
    manager(pos) {
        if (this.createMap == false) {
            this.myMap.init(pos.coords.latitude, pos.coords.longitude,10);
            this.myMap.boxTest();
            this.myCompass = new myCompass();
            this.listenMyCompass(this.myCompass);
            this.createMap = true;
        }

        this.getAltittude(pos);
        this.centerMap(pos);
        const myLatlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
        const catchCloserPoint = this.closerPoint(myLatlng, this.spaceRadius); // / console.log(this.myMap.distance*4000);
        console.log(catchCloserPoint);
        if (catchCloserPoint != "tofar") {
            this.renderPoint(catchCloserPoint.index);
            // hideBlur(this.mapDom, "remove");
        }
        else {
            this.releasePoint();
            this.myDebug("range", "tofar");
            // hideBlur(this.mapDom, "add");
        }
    }
    getAltittude(pos) {
        // console.log(pos.coords.accuracy);
        const altitude = pos.coords.altitude
        if (altitude) {
            this.myDebug("alt", altitude)
            return altitude;
        }
    }
    centerMap(pos) {
        const convertPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        }
        console.log("new");
        // this.myMap.map.panTo(convertPos);

        // this.myMap.map.setView(convertPos, this.myMap.map.getZoom(), {
        //     "animate": true,
        //     "pan": {
        //         "duration": 10
        //     }
        // });
        this.myMap.map.flyTo(convertPos, 20, {
            animate: true,
            duration: 1.5
    });
    }
    closerPoint(myLatlng, spaceRadius) {
        const hitBoxArray = this.myMap.hitBox.map(element => this.syncDistance(myLatlng, element, 70))
        const closer = Math.min(...hitBoxArray);
        const index = hitBoxArray.indexOf(closer);
        if (closer <= spaceRadius) return { index: index, value: closer };
        return "tofar";
    }
    syncDistance(myPos, box) {
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

        this.myDebug("range", scale);
        element.sample.render(presetVolume, 1);
        element.sample.initSpeed(presetSpeed)
    }

    listenMyCompass(compass) {
        const search = () => {
            setTimeout(() => {
                const orientation = this.myCompass.compassLoad()
                if (orientation != undefined) this.myMap.changeOrientation(orientation);
                requestAnimationFrame(search)
            }, 1000 / 15);
        }
        search();
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
        document.getElementById(target).innerHTML = value;
    }

    //  ----------- DOM --------------------

}
