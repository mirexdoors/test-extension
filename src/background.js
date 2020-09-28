import { API_URL, fetchDomains, isTimePass } from './lib/helpers';

// schedule a new fetch every 60 minutes
const scheduleRequest = () => {
  chrome.alarms.create('refresh', { periodInMinutes: 60 });
};

// fetch data and save to storage
const startRequest = async () => {
  const data = await fetchDomains(API_URL);
  if (data && data.length > 0) {
    // get data
    chrome.storage.sync.set({ domains: data });
    // save last fetch time
    chrome.storage.sync.set({ lastFetch: new Date().toJSON() });
  }
};

const passMessage = (tabId, data) => {
  const request = data;
  if (data.message) {
    chrome.tabs.sendMessage(tabId, { ...request });
  } else {
    chrome.tabs.sendMessage(tabId, { ...request });
  }
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('lastFetch', (res) => {
    if ((res.lastFetch !== '' && isTimePass(new Date(res.lastFetch))) || !res.lastFetch) {
      startRequest();
    }
  });
  scheduleRequest();
});

chrome.runtime.onStartup.addListener(() => {
  // get last fetch date
  chrome.storage.sync.get('lastFetch', (res) => {
    if ((res.lastFetch !== '' && isTimePass(new Date(res.lastFetch))) || !res.lastFetch) {
      startRequest();
    }
  });
});

// alarm listener
chrome.alarms.onAlarm.addListener((alarm) => {
  // if refresh alarm triggered, start a new request
  if (alarm && alarm.name === 'refresh') {
    startRequest();
  }
});

// long-poll with popup
chrome.extension.onConnect.addListener((port) => {
  port.onMessage.addListener((request) => {
    if (request.action === 'getData') {
      chrome.storage.sync.get('domains', (result) => {
        port.postMessage(result.domains);
      });
    }
    return [];
  });
});

chrome.webNavigation.onCompleted.addListener((page) => {
  const hostName = new URL(page.url).hostname;
  chrome.storage.sync.get('domains', (result) => {
    const domains = [...result.domains];
    const selectedDomain = domains.filter((domainItem) => domainItem.domain === hostName || `www.${domainItem.domain}` === hostName);
    if (selectedDomain.length === 1) {
      selectedDomain[0].action = 'showMessage';
      const rawMessage = selectedDomain[0].message;
      if (rawMessage.indexOf('%username%') > -1) {
        chrome.identity.getProfileUserInfo((userInfo) => {
          if (userInfo.email.length > 0) {
            selectedDomain[0].message = rawMessage.replace('%username%', userInfo.email);
          }
          passMessage(page.tabId, selectedDomain[0]);
        });
      }
    }

    // check for google or bing and send message if it's search results page
    if (page.url.indexOf('google.com/search') > -1 || page.url.indexOf('google.ru/search?') > -1 || page.url.indexOf('bing.com/search?q') > -1) {
      const data = {
        action: 'showIcons',
        domains,
      };
      passMessage(page.tabId, data);
    }
  });
});
