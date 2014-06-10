$(document).ready(function() {
	$('.box.blog').each(function() {
		var $this = $(this);
		var url = $this.attr('data-url');
		$this.on("click", function(){
			document.location.href = url;
		});
	})
});