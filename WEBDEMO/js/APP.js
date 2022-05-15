window.onload = function () {
    // ---------- LOAD SOUND ----------

    // --------- /LOAD SOUND ----------

    // ---------- LOAD POSI ----------

    // ---------- LOAD MAP ----------
    // const data = loadJSON("js/data.JSON");

    fetch('../js/data.JSON')
        .then(response => response.json())
        .then(data =>{
            const JSdata= data;
            const myMap = new MapDebug(JSdata);
            myMap.init();
        })
        .catch(error => console.log(error));
    // initMap
    // myMap = initMap(pos);
    // PARAMS.points.forEach(function (element) {
    //     // element.space.calcOffset(pos.coords.latitude, pos.coords.longitude)
    //     const space = element.space.calcOff(pos.coords.latitude, pos.coords.longitude,false,element);   
    //     element.graphic.convertToCanvas(space);
    // })
    // addPin(element[0], myMap)


    // --------- /LOAD MAP ----------

    // ---------- DOM ----------

    // --------- /DOM ----------

}
