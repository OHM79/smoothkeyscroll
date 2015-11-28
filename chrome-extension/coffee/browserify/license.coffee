delay = (ms, func) -> setTimeout(func, ms)

$ = require('jquery')
_ = require('lodash')
Vue = require('vue')
Vue.use(require('../../js/vendor/validator.js'))
Velocity = require('velocity-animate')
require('velocity-animate/velocity.ui')
# Velocity.defaults.duration = 1000
animations = require("./animations.coffee")


LICENSE =
	email: ''
	key: ''
	verified: no

module.exports = LICENSE



new Vue
	el: '#module-license'
	template: require('../../license/license.html')
	data:
		split: 90
		custom: ''
		minimum: 300
		# minimum: 0
		license: LICENSE
		priceSelector: ''
		payform:
			variation: '90-29-10'
			prices:
				one: 9900
				two: 2900
				three: 1900
			variations:
				'99-29-19':
					one: 9900
					two: 2900
					three: 1900
				'50-30-10':
					one: 5000
					two: 3000
					three: 1000
				'25-10-5':
					one: 2500
					two: 1000
					three: 500
				'29-19-9':
					one: 2900
					two: 1900
					three: 900
				'fixed-3': 300
				'fixed-5': 500
				'fixed-10': 1000
				'fixed-2.99': 299
				'fixed-4.99': 499
				'fixed-9.99': 999
		UI:
			charityInfo: no
			loading: no
			verificationFailed: no
			verificationResult: ''
			verifyingLicense: no
			paying: no
			paymentError: no
			paymentMessage: ''
		mixpanel:
			tracked: {}
			id: ''

	created: ->
		chrome.storage.local.get 'payformVariation', (results) =>
			if @payform.variations[results.payformVariation]
				@payform.prices = @payform.variations[results.payformVariation]
				@payform.variation = results.payformVariation
			else # choose a random variation
				randomVariation = _.sample(_.keys(@payform.variations))
				@payform.variation = randomVariation
				@payform.prices = @payform.variations[randomVariation]
				chrome.storage.local.set({'payformVariation':randomVariation})
		chrome.storage.sync.get @license, (results) =>
			for key, value of results
				@license[key] = value


		window.addEventListener 'load', =>
			chrome.storage.sync.get 'mixpanel_id', (results) =>
				# Identify with Mixpanel
				@mixpanel.id = results['mixpanel_id'] or mixpanel.get_distinct_id()
				chrome.storage.sync.set({'mixpanel_id': @mixpanel.id})
				mixpanel.identify(@mixpanel.id);
				@mixpanelTrack('License Loaded')

				# Track notification clicked
				if window.location.search is '?notification'
					@mixpanelTrack('Notification Clicked')
					window.history.replaceState('sks', 'Smooth Key Scroll - Options', '/options.html' + window.location.hash);

	ready: ->
		# Show license details form if hash is present
		if window.location.hash is '#license' and not @license.verified
			@mutate('#section-pay-what-you-want', '#section-verify-license')




	watch:
		'license':
			handler: (licenseData) -> chrome.storage.sync.set(licenseData)
			deep: true
	computed:
		total: ->
			@custom
			if @priceSelector is 'custom'
				result = @getCustom() or @totalCache
			else
				result = @priceSelector
				if override_price_tooltip? then override_price_tooltip.hide()

			@totalCache = result
			return result
		house: -> Math.round(@split * @total / 100)
		charity: -> @total - @house
		percentageHouse:
			get: -> @split
			set: (value) -> @split = value
		percentageCharity:
			get: -> 100 - @split
			set: (value) -> @split = 100 - value
		paypalCustom: -> JSON.stringify({email: @license.email, payform: @payform.variation, mixpanel_id: @mixpanel.id})
		isPaymentFixed: -> Boolean(~@payform.variation.indexOf('fixed'))


	filters:
		currency:
			read: (cents) -> @cents2dollars(cents)
			write: (value, oldValue) -> @dollars2cents(parseFloat(value))
		number:
			read: (value) -> value
			write: (value, oldValue) -> value.replace(',','.').replace(/[^\d.]/g, '')
		integer: (value) -> Math.round(value)
		removeTrailingZeros: (value) -> +value

	methods:
		mixpanelTrack: (eventName, properties={}) ->
			return no if @mixpanel.tracked[eventName]

			properties = _.merge(properties, {
				'Pay: What You Want': !@isPaymentFixed
				'Pay: Variation': @payform.variation
				'Pay: Price Selector': @priceSelector
				'Pay: Total': @cents2dollars(@total)
				'Pay: Split': @split
				'Pay: Email': @license.email
			})
			mixpanel.track(eventName, properties)
			@mixpanel.tracked[eventName] = true

		emptyCustom: -> @custom = ''
		sliderBackground: require('./sliderBackground.coffee')
		getCustom: ->
			if @custom is '' or isNaN(@custom)
				return false
			cents = @dollars2cents(@custom)
			if cents < @minimum
				return @minimum
			else
				return cents

		dollars2cents: (dollars) -> Math.round(dollars * 100)
		cents2dollars: (cents) -> (cents / 100).toFixed(2)
		pay: (paymentMethod) ->
			@mixpanelTrack('Payment Button Pressed', {'Pay: Method': paymentMethod})
			if @$valid('paymentDetails')
				@[paymentMethod]()
				mixpanel.people.set({'$email': @license.email})
			# hack to make email field turn red even it was not edited yet
			# necessary because of validator.js limitations
			$('.invalid').addClass('touched')
		paypal: -> document.querySelector('#paypalForm').submit()
		creditcard: -> @paypal()
		# TODO: Stripe is comming soon. In the meanwhile, click in paypal and select credit card. You don't even need to have an account.
		bitcoin: ->
			@UI.paymentError = no
			@UI.paying = 'bitcoin'

			if @isPaymentFixed
				data =
					# TODO: test bitcoin
					smoothkeyscroll: @cents2dollars(@payform.prices)
					email: @license.email
					payform: @payform.variation
					mixpanel_id: @mixpanel.id
			else
				data =
					smoothkeyscroll: @cents2dollars(@house)
					charity: @cents2dollars(@charity)
					email: @license.email
					payform: @payform.variation
					mixpanel_id: @mixpanel.id

			$.post("https://smoothkeyscroll.herokuapp.com/coinbase", data)
				.done (buttonCode) =>
					@UI.paying = no
					url = 'https://coinbase.com/checkouts/' + buttonCode
					# width = 460;
					# height = 580;
					# left = window.screenX + window.innerWidth / 2 - width / 2
					# top = window.screenY + window.innerHeight / 2 - height / 2
					# window.open(url, '_blank', "width=#{width}, height=#{height}, left=#{left}, top=#{top}")
					window.open(url, '_blank')


				.fail (result, a, b) =>
					# Show response text if it is a human messaage and not html
					if result.responseText and result.responseText.indexOf('<')
						@UI.paymentMessage = result.responseText
					else
						@UI.paymentMessage = @statusMessage(result.status)

					@UI.paymentError = yes
					@UI.paying = no


		verifyLicense: ->
			@UI.verifyingLicense = yes
			@UI.verificationFailed = no
			$.post("https://smoothkeyscroll.herokuapp.com/license/verify", @license)
				.done (response) =>
					if response is 'Valid'
						@mutate('#section-verify-license', '#section-certificate')
						delay 2000, =>
							@license.verified = yes
							@UI.verifyingLicense = no
					else
						@UI.verifyingLicense = no
						@UI.verificationResult = response
						@UI.verificationFailed = yes


				.fail (result) =>
					@UI.verificationResult = @statusMessage(result.status)
					@UI.verifyingLicense = no
					@UI.verificationFailed = yes


		statusMessage: (errorNumber) -> switch errorNumber
			when 0 then "The server could not be reached. Make sure you are connected to the internet. If the problem persists try again later or contact support."
			when 404 then "The server could not be reached. Make sure you are connected to the internet. If the problem persists try again later or contact support."
			when 502 then "An error (502) ocurred when contacting the server. If the problem persists please contact Smooth Key Scroll using the email address at the bottom of the page."
			else "An error (#{errorNumber}) ocurred when contacting the server. If the problem persists please contact 	support@smoothkeyscroll.com"

		mutate: animations.mutate
		pickRandomProperty: (object) ->
		    count = 0
		    for property in object
		        if (Math.random() < 1/++count)
		           result = property;
		    return result


	transitions:
		slideFade: animations.slideFade

