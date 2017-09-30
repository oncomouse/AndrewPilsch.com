// Vanilla JS offset: https://jsperf.com/test-offset-jquery-vs-vanilla

export default function offset(el) {
	const rect = el.getBoundingClientRect();
	const bodyEl = document.body.getBoundingClientRect();

	return {
		top: rect.top - bodyEl.top,
		left: rect.left - bodyEl.left
	}
}