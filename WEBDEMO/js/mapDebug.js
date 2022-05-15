class MapDebug {
    constructor(myData) {
        this.myData = myData;
        this.map;
        this.zoom = 25;
        this.origine = {
            lat: 46.53675134341545,
            lng: 6.588325489076967,
        }
        this.pointPath = [];
        this.pointRoadBox = [];
        this.hitBox= [];
        // 
    }
    convertToPointPath() {
        this.myData.point.forEach(element => {
            this.pointPath.push(element.position);
        });
    }
    convertToPointRoadBox(e) {
       var routing = e.route.coordinates;
       routing.forEach(element => {
            const content = [element.lat,element.lng]
            this.pointRoadBox.push(content);
        });
        this.drawHitBox(this.pointRoadBox)
    }
    drawHitBox(array){
        var polyline = L.polyline( array);
        const data = polyline.encodePath()
        let route = new L.Polyline(array)
        var distance = 0.01; // Distance in km
        var boxes = L.RouteBoxer.box(route, distance);
        boxes.forEach(element => {
           this.hitBox.push(L.rectangle(element, { color: "#ff7800",opacity:0, weight: 1 }).addTo(this.map));
        });
        this.listenerArray(  this.hitBox);
    }
    init() {
        const token = "pk.eyJ1IjoiYW50b2luZTk4IiwiYSI6ImNrMXVxemtrNzBjbTczaXBhb2I3amJ5YncifQ.EqRwzHSuwtW2sp615mvCAQ";
        this.map = L.map('map', {
            rotate: true,
            // bearing: 00,
        }).setView([this.origine.lat, this.origine.lng], this.zoom);
        var gl = L.mapboxGL({
            accessToken: token,
            style: 'mapbox://styles/antoine98/cl33nrlno000g14s9v1c2z1ew'
        }).addTo(this.map);
        this.convertToPointPath();
       
        this.layer();
    }
    layer() {
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 20,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiYW50b2luZTk4IiwiYSI6ImNsMGprazdncDAxYzYzZWxhbzRlcWk2NDkifQ.JM4Xgke091LLntRvk9UbrA'
        }).addTo(this.map);
        this.control();
    }
    control() {
        let route = L.Routing.control({
            routeWhileDragging: false,
            // createMarker: function() { return null; },
            geocoder: L.Control.Geocoder.nominatim(),
            router: new L.Routing.osrmv1({
                language: "fr",
                profile: 'foot',
            })
        }).addTo(this.map);
        route.setWaypoints(this.pointPath);
       
        route.addEventListener('routeselected', (buffer) => {
            this.convertToPointRoadBox(buffer)
        }
            );
    }
    routerBox() {
        // var test = [
        //     [50.5, 30.5],
        //     [50.4, 30.6],
        //     [50.3, 30.7]
        // ];
        // var distance = 10; // Distance in km
        console.log(this.pointPath);
        // console.log(L.RouteBoxer.box(test, 10));
        var polyline = L.polyline( this.pointRoadBox);
        const data = polyline.encodePath()
        let route = new L.Polyline(this.pointRoadBox)
        var distance = 0.01; // Distance in km
        var boxes = L.RouteBoxer.box(route, distance);
        
    }
    listenerArray(array){
        // array.forEach(element => {
            // console.log(i);
            // element.addEventListener("mousemove",e => {
            //     // console.log(event);
            //     console.log(e);
            // });
        // });
         array.forEach((element,index) => {
            // console.log(index);
            element.addEventListener("mousemove",e => {
                // console.log(event);
                console.log(index);
            });
        });
    }
    
}


function initMap(pos, lat, lon, zoom = 25) {
    lat = pos.coords.latitude
    lon = pos.coords.longitude
    console.log(pos);
    PARAMS.map = L.map('map', {
        rotate: true,
        // bearing: 00,
    }).setView([lat, lon], zoom);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 20,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYW50b2luZTk4IiwiYSI6ImNsMGprazdncDAxYzYzZWxhbzRlcWk2NDkifQ.JM4Xgke091LLntRvk9UbrA'
    }).addTo(PARAMS.map);
    L.Routing.control({
        waypoints: [
            L.latLng(lat, lon),
            L.latLng(46.53720503291841, 6.591123563606234)
        ],
        addWaypoints: false,
        routeWhileDragging: false,
        // geocoder: L.Control.Geocoder.nominatim()
    }).addTo(PARAMS.map);



    return PARAMS.map
}
function changeOrientation(myMap, value) {
    myMap.setBearing(value);
}
function panMap(pos, myMap, lat, lon) {
    lat = pos.coords.latitude
    lon = pos.coords.longitude
    myMap.panTo(new L.LatLng(lat, lon));


    document.getElementById("location").innerHTML = "lat : " + lat;
}
function error(err) {
    console.warn(`ANTOINE --- ERREUR (${err.code}): ${err.message}`);
}


//  -------------- INTERCTION ---------------
function initInteractionMap(map) {
    map.on('click', posClic => {
        addPin(posClic.latlng, map);
        createData(posClic.latlng);
    })
}
function addPin(coords, map) {
    L.marker(coords).addTo(map);
}
function createData(coords) {
    const bubbleElement = {
        type: "parc",
        instrument: "bass",
        coords: coords,
    }
    PARAMS.bubble.push(bubbleElement)
    console.log(PARAMS.bubble);
}
//  ------------- /INTERCTION ---------------


// const tempData = [
//     [
//         0 = {
//             coords: { lat: 46.537546230038906, lng: 6.587952153640801 },
//             instrument: "bass",
//             type: "parc",
//         }
//     ],
//     [
//         1 = {
//             coords: { lat: 46.53702186676876, lng: 6.587911920505576 },
//             instrument: "bass",
//             type: "parc",
//         }
//     ],
//     [
//         2 = {
//             coords: { lat: 46.53676337596946, lng: 6.588831918197684 },
//             instrument: "bass",
//             type: "parc",
//         }
//     ],
// ]
