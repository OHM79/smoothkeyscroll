delay = (ms, func) -> setTimeout(func, ms)
Vue = require('vue')
animations = require("./animations.coffee")
Velocity = require('velocity-animate')
_ = require('lodash')
sharedState = require("./shared-state.coffee")

new Vue
	el: '.options'
	data:
		options:  # defaults
			Normal: 5
			Alt: 24
			Control: 1
			Mapping: 'arrows'
			disableHover: false
			disableBlueArrow: false
		license: sharedState.license
		mixpanel: sharedState.mixpanel
		keyboard: false
		UI:
			showPayment: false
			proFeaturesCover: false
			info:
				disableHover: false
				disableBlueArrow: false
			lightbox:
				blueArrow: false
	watch:
		'options':
			handler: (val) -> chrome.storage.local.set(val)
			deep: true
	created: ->
		chrome.storage.local.get @options, (results) => @options = results
		chrome.storage.sync.get {verified:false}, (results) => @verified = results.verified
	ready: ->
		chrome.storage.onChanged.addListener (changes, namespace) ->
			if 'verified' in changes
				@verified = changes['verified'].newValue
	methods:
		sliderBackground: require('./sliderBackground.coffee')
		scrollToPay: () ->
			if @license.verified
				@UI.proFeaturesCover = false
			else
				@UI.proFeaturesCover = true
				# center element in page
				offset = (window.innerHeight - document.querySelector('#module-license').offsetHeight) / 2
				Velocity
					elements: document.querySelector('#module-license')
					properties: "scroll"
					options:
						delay: 500
						duration: 1000
						offset: -100
						easing: 'easeInOutQuad'
				@mixpanelTrack('Pay: Scroll To Pay')
		mixpanelTrack: (eventName, customProperties={}) ->
			eventID = eventName + JSON.stringify(customProperties)
			return no if @mixpanel.tracked[eventID]

			properties = _.merge(customProperties, {
				'Usage: Notification Count': @mixpanel.notificationCount
				'Usage: Scroll Count': @mixpanel.scrollCount
			})
			mixpanel.track(eventName, properties)
			@mixpanel.tracked[eventID] = true


	transitions:
		slideFade: animations.slideFade
		reveal: animations.reveal
	filters:
		speedTranslation: (px) ->
			switch
				when px <= 5 then '(good for reading)'
				when px >= 15 then '(better for skiming)'
				else ''
		translationOpacity: (px) ->
			switch
				when px <= 5
					min = 1
					max = 5
					range = max - min
					return 1 - (px - min) / range
				when px >= 15
					min = 15
					max = 30
					range = max - min
					return (px - min) / range
				else
					return 0

require('./license.coffee')

# 	delay 100, () -> window.scrollTo(0, 0)

