
var containerId = 'a11y-bookmarklet';
var containerStyle = 'position: fixed; top: 0; right: 0; bottom: 0; box-shadow: 0 0 80px rgba(0,0,0,0.3); width: 20%; min-width: 280px; max-width: 450px;';

// remove existing instances
var container = document.getElementById(containerId);
if (container) {
  document.body.removeChild(container);
}

container = document.createElement('DIV');
container.id = containerId;
container.style.cssText = containerStyle;

iframe = document.createElement('IFRAME');
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

  var quitButton = iframe.contentWindow.document.getElementById('quit-button');
  if (quitButton) {
    quitButton.addEventListener('click', function (e) {
      document.body.removeChild(container);
    });
  }

};
document.body.appendChild(container);

