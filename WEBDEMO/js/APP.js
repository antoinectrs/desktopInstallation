class APP {
    constructor(statut) {
        this.statut = statut;
        console.log("vous êtes sur " + this.statut);
        this.myMap;
        this.point = [];
        this.musicList = ["lead", "organ", "perc"];
        this.preset;
        this.setUp();
    }
    setUp() {
        this.loadData();
        this.loadPreset();
        this.initPoint(this.musicList, this.preset)
        this.dom();
        this.clickDebug();
        if (this.statut == "mobile") {
            this.myCompass = new myCompass();
            this.listenMyCompass(this.myCompass);
        }
    }
    listenMyCompass(compass) {
        const search = () => {
            setTimeout(() => {
                // console.log(this.myCompass.permissionGranted );
                // if(this.myCompass.permissionGranted == true){
                    console.log(  this.myCompass.compassLoad());
                // }
                requestAnimationFrame(search)
            }, 1000 / 15);
        }
        search();
    }
    dom(target = "#playTrack", trigger = 'click') {
        document.querySelector(target).addEventListener(trigger, (event) => {
            this.point.forEach((element, index) => {
                element.sample.playSample(0);
                element.sample.initOrientation(this.preset[index].binaural);
            })
            this.checkRoad();
        });
    }
    clickDebug(target = "#map", trigger = 'mousemove') {
        document.querySelector(target).addEventListener(trigger, (event) => {
            this.mouseVisualisation(event);
        });
    }
    checkRoad(myMap = this.myMap) {
        myMap.hitBox.forEach((element, index) => {
            const boxIndex = index;
            element.addEventListener("mouseover", e => {
                //MAP

                //SOUND
                this.point.forEach((element, index) => {
                    if (element.sample.audio.state != "suspended") {
                        const target = this.preset[index].volume;
                        const scale = Math.round(mapRange(boxIndex, 0, myMap.hitBox.length, 0, target.length));
                        const preset = target[scale]
                        // console.log(preset);
                        element.sample.render(preset, 1);
                    }
                }
                )
                this.idRoute = index;
            });
            element.addEventListener("mouseout", e => {
                this.point.forEach(element => { if (element.sample.audio.state != "suspended") element.sample.render(0, 0) })
            });
        });
    }

    initPoint(musicList, preset) {
        this.point = musicList.map(function (music, preset) {
            return { "sample": new Sample(music) }// "graphic": new Circle(),// "space": new Space(2),
        });
        // this.loadTrack(this.point.sample);
        this.point.forEach(element => {
            element.sample.requestTrack()
        });

    }
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