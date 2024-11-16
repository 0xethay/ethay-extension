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


function checkForTags() {
  // Select all tweets
  const tweets = document.querySelectorAll('article')

  tweets.forEach((tweet) => {
    // Find the main text content div (usually has lang attribute)
    const tweetContent = tweet.querySelector('div[lang]')

    if (tweetContent && tweetContent.innerText.includes('0xEthay_')) {
      // Get the parent container of the text content for better replacement
      const contentContainer =
        tweetContent.closest('div[role="group"]') || tweetContent.parentElement

      if (contentContainer) {
        // Create iframe container
        const iframeContainer = document.createElement('div')
        iframeContainer.style.cssText = `
          width: 100%;
          min-height: 500px; // Adjust this value as needed
          margin: 10px 0;
          position: relative;
          overflow: hidden;
          border-radius: 16px;
        `

        // Create iframe
        const iframe = document.createElement('iframe')
        iframe.style.cssText = `
          width: 100%;
          height: 100%;
          border: none;
          position: absolute;
          top: 0;
          left: 0;
          background: white;
        `
        iframe.src = 'https://swap.mrmigglesbase.com'
        // 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        // 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=YqUXbhg2MqHSW715'

        // Add iframe to container
        iframeContainer.appendChild(iframe)

        // Store original content (optional)
        const originalContent = contentContainer.innerHTML
        contentContainer.setAttribute('data-original-content', originalContent)

        // Replace content
        contentContainer.innerHTML = ''
        contentContainer.appendChild(iframeContainer)
      }
    }
  })
}

// Observer for dynamic content
const observer = new MutationObserver((mutations) => {
  
  for (const mutation of mutations) {
    if (mutation.addedNodes.length > 0) {
      checkForTags()
    }
  }
})

observer.observe(document.body, {
  childList: true,
  subtree: true,
})

checkForTags()