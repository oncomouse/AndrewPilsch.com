import addOns from 'add-ons'
import {prepImages, updateImages} from 'mobile/images'
import {manageHash} from 'mobile/hash';
import {addClass, removeClass, toggleClass, removeNode, insertBefore} from 'mobile/dom'

export default function() {

	const attachReadMoreLink = function(newNode) {
		if(newNode.querySelector('.expandable') !== null) {
			const readMoreParagraph = document.createElement('P');
			const readMoreLink = document.createElement('A');
			readMoreLink.setAttribute('href', '#');
			readMoreLink.innerHTML = 'Read More';
			readMoreLink.addEventListener('click', function(ev) {
				if(ev.defaultPrevented) {
					return;
				}
				ev.preventDefault();
				ev.currentTarget.parentNode.style.display = 'none';
				addClass(newNode.parentNode, 'read-more')
			});
			readMoreParagraph.appendChild(readMoreLink);
			const target = newNode.querySelector('.hideable');
			(target === null ? newNode : target).appendChild(readMoreParagraph);
		}
	}

	prepImages();

	// Move "#about":
	document.querySelector('header').insertBefore(document.querySelector('#about'), document.querySelector('#filters'));

	// Clone and move "#find_me":
	const newFindMe = document.querySelector('#find_me').cloneNode(true);
	removeNode(document.querySelector('#find_me'));
	insertBefore(document.querySelector('#filters'), newFindMe);

	const newContent = document.createElement('ARTICLE');
	const newContentList = document.createElement('UL');
	newContent.appendChild(newContentList);
	insertBefore(document.querySelector('#box_container'), newContent);

	document.querySelectorAll('#filters a').forEach(link => {
		if(link.getAttribute('data-filter') !== '') {
		
			// Create an LI and an A (to attach events) to:
			const newContentSectionListItem = document.createElement('LI');
			const newContentLink = link.cloneNode(true);
			newContentSectionListItem.appendChild(newContentLink);
			newContentList.appendChild(newContentSectionListItem);
			newContentLink.setAttribute('id', link.getAttribute('data-filter').replace(/^\./,''));
		
			// Attach a clickable event to the top-level links:
			newContentLink.addEventListener('click', function(ev) {
				if(ev.defaultPrevented) {
					return;
				}
				ev.preventDefault();
				toggleClass(ev.currentTarget.parentNode, 'open')
			});
			// Begin creator the second layer list that will contain the content:
			const sectionList = document.createElement('UL');
			document.querySelectorAll(`#box_container ${link.getAttribute('data-filter')}`).forEach(function(node) {
				const sectionListItem = document.createElement('LI');
				const newNode = node.cloneNode(true);
			
				// Attach content to the LI:
				sectionListItem.appendChild(newNode);
			
				// Attach a "read more" link:
				attachReadMoreLink(newNode);
				if(newNode.querySelector('.hideable') !== null) {
					const clickableHeaders = newNode.querySelectorAll('.hideable h1, .hideable h2')
					clickableHeaders[clickableHeaders.length - 1].insertAdjacentHTML('beforeend', '&nbsp;<i class="fa fa-caret-right" aria-hidden="true"></i>');
				}
			
				// Handle content that is not expandable:
				if(newContentLink.getAttribute('id') !== 'blog' && newNode.querySelector('.expandable') === null && newNode.querySelector('.expandable') === null) {
					addClass(sectionListItem, 'no-expandable')
				}
				// Add event that will open each second order list item
				sectionListItem.addEventListener('click', function(ev) {
					if(ev.defaultPrevented) {
						return;
					}
					ev.preventDefault();
					toggleClass(ev.currentTarget,'open');
					toggleClass(ev.currentTarget.querySelector('i'), 'fa-caret-right')
					toggleClass(ev.currentTarget.querySelector('i'), 'fa-caret-down')
					manageHash(ev.currentTarget);
				
					updateImages();
					ev.currentTarget.querySelectorAll('img.lazy').forEach(img => removeClass(img, 'lazy'))
				})
				// Attach the section list item to the list:
				sectionList.appendChild(sectionListItem)
			});
			// Attach the section list:
			newContentSectionListItem.appendChild(sectionList);
		}
	})
	window.dispatchEvent(new Event('htmlsetup'));
	addOns()
	var loadDeferredStyles = function() {
		var addStylesNode = document.getElementById("deferred-styles-mobile");
		var replacement = document.createElement("div");
		replacement.innerHTML = addStylesNode.textContent;
		document.body.appendChild(replacement)
		addStylesNode.parentElement.removeChild(addStylesNode);
	};
	var raf = requestAnimationFrame || mozRequestAnimationFrame ||
				webkitRequestAnimationFrame || msRequestAnimationFrame;
	if (raf) raf(function() { window.setTimeout(loadDeferredStyles, 0); });
	else window.addEventListener('load', loadDeferredStyles);
	removeClass(document.querySelector('html'), 'no-js')
	addClass(document.querySelector('html'), 'mobile')
	addClass(document.querySelector('html'), 'js')
}