chrome.runtime.onInstalled.addListener (details) ->
	chrome.tabs.create({url: "options/options.html"}) if details.reason is "install"
	chrome.alarms.create
		'delayInMinutes': Math.floor(Math.random()*1440)
		'periodInMinutes': 1440

chrome.alarms.onAlarm.addListener ->
	chrome.storage.local.get ['id', 'scroll'], (items) ->
	  	id = items['id'] or randomId()
	  	scroll = items['scroll'] or 0

	  	$.post "https://smoothkeyscroll.herokuapp.com/analytics",
	  		'id': id
	  		'scroll': scroll

	  	if 'id' not in items
	  		chrome.storage.local.set('id': id)

randomId = -> Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
