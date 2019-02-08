const mymap = L.map('map2').setView([51.33918, 12.38105], 12);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?lang=de', {
	maxZoom: 18,
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(mymap);

const mymarker = [];
const mymarkerlae = [];
const mymarkerbre = [];
const mymarkerprio = [];
let marker;
let laengengrad;
let breitengrad;
let i=0;
let markers = [];

function marker_aktualisieren(marker){
	marker._prio = document.getElementById("eingabe_marker_prio").value;
	document.getElementById("ausgabe").value = document.getElementById("ausgabe").value
    +'================================='+'\nMarker:'
    +selected_marker+ '\nLängengrad:'+mymarkerlae[selected_marker]+'\nBreitengrad:'
    +mymarkerbre[selected_marker]+'\nPriorität:'+mymarkerprio[selected_marker]+'\n';
}

const markergruppe = L.layerGroup().addTo(mymap);

function onMapClick(e)
{
	//////////////////Stackoverflow: https://stackoverflow.com/questions/45931963/leaflet-remove-specific-marker
	let id;
	if (markers.length < 1) {id = 0;}
	else {id = markers[markers.length - 1]._id + 1;}
	////////////////////////////////
	const latilong = e.latlng;
	marker = new L.marker(latilong, {draggable:false}).addTo(markergruppe); //Neuer Marker an der angeklickten position
	marker._id = id;
	marker._prio = Math.floor((Math.random()*100)+1);
	marker.bindPopup('<b>Marker '+ marker._id +'</b><br>Die '
    +(i+1)+'. gesetzte Position.'
		+ '<br><input type="number" value="' + marker._prio + '" oninput="()=>{marker._prio = this.value;console.log('+marker._prio +')}" placeholder="Priorität" min="0" max="1000" />'
		+ '<br>==========================<br>'
		+ '<input type="button" value="Entferne Marker" onclick="clear_marker(' + marker._id + ')" />'
	);
	mymap.addLayer(marker);
	markers.push(marker);
	laengengrad = marker.getLatLng().lng; //Einlesen des Längengrades
	breitengrad = marker.getLatLng().lat; //Einlesen des Breitengrades
	document.getElementById("ausgabe").value +=
    '================================='+'\nMarker:'
    +i+ '\nLängengrad:'+laengengrad+'\nBreitengrad:'
    +breitengrad+'\nPriorität:'+mymarkerprio[i]+'\n';
	i=i+1;
}

function center(){
	const add = (a,b)=>a+b;
	const prioSum = markers.map(m => m._prio).reduce(add,0);
	const lat = markers.map(m => m._latlng.lat * m._prio).reduce(add,0)/prioSum;
	const lng = markers.map(m => m._latlng.lng * m._prio).reduce(add,0)/prioSum;
	marker = new L.marker([lat, lng],{draggable:false}).addTo(markergruppe);
	mymap.addLayer(marker);
}

/////////////////////////Stackoverflow: https://stackoverflow.com/questions/45931963/leaflet-remove-specific-marker
function clear_marker(id)
{
	const new_markers = [];
	markers.forEach(function(marker)
	{
		if (marker._id === id) {mymap.removeLayer(marker);}
		else {new_markers.push(marker);}
	});
	markers = new_markers;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

mymap.on('click', onMapClick);
