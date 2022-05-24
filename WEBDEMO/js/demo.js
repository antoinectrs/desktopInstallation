// ---------------- DESKTOP -----------------    
class DEMO {
    constructor(myMap, point, noPoint) {
        this.myMap = myMap;
        this.point = point;
        this.noPoint = noPoint;
        this.preset;
        this.clickDebug();
    }
    checkRoad() {
        this.myMap.hitBox.forEach((element, index) => this.checkHitBox(element, index));
    }
    checkHitBox(element, boxIndex) {
        element.addEventListener("mouseover", e => this.renderPoint(element, boxIndex));
        element.addEventListener("mouseout", e => this.releasePoint());
    }
    renderPoint(element, boxIndex) {
        this.point.forEach((element, index) => {
            if (element.sample.audio.state != "suspended")
                this.asignPreset(index, boxIndex, element)
        })
        if (this.noPoint.sample.audio.state != "suspended") this.noPoint.sample.render(0, 1);
        // this.idRoute = boxIndex;
    }
    asignPreset(index, boxIndex, element) {
        const target = this.preset[index].volume;
        const scale = Math.round(mapRange(boxIndex, 0, this.myMap.hitBox.length, 0, target.length));
        const preset = target[scale];
        element.sample.render(preset, 1);
    }
    releasePoint() {
        if (this.noPoint.sample.audio.state != "suspended") this.noPoint.sample.render(5000, 1);
        this.point.forEach(element => {
            if (element.sample.audio.state != "suspended") element.sample.render(0, 0)
        })
    }
    clickDebug(target = "#map", trigger = 'mousemove') {
        document.querySelector(target).addEventListener(trigger, (event) => this.mouseVisualisation(event));
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