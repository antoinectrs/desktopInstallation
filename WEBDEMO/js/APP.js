class APP {
    constructor() {
        this.myMap;
        this.point = [];
        this.musicList = ["deepS"];
        this.preset;
        this.setUp();
    }
    setUp() {
        this.loadData();
        this.loadPreset();
        this.initPoint(this.musicList,this.preset)
        this.dom();
        this.clickDebug();

    }
    dom(target = "button", trigger = 'click') {
        document.querySelector(target).addEventListener(trigger, (event) => {
            this.point.forEach(element => { element.sample.playSample(0) })
        });
        //CHANGE O after
    }
    clickDebug(target = "#map", trigger = 'mousemove') {
        document.querySelector(target).addEventListener(trigger, (event) => {
            if (this.myMap.inRoute == true) {
                this.point.forEach(element => {
                    if(element.sample.audio.state!="suspended")
                    render(element.sample, 40, 1000, 0.002);
                })
            } else if(this.myMap.inRoute == false) {
                // console.log("Inside");
                this.point.forEach(element => {
                    console.log(element.sample.audio.state);
                    if(element.sample.audio.state!="suspended")
                    render(element.sample, 1000, 40, 0.002);
                })
            }
            this.mouseVisualisation(event);
        });
    }
    initPoint(musicList,preset) {
        console.log(preset);
        this.point = musicList.map(function (music,preset) {
            return { "sample": new Sample(music) }// "graphic": new Circle(),// "space": new Space(2),
        });
        // this.loadTrack(this.point.sample);
        this.point.forEach(element => {
            element.sample.requestTrack()
        });
        console.log(        this.preset);
        // PARAMS.points[1].sample.playSample(maxIs(mapArray(PARAMS.points))) 
    }
    // loadTrack() {

    // PARAMS.points.forEach((point) => {
    //     point.sample.requestTrack();
    // });
    // }
    loadData() {
        fetch('../js/data.JSON')
            .then(response => response.json())
            .then(data => {
                const JSdata = data;
                this.myMap = new MapDebug(JSdata);
                this.myMap.init();
            })
            .catch(error => console.log(error));
    }
    loadPreset() {
        fetch('../js/presets.JSON')
            .then(response => response.json())
            .then(data => {
                this.preset = data.tracks;
            })
            .catch(error => console.log(error));
    }
    mouseVisualisation(event) {
        const target = document.querySelector("#canvas .circle");
        target.style.left = event.pageX + "px";
        target.style.top = event.pageY + "px";
        // requestAnimationFrame(() => this.myMove(target, event));
    }
    myMove(target, event, mouseLerpX, mouseLerpY) {
        // myLerp(event.x,)
        // console.log(target.style.left);
        mouseLerpX = myLerp(parseInt(target.style.left, 10), event.x, 0.01);
        mouseLerpY = myLerp(parseInt(target.style.top, 10), event.y, 0.01);
        target.style.left = mouseLerpX + "px";
        target.style.top = mouseLerpY + "px";
        // console.log(mouseLerpX);
        // target.y = lerp(circle.y, mouseY, 0.1);
        // circle.update()
        // requestAnimationFrame(() => this.myMove(target, event));
    }
}