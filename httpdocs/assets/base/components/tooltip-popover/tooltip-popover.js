/* ========================================================================
 * STAN Utils: Tooltip Popovers
 * Author: Andrew Womersley
 * ========================================================================*/

$(function() {

  'use strict';

  // Declare id;
  var id;

  // Auto init BS tooltips
  $('.sa-tooltip').each(function() {

    id = 'tooltip' + Math.floor((Math.random() * 10000));

    $(this).attr({
      id: id,
      'data-container': '#' + id
    }).tooltip();

  });

  // Auto init BS popovers
  $('.sa-popover').each(function() {

    id = 'popover' + Math.floor((Math.random() * 10000));

    $(this).attr({
      id: id,
      'data-container': '#' + id
    }).popover();

  });

  $('body').on('mouseover', '.tooltip', function() {

    $(this).removeClass('left right');
    $(this).addClass('center');

    var $h = $(this).closest('.tooltip-holder');

    if (!$h.length) {
      $h = $('html');
    }

    var holderOffsetLeft = $h.offset().left;
    var holderOffsetRight = $h.offset().left + $h.outerWidth();

    var $t = $(this).find('.inner');
    var offsetLeft = $t.offset().left;
    var offsetRight = $t.offset().left + $t.outerWidth();

    if (offsetLeft < holderOffsetLeft) {
      $(this).addClass('left');
      $(this).removeClass('center');
    } else if (offsetRight > holderOffsetRight) {
      $(this).addClass('right');
      $(this).removeClass('center');
    }

  });

});
