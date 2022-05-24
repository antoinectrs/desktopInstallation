// ---------------- MOBILE -----------------    
class MOBILE {
    constructor(myMap, point, noPoint) {
        this.myMap = myMap;
        this.point = point;
        this.noPoint = noPoint;
        this.preset;
        this.myCompass = new myCompass();
        this.listenMyCompass(this.myCompass);
        // this.myPosition();
    }

    checkRoad() {
        navigator.geolocation.watchPosition(pos => this.manager(pos));
    }
    manager(pos) {
        const myLatlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
        const catchCloserPoint = this.closerPoint(myLatlng, 2000); // / console.log(this.myMap.distance*4000);
        if (catchCloserPoint != "tofar")this.renderPoint(catchCloserPoint.index)
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
            if (element.sample.audio.state != "suspended") this.asignPreset(index, boxIndex, element);
        })
        if (this.noPoint.sample.audio.state != "suspended") this.noPoint.sample.render(0, 1);
        // this.idRoute = boxIndex;
    }
    asignPreset(index, boxIndex, element) {
        const target = this.preset[index].volume;
        const scale = Math.round(mapRange(boxIndex, 0, this.myMap.hitBox.length, 0, target.length));
        const preset = target[scale];
        element.sample.render(preset, 1);
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
}
