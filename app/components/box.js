import {getOpenBox} from 'store'
import {openBox, closeBox} from 'actions/openActions'
import {loadImages} from 'actions/imageActions'
import {width,height} from 'utilities/size'
import scrollIt from 'utilities/scrollIt'
import offset from 'utilities/offset'

function whichTransitionEvent(){
    var t;
    var el = document.createElement('fakeelement');
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}

export default class BoxManager {
	constructor(store, isotope) {
		this.store = store;
		this.isotope = isotope;
		this.openBox = getOpenBox(this.store);
		this.store.subscribe(this.handleBoxStateChange.bind(this));
		this.transitionEvent = whichTransitionEvent();
	}
	dispatchOpenBox(event) {
		event.preventDefault();
		this.store.dispatch(openBox(`#${event.currentTarget.id}`));
	}
	dispatchCloseBox(event) {
		event.preventDefault();
		this.store.dispatch(closeBox());
	}
	renderOpenBox(elem) {
		elem.classList.add('expanded');
		this.transitionEvent & elem.addEventListener(this.transitionEvent, (e) => {
			// Scroll to the open box on arrangeComplete:
			this.isotope.once('layoutComplete', () => scrollIt(offset(e.target).top - (this.columnPadding * 2), 500));
			// Trigger rearrangement:
			this.isotope.layout();
		}, {once: true});
	}
	renderCloseBox(elem) {
		if(elem === null) { return }
		// Box sizing is now handled via CSS:
		elem.classList.remove('expanded');
		this.transitionEvent & elem.addEventListener(this.transitionEvent, (e) => {
			// Trigger rearrangment:
			this.isotope.arrange();
			// Reattach the ability to open the box:
			e.target.addEventListener('click', this.dispatchOpenBox.bind(this), {once: true});
		}, {once: true});
	}
	handleBoxStateChange() {
		const openBox = getOpenBox(this.store);
		if(openBox !== this.openBox) {
			// Restore the open box:
			this.renderCloseBox(document.querySelector('.expanded'));
			// We are opening a new box:
			if(openBox !== null) {
				// Set box size to expanded sizes:
				this.renderOpenBox(document.querySelector(openBox));
				// Append "Close All" Button (if missing):
				if(document.querySelector('#close_all') === null) {
					// Insert the button:
					document.querySelector('#filters ul').insertAdjacentHTML('beforeend', '<li id="close_all"><a href="">Close All</a></li>');
					// Add the event listener:
					document.querySelector('#close_all a').addEventListener('click', this.dispatchCloseBox.bind(this));
				}
			} else {
				// Remove "Close All" Button:
				document.querySelector('#close_all').parentNode.removeChild(document.querySelector('#close_all'));
			}
			this.openBox = openBox;
			this.isotope.arrange();
		}
	}
	loadImages () {
		this.store.dispatch(loadImages())
	}
	onReady() {
		// Set up:
		this.defaultSize = [width(document.querySelector('#large_box_size')), height(document.querySelector('#large_box_size'))];
		this.columnPadding = width(document.querySelector('#column_padding'));
	
		// Box Expansion Events:
		document.querySelectorAll('.box.expand').forEach((elem) => {
			elem.addEventListener('click', this.dispatchOpenBox.bind(this), {once: true});
		});
		this.isotope.once('layoutComplete', this.loadImages.bind(this));
		// Trigger Masonry Layout:
		this.isotope.layout();
	}
}

