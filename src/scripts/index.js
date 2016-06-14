/* ***
Main functions file for morastate
Author: Adiel Hercules | jadher.11x2@gmail.com | @adielhercules
*** */
(function() {
	'use strict';

	//Object contains all website functions
	var morastate = {};
	var stellarConf = {
				horizontalScrolling: false,
				verticalOffset: 0,
				responsive: true
			};
	var BV;
	
	//This object will contain all callbacks that will be triggered in window.resize
	morastate.resizeCallbacks = [];

	//This will contain public methods
	morastate.publicMethods = [];

	/*
	Add a new callback to the callbacks object
	@param callback is the callback to be executed
	@param arguments are the others options for the callback
	*/
	morastate.addResizeCallback = function(callback) {
		var _arguments = [];
		var _found = false;
		for (var i = 1; i < arguments.length; i++) {
			_arguments.push(arguments[i]);
		}

		for (var i = 0; i < morastate.resizeCallbacks.length; i++) {
			if ( morastate.resizeCallbacks[i].data[0] == arguments[1] 
			    && morastate.resizeCallbacks[i].data[1] == arguments[2] ) {
				_found = true;
			}
		}

		if ( !_found ) {
			morastate.resizeCallbacks.push({
				data: _arguments,
				callback: function() {
					callback.apply(this, _arguments);
				}
			});
		}
	}


	//start the window.resize listener and execute the callbacks with delay
	morastate.enableResize = function() {
		
		$(window).resize(function() {
			var timerID = window['_resize-timer'];
			if ( timerID != undefined ) {
				clearTimeout(timerID);
			}

			window['_resize-timer'] = setTimeout(function() {
				for (var i = 0; i < morastate.resizeCallbacks.length; i++) {
					morastate.resizeCallbacks[i].callback.call(this);
				}
			}, 100);
		});

	}

	//enableMenu
	morastate.enableMenu = function() {
		var openClass = 'menu-is-open';

		$('body').on('click', '.js-hambuger', function(e) {
			e.preventDefault();

			openMenu(openClass);

			return false;
		}).on('click', '.overlay-menu .js-close, .overlay-menu .overlay', function(e) {
			e.preventDefault();

			function closeMenu() {
				$('body').removeClass(openClass);
			}

			timedCallback(closeMenu);

			return false;
		})
		//on click everywheren but no .menu-box close it
		.on('click', '.overlay-menu *', function(e) {

			if(!$(event.target).parents().andSelf().is(".menu-box")){
	        $('body').removeClass(openClass);
	    }

		});
	}

	//resize by viewport height
	var jsViewport = morastate.resizeByViewport = function($el, prop, reducer) {
		morastate.addResizeCallback(jsViewport, $el, prop, reducer);

		var winHeight = $(window).height();
		var winWidth = $(window).width();
		var newHeight = winHeight;
		var newWidth = winWidth;
		var reducerHeight, reducerWidth;
		var minAspect = $el.find('.js-keep-aspect').length 
				? $el.find('.js-keep-aspect').outerHeight() : 0;
		var clutter = 100; //the aprox. height off a textured corner
		var reduce = $el.attr('data-reduce') != undefined;

		if ( reducer && isNaN(reducer) ) {
			reducerHeight = $(reducer).outerHeight();
			reducerWidth = $(reducer).outerWidth();

			newHeight = newHeight - reducerHeight;
			newWidth = newWidth - reducerWidth;
		} 

		if ( reducer && !isNaN(reducer) ) {
			if ( reduce ) {
				newHeight = ( newHeight - new Number(reducer) ) + 'px';
				newWidth = ( newWidth - new Number(reducer) ) + 'px';
			} else {
				newHeight = newWidth = new Number(reducer) + 'px';
			}
		}

		if ( minAspect && (minAspect + clutter) > newHeight ) {
			newHeight = minAspect + clutter;
		}

		if ( prop == 'height' || prop == "min-height" ) {
			$el.css(prop, newHeight);
		}else if ( prop == 'width' || prop == "min-width" ) {
			$el.css(prop, newWidth);
		}
	}

	//full height
	morastate.enableFullHeight = function() {
		$('.js-viewport').each(function() {
			var $el = $(this);
			var prop = $el.attr('data-prop') || 'min-height';
			var reducer = $el.attr('data-reducer') || false;
			morastate.resizeByViewport($el, prop, reducer);
		});
	}

	//add new method
	morastate.addPublicMethod = function(method) {
		if ( typeof method === "string" ) {
			method = { name: method, callback: ( arguments[1] || function(){} ) };
		}

		morastate.publicMethods.push(method);
	}

	//timedCallback
	morastate.addPublicMethod('__timedCalls', []);
	morastate.addPublicMethod(
		'timedCallback',
		function() {
			var _callback = function() {}, _time = 300, _id = '_call-0';

			if ( typeof arguments[0] === "function" ) {
				_callback = arguments[0];
			}

			if ( typeof arguments[1] === "number" ) {
				_time = arguments[0];
			}

			var _index = -1;
			for (var i = 0; i < __timedCalls.length; i++) {
				if ( __timedCalls[i]._fn == _callback && __timedCalls[i]._time == _time ) {
					_index = i;
					_id = __timedCalls[i]._id;
				}
			}

			if ( _index < 0 ) {
				_id = '_call-' + __timedCalls.length;
				_index = __timedCalls.length;
				__timedCalls.push({
					_fn: _callback,
					_time: _time,
					_id: _id,
					_timer: null
				});
			}

			if ( __timedCalls[_index]._timer ) {
				clearTimeout(__timedCalls[_index]._timer);
			}

			__timedCalls[_index]._timer = setTimeout(_callback, _time);
		}
	);

	//open menu
	morastate.addPublicMethod(
		'openMenu',
		function (add_class) {
			var $menuBox = $('.menu-box');

			TweenMax.to($menuBox, 0, { scale: 0.8, opacity: 0 });
			TweenMax.to($menuBox, 0.3, { scale: 1, opacity: 1, delay: 0.3 });

			$('body').addClass(add_class||'menu-is-open');

		}
	);

	//add bigvideo instance init to window object, so its public
	morastate.addPublicMethod({
		name: 'startAmbientVideo',
		callback: function(files) {
			var settings = [];
			var poster = '';
			var imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];

			for (var i = 0; i < files.length; i++) {
				var extension = files[i].split('.');
				extension = extension[ extension.length - 1 ];
				
				if ( extension == "mp4" ) {
					settings.push({ type: 'video/mp4', src: files[i] });
				} else if ( extension == "webm" ) {
					settings.push({ type: 'video/webm', src: files[i] });
				} else if ( extension == "ogv" ) {
					settings.push({ type: 'video/ogg', src: files[i] });
				}else if ( imageExtensions.indexOf(extension.toLowerCase()) > -1 ) {
					poster = files[i];
				}
			}

			if (Modernizr.touch) {
			  $('.vertical-section').first().css({ backgroundImage: 'url('+ poster +')', 
			                                     backgroundSize: 'cover',
			                                     webkitBackgroundSize: 'cover',
			                                     backgroundPosition: 'center center'
			                                   });
			} else {
				BV = new $.BigVideo(); BV.init();
			  BV.show(settings,{ambient:true});
			}
		}
	});


	//export public methods
	morastate.exportPublicMethods = function() {
		for (var i = 0; i < morastate.publicMethods.length; i++) {
			if ( typeof morastate.publicMethods[i].callback !== "undefined" ) {
				window[morastate.publicMethods[i].name] = morastate.publicMethods[i].callback;
			}
		}
	}


	//contact form
	morastate.contactFormInputs = function() {
		$('.contact-form, .generic-form').on('focus', '.form-control', function() {
			$(this).closest('td').addClass('is-focused');
		}).on('blur', '.form-control', function() {
			$(this).closest('td').removeClass('is-focused notempty');

			if ( $(this).val().trim().length ) {
				$(this).closest('td').addClass('notempty');
			}
		});
	}


	//scroll animation for navigation
	morastate.navigationScrollAnimation = function() {
		var $nav = $('.navigation').clone().addClass('navigation--clone');
		$('.navigation').after($nav);
		var headroom  = new Headroom($nav[0], { offset: 0 });
		// initialise
		headroom.init();

		$(window).on('scroll', function() {
			if ( $(window).scrollTop() > 100 ) {
				$('.navigation--clone').addClass('headroom');
			} else {
				$('.navigation--clone').removeClass('headroom');
			}
		});
	}





	//Start everything
	morastate.ready = function() {
		morastate.enableResize();
		morastate.enableMenu();
		morastate.enableFullHeight();
		morastate.exportPublicMethods();
		morastate.contactFormInputs();

		morastate.navigationScrollAnimation();
	}

	//start when all content is loaded
	morastate.onloaded = function() {
		if(!Modernizr.touch){
			// ** cover image **
			$.stellar(stellarConf);
		}
	}


	$(document).on('ready', morastate.ready);
	$(window).on('load', morastate.onloaded);
})();