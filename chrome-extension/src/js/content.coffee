window.requestAnimationFrame ?= window.webkitRequestAnimationFrame
window.cancelAnimationFrame ?= window.webkitCancelAnimationFrame
delay = (ms, func) -> setTimeout func, ms

options =
	keyMap: 'arrows'
	disableHover: off
	disableBlueArrow: off
	speeds:
		Normal: 5
		Alt: 24
		Control: 1
		Freeze:0
	scrollCount: 1
	notificationCount: 0
	verified: false

isScrolling =
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

props =
	realSize: {vertical: 'scrollHeight', horizontal: 'scrollWidth'}
	visibleSize: {vertical: 'clientHeight', horizontal: 'clientWidth'}
	scroll: {vertical: 'scrollTop', horizontal: 'scrollLeft'}
	overflow: {vertical: 'overflowY', horizontal: 'overflowX'}
	windowSize: {vertical: 'innerHeight', horizontal: 'innerWidth'}

currentSpeed = 'Normal'
currentFrame = null
licenseLock = off
activeElement = null;
scrollTarget =
	vertical: null
	horizontal: null
domain = window.location.hostname
blueArrow = null

# Process all keyup and keydown events
processKeyEvent = (event) ->
	key =
		name: keyMaps[options.keyMap][event.keyCode] or keyMaps.modifiers[event.keyCode] or keyMaps.arrows[event.keyCode]
		isPressed: event.type is 'keydown'
	switch key.name
		when 'Up', 'Down', 'Left', 'Right'
			direction = key.name
			if key.isPressed
				if isScrolling[direction]
					event.preventDefault()
					event.stopPropagation() if shouldStopPropagation()
				else if shouldScroll(event, direction)
					# Prevent default so the native scroll doesn't interfere,
					# except if the user is not yet scrolling and a modifier is pressed,
					# so that native browser shortcuts still work: e.g. alt + ->.
					unless not isScrolling.anyDirection() and currentSpeed is not 'Normal'
						event.preventDefault()
						event.stopPropagation() if shouldStopPropagation()
					startScrolling(direction)
			else
				stopScrolling(direction)


		when 'Control', 'Alt'
			# while scrolling, don't let modifier keys trigger browser shortcuts
			if isScrolling.anyDirection() then event.preventDefault()
			if key.isPressed
				currentSpeed = key.name
			else if key.name is currentSpeed
				currentSpeed = 'Normal'

shouldStopPropagation = ->
	return yes if domain is 'mail.google.com'
	return yes if options.disableBlueArrow and domain.startsWith('www.google.')
	return no

# Don't scroll if user is editing/selecting text, playing a game or something else
shouldScroll = (event, direction) ->
	return no if event.target.isContentEditable
	return no if event.target.type is 'application/x-shockwave-flash'
	return no if event.defaultPrevented
	return no if /button|input|textarea|select|embed|object/i.test event.target.nodeName
	return no if event.metaKey is on # broswer jumps to the end of page, no need to scroll
	return no if event.shiftKey is on
	return no if not document.hasFocus()
	if domain is 'mail.google.com'
		return no if window.location.hash.indexOf('/') is -1 # don't scroll in the inbox list, keyboard navigation already provided
		return no if event.keyCode not of keyMaps.arrows # only scroll with proper arrow keys in order not to interfere with gmail shortcuts
	if domain.startsWith('www.google.') and blueArrow and not options.disableBlueArrow
		return no # don't scroll if blue arrow has been activated
	switch direction
		when 'Left', 'Right'
			if not scrollTarget.horizontal
				findScrollTarget(event, ['horizontal'])
				return no if not scrollTarget.horizontal
			return no if not isScrollable(scrollTarget.horizontal, 'horizontal')
			return no if domain is 'photos.google.com' # horizontal scroll breaks keyboard navigation for inidividual photos view
		when 'Up', 'Down'
			if not scrollTarget.vertical
				findScrollTarget(event, ['vertical'])
				return no if not scrollTarget.vertical
			return no if not isScrollable(scrollTarget.vertical, 'vertical')


	# if not options.verified and options.scrollCount % 1000 is 0
	# 	trialNotification()

	if licenseLock is on
		event.preventDefault()
		return no

	return yes

startScrolling = (direction) ->
	isScrolling[direction] = true
	isScrolling[oposite[direction]] = false
	if not currentFrame
		currentFrame = requestAnimationFrame(move)
		document.body.style.pointerEvents = 'none' if options.disableHover

