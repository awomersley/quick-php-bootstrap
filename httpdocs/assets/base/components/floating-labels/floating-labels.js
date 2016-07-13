/* ========================================================================
 * STAN Utils: Floating Labels
 * Author: Andrew Womersley
 * ======================================================================== */

$(function() {

  'use strict';

  function initFloatingLabels() {

    $('.float-label input, .float-label textarea').each(function() {

      if ($(this).val()) {
        $(this).closest('.float-label').addClass('has-value');
      }

    });

    setTimeout(function() {
      $('.float-label').addClass('loaded');
    }, 50);

  }

  $('body').on('focus', '.float-label input, .float-label textarea', function() {

    $(this).closest('.float-label').addClass('focused');

  }).on('blur', '.float-label input, .float-label textarea', function() {

    var $par = $(this).closest('.float-label');

    $par.removeClass('focused');

    if ($(this).val()) {
      $par.addClass('has-value');
    } else {
      $par.removeClass('has-value');
    }

  });

  $('body').on('click', '.float-label label', function() {

    $(this).closest('.float-label').addClass('focused').find('input').focus();

  });

  $STAN.on('floating-labels.init', function() {
    initFloatingLabels();
  }).trigger('floating-labels.init');

});
