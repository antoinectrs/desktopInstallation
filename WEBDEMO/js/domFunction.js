function searchHtml(value) { return document.querySelector(value) };
function searchHtmlArray(value) { return document.querySelectorAll(value) };
function hideBlur(value, statut) {
    if (statut == "add") value.classList.add("hideBlur");
    else if (statut == "remove") value.classList.remove("hideBlur")
};
function myRotate(element, value) { element.style = `transform: rotate(${value}deg)` }