$( document ).ready(function() {
    // $("#pac-input").focus();

    // fullscreen api
    // https://github.com/sindresorhus/screenfull.js
    $('#toggle-full-screen-btn').on('click', () => {
      if (screenfull.enabled) {
        // Requests fullscreen if not active, otherwise exits.
        // https://github.com/sindresorhus/screenfull.js#toggle
        screenfull.toggle();
        // Detect fullscreen change
        // https://github.com/sindresorhus/screenfull.js#detect-fullscreen-change
        screenfull.on('change', () => {
        		if(screenfull.isFullscreen){
              $('#toggle-full-screen-btn').html('<i class="fa fa-compress" aria-hidden="true"></i> Fullscreen');
            } else {
              $('#toggle-full-screen-btn').html('<i class="fa fa-expand" aria-hidden="true"></i> Fullscreen');
            }
        	});

        //log if there is any error
        screenfull.on('error', event => {
        		console.error('Failed to enable fullscreen', event);
        	});

      } else {
        // Ignore or do something else
      }
    });

});

var knockoutBinding;

var placeData = [
  // {
  //   formatted_address: '952, NYC, NY',
  //   formatted_phone_number: '(212) 542-8990',
  //   name: 'nimesh chains of hotels',
  //   openingHours: {
  //                   open_now: false,
  //                   // periods:
  //                 },
  //   rating: '4.7',
  //   reviews: [
  //     {
  //       author_name: "Nimesh Jain",
  //       author_url: "https://www.google.com/maps/contrib/101186634267073160192/reviews",
  //       language: "en",
  //       profile_photo_url: "https://lh3.googleusercontent.com/-DO4zi1McAyk/AAAAAAAAAAI/AAAAAAAAAMk/b0040iJJ3lc/s128-c0x00000000-cc-rp-mo-ba5/photo.jpg",
  //       rating: 4,
  //       relative_time_description: "2 weeks ago",
  //       text: "Love the atmosphere and staff. Excellent. Great location in walking distance of times square. Rooms are interesting in size (small) but comfortable beds. Room was clean. Hope you like the color purple. Love the old TV themes they play in the elevators. Trippy. Would stay again and do recommend.  Very good location for food and drinks nearby.  I do recommend that they put ice buckets in the rooms.",
  //       time :1515877906,
  //     },
  //     {
  //       author_name: "Kunal Pancholi",
  //       author_url: "https://www.google.com/maps/contrib/101186634267073160192/reviews",
  //       language: "en",
  //       profile_photo_url: "https://lh3.googleusercontent.com/-DO4zi1McAyk/AAAAAAAAAAI/AAAAAAAAAMk/b0040iJJ3lc/s128-c0x00000000-cc-rp-mo-ba5/photo.jpg",
  //       rating: 4,
  //       relative_time_description: "2 weeks ago",
  //       text: "Love the atmosphere and staff. Excellent. Great location in walking distance of times square. Rooms are interesting in size (small) but comfortable beds. Room was clean. Hope you like the color purple. Love the old TV themes they play in the elevators. Trippy. Would stay again and do recommend.  Very good location for food and drinks nearby.  I do recommend that they put ice buckets in the rooms.",
  //       time :1515877906,
  //     },
  //     {
  //       author_name: "Ajay Bhandari",
  //       author_url: "https://www.google.com/maps/contrib/101186634267073160192/reviews",
  //       language: "en",
  //       profile_photo_url: "https://lh3.googleusercontent.com/-DO4zi1McAyk/AAAAAAAAAAI/AAAAAAAAAMk/b0040iJJ3lc/s128-c0x00000000-cc-rp-mo-ba5/photo.jpg",
  //       rating: 4,
  //       relative_time_description: "2 weeks ago",
  //       text: "Love the atmosphere and staff. Excellent. Great location in walking distance of times square. Rooms are interesting in size (small) but comfortable beds. Room was clean. Hope you like the color purple. Love the old TV themes they play in the elevators. Trippy. Would stay again and do recommend.  Very good location for food and drinks nearby.  I do recommend that they put ice buckets in the rooms.",
  //       time :1515877906
  //     },
  //     {
  //       author_name: "Ankit Vijay",
  //       author_url: "https://www.google.com/maps/contrib/101186634267073160192/reviews",
  //       language: "en",
  //       profile_photo_url: "https://lh3.googleusercontent.com/-DO4zi1McAyk/AAAAAAAAAAI/AAAAAAAAAMk/b0040iJJ3lc/s128-c0x00000000-cc-rp-mo-ba5/photo.jpg",
  //       rating: 4,
  //       relative_time_description: "2 weeks ago",
  //       text: "Love the atmosphere and staff. Excellent. Great location in walking distance of times square. Rooms are interesting in size (small) but comfortable beds. Room was clean. Hope you like the color purple. Love the old TV themes they play in the elevators. Trippy. Would stay again and do recommend.  Very good location for food and drinks nearby.  I do recommend that they put ice buckets in the rooms.",
  //       time :1515877906
  //     },
  //     {
  //       author_name: "Shivam Gera",
  //       author_url: "https://www.google.com/maps/contrib/101186634267073160192/reviews",
  //       language: "en",
  //       profile_photo_url: "https://lh3.googleusercontent.com/-DO4zi1McAyk/AAAAAAAAAAI/AAAAAAAAAMk/b0040iJJ3lc/s128-c0x00000000-cc-rp-mo-ba5/photo.jpg",
  //       rating: 4,
  //       relative_time_description: "2 weeks ago",
  //       text: "Love the atmosphere and staff. Excellent. Great location in walking distance of times square. Rooms are interesting in size (small) but comfortable beds. Room was clean. Hope you like the color purple. Love the old TV themes they play in the elevators. Trippy. Would stay again and do recommend.  Very good location for food and drinks nearby.  I do recommend that they put ice buckets in the rooms.",
  //       time :1515877906
  //     }
  //   ],
  //   thumbnail: 'https://lh3.googleusercontent.com/p/AF1QipNzSbmLqOLQOMYQW8sGSfM63LhAuA7EmaIdvcr_=w100-h100-k',
  //   types: ['lodging', 'cafe' ],
  //   url: 'https://nimeshjain.com',
  //   vicinity: '341 W 36th St, New York, NY 10018, USA',
  //   website: 'http://nimeshjain.com'
  // }
];
// NOTE:
/*
  * this function is called from onPlaceChange() functions in maps.js
  * whenever user selects a prediction from search bar this function gets triggeed from maps.js
*/
function activateSidebar(places, service) {
  // for a new search,  new 'places' array will be returned, placeData needs to be emptied
  placeData = [];
  places.forEach(function(place, index){
    /* to prevent OVER_QUERY_LIMIT, we'll wait for some time.....
    see the code snippet below for more info */
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
      * We'll be getting OVER_QUERY_LIMIT status after the 10th requestedPlace
      * So what we gonna do it, after making the 10th request we gonna wait for few seconds and then make the requestedPlace
      * this way we'll not hit OVER_QUERY_LIMIT error and KnockoutJS will takes care of updating the next 10 list for us
      * below is the workaround
    */

    // aggeration time for next 10 request would be around 5000ms only... think! :P
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
  // sends back user to place-list-pane if user is ony any other pane
  hidePlaceDetailsPane();
  hidePlaceReviewsPane();
  showPlaceListPane();
  $('.sidebar-error-message').hide();
}

// each Place in knockout observable array have following
var Place = function(data) {
  // PlacesService returns many diffrent types of information about the place, we'll use only few of them whcih makes most sense to our app
  // PlacesService responses could be find here
  var self = this;
  self.name = data.name;
  if (data.formatted_phone_number) {
    self.formattedPhoneNumber = data.formatted_phone_number;
  } else {
    self.formattedPhoneNumber = "No details were found"
  }

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
  if (data.website) {
    // extracting the part of website after 'https://' pr 'http://'
    self.websiteText = data.website.split('://')[1];
  } else {
    self.websiteText = "No details were found";
  }

  // Google Maps URL
  self.url = data.url;
  // url of the first photo in data.photos, retrived by using getUrl() method. https://developers.google.com/maps/documentation/javascript/places#places_photos
  if(data.photos) {
    self.thumbnail = data.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100});
  } else {
    // if no image found, use the icon image
    self.thumbnail = data.icon;
  }
  // retriving url of photos for 'more info about the place section'
  self.photosArray = ko.observableArray([]);
  if(data.photos) {
    /* photosArray should have at least one photo url for our carousel to work
      carousel will work even if we have less than 10 photos url in photosArray
    */
    data.photos.forEach(function(photo, index){
      self.photosArray.push(data.photos[index].getUrl({'maxHeight': 300}))
    });
  } else {
    self.photosArray.push("images/no-image-found.jpg")
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
  self.currentPlace = ko.observable(self.placeList()[0]);
  self.setPlace = function() {
        self.currentPlace(this);
        showMoreDetails();
      }
  self.updatePlaces = function() {
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
