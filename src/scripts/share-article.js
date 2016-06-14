/* * *************************************** */
//Sharing functionality for blog articles
//Author: Adiel hercules
//Contact me at jadher.11x2@gmail.com | @adielhercules
(function() {

	var completed = 0;
	var windowLocation = window.location.href.replace(window.location.hash, '');

	function facebookShare(){
		windowLocation = window.location.href.replace(window.location.hash, '');
		window.open(`https://www.facebook.com/sharer/sharer.php?u=${windowLocation}`, 
		            "facebookWindow", 
		            `height=380,width=660,resizable=0,toolbar=0,menubar=0,
		            status=0,location=0,scrollbars=0`); 
		return false;
	}

	function googlePlusShare(){
		windowLocation = window.location.href.replace(window.location.hash, '');
		window.open(`https://plus.google.com/share?url=${windowLocation}`, 
		            "googlePlusWindow", 
		            `height=380,width=660,resizable=0,toolbar=0,menubar=0,
		            status=0,location=0,scrollbars=0`);
		return false;
	}

	function twitterShare(){
		var pageTitle;
    windowLocation = window.location.href.replace(window.location.hash, '');

		if($(".article-heading h1").length) {
			pageTitle = encodeURIComponent($(".article-heading h1").text());
		} else {
			pageTitle = encodeURIComponent($(document).find("title").text());
		}

		window.open(`http://twitter.com/intent/tweet?text=${pageTitle}+${windowLocation}`, 
		            "twitterWindow", 
		            `height=380,width=660,resizable=0,toolbar=0,menubar=0,
		            status=0,location=0,scrollbars=0`);
		return false;
	}


	function linkedInShare(){
		var pageTitle;
	  windowLocation = window.location.href.replace(window.location.hash, '');

		if($(".article-heading h1").length > 0) {
			pageTitle = encodeURIComponent($(".article-heading h1").text());
		} else {
			pageTitle = encodeURIComponent($(document).find("title").text());
		}

		window.open(`http://www.linkedin.com/shareArticle?mini=true&url=${windowLocation}&title=${pageTitle}`, 
		            "linkedInWindow", 
		            `height=480,width=660,resizable=0,toolbar=0,menubar=0,status=0,
		            location=0,scrollbars=0`); 
		return false;
	}


	function pinterestShare(){
		var sharingImg = '';
		var pageTitle;
		windowLocation = window.location.href.replace(window.location.hash, '');

		if ( $('.post-image').length ) {
			if ( $('.post-image').css('background-image') != undefined ) {
				sharingImg = $('.post-image').css('background-image').slice(5, -2);
			}
		} else if( $('.article-body .page-body img').length ) {
			sharingImg = $('.article-body .page-body img')[0].src;
		}
		
		if($(".article-heading h1").length > 0) {
			pageTitle = encodeURIComponent($(".article-heading h1").text());
		} else {
			pageTitle = encodeURIComponent($(document).find("title").text());
		}
		
		window.open(`http://pinterest.com/pin/create/button/?url=${windowLocation}
		            &media=${sharingImg}&description=${pageTitle}`, 
		            "pinterestWindow", 
		            `height=640,width=660,resizable=0,toolbar=0,menubar=0,status=0,
		            location=0,scrollbars=0`);
		return false;
	}
	


	function updateCount(){
		//alt blog layout total share count
		var $share = $('.js-show-share');
		var totalShares = 0;
		var shareText = 'share';

		$('.share-icons .js-trigger-share').each(function(){
			totalShares += parseInt($(this).attr('data-sharecount')||0);
		});

		if(totalShares != 1){
			shareText += 's';
		}
		
		$share.text(`${totalShares} ${shareText}`);
	}



	function listenShareButtons() {
		$('body').on('mouseenter','.js-show-share', function(e){
			e.preventDefault();

			var $button = $('.js-show-share');

			$button.next().show();
			TweenMax.to( $button.next(), 0.5, { opacity: 1} )

			$button.parent().one('mouseleave', function() {
				TweenMax.to( $button.next(), 0.5, { opacity: 0, display: 'none' });
			});
		})
		.on('click','[data-share="facebook"]', facebookShare)
		.on('click','[data-share="googleplus"]', googlePlusShare)
		.on('click','[data-share="twitter"]', twitterShare)
		.on('click','[data-share="linkedin"]', linkedInShare)
		.on('click','[data-share="pinterest"]', pinterestShare);
	}





	function socialSharingInit() {

		//start listening buttons
		listenShareButtons();

		if( $('.js-show-share').length ) {

			var $facebook = $('.js-trigger-share[data-share="facebook"]');
			var $linkedin = $('.js-trigger-share[data-share="linkedin"]');
			var $pinterest = $('.js-trigger-share[data-share="pinterest"]');
  
		 
			////facebook
			if($facebook.length) {
				
				//load share count on load  
				$.getJSON(`https://graph.facebook.com/?id=${windowLocation}&callback=?`, function(data) {
					if((data.shares != 0) && (data.shares != undefined) && (data.shares != null)) { 
						$facebook.attr('data-sharecount', data.shares );	
					}

					completed++;
					updateCount();
				});
			} //facebook
			
			
			
			////linkedIn
			if($linkedin.length) {
				//load share count on load 
				$.getJSON(`https://www.linkedin.com/countserv/count/share?url=${windowLocation}&callback=?`, 
				          function(data) {
										if((data.count != 0) && (data.count != undefined) && (data.count != null)) { 
											$linkedin.attr('data-sharecount', data.count );
										}
										completed++;
										updateCount();
									});	
			} //linkedin
			
			
			////pinterest
			if($pinterest.length) {
				//load pin count on load 
				$.getJSON(`https://api.pinterest.com/v1/urls/count.json?url=${windowLocation}&callback=?`, 
				          function(data) {
										if((data.count != 0) && (data.count != undefined) && (data.count != null)) { 
											$pinterest.attr('data-sharecount', data.count );
										}

										completed++;
										updateCount();
									});
			}
		} //pinterest

	} //init social share
	




	$(document).on('ready', socialSharingInit);


})();