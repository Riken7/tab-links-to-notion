document
  .getElementById("createNotionPage")
  .addEventListener("click", async () => {
    const result = document.getElementById("result")
    const pageName = document.getElementById("pageName").value;
    if(!pageName) {
      result.innerHTML = "Please enter a page name"
      return;
    }
    result.innerHTML = "Creating Notion Doc..."
    chrome.tabs.query({ currentWindow: true }, async (tabs) => {
      let tabLinks = {};

      for (let tab of tabs) {
        if (tab.url) {
          const domain = new URL(tab.url).hostname;
          if (!tabLinks[domain]) {
            tabLinks[domain] = [];
          }
          tabLinks[domain].push(tab.url);
        }
      }
    
      chrome.runtime.sendMessage({action: "createNotionPage", tabLinks, pageName}, response => {
        result.innerHTML = response.success ? "Notion page created successfully" : "Error creating notion page"
      })
    })
  });
