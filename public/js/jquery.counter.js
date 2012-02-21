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
				easing: 'swing',
				showSides: true,
				controls: true,
				buttonHeight: 20,
			}, options);

			var $this = $(this);
			var data = $this.data(NAME);

			// First time initialization of the plugin on this target
			if (!data) {
				data = settings;
				data.$digit = [];

				// Set up the surrounding container divs
				var containerWidth = (settings.digitWidth + 1) * settings.numDigits + (settings.showSides ? 1 : -1);
				var containerVerticalMargin = (settings.controls ? settings.buttonHeight : 0);
				var $container = data.$container = $('<div>').appendTo($this).css({
					position: 'relative',
					height: settings.digitHeight,
					width: containerWidth,
					margin: '0',
					marginTop: containerVerticalMargin,
					marginBottom: containerVerticalMargin,
					padding: '0',
					overflow: 'visible'
				}).addClass(NAME + '-container-outer');

				var $inner = $('<div>').css({
					overflow: 'hidden',
					height: settings.digitHeight,
					width: containerWidth,
					position: 'relative'
				}).addClass(NAME + '-container-inner').appendTo($container);

				// TODO: Don't hard-code the z-index
				// Add a div to be used as a gradient overlay mask
				$('<div>').css({
					position: 'absolute',
					width: containerWidth,
					height: settings.digitHeight,
					zIndex: 10
				}).addClass(NAME + '-mask').appendTo($inner);

				// Add the digit text
				var digits = new Array(100 + 1).join('0 1 2 3 4 5 6 7 8 9 ');
				for (var i = 0; i < settings.numDigits; ++i) {
					data.$digit[i] = $('<div>').appendTo($inner).css({
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

				if (settings.controls) {
					this[NAME]('addControls');
				}
			}

			// TODO: Events
			//$(window).bind('resize.tooltip', methods.reposition);

			return this;
		},

		addControls: function() {
			var data = this.data(NAME);
			var padding = 3;
			var height = data.buttonHeight - padding;
			var tops = [ -(padding + height), data.digitHeight + padding ];
			var html = [ '&#9650', '&#9660' ];
			var classes = [ NAME + '-button-up', NAME + '-button-down' ];
			var onClick = [ $.proxy(methods.increment, this), $.proxy(methods.decrement, this) ];

			for (var i = 0; i < 2; ++i) {
				$('<div>').css({
					position: 'absolute',
					top: tops[i],
					width: data.$container.width(),
					textAlign: 'center',
					fontSize: height * 0.6,
					lineHeight: height + 'px',
					height: height
				}).html(html[i])
					.addClass(NAME + '-button ' + classes[i])
					.click(onClick[i])
					.appendTo(data.$container);
			}
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

		// TODO: dontTriggerEvent is a HACK HACK HACK (maybe it should also be
		//		 shouldTriggerEvent)
		//		 The issue here is update loops... bob calls set, which triggers the
		//		 change event, and bob is also observing the counter, sees its
		//		 value has changed, does something about it, and then ends up changing the
		//		 counter again!!!!!
		set: function(val, dontTriggerChange) {
			if (val == null) return;
			var data = this.data(NAME);
			val = val % Math.pow(10, data.numDigits);
			var oldVal = data.val;
			var diff = oldVal - val;
			var movingDiff = Math.abs(diff);
			if (movingDiff <= EPSILON) return;

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
				var oldDigit = getDigitAt(oldVal, i);
				var newDigit = getDigitAt(val, i);
				var newRow;
				if (movingDiff < 0.9) {
					newRow = 500 + newDigit;
					// TODO: This is so ugly, think about not needing to special case
					if (oldDigit === 9 && newDigit === 0) {
						newRow += 10;
					} else if (oldDigit === 0 && newDigit === 9) {
						newRow -= 10;
					}
				} else {
					var direction = diff > 0 ? -1 : 1;
					var tens = (500 + oldDigit + direction * Math.min(450, movingDiff)) / 10;
					newRow = Math.floor(tens + EPSILON) * 10 + newDigit;
				}

				$digit[i].stop().animate({
					top: newRow * negHeight
				}, duration, data.easing, (function(digit) {
					return function() {
						$(this).css('top', (500 + digit) * negHeight);
					}
				}(newDigit)));

				movingDiff = Math.floor(movingDiff / 10);
			}

			data.val = val;
			if (!dontTriggerChange) {
				this.trigger(NAME + 'Changed', val);
			}

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
