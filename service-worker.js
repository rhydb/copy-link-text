const defaultSettings = {
	copyFormat: "<text>",
}

let currentSettings = defaultSettings;

// Create the context menu item when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(defaultSettings, (items) => {
	  currentSettings = items;
  })
  chrome.contextMenus.create({
    id: "linkAction",
    title: "Copy link text",
    contexts: ["link"], // This ensures it only appears when right-clicking links
  });
});

chrome.storage.onChanged.addListener((changes, area) => {
	if (area === 'sync') {
		Object.keys(changes).forEach(key => {
			currentSettings[key] = changes[key].newValue;
		})
	}
})

// runs in the tab to copy the text
function textToClipboard(text) {
	navigator.clipboard.writeText(text)
	.then(() => {
		console.log("copied", text)
	})
	.catch(err => {
		// fallback to using a textarea
		const textarea = document.createElement('textarea');
		textarea.value = text;
		textarea.style.position = 'fixed';
		textarea.style.opacity = '0';
		document.body.appendChild(textarea);
		textarea.select();
		const success = document.execCommand('copy');
		document.body.removeChild(textarea);
		if (success) {
			console.log("copied2", text);
		} else {
			console.log("nuh uh")
		}
	});
}

// sends the call to the tab to copy the text
function copyToClipboard(response, tabId) {
	const text = currentSettings.copyFormat.replaceAll("<url>", response.url).replaceAll("<text>", response.text)
	chrome.scripting.executeScript({
		target: { tabId },
		function: textToClipboard,
		args: [text],
	});
}

function copyLinkAction(tab) {
	chrome.tabs.sendMessage(tab.id, {
		action: 'getLinkText'
	}, (response) => {
		if (response) {
			console.log("url:", response.url);
			console.log("text:", response.text);
			copyToClipboard(response, tab.id);
		}
	})
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === "linkAction") {
		copyLinkAction(tab)
	}
})
