chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  //console.log(message);
  if (message.action === "createNotionPage") {
    createNotionPage(message.tabLinks, message.pageName)
      .then(success => sendResponse({ success }))
      .catch((error) => {
        console.error("Error creating Notion page:", error);
        sendResponse({ success: false });
      });
    return true;
  }
});

async function createNotionPage(tabLinks, pageName) {
  //console.log(pageName);
  const notionApiKey = ""; //your notion api key
  const pageId = ""; //your page id

  const notionApiUrl = "https://api.notion.com/v1/pages";
  const content = [];

  for (const domain in tabLinks) {
    const heading_domain = domain.replace(/^www./, "");
    content.push({
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", text: { content: heading_domain } }],
      },
    });

    tabLinks[domain].forEach((link) => {
      content.push({
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: link } }],
        },
      });
    });
  }

  const response = await fetch(notionApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${notionApiKey}`,
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { page_id: pageId },
      properties: {
        title: {
          title: [{ text: { content: pageName} }],
        },
      },
      children: content,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Failed to create page:", errorData);
  }
  return response.ok;
}
