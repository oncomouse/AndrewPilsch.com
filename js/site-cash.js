/* globals imagesLoaded, snarkdown, LazyLoad, Promise, $ */
/*
<script src="https://cdn.jsdelivr.net/npm/cash-dom@8.0.0/dist/cash.min.js"></script>
<script>
window.cash.fn.data = function(key, value) {
  if(this.data === undefined) {
    this.data = {};
  }
  if (typeof value === 'undefined') {
    return this.data[key];
  }
  this.data[key] = value;
}
window.cash.data = function(el, key, value) {
  return $(el).data(key, value);
}
window.jQuery = window.cash;
</script>
*/
function setupSite() {
  // Constants:
  var DEVELOPMENT = true;
  var OPEN_CLASS = 'open';
  var ACTIVE_CLASS = 'active';
  var HIDDEN_CLASS = 'dn';
  var SHOWN_CLASS = 'dib';
  var BOX_CLASS = 'box';
  var FILTER_CLASS = 'filter';

  // Set up the timer for the help function:
  var helpTimer = window.setTimeout(function () {
    $('#help').removeClass('dn');
    $('#help').removeClass('o-0');
  }, 5000);

  // Scale the temporary images:
  $('.lazy').each(function (_i, el) {
    var box = $(el.parentNode.parentNode.parentNode);
    var width = parseInt($(el).css('width'), 10);
    var height = parseInt($(el).css('height'), 10);
    var aspectRatio = height / width;
    var minWidth;
    // Mobile support for image scaling:
    var bodyWidth = document.body.getBoundingClientRect().width;
    if (bodyWidth < 768) {
      minWidth = bodyWidth - 29;
    } else {
      if (document.body.getBoundingClientRect().width >= 432.89 && box.hasClass('w-col-2')) {
        minWidth = 432.89;
      } else {
        minWidth = 206.09;
      }
    }
    var newWidth = minWidth < width ? minWidth : width;
    $(el).css('width', newWidth);
    $(el).css('height', (aspectRatio * newWidth));
  });

  // Clickable Box Linker:
  function makeBoxIntoALink(el, url, insert) {
    var outputLink = $('<a/>');
    outputLink.attr('href', url)
    outputLink.addClass('black hover-black');
    if (insert) {
      $(el).after(outputLink);
      outputLink.append($(el).clone());
      $(el).remove();
    } else {
      outputLink.append(el);
    }
    return outputLink;
  }

  // Configure Clickable Boxes:
  $('[data-uri]').each(function (_i, element) {
    makeBoxIntoALink(element, element.attr('data-uri'), true);
  });

  // Configure Isotope:
  $('#grid').isotope({
    itemSelector: '.' + BOX_CLASS,
    layoutMode: 'masonry',
    masonry: {
      columnWidth: parseInt(window.getComputedStyle($('.column-size')[0]).width, 10),
    },
    initLayout: false,
  });

  function triggerLayout() {
    $('#grid').isotope('layout');
  }

  // Close all the open boxes:
  function closeOpenBoxes() {
    var boxes = $('.' + OPEN_CLASS)
    // This allows for true toggling. We wait on animation frame for the new box
    // to open and then, if there are other open boxes, we remove them:
    if (boxes.length > 0) {
      window.requestAnimationFrame(function () {
        boxes.each(function (_i, el) {
          $(el).removeClass(OPEN_CLASS);
        });
        hideCloseAllButton();
      });
    }
  }

  // Do the work of opening or closing the box:
  function openOrCloseBox(el) {
    // Clear the help timer and remove the help if it is open:
    clearTimeout(helpTimer);
    $('#help').addClass('dn');
    $(el).toggleClass(OPEN_CLASS);
    $('#grid').isotope('layout');
  }

  function hideCloseAllButton() {
    var closeAllButton = $('#close-all');
    if (closeAllButton !== null) {
      closeAllButton.removeClass(SHOWN_CLASS);
      closeAllButton.addClass(HIDDEN_CLASS);
    }
  }

  function showCloseAllButton() {
    var closeAllButton = $('#close-all');
    if (closeAllButton !== null) {
      closeAllButton.removeClass(HIDDEN_CLASS);
      closeAllButton.addClass(SHOWN_CLASS);
    }
  }

  // Toggle open and close for a clicked box:
  function toggleBox(ev) {
    // We don't open the box if the target is in a link OR if the box is open:
    if (ev.target.closest('a') === null && !$(ev.currentTarget).hasClass(OPEN_CLASS)) {
      ev.preventDefault();
      closeOpenBoxes();
      openOrCloseBox(ev.currentTarget);
    }
  }
  $('.' + BOX_CLASS).each(function (_i, el) {
    if ($(el).find('.content').length > 0) {
      $(el).on('click', toggleBox);
    }
  });

  // Filter:
  function filterBoxes(ev) {
    ev.preventDefault();
    var target = $(ev.currentTarget);
    if (!target.hasClass(ACTIVE_CLASS)) {
      $('.' + ACTIVE_CLASS).each(function (_i, el) {
        $(el).removeClass(ACTIVE_CLASS);
      });
      target.addClass(ACTIVE_CLASS);
      $('#grid').one('arrangeComplete', function () {
        closeOpenBoxes();
      });
      $('#grid').isotope({
        filter: target.attr('data-filter'),
      });
    }
  }
  // Set up event handlers for the filter buttons:
  $('.' + FILTER_CLASS).each(function (_i, el) {
    // This is the "Close All" button:
    if ($(el).hasClass(HIDDEN_CLASS)) {
      $(el).on('click', function (ev) {
        ev.preventDefault();
        closeOpenBoxes();
        window.requestAnimationFrame(triggerLayout);
      });
      // Otherwise, run the filter target:
    } else {
      $(el).on('click', filterBoxes);
    }
  });

  // Setup stuff to run after layout:
  // - Checks if a URL hash indicates a box should open
  // - Sets up lazy image loading
  // - Loads remote courses
  // - Loads remote blog posts
  $('#grid').one('layoutComplete', function () {
    // Check if there is an open box according to the hash:
    if (window.location.hash !== '') {
      openOrCloseBox($(window.location.hash));
    }
    // Load images:
    new LazyLoad({
      elements_selector: ".lazy",
      callback_load: function (el) {
        $(el).css('width', '');
        $(el).css('height', '');
      },
    });
    // Attach courses:
    function boxLoadCallback(boxes) {
      $('#grid').isotope('addItems', boxes);
      $('#grid').isotope('reloadItems');
      $('#grid').isotope({
        sortBy: 'original-order',
      });
    }
    // Attach courses:
    function loadCourses(term) {
      return fetch('https://oncomouse.github.io/courses/courses.json')
        .then(function (res) {return res.json()})
        .then(function (json) {return !term ? json : json.filter(function (course) {return course.course_term === term;})})
        .then(function (courses) {
          var template = $('#all-courses').clone();
          var mountPoint = $('#grid');
          var promises = [];
          courses.forEach(function (course) {
            if ($(course.course_id).length > 0) return;
            var outputBox = template.clone();
            outputBox.id = course.course_id;
            outputBox.addClass('link');
            outputBox.find('h1').text(course.course_title + ', ' + course.course_term);
            outputBox.find('.lh-copy').html(snarkdown(course.course_description));
            var outputLink = makeBoxIntoALink(outputBox, course.course_url, false);
            promises.push(new Promise(function (resolve) {
              var image = new Image();
              image.onload = function () {
                var imageContainer = outputBox.find('.thumbnail .mt2');
                imageContainer.html('');
                imageContainer.append(image);
                mountPoint.append(outputLink);
                resolve(outputLink);
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
      $('#all-courses a').on('click', function (ev) {
        ev.preventDefault();
        loadCourses().then(function () {$('[data-filter*=".teaching"]').trigger('click');});
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
          var template = $('.research.w-col-1.box').eq(1).clone();
          var mountPoint = $('#blog_posts');
          posts.forEach(function (post) {
            var outputBox = template.clone();
            outputBox.removeClass('expand');
            outputBox.removeClass('research');
            outputBox.addClass('blog');
            outputBox.addClass('link');
            outputBox.id = '';
            outputBox.find('header img').remove();
            outputBox.find('h2').text('Recent Blog Post');
            outputBox.find('h1').text(post.title);
            outputBox.find('.lh-copy').html(post.summary);
            var outputLink = makeBoxIntoALink(outputBox, post.url, false);
            mountPoint.after(outputLink);
            output.push(outputBox);
          });
          ($('#blog_posts')).remove();
          return output;
        })
        .then(boxLoadCallback)
    }
  });
  // Clean-up tasks for when a layout is triggered:
  $('#grid').on('layoutComplete', function () {
    var openBox = $('.' + OPEN_CLASS);
    if (openBox.length !== 0) {
      if (window.location.hash != '#' + openBox.attr('id')) {
        window.location.hash = openBox.attr('id');
      }
      if (openBox[0].getBoundingClientRect().top !== 0) {
        openBox[0].scrollIntoView();
      }
      showCloseAllButton();
    } else {
      hideCloseAllButton();
      window.location.hash = '';
    }
  });

  // Once events have been set up, trigger Isotope:
  $('#grid').isotope();
}
imagesLoaded($('#grid'), setupSite)
