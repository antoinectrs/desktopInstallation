 // ---------------- MOBILE -----------------    
 class MOBILE{
     constructor(myMap){
        this.myMap =myMap ;
        // this.myCompass = new myCompass();
        // this.listenMyCompass(this.myCompass);
        // this.myPosition();
     }
    myPosition() {
        navigator.geolocation.watchPosition(pos => {
            const myLatlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
            // / console.log(this.myMap.distance*4000);
            console.log(this.myMap.hitBox);
            const catchCloserPoint = this.closerPoint(myLatlng, 40);
            if (catchCloserPoint != "tofar") {
                console.log(catchCloserPoint);
            }
        });
    }
    closerPoint(myLatlng, maxDistance) {
        const map1 = this.myMap.hitBox.map(element => this.syncDistance(myLatlng, element, 70))
        const closer = Math.min(...map1);
        if (closer <= maxDistance) {
            return closer;
        }
        return "tofar";
    }
    syncDistance(myPos, box) {
        const centerL = box.getBounds().getCenter();
        return myPos.distanceTo(centerL);
    }
    listenMyCompass(compass) {
        const search = () => {
            setTimeout(() => {
                const orientation = this.myCompass.compassLoad()
                if (orientation != undefined) {
                    this.myMap.changeOrientation(orientation)
                }
                requestAnimationFrame(search)
            }, 1000 / 15);
        }
        search();
    }  
 }
