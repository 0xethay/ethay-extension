// Receive messages from the page
window.addEventListener('message', function (event) {
  // We only accept messages from the same window
  if (event.source != window) {
    return
  }

  if (event.data.type === 'FROM_PAGE' && event.data.action === 'sendData') {
    chrome.storage.local.set({ extensionData: event.data.data }, () => {
      console.log('Extension data stored:', event.data.data)
    })
  }
})

function checkForTags() {
  // Select all tweets
  const tweets = document.querySelectorAll('article')

  tweets.forEach((tweet) => {
    // Find the main text content div (usually has lang attribute)
    const tweetContent = tweet.querySelector('div[lang]')
    // format must be <Ethay type="..." value="..." />
    if (tweetContent && tweetContent.innerText.includes('<Ethay')) {
      console.log(tweetContent.innerText)

      // get Type and Value
      const type = tweetContent.innerText.split('type=')[1].split('"')[1]
      const value = tweetContent.innerText.split('val=')[1].split('"')[1]
      // const typeAndValue = tweetContent.innerText.split('<Ethay')[1]
      const queryString = `type=${type}&value=${value}`
      const typeAndValue = { type: type, value: value }
      // console.log(typeAndValue)
      // Get the parent container of the text content for better replacement
      const contentContainer =
        tweetContent.closest('div[role="group"]') || tweetContent.parentElement

      if (contentContainer) {
        // Create iframe
        const iframe = document.createElement('iframe')
        iframe.style.cssText = `
          width: 100%;
          min-height: 500px; // Fixed height instead of max-content
          margin: 10px 0;
          border: none;
          border-radius: 16px;
          background: white;
        `
        // type is web2,web3
        if (typeAndValue.type === 'web2') {
          iframe.src = `http://localhost:3000/product${
            queryString ? `?${queryString}` : ''
          }`
        } else {
          iframe.src = `${value}`
          iframe.style.cssText = `
            width: 100%;
            min-height: 550px;
          `
        }

        // Create container for iframe
        const iframeContainer = document.createElement('div')
        iframeContainer.style.cssText = `
          height: 100%;
          width: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        `

        // Add iframe to container
        iframeContainer.appendChild(iframe)

        // Store original content and replace with iframe
        contentContainer.setAttribute(
          'data-original-content',
          contentContainer.innerHTML
        )
        contentContainer.replaceChildren(iframeContainer)
      }
    }
  })
}

checkForTags()
