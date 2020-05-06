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

      //define an empty array into which you can add tags for the filter buttons
      var tags = [];

      //push properties into the tags array for later referencing by the filter buttons
      tags.push(feature.properties.Availability);

      return L.marker(ll, {
        tags: tags,
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
  // States
  L.control.tagFilterButton({
    data: ['Available to all students in Iowa'],
    filterOnEveryClick: true,
    icon: '<i class="fas fa-filter"></i>',
  }).addTo(map);


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

  jQuery('.easy-button-button').click(function() {
    target = jQuery('.easy-button-button').not(this);
    target.parent().find('.tag-filter-tags-container').css({
      'display': 'none',
    });
  });

  //disable dragging of the map after clicking a filter button
  jQuery('.easy-button-button').click(function() {
    map.dragging.disable();
  });

  //enable dragging of the map after clicking on the map
  map.on('click', function() {
    map.dragging.enable();
  });

}; //end drawMap function
