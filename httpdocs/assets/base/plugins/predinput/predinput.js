/* ========================================================================
 * STAN Utils: PredInput
 * Author: Andrew Womersley
 * ======================================================================== */

(function($, $STAN) {

	'use strict';

	$('body').on('click', '.pred-tag .tag-clear', function() { //

		var target = $(this).closest('.predinput');

		$(this).parent().remove();

		methods.updateTags.apply(target);

	});

	// Define Methods
	var methods = {

		init: function(options) {

			// Iterate Through Selectors
			return this.each(function(index) {

				// Set this
				var $this = $(this);

				// Set Options
				var settings = $.extend({

					search_url: '',
					http_request: 'GET',
					data: [],
					searching: false,
					showTags: false,
					results_open: false,
					exact_only: false,
					empty_search: false

				}, options);

				// Save settings
				$this.data('Predinput', settings);

				// Turn off autocomplete on input box
				$this.find('input').attr('autocomplete', 'none');

				// Add Key press listeners
				$this.find('input').keyup(function(event) {

					methods.keyup.apply($this, [event]);

				});

				// Stop return from submitting the form
				$this.find('input').keydown(function(event) {

					if (event.keyCode == 13 && settings.results_open) {
						event.preventDefault();
					}

				});

				// Clear search
				$this.find('.clear-icon').click(function(event) {

					$this.find('input').val('');
					$(this).css('display', 'none');
					//methods.hide_results.apply($this);
					$this.find('input').focus();
					methods.pre_search.apply($this);

					// Trigger
					$STAN.trigger('predinput.clear', $this);

					event.stopPropagation();

				});

				// Stop propagtion on click
				$this.find('input').click(function(event) {

					methods.pre_search.apply($this);
					event.stopPropagation();

				});

				// Hide when off click
				$('body').click(function() {

					methods.hide_results.apply($this);

				});

				if (settings.showTags) {
					methods.updateTags.apply($this);
				}

			});

		},

		keyup: function(e) {

			// Load settings
			var settings = $(this).data('Predinput');

			// Set objects
			var $this = $(this);
			var $res = $(this).find('.results');

			// Check for down, up and return keys
			if (e.keyCode == 40 || e.keyCode == 38) {

				// Get current index
				var index = parseInt($res.find('ul').attr('data-index'));

				if (e.keyCode == 40) { // down

					index++;
					if (index == $res.find('ul li.active').length) index--;

				} else if (e.keyCode == 38) { // up

					index--;
					if (index < 0) index = 0;

				}

				// Save index
				$res.find('ul').attr('data-index', index);

				// Get object for current index
				var $index = $res.find('ul [data-index=' + index + ']');

				settings.index = $index;

				// Remove active class
				$res.find('ul li').removeClass('selected');

				// Add active class to
				if (!$index.hasClass('disabled')) {

					$index.addClass('selected');

					// Set search string
					$this.find("input[type=text]").val($index.attr('data-text') || $index.text());
					$this.find("input[type=hidden]").val($index.attr('data-id'));

				}

			} else if (e.keyCode == 13) {

				if (settings.index) {
					if (settings.index.attr('data-submit') == '1') {
						$this.closest('form').submit();
					}
				}

				if ((settings.exact_only && settings.index) || !settings.exact_only) {

					methods.hide_results.apply($this);

					if (settings.showTags) {
						methods.addTag.apply($this);
					}

					settings.index = false;

					// Trigger
					$STAN.trigger('predinput.select', $this, settings);

				}

			} else {

				methods.pre_search.apply($this);

			}

		},

		pre_search: function() {

			// Load settings
			var settings = $(this).data('Predinput');

			if ($(this).find('input').val()) {
				$(this).find('.clear-icon').css('display', 'block');
			} else {
				$(this).find('.clear-icon').css('display', 'none');
			}

			if ($(this).find('input').val()) {
				if (!settings.searching) {
					settings.searching = true;
					methods.search.apply($(this));
				} else {
					settings.search_again = true;
				}
			} else {
				methods.hide_results.apply($(this));
			}

		},

		search: function() {

			// Load settings
			var settings = $(this).data('Predinput');

			// Set objects
			var $this = $(this);
			var $res = $(this).find('.results');

			// Clear results HTML
			//$('.predinput .results').css('display', 'none');
			$res.html('').addClass('active');

			$this.find("input[type=hidden]").val('');

			// Do seach
			$.ajax({

				url: settings.search_url,
				cache: false,
				type: settings.http_request,
				data: {
					search: $(this).find('input').val(),
					tags: $(this).find('textarea').val(),
					data: JSON.stringify(settings.data)
				}

			}).done(function(results) {

				$res.html(results);

				settings.index = false;

				$res.find('ul').attr('data-index', '-1');

				$res.find('li.active').each(function(index) {
					$(this).attr('data-index', index);
				});

				$res.find('li:not(.disabled)').mouseover(function() {
					$(this).siblings().removeClass('selected');
					$(this).addClass('selected');
					$(this).parent().attr('data-index', $(this).attr('data-index'));
				});

				$res.find('li:not(.disabled)').click(function() {

					$this.find("input[type=text]").val($(this).attr('data-text') || $(this).text());
					$this.find("input[type=hidden]").val($(this).attr('data-id'));
					methods.hide_results.apply($this);

					if ($(this).attr('data-submit') == '1') {
						$this.closest('form').submit();
					}

					if (settings.showTags) {
						methods.addTag.apply($this);
					}

					// Trigger
					$STAN.trigger('predinput.select', $this, settings);

				});

				settings.results_open = true;

				settings.searching = false;

				if (settings.search_again) {
					settings.search_again = false;
					settings.searching = true;
					methods.search.apply($this);
				}

			});



		},

		hide_results: function() {

			var settings = $(this).data('Predinput');

			$(this).find('.results').removeClass('active');

			if (settings) {
				settings.results_open = false;
			}

		},

		addTag: function() {

			var settings = $(this).data('Predinput');

			var html = "<div class='pred-tag' data-value='" + $(this).find("input[type=hidden]").val() + "'>" + $(this).find("input[type=text]").val() +
				"<i class='sprite sprite-white icon-xs icon-clear sprite-grey-hover tag-clear'></i></div>";

			$(this).find('.tags').prepend(html);

			$(this).find("input[type=hidden]").val("");
			$(this).find("input[type=text]").val("");

			methods.updateTags.apply($(this));


		},

		updateTags: function() {

			var settings = $(this).data('Predinput');

			var $this = $(this);

			var val = '';

			$(this).find('.pred-tag').each(function() {

				val = val + $(this).attr('data-value') + ",";

			});

			$(this).find("textarea").val(val);

			$STAN.trigger('predinput.tags', $this);

		}

	};

	$.fn.Predinput = function(method) {

		if (methods[method]) {

			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));

		} else if (typeof method === 'object' || !method) {

			return methods.init.apply(this, arguments);

		} else {

			$.error('Method ' + method + ' does not exist on jQuery.Datatable');

		}

	};

}(jQuery, $STAN));
