async function markAllWindows(){
  const windows = await browser.windows.getAll();
  for(let window of windows){
    countAndSetPrefixInWindow(window.id)
  }
}

async function countAndSetPrefixInWindow(winId){
  let pinned = await browser.tabs.query({windowId:winId,pinned:true});
  browser.windows.update(winId,{ titlePreface: pinned.length ? `[${pinned.length}]`:"" });
}

browser.runtime.onInstalled.addListener(markAllWindows);

browser.tabs.onUpdated.addListener((tabId,info,tab) => countAndSetPrefixInWindow(tab.windowId),{properties: ["pinned"]});

browser.tabs.onRemoved.addListener((tabId, info) => {
  if(!info.isWindowClosing){
    countAndSetPrefixInWindow(info.windowId)
  }
});

browser.tabs.onDetached.addListener((tabId, info) => {
  countAndSetPrefixInWindow(info.oldWindowId)
});

// run once on startup
browser.runtime.onStartup.addListener(markAllWindows)

