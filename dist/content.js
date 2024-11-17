// Inject script to handle messages in the page context
const script = document.createElement("script");
script.textContent = `
  window.addEventListener('message', function(event) {
    // Debug all incoming messages
    console.log('Page script received message:', event.data);
    
    // Filter out webpack messages
    if (event.data.type === 'webpackOk') return;
    
    // Handle our specific messages
    if (event.data.type === 'FROM_PAGE' && event.data.action === 'sendData') {
      console.log('Page forwarding message:', event.data);
      // Forward to content script with a special identifier
      window.postMessage({
        ...event.data,
        _ethayMessage: true
      }, '*');
    }
  });
`;
(document.head || document.documentElement).appendChild(script);

// Content script message listener
window.addEventListener("message", async function (event) {
  // Debug all incoming messages
  console.log("Content script received raw message:", event.data);

  console.log("event.data.type", event.data.type);
  console.log("event.data.action", event.data.action);

  console.log("working...");
  // Check if this is our message type
  if (
    event.data &&
    event.data.type === "FROM_PAGE" &&
    event.data.action === "sendData"
  ) {
    console.log("Content script processing message:", event.data);

    try {
      const extensionData = await chrome.storage.local.get("extensionData");
      let extensionDataItems = extensionData.extensionData || [];
      console.log("Current storage:", extensionData, extensionDataItems);

      if (!Array.isArray(extensionDataItems)) {
        extensionDataItems = [];
      }

      if (event.data.data && event.data.data.item) {
        console.log("Adding new item:", event.data.data.item);
        extensionDataItems.push(event.data.data.item);

        // Store the updated data back to storage
        await chrome.storage.local.set({ extensionData: extensionDataItems });
        console.log("Extension data updated and stored:", extensionDataItems);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  }
});

function checkForTags() {
  // Select all tweets
  const tweets = document.querySelectorAll("article");
  console.log("Checking for Ethay tags...", tweets.length);

  tweets.forEach((tweet) => {
    // Find the main text content div (usually has lang attribute)
    const tweetContent = tweet.querySelector("div[lang]");

    // Check if we found content and it contains our tag
    if (tweetContent && tweetContent.innerText.includes("<Ethay")) {
      console.log("Found Ethay tag:", tweetContent.innerText);

      try {
        // get Type and Value
        const type = tweetContent.innerText.split("type=")[1].split('"')[1];
        const value = tweetContent.innerText.split("val=")[1].split('"')[1];
        console.log("Parsed values:", { type, value });

        const queryString = `type=${type}&value=${value}`;
        const contentContainer =
          tweetContent.closest('div[role="group"]') ||
          tweetContent.parentElement;

        if (contentContainer) {
          // Create iframe with proper sandbox attributes
          const iframe = document.createElement("iframe");
          iframe.sandbox =
            "allow-scripts allow-same-origin allow-forms allow-popups";
          iframe.style.cssText = `
            width: 100%;
            min-height: ${type === "web2" ? "500px" : "550px"};
            margin: 10px 0;
            border: none;
            border-radius: 16px;
            background: white;
          `;

          // Set iframe source based on type
          if (type === "web2") {
            iframe.src = `https://ethaypostdev.vercel.app/product${
              queryString ? `?${queryString}` : ""
            }`;
          } else {
            iframe.src = value;
          }

          // Create and append container
          const iframeContainer = document.createElement("div");
          iframeContainer.style.cssText = `
            height: 100%;
            width: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          `;

          iframeContainer.appendChild(iframe);

          // Store original content and replace
          contentContainer.setAttribute(
            "data-original-content",
            contentContainer.innerHTML
          );
          contentContainer.replaceChildren(iframeContainer);

          console.log("Iframe injected successfully");
        }
      } catch (error) {
        console.error("Error processing Ethay tag:", error);
      }
    }
  });
}

// Set up observer with error handling
try {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        checkForTags();
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Initial check
  checkForTags();
} catch (error) {
  console.error("Error setting up observer:", error);
}
