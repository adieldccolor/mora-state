/* ***
Some preloading functionality ;D
Author: Adiel Hercules | jadher.11x2@gmail.com | @adielhercules
*** */
(function() {

	var _preloadFiles = [];
	var preload;

	function applyCallbacks() {
		//execute callbacks
		for (var i = 0; i < _preloadFiles.length; i++) {
			if ( typeof _preloadFiles[i].callback === "function" ) {
				_preloadFiles[i].callback.apply(this, _preloadFiles[i].files);
			}
		}
	}

	function siteLoaded() {
		var $preloader = $('.preload-wrapper');
		var $logo = $preloader.find('.container');
		var $overlay = $preloader.find('.overlay');
		var $content = $('.content-wrapper');
		var $progress = $('.preload-progress');
		var $preloadContent = $('.preload-content');

		if ( arguments.length && arguments[0] == "isTouch" ) {
			$('body').removeClass('loader-active');

			applyCallbacks.apply(this);
			return false;
		}

		TweenMax.to($content, 0, { opacity: 0.9 });

		setTimeout(function(){
			TweenMax.to($preloadContent, 0.5, { opacity: 0, onComplete: function() {
				TweenMax.to($overlay, 0.5, { opacity: 0, onComplete: function() {
					TweenMax.to($preloader, 0.5, { opacity: 0, borderWidth: 0, onComplete: function() {
						$('body').removeClass('loader-active');
					} });
					TweenMax.to($content, 0.5, { opacity: 1 });
				} });
			} });
		}, 500);


		applyCallbacks.apply(this);

	}

	function loadProgress() {
		var progress = ((preload.progress * 90) + 10) + '%';
		TweenMax.to( $('.preload-progress'), 0.5, { width: progress });
	}

	function loadSite() {

		if ( window.__preload !== undefined && window.__preload.length ) {
			_preloadFiles = window.__preload;
		}

		if ( Modernizr.touch ) {
			siteLoaded('isTouch');
			return false;
		}

		preload=new createjs.LoadQueue();
		preload.on("complete",siteLoaded);
		preload.on("progress",loadProgress);

		var imgs = [];
		$('.js-has-image').each(function() {
			var $img = $(this);
			var img = $img.css('background-image').slice(5, -2);
			imgs.push(img);
		});

		$('img').each(function() {
			var $img = $(this);
			var img = $img[0].src;
			imgs.push(img);
		});

		$('[data-videos]').each(function() {
			var vids = $(this).attr('data-videos');
			
			if ( vids.indexOf(',') > -1 ) {
				vids = vids.split(',');
			} else {
				vids = [ vids ];
			}

			for (var i = 0; i < vids.length; i++) {
				imgs.push(vids[i]);
			}
		});


		$('[data-poster]').each(function() {
			var img = $(this).attr('data-poster');
			imgs.push(img);
		});

		imgs.push((window.__template_url||'.') + '/assets/images/scratched-texture.jpg');
		imgs.push((window.__template_url||'.') + '/assets/images/scratched-texture.png');
		imgs.push((window.__template_url||'.') + '/assets/images/texture.jpg');

		for (var i = 0; i < _preloadFiles.length; i++) {
			var files = _preloadFiles[i].files;
			if ( files.length ) {
				for (var i = 0; i < files.length; i++) {
					var fileExitension = files[i].split('.');
					fileExitension = fileExitension[ fileExitension.length - 1 ];
					if ( ['webm', 'mp4', 'ogv', 'ogg', 'mp3'].indexOf(fileExitension) < 0 ) {
						imgs.push(files[i]);
					}
				}
			}
		}

		for (var i = 0; i < imgs.length; i++) {
			preload.loadFile(imgs[i]);
		}
	}

	$(document).on('ready', loadSite);
})();