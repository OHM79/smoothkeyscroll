document.addEventListener "DOMContentLoaded", (event) ->
	mixpanel.people.set({ $created: new Date() })
	mixpanel.track('Welcome Page Displayed')

	keyDown = document.querySelectorAll(".chiclet.down.arrow.key")
	keyLeft = document.querySelectorAll(".chiclet.left.arrow.key")
	keyUp = document.querySelectorAll(".chiclet.up.arrow.key")
	keyRight = document.querySelectorAll(".chiclet.right.arrow.key")

	mySequence = [
	    { e: keyDown, p: { opacity: 0 }, o: { duration: 700, delay: 1000 } },
	    { e: keyUp, p: { opacity: 1 }, o: { duration: 700, sequenceQueue:false  } },
	    { e: keyUp, p: { opacity: 0 }, o: { duration: 700, delay: 1000 } }
	    { e: keyLeft, p: { opacity: 1 }, o: { duration: 700, sequenceQueue:false  } },
	    { e: keyLeft, p: { opacity: 0 }, o: { duration: 700, delay: 1000 } },
	    { e: keyRight, p: { opacity: 1 }, o: { duration: 700, sequenceQueue:false } },
	    { e: keyRight, p: { opacity: 0 }, o: { duration: 700, delay: 1000 } },
	    { e: keyDown, p: { opacity: 1 }, o: { duration: 700, sequenceQueue:false } }
	]

	Velocity.RunSequence(mySequence)
	setInterval( ->
		 Velocity.RunSequence(mySequence)
	, 8000)


	cog1 = document.querySelector('.cog.one')
	cog2 = document.querySelector('.cog.two')
	cog3 = document.querySelector('.cog.three')
	cog4 = document.querySelector('.cog.four')
	cog5 = document.querySelector('.cog.five')
	cog6 = document.querySelector('.cog.six')
	hero = document.querySelector('.section.hero > .container')
	heroFixed = document.querySelector('.hero.parallax')


	parallax = () ->
		window.requestAnimationFrame(parallax)
		offset = Math.max(window.pageYOffset, 0)

		degrees = Math.round(offset * 0.1)
		cog1.style.transform = "rotate(-#{degrees}deg)"
		cog2.style.transform = "rotate(#{degrees}deg)"
		cog3.style.transform = "rotate(#{degrees}deg)"
		cog4.style.transform = "rotate(#{degrees}deg)"
		cog5.style.transform = "rotate(-#{degrees}deg)"
		cog6.style.transform = "rotate(-#{degrees}deg)"

		# heroOffset = Math.round(offset * 0.55)
		# $hero.css('transform', "translate3d(0,#{heroOffset}px,0)")

		heroOffset = Math.round(-offset * 0.44)
		heroFixed.style.transform = "translate3d(0,#{heroOffset}px,0)"


	window.requestAnimationFrame(parallax)
