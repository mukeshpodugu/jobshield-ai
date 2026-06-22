// Register Context Menu item on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "scan_jobshield",
    title: "Scan Selection with JobShield AI",
    contexts: ["selection"]
  });
});

// Listen to context menu actions
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "scan_jobshield" && info.selectionText) {
    // Save selected text to local storage
    chrome.storage.local.set({ selectedText: info.selectionText }, () => {
      // Trigger extension action popup to open
      chrome.action.openPopup();
    });
  }
});
