var $isotope_container = false;
var $courses_loaded = false;
var $research_loaded = false;
var $excerpt_length = 250;

// These used to be generated by Middleman's magic numbers. Now we extract them from CSS:
var $defaultSize = [$('#large_box_size').width(), $('#large_box_size').height()];
var $column_width = $('#column_width').width();
var $column_padding = $('#column_padding').width();
var $col1 = $('.col1').eq(0).width();

var $help_timer = false;
var $help_timer_delay = 5000;

function handle_isotope_loader(){
	if($isotope_container) {
		$isotope_container.isotope();
	} else {
		window.setTimeout(function(){handle_isotope_loader();}, 50);
	}
}
	
//$('.expand').imagesLoaded(handle_isotope_loader);

function scroll_to(target){
	$('html, body').animate({
	         scrollTop: $(target).offset().top - ($column_padding * 2)
	     }, 500);
}

function restore_boxes() {
	var len = $('.expanded').length - 1;
	
	$('#close_all').remove();
	
	$('.expanded').each(function (i) {
		//console.log(this);
		var box = $(this).data('size');
		$(this).find('.expandable').hide('normal');
		$(this).find('.hideable').show('normal');
		$(this).animate({
			width: (box[0] || 100),
			height: (box[1] || 'auto')
		}, 200, function () {
			if (i >= len) {
				$isotope_container.isotope('updateSortData', $(this));
				$isotope_container.isotope();
			}
		}).removeClass('expanded');
	})
}

function expand_box(target) {

	// If taget is blank, return:
	if (target == "") {
		return;
	}	
	var target = $(target);
	
	// Clear the help display:
	if ($('#help').hasClass("displayed")) {
		$('#help').animate(
			{
				opacity: 0.0
			},
			500,
			function(){
				$('#help').removeClass("displayed");
			}
		);
	} else {
		window.clearTimeout($help_timer);
	}
	
	if (target.is('.expanded')) {
		//restore_boxes();
	} else {
		var size = (target.attr('data-size')) ? target.attr('data-size').split(',') : $defaultSize;
		// save original box size
		target.data('size', [target.outerWidth(), target.outerHeight()]).animate({
				width: size[0],
				height: size[1]
		}, 200, function () {
				// show hidden content when box has expanded completely
				var $this=$(this);
				$this.find('.expandable').show('normal')
				$this.find('.hideable').hide('normal');
				$isotope_container.isotope('updateSortData', $(this));
				$isotope_container.isotope();
				$('#filters ul').append("<li id='close_all'><a href='javascript: window.location.hash=\"\"; restore_boxes();'>Close All</a></li>");
				window.setTimeout(function(){scroll_to($this)}, 500);
		});
		restore_boxes();
		target.addClass('expanded');
	}			
}

function load_all_courses() {
	var url;
	if ($courses_loaded) {
		return false;
	}
	if (window.location.href.match(/localhost/)) {
		url = "/courses/courses.html";
	} else {
		url = "/courses/courses.php";
	}
	$.ajax(url).done(
		function(data) {
			if (!$courses_loaded) {
				$isotope_container.isotope('insert', $(data));
				$courses_loaded = true;
			}
			$isotope_container.isotope({filter: '.class'});
			$('#filters li').find('.selected').removeClass('selected');
			$("#filters ul li a").each(
				function() {
					if ($(this).attr("data-filter") == ".teaching") {
						$(this).addClass('selected');
					}
				}
			);
		}
	);
	
	return false;
}

function load_all_research() {
	if ($research_loaded) {
		return false;
	}
	if (window.location.href.match(/localhost/)) {
		url = "/research/research.html";
	} else {
		url = "/research/research.php";
	}
	$.ajax(url).done(
		function(data) {
			if (!$research_loaded) {
				$isotope_container.isotope('insert', $(data));
				$research_loaded = true;
			}
			$("#filters ul li a").each(
				function() {
					if ($(this).attr("data-filter") == ".research") {
						$(this).click();
					}
				}
			);
		}
	);

	return false;
}

$(window).resize(function(){
	if($(window).width() < $large_box_size[0]) {
		$defaultSize = [$col2, $colh2];
	} else {
		$defaultSize = $large_box_size;
	}
	/*if ($(window).width() < $minimum_content_width * 2) {
		$defaultSize = [$col1,$colh2];
		$istope_container.isotope({
			masonry: {
				columnWidth: $minimum_content_width * 2;
			}
		});
	} else {
		$defaultSize = $large_box_size;
		$isotope_container.isotope({
			masonry: {
				columnWidth: $column_width;
			}
		});
	}*/
});

