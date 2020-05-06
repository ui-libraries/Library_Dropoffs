// initialize our map
var map = L.map('map');

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

//load the data asynchronously
d3.queue()
  .defer(d3.json, 'data/NotUI_Library_Dropoff_Locations.geojson') //the book drop-off locations
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
      var secondCon = props.Second_Contact;
      var secondEm = props.Second_Contact_Email;
      var dropInfo = props.Instructions;
      var dropBox = "<br><br>Instructions:" + "<br>" + dropInfo;

      if (secondCon == null) {
        secondCon = "";
      } if (secondEm == null) {
        secondEm = "";
      } if (dropInfo == null) {
        var dropBox = "";
      }

      //bind a popup window to each circle marker
      layer.bindPopup("<h3>" + props.Name + "</h3>" +
        "<h4>Address:" +
        "<br>" + props.Address +
        "<br>" + props.City + ", " + props.State + " " + props.Zip +
        dropBox +
        "<br><br>Contacts:" +
        "<br>" + props.First_Contact +
        "<br>" + '<a href=mailto:"' + props.First_Contact_Email + '"target="_blank">' + props.First_Contact_Email + "</a>" +
        "<br>" + secondCon +
        "<br>" + '<a href=mailto:"' + secondEm + '"target="_blank">' + secondEm + "</a>" + "</h4>"
      );

    } //end onEachFeature

  }).addTo(map);

  //fit the map to the extent of the circle markers upon drawing
  map.fitBounds(dropoffs.getBounds());

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
