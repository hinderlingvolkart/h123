interface OutlineItem {
  visible: boolean;
  visuallyhidden: boolean;
  wrong: boolean;
  level: number;
  el: HTMLElement;
}

interface BoundingBox {
  left: number;
  top: number;
  bottom: number;
  right: number;
}

const containerId: string = 'a11y-bookmarklet';
const containerStyle: string = 'position: fixed; top: 0; right: 0; max-height: 100%; box-shadow: 0 0 80px rgba(0,0,0,0.3); width: 20%; min-width: 320px; max-width: 450px; z-index: 1000001;';

const highlighterEl: HTMLDivElement = document.createElement('DIV') as HTMLDivElement;
highlighterEl.id = 'h1-a11y-highlighterelement';
highlighterEl.style.cssText = 'pointer-events: none; position: fixed; border: 1px dashed #0081BE; box-shadow: 0 0 54px 0 rgba(0,84,150,0.3); display: none; z-index: 1000000; transition: all 200ms;'

// remove existing instances
let container: HTMLElement | null = document.getElementById(containerId);
if (container) {
  document.body.removeChild(container);
}

container = document.createElement('DIV') as HTMLDivElement;
container.id = containerId;
container.style.cssText = containerStyle;

const iframe: HTMLIFrameElement = document.createElement('IFRAME') as HTMLIFrameElement;
iframe.style.width = '100%';
iframe.style.height = '100%';
iframe.style.borderWidth = '0';

const outline: OutlineItem[] = getOutline();
let doc: Document;

container.appendChild(iframe);
iframe.onload = function (): void {
  iframe.onload = function (): void { };
  doc = iframe.contentWindow!.document;
  doc.open();
  doc.write('{{ui}}');
  doc.close();

  const quitButton: HTMLElement | null = doc.querySelector('[data-action="close"]');
  if (quitButton) {
    quitButton.addEventListener('click', function (e: Event): void {
      disableHoverHighlight();
      window.removeEventListener('resize', updateHeight);
      document.body.removeChild(container!);
      if (document.getElementById(highlighterEl.id)) {
        document.body.removeChild(highlighterEl);
      }
    });
  }

  let targetEl: HTMLElement | null = doc.querySelector('#result');
  if (targetEl) {
    targetEl.innerHTML = outlineToHTML(outline);
  }

  targetEl = doc.querySelector('#o-hidden-count');
  if (targetEl) {
    targetEl.innerText = (outline.length - countOutline(outline, 'visible')).toString();
  }

  targetEl = doc.querySelector('#o-visuallyhidden-count');
  if (targetEl) {
    targetEl.innerText = countOutline(outline, 'visuallyhidden').toString();
  }

  switcher('o-hidden', 'show-hidden');
  switcher('o-visuallyhidden', 'mark-visuallyhidden');
  handleHoverHighlight(doc.getElementById('o-highlight') as HTMLInputElement);

  updateHeight();

  doc.addEventListener('mouseover', function (event: MouseEvent): void {
    let link: HTMLAnchorElement | null = null;
    const target = event.target as HTMLElement;
    
    if (target.nodeName.toUpperCase() === 'A') {
      link = target as HTMLAnchorElement;
    } else if (target.parentElement && target.parentElement.nodeName.toUpperCase() === 'A') {
      link = target.parentElement as HTMLAnchorElement;
    }
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href) return;
    
    const index: number = parseInt(href.substr(1), 10);
    const targetElement: HTMLElement = outline[index].el;
    highlightElement(targetElement);
  }, false);

  window.addEventListener('resize', updateHeight);

  function switcher(id: string, className: string): void {
    const checkbox: HTMLInputElement | null = doc.getElementById(id) as HTMLInputElement;
    const target: HTMLElement | null = doc.querySelector('.result');
    if (checkbox && target) {
      const check = function (e?: Event): void {
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

function updateHeight(): void {
  if (!container) return;
  container.style.height = '0px';
  container.style.height = doc.scrollingElement!.scrollHeight + 'px';
}

function getOutline(): OutlineItem[] {
  let previousLevel: number = 0;
  const els: HTMLElement[] = customQuerySelectorAll(document, ':is(h1,h2,h3,h4,h5,h6,h7,[role="heading"]):not([role="presentation"])');
  const result: OutlineItem[] = [];
  
  for (let i = 0; i < els.length; i++) {
    const el: HTMLElement = els[i];
    const visible: boolean = isVisible(els[i]);
    const ariaLevel = el.getAttribute('aria-level');
    const n: number = parseInt(ariaLevel || el.nodeName.charAt(1));
    let wrongLevel: boolean = false;
    
    if (visible) {
      wrongLevel = n > previousLevel && n !== (previousLevel + 1);

      // the first heading can be h1 or h2
      // see https://www.w3.org/WAI/tutorials/page-structure/headings/ (Example 2)
      // (they don't say it can't be h3, but that would not make sense)
      if (previousLevel === 0) {
        wrongLevel = n > 2
      }
      previousLevel = n;
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

function countOutline(list: OutlineItem[], key: keyof OutlineItem): number {
  let count: number = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i][key]) count++;
  }
  return count;
}

function outlineToHTML(list: OutlineItem[]): string {
  let html: string = '';

  for (let i = 0; i < list.length; i++) {
    const item: OutlineItem = list[i];
    const el: HTMLElement = item.el;
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

function htmlEntities(str: string): string {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function isVisible(el: HTMLElement): boolean {
  let css: CSSStyleDeclaration = window.getComputedStyle(el);
  let cssVisible: boolean = false;
  let currentEl: HTMLElement | null = el;
  
  while (currentEl) {
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
    if (currentEl.getAttribute('aria-hidden') === 'true') {
      return false;
    }
    
    const node: Node = (currentEl as any).assignedSlot || currentEl;
    currentEl = (node.parentElement || (node.getRootNode() as any).host) as HTMLElement | null;
    
    try {
      css = window.getComputedStyle(currentEl!);
    } catch (error) {
      return true; // happens on window element
    }
  }
  return true;
}

function isVisuallyHidden(el: HTMLElement): boolean {
  const size: DOMRect = el.getBoundingClientRect();
  const css: CSSStyleDeclaration = window.getComputedStyle(el);
  
  if (css.position === 'absolute') {
    if (size.width <= 1 && size.height <= 1) {
      return true;
    }
    if (size.right <= 0) {
      return true; // although that's not the best idea ...
    }
  }
  return false;
}

function highlightElement(el: HTMLElement, disableAutoScroll?: boolean): void {
  if (!disableAutoScroll) {
    if ((el as any).scrollIntoViewIfNeeded) {
      (el as any).scrollIntoViewIfNeeded();
    } else if (el.scrollIntoView) {
      el.scrollIntoView();
    }
  }
  
  setTimeout(function (): void {
    let size: DOMRect = el.getBoundingClientRect();
    let visible: boolean = true;
    let parent: HTMLElement | null = el.parentElement;
    
    while (!size.height && !size.width && !size.left && !size.top && parent) {
      size = parent.getBoundingClientRect();
      visible = false;
      parent = parent.parentElement;
    }
    
    if (!parent) {
      return;
    }
    
    const boundingBox: BoundingBox = {
      left: Math.min(window.innerWidth, size.left),
      right: Math.max(0, size.right),
      top: Math.min(window.innerHeight, size.top),
      bottom: Math.max(0, size.bottom)
    };

    if (!document.getElementById(highlighterEl.id)) {
      document.body.appendChild(highlighterEl);
    }

    highlighterEl.style.left = (boundingBox.left - 10) + 'px';
    highlighterEl.style.width = (boundingBox.right - boundingBox.left + 20) + 'px';
    highlighterEl.style.top = (boundingBox.top - 10) + 'px';
    highlighterEl.style.height = (boundingBox.bottom - boundingBox.top + 20) + 'px';
    highlighterEl.style.display = 'block';
  }, 100);
}

function handleHoverHighlight(input: HTMLInputElement): void {
  const handler = function (): void {
    if (input.checked) {
      enableHoverHighlight();
    } else {
      disableHoverHighlight();
    }
  }
  handler();
  input.addEventListener('click', handler);
}

function highlightLink(el: HTMLAnchorElement | null): void {
  const links: NodeListOf<HTMLAnchorElement> = doc.querySelectorAll('#headings a');
  for (let k = links.length - 1; k >= 0; k--) {
    if (links[k] === el) {
      links[k].classList.add('is-active');
    } else {
      links[k].classList.remove('is-active');
    }
  }
}

function handleElementHover(event: MouseEvent): void {
  const target: HTMLElement = event.target as HTMLElement;
  const all: NodeListOf<Element> = document.body.querySelectorAll('*');
  let searchHeading: boolean = false;
  
  for (let i = all.length - 1; i >= 0; i--) {
    const el: Element = all[i];
    if (searchHeading) {
      for (let j = outline.length - 1; j >= 0; j--) {
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

function enableHoverHighlight(): void {
  document.body.addEventListener('mouseover', handleElementHover);
}

function disableHoverHighlight(): void {
  document.body.removeEventListener('mouseover', handleElementHover);
}

/**
 * Find DOM nodes everywhere, traversing any shadow boundaries
 * Based on https://stackoverflow.com/a/71666543
 */
function customQuerySelectorAll(node: Document | DocumentFragment, selector: string): HTMLElement[] {
  const nodes: HTMLElement[] = [];
  const nodeIterator: NodeIterator = document.createNodeIterator(node, Node.ELEMENT_NODE);
  let currentNode: Node | null;

  while (currentNode = nodeIterator.nextNode()) {
    const element = currentNode as HTMLElement;
    if (element.matches(selector)) {
      nodes.push(element);
    } else if ((element as any).shadowRoot) {
      nodes.push(...customQuerySelectorAll((element as any).shadowRoot, selector));
    }
  }

  return nodes;
}

/**
 * Find text content, including slotted text
 * 
 * TODO: Handle any order of slots and text nodes
 */
function textContent(el: HTMLElement): string {
  const parts: string[] = [el.textContent || ''];
  const slots: NodeListOf<HTMLSlotElement> = el.querySelectorAll('slot');

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const nodes: Node[] = slot.assignedNodes();

    for (const node of nodes) {
      parts.push(node.textContent || '');
    }
  }

  const textContent: string = parts.filter(Boolean).join(' ');

  return textContent;
}