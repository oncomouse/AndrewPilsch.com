/* globals Isotope, raf, LazyLoad */
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

document.addEventListener('DOMContentLoaded', function () {
  var OPEN_CLASS = 'open';
  var ACTIVE_CLASS = 'active';
  var HIDDEN_CLASS = 'dn';
  var SHOWN_CLASS = 'dib';
  var BOX_CLASS = 'box';
  var FILTER_CLASS = 'filter';

  // Utitlity Functions:
  function hasClass(cl, el) {
    return el.className.split(' ').indexOf(cl) >= 0;
  }
  function addClass(cl, el) {
    if (!hasClass(cl, el)) {
      el.className = el.className === '' ? cl : el.className + ' ' + cl;
    }
  }
  function removeClass(cl, el) {
    el.className = el.className
      .split(' ')
      .filter(function (x) {return x !== cl;})
      .join(' ');
  }
  function toggleClass(cl, el) {
    hasClass(cl, el) ? removeClass(cl, el) : addClass(cl, el);
  }
  // Set up the timer for the help function:
  var helpTimer = window.setTimeout(function () {
    removeClass('dn', document.querySelector('#help'));
    removeClass('o-0', document.querySelector('#help'));
  }, 5000);
  // Scale the temporary images:
  document.querySelectorAll('.lazy').forEach(function (el) {
    var box = el.parentNode.parentNode.parentNode;
    var width = parseInt(el.style.width, 10);
    var height = parseInt(el.style.height, 10);
    var aspectRatio = height / width;
    var minWidth;
    // Mobile support for image scaling:
    var bodyWidth = document.body.getBoundingClientRect().width;
    if (bodyWidth < 768) {
      minWidth = bodyWidth - 29;
    } else {
      if (document.body.getBoundingClientRect().width >= 432.89 && hasClass('w-col-2', box)) {
        minWidth = 432.89;
      } else {
        minWidth = 206.09;
      }
    }
    var newWidth = minWidth < width ? minWidth : width;
    el.style.width = newWidth + 'px';
    el.style.height = (aspectRatio * newWidth) + 'px';
  });

  // Clickable Box Linker:
  function makeBoxIntoALink(el, url, insert) {
    var outputLink = document.createElement('A');
    outputLink.href = url;
    outputLink.className = 'black hover-black';
    if (insert) {
      el.insertAdjacentElement('afterend', outputLink);
      outputLink.appendChild(el.cloneNode(true));
      el.parentNode.removeChild(el);
    } else {
      outputLink.appendChild(el);
    }
    return outputLink;
  }

  // Configure Clickable Boxes:
  document.querySelectorAll('[data-uri]').forEach(function (element) {
    makeBoxIntoALink(element, element.getAttribute('data-uri'), true);
  });

  // Configure Isotope:
  var iso = new Isotope('#grid', {
    itemSelector: '.' + BOX_CLASS,
    layoutMode: 'masonry',
    masonry: {
      columnWidth: parseInt(window.getComputedStyle(document.querySelector('.column-size')).width, 10),
    },
    initLayout: false,
  });

  function triggerLayout() {
    iso.layout();
  }

  // Close all the open boxes:
  function closeOpenBoxes() {
    var boxes = document.querySelectorAll('.' + OPEN_CLASS)
    // This allows for true toggling. We wait on animation frame for the new box
    // to open and then, if there are other open boxes, we remove them:
    if (boxes.length > 0) {
      raf(function () { // We use raf (requestAnimationFrame polyfill)
        boxes.forEach(function (el) {
          removeClass(OPEN_CLASS, el);
        });
        hideCloseAllButton();
      });
    }
  }

  // Do the work of opening or closing the box:
  function openOrCloseBox(el) {
    // Clear the help timer and remove the help if it is open:
    clearTimeout(helpTimer);
    addClass('dn', document.querySelector('#help'));
    toggleClass(OPEN_CLASS, el);
    iso.layout();
  }

  function hideCloseAllButton() {
    var closeAllButton = document.querySelector('#close-all');
    if (closeAllButton !== null) {
      removeClass(SHOWN_CLASS, closeAllButton);
      addClass(HIDDEN_CLASS, closeAllButton);
    }
  }

  function showCloseAllButton() {
    var closeAllButton = document.querySelector('#close-all');
    if (closeAllButton !== null) {
      removeClass(HIDDEN_CLASS, closeAllButton);
      addClass(SHOWN_CLASS, closeAllButton);
    }
  }

  // Toggle open and close for a clicked box:
  function toggleBox(ev) {
    // We don't open the box if the target is in a link OR if the box is open:
    if (ev.target.closest('a') === null && !hasClass(OPEN_CLASS, ev.currentTarget)) {
      ev.preventDefault();
      closeOpenBoxes();
      openOrCloseBox(ev.currentTarget);
    }
  }
  document.querySelectorAll('.' + BOX_CLASS).forEach(function (el) {
    if (el.querySelectorAll('.content').length > 0) {
      el.addEventListener('click', toggleBox);
    }
  });

  // Filter:
  function filterBoxes(ev) {
    ev.preventDefault();
    var target = ev.currentTarget;
    if (!hasClass(ACTIVE_CLASS, target)) {
      document.querySelectorAll('.' + ACTIVE_CLASS).forEach(function (el) {
        removeClass(ACTIVE_CLASS, el);
      });
      addClass(ACTIVE_CLASS, target);
      iso.once('arrangeComplete', function () {
        closeOpenBoxes();
      });
      iso.arrange({
        filter: target.getAttribute('data-filter'),
      });
    }
  }
  // Set up event handlers for the filter buttons:
  document.querySelectorAll('.' + FILTER_CLASS).forEach(function (el) {
    // This is the "Close All" button:
    if (hasClass(HIDDEN_CLASS, el)) {
      el.addEventListener('click', function (ev) {
        ev.preventDefault();
        closeOpenBoxes();
        raf(triggerLayout);
      });
      // Otherwise, run the filter target:
    } else {
      el.addEventListener('click', filterBoxes);
    }
  });

  // Setup stuff to run after layout:
  iso.once('layoutComplete', function () {
    // Check if there is an open box according to the hash:
    if (window.location.hash !== '') {
      var hashTarget = document.querySelector(window.location.hash);
      openOrCloseBox(hashTarget);
    }
    // Load images:
    new LazyLoad({
      elements_selector: ".lazy",
      callback_load: function (el) {
        el.style.width = '';
        el.style.height = '';
      },
    });
  });
  // Clean-up tasks for when a layout is triggered:
  iso.on('layoutComplete', function () {
    var openBox = document.querySelector('.' + OPEN_CLASS);
    if (openBox) {
      if (window.location.hash != '#' + openBox.getAttribute('id')) {
        window.location.hash = openBox.getAttribute('id');
      }
      if (openBox.getBoundingClientRect().top !== 0) {
        openBox.scrollIntoView();
      }
      showCloseAllButton();
    } else {
      hideCloseAllButton();
      window.location.hash = '';
    }
  });

  // Once events have been set up, trigger Isotope:
  iso.arrange();
});
