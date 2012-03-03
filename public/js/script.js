(function() {


// TODO: Share a file with the node.js server of common utilities and
//     algorithms


// TODO: mvc to keep url, selected example, search text, and result in sync
//		 +1 (david)
var currentUrl = null;

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function clamp(min, max, num) {
	return Math.max(min, Math.min(max, num));
}

function randomIndex(array) {
	return randInt(0, array.length);
}

function randomChoice(array) {
	return array[randInt(0, array.length)];
}

var MONTH_DAYS = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
function dateToDayOfYear(date) {
	var day = 0;
	for (var i = 0; i < date.getMonth(); ++i) {
		day += MONTH_DAYS[i];
	}
	return day + date.getDate();
}

var NUM_FROM_URL_REGEX = /(-?[0-9]+)(?:\/(-?[0-9]+))?/;
function getNumFromUrl(url) {
	var matches = NUM_FROM_URL_REGEX.exec(url);
	if (!matches) return null;

	if (matches[2]) {
		// The number is a date, convert to day of year
		return dateToDayOfYear(new Date(2004, matches[1] - 1, matches[2]));
	} else {
		return parseInt(matches[1], 10);
	}
}

function changeUrlToNum(url, num) {
	var matches = NUM_FROM_URL_REGEX.exec(url);
	var needle = NUM_FROM_URL_REGEX;
	if (!matches) {
		needle = 'random';
	}

	if (url.match(/\/date/) || (matches && matches[2])) {
		// number is a day of year, so convert to date and into m/d notation
		var date = new Date(2004, 0);
		date.setDate(num);
		num = '' + (date.getMonth() + 1) + '/' + date.getDate();
	}
	return url.replace(needle, num);
}

function escapeForHtml(text) {
	return $('<div>').text(text).html();
}

// From http://stackoverflow.com/questions/901115/get-query-string-values-in-javascript
function getParameterByName(query, name) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(query);
	if(results == null)
		return "";
	else
		return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function processWidgetText(dataJson) {
	var text = dataJson['text'];

	var htmlEscaped = '<span class="">' + escapeForHtml(text) + '</span>';

  htmlEscaped = htmlEscaped.replace(/\^{(.*?)}/g, '<sup>$1</sup>');
  htmlEscaped = htmlEscaped.replace(/\_{(.*?)}/g, '<sub>$1</sub>');

  return htmlEscaped;
}

function update_result(url, $result) {
	// TODO: Do this properly by parsing keys of query string
	//var queryRegex = /\?(.+)/.exec(url);
	//var wantJson = (queryRegex && getParameterByName(queryRegex[1], 'json'));

	var wantJson = (url.indexOf('json') !== -1);

	$.ajax({
		url: url,
		dataType: 'json',
		headers: { 'Content-Type': 'application/json' },
		success: function(data, httpStatus, xhr) {
			var contentType = xhr.getResponseHeader('Content-Type');
			if (contentType.indexOf('text/html') !== -1) {
				return;
			}

			var type = data['type'];
			var factText = wantJson ? JSON.stringify(data, null, ' ') : processWidgetText(data);

			var $text = $('#result-temporary-text');
			$text
				.css('opacity', 0)
				.html(factText)
				.toggleClass('script', wantJson)
				.css('marginTop', $text.height() / -2)  // vertically centered (top 50% + abs position)
				.animate({ opacity: 1.0 }, 300);

			var number = xhr.getResponseHeader('X-Numbers-API-Number');
			$('#counter').counter('set', number, /* dontTriggerEvent */ true);

			$result.removeClass('error');
		},
		error: function() {
			$('#result-temporary-text')
				.html('Uh oh, we don\'t understand that URL :( <br>' +
							'Maybe read the <a href="#api">API docs</a> below?');
			$result.addClass('error');
		}
	});
}

function update_query(url) {
	if ($('#search-text').val() !== url) {
		$('#search-text').val(url);
	}
	$('#search-link').prop('href', url);
	update_result(url, $('#search-result'));
}

function update_history(hash) {
	if (window.history) {
		window.history.replaceState({}, null, '#' + hash);
	} else {
		window.location.hash = hash;
	}
}

function update_counter(url) {
	$('#counter').counter('set', getNumFromUrl(url), false);
}

function update_all(url, force) {
	if (currentUrl === url && !force) return;
	currentUrl = url;
	update_history(url);
	update_query(url);
}

function switchTagline() {
	$('#tagline')
		.css('opacity', 0)
		.html(randomChoice($('#tagline-alternates li')).innerHTML)
		.animate({ opacity: 1.0 }, 1000);
}

function updateAllFromHash() {
	var hash = window.location.hash;
	if (hash) {
		update_all(hash.substr(1));
	}
}

////////////////////////////////////////////////////////////////////////////////

// Main execution: what gets executed on DOM ready
$(function() {

	// Randomly pick a tagline to use
	setInterval(switchTagline, 30 * 1000);

	// Initialize rolling counter widget
	$('#counter')
		.counter({
			digitWidth: 32,
			digitHeight: 46,
			numDigits: 4,
			showSides: false
		})
		.bind('counterChanged', function(event, newVal) {
			update_all(changeUrlToNum(window.location.hash.substr(1), newVal));
		})
		.find('.counter-container-inner')
			.click(function(event) {
				update_all($('#search-text').val(), /* force */ true);
			})
			.mousewheel(function(event, delta) {
				$('#counter').counter(delta > 0 ? 'increment' : 'decrement');
				event.preventDefault();
			});

  // Load the examples using the api backend. Don't to reduce load.
	//$('.example').each(function(index, element) {
		//var $div = $(element).find('.example-box');
		//var href = $div.find('a').attr('href');
		//update_result(href, $div.find('.api-result'));
	//});

	// Listen for hash changes to keep UI in sync and on page load as well
	$(window).on('hashchange', updateAllFromHash);
	if (!window.location.hash) {
		update_history('42');
	}
	setTimeout(updateAllFromHash, 0);

  var $prev_selected = undefined;
  $('#search-examples a').click(function(e) {
    e.stopPropagation();

    var $this = $(this);
    var hash = $this.attr('href');
    hash = hash.substring(1, hash.length);
    if ($prev_selected) {
      $prev_selected.removeClass('selected');
    }
    var $parent = $this.parent();
    $parent.addClass('selected');
    $('#search-text').val(hash);

		update_all(hash, /* force */ true);

    $prev_selected = $parent;
  });

  var $prev_selected = undefined;
  // Note: Using keydown instead of keypress to catch arrow key events
	$('#search-text').keydown(function(e) {
		var code = e.keyCode || e.which;
		if (code == 13) {  // enter
			update_all($(this).val(), /* force */ true);
		} else if (code === 38) {  // up arrow
			$('#counter').counter('increment');
			e.preventDefault();
		} else if (code === 40) {  // down arrow
			$('#counter').counter('decrement');
			e.preventDefault();
		}
	}).change(function(e) {
		$('#search-link').prop('href', $(this).val());
	});
});

/*
$(document).ready(function() {
  $('#examples').carouFredSel({
    scroll: {
      items: 1,
      duration: 1000,
      pauseOnHover: true
    }
  });
});
*/

})();
