/*
Full screen video module
*/
(function() {

	//video lightbox
	function listenFullScreenVideo() {

		if ( !$('.js-fullscreenvideo').length ) {
			return false;
		}

		var videos = $('[data-videos]').attr('data-videos');
		var poster = $('[data-poster]').attr('data-poster');
		var sources = '';
		var video_types = { mp4: '', webm: '', ogv: '' };

		if ( videos.indexOf(',') > -1 ) {
			videos = videos.split(',');
		} else {
			videos = [ videos ];
		}

		for (var i = 0; i < videos.length; i++) {
			var extension = videos[i].split('.');
			extension = extension[ extension.length - 1 ];
			
			if ( extension == "mp4" ) {
				video_types.mp4 = videos[i];
			} else if ( extension == "webm" ) {
				video_types.webm = videos[i];
			} else if ( extension == "ogv" ) {
				video_types.ogv = videos[i];
			}
		}

		if ( video_types.mp4 ) {
			sources += `<source src="${video_types.mp4}" type="video/mp4">`;
		}

		if (  video_types.webm ) {
			sources += `<source src="${video_types.webm}" type="video/webm">`;
		}

		if ( video_types.ogv ) {
			sources += `<source src="${video_types.ogv}" type="video/ogg">`;
		}

		var video = `<video id="full-video" class="video-js" controls preload="auto" width="640" height="264" poster="${poster}" data-setup="{}">${sources}<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that<a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a></p></video>`;

		var bounds;
		var video_instance;



		$('body').on('click', '.js-play', function(e) {
			e.preventDefault();

			var $section = $(this).closest('.vertical-section');
			bounds = $section[0].getBoundingClientRect();
			var $clone = $('.js-video-clone').length 
					? $section.prev('.js-video-clone') : $section.clone();
			var winHeight = $(window).height();
			var winWidth = $(window).width();
			var $video = $(video);
			var videoInit = true;
			var $times = $('<a class="js-close-video" href="#"><i class="icon-times"></i></a>');
			var $loader = $('<div class="js-loader"></div>');

			$clone.css({ position: 'absolute', zIndex: 9000, top: bounds.top, left: 0,
			           height: bounds.height, minHeight: bounds.height, width: '100%', opacity: 1 });

			$video.css({ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 });

			$clone.addClass('js-video-clone').find('.section-wrapper').remove();
			
			if ( !$section.prev('.js-video-clone').length ) {
				$section.before($clone);
				videoInit = false;
			}

			$('body').addClass('no-flow');

			if ( !videoInit ) {
				$clone.find('.video-fullscreen').html('').append($loader).append($times);
			}

			TweenMax.to( $clone.find('.video-fullscreen'), 0.3, { opacity: 1 } );
			TweenMax.to($clone, 0.3, { position: 'fixed', top: 0, minHeight: winHeight, height: winHeight, 
				onComplete: function() {
					$clone.css({ minHeight: '100%', height: '100%' });
										
					if ( !videoInit ) {
						$clone.find('.video-fullscreen').append($video);

						videojs('full-video').ready(function(){
							video_instance = this;
						  video_instance.play();
						});
					} else {
						video_instance.play();
					}

				} });
		}).on('click', '.js-close-video', function(e) {
			e.preventDefault();
			var $clone = $('.js-video-clone');
			var winHeight = $(window).height();
			bounds = $clone.next('.vertical-section')[0].getBoundingClientRect();

			video_instance.pause();
			$clone.css({ minHeight: winHeight, height: winHeight });

			TweenMax.to( $clone.find('.video-fullscreen'), 0.3, { opacity: 0 } );
			TweenMax.to( $clone, 0.5, { delay: 0.3, opacity: 0,
			onComplete: function() {
				$clone.css({ top: '-10000000%' });
				$('body').removeClass('no-flow');
			} } );
		});
		
	}

	$(document).on('ready', listenFullScreenVideo);
})();