// ---------------- MOBILE -----------------    
class MOBILE {
    constructor(myMap, point, noPoint) {
        this.myMap = myMap;
        this.point = point;
        this.noPoint = noPoint;
        this.preset;
        this.myCompass = new myCompass();
        this.listenMyCompass(this.myCompass);
        this.myPosition();
        this.autorisePlay = false;
        this.myConsole();
        this.spaceRadius = 40;
    }

    checkRoad() { this.autorisePlay = true }
    myPosition() {
        console.log("inside");
        navigator.geolocation.watchPosition(pos => {
            if (this.autorisePlay) this.manager(pos);
        })
    }
    manager(pos) {
        this.getAltittude(pos);
        this.centerMap(pos);
        const myLatlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
        const catchCloserPoint = this.closerPoint(myLatlng, this.spaceRadius); // / console.log(this.myMap.distance*4000);
        console.log(catchCloserPoint);
        if (catchCloserPoint != "tofar") { this.renderPoint(catchCloserPoint.index) }
        else {
            this.releasePoint();
            this.myDebug("range", "tofar")
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
        console.log( this.myMap.map);
        this.myMap.map.panTo(convertPos);
    }
    closerPoint(myLatlng, maxDistance) {
        const hitBoxArray = this.myMap.hitBox.map(element => this.syncDistance(myLatlng, element, 70))
        const closer = Math.min(...hitBoxArray);
        const index = hitBoxArray.indexOf(closer);
        if (closer <= maxDistance) return { index: index, value: closer };
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
}
