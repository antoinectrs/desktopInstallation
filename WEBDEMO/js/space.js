
class Space {
    constructor(id) {
        // this.currentPosition = {
        //     lat: null, lng: null,
        // }
        // console.log(PARAMS.bubble[id][0].lat);
        this.destination = {
            lat: PARAMS.bubble[id][0].lat, lng: PARAMS.bubble[id][0].lng,
        }
        this.orientation = null;
        this.offset = 0;
        this.thresold = 0.01;
    }
    compassReady(currentPosition) {
        console.log(compass.position.coords.latitude);
        currentPosition = { lat: compass.position.coords.latitude, lng: compass.position.coords.longitude };
        this.orientation = {
            deg: compass.getBearingToDestination(currentPosition, { lat: this.destination.lat, lng: this.destination.lng }),
            // offset: calcCrow(currentPosition.lat, currentPosition.lng, lat1, lng1)
        }
        return {
            audio: this.convertToBinau(this.orientation.deg),
            graphic: this.orientation.deg,
        }
        // return this.orientation;
    }
    calcOff(lat1, lon1, init, globalObject, lat2 = this.destination.lat, lon2 = this.destination.lng) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1 / 180;
            var radlat2 = Math.PI * lat2 / 180;
            var theta = lon1 - lon2;
            var radtheta = Math.PI * theta / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            if (init == false) {
                this.msg(dist, globalObject)
            }
            else { this.offset = dist };
            return dist;
        }
    }
    convertToBinau(result, output) {
        if (result >= 180) {
            output = mapRange(result, 360, 180, 0, 180);
        } else {
            output = (-result);
        }
        return output;
    }
    asignColor(statut) {
        let checkColor
        switch (statut) {
            case 'parc':
                checkColor = "green";
                break;
            case 'work':
                checkColor = "red";
                break;
            case 'lac':
                checkColor = "blue";
                break;
            default:
                console.log("bug");
        }
        return checkColor;
    }
    // calcCrow(lat1, lon1, lat2, lon2) {
    //     if ((lat1 == lat2) && (lon1 == lon2)) {
    //         return 0;
    //     }
    //     else {
    //         var radlat1 = Math.PI * lat1 / 180;
    //         var radlat2 = Math.PI * lat2 / 180;
    //         var theta = lon1 - lon2;
    //         var radtheta = Math.PI * theta / 180;
    //         var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    //         if (dist > 1) {
    //             dist = 1;
    //         }
    //         dist = Math.acos(dist);
    //         dist = dist * 180 / Math.PI;
    //         dist = dist * 60 * 1.1515;


    //         return dist;
    //     }
    // }
    softValue(newValue, globalObject, oldValue, index = 0) {
        return new Promise(resolve => {
            const draw = () => {
               let graphicTarget = globalObject.graphic;
                if (index >= 0.99) {
                    graphicTarget.convertToCanvas(newValue)
                    // graphicTarget = newValue;
                    resolve("the new value " + newValue)
                } else {
                    index += this.thresold;
                    const lerpResult= myLerp(oldValue, newValue, index);
                    graphicTarget.convertToCanvas(lerpResult)
                    requestAnimationFrame(() => draw());
                }
                // console.log(graphicTarget.distanceMap);
            }
            draw()
        });
    }
    async msg(newValue, globalObject, oldValue = this.offset) {
        // const msg = await this.softValue(oldValue, newValue, globalObject);
        const msg = await this.softValue(newValue, globalObject, oldValue);
        console.log('Message:', msg);
    }
}