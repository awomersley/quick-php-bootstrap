/* ========================================================================
 * STAN Utils: Touch Hover
 * Author: Andrew Womersley
 * ======================================================================== */

$(function() {

  'use strict';

  var $this;

  if (!("ontouchstart" in document.documentElement)) {
    $('html').addClass('no-touch');
    $STAN.touch = false;
  } else {
    $('html').addClass('touch');
    $STAN.touch = true;
  }

  $('html:not(.no-touch) .touch-hover').bind('click touchend', function(event) {

    if ($(this).hasClass('hovered') || $(this).parent().hasClass('hovered')) {

      event.stopPropagation();
      return true;

    } else {

      $this = $(this).hasClass('hover-parent') ? $(this).parent() : $(this);

      $('.hovered').each(function() {
        if (!$(this).has($this).length) $(this).removeClass('hovered');
      });

      if ($this.find('.sa-collapse:not(.inactive)').length) {

        if ($this.find('.sa-collapse').hasClass('active')) {
          return true;
        } else {
          $STAN.collapse($this.find('.sa-click'));
          $this.addClass('hovered');
        }

      } else {
        $this.addClass('hovered');
      }


      event.preventDefault();
      event.stopPropagation();

    }

  });

  $('html').on("click touchend", ":not(.touch-hover)", function(event) {
    $('*').removeClass('hovered');
  });

});
