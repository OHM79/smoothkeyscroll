repeatDelay = (ms, func) -> setInterval func, ms
counter = 4;
element = document.querySelector('#counter');
timer = repeatDelay 1000, ->
	if --counter < 0
		clearInterval(timer)
		element.innerText = ''
	else
		element.innerText = '- ' + counter



