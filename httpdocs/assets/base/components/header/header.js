(function($, $STAN) {

  'use strict';

  // Declare vars
  var config, $h, $p, hh, ph, st;

  // Set header object
  $h = $('header');

  // Config
  config = {
    stick: $h.attr('data-stick') != '0' ? true : false,
    stick_mobile: $h.attr('data-stick') != 'desktop' ? true : false,
    stick_desktop: $h.attr('data-stick') != 'mobile' ? true : false,
    shrink: $h.attr('data-shrink') != '0' ? true : false,
    shrink_max_height: parseInt($h.attr('data-max-height')),
    shrink_min_height: parseInt($h.attr('data-min-height')),
    cta: false,
  };



  /*
   * Stick header
   */
  $STAN.headerStick = function() {

    if (($STAN.desktop && config.stick_desktop) || ($STAN.mobile && config.stick_mobile)) {
      $h.addClass('header-stuck');
      ph = $h.outerHeight();
    } else {
      $h.removeClass('header-stuck');
      ph = '0';
    }

    if (!config.shrink) {
      $p.height(ph);
    }

  };


  /*
   * Shrink header
   */
  $STAN.headerShrink = function() {

    // Shrink header
    if ($STAN.desktop) {

      ph = config.shrink_max_height;

      hh = config.shrink_max_height - (st / 3);

      if (hh < config.shrink_min_height) hh = config.shrink_min_height;

    } else {

      hh = ph = config.shrink_min_height;


    }

    hh = Math.floor(hh);
    if (hh % 2) hh = hh + 1;

    $h.height(hh);
    $('.set-nav-height .level1').css('line-height', 'inherit');
    $('.desktop .set-nav-height .level1').css('line-height', hh + 'px');
    $p.height(ph);

    // Hide unwanted parts
    if (st > 5) {
      $('.header-hide').addClass('do-hide');
    } else {
      $('.header-hide').removeClass('do-hide');
    }

  };


  /*
   * Header CTA bar
   */
  $STAN.headerCTA = function() {

    /*var st = $(window).scrollTop();

		var hh = $('header').height();

		var $t = $('.scroll-cta');

		if (st > hh && $t.attr('data-open') != '1') {
			$t.attr('data-open', '1').stop(true).animate({
				top: 0
			}, 300);
		} else if (st < hh && $t.attr('data-open') == '1') {
			$t.attr('data-open', '0').stop(true).animate({
				top: '-65px'
			}, 200);
		}*/

  };


  // Scroll listener
  $(window).scroll(function() {

    st = $(window).scrollTop();

    if (config.shrink) {
      $STAN.headerShrink();
    }

  });


  // Resize listener
  $STAN.on('window.resize stan.ready', function() {

    if (config.stick) {
      $STAN.headerStick();
    }

    if (config.shrink) {
      $STAN.headerShrink();
    }

  });


  // Init
  if (config.stick) {

    $h.after("<div class='header-placeholder'></div>");
    $p = $('.header-placeholder');

  }


}(jQuery, $STAN));
