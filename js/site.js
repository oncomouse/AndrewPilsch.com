/* globals Isotope, imagesLoaded, snarkdown, raf, LazyLoad, Promise */
// Polyfills:
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}
function setupSite() {
  // Constants:
  var DEVELOPMENT = false;
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

  // Clickable Box Event Listener:
  function clickableBoxEventListener(ev) {
    ev.preventDefault();
    window.location.assign(ev.currentTarget.getAttribute('data-uri'));
  }

  // Configure Clickable Boxes:
  document.querySelectorAll('[data-uri]').forEach(function (element) {
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
  // - Checks if a URL hash indicates a box should open
  // - Sets up lazy image loading
  // - Loads remote courses
  // - Loads remote blog posts
  iso.once('layoutComplete', function () {
    // Check if there is an open box according to the hash:
    if (window.location.hash !== '') {
      openOrCloseBox(document.querySelector(window.location.hash));
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
    function boxLoadCallback(boxes) {
      iso.addItems(boxes);
      iso.reloadItems();
      iso.arrange({
        sortBy: 'original-order',
      });
    }
    // Attach courses:
    function loadCourses(term) {
      return fetch('https://oncomouse.github.io/courses/courses.json')
        .then(function (res) {return res.json()})
        .then(function (json) {return !term ? json : json.filter(function (course) {return course.course_term === term;})})
        .then(function (courses) {
          var template = document.querySelector('#all-courses').cloneNode(true);
          var mountPoint = document.querySelector('#grid');
          var promises = [];
          courses.forEach(function (course) {
            if (document.querySelector(course.course_id)) return;
            var outputBox = template.cloneNode(true);
            outputBox.id = course.course_id;
            outputBox.classList.add('link');
            outputBox.setAttribute('data-uri', course.course_url);
            outputBox.addEventListener('click', clickableBoxEventListener);
            outputBox.querySelector('h1').innerText = course.course_title + ', ' + course.course_term;
            outputBox.querySelector('.lh-copy').innerHTML = snarkdown(course.course_description);
            promises.push(new Promise(function (resolve) {
              var image = new Image();
              image.onload = function () {
                var imageContainer = outputBox.querySelector('.thumbnail .mt2');
                imageContainer.innerHTML = '';
                imageContainer.appendChild(image);
                mountPoint.appendChild(outputBox);
                resolve(outputBox);
              }
              image.onerror = function () {
                image.src = 'https://dummyimage.com/206x150/fff/000.png&text=' + course.course_id;
              }
              image.src = course.course_image;
            }));
          });
          Promise.all(promises).then(boxLoadCallback);
        });
    }
    if (DEVELOPMENT || window.ENV['JEKYLL_ENV'] === 'production') {
      document.querySelector('#all-courses a').addEventListener('click', function (ev) {
        ev.preventDefault();
        loadCourses().then(function () {document.querySelector('[data-filter*=".teaching"]').click();});
      })

      var today = new Date();
      var month = today.getMonth() + 1;
      var year = today.getFullYear();
      var term = (month >= 1 && month < 6 ? 'Spring' : 'Fall') + ' ' + year;
      // Attach front page courses:
      loadCourses(term);
      // Attach blog posts:
      fetch('https://andrew.pilsch.com/blog/frontpage.json')
        .then(function (res) {return res.json();})
        .then(function (posts) {
          var output = [];
          var template = document.querySelectorAll('.research.w-col-1.box')[1].cloneNode(true);
          var mountPoint = document.querySelector('#blog_posts');
          posts.forEach(function (post) {
            var outputBox = template.cloneNode(true);
            outputBox.classList.remove('expand');
            outputBox.classList.remove('research');
            outputBox.classList.add('blog');
            outputBox.classList.add('link');
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
}
imagesLoaded(document.querySelector('#grid'), setupSite)
