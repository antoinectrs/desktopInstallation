class APP {
    constructor(statut) {
        this.statut = statut;
        this.mobile, this.demo = null;
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
                console.log("inside");
                element.sample.playSample(0);
                element.sample.initOrientation(this.preset[index].binaural);
            })
            this.noPoint.sample.playSample(0);
            this.noPoint.sample.initOrientation(0);
            // this.checkRoad();
            this.demo.checkRoad()
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
        fetch('./js/data.JSON')
            .then(response => response.json())
            .then(data => {
                const JSdata = data;
                this.myMap = new MapDebug(JSdata, this.statut);
                this.myMap.init();
                this.myMap.boxTest();
                this.chooseStatut(this.statut)
            })
            .catch(error => console.log(error));
    }
    loadPreset() {
        fetch('./js/presets.JSON')
            .then(response => response.json())
            .then(data => {
                this.preset = data.tracks;
                this.demo.preset=this.preset;

            })
            .catch(error => console.log(error));
    }
    chooseStatut(statut){
        if (statut == "mobile") {
            this.mobile = new MOBILE(this.myMap);
        }else{
            console.log(this.myMap);
            this.demo = new DEMO(this.myMap,this.point,this.noPoint); 
        }
    }
  
}