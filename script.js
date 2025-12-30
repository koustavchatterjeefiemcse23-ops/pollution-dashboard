// 🔹 Paste your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyBpfxiXNVdEDRd05-drvGUxrWfNI6zg6yQ",
  authDomain: "pollutiondashboard.firebaseapp.com",
  databaseURL: "https://pollutiondashboard-default-rtdb.firebaseio.com",
  projectId: "pollutiondashboard",
  storageBucket: "pollutiondashboard.firebasestorage.app",
  messagingSenderId: "98742738162",
  appId: "1:98742738162:web:8c2f6a75a74160eaafc46b",
  measurementId: "G-EEDGPLGRLM"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// Create map
var map = L.map('map').setView([22.5726, 88.3639], 12);

// Add OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Read pollution data
database.ref("locations").on("value", function(snapshot) {
  snapshot.forEach(function(child) {
    var data = child.val();
    addMarker(data);
  });
});

// Add colored marker
function addMarker(data) {
  let color = "green";
  if (data.aqi > 100) color = "red";
  else if (data.aqi > 50) color = "orange";

  var marker = L.circleMarker([data.lat, data.lng], {
    color: color,
    radius: 10,
    fillOpacity: 0.8
  }).addTo(map);

  marker.bindPopup("AQI: " + data.aqi);
}
