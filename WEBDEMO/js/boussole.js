class myCompass {
    constructor() {
        this.myCompass = new Compass();
        this.method = null;
        this.myCompass.init(function (method) {
            console.log('Compass heading by ' + method);
        });
        this.waitCompass();
        //   this.myCompass.watch(function (heading) {
        //     console.log(heading);
        //     });
    }
    compassLoad() {

    }
    waitCompass() {
        // const draw = () => {
        //     console.log(this.myCompass.permissionGranted);
        //     if (this.myCompass.permissionGranted == true)
        //         return this.compassLoad()
        //     requestAnimationFrame(() => draw());
        // }
        // draw()
        const draw = () => {
            setTimeout(function () {
                console.log("inside");
                requestAnimationFrame(draw);

                // ... Code for Drawing the Frame ...

            }, 1000 / 2);
        }
        draw();
    }
    // });
    // drawMyCompass(buffer){
    // if (buffer.position !== null && buffer.orientation !== null) {
    //   console.log(buffer.getBearingToNorth());
    // const northD =compass.getBearingToNorth();
    //   changeOrientation (PARAMS.map, compass.getBearingToNorth())
    //   PARAMS.points.forEach((event) => {
    //     if (event.sample.binauralFIRNode != null) {
    //       const orResult = event.space.compassReady();
    //       event.sample.binauralFIRNode.setPosition(orResult.audio, 0, 1);
    //       event.graphic.drawInCompass(orResult.graphic, "parc");
    //     }
    //   });
    // }
    // window.requestAnimationFrame(function () {
    //     drawMyCompass(buffer);
    // });
    // }
}