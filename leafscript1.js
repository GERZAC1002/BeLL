var mymap = L.map('map2').setView([51.33918, 12.38105], 12);
      L.tileLayer('https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=de', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.wikimedia.com/">Wikimedia</a>',
		    id: 'wikimedia.streets'
	     }).addTo(mymap);
var popup = L.popup();

function onMapClick(e) {
  var marker = L.marker(e.latlng).addTo(mymap);
  document.getElementById('ausgabe').value = L.toString(L.getLatLng(marker));
}
mymap.on('click', onMapClick);
