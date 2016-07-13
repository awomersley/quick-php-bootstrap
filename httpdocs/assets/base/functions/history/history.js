/* ========================================================================
 * STAN Utils: History
 * Author: Andrew Womersley
 * ======================================================================== */

(function($, $STAN) {

  'use strict';

  // Normalise the history.state object for when its not set or for when browsers don't support it
  $STAN.setState = function() {

    $STAN.state = history.state || {
      url: ''
    };

  };

  $STAN.setState();

  $STAN.history = function(method, data) {

    if ($STAN.has('history')) {

      var url = history.state ? history.state.url : false;

      history[method + "State"](data, data.title, data.url);

      $STAN.setState();

    }

  };

  if ($STAN.has('history')) {

    window.addEventListener('popstate', function(event) {

      var data = event.state;

      if (data) {

        var target = data.target;

        var plugin = data.plugin;

        var method = data.method;

        var pre_trigger = data.pre_trigger;

        var post_trigger = data.post_trigger;

        // Pre trigger
        if (pre_trigger) {
          if (target) {
            $STAN.trigger(pre_trigger, $(target), data);
          } else {
            $STAN.trigger(pre_trigger, data);
          }
        }

        // Call the plugin method on target
        if (target && plugin && method) {
          $(target)[plugin](method, data.args1, data.args2, data.args3);
        }

        // Post trigger
        if (post_trigger) {
          $STAN.trigger(post_trigger, data);
        }

      }

      $STAN.setState();

    });

  };

}(jQuery, $STAN));
