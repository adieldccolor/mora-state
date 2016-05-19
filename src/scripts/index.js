/* ***
Main functions file for Founders Christian morastate
Author: Adiel Hercules | jadher.11x2@gmail.com | @adielhercules
*** */
(function() {
	'use strict';

	//Object contains all website functions
	var morastate = {};
	
	//This object will contain all callbacks that will be triggered in window.resize
	morastate.resizeCallbacks = [];

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
					callback(_arguments[0], _arguments[1]);
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
		}).on('click', '.js-close', function(e) {
			e.preventDefault();

			$('body').removeClass(openClass);

			return false;
		});
	}

	//Start everything
	morastate.ready = function() {
		morastate.enableResize();
		morastate.enableMenu();
	}

	//start when all content is loaded
	morastate.onloaded = function() {
		if(!Modernizr.touch){
			// ** cover image **
			$.stellar({
				horizontalScrolling: false,
				verticalOffset: -20
			});
		}
		else{
			// ** cover image **
			$(".has-parallax").css({"background-position":"50% -175px"});
		}
	}


	$(document).on('ready', morastate.ready);
	$(window).on('load', morastate.onloaded);
})();