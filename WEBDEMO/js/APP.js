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
        this.initPoint(this.musicList, this.preset)
        this.dom();
        this.clickDebug();
    }
    dom(target = "button", trigger = 'click') {
        document.querySelector(target).addEventListener(trigger, (event) => {
            this.point.forEach(element => { element.sample.playSample(0) })
            this.checkRoad();
        });
        //CHANGE O after
    }
    clickDebug(target = "#map", trigger = 'mousemove') {
        document.querySelector(target).addEventListener(trigger, (event) => {

            this.mouseVisualisation(event);
        });
    }
    checkRoad(myMap = this.myMap) {
        // if (this.myMap.inRoute == true) {
        //     this.point.forEach(element => {
        //         if(element.sample.audio.state!="suspended")element.sample.render(1000);
        //     })
        // } else if(this.myMap.inRoute == false) {
        //     this.point.forEach(element => {
        //         console.log(element.sample.audio.state);
        //         if(element.sample.audio.state!="suspended" && element.sample.audio.actual!=0)element.sample.render(0);
        //     })
        // 
        // console.log(myMap);
        // const mapExport = myMap;
        myMap.hitBox.forEach((element, index, myMap) => {
            element.addEventListener("mouseover", e => {
                // console.log(mapExport);
                this.point.forEach(element => {
                    if (element.sample.audio.state != "suspended") element.sample.render(1000);
                })
                // if(mapExport.sample.audio.state!="suspended")mapExport.sample.render(1000);
                this.idRoute = index;
                return this.inRoute = true;
            });
            element.addEventListener("mouseout", e => {
                this.point.forEach(element => {
                    if (element.sample.audio.state != "suspended") element.sample.render(0);
                })
                return this.inRoute = false;
            });
        });
    }

    initPoint(musicList, preset) {
        console.log(preset);
        this.point = musicList.map(function (music, preset) {
            return { "sample": new Sample(music) }// "graphic": new Circle(),// "space": new Space(2),
        });
        // this.loadTrack(this.point.sample);
        this.point.forEach(element => {
            element.sample.requestTrack()
        });
        console.log(this.preset);
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
                // this.checkRoad();
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