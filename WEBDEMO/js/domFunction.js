function searchHtml(value) { return document.querySelector(value) };
function searchHtmlArray(value) { return document.querySelectorAll(value) };
function  myDebug(target, value) {
    // searchHtml("#" + target).innerHTML = value;
    document.getElementById(target).innerHTML = value;
}
function hideBlur(value, statut) {
    if (statut == "add") value.classList.add("hideBlur");
    else if (statut == "remove") value.classList.remove("hideBlur")
};
function myRotate(element, value) { element.style = `transform: rotate(${value}deg)` };
function myScroll(element) {
    // var divElement = document.getElementById("div");
    // element.scroll({
    //     top: element.scrollHeight,//scroll to the bottom of the element
    //     behavior: 'smooth' //auto, smooth, initial, inherit
    // });
    element.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" })

}
// function myScrollAnimate(element) { SmoothVerticalScrolling(element, 4000, "top") }
function SmoothVerticalScrolling(e,windowTarget, time, where) {
    var eTop = e.getBoundingClientRect().top;
    var eAmt = eTop / 100;
    var curTime = 0;
    while (curTime <= time) {
        window.setTimeout(SVS_B, curTime, eAmt, where,windowTarget);
        curTime += time / 100;
    }
}
function SVS_B(eAmt, where,windowTarget) {
    if (where == "center" || where == "")
    windowTarget.scrollBy(0, eAmt / 2);
    if (where == "top")
    windowTarget.scrollBy(0, eAmt);
}