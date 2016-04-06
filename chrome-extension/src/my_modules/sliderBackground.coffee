module.exports = (val, max) ->
    thumbPosition = val / max
    "-webkit-gradient(linear, left top, right top,
      color-stop(#{thumbPosition}, rgb(156, 207, 224)),
      color-stop(#{thumbPosition}, #ddd))"
