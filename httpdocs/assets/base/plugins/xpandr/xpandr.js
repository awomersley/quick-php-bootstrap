(function($, $STAN) {

  'use strict';

  // Define Global Vars
  var Selectors = [];

  // Click Listeners
  $(window).ready(function() {

    // Show
    $("body").on("click", "[data-toggle='xpandr.show']", function(event) {

      var target = $(this).attr('data-target') || $(this).closest("[data-xpandr]");

      methods.show.apply(target);

      return false;

    });

    // Hide
    $("body").on("click", "[data-toggle='xpandr.hide']", function(event) {

      var target = $(this).attr('data-target') || $(this).closest("[data-xpandr]");

      methods.hide.apply(target);

      return false;

    });

    $("body").on("click", ".xpandr", function(event) {
      event.stopPropagation();
    });

  });

  $STAN.on('window.resize', function() {

    $("[data-xpandr]").each(function() {

      // Resize check
      methods.resize.apply(this);

    });

  });

  $('body').on('click', function() {

    $("[data-xpandr]").each(function() {

      // Resize check
      methods.hide.apply(this);

    });

  });

  // Define Methods
  var methods = {

    init: function(options) {

      var _this = this;

      // Iterate Through Selectors
      return this.each(function(index) {

        // Save selector in array
        Selectors.push($(this));

        // Set this
        var $this = $(this);

        // Set Options
        var settings = $.extend({
          width: 500,
          height: 500,
          gutter: 30,
          animationLength: 300,
          id: $this.attr('data-xpandr'),
          open: false,
          onShow: false,
          onHide: false
        }, options);

        // Save settings
        $this.data('Xpandr', settings);

        $this.addClass('xpandr xpandr-inactive');

      });

    },

    hide: function() {

      var settings = $(this).data('Xpandr');

      var $this = $(this);

      if (settings.open) {

        var css = methods.getCSS.apply($(this));

        $this.removeClass('xpandr-active').addClass('xpandr-inactive');

        $('.xpandr-holder-' + settings.id).remove();

        settings.open = false;

        $(this).animate({
          width: css.parentWidth + 'px',
          height: css.parentHeight + 'px',
          left: css.parentLeft + 'px',
          top: css.parentTop + 'px',
        }, settings.animationLength, function() {

          $this.css({
            width: 'auto',
            height: 'auto',
            left: 'auto',
            top: 'auto'
          });

          if (settings.onHide) {
            settings.onHide($this, settings);
          }

        });

      }

    },

    show: function() {

      var settings = $(this).data('Xpandr');

      var $this = $(this);

      if (!settings.open) {

        // Close any open xpandrs
        $("[data-xpandr]").each(function() {

          methods.hide.apply($(this));

        });

        settings.open = true;

        $(this).parent().prepend("<div class='xpandr-holder xpandr-holder-" + settings.id + "'></div>");
        $('.xpandr-holder-' + settings.id).css({
          height: $(this).outerHeight() + 'px',
          margin: $(this).css('margin')
        });

        var css = methods.getCSS.apply($(this));

        $(this).css({

          width: css.parentWidth + 'px',
          height: css.parentHeight + 'px',
          left: css.parentLeft + 'px',
          top: css.parentTop + 'px',

        }).animate({

          width: css.width + 'px',
          height: css.height + 'px',
          left: css.left + 'px',
          top: css.top + 'px',

        }, settings.animationLength, function() {

          $this.addClass('xpandr-active').removeClass('xpandr-inactive');

          if (settings.onShow) {
            settings.onShow($this, settings);
          }

        });

      }

    },

    getCSS: function() {

      var settings = $(this).data('Xpandr');

      var width = $STAN.windowWidth - settings.gutter;
      var height = $STAN.windowHeight - settings.gutter;

      if (settings.width < width) width = settings.width;
      if (settings.height < height) height = settings.height;

      settings.currentWidth = width;
      settings.currentHeight = height;

      var left = ($STAN.windowWidth - width) / 2;
      var top = ($STAN.windowHeight - height) / 2;

      var offset = $('.xpandr-holder-' + settings.id).offset();

      return {
        width: width,
        height: height,
        top: top,
        left: left,
        parentWidth: $('.xpandr-holder-' + settings.id).width(),
        parentHeight: $('.xpandr-holder-' + settings.id).height(),
        parentTop: offset.top - $(window).scrollTop(),
        parentLeft: offset.left,
      };

    },

    resize: function() {

      var settings = $(this).data('Xpandr');

      if (settings.open) {

        var css = methods.getCSS.apply($(this));

        $(this).css({
          width: css.width + 'px',
          height: css.height + 'px',
          left: css.left + 'px',
          top: css.top + 'px'
        });

      }

    }

  };

  $.fn.Xpandr = function(method) {

    if (methods[method]) {

      if (typeof this.data('Xpandr') !== 'undefined') {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      }

    } else if (typeof method === 'object' || !method) {

      return methods.init.apply(this, arguments);

    } else {

      $.error('Method ' + method + ' does not exist on jQuery.Datatable');

    }

  };

}(jQuery, $STAN));
