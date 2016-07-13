(function($, $STAN) {

  'use strict';

  var props, fixPosition, scroll, iOS;

  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
    iOS = true;
  } else {
    iOS = false;
  }

  $STAN.parafixedInit = function($t, id) {

    var spacerID = 'parafixed-spacer-' + id;

    $t.after('<div id="' + spacerID + '" class="parafixed-spacer"></div>');

    $t.attr('data-spacer', '#' + spacerID);

    $STAN.trigger('parafixed.init', $t);
    $STAN.parafixedSetProps($t);

  };

  $STAN.parafixedResetProps = function($t) {

    $t.removeClass('fixed').removeAttr('style');
    $($t.attr('data-spacer')).removeAttr('style');

  };

  $STAN.parafixedSetProps = function($t) {

    fixPosition = !!$t.attr('data-fix-position') ? parseInt($t.attr('data-fix-position')) : $t.offset().top;

    props = {
      width: $t.width(),
      height: $t.outerHeight(),
      top: fixPosition,
      left: $t.offset().left,
      offsettop: $t.offset().top
    };

    $t.data('parafixed', props);

  };

  $STAN.parafixedCheckProps = function($t) {

    props = $t.data('parafixed');

    scroll = props.offsettop - $(window).scrollTop();

    if (scroll <= props.top && !iOS) {

      $t.addClass('fixed').css(props);

      $($t.attr('data-spacer')).css({
        'display': 'block',
        'margin-top': props.height + 'px'
      });

    } else {

      $STAN.parafixedResetProps($t);

    }


  };

  $STAN.parafixedResize = function($t) {

    $STAN.parafixedResetProps($t);
    $STAN.trigger('parafixed.reset', $t);
    $STAN.parafixedSetProps($t);
    $STAN.parafixedCheckProps($t);

  };

  $STAN.parafixedSlowScroll = function($t) {

    scroll = $(window).scrollTop() / 2;

    $t.find('.slow-scroll').css('transform', 'translateY(-' + scroll + 'px)');

  };

  // Scroll
  $(window).scroll(function() {

    $('.parafixed').each(function() {

      $STAN.parafixedCheckProps($(this));
      $STAN.parafixedSlowScroll($(this));

    });

  });

  // Resize
  $STAN.on('window.resize stan.ready', function() {

    $('.parafixed').each(function() {

      $STAN.parafixedResize($(this));

    });

  });

  // Initialise
  $('.parafixed').each(function(index) {

    $STAN.parafixedInit($(this), index);

  });

}(jQuery, $STAN));
