class APP {
    constructor(statut) {
        this.statut = statut;
        // this.mobile,
        this.demo = null;
        console.log("vous êtes sur " + this.statut);
        this.myMap;
        this.point = [];
        this.musicList = ["01", "02", "03", "04"];
        this.noise = "wait";
        this.noPoint;
        this.preset;
        this.setUp();
    }
    setUp() {
        this.loadData();
        this.loadPreset();
        this.initPoint(this.musicList, this.preset)
        this.dom();
    }
    dom(target = "#playTrack", trigger = 'click') {
        document.querySelector(target).addEventListener(trigger, (event) => {
            this.point.forEach((element, index) => {
                element.sample.playSample(0);
                element.sample.initOrientation(this.preset[index].binaural);
            })
            this.noPoint.sample.playSample(0);
            this.noPoint.sample.initOrientation(0);
            this.demo.preset = this.preset;
            this.demo.checkRoad();
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
        this.noPoint = { "sample": new Sample(this.noise) };
        this.noPoint.sample.requestTrack();
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