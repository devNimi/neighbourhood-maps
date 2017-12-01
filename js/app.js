var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 24.5854, lng: 73.7125},
    zoom: 13
  });
}
