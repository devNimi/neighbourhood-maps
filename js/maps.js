var map, places, placeDetailsInfoWindow;
var searchBox;
var service;
var markers = [];
var hostnameRegexp = new RegExp('^https?://.+?/');

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7413549, lng: -73.9980244},
    zoom: 13,
    mapTypeId: 'roadmap',
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    streetViewControl: false
  });

  //info window for searced 'place details'
  placeDetailsInfoWindow = new google.maps.InfoWindow({
    content: document.getElementById('info-content')
  });

  // use PlacesServices to get more details about a place using getDetails(), passinging in the place id
  service = new google.maps.places.PlacesService(map);

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  searchBox = new google.maps.places.SearchBox(input);
  searchBox.setBounds(map.getBounds());

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', onPlaceChange);

  // Listen for the event fired when the user clicks on 'search-button'
  $(".search-button").click(textSearchPlaces);

  // brigs the search bar back
  $('#show-search-bar-button-container').click(function(){
    //close any placeDetailsInfoWindow if opened
    placeDetailsInfoWindow.close();
    //hide itself
    $('#show-search-bar-button-container').hide()
    //show search bar
    $('.search-bar-container').show();
  })

  //brings the search bar back when infowindow is closed
  google.maps.event.addListener(placeDetailsInfoWindow,'closeclick',function(){
    //hide small search button
    $('#show-search-bar-button-container').hide()
    //show search bar
    $('.search-bar-container').show();
  });
}


function onPlaceChange() {
  places = searchBox.getPlaces();
  // console.log(places);

  createPlaceMarkers(places);
  // pass in place data to knockout data model, which in turns activa sidebar
  activateSidebar(places, service);
}

// This function fire when the user click search-button on the places search.
// It will do a nearby search using the entered query string or place.
function textSearchPlaces() {
  var bounds = map.getBounds();
  hideMarkers(markers);
  var placesService = new google.maps.places.PlacesService(map);
  placesService.textSearch({
    query: $("#pac-input").val(),
    bounds: bounds
  }, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      createPlaceMarkers(results)
    }
  });
}

function createPlaceMarkers(places) {
  if (places.length == 0) {
    // TODO: LET THE USER KNOW
    return;
  }

  // Clear out the old markers.
  hideMarkers(markers)

  // For each place, get the icon, name and location.
  var bounds = new google.maps.LatLngBounds();
  places.forEach(function(place) {
    if (!place.geometry) {
      console.log("Returned place contains no geometry");
      return;
    }

    var icon = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location,
      animation: google.maps.Animation.DROP,
      icon: icon
    });

    // Push the marker to our array of markers.
    markers.push(marker);
    // Create an onclick event to open the large infowindow at each marker.
    marker.addListener('click', function() {
      // we pass in the unique place id of the place
      // later we'll use this place id to make a request to PlacesServices
      var placeId = place.place_id;
      populateInfoWindow(this, placeId, placeDetailsInfoWindow);
    });


    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
  });
  map.fitBounds(bounds);
}

function populateInfoWindow(marker, placeId, infowindow) {

  service.getDetails({
    placeId: placeId
  }, function(requestedPlace, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // placeDetailsInfoWindow.setZIndex(9999);
      placeDetailsInfoWindow.open(map, marker);
      buildInfoWindowContent(requestedPlace);
    }
  });
}

function buildInfoWindowContent(place) {

  // hide the search bar
  // this way info window can be properly seen
  $('.search-bar-container').hide();
  // show only search button to facilate user to bring the search bar back
  $('#show-search-bar-button-container').show();

  document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
      'src="' + place.icon + '"/>';
  if(place.url) {
    document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
        '" target="_blank">' + place.name + '</a></b>';
  } else {
    document.getElementById('iw-url').innerHTML = '<b><a href="#" target="_blank">' + place.name + '</a></b>';
  }


  document.getElementById('iw-address').textContent = place.formatted_address;

  if (place.formatted_phone_number) {
    document.getElementById('iw-phone-row').style.display = '';
    document.getElementById('iw-phone').textContent =
        place.formatted_phone_number;
  } else {
    document.getElementById('iw-phone-row').style.display = 'none';
  }

  // Assign a five-star rating to the hotel, using a black star ('&#10029;')
  // to indicate the rating the hotel has earned, and a white star ('&#10025;')
  // for the rating points not achieved.
  if (place.rating) {
    var ratingHtml = '';
    for (var i = 0; i < 5; i++) {
      if (place.rating < (i + 0.5)) {
        ratingHtml += '&#10025;';
      } else {
        ratingHtml += '&#10029;';
      }
    document.getElementById('iw-rating-row').style.display = '';
    document.getElementById('iw-rating').innerHTML = ratingHtml;
    }
  } else {
    document.getElementById('iw-rating-row').style.display = 'none';
  }

  // The regexp isolates the first part of the URL (domain plus subdomain)
  // to give a short URL for displaying in the info window.
  if (place.website) {
    var fullUrl = place.website;
    var website = hostnameRegexp.exec(place.website);
    if (website === null) {
      website = 'http://' + place.website + '/';
      fullUrl = website;
    }
    document.getElementById('iw-website-row').style.display = '';
    document.getElementById('iw-website').textContent = website;
  } else {
    document.getElementById('iw-website-row').style.display = 'none';
  }
}

// This function will loop through the listings and hide them all.
function hideMarkers(markers) {
  markers.forEach(function(marker) {
    marker.setMap(null);
  });
  markers = [];
  console.log('cleared old markers (if present)');
}