stopScrolling = (directions...) ->
	wasScrolling = isScrolling.anyDirection()
	for direction in directions
		isScrolling[direction] = false
	if wasScrolling and not isScrolling.anyDirection()
		currentFrame = cancelAnimationFrame(currentFrame)
		document.body.style.pointerEvents = '' if options.disableHover
		options.scrollCount += 1
		chrome.storage.sync.set(scrollCount: options.scrollCount)

move = ->
	currentFrame = requestAnimationFrame(move)
	amount = options.speeds[currentSpeed]
	y = if isScrolling.Down then amount else if isScrolling.Up then -amount else 0
	x = if isScrolling.Right then amount else if isScrolling.Left then -amount else 0
	scrollTarget.horizontal.scrollLeft += x if x
	scrollTarget.vertical.scrollTop += y if y

findScrollTarget = (event=null, axes=['vertical', 'horizontal']) ->
	# if activeElement is different from body, then use is,
	if not event or document.activeElement is not document.body
		target = document.activeElement
	else  # otherwise use the event target
		target = event.target or event.srcElement
		target = if target.nodeType is 1 then target else target.parentNode;
	for axis in axes
		scrollTarget[axis] = findScrollableParent(target, axis) or scrollTarget[axis]

findScrollableParent = (element, axis) ->
	loop
		return null if not element
		return element if isScrollable(element, axis)
		element = element.parentElement

findScrollableChild = (element) ->
	scrollableChild = null
	for child in element.getElementsByTagName("*")
		if isScrollable(child, 'vertical')
			if not scrollableChild or child.scrollHeight > scrollableChild.scrollHeight
				scrollableChild = child

	return scrollableChild

isScrollable = (element, axis='vertical') ->
	return no if not element
	return no if /button|input|textarea|select|embed|object/i.test element.nodeName
	return no if element is document.documentElement
	return yes if element[props.scroll[axis]] > 10
	if element is document.body then return isBodyScrollable(axis)
	return no if window.getComputedStyle(element)[props.overflow[axis]].toLowerCase() in ['visible', 'hidden']
	return (element[props.realSize[axis]] > element[props.visibleSize[axis]])

isBodyScrollable = (axis) ->
	overflow = window.getComputedStyle(document.body)[props.overflow[axis]].toLowerCase()
	rootOverflow = window.getComputedStyle(document.documentElement)[props.overflow[axis]].toLowerCase()
	return no if rootOverflow is 'hidden'
	return no if rootOverflow is 'visible' and overflow is 'hidden'
	return document.body[props.realSize[axis]] > window[props.windowSize[axis]]


updateOptions = (data) ->
	for option, value of data
		value = if value.newValue? then value.newValue else value
		switch option
			when 'Alt', 'Control', 'Normal' then options.speeds[option] = parseInt(value)
			when 'Mapping' then options.keyMap = value
			when 'disableBlueArrow', 'disableHover', 'scrollCount', 'notificationCount', 'verified'
				options[option] = value

# Load options and update them on changes (no page reload necessary)
if chrome.storage
	chrome.storage.local.get(updateOptions)
	chrome.storage.sync.get(updateOptions)
	chrome.storage.onChanged.addListener(updateOptions)

# Setup event listeners
document.addEventListener('keydown', processKeyEvent, true)
document.addEventListener('keyup', processKeyEvent, true)
document.addEventListener('click', findScrollTarget, true)
document.addEventListener('focus', findScrollTarget, true)

# For preventing scroll once blue arrow is activated
if domain.startsWith('www.google.')
	checkForBlueArrow = (mutations) ->
		for mutation in mutations
			for node in mutation.addedNodes
				if node.innerText is "►"
					blueArrow = node
					stopScrolling('Up', 'Down', 'Left', 'Right')

	new MutationObserver(checkForBlueArrow).observe(document.body, {
		childList: true,
		subtree: true
	})

findScrollTarget()
window.addEventListener 'load', =>
	findScrollTarget()
	# If no vertical scrollTarget was found, search all nodes (for pages with atypical scrolling)
	if not scrollTarget.vertical
		scrollTarget.vertical = findScrollableChild(document)
	if not scrollTarget.vertical # some pages didn't finish render on load so wait a second
		delay 1000, -> scrollTarget.vertical = findScrollableChild(document)



# Stop scrolling and reset speed when user changes to a different application or tab
window.addEventListener 'blur', ->
	stopScrolling('Up', 'Down', 'Left', 'Right')
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
