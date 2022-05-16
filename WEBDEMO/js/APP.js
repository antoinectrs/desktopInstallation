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
        this.initPoint(this.musicList)
        this.dom();
        this.clickDebug();
      
    }
    dom(target = "button", trigger = 'click') {
        document.querySelector(target).addEventListener(trigger, (event) => {
            this.point.forEach(element => { element.sample.playSample(0) })
        });
        //CHANGE O after
    }
    clickDebug(target = "#map", trigger = 'click') {
        document.querySelector(target).addEventListener(trigger, (event) => {
            if(this.myMap.inRoute==true){
                this.point.forEach(element => { element.sample.filterValue() })
            }
            this.mouseVisualisation(event);
        });
    }
    initPoint(musicList) {
        this.point = musicList.map(function (music) {
            return { "sample": new Sample(music) }// "graphic": new Circle(),// "space": new Space(2),
        });
        // this.loadTrack(this.point.sample);
        console.log(this.point[0]);
        this.point.forEach(element => {
            element.sample.requestTrack()
        });
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
    mouseVisualisation(event){
        const target = document.querySelector("#canvas .circle");
        target.style.left = event.pageX+"px";
        target.style.top = event.pageY+"px";
            // console.log(target.style.left);

    }
}