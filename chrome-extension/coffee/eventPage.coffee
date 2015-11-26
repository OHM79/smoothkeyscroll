chrome.runtime.onInstalled.addListener (details) ->
    if details.reason is "install"
        # Open welcome page
        chrome.tabs.create({url: "welcome.html"})

        # Make extension work on all tabs without having to refresh or restart browser
        chrome.windows.getAll (windows) ->
            for myWindow in windows
                chrome.tabs.getAllInWindow myWindow.id, (tabs) ->
                    for tab in tabs
                        chrome.tabs.executeScript(tab.id, {file: "js/content.js"});


chrome.runtime.onStartup.addListener () ->
	license =
		email: ''
		key: ''
		verified: false

	chrome.storage.sync.get license, (results) =>
		data = new FormData()
		for key, value of results
			console.log "append", key, value
			data.append(key, value)
		if not results.email or not results.key
			console.log 'no details'
			chrome.storage.sync.set(verified: false)
		else if navigator.onLine
			request = new XMLHttpRequest();
			request.open('POST', 'https://smoothkeyscroll.herokuapp.com/license/verify', true);
			request.onerror = () ->
				console.log 'error'
				chrome.storage.sync.set(verified: false)
			request.onload = () ->
				console.log 'request.responseText:', request.responseText
				sync = {verified: request.responseText is 'Valid'}
				console.log 'sync: ', sync
				chrome.storage.sync.set(sync)
			request.send(data)





agent = new IntentaAgent();
agent.setEnv('production');
agent.setToken('BWEATVykfSpY7JyyA1j8tA');
agent.run();


