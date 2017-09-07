const classRegExp = className => new RegExp(className,'i');

export const addClass = function(obj,className) {
	obj.classList.add(className);
}
export const removeClass = function(obj, className) {
	//obj.className = obj.className.replace(classRegExp(className),'');
	obj.classList.remove(className);
}
export const toggleClass = function(obj, className) {
	if(obj.className.match(classRegExp(className))) {
		removeClass(obj,className);
	} else {
		addClass(obj,className)
	}
}
export const removeNode = function(obj) {
	obj.parentNode.removeChild(obj)
}
export const insertBefore = function(target, newObj) {
	target.parentNode.insertBefore(newObj, target);
}