// handle sidebar logic
$(document).ready(function() {
  // click handler on chevron icon (sidebar button)
  $('.toggle-sidebar-button').click(function(){
    toggleSidebar();
  })

  // click handler on back button at top in sidebar navigation bar
  $('#sidebar-nav-close-button').click(function(){
    toggleSidebar();
  })

  // shows the place-list-pane searched by user, hides the place details pane
  $('#sidebar-nav-place-details-back-button').click(function(){
    hidePlaceDetailsPane();
    showPlaceListPane();
  })

  // shows the place details pane, hides the review pane
  $('#sidebar-nav-place-review-back-button').click(function(){
    hidePlaceReviewsPane()
    showPlaceDetailsPane();
  })

  // shows the flickr photos pane, hides the review pane
  $('#sidebar-nav-place-flickr-photos-back-button').click(function(){
    hideFlickrPhotosPane();
    showPlaceDetailsPane();
  })
});

// TODO: do something about scope about these functions
// NOTE: these functions are used in app.js too
function showMoreDetails() {
  // when a place card is clicked do the following
  // show place-details-pane in sidebar and hide place-list-pane
  hidePlaceListPane()
  showPlaceDetailsPane();
  // add active class to first carousel item
  $('.carousel-item').first().addClass('active');

  //TODO: this probably register new click function everytime more info is clicked, fix it
  // when user click om review button
  $('#read-reviews-button').click(function(){
    // hide place details pane
  	hidePlaceDetailsPane();
    // show reviews pane
    showPlaceReviewsPane();
  });

  //TODO: this probably register new click function everytime more info is clicked, fix it
  // when user click om review button
  // make reuqest to Flickr APIs
  $('#show-flickr-photos-button').click(function(){
    console.log('click');
    callFlickrAPI();
    hidePlaceDetailsPane();
    showFlickrPhotosPane();
  })

}


function toggleSidebar() {
  // toggle sidebar in and off from user's screen
  $('#sidebar-container').toggleClass('toggle-side-bar');
  // animate/move chevron icon (sidebar button) accordingly
  $('.toggle-sidebar-button').toggleClass('animate-toggle-sidebar-button');
  // disable and enable click events on map and search background
  $('#map,.search-bar-container').toggleClass('avoid-clicks');
  // change opacity
  $('#map, .search-bar-container').toggleClass('blur');

}

function showPlaceListPane(){
  $('#place-list-pane').css('display', 'initial');
};
function hidePlaceListPane(){
  $('#place-list-pane').css('display', 'none');
};

function showPlaceDetailsPane(){
  $('#place-details-pane').css('display', 'initial');
};
function hidePlaceDetailsPane(){
  $('#place-details-pane').css('display', 'none');
};

function showPlaceReviewsPane(){
  $('#place-reviews-pane').css('display', 'initial');
};
function hidePlaceReviewsPane(){
  $('#place-reviews-pane').css('display', 'none');
};

function showFlickrPhotosPane(){
  $('#flickr-photos-pane').css('display', 'initial');
};
function hideFlickrPhotosPane(){
  $('#flickr-photos-pane').css('display', 'none');
};
