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
        this.hitBox = [];
        this.route;
        this.inRoute = false;
        this.idRoute = null;
        this.change=false;
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
        var distance = 0.01; // Distance in km
        var boxes = L.RouteBoxer.box(route, distance);
        boxes.forEach(element => {
            this.hitBox.push(L.rectangle(element, { color: "#ff7800", opacity: 0, weight: 1 }).addTo(this.map));
        });
        this.listenerArray();
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
       this.route = L.Routing.control({
            routeWhileDragging: false,
            // createMarker: function() { return null; },
            geocoder: L.Control.Geocoder.nominatim(),
            router: new L.Routing.osrmv1({
                language: "fr",
                profile: 'foot',
            })
        }).addTo(this.map);
        this.route.setWaypoints(this.pointPath);
        this.routeListener()
        // route.addEventListener('routeselected', (buffer) => {
        //     this.convertToPointRoadBox(buffer)
        // });
    }
    routeListener() {
            this.route.addEventListener('routeselected', (buffer) => {this.convertToPointRoadBox(buffer)});
    }
    listenerArray(array=this.hitBox) {
        array.forEach((element, index) => {
            element.addEventListener("mouseover", e => {
                this.idRoute = index;
                this.change =  !this.change;
                console.log(this.change);
                return this.inRoute=true;
            });
            element.addEventListener("mouseout", e => {
                return this.inRoute=false;;
            });
        });
    }

}

