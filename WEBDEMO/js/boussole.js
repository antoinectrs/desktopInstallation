class myCompass {
    constructor() {
        this.myCompass = new Compass();
        this.myCompass.init(function (method) {
            // console.log('Compass heading by ' + method);
        });
    }
    compassLoad() {
        if (this.myCompass.permissionGranted)
            return this.myCompass.getBearingToNorth();
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