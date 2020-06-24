var OPEN_CLASS = 'open';
var ACTIVE_CLASS = 'active';
var HIDDEN_CLASS = 'dn';
var SHOWN_CLASS = 'dib';
var BOX_CLASS = 'box';
var FILTER_CLASS = 'filter';

var BOX_STYLE = 'pointer overflow-auto min-h-col-1 bg-white pa1 ma-custom ba bb-thick br2 b--custom-gray';

function addClass(cl, el) {
  if (hasClass(cl, el)) {
    return el;
  }
  el.className = el.className === '' ? cl : el.className + ' ' + cl;
}
function removeClass(cl, el) {
  el.className = el.className
    .split(' ')
    .filter(function (x) {return x !== cl;})
    .join(' ');
}
function hasClass(cl, el) {
  return el.className.split(' ').includes(cl);
}
function toArray(notArray) {
  return Array.prototype.slice.call(notArray);
}
function clickableBoxEventListener(ev) {
  ev.preventDefault();
  window.location.assign(ev.currentTarget.getAttribute('data-uri'));
}

document.addEventListener('DOMContentLoaded', function (ev) {
  // Set up the timer for the help function:
  var helpTimer = window.setTimeout(function () {
    removeClass('dn', document.querySelector('#help'));
    removeClass('o-0', document.querySelector('#help'));
  }, 5000);
  // Scale the temporary images:
  toArray(document.querySelectorAll('.lazy')).forEach(function (el) {
    var box = el.parentNode.parentNode.parentNode;
    var width = parseInt(el.style.width, 10);
    var height = parseInt(el.style.height, 10);
    var aspectRatio = height / width;
    var minWidth;
    if (hasClass('w-col-2', box)) {
      minWidth = 432.89;
    } else {
      minWidth = 206.09;
    }
    el.style.width = minWidth + 'px';
    el.style.height = (aspectRatio * minWidth) + 'px';
  });

  // Configure ZenScroll:
  zenscroll.setup(null, 0);

  // Configure clickable boxes:
  toArray(document.querySelectorAll('[data-uri]')).forEach(function (element) {
    element.addEventListener('click', clickableBoxEventListener);
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
    var boxes = toArray(document.querySelectorAll('.' + OPEN_CLASS))
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
    hasClass(OPEN_CLASS, el) ? removeClass(OPEN_CLASS, el) : addClass(OPEN_CLASS, el);
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
      toArray(document.querySelectorAll('.' + ACTIVE_CLASS)).forEach(function (el) {
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
    // Attach courses:
    if (window.ENV['JEKYLL_ENV'] === 'production') {
      function boxLoadCallback(boxes) {
        iso.addItems(boxes);
        iso.reloadItems();
        iso.arrange({
          sortBy: 'original-order',
        });
      }
      // Attach courses:
      var today = new Date();
      var month = today.getMonth() + 1;
      var year = today.getFullYear();
      var term = (month >= 1 && month < 6 ? 'Spring' : 'Fall') + ' ' + year;
      fetch('https://oncomouse.github.io/courses/courses.json')
        .then(function (res) {return res.json()})
        .then(function (json) {return json.filter(function (course) {return course.course_term === term;})})
        .then(function (courses) {
          var template = document.querySelector('#all-courses').cloneNode(true);
          var mountPoint = document.querySelector('#grid');
          var output = [];
          courses.forEach(function (course) {
            var outputBox = template.cloneNode(true);
            outputBox.id = '';
            outputBox.setAttribute('data-uri', course.course_url);
            outputBox.addEventListener('click', clickableBoxEventListener);
            outputBox.querySelector('h1').innerText = course.course_title + ', ' + course.course_term;
            outputBox.querySelector('.lh-copy').innerHTML = snarkdown(course.course_description);
            function attach(image) {
              var imageContainer = outputBox.querySelector('.thumbnail .mt2');
              imageContainer.innerHTML = '';
              imageContainer.appendChild(image);
              mountPoint.appendChild(outputBox);
              output.push(outputBox);
              iso.appended(outputBox);
              iso.layout();
            }
            var image = new Image();
            image.onload = function () {
              attach(image);
            }
            image.onerror = function () {
              image.src = 'https://dummyimage.com/206x150/fff/000.png&text=' + course.course_id;
            }
            image.src = course.course_image;
          });
          return output;
        })
        .then(boxLoadCallback);
      // Attach blog posts:
      fetch('https://andrew.pilsch.com/blog/frontpage.json')
        .then(function (res) {return res.json();})
        .then(function (posts) {
          var output = [];
          var template = document.querySelectorAll('.research.w-col-1.box')[1].cloneNode(true);
          var mountPoint = document.querySelector('#blog_posts');
          posts.forEach(function (post) {
            var outputBox = template.cloneNode(true);
            outputBox.classList.remove('research');
            outputBox.classList.add('blog');
            outputBox.id = '';
            outputBox.querySelector('header').removeChild(outputBox.querySelector('img'));
            outputBox.querySelector('h2').innerText = 'Recent Blog Post';
            outputBox.querySelector('h1').innerText = post.title;
            outputBox.querySelector('.lh-copy').innerHTML = post.summary;
            outputBox.setAttribute('data-uri', post.url);
            outputBox.addEventListener('click', clickableBoxEventListener);
            mountPoint.insertAdjacentElement('afterend', outputBox);
            output.push(outputBox);
          });
          document.querySelector('#grid').removeChild(document.querySelector('#blog_posts'));
          return output;
        })
        .then(boxLoadCallback)
    }
  });
  // Clean-up tasks for when a layout is triggered:
  iso.on('layoutComplete', function () {
    var openBox = document.querySelector('.' + OPEN_CLASS);
    if (openBox) {
      if (window.location.hash != '#' + openBox.getAttribute('id')) {
        window.location.hash = openBox.getAttribute('id');
      }
      if (openBox.getBoundingClientRect().top !== 0) {
        zenscroll.to(openBox);
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
