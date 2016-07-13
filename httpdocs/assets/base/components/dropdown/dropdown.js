/* ========================================================================
 * STAN Utils: Dropdown
 * Author: Andrew Womersley
 * ======================================================================== */

(function() {

  'use strict';

  var width, subnav, pad;

  var _event = $STAN.has('touch') ? 'touchstart' : 'click';

  $("body").on(_event, ".sa-dropdown a", function(event) {

    event.stopPropagation();
    return true;

  });

  $("body").on(_event, ".sa-dropdown", function(event) {

    if ($(this).hasClass('active')) {

      if (!$STAN.has('touch')) {
        $('.sa-dropdown').removeClass('active');
      }

    } else {

      $('.sa-dropdown').removeClass('active');
      $(this).addClass('active');

      /*width = 0;
      subnav = $(this).find('ul');


      pad = subnav.outerWidth() - subnav.width();

      subnav.css('width', '1000px')
        .children('li').css('display', 'inline-block');

      subnav.children('li').each(function() {

        if ($(this).outerWidth() > width) width = $(this).outerWidth();

      });

      width = width + pad;

      subnav.css('width', '')
        .children('li').css('display', '');

      if (width > subnav.outerWidth()) subnav.css('width', (width + 5) + 'px');
      else if (width < $(this).outerWidth()) subnav.css('width', $(this).outerWidth() + 'px');*/

      $STAN.subNavWidths($(this).find('nav'), 1, 1);

      // Check for value and auto scroll content div
      var val = $(this).find(".dropdown-value").val();
      if (val) {
        $(this).find(".dropdown-content").scrollTop(0);
        $(this).find(".dropdown-content").scrollTop($(this).find('[data-value="' + val + '"]').position().top);
      }

    }

    event.stopPropagation();
    if (!$STAN.has('touch')) {
      return false;
    }

  });

  $('[data-set-title].sa-dropdown').each(function() {

    var val = '';

    $(this).find('li.active a').each(function() {

      var active = $(this).contents().get(0);

      if (val) val = val + ', ';

      val = val + active.nodeValue;

    });

    if (val) $(this).find('.module-title span').text(val);

  });

  $("body").on(_event, "[data-set-value].sa-dropdown a", function() {

    $(this).closest('.sa-dropdown').find(".dropdown-value").val($(this).attr('data-value'));

  });


  $('body').on(_event, function() {

    $('.sa-dropdown').removeClass('active');

  });

})();
