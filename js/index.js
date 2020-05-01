// initialize our map
var map = L.map('map', {
  //center:[41.928016, -89.299357], //center map on somewhere in Northern Illinois
  //zoom: 5 //set the zoom level
});

//add openstreet baselayer to the map
L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  minZoom: 5,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//add a scale bar
L.control.scale({
  position: 'bottomright'
}).addTo(map);

/*
// Add functions to style the polygons by values
function getColor(d) {
  return d === null ? 'red' :
        'blue';
};
*/

//load the data asynchronously
d3.queue()
  .defer(d3.json, 'data/UI_Library_Dropoff_Locations.geojson') //the book drop-off locations
  .await(drawMap); //load the layers after the map loads

//provide instructions for drawing the map
function drawMap(err, books) {

  var dropoffs = L.geoJson(books, { //define layer with a variable

    pointToLayer: function(feature, ll) {

      return L.marker(ll, {
        icon: L.ExtraMarkers.icon({
          icon: 'fas fa-book',
          prefix: 'fa',
          markerColor: 'green',
          iconColor: 'white'
        })
      })

    }, //end pointToLayer

    //restyle on mouseover, reset style on mouseout
    onEachFeature: function(feature, layer) {

      var props = layer.feature.properties;

      //bind a popup window to each circle marker
      layer.bindPopup("<h3>" + props.Name + "</h3>" +
        "<h4>" + props.Address +
        "<br>" + props.City + ", " + props.State + " " + props.Zip +
        "<br>Who can use: " + props.Availability + "</h4>"
      );

    } //end onEachFeature

  }).addTo(map);

  //fit the map to the extent of the circle markers upon drawing
  map.fitBounds(dropoffs.getBounds());
  /*
      //define layers
      var overlays = {
        "Drop-Off Locations": dropoffs,
      };

      //send the layers to the layer control
      L.control.layers(null, overlays, {
        collapsed: false,
      }).addTo(map);
  */

  // create an info button to describe the map and supporting data
  var infoButton = L.easyButton({
    id: 'infoButton',
    position: 'topright',
    states: [{
      stateName: 'show-info',
      icon: '<strong>?</strong>',
      title: 'Tell me about this map',
      onClick: function(btn, map) {
        $("#dialog").dialog();
      }
    }]
  }).addTo(map);

}; //end drawMap function
