chrome.runtime.onInstalled.addListener (details) ->
	chrome.tabs.create({url: "options.html"}) if details.reason is "install"
