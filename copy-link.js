let target = null;

document.addEventListener('contextmenu', (e) => {
	if (e.target.tagName === 'a') {
		target = e.target;
	}
	else if (e.target.closest('a')) {
		target = e.target.closest('a');
	}
}, true);


chrome.runtime.onMessage.addListener((message, senderr, sendResponse) => {
	if (message.action === 'getLinkText' && target) {
		sendResponse({
			text: target.textContent.trim(),
			url: target.href,
		})
	}
})
