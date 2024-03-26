// Initialize the map
var map = L.map('map').setView([43.2551, 76.9126], 7);

// Add tile layer for the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// almaty coordinates
var almaty = L.latLng(43.2551, 76.9126);

        
L.tileLayer('//https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
}).addTo(map);


let azimuthButton = document.getElementById("azimuthButton");
let pvoGridButton = document.getElementById("pvoGrid");
        
// функция для наложения азимута
let azimuthElements = []; // Хранение нарисованных объектов 




function drawAzimuth() {
    if (azimuthElements.length === 0 ) {
        // Рисование кругов, если их еще нет на карте
        for (let i = 10; i <= 390; i += 10) {
            let rad = i * 1000;
            let circle = L.circle(almaty, {
                color: 'gray',
                fillOpacity: 0,
                radius: rad,
                weight: 0.5
            }).addTo(map);
            azimuthElements.push(circle);
        }
        for (let i = 100; i <= 400; i += 100) {
            let rad = i * 1000;
            let circle = L.circle(almaty, {
                color: 'red',
                fillOpacity: 0,
                radius: rad,
                weight: 0.7
            }).addTo(map);
            azimuthElements.push(circle);
        }
        for (let i = 50; i < 400; i += 50) {
            let rad = i * 1000;
            let circle = L.circle(almaty, {
                color: 'green',
                fillOpacity: 0,
                radius: rad,
                weight: 0.7
            }).addTo(map);
            azimuthElements.push(circle);
        }

        // Рисование радиусных линий
        var numberOfLines = 360 / 10; // Количество линий
        var radius = 400000; // Радиус в метрах
        
        for (var i = 0; i < numberOfLines; i++) {
            var angle = 10 * i; // Угол в градусах
            var destinationLat = almaty.lat + (radius / 111300) * Math.cos(angle * Math.PI / 180);
            var destinationLng = almaty.lng + (radius / (111300 * Math.cos(almaty.lat * Math.PI / 180))) * Math.sin(angle * Math.PI / 180);
            let line = L.polyline([almaty, [destinationLat, destinationLng]], { color: 'gray', weight: 1 }).addTo(map); // Рисование линии
            azimuthElements.push(line); // Добавление линии в массив нарисованных линий
            
            // Разметка градусов азимута
            L.marker([destinationLat, destinationLng], {
                icon: L.divIcon({
                    className: 'label',
                    html: angle.toString(),
                    iconSize: [10, 10],
                })
            }).addTo(map);
            
           
            
        }
    } else {
        // Удаление уже нарисованных объектов (кругов и линий)
        azimuthElements.forEach(circle => map.removeLayer(circle));
        azimuthElements.forEach(line => map.removeLayer(line));
      
        azimuthElements = []; // Очистка массива нарисованных кругов
        
    }
}

// Обработчик события для кнопки
document.getElementById('azimuthButton').addEventListener('click', drawAzimuth);



        
        

// разметка для аэропортов
function aerMarker(lon, lat){
    L.circleMarker([lon, lat],{
        radius:5,
        color: 'red'
    }).addTo(map);
}

//разметка для самолетов
function planeMarker(lon, lat){
    L.circleMarker([lon, lat],{
        radius:3,
        color: 'red',
        fillOpacity: 'black'
    }).addTo(map);
}
    
aerMarker(45.118115, 78.445129);
aerMarker(43.354642, 77.041626);
aerMarker(43.158987, 76.634617);
        

        
// функция для показывающая координаты нажатого места
function onMapClick(e) {
    alert("Вы нажали на точке с координатами: " + e.latlng);
}
map.on('click', onMapClick);
   

let lon;
let lat;
let marker;

// Kazakhstan
let lat_min = 41.48;
let lon_min = 46.97;
let lat_max = 55.00;
let lon_max = 86.57;


const url = 'https://adsbexchange-com1.p.rapidapi.com/v2/lat/43.2551/lon/76.9126/dist/250/';
const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'ce9625f99bmshf7fc053e2a5bb90p131d82jsn3050022c3604',
        'X-RapidAPI-Host': 'adsbexchange-com1.p.rapidapi.com'
    }
};

// функция для обработки API
async function fetchFlightData() {
    
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        
        const data = JSON.parse(result);
        

        if(data.ac){
            data.ac.forEach(plane => {
                const latitude = plane.lat;
                const longitude = plane.lon;
                console.log(latitude, "     ", longitude)
                
                
            })
        }
        //console.log(data);
        
        
    } catch (error) {
        console.error(error);
    } 

}


fetchFlightData();




