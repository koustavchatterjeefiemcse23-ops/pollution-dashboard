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

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Store markers to avoid duplicates
let markers = [];

// Read pollution data
database.ref("locations").on("value", function(snapshot) {

  // Remove old markers
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  snapshot.forEach(function(child) {
    var data = child.val();
    var marker = addMarker(data);
    markers.push(marker);
  });
});

// Add colored marker based on AQI
function addMarker(data) {
  let color = "green";
  let level = "Good";

  if (data.aqi > 150) {
    color = "red";
    level = "Danger";
  } else if (data.aqi > 100) {
    color = "orange";
    level = "Poor";
  } else if (data.aqi > 50) {
    color = "yellow";
    level = "Moderate";
  }

  return L.circleMarker([data.lat, data.lng], {
    color: color,
    radius: 10,
    fillOpacity: 0.8
  }).addTo(map)
    .bindPopup(
      "<b>AQI:</b> " + data.aqi +
      "<br><b>Status:</b> " + level
    );
}