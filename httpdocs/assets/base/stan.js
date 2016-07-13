/* ========================================================================
 * STAN Utils: Stan
 * Author: Andrew Womersley
 * ======================================================================== */

(function($STAN, CustomConfig) {

  'use strict';

  var Tag = !!CustomConfig.tag ? CustomConfig.tag : 'body';

  var Config = [

    {
      device: 'xs',
      min_width: 0,
      max_width: 768,
      classes: 'device-xs mobile',
      data: {
        mobile: true,
        desktop: false
      }
    }, {
      device: 'sm',
      min_width: 768,
      max_width: 992,
      classes: 'device-sm mobile',
      data: {
        mobile: true,
        desktop: false
      }
    }, {
      device: 'md',
      min_width: 992,
      max_width: 1200,
      classes: 'device-md desktop',
      data: {
        mobile: false,
        desktop: true
      }
    }, {
      device: 'lg',
      min_width: 1200,
      max_width: 9999,
      classes: 'device-lg desktop',
      data: {
        mobile: false,
        desktop: true
      }
    }

  ];

  // Merge Config with CustomConfig
  for (var i in Config) {
    if (typeof CustomConfig[i] === 'object') Config[i] = $.extend(Config[i], CustomConfig[i]);
  }

  var _STAN = function() { //deferTrigger

    var device;
    var current_device;
    var triggers = [];
    var x;
    var bp;
    var ww;
    var wh;

    // Loop through breakpoints - reset data
    for (device in Config) {

      bp = Config[device];

      // Remove classes - moved below
      $(Tag).removeClass(bp.classes);

      // Remove data attributes
      for (x in bp.data) $STAN[x] = false;

    }

    current_device = $STAN.device;

    // Loop through breakpoints - set data
    for (device in Config) {

      bp = Config[device];

      ww = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      wh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

      $STAN.windowWidth = ww;
      $STAN.windowHeight = wh;

      if (bp.min_width <= ww && ww < bp.max_width) {

        // Add class
        $(Tag).addClass(bp.classes);

        if (current_device != bp.device) triggers.push({
          type: 'active',
          device: bp.device
        });

        // Add attributes
        $STAN.device = bp.device;
        $STAN.classes = bp.classes;
        for (x in bp.data) $STAN[x] = bp.data[x];

        document.cookie = 'stanDevice=' + $STAN.device + '; path=/';

      } else {

        if (current_device == bp.device) triggers.push({
          type: 'deactive',
          device: bp.device
        });

      }

    }

    $STAN.Tag = Tag;


    // Init triggers
    for (var i in triggers) {
      var trigger = triggers[i];
      $STAN.trigger('breakpoint.' + trigger.type, trigger.device);
    }

  };

  var _STAN_Resize = function() {

    var ww = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var wh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    if (ww != $STAN.windowWidth || wh != $STAN.windowHeight) {

      _STAN();
      $STAN.trigger('window.resize');

    }

  };

  // Set resize listener
  var timer;
  $(window).on('resize orientationchange', function() {
    window.clearTimeout(timer);
    timer = window.setTimeout(_STAN_Resize, 100);
  });

  $(window).load(function() {

    $STAN.trigger('stan.loaded');

  });

  $(window).scroll(function() {

    $STAN.trigger('stan.scroll');

  });

  // Run
  _STAN();


})($STAN, ((typeof $STAN_Config === 'undefined') ? [] : $STAN_Config));
