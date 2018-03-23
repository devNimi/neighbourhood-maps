// flickr API links
// https://www.flickr.com/services/api/flickr.photos.search.html
// https://www.flickr.com/services/api/misc.urls.html

var flickrAPIKey = 'f7d766effe526911e31a8ab55c9bd705';

var callFlickrAPI = function(){
  var currentPlace = knockoutBinding.viewModel.currentPlace();
  var lat = currentPlace.geometry.location.lat()
  var lng = currentPlace.geometry.location.lng()

  var flickrAPIUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';
  flickrAPIUrl += '&' + $.param({
   'api_key': flickrAPIKey,
   'lat': lat,
   // this parameter has be lon, https://www.flickr.com/services/api/flickr.photos.search.html
   'lon': lng,
   'format': 'json',
   'per_page': '40',
   'page': '1'
  });
  flickrAPIUrl += '&' + 'jsoncallback=?';


  $.getJSON( flickrAPIUrl, function( data ) {
    $.each(data.photos.photo, function(i,item){
      var imgSrc = 'https://farm' + item.farm +  '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg';
      currentPlace.flickrPhotosArray.push(imgSrc);
      $('#flickr-loader').fadeOut();
    });
    // $('#flickr-loader').fadeOut();
    console.log(currentPlace.flickrPhotosArray);
  }).fail(function(e){
    // TODO: handle the case and let the user know
    $('#flickr-error-message-no-results').show();
    $('#flickr-loader').fadeOut();
    console.log('request to flickr APIs failed with status - ' + e.status);
  });

}
