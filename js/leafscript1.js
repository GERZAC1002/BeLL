var mymap = L.map('map2').setView([51.33918, 12.38105], 12);
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?lang=de', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
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
var markers = [];

function marker_aktualisieren(){
  var selected_marker = document.getElementById("eingabe_marker_number").value;
  mymarkerprio[selected_marker] = document.getElementById("eingabe_marker_prio").value;
  document.getElementById("ausgabe").value = document.getElementById("ausgabe").value
    +'================================='+'\nMarker:'
    +selected_marker+ '\nLängengrad:'+mymarkerlae[selected_marker]+'\nBreitengrad:'
    +mymarkerbre[selected_marker]+'\nPriorität:'+mymarkerprio[selected_marker]+'\n';
  //document.getElementById("ausgabe").rows =
  //document.getElementById("ausgabe").rows + 5;
}

var markergruppe = L.layerGroup().addTo(mymap);

function onMapClick(e) {
  //////////////////Stackoverflow: https://stackoverflow.com/questions/45931963/leaflet-remove-specific-marker
  var id
  if (markers.length < 1) id = 0
  else id = markers[markers.length - 1]._id + 1
  ////////////////////////////////
  var latilong = e.latlng;
  marker = new L.marker(latilong, {draggable:false}).addTo(markergruppe); //Neuer Marker an der angeklickten position
  marker.bindPopup('<b>Marker '+i+'</b><br>Die '
    +(i+1)+'. gesetzte Position.<br>'+'<input type="button" value="Entferne Marker" onclick="clearMarker(' + id + ')" />');
  marker._id = id;
  mymap.addLayer(marker);
  markers.push(marker);
  laengengrad = marker.getLatLng().lng; //Einlesen des Längengrades
  breitengrad = marker.getLatLng().lat; //Einlesen des Breitengrades
  mymarker[i] = i; //Anlegen von einem Arry
  mymarkerlae[i] = laengengrad;  //Wert von laengengrad in das Array überführen
  mymarkerbre[i] = breitengrad;  //Wert von breitengrad in das Array überführen
  mymarkerprio[i] = 1; //Festlegen der Markerpriorität
  document.getElementById("ausgabe").value +=
    '================================='+'\nMarker:'
    +i+ '\nLängengrad:'+laengengrad+'\nBreitengrad:'
    +breitengrad+'\nPriorität:'+mymarkerprio[i]+'\n';
  i=i+1;
}

/////////////////////////Stackoverflow: https://stackoverflow.com/questions/45931963/leaflet-remove-specific-marker
function clearMarker(id) {
  var new_markers = [];
  markers.forEach(function(marker) {
    if (marker._id == id) mymap.removeLayer(marker)
    else new_markers.push(marker)
  })
  markers = new_markers
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

mymap.on('click', onMapClick);
