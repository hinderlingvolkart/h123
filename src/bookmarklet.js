
// This placeholder will be replaced by build.js with the actual CSS string.
var SCRIPT_INJECTED_CSS = "/* {{css_string_placeholder}} */";

var containerId = 'a11y-bookmarklet';
var containerStyle = 'position: fixed; top: 0; right: 0; max-height: 100%; box-shadow: 0 0 80px rgba(0,0,0,0.3); width: 20%; min-width: 320px; max-width: 450px; z-index: 1000001;';

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

var outline = getOutline();
var doc;

iframe.srcdoc = '{{ui}}';
// allow-scripts: To allow running scripts inside the iframe (e.g., for the close button and other UI interactions).
// allow-same-origin: When srcdoc is used, the iframe generally inherits the parent's origin.
//   This flag ensures that scripts within the iframe can fully access their own document and resources as if they were from that origin.
//   It's important for the bookmarklet's internal JavaScript to function correctly.
// allow-forms: If there were any forms inside the bookmarklet UI, this would be needed. Not currently the case.
// allow-popups: If the bookmarklet UI needed to open new windows/tabs. Not currently the case.
// allow-modals: If the bookmarklet UI needed to open modals. Not currently the case.
iframe.sandbox = 'allow-scripts allow-same-origin';

container.appendChild(iframe);
iframe.onload = function () {
  // No longer need the redundant iframe.onload = function () { };
  doc = iframe.contentWindow.document;
  // doc.open(), doc.write(), doc.close() are no longer needed with srcdoc.

  // Inject the CSS programmatically
  if (doc.head) {
    var styleEl = doc.createElement('style');
    styleEl.textContent = SCRIPT_INJECTED_CSS;
    doc.head.appendChild(styleEl);
  } else {
    // Fallback or error for environments where doc.head is not available immediately
    console.error("Bookmarklet: iframe document head not found for CSS injection.");
  }

  var quitButton = doc.querySelector('[data-action="close"]');
  if (quitButton) {
    quitButton.addEventListener('click', function (e) {
      disableHoverHighlight();
      window.removeEventListener('resize', updateHeight);
      document.body.removeChild(container);
      if (document.getElementById(highlighterEl.id)) {
        document.body.removeChild(highlighterEl);
      }
    });
  }

  var targetEl = doc.querySelector('#result');
  if (targetEl) {
    targetEl.innerHTML = outlineToHTML(outline);
  }

  targetEl = doc.querySelector('#o-hidden-count');
  if (targetEl) {
    targetEl.innerText = outline.length - countOutline(outline, 'visible');
  }

  targetEl = doc.querySelector('#o-visuallyhidden-count');
  if (targetEl) {
    targetEl.innerText = countOutline(outline, 'visuallyhidden');
  }

  switcher('o-hidden', 'show-hidden');
  switcher('o-visuallyhidden', 'mark-visuallyhidden');
  handleHoverHighlight(doc.getElementById('o-highlight'));

  updateHeight();

  doc.addEventListener('mouseover', function (event) {
    var link;
    if (event.target.nodeName.toUpperCase() === 'A') {
      link = event.target;
    } else if (event.target.parentElement && event.target.parentElement.nodeName.toUpperCase() === 'A') {
      link = event.target.parentElement;
    }
    if (!link) return;
    var index = parseInt(link.getAttribute('href').substr(1), 10);
    var target = outline[index].el;
    highlightElement(target);
  }, false);

  window.addEventListener('resize', updateHeight);

  function switcher(id, className) {
    var checkbox = doc.getElementById(id);
    var target = doc.querySelector('.result');
    if (checkbox) {
      var check = function (e) {
        if (checkbox.checked) {
          target.classList.add(className);
        } else {
          target.classList.remove(className);
        }
        if (e) updateHeight();
      };
      checkbox.addEventListener('change', check, false);
      checkbox.addEventListener('click', check, false);
      check();
    }
  }

};
document.body.appendChild(container);


function updateHeight() {
  container.style.height = '0px';
  container.style.height = doc.scrollingElement.scrollHeight + 'px';
}
function getOutline() {
  var previousLevel = 0;
  var els = customQuerySelectorAll(document, ':is(h1,h2,h3,h4,h5,h6,h7,[role="heading"]):not([role="presentation"])');
  var result = [];
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    var visible = isVisible(els[i]);
    var n = parseInt(el.getAttribute('aria-level') || el.nodeName.charAt(1));
    var wrongLevel = false; // Default to false
    if (visible) {
      // A heading level is considered wrong if it's not the first heading (previousLevel !== 0)
      // AND it skips one or more levels downwards (n > previousLevel + 1).
      wrongLevel = previousLevel !== 0 && n > (previousLevel + 1);
      previousLevel = n; // Update previousLevel with the current heading's level for the next iteration
    } else {
      // Non-visible headings are not considered for level validation in this context.
      // wrongLevel remains false, as initialized.
    }
    result.push({
      visible: visible,
      visuallyhidden: visible && isVisuallyHidden(el),
      wrong: wrongLevel,
      level: n,
      el: el
    });
  }
  return result;
}

