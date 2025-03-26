const defaultSettings = {
	copyFormat: "<text>",
}

document.addEventListener("DOMContentLoaded", () => {
	const copyFormatText = document.getElementById("copyFormat")
	chrome.storage.sync.get(defaultSettings, (items) => {
		copyFormatText.value = items.copyFormat;
	})

	copyFormatText.addEventListener("input", (e) => {
		const settings = {
			copyFormat: e.target.value,
		};
		chrome.storage.sync.set(settings);
	})
})
