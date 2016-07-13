/* ========================================================================
 * STAN Utils: Scroll Spy
 * Author: Andrew Womersley
 * ======================================================================== */


(function($, $STAN) {

  'use strict';

  var $t, scrollAt, scrollPos, scrollClass, reverse;

  $STAN.scrollSpy = function($t) {

    scrollAt = $t.attr('data-scroll-spy');

    reverse = $t.attr('data-reverse');

    if (scrollAt == 'inview') {
      scrollAt = $t.offset().top - $(window).height() + 100;
    } else if (isNaN(scrollAt)) {
      scrollAt = eval(scrollAt);
    } else {
      scrollAt = parseInt(scrollAt);
    }

    scrollPos = $(window).scrollTop();

    scrollClass = $t.attr('data-scroll-class') || 'active';

    if (scrollPos > scrollAt) {

      if (reverse) {
        $t.removeClass(scrollClass);
      } else {
        $t.addClass(scrollClass);
      }


    } else {

      if (reverse) {
        $t.addClass(scrollClass);
      } else {
        $t.removeClass(scrollClass);
      }

    }

  }

  // Add listeners
  $STAN.on('stan.ready stan.scroll', function() {

    $('[data-scroll-spy]').each(function() {

      $STAN.scrollSpy($(this));

    });

  });


}(jQuery, $STAN));
