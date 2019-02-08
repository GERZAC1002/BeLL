const mymap = L.map('map2').setView([51.33918, 12.38105], 12);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?lang=de', {
	maxZoom: 18,
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(mymap);

let marker;
const i=0;
let markers = [];

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
	marker._prio = 5;
	marker.bindPopup('<b>Marker '+ marker._id +'</b><br>'
    + 'Häufigkeit pro Woche'
		+ '<br><input type="number" value="' + marker._prio + '" oninput="change_marker(' + marker._id +', this.value)" placeholder="Priorität" min="0" max="1000" />'
		+ '<br>==========================<br>'
		+ '<input type="button" value="Entferne Marker" onclick="clear_marker(' + marker._id + ')" />'
	);
	mymap.addLayer(marker);
	markers.push(marker);
}

let kreis;
let kreis2;

function center()
{
	if(kreis)
	{
		mymap.removeLayer(kreis);
	}
	const add = (a,b)=>a+b;
	const prioSum = markers.map(m => m._prio).reduce(add,0);
	const lat = markers.map(m => m._latlng.lat * m._prio).reduce(add,0)/prioSum;
	const lng = markers.map(m => m._latlng.lng * m._prio).reduce(add,0)/prioSum;
	console.log(lat + ' ' + lng);
	//marker = new L.marker([lat, lng],{draggable:false}).addTo(markergruppe);
	//mymap.addLayer(marker);
	kreis = L.circle([lat, lng], {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5,
		radius: 100,
	}).addTo(mymap);
	kreis._kreis=true;
}

function weightedDistance(p)
{
	let wdist = 0;
	for(const m of markers)
	{
		const dlat = p.lat-m._latlng.lat;
		const dlng = p.lng-m._latlng.lng;
		wdist += Math.sqrt(dlat*dlat+dlng*dlng) * m._prio;
	}
	const add = (a,b)=>a+b;
	const prioSum = markers.map(m => m._prio).reduce(add,0);
	wdist/=prioSum;
	//console.log(wdist);

	return wdist*90;
}

let heat = null;

function heatmap()
{
	if(heat)
	{
		mymap.removeLayer(heat);
	}
	const data = [];
	for(let lat = 51.24;lat<51.44;lat+=0.0005)
	{
		for(let lng = 12.2;lng<12.6;lng+=0.001)
		{
			data.push([lat,lng,weightedDistance({"lat":lat,"lng":lng})]);
		}
	}
	heat = L.heatLayer(data, {radius: 10}).addTo(mymap);
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

function change_marker(id, prio)
{
	console.log(prio);
	const new_markers = [];
	markers.forEach(function(marker)
	{
		if(marker._id === id)
		{
			marker._prio = parseInt(prio);
			marker._popup.setContent('<b>Marker '+ marker._id +'</b><br>'
				+ 'Häufgkeit pro Woche:'
				+ '<br><input type="number" value="' + marker._prio + '" oninput="change_marker(' + marker._id +', this.value)" placeholder="Priorität" min="0" max="1000" />'
				+ '<br>==========================<br>'
				+ '<input type="button" value="Entferne Marker" onclick="clear_marker(' + marker._id + ')" />'
			);
		}
		new_markers.push(marker);
	});
	markers = new_markers;
	center();
	heatmap();
}

mymap.on('click', onMapClick);
