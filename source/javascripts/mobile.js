var $isotope_container = false;

function start_isotope() {
	return start_mobile_isotope();
}

function start_mobile_isotope() {
	$('#logo').css('margin-top', $('#filters').outerHeight() + 16);
	
	$isotope_container = $('#box_container');
	$isotope_container.isotope({
		layoutMode: 'vertical',
		itemSelector: '.box',
		animationOptions: {
			duration: 200,
			easing: 'linear',
			queue: false
		}
	});
	
	/*
	 Isotope Filtering code
	*/
	
	$('#filters ul li a').each(function(i){
		var $this = $(this);
		
		if ($this.attr('data-filter') == "") {
			return;
		}
		
		if ($isotope_container.find($this.attr('data-filter')).length == 0) {
			$this.remove();
		}
	});
	
	$($('#filters a')[0]).addClass("selected");
	$('#filters a').click(function(){
		var selector = $(this).attr('data-filter');
	
		$('#filters li').find('.selected').removeClass('selected');
		$(this).addClass('selected');
	
		$isotope_container.isotope({ filter: selector });
		$isotope_container.isotope();
	
		return false;
	});
}