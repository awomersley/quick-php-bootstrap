/* ========================================================================
 * STAN Utils: Slider
 * Author: Andrew Womersley
 * ======================================================================== */

(function($, $STAN) {

  'use strict';

  // Define Global Vars
  var Selectors = [];

  // Resize Listener for resizing slideshow height
  $STAN.on('window.resize slider.resize', function() {

    if (!Selectors.length) return;

    $(Selectors).each(function() {

      // Resize check
      methods.resize.apply(this);

    });

  });

  // Click Listeners
  $(window).ready(function() {

    // Set
    $("body").on("click", "[data-toggle='slider.set']", function() {

      var target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this).parents('.slider');

      return methods.set.apply(target, [$(this).attr('data-index')]);

    });

    // Next
    $("body").on("click", "[data-toggle='slider.next']", function() {

      var target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this).parents('.slider');

      methods.move.apply(target, ['next', true]);

    });

    // Prev
    $("body").on("click", "[data-toggle='slider.prev']", function() {

      var target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this).parents('.slider');

      methods.move.apply(target, ['prev', true]);

    });

    // Autoplay set
    $("body").on("click", "[data-toggle='slider.autoplay-set']", function() {

      var target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this).parents('.slider');

      methods.setAutoplay.apply(target, [true]);

    });

    // Autoplay clear
    $("body").on("click", "[data-toggle='slider.autoplay-clear']", function() {

      var target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this).parents('.slider');

      methods.clearAutoplay.apply(target);

    });

  });


  // Define Methods
  var methods = {

    init: function(options) {

      // Add selector to options
      options.selector = this.selector;

      // Iterate Through Selectors
      return this.each(function(index) {

        // Save selector in array
        Selectors.push($(this));

        // Set this
        var $this = $(this);
        var i, layer;

        // Set Options
        var settings = $.extend({
          height: false,
          ratio: false,
          activeIndex: 0,
          autoplay: false,
          autoplay_break_on_click: true,
          autoplay_delay: 5000,
          layers: [],
          currentIndex: 0,
          nextIndex: 0,
          prevIndex: 0,
          preLoadIndex: 1
        }, options);

        settings.action = settings.timer = settings.animationLength = false;

        // Save settings
        $this.data('Slider', settings);

        // Set aspect ratio type
        if (settings.height) settings.height_type = 'fixed';
        else if (settings.ratio) settings.height_type = 'ratio';
        else settings.height_type = 'auto';

        // Set total
        settings.total = $this.find('.frame').length;
        $this.find("[data-role='slider.counter'] .total").text(settings.total);

        // Show controls if more than 1 frame
        if (settings.total > 1) {

          $this.find("[data-toggle='slider.next']").css('display', 'block');
          $("[data-target='" + settings.selector + "'][data-toggle='slider.next']").css('display', 'block');

          $this.find("[data-toggle='slider.prev']").css('display', 'block');
          $("[data-target='" + settings.selector + "'][data-toggle='slider.prev']").css('display', 'block');

          $this.find("[data-role='slider.navigation']").css('display', 'block');
          $("[data-target='" + settings.selector + "'][data-role='slider.navigation']").css('display', 'block');

          $this.find("[data-role='slider.counter']").css('display', 'block');
          $("[data-target='" + settings.selector + "'][data-role='slider.counter']").css('display', 'block');

        }

        // Load defered images
        //methods.loadDeferedImages.apply($this);


        // Set currentIndex
        //settings.currentIndex = settings.nextIndex = settings.activeIndex;

        // Layers
        for (i in settings.layers) {

          layer = $.extend({
            baseCSS: {},
            inCSS: {},
            inDelay: 0,
            inDuration: 300,
            inEasing: 'linear',
            outCSS: {},
            outDelay: 0,
            outDuration: 300,
            outEasing: 'linear',
            external: false,
            reverse_for_prev: false,
            selector: []
          }, settings.layers[i]);


          // set layer selector
          if (layer.external) {

            layer.selector = $("[data-target='" + settings.selector + "'].layer" + i);

          } else {

            layer.selector = $this.find('.layer' + i);

          }

          // set layer to full width and height if slide show is fixed height
          //if (settings.aspect_ratio == 'variable') layer.selector.addClass('fill-frame');

          // set layer presets
          if (layer.presetCSS == 'fade') {

            layer.baseCSS = {
              opacity: 0
            };
            layer.inCSS = {
              opacity: 1
            };
            layer.outCSS = {
              opacity: 0
            };

          } else if (layer.presetCSS == 'slide') {

            layer.baseCSS = {
              left: '100%'
            };
            layer.inCSS = {
              left: 0
            };
            layer.outCSS = {
              left: '-100%'
            };

            layer.reverse_for_prev = true;

            layer.selector.addClass('absolute');

          }

          // set animationLength
          if ((layer.inDelay + layer.inDuration) > settings.animationLength) {
            settings.animationLength = layer.inDelay + layer.inDuration;
          }

          // apply base css
          $(layer.selector).css(layer.baseCSS);

          // save layer data base to settings
          settings.layers[i] = layer;

        }

        // Set dot buttons if navigation container is empty
        if (!$this.find("[data-role='slider.navigation']").html()) {
          for (i = 0; i < settings.total; i++) {
            $this.find("[data-role='slider.navigation']").append('<span data-toggle="slider.set" data-index="' + i + '"></span>');
          }
        }

        // Add load events
        $this.find('img').load(function() {

          methods.resize.apply($this);

        });

        // Update active indexes
        methods.animate_complete.apply($this);

        $this.find('.frame').css('display', 'block');

        // Do resize
        methods.resize.apply(this);

        $this.css({
          visibility: 'visible'
        });

        $this.find('.frame').eq(settings.activeIndex).css({
          'z-index': 20
        });

        for (var i in settings.layers) {

          $(settings.layers[i].selector).eq(settings.activeIndex).css(settings.layers[i].inCSS);

        }


      });

    },

    next: function() {

      var $this = $(this);

      methods.move.apply($this, ['next', true]);

    },

    prev: function() {

      var $this = $(this);

      methods.move.apply($this, ['prev', true]);

    },

    move: function(direction, isClick) {

      // Get settings and set this
      var settings = $(this).data('Slider');
      var $this = $(this);

      // Check slider is not currently in action
      if (!settings.action) {

        // Set action to true
        settings.action = true;

        // Clear autoplay
        clearTimeout(settings.timer);
        if (settings.autoplay_break_on_click && isClick) methods.clearAutoplay.apply($this);

        // Set Indexes
        methods.setNextIndex.apply($this, [direction]);
        methods.setPreLoadIndex.apply($this, [direction]);

        // Animate
        methods.animate.apply($this, [direction]);

      }

    },

    setNextIndex: function(direction) {

      var settings = $(this).data('Slider');

      if (direction == 'next') {

        settings.nextIndex = settings.currentIndex + 1;
        if (settings.nextIndex == settings.total) settings.nextIndex = 0;

      } else {

        settings.nextIndex = settings.currentIndex - 1;
        if (settings.nextIndex < 0) settings.nextIndex = settings.total - 1;

      }

    },

    setPreLoadIndex: function(direction) {

      var settings = $(this).data('Slider');

      if (direction == 'next') {

        settings.preLoadIndex = settings.nextIndex + 1;
        if (settings.preLoadIndex == settings.total) settings.preLoadIndex = 0;

      } else {

        settings.preLoadIndex = settings.nextIndex - 1;
        if (settings.preLoadIndex < 0) settings.preLoadIndex = settings.total - 1;

      }

    },

    set: function(index) {

      // Get settings and set this
      var settings = $(this).data('Slider');
      var $this = $(this);
      var direction;


      // Check slider is not currently in action
      if (!settings.action && index != settings.currentIndex) {

        // Set action to true
        settings.action = true;

        // Clear autoplay
        clearTimeout(settings.timer);
        if (settings.autoplay_break_on_click) methods.clearAutoplay.apply($this);

        // Set direction
        direction = (index > settings.currentIndex) ? 'next' : 'prev';

        // Set nextIndex
        settings.nextIndex = parseInt(index);
        methods.setPreLoadIndex.apply($this, [direction]);

        // Animate
        methods.animate.apply($this, [direction]);

      } else {

        methods.loadDeferedImages.apply($this);
      }

      return $this;

    },

    loadDeferedImages: function() {

      var settings = $(this).data('Slider');

      var $next = $(this).find('.frame').eq(settings.nextIndex);
      var $preload = $(this).find('.frame').eq(settings.preLoadIndex);

      $next.find('.bgr-img').addClass('defer');
      $preload.find('.bgr-img').addClass('defer');

      //$STAN.loadDeferedImages($next);
      //$STAN.loadDeferedImages($preload);

      return $(this);

    },

    animate: function(direction) {

      // Get settings and set this
      var settings = $(this).data('Slider');
      var $this = $(this);
      var i, layer, cssPreMove, cssPostMove;
      var next = [];
      var current = [];

      // Tigger pre move event
      $STAN.trigger('slider.pre-move', $this, settings);

      // Remove active classes
      $this.find("[data-toggle='slider.set']").removeClass('active');
      $("[data-target='" + settings.selector + "'][data-toggle='slider.set']").removeClass('active');

      // Get frames
      var $next = $this.find('.frame').eq(settings.nextIndex);
      var $current = $this.find('.frame').eq(settings.currentIndex);

      // Load defered images
      methods.loadDeferedImages.apply($this);

      // Set CSS for next/current frames
      $current.css({
        'z-index': 10
      });
      $next.css({
        'z-index': 20
      });

      // Animate layers
      for (i in settings.layers) {

        layer = settings.layers[i];

        // Set Pre/Post CSS dependant on direction
        if (layer.reverse_for_prev) {
          cssPreMove = (direction == 'next') ? layer.baseCSS : layer.outCSS;
          cssPostMove = (direction == 'next') ? layer.outCSS : layer.baseCSS;
        } else {
          cssPreMove = layer.baseCSS;
          cssPostMove = layer.outCSS;
        }


        // get next
        next[i] = $(layer.selector).eq(settings.nextIndex);
        current[i] = $(layer.selector).eq(settings.currentIndex);

        // Set next CSS and animate
        current[i].delay(layer.outDelay).animate(cssPostMove, layer.outDuration, layer.outEasing);
        next[i].css(cssPreMove);
        next[i].delay(layer.inDelay).animate(layer.inCSS, layer.inDuration, layer.inEasing);

      }

      // Set post animation timeout
      setTimeout(function() {

        // Animation complete
        methods.animate_complete.apply($this);

        // Tigger post move event
        $STAN.trigger('slider.post-move', $this, settings);

      }, 1); //settings.animationLength

    },

    animate_complete: function() {

      // Get settings and set this
      var settings = $(this).data('Slider');
      var $this = $(this);

      // Update indexes
      settings.prevIndex = settings.currentIndex;
      settings.currentIndex = settings.nextIndex;

      // Add/remove active classes
      $this.find('.frame')
        .removeClass('active')
        .eq(settings.nextIndex).addClass('active');

      // Update counter
      $this.find("[data-role='slider.counter'] .current").text(settings.currentIndex + 1);

      // Add active classes
      $this.find("[data-toggle='slider.set'][data-index='" + settings.currentIndex + "']").addClass('active');
      $("[data-target='" + settings.selector + "'][data-toggle='slider.set'][data-index='" + settings.currentIndex + "']").addClass('active');

      // Set Timer
      methods.setAutoplay.apply($this, [false]);

      // Set action to false
      settings.action = false;

    },

    setAutoplay: function(setAutoPlay) {

      var settings = $(this).data('Slider');
      var $this = $(this);
      var delay = 1;

      if (setAutoPlay && !settings.autoplay) {

        // Turn autoplay on
        settings.autoplay = true;

        // Trigger event
        $STAN.trigger('slider.autoplay-set', $this, settings);

      } else {
        delay = settings.autoplay_delay;
      }

      if (settings.autoplay && settings.total > 1) {

        // Set active class on clear
        $this.find("[data-toggle='slider.autoplay-clear']").addClass('active');
        $("[data-target='" + settings.selector + "'][data-toggle='slider.autoplay-clear']").addClass('active');

        // Remove active classes from set
        $this.find("[data-toggle='slider.autoplay-set']").removeClass('active');
        $("[data-target='" + settings.selector + "'][data-toggle='slider.autoplay-set']").removeClass('active');

        settings.timer = setTimeout(function() {

          methods.move.apply($this, ['next', false]);

        }, delay);

      } else {

        methods.clearAutoplay.apply($this);

      }

    },

    clearAutoplay: function() {

      var settings = $(this).data('Slider');
      var $this = $(this);

      if (settings.autoplay) {

        // Trigger event
        $STAN.trigger('slider.autoplay-clear', $this, settings);

      }

      if (settings.total > 1) {

        // Set active class on set
        $this.find("[data-toggle='slider.autoplay-set']").addClass('active');
        $("[data-target='" + settings.selector + "'][data-toggle='slider.autoplay-set']").addClass('active');

        // Remove active classes from clear
        $this.find("[data-toggle='slider.autoplay-clear']").removeClass('active');
        $("[data-target='" + settings.selector + "'][data-toggle='slider.autoplay-clear']").removeClass('active');

      }

      settings.autoplay = false;

      clearTimeout(settings.timer);

    },

    resize: function() {

      // Get settings and set this
      var settings = $(this).data('Slider');
      var $this = $(this);

      if (!settings) return;

      // Set vars to hold frame height
      var fh = 0;
      var h;

      // Perform size fixes
      if (settings.height_type == 'auto') {

        $this.find('.frame').css({
          height: 'auto'
        });

        // Get height of frames
        $this.find('.frame').each(function() {
          if ($(this).children().outerHeight(true) > fh) fh = $(this).children().outerHeight(true);
          if ($(this).height() > fh) fh = $(this).height();
        });


        // Set height of frames
        $this.find('.frame').css({
          height: fh + 'px'
        }).parent().closest('div').css({
          height: fh + 'px'
        });

        if (fh < 1) {
          setTimeout(function() {
            methods.resize.apply($this);
          }, 50);
        }

      } else if (settings.height_type == 'ratio') {

        // Get device hieght
        var ratio = settings.ratio[$STAN.device] || settings.ratio;

        // Set height based on width ratio
        h = $this.width() / parseFloat(ratio);

        // Set height of main slider
        $this.css('height', h);

        // Set height of frames
        $this.find('.frame').css({
          height: h
        }).parent().closest('div').css({
          height: h
        });

      } else if (settings.height_type == 'fixed') {

        // Get device hieght
        var height = settings.height[$STAN.device] || settings.height;

        if (typeof height === "function") {

          h = height();

        } else if (!isNaN(parseFloat(height)) && isFinite(height)) { // is number

          h = parseInt(height);

        } else if (height.indexOf('%') > 0) {

          h = height

        }

        // Set height of main slider
        $this.css('height', h);

        // Set height of frames
        $this.find('.frame').css({
          height: h
        }).parent().closest('div').css({
          height: h
        });

      }

      $STAN.trigger('slider.resized', $this, settings);

    },

    getSettings: function() {

      var settings = $(this).data('Slider');

      return settings;

    }

  };

  $.fn.Slider = function(method) {

    if (methods[method]) {

      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

    } else if (typeof method === 'object' || !method) {

      return methods.init.apply(this, arguments);

    } else {

      $.error('Method ' + method + ' does not exist on jQuery.Datatable');

    }

  };

}(jQuery, $STAN));