function countOutline(list, key) {
  var count = 0;
  for (var i = 0; i < list.length; i++) {
    if (list[i][key]) count++;
  }
  return count;
}


function outlineToHTML(list) {
  var html = '';

  for (var i = 0; i < list.length; i++) {
    var item = list[i], el = item.el;
    html += '<li class="'
    html += (item.wrong ? 'wrong-level' : 'correct-level')
    html += (item.visible ? '' : ' hidden')
    html += (item.visuallyhidden ? ' visuallyhidden' : '')
    html += '" style="margin-left: ' + (item.level) + 'em;">';
    html += '<a href="#' + i + '" target="_top">';
    html += '<span class="level" data-level="' + item.level + '"></span> ';
    html += '<span class="text">' + htmlEntities(textContent(el).replace(/\s+/g, ' ')) + '</span>';
    html += '</a>';
    html += '</li>';
  }

  return '<ul id="headings">' + html + '</ul>';
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
    var node = el.assignedSlot || el;
    el = node.parentElement || node.getRootNode().host;
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



function highlightElement(el, disableAutoScroll) {
  if (!disableAutoScroll) {
    if (el.scrollIntoViewIfNeeded) {
      el.scrollIntoViewIfNeeded();
    } else
      if (el.scrollIntoView) {
        el.scrollIntoView();
      } else {

      }
  }
  setTimeout(function () {
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

function handleHoverHighlight(input) {
  var handler = function () {
    if (input.checked) {
      enableHoverHighlight();
    } else {
      disableHoverHighlight();
    }
  }
  handler();
  input.addEventListener('click', handler);
}

function highlightLink(el) {
  var links = doc.querySelectorAll('#headings a');
  for (var k = links.length - 1; k >= 0; k--) {
    if (links[k] === el) {
      links[k].classList.add('is-active');
    } else {
      links[k].classList.remove('is-active');
    }
  }
}

function handleElementHover(event) {
  var target = event.target;
  var all = document.body.querySelectorAll('*');
  var searchHeading = false;
  for (var i = all.length - 1; i >= 0; i--) {
    var el = all[i];
    if (searchHeading) {
      for (var j = outline.length - 1; j >= 0; j--) {
        if (outline[j].el === el && outline[j].visible) {
          // yeah, found heading
          highlightElement(outline[j].el, true);
          highlightLink(doc.querySelector('#headings a[href="#' + j + '"]'));
          return;
        }
      }
    } else {
      if (el === target) {
        searchHeading = true;
        i++; // also handle the current element
      }
    }
  }
  highlightLink(null);
}

function enableHoverHighlight() {
  document.body.addEventListener('mouseover', handleElementHover);

}

function disableHoverHighlight() {
  document.body.removeEventListener('mouseover', handleElementHover);
}



/**
 * Find DOM nodes everywhere, traversing any shadow boundaries
 * Based on https://stackoverflow.com/a/71666543
 *
 * @param {HTMLElement} node 
 * @param {String} selector 
 * @returns {HTMLElement[]}
 */
function customQuerySelectorAll(node, selector) {
  const nodes = [];
  const nodeIterator = document.createNodeIterator(node, Node.ELEMENT_NODE);
  let currentNode;

  while (currentNode = nodeIterator.nextNode()) {
    if (currentNode.matches(selector)) {
      nodes.push(currentNode);
    } else if (currentNode.shadowRoot) {
      nodes.push(...customQuerySelectorAll(currentNode.shadowRoot, selector));
    }
  }

  return nodes;
}

/**
 * Find text content, including slotted text
 *
 * TODO: Handle any order of slots and text nodes
 *
 * @param {HTMLElement} el 
 * @returns {String}
 */
function textContent(el) {
  const parts = [el.textContent];
  const slots = el.querySelectorAll('slot')

  for (const slot of slots) {
    const nodes = slot.assignedNodes();

    for (const node of nodes) {
      parts.push(node.textContent);
    }
  }

  const textContent = parts.filter(Boolean).join(' ');

  return textContent;
}