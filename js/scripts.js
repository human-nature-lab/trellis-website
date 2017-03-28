$( window ).load(function() {
  $('body').scrollspy({ target: '.tr-nav-top' });

  $(window).scroll(function(event) {
    var scrollPixels = $(window).scrollTop();
    //console.log("window height", $(window).height());
    var scrollRatio = .15;
    // Fade nav to black
    $('.navbar-default').css("background-color", "rgba(0, 0, 0, " + Math.min(1, scrollPixels/($(window).height()-115))) + ")";

    // Fade active menu item to orange
    //$('#trellis .navbar-default .navbar-nav > .active > a').css("opacity", Math.min(1, scrollPixels/$(window).height()));

    // Add parallax effect
    $('.parallax').each(function(i, e){
      var scrollTop = $(window).scrollTop();
      var scrollBottom = scrollTop + $(window).height();
      var elementTop = $(e).offset().top;
      var elementBottom = elementTop + $(e).height();
      if (elementTop <= scrollBottom && elementBottom >= scrollTop) {
        //console.log("i", i);
        //console.log("scrollTop", scrollTop);
        //console.log("elementTop", elementTop);
        var cssTop = (0.2 * (elementTop - scrollTop));
        console.log("cssTop", cssTop);
        $(e).css("top", cssTop  + "px");
      }
    });
    /*$('.parallax').css("background-position", "0 -" + (scrollPixels * scrollRatio) + "px");*/
    //$('.parallax').css("top", "-" + (scrollPixels * scrollRatio) + "px");
  });

  /*
  $('video').on('ended', function () {
    this.load();
    this.play();
  });
  */

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

  // Extend setInterval to allow for immediate execution
  var originalSetInterval = window.setInterval;

  window.setInterval = function(fn, delay, runImmediately) {
    if(runImmediately) fn();
    return originalSetInterval(fn, delay);
  };

  // Force appear events on page load
  $.force_appear();
});
