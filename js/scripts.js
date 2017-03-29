var videoPlaying = [];

function startVideos() {
  // If videos are in the screen, start them, otherwise pause them
  $('video.tr-video').each(function(i, e){
    var scrollTop = $(window).scrollTop();
    var scrollBottom = scrollTop + $(window).height();
    var elementTop = $(e).parent().offset().top;
    var elementBottom = elementTop + $(e).parent().height();
    if (elementBottom > scrollTop && elementTop < scrollBottom) {
      var video = $(e).get(0);
      if (video.paused && !videoPlaying[i]) {
        videoPlaying[i] = true;
        video.play();
      }
    } else {
      var video = $(e).get(0);
      if (!video.paused && videoPlaying[i]) {
        videoPlaying[i] = false;
        video.pause();
      }
    }
  });
}

function fadeNav() {
  // Set nav to black if below Home section
  var opacity = 1.0;
  opacity = Math.min(1, $(window).scrollTop()/($(window).height()-115));

  // Set nav to transparent if below Contact section
  if (($(window).scrollTop() + $(window).height()) > $('#contact').offset().top) {
    opacity = 0.0;
  }

  $('.navbar-default').css("background-color", "rgba(0, 0, 0, " + opacity  + ")");

}

$( window ).load(function() {

  $('video').each(function(i) {
    videoPlaying[i] = false;
  });

  /*
  window.setInterval(function() {
    var count = 0;
    $('video.tr-video').each(function(i, e){
      if (! $(e).get(0).paused) { count++; }
    });
    console.log(count + " videos playing")
  }, 2000);
  */


  $('body').scrollspy({ target: '.tr-nav-top' });

  fadeNav();
  startVideos();

  $(window).scroll(function(event) {
    var scrollPixels = $(window).scrollTop();

    // Fade nav to black
    fadeNav();

    // Add parallax effect
    $('.parallax').each(function(i, e){
      var scrollTop = $(window).scrollTop();
      var scrollBottom = scrollTop + $(window).height();
      var elementTop = $(e).offset().top;
      var elementBottom = elementTop + $(e).height();
      if (elementTop <= scrollBottom && elementBottom >= scrollTop) {
        var cssTop = (0.1 * (elementTop - scrollTop));
        $(e).css("top", cssTop  + "px");
      }
    });

    // If videos are in the screen, start them, otherwise pause them
    startVideos();

  });

  // Smooth scrolling
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 115)
        }, 1000);
        return false;
      }
    }
  });

  // Modal video window functionality
  function modal_open($modal) {
    $('body').addClass('unscrollable');
    $modal.show();
  }

  function modal_close($modal) {
    $('body').removeClass('unscrollable');
    $modal.hide();
    // Play all videos that are visible
    startVideos();
  }

  $('.tr-play-button').on('click', function () {
    if ($('.modal .iframe iframe').length == 0) {

      // Pause all videos
      $('video.tr-video').each(function() {
        $(this).get(0).pause();
      });

      $('.modal .iframe').append('<iframe width="100%" height="100%" frameborder="0" src="https://www.youtube.com/embed/mcELgjVASwM?autoplay=1">');
    }
    modal_open($('.modal'));
  });

  $('.modal .control.close').on('click', function () {
    var $modal = $(this).parent();
    modal_close($modal);
    $modal.find('.iframe iframe').remove(); // TODO pause video instead
  });

  // Extend setInterval to allow for immediate execution
  var originalSetInterval = window.setInterval;

  window.setInterval = function(fn, delay, runImmediately) {
    if(runImmediately) fn();
    return originalSetInterval(fn, delay);
  };

  // Force appear events on page load
  $.force_appear();
});
