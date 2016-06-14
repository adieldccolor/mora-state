(function() {

	function transformMarkup() {

		//move the comment cell to be last
		$('.table-cell').eq(2).after( $('.table-cell').eq(0) );

		var $commentForm = $('.comment-form');
		var $commentFormLoading = $('.comment-form-placeholder');
		var $tableCells = $commentForm.find('.table-cell');
		var $form = $('.comments-reply').find('form');

		var tableCellsMarkup = '';

		var submitMarkup = `<tr><td colspan="2" class="no-edges">
				<div class="form-group">
					<div class="pull-right">
						<button type="submit" class="btn btn-brand-bold">submit</button>
					</div>
					<div class="clearfix"></div>
				</div>`;

		$tableCells.each(function() {
			var commentCell = $(this).find('[name="comment"]').length;
			var emailCell = $(this).find('[name="email"]').length;
			var colspan = commentCell ? 'colspan="2"' : '';

			if ( commentCell || !emailCell ) {
				tableCellsMarkup += '<tr>';
			}
			
			tableCellsMarkup += `<td ${colspan}>${$(this).html()}</td>`;
			
			if ( commentCell || emailCell ) {
				tableCellsMarkup += '</tr>';
			}
		});

		var markup = `<div class="generic-form">
			<table class="table contact-form-table">
				<tbody>${tableCellsMarkup} ${submitMarkup}</tbody></table></div>`;


		$form.find('.submit').before(markup);
		$tableCells.remove();
		$form.find('.submit').remove();


		$commentFormLoading.hide();
		$commentForm.show();
	}

	function transformForm() {
		if ( $('.comment-form').length ) {
			//if div exists transform the form markup

			setTimeout(transformMarkup, 1500);
		}
	}


	$(document).on('ready', transformForm);
})();