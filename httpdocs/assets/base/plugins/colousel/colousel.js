/* ========================================================================
 * STAN Utils: Colousel
 * Author: Andrew Womersley
 * ======================================================================== */

(function($, $STAN) {

  'use strict';

  // Define Global Vars
  var Selectors = [];
  var width, offset, index, newIndex;

  // Resize Listener for resizing slideshow height
  $STAN.on('window.resize colousel.resize', function() {

    if (!Selectors.length) return;

    $(Selectors).each(function() {

      // Resize check
      methods.resize.apply(this);

    });

  });


  // Click Listeners
  $(window).ready(function() {

    // Next
    $("[data-toggle='colousel.next']").click(function() {

      var target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this).parents('.colousel');

      return methods.next.apply(target);

    });

    // Prev
    $("[data-toggle='colousel.prev']").click(function() {

      var target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this).parents('.colousel');

      return methods.prev.apply(target);

    });

    // Set Index
    $("[data-toggle='colousel.set']").click(function() {

      var target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this).parents('.colousel');

      return methods.setIndex.apply(target, [parseInt($(this).attr('data-index'))]);

    });

  });


  // Define Methods
  var methods = {

    init: function(options) {

      // Iterate Through Selectors
      return this.each(function(index) {

        // Save selector in array
        Selectors.push($(this));

        // Set this
        var $this = $(this);

        // Set Options
        var settings = $.extend({
          selector: '.colousel-col',
          easing: 'linear',
          duration: 300,
          single: false,
          gutter: 35,
          total: 0,
          index: 0,
          offset: 0,
          action: false
        }, options);

        // Save settings
        $this.data('Colousel', settings);

        // Get total
        settings.total = $this.find(settings.selector).length - 1;

        // Check the passed index is valid
        settings.index = methods.checkIndex.apply($this, [settings.index]);


        // Add load events
        $this.find('img').load(function() {

          methods.resize.apply($this);

        });

        // Do resize
        methods.resize.apply($this);

        // Add Classes
        methods.addClasses.apply($this);

      });

    },

    next: function() {

      var settings = $(this).data('Colousel');

      var $this = $(this);

      if (settings.single) {
        newIndex = settings.index + 1;
      } else {

        if (methods.lastInView.apply($this)) {
          newIndex = settings.index;
        } else {
          $this.find(settings.selector).each(function(index) {

            if ((settings.offset + $this.width()) >= ($(this).offset().left - settings.gutter)) {
              newIndex = index;
            }

          });
        }

      }

      methods.setIndex.apply($this, [newIndex]);

    },

    prev: function() {

      var settings = $(this).data('Colousel');

      var $this = $(this);

      if (settings.single) {
        newIndex = settings.index - 1;
      } else {

        $this.find(settings.selector).each(function(index) {

          if (($(this).offset().left + $this.width()) >= (settings.offset - settings.gutter)) {
            newIndex = index;
            return false;
          }

        });

      }

      methods.setIndex.apply($this, [newIndex]);

    },

    setIndex: function(index) {

      var settings = $(this).data('Colousel');

      var $this = $(this);

      if (!settings.action) {

        settings.action = true;

        settings.index = methods.checkIndex.apply($this, [index]);

        methods.move.apply($this, [settings.duration]);

      }

    },

    move: function(duration) {

      // Load settings
      var settings = $(this).data('Colousel');

      // Normalise this
      var $this = $(this);

      // Get offset
      offset = methods.getIndexOffset.apply($this);

      // Move
      $this.find(".colousel-inner").animate({
        left: offset + "px"
      }, duration, settings.easing, function() {
        settings.offset = $this.find(settings.selector + ":eq(" + settings.index + ")").offset().left;
        settings.action = false;
        methods.addClasses.apply($this);
      });


    },

    resize: function() {

      // Load settings
      var settings = $(this).data('Colousel');

      // Normalise this
      var $this = $(this);

      settings.scrollLeft = $this.find(".colousel-mask").scrollLeft();

      var $last = $this.find(".colousel-col:last-child");

      $last.removeAttr('style');

      // Set inner width
      width = 0;
      $this.find(".colousel-inner").css({
        width: '',
        left: 0
      });
      $this.find(settings.selector).css('width', '');
      $this.find(settings.selector).each(function() {
        width += $(this).outerWidth(true);
        $(this).width($(this).width());
      });

      $last.css({
        'width': $last.outerWidth() - 15,
        'padding-right': 0
      });
      $this.find(".colousel-inner").css('width', width - 40);

      // Set colousel height
      $this.find(".colousel-mask").height($this.find(".colousel-inner").height());

      // Reposition
      if ($STAN.desktop) {
        methods.move.apply($this, [0]);
      } else {
        $this.find(".colousel-mask").scrollLeft(settings.scrollLeft);
      }

      $STAN.trigger('colousel.resized', $this, settings);

    },

    checkIndex: function(index) {

      // Load settings
      var settings = $(this).data('Colousel');

      // Normalise this
      var $this = $(this);

      if (index <= 0) {
        index = 0;
      }

      if (index >= settings.total) {
        index = settings.total;
      }

      return index;

    },

    addClasses: function() {

      // Load settings
      var settings = $(this).data('Colousel');

      // Normalise this
      var $this = $(this);

      $this.removeClass("colousel-start colousel-end");

      if (settings.index == 0) {
        $this.addClass("colousel-start");
      }

      if (settings.single) {
        if (settings.index == settings.total) {
          $this.addClass("colousel-end");
        }
      } else {

        if (methods.lastInView.apply($this)) {
          $this.addClass("colousel-end");
        }

      }

    },

    lastInView: function() {

      // Load settings
      var settings = $(this).data('Colousel');

      // Normalise this
      var $this = $(this);

      offset = $this.find(settings.selector + ":eq(" + settings.total + ")").offset().left;
      width = $this.find(settings.selector + ":eq(" + settings.total + ")").outerWidth(true);

      if ((settings.offset + $this.width()) >= (offset + width - settings.gutter)) {
        return true;
      } else {
        return false;
      }

    },

    getIndexOffset: function() {

      // Load settings
      var settings = $(this).data('Colousel');

      // Normalise this
      var $this = $(this);

      // Get offset
      offset = 0;
      $this.find(settings.selector).each(function(index) {
        if (index < settings.index) {
          offset += $(this).outerWidth(true);
        }
      });

      return offset * -1;

    }

  };

  $.fn.Colousel = function(method) {

    if (methods[method]) {

      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

    } else if (typeof method === 'object' || !method) {

      return methods.init.apply(this, arguments);

    } else {

      $.error('Method ' + method + ' does not exist on jQuery.Datatable');

    }

  };

}(jQuery, $STAN));
