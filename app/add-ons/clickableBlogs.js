export default () => {
	document.querySelectorAll('.box.blog').forEach((el) => {
		const url = el.getAttribute('data-uri');
		if(url === undefined || url === null) {
			return;
		}
		el.addEventListener('click', (ev) => document.location.href = url)
	})
}