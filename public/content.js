window.addEventListener("message", function(event) {
  // We only accept messages from the same window
  if (event.source != window) {
    return;
  }

  if (event.data.type === "FROM_PAGE" && event.data.action === "sendData") {
    chrome.storage.local.set({ extensionData: event.data.data }, () => {
      console.log("Extension data stored:", event.data.data);
    });
  }
});