var mymap = L.map('map2').setView([51.33918, 12.38105], 12);
      L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=de', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.wikimedia.com/">Wikimedia</a>',
		    id: 'wikimedia.streets'
	     }).addTo(mymap);
var popup = L.popup();

var mymarker = [];
var mymarkerlae = [];
var mymarkerbre = [];
var mymarkerprio = [];
var marker;
var laengengrad;
var breitengrad;
var i=0;

function onMapClick(e) {
  var latilong = e.latlng;
  marker = new L.marker(latilong, {draggable:false});
  marker.bindPopup("<b>Marker "+i+"</b><br>Die "
    +(i+1)+". gesetzte Position.").openPopup();
  mymap.addLayer(marker);
  laengengrad = marker.getLatLng().lng;
  breitengrad = marker.getLatLng().lat;
  mymarker[i] = i;
  mymarkerlae[i] = laengengrad;
  mymarkerbre[i] = breitengrad;
  mymarkerprio[i] = 1;
  document.getElementById("ausgabe").value =
    document.getElementById("ausgabe").value
    +'================================='+'\nMarker:'
    +i+ '\nLängengrad:'+laengengrad+'\nBreitengrad:'
    +breitengrad+'\nPriorität:'+mymarkerprio[1]+'\n';
  document.getElementById("ausgabe").rows =
    document.getElementById("ausgabe").rows + 5;
  i=i+1;
}
mymap.on('click', onMapClick);
