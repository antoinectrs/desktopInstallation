class APP {
    constructor(statut) {
        this.statut = statut;
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
        this.clickDebug();
        if (this.statut == "mobile") {
            this.mobile()
        }
    }
    // ---------------- MOBILE -----------------    
    mobile() {
        this.myCompass = new myCompass();
        this.listenMyCompass(this.myCompass);
        this.myPosition();
    }
    myPosition() {
        navigator.geolocation.watchPosition(pos => {
            const myLatlng = L.latLng(pos.coords.latitude, pos.coords.longitude);
            // / console.log(this.myMap.distance*4000);
          console.log( this.closerPoint(myLatlng,40));
        });
    }
    closerPoint(myLatlng,maxDistance) {
        const map1= this.myMap.hitBox.map(element => this.syncDistance(myLatlng, element, 70))
        const closer = Math.min(...map1);
        if (closer <= maxDistance) {
                return closer;
            }
        return "to far";
    }
    syncDistance(myPos, box) {
        const centerL = box.getBounds().getCenter();
       return myPos.distanceTo(centerL);
    }
    listenMyCompass(compass) {
        const search = () => {
            setTimeout(() => {
                const orientation = this.myCompass.compassLoad()
                if (orientation != undefined) {
                    this.myMap.changeOrientation(orientation)
                }
                requestAnimationFrame(search)
            }, 1000 / 15);
        }
        search();
    }
    // ---------------- MOBILE -----------------    
    dom(target = "#playTrack", trigger = 'click') {
        document.querySelector(target).addEventListener(trigger, (event) => {
            this.point.forEach((element, index) => {
                element.sample.playSample(0);
                element.sample.initOrientation(this.preset[index].binaural);
            })
            this.noPoint.sample.playSample(0);
            this.noPoint.sample.initOrientation(0);
            this.checkRoad();
        });
    }
    clickDebug(target = "#map", trigger = 'mousemove') {
        document.querySelector(target).addEventListener(trigger, (event) => {
            this.mouseVisualisation(event);
        });
    }
    checkRoad() {
        this.myMap.hitBox.forEach((element, index) => {
            this.checkHitBox(element, index);
        });
    }
    checkHitBox(element, boxIndex) {
        element.addEventListener("mouseover", e => {
            this.renderPoint(element, boxIndex);
        });
        element.addEventListener("mouseout", e => {
            this.releasePoint();
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
    renderPoint(element, boxIndex) {
        this.point.forEach((element, index) => {
            if (element.sample.audio.state != "suspended") {
                this.asignPreset(index, boxIndex, element)
            }
        })
        if (this.noPoint.sample.audio.state != "suspended") { this.noPoint.sample.render(0, 1) }
        this.idRoute = boxIndex;
    }
    releasePoint() {
        if (this.noPoint.sample.audio.state != "suspended") {
            this.noPoint.sample.render(5000, 1)
        }
        this.point.forEach(element => {
            if (element.sample.audio.state != "suspended") element.sample.render(0, 0)
        })
    }
    asignPreset(index, boxIndex, element) {
        const target = this.preset[index].volume;
        const scale = Math.round(mapRange(boxIndex, 0, this.myMap.hitBox.length, 0, target.length));
        const preset = target[scale];
        element.sample.render(preset, 1);
    }
    loadData() {
        fetch('../js/data.JSON')
            .then(response => response.json())
            .then(data => {
                const JSdata = data;
                this.myMap = new MapDebug(JSdata, this.statut);
                this.myMap.init();
                this.myMap.boxTest();
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