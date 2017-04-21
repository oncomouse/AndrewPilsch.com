export const width = (elem) => {
	const w = parseInt(window.getComputedStyle(elem).width);
	return !Number.isNaN(w) ? w : -1;
}
export const height = (elem) => {
	const h = parseInt(window.getComputedStyle(elem).height);
	return !Number.isNaN(h) ? h : -1;
}