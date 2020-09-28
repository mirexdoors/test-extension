import template, { closeButtonListenerScript } from '../lib/template';

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'showMessage') {
    if (request.message && !localStorage.getItem(`${request.name}IsShowed`) && sessionStorage.getItem(`${request.name}Counter`) < 3) {
      const sessionCounter = `${request.name}Counter`;
      // set uniq ids for template nodes
      const uniqId = Math.random().toString(36).substring(7);
      const fragmentId = `fragment_${uniqId}`;
      const closeButtonId = `closeMessage_${uniqId}`;
      const actualCode = closeButtonListenerScript(fragmentId, closeButtonId, request.name);
      // add listener for close click
      const script = document.createElement('script');
      document.body.insertAdjacentHTML('afterbegin', template(request.message, fragmentId, closeButtonId));
      script.textContent = actualCode;
      (document.head || document.documentElement).appendChild(script);
      script.remove();
      // increase counter
      let counter = sessionStorage.getItem(sessionCounter);
      counter = counter === null ? 0 : Number(counter);
      sessionStorage.setItem(sessionCounter, counter + 1);
    }
  } else if (request.action === 'showIcons' && request.domains) {
    // show extension icon in search
    if (request.domains.length > 0) {
      const citeNodes = document.querySelectorAll('div>cite:first-child');

      if (citeNodes.length > 0) {
        const iconUrl = chrome.runtime.getURL('icons/16.png');
        citeNodes.forEach((citeNode) => {
          if (request.domains
            .some((domainItem) => citeNode.textContent.indexOf(domainItem.domain) > -1)) {
            const img = document.createElement('img');
            img.src = iconUrl;
            citeNode.parentNode.insertBefore(img, citeNode);
          }
        });
      }
    }
  }
});
