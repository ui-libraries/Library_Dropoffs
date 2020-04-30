// initialize our map
var map = L.map('map', {
    center:[41.928016, -89.299357], //center map on somewhere in Northern Illinois
    zoom:5 //set the zoom level
});

//add openstreet baselayer to the map
var OpenStreetMap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 15,
  minZoom: 4,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//add a scale bar
L.control.scale({
  position: 'bottomright'
}).addTo(map);

// Add functions to style the polygons by values
function getColor(d) {
  return d === null ? 'red' :
        'blue';
};

//load the data asynchronously
d3.queue()
  .defer(d3.json, 'data/UI_Library_Dropoff_Locations.geojson') //the book drop-off locations
  .await(drawMap); //load the layers after the map loads

  //provide instructions for drawing the map
  function drawMap(err, books) {

    var dropoffs = L.geoJson(books, { //define layer with a variable
      pointToLayer: function(feature, ll) {

        var props = feature.properties;

        //style the points as circle markers
        return L.circleMarker(ll, {
          radius: 4,
          //fillColor: getColor(props.Median_TotalMilesWithinOR),
          fillColor: "blue",
          color: "gray",
          weight: 1,
          opacity: 1.0,
          fillOpacity: 1.0
        })
      }, //end pointToLayer

      //restyle on mouseover, reset style on mouseout
      onEachFeature: function(feature, layer) {

        var props = layer.feature.properties;

        //define what happens on mouseover
        layer.on("mouseover", function(e) {
          layer.setStyle({
            radius: 4,
            fillColor: "yellow",
            color: "gray",
            weight: 1,
            opacity: 1.0,
            fillOpacity: 1.0,
          });
        });

        //bind a popup window to each circle marker
        layer.bindPopup("<h3>" + props.Name + "</h3>" +
          "<h4>" + props.Address +
          "<br>" + props.City + ", " + props.State + " " + props.Zip +
          "<br>Who can use: " + props.Availability + "</h4>"
        );

        //define what happens on mouseout
        layer.on("mouseout", function(e) {

          //style the points
          layer.setStyle({
            radius: 4,
            fillColor: "blue",
            color: "gray",
            weight: 1,
            opacity: 1.0,
            fillOpacity: 1.0,
          });

        });

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
  }; //end drawMap function
