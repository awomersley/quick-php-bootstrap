(function() {

  $("a[href^='tel:']").click(function() {
    if ($STAN.desktop) {
      return false;
    } else {
      return true;
    }
  });

  $STAN.on('stan.loaded window.resize', function() {

    $('.mobile-scroll').each(function() {

      width = 0;

      $(this).width(10000);

      $(this).find('ul').css({
        width: 'auto',
        display: 'inline-block'
      });

      width = $(this).find("ul").width() + 1;

      $(this).find("ul").width(width);

      $(this).css('width', '');

    });

  });

})();
