class APP {
    constructor(statut) {
        this.startListening = false;
        this.statut = statut;
        // this.mobile,
        this.demo = null;
        console.log("vous êtes sur " + this.statut);
        this.myMap;
        this.point = [];

        this.musicList = ["01", "02", "03", "04"];
        this.noise = "wait";
        this.vocalList = ["lechemin", "quidescend", "enface", "quimonte"];
        this.noPoint;
        this.vocalPoint;
        this.preset;
        this.setUp();
    }
    setUp() {
        this.loadData();
        this.loadPreset();
        this.initPoint(this.musicList, this.preset);
        this.dom();
    }
    dom(target = "#playTrack", trigger = 'click') {
        document.querySelector(target).addEventListener(trigger, (event) => {
            if (this.startListening == false) this.activeApp()
        });
    }
    activeApp() {
        this.vocalPoint.forEach((element, index) => {
            element.sample.playSample(0);
        });
        this.point.forEach((element, index) => {
            element.sample.playSample(0);
            element.sample.initOrientation(this.preset[index].binaural);
        });
        this.noPoint.sample.playSample(0);
        this.noPoint.sample.initOrientation(0);
        this.demo.preset = this.preset;
        this.demo.checkRoad();
        return this.startListening = true;
    }
    initPoint(musicList, preset) {
        this.point = musicList.map(function (music, preset) {
            return { "sample": new Sample(music, true) }// "graphic": new Circle(),// "space": new Space(2),
        });
        // this.loadTrack(this.point.sample);
        this.point.forEach(element => {
            element.sample.requestTrack()
        });
        this.noPoint = { "sample": new Sample(this.noise, true) };
        this.noPoint.sample.requestTrack();
        if (this.statut == "mobile") this.initVocals();
    }
    initVocals() {
        setTimeout(() => {
            this.vocalPoint = this.preset[0].voice.map(e => {
                return { "sample": new Sample(e.content, false) }
            })
            this.vocalPoint.forEach(element => {
                element.sample.requestTrack()
            });
            this.demo.vocalPoint = this.vocalPoint;
            console.log(this.vocalPoint);
        }, 500);
    }
    loadData() {
        fetch('./DATA/data.JSON')
            // fetch('./DATA/prelaz.JSON')
            .then(response => response.json())
            .then(data => {
                const JSdata = data;
                this.myMap = new MapDebug(JSdata, this.statut);

                this.newStatut(this.statut)
            })
            .catch(error => console.log(error));
    }
    loadPreset() {
        fetch('./DATA/presets.JSON')
            .then(response => response.json())
            .then(data => {
                this.preset = data.tracks;
            })
            .catch(error => console.log(error));
    }
    newStatut(statut) {
        if (statut == "mobile") {
            // this.myMap.init();
            // this.myMap.boxTest();
            this.demo = new MOBILE(this.myMap, this.point, this.noPoint);
        } else {
            console.log(this.myMap);
            this.myMap.init();
            this.myMap.boxTest();
            this.demo = new DEMO(this.myMap, this.point, this.noPoint);
        }
    }

}