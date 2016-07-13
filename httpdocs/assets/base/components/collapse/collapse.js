/* ========================================================================
 * STAN Utils: Collapse
 * Author: Andrew Womersley
 * ======================================================================== */

(function($, $STAN) {

  'use strict';

  // Add click
  $('body').on('click', '.sa-collapse .sa-click', function() {

    $STAN.collapse($(this));

  });

  $STAN.collapse = function($t) {

    if (!$t.closest('.sa-collapse').hasClass('inactive')) {

      if ($t.closest('.sa-collapse').hasClass('active')) {

        $t.closest('.sa-collapse').removeClass('active')
          .find('.collapse-content').first().collapse('hide');
      } else {

        $t.closest('.sa-collapse').addClass('active')
          .find('.collapse-content').first().collapse('show');

      }

      if ($t.parents('.sa-accordion').length) {

        $t.closest('.sa-collapse').siblings('.sa-collapse.active').each(function() {

          $(this).removeClass('active')
            .find('.collapse-content').first().collapse('hide');

        });

      }

    }

  }

  function collapseInit() {

    // Add BS collapse class
    $('.sa-collapse .collapse-content').each(function() {

      $(this).addClass('collapse');

    });

    // Check for collapses starting open
    $('.sa-collapse.active').each(function() {

      $(this).find('.collapse-content').first().addClass('in');

    });

  }

  // Device dependant logic
  function collapseResize() {

    $('[data-collapse-devices]').each(function() {

      if ($(this).attr('data-collapse-devices') == 'all' || $(this).attr('data-collapse-devices').indexOf($STAN.device) >= 0) {

        $(this).removeClass('inactive');

        if ($(this).attr('data-collapse-devices-open')) {

          if ($(this).attr('data-collapse-devices-open') == 'all' || $(this).attr('data-collapse-devices-open').indexOf($STAN.device) >= 0) {
            $(this).addClass('active').find('.collapse-content').first().addClass('in').css('height', '');
          } else {
            $(this).removeClass('active').find('.collapse-content').first().removeClass('in').addClass('collapse');
          }

        } else {

          $(this).removeClass('active').find('.collapse-content').first().removeClass('in').addClass('collapse');

        }

      } else {

        $(this).addClass('inactive');
        $(this).removeClass('active').find('.collapse-content').first().addClass('in').removeClass('collapse').css('height', '');

      }

    });

  };

  $STAN.on('collapse.init', function() {
    collapseInit();
    collapseResize();
  }).trigger('collapse.init');

  $STAN.on('collapse.resize breakpoint.active', function() {
    collapseResize();
  }).trigger('collapse.resize');

}(jQuery, $STAN));
