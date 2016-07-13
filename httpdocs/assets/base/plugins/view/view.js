(function($, $STAN) {

  'use strict';

  var params;

  // Click Listeners
  $(window).ready(function() {

    // Delete
    $("body").on("click", "[data-toggle='view.load'] a", function(event) {

      event.preventDefault();

      $(this).closest("[data-toggle='view.load']").find('a').removeClass('active');
      $(this).addClass('active');

      var target = !!$(this).closest("[data-toggle='view.load']").attr('data-target') ? $($(this).closest("[data-toggle='view.load']").attr('data-target')) : $(this).parents(
        '[data-view-holder]');

      methods.load.apply(target, [$(this).attr('href'), $(this).text(), true]);

      return false;

    });

  });

  $(window).load(function() {

    $("[data-view-load]").each(function() {

      var index = $(this).attr('data-view-load');

      var $this = $(this).find('a').eq(index);

      $(this).find('a').removeClass('active');
      $this.addClass('active');

      var target = $(this).closest("[data-toggle='view.load']").attr('data-target') || $(this).parents('[data-view-holder]');

      methods.load.apply(target, [$this.attr('href'), $this.text(), false]);

    });

  });

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
          current_url: $this.attr('data-url') || false,
          current_title: $this.attr('data-title') || false,
          callback: false,
        }, options);

        // Save settings
        $this.data('View', settings);


        // Add to history
        if (settings.current_url && settings.current_title) {
          //methods.addHistory.apply($(this));
        }


      });

    },

    addHistory: function(historyMethod, url) {

      var settings = $(this).data('View');

      var data = {
        url: url,
        title: url,
        target: '[data-view-holder]',
        plugin: 'View',
        method: 'loadHistory',
        args1: url,
        args2: settings.current_title
      };

      console.log(data);

      $STAN.history(historyMethod, data);

    },

    loadHistory: function(url, title) {

      var settings = $(this).data('View');

      $('[data-toggle="view.load"]').find('a').removeClass('active');

      $('[data-toggle="view.load"]').find('[href="' + url + '"]').addClass('active');

      methods.load.apply($(this), [url, title, false]);

    },

    load: function(url, title, addToHistory) {

      var settings = $(this).data('View');

      if (addToHistory) {
        methods.addHistory.apply($(this), ['replace', settings.current_url]);
      }

      settings.current_url = url;
      settings.current_title = title;

      if (addToHistory) {
        methods.addHistory.apply($(this), ['push', settings.current_url]);
      }

      var $this = $(this);

      params = {
        ajax: 1
      };

      $this.height($this.height());

      $this.empty();

      $('.view-loading').fadeIn(1);

      $this.load(url, params, function() {

        $('.view-loading').fadeOut(100);

        if (settings.callback) {
          settings.callback($this, settings);
        }



        $this.css('height', 'auto');

      });

    }

  };

  $.fn.View = function(method) {

    if (methods[method]) {

      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

    } else if (typeof method === 'object' || !method) {

      return methods.init.apply(this, arguments);

    } else {

      $.error('Method ' + method + ' does not exist on jQuery.Datatable');

    }

  };

}(jQuery, $STAN));
