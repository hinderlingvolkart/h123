
var containerId = 'a11y-bookmarklet';
var containerStyle = 'position: fixed; top: 0; right: 0; bottom: 0; box-shadow: 0 0 80px rgba(0,0,0,0.3); width: 20%; min-width: 280px; max-width: 450px; z-index: 1000000;';

var highlighterEl = document.createElement('DIV');
highlighterEl.id = 'h1-a11y-highlighterelement';
highlighterEl.style.cssText = 'pointer-events: none; position: fixed; border: 1px dashed #0081BE; box-shadow: 0 0 54px 0 rgba(0,84,150,0.3); display: none; z-index: 1000000; transition: all 200ms;'

// remove existing instances
var container = document.getElementById(containerId);
if (container) {
  document.body.removeChild(container);
}

container = document.createElement('DIV');
container.id = containerId;
container.style.cssText = containerStyle;

var iframe = document.createElement('IFRAME');
iframe.style.width = '100%';
iframe.style.height = '100%';
iframe.style.borderWidth = '0';

container.appendChild(iframe);
iframe.onload = function () {
  iframe.onload = function () {};
  var doc = iframe.contentWindow.document;
  doc.open();
  doc.write('{{ui}}');
  doc.close();

  var quitButton = doc.querySelector('[data-action="close"]');
  if (quitButton) {
    quitButton.addEventListener('click', function (e) {
      document.body.removeChild(container);
      if (document.getElementById(highlighterEl.id)) {
        document.body.removeChild(highlighterEl);
      }
    });
  }

  var targetEl = doc.querySelector('#result');
  if (targetEl) {
    targetEl.innerHTML = getOutlineAsHTML();
  }

  switcher('o-hidden', 'show-hidden');
  switcher('o-visuallyhidden', 'mark-visuallyhidden');

  doc.addEventListener('mouseover', function(event) {
    var link;
    if (event.target.nodeName.toUpperCase() === 'A') {
      link = event.target;
    } else if (event.target.parentElement && event.target.parentElement.nodeName.toUpperCase() === 'A') {
      link = event.target.parentElement;
    }
    if (!link) return;
    console.log('Link', link);
    var target = document.querySelector(link.getAttribute('href'));
    console.log('Target', target);
    highlightElement(target);
  }, false);

  function switcher(id, className) {
    var checkbox = doc.getElementById(id);
    var target = doc.querySelector('.result');
    if (checkbox) {
      var check = function(e) {
        if (checkbox.checked) {
          target.classList.add(className);
        } else {
          target.classList.remove(className);
        }
      };
      checkbox.addEventListener('change', check, false);
      checkbox.addEventListener('click', check, false);
      check();
    }
  }

};
document.body.appendChild(container);




function getOutlineAsHTML() {
  var idCounter = 0;
  var previousLevel = 0;

  var els = document.querySelectorAll('h1,h2,h3,h4,h5,h6,h7,[role="heading"]');
  var html = '';
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    var visible = isVisible(els[i]);
    var n = parseInt((el.getAttribute('role') == 'heading' && el.getAttribute('aria-level')) || el.nodeName.substr(1));
    if (visible) {
      var wrongLevel = n > previousLevel && n !== (previousLevel + 1);
      previousLevel = n;
    } else {
      wrongLevel = false;
    }
    var id = el.id || ('h5o-heading-' + (++idCounter));
    el.id = id;
    var text = '<span class="level" data-level="' + n + '"></span>' + ' ' + htmlEntities(el.textContent.replace(/\s+/g,' '));
    html += '<li class="'
    html += (wrongLevel ? 'wrong-level' : 'correct-level')
    html += (visible ? '' : ' hidden')
    html += (visible && isVisuallyHidden(el) ? ' visuallyhidden' : '')
    html += '" style="margin-left: ' + (n) + 'em;">';
    html += '<a href="#' + id + '" target="_top">' + text + '</a>';
    html += '</li>';
  }

  return '<ul>' + html + '</ul>';
}


function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}


function isVisible(el) {
  var css = window.getComputedStyle(el);
  var cssVisible = false;
  while (el) {
    if (css['display'] === 'none') {
      return false;
    }
    if (!cssVisible) {
      if (css['visibility'] === 'hidden') {
        return false;
      }
      if (css['visibility'] === 'visible') {
        cssVisible = true;
      }
    }
    if (el.getAttribute('aria-hidden') === 'true') {
      return false;
    }
    el = el.parentElement;
    try {
      css = window.getComputedStyle(el);
    } catch (error) {
      return true; // happens on window element
    }
  }
  return true;
}

function isVisuallyHidden(el) {
  var size = el.getBoundingClientRect(el);
  var css = window.getComputedStyle(el);
  if (css.position === 'absolute') {
    if (size.width <= 1 && size.height <= 1) {
      return true;
    }
    if (size.right <= 0) {
      return true; // although that's not the best idea ...
    }
  }
}



function highlightElement(el) {
  if (el.scrollIntoViewIfNeeded) {
    el.scrollIntoViewIfNeeded();
  } else
  if (el.scrollIntoView) {
    el.scrollIntoView();
  } else {

  }
  setTimeout(function() {
    var size = el.getBoundingClientRect();
    var visible = true, parent = el.parentElement;
    while (!size.height && !size.width && !size.left && !size.top && parent) {
      size = parent.getBoundingClientRect();
      visible = false;
      parent = parent.parentElement;
    }
    if (!parent) {
      return;
    }
    size = {
      left: size.left,
      top: size.top,
      bottom: size.bottom,
      right: size.right
    };
    size.left = Math.min(window.innerWidth, size.left);
    size.right = Math.max(0, size.right);
    size.top = Math.min(window.innerHeight, size.top);
    size.bottom = Math.max(0, size.bottom);

    if (!document.getElementById(highlighterEl.id)) {
      document.body.appendChild(highlighterEl);
    }

    highlighterEl.style.left = (size.left - 10) + 'px';
    highlighterEl.style.width = (size.right - size.left + 20) + 'px';
    highlighterEl.style.top = (size.top - 10) + 'px';
    highlighterEl.style.height = (size.bottom - size.top + 20) + 'px';
    highlighterEl.style.display = 'block';
  }, 100);
}

