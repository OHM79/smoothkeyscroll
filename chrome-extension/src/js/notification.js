(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var counter, element, repeatDelay, timer;

repeatDelay = function(ms, func) {
  return setInterval(func, ms);
};

counter = 4;

element = document.querySelector('#counter');

timer = repeatDelay(1000, function() {
  if (--counter < 0) {
    clearInterval(timer);
    return element.innerText = '';
  } else {
    return element.innerText = '- ' + counter;
  }
});


},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvdXNlci9Xb3JrL3Ntb290aGtleXNjcm9sbC9leHRlbnNpb24vY2hyb21lLWV4dGVuc2lvbi9zcmMvanMvbm90aWZpY2F0aW9uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7O0FBQUEsV0FBQSxHQUFjLFNBQUMsRUFBRCxFQUFLLElBQUw7U0FBYyxXQUFBLENBQVksSUFBWixFQUFrQixFQUFsQjtBQUFkOztBQUNkLE9BQUEsR0FBVTs7QUFDVixPQUFBLEdBQVUsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsVUFBdkI7O0FBQ1YsS0FBQSxHQUFRLFdBQUEsQ0FBWSxJQUFaLEVBQWtCLFNBQUE7RUFDekIsSUFBRyxFQUFFLE9BQUYsR0FBWSxDQUFmO0lBQ0MsYUFBQSxDQUFjLEtBQWQ7V0FDQSxPQUFPLENBQUMsU0FBUixHQUFvQixHQUZyQjtHQUFBLE1BQUE7V0FJQyxPQUFPLENBQUMsU0FBUixHQUFvQixJQUFBLEdBQU8sUUFKNUI7O0FBRHlCLENBQWxCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcGVhdERlbGF5ID0gKG1zLCBmdW5jKSAtPiBzZXRJbnRlcnZhbCBmdW5jLCBtc1xuY291bnRlciA9IDQ7XG5lbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvdW50ZXInKTtcbnRpbWVyID0gcmVwZWF0RGVsYXkgMTAwMCwgLT5cblx0aWYgLS1jb3VudGVyIDwgMFxuXHRcdGNsZWFySW50ZXJ2YWwodGltZXIpXG5cdFx0ZWxlbWVudC5pbm5lclRleHQgPSAnJ1xuXHRlbHNlXG5cdFx0ZWxlbWVudC5pbm5lclRleHQgPSAnLSAnICsgY291bnRlclxuXG5cblxuIl19
