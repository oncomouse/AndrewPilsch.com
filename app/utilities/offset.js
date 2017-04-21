// Vanilla JS offset: https://jsperf.com/test-offset-jquery-vs-vanilla

export default function offset(elt) {
	const rect = elt.getBoundingClientRect();
	const bodyElt = document.body;

	return {
		top: rect.top + bodyElt .scrollTop,
		left: rect.left + bodyElt .scrollLeft
	}
}