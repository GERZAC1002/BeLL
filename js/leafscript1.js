const mymap = L.map('map').setView([51.33918, 12.38105], 12);
//Karte erstellen mit Mittelpunkt 51.33918N und 12.38105O und Zoomstufe 12
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?lang=de', {//Festlegen des Anbieters des Kartenmaterials
	maxZoom: 20,//maximaler zoom nach unten
	minZoom: 5,//maximaler zoom nach oben
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',//Anzeigen des Copyrights von OpenStreetMap
}).addTo(mymap);//Layer wird Karte 'mymap' hinzugefuegt

let marker;//neue Variable wird hinzugefügt
const i=0;//Konstante i mit Wert 0 wird hinzugefügt
let markers = [];//Neues Feld markers wird erstellt

function onMapClick(e){
	//////////////////Stackoverflow: https://stackoverflow.com/questions/45931963/leaflet-remove-specific-marker
	let id;//Variable id wird initialisiert
	if (markers.length < 1) {//
		id = 0;
	}else {
		id = markers[markers.length - 1]._id + 1;
	}
	////////////////////////////////
	marker = new L.marker(e.latlng, {draggable:false}).addTo(mymap); //Neuer Marker an der angeklickten position
	marker._id = id;//Marker wird eine ID zugewiesen
	marker._prio = 5;//Marker wird eine Priorität zugewiesen
	marker.bindPopup('<b>Marker '+ marker._id +'</b><br>'
    + 'Priorität:'
		+ '<br><input type="number" value="' + marker._prio + '" oninput="change_marker(' + marker._id +', this.value)" placeholder="Priorität" min="0" max="1000" />'
		+ '<br>==========================<br>'
		+ '<input type="button" value="Entferne Marker" onclick="clear_marker(' + marker._id + ')" />'
	);//Marker bekommt ein Popup zugewiesen
	mymap.addLayer(marker);//Marker wird Karte hizugefügt
	markers.push(marker);//Marker wird ins Feld Markers hinzugefügt
	center();//Funktion center() wird ausgeführt
}

let kreis1;//Variable für Kreis 1
let kreis2;//Variable für Kreis 2
let kreis3;//Variable für Kreis 3

function center(){//Beginn der Funktion center()
	if(kreis1&&kreis2&&kreis3){//Mach das nachfolgende wenn Kreise 1-3 vorhanden sind
		mymap.removeLayer(kreis1);//Entferne Kreis 1
		mymap.removeLayer(kreis2);//Entferne Kreis 2
		mymap.removeLayer(kreis3);//Entferne Kreis 3
	}
	const add = (a,b)=>a+b;//äquivalent zu add(a,b){return a+b}, Erstellen einer neuene Funktion
	const prioSum = markers.map(m => m._prio).reduce(add,0);//.map gibt Array mit Prioritäten aus, woraus dann die Summe aller Prioritäten gebildet wird
	const lat = markers.map(m => m._latlng.lat * m._prio).reduce(add,0)/prioSum;//Berechnung von der Mitte der Breitengrade
	const lng = markers.map(m => m._latlng.lng * m._prio).reduce(add,0)/prioSum;//Berechnung von der Mitte der Längengrade
	kreis1 = L.circle([lat, lng], {//Erstellen eines neuen Kreises
		color: 'green',//Kreis 1 Farbe grün
		fillColor: '#00ff00',//Kreis 1 Füllfarbe grün
		fillOpacity: 0.2,//Kreis 1 Deckkraft
		radius: 1000,//Kreis 1 Durchmesser
	}).addTo(mymap);//Zur Karte hizufügen
	kreis2 = L.circle([lat, lng], {//Erstellen eines neuen Kreises
		color: 'yellow',//Kreis 2 Farbe gelb
		fillColor: '#ffff00',//Kreis 2 Füllfarbe gelb
		fillOpacity: 0.3,//Kreis 2 Deckkraft
		radius: 500,//Kreis 2 Radius
	}).addTo(mymap);//Zur Karte hinzufügen
	kreis3 = L.circle([lat, lng], {//Erstelle neuen Kreis
		color: 'red',//Kreis 3 Farbe rot
		fillColor: '#f03',//Kreis 3 Füllfarbe rot
		fillOpacity: 0.5,//Kreis 3 Deckkraft
		radius: 100,//Kreis 3 Radius
	}).addTo(mymap);//Zur Karte hizufügen
}

/////////////////////////Stackoverflow: https://stackoverflow.com/questions/45931963/leaflet-remove-specific-marker
function clear_marker(id){
	const new_markers = [];
	markers.forEach(function(marker){
		if (marker._id === id) {mymap.removeLayer(marker);}
		else {new_markers.push(marker);}
	});
	markers = new_markers;
	center();
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function change_marker(id, prio){
	console.log(prio);
	const new_markers = [];
	markers.forEach(function(marker){
		if(marker._id === id){
			marker._prio = parseInt(prio);
			marker._popup.setContent('<b>Marker '+ marker._id +'</b><br>'
				+ 'Priorität:'
				+ '<br><input type="number" value="' + marker._prio + '" oninput="change_marker(' + marker._id +', this.value)" placeholder="Priorität" min="0" max="1000" />'
				+ '<br>==========================<br>'
				+ '<input type="button" value="Entferne Marker" onclick="clear_marker(' + marker._id + ')" />'
			);
		}
		new_markers.push(marker);
	});
	markers = new_markers;
	center();
	//heatmap();
}

mymap.on('click', onMapClick);
