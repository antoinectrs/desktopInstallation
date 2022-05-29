class MapDebug {
    constructor(myData, statu) {
        this.statut;
        this.myData = myData;
        this.map;
        this.zoom = 2;
        this.origine = {
            lat: 46.53675134341545,
            lng : 6.588325489076967,
        }
        this.pointPath = [];
        this.pointRoadBox = [];
        this.hitBox = [];
        this.route;
        this.inRoute = false;
        this.idRoute = null;
        this.change = false;
        this.distance = 0.02;
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
            const content = [element.lat, element.lng]
            this.pointRoadBox.push(content);
        });
        this.drawHitBox(this.pointRoadBox)
    }
    drawHitBox(array) {
        var polyline = L.polyline(array);
        const data = polyline.encodePath()
        let route = new L.Polyline(array)
        // var distance = this.distance; // Distance in km
        var boxes = L.RouteBoxer.box(route, this.distance);
        boxes.forEach(element => {
            this.hitBox.push(L.rectangle(element, { color: "#ff7800", opacity: 0, weight: 1 }).addTo(this.map));
        });
        // this.listenerArray();
    }
    init(lat=this.origine.lat,lng=this.origine.lng,zoom=20) {
        const token = "pk.eyJ1IjoiYW50b2luZTk4IiwiYSI6ImNrMXVxemtrNzBjbTczaXBhb2I3amJ5YncifQ.EqRwzHSuwtW2sp615mvCAQ";
        this.map = L.map('map', {
            rotate: true,
            touchRotate: false,
				rotateControl: {
					closeOnZeroBearing: false
				},
            bearing: 0,
        }).setView([lat, this.origine.lng], zoom);
        var gl = L.mapboxGL({
            accessToken: token,
            style: 'mapbox://styles/antoine98/cl33nrlno000g14s9v1c2z1ew'
        }).addTo(this.map);
        // L.Rotate.debug(this.map);
        this.convertToPointPath();

        this.layer();
    }
    layer() {
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 19,
            maxNativeZoom: 19,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'pk.eyJ1IjoiYW50b2luZTk4IiwiYSI6ImNsMGprazdncDAxYzYzZWxhbzRlcWk2NDkifQ.JM4Xgke091LLntRvk9UbrA'
        }).addTo(this.map);
        this.control();
    }
    control() {
        this.route = L.Routing.control({
            routeWhileDragging: false,
            createMarker: function () { return null; },
            geocoder: L.Control.Geocoder.nominatim(),
            router: new L.Routing.osrmv1({
                language: "fr",
                profile: 'foot',
            }),
            fitSelectedRoutes: false, //desactivate zoom routing
        }).addTo(this.map);
        this.route.setWaypoints(this.pointPath);
        this.routeListener()
        // route.addEventListener('routeselected', (buffer) => {
        //     this.convertToPointRoadBox(buffer)
        // });
    }
    routeListener() {
        this.route.addEventListener('routeselected', (buffer) => { this.convertToPointRoadBox(buffer) });
    }
    boxTest() {
        // define rectangle geographical bounds
        var bounds = [[ 46.53678, 6.58923], [46.53879, 6.58834]];
        // create an orange rectangle
        // const rectb =L.rectangle(bounds, { color: "red", weight: 1 }).addTo( this.map);

        // zoom the map to the rectangle bounds
        this.map.fitBounds(bounds);
        // this.map.on('click', this.onMapClick);
        this.map.on('locationfound', this.onMapClick);
    }
    onMapClick(e) {
        console.log(e);
    }
    // MOBILE 
    changeOrientation(value) {
        this.map.setBearing(value);
    }
    // listenerArray(array=this.hitBox) {

    // array.forEach((element, index) => {
    //     element.addEventListener("mouseover", e => {
    //         console.log("onsode");
    //         this.idRoute = index;
    //         return this.inRoute=true;
    //     });
    //     element.addEventListener("mouseout", e => {
    //         return this.inRoute=false;;
    //     });
    // });
    // }

}

