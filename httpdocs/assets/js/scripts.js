(function() {

  $(window).on('resize', function() {

    // Sticky footer
    $('.site').css('min-height', $(window).height() - $('.footer').outerHeight() + 'px');

  }).resize();


  $(window).load(function() {
    $STAN.trigger("fixedsize.init");
  });

  // Fixed Sizes
  $('.fix-height-holder').FixedSize({
    selector: ".fix-height"
  });


})();
