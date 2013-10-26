chrome.runtime.onInstalled.addListener (details) ->
	chrome.tabs.create({url: "options/options.html"}) if details.reason is "install"
