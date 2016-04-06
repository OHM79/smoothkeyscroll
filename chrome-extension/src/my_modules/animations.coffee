$ = require('jquery')
Velocity = require('velocity-animate')
require('velocity-animate/velocity.ui')

module.exports.slideFade =
	enter: (element, done) ->
		Velocity(element, 'transition.fadeIn', {animateParentHeight: true, duration: 1000, complete: done})
		return -> Velocity(element, 'stop')
	leave: (element, done) ->
		Velocity(element, 'transition.fadeOut', {animateParentHeight: true, duration: 750, complete: done})
		return -> Velocity(element, 'stop')

module.exports.reveal =
	enter: (element, done) ->
		Velocity(element, "slideDown", { duration: 1500 })
		Velocity(element, "fadeIn", { duration: 2000, queue: false })
		Velocity(element, "scroll", { duration: 1500, queue: false})
		return -> Velocity(element, 'stop')
	leave: (element, done) ->
		Velocity(element, "slideUp", { duration: 1500 })
		return -> Velocity(element, 'stop')

module.exports.mutate = (elementOut, elementIn) ->
	$parent = $(elementIn).parent()
	Velocity
		e: $parent
		p: height: $(elementIn).outerHeight()
		o: duration:700, complete: -> $parent.css('height', '')

	Velocity.RunSequence([
		{e: $(elementOut), p: 'fadeOut', o: {duration: 500}}
		{e: $(elementIn), p: 'fadeIn', o: {duration: 500}}
	])
