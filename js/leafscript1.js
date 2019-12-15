function check_es6(){
	try{
		const nul = 0;
	}catch(e){
		throw new Error('Fehler: Browser unterstützt kein ES6');
	}
}
const mymap = L.map('map').setView([51.33918, 12.38105], 12);
//Karte erstellen mit Mittelpunkt 51.33918N und 12.38105O und Zoomstufe 12
let tilelayer = new L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png?lang=de', {//Festlegen des Anbieters des Kartenmaterials
	maxZoom: 20,//maximaler zoom nach unten
	minZoom: 5,//maximaler zoom nach oben
	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',//Anzeigen des Copyrights von OpenStreetMap
}).addTo(mymap);//Layer wird Karte 'mymap' hinzugefuegt

let marker;//neue Variable wird hinzugefügt
const i=0;//Konstante i mit Wert 0 wird hinzugefügt
let markers = [];//Neues Feld markers wird erstellt
let kreis1;//Variable für Kreis 1
let kreis2;//Variable für Kreis 2
let kreis3;//Variable für Kreis 3

//Funktion zum Wechseln des Kartenmaterials
function wechsellayer(){
	const layer = document.getElementById("tilequelle").value;//Select Feld auslesen
	try{
		mymap.removeLayer(tilelayer);//Entfernt vorhergehenden Layer bevor neuer gesetzt wird
	}catch(e){}
	switch(layer){
		case "osm.org":
			tilelayer = new L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png?lang=de', {//Festlegen des Anbieters des Kartenmaterials
				maxZoom: 20,//maximaler zoom nach unten
				minZoom: 5,//maximaler zoom nach oben
				attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',//Anzeigen des Copyrights von OpenStreetMap
			}).addTo(mymap);//Layer wird Karte 'mymap' hinzugefuegt
			break;
		case "lokal4umaps":
			tilelayer = new L.tileLayer('http://127.0.0.1/4uMaps/{z}/{x}/{y}.jpg.tile', {//Festlegen des Anbieters des Kartenmaterials
				maxZoom: 15,//maximaler zoom nach unten
				minZoom: 5,//maximaler zoom nach oben
			}).addTo(mymap);//Layer wird Karte 'mymap' hinzugefuegt
			break;
		case "lokalosmtransport":
			tilelayer = new L.tileLayer('http://127.0.0.1/OSMPublicTransport/{z}/{x}/{y}.jpg.tile', {//Festlegen des Anbieters des Kartenmaterials
				maxZoom: 16,//maximaler zoom nach unten
				minZoom: 5,//maximaler zoom nach oben
			}).addTo(mymap);//Layer wird Karte 'mymap' hinzugefuegt
			break;
	}
}
//Funktion die beim Klick auf die Karte ausgeführt wird
//setzt Marker an angeklickte Position
function on_Map_Click(e){
	let id;//Variable id wird initialisiert
	if (markers.length < 1) {//Wenn markers feldlänge < 1 ist
		id = 0; //ID bekommt den Wert 0
	}else {//Wenn markers feldlänge nict <1 ist
		id = markers[markers.length - 1]._id + 1; //ID = die ID vom voherigen markers Eintrag +1
	}
	marker = new L.marker(e.latlng, {draggable:false}).addTo(mymap); //Neuer Marker an der angeklickten position
	marker._id = id;//Marker wird eine ID zugewiesen
	marker._prio = 5;//Marker wird eine Priorität zugewiesen
	marker.bindPopup('<b>Marker '
		+ marker._id
		+'</b><br>'
		+ 'Priorität:'
		+ '<br><input id="input" type="number" autofocus="autofocus" value="'
		+ marker._prio
		+ '" oninput="change_marker('
		+ marker._id
		+', this.value)" placeholder="Priorität" min="0" max="1000" />'
		+ '<br>==========================<br>'
		+ '<input type="button" value="Entferne Marker" onclick="clear_marker('
		+ marker._id
		+ ')" />'
	);//Marker bekommt ein Popup zugewiesen
	mymap.addLayer(marker);//Marker wird Karte hizugefügt
	markers.push(marker);//Marker wird ins Feld Markers hinzugefügt
	center();//Funktion center() wird ausgeführt
}

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

function clear_marker(id){//Funktion ckear_marker() mit Übergabewert id
	const new_markers = [];//neues Markerfeld
	markers.forEach(function(marker){//Mache für jeden Marker
		if (marker._id === id) {//Mache wenn marker._id gleich ID ist
			mymap.removeLayer(marker);//Entferne Marker
		}else {//Wenn Marker._id != ID ist
			new_markers.push(marker);//Füge Marker in neues Feld ein
		}
	});
	markers = new_markers;//Markers Feld übernimmt Werte aus new_markers feld
	if(markers.length > 0){
		center();//Aufruf der Center Funktion
	}else{
		mymap.removeLayer(kreis1);//Entferne Kreis 1
		mymap.removeLayer(kreis2);//Entferne Kreis 2
		mymap.removeLayer(kreis3);//Entferne Kreis 3
	}
}

function change_marker(id, prio){//Funktion change_marker() mit Übergabewerten ID, prio
	const new_markers = [];//neues Markerfeld
	markers.forEach(function(marker){//Mache für jeden Marker
		if(marker._id === id){//Mache wenn marker._id gleich ID ist
			marker._prio = parseInt(prio);//weise marker._prio übergebenen prio wert zu
			marker._popup.setContent('<b>Marker '
				+ marker._id +'</b><br>'
				+ 'Priorität:'
				+ '<br><input type="number" id="input" value="'
				+ marker._prio
				+ '" oninput="change_marker('
				+ marker._id
				+', this.value)" placeholder="Priorität" min="0" max="1000" />'
				+ '<br>==========================<br>'
				+ '<input type="button" value="Entferne Marker" onclick="clear_marker('
				+ marker._id
				+')" />'
			);//Popup für Marker, enthält Knopf mit funktion clear_marker()
		}
		new_markers.push(marker);//packe marker in new_markers feld
	});
	markers = new_markers;//Feld markers übernimmt Werte aus new_markers
	center();//Führe Funktion center() aus
	document.getElementById("input").click();
	document.getElementById("input").focus();
	//heatmap();
}

mymap.on('click', on_Map_Click);//Funktion für den Klick auf die Karte
