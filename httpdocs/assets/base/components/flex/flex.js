/* ========================================================================
 * STAN Utils: Flex
 * Author: Andrew Womersley
 * ======================================================================== */

(function($, $STAN) {

  'use strict';

  var totalWidth, scaleWidth, scaleCells;

  $STAN.flex = function() {

    $('.sa-flex').each(function() {

      totalWidth = scaleWidth = Math.floor($(this)[0].getBoundingClientRect().width);

      $(this).find('[data-flex="scale"]').width('auto');

      $(this).find('.flex').each(function() {

        if ($(this).attr('data-flex') == 'fixed') {
          $(this).width($(this).outerWidth());
          scaleWidth -= Math.ceil($(this).outerWidth(true));
        }

      });

      scaleCells = $(this).find('[data-flex="scale"]');

      if (scaleCells.length) {
        scaleWidth = Math.floor(scaleWidth / scaleCells.length);
        scaleCells.width(scaleWidth);
      }

    });

  }

  $STAN.on('window.resize', $STAN.flex);

  window.onload = $STAN.flex;

}(jQuery, $STAN));
