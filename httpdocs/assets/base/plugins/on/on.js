(function($, $STAN) {

	'use strict';

	var params;

	// Define Methods
	var methods = {

		init: function(trigger, callback) {

			// Iterate Through Selectors
			return this.each(function(index) {

				var $this = $(this);

				$STAN.on(trigger, function(object) {

					if ($this.is(object)) {
						callback.apply(null, arguments);
					}

				});


			});

		}

	};

	$.fn.On = function(method) {

		if (methods[method]) {

			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

		} else {

			return methods.init.apply(this, arguments);

		}

	};

}(jQuery, $STAN));
