(function() {

	var preload;

	function siteLoaded() {
		var $preloader = $('.preload-wrapper');
		var $logo = $preloader.find('.container');
		var $overlay = $preloader.find('.overlay');
		var $content = $('.content-wrapper');

		TweenMax.to($content, 0, { opacity: 0.1 });

		setTimeout(function(){
			TweenMax.to($preloader, 0.5, { opacity: 0, onComplete: function() {
				$('body').removeClass('loader-active');
				TweenMax.to($content, 0.5, { opacity: 1, delay: 0.1 });
			} });
		}, 1000);
	}

	function loadProgress() {
		var progress = (preload.progress * 100) + '%';
		TweenMax.to( $('.preload-progress'), 0.5, { width: progress });
	}

	function loadSite() {
		preload=new createjs.LoadQueue();
		preload.on("complete",siteLoaded);
		preload.on("progress",loadProgress);

		var imgs = [];
		$('.has-parallax').each(function() {
			var $img = $(this);
			var img = $img.css('background-image').slice(5, -2);
			imgs.push(img);
		});

		$('img').each(function() {
			var $img = $(this);
			var img = $img[0].src;
			imgs.push(img);
		});

		for (var i = 0; i < imgs.length; i++) {
			preload.loadFile(imgs[i]);
		}
	}

	$(document).on('ready', loadSite);
})();