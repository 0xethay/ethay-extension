window.addEventListener("message", async function(event) { // Make the function async
  // We only accept messages from the same window
  if (event.source != window) {
    return;
  }

  if (event.data.type === "FROM_PAGE" && event.data.action === "sendData") {

    const extensionData = await chrome.storage.local.get('extensionData');
    let extensionDataItems = extensionData.extensionData || []; 
    console.log(extensionData,extensionDataItems)

    if (!Array.isArray(extensionDataItems)) {
      extensionDataItems = [];
    }

    if (event.data.data.item) {
      extensionDataItems.push(event.data.data.item); 
    }

    // Store the updated data back to storage
    chrome.storage.local.set({ extensionData: extensionDataItems }, () => {
      console.log("Extension data updated and stored:", extensionDataItems);
    });
  }
});