/* ========================================================================
 * STAN Utils: On / Off
 * Author: Andrew Womersley
 * ========================================================================*/

(function($, $STAN) {

  'use strict';

  var events = [];

  // Shortcut events
  $STAN.on = function(_events, _callback) {

    var _event = _events.split(" ");

    for (var x in _event) {

      if (!events[_event[x]]) {
        events[_event[x]] = [];
      }

      events[_event[x]].push(_callback);

    }

    return $STAN;

  };

  $STAN.trigger = function(_events) {

    var _event = _events.split(" ");

    for (var x in _event) {

      if (events[_event[x]]) {

        var args = Array.prototype.slice.call(arguments, 1);

        for (var z in events[_event[x]]) {
          $STAN.event = _event[x];
          events[_event[x]][z].apply(null, args);
        }

      }

    }

    return $STAN;

  };

  $STAN.triggerData = function($element) {

    if ($element.attr("data-trigger")) {
      $STAN.trigger($element.attr("data-trigger"));
    }

  };

}(jQuery, $STAN));
