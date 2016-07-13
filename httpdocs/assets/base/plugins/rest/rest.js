(function($, $STAN) {

	'use strict';

	var params, postData, tmr;

	// Click Listeners
	$(window).ready(function() {

		// Load more
		$("body").on("click", "[data-toggle='rest.load']", function() {

			var target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this).parents("[data-toggle='rest-loader']");

			methods.loadMore.apply(target, [$(this).attr('data-page')]);

			return false;

		});

		// Filter
		$("body").on("click", "[data-toggle='rest.filter']", function() {

			var target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this).parents("[data-toggle='rest-loader']");

			return methods.filter.apply(target);

		});

		$("body").on("submit", "[data-toggle='rest.params']", function() {

			var target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this).parents("[data-toggle='rest-loader']");

			methods.filter.apply(target);

			return false;

		});

		$("body").on("keyup change", "[data-toggle='rest.livesearch']", function() {

			var target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this).parents("[data-toggle='rest-loader']");

			clearTimeout(tmr);

			tmr = setTimeout(function() {

				methods.filter.apply(target);

			}, 500);

			return false;

		});

		$("body").on("click", ".sa-checkbox[data-toggle='rest.livesearch']", function() {

			var target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this).parents("[data-toggle='rest-loader']");

			methods.filter.apply(target);

			return false;

		});


		// Order
		$("body").on("change", "[data-toggle='rest.order']", function() {

			var target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this).parents("[data-toggle='rest-loader']");

			return methods.filter.apply(target);

		});

		// Reset Filter
		$("body").on("click", "[data-toggle='rest.reset']", function() {

			var target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this).parents("[data-toggle='rest-loader']");

			return methods.resetFilter.apply(target);

		});

		// Delete
		$("body").on("click", "[data-toggle='rest.delete']", function() {

			var target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this).parents("[data-toggle='rest-loader']");

			return methods.delete.apply(target, [$(this).attr('data-id')]);

		});

		// Do Undo
		$("body").on("click", "[data-toggle='rest.undo']", function() {

			var target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this).parents("[data-toggle='rest-loader']");

			return methods.doUndo.apply(target);

		});

		// Hide Undo
		$("body").on("click", "[data-toggle='rest.hideundo']", function() {

			var target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this).parents("[data-toggle='rest-loader']");

			return methods.hideUndo.apply(target);

		});

		// Set end point
		$("body").on("click", "[data-toggle='rest.end-point']", function() {

			var target = !!$(this).attr('data-target') ? $($(this).attr('data-target')) : $(this).parents("[data-toggle='rest-loader']");

			methods.setEndpoint.apply(target, [$(this).attr('data-end-point')]);
			methods.refresh.apply(target);

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
					url: $this.attr('data-endpoint'),
					load: $this.attr('data-autoload') || 1,
					order: $this.attr('data-order') || '',
					start: parseInt($this.attr('data-start')) || 0,
					limit: parseInt($this.attr('data-limit')) || 10,
					params: $("[data-toggle='rest.params']"),
					total: 0,
					callback: false,
					page: 1
				}, options);

				// Save settings
				$this.data('RestLoader', settings);

				// Set data toggle attr
				$this.attr('data-toggle', 'rest-loader');

				// Get total
				//methods.getTotal.apply($this);

				$STAN.trigger('rest.init', $this, settings);

				// Auto load
				if (settings.load == '1') {
					methods.multi.apply($this);
				}

			});

		},

		update: function(id) {

			var settings = $(this).data('RestLoader');

			var $this = $(this);

			params = {
				rest_id: id,
				rest_method: "update"
			};

			$.post(settings.url, params, function(data) {

				$this.find('[data-item="' + id + '"]').html(data.return);

				if (settings.callback) {
					settings.callback();
				}

			}, 'json');

			return $(this);

		},


		delete: function(id) {

			var settings = $(this).data('RestLoader');

			var $this = $(this);

			params = {
				rest_id: id,
				rest_method: "delete"
			};

			$(this).find('.rest-updated').fadeIn(1);

			$.post(settings.url, params, function(data) {

				$this.find('.rest-updated').fadeOut(1);

				methods.showUndo.apply($this, [id]);

				settings.undo_index = $this.find('[data-item=' + id + ']').index();

				settings.undo_item = $this.find('[data-item=' + id + ']').detach();

				// set total
				settings.total = parseInt(data.total);
				methods.hideShowNoDataMessage.apply($this);
				methods.hideShowLoadMore.apply($this);

				settings.start--;

				if (settings.callback) {
					settings.callback();
				}

			}, 'json');

			return $(this);

		},


		resetFilter: function() {

			var settings = $(this).data('DataRest');

			// Reset inputs
			$(this).find("input[data-toggle='rest.param']").each(function() {
				$(this).val(' ');
			});

			// Reset selects
			$(this).find("select[data-toggle='rest.param']").each(function() {
				$(this)[0].selectedIndex = 0;
			});

			methods.filter.apply($(this));

		},

		setEndpoint: function(url) {

			var settings = $(this).data('RestLoader');

			settings.url = url;

			return $(this);

		},

		refresh: function() {

			var settings = $(this).data('RestLoader');

			settings.start = 0;
			settings.page = 1;

			methods.multi.apply($(this), ['html']);

			return $(this);

		},


		filter: function() {

			var settings = $(this).data('RestLoader');

			settings.start = 0;
			settings.page = 1;

			methods.multi.apply($(this), ['html']);

			return $(this);

		},


		single: function(id, _method) {

			var settings = $(this).data('RestLoader');

			var $this = $(this);

			var method = _method || 'prepend';

			params = {
				rest_id: id,
				rest_method: "add"
			};

			$.post(settings.url, params, function(data) {

				$this.find('.rest-results')[method](data.return);

				settings.start++;

				if (settings.callback) {
					settings.callback();
				}

			}, 'json');

			return $(this);

		},


		multi: function(_method) {

			var settings = $(this).data('RestLoader');

			var $this = $(this);

			var method = _method || 'append';

			$this.find('.rest-updated').fadeIn(1);

			params = {
				"PostData": settings.params.serialize(),
				"rest_start": settings.start,
				"rest_limit": settings.limit,
				"rest_order": settings.order,
				"rest_method": "load"
			};

			$.post(settings.url, params, function(data) {

				$STAN.formHideErrors(data);

				if (data.status == 'FAIL') {

					$STAN.formError(data);

				} else {

					// set total
					settings.total = parseInt(data.total);
					methods.hideShowNoDataMessage.apply($this);
					methods.hideShowLoadMore.apply($this);

					// set permalink
					settings.permalink = data.permalink;
					$this.attr('data-permalink', data.permalink);

					// set paging
					$this.find('.rest-pagination').html(data.pagination);

					// set info
					$this.find('.rest-results-info').html(data.info);

					// set results
					$this.find('.rest-results')[method](data.return);

					$this.find('.rest-updated').fadeOut(1);

					// Execute callbacks
					if (data.callback) {
						eval(data.callback);
					}

					if (settings.callback) {
						settings.callback();
					}

					$STAN.trigger('rest.load', $this, settings);

				}

			}, 'json');

			return $(this);

		},


		loadMore: function(page) {

			var settings = $(this).data('RestLoader');

			var method;

			settings.page = page;

			if (typeof(page) != 'undefined') {
				settings.start = (parseInt(page) - 1) * settings.limit;
				method = 'html';
			} else {
				settings.page++;
				settings.start += settings.limit;
				method = 'append';
			}

			methods.hideShowLoadMore.apply($(this));

			methods.multi.apply($(this), [method]);

			return $(this);

		},


		hideShowLoadMore: function() {

			var settings = $(this).data('RestLoader');

			if (!settings) return;

			if ((settings.start + settings.limit) < settings.total) {
				$(this).find('.rest-load-more').css('display', 'block');
			} else {
				$(this).find('.rest-load-more').css('display', 'none');
			}

			if (settings.limit >= settings.total) {
				$(this).find('.rest-pagination').css('display', 'none');
			} else {
				$(this).find('.rest-pagination').css('display', 'block');
			}

		},

		hideShowNoDataMessage: function() {

			var settings = $(this).data('RestLoader');

			if (!settings) return;

			if (settings.total > 0) {
				$(this).find('.rest-no-results').css('display', 'none');
				//$(this).find('.rest-results-info').css('display', 'block');
			} else {
				$(this).find('.rest-no-results').css('display', 'block');
				//$(this).find('.rest-results-info').css('display', 'none');
				$(this).find('.rest-results .rest-active').remove();
			}

		},


		getTotal: function() {

			var settings = $(this).data('RestLoader');

			var $this = $(this);

			// Get all params from filters
			params = {
				"PostData": settings.params.serialize(),
				"rest_method": "total"
			};

			$.post(settings.url, params, function(data) {

				settings.total = parseInt(data.total);
				methods.hideShowNoDataMessage.apply($this);
				methods.hideShowLoadMore.apply($this);

			}, 'json');

			return $(this);

		},


		showUndo: function(id) {

			var settings = $(this).data('RestLoader');

			settings.rest_id = id;

			$('.rest-toast').css('display', 'none');

			$(this).find('.rest-toast').fadeIn();

			return $(this);

		},


		hideUndo: function() {

			$(this).find('.rest-toast').fadeOut();

			return $(this);

		},


		doUndo: function() {

			var settings = $(this).data('RestLoader');

			var $this = $(this);

			var params = {
				rest_id: settings.rest_id,
				rest_method: "undo"
			};

			methods.hideUndo.apply($(this));

			$(this).find('.rest-updated').fadeIn(1);

			$.post(settings.url, params, function(data) {

				$this.find('.rest-no-results').css('display', 'none');

				$this.find('.rest-updated').fadeOut(1);

				var $items = $this.find('.rest-active');
				var index = settings.undo_index;
				var item = settings.undo_item;

				if (!$items.length) {
					$this.find('.rest-results').append(item);
				} else if ($items.length == index) {
					$items.eq(index - 1).after(item);
				} else {
					$items.eq(index).before(item);
				}

				settings.start++;

				// set total
				settings.total = parseInt(data.total);
				methods.hideShowNoDataMessage.apply($this);
				methods.hideShowLoadMore.apply($this);

				if (settings.callback) {
					settings.callback();
				}

			}, 'json');

			return $(this);

		},

		getSetting: function(setting) {

			var settings = $(this).data('RestLoader');

			return settings[setting];

		},

		setSetting: function(setting, value) {

			var settings = $(this).data('RestLoader');

			settings[setting] = value;

			return $(this);

		}

	};

	$.fn.RestLoader = function(method) {

		var settings = this.data('RestLoader');

		if (methods[method]) {

			if (typeof this.data('RestLoader') !== 'undefined') {
				return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			}

			return this;

		} else if (typeof method === 'object' || !method) {

			return methods.init.apply(this, arguments);

		} else {

			$.error('Method ' + method + ' does not exist on jQuery.Datatable');

			return this;

		}

	};

}(jQuery, $STAN));
