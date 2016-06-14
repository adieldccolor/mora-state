(function() {

	var $grid;

	function startGrid() {
		if ( $('body').find('.article-grid').length ) {
			$grid = $('.article-grid').imagesLoaded( function() {

				$('.article-grid').isotope({
					  itemSelector : '.grid-item',
					  filter: '*',
					  layoutMode: 'packery',
					  transitionDuration: '0.6s',
					  packery: {
						 gutter: 0
					  }
					}).isotope( 'layout' );
			});

		}

		
	}

	$(document).on('ready', startGrid);
})();