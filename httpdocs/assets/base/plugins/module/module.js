(function($, $STAN) {

  'use strict';

  var params;

  // Define Methods
  var methods = {

    init: function(options) {

      var _this = this;

      // Iterate Through Selectors
      return this.each(function(index) {

        // Set this
        var $this = $(this);

        // Set Options
        var settings = $.extend({
          url: $this.attr('data-endpoint'),
          selector: false,
          callback: false,
          autoload: false,
        }, options);

        // Save settings
        $this.data('Module', settings);

        // Autoload
        if (settings.autoload) {
          methods.refresh.apply($this);
        }

      });

    },

    setEndpoint: function(url) {

      var settings = $(this).data('Module');

      settings.url = url;

      return $(this);

    },

    refresh: function() {

      var settings = $(this).data('Module');

      var holder = settings.selector ? $(this).find(settings.selector) : $(this);

      holder.load(settings.url, function() {

        if (settings.callback) {
          settings.callback(settings);
        }

      });

    }

  };

  $.fn.Module = function(method) {

    if (methods[method]) {

      if (typeof this.data('Module') !== 'undefined') {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      }

    } else if (typeof method === 'object' || !method) {

      return methods.init.apply(this, arguments);

    } else {

      $.error('Method ' + method + ' does not exist on jQuery.Datatable');

    }

  };

}(jQuery, $STAN));
