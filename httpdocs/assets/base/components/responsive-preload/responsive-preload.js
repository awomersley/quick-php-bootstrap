/* ========================================================================
 * STAN Utils: Responsive Preload
 * Author: Andrew Womersley
 * ======================================================================== */

(function($, $STAN) {

  'use strict';

  var image;

  $STAN.responsiveImages = function() {

    $("[data-resp-img='true']").each(function() {

      var src = $(this).attr('data-base') + $(this).attr('data-' + $STAN.device);

      if ($(this).attr('scroll-src')) {
        $(this).attr('scroll-src', src);
      } else if ($(this).attr('defer-src')) {
        $(this).attr('defer-src', src);
      } else if ($(this).attr('delay-src')) {
        $(this).attr('delay-src', src);
      } else {
        setImageSrc($(this), src);
      }

    });

  };

  $STAN.loadDelayedImages = function() {

    $("[delay-src]").each(function() {

      if ($(this).attr('delay-src')) {
        setImageSrc($(this), $(this).attr('delay-src'));
        $(this).attr('delay-src', '');
      }

    });

    $('.bgr-img').addClass('delay');

  };

  $STAN.loadDeferedImages = function($target) {

    $target.find("[defer-src]").each(function() {

      if ($(this).attr('defer-src')) {
        setImageSrc($(this), $(this).attr('defer-src'));
        $(this).attr('defer-src', '');
      }

    });

  };

  $STAN.loadScrollImages = function() {

    var offset = -100; //($('header').height() + 0) * -1;

    $("img[scroll-src]").each(function() {

      if ($(this).attr('scroll-src') && $STAN.inView($(this).parent(), offset)) {
        $(this).attr('src', $(this).attr('scroll-src'))
          .removeAttr('scroll-src')
          .load(function() {
            $(this).addClass('active');
          });
      }

    });

    $(".bgr-img:not(.scroll)").each(function() {

      if ($STAN.inView($(this), offset)) {
        $(this).addClass('scroll');
        image = new Image();
        image.obj = $(this);
        image.onload = function() {
          this.obj.addClass('active');
          this.remove();
        }
        image.src = $(this).css('background-image').slice(4, -1).replace(/"/g, "");
      }

    });

  };

  $STAN.inView = function($e, offset) {


    var windowBtm = $(window).scrollTop() + $(window).height();

    var elementTop = $e.offset().top;

    if ((windowBtm + offset) >= elementTop) return true;
    else return false;

  };

  var setImageSrc = function($img, src) {

    $img.attr('src', src);

  };

  $(".load-defered-img").click(function() {

    var $target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this);

    $STAN.loadDeferedImages($target);

  });

  $(window).on('scroll', function() {
    $STAN.loadScrollImages();
  });

  $STAN.on('breakpoint.active', $STAN.responsiveImages);

  $STAN.responsiveImages();
  $STAN.loadDelayedImages();

}(jQuery, $STAN));
