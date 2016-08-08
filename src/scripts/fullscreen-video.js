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
		var setup = '{}';
		var video_types = { mp4: '', webm: '', ogv: '', vimeo: '' };
		var vimeoSeconds = 0;

		if ( videos.indexOf(',') > -1 ) {
			videos = videos.split(',');
		} else {
			videos = [ videos ];
		}

		for (var i = 0; i < videos.length; i++) {
			var extension = videos[i].split('.');
			extension = extension[ extension.length - 1 ];

			if ( extension.indexOf('?') > -1 ) {
				extension = extension.split('?');
				extension = extension[0];
			}
			
			if ( extension == "mp4" ) {
				video_types.mp4 = videos[i];
			} else if ( extension == "webm" ) {
				video_types.webm = videos[i];
			} else if ( extension == "ogv" ) {
				video_types.ogv = videos[i];
			}
			if ( videos[i].indexOf('vimeo.com') > -1 ) {
				video_types.vimeo = videos[i];
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

		if ( video_types.vimeo ) {
			setup = `{ "techOrder": ["vimeo"], "sources": [{ "type": "video/vimeo", "src": "${video_types.vimeo}"}], 
			"vimeo": { "player_id": "full-video_Vimeo_api" } }`;
			sources = '';
		}

		var video = `<video id="full-video" class="video-js" controls 
		preload="auto" width="640" height="264" poster="${poster}" 
		data-setup='${setup}'>${sources}<p class="vjs-no-js">
		To view this video please enable JavaScript, and consider upgrading to 
		a web browser that<a href="http://videojs.com/html5-video-support/" 
		target="_blank">supports HTML5 video</a></p></video>`;

		var bounds;
		var video_instance;



		$('body').on('click', '.js-play', function(e) {
			e.preventDefault();

			$("body").addClass("video-active");

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
			var frameborder = $('.frame-top').outerHeight() * 2;

			$clone.css({ position: 'absolute', zIndex: 9000, top: bounds.top, left: 0,
			           height: bounds.height, minHeight: bounds.height-(frameborder), width: '100%', opacity: 1 });

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

						if ( video_types.vimeo ) {
							var regExp = /https:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;
							var match = video_types.vimeo.match(regExp);
							var vid;

							if (match){
							    vid = match[2];


							    $video = $(`<iframe src="https://player.vimeo.com/video/${vid}?api=1&player_id=full-video&autoplay=1" 
							    	width="100%" style="position: fixed;" height="100%" id="full-video" frameborder="0" 
							    	webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`);


									$clone.find('.video-fullscreen').append($video);
									video_instance = $f($("#full-video")[0]);
									window.BV_VimeoFW = video_instance;

									videoInit = true;
							}

							return false;
							
						}else {

							$clone.find('.video-fullscreen').append($video);

							if ( video_types.vimeo ) {
								return false;
							}

							videojs('full-video', {}, function(){
								video_instance = this;
						  	video_instance.play();
						  	window.BV_VimeoFW = video_instance;

						  	videoInit = true;


							});

						}

					} else {

						if ( video_types.vimeo ) {
							video_instance.api("seekTo", 0);
							video_instance.api("play");
							video_instance.api("setVolume", 1);
						}else {
							video_instance.play();
						}
						
					}

				} });
		}).on('click', '.js-close-video', function(e) {
			e.preventDefault();
			var $clone = $('.js-video-clone');
			var winHeight = $(window).height();
			bounds = $clone.next('.vertical-section')[0].getBoundingClientRect();


			if ( video_types.vimeo ) {
				video_instance.api("pause");
				video_instance.api("setVolume", 0);
			}else {
				video_instance.pause();
			}

			if ( BV_Vimeo != undefined ) {
				BV_Vimeo.play();
			}
			

			$clone.css({ minHeight: winHeight, height: winHeight });

			$('body').removeClass('no-flow video-active');

			TweenMax.to( $clone.find('.video-fullscreen'), 0.3, { opacity: 0 } );
			TweenMax.to( $clone, 0.5, { delay: 0.3, opacity: 0,
			onComplete: function() {
				$clone.css({ top: '-10000000%' });
			} } );
		});
		
	}

	$(document).on('ready', listenFullScreenVideo);
})();