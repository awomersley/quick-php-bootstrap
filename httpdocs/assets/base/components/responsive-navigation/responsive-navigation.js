(function() {

  'use strict';

  var navType, width, $t;

  var openMobile = function() {

    $('.responsive-nav').attr('data-open', 1);

    $('.responsive-nav-load').addClass('active');
    $('.responsive-nav-load i').text('clear');

    if (navType == 'drop') {
      //$('.responsive-nav nav').collapse('show');
    } else {
      //$('.responsive-nav').addClass('active transition-sm');
    }

    $('.responsive-nav-mask, .header-mask, .responsive-nav').css({
      display: 'block',
      opacity: 0
    }).animate({
      opacity: 1
    }, 200, "swing");

  };

  var closeMobile = function() {

    $('.responsive-nav').attr('data-open', 0);

    $('.responsive-nav-load').removeClass('active');
    $('.responsive-nav-load i').text('menu');

    if (navType == 'drop') {
      //$('.responsive-nav nav').collapse('hide');
    } else {
      //$('.responsive-nav').removeClass('active');
    }

    $('.responsive-nav-mask, .header-mask, .responsive-nav').animate({
      opacity: 0
    }, 200, "swing", function() {
      $('.responsive-nav-mask, .header-mask,  .responsive-nav').css('display', 'none');
    });

  };

  var viewPort = function() {

    var w = $STAN.windowWidth;
    var h = $STAN.windowHeight;
    var breakpoint = (typeof $('.responsive-nav').attr('data-breakpoint') !== 'undefined') ? $('.responsive-nav').attr('data-breakpoint') : 992;

    $('.responsive-nav').removeClass('desktop mobile transition-sm');

    if (w < breakpoint) {

      if ($('.responsive-nav').attr('data-open') != '1') {

        $('.responsive-nav').addClass('mobile').css({
          opacity: 0,
          display: 'none'
        });

      }

      $('.responsive-nav-mask').css({
        height: h - $('header').height() + 'px',
        top: $('header').height() + 'px'
      });


      $('.responsive-nav nav>ul').css({
        "max-height": h - $('header').height() - 74 + 'px'
      });



    } else {

      $('.responsive-nav').attr('data-open', 0).addClass('desktop').css({
        opacity: 1,
        display: 'block'
      });

      $('.responsive-nav-mask, .header-mask').css('display', 'none');
      $('.responsive-nav-load').removeClass('active');
      $('.responsive-nav-load i').text('menu');

      if (navType == 'drop') {

        //$('.responsive-nav nav').addClass('in').css({
        //  height: ''
        //});

      } else {

        //responsive-nav nav>ul').css({
        //  "height": "auto"
        //});

      }

    }

  };

  $(window).on('orientationchange', function() {

    if ($('.responsive-nav').attr('data-open') == '1') closeMobile();

  });


  $STAN.on('window.resize', function() {

    viewPort();

  });

  $('.responsive-nav-load').click(function(event) {

    if ($('.responsive-nav').attr('data-open') == '1') {
      closeMobile();
    } else {
      openMobile();
    }

    event.stopPropagation();

  });

  $('.responsive-nav-mask, .header-mask').click(function(event) {

    closeMobile();

    event.stopPropagation();

  });


  if ($('.responsive-nav').hasClass('nav-drop')) {
    navType = 'drop';
  } else {
    navType = 'slide';
  }

  viewPort();

})();
