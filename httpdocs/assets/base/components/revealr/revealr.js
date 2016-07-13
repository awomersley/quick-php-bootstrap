/* ========================================================================
 * STAN Utils: ImgBox
 * Author: Andrew Womersley
 * ======================================================================== */

(function($, $STAN) {

  'use strict';

  $('.revealr .reveal').click(function() {
    var $p = $(this).parent();
    $p.addClass('revealed');
  });

}(jQuery, $STAN));
