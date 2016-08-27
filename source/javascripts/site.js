var $isotope_container = false;
var $courses_loaded = false;
var $research_loaded = false;
var $excerpt_length = 250;

// These used to be generated by Middleman's magic numbers. Now we extract them from CSS:
var $large_box_size = [$('#large_box_size').width(), $('#large_box_size').height()];
var $column_width = $('#column_width').width();
var $column_padding = $('#column_padding').width();
var $col1 = $('.col1').eq(0).width();

var $defaultSize = $large_box_size;

var $help_timer = false;
var $help_timer_delay = 5000;

if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    if (this.prototype) {
      // Function.prototype don't have a prototype property
      fNOP.prototype = this.prototype; 
    }
    fBound.prototype = new fNOP();

    return fBound;
  };
}

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
		var box = $(this).data('size');
		$(this).find('.expandable').hide('normal');
		$(this).find('.hideable').show('normal');
		if($('html').hasClass('accelerate')) {
			$(this).css({
				width: (box[0] || 100),
				height: (box[1] || 'auto')
			}).removeClass('expanded');
			window.setTimeout(function () {
				if (i >= len) {
					$isotope_container.isotope('updateSortData', $(this));
					$isotope_container.isotope();
				}
			}.bind(this), 200);
		} else {
			$(this).animate({
				width: (box[0] || 100),
				height: (box[1] || 'auto')
			}, 200, function () {
				if (i >= len) {
					$(this).removeClass('expanded');
					$isotope_container.isotope('updateSortData', $(this));
					$isotope_container.isotope();
				}
			});
		}
		
	});
}

function expand_box(target) {
	
	if(_gaq) {
		_gaq.push(['_trackPageview', target]);
	}

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
		if($('html').hasClass('accelerate')) {
			target.data('size', [target.outerWidth(), target.outerHeight()]).css({
				width: size[0],
				height: size[1]
			});
			window.setTimeout(function () {
				// show hidden content when box has expanded completely
				var $this=$(this);
				$this.find('.expandable').show('normal')
				$this.find('.hideable').hide('normal');
				$isotope_container.isotope('updateSortData', $(this));
				$isotope_container.isotope();
				$('#filters ul').append("<li id='close_all'><a href='javascript: window.location.hash=\"\"; restore_boxes();'>Close All</a></li>");
				window.setTimeout(function(){scroll_to($this)}, 500);
			}.bind(target), 200);
		} else {
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
		}
		restore_boxes();
		target.addClass('expanded');
	}			
}

function load_courses(term) {
	var url, term;
	if (window.location.href.match(/localhost/)) {
		return;
	}
	if (term === false || term === undefined) {
		term = false;
		url = '/courses/?blank';
	} else {
		url = 'courses/?blank&term=' + encodeURIComponent(term);
	}
	$.ajax(url).done(
		function(data) {
			$isotope_container.isotope('insert', $(data));
			if (!term) {
				var seen = [];
				$('.box.class').each(function(i,class_box) {
					class_box = $(class_box);
					if($.inArray(class_box.attr('id'), seen) != -1) {
						class_box.remove();
					} else {
						seen.push(class_box.attr('id'));
					}
				});
			}
			window.setTimeout(function(){$isotope_container.isotope();}, 250);
			
			if (!term) {
				
				$(window).trigger('course:load_all');
			}
		}
	);
}

function load_all_courses(ev) {
	ev.stopPropagation();
	ev.preventDefault();
	
	if ($courses_loaded) {
		return false;
	}
	$courses_loaded = true;
	load_courses();

	return false;
}

$(window).on('course:load_all', function() {
	$isotope_container.isotope({filter: '.class'});
	$('#filters li').find('.selected').removeClass('selected');
	$('#filters ul li a[data-filter=".teaching"]').addClass('selected');
});

$(document).ready(function() {
	$('#teaching_button').click(load_all_courses);
	load_courses(current_term);
});

function load_all_research() {
	//if ($research_loaded) {
	//	return false;
	//}
	//if (window.location.href.match(/localhost/)) {
	//	url = "/research";
	//} else {
	//	url = "/research/research.php";
	//}
	//$.ajax(url).done(
	//	function(data) {
	//		if (!$research_loaded) {
	//			$isotope_container.isotope('insert', $(data));
	//			$research_loaded = true;
	//		}
	//		$("#filters ul li a").each(
	//			function() {
	//				if ($(this).attr("data-filter") == ".research") {
	//					$(this).click();
	//				}
	//			}
	//		);
	//	}
	//);

	return false;
}

$(window).resize(function(){
	if($(window).width() < $large_box_size[0]) {
		$defaultSize = [$col2, $colh2];
	} else {
		$defaultSize = $large_box_size;
	}
	
	$('header').height($('#filters').outerHeight(true));
	
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
	
	var cssTransitionsSupported = ((document.body || document.documentElement).style.WebkitTransition !== undefined || (document.body || document.documentElement).style.transition !== undefined),
		has3D = ('WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix());

	if(cssTransitionsSupported && has3D) {
		$('html').addClass('accelerate');
	} else {
		$('html').addClass('animate');
	}
	
	if($('html').hasClass('accelerate')) {
		$('.box.expand').addClass('accelearate')
	}
	
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
	
	/* Process all the images we will lazy load and figure out how big they'll be when they are loaded.
	   This lets masonry fire without the images having been loaded AND we don't have to call isotope a bunch of times
	   after each image loads.
	*/
	$('img.lazy').each(function() {
		var $this, image_width, image_height;
		
		$this = $(this);
		image_width = $this.parent().innerWidth();
		
		// We don't need to run this, I think:
//		if(image_width < 0) {
//			if($this.parents().filter('.col1, .col2').hasClass('col1')) {
//				image_width = $('.col1 img.lazy').eq(0).innerWidth();
//			} else {
//				image_width = $('.col2 img.lazy').eq(0).innerWidth();
//			}
//		
//		}
		
		image_height = image_width/parseInt($this.attr('data-image-width')) * parseInt($this.attr('data-image-height'));
		if(image_width > parseInt($this.attr('data-image-width')) || image_height > parseInt($this.attr('data-image-height'))) {
			image_width = parseInt($this.attr('data-image-width'));
			image_height = parseInt($this.attr('data-image-width'));
		}
		
		$this.css('width', image_width);
		$this.css('height', image_height);
	});
	

	
	// Check if we can squeeze another column into the layout:
	var margin_width = $('body').outerWidth(true) - $('body').outerWidth(false);
	var remaining_space = $column_width - $('body').outerWidth(false) % $column_width;
	
	if(remaining_space > 0 && remaining_space < margin_width) {
		$('body').css('margin-left', Math.ceil((margin_width - remaining_space) / 2));
		$('body').css('margin-right', Math.ceil((margin_width - remaining_space) / 2));
	}
	
	/* We start lazy loading images when masonry first completes.
	   As images load, we count how many load.
	   When we have the total number of images loaded, we masonry again to fix any overlap.
	*/
	var image_loaded_counter = 0;
	$('img.lazy').lazyload({
		event: 'masonryComplete',
		load: function() {
			$(this).css('width', '');
			$(this).css('height', '');
			image_loaded_counter += 1;
			if (image_loaded_counter >= $('img.lazy').length) {
				$isotope_container.isotope();
			}
		}
	});
	
	$isotope_container.isotope({
		isInitLayout: false,
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
		/*getSortData: {
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
		sortBy: 'rowDominator'*/
	});
	$isotope_container.isotope( 'on', 'arrangeComplete', function() {
		$('img.lazy').trigger('masonryComplete');
	});
	$isotope_container.isotope();

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