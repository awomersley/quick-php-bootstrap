/* ========================================================================
 * STAN Utils: Form Elements
 * Author: Andrew Womersley
 * ======================================================================== */

$(function() {

	'use strict';

	$('body').on('click', '.sa-checkbox, .sa-radio', function(event) {

		var $input = $(this).find('input');

		if ($input.attr('type') == 'radio') {

			$("[name='" + $input.attr('name') + "']").each(function() {

				$(this).prop('checked', false)
					.parents('.sa-radio').removeClass('active');

			});

		}

		if ($(this).hasClass('active')) {

			$(this).removeClass('active')
				.find('input').prop('checked', false);

		} else {

			$(this).addClass('active')
				.find('input').prop('checked', true);

		}

		dependencies($(this).closest('form'));

		if ($(this).attr('data-set-title') == '1') {

			setTitle($(this).closest('.sa-select-multiple'));

			$(this).closest('.sa-select-multiple').removeClass('active');

		}

		event.preventDefault();

	});

	function setTitle($select) {

		var $t, val, cls;

		val = '';

		$select.find('.sa-checkbox.active').each(function() {

			if (val) val = val + ', ';

			val = val + $(this).find('label').text();

		});

		$t = $select.find('[data-select-title]');

		if (!val) {
			val = $t.attr('data-default');
			$t.removeClass('is-selected').addClass('not-selected');
		} else {
			$t.addClass('is-selected').removeClass('not-selected');
		}

		$t.text(val);

	}

	// data-toggle='input-sync' data-target='.moduleid' data-action='/scripts/backend/get-modules'
	$("[data-toggle='input-sync']").change(function() {

		var $t = $(this);

		$($t.attr('data-target')).load($t.attr('data-action'), {
			syncid: $t.val()
		});

	}).change();


	// data-toggle='set-value' data-target='[name="configure"]' data-value='1' data-no-submit
	$('body').on('click', "li[data-toggle='set-value'], a[data-toggle='set-value']", function() {

		return setValue($(this));

	});

	$('body').on('change', "form [data-toggle='set-value']", function() {

		return setValue($(this));

	});

	function setValue($t) {

		var val = $t.attr('data-value') || $t.val();

		$($t.attr('data-target')).val(val).trigger("change");

		if ($t.is('[data-no-submit]')) return false;

	}

	// dependencies
	$('body').on('change', 'form select, form input', function() {

		dependencies($(this).closest('form'));

	});


	function dependencies(form) {

		$(form).find('[data-dep]').each(function() {

			var dep = $(this).attr('data-dep');
			var val = $(this).attr('data-dep-val').split("|");

			var display = false;

			for (var x in val) {

				if ($(form).find("[name='" + dep + "']").attr('type') == 'checkbox') {

					if ($(form).find("[name='" + dep + "']").is(':checked') && val[x] == 1) {
						display = true;
					} else if (!$(form).find("[name='" + dep + "']").is(':checked') && val[x] != 1) {
						display = true;
					}

				} else if ($(form).find("[name='" + dep + "']").attr('type') == 'radio') {
					if ($(form).find("[name='" + dep + "']:checked").val() == val[x]) display = true;
				} else if (val[x] == '*') {
					if ($(form).find("[name='" + dep + "']").val()) display = true;
				} else {
					if ($(form).find("[name='" + dep + "']").val() == val[x]) display = true;
				}

				//console.log($(form).find("[name='" + dep + "']").val());

			}

			if (display) {
				$(this).removeClass('none');
			} else {
				$(this).addClass('none');
			}

		});

		$STAN.trigger("form.dependencies");

	}

	function init() {

		$('.sa-checkbox, .sa-radio').each(function() {

			if ($(this).find('input').prop('checked')) {

				$(this).addClass('active');

			}

			if ($(this).attr('data-set-title') == '1') {

				setTitle($(this).closest('.sa-select-multiple'));

			}

		});

	}

	$STAN.on('formfields.init', function() {
		init();
		$('form').each(function() {
			dependencies($(this));
		});
	}).trigger('formfields.init');

});