function start_isotope() {
	$isotope_container = $('#box_container');
	
	$expandable_boxes = $('.expand');
	
	$('#filters ul li a').each(function(i){
		var $this = $(this);
		
		if ($this.attr('data-filter') == "") {
			return;
		}
		
		if ($isotope_container.find($this.attr('data-filter')).length == 0) {
			$this.remove();
		}
	});
	
	/* Add excerpts and titles to any boxes that don't have these */
	$expandable_boxes.find('.expandable p:first-of-type').each(function(i){
		var $this = $(this);

		if ($this.parent().parent().find('.hideable').hasClass("noexcerpt")) {
			return;
		}
		var target = $this.parent().parent().find('.hideable');
		if ($this.parent().hasClass('scrollable')) {
			target = $this.parent().parent().parent().find('.hideable');
		}
		var h1 = $($this.parent().find("h1")[0]);
		
		if (h1.html() && target.find("h1,h2,h3,h4").length == 0) {
			if (target.find('img').length == 0) {
				target.prepend("<h1 class=\"title\">" + h1.html() + "</h1>");
			} else {
				$("<h1 class=\"title\">" + h1.html() + "</h1>").insertAfter(target.find('img'));
			}
		}
		
		if (target.find('p').length == 0 && !target.parent().hasClass("no-excerpt")){
			target.append("<p>" + jps_shortString($this.html(),$excerpt_length).summary + "</p>");
		}
	});
	
	imagesLoaded($isotope_container, function() {
		$isotope_container.isotope({
			layoutMode : 'masonry',
			masonry: {
				columnWidth: $column_width
			},
			cornerStampSelector: '.corner_stamp',
			itemSelector: '.box',
			animationOptions: {
				duration: 200,
				easing: 'linear',
				queue: false
			},
			/*
			 This sort data function, rowDominator, puts any expanded box (see below)
			 at the beginning of the row. This code works for any number of columns, 
			 but it does assume that blocks are the same width.
			*/
			getSortData: {
				rowDominator: function($item) {
					var index,order,number_of_columns;
					var displayed = $('.expand').not('.isotope-hidden');

					if(!($item instanceof jQuery)) {
						$item = $($item);
					}

					// Determine the index based on the order of displayed nodes, 
					// not overall nodes (otherwise, behavior isn't as expected):
					index = displayed.index($item);
				
					// If an item isn't marked as expandable, use it's regular 
					// index:
					if (index == -1) {
						index = $item.index();
					}
					number_of_columns = Math.floor($isotope_container.outerWidth() / $column_width);
				
					if ($item.outerWidth() > $col1) {
						order = index - (index % number_of_columns) - 0.5;
					} else{
						order = index;
					}
					return order;
				}
			},
			sortBy: 'rowDominator'
		});
	});

	/*
	 Set up the expand and contract action.
	
	 This very awesome code was borrowed (and mildly rewritten) from code written by
	 Jason Day for his site, http://thinquetanque.com/.
	
	 The only change I have made is to use Isotope instead of jQuery Masonry and to
	 support updating the sort data for Isotope.
	*/
	
	/* Handle internal links */
	$(".box a[href^=\'#\'], #sidebar ul li a[href^=\'#\']").click(function () {
		var target = $(this).attr("href");
		if (target.length > 0) {
			$(target).click();
		}
		return false;
	});
	$expandable_boxes.click(function() {
		var target = $(this).attr('id');
		window.location.hash = "#" + target;
		return true;
	});
	
	$(window).bind( 'hashchange', function( event ){
		expand_box(window.location.hash);
	});
		
	/*
	 Isotope Filtering code
	*/
	$($('#filters a')[0]).addClass("selected");
	$('#filters a').click(function(){
		var selector = $(this).attr('data-filter');
		
		if (!$isotope_container.find('.expanded'+selector).length) {
			restore_boxes();
		}
	
		$('#filters li').find('.selected').removeClass('selected');
		$(this).addClass('selected');
	
		$isotope_container.isotope({ filter: selector });
		$isotope_container.isotope('updateSortData', $(selector));
		$isotope_container.isotope();
	
		return false;
	});
	
	/* Set up a timer to determine how long to wait before displaying some help information. */
	$help_timer = window.setTimeout(
		function() {
			$('#help').addClass('displayed');
			$('#help').animate({opacity: 1.0},500,function(){});
		},
		$help_timer_delay
	);
	
	$(window).trigger('hashchange');
}
//});

function jps_shortString( str, limit )
{
	var body = new String( str );
	var summary = new String(str);
		summary = summary.substr( 0, summary.lastIndexOf( ' ', limit ) ) + '...';

	var returnString = new Object({
		body: body,
		summary: summary
	});
	return returnString;
}