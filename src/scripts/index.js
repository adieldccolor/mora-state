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

			$('body').addClass(openClass);

			return false;
		}).on('click', '.overlay-menu .js-close, .overlay-menu .overlay', function(e) {
			e.preventDefault();

			$('body').removeClass(openClass);

			return false;
		});
	}

	//resize by viewport height
	morastate.resizeByViewport = function($el, prop, reducer) {
		morastate.addResizeCallback(morastate.resizeByViewport, $el, prop, reducer);

		var winHeight = $(window).height();
		var winWidth = $(window).width();
		var newHeight = winHeight;
		var newWidth = winWidth;
		var reducerHeight, reducerWidth;

		if ( reducer && isNaN(reducer) ) {
			reducerHeight = $(reducer).outerHeight();
			reducerWidth = $(reducer).outerWidth();

			newHeight = newHeight - reducerHeight;
			newWidth = newWidth - reducerWidth;
		} 

		if ( !isNaN(reducer) ) {
			newHeight = newWidth = new Number(reducer) + 'px';
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
		morastate.publicMethods.push(method);
	}

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
			  $('.vertical-section').first().css({ backgroundImage: 'url('+ poster +')' });
			} else {
				BV = new $.BigVideo(); BV.init();
			  BV.show(settings,{ambient:true});
			}
		}
	});


	//export public methods
	morastate.exportPublicMethods = function() {
		for (var i = 0; i < morastate.publicMethods.length; i++) {
			if ( typeof morastate.publicMethods[i].callback === "function" ) {
				window[morastate.publicMethods[i].name] = morastate.publicMethods[i].callback;
			}
		}
	}


	//contact form
	morastate.contactFormInputs = function() {
		$('.contact-form').on('focus', '.form-control', function() {
			$(this).closest('td').addClass('is-focused');
		}).on('blur', '.form-control', function() {
			$(this).closest('td').removeClass('is-focused notempty');

			if ( $(this).val().trim().length ) {
				$(this).closest('td').addClass('notempty');
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