var knockoutBinding;

var placeData = [
  {
    name: 'nimeh chains of hotels',
    vicinity: '341 W 36th St, New York, NY 10018, USA',
    formatted_phone_number: '(212) 542-8990',
    rating: '4.7',
    thumbnail: 'https://lh3.googleusercontent.com/p/AF1QipNzSbmLqOLQOMYQW8sGSfM63LhAuA7EmaIdvcr_=w100-h100-k',
    openingHours: {open_now: false}
  }
];

function activateSidebar(places, service) {
  /*
    * this function is called from onPlaceChange() functions in maps.js
    * basically whenever user selects a prediction from search bar it triggers
    * for a new search new places will be returned, placeData needs to be emptied
  */
  placeData = [];
  places.forEach(function(place, index){
    /* to prevent OVER_QUERY_LIMIT, we'll wait for some time
    see the code snippet below */
    /*
    service.getDetails({
      placeId: place.place_id
    }, function(requestedPlace, status) {
      console.log(status + ' on ' + index + 'th request');
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        placeData.push(requestedPlace);
      }
    })
    */
    /*
      * things can be done the way mentioned above, but if we'll do that we'll hit OVER_QUERY_LIMIT (https://developers.google.com/maps/premium/previous-licenses/articles/usage-limits)
      * In the snippet aboove we'll be making too much  getDetails() request in a very short amount of time (we know how fast forEach works :D)
      * We keep getting OVER_QUERY_LIMIT status after the 10th requestedPlace
      * So what we gonna do it, after making the 10th request we gonna wait for few seconds and then make the requestedPlace
      * this we don't get error and Knockout takes care of updating the next 10 list for us
      * below is the workaround
    */

    if(index > 9) {
      setTimeout(function(){
        // all requests to placesService after the 10th request will be dispatched after 5 seconds of delay
        // knockout will take care of adding the list for us
        // TODO: add a spiner to let user know
        getDetailsFromService()
      }, 5000);
    } else {
      getDetailsFromService()
    }

    function getDetailsFromService() {
      service.getDetails({
        placeId: place.place_id
      }, function(requestedPlace, status) {
        // console.log(status + ' ' + index);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          placeData.push(requestedPlace);
          knockoutBinding.viewModel.updatePlaces();
        }
      });
    }

  });
  console.log(placeData);

}

// each Place in knockout observable array have following
var Place = function(data) {
  // PlacesService returns many diffrent types of information about the place, we'll use only few of them whcih makes most sense to our app
  // PlacesService responses could be find here
  var self = this;
  self.name = data.name;
  self.formattedPhoneNumber = data.formatted_phone_number;
  self.formattedAddress = data.formatted_address;
  self.internationalPhoneNumber = data.international_phone_number;
  self.icon = data.icon;
  self.openingHours = data.opening_hours;
  self.photos = data.photos;
  self.rating = data.rating;
  self.reviews = data.reviews;
  self.types = data.types;
  self.utcOffset = data.utc_offset;
  self.vicinity = data.vicinity;
  self.website = data.website;
  // Google Maps URL
  self.url = data.url;
  // url of the first photo in data.photos, retrived by using getUrl() method. https://developers.google.com/maps/documentation/javascript/places#places_photos
  if(data.photos) {
    self.thumbnail = data.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100});;
  } else {
    // if no image found, use the icon image
    self.thumbnail = data.icon;
  }

  self.openNow = true;
  if(data.opening_hours) {
    self.openNow = data.opening_hours.open_now;
  }
}

//ViewModel
var PlaceViewModel = function() {
  var self = this;
  self.placeList = ko.observableArray([]);
  placeData.forEach(function(placeItem) {
    self.placeList.push(new Place(placeItem));
  })
  this.updatePlaces = function() {
    console.log('UI REFRESH');
    self.placeList.removeAll();
    placeData.forEach(function(placeItem, index) {
      self.placeList.push(new Place(placeItem));
    })
  }
}

// we'll be accesing PlaceViewModel's updatePlaces() method outside PlaceViewModel, to work workaround that
// we implement knockout binding in a little different way then normal
// https://stackoverflow.com/questions/10643940/access-viewmodel-in-javascript-function-outside-viewmodels-scope
knockoutBinding = { viewModel: new PlaceViewModel() };
ko.applyBindings(knockoutBinding.viewModel);

$( document ).ready(function() {
    $("#pac-input").focus();
});
