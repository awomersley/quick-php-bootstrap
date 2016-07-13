/* ========================================================================
 * STAN Utils: Popup
 * Author: Andrew Womersley
 * ======================================================================== */

(function($, $STAN) {

	'use strict';

	// Define Global Vars
	var Selectors = [];

	$STAN.on('window.resize popup.resize', function() {

		if (!Selectors.length) return;

		$(Selectors).each(function() {

			// Resize check
			methods.resize.apply(this);

		});

	});

	// Click Listeners
	$(window).ready(function() {

		// Show
		$('body').on("click", "[data-toggle='popup.show']", function() {

			var src = !!$(this).attr('data-src') ? $(this).attr('data-src') : $(this).attr('href');

			methods.set_src.apply($($(this).attr('data-target')), [src]);

			var width = $(this).attr('data-width') || false;
			var height = $(this).attr('data-height') || false;

			if (width && height) {
				methods.set_size.apply($($(this).attr('data-target')), [width, height]);
			}

			return methods.show.apply($($(this).attr('data-target')), [true]);

		});

		// Hide
		$('body').on("click", "[data-toggle='popup.hide']", function() {

			var target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this).parents('.popup');

			return methods.hide.apply(target);

		});

		// Toggle
		$('body').on("click", "[data-toggle='popup.toggle']", function() {

			var src = !!$(this).attr('data-src') ? $(this).attr('data-src') : $(this).attr('href');

			methods.set_src.apply($($(this).attr('data-target')), [src]);

			return methods.toggle.apply($($(this).attr('data-target')));

		});

	});


	// Define Methods
	var methods = {

		init: function(options) {

			// Save selector in array
			$(this.selector).each(function() {

				Selectors.push($(this));

			});

			var selector = this.selector;

			// Iterate Through Selectors
			return this.each(function(index) {

				// Set this
				var $this = $(this);

				// Set Options
				var settings = $.extend({
					selector: selector,
					type: 'html',
					src: 'about:blank',
					location: window.location.pathname,
					history: true,
					width: 200,
					height: 300,
					gutter: 15,
					open: false,
					auto_reopen: true,
					lock_aspect_ratio: true,
					scroll: true,
					closeOnMaskClick: true,
					callback: false,
					devices: {
						xs: true,
						sm: true,
						md: true,
						lg: true
					}
				}, options);

				// Set id
				if ($this.attr('id')) {
					settings.id = "#" + $this.attr('id');
				} else {
					settings.id = settings.selector;
				}

				// Turn history off for older browsers
				if (!$STAN.has('history')) {
					settings.history = false;
				}


				// Unlock aspect ratio for variable heights
				if (settings.height == 'auto') settings.lock_aspect_ratio = false;

				// Save settings
				$this.data('PopUp', settings);

				// Scroll settings
				var _scroll = (settings.scroll) ? 'yes' : 'no';
				var _class = (settings.scroll) ? '' : 'no-scroll';


				// Set HTML/iFrame/Classes
				if (settings.type == 'iframe') {

					$this.find('.popup-content').addClass('no-scroll');
					$this.find('.popup-content').html("<iframe src='about:blank' class='" + _class + "' style='width:100%;height:100%;' seamless frameborder='0' scrolling='" + _scroll +
						"'></iframe>");

				} else {

					$this.find('.popup-content').addClass(_class);

				}

				// Set close listener
				var closeListeners = '[data-toggle="popup-close"]';
				if (settings.closeOnMaskClick) closeListeners += ', .popup-mask';
				$this.find(closeListeners).click(function(event) {

					methods.hide.apply($this);
					event.stopPropagation();
					return false;

				});

				// Show if open and allowed on current device
				if (settings.open && settings.devices[$('body').attr('data-current-device')]) {

					$(this).css('display', 'block');

				}

				$this.on('resize.sa.popup', function() {
					methods.resize.apply($(this));
				});

				// Do resize
				methods.resize.apply(this);


			});

		},

		addHistory: function(historyMethod, src, pluginMethod) {

			var settings = $(this).data('PopUp');

			if (settings.history) {

				var data = {
					url: src,
					title: src,
					target: settings.id,
					plugin: 'PopUp',
					method: pluginMethod,
					args1: false
				};

				$STAN.history(historyMethod, data);

			}

		},

		show: function(setBack) {

			var settings = $(this).data('PopUp');

			var $this = $(this);

			if (settings.open && setBack) {
				settings.back = true;
			}

			if (settings.devices[$STAN.device]) {

				// Add history
				methods.addHistory.apply($this, ['replace', settings.location, 'doHide']);
				methods.addHistory.apply($this, ['push', settings.location + '#popup', 'show']);

				if (settings.type == 'ajax') {

					// Load ajax content
					$(this).find('.popup-content').css('display', 'none');
					$(this).find('.popup-content').load(settings.src, function() {

						$(this).css('display', 'block');

						methods.resize.apply($this);

						// callback
						if (settings.callback) {
							settings.callback();
						}

					});

				} else {

					if (settings.type == 'iframe') {

						// Set iFrame source
						$(this).find('iframe').attr('src', settings.src);

					}

					// Trigger
					$STAN.trigger('popup.show', $this, settings);

					// callback
					if (settings.callback) {
						settings.callback();
					}

				}

				if (!settings.open) {

					// Display Popup
					$(this).css({
						display: 'block',
						opacity: 0
					}).animate({
						opacity: 1
					}, 300);

				}

				// Do resize
				methods.resize.apply(this);

				// Set open to true
				settings.open = true;

				// Return false to stop default action
				return false;

			} else {

				// Return true to allow default action
				return true;

			}

			//} else {

			//return false;

			//}

		},

		hide: function() {

			var settings = $(this).data('PopUp');

			if (settings.back) {

				methods.set_src.apply($(this), [settings.src_back]);
				methods.show.apply($(this), [false]);
				settings.back = false;

			} else if (settings.open) {

				if (settings.history) {
					history.back();
				} else {
					methods.doHide.apply($(this));
				}
			}

			// Return false to stop default action
			return false;

		},

		doHide: function() {

			var settings = $(this).data('PopUp');

			// Close Popup
			$(this).animate({
				opacity: 0
			}, 300, function() {
				$(this).css('display', 'none');
			});

			// Unset iFrame src
			if (settings.type == 'iframe') {
				$(this).find('iframe').attr('src', 'about:blank');
			} else if (settings.type == 'ajax') {
				$(this).find('.popup-content').empty();
			}

			// Set open to false
			settings.open = false;

			// Trigger
			$STAN.trigger('popup.hide', $(this), settings);

		},

		toggle: function(src) {

			var settings = $(this).data('PopUp');

			if (settings.open) return methods.hide.apply(this);
			else return methods.show.apply(this, [src]);

		},

		resize: function() {

			var settings = $(this).data('PopUp');

			var $this = $(this);

			$(this).css({
				width: $STAN.windowWidth + 'px',
				height: $STAN.windowHeight + 'px'
			});

			// Resize to fit
			var w = $(window).width() - (2 * settings.gutter);
			var h = $(window).height() - (2 * settings.gutter);

			var scrollTop = $(this).find('.popup-content').scrollTop();

			var titleHeight = $(this).find('.popup-title').outerHeight() || 0;

			if (settings.height == 'auto') {

				$(this).find('.popup-scroll').css({
					'padding-top': '',
				});

				$(this).find('.popup-content').css({
					'margin-top': 0,
					'height': '100%'
				});

				$(this).find('.popup-display').css('height', 'auto');

				var ah = $(this).find('.popup-display').outerHeight();

				ah = ah + titleHeight;

				if (h > ah) h = ah;

			} else {
				if (h > settings.height) h = settings.height;
			}

			if (w > settings.width) w = settings.width;

			if (settings.lock_aspect_ratio) {
				if ((w / h) > (settings.width / settings.height)) w = settings.width * (h / settings.height);
				else h = settings.height * (w / settings.width);
			}

			$(this).find('.popup-display').css({
				width: w + 'px',
				height: h + 'px',
				marginTop: '-' + (h / 2) + 'px',
				marginLeft: '-' + (w / 2) + 'px'
			});

			if (titleHeight) {
				$(this).find('.popup-scroll').css({
					'padding-top': titleHeight + 'px',
				});
			} else {
				$(this).find('.popup-scroll').css({
					'padding-top': 0,
				});
			}

			$(this).find('.popup-content').scrollTop(scrollTop);

			// Check if device has changed
			if (!settings.devices[$STAN.device] && settings.open) {
				settings.reopen = true;
				methods.hide.apply(this);
			} else if (settings.devices[$STAN.device] && settings.reopen && settings.auto_reopen) {
				settings.reopen = false;
				methods.show.apply(this);
			}

			if (h < 20) {
				setTimeout(function() {
					methods.resize.apply($this);
				}, 50);
			}

		},

		set_src: function(src) {

			var settings = $(this).data('PopUp');

			if (src) {
				settings.src_back = settings.src;
				settings.src = src;
			}

			return $(this);

		},

		set_size: function(width, height) {

			var settings = $(this).data('PopUp');

			settings.width = width;
			settings.height = height;

			return $(this);

		}

	};

	$.fn.PopUp = function(method) {

		if (methods[method]) {

			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

		} else if (typeof method === 'object' || !method) {

			return methods.init.apply(this, arguments);

		} else {

			$.error('Method ' + method + ' does not exist on jQuery.Datatable');

		}

	};

}(jQuery, $STAN));
