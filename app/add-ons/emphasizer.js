export default () => {
	document.querySelectorAll('.box.emphasize').forEach((el) => {
		el.classList.remove('col1');
		el.classList.add('col2');
	})
}