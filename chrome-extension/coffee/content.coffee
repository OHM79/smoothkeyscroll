window.requestAnimationFrame ?= window.webkitRequestAnimationFrame
window.cancelAnimationFrame ?= window.webkitCancelAnimationFrame
delay = (ms, func) -> setTimeout func, ms

# pointerEvents = document.body.style.pointerEvents

options =
	keyMap: 'arrows'
	disableHover: off
	speeds:
		Normal: 5
		Alt: 24
		Control: 1
		Freeze:0
	scrollCount: 1
	notificationCount: 0
	verified: false

scrolling =
	Up: no
	Down: no
	Left: no
	Right: no
	anyDirection: -> @Up or @Down or @Left or @Right

oposite =
	Up: 'Down'
	Down: 'Up'
	Left: 'Right'
	Right: 'Left'

keyMaps =
	arrows:
		37: 'Left'
		38: 'Up'
		39: 'Right'
		40: 'Down'
	vi:
		72: 'Left'  # H
		75: 'Up'    # K
		76: 'Right' # L
		74: 'Down'  # J
	gamer:
		65: 'Left'  # A
		87: 'Up'    # W
		68: 'Right' # D
		83: 'Down'  # S
	ergo:
		74: 'Left'  # J
		73: 'Up'    # I
		76: 'Right' # L
		75: 'Down'  # K
	modifiers:
		16: 'Shift'
		17: 'Control'
		18: 'Alt'
		224: 'Meta' # Firefox OSX
		91: 'Meta'  # Chrome OSX - Left
		93: 'Meta'  # Chrome OSX - Right
		92: 'Meta'  # Chrome Ubuntu - right


currentSpeed = 'Normal'
currentFrame = null
licenseLock = off
activeElement = null;
window.scrollTargetX = null;
window.scrollTargetY = null;
domain = window.location.hostname

# Process all keyup and keydown events
processKeyEvent = (event) ->
	key =
		name: keyMaps[options.keyMap][event.keyCode] or keyMaps.modifiers[event.keyCode] or keyMaps.arrows[event.keyCode]
		isPressed: event.type is 'keydown'
	switch key.name
		when 'Up', 'Down', 'Left', 'Right'
			direction = key.name
			if key.isPressed
				if scrolling[direction]
					event.preventDefault()
					if domain is 'mail.google.com'
						event.stopPropagation()
				else if shouldScroll(event, direction)
					# Prevent default so the native scroll doesn't interfere,
					# except if the user is not yet scrolling and a modifier is pressed,
					# so that native browser shortcuts still work: e.g. alt + ->.
					unless not scrolling.anyDirection() and currentSpeed is not 'Normal'
						# console.log 'preventDefault'
						event.preventDefault()
						if domain is 'mail.google.com'
							event.stopPropagation()
					startScrolling(direction)
			else
				stopScrolling(direction)


		when 'Control', 'Alt'
			# console.log key.name
			# while scrolling, don't let modifier keys trigger browser shortcuts
			if scrolling.anyDirection() then event.preventDefault()
			if key.isPressed
				currentSpeed = key.name
			else if key.name is currentSpeed
				currentSpeed = 'Normal'


# Don't scroll if user is editing/selecting text, playing a game or something else
shouldScroll = (event, direction) ->
	return no if event.target.isContentEditable
	return no if event.target.type is 'application/x-shockwave-flash'
	return no if event.defaultPrevented
	return no if /button|input|textarea|select|embed|object/i.test event.target.nodeName
	return no if event.metaKey is on # broswer jumps to the end of page, no need to scroll
	return no if event.shiftKey is on
	return no if not document.hasFocus()
	if window.location.hostname is 'mail.google.com'
		if window.location.hash.indexOf('/') is -1
			# console.log "gmail, don't interfere"
			return no
		else if event.keyCode not of keyMaps.arrows
			return no
			# console.log "gmail shortcuts don't interfere"

	if direction in ['Left', 'Right']
		if not window.scrollTargetX
			# console.log "no horizontal scrollable element"
			findScrollTargets(event, 'x')
			return no if not window.scrollTargetX
		if not scrollable(window.scrollTargetX, 'x')
			# console.log "not scrollable horizonally"
			return no
		if domain is 'photos.google.com'
			# horizontal scroll breaks keyboard navigation for inidividual photos view
			return no
		# We will cancel this end of page code for now since it is non-essential
		# and it is not very reliable on the document body when scrolling down
		# else if direction is 'Left'
		#   if scrollTarget.scrollLeft <= 0
		#     console.log "reached end of page"
		#     return no
		# else if direction is 'Right'
		#   if scrollTarget.scrollLeft >= (scrollTarget.scrollWidth - scrollTarget.clientWidth)
		#     console.log "reached end of page"
		#     return no

	if direction in ['Up', 'Down']
		if not window.scrollTargetY
			# console.log "no vertical scrollable element"
			findScrollTargets(event, 'y')
			return no if not window.scrollTargetY

		if not scrollable(window.scrollTargetY, 'y')
			# console.log "not scrollable vertically"
			return no
		# We will cancel this end of page code for now since it is non-essential
		# and it is not very reliable on the document body when scrolling down
		# else if direction is 'Up'
		#   if scrollTarget.scrollTop <= 0
		#     console.log "reached end of page"
		#     return no
		# else if direction is 'Down'
		#   if scrollTarget.scrollTop >= (scrollTarget.scrollHeight - scrollTarget.clientHeight)
		#     console.log "reached end of page"
		#     return no

	# if not options.verified and options.scrollCount % 1000 is 0
	# 	trialNotification()

	if licenseLock is on
		event.preventDefault()
		return no

	return yes

startScrolling = (direction) ->
	# trial code
	scrolling[direction] = true
	scrolling[oposite[direction]] = false
	if not currentFrame
		currentFrame = requestAnimationFrame(move)
		document.body.style.pointerEvents = 'none' if options.disableHover


stopScrolling = (direction) ->
	options.scrollCount += 1
	scrolling[direction] = false
	unless scrolling.anyDirection()
		currentFrame = cancelAnimationFrame(currentFrame)
		document.body.style.pointerEvents = '' if options.disableHover
		chrome.storage.sync.set(scrollCount: options.scrollCount)


move = ->
	currentFrame = requestAnimationFrame(move)
	amount = options.speeds[currentSpeed]
	y = if scrolling.Down then amount else if scrolling.Up then -amount else 0
	x = if scrolling.Right then amount else if scrolling.Left then -amount else 0
	# window.scrollBy(x, y) if x or y
	window.scrollTargetX.scrollLeft += x if x
	window.scrollTargetY.scrollTop += y if y

findScrollableParent = (element, axis) ->
	loop
		if scrollable(element, axis)
			return element
		else
			element = element.parentElement

scrollable = (element, axis) ->
	scrollAxis = if axis is 'y' then 'scrollTop' else 'scrollLeft'

	if not element
		return true
	else if /button|input|textarea|select|embed|object/i.test element.nodeName
		return false
	else if element[scrollAxis] > 10
		return true
	else
		initialPosition = element[scrollAxis]
		element[scrollAxis] = 10
		scrollVariation = element[scrollAxis]
		element[scrollAxis] = initialPosition
		if scrollVariation >= 10
			return true
	return false;

findScrollTargets = (event=null, axis='both') ->
	# if event then console.log event.type
	# console.log document.activeElement
	# if activeElement is different from body, then use is,
	if not event or document.activeElement is not document.body
		# console.log 'activeElement:'
		# console.log document.activeElement
		target = document.activeElement
	else  # otherwise use the event target
		target = event.target or event.srcElement
		target = if target.nodeType is 1 then target else target.parentNode;

	if axis is 'y' or axis is 'both'
		scrollableParentY = findScrollableParent(target, 'y')
		window.scrollTargetY = scrollableParentY if scrollableParentY
		# console.log('window.scrollTargetY:')
		# console.log(window.scrollTargetY)

	if axis is 'x' or axis is 'both'
		scrollableParentX = findScrollableParent(target, 'x')
		window.scrollTargetX = scrollableParentX if scrollableParentX
		# console.log('window.scrollTargetX:')
		# console.log(window.scrollTargetX)



# enableGPU = ->
#   # make sure not to interfere if now trasform already exists
#   if getComputedStyle(document.body).webkitTransform is 'none'
#     document.body.style.webkitTransform = "translate3d(0, 0, 0)"


updateOptions = (storage) ->
	for option, value of storage
		value = if value.newValue? then value.newValue else value
		switch option
			when 'Alt', 'Control', 'Normal' then options.speeds[option] = parseInt(value)
			when 'Mapping' then options.keyMap = value
			when 'disableHover', 'scrollCount', 'notificationCount', 'verified'
				options[option] = value

	# if options.gpuAcceleration is on then enableGPU()


# Load options and update them on changes (no page reload necessary)
if chrome.storage
	chrome.storage.local.get(updateOptions)
	chrome.storage.sync.get(updateOptions)
	chrome.storage.onChanged.addListener(updateOptions)




# Setup event listeners
document.addEventListener('keydown', processKeyEvent, true)
document.addEventListener('keyup', processKeyEvent, true)
document.addEventListener('click', findScrollTargets, true)
document.addEventListener('focus', findScrollTargets, true)


findScrollTargets()
window.onload = -> findScrollTargets()



# Stop scrolling and reset speed when user changes to a different application or tab
window.onblur = ->
	stopScrolling('Up')
	stopScrolling('Down')
	stopScrolling('Left')
	stopScrolling('Right')
	currentSpeed = 'Normal'


trialNotification = ->
	return no if document.getElementById('smoothkeyscroll-notification')
	embed = document.createElement('embed')
	embed.type = 'text/html'
	embed.id = 'smoothkeyscroll-notification'
	embed.src = chrome.extension.getURL('notification.html')
	embed.width = '320'
	embed.height = '80'
	embed.style.position = 'fixed'
	embed.style.top = 0
	embed.style.right = 0
	embed.style.zIndex = 2147483647
	document.body.appendChild(embed)
	options.notificationCount += 1
	chrome.storage.sync.set({notificationCount: options.notificationCount})
	licenseLock = on
	delay 2000, -> licenseLock = off

# request = new XMLHttpRequest()
# extensionURL = chrome.extension.getURL('')
# request.open("GET", extensionURL + 'notification.html', false)
# request.send()
# shadowHost = document.createElement('span')
# shadowHost.id = 'smoothkeyscroll-notification'
# shadowRoot = shadowHost.createShadowRoot()
# shadowRoot.innerHTML = request.responseText

# document.body.appendChild(shadowHost)

# img = document.createElement('a')
# img.id = 'smoothkeyscroll-notification'
# img.src =
# img.style.position = 'fixed'
# # img.style.cursor = 'pointer'
# img.background = chrome.extension.getURL('img/notification.png')
# img.style.width = '236px'
# img.style.height = '76px'
# img.style.display = 'block'

# img.style.top = 0
# img.style.right = 0
# img.style.zIndex = 2147483647
# img.addEventListener 'click', -> document.body.removeChild(img)
# document.body.appendChild(img)

	# chrome.notifications.create('peca', NotificationOptions options, function callback)

# chrome.runtime.sendMessage {greeting: "hello"}, (response) ->
#   console.log('response received')
