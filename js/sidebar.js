// handle sidebar logic
$(document).ready(function() {

  // click handler on chevron icon (sidebar button)
  $('#toggle-sidebar-button').click(function(){
    toggleSidebar();
  })

  // click handler on back button at top in sidebar navigation bar
  $('.sidebar-nav-back-button').click(function(){
    toggleSidebar();
  })

  function toggleSidebar() {
    // toggle sidebar in and off from user's screen
    $('#sidebar-container').toggleClass('toggle-side-bar');
    // animate/move chevron icon (sidebar button) accordingly
    $('#toggle-sidebar-button').toggleClass('animate-toggle-sidebar-button');
  }

});
