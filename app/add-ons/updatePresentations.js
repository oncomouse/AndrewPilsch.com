export default () => {
	var now = Math.round(Date.now() / 1000);
	document.querySelectorAll('.presentation').forEach((el) => {
		const h2 = el.querySelector('.hideable h2');
		if(parseInt(el.getAttribute('data-timestamp')) < now && h2.innerHTML === 'Upcoming Presentation') {
			h2.innerHTML = 'Recent Presentation';
		}
	})
}
