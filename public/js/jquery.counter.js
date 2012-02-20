/**
 * Number counter plugin based on my work at Khan Academy.
 * @author David Hu
 */

// TODO: Make this into its own plugin and open source it.

(function($) {

	var NAME = 'counter';
	var EPSILON = 0.00001;

	var MOVE_FACTORS = [1, 1, 10, 20, 30, 40, 50];
	function getMoveFactor(digit) {
		if (digit <= 1) return 1;
		if (digit >= MOVE_FACTORS.length) return MOVE_FACTORS[MOVE_FACTORS.length -1];
		return MOVE_FACTORS[digit];
	}

	function getNumDigits(num) {
		return Math.floor(Math.log(num) / Math.log(10)) + 1;
	}

	function getDigitAt(num, digit) {
		return Math.floor(num / Math.pow(10, digit)) % 10;
	}

	// TODO: Should not clobber any existing easing
	// easeInOutCubic easing from
	// jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
	// (c) 2008 George McGinley Smith, (c) 2001 Robert Penner - Open source under the BSD License.
	$.extend($.easing, {
		easeInOutCubic: function (x, t, b, c, d) {
			if ((t/=d/2) < 1) return c/2*t*t*t + b;
			return c/2*((t-=2)*t*t + 2) + b;
		}
	});

	var methods = {

		init: function(options) {
			// Default options
			var settings = $.extend({
				val: 0,
				numDigits: 5,
				digitHeight: 40,
				digitWidth: 30,
				easing: 'easeInOutCubic',
				showSides: true
			}, options);

			var $this = $(this);
			var data = $this.data(NAME);

			// First time initialization of the plugin on this target
			if (!data) {
				data = settings;
				data.$digit = [];

				// Set up the surrounding container divs
				var containerWidth = (settings.digitWidth + 1) * settings.numDigits + (settings.showSides ? 1 : -1);
				var container = $('<div>').appendTo($this).css({
					overflow: 'hidden',
					position: 'relative',
					height: settings.digitHeight,
					width: containerWidth,
					margin: '0',
					padding: '0'
				}).addClass(NAME + '-container');

				// TODO: Don't hard-code the z-index
				$('<div>').css({
					position: 'absolute',
					width: containerWidth,
					height: settings.digitHeight,
					zIndex: 10
				}).addClass(NAME + '-mask').appendTo(container);

				// Add the digit text
				var digits = new Array(100 + 1).join('0 1 2 3 4 5 6 7 8 9 ');
				for (var i = 0; i < settings.numDigits; ++i) {
					data.$digit[i] = $('<div>').appendTo(container).css({
						lineHeight: settings.digitHeight + 'px',
						width: settings.digitWidth,
						position: 'absolute',
						right: i * settings.digitWidth + i + (settings.showSides ? 1 : 0),
						display: 'inline-block',
						fontSize: settings.digitWidth,
						textAlign: 'center',
						margin: '0',
						padding: '0'
					}).addClass(NAME + '-digit').text(digits);
				}

				$this.data(NAME, data);
				this[NAME]('_centerOn', settings.val);
			}

			// TODO: Events
			//$(window).bind('resize.tooltip', methods.reposition);
		},

		destroy: function() {
			// TODO: Clean up all events
			//$(window).unbind('.tooltip');
		},

		show: function() {
			// TODO
		},

		hide: function() {
			// TODO
		},

		get: function() {
			return this.data(NAME).val;
		},

		set: function(val) {
			var data = this.data(NAME);
			val = val % Math.pow(10, data.numDigits);
			var oldVal = data.val;
			var diff = oldVal - val;
			var movingDiff = Math.abs(diff);
			var diffNumDigits = getNumDigits(Math.abs(diff));
			var valDigits = getNumDigits(data.val);
			var negHeight = -data.digitHeight;
			var $digit = data.$digit;
			var duration = Math.min(2000, Math.log(1 + Math.abs(val - oldVal)) * 1000 * 0.3 + 200);

			// TODO: Use easeInOutCubic as jQuery animation
			// TODO: Allow user to customize animation time, or set a fixed time, or
			//		 pass in a fn
			// TODO: Also allow per-digit rolling
			// TODO: Animation should not go to intermediate values when multiple
			// queued up, but should just go directly to the end value

			for (var i = 0; i < data.numDigits; ++i) {
				var newDigit = getDigitAt(val, i);
				var newRow;
				if (movingDiff < 0.9) {
					newRow = 500 + newDigit;
				} else {
					var direction = diff > 0 ? -1 : 1;
					var tens = (500 + getDigitAt(oldVal, i) + direction * Math.min(450, movingDiff)) / 10;
					newRow = Math.floor(tens) * 10 + newDigit;
				}

				$digit[i].animate({
					top: newRow * negHeight
				}, duration, data.easing, (function(digit) {
					return function() {
						$(this).css('top', (500 + digit) * negHeight);
					}
				}(newDigit)));

				movingDiff = Math.floor(movingDiff / 10);
			}

			data.val = val;

			return this;
		},

		_centerOn: function(val) {
			var data = this.data(NAME);
			var $digit = data.$digit;
			var negHeight = -data.digitHeight;
			for (var i = 0; i < data.numDigits; ++i) {
				$digit[i].css('top', (500 + getDigitAt(val, i)) * negHeight);
			}

			return this;
		},

		increment: function() {
			this[NAME]('set', this[NAME]('get') + 1);
			return this;
		},

		decrement: function() {
			this[NAME]('set', this[NAME]('get') - 1);
			return this;
		}

	};

	$.fn[NAME] = function(method) {
    // Method calling logic
    if (methods[method]) {
      return methods[method].apply(this, [].slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.counter' );
    }

		return this;
	};

})(jQuery);
