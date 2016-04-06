(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! VelocityJS.org (1.2.3). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */

/*************************
   Velocity jQuery Shim
*************************/

/*! VelocityJS.org jQuery Shim (1.0.1). (C) 2014 The jQuery Foundation. MIT @license: en.wikipedia.org/wiki/MIT_License. */

/* This file contains the jQuery functions that Velocity relies on, thereby removing Velocity's dependency on a full copy of jQuery, and allowing it to work in any environment. */
/* These shimmed functions are only used if jQuery isn't present. If both this shim and jQuery are loaded, Velocity defaults to jQuery proper. */
/* Browser support: Using this shim instead of jQuery proper removes support for IE8. */

;(function (window) {
    /***************
         Setup
    ***************/

    /* If jQuery is already loaded, there's no point in loading this shim. */
    if (window.jQuery) {
        return;
    }

    /* jQuery base. */
    var $ = function (selector, context) {
        return new $.fn.init(selector, context);
    };

    /********************
       Private Methods
    ********************/

    /* jQuery */
    $.isWindow = function (obj) {
        /* jshint eqeqeq: false */
        return obj != null && obj == obj.window;
    };

    /* jQuery */
    $.type = function (obj) {
        if (obj == null) {
            return obj + "";
        }

        return typeof obj === "object" || typeof obj === "function" ?
            class2type[toString.call(obj)] || "object" :
            typeof obj;
    };

    /* jQuery */
    $.isArray = Array.isArray || function (obj) {
        return $.type(obj) === "array";
    };

    /* jQuery */
    function isArraylike (obj) {
        var length = obj.length,
            type = $.type(obj);

        if (type === "function" || $.isWindow(obj)) {
            return false;
        }

        if (obj.nodeType === 1 && length) {
            return true;
        }

        return type === "array" || length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj;
    }

    /***************
       $ Methods
    ***************/

    /* jQuery: Support removed for IE<9. */
    $.isPlainObject = function (obj) {
        var key;

        if (!obj || $.type(obj) !== "object" || obj.nodeType || $.isWindow(obj)) {
            return false;
        }

        try {
            if (obj.constructor &&
                !hasOwn.call(obj, "constructor") &&
                !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            return false;
        }

        for (key in obj) {}

        return key === undefined || hasOwn.call(obj, key);
    };

    /* jQuery */
    $.each = function(obj, callback, args) {
        var value,
            i = 0,
            length = obj.length,
            isArray = isArraylike(obj);

        if (args) {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            }

        } else {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            }
        }

        return obj;
    };

    /* Custom */
    $.data = function (node, key, value) {
        /* $.getData() */
        if (value === undefined) {
            var id = node[$.expando],
                store = id && cache[id];

            if (key === undefined) {
                return store;
            } else if (store) {
                if (key in store) {
                    return store[key];
                }
            }
        /* $.setData() */
        } else if (key !== undefined) {
            var id = node[$.expando] || (node[$.expando] = ++$.uuid);

            cache[id] = cache[id] || {};
            cache[id][key] = value;

            return value;
        }
    };

    /* Custom */
    $.removeData = function (node, keys) {
        var id = node[$.expando],
            store = id && cache[id];

        if (store) {
            $.each(keys, function(_, key) {
                delete store[key];
            });
        }
    };

    /* jQuery */
    $.extend = function () {
        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if (typeof target === "boolean") {
            deep = target;

            target = arguments[i] || {};
            i++;
        }

        if (typeof target !== "object" && $.type(target) !== "function") {
            target = {};
        }

        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && $.isArray(src) ? src : [];

                        } else {
                            clone = src && $.isPlainObject(src) ? src : {};
                        }

                        target[name] = $.extend(deep, clone, copy);

                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    };

    /* jQuery 1.4.3 */
    $.queue = function (elem, type, data) {
        function $makeArray (arr, results) {
            var ret = results || [];

            if (arr != null) {
                if (isArraylike(Object(arr))) {
                    /* $.merge */
                    (function(first, second) {
                        var len = +second.length,
                            j = 0,
                            i = first.length;

                        while (j < len) {
                            first[i++] = second[j++];
                        }

                        if (len !== len) {
                            while (second[j] !== undefined) {
                                first[i++] = second[j++];
                            }
                        }

                        first.length = i;

                        return first;
                    })(ret, typeof arr === "string" ? [arr] : arr);
                } else {
                    [].push.call(ret, arr);
                }
            }

            return ret;
        }

        if (!elem) {
            return;
        }

        type = (type || "fx") + "queue";

        var q = $.data(elem, type);

        if (!data) {
            return q || [];
        }

        if (!q || $.isArray(data)) {
            q = $.data(elem, type, $makeArray(data));
        } else {
            q.push(data);
        }

        return q;
    };

    /* jQuery 1.4.3 */
    $.dequeue = function (elems, type) {
        /* Custom: Embed element iteration. */
        $.each(elems.nodeType ? [ elems ] : elems, function(i, elem) {
            type = type || "fx";

            var queue = $.queue(elem, type),
                fn = queue.shift();

            if (fn === "inprogress") {
                fn = queue.shift();
            }

            if (fn) {
                if (type === "fx") {
                    queue.unshift("inprogress");
                }

                fn.call(elem, function() {
                    $.dequeue(elem, type);
                });
            }
        });
    };

    /******************
       $.fn Methods
    ******************/

    /* jQuery */
    $.fn = $.prototype = {
        init: function (selector) {
            /* Just return the element wrapped inside an array; don't proceed with the actual jQuery node wrapping process. */
            if (selector.nodeType) {
                this[0] = selector;

                return this;
            } else {
                throw new Error("Not a DOM node.");
            }
        },

        offset: function () {
            /* jQuery altered code: Dropped disconnected DOM node checking. */
            var box = this[0].getBoundingClientRect ? this[0].getBoundingClientRect() : { top: 0, left: 0 };

            return {
                top: box.top + (window.pageYOffset || document.scrollTop  || 0)  - (document.clientTop  || 0),
                left: box.left + (window.pageXOffset || document.scrollLeft  || 0) - (document.clientLeft || 0)
            };
        },

        position: function () {
            /* jQuery */
            function offsetParent() {
                var offsetParent = this.offsetParent || document;

                while (offsetParent && (!offsetParent.nodeType.toLowerCase === "html" && offsetParent.style.position === "static")) {
                    offsetParent = offsetParent.offsetParent;
                }

                return offsetParent || document;
            }

            /* Zepto */
            var elem = this[0],
                offsetParent = offsetParent.apply(elem),
                offset = this.offset(),
                parentOffset = /^(?:body|html)$/i.test(offsetParent.nodeName) ? { top: 0, left: 0 } : $(offsetParent).offset()

            offset.top -= parseFloat(elem.style.marginTop) || 0;
            offset.left -= parseFloat(elem.style.marginLeft) || 0;

            if (offsetParent.style) {
                parentOffset.top += parseFloat(offsetParent.style.borderTopWidth) || 0
                parentOffset.left += parseFloat(offsetParent.style.borderLeftWidth) || 0
            }

            return {
                top: offset.top - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        }
    };

    /**********************
       Private Variables
    **********************/

    /* For $.data() */
    var cache = {};
    $.expando = "velocity" + (new Date().getTime());
    $.uuid = 0;

    /* For $.queue() */
    var class2type = {},
        hasOwn = class2type.hasOwnProperty,
        toString = class2type.toString;

    var types = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
    for (var i = 0; i < types.length; i++) {
        class2type["[object " + types[i] + "]"] = types[i].toLowerCase();
    }

    /* Makes $(node) possible, without having to call init. */
    $.fn.init.prototype = $.fn;

    /* Globalize Velocity onto the window, and assign its Utilities property. */
    window.Velocity = { Utilities: $ };
})(window);

/******************
    Velocity.js
******************/

;(function (factory) {
    /* CommonJS module. */
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory();
    /* AMD module. */
    } else if (typeof define === "function" && define.amd) {
        define(factory);
    /* Browser globals. */
    } else {
        factory();
    }
}(function() {
return function (global, window, document, undefined) {

    /***************
        Summary
    ***************/

    /*
    - CSS: CSS stack that works independently from the rest of Velocity.
    - animate(): Core animation method that iterates over the targeted elements and queues the incoming call onto each element individually.
      - Pre-Queueing: Prepare the element for animation by instantiating its data cache and processing the call's options.
      - Queueing: The logic that runs once the call has reached its point of execution in the element's $.queue() stack.
                  Most logic is placed here to avoid risking it becoming stale (if the element's properties have changed).
      - Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
    - tick(): The single requestAnimationFrame loop responsible for tweening all in-progress calls.
    - completeCall(): Handles the cleanup process for each Velocity call.
    */

    /*********************
       Helper Functions
    *********************/

    /* IE detection. Gist: https://gist.github.com/julianshapiro/9098609 */
    var IE = (function() {
        if (document.documentMode) {
            return document.documentMode;
        } else {
            for (var i = 7; i > 4; i--) {
                var div = document.createElement("div");

                div.innerHTML = "<!--[if IE " + i + "]><span></span><![endif]-->";

                if (div.getElementsByTagName("span").length) {
                    div = null;

                    return i;
                }
            }
        }

        return undefined;
    })();

    /* rAF shim. Gist: https://gist.github.com/julianshapiro/9497513 */
    var rAFShim = (function() {
        var timeLast = 0;

        return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
            var timeCurrent = (new Date()).getTime(),
                timeDelta;

            /* Dynamically set delay on a per-tick basis to match 60fps. */
            /* Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671 */
            timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
            timeLast = timeCurrent + timeDelta;

            return setTimeout(function() { callback(timeCurrent + timeDelta); }, timeDelta);
        };
    })();

    /* Array compacting. Copyright Lo-Dash. MIT License: https://github.com/lodash/lodash/blob/master/LICENSE.txt */
    function compactSparseArray (array) {
        var index = -1,
            length = array ? array.length : 0,
            result = [];

        while (++index < length) {
            var value = array[index];

            if (value) {
                result.push(value);
            }
        }

        return result;
    }

    function sanitizeElements (elements) {
        /* Unwrap jQuery/Zepto objects. */
        if (Type.isWrapped(elements)) {
            elements = [].slice.call(elements);
        /* Wrap a single element in an array so that $.each() can iterate with the element instead of its node's children. */
        } else if (Type.isNode(elements)) {
            elements = [ elements ];
        }

        return elements;
    }

    var Type = {
        isString: function (variable) {
            return (typeof variable === "string");
        },
        isArray: Array.isArray || function (variable) {
            return Object.prototype.toString.call(variable) === "[object Array]";
        },
        isFunction: function (variable) {
            return Object.prototype.toString.call(variable) === "[object Function]";
        },
        isNode: function (variable) {
            return variable && variable.nodeType;
        },
        /* Copyright Martin Bohm. MIT License: https://gist.github.com/Tomalak/818a78a226a0738eaade */
        isNodeList: function (variable) {
            return typeof variable === "object" &&
                /^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(variable)) &&
                variable.length !== undefined &&
                (variable.length === 0 || (typeof variable[0] === "object" && variable[0].nodeType > 0));
        },
        /* Determine if variable is a wrapped jQuery or Zepto element. */
        isWrapped: function (variable) {
            return variable && (variable.jquery || (window.Zepto && window.Zepto.zepto.isZ(variable)));
        },
        isSVG: function (variable) {
            return window.SVGElement && (variable instanceof window.SVGElement);
        },
        isEmptyObject: function (variable) {
            for (var name in variable) {
                return false;
            }

            return true;
        }
    };

    /*****************
       Dependencies
    *****************/

    var $,
        isJQuery = false;

    if (global.fn && global.fn.jquery) {
        $ = global;
        isJQuery = true;
    } else {
        $ = window.Velocity.Utilities;
    }

    if (IE <= 8 && !isJQuery) {
        throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");
    } else if (IE <= 7) {
        /* Revert to jQuery's $.animate(), and lose Velocity's extra features. */
        jQuery.fn.velocity = jQuery.fn.animate;

        /* Now that $.fn.velocity is aliased, abort this Velocity declaration. */
        return;
    }

    /*****************
        Constants
    *****************/

    var DURATION_DEFAULT = 400,
        EASING_DEFAULT = "swing";

    /*************
        State
    *************/

    var Velocity = {
        /* Container for page-wide Velocity state data. */
        State: {
            /* Detect mobile devices to determine if mobileHA should be turned on. */
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            /* The mobileHA option's behavior changes on older Android devices (Gingerbread, versions 2.3.3-2.3.7). */
            isAndroid: /Android/i.test(navigator.userAgent),
            isGingerbread: /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
            isChrome: window.chrome,
            isFirefox: /Firefox/i.test(navigator.userAgent),
            /* Create a cached element for re-use when checking for CSS property prefixes. */
            prefixElement: document.createElement("div"),
            /* Cache every prefix match to avoid repeating lookups. */
            prefixMatches: {},
            /* Cache the anchor used for animating window scrolling. */
            scrollAnchor: null,
            /* Cache the browser-specific property names associated with the scroll anchor. */
            scrollPropertyLeft: null,
            scrollPropertyTop: null,
            /* Keep track of whether our RAF tick is running. */
            isTicking: false,
            /* Container for every in-progress call to Velocity. */
            calls: []
        },
        /* Velocity's custom CSS stack. Made global for unit testing. */
        CSS: { /* Defined below. */ },
        /* A shim of the jQuery utility functions used by Velocity -- provided by Velocity's optional jQuery shim. */
        Utilities: $,
        /* Container for the user's custom animation redirects that are referenced by name in place of the properties map argument. */
        Redirects: { /* Manually registered by the user. */ },
        Easings: { /* Defined below. */ },
        /* Attempt to use ES6 Promises by default. Users can override this with a third-party promises library. */
        Promise: window.Promise,
        /* Velocity option defaults, which can be overriden by the user. */
        defaults: {
            queue: "",
            duration: DURATION_DEFAULT,
            easing: EASING_DEFAULT,
            begin: undefined,
            complete: undefined,
            progress: undefined,
            display: undefined,
            visibility: undefined,
            loop: false,
            delay: false,
            mobileHA: true,
            /* Advanced: Set to false to prevent property values from being cached between consecutive Velocity-initiated chain calls. */
            _cacheValues: true
        },
        /* A design goal of Velocity is to cache data wherever possible in order to avoid DOM requerying. Accordingly, each element has a data cache. */
        init: function (element) {
            $.data(element, "velocity", {
                /* Store whether this is an SVG element, since its properties are retrieved and updated differently than standard HTML elements. */
                isSVG: Type.isSVG(element),
                /* Keep track of whether the element is currently being animated by Velocity.
                   This is used to ensure that property values are not transferred between non-consecutive (stale) calls. */
                isAnimating: false,
                /* A reference to the element's live computedStyle object. Learn more here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
                computedStyle: null,
                /* Tween data is cached for each animation on the element so that data can be passed across calls --
                   in particular, end values are used as subsequent start values in consecutive Velocity calls. */
                tweensContainer: null,
                /* The full root property values of each CSS hook being animated on this element are cached so that:
                   1) Concurrently-animating hooks sharing the same root can have their root values' merged into one while tweening.
                   2) Post-hook-injection root values can be transferred over to consecutively chained Velocity calls as starting root values. */
                rootPropertyValueCache: {},
                /* A cache for transform updates, which must be manually flushed via CSS.flushTransformCache(). */
                transformCache: {}
            });
        },
        /* A parallel to jQuery's $.css(), used for getting/setting Velocity's hooked CSS properties. */
        hook: null, /* Defined below. */
        /* Velocity-wide animation time remapping for testing purposes. */
        mock: false,
        version: { major: 1, minor: 2, patch: 2 },
        /* Set to 1 or 2 (most verbose) to output debug info to console. */
        debug: false
    };

    /* Retrieve the appropriate scroll anchor and property name for the browser: https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY */
    if (window.pageYOffset !== undefined) {
        Velocity.State.scrollAnchor = window;
        Velocity.State.scrollPropertyLeft = "pageXOffset";
        Velocity.State.scrollPropertyTop = "pageYOffset";
    } else {
        Velocity.State.scrollAnchor = document.documentElement || document.body.parentNode || document.body;
        Velocity.State.scrollPropertyLeft = "scrollLeft";
        Velocity.State.scrollPropertyTop = "scrollTop";
    }

    /* Shorthand alias for jQuery's $.data() utility. */
    function Data (element) {
        /* Hardcode a reference to the plugin name. */
        var response = $.data(element, "velocity");

        /* jQuery <=1.4.2 returns null instead of undefined when no match is found. We normalize this behavior. */
        return response === null ? undefined : response;
    };

    /**************
        Easing
    **************/

    /* Step easing generator. */
    function generateStep (steps) {
        return function (p) {
            return Math.round(p * steps) * (1 / steps);
        };
    }

    /* Bezier curve function generator. Copyright Gaetan Renaudeau. MIT License: http://en.wikipedia.org/wiki/MIT_License */
    function generateBezier (mX1, mY1, mX2, mY2) {
        var NEWTON_ITERATIONS = 4,
            NEWTON_MIN_SLOPE = 0.001,
            SUBDIVISION_PRECISION = 0.0000001,
            SUBDIVISION_MAX_ITERATIONS = 10,
            kSplineTableSize = 11,
            kSampleStepSize = 1.0 / (kSplineTableSize - 1.0),
            float32ArraySupported = "Float32Array" in window;

        /* Must contain four arguments. */
        if (arguments.length !== 4) {
            return false;
        }

        /* Arguments must be numbers. */
        for (var i = 0; i < 4; ++i) {
            if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i])) {
                return false;
            }
        }

        /* X values must be in the [0, 1] range. */
        mX1 = Math.min(mX1, 1);
        mX2 = Math.min(mX2, 1);
        mX1 = Math.max(mX1, 0);
        mX2 = Math.max(mX2, 0);

        var mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

        function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
        function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
        function C (aA1)      { return 3.0 * aA1; }

        function calcBezier (aT, aA1, aA2) {
            return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
        }

        function getSlope (aT, aA1, aA2) {
            return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
        }

        function newtonRaphsonIterate (aX, aGuessT) {
            for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
                var currentSlope = getSlope(aGuessT, mX1, mX2);

                if (currentSlope === 0.0) return aGuessT;

                var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
                aGuessT -= currentX / currentSlope;
            }

            return aGuessT;
        }

        function calcSampleValues () {
            for (var i = 0; i < kSplineTableSize; ++i) {
                mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
            }
        }

        function binarySubdivide (aX, aA, aB) {
            var currentX, currentT, i = 0;

            do {
                currentT = aA + (aB - aA) / 2.0;
                currentX = calcBezier(currentT, mX1, mX2) - aX;
                if (currentX > 0.0) {
                  aB = currentT;
                } else {
                  aA = currentT;
                }
            } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

            return currentT;
        }

        function getTForX (aX) {
            var intervalStart = 0.0,
                currentSample = 1,
                lastSample = kSplineTableSize - 1;

            for (; currentSample != lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
                intervalStart += kSampleStepSize;
            }

            --currentSample;

            var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample+1] - mSampleValues[currentSample]),
                guessForT = intervalStart + dist * kSampleStepSize,
                initialSlope = getSlope(guessForT, mX1, mX2);

            if (initialSlope >= NEWTON_MIN_SLOPE) {
                return newtonRaphsonIterate(aX, guessForT);
            } else if (initialSlope == 0.0) {
                return guessForT;
            } else {
                return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize);
            }
        }

        var _precomputed = false;

        function precompute() {
            _precomputed = true;
            if (mX1 != mY1 || mX2 != mY2) calcSampleValues();
        }

        var f = function (aX) {
            if (!_precomputed) precompute();
            if (mX1 === mY1 && mX2 === mY2) return aX;
            if (aX === 0) return 0;
            if (aX === 1) return 1;

            return calcBezier(getTForX(aX), mY1, mY2);
        };

        f.getControlPoints = function() { return [{ x: mX1, y: mY1 }, { x: mX2, y: mY2 }]; };

        var str = "generateBezier(" + [mX1, mY1, mX2, mY2] + ")";
        f.toString = function () { return str; };

        return f;
    }

    /* Runge-Kutta spring physics function generator. Adapted from Framer.js, copyright Koen Bok. MIT License: http://en.wikipedia.org/wiki/MIT_License */
    /* Given a tension, friction, and duration, a simulation at 60FPS will first run without a defined duration in order to calculate the full path. A second pass
       then adjusts the time delta -- using the relation between actual time and duration -- to calculate the path for the duration-constrained animation. */
    var generateSpringRK4 = (function () {
        function springAccelerationForState (state) {
            return (-state.tension * state.x) - (state.friction * state.v);
        }

        function springEvaluateStateWithDerivative (initialState, dt, derivative) {
            var state = {
                x: initialState.x + derivative.dx * dt,
                v: initialState.v + derivative.dv * dt,
                tension: initialState.tension,
                friction: initialState.friction
            };

            return { dx: state.v, dv: springAccelerationForState(state) };
        }

        function springIntegrateState (state, dt) {
            var a = {
                    dx: state.v,
                    dv: springAccelerationForState(state)
                },
                b = springEvaluateStateWithDerivative(state, dt * 0.5, a),
                c = springEvaluateStateWithDerivative(state, dt * 0.5, b),
                d = springEvaluateStateWithDerivative(state, dt, c),
                dxdt = 1.0 / 6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx),
                dvdt = 1.0 / 6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv);

            state.x = state.x + dxdt * dt;
            state.v = state.v + dvdt * dt;

            return state;
        }

        return function springRK4Factory (tension, friction, duration) {

            var initState = {
                    x: -1,
                    v: 0,
                    tension: null,
                    friction: null
                },
                path = [0],
                time_lapsed = 0,
                tolerance = 1 / 10000,
                DT = 16 / 1000,
                have_duration, dt, last_state;

            tension = parseFloat(tension) || 500;
            friction = parseFloat(friction) || 20;
            duration = duration || null;

            initState.tension = tension;
            initState.friction = friction;

            have_duration = duration !== null;

            /* Calculate the actual time it takes for this animation to complete with the provided conditions. */
            if (have_duration) {
                /* Run the simulation without a duration. */
                time_lapsed = springRK4Factory(tension, friction);
                /* Compute the adjusted time delta. */
                dt = time_lapsed / duration * DT;
            } else {
                dt = DT;
            }

            while (true) {
                /* Next/step function .*/
                last_state = springIntegrateState(last_state || initState, dt);
                /* Store the position. */
                path.push(1 + last_state.x);
                time_lapsed += 16;
                /* If the change threshold is reached, break. */
                if (!(Math.abs(last_state.x) > tolerance && Math.abs(last_state.v) > tolerance)) {
                    break;
                }
            }

            /* If duration is not defined, return the actual time required for completing this animation. Otherwise, return a closure that holds the
               computed path and returns a snapshot of the position according to a given percentComplete. */
            return !have_duration ? time_lapsed : function(percentComplete) { return path[ (percentComplete * (path.length - 1)) | 0 ]; };
        };
    }());

    /* jQuery easings. */
    Velocity.Easings = {
        linear: function(p) { return p; },
        swing: function(p) { return 0.5 - Math.cos( p * Math.PI ) / 2 },
        /* Bonus "spring" easing, which is a less exaggerated version of easeInOutElastic. */
        spring: function(p) { return 1 - (Math.cos(p * 4.5 * Math.PI) * Math.exp(-p * 6)); }
    };

    /* CSS3 and Robert Penner easings. */
    $.each(
        [
            [ "ease", [ 0.25, 0.1, 0.25, 1.0 ] ],
            [ "ease-in", [ 0.42, 0.0, 1.00, 1.0 ] ],
            [ "ease-out", [ 0.00, 0.0, 0.58, 1.0 ] ],
            [ "ease-in-out", [ 0.42, 0.0, 0.58, 1.0 ] ],
            [ "easeInSine", [ 0.47, 0, 0.745, 0.715 ] ],
            [ "easeOutSine", [ 0.39, 0.575, 0.565, 1 ] ],
            [ "easeInOutSine", [ 0.445, 0.05, 0.55, 0.95 ] ],
            [ "easeInQuad", [ 0.55, 0.085, 0.68, 0.53 ] ],
            [ "easeOutQuad", [ 0.25, 0.46, 0.45, 0.94 ] ],
            [ "easeInOutQuad", [ 0.455, 0.03, 0.515, 0.955 ] ],
            [ "easeInCubic", [ 0.55, 0.055, 0.675, 0.19 ] ],
            [ "easeOutCubic", [ 0.215, 0.61, 0.355, 1 ] ],
            [ "easeInOutCubic", [ 0.645, 0.045, 0.355, 1 ] ],
            [ "easeInQuart", [ 0.895, 0.03, 0.685, 0.22 ] ],
            [ "easeOutQuart", [ 0.165, 0.84, 0.44, 1 ] ],
            [ "easeInOutQuart", [ 0.77, 0, 0.175, 1 ] ],
            [ "easeInQuint", [ 0.755, 0.05, 0.855, 0.06 ] ],
            [ "easeOutQuint", [ 0.23, 1, 0.32, 1 ] ],
            [ "easeInOutQuint", [ 0.86, 0, 0.07, 1 ] ],
            [ "easeInExpo", [ 0.95, 0.05, 0.795, 0.035 ] ],
            [ "easeOutExpo", [ 0.19, 1, 0.22, 1 ] ],
            [ "easeInOutExpo", [ 1, 0, 0, 1 ] ],
            [ "easeInCirc", [ 0.6, 0.04, 0.98, 0.335 ] ],
            [ "easeOutCirc", [ 0.075, 0.82, 0.165, 1 ] ],
            [ "easeInOutCirc", [ 0.785, 0.135, 0.15, 0.86 ] ]
        ], function(i, easingArray) {
            Velocity.Easings[easingArray[0]] = generateBezier.apply(null, easingArray[1]);
        });

    /* Determine the appropriate easing type given an easing input. */
    function getEasing(value, duration) {
        var easing = value;

        /* The easing option can either be a string that references a pre-registered easing,
           or it can be a two-/four-item array of integers to be converted into a bezier/spring function. */
        if (Type.isString(value)) {
            /* Ensure that the easing has been assigned to jQuery's Velocity.Easings object. */
            if (!Velocity.Easings[value]) {
                easing = false;
            }
        } else if (Type.isArray(value) && value.length === 1) {
            easing = generateStep.apply(null, value);
        } else if (Type.isArray(value) && value.length === 2) {
            /* springRK4 must be passed the animation's duration. */
            /* Note: If the springRK4 array contains non-numbers, generateSpringRK4() returns an easing
               function generated with default tension and friction values. */
            easing = generateSpringRK4.apply(null, value.concat([ duration ]));
        } else if (Type.isArray(value) && value.length === 4) {
            /* Note: If the bezier array contains non-numbers, generateBezier() returns false. */
            easing = generateBezier.apply(null, value);
        } else {
            easing = false;
        }

        /* Revert to the Velocity-wide default easing type, or fall back to "swing" (which is also jQuery's default)
           if the Velocity-wide default has been incorrectly modified. */
        if (easing === false) {
            if (Velocity.Easings[Velocity.defaults.easing]) {
                easing = Velocity.defaults.easing;
            } else {
                easing = EASING_DEFAULT;
            }
        }

        return easing;
    }

    /*****************
        CSS Stack
    *****************/

    /* The CSS object is a highly condensed and performant CSS stack that fully replaces jQuery's.
       It handles the validation, getting, and setting of both standard CSS properties and CSS property hooks. */
    /* Note: A "CSS" shorthand is aliased so that our code is easier to read. */
    var CSS = Velocity.CSS = {

        /*************
            RegEx
        *************/

        RegEx: {
            isHex: /^#([A-f\d]{3}){1,2}$/i,
            /* Unwrap a property value's surrounding text, e.g. "rgba(4, 3, 2, 1)" ==> "4, 3, 2, 1" and "rect(4px 3px 2px 1px)" ==> "4px 3px 2px 1px". */
            valueUnwrap: /^[A-z]+\((.*)\)$/i,
            wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
            /* Split a multi-value property into an array of subvalues, e.g. "rgba(4, 3, 2, 1) 4px 3px 2px 1px" ==> [ "rgba(4, 3, 2, 1)", "4px", "3px", "2px", "1px" ]. */
            valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/ig
        },

        /************
            Lists
        ************/

        Lists: {
            colors: [ "fill", "stroke", "stopColor", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor" ],
            transformsBase: [ "translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ" ],
            transforms3D: [ "transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY" ]
        },

        /************
            Hooks
        ************/

        /* Hooks allow a subproperty (e.g. "boxShadowBlur") of a compound-value CSS property
           (e.g. "boxShadow: X Y Blur Spread Color") to be animated as if it were a discrete property. */
        /* Note: Beyond enabling fine-grained property animation, hooking is necessary since Velocity only
           tweens properties with single numeric values; unlike CSS transitions, Velocity does not interpolate compound-values. */
        Hooks: {
            /********************
                Registration
            ********************/

            /* Templates are a concise way of indicating which subproperties must be individually registered for each compound-value CSS property. */
            /* Each template consists of the compound-value's base name, its constituent subproperty names, and those subproperties' default values. */
            templates: {
                "textShadow": [ "Color X Y Blur", "black 0px 0px 0px" ],
                "boxShadow": [ "Color X Y Blur Spread", "black 0px 0px 0px 0px" ],
                "clip": [ "Top Right Bottom Left", "0px 0px 0px 0px" ],
                "backgroundPosition": [ "X Y", "0% 0%" ],
                "transformOrigin": [ "X Y Z", "50% 50% 0px" ],
                "perspectiveOrigin": [ "X Y", "50% 50%" ]
            },

            /* A "registered" hook is one that has been converted from its template form into a live,
               tweenable property. It contains data to associate it with its root property. */
            registered: {
                /* Note: A registered hook looks like this ==> textShadowBlur: [ "textShadow", 3 ],
                   which consists of the subproperty's name, the associated root property's name,
                   and the subproperty's position in the root's value. */
            },
            /* Convert the templates into individual hooks then append them to the registered object above. */
            register: function () {
                /* Color hooks registration: Colors are defaulted to white -- as opposed to black -- since colors that are
                   currently set to "transparent" default to their respective template below when color-animated,
                   and white is typically a closer match to transparent than black is. An exception is made for text ("color"),
                   which is almost always set closer to black than white. */
                for (var i = 0; i < CSS.Lists.colors.length; i++) {
                    var rgbComponents = (CSS.Lists.colors[i] === "color") ? "0 0 0 1" : "255 255 255 1";
                    CSS.Hooks.templates[CSS.Lists.colors[i]] = [ "Red Green Blue Alpha", rgbComponents ];
                }

                var rootProperty,
                    hookTemplate,
                    hookNames;

                /* In IE, color values inside compound-value properties are positioned at the end the value instead of at the beginning.
                   Thus, we re-arrange the templates accordingly. */
                if (IE) {
                    for (rootProperty in CSS.Hooks.templates) {
                        hookTemplate = CSS.Hooks.templates[rootProperty];
                        hookNames = hookTemplate[0].split(" ");

                        var defaultValues = hookTemplate[1].match(CSS.RegEx.valueSplit);

                        if (hookNames[0] === "Color") {
                            /* Reposition both the hook's name and its default value to the end of their respective strings. */
                            hookNames.push(hookNames.shift());
                            defaultValues.push(defaultValues.shift());

                            /* Replace the existing template for the hook's root property. */
                            CSS.Hooks.templates[rootProperty] = [ hookNames.join(" "), defaultValues.join(" ") ];
                        }
                    }
                }

                /* Hook registration. */
                for (rootProperty in CSS.Hooks.templates) {
                    hookTemplate = CSS.Hooks.templates[rootProperty];
                    hookNames = hookTemplate[0].split(" ");

                    for (var i in hookNames) {
                        var fullHookName = rootProperty + hookNames[i],
                            hookPosition = i;

                        /* For each hook, register its full name (e.g. textShadowBlur) with its root property (e.g. textShadow)
                           and the hook's position in its template's default value string. */
                        CSS.Hooks.registered[fullHookName] = [ rootProperty, hookPosition ];
                    }
                }
            },

            /*****************************
               Injection and Extraction
            *****************************/

            /* Look up the root property associated with the hook (e.g. return "textShadow" for "textShadowBlur"). */
            /* Since a hook cannot be set directly (the browser won't recognize it), style updating for hooks is routed through the hook's root property. */
            getRoot: function (property) {
                var hookData = CSS.Hooks.registered[property];

                if (hookData) {
                    return hookData[0];
                } else {
                    /* If there was no hook match, return the property name untouched. */
                    return property;
                }
            },
            /* Convert any rootPropertyValue, null or otherwise, into a space-delimited list of hook values so that
               the targeted hook can be injected or extracted at its standard position. */
            cleanRootPropertyValue: function(rootProperty, rootPropertyValue) {
                /* If the rootPropertyValue is wrapped with "rgb()", "clip()", etc., remove the wrapping to normalize the value before manipulation. */
                if (CSS.RegEx.valueUnwrap.test(rootPropertyValue)) {
                    rootPropertyValue = rootPropertyValue.match(CSS.RegEx.valueUnwrap)[1];
                }

                /* If rootPropertyValue is a CSS null-value (from which there's inherently no hook value to extract),
                   default to the root's default value as defined in CSS.Hooks.templates. */
                /* Note: CSS null-values include "none", "auto", and "transparent". They must be converted into their
                   zero-values (e.g. textShadow: "none" ==> textShadow: "0px 0px 0px black") for hook manipulation to proceed. */
                if (CSS.Values.isCSSNullValue(rootPropertyValue)) {
                    rootPropertyValue = CSS.Hooks.templates[rootProperty][1];
                }

                return rootPropertyValue;
            },
            /* Extracted the hook's value from its root property's value. This is used to get the starting value of an animating hook. */
            extractValue: function (fullHookName, rootPropertyValue) {
                var hookData = CSS.Hooks.registered[fullHookName];

                if (hookData) {
                    var hookRoot = hookData[0],
                        hookPosition = hookData[1];

                    rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

                    /* Split rootPropertyValue into its constituent hook values then grab the desired hook at its standard position. */
                    return rootPropertyValue.toString().match(CSS.RegEx.valueSplit)[hookPosition];
                } else {
                    /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
                    return rootPropertyValue;
                }
            },
            /* Inject the hook's value into its root property's value. This is used to piece back together the root property
               once Velocity has updated one of its individually hooked values through tweening. */
            injectValue: function (fullHookName, hookValue, rootPropertyValue) {
                var hookData = CSS.Hooks.registered[fullHookName];

                if (hookData) {
                    var hookRoot = hookData[0],
                        hookPosition = hookData[1],
                        rootPropertyValueParts,
                        rootPropertyValueUpdated;

                    rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

                    /* Split rootPropertyValue into its individual hook values, replace the targeted value with hookValue,
                       then reconstruct the rootPropertyValue string. */
                    rootPropertyValueParts = rootPropertyValue.toString().match(CSS.RegEx.valueSplit);
                    rootPropertyValueParts[hookPosition] = hookValue;
                    rootPropertyValueUpdated = rootPropertyValueParts.join(" ");

                    return rootPropertyValueUpdated;
                } else {
                    /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
                    return rootPropertyValue;
                }
            }
        },

        /*******************
           Normalizations
        *******************/

        /* Normalizations standardize CSS property manipulation by pollyfilling browser-specific implementations (e.g. opacity)
           and reformatting special properties (e.g. clip, rgba) to look like standard ones. */
        Normalizations: {
            /* Normalizations are passed a normalization target (either the property's name, its extracted value, or its injected value),
               the targeted element (which may need to be queried), and the targeted property value. */
            registered: {
                clip: function (type, element, propertyValue) {
                    switch (type) {
                        case "name":
                            return "clip";
                        /* Clip needs to be unwrapped and stripped of its commas during extraction. */
                        case "extract":
                            var extracted;

                            /* If Velocity also extracted this value, skip extraction. */
                            if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                                extracted = propertyValue;
                            } else {
                                /* Remove the "rect()" wrapper. */
                                extracted = propertyValue.toString().match(CSS.RegEx.valueUnwrap);

                                /* Strip off commas. */
                                extracted = extracted ? extracted[1].replace(/,(\s+)?/g, " ") : propertyValue;
                            }

                            return extracted;
                        /* Clip needs to be re-wrapped during injection. */
                        case "inject":
                            return "rect(" + propertyValue + ")";
                    }
                },

                blur: function(type, element, propertyValue) {
                    switch (type) {
                        case "name":
                            return Velocity.State.isFirefox ? "filter" : "-webkit-filter";
                        case "extract":
                            var extracted = parseFloat(propertyValue);

                            /* If extracted is NaN, meaning the value isn't already extracted. */
                            if (!(extracted || extracted === 0)) {
                                var blurComponent = propertyValue.toString().match(/blur\(([0-9]+[A-z]+)\)/i);

                                /* If the filter string had a blur component, return just the blur value and unit type. */
                                if (blurComponent) {
                                    extracted = blurComponent[1];
                                /* If the component doesn't exist, default blur to 0. */
                                } else {
                                    extracted = 0;
                                }
                            }

                            return extracted;
                        /* Blur needs to be re-wrapped during injection. */
                        case "inject":
                            /* For the blur effect to be fully de-applied, it needs to be set to "none" instead of 0. */
                            if (!parseFloat(propertyValue)) {
                                return "none";
                            } else {
                                return "blur(" + propertyValue + ")";
                            }
                    }
                },

                /* <=IE8 do not support the standard opacity property. They use filter:alpha(opacity=INT) instead. */
                opacity: function (type, element, propertyValue) {
                    if (IE <= 8) {
                        switch (type) {
                            case "name":
                                return "filter";
                            case "extract":
                                /* <=IE8 return a "filter" value of "alpha(opacity=\d{1,3})".
                                   Extract the value and convert it to a decimal value to match the standard CSS opacity property's formatting. */
                                var extracted = propertyValue.toString().match(/alpha\(opacity=(.*)\)/i);

                                if (extracted) {
                                    /* Convert to decimal value. */
                                    propertyValue = extracted[1] / 100;
                                } else {
                                    /* When extracting opacity, default to 1 since a null value means opacity hasn't been set. */
                                    propertyValue = 1;
                                }

                                return propertyValue;
                            case "inject":
                                /* Opacified elements are required to have their zoom property set to a non-zero value. */
                                element.style.zoom = 1;

                                /* Setting the filter property on elements with certain font property combinations can result in a
                                   highly unappealing ultra-bolding effect. There's no way to remedy this throughout a tween, but dropping the
                                   value altogether (when opacity hits 1) at leasts ensures that the glitch is gone post-tweening. */
                                if (parseFloat(propertyValue) >= 1) {
                                    return "";
                                } else {
                                  /* As per the filter property's spec, convert the decimal value to a whole number and wrap the value. */
                                  return "alpha(opacity=" + parseInt(parseFloat(propertyValue) * 100, 10) + ")";
                                }
                        }
                    /* With all other browsers, normalization is not required; return the same values that were passed in. */
                    } else {
                        switch (type) {
                            case "name":
                                return "opacity";
                            case "extract":
                                return propertyValue;
                            case "inject":
                                return propertyValue;
                        }
                    }
                }
            },

            /*****************************
                Batched Registrations
            *****************************/

            /* Note: Batched normalizations extend the CSS.Normalizations.registered object. */
            register: function () {

                /*****************
                    Transforms
                *****************/

                /* Transforms are the subproperties contained by the CSS "transform" property. Transforms must undergo normalization
                   so that they can be referenced in a properties map by their individual names. */
                /* Note: When transforms are "set", they are actually assigned to a per-element transformCache. When all transform
                   setting is complete complete, CSS.flushTransformCache() must be manually called to flush the values to the DOM.
                   Transform setting is batched in this way to improve performance: the transform style only needs to be updated
                   once when multiple transform subproperties are being animated simultaneously. */
                /* Note: IE9 and Android Gingerbread have support for 2D -- but not 3D -- transforms. Since animating unsupported
                   transform properties results in the browser ignoring the *entire* transform string, we prevent these 3D values
                   from being normalized for these browsers so that tweening skips these properties altogether
                   (since it will ignore them as being unsupported by the browser.) */
                if (!(IE <= 9) && !Velocity.State.isGingerbread) {
                    /* Note: Since the standalone CSS "perspective" property and the CSS transform "perspective" subproperty
                    share the same name, the latter is given a unique token within Velocity: "transformPerspective". */
                    CSS.Lists.transformsBase = CSS.Lists.transformsBase.concat(CSS.Lists.transforms3D);
                }

                for (var i = 0; i < CSS.Lists.transformsBase.length; i++) {
                    /* Wrap the dynamically generated normalization function in a new scope so that transformName's value is
                    paired with its respective function. (Otherwise, all functions would take the final for loop's transformName.) */
                    (function() {
                        var transformName = CSS.Lists.transformsBase[i];

                        CSS.Normalizations.registered[transformName] = function (type, element, propertyValue) {
                            switch (type) {
                                /* The normalized property name is the parent "transform" property -- the property that is actually set in CSS. */
                                case "name":
                                    return "transform";
                                /* Transform values are cached onto a per-element transformCache object. */
                                case "extract":
                                    /* If this transform has yet to be assigned a value, return its null value. */
                                    if (Data(element) === undefined || Data(element).transformCache[transformName] === undefined) {
                                        /* Scale CSS.Lists.transformsBase default to 1 whereas all other transform properties default to 0. */
                                        return /^scale/i.test(transformName) ? 1 : 0;
                                    /* When transform values are set, they are wrapped in parentheses as per the CSS spec.
                                       Thus, when extracting their values (for tween calculations), we strip off the parentheses. */
                                    } else {
                                        return Data(element).transformCache[transformName].replace(/[()]/g, "");
                                    }
                                case "inject":
                                    var invalid = false;

                                    /* If an individual transform property contains an unsupported unit type, the browser ignores the *entire* transform property.
                                       Thus, protect users from themselves by skipping setting for transform values supplied with invalid unit types. */
                                    /* Switch on the base transform type; ignore the axis by removing the last letter from the transform's name. */
                                    switch (transformName.substr(0, transformName.length - 1)) {
                                        /* Whitelist unit types for each transform. */
                                        case "translate":
                                            invalid = !/(%|px|em|rem|vw|vh|\d)$/i.test(propertyValue);
                                            break;
                                        /* Since an axis-free "scale" property is supported as well, a little hack is used here to detect it by chopping off its last letter. */
                                        case "scal":
                                        case "scale":
                                            /* Chrome on Android has a bug in which scaled elements blur if their initial scale
                                               value is below 1 (which can happen with forcefeeding). Thus, we detect a yet-unset scale property
                                               and ensure that its first value is always 1. More info: http://stackoverflow.com/questions/10417890/css3-animations-with-transform-causes-blurred-elements-on-webkit/10417962#10417962 */
                                            if (Velocity.State.isAndroid && Data(element).transformCache[transformName] === undefined && propertyValue < 1) {
                                                propertyValue = 1;
                                            }

                                            invalid = !/(\d)$/i.test(propertyValue);
                                            break;
                                        case "skew":
                                            invalid = !/(deg|\d)$/i.test(propertyValue);
                                            break;
                                        case "rotate":
                                            invalid = !/(deg|\d)$/i.test(propertyValue);
                                            break;
                                    }

                                    if (!invalid) {
                                        /* As per the CSS spec, wrap the value in parentheses. */
                                        Data(element).transformCache[transformName] = "(" + propertyValue + ")";
                                    }

                                    /* Although the value is set on the transformCache object, return the newly-updated value for the calling code to process as normal. */
                                    return Data(element).transformCache[transformName];
                            }
                        };
                    })();
                }

                /*************
                    Colors
                *************/

                /* Since Velocity only animates a single numeric value per property, color animation is achieved by hooking the individual RGBA components of CSS color properties.
                   Accordingly, color values must be normalized (e.g. "#ff0000", "red", and "rgb(255, 0, 0)" ==> "255 0 0 1") so that their components can be injected/extracted by CSS.Hooks logic. */
                for (var i = 0; i < CSS.Lists.colors.length; i++) {
                    /* Wrap the dynamically generated normalization function in a new scope so that colorName's value is paired with its respective function.
                       (Otherwise, all functions would take the final for loop's colorName.) */
                    (function () {
                        var colorName = CSS.Lists.colors[i];

                        /* Note: In IE<=8, which support rgb but not rgba, color properties are reverted to rgb by stripping off the alpha component. */
                        CSS.Normalizations.registered[colorName] = function(type, element, propertyValue) {
                            switch (type) {
                                case "name":
                                    return colorName;
                                /* Convert all color values into the rgb format. (Old IE can return hex values and color names instead of rgb/rgba.) */
                                case "extract":
                                    var extracted;

                                    /* If the color is already in its hookable form (e.g. "255 255 255 1") due to having been previously extracted, skip extraction. */
                                    if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                                        extracted = propertyValue;
                                    } else {
                                        var converted,
                                            colorNames = {
                                                black: "rgb(0, 0, 0)",
                                                blue: "rgb(0, 0, 255)",
                                                gray: "rgb(128, 128, 128)",
                                                green: "rgb(0, 128, 0)",
                                                red: "rgb(255, 0, 0)",
                                                white: "rgb(255, 255, 255)"
                                            };

                                        /* Convert color names to rgb. */
                                        if (/^[A-z]+$/i.test(propertyValue)) {
                                            if (colorNames[propertyValue] !== undefined) {
                                                converted = colorNames[propertyValue]
                                            } else {
                                                /* If an unmatched color name is provided, default to black. */
                                                converted = colorNames.black;
                                            }
                                        /* Convert hex values to rgb. */
                                        } else if (CSS.RegEx.isHex.test(propertyValue)) {
                                            converted = "rgb(" + CSS.Values.hexToRgb(propertyValue).join(" ") + ")";
                                        /* If the provided color doesn't match any of the accepted color formats, default to black. */
                                        } else if (!(/^rgba?\(/i.test(propertyValue))) {
                                            converted = colorNames.black;
                                        }

                                        /* Remove the surrounding "rgb/rgba()" string then replace commas with spaces and strip
                                           repeated spaces (in case the value included spaces to begin with). */
                                        extracted = (converted || propertyValue).toString().match(CSS.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, " ");
                                    }

                                    /* So long as this isn't <=IE8, add a fourth (alpha) component if it's missing and default it to 1 (visible). */
                                    if (!(IE <= 8) && extracted.split(" ").length === 3) {
                                        extracted += " 1";
                                    }

                                    return extracted;
                                case "inject":
                                    /* If this is IE<=8 and an alpha component exists, strip it off. */
                                    if (IE <= 8) {
                                        if (propertyValue.split(" ").length === 4) {
                                            propertyValue = propertyValue.split(/\s+/).slice(0, 3).join(" ");
                                        }
                                    /* Otherwise, add a fourth (alpha) component if it's missing and default it to 1 (visible). */
                                    } else if (propertyValue.split(" ").length === 3) {
                                        propertyValue += " 1";
                                    }

                                    /* Re-insert the browser-appropriate wrapper("rgb/rgba()"), insert commas, and strip off decimal units
                                       on all values but the fourth (R, G, and B only accept whole numbers). */
                                    return (IE <= 8 ? "rgb" : "rgba") + "(" + propertyValue.replace(/\s+/g, ",").replace(/\.(\d)+(?=,)/g, "") + ")";
                            }
                        };
                    })();
                }
            }
        },

        /************************
           CSS Property Names
        ************************/

        Names: {
            /* Camelcase a property name into its JavaScript notation (e.g. "background-color" ==> "backgroundColor").
               Camelcasing is used to normalize property names between and across calls. */
            camelCase: function (property) {
                return property.replace(/-(\w)/g, function (match, subMatch) {
                    return subMatch.toUpperCase();
                });
            },

            /* For SVG elements, some properties (namely, dimensional ones) are GET/SET via the element's HTML attributes (instead of via CSS styles). */
            SVGAttribute: function (property) {
                var SVGAttributes = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";

                /* Certain browsers require an SVG transform to be applied as an attribute. (Otherwise, application via CSS is preferable due to 3D support.) */
                if (IE || (Velocity.State.isAndroid && !Velocity.State.isChrome)) {
                    SVGAttributes += "|transform";
                }

                return new RegExp("^(" + SVGAttributes + ")$", "i").test(property);
            },

            /* Determine whether a property should be set with a vendor prefix. */
            /* If a prefixed version of the property exists, return it. Otherwise, return the original property name.
               If the property is not at all supported by the browser, return a false flag. */
            prefixCheck: function (property) {
                /* If this property has already been checked, return the cached value. */
                if (Velocity.State.prefixMatches[property]) {
                    return [ Velocity.State.prefixMatches[property], true ];
                } else {
                    var vendors = [ "", "Webkit", "Moz", "ms", "O" ];

                    for (var i = 0, vendorsLength = vendors.length; i < vendorsLength; i++) {
                        var propertyPrefixed;

                        if (i === 0) {
                            propertyPrefixed = property;
                        } else {
                            /* Capitalize the first letter of the property to conform to JavaScript vendor prefix notation (e.g. webkitFilter). */
                            propertyPrefixed = vendors[i] + property.replace(/^\w/, function(match) { return match.toUpperCase(); });
                        }

                        /* Check if the browser supports this property as prefixed. */
                        if (Type.isString(Velocity.State.prefixElement.style[propertyPrefixed])) {
                            /* Cache the match. */
                            Velocity.State.prefixMatches[property] = propertyPrefixed;

                            return [ propertyPrefixed, true ];
                        }
                    }

                    /* If the browser doesn't support this property in any form, include a false flag so that the caller can decide how to proceed. */
                    return [ property, false ];
                }
            }
        },

        /************************
           CSS Property Values
        ************************/

        Values: {
            /* Hex to RGB conversion. Copyright Tim Down: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb */
            hexToRgb: function (hex) {
                var shortformRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
                    longformRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
                    rgbParts;

                hex = hex.replace(shortformRegex, function (m, r, g, b) {
                    return r + r + g + g + b + b;
                });

                rgbParts = longformRegex.exec(hex);

                return rgbParts ? [ parseInt(rgbParts[1], 16), parseInt(rgbParts[2], 16), parseInt(rgbParts[3], 16) ] : [ 0, 0, 0 ];
            },

            isCSSNullValue: function (value) {
                /* The browser defaults CSS values that have not been set to either 0 or one of several possible null-value strings.
                   Thus, we check for both falsiness and these special strings. */
                /* Null-value checking is performed to default the special strings to 0 (for the sake of tweening) or their hook
                   templates as defined as CSS.Hooks (for the sake of hook injection/extraction). */
                /* Note: Chrome returns "rgba(0, 0, 0, 0)" for an undefined color whereas IE returns "transparent". */
                return (value == 0 || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(value));
            },

            /* Retrieve a property's default unit type. Used for assigning a unit type when one is not supplied by the user. */
            getUnitType: function (property) {
                if (/^(rotate|skew)/i.test(property)) {
                    return "deg";
                } else if (/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(property)) {
                    /* The above properties are unitless. */
                    return "";
                } else {
                    /* Default to px for all other properties. */
                    return "px";
                }
            },

            /* HTML elements default to an associated display type when they're not set to display:none. */
            /* Note: This function is used for correctly setting the non-"none" display value in certain Velocity redirects, such as fadeIn/Out. */
            getDisplayType: function (element) {
                var tagName = element && element.tagName.toString().toLowerCase();

                if (/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(tagName)) {
                    return "inline";
                } else if (/^(li)$/i.test(tagName)) {
                    return "list-item";
                } else if (/^(tr)$/i.test(tagName)) {
                    return "table-row";
                } else if (/^(table)$/i.test(tagName)) {
                    return "table";
                } else if (/^(tbody)$/i.test(tagName)) {
                    return "table-row-group";
                /* Default to "block" when no match is found. */
                } else {
                    return "block";
                }
            },

            /* The class add/remove functions are used to temporarily apply a "velocity-animating" class to elements while they're animating. */
            addClass: function (element, className) {
                if (element.classList) {
                    element.classList.add(className);
                } else {
                    element.className += (element.className.length ? " " : "") + className;
                }
            },

            removeClass: function (element, className) {
                if (element.classList) {
                    element.classList.remove(className);
                } else {
                    element.className = element.className.toString().replace(new RegExp("(^|\\s)" + className.split(" ").join("|") + "(\\s|$)", "gi"), " ");
                }
            }
        },

        /****************************
           Style Getting & Setting
        ****************************/

        /* The singular getPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
        getPropertyValue: function (element, property, rootPropertyValue, forceStyleLookup) {
            /* Get an element's computed property value. */
            /* Note: Retrieving the value of a CSS property cannot simply be performed by checking an element's
               style attribute (which only reflects user-defined values). Instead, the browser must be queried for a property's
               *computed* value. You can read more about getComputedStyle here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
            function computePropertyValue (element, property) {
                /* When box-sizing isn't set to border-box, height and width style values are incorrectly computed when an
                   element's scrollbars are visible (which expands the element's dimensions). Thus, we defer to the more accurate
                   offsetHeight/Width property, which includes the total dimensions for interior, border, padding, and scrollbar.
                   We subtract border and padding to get the sum of interior + scrollbar. */
                var computedValue = 0;

                /* IE<=8 doesn't support window.getComputedStyle, thus we defer to jQuery, which has an extensive array
                   of hacks to accurately retrieve IE8 property values. Re-implementing that logic here is not worth bloating the
                   codebase for a dying browser. The performance repercussions of using jQuery here are minimal since
                   Velocity is optimized to rarely (and sometimes never) query the DOM. Further, the $.css() codepath isn't that slow. */
                if (IE <= 8) {
                    computedValue = $.css(element, property); /* GET */
                /* All other browsers support getComputedStyle. The returned live object reference is cached onto its
                   associated element so that it does not need to be refetched upon every GET. */
                } else {
                    /* Browsers do not return height and width values for elements that are set to display:"none". Thus, we temporarily
                       toggle display to the element type's default value. */
                    var toggleDisplay = false;

                    if (/^(width|height)$/.test(property) && CSS.getPropertyValue(element, "display") === 0) {
                        toggleDisplay = true;
                        CSS.setPropertyValue(element, "display", CSS.Values.getDisplayType(element));
                    }

                    function revertDisplay () {
                        if (toggleDisplay) {
                            CSS.setPropertyValue(element, "display", "none");
                        }
                    }

                    if (!forceStyleLookup) {
                        if (property === "height" && CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
                            var contentBoxHeight = element.offsetHeight - (parseFloat(CSS.getPropertyValue(element, "borderTopWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "borderBottomWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingTop")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingBottom")) || 0);
                            revertDisplay();

                            return contentBoxHeight;
                        } else if (property === "width" && CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
                            var contentBoxWidth = element.offsetWidth - (parseFloat(CSS.getPropertyValue(element, "borderLeftWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "borderRightWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingLeft")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingRight")) || 0);
                            revertDisplay();

                            return contentBoxWidth;
                        }
                    }

                    var computedStyle;

                    /* For elements that Velocity hasn't been called on directly (e.g. when Velocity queries the DOM on behalf
                       of a parent of an element its animating), perform a direct getComputedStyle lookup since the object isn't cached. */
                    if (Data(element) === undefined) {
                        computedStyle = window.getComputedStyle(element, null); /* GET */
                    /* If the computedStyle object has yet to be cached, do so now. */
                    } else if (!Data(element).computedStyle) {
                        computedStyle = Data(element).computedStyle = window.getComputedStyle(element, null); /* GET */
                    /* If computedStyle is cached, use it. */
                    } else {
                        computedStyle = Data(element).computedStyle;
                    }

                    /* IE and Firefox do not return a value for the generic borderColor -- they only return individual values for each border side's color.
                       Also, in all browsers, when border colors aren't all the same, a compound value is returned that Velocity isn't setup to parse.
                       So, as a polyfill for querying individual border side colors, we just return the top border's color and animate all borders from that value. */
                    if (property === "borderColor") {
                        property = "borderTopColor";
                    }

                    /* IE9 has a bug in which the "filter" property must be accessed from computedStyle using the getPropertyValue method
                       instead of a direct property lookup. The getPropertyValue method is slower than a direct lookup, which is why we avoid it by default. */
                    if (IE === 9 && property === "filter") {
                        computedValue = computedStyle.getPropertyValue(property); /* GET */
                    } else {
                        computedValue = computedStyle[property];
                    }

                    /* Fall back to the property's style value (if defined) when computedValue returns nothing,
                       which can happen when the element hasn't been painted. */
                    if (computedValue === "" || computedValue === null) {
                        computedValue = element.style[property];
                    }

                    revertDisplay();
                }

                /* For top, right, bottom, and left (TRBL) values that are set to "auto" on elements of "fixed" or "absolute" position,
                   defer to jQuery for converting "auto" to a numeric value. (For elements with a "static" or "relative" position, "auto" has the same
                   effect as being set to 0, so no conversion is necessary.) */
                /* An example of why numeric conversion is necessary: When an element with "position:absolute" has an untouched "left"
                   property, which reverts to "auto", left's value is 0 relative to its parent element, but is often non-zero relative
                   to its *containing* (not parent) element, which is the nearest "position:relative" ancestor or the viewport (and always the viewport in the case of "position:fixed"). */
                if (computedValue === "auto" && /^(top|right|bottom|left)$/i.test(property)) {
                    var position = computePropertyValue(element, "position"); /* GET */

                    /* For absolute positioning, jQuery's $.position() only returns values for top and left;
                       right and bottom will have their "auto" value reverted to 0. */
                    /* Note: A jQuery object must be created here since jQuery doesn't have a low-level alias for $.position().
                       Not a big deal since we're currently in a GET batch anyway. */
                    if (position === "fixed" || (position === "absolute" && /top|left/i.test(property))) {
                        /* Note: jQuery strips the pixel unit from its returned values; we re-add it here to conform with computePropertyValue's behavior. */
                        computedValue = $(element).position()[property] + "px"; /* GET */
                    }
                }

                return computedValue;
            }

            var propertyValue;

            /* If this is a hooked property (e.g. "clipLeft" instead of the root property of "clip"),
               extract the hook's value from a normalized rootPropertyValue using CSS.Hooks.extractValue(). */
            if (CSS.Hooks.registered[property]) {
                var hook = property,
                    hookRoot = CSS.Hooks.getRoot(hook);

                /* If a cached rootPropertyValue wasn't passed in (which Velocity always attempts to do in order to avoid requerying the DOM),
                   query the DOM for the root property's value. */
                if (rootPropertyValue === undefined) {
                    /* Since the browser is now being directly queried, use the official post-prefixing property name for this lookup. */
                    rootPropertyValue = CSS.getPropertyValue(element, CSS.Names.prefixCheck(hookRoot)[0]); /* GET */
                }

                /* If this root has a normalization registered, peform the associated normalization extraction. */
                if (CSS.Normalizations.registered[hookRoot]) {
                    rootPropertyValue = CSS.Normalizations.registered[hookRoot]("extract", element, rootPropertyValue);
                }

                /* Extract the hook's value. */
                propertyValue = CSS.Hooks.extractValue(hook, rootPropertyValue);

            /* If this is a normalized property (e.g. "opacity" becomes "filter" in <=IE8) or "translateX" becomes "transform"),
               normalize the property's name and value, and handle the special case of transforms. */
            /* Note: Normalizing a property is mutually exclusive from hooking a property since hook-extracted values are strictly
               numerical and therefore do not require normalization extraction. */
            } else if (CSS.Normalizations.registered[property]) {
                var normalizedPropertyName,
                    normalizedPropertyValue;

                normalizedPropertyName = CSS.Normalizations.registered[property]("name", element);

                /* Transform values are calculated via normalization extraction (see below), which checks against the element's transformCache.
                   At no point do transform GETs ever actually query the DOM; initial stylesheet values are never processed.
                   This is because parsing 3D transform matrices is not always accurate and would bloat our codebase;
                   thus, normalization extraction defaults initial transform values to their zero-values (e.g. 1 for scaleX and 0 for translateX). */
                if (normalizedPropertyName !== "transform") {
                    normalizedPropertyValue = computePropertyValue(element, CSS.Names.prefixCheck(normalizedPropertyName)[0]); /* GET */

                    /* If the value is a CSS null-value and this property has a hook template, use that zero-value template so that hooks can be extracted from it. */
                    if (CSS.Values.isCSSNullValue(normalizedPropertyValue) && CSS.Hooks.templates[property]) {
                        normalizedPropertyValue = CSS.Hooks.templates[property][1];
                    }
                }

                propertyValue = CSS.Normalizations.registered[property]("extract", element, normalizedPropertyValue);
            }

            /* If a (numeric) value wasn't produced via hook extraction or normalization, query the DOM. */
            if (!/^[\d-]/.test(propertyValue)) {
                /* For SVG elements, dimensional properties (which SVGAttribute() detects) are tweened via
                   their HTML attribute values instead of their CSS style values. */
                if (Data(element) && Data(element).isSVG && CSS.Names.SVGAttribute(property)) {
                    /* Since the height/width attribute values must be set manually, they don't reflect computed values.
                       Thus, we use use getBBox() to ensure we always get values for elements with undefined height/width attributes. */
                    if (/^(height|width)$/i.test(property)) {
                        /* Firefox throws an error if .getBBox() is called on an SVG that isn't attached to the DOM. */
                        try {
                            propertyValue = element.getBBox()[property];
                        } catch (error) {
                            propertyValue = 0;
                        }
                    /* Otherwise, access the attribute value directly. */
                    } else {
                        propertyValue = element.getAttribute(property);
                    }
                } else {
                    propertyValue = computePropertyValue(element, CSS.Names.prefixCheck(property)[0]); /* GET */
                }
            }

            /* Since property lookups are for animation purposes (which entails computing the numeric delta between start and end values),
               convert CSS null-values to an integer of value 0. */
            if (CSS.Values.isCSSNullValue(propertyValue)) {
                propertyValue = 0;
            }

            if (Velocity.debug >= 2) console.log("Get " + property + ": " + propertyValue);

            return propertyValue;
        },

        /* The singular setPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
        setPropertyValue: function(element, property, propertyValue, rootPropertyValue, scrollData) {
            var propertyName = property;

            /* In order to be subjected to call options and element queueing, scroll animation is routed through Velocity as if it were a standard CSS property. */
            if (property === "scroll") {
                /* If a container option is present, scroll the container instead of the browser window. */
                if (scrollData.container) {
                    scrollData.container["scroll" + scrollData.direction] = propertyValue;
                /* Otherwise, Velocity defaults to scrolling the browser window. */
                } else {
                    if (scrollData.direction === "Left") {
                        window.scrollTo(propertyValue, scrollData.alternateValue);
                    } else {
                        window.scrollTo(scrollData.alternateValue, propertyValue);
                    }
                }
            } else {
                /* Transforms (translateX, rotateZ, etc.) are applied to a per-element transformCache object, which is manually flushed via flushTransformCache().
                   Thus, for now, we merely cache transforms being SET. */
                if (CSS.Normalizations.registered[property] && CSS.Normalizations.registered[property]("name", element) === "transform") {
                    /* Perform a normalization injection. */
                    /* Note: The normalization logic handles the transformCache updating. */
                    CSS.Normalizations.registered[property]("inject", element, propertyValue);

                    propertyName = "transform";
                    propertyValue = Data(element).transformCache[property];
                } else {
                    /* Inject hooks. */
                    if (CSS.Hooks.registered[property]) {
                        var hookName = property,
                            hookRoot = CSS.Hooks.getRoot(property);

                        /* If a cached rootPropertyValue was not provided, query the DOM for the hookRoot's current value. */
                        rootPropertyValue = rootPropertyValue || CSS.getPropertyValue(element, hookRoot); /* GET */

                        propertyValue = CSS.Hooks.injectValue(hookName, propertyValue, rootPropertyValue);
                        property = hookRoot;
                    }

                    /* Normalize names and values. */
                    if (CSS.Normalizations.registered[property]) {
                        propertyValue = CSS.Normalizations.registered[property]("inject", element, propertyValue);
                        property = CSS.Normalizations.registered[property]("name", element);
                    }

                    /* Assign the appropriate vendor prefix before performing an official style update. */
                    propertyName = CSS.Names.prefixCheck(property)[0];

                    /* A try/catch is used for IE<=8, which throws an error when "invalid" CSS values are set, e.g. a negative width.
                       Try/catch is avoided for other browsers since it incurs a performance overhead. */
                    if (IE <= 8) {
                        try {
                            element.style[propertyName] = propertyValue;
                        } catch (error) { if (Velocity.debug) console.log("Browser does not support [" + propertyValue + "] for [" + propertyName + "]"); }
                    /* SVG elements have their dimensional properties (width, height, x, y, cx, etc.) applied directly as attributes instead of as styles. */
                    /* Note: IE8 does not support SVG elements, so it's okay that we skip it for SVG animation. */
                    } else if (Data(element) && Data(element).isSVG && CSS.Names.SVGAttribute(property)) {
                        /* Note: For SVG attributes, vendor-prefixed property names are never used. */
                        /* Note: Not all CSS properties can be animated via attributes, but the browser won't throw an error for unsupported properties. */
                        element.setAttribute(property, propertyValue);
                    } else {
                        element.style[propertyName] = propertyValue;
                    }

                    if (Velocity.debug >= 2) console.log("Set " + property + " (" + propertyName + "): " + propertyValue);
                }
            }

            /* Return the normalized property name and value in case the caller wants to know how these values were modified before being applied to the DOM. */
            return [ propertyName, propertyValue ];
        },

        /* To increase performance by batching transform updates into a single SET, transforms are not directly applied to an element until flushTransformCache() is called. */
        /* Note: Velocity applies transform properties in the same order that they are chronogically introduced to the element's CSS styles. */
        flushTransformCache: function(element) {
            var transformString = "";

            /* Certain browsers require that SVG transforms be applied as an attribute. However, the SVG transform attribute takes a modified version of CSS's transform string
               (units are dropped and, except for skewX/Y, subproperties are merged into their master property -- e.g. scaleX and scaleY are merged into scale(X Y). */
            if ((IE || (Velocity.State.isAndroid && !Velocity.State.isChrome)) && Data(element).isSVG) {
                /* Since transform values are stored in their parentheses-wrapped form, we use a helper function to strip out their numeric values.
                   Further, SVG transform properties only take unitless (representing pixels) values, so it's okay that parseFloat() strips the unit suffixed to the float value. */
                function getTransformFloat (transformProperty) {
                    return parseFloat(CSS.getPropertyValue(element, transformProperty));
                }

                /* Create an object to organize all the transforms that we'll apply to the SVG element. To keep the logic simple,
                   we process *all* transform properties -- even those that may not be explicitly applied (since they default to their zero-values anyway). */
                var SVGTransforms = {
                    translate: [ getTransformFloat("translateX"), getTransformFloat("translateY") ],
                    skewX: [ getTransformFloat("skewX") ], skewY: [ getTransformFloat("skewY") ],
                    /* If the scale property is set (non-1), use that value for the scaleX and scaleY values
                       (this behavior mimics the result of animating all these properties at once on HTML elements). */
                    scale: getTransformFloat("scale") !== 1 ? [ getTransformFloat("scale"), getTransformFloat("scale") ] : [ getTransformFloat("scaleX"), getTransformFloat("scaleY") ],
                    /* Note: SVG's rotate transform takes three values: rotation degrees followed by the X and Y values
                       defining the rotation's origin point. We ignore the origin values (default them to 0). */
                    rotate: [ getTransformFloat("rotateZ"), 0, 0 ]
                };

                /* Iterate through the transform properties in the user-defined property map order.
                   (This mimics the behavior of non-SVG transform animation.) */
                $.each(Data(element).transformCache, function(transformName) {
                    /* Except for with skewX/Y, revert the axis-specific transform subproperties to their axis-free master
                       properties so that they match up with SVG's accepted transform properties. */
                    if (/^translate/i.test(transformName)) {
                        transformName = "translate";
                    } else if (/^scale/i.test(transformName)) {
                        transformName = "scale";
                    } else if (/^rotate/i.test(transformName)) {
                        transformName = "rotate";
                    }

                    /* Check that we haven't yet deleted the property from the SVGTransforms container. */
                    if (SVGTransforms[transformName]) {
                        /* Append the transform property in the SVG-supported transform format. As per the spec, surround the space-delimited values in parentheses. */
                        transformString += transformName + "(" + SVGTransforms[transformName].join(" ") + ")" + " ";

                        /* After processing an SVG transform property, delete it from the SVGTransforms container so we don't
                           re-insert the same master property if we encounter another one of its axis-specific properties. */
                        delete SVGTransforms[transformName];
                    }
                });
            } else {
                var transformValue,
                    perspective;

                /* Transform properties are stored as members of the transformCache object. Concatenate all the members into a string. */
                $.each(Data(element).transformCache, function(transformName) {
                    transformValue = Data(element).transformCache[transformName];

                    /* Transform's perspective subproperty must be set first in order to take effect. Store it temporarily. */
                    if (transformName === "transformPerspective") {
                        perspective = transformValue;
                        return true;
                    }

                    /* IE9 only supports one rotation type, rotateZ, which it refers to as "rotate". */
                    if (IE === 9 && transformName === "rotateZ") {
                        transformName = "rotate";
                    }

                    transformString += transformName + transformValue + " ";
                });

                /* If present, set the perspective subproperty first. */
                if (perspective) {
                    transformString = "perspective" + perspective + " " + transformString;
                }
            }

            CSS.setPropertyValue(element, "transform", transformString);
        }
    };

    /* Register hooks and normalizations. */
    CSS.Hooks.register();
    CSS.Normalizations.register();

    /* Allow hook setting in the same fashion as jQuery's $.css(). */
    Velocity.hook = function (elements, arg2, arg3) {
        var value = undefined;

        elements = sanitizeElements(elements);

        $.each(elements, function(i, element) {
            /* Initialize Velocity's per-element data cache if this element hasn't previously been animated. */
            if (Data(element) === undefined) {
                Velocity.init(element);
            }

            /* Get property value. If an element set was passed in, only return the value for the first element. */
            if (arg3 === undefined) {
                if (value === undefined) {
                    value = Velocity.CSS.getPropertyValue(element, arg2);
                }
            /* Set property value. */
            } else {
                /* sPV returns an array of the normalized propertyName/propertyValue pair used to update the DOM. */
                var adjustedSet = Velocity.CSS.setPropertyValue(element, arg2, arg3);

                /* Transform properties don't automatically set. They have to be flushed to the DOM. */
                if (adjustedSet[0] === "transform") {
                    Velocity.CSS.flushTransformCache(element);
                }

                value = adjustedSet;
            }
        });

        return value;
    };

    /*****************
        Animation
    *****************/

    var animate = function() {

        /******************
            Call Chain
        ******************/

        /* Logic for determining what to return to the call stack when exiting out of Velocity. */
        function getChain () {
            /* If we are using the utility function, attempt to return this call's promise. If no promise library was detected,
               default to null instead of returning the targeted elements so that utility function's return value is standardized. */
            if (isUtility) {
                return promiseData.promise || null;
            /* Otherwise, if we're using $.fn, return the jQuery-/Zepto-wrapped element set. */
            } else {
                return elementsWrapped;
            }
        }

        /*************************
           Arguments Assignment
        *************************/

        /* To allow for expressive CoffeeScript code, Velocity supports an alternative syntax in which "elements" (or "e"), "properties" (or "p"), and "options" (or "o")
           objects are defined on a container object that's passed in as Velocity's sole argument. */
        /* Note: Some browsers automatically populate arguments with a "properties" object. We detect it by checking for its default "names" property. */
        var syntacticSugar = (arguments[0] && (arguments[0].p || (($.isPlainObject(arguments[0].properties) && !arguments[0].properties.names) || Type.isString(arguments[0].properties)))),
            /* Whether Velocity was called via the utility function (as opposed to on a jQuery/Zepto object). */
            isUtility,
            /* When Velocity is called via the utility function ($.Velocity()/Velocity()), elements are explicitly
               passed in as the first parameter. Thus, argument positioning varies. We normalize them here. */
            elementsWrapped,
            argumentIndex;

        var elements,
            propertiesMap,
            options;

        /* Detect jQuery/Zepto elements being animated via the $.fn method. */
        if (Type.isWrapped(this)) {
            isUtility = false;

            argumentIndex = 0;
            elements = this;
            elementsWrapped = this;
        /* Otherwise, raw elements are being animated via the utility function. */
        } else {
            isUtility = true;

            argumentIndex = 1;
            elements = syntacticSugar ? (arguments[0].elements || arguments[0].e) : arguments[0];
        }

        elements = sanitizeElements(elements);

        if (!elements) {
            return;
        }

        if (syntacticSugar) {
            propertiesMap = arguments[0].properties || arguments[0].p;
            options = arguments[0].options || arguments[0].o;
        } else {
            propertiesMap = arguments[argumentIndex];
            options = arguments[argumentIndex + 1];
        }

        /* The length of the element set (in the form of a nodeList or an array of elements) is defaulted to 1 in case a
           single raw DOM element is passed in (which doesn't contain a length property). */
        var elementsLength = elements.length,
            elementsIndex = 0;

        /***************************
            Argument Overloading
        ***************************/

        /* Support is included for jQuery's argument overloading: $.animate(propertyMap [, duration] [, easing] [, complete]).
           Overloading is detected by checking for the absence of an object being passed into options. */
        /* Note: The stop and finish actions do not accept animation options, and are therefore excluded from this check. */
        if (!/^(stop|finish|finishAll)$/i.test(propertiesMap) && !$.isPlainObject(options)) {
            /* The utility function shifts all arguments one position to the right, so we adjust for that offset. */
            var startingArgumentPosition = argumentIndex + 1;

            options = {};

            /* Iterate through all options arguments */
            for (var i = startingArgumentPosition; i < arguments.length; i++) {
                /* Treat a number as a duration. Parse it out. */
                /* Note: The following RegEx will return true if passed an array with a number as its first item.
                   Thus, arrays are skipped from this check. */
                if (!Type.isArray(arguments[i]) && (/^(fast|normal|slow)$/i.test(arguments[i]) || /^\d/.test(arguments[i]))) {
                    options.duration = arguments[i];
                /* Treat strings and arrays as easings. */
                } else if (Type.isString(arguments[i]) || Type.isArray(arguments[i])) {
                    options.easing = arguments[i];
                /* Treat a function as a complete callback. */
                } else if (Type.isFunction(arguments[i])) {
                    options.complete = arguments[i];
                }
            }
        }

        /***************
            Promises
        ***************/

        var promiseData = {
                promise: null,
                resolver: null,
                rejecter: null
            };

        /* If this call was made via the utility function (which is the default method of invocation when jQuery/Zepto are not being used), and if
           promise support was detected, create a promise object for this call and store references to its resolver and rejecter methods. The resolve
           method is used when a call completes naturally or is prematurely stopped by the user. In both cases, completeCall() handles the associated
           call cleanup and promise resolving logic. The reject method is used when an invalid set of arguments is passed into a Velocity call. */
        /* Note: Velocity employs a call-based queueing architecture, which means that stopping an animating element actually stops the full call that
           triggered it -- not that one element exclusively. Similarly, there is one promise per call, and all elements targeted by a Velocity call are
           grouped together for the purposes of resolving and rejecting a promise. */
        if (isUtility && Velocity.Promise) {
            promiseData.promise = new Velocity.Promise(function (resolve, reject) {
                promiseData.resolver = resolve;
                promiseData.rejecter = reject;
            });
        }

        /*********************
           Action Detection
        *********************/

        /* Velocity's behavior is categorized into "actions": Elements can either be specially scrolled into view,
           or they can be started, stopped, or reversed. If a literal or referenced properties map is passed in as Velocity's
           first argument, the associated action is "start". Alternatively, "scroll", "reverse", or "stop" can be passed in instead of a properties map. */
        var action;

        switch (propertiesMap) {
            case "scroll":
                action = "scroll";
                break;

            case "reverse":
                action = "reverse";
                break;

            case "finish":
            case "finishAll":
            case "stop":
                /*******************
                    Action: Stop
                *******************/

                /* Clear the currently-active delay on each targeted element. */
                $.each(elements, function(i, element) {
                    if (Data(element) && Data(element).delayTimer) {
                        /* Stop the timer from triggering its cached next() function. */
                        clearTimeout(Data(element).delayTimer.setTimeout);

                        /* Manually call the next() function so that the subsequent queue items can progress. */
                        if (Data(element).delayTimer.next) {
                            Data(element).delayTimer.next();
                        }

                        delete Data(element).delayTimer;
                    }

                    /* If we want to finish everything in the queue, we have to iterate through it
                       and call each function. This will make them active calls below, which will
                       cause them to be applied via the duration setting. */
                    if (propertiesMap === "finishAll" && (options === true || Type.isString(options))) {
                        /* Iterate through the items in the element's queue. */
                        $.each($.queue(element, Type.isString(options) ? options : ""), function(_, item) {
                            /* The queue array can contain an "inprogress" string, which we skip. */
                            if (Type.isFunction(item)) {
                                item();
                            }
                        });

                        /* Clearing the $.queue() array is achieved by resetting it to []. */
                        $.queue(element, Type.isString(options) ? options : "", []);
                    }
                });

                var callsToStop = [];

                /* When the stop action is triggered, the elements' currently active call is immediately stopped. The active call might have
                   been applied to multiple elements, in which case all of the call's elements will be stopped. When an element
                   is stopped, the next item in its animation queue is immediately triggered. */
                /* An additional argument may be passed in to clear an element's remaining queued calls. Either true (which defaults to the "fx" queue)
                   or a custom queue string can be passed in. */
                /* Note: The stop command runs prior to Velocity's Queueing phase since its behavior is intended to take effect *immediately*,
                   regardless of the element's current queue state. */

                /* Iterate through every active call. */
                $.each(Velocity.State.calls, function(i, activeCall) {
                    /* Inactive calls are set to false by the logic inside completeCall(). Skip them. */
                    if (activeCall) {
                        /* Iterate through the active call's targeted elements. */
                        $.each(activeCall[1], function(k, activeElement) {
                            /* If true was passed in as a secondary argument, clear absolutely all calls on this element. Otherwise, only
                               clear calls associated with the relevant queue. */
                            /* Call stopping logic works as follows:
                               - options === true --> stop current default queue calls (and queue:false calls), including remaining queued ones.
                               - options === undefined --> stop current queue:"" call and all queue:false calls.
                               - options === false --> stop only queue:false calls.
                               - options === "custom" --> stop current queue:"custom" call, including remaining queued ones (there is no functionality to only clear the currently-running queue:"custom" call). */
                            var queueName = (options === undefined) ? "" : options;

                            if (queueName !== true && (activeCall[2].queue !== queueName) && !(options === undefined && activeCall[2].queue === false)) {
                                return true;
                            }

                            /* Iterate through the calls targeted by the stop command. */
                            $.each(elements, function(l, element) {
                                /* Check that this call was applied to the target element. */
                                if (element === activeElement) {
                                    /* Optionally clear the remaining queued calls. If we're doing "finishAll" this won't find anything,
                                       due to the queue-clearing above. */
                                    if (options === true || Type.isString(options)) {
                                        /* Iterate through the items in the element's queue. */
                                        $.each($.queue(element, Type.isString(options) ? options : ""), function(_, item) {
                                            /* The queue array can contain an "inprogress" string, which we skip. */
                                            if (Type.isFunction(item)) {
                                                /* Pass the item's callback a flag indicating that we want to abort from the queue call.
                                                   (Specifically, the queue will resolve the call's associated promise then abort.)  */
                                                item(null, true);
                                            }
                                        });

                                        /* Clearing the $.queue() array is achieved by resetting it to []. */
                                        $.queue(element, Type.isString(options) ? options : "", []);
                                    }

                                    if (propertiesMap === "stop") {
                                        /* Since "reverse" uses cached start values (the previous call's endValues), these values must be
                                           changed to reflect the final value that the elements were actually tweened to. */
                                        /* Note: If only queue:false animations are currently running on an element, it won't have a tweensContainer
                                           object. Also, queue:false animations can't be reversed. */
                                        if (Data(element) && Data(element).tweensContainer && queueName !== false) {
                                            $.each(Data(element).tweensContainer, function(m, activeTween) {
                                                activeTween.endValue = activeTween.currentValue;
                                            });
                                        }

                                        callsToStop.push(i);
                                    } else if (propertiesMap === "finish" || propertiesMap === "finishAll") {
                                        /* To get active tweens to finish immediately, we forcefully shorten their durations to 1ms so that
                                        they finish upon the next rAf tick then proceed with normal call completion logic. */
                                        activeCall[2].duration = 1;
                                    }
                                }
                            });
                        });
                    }
                });

                /* Prematurely call completeCall() on each matched active call. Pass an additional flag for "stop" to indicate
                   that the complete callback and display:none setting should be skipped since we're completing prematurely. */
                if (propertiesMap === "stop") {
                    $.each(callsToStop, function(i, j) {
                        completeCall(j, true);
                    });

                    if (promiseData.promise) {
                        /* Immediately resolve the promise associated with this stop call since stop runs synchronously. */
                        promiseData.resolver(elements);
                    }
                }

                /* Since we're stopping, and not proceeding with queueing, exit out of Velocity. */
                return getChain();

            default:
                /* Treat a non-empty plain object as a literal properties map. */
                if ($.isPlainObject(propertiesMap) && !Type.isEmptyObject(propertiesMap)) {
                    action = "start";

                /****************
                    Redirects
                ****************/

                /* Check if a string matches a registered redirect (see Redirects above). */
                } else if (Type.isString(propertiesMap) && Velocity.Redirects[propertiesMap]) {
                    var opts = $.extend({}, options),
                        durationOriginal = opts.duration,
                        delayOriginal = opts.delay || 0;

                    /* If the backwards option was passed in, reverse the element set so that elements animate from the last to the first. */
                    if (opts.backwards === true) {
                        elements = $.extend(true, [], elements).reverse();
                    }

                    /* Individually trigger the redirect for each element in the set to prevent users from having to handle iteration logic in their redirect. */
                    $.each(elements, function(elementIndex, element) {
                        /* If the stagger option was passed in, successively delay each element by the stagger value (in ms). Retain the original delay value. */
                        if (parseFloat(opts.stagger)) {
                            opts.delay = delayOriginal + (parseFloat(opts.stagger) * elementIndex);
                        } else if (Type.isFunction(opts.stagger)) {
                            opts.delay = delayOriginal + opts.stagger.call(element, elementIndex, elementsLength);
                        }

                        /* If the drag option was passed in, successively increase/decrease (depending on the presense of opts.backwards)
                           the duration of each element's animation, using floors to prevent producing very short durations. */
                        if (opts.drag) {
                            /* Default the duration of UI pack effects (callouts and transitions) to 1000ms instead of the usual default duration of 400ms. */
                            opts.duration = parseFloat(durationOriginal) || (/^(callout|transition)/.test(propertiesMap) ? 1000 : DURATION_DEFAULT);

                            /* For each element, take the greater duration of: A) animation completion percentage relative to the original duration,
                               B) 75% of the original duration, or C) a 200ms fallback (in case duration is already set to a low value).
                               The end result is a baseline of 75% of the redirect's duration that increases/decreases as the end of the element set is approached. */
                            opts.duration = Math.max(opts.duration * (opts.backwards ? 1 - elementIndex/elementsLength : (elementIndex + 1) / elementsLength), opts.duration * 0.75, 200);
                        }

                        /* Pass in the call's opts object so that the redirect can optionally extend it. It defaults to an empty object instead of null to
                           reduce the opts checking logic required inside the redirect. */
                        Velocity.Redirects[propertiesMap].call(element, element, opts || {}, elementIndex, elementsLength, elements, promiseData.promise ? promiseData : undefined);
                    });

                    /* Since the animation logic resides within the redirect's own code, abort the remainder of this call.
                       (The performance overhead up to this point is virtually non-existant.) */
                    /* Note: The jQuery call chain is kept intact by returning the complete element set. */
                    return getChain();
                } else {
                    var abortError = "Velocity: First argument (" + propertiesMap + ") was not a property map, a known action, or a registered redirect. Aborting.";

                    if (promiseData.promise) {
                        promiseData.rejecter(new Error(abortError));
                    } else {
                        console.log(abortError);
                    }

                    return getChain();
                }
        }

        /**************************
            Call-Wide Variables
        **************************/

        /* A container for CSS unit conversion ratios (e.g. %, rem, and em ==> px) that is used to cache ratios across all elements
           being animated in a single Velocity call. Calculating unit ratios necessitates DOM querying and updating, and is therefore
           avoided (via caching) wherever possible. This container is call-wide instead of page-wide to avoid the risk of using stale
           conversion metrics across Velocity animations that are not immediately consecutively chained. */
        var callUnitConversionData = {
                lastParent: null,
                lastPosition: null,
                lastFontSize: null,
                lastPercentToPxWidth: null,
                lastPercentToPxHeight: null,
                lastEmToPx: null,
                remToPx: null,
                vwToPx: null,
                vhToPx: null
            };

        /* A container for all the ensuing tween data and metadata associated with this call. This container gets pushed to the page-wide
           Velocity.State.calls array that is processed during animation ticking. */
        var call = [];

        /************************
           Element Processing
        ************************/

        /* Element processing consists of three parts -- data processing that cannot go stale and data processing that *can* go stale (i.e. third-party style modifications):
           1) Pre-Queueing: Element-wide variables, including the element's data storage, are instantiated. Call options are prepared. If triggered, the Stop action is executed.
           2) Queueing: The logic that runs once this call has reached its point of execution in the element's $.queue() stack. Most logic is placed here to avoid risking it becoming stale.
           3) Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
        */

        function processElement () {

            /*************************
               Part I: Pre-Queueing
            *************************/

            /***************************
               Element-Wide Variables
            ***************************/

            var element = this,
                /* The runtime opts object is the extension of the current call's options and Velocity's page-wide option defaults. */
                opts = $.extend({}, Velocity.defaults, options),
                /* A container for the processed data associated with each property in the propertyMap.
                   (Each property in the map produces its own "tween".) */
                tweensContainer = {},
                elementUnitConversionData;

            /******************
               Element Init
            ******************/

            if (Data(element) === undefined) {
                Velocity.init(element);
            }

            /******************
               Option: Delay
            ******************/

            /* Since queue:false doesn't respect the item's existing queue, we avoid injecting its delay here (it's set later on). */
            /* Note: Velocity rolls its own delay function since jQuery doesn't have a utility alias for $.fn.delay()
               (and thus requires jQuery element creation, which we avoid since its overhead includes DOM querying). */
            if (parseFloat(opts.delay) && opts.queue !== false) {
                $.queue(element, opts.queue, function(next) {
                    /* This is a flag used to indicate to the upcoming completeCall() function that this queue entry was initiated by Velocity. See completeCall() for further details. */
                    Velocity.velocityQueueEntryFlag = true;

                    /* The ensuing queue item (which is assigned to the "next" argument that $.queue() automatically passes in) will be triggered after a setTimeout delay.
                       The setTimeout is stored so that it can be subjected to clearTimeout() if this animation is prematurely stopped via Velocity's "stop" command. */
                    Data(element).delayTimer = {
                        setTimeout: setTimeout(next, parseFloat(opts.delay)),
                        next: next
                    };
                });
            }

            /*********************
               Option: Duration
            *********************/

            /* Support for jQuery's named durations. */
            switch (opts.duration.toString().toLowerCase()) {
                case "fast":
                    opts.duration = 200;
                    break;

                case "normal":
                    opts.duration = DURATION_DEFAULT;
                    break;

                case "slow":
                    opts.duration = 600;
                    break;

                default:
                    /* Remove the potential "ms" suffix and default to 1 if the user is attempting to set a duration of 0 (in order to produce an immediate style change). */
                    opts.duration = parseFloat(opts.duration) || 1;
            }

            /************************
               Global Option: Mock
            ************************/

            if (Velocity.mock !== false) {
                /* In mock mode, all animations are forced to 1ms so that they occur immediately upon the next rAF tick.
                   Alternatively, a multiplier can be passed in to time remap all delays and durations. */
                if (Velocity.mock === true) {
                    opts.duration = opts.delay = 1;
                } else {
                    opts.duration *= parseFloat(Velocity.mock) || 1;
                    opts.delay *= parseFloat(Velocity.mock) || 1;
                }
            }

            /*******************
               Option: Easing
            *******************/

            opts.easing = getEasing(opts.easing, opts.duration);

            /**********************
               Option: Callbacks
            **********************/

            /* Callbacks must functions. Otherwise, default to null. */
            if (opts.begin && !Type.isFunction(opts.begin)) {
                opts.begin = null;
            }

            if (opts.progress && !Type.isFunction(opts.progress)) {
                opts.progress = null;
            }

            if (opts.complete && !Type.isFunction(opts.complete)) {
                opts.complete = null;
            }

            /*********************************
               Option: Display & Visibility
            *********************************/

            /* Refer to Velocity's documentation (VelocityJS.org/#displayAndVisibility) for a description of the display and visibility options' behavior. */
            /* Note: We strictly check for undefined instead of falsiness because display accepts an empty string value. */
            if (opts.display !== undefined && opts.display !== null) {
                opts.display = opts.display.toString().toLowerCase();

                /* Users can pass in a special "auto" value to instruct Velocity to set the element to its default display value. */
                if (opts.display === "auto") {
                    opts.display = Velocity.CSS.Values.getDisplayType(element);
                }
            }

            if (opts.visibility !== undefined && opts.visibility !== null) {
                opts.visibility = opts.visibility.toString().toLowerCase();
            }

            /**********************
               Option: mobileHA
            **********************/

            /* When set to true, and if this is a mobile device, mobileHA automatically enables hardware acceleration (via a null transform hack)
               on animating elements. HA is removed from the element at the completion of its animation. */
            /* Note: Android Gingerbread doesn't support HA. If a null transform hack (mobileHA) is in fact set, it will prevent other tranform subproperties from taking effect. */
            /* Note: You can read more about the use of mobileHA in Velocity's documentation: VelocityJS.org/#mobileHA. */
            opts.mobileHA = (opts.mobileHA && Velocity.State.isMobile && !Velocity.State.isGingerbread);

            /***********************
               Part II: Queueing
            ***********************/

            /* When a set of elements is targeted by a Velocity call, the set is broken up and each element has the current Velocity call individually queued onto it.
               In this way, each element's existing queue is respected; some elements may already be animating and accordingly should not have this current Velocity call triggered immediately. */
            /* In each queue, tween data is processed for each animating property then pushed onto the call-wide calls array. When the last element in the set has had its tweens processed,
               the call array is pushed to Velocity.State.calls for live processing by the requestAnimationFrame tick. */
            function buildQueue (next) {

                /*******************
                   Option: Begin
                *******************/

                /* The begin callback is fired once per call -- not once per elemenet -- and is passed the full raw DOM element set as both its context and its first argument. */
                if (opts.begin && elementsIndex === 0) {
                    /* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
                    try {
                        opts.begin.call(elements, elements);
                    } catch (error) {
                        setTimeout(function() { throw error; }, 1);
                    }
                }

                /*****************************************
                   Tween Data Construction (for Scroll)
                *****************************************/

                /* Note: In order to be subjected to chaining and animation options, scroll's tweening is routed through Velocity as if it were a standard CSS property animation. */
                if (action === "scroll") {
                    /* The scroll action uniquely takes an optional "offset" option -- specified in pixels -- that offsets the targeted scroll position. */
                    var scrollDirection = (/^x$/i.test(opts.axis) ? "Left" : "Top"),
                        scrollOffset = parseFloat(opts.offset) || 0,
                        scrollPositionCurrent,
                        scrollPositionCurrentAlternate,
                        scrollPositionEnd;

                    /* Scroll also uniquely takes an optional "container" option, which indicates the parent element that should be scrolled --
                       as opposed to the browser window itself. This is useful for scrolling toward an element that's inside an overflowing parent element. */
                    if (opts.container) {
                        /* Ensure that either a jQuery object or a raw DOM element was passed in. */
                        if (Type.isWrapped(opts.container) || Type.isNode(opts.container)) {
                            /* Extract the raw DOM element from the jQuery wrapper. */
                            opts.container = opts.container[0] || opts.container;
                            /* Note: Unlike other properties in Velocity, the browser's scroll position is never cached since it so frequently changes
                               (due to the user's natural interaction with the page). */
                            scrollPositionCurrent = opts.container["scroll" + scrollDirection]; /* GET */

                            /* $.position() values are relative to the container's currently viewable area (without taking into account the container's true dimensions
                               -- say, for example, if the container was not overflowing). Thus, the scroll end value is the sum of the child element's position *and*
                               the scroll container's current scroll position. */
                            scrollPositionEnd = (scrollPositionCurrent + $(element).position()[scrollDirection.toLowerCase()]) + scrollOffset; /* GET */
                        /* If a value other than a jQuery object or a raw DOM element was passed in, default to null so that this option is ignored. */
                        } else {
                            opts.container = null;
                        }
                    } else {
                        /* If the window itself is being scrolled -- not a containing element -- perform a live scroll position lookup using
                           the appropriate cached property names (which differ based on browser type). */
                        scrollPositionCurrent = Velocity.State.scrollAnchor[Velocity.State["scrollProperty" + scrollDirection]]; /* GET */
                        /* When scrolling the browser window, cache the alternate axis's current value since window.scrollTo() doesn't let us change only one value at a time. */
                        scrollPositionCurrentAlternate = Velocity.State.scrollAnchor[Velocity.State["scrollProperty" + (scrollDirection === "Left" ? "Top" : "Left")]]; /* GET */

                        /* Unlike $.position(), $.offset() values are relative to the browser window's true dimensions -- not merely its currently viewable area --
                           and therefore end values do not need to be compounded onto current values. */
                        scrollPositionEnd = $(element).offset()[scrollDirection.toLowerCase()] + scrollOffset; /* GET */
                    }

                    /* Since there's only one format that scroll's associated tweensContainer can take, we create it manually. */
                    tweensContainer = {
                        scroll: {
                            rootPropertyValue: false,
                            startValue: scrollPositionCurrent,
                            currentValue: scrollPositionCurrent,
                            endValue: scrollPositionEnd,
                            unitType: "",
                            easing: opts.easing,
                            scrollData: {
                                container: opts.container,
                                direction: scrollDirection,
                                alternateValue: scrollPositionCurrentAlternate
                            }
                        },
                        element: element
                    };

                    if (Velocity.debug) console.log("tweensContainer (scroll): ", tweensContainer.scroll, element);

                /******************************************
                   Tween Data Construction (for Reverse)
                ******************************************/

                /* Reverse acts like a "start" action in that a property map is animated toward. The only difference is
                   that the property map used for reverse is the inverse of the map used in the previous call. Thus, we manipulate
                   the previous call to construct our new map: use the previous map's end values as our new map's start values. Copy over all other data. */
                /* Note: Reverse can be directly called via the "reverse" parameter, or it can be indirectly triggered via the loop option. (Loops are composed of multiple reverses.) */
                /* Note: Reverse calls do not need to be consecutively chained onto a currently-animating element in order to operate on cached values;
                   there is no harm to reverse being called on a potentially stale data cache since reverse's behavior is simply defined
                   as reverting to the element's values as they were prior to the previous *Velocity* call. */
                } else if (action === "reverse") {
                    /* Abort if there is no prior animation data to reverse to. */
                    if (!Data(element).tweensContainer) {
                        /* Dequeue the element so that this queue entry releases itself immediately, allowing subsequent queue entries to run. */
                        $.dequeue(element, opts.queue);

                        return;
                    } else {
                        /*********************
                           Options Parsing
                        *********************/

                        /* If the element was hidden via the display option in the previous call,
                           revert display to "auto" prior to reversal so that the element is visible again. */
                        if (Data(element).opts.display === "none") {
                            Data(element).opts.display = "auto";
                        }

                        if (Data(element).opts.visibility === "hidden") {
                            Data(element).opts.visibility = "visible";
                        }

                        /* If the loop option was set in the previous call, disable it so that "reverse" calls aren't recursively generated.
                           Further, remove the previous call's callback options; typically, users do not want these to be refired. */
                        Data(element).opts.loop = false;
                        Data(element).opts.begin = null;
                        Data(element).opts.complete = null;

                        /* Since we're extending an opts object that has already been extended with the defaults options object,
                           we remove non-explicitly-defined properties that are auto-assigned values. */
                        if (!options.easing) {
                            delete opts.easing;
                        }

                        if (!options.duration) {
                            delete opts.duration;
                        }

                        /* The opts object used for reversal is an extension of the options object optionally passed into this
                           reverse call plus the options used in the previous Velocity call. */
                        opts = $.extend({}, Data(element).opts, opts);

                        /*************************************
                           Tweens Container Reconstruction
                        *************************************/

                        /* Create a deepy copy (indicated via the true flag) of the previous call's tweensContainer. */
                        var lastTweensContainer = $.extend(true, {}, Data(element).tweensContainer);

                        /* Manipulate the previous tweensContainer by replacing its end values and currentValues with its start values. */
                        for (var lastTween in lastTweensContainer) {
                            /* In addition to tween data, tweensContainers contain an element property that we ignore here. */
                            if (lastTween !== "element") {
                                var lastStartValue = lastTweensContainer[lastTween].startValue;

                                lastTweensContainer[lastTween].startValue = lastTweensContainer[lastTween].currentValue = lastTweensContainer[lastTween].endValue;
                                lastTweensContainer[lastTween].endValue = lastStartValue;

                                /* Easing is the only option that embeds into the individual tween data (since it can be defined on a per-property basis).
                                   Accordingly, every property's easing value must be updated when an options object is passed in with a reverse call.
                                   The side effect of this extensibility is that all per-property easing values are forcefully reset to the new value. */
                                if (!Type.isEmptyObject(options)) {
                                    lastTweensContainer[lastTween].easing = opts.easing;
                                }

                                if (Velocity.debug) console.log("reverse tweensContainer (" + lastTween + "): " + JSON.stringify(lastTweensContainer[lastTween]), element);
                            }
                        }

                        tweensContainer = lastTweensContainer;
                    }

                /*****************************************
                   Tween Data Construction (for Start)
                *****************************************/

                } else if (action === "start") {

                    /*************************
                        Value Transferring
                    *************************/

                    /* If this queue entry follows a previous Velocity-initiated queue entry *and* if this entry was created
                       while the element was in the process of being animated by Velocity, then this current call is safe to use
                       the end values from the prior call as its start values. Velocity attempts to perform this value transfer
                       process whenever possible in order to avoid requerying the DOM. */
                    /* If values aren't transferred from a prior call and start values were not forcefed by the user (more on this below),
                       then the DOM is queried for the element's current values as a last resort. */
                    /* Note: Conversely, animation reversal (and looping) *always* perform inter-call value transfers; they never requery the DOM. */
                    var lastTweensContainer;

                    /* The per-element isAnimating flag is used to indicate whether it's safe (i.e. the data isn't stale)
                       to transfer over end values to use as start values. If it's set to true and there is a previous
                       Velocity call to pull values from, do so. */
                    if (Data(element).tweensContainer && Data(element).isAnimating === true) {
                        lastTweensContainer = Data(element).tweensContainer;
                    }

                    /***************************
                       Tween Data Calculation
                    ***************************/

                    /* This function parses property data and defaults endValue, easing, and startValue as appropriate. */
                    /* Property map values can either take the form of 1) a single value representing the end value,
                       or 2) an array in the form of [ endValue, [, easing] [, startValue] ].
                       The optional third parameter is a forcefed startValue to be used instead of querying the DOM for
                       the element's current value. Read Velocity's docmentation to learn more about forcefeeding: VelocityJS.org/#forcefeeding */
                    function parsePropertyValue (valueData, skipResolvingEasing) {
                        var endValue = undefined,
                            easing = undefined,
                            startValue = undefined;

                        /* Handle the array format, which can be structured as one of three potential overloads:
                           A) [ endValue, easing, startValue ], B) [ endValue, easing ], or C) [ endValue, startValue ] */
                        if (Type.isArray(valueData)) {
                            /* endValue is always the first item in the array. Don't bother validating endValue's value now
                               since the ensuing property cycling logic does that. */
                            endValue = valueData[0];

                            /* Two-item array format: If the second item is a number, function, or hex string, treat it as a
                               start value since easings can only be non-hex strings or arrays. */
                            if ((!Type.isArray(valueData[1]) && /^[\d-]/.test(valueData[1])) || Type.isFunction(valueData[1]) || CSS.RegEx.isHex.test(valueData[1])) {
                                startValue = valueData[1];
                            /* Two or three-item array: If the second item is a non-hex string or an array, treat it as an easing. */
                            } else if ((Type.isString(valueData[1]) && !CSS.RegEx.isHex.test(valueData[1])) || Type.isArray(valueData[1])) {
                                easing = skipResolvingEasing ? valueData[1] : getEasing(valueData[1], opts.duration);

                                /* Don't bother validating startValue's value now since the ensuing property cycling logic inherently does that. */
                                if (valueData[2] !== undefined) {
                                    startValue = valueData[2];
                                }
                            }
                        /* Handle the single-value format. */
                        } else {
                            endValue = valueData;
                        }

                        /* Default to the call's easing if a per-property easing type was not defined. */
                        if (!skipResolvingEasing) {
                            easing = easing || opts.easing;
                        }

                        /* If functions were passed in as values, pass the function the current element as its context,
                           plus the element's index and the element set's size as arguments. Then, assign the returned value. */
                        if (Type.isFunction(endValue)) {
                            endValue = endValue.call(element, elementsIndex, elementsLength);
                        }

                        if (Type.isFunction(startValue)) {
                            startValue = startValue.call(element, elementsIndex, elementsLength);
                        }

                        /* Allow startValue to be left as undefined to indicate to the ensuing code that its value was not forcefed. */
                        return [ endValue || 0, easing, startValue ];
                    }

                    /* Cycle through each property in the map, looking for shorthand color properties (e.g. "color" as opposed to "colorRed"). Inject the corresponding
                       colorRed, colorGreen, and colorBlue RGB component tweens into the propertiesMap (which Velocity understands) and remove the shorthand property. */
                    $.each(propertiesMap, function(property, value) {
                        /* Find shorthand color properties that have been passed a hex string. */
                        if (RegExp("^" + CSS.Lists.colors.join("$|^") + "$").test(property)) {
                            /* Parse the value data for each shorthand. */
                            var valueData = parsePropertyValue(value, true),
                                endValue = valueData[0],
                                easing = valueData[1],
                                startValue = valueData[2];

                            if (CSS.RegEx.isHex.test(endValue)) {
                                /* Convert the hex strings into their RGB component arrays. */
                                var colorComponents = [ "Red", "Green", "Blue" ],
                                    endValueRGB = CSS.Values.hexToRgb(endValue),
                                    startValueRGB = startValue ? CSS.Values.hexToRgb(startValue) : undefined;

                                /* Inject the RGB component tweens into propertiesMap. */
                                for (var i = 0; i < colorComponents.length; i++) {
                                    var dataArray = [ endValueRGB[i] ];

                                    if (easing) {
                                        dataArray.push(easing);
                                    }

                                    if (startValueRGB !== undefined) {
                                        dataArray.push(startValueRGB[i]);
                                    }

                                    propertiesMap[property + colorComponents[i]] = dataArray;
                                }

                                /* Remove the intermediary shorthand property entry now that we've processed it. */
                                delete propertiesMap[property];
                            }
                        }
                    });

                    /* Create a tween out of each property, and append its associated data to tweensContainer. */
                    for (var property in propertiesMap) {

                        /**************************
                           Start Value Sourcing
                        **************************/

                        /* Parse out endValue, easing, and startValue from the property's data. */
                        var valueData = parsePropertyValue(propertiesMap[property]),
                            endValue = valueData[0],
                            easing = valueData[1],
                            startValue = valueData[2];

                        /* Now that the original property name's format has been used for the parsePropertyValue() lookup above,
                           we force the property to its camelCase styling to normalize it for manipulation. */
                        property = CSS.Names.camelCase(property);

                        /* In case this property is a hook, there are circumstances where we will intend to work on the hook's root property and not the hooked subproperty. */
                        var rootProperty = CSS.Hooks.getRoot(property),
                            rootPropertyValue = false;

                        /* Other than for the dummy tween property, properties that are not supported by the browser (and do not have an associated normalization) will
                           inherently produce no style changes when set, so they are skipped in order to decrease animation tick overhead.
                           Property support is determined via prefixCheck(), which returns a false flag when no supported is detected. */
                        /* Note: Since SVG elements have some of their properties directly applied as HTML attributes,
                           there is no way to check for their explicit browser support, and so we skip skip this check for them. */
                        if (!Data(element).isSVG && rootProperty !== "tween" && CSS.Names.prefixCheck(rootProperty)[1] === false && CSS.Normalizations.registered[rootProperty] === undefined) {
                            if (Velocity.debug) console.log("Skipping [" + rootProperty + "] due to a lack of browser support.");

                            continue;
                        }

                        /* If the display option is being set to a non-"none" (e.g. "block") and opacity (filter on IE<=8) is being
                           animated to an endValue of non-zero, the user's intention is to fade in from invisible, thus we forcefeed opacity
                           a startValue of 0 if its startValue hasn't already been sourced by value transferring or prior forcefeeding. */
                        if (((opts.display !== undefined && opts.display !== null && opts.display !== "none") || (opts.visibility !== undefined && opts.visibility !== "hidden")) && /opacity|filter/.test(property) && !startValue && endValue !== 0) {
                            startValue = 0;
                        }

                        /* If values have been transferred from the previous Velocity call, extract the endValue and rootPropertyValue
                           for all of the current call's properties that were *also* animated in the previous call. */
                        /* Note: Value transferring can optionally be disabled by the user via the _cacheValues option. */
                        if (opts._cacheValues && lastTweensContainer && lastTweensContainer[property]) {
                            if (startValue === undefined) {
                                startValue = lastTweensContainer[property].endValue + lastTweensContainer[property].unitType;
                            }

                            /* The previous call's rootPropertyValue is extracted from the element's data cache since that's the
                               instance of rootPropertyValue that gets freshly updated by the tweening process, whereas the rootPropertyValue
                               attached to the incoming lastTweensContainer is equal to the root property's value prior to any tweening. */
                            rootPropertyValue = Data(element).rootPropertyValueCache[rootProperty];
                        /* If values were not transferred from a previous Velocity call, query the DOM as needed. */
                        } else {
                            /* Handle hooked properties. */
                            if (CSS.Hooks.registered[property]) {
                               if (startValue === undefined) {
                                    rootPropertyValue = CSS.getPropertyValue(element, rootProperty); /* GET */
                                    /* Note: The following getPropertyValue() call does not actually trigger a DOM query;
                                       getPropertyValue() will extract the hook from rootPropertyValue. */
                                    startValue = CSS.getPropertyValue(element, property, rootPropertyValue);
                                /* If startValue is already defined via forcefeeding, do not query the DOM for the root property's value;
                                   just grab rootProperty's zero-value template from CSS.Hooks. This overwrites the element's actual
                                   root property value (if one is set), but this is acceptable since the primary reason users forcefeed is
                                   to avoid DOM queries, and thus we likewise avoid querying the DOM for the root property's value. */
                                } else {
                                    /* Grab this hook's zero-value template, e.g. "0px 0px 0px black". */
                                    rootPropertyValue = CSS.Hooks.templates[rootProperty][1];
                                }
                            /* Handle non-hooked properties that haven't already been defined via forcefeeding. */
                            } else if (startValue === undefined) {
                                startValue = CSS.getPropertyValue(element, property); /* GET */
                            }
                        }

                        /**************************
                           Value Data Extraction
                        **************************/

                        var separatedValue,
                            endValueUnitType,
                            startValueUnitType,
                            operator = false;

                        /* Separates a property value into its numeric value and its unit type. */
                        function separateValue (property, value) {
                            var unitType,
                                numericValue;

                            numericValue = (value || "0")
                                .toString()
                                .toLowerCase()
                                /* Match the unit type at the end of the value. */
                                .replace(/[%A-z]+$/, function(match) {
                                    /* Grab the unit type. */
                                    unitType = match;

                                    /* Strip the unit type off of value. */
                                    return "";
                                });

                            /* If no unit type was supplied, assign one that is appropriate for this property (e.g. "deg" for rotateZ or "px" for width). */
                            if (!unitType) {
                                unitType = CSS.Values.getUnitType(property);
                            }

                            return [ numericValue, unitType ];
                        }

                        /* Separate startValue. */
                        separatedValue = separateValue(property, startValue);
                        startValue = separatedValue[0];
                        startValueUnitType = separatedValue[1];

                        /* Separate endValue, and extract a value operator (e.g. "+=", "-=") if one exists. */
                        separatedValue = separateValue(property, endValue);
                        endValue = separatedValue[0].replace(/^([+-\/*])=/, function(match, subMatch) {
                            operator = subMatch;

                            /* Strip the operator off of the value. */
                            return "";
                        });
                        endValueUnitType = separatedValue[1];

                        /* Parse float values from endValue and startValue. Default to 0 if NaN is returned. */
                        startValue = parseFloat(startValue) || 0;
                        endValue = parseFloat(endValue) || 0;

                        /***************************************
                           Property-Specific Value Conversion
                        ***************************************/

                        /* Custom support for properties that don't actually accept the % unit type, but where pollyfilling is trivial and relatively foolproof. */
                        if (endValueUnitType === "%") {
                            /* A %-value fontSize/lineHeight is relative to the parent's fontSize (as opposed to the parent's dimensions),
                               which is identical to the em unit's behavior, so we piggyback off of that. */
                            if (/^(fontSize|lineHeight)$/.test(property)) {
                                /* Convert % into an em decimal value. */
                                endValue = endValue / 100;
                                endValueUnitType = "em";
                            /* For scaleX and scaleY, convert the value into its decimal format and strip off the unit type. */
                            } else if (/^scale/.test(property)) {
                                endValue = endValue / 100;
                                endValueUnitType = "";
                            /* For RGB components, take the defined percentage of 255 and strip off the unit type. */
                            } else if (/(Red|Green|Blue)$/i.test(property)) {
                                endValue = (endValue / 100) * 255;
                                endValueUnitType = "";
                            }
                        }

                        /***************************
                           Unit Ratio Calculation
                        ***************************/

                        /* When queried, the browser returns (most) CSS property values in pixels. Therefore, if an endValue with a unit type of
                           %, em, or rem is animated toward, startValue must be converted from pixels into the same unit type as endValue in order
                           for value manipulation logic (increment/decrement) to proceed. Further, if the startValue was forcefed or transferred
                           from a previous call, startValue may also not be in pixels. Unit conversion logic therefore consists of two steps:
                           1) Calculating the ratio of %/em/rem/vh/vw relative to pixels
                           2) Converting startValue into the same unit of measurement as endValue based on these ratios. */
                        /* Unit conversion ratios are calculated by inserting a sibling node next to the target node, copying over its position property,
                           setting values with the target unit type then comparing the returned pixel value. */
                        /* Note: Even if only one of these unit types is being animated, all unit ratios are calculated at once since the overhead
                           of batching the SETs and GETs together upfront outweights the potential overhead
                           of layout thrashing caused by re-querying for uncalculated ratios for subsequently-processed properties. */
                        /* Todo: Shift this logic into the calls' first tick instance so that it's synced with RAF. */
                        function calculateUnitRatios () {

                            /************************
                                Same Ratio Checks
                            ************************/

                            /* The properties below are used to determine whether the element differs sufficiently from this call's
                               previously iterated element to also differ in its unit conversion ratios. If the properties match up with those
                               of the prior element, the prior element's conversion ratios are used. Like most optimizations in Velocity,
                               this is done to minimize DOM querying. */
                            var sameRatioIndicators = {
                                    myParent: element.parentNode || document.body, /* GET */
                                    position: CSS.getPropertyValue(element, "position"), /* GET */
                                    fontSize: CSS.getPropertyValue(element, "fontSize") /* GET */
                                },
                                /* Determine if the same % ratio can be used. % is based on the element's position value and its parent's width and height dimensions. */
                                samePercentRatio = ((sameRatioIndicators.position === callUnitConversionData.lastPosition) && (sameRatioIndicators.myParent === callUnitConversionData.lastParent)),
                                /* Determine if the same em ratio can be used. em is relative to the element's fontSize. */
                                sameEmRatio = (sameRatioIndicators.fontSize === callUnitConversionData.lastFontSize);

                            /* Store these ratio indicators call-wide for the next element to compare against. */
                            callUnitConversionData.lastParent = sameRatioIndicators.myParent;
                            callUnitConversionData.lastPosition = sameRatioIndicators.position;
                            callUnitConversionData.lastFontSize = sameRatioIndicators.fontSize;

                            /***************************
                               Element-Specific Units
                            ***************************/

                            /* Note: IE8 rounds to the nearest pixel when returning CSS values, thus we perform conversions using a measurement
                               of 100 (instead of 1) to give our ratios a precision of at least 2 decimal values. */
                            var measurement = 100,
                                unitRatios = {};

                            if (!sameEmRatio || !samePercentRatio) {
                                var dummy = Data(element).isSVG ? document.createElementNS("http://www.w3.org/2000/svg", "rect") : document.createElement("div");

                                Velocity.init(dummy);
                                sameRatioIndicators.myParent.appendChild(dummy);

                                /* To accurately and consistently calculate conversion ratios, the element's cascaded overflow and box-sizing are stripped.
                                   Similarly, since width/height can be artificially constrained by their min-/max- equivalents, these are controlled for as well. */
                                /* Note: Overflow must be also be controlled for per-axis since the overflow property overwrites its per-axis values. */
                                $.each([ "overflow", "overflowX", "overflowY" ], function(i, property) {
                                    Velocity.CSS.setPropertyValue(dummy, property, "hidden");
                                });
                                Velocity.CSS.setPropertyValue(dummy, "position", sameRatioIndicators.position);
                                Velocity.CSS.setPropertyValue(dummy, "fontSize", sameRatioIndicators.fontSize);
                                Velocity.CSS.setPropertyValue(dummy, "boxSizing", "content-box");

                                /* width and height act as our proxy properties for measuring the horizontal and vertical % ratios. */
                                $.each([ "minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height" ], function(i, property) {
                                    Velocity.CSS.setPropertyValue(dummy, property, measurement + "%");
                                });
                                /* paddingLeft arbitrarily acts as our proxy property for the em ratio. */
                                Velocity.CSS.setPropertyValue(dummy, "paddingLeft", measurement + "em");

                                /* Divide the returned value by the measurement to get the ratio between 1% and 1px. Default to 1 since working with 0 can produce Infinite. */
                                unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth = (parseFloat(CSS.getPropertyValue(dummy, "width", null, true)) || 1) / measurement; /* GET */
                                unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight = (parseFloat(CSS.getPropertyValue(dummy, "height", null, true)) || 1) / measurement; /* GET */
                                unitRatios.emToPx = callUnitConversionData.lastEmToPx = (parseFloat(CSS.getPropertyValue(dummy, "paddingLeft")) || 1) / measurement; /* GET */

                                sameRatioIndicators.myParent.removeChild(dummy);
                            } else {
                                unitRatios.emToPx = callUnitConversionData.lastEmToPx;
                                unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth;
                                unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight;
                            }

                            /***************************
                               Element-Agnostic Units
                            ***************************/

                            /* Whereas % and em ratios are determined on a per-element basis, the rem unit only needs to be checked
                               once per call since it's exclusively dependant upon document.body's fontSize. If this is the first time
                               that calculateUnitRatios() is being run during this call, remToPx will still be set to its default value of null,
                               so we calculate it now. */
                            if (callUnitConversionData.remToPx === null) {
                                /* Default to browsers' default fontSize of 16px in the case of 0. */
                                callUnitConversionData.remToPx = parseFloat(CSS.getPropertyValue(document.body, "fontSize")) || 16; /* GET */
                            }

                            /* Similarly, viewport units are %-relative to the window's inner dimensions. */
                            if (callUnitConversionData.vwToPx === null) {
                                callUnitConversionData.vwToPx = parseFloat(window.innerWidth) / 100; /* GET */
                                callUnitConversionData.vhToPx = parseFloat(window.innerHeight) / 100; /* GET */
                            }

                            unitRatios.remToPx = callUnitConversionData.remToPx;
                            unitRatios.vwToPx = callUnitConversionData.vwToPx;
                            unitRatios.vhToPx = callUnitConversionData.vhToPx;

                            if (Velocity.debug >= 1) console.log("Unit ratios: " + JSON.stringify(unitRatios), element);

                            return unitRatios;
                        }

                        /********************
                           Unit Conversion
                        ********************/

                        /* The * and / operators, which are not passed in with an associated unit, inherently use startValue's unit. Skip value and unit conversion. */
                        if (/[\/*]/.test(operator)) {
                            endValueUnitType = startValueUnitType;
                        /* If startValue and endValue differ in unit type, convert startValue into the same unit type as endValue so that if endValueUnitType
                           is a relative unit (%, em, rem), the values set during tweening will continue to be accurately relative even if the metrics they depend
                           on are dynamically changing during the course of the animation. Conversely, if we always normalized into px and used px for setting values, the px ratio
                           would become stale if the original unit being animated toward was relative and the underlying metrics change during the animation. */
                        /* Since 0 is 0 in any unit type, no conversion is necessary when startValue is 0 -- we just start at 0 with endValueUnitType. */
                        } else if ((startValueUnitType !== endValueUnitType) && startValue !== 0) {
                            /* Unit conversion is also skipped when endValue is 0, but *startValueUnitType* must be used for tween values to remain accurate. */
                            /* Note: Skipping unit conversion here means that if endValueUnitType was originally a relative unit, the animation won't relatively
                               match the underlying metrics if they change, but this is acceptable since we're animating toward invisibility instead of toward visibility,
                               which remains past the point of the animation's completion. */
                            if (endValue === 0) {
                                endValueUnitType = startValueUnitType;
                            } else {
                                /* By this point, we cannot avoid unit conversion (it's undesirable since it causes layout thrashing).
                                   If we haven't already, we trigger calculateUnitRatios(), which runs once per element per call. */
                                elementUnitConversionData = elementUnitConversionData || calculateUnitRatios();

                                /* The following RegEx matches CSS properties that have their % values measured relative to the x-axis. */
                                /* Note: W3C spec mandates that all of margin and padding's properties (even top and bottom) are %-relative to the *width* of the parent element. */
                                var axis = (/margin|padding|left|right|width|text|word|letter/i.test(property) || /X$/.test(property) || property === "x") ? "x" : "y";

                                /* In order to avoid generating n^2 bespoke conversion functions, unit conversion is a two-step process:
                                   1) Convert startValue into pixels. 2) Convert this new pixel value into endValue's unit type. */
                                switch (startValueUnitType) {
                                    case "%":
                                        /* Note: translateX and translateY are the only properties that are %-relative to an element's own dimensions -- not its parent's dimensions.
                                           Velocity does not include a special conversion process to account for this behavior. Therefore, animating translateX/Y from a % value
                                           to a non-% value will produce an incorrect start value. Fortunately, this sort of cross-unit conversion is rarely done by users in practice. */
                                        startValue *= (axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
                                        break;

                                    case "px":
                                        /* px acts as our midpoint in the unit conversion process; do nothing. */
                                        break;

                                    default:
                                        startValue *= elementUnitConversionData[startValueUnitType + "ToPx"];
                                }

                                /* Invert the px ratios to convert into to the target unit. */
                                switch (endValueUnitType) {
                                    case "%":
                                        startValue *= 1 / (axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
                                        break;

                                    case "px":
                                        /* startValue is already in px, do nothing; we're done. */
                                        break;

                                    default:
                                        startValue *= 1 / elementUnitConversionData[endValueUnitType + "ToPx"];
                                }
                            }
                        }

                        /*********************
                           Relative Values
                        *********************/

                        /* Operator logic must be performed last since it requires unit-normalized start and end values. */
                        /* Note: Relative *percent values* do not behave how most people think; while one would expect "+=50%"
                           to increase the property 1.5x its current value, it in fact increases the percent units in absolute terms:
                           50 points is added on top of the current % value. */
                        switch (operator) {
                            case "+":
                                endValue = startValue + endValue;
                                break;

                            case "-":
                                endValue = startValue - endValue;
                                break;

                            case "*":
                                endValue = startValue * endValue;
                                break;

                            case "/":
                                endValue = startValue / endValue;
                                break;
                        }

                        /**************************
                           tweensContainer Push
                        **************************/

                        /* Construct the per-property tween object, and push it to the element's tweensContainer. */
                        tweensContainer[property] = {
                            rootPropertyValue: rootPropertyValue,
                            startValue: startValue,
                            currentValue: startValue,
                            endValue: endValue,
                            unitType: endValueUnitType,
                            easing: easing
                        };

                        if (Velocity.debug) console.log("tweensContainer (" + property + "): " + JSON.stringify(tweensContainer[property]), element);
                    }

                    /* Along with its property data, store a reference to the element itself onto tweensContainer. */
                    tweensContainer.element = element;
                }

                /*****************
                    Call Push
                *****************/

                /* Note: tweensContainer can be empty if all of the properties in this call's property map were skipped due to not
                   being supported by the browser. The element property is used for checking that the tweensContainer has been appended to. */
                if (tweensContainer.element) {
                    /* Apply the "velocity-animating" indicator class. */
                    CSS.Values.addClass(element, "velocity-animating");

                    /* The call array houses the tweensContainers for each element being animated in the current call. */
                    call.push(tweensContainer);

                    /* Store the tweensContainer and options if we're working on the default effects queue, so that they can be used by the reverse command. */
                    if (opts.queue === "") {
                        Data(element).tweensContainer = tweensContainer;
                        Data(element).opts = opts;
                    }

                    /* Switch on the element's animating flag. */
                    Data(element).isAnimating = true;

                    /* Once the final element in this call's element set has been processed, push the call array onto
                       Velocity.State.calls for the animation tick to immediately begin processing. */
                    if (elementsIndex === elementsLength - 1) {
                        /* Add the current call plus its associated metadata (the element set and the call's options) onto the global call container.
                           Anything on this call container is subjected to tick() processing. */
                        Velocity.State.calls.push([ call, elements, opts, null, promiseData.resolver ]);

                        /* If the animation tick isn't running, start it. (Velocity shuts it off when there are no active calls to process.) */
                        if (Velocity.State.isTicking === false) {
                            Velocity.State.isTicking = true;

                            /* Start the tick loop. */
                            tick();
                        }
                    } else {
                        elementsIndex++;
                    }
                }
            }

            /* When the queue option is set to false, the call skips the element's queue and fires immediately. */
            if (opts.queue === false) {
                /* Since this buildQueue call doesn't respect the element's existing queue (which is where a delay option would have been appended),
                   we manually inject the delay property here with an explicit setTimeout. */
                if (opts.delay) {
                    setTimeout(buildQueue, opts.delay);
                } else {
                    buildQueue();
                }
            /* Otherwise, the call undergoes element queueing as normal. */
            /* Note: To interoperate with jQuery, Velocity uses jQuery's own $.queue() stack for queuing logic. */
            } else {
                $.queue(element, opts.queue, function(next, clearQueue) {
                    /* If the clearQueue flag was passed in by the stop command, resolve this call's promise. (Promises can only be resolved once,
                       so it's fine if this is repeatedly triggered for each element in the associated call.) */
                    if (clearQueue === true) {
                        if (promiseData.promise) {
                            promiseData.resolver(elements);
                        }

                        /* Do not continue with animation queueing. */
                        return true;
                    }

                    /* This flag indicates to the upcoming completeCall() function that this queue entry was initiated by Velocity.
                       See completeCall() for further details. */
                    Velocity.velocityQueueEntryFlag = true;

                    buildQueue(next);
                });
            }

            /*********************
                Auto-Dequeuing
            *********************/

            /* As per jQuery's $.queue() behavior, to fire the first non-custom-queue entry on an element, the element
               must be dequeued if its queue stack consists *solely* of the current call. (This can be determined by checking
               for the "inprogress" item that jQuery prepends to active queue stack arrays.) Regardless, whenever the element's
               queue is further appended with additional items -- including $.delay()'s or even $.animate() calls, the queue's
               first entry is automatically fired. This behavior contrasts that of custom queues, which never auto-fire. */
            /* Note: When an element set is being subjected to a non-parallel Velocity call, the animation will not begin until
               each one of the elements in the set has reached the end of its individually pre-existing queue chain. */
            /* Note: Unfortunately, most people don't fully grasp jQuery's powerful, yet quirky, $.queue() function.
               Lean more here: http://stackoverflow.com/questions/1058158/can-somebody-explain-jquery-queue-to-me */
            if ((opts.queue === "" || opts.queue === "fx") && $.queue(element)[0] !== "inprogress") {
                $.dequeue(element);
            }
        }

        /**************************
           Element Set Iteration
        **************************/

        /* If the "nodeType" property exists on the elements variable, we're animating a single element.
           Place it in an array so that $.each() can iterate over it. */
        $.each(elements, function(i, element) {
            /* Ensure each element in a set has a nodeType (is a real element) to avoid throwing errors. */
            if (Type.isNode(element)) {
                processElement.call(element);
            }
        });

        /******************
           Option: Loop
        ******************/

        /* The loop option accepts an integer indicating how many times the element should loop between the values in the
           current call's properties map and the element's property values prior to this call. */
        /* Note: The loop option's logic is performed here -- after element processing -- because the current call needs
           to undergo its queue insertion prior to the loop option generating its series of constituent "reverse" calls,
           which chain after the current call. Two reverse calls (two "alternations") constitute one loop. */
        var opts = $.extend({}, Velocity.defaults, options),
            reverseCallsCount;

        opts.loop = parseInt(opts.loop);
        reverseCallsCount = (opts.loop * 2) - 1;

        if (opts.loop) {
            /* Double the loop count to convert it into its appropriate number of "reverse" calls.
               Subtract 1 from the resulting value since the current call is included in the total alternation count. */
            for (var x = 0; x < reverseCallsCount; x++) {
                /* Since the logic for the reverse action occurs inside Queueing and therefore this call's options object
                   isn't parsed until then as well, the current call's delay option must be explicitly passed into the reverse
                   call so that the delay logic that occurs inside *Pre-Queueing* can process it. */
                var reverseOptions = {
                    delay: opts.delay,
                    progress: opts.progress
                };

                /* If a complete callback was passed into this call, transfer it to the loop redirect's final "reverse" call
                   so that it's triggered when the entire redirect is complete (and not when the very first animation is complete). */
                if (x === reverseCallsCount - 1) {
                    reverseOptions.display = opts.display;
                    reverseOptions.visibility = opts.visibility;
                    reverseOptions.complete = opts.complete;
                }

                animate(elements, "reverse", reverseOptions);
            }
        }

        /***************
            Chaining
        ***************/

        /* Return the elements back to the call chain, with wrapped elements taking precedence in case Velocity was called via the $.fn. extension. */
        return getChain();
    };

    /* Turn Velocity into the animation function, extended with the pre-existing Velocity object. */
    Velocity = $.extend(animate, Velocity);
    /* For legacy support, also expose the literal animate method. */
    Velocity.animate = animate;

    /**************
        Timing
    **************/

    /* Ticker function. */
    var ticker = window.requestAnimationFrame || rAFShim;

    /* Inactive browser tabs pause rAF, which results in all active animations immediately sprinting to their completion states when the tab refocuses.
       To get around this, we dynamically switch rAF to setTimeout (which the browser *doesn't* pause) when the tab loses focus. We skip this for mobile
       devices to avoid wasting battery power on inactive tabs. */
    /* Note: Tab focus detection doesn't work on older versions of IE, but that's okay since they don't support rAF to begin with. */
    if (!Velocity.State.isMobile && document.hidden !== undefined) {
        document.addEventListener("visibilitychange", function() {
            /* Reassign the rAF function (which the global tick() function uses) based on the tab's focus state. */
            if (document.hidden) {
                ticker = function(callback) {
                    /* The tick function needs a truthy first argument in order to pass its internal timestamp check. */
                    return setTimeout(function() { callback(true) }, 16);
                };

                /* The rAF loop has been paused by the browser, so we manually restart the tick. */
                tick();
            } else {
                ticker = window.requestAnimationFrame || rAFShim;
            }
        });
    }

    /************
        Tick
    ************/

    /* Note: All calls to Velocity are pushed to the Velocity.State.calls array, which is fully iterated through upon each tick. */
    function tick (timestamp) {
        /* An empty timestamp argument indicates that this is the first tick occurence since ticking was turned on.
           We leverage this metadata to fully ignore the first tick pass since RAF's initial pass is fired whenever
           the browser's next tick sync time occurs, which results in the first elements subjected to Velocity
           calls being animated out of sync with any elements animated immediately thereafter. In short, we ignore
           the first RAF tick pass so that elements being immediately consecutively animated -- instead of simultaneously animated
           by the same Velocity call -- are properly batched into the same initial RAF tick and consequently remain in sync thereafter. */
        if (timestamp) {
            /* We ignore RAF's high resolution timestamp since it can be significantly offset when the browser is
               under high stress; we opt for choppiness over allowing the browser to drop huge chunks of frames. */
            var timeCurrent = (new Date).getTime();

            /********************
               Call Iteration
            ********************/

            var callsLength = Velocity.State.calls.length;

            /* To speed up iterating over this array, it is compacted (falsey items -- calls that have completed -- are removed)
               when its length has ballooned to a point that can impact tick performance. This only becomes necessary when animation
               has been continuous with many elements over a long period of time; whenever all active calls are completed, completeCall() clears Velocity.State.calls. */
            if (callsLength > 10000) {
                Velocity.State.calls = compactSparseArray(Velocity.State.calls);
            }

            /* Iterate through each active call. */
            for (var i = 0; i < callsLength; i++) {
                /* When a Velocity call is completed, its Velocity.State.calls entry is set to false. Continue on to the next call. */
                if (!Velocity.State.calls[i]) {
                    continue;
                }

                /************************
                   Call-Wide Variables
                ************************/

                var callContainer = Velocity.State.calls[i],
                    call = callContainer[0],
                    opts = callContainer[2],
                    timeStart = callContainer[3],
                    firstTick = !!timeStart,
                    tweenDummyValue = null;

                /* If timeStart is undefined, then this is the first time that this call has been processed by tick().
                   We assign timeStart now so that its value is as close to the real animation start time as possible.
                   (Conversely, had timeStart been defined when this call was added to Velocity.State.calls, the delay
                   between that time and now would cause the first few frames of the tween to be skipped since
                   percentComplete is calculated relative to timeStart.) */
                /* Further, subtract 16ms (the approximate resolution of RAF) from the current time value so that the
                   first tick iteration isn't wasted by animating at 0% tween completion, which would produce the
                   same style value as the element's current value. */
                if (!timeStart) {
                    timeStart = Velocity.State.calls[i][3] = timeCurrent - 16;
                }

                /* The tween's completion percentage is relative to the tween's start time, not the tween's start value
                   (which would result in unpredictable tween durations since JavaScript's timers are not particularly accurate).
                   Accordingly, we ensure that percentComplete does not exceed 1. */
                var percentComplete = Math.min((timeCurrent - timeStart) / opts.duration, 1);

                /**********************
                   Element Iteration
                **********************/

                /* For every call, iterate through each of the elements in its set. */
                for (var j = 0, callLength = call.length; j < callLength; j++) {
                    var tweensContainer = call[j],
                        element = tweensContainer.element;

                    /* Check to see if this element has been deleted midway through the animation by checking for the
                       continued existence of its data cache. If it's gone, skip animating this element. */
                    if (!Data(element)) {
                        continue;
                    }

                    var transformPropertyExists = false;

                    /**********************************
                       Display & Visibility Toggling
                    **********************************/

                    /* If the display option is set to non-"none", set it upfront so that the element can become visible before tweening begins.
                       (Otherwise, display's "none" value is set in completeCall() once the animation has completed.) */
                    if (opts.display !== undefined && opts.display !== null && opts.display !== "none") {
                        if (opts.display === "flex") {
                            var flexValues = [ "-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex" ];

                            $.each(flexValues, function(i, flexValue) {
                                CSS.setPropertyValue(element, "display", flexValue);
                            });
                        }

                        CSS.setPropertyValue(element, "display", opts.display);
                    }

                    /* Same goes with the visibility option, but its "none" equivalent is "hidden". */
                    if (opts.visibility !== undefined && opts.visibility !== "hidden") {
                        CSS.setPropertyValue(element, "visibility", opts.visibility);
                    }

                    /************************
                       Property Iteration
                    ************************/

                    /* For every element, iterate through each property. */
                    for (var property in tweensContainer) {
                        /* Note: In addition to property tween data, tweensContainer contains a reference to its associated element. */
                        if (property !== "element") {
                            var tween = tweensContainer[property],
                                currentValue,
                                /* Easing can either be a pre-genereated function or a string that references a pre-registered easing
                                   on the Velocity.Easings object. In either case, return the appropriate easing *function*. */
                                easing = Type.isString(tween.easing) ? Velocity.Easings[tween.easing] : tween.easing;

                            /******************************
                               Current Value Calculation
                            ******************************/

                            /* If this is the last tick pass (if we've reached 100% completion for this tween),
                               ensure that currentValue is explicitly set to its target endValue so that it's not subjected to any rounding. */
                            if (percentComplete === 1) {
                                currentValue = tween.endValue;
                            /* Otherwise, calculate currentValue based on the current delta from startValue. */
                            } else {
                                var tweenDelta = tween.endValue - tween.startValue;
                                currentValue = tween.startValue + (tweenDelta * easing(percentComplete, opts, tweenDelta));

                                /* If no value change is occurring, don't proceed with DOM updating. */
                                if (!firstTick && (currentValue === tween.currentValue)) {
                                    continue;
                                }
                            }

                            tween.currentValue = currentValue;

                            /* If we're tweening a fake 'tween' property in order to log transition values, update the one-per-call variable so that
                               it can be passed into the progress callback. */
                            if (property === "tween") {
                                tweenDummyValue = currentValue;
                            } else {
                                /******************
                                   Hooks: Part I
                                ******************/

                                /* For hooked properties, the newly-updated rootPropertyValueCache is cached onto the element so that it can be used
                                   for subsequent hooks in this call that are associated with the same root property. If we didn't cache the updated
                                   rootPropertyValue, each subsequent update to the root property in this tick pass would reset the previous hook's
                                   updates to rootPropertyValue prior to injection. A nice performance byproduct of rootPropertyValue caching is that
                                   subsequently chained animations using the same hookRoot but a different hook can use this cached rootPropertyValue. */
                                if (CSS.Hooks.registered[property]) {
                                    var hookRoot = CSS.Hooks.getRoot(property),
                                        rootPropertyValueCache = Data(element).rootPropertyValueCache[hookRoot];

                                    if (rootPropertyValueCache) {
                                        tween.rootPropertyValue = rootPropertyValueCache;
                                    }
                                }

                                /*****************
                                    DOM Update
                                *****************/

                                /* setPropertyValue() returns an array of the property name and property value post any normalization that may have been performed. */
                                /* Note: To solve an IE<=8 positioning bug, the unit type is dropped when setting a property value of 0. */
                                var adjustedSetData = CSS.setPropertyValue(element, /* SET */
                                                                           property,
                                                                           tween.currentValue + (parseFloat(currentValue) === 0 ? "" : tween.unitType),
                                                                           tween.rootPropertyValue,
                                                                           tween.scrollData);

                                /*******************
                                   Hooks: Part II
                                *******************/

                                /* Now that we have the hook's updated rootPropertyValue (the post-processed value provided by adjustedSetData), cache it onto the element. */
                                if (CSS.Hooks.registered[property]) {
                                    /* Since adjustedSetData contains normalized data ready for DOM updating, the rootPropertyValue needs to be re-extracted from its normalized form. ?? */
                                    if (CSS.Normalizations.registered[hookRoot]) {
                                        Data(element).rootPropertyValueCache[hookRoot] = CSS.Normalizations.registered[hookRoot]("extract", null, adjustedSetData[1]);
                                    } else {
                                        Data(element).rootPropertyValueCache[hookRoot] = adjustedSetData[1];
                                    }
                                }

                                /***************
                                   Transforms
                                ***************/

                                /* Flag whether a transform property is being animated so that flushTransformCache() can be triggered once this tick pass is complete. */
                                if (adjustedSetData[0] === "transform") {
                                    transformPropertyExists = true;
                                }

                            }
                        }
                    }

                    /****************
                        mobileHA
                    ****************/

                    /* If mobileHA is enabled, set the translate3d transform to null to force hardware acceleration.
                       It's safe to override this property since Velocity doesn't actually support its animation (hooks are used in its place). */
                    if (opts.mobileHA) {
                        /* Don't set the null transform hack if we've already done so. */
                        if (Data(element).transformCache.translate3d === undefined) {
                            /* All entries on the transformCache object are later concatenated into a single transform string via flushTransformCache(). */
                            Data(element).transformCache.translate3d = "(0px, 0px, 0px)";

                            transformPropertyExists = true;
                        }
                    }

                    if (transformPropertyExists) {
                        CSS.flushTransformCache(element);
                    }
                }

                /* The non-"none" display value is only applied to an element once -- when its associated call is first ticked through.
                   Accordingly, it's set to false so that it isn't re-processed by this call in the next tick. */
                if (opts.display !== undefined && opts.display !== "none") {
                    Velocity.State.calls[i][2].display = false;
                }
                if (opts.visibility !== undefined && opts.visibility !== "hidden") {
                    Velocity.State.calls[i][2].visibility = false;
                }

                /* Pass the elements and the timing data (percentComplete, msRemaining, timeStart, tweenDummyValue) into the progress callback. */
                if (opts.progress) {
                    opts.progress.call(callContainer[1],
                                       callContainer[1],
                                       percentComplete,
                                       Math.max(0, (timeStart + opts.duration) - timeCurrent),
                                       timeStart,
                                       tweenDummyValue);
                }

                /* If this call has finished tweening, pass its index to completeCall() to handle call cleanup. */
                if (percentComplete === 1) {
                    completeCall(i);
                }
            }
        }

        /* Note: completeCall() sets the isTicking flag to false when the last call on Velocity.State.calls has completed. */
        if (Velocity.State.isTicking) {
            ticker(tick);
        }
    }

    /**********************
        Call Completion
    **********************/

    /* Note: Unlike tick(), which processes all active calls at once, call completion is handled on a per-call basis. */
    function completeCall (callIndex, isStopped) {
        /* Ensure the call exists. */
        if (!Velocity.State.calls[callIndex]) {
            return false;
        }

        /* Pull the metadata from the call. */
        var call = Velocity.State.calls[callIndex][0],
            elements = Velocity.State.calls[callIndex][1],
            opts = Velocity.State.calls[callIndex][2],
            resolver = Velocity.State.calls[callIndex][4];

        var remainingCallsExist = false;

        /*************************
           Element Finalization
        *************************/

        for (var i = 0, callLength = call.length; i < callLength; i++) {
            var element = call[i].element;

            /* If the user set display to "none" (intending to hide the element), set it now that the animation has completed. */
            /* Note: display:none isn't set when calls are manually stopped (via Velocity("stop"). */
            /* Note: Display gets ignored with "reverse" calls and infinite loops, since this behavior would be undesirable. */
            if (!isStopped && !opts.loop) {
                if (opts.display === "none") {
                    CSS.setPropertyValue(element, "display", opts.display);
                }

                if (opts.visibility === "hidden") {
                    CSS.setPropertyValue(element, "visibility", opts.visibility);
                }
            }

            /* If the element's queue is empty (if only the "inprogress" item is left at position 0) or if its queue is about to run
               a non-Velocity-initiated entry, turn off the isAnimating flag. A non-Velocity-initiatied queue entry's logic might alter
               an element's CSS values and thereby cause Velocity's cached value data to go stale. To detect if a queue entry was initiated by Velocity,
               we check for the existence of our special Velocity.queueEntryFlag declaration, which minifiers won't rename since the flag
               is assigned to jQuery's global $ object and thus exists out of Velocity's own scope. */
            if (opts.loop !== true && ($.queue(element)[1] === undefined || !/\.velocityQueueEntryFlag/i.test($.queue(element)[1]))) {
                /* The element may have been deleted. Ensure that its data cache still exists before acting on it. */
                if (Data(element)) {
                    Data(element).isAnimating = false;
                    /* Clear the element's rootPropertyValueCache, which will become stale. */
                    Data(element).rootPropertyValueCache = {};

                    var transformHAPropertyExists = false;
                    /* If any 3D transform subproperty is at its default value (regardless of unit type), remove it. */
                    $.each(CSS.Lists.transforms3D, function(i, transformName) {
                        var defaultValue = /^scale/.test(transformName) ? 1 : 0,
                            currentValue = Data(element).transformCache[transformName];

                        if (Data(element).transformCache[transformName] !== undefined && new RegExp("^\\(" + defaultValue + "[^.]").test(currentValue)) {
                            transformHAPropertyExists = true;

                            delete Data(element).transformCache[transformName];
                        }
                    });

                    /* Mobile devices have hardware acceleration removed at the end of the animation in order to avoid hogging the GPU's memory. */
                    if (opts.mobileHA) {
                        transformHAPropertyExists = true;
                        delete Data(element).transformCache.translate3d;
                    }

                    /* Flush the subproperty removals to the DOM. */
                    if (transformHAPropertyExists) {
                        CSS.flushTransformCache(element);
                    }

                    /* Remove the "velocity-animating" indicator class. */
                    CSS.Values.removeClass(element, "velocity-animating");
                }
            }

            /*********************
               Option: Complete
            *********************/

            /* Complete is fired once per call (not once per element) and is passed the full raw DOM element set as both its context and its first argument. */
            /* Note: Callbacks aren't fired when calls are manually stopped (via Velocity("stop"). */
            if (!isStopped && opts.complete && !opts.loop && (i === callLength - 1)) {
                /* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
                try {
                    opts.complete.call(elements, elements);
                } catch (error) {
                    setTimeout(function() { throw error; }, 1);
                }
            }

            /**********************
               Promise Resolving
            **********************/

            /* Note: Infinite loops don't return promises. */
            if (resolver && opts.loop !== true) {
                resolver(elements);
            }

            /****************************
               Option: Loop (Infinite)
            ****************************/

            if (Data(element) && opts.loop === true && !isStopped) {
                /* If a rotateX/Y/Z property is being animated to 360 deg with loop:true, swap tween start/end values to enable
                   continuous iterative rotation looping. (Otherise, the element would just rotate back and forth.) */
                $.each(Data(element).tweensContainer, function(propertyName, tweenContainer) {
                    if (/^rotate/.test(propertyName) && parseFloat(tweenContainer.endValue) === 360) {
                        tweenContainer.endValue = 0;
                        tweenContainer.startValue = 360;
                    }

                    if (/^backgroundPosition/.test(propertyName) && parseFloat(tweenContainer.endValue) === 100 && tweenContainer.unitType === "%") {
                        tweenContainer.endValue = 0;
                        tweenContainer.startValue = 100;
                    }
                });

                Velocity(element, "reverse", { loop: true, delay: opts.delay });
            }

            /***************
               Dequeueing
            ***************/

            /* Fire the next call in the queue so long as this call's queue wasn't set to false (to trigger a parallel animation),
               which would have already caused the next call to fire. Note: Even if the end of the animation queue has been reached,
               $.dequeue() must still be called in order to completely clear jQuery's animation queue. */
            if (opts.queue !== false) {
                $.dequeue(element, opts.queue);
            }
        }

        /************************
           Calls Array Cleanup
        ************************/

        /* Since this call is complete, set it to false so that the rAF tick skips it. This array is later compacted via compactSparseArray().
          (For performance reasons, the call is set to false instead of being deleted from the array: http://www.html5rocks.com/en/tutorials/speed/v8/) */
        Velocity.State.calls[callIndex] = false;

        /* Iterate through the calls array to determine if this was the final in-progress animation.
           If so, set a flag to end ticking and clear the calls array. */
        for (var j = 0, callsLength = Velocity.State.calls.length; j < callsLength; j++) {
            if (Velocity.State.calls[j] !== false) {
                remainingCallsExist = true;

                break;
            }
        }

        if (remainingCallsExist === false) {
            /* tick() will detect this flag upon its next iteration and subsequently turn itself off. */
            Velocity.State.isTicking = false;

            /* Clear the calls array so that its length is reset. */
            delete Velocity.State.calls;
            Velocity.State.calls = [];
        }
    }

    /******************
        Frameworks
    ******************/

    /* Both jQuery and Zepto allow their $.fn object to be extended to allow wrapped elements to be subjected to plugin calls.
       If either framework is loaded, register a "velocity" extension pointing to Velocity's core animate() method.  Velocity
       also registers itself onto a global container (window.jQuery || window.Zepto || window) so that certain features are
       accessible beyond just a per-element scope. This master object contains an .animate() method, which is later assigned to $.fn
       (if jQuery or Zepto are present). Accordingly, Velocity can both act on wrapped DOM elements and stand alone for targeting raw DOM elements. */
    global.Velocity = Velocity;

    if (global !== window) {
        /* Assign the element function to Velocity's core animate() method. */
        global.fn.velocity = animate;
        /* Assign the object function's defaults to Velocity's global defaults object. */
        global.fn.velocity.defaults = Velocity.defaults;
    }

    /***********************
       Packaged Redirects
    ***********************/

    /* slideUp, slideDown */
    $.each([ "Down", "Up" ], function(i, direction) {
        Velocity.Redirects["slide" + direction] = function (element, options, elementsIndex, elementsSize, elements, promiseData) {
            var opts = $.extend({}, options),
                begin = opts.begin,
                complete = opts.complete,
                computedValues = { height: "", marginTop: "", marginBottom: "", paddingTop: "", paddingBottom: "" },
                inlineValues = {};

            if (opts.display === undefined) {
                /* Show the element before slideDown begins and hide the element after slideUp completes. */
                /* Note: Inline elements cannot have dimensions animated, so they're reverted to inline-block. */
                opts.display = (direction === "Down" ? (Velocity.CSS.Values.getDisplayType(element) === "inline" ? "inline-block" : "block") : "none");
            }

            opts.begin = function() {
                /* If the user passed in a begin callback, fire it now. */
                begin && begin.call(elements, elements);

                /* Cache the elements' original vertical dimensional property values so that we can animate back to them. */
                for (var property in computedValues) {
                    inlineValues[property] = element.style[property];

                    /* For slideDown, use forcefeeding to animate all vertical properties from 0. For slideUp,
                       use forcefeeding to start from computed values and animate down to 0. */
                    var propertyValue = Velocity.CSS.getPropertyValue(element, property);
                    computedValues[property] = (direction === "Down") ? [ propertyValue, 0 ] : [ 0, propertyValue ];
                }

                /* Force vertical overflow content to clip so that sliding works as expected. */
                inlineValues.overflow = element.style.overflow;
                element.style.overflow = "hidden";
            }

            opts.complete = function() {
                /* Reset element to its pre-slide inline values once its slide animation is complete. */
                for (var property in inlineValues) {
                    element.style[property] = inlineValues[property];
                }

                /* If the user passed in a complete callback, fire it now. */
                complete && complete.call(elements, elements);
                promiseData && promiseData.resolver(elements);
            };

            Velocity(element, computedValues, opts);
        };
    });

    /* fadeIn, fadeOut */
    $.each([ "In", "Out" ], function(i, direction) {
        Velocity.Redirects["fade" + direction] = function (element, options, elementsIndex, elementsSize, elements, promiseData) {
            var opts = $.extend({}, options),
                propertiesMap = { opacity: (direction === "In") ? 1 : 0 },
                originalComplete = opts.complete;

            /* Since redirects are triggered individually for each element in the animated set, avoid repeatedly triggering
               callbacks by firing them only when the final element has been reached. */
            if (elementsIndex !== elementsSize - 1) {
                opts.complete = opts.begin = null;
            } else {
                opts.complete = function() {
                    if (originalComplete) {
                        originalComplete.call(elements, elements);
                    }

                    promiseData && promiseData.resolver(elements);
                }
            }

            /* If a display was passed in, use it. Otherwise, default to "none" for fadeOut or the element-specific default for fadeIn. */
            /* Note: We allow users to pass in "null" to skip display setting altogether. */
            if (opts.display === undefined) {
                opts.display = (direction === "In" ? "auto" : "none");
            }

            Velocity(this, propertiesMap, opts);
        };
    });

    return Velocity;
}((window.jQuery || window.Zepto || window), window, document);
}));

/******************
   Known Issues
******************/

/* The CSS spec mandates that the translateX/Y/Z transforms are %-relative to the element itself -- not its parent.
Velocity, however, doesn't make this distinction. Thus, converting to or from the % unit with these subproperties
will produce an inaccurate conversion value. The same issue exists with the cx/cy attributes of SVG circles and ellipses. */
},{}],2:[function(require,module,exports){
/**********************
   Velocity UI Pack
**********************/

/* VelocityJS.org UI Pack (5.0.4). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License. Portions copyright Daniel Eden, Christian Pucci. */

;(function (factory) {
    /* CommonJS module. */
    if (typeof require === "function" && typeof exports === "object" ) {
        module.exports = factory();
    /* AMD module. */
    } else if (typeof define === "function" && define.amd) {
        define([ "velocity" ], factory);
    /* Browser globals. */
    } else {
        factory();
    }
}(function() {
return function (global, window, document, undefined) {

    /*************
        Checks
    *************/

    if (!global.Velocity || !global.Velocity.Utilities) {
        window.console && console.log("Velocity UI Pack: Velocity must be loaded first. Aborting.");
        return;
    } else {
        var Velocity = global.Velocity,
            $ = Velocity.Utilities;
    }

    var velocityVersion = Velocity.version,
        requiredVersion = { major: 1, minor: 1, patch: 0 };

    function greaterSemver (primary, secondary) {
        var versionInts = [];

        if (!primary || !secondary) { return false; }

        $.each([ primary, secondary ], function(i, versionObject) {
            var versionIntsComponents = [];

            $.each(versionObject, function(component, value) {
                while (value.toString().length < 5) {
                    value = "0" + value;
                }
                versionIntsComponents.push(value);
            });

            versionInts.push(versionIntsComponents.join(""))
        });

        return (parseFloat(versionInts[0]) > parseFloat(versionInts[1]));
    }

    if (greaterSemver(requiredVersion, velocityVersion)){
        var abortError = "Velocity UI Pack: You need to update Velocity (jquery.velocity.js) to a newer version. Visit http://github.com/julianshapiro/velocity.";
        alert(abortError);
        throw new Error(abortError);
    }

    /************************
       Effect Registration
    ************************/

    /* Note: RegisterUI is a legacy name. */
    Velocity.RegisterEffect = Velocity.RegisterUI = function (effectName, properties) {
        /* Animate the expansion/contraction of the elements' parent's height for In/Out effects. */
        function animateParentHeight (elements, direction, totalDuration, stagger) {
            var totalHeightDelta = 0,
                parentNode;

            /* Sum the total height (including padding and margin) of all targeted elements. */
            $.each(elements.nodeType ? [ elements ] : elements, function(i, element) {
                if (stagger) {
                    /* Increase the totalDuration by the successive delay amounts produced by the stagger option. */
                    totalDuration += i * stagger;
                }

                parentNode = element.parentNode;

                $.each([ "height", "paddingTop", "paddingBottom", "marginTop", "marginBottom"], function(i, property) {
                    totalHeightDelta += parseFloat(Velocity.CSS.getPropertyValue(element, property));
                });
            });

            /* Animate the parent element's height adjustment (with a varying duration multiplier for aesthetic benefits). */
            Velocity.animate(
                parentNode,
                { height: (direction === "In" ? "+" : "-") + "=" + totalHeightDelta },
                { queue: false, easing: "ease-in-out", duration: totalDuration * (direction === "In" ? 0.6 : 1) }
            );
        }

        /* Register a custom redirect for each effect. */
        Velocity.Redirects[effectName] = function (element, redirectOptions, elementsIndex, elementsSize, elements, promiseData) {
            var finalElement = (elementsIndex === elementsSize - 1);

            if (typeof properties.defaultDuration === "function") {
                properties.defaultDuration = properties.defaultDuration.call(elements, elements);
            } else {
                properties.defaultDuration = parseFloat(properties.defaultDuration);
            }

            /* Iterate through each effect's call array. */
            for (var callIndex = 0; callIndex < properties.calls.length; callIndex++) {
                var call = properties.calls[callIndex],
                    propertyMap = call[0],
                    redirectDuration = (redirectOptions.duration || properties.defaultDuration || 1000),
                    durationPercentage = call[1],
                    callOptions = call[2] || {},
                    opts = {};

                /* Assign the whitelisted per-call options. */
                opts.duration = redirectDuration * (durationPercentage || 1);
                opts.queue = redirectOptions.queue || "";
                opts.easing = callOptions.easing || "ease";
                opts.delay = parseFloat(callOptions.delay) || 0;
                opts._cacheValues = callOptions._cacheValues || true;

                /* Special processing for the first effect call. */
                if (callIndex === 0) {
                    /* If a delay was passed into the redirect, combine it with the first call's delay. */
                    opts.delay += (parseFloat(redirectOptions.delay) || 0);

                    if (elementsIndex === 0) {
                        opts.begin = function() {
                            /* Only trigger a begin callback on the first effect call with the first element in the set. */
                            redirectOptions.begin && redirectOptions.begin.call(elements, elements);

                            var direction = effectName.match(/(In|Out)$/);

                            /* Make "in" transitioning elements invisible immediately so that there's no FOUC between now
                               and the first RAF tick. */
                            if ((direction && direction[0] === "In") && propertyMap.opacity !== undefined) {
                                $.each(elements.nodeType ? [ elements ] : elements, function(i, element) {
                                    Velocity.CSS.setPropertyValue(element, "opacity", 0);
                                });
                            }

                            /* Only trigger animateParentHeight() if we're using an In/Out transition. */
                            if (redirectOptions.animateParentHeight && direction) {
                                animateParentHeight(elements, direction[0], redirectDuration + opts.delay, redirectOptions.stagger);
                            }
                        }
                    }

                    /* If the user isn't overriding the display option, default to "auto" for "In"-suffixed transitions. */
                    if (redirectOptions.display !== null) {
                        if (redirectOptions.display !== undefined && redirectOptions.display !== "none") {
                            opts.display = redirectOptions.display;
                        } else if (/In$/.test(effectName)) {
                            /* Inline elements cannot be subjected to transforms, so we switch them to inline-block. */
                            var defaultDisplay = Velocity.CSS.Values.getDisplayType(element);
                            opts.display = (defaultDisplay === "inline") ? "inline-block" : defaultDisplay;
                        }
                    }

                    if (redirectOptions.visibility && redirectOptions.visibility !== "hidden") {
                        opts.visibility = redirectOptions.visibility;
                    }
                }

                /* Special processing for the last effect call. */
                if (callIndex === properties.calls.length - 1) {
                    /* Append promise resolving onto the user's redirect callback. */
                    function injectFinalCallbacks () {
                        if ((redirectOptions.display === undefined || redirectOptions.display === "none") && /Out$/.test(effectName)) {
                            $.each(elements.nodeType ? [ elements ] : elements, function(i, element) {
                                Velocity.CSS.setPropertyValue(element, "display", "none");
                            });
                        }

                        redirectOptions.complete && redirectOptions.complete.call(elements, elements);

                        if (promiseData) {
                            promiseData.resolver(elements || element);
                        }
                    }

                    opts.complete = function() {
                        if (properties.reset) {
                            for (var resetProperty in properties.reset) {
                                var resetValue = properties.reset[resetProperty];

                                /* Format each non-array value in the reset property map to [ value, value ] so that changes apply
                                   immediately and DOM querying is avoided (via forcefeeding). */
                                /* Note: Don't forcefeed hooks, otherwise their hook roots will be defaulted to their null values. */
                                if (Velocity.CSS.Hooks.registered[resetProperty] === undefined && (typeof resetValue === "string" || typeof resetValue === "number")) {
                                    properties.reset[resetProperty] = [ properties.reset[resetProperty], properties.reset[resetProperty] ];
                                }
                            }

                            /* So that the reset values are applied instantly upon the next rAF tick, use a zero duration and parallel queueing. */
                            var resetOptions = { duration: 0, queue: false };

                            /* Since the reset option uses up the complete callback, we trigger the user's complete callback at the end of ours. */
                            if (finalElement) {
                                resetOptions.complete = injectFinalCallbacks;
                            }

                            Velocity.animate(element, properties.reset, resetOptions);
                        /* Only trigger the user's complete callback on the last effect call with the last element in the set. */
                        } else if (finalElement) {
                            injectFinalCallbacks();
                        }
                    };

                    if (redirectOptions.visibility === "hidden") {
                        opts.visibility = redirectOptions.visibility;
                    }
                }

                Velocity.animate(element, propertyMap, opts);
            }
        };

        /* Return the Velocity object so that RegisterUI calls can be chained. */
        return Velocity;
    };

    /*********************
       Packaged Effects
    *********************/

    /* Externalize the packagedEffects data so that they can optionally be modified and re-registered. */
    /* Support: <=IE8: Callouts will have no effect, and transitions will simply fade in/out. IE9/Android 2.3: Most effects are fully supported, the rest fade in/out. All other browsers: full support. */
    Velocity.RegisterEffect.packagedEffects =
        {
            /* Animate.css */
            "callout.bounce": {
                defaultDuration: 550,
                calls: [
                    [ { translateY: -30 }, 0.25 ],
                    [ { translateY: 0 }, 0.125 ],
                    [ { translateY: -15 }, 0.125 ],
                    [ { translateY: 0 }, 0.25 ]
                ]
            },
            /* Animate.css */
            "callout.shake": {
                defaultDuration: 800,
                calls: [
                    [ { translateX: -11 }, 0.125 ],
                    [ { translateX: 11 }, 0.125 ],
                    [ { translateX: -11 }, 0.125 ],
                    [ { translateX: 11 }, 0.125 ],
                    [ { translateX: -11 }, 0.125 ],
                    [ { translateX: 11 }, 0.125 ],
                    [ { translateX: -11 }, 0.125 ],
                    [ { translateX: 0 }, 0.125 ]
                ]
            },
            /* Animate.css */
            "callout.flash": {
                defaultDuration: 1100,
                calls: [
                    [ { opacity: [ 0, "easeInOutQuad", 1 ] }, 0.25 ],
                    [ { opacity: [ 1, "easeInOutQuad" ] }, 0.25 ],
                    [ { opacity: [ 0, "easeInOutQuad" ] }, 0.25 ],
                    [ { opacity: [ 1, "easeInOutQuad" ] }, 0.25 ]
                ]
            },
            /* Animate.css */
            "callout.pulse": {
                defaultDuration: 825,
                calls: [
                    [ { scaleX: 1.1, scaleY: 1.1 }, 0.50, { easing: "easeInExpo" } ],
                    [ { scaleX: 1, scaleY: 1 }, 0.50 ]
                ]
            },
            /* Animate.css */
            "callout.swing": {
                defaultDuration: 950,
                calls: [
                    [ { rotateZ: 15 }, 0.20 ],
                    [ { rotateZ: -10 }, 0.20 ],
                    [ { rotateZ: 5 }, 0.20 ],
                    [ { rotateZ: -5 }, 0.20 ],
                    [ { rotateZ: 0 }, 0.20 ]
                ]
            },
            /* Animate.css */
            "callout.tada": {
                defaultDuration: 1000,
                calls: [
                    [ { scaleX: 0.9, scaleY: 0.9, rotateZ: -3 }, 0.10 ],
                    [ { scaleX: 1.1, scaleY: 1.1, rotateZ: 3 }, 0.10 ],
                    [ { scaleX: 1.1, scaleY: 1.1, rotateZ: -3 }, 0.10 ],
                    [ "reverse", 0.125 ],
                    [ "reverse", 0.125 ],
                    [ "reverse", 0.125 ],
                    [ "reverse", 0.125 ],
                    [ "reverse", 0.125 ],
                    [ { scaleX: 1, scaleY: 1, rotateZ: 0 }, 0.20 ]
                ]
            },
            "transition.fadeIn": {
                defaultDuration: 500,
                calls: [
                    [ { opacity: [ 1, 0 ] } ]
                ]
            },
            "transition.fadeOut": {
                defaultDuration: 500,
                calls: [
                    [ { opacity: [ 0, 1 ] } ]
                ]
            },
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.flipXIn": {
                defaultDuration: 700,
                calls: [
                    [ { opacity: [ 1, 0 ], transformPerspective: [ 800, 800 ], rotateY: [ 0, -55 ] } ]
                ],
                reset: { transformPerspective: 0 }
            },
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.flipXOut": {
                defaultDuration: 700,
                calls: [
                    [ { opacity: [ 0, 1 ], transformPerspective: [ 800, 800 ], rotateY: 55 } ]
                ],
                reset: { transformPerspective: 0, rotateY: 0 }
            },
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.flipYIn": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 1, 0 ], transformPerspective: [ 800, 800 ], rotateX: [ 0, -45 ] } ]
                ],
                reset: { transformPerspective: 0 }
            },
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.flipYOut": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 0, 1 ], transformPerspective: [ 800, 800 ], rotateX: 25 } ]
                ],
                reset: { transformPerspective: 0, rotateX: 0 }
            },
            /* Animate.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.flipBounceXIn": {
                defaultDuration: 900,
                calls: [
                    [ { opacity: [ 0.725, 0 ], transformPerspective: [ 400, 400 ], rotateY: [ -10, 90 ] }, 0.50 ],
                    [ { opacity: 0.80, rotateY: 10 }, 0.25 ],
                    [ { opacity: 1, rotateY: 0 }, 0.25 ]
                ],
                reset: { transformPerspective: 0 }
            },
            /* Animate.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.flipBounceXOut": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 0.9, 1 ], transformPerspective: [ 400, 400 ], rotateY: -10 }, 0.50 ],
                    [ { opacity: 0, rotateY: 90 }, 0.50 ]
                ],
                reset: { transformPerspective: 0, rotateY: 0 }
            },
            /* Animate.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.flipBounceYIn": {
                defaultDuration: 850,
                calls: [
                    [ { opacity: [ 0.725, 0 ], transformPerspective: [ 400, 400 ], rotateX: [ -10, 90 ] }, 0.50 ],
                    [ { opacity: 0.80, rotateX: 10 }, 0.25 ],
                    [ { opacity: 1, rotateX: 0 }, 0.25 ]
                ],
                reset: { transformPerspective: 0 }
            },
            /* Animate.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.flipBounceYOut": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 0.9, 1 ], transformPerspective: [ 400, 400 ], rotateX: -15 }, 0.50 ],
                    [ { opacity: 0, rotateX: 90 }, 0.50 ]
                ],
                reset: { transformPerspective: 0, rotateX: 0 }
            },
            /* Magic.css */
            "transition.swoopIn": {
                defaultDuration: 850,
                calls: [
                    [ { opacity: [ 1, 0 ], transformOriginX: [ "100%", "50%" ], transformOriginY: [ "100%", "100%" ], scaleX: [ 1, 0 ], scaleY: [ 1, 0 ], translateX: [ 0, -700 ], translateZ: 0 } ]
                ],
                reset: { transformOriginX: "50%", transformOriginY: "50%" }
            },
            /* Magic.css */
            "transition.swoopOut": {
                defaultDuration: 850,
                calls: [
                    [ { opacity: [ 0, 1 ], transformOriginX: [ "50%", "100%" ], transformOriginY: [ "100%", "100%" ], scaleX: 0, scaleY: 0, translateX: -700, translateZ: 0 } ]
                ],
                reset: { transformOriginX: "50%", transformOriginY: "50%", scaleX: 1, scaleY: 1, translateX: 0 }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3. (Fades and scales only.) */
            "transition.whirlIn": {
                defaultDuration: 850,
                calls: [
                    [ { opacity: [ 1, 0 ], transformOriginX: [ "50%", "50%" ], transformOriginY: [ "50%", "50%" ], scaleX: [ 1, 0 ], scaleY: [ 1, 0 ], rotateY: [ 0, 160 ] }, 1, { easing: "easeInOutSine" } ]
                ]
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3. (Fades and scales only.) */
            "transition.whirlOut": {
                defaultDuration: 750,
                calls: [
                    [ { opacity: [ 0, "easeInOutQuint", 1 ], transformOriginX: [ "50%", "50%" ], transformOriginY: [ "50%", "50%" ], scaleX: 0, scaleY: 0, rotateY: 160 }, 1, { easing: "swing" } ]
                ],
                reset: { scaleX: 1, scaleY: 1, rotateY: 0 }
            },
            "transition.shrinkIn": {
                defaultDuration: 750,
                calls: [
                    [ { opacity: [ 1, 0 ], transformOriginX: [ "50%", "50%" ], transformOriginY: [ "50%", "50%" ], scaleX: [ 1, 1.5 ], scaleY: [ 1, 1.5 ], translateZ: 0 } ]
                ]
            },
            "transition.shrinkOut": {
                defaultDuration: 600,
                calls: [
                    [ { opacity: [ 0, 1 ], transformOriginX: [ "50%", "50%" ], transformOriginY: [ "50%", "50%" ], scaleX: 1.3, scaleY: 1.3, translateZ: 0 } ]
                ],
                reset: { scaleX: 1, scaleY: 1 }
            },
            "transition.expandIn": {
                defaultDuration: 700,
                calls: [
                    [ { opacity: [ 1, 0 ], transformOriginX: [ "50%", "50%" ], transformOriginY: [ "50%", "50%" ], scaleX: [ 1, 0.625 ], scaleY: [ 1, 0.625 ], translateZ: 0 } ]
                ]
            },
            "transition.expandOut": {
                defaultDuration: 700,
                calls: [
                    [ { opacity: [ 0, 1 ], transformOriginX: [ "50%", "50%" ], transformOriginY: [ "50%", "50%" ], scaleX: 0.5, scaleY: 0.5, translateZ: 0 } ]
                ],
                reset: { scaleX: 1, scaleY: 1 }
            },
            /* Animate.css */
            "transition.bounceIn": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 1, 0 ], scaleX: [ 1.05, 0.3 ], scaleY: [ 1.05, 0.3 ] }, 0.40 ],
                    [ { scaleX: 0.9, scaleY: 0.9, translateZ: 0 }, 0.20 ],
                    [ { scaleX: 1, scaleY: 1 }, 0.50 ]
                ]
            },
            /* Animate.css */
            "transition.bounceOut": {
                defaultDuration: 800,
                calls: [
                    [ { scaleX: 0.95, scaleY: 0.95 }, 0.35 ],
                    [ { scaleX: 1.1, scaleY: 1.1, translateZ: 0 }, 0.35 ],
                    [ { opacity: [ 0, 1 ], scaleX: 0.3, scaleY: 0.3 }, 0.30 ]
                ],
                reset: { scaleX: 1, scaleY: 1 }
            },
            /* Animate.css */
            "transition.bounceUpIn": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 1, 0 ], translateY: [ -30, 1000 ] }, 0.60, { easing: "easeOutCirc" } ],
                    [ { translateY: 10 }, 0.20 ],
                    [ { translateY: 0 }, 0.20 ]
                ]
            },
            /* Animate.css */
            "transition.bounceUpOut": {
                defaultDuration: 1000,
                calls: [
                    [ { translateY: 20 }, 0.20 ],
                    [ { opacity: [ 0, "easeInCirc", 1 ], translateY: -1000 }, 0.80 ]
                ],
                reset: { translateY: 0 }
            },
            /* Animate.css */
            "transition.bounceDownIn": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 1, 0 ], translateY: [ 30, -1000 ] }, 0.60, { easing: "easeOutCirc" } ],
                    [ { translateY: -10 }, 0.20 ],
                    [ { translateY: 0 }, 0.20 ]
                ]
            },
            /* Animate.css */
            "transition.bounceDownOut": {
                defaultDuration: 1000,
                calls: [
                    [ { translateY: -20 }, 0.20 ],
                    [ { opacity: [ 0, "easeInCirc", 1 ], translateY: 1000 }, 0.80 ]
                ],
                reset: { translateY: 0 }
            },
            /* Animate.css */
            "transition.bounceLeftIn": {
                defaultDuration: 750,
                calls: [
                    [ { opacity: [ 1, 0 ], translateX: [ 30, -1250 ] }, 0.60, { easing: "easeOutCirc" } ],
                    [ { translateX: -10 }, 0.20 ],
                    [ { translateX: 0 }, 0.20 ]
                ]
            },
            /* Animate.css */
            "transition.bounceLeftOut": {
                defaultDuration: 750,
                calls: [
                    [ { translateX: 30 }, 0.20 ],
                    [ { opacity: [ 0, "easeInCirc", 1 ], translateX: -1250 }, 0.80 ]
                ],
                reset: { translateX: 0 }
            },
            /* Animate.css */
            "transition.bounceRightIn": {
                defaultDuration: 750,
                calls: [
                    [ { opacity: [ 1, 0 ], translateX: [ -30, 1250 ] }, 0.60, { easing: "easeOutCirc" } ],
                    [ { translateX: 10 }, 0.20 ],
                    [ { translateX: 0 }, 0.20 ]
                ]
            },
            /* Animate.css */
            "transition.bounceRightOut": {
                defaultDuration: 750,
                calls: [
                    [ { translateX: -30 }, 0.20 ],
                    [ { opacity: [ 0, "easeInCirc", 1 ], translateX: 1250 }, 0.80 ]
                ],
                reset: { translateX: 0 }
            },
            "transition.slideUpIn": {
                defaultDuration: 900,
                calls: [
                    [ { opacity: [ 1, 0 ], translateY: [ 0, 20 ], translateZ: 0 } ]
                ]
            },
            "transition.slideUpOut": {
                defaultDuration: 900,
                calls: [
                    [ { opacity: [ 0, 1 ], translateY: -20, translateZ: 0 } ]
                ],
                reset: { translateY: 0 }
            },
            "transition.slideDownIn": {
                defaultDuration: 900,
                calls: [
                    [ { opacity: [ 1, 0 ], translateY: [ 0, -20 ], translateZ: 0 } ]
                ]
            },
            "transition.slideDownOut": {
                defaultDuration: 900,
                calls: [
                    [ { opacity: [ 0, 1 ], translateY: 20, translateZ: 0 } ]
                ],
                reset: { translateY: 0 }
            },
            "transition.slideLeftIn": {
                defaultDuration: 1000,
                calls: [
                    [ { opacity: [ 1, 0 ], translateX: [ 0, -20 ], translateZ: 0 } ]
                ]
            },
            "transition.slideLeftOut": {
                defaultDuration: 1050,
                calls: [
                    [ { opacity: [ 0, 1 ], translateX: -20, translateZ: 0 } ]
                ],
                reset: { translateX: 0 }
            },
            "transition.slideRightIn": {
                defaultDuration: 1000,
                calls: [
                    [ { opacity: [ 1, 0 ], translateX: [ 0, 20 ], translateZ: 0 } ]
                ]
            },
            "transition.slideRightOut": {
                defaultDuration: 1050,
                calls: [
                    [ { opacity: [ 0, 1 ], translateX: 20, translateZ: 0 } ]
                ],
                reset: { translateX: 0 }
            },
            "transition.slideUpBigIn": {
                defaultDuration: 850,
                calls: [
                    [ { opacity: [ 1, 0 ], translateY: [ 0, 75 ], translateZ: 0 } ]
                ]
            },
            "transition.slideUpBigOut": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 0, 1 ], translateY: -75, translateZ: 0 } ]
                ],
                reset: { translateY: 0 }
            },
            "transition.slideDownBigIn": {
                defaultDuration: 850,
                calls: [
                    [ { opacity: [ 1, 0 ], translateY: [ 0, -75 ], translateZ: 0 } ]
                ]
            },
            "transition.slideDownBigOut": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 0, 1 ], translateY: 75, translateZ: 0 } ]
                ],
                reset: { translateY: 0 }
            },
            "transition.slideLeftBigIn": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 1, 0 ], translateX: [ 0, -75 ], translateZ: 0 } ]
                ]
            },
            "transition.slideLeftBigOut": {
                defaultDuration: 750,
                calls: [
                    [ { opacity: [ 0, 1 ], translateX: -75, translateZ: 0 } ]
                ],
                reset: { translateX: 0 }
            },
            "transition.slideRightBigIn": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 1, 0 ], translateX: [ 0, 75 ], translateZ: 0 } ]
                ]
            },
            "transition.slideRightBigOut": {
                defaultDuration: 750,
                calls: [
                    [ { opacity: [ 0, 1 ], translateX: 75, translateZ: 0 } ]
                ],
                reset: { translateX: 0 }
            },
            /* Magic.css */
            "transition.perspectiveUpIn": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 1, 0 ], transformPerspective: [ 800, 800 ], transformOriginX: [ 0, 0 ], transformOriginY: [ "100%", "100%" ], rotateX: [ 0, -180 ] } ]
                ],
                reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%" }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.perspectiveUpOut": {
                defaultDuration: 850,
                calls: [
                    [ { opacity: [ 0, 1 ], transformPerspective: [ 800, 800 ], transformOriginX: [ 0, 0 ], transformOriginY: [ "100%", "100%" ], rotateX: -180 } ]
                ],
                reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%", rotateX: 0 }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.perspectiveDownIn": {
                defaultDuration: 800,
                calls: [
                    [ { opacity: [ 1, 0 ], transformPerspective: [ 800, 800 ], transformOriginX: [ 0, 0 ], transformOriginY: [ 0, 0 ], rotateX: [ 0, 180 ] } ]
                ],
                reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%" }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.perspectiveDownOut": {
                defaultDuration: 850,
                calls: [
                    [ { opacity: [ 0, 1 ], transformPerspective: [ 800, 800 ], transformOriginX: [ 0, 0 ], transformOriginY: [ 0, 0 ], rotateX: 180 } ]
                ],
                reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%", rotateX: 0 }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.perspectiveLeftIn": {
                defaultDuration: 950,
                calls: [
                    [ { opacity: [ 1, 0 ], transformPerspective: [ 2000, 2000 ], transformOriginX: [ 0, 0 ], transformOriginY: [ 0, 0 ], rotateY: [ 0, -180 ] } ]
                ],
                reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%" }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.perspectiveLeftOut": {
                defaultDuration: 950,
                calls: [
                    [ { opacity: [ 0, 1 ], transformPerspective: [ 2000, 2000 ], transformOriginX: [ 0, 0 ], transformOriginY: [ 0, 0 ], rotateY: -180 } ]
                ],
                reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%", rotateY: 0 }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.perspectiveRightIn": {
                defaultDuration: 950,
                calls: [
                    [ { opacity: [ 1, 0 ], transformPerspective: [ 2000, 2000 ], transformOriginX: [ "100%", "100%" ], transformOriginY: [ 0, 0 ], rotateY: [ 0, 180 ] } ]
                ],
                reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%" }
            },
            /* Magic.css */
            /* Support: Loses rotation in IE9/Android 2.3 (fades only). */
            "transition.perspectiveRightOut": {
                defaultDuration: 950,
                calls: [
                    [ { opacity: [ 0, 1 ], transformPerspective: [ 2000, 2000 ], transformOriginX: [ "100%", "100%" ], transformOriginY: [ 0, 0 ], rotateY: 180 } ]
                ],
                reset: { transformPerspective: 0, transformOriginX: "50%", transformOriginY: "50%", rotateY: 0 }
            }
        };

    /* Register the packaged effects. */
    for (var effectName in Velocity.RegisterEffect.packagedEffects) {
        Velocity.RegisterEffect(effectName, Velocity.RegisterEffect.packagedEffects[effectName]);
    }

    /*********************
       Sequence Running
    **********************/

    /* Note: Sequence calls must use Velocity's single-object arguments syntax. */
    Velocity.RunSequence = function (originalSequence) {
        var sequence = $.extend(true, [], originalSequence);

        if (sequence.length > 1) {
            $.each(sequence.reverse(), function(i, currentCall) {
                var nextCall = sequence[i + 1];

                if (nextCall) {
                    /* Parallel sequence calls (indicated via sequenceQueue:false) are triggered
                       in the previous call's begin callback. Otherwise, chained calls are normally triggered
                       in the previous call's complete callback. */
                    var currentCallOptions = currentCall.o || currentCall.options,
                        nextCallOptions = nextCall.o || nextCall.options;

                    var timing = (currentCallOptions && currentCallOptions.sequenceQueue === false) ? "begin" : "complete",
                        callbackOriginal = nextCallOptions && nextCallOptions[timing],
                        options = {};

                    options[timing] = function() {
                        var nextCallElements = nextCall.e || nextCall.elements;
                        var elements = nextCallElements.nodeType ? [ nextCallElements ] : nextCallElements;

                        callbackOriginal && callbackOriginal.call(elements, elements);
                        Velocity(currentCall);
                    }

                    if (nextCall.o) {
                        nextCall.o = $.extend({}, nextCallOptions, options);
                    } else {
                        nextCall.options = $.extend({}, nextCallOptions, options);
                    }
                }
            });

            sequence.reverse();
        }

        Velocity(sequence[0]);
    };
}((window.jQuery || window.Zepto || window), window, document);
}));
},{}],3:[function(require,module,exports){
var Velocity;

Velocity = require('velocity-animate');

require('velocity-animate/velocity.ui');

document.addEventListener("DOMContentLoaded", function(event) {
  var cog1, cog2, cog3, cog4, cog5, cog6, hero, heroFixed, keyDown, keyLeft, keyRight, keyUp, mySequence, parallax;
  keyDown = document.querySelectorAll(".chiclet.down.arrow.key");
  keyLeft = document.querySelectorAll(".chiclet.left.arrow.key");
  keyUp = document.querySelectorAll(".chiclet.up.arrow.key");
  keyRight = document.querySelectorAll(".chiclet.right.arrow.key");
  mySequence = [
    {
      e: keyDown,
      p: {
        opacity: 0
      },
      o: {
        duration: 700,
        delay: 1000
      }
    }, {
      e: keyUp,
      p: {
        opacity: 1
      },
      o: {
        duration: 700,
        sequenceQueue: false
      }
    }, {
      e: keyUp,
      p: {
        opacity: 0
      },
      o: {
        duration: 700,
        delay: 1000
      }
    }, {
      e: keyLeft,
      p: {
        opacity: 1
      },
      o: {
        duration: 700,
        sequenceQueue: false
      }
    }, {
      e: keyLeft,
      p: {
        opacity: 0
      },
      o: {
        duration: 700,
        delay: 1000
      }
    }, {
      e: keyRight,
      p: {
        opacity: 1
      },
      o: {
        duration: 700,
        sequenceQueue: false
      }
    }, {
      e: keyRight,
      p: {
        opacity: 0
      },
      o: {
        duration: 700,
        delay: 1000
      }
    }, {
      e: keyDown,
      p: {
        opacity: 1
      },
      o: {
        duration: 700,
        sequenceQueue: false
      }
    }
  ];
  Velocity.RunSequence(mySequence);
  setInterval(function() {
    return Velocity.RunSequence(mySequence);
  }, 8000);
  cog1 = document.querySelector('.cog.one');
  cog2 = document.querySelector('.cog.two');
  cog3 = document.querySelector('.cog.three');
  cog4 = document.querySelector('.cog.four');
  cog5 = document.querySelector('.cog.five');
  cog6 = document.querySelector('.cog.six');
  hero = document.querySelector('.section.hero > .container');
  heroFixed = document.querySelector('.hero.parallax');
  parallax = function() {
    var degrees, heroOffset, offset;
    window.requestAnimationFrame(parallax);
    offset = Math.max(window.pageYOffset, 0);
    degrees = Math.round(offset * 0.1);
    cog1.style.transform = "rotate(-" + degrees + "deg)";
    cog2.style.transform = "rotate(" + degrees + "deg)";
    cog3.style.transform = "rotate(" + degrees + "deg)";
    cog4.style.transform = "rotate(" + degrees + "deg)";
    cog5.style.transform = "rotate(-" + degrees + "deg)";
    cog6.style.transform = "rotate(-" + degrees + "deg)";
    heroOffset = Math.round(-offset * 0.44);
    return heroFixed.style.transform = "translate3d(0," + heroOffset + "px,0)";
  };
  return window.requestAnimationFrame(parallax);
});

window.addEventListener("load", function(event) {
  var mixpanel_id;
  mixpanel.people.set({
    $created: new Date()
  });
  mixpanel_id = mixpanel.get_distinct_id();
  mixpanel.track('Welcome Page Displayed', {
    'Mixpanel: User ID': mixpanel_id
  });
  return chrome.runtime.setUninstallURL('https://smoothkeyscroll.herokuapp.com/uninstalled?id=' + mixpanel_id);
});


},{"velocity-animate":1,"velocity-animate/velocity.ui":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvdmVsb2NpdHktYW5pbWF0ZS92ZWxvY2l0eS5qcyIsIm5vZGVfbW9kdWxlcy92ZWxvY2l0eS1hbmltYXRlL3ZlbG9jaXR5LnVpLmpzIiwiL1VzZXJzL3VzZXIvV29yay9zbW9vdGhrZXlzY3JvbGwvZXh0ZW5zaW9uL2Nocm9tZS1leHRlbnNpb24vc3JjL2pzL3dlbGNvbWUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN3lIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDenZCQSxJQUFBOztBQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsa0JBQVI7O0FBQ1gsT0FBQSxDQUFRLDhCQUFSOztBQUVBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsU0FBQyxLQUFEO0FBQzdDLE1BQUE7RUFBQSxPQUFBLEdBQVUsUUFBUSxDQUFDLGdCQUFULENBQTBCLHlCQUExQjtFQUNWLE9BQUEsR0FBVSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIseUJBQTFCO0VBQ1YsS0FBQSxHQUFRLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQix1QkFBMUI7RUFDUixRQUFBLEdBQVcsUUFBUSxDQUFDLGdCQUFULENBQTBCLDBCQUExQjtFQUVYLFVBQUEsR0FBYTtJQUNUO01BQUUsQ0FBQSxFQUFHLE9BQUw7TUFBYyxDQUFBLEVBQUc7UUFBRSxPQUFBLEVBQVMsQ0FBWDtPQUFqQjtNQUFpQyxDQUFBLEVBQUc7UUFBRSxRQUFBLEVBQVUsR0FBWjtRQUFpQixLQUFBLEVBQU8sSUFBeEI7T0FBcEM7S0FEUyxFQUVUO01BQUUsQ0FBQSxFQUFHLEtBQUw7TUFBWSxDQUFBLEVBQUc7UUFBRSxPQUFBLEVBQVMsQ0FBWDtPQUFmO01BQStCLENBQUEsRUFBRztRQUFFLFFBQUEsRUFBVSxHQUFaO1FBQWlCLGFBQUEsRUFBYyxLQUEvQjtPQUFsQztLQUZTLEVBR1Q7TUFBRSxDQUFBLEVBQUcsS0FBTDtNQUFZLENBQUEsRUFBRztRQUFFLE9BQUEsRUFBUyxDQUFYO09BQWY7TUFBK0IsQ0FBQSxFQUFHO1FBQUUsUUFBQSxFQUFVLEdBQVo7UUFBaUIsS0FBQSxFQUFPLElBQXhCO09BQWxDO0tBSFMsRUFJVDtNQUFFLENBQUEsRUFBRyxPQUFMO01BQWMsQ0FBQSxFQUFHO1FBQUUsT0FBQSxFQUFTLENBQVg7T0FBakI7TUFBaUMsQ0FBQSxFQUFHO1FBQUUsUUFBQSxFQUFVLEdBQVo7UUFBaUIsYUFBQSxFQUFjLEtBQS9CO09BQXBDO0tBSlMsRUFLVDtNQUFFLENBQUEsRUFBRyxPQUFMO01BQWMsQ0FBQSxFQUFHO1FBQUUsT0FBQSxFQUFTLENBQVg7T0FBakI7TUFBaUMsQ0FBQSxFQUFHO1FBQUUsUUFBQSxFQUFVLEdBQVo7UUFBaUIsS0FBQSxFQUFPLElBQXhCO09BQXBDO0tBTFMsRUFNVDtNQUFFLENBQUEsRUFBRyxRQUFMO01BQWUsQ0FBQSxFQUFHO1FBQUUsT0FBQSxFQUFTLENBQVg7T0FBbEI7TUFBa0MsQ0FBQSxFQUFHO1FBQUUsUUFBQSxFQUFVLEdBQVo7UUFBaUIsYUFBQSxFQUFjLEtBQS9CO09BQXJDO0tBTlMsRUFPVDtNQUFFLENBQUEsRUFBRyxRQUFMO01BQWUsQ0FBQSxFQUFHO1FBQUUsT0FBQSxFQUFTLENBQVg7T0FBbEI7TUFBa0MsQ0FBQSxFQUFHO1FBQUUsUUFBQSxFQUFVLEdBQVo7UUFBaUIsS0FBQSxFQUFPLElBQXhCO09BQXJDO0tBUFMsRUFRVDtNQUFFLENBQUEsRUFBRyxPQUFMO01BQWMsQ0FBQSxFQUFHO1FBQUUsT0FBQSxFQUFTLENBQVg7T0FBakI7TUFBaUMsQ0FBQSxFQUFHO1FBQUUsUUFBQSxFQUFVLEdBQVo7UUFBaUIsYUFBQSxFQUFjLEtBQS9CO09BQXBDO0tBUlM7O0VBV2IsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsVUFBckI7RUFDQSxXQUFBLENBQWEsU0FBQTtXQUNYLFFBQVEsQ0FBQyxXQUFULENBQXFCLFVBQXJCO0VBRFcsQ0FBYixFQUVFLElBRkY7RUFLQSxJQUFBLEdBQU8sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsVUFBdkI7RUFDUCxJQUFBLEdBQU8sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsVUFBdkI7RUFDUCxJQUFBLEdBQU8sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsWUFBdkI7RUFDUCxJQUFBLEdBQU8sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsV0FBdkI7RUFDUCxJQUFBLEdBQU8sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsV0FBdkI7RUFDUCxJQUFBLEdBQU8sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsVUFBdkI7RUFDUCxJQUFBLEdBQU8sUUFBUSxDQUFDLGFBQVQsQ0FBdUIsNEJBQXZCO0VBQ1AsU0FBQSxHQUFZLFFBQVEsQ0FBQyxhQUFULENBQXVCLGdCQUF2QjtFQUlaLFFBQUEsR0FBVyxTQUFBO0FBQ1YsUUFBQTtJQUFBLE1BQU0sQ0FBQyxxQkFBUCxDQUE2QixRQUE3QjtJQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsR0FBTCxDQUFTLE1BQU0sQ0FBQyxXQUFoQixFQUE2QixDQUE3QjtJQUVULE9BQUEsR0FBVSxJQUFJLENBQUMsS0FBTCxDQUFXLE1BQUEsR0FBUyxHQUFwQjtJQUNWLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBWCxHQUF1QixVQUFBLEdBQVcsT0FBWCxHQUFtQjtJQUMxQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVgsR0FBdUIsU0FBQSxHQUFVLE9BQVYsR0FBa0I7SUFDekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFYLEdBQXVCLFNBQUEsR0FBVSxPQUFWLEdBQWtCO0lBQ3pDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBWCxHQUF1QixTQUFBLEdBQVUsT0FBVixHQUFrQjtJQUN6QyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVgsR0FBdUIsVUFBQSxHQUFXLE9BQVgsR0FBbUI7SUFDMUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFYLEdBQXVCLFVBQUEsR0FBVyxPQUFYLEdBQW1CO0lBSzFDLFVBQUEsR0FBYSxJQUFJLENBQUMsS0FBTCxDQUFXLENBQUMsTUFBRCxHQUFVLElBQXJCO1dBQ2IsU0FBUyxDQUFDLEtBQUssQ0FBQyxTQUFoQixHQUE0QixnQkFBQSxHQUFpQixVQUFqQixHQUE0QjtFQWhCOUM7U0FtQlgsTUFBTSxDQUFDLHFCQUFQLENBQTZCLFFBQTdCO0FBckQ2QyxDQUE5Qzs7QUF1REEsTUFBTSxDQUFDLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLFNBQUMsS0FBRDtBQUMvQixNQUFBO0VBQUEsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFoQixDQUFvQjtJQUFFLFFBQUEsRUFBYyxJQUFBLElBQUEsQ0FBQSxDQUFoQjtHQUFwQjtFQUNBLFdBQUEsR0FBYyxRQUFRLENBQUMsZUFBVCxDQUFBO0VBQ2QsUUFBUSxDQUFDLEtBQVQsQ0FBZSx3QkFBZixFQUF5QztJQUFDLG1CQUFBLEVBQXFCLFdBQXRCO0dBQXpDO1NBQ0EsTUFBTSxDQUFDLE9BQU8sQ0FBQyxlQUFmLENBQStCLHVEQUFBLEdBQTBELFdBQXpGO0FBSitCLENBQWhDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qISBWZWxvY2l0eUpTLm9yZyAoMS4yLjMpLiAoQykgMjAxNCBKdWxpYW4gU2hhcGlyby4gTUlUIEBsaWNlbnNlOiBlbi53aWtpcGVkaWEub3JnL3dpa2kvTUlUX0xpY2Vuc2UgKi9cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKipcbiAgIFZlbG9jaXR5IGpRdWVyeSBTaGltXG4qKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4vKiEgVmVsb2NpdHlKUy5vcmcgalF1ZXJ5IFNoaW0gKDEuMC4xKS4gKEMpIDIwMTQgVGhlIGpRdWVyeSBGb3VuZGF0aW9uLiBNSVQgQGxpY2Vuc2U6IGVuLndpa2lwZWRpYS5vcmcvd2lraS9NSVRfTGljZW5zZS4gKi9cblxuLyogVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBqUXVlcnkgZnVuY3Rpb25zIHRoYXQgVmVsb2NpdHkgcmVsaWVzIG9uLCB0aGVyZWJ5IHJlbW92aW5nIFZlbG9jaXR5J3MgZGVwZW5kZW5jeSBvbiBhIGZ1bGwgY29weSBvZiBqUXVlcnksIGFuZCBhbGxvd2luZyBpdCB0byB3b3JrIGluIGFueSBlbnZpcm9ubWVudC4gKi9cbi8qIFRoZXNlIHNoaW1tZWQgZnVuY3Rpb25zIGFyZSBvbmx5IHVzZWQgaWYgalF1ZXJ5IGlzbid0IHByZXNlbnQuIElmIGJvdGggdGhpcyBzaGltIGFuZCBqUXVlcnkgYXJlIGxvYWRlZCwgVmVsb2NpdHkgZGVmYXVsdHMgdG8galF1ZXJ5IHByb3Blci4gKi9cbi8qIEJyb3dzZXIgc3VwcG9ydDogVXNpbmcgdGhpcyBzaGltIGluc3RlYWQgb2YgalF1ZXJ5IHByb3BlciByZW1vdmVzIHN1cHBvcnQgZm9yIElFOC4gKi9cblxuOyhmdW5jdGlvbiAod2luZG93KSB7XG4gICAgLyoqKioqKioqKioqKioqKlxuICAgICAgICAgU2V0dXBcbiAgICAqKioqKioqKioqKioqKiovXG5cbiAgICAvKiBJZiBqUXVlcnkgaXMgYWxyZWFkeSBsb2FkZWQsIHRoZXJlJ3Mgbm8gcG9pbnQgaW4gbG9hZGluZyB0aGlzIHNoaW0uICovXG4gICAgaWYgKHdpbmRvdy5qUXVlcnkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qIGpRdWVyeSBiYXNlLiAqL1xuICAgIHZhciAkID0gZnVuY3Rpb24gKHNlbGVjdG9yLCBjb250ZXh0KSB7XG4gICAgICAgIHJldHVybiBuZXcgJC5mbi5pbml0KHNlbGVjdG9yLCBjb250ZXh0KTtcbiAgICB9O1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqXG4gICAgICAgUHJpdmF0ZSBNZXRob2RzXG4gICAgKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKiBqUXVlcnkgKi9cbiAgICAkLmlzV2luZG93ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICAvKiBqc2hpbnQgZXFlcWVxOiBmYWxzZSAqL1xuICAgICAgICByZXR1cm4gb2JqICE9IG51bGwgJiYgb2JqID09IG9iai53aW5kb3c7XG4gICAgfTtcblxuICAgIC8qIGpRdWVyeSAqL1xuICAgICQudHlwZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgaWYgKG9iaiA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqICsgXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBvYmogPT09IFwiZnVuY3Rpb25cIiA/XG4gICAgICAgICAgICBjbGFzczJ0eXBlW3RvU3RyaW5nLmNhbGwob2JqKV0gfHwgXCJvYmplY3RcIiA6XG4gICAgICAgICAgICB0eXBlb2Ygb2JqO1xuICAgIH07XG5cbiAgICAvKiBqUXVlcnkgKi9cbiAgICAkLmlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuICQudHlwZShvYmopID09PSBcImFycmF5XCI7XG4gICAgfTtcblxuICAgIC8qIGpRdWVyeSAqL1xuICAgIGZ1bmN0aW9uIGlzQXJyYXlsaWtlIChvYmopIHtcbiAgICAgICAgdmFyIGxlbmd0aCA9IG9iai5sZW5ndGgsXG4gICAgICAgICAgICB0eXBlID0gJC50eXBlKG9iaik7XG5cbiAgICAgICAgaWYgKHR5cGUgPT09IFwiZnVuY3Rpb25cIiB8fCAkLmlzV2luZG93KG9iaikpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvYmoubm9kZVR5cGUgPT09IDEgJiYgbGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0eXBlID09PSBcImFycmF5XCIgfHwgbGVuZ3RoID09PSAwIHx8IHR5cGVvZiBsZW5ndGggPT09IFwibnVtYmVyXCIgJiYgbGVuZ3RoID4gMCAmJiAobGVuZ3RoIC0gMSkgaW4gb2JqO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKipcbiAgICAgICAkIE1ldGhvZHNcbiAgICAqKioqKioqKioqKioqKiovXG5cbiAgICAvKiBqUXVlcnk6IFN1cHBvcnQgcmVtb3ZlZCBmb3IgSUU8OS4gKi9cbiAgICAkLmlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHZhciBrZXk7XG5cbiAgICAgICAgaWYgKCFvYmogfHwgJC50eXBlKG9iaikgIT09IFwib2JqZWN0XCIgfHwgb2JqLm5vZGVUeXBlIHx8ICQuaXNXaW5kb3cob2JqKSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChvYmouY29uc3RydWN0b3IgJiZcbiAgICAgICAgICAgICAgICAhaGFzT3duLmNhbGwob2JqLCBcImNvbnN0cnVjdG9yXCIpICYmXG4gICAgICAgICAgICAgICAgIWhhc093bi5jYWxsKG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsIFwiaXNQcm90b3R5cGVPZlwiKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChrZXkgaW4gb2JqKSB7fVxuXG4gICAgICAgIHJldHVybiBrZXkgPT09IHVuZGVmaW5lZCB8fCBoYXNPd24uY2FsbChvYmosIGtleSk7XG4gICAgfTtcblxuICAgIC8qIGpRdWVyeSAqL1xuICAgICQuZWFjaCA9IGZ1bmN0aW9uKG9iaiwgY2FsbGJhY2ssIGFyZ3MpIHtcbiAgICAgICAgdmFyIHZhbHVlLFxuICAgICAgICAgICAgaSA9IDAsXG4gICAgICAgICAgICBsZW5ndGggPSBvYmoubGVuZ3RoLFxuICAgICAgICAgICAgaXNBcnJheSA9IGlzQXJyYXlsaWtlKG9iaik7XG5cbiAgICAgICAgaWYgKGFyZ3MpIHtcbiAgICAgICAgICAgIGlmIChpc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgZm9yICg7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNhbGxiYWNrLmFwcGx5KG9ialtpXSwgYXJncyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAoaSBpbiBvYmopIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjYWxsYmFjay5hcHBseShvYmpbaV0sIGFyZ3MpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoaXNBcnJheSkge1xuICAgICAgICAgICAgICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjYWxsYmFjay5jYWxsKG9ialtpXSwgaSwgb2JqW2ldKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yIChpIGluIG9iaikge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNhbGxiYWNrLmNhbGwob2JqW2ldLCBpLCBvYmpbaV0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9O1xuXG4gICAgLyogQ3VzdG9tICovXG4gICAgJC5kYXRhID0gZnVuY3Rpb24gKG5vZGUsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgLyogJC5nZXREYXRhKCkgKi9cbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciBpZCA9IG5vZGVbJC5leHBhbmRvXSxcbiAgICAgICAgICAgICAgICBzdG9yZSA9IGlkICYmIGNhY2hlW2lkXTtcblxuICAgICAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzdG9yZSkge1xuICAgICAgICAgICAgICAgIGlmIChrZXkgaW4gc3RvcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0b3JlW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAvKiAkLnNldERhdGEoKSAqL1xuICAgICAgICB9IGVsc2UgaWYgKGtleSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXIgaWQgPSBub2RlWyQuZXhwYW5kb10gfHwgKG5vZGVbJC5leHBhbmRvXSA9ICsrJC51dWlkKTtcblxuICAgICAgICAgICAgY2FjaGVbaWRdID0gY2FjaGVbaWRdIHx8IHt9O1xuICAgICAgICAgICAgY2FjaGVbaWRdW2tleV0gPSB2YWx1ZTtcblxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qIEN1c3RvbSAqL1xuICAgICQucmVtb3ZlRGF0YSA9IGZ1bmN0aW9uIChub2RlLCBrZXlzKSB7XG4gICAgICAgIHZhciBpZCA9IG5vZGVbJC5leHBhbmRvXSxcbiAgICAgICAgICAgIHN0b3JlID0gaWQgJiYgY2FjaGVbaWRdO1xuXG4gICAgICAgIGlmIChzdG9yZSkge1xuICAgICAgICAgICAgJC5lYWNoKGtleXMsIGZ1bmN0aW9uKF8sIGtleSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBzdG9yZVtrZXldO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyogalF1ZXJ5ICovXG4gICAgJC5leHRlbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzcmMsIGNvcHlJc0FycmF5LCBjb3B5LCBuYW1lLCBvcHRpb25zLCBjbG9uZSxcbiAgICAgICAgICAgIHRhcmdldCA9IGFyZ3VtZW50c1swXSB8fCB7fSxcbiAgICAgICAgICAgIGkgPSAxLFxuICAgICAgICAgICAgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCxcbiAgICAgICAgICAgIGRlZXAgPSBmYWxzZTtcblxuICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgICAgIGRlZXAgPSB0YXJnZXQ7XG5cbiAgICAgICAgICAgIHRhcmdldCA9IGFyZ3VtZW50c1tpXSB8fCB7fTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ICE9PSBcIm9iamVjdFwiICYmICQudHlwZSh0YXJnZXQpICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHRhcmdldCA9IHt9O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGkgPT09IGxlbmd0aCkge1xuICAgICAgICAgICAgdGFyZ2V0ID0gdGhpcztcbiAgICAgICAgICAgIGktLTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgob3B0aW9ucyA9IGFyZ3VtZW50c1tpXSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZvciAobmFtZSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIHNyYyA9IHRhcmdldFtuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgY29weSA9IG9wdGlvbnNbbmFtZV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldCA9PT0gY29weSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoZGVlcCAmJiBjb3B5ICYmICgkLmlzUGxhaW5PYmplY3QoY29weSkgfHwgKGNvcHlJc0FycmF5ID0gJC5pc0FycmF5KGNvcHkpKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb3B5SXNBcnJheSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvcHlJc0FycmF5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvbmUgPSBzcmMgJiYgJC5pc0FycmF5KHNyYykgPyBzcmMgOiBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZSA9IHNyYyAmJiAkLmlzUGxhaW5PYmplY3Qoc3JjKSA/IHNyYyA6IHt9O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRbbmFtZV0gPSAkLmV4dGVuZChkZWVwLCBjbG9uZSwgY29weSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb3B5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtuYW1lXSA9IGNvcHk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH07XG5cbiAgICAvKiBqUXVlcnkgMS40LjMgKi9cbiAgICAkLnF1ZXVlID0gZnVuY3Rpb24gKGVsZW0sIHR5cGUsIGRhdGEpIHtcbiAgICAgICAgZnVuY3Rpb24gJG1ha2VBcnJheSAoYXJyLCByZXN1bHRzKSB7XG4gICAgICAgICAgICB2YXIgcmV0ID0gcmVzdWx0cyB8fCBbXTtcblxuICAgICAgICAgICAgaWYgKGFyciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGlzQXJyYXlsaWtlKE9iamVjdChhcnIpKSkge1xuICAgICAgICAgICAgICAgICAgICAvKiAkLm1lcmdlICovXG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbihmaXJzdCwgc2Vjb25kKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGVuID0gK3NlY29uZC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaiA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSA9IGZpcnN0Lmxlbmd0aDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGogPCBsZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFtpKytdID0gc2Vjb25kW2orK107XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZW4gIT09IGxlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChzZWNvbmRbal0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFtpKytdID0gc2Vjb25kW2orK107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdC5sZW5ndGggPSBpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmlyc3Q7XG4gICAgICAgICAgICAgICAgICAgIH0pKHJldCwgdHlwZW9mIGFyciA9PT0gXCJzdHJpbmdcIiA/IFthcnJdIDogYXJyKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBbXS5wdXNoLmNhbGwocmV0LCBhcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghZWxlbSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdHlwZSA9ICh0eXBlIHx8IFwiZnhcIikgKyBcInF1ZXVlXCI7XG5cbiAgICAgICAgdmFyIHEgPSAkLmRhdGEoZWxlbSwgdHlwZSk7XG5cbiAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gcSB8fCBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcSB8fCAkLmlzQXJyYXkoZGF0YSkpIHtcbiAgICAgICAgICAgIHEgPSAkLmRhdGEoZWxlbSwgdHlwZSwgJG1ha2VBcnJheShkYXRhKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBxLnB1c2goZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcTtcbiAgICB9O1xuXG4gICAgLyogalF1ZXJ5IDEuNC4zICovXG4gICAgJC5kZXF1ZXVlID0gZnVuY3Rpb24gKGVsZW1zLCB0eXBlKSB7XG4gICAgICAgIC8qIEN1c3RvbTogRW1iZWQgZWxlbWVudCBpdGVyYXRpb24uICovXG4gICAgICAgICQuZWFjaChlbGVtcy5ub2RlVHlwZSA/IFsgZWxlbXMgXSA6IGVsZW1zLCBmdW5jdGlvbihpLCBlbGVtKSB7XG4gICAgICAgICAgICB0eXBlID0gdHlwZSB8fCBcImZ4XCI7XG5cbiAgICAgICAgICAgIHZhciBxdWV1ZSA9ICQucXVldWUoZWxlbSwgdHlwZSksXG4gICAgICAgICAgICAgICAgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuXG4gICAgICAgICAgICBpZiAoZm4gPT09IFwiaW5wcm9ncmVzc1wiKSB7XG4gICAgICAgICAgICAgICAgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZm4pIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZSA9PT0gXCJmeFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXVlLnVuc2hpZnQoXCJpbnByb2dyZXNzXCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZuLmNhbGwoZWxlbSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQuZGVxdWV1ZShlbGVtLCB0eXBlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8qKioqKioqKioqKioqKioqKipcbiAgICAgICAkLmZuIE1ldGhvZHNcbiAgICAqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKiBqUXVlcnkgKi9cbiAgICAkLmZuID0gJC5wcm90b3R5cGUgPSB7XG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuICAgICAgICAgICAgLyogSnVzdCByZXR1cm4gdGhlIGVsZW1lbnQgd3JhcHBlZCBpbnNpZGUgYW4gYXJyYXk7IGRvbid0IHByb2NlZWQgd2l0aCB0aGUgYWN0dWFsIGpRdWVyeSBub2RlIHdyYXBwaW5nIHByb2Nlc3MuICovXG4gICAgICAgICAgICBpZiAoc2VsZWN0b3Iubm9kZVR5cGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzWzBdID0gc2VsZWN0b3I7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IGEgRE9NIG5vZGUuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIG9mZnNldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLyogalF1ZXJ5IGFsdGVyZWQgY29kZTogRHJvcHBlZCBkaXNjb25uZWN0ZWQgRE9NIG5vZGUgY2hlY2tpbmcuICovXG4gICAgICAgICAgICB2YXIgYm94ID0gdGhpc1swXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QgPyB0aGlzWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpIDogeyB0b3A6IDAsIGxlZnQ6IDAgfTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0b3A6IGJveC50b3AgKyAod2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LnNjcm9sbFRvcCAgfHwgMCkgIC0gKGRvY3VtZW50LmNsaWVudFRvcCAgfHwgMCksXG4gICAgICAgICAgICAgICAgbGVmdDogYm94LmxlZnQgKyAod2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvY3VtZW50LnNjcm9sbExlZnQgIHx8IDApIC0gKGRvY3VtZW50LmNsaWVudExlZnQgfHwgMClcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0sXG5cbiAgICAgICAgcG9zaXRpb246IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8qIGpRdWVyeSAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gb2Zmc2V0UGFyZW50KCkge1xuICAgICAgICAgICAgICAgIHZhciBvZmZzZXRQYXJlbnQgPSB0aGlzLm9mZnNldFBhcmVudCB8fCBkb2N1bWVudDtcblxuICAgICAgICAgICAgICAgIHdoaWxlIChvZmZzZXRQYXJlbnQgJiYgKCFvZmZzZXRQYXJlbnQubm9kZVR5cGUudG9Mb3dlckNhc2UgPT09IFwiaHRtbFwiICYmIG9mZnNldFBhcmVudC5zdHlsZS5wb3NpdGlvbiA9PT0gXCJzdGF0aWNcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0UGFyZW50ID0gb2Zmc2V0UGFyZW50Lm9mZnNldFBhcmVudDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gb2Zmc2V0UGFyZW50IHx8IGRvY3VtZW50O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBaZXB0byAqL1xuICAgICAgICAgICAgdmFyIGVsZW0gPSB0aGlzWzBdLFxuICAgICAgICAgICAgICAgIG9mZnNldFBhcmVudCA9IG9mZnNldFBhcmVudC5hcHBseShlbGVtKSxcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSB0aGlzLm9mZnNldCgpLFxuICAgICAgICAgICAgICAgIHBhcmVudE9mZnNldCA9IC9eKD86Ym9keXxodG1sKSQvaS50ZXN0KG9mZnNldFBhcmVudC5ub2RlTmFtZSkgPyB7IHRvcDogMCwgbGVmdDogMCB9IDogJChvZmZzZXRQYXJlbnQpLm9mZnNldCgpXG5cbiAgICAgICAgICAgIG9mZnNldC50b3AgLT0gcGFyc2VGbG9hdChlbGVtLnN0eWxlLm1hcmdpblRvcCkgfHwgMDtcbiAgICAgICAgICAgIG9mZnNldC5sZWZ0IC09IHBhcnNlRmxvYXQoZWxlbS5zdHlsZS5tYXJnaW5MZWZ0KSB8fCAwO1xuXG4gICAgICAgICAgICBpZiAob2Zmc2V0UGFyZW50LnN0eWxlKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50T2Zmc2V0LnRvcCArPSBwYXJzZUZsb2F0KG9mZnNldFBhcmVudC5zdHlsZS5ib3JkZXJUb3BXaWR0aCkgfHwgMFxuICAgICAgICAgICAgICAgIHBhcmVudE9mZnNldC5sZWZ0ICs9IHBhcnNlRmxvYXQob2Zmc2V0UGFyZW50LnN0eWxlLmJvcmRlckxlZnRXaWR0aCkgfHwgMFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRvcDogb2Zmc2V0LnRvcCAtIHBhcmVudE9mZnNldC50b3AsXG4gICAgICAgICAgICAgICAgbGVmdDogb2Zmc2V0LmxlZnQgLSBwYXJlbnRPZmZzZXQubGVmdFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgIFByaXZhdGUgVmFyaWFibGVzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qIEZvciAkLmRhdGEoKSAqL1xuICAgIHZhciBjYWNoZSA9IHt9O1xuICAgICQuZXhwYW5kbyA9IFwidmVsb2NpdHlcIiArIChuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG4gICAgJC51dWlkID0gMDtcblxuICAgIC8qIEZvciAkLnF1ZXVlKCkgKi9cbiAgICB2YXIgY2xhc3MydHlwZSA9IHt9LFxuICAgICAgICBoYXNPd24gPSBjbGFzczJ0eXBlLmhhc093blByb3BlcnR5LFxuICAgICAgICB0b1N0cmluZyA9IGNsYXNzMnR5cGUudG9TdHJpbmc7XG5cbiAgICB2YXIgdHlwZXMgPSBcIkJvb2xlYW4gTnVtYmVyIFN0cmluZyBGdW5jdGlvbiBBcnJheSBEYXRlIFJlZ0V4cCBPYmplY3QgRXJyb3JcIi5zcGxpdChcIiBcIik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0eXBlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjbGFzczJ0eXBlW1wiW29iamVjdCBcIiArIHR5cGVzW2ldICsgXCJdXCJdID0gdHlwZXNbaV0udG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICAvKiBNYWtlcyAkKG5vZGUpIHBvc3NpYmxlLCB3aXRob3V0IGhhdmluZyB0byBjYWxsIGluaXQuICovXG4gICAgJC5mbi5pbml0LnByb3RvdHlwZSA9ICQuZm47XG5cbiAgICAvKiBHbG9iYWxpemUgVmVsb2NpdHkgb250byB0aGUgd2luZG93LCBhbmQgYXNzaWduIGl0cyBVdGlsaXRpZXMgcHJvcGVydHkuICovXG4gICAgd2luZG93LlZlbG9jaXR5ID0geyBVdGlsaXRpZXM6ICQgfTtcbn0pKHdpbmRvdyk7XG5cbi8qKioqKioqKioqKioqKioqKipcbiAgICBWZWxvY2l0eS5qc1xuKioqKioqKioqKioqKioqKioqL1xuXG47KGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gICAgLyogQ29tbW9uSlMgbW9kdWxlLiAqL1xuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICAvKiBBTUQgbW9kdWxlLiAqL1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKGZhY3RvcnkpO1xuICAgIC8qIEJyb3dzZXIgZ2xvYmFscy4gKi9cbiAgICB9IGVsc2Uge1xuICAgICAgICBmYWN0b3J5KCk7XG4gICAgfVxufShmdW5jdGlvbigpIHtcbnJldHVybiBmdW5jdGlvbiAoZ2xvYmFsLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcblxuICAgIC8qKioqKioqKioqKioqKipcbiAgICAgICAgU3VtbWFyeVxuICAgICoqKioqKioqKioqKioqKi9cblxuICAgIC8qXG4gICAgLSBDU1M6IENTUyBzdGFjayB0aGF0IHdvcmtzIGluZGVwZW5kZW50bHkgZnJvbSB0aGUgcmVzdCBvZiBWZWxvY2l0eS5cbiAgICAtIGFuaW1hdGUoKTogQ29yZSBhbmltYXRpb24gbWV0aG9kIHRoYXQgaXRlcmF0ZXMgb3ZlciB0aGUgdGFyZ2V0ZWQgZWxlbWVudHMgYW5kIHF1ZXVlcyB0aGUgaW5jb21pbmcgY2FsbCBvbnRvIGVhY2ggZWxlbWVudCBpbmRpdmlkdWFsbHkuXG4gICAgICAtIFByZS1RdWV1ZWluZzogUHJlcGFyZSB0aGUgZWxlbWVudCBmb3IgYW5pbWF0aW9uIGJ5IGluc3RhbnRpYXRpbmcgaXRzIGRhdGEgY2FjaGUgYW5kIHByb2Nlc3NpbmcgdGhlIGNhbGwncyBvcHRpb25zLlxuICAgICAgLSBRdWV1ZWluZzogVGhlIGxvZ2ljIHRoYXQgcnVucyBvbmNlIHRoZSBjYWxsIGhhcyByZWFjaGVkIGl0cyBwb2ludCBvZiBleGVjdXRpb24gaW4gdGhlIGVsZW1lbnQncyAkLnF1ZXVlKCkgc3RhY2suXG4gICAgICAgICAgICAgICAgICBNb3N0IGxvZ2ljIGlzIHBsYWNlZCBoZXJlIHRvIGF2b2lkIHJpc2tpbmcgaXQgYmVjb21pbmcgc3RhbGUgKGlmIHRoZSBlbGVtZW50J3MgcHJvcGVydGllcyBoYXZlIGNoYW5nZWQpLlxuICAgICAgLSBQdXNoaW5nOiBDb25zb2xpZGF0aW9uIG9mIHRoZSB0d2VlbiBkYXRhIGZvbGxvd2VkIGJ5IGl0cyBwdXNoIG9udG8gdGhlIGdsb2JhbCBpbi1wcm9ncmVzcyBjYWxscyBjb250YWluZXIuXG4gICAgLSB0aWNrKCk6IFRoZSBzaW5nbGUgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGxvb3AgcmVzcG9uc2libGUgZm9yIHR3ZWVuaW5nIGFsbCBpbi1wcm9ncmVzcyBjYWxscy5cbiAgICAtIGNvbXBsZXRlQ2FsbCgpOiBIYW5kbGVzIHRoZSBjbGVhbnVwIHByb2Nlc3MgZm9yIGVhY2ggVmVsb2NpdHkgY2FsbC5cbiAgICAqL1xuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKlxuICAgICAgIEhlbHBlciBGdW5jdGlvbnNcbiAgICAqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKiBJRSBkZXRlY3Rpb24uIEdpc3Q6IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2p1bGlhbnNoYXBpcm8vOTA5ODYwOSAqL1xuICAgIHZhciBJRSA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGRvY3VtZW50LmRvY3VtZW50TW9kZSkge1xuICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50TW9kZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSA3OyBpID4gNDsgaS0tKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgICAgICAgICBkaXYuaW5uZXJIVE1MID0gXCI8IS0tW2lmIElFIFwiICsgaSArIFwiXT48c3Bhbj48L3NwYW4+PCFbZW5kaWZdLS0+XCI7XG5cbiAgICAgICAgICAgICAgICBpZiAoZGl2LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic3BhblwiKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgZGl2ID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0pKCk7XG5cbiAgICAvKiByQUYgc2hpbS4gR2lzdDogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vanVsaWFuc2hhcGlyby85NDk3NTEzICovXG4gICAgdmFyIHJBRlNoaW0gPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0aW1lTGFzdCA9IDA7XG5cbiAgICAgICAgcmV0dXJuIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCBmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIHRpbWVDdXJyZW50ID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKSxcbiAgICAgICAgICAgICAgICB0aW1lRGVsdGE7XG5cbiAgICAgICAgICAgIC8qIER5bmFtaWNhbGx5IHNldCBkZWxheSBvbiBhIHBlci10aWNrIGJhc2lzIHRvIG1hdGNoIDYwZnBzLiAqL1xuICAgICAgICAgICAgLyogVGVjaG5pcXVlIGJ5IEVyaWsgTW9sbGVyLiBNSVQgbGljZW5zZTogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vcGF1bGlyaXNoLzE1Nzk2NzEgKi9cbiAgICAgICAgICAgIHRpbWVEZWx0YSA9IE1hdGgubWF4KDAsIDE2IC0gKHRpbWVDdXJyZW50IC0gdGltZUxhc3QpKTtcbiAgICAgICAgICAgIHRpbWVMYXN0ID0gdGltZUN1cnJlbnQgKyB0aW1lRGVsdGE7XG5cbiAgICAgICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBjYWxsYmFjayh0aW1lQ3VycmVudCArIHRpbWVEZWx0YSk7IH0sIHRpbWVEZWx0YSk7XG4gICAgICAgIH07XG4gICAgfSkoKTtcblxuICAgIC8qIEFycmF5IGNvbXBhY3RpbmcuIENvcHlyaWdodCBMby1EYXNoLiBNSVQgTGljZW5zZTogaHR0cHM6Ly9naXRodWIuY29tL2xvZGFzaC9sb2Rhc2gvYmxvYi9tYXN0ZXIvTElDRU5TRS50eHQgKi9cbiAgICBmdW5jdGlvbiBjb21wYWN0U3BhcnNlQXJyYXkgKGFycmF5KSB7XG4gICAgICAgIHZhciBpbmRleCA9IC0xLFxuICAgICAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwLFxuICAgICAgICAgICAgcmVzdWx0ID0gW107XG5cbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzYW5pdGl6ZUVsZW1lbnRzIChlbGVtZW50cykge1xuICAgICAgICAvKiBVbndyYXAgalF1ZXJ5L1plcHRvIG9iamVjdHMuICovXG4gICAgICAgIGlmIChUeXBlLmlzV3JhcHBlZChlbGVtZW50cykpIHtcbiAgICAgICAgICAgIGVsZW1lbnRzID0gW10uc2xpY2UuY2FsbChlbGVtZW50cyk7XG4gICAgICAgIC8qIFdyYXAgYSBzaW5nbGUgZWxlbWVudCBpbiBhbiBhcnJheSBzbyB0aGF0ICQuZWFjaCgpIGNhbiBpdGVyYXRlIHdpdGggdGhlIGVsZW1lbnQgaW5zdGVhZCBvZiBpdHMgbm9kZSdzIGNoaWxkcmVuLiAqL1xuICAgICAgICB9IGVsc2UgaWYgKFR5cGUuaXNOb2RlKGVsZW1lbnRzKSkge1xuICAgICAgICAgICAgZWxlbWVudHMgPSBbIGVsZW1lbnRzIF07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZWxlbWVudHM7XG4gICAgfVxuXG4gICAgdmFyIFR5cGUgPSB7XG4gICAgICAgIGlzU3RyaW5nOiBmdW5jdGlvbiAodmFyaWFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiAodHlwZW9mIHZhcmlhYmxlID09PSBcInN0cmluZ1wiKTtcbiAgICAgICAgfSxcbiAgICAgICAgaXNBcnJheTogQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAodmFyaWFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFyaWFibGUpID09PSBcIltvYmplY3QgQXJyYXldXCI7XG4gICAgICAgIH0sXG4gICAgICAgIGlzRnVuY3Rpb246IGZ1bmN0aW9uICh2YXJpYWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YXJpYWJsZSkgPT09IFwiW29iamVjdCBGdW5jdGlvbl1cIjtcbiAgICAgICAgfSxcbiAgICAgICAgaXNOb2RlOiBmdW5jdGlvbiAodmFyaWFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YXJpYWJsZSAmJiB2YXJpYWJsZS5ub2RlVHlwZTtcbiAgICAgICAgfSxcbiAgICAgICAgLyogQ29weXJpZ2h0IE1hcnRpbiBCb2htLiBNSVQgTGljZW5zZTogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vVG9tYWxhay84MThhNzhhMjI2YTA3MzhlYWFkZSAqL1xuICAgICAgICBpc05vZGVMaXN0OiBmdW5jdGlvbiAodmFyaWFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgdmFyaWFibGUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgICAgICAvXlxcW29iamVjdCAoSFRNTENvbGxlY3Rpb258Tm9kZUxpc3R8T2JqZWN0KVxcXSQvLnRlc3QoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhcmlhYmxlKSkgJiZcbiAgICAgICAgICAgICAgICB2YXJpYWJsZS5sZW5ndGggIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgICAgICAgICh2YXJpYWJsZS5sZW5ndGggPT09IDAgfHwgKHR5cGVvZiB2YXJpYWJsZVswXSA9PT0gXCJvYmplY3RcIiAmJiB2YXJpYWJsZVswXS5ub2RlVHlwZSA+IDApKTtcbiAgICAgICAgfSxcbiAgICAgICAgLyogRGV0ZXJtaW5lIGlmIHZhcmlhYmxlIGlzIGEgd3JhcHBlZCBqUXVlcnkgb3IgWmVwdG8gZWxlbWVudC4gKi9cbiAgICAgICAgaXNXcmFwcGVkOiBmdW5jdGlvbiAodmFyaWFibGUpIHtcbiAgICAgICAgICAgIHJldHVybiB2YXJpYWJsZSAmJiAodmFyaWFibGUuanF1ZXJ5IHx8ICh3aW5kb3cuWmVwdG8gJiYgd2luZG93LlplcHRvLnplcHRvLmlzWih2YXJpYWJsZSkpKTtcbiAgICAgICAgfSxcbiAgICAgICAgaXNTVkc6IGZ1bmN0aW9uICh2YXJpYWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5TVkdFbGVtZW50ICYmICh2YXJpYWJsZSBpbnN0YW5jZW9mIHdpbmRvdy5TVkdFbGVtZW50KTtcbiAgICAgICAgfSxcbiAgICAgICAgaXNFbXB0eU9iamVjdDogZnVuY3Rpb24gKHZhcmlhYmxlKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBuYW1lIGluIHZhcmlhYmxlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKioqKioqKioqKioqKioqKipcbiAgICAgICBEZXBlbmRlbmNpZXNcbiAgICAqKioqKioqKioqKioqKioqKi9cblxuICAgIHZhciAkLFxuICAgICAgICBpc0pRdWVyeSA9IGZhbHNlO1xuXG4gICAgaWYgKGdsb2JhbC5mbiAmJiBnbG9iYWwuZm4uanF1ZXJ5KSB7XG4gICAgICAgICQgPSBnbG9iYWw7XG4gICAgICAgIGlzSlF1ZXJ5ID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkID0gd2luZG93LlZlbG9jaXR5LlV0aWxpdGllcztcbiAgICB9XG5cbiAgICBpZiAoSUUgPD0gOCAmJiAhaXNKUXVlcnkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVmVsb2NpdHk6IElFOCBhbmQgYmVsb3cgcmVxdWlyZSBqUXVlcnkgdG8gYmUgbG9hZGVkIGJlZm9yZSBWZWxvY2l0eS5cIik7XG4gICAgfSBlbHNlIGlmIChJRSA8PSA3KSB7XG4gICAgICAgIC8qIFJldmVydCB0byBqUXVlcnkncyAkLmFuaW1hdGUoKSwgYW5kIGxvc2UgVmVsb2NpdHkncyBleHRyYSBmZWF0dXJlcy4gKi9cbiAgICAgICAgalF1ZXJ5LmZuLnZlbG9jaXR5ID0galF1ZXJ5LmZuLmFuaW1hdGU7XG5cbiAgICAgICAgLyogTm93IHRoYXQgJC5mbi52ZWxvY2l0eSBpcyBhbGlhc2VkLCBhYm9ydCB0aGlzIFZlbG9jaXR5IGRlY2xhcmF0aW9uLiAqL1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqXG4gICAgICAgIENvbnN0YW50c1xuICAgICoqKioqKioqKioqKioqKioqL1xuXG4gICAgdmFyIERVUkFUSU9OX0RFRkFVTFQgPSA0MDAsXG4gICAgICAgIEVBU0lOR19ERUZBVUxUID0gXCJzd2luZ1wiO1xuXG4gICAgLyoqKioqKioqKioqKipcbiAgICAgICAgU3RhdGVcbiAgICAqKioqKioqKioqKioqL1xuXG4gICAgdmFyIFZlbG9jaXR5ID0ge1xuICAgICAgICAvKiBDb250YWluZXIgZm9yIHBhZ2Utd2lkZSBWZWxvY2l0eSBzdGF0ZSBkYXRhLiAqL1xuICAgICAgICBTdGF0ZToge1xuICAgICAgICAgICAgLyogRGV0ZWN0IG1vYmlsZSBkZXZpY2VzIHRvIGRldGVybWluZSBpZiBtb2JpbGVIQSBzaG91bGQgYmUgdHVybmVkIG9uLiAqL1xuICAgICAgICAgICAgaXNNb2JpbGU6IC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxcbiAgICAgICAgICAgIC8qIFRoZSBtb2JpbGVIQSBvcHRpb24ncyBiZWhhdmlvciBjaGFuZ2VzIG9uIG9sZGVyIEFuZHJvaWQgZGV2aWNlcyAoR2luZ2VyYnJlYWQsIHZlcnNpb25zIDIuMy4zLTIuMy43KS4gKi9cbiAgICAgICAgICAgIGlzQW5kcm9pZDogL0FuZHJvaWQvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLFxuICAgICAgICAgICAgaXNHaW5nZXJicmVhZDogL0FuZHJvaWQgMlxcLjNcXC5bMy03XS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksXG4gICAgICAgICAgICBpc0Nocm9tZTogd2luZG93LmNocm9tZSxcbiAgICAgICAgICAgIGlzRmlyZWZveDogL0ZpcmVmb3gvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLFxuICAgICAgICAgICAgLyogQ3JlYXRlIGEgY2FjaGVkIGVsZW1lbnQgZm9yIHJlLXVzZSB3aGVuIGNoZWNraW5nIGZvciBDU1MgcHJvcGVydHkgcHJlZml4ZXMuICovXG4gICAgICAgICAgICBwcmVmaXhFbGVtZW50OiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLFxuICAgICAgICAgICAgLyogQ2FjaGUgZXZlcnkgcHJlZml4IG1hdGNoIHRvIGF2b2lkIHJlcGVhdGluZyBsb29rdXBzLiAqL1xuICAgICAgICAgICAgcHJlZml4TWF0Y2hlczoge30sXG4gICAgICAgICAgICAvKiBDYWNoZSB0aGUgYW5jaG9yIHVzZWQgZm9yIGFuaW1hdGluZyB3aW5kb3cgc2Nyb2xsaW5nLiAqL1xuICAgICAgICAgICAgc2Nyb2xsQW5jaG9yOiBudWxsLFxuICAgICAgICAgICAgLyogQ2FjaGUgdGhlIGJyb3dzZXItc3BlY2lmaWMgcHJvcGVydHkgbmFtZXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBzY3JvbGwgYW5jaG9yLiAqL1xuICAgICAgICAgICAgc2Nyb2xsUHJvcGVydHlMZWZ0OiBudWxsLFxuICAgICAgICAgICAgc2Nyb2xsUHJvcGVydHlUb3A6IG51bGwsXG4gICAgICAgICAgICAvKiBLZWVwIHRyYWNrIG9mIHdoZXRoZXIgb3VyIFJBRiB0aWNrIGlzIHJ1bm5pbmcuICovXG4gICAgICAgICAgICBpc1RpY2tpbmc6IGZhbHNlLFxuICAgICAgICAgICAgLyogQ29udGFpbmVyIGZvciBldmVyeSBpbi1wcm9ncmVzcyBjYWxsIHRvIFZlbG9jaXR5LiAqL1xuICAgICAgICAgICAgY2FsbHM6IFtdXG4gICAgICAgIH0sXG4gICAgICAgIC8qIFZlbG9jaXR5J3MgY3VzdG9tIENTUyBzdGFjay4gTWFkZSBnbG9iYWwgZm9yIHVuaXQgdGVzdGluZy4gKi9cbiAgICAgICAgQ1NTOiB7IC8qIERlZmluZWQgYmVsb3cuICovIH0sXG4gICAgICAgIC8qIEEgc2hpbSBvZiB0aGUgalF1ZXJ5IHV0aWxpdHkgZnVuY3Rpb25zIHVzZWQgYnkgVmVsb2NpdHkgLS0gcHJvdmlkZWQgYnkgVmVsb2NpdHkncyBvcHRpb25hbCBqUXVlcnkgc2hpbS4gKi9cbiAgICAgICAgVXRpbGl0aWVzOiAkLFxuICAgICAgICAvKiBDb250YWluZXIgZm9yIHRoZSB1c2VyJ3MgY3VzdG9tIGFuaW1hdGlvbiByZWRpcmVjdHMgdGhhdCBhcmUgcmVmZXJlbmNlZCBieSBuYW1lIGluIHBsYWNlIG9mIHRoZSBwcm9wZXJ0aWVzIG1hcCBhcmd1bWVudC4gKi9cbiAgICAgICAgUmVkaXJlY3RzOiB7IC8qIE1hbnVhbGx5IHJlZ2lzdGVyZWQgYnkgdGhlIHVzZXIuICovIH0sXG4gICAgICAgIEVhc2luZ3M6IHsgLyogRGVmaW5lZCBiZWxvdy4gKi8gfSxcbiAgICAgICAgLyogQXR0ZW1wdCB0byB1c2UgRVM2IFByb21pc2VzIGJ5IGRlZmF1bHQuIFVzZXJzIGNhbiBvdmVycmlkZSB0aGlzIHdpdGggYSB0aGlyZC1wYXJ0eSBwcm9taXNlcyBsaWJyYXJ5LiAqL1xuICAgICAgICBQcm9taXNlOiB3aW5kb3cuUHJvbWlzZSxcbiAgICAgICAgLyogVmVsb2NpdHkgb3B0aW9uIGRlZmF1bHRzLCB3aGljaCBjYW4gYmUgb3ZlcnJpZGVuIGJ5IHRoZSB1c2VyLiAqL1xuICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgcXVldWU6IFwiXCIsXG4gICAgICAgICAgICBkdXJhdGlvbjogRFVSQVRJT05fREVGQVVMVCxcbiAgICAgICAgICAgIGVhc2luZzogRUFTSU5HX0RFRkFVTFQsXG4gICAgICAgICAgICBiZWdpbjogdW5kZWZpbmVkLFxuICAgICAgICAgICAgY29tcGxldGU6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHByb2dyZXNzOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBkaXNwbGF5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICB2aXNpYmlsaXR5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICBsb29wOiBmYWxzZSxcbiAgICAgICAgICAgIGRlbGF5OiBmYWxzZSxcbiAgICAgICAgICAgIG1vYmlsZUhBOiB0cnVlLFxuICAgICAgICAgICAgLyogQWR2YW5jZWQ6IFNldCB0byBmYWxzZSB0byBwcmV2ZW50IHByb3BlcnR5IHZhbHVlcyBmcm9tIGJlaW5nIGNhY2hlZCBiZXR3ZWVuIGNvbnNlY3V0aXZlIFZlbG9jaXR5LWluaXRpYXRlZCBjaGFpbiBjYWxscy4gKi9cbiAgICAgICAgICAgIF9jYWNoZVZhbHVlczogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICAvKiBBIGRlc2lnbiBnb2FsIG9mIFZlbG9jaXR5IGlzIHRvIGNhY2hlIGRhdGEgd2hlcmV2ZXIgcG9zc2libGUgaW4gb3JkZXIgdG8gYXZvaWQgRE9NIHJlcXVlcnlpbmcuIEFjY29yZGluZ2x5LCBlYWNoIGVsZW1lbnQgaGFzIGEgZGF0YSBjYWNoZS4gKi9cbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICQuZGF0YShlbGVtZW50LCBcInZlbG9jaXR5XCIsIHtcbiAgICAgICAgICAgICAgICAvKiBTdG9yZSB3aGV0aGVyIHRoaXMgaXMgYW4gU1ZHIGVsZW1lbnQsIHNpbmNlIGl0cyBwcm9wZXJ0aWVzIGFyZSByZXRyaWV2ZWQgYW5kIHVwZGF0ZWQgZGlmZmVyZW50bHkgdGhhbiBzdGFuZGFyZCBIVE1MIGVsZW1lbnRzLiAqL1xuICAgICAgICAgICAgICAgIGlzU1ZHOiBUeXBlLmlzU1ZHKGVsZW1lbnQpLFxuICAgICAgICAgICAgICAgIC8qIEtlZXAgdHJhY2sgb2Ygd2hldGhlciB0aGUgZWxlbWVudCBpcyBjdXJyZW50bHkgYmVpbmcgYW5pbWF0ZWQgYnkgVmVsb2NpdHkuXG4gICAgICAgICAgICAgICAgICAgVGhpcyBpcyB1c2VkIHRvIGVuc3VyZSB0aGF0IHByb3BlcnR5IHZhbHVlcyBhcmUgbm90IHRyYW5zZmVycmVkIGJldHdlZW4gbm9uLWNvbnNlY3V0aXZlIChzdGFsZSkgY2FsbHMuICovXG4gICAgICAgICAgICAgICAgaXNBbmltYXRpbmc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIC8qIEEgcmVmZXJlbmNlIHRvIHRoZSBlbGVtZW50J3MgbGl2ZSBjb21wdXRlZFN0eWxlIG9iamVjdC4gTGVhcm4gbW9yZSBoZXJlOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9kb2NzL1dlYi9BUEkvd2luZG93LmdldENvbXB1dGVkU3R5bGUgKi9cbiAgICAgICAgICAgICAgICBjb21wdXRlZFN0eWxlOiBudWxsLFxuICAgICAgICAgICAgICAgIC8qIFR3ZWVuIGRhdGEgaXMgY2FjaGVkIGZvciBlYWNoIGFuaW1hdGlvbiBvbiB0aGUgZWxlbWVudCBzbyB0aGF0IGRhdGEgY2FuIGJlIHBhc3NlZCBhY3Jvc3MgY2FsbHMgLS1cbiAgICAgICAgICAgICAgICAgICBpbiBwYXJ0aWN1bGFyLCBlbmQgdmFsdWVzIGFyZSB1c2VkIGFzIHN1YnNlcXVlbnQgc3RhcnQgdmFsdWVzIGluIGNvbnNlY3V0aXZlIFZlbG9jaXR5IGNhbGxzLiAqL1xuICAgICAgICAgICAgICAgIHR3ZWVuc0NvbnRhaW5lcjogbnVsbCxcbiAgICAgICAgICAgICAgICAvKiBUaGUgZnVsbCByb290IHByb3BlcnR5IHZhbHVlcyBvZiBlYWNoIENTUyBob29rIGJlaW5nIGFuaW1hdGVkIG9uIHRoaXMgZWxlbWVudCBhcmUgY2FjaGVkIHNvIHRoYXQ6XG4gICAgICAgICAgICAgICAgICAgMSkgQ29uY3VycmVudGx5LWFuaW1hdGluZyBob29rcyBzaGFyaW5nIHRoZSBzYW1lIHJvb3QgY2FuIGhhdmUgdGhlaXIgcm9vdCB2YWx1ZXMnIG1lcmdlZCBpbnRvIG9uZSB3aGlsZSB0d2VlbmluZy5cbiAgICAgICAgICAgICAgICAgICAyKSBQb3N0LWhvb2staW5qZWN0aW9uIHJvb3QgdmFsdWVzIGNhbiBiZSB0cmFuc2ZlcnJlZCBvdmVyIHRvIGNvbnNlY3V0aXZlbHkgY2hhaW5lZCBWZWxvY2l0eSBjYWxscyBhcyBzdGFydGluZyByb290IHZhbHVlcy4gKi9cbiAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZUNhY2hlOiB7fSxcbiAgICAgICAgICAgICAgICAvKiBBIGNhY2hlIGZvciB0cmFuc2Zvcm0gdXBkYXRlcywgd2hpY2ggbXVzdCBiZSBtYW51YWxseSBmbHVzaGVkIHZpYSBDU1MuZmx1c2hUcmFuc2Zvcm1DYWNoZSgpLiAqL1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybUNhY2hlOiB7fVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIC8qIEEgcGFyYWxsZWwgdG8galF1ZXJ5J3MgJC5jc3MoKSwgdXNlZCBmb3IgZ2V0dGluZy9zZXR0aW5nIFZlbG9jaXR5J3MgaG9va2VkIENTUyBwcm9wZXJ0aWVzLiAqL1xuICAgICAgICBob29rOiBudWxsLCAvKiBEZWZpbmVkIGJlbG93LiAqL1xuICAgICAgICAvKiBWZWxvY2l0eS13aWRlIGFuaW1hdGlvbiB0aW1lIHJlbWFwcGluZyBmb3IgdGVzdGluZyBwdXJwb3Nlcy4gKi9cbiAgICAgICAgbW9jazogZmFsc2UsXG4gICAgICAgIHZlcnNpb246IHsgbWFqb3I6IDEsIG1pbm9yOiAyLCBwYXRjaDogMiB9LFxuICAgICAgICAvKiBTZXQgdG8gMSBvciAyIChtb3N0IHZlcmJvc2UpIHRvIG91dHB1dCBkZWJ1ZyBpbmZvIHRvIGNvbnNvbGUuICovXG4gICAgICAgIGRlYnVnOiBmYWxzZVxuICAgIH07XG5cbiAgICAvKiBSZXRyaWV2ZSB0aGUgYXBwcm9wcmlhdGUgc2Nyb2xsIGFuY2hvciBhbmQgcHJvcGVydHkgbmFtZSBmb3IgdGhlIGJyb3dzZXI6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XaW5kb3cuc2Nyb2xsWSAqL1xuICAgIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBWZWxvY2l0eS5TdGF0ZS5zY3JvbGxBbmNob3IgPSB3aW5kb3c7XG4gICAgICAgIFZlbG9jaXR5LlN0YXRlLnNjcm9sbFByb3BlcnR5TGVmdCA9IFwicGFnZVhPZmZzZXRcIjtcbiAgICAgICAgVmVsb2NpdHkuU3RhdGUuc2Nyb2xsUHJvcGVydHlUb3AgPSBcInBhZ2VZT2Zmc2V0XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgVmVsb2NpdHkuU3RhdGUuc2Nyb2xsQW5jaG9yID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZSB8fCBkb2N1bWVudC5ib2R5O1xuICAgICAgICBWZWxvY2l0eS5TdGF0ZS5zY3JvbGxQcm9wZXJ0eUxlZnQgPSBcInNjcm9sbExlZnRcIjtcbiAgICAgICAgVmVsb2NpdHkuU3RhdGUuc2Nyb2xsUHJvcGVydHlUb3AgPSBcInNjcm9sbFRvcFwiO1xuICAgIH1cblxuICAgIC8qIFNob3J0aGFuZCBhbGlhcyBmb3IgalF1ZXJ5J3MgJC5kYXRhKCkgdXRpbGl0eS4gKi9cbiAgICBmdW5jdGlvbiBEYXRhIChlbGVtZW50KSB7XG4gICAgICAgIC8qIEhhcmRjb2RlIGEgcmVmZXJlbmNlIHRvIHRoZSBwbHVnaW4gbmFtZS4gKi9cbiAgICAgICAgdmFyIHJlc3BvbnNlID0gJC5kYXRhKGVsZW1lbnQsIFwidmVsb2NpdHlcIik7XG5cbiAgICAgICAgLyogalF1ZXJ5IDw9MS40LjIgcmV0dXJucyBudWxsIGluc3RlYWQgb2YgdW5kZWZpbmVkIHdoZW4gbm8gbWF0Y2ggaXMgZm91bmQuIFdlIG5vcm1hbGl6ZSB0aGlzIGJlaGF2aW9yLiAqL1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UgPT09IG51bGwgPyB1bmRlZmluZWQgOiByZXNwb25zZTtcbiAgICB9O1xuXG4gICAgLyoqKioqKioqKioqKioqXG4gICAgICAgIEVhc2luZ1xuICAgICoqKioqKioqKioqKioqL1xuXG4gICAgLyogU3RlcCBlYXNpbmcgZ2VuZXJhdG9yLiAqL1xuICAgIGZ1bmN0aW9uIGdlbmVyYXRlU3RlcCAoc3RlcHMpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChwKSB7XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChwICogc3RlcHMpICogKDEgLyBzdGVwcyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyogQmV6aWVyIGN1cnZlIGZ1bmN0aW9uIGdlbmVyYXRvci4gQ29weXJpZ2h0IEdhZXRhbiBSZW5hdWRlYXUuIE1JVCBMaWNlbnNlOiBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL01JVF9MaWNlbnNlICovXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVCZXppZXIgKG1YMSwgbVkxLCBtWDIsIG1ZMikge1xuICAgICAgICB2YXIgTkVXVE9OX0lURVJBVElPTlMgPSA0LFxuICAgICAgICAgICAgTkVXVE9OX01JTl9TTE9QRSA9IDAuMDAxLFxuICAgICAgICAgICAgU1VCRElWSVNJT05fUFJFQ0lTSU9OID0gMC4wMDAwMDAxLFxuICAgICAgICAgICAgU1VCRElWSVNJT05fTUFYX0lURVJBVElPTlMgPSAxMCxcbiAgICAgICAgICAgIGtTcGxpbmVUYWJsZVNpemUgPSAxMSxcbiAgICAgICAgICAgIGtTYW1wbGVTdGVwU2l6ZSA9IDEuMCAvIChrU3BsaW5lVGFibGVTaXplIC0gMS4wKSxcbiAgICAgICAgICAgIGZsb2F0MzJBcnJheVN1cHBvcnRlZCA9IFwiRmxvYXQzMkFycmF5XCIgaW4gd2luZG93O1xuXG4gICAgICAgIC8qIE11c3QgY29udGFpbiBmb3VyIGFyZ3VtZW50cy4gKi9cbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIEFyZ3VtZW50cyBtdXN0IGJlIG51bWJlcnMuICovXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgKytpKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1tpXSAhPT0gXCJudW1iZXJcIiB8fCBpc05hTihhcmd1bWVudHNbaV0pIHx8ICFpc0Zpbml0ZShhcmd1bWVudHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyogWCB2YWx1ZXMgbXVzdCBiZSBpbiB0aGUgWzAsIDFdIHJhbmdlLiAqL1xuICAgICAgICBtWDEgPSBNYXRoLm1pbihtWDEsIDEpO1xuICAgICAgICBtWDIgPSBNYXRoLm1pbihtWDIsIDEpO1xuICAgICAgICBtWDEgPSBNYXRoLm1heChtWDEsIDApO1xuICAgICAgICBtWDIgPSBNYXRoLm1heChtWDIsIDApO1xuXG4gICAgICAgIHZhciBtU2FtcGxlVmFsdWVzID0gZmxvYXQzMkFycmF5U3VwcG9ydGVkID8gbmV3IEZsb2F0MzJBcnJheShrU3BsaW5lVGFibGVTaXplKSA6IG5ldyBBcnJheShrU3BsaW5lVGFibGVTaXplKTtcblxuICAgICAgICBmdW5jdGlvbiBBIChhQTEsIGFBMikgeyByZXR1cm4gMS4wIC0gMy4wICogYUEyICsgMy4wICogYUExOyB9XG4gICAgICAgIGZ1bmN0aW9uIEIgKGFBMSwgYUEyKSB7IHJldHVybiAzLjAgKiBhQTIgLSA2LjAgKiBhQTE7IH1cbiAgICAgICAgZnVuY3Rpb24gQyAoYUExKSAgICAgIHsgcmV0dXJuIDMuMCAqIGFBMTsgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGNhbGNCZXppZXIgKGFULCBhQTEsIGFBMikge1xuICAgICAgICAgICAgcmV0dXJuICgoQShhQTEsIGFBMikqYVQgKyBCKGFBMSwgYUEyKSkqYVQgKyBDKGFBMSkpKmFUO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0U2xvcGUgKGFULCBhQTEsIGFBMikge1xuICAgICAgICAgICAgcmV0dXJuIDMuMCAqIEEoYUExLCBhQTIpKmFUKmFUICsgMi4wICogQihhQTEsIGFBMikgKiBhVCArIEMoYUExKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG5ld3RvblJhcGhzb25JdGVyYXRlIChhWCwgYUd1ZXNzVCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBORVdUT05fSVRFUkFUSU9OUzsgKytpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRTbG9wZSA9IGdldFNsb3BlKGFHdWVzc1QsIG1YMSwgbVgyKTtcblxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U2xvcGUgPT09IDAuMCkgcmV0dXJuIGFHdWVzc1Q7XG5cbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFggPSBjYWxjQmV6aWVyKGFHdWVzc1QsIG1YMSwgbVgyKSAtIGFYO1xuICAgICAgICAgICAgICAgIGFHdWVzc1QgLT0gY3VycmVudFggLyBjdXJyZW50U2xvcGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBhR3Vlc3NUO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2FsY1NhbXBsZVZhbHVlcyAoKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtTcGxpbmVUYWJsZVNpemU7ICsraSkge1xuICAgICAgICAgICAgICAgIG1TYW1wbGVWYWx1ZXNbaV0gPSBjYWxjQmV6aWVyKGkgKiBrU2FtcGxlU3RlcFNpemUsIG1YMSwgbVgyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGJpbmFyeVN1YmRpdmlkZSAoYVgsIGFBLCBhQikge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRYLCBjdXJyZW50VCwgaSA9IDA7XG5cbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50VCA9IGFBICsgKGFCIC0gYUEpIC8gMi4wO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRYID0gY2FsY0JlemllcihjdXJyZW50VCwgbVgxLCBtWDIpIC0gYVg7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRYID4gMC4wKSB7XG4gICAgICAgICAgICAgICAgICBhQiA9IGN1cnJlbnRUO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBhQSA9IGN1cnJlbnRUO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gd2hpbGUgKE1hdGguYWJzKGN1cnJlbnRYKSA+IFNVQkRJVklTSU9OX1BSRUNJU0lPTiAmJiArK2kgPCBTVUJESVZJU0lPTl9NQVhfSVRFUkFUSU9OUyk7XG5cbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50VDtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFRGb3JYIChhWCkge1xuICAgICAgICAgICAgdmFyIGludGVydmFsU3RhcnQgPSAwLjAsXG4gICAgICAgICAgICAgICAgY3VycmVudFNhbXBsZSA9IDEsXG4gICAgICAgICAgICAgICAgbGFzdFNhbXBsZSA9IGtTcGxpbmVUYWJsZVNpemUgLSAxO1xuXG4gICAgICAgICAgICBmb3IgKDsgY3VycmVudFNhbXBsZSAhPSBsYXN0U2FtcGxlICYmIG1TYW1wbGVWYWx1ZXNbY3VycmVudFNhbXBsZV0gPD0gYVg7ICsrY3VycmVudFNhbXBsZSkge1xuICAgICAgICAgICAgICAgIGludGVydmFsU3RhcnQgKz0ga1NhbXBsZVN0ZXBTaXplO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAtLWN1cnJlbnRTYW1wbGU7XG5cbiAgICAgICAgICAgIHZhciBkaXN0ID0gKGFYIC0gbVNhbXBsZVZhbHVlc1tjdXJyZW50U2FtcGxlXSkgLyAobVNhbXBsZVZhbHVlc1tjdXJyZW50U2FtcGxlKzFdIC0gbVNhbXBsZVZhbHVlc1tjdXJyZW50U2FtcGxlXSksXG4gICAgICAgICAgICAgICAgZ3Vlc3NGb3JUID0gaW50ZXJ2YWxTdGFydCArIGRpc3QgKiBrU2FtcGxlU3RlcFNpemUsXG4gICAgICAgICAgICAgICAgaW5pdGlhbFNsb3BlID0gZ2V0U2xvcGUoZ3Vlc3NGb3JULCBtWDEsIG1YMik7XG5cbiAgICAgICAgICAgIGlmIChpbml0aWFsU2xvcGUgPj0gTkVXVE9OX01JTl9TTE9QRSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXd0b25SYXBoc29uSXRlcmF0ZShhWCwgZ3Vlc3NGb3JUKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5pdGlhbFNsb3BlID09IDAuMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBndWVzc0ZvclQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBiaW5hcnlTdWJkaXZpZGUoYVgsIGludGVydmFsU3RhcnQsIGludGVydmFsU3RhcnQgKyBrU2FtcGxlU3RlcFNpemUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIF9wcmVjb21wdXRlZCA9IGZhbHNlO1xuXG4gICAgICAgIGZ1bmN0aW9uIHByZWNvbXB1dGUoKSB7XG4gICAgICAgICAgICBfcHJlY29tcHV0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKG1YMSAhPSBtWTEgfHwgbVgyICE9IG1ZMikgY2FsY1NhbXBsZVZhbHVlcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGYgPSBmdW5jdGlvbiAoYVgpIHtcbiAgICAgICAgICAgIGlmICghX3ByZWNvbXB1dGVkKSBwcmVjb21wdXRlKCk7XG4gICAgICAgICAgICBpZiAobVgxID09PSBtWTEgJiYgbVgyID09PSBtWTIpIHJldHVybiBhWDtcbiAgICAgICAgICAgIGlmIChhWCA9PT0gMCkgcmV0dXJuIDA7XG4gICAgICAgICAgICBpZiAoYVggPT09IDEpIHJldHVybiAxO1xuXG4gICAgICAgICAgICByZXR1cm4gY2FsY0JlemllcihnZXRURm9yWChhWCksIG1ZMSwgbVkyKTtcbiAgICAgICAgfTtcblxuICAgICAgICBmLmdldENvbnRyb2xQb2ludHMgPSBmdW5jdGlvbigpIHsgcmV0dXJuIFt7IHg6IG1YMSwgeTogbVkxIH0sIHsgeDogbVgyLCB5OiBtWTIgfV07IH07XG5cbiAgICAgICAgdmFyIHN0ciA9IFwiZ2VuZXJhdGVCZXppZXIoXCIgKyBbbVgxLCBtWTEsIG1YMiwgbVkyXSArIFwiKVwiO1xuICAgICAgICBmLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gc3RyOyB9O1xuXG4gICAgICAgIHJldHVybiBmO1xuICAgIH1cblxuICAgIC8qIFJ1bmdlLUt1dHRhIHNwcmluZyBwaHlzaWNzIGZ1bmN0aW9uIGdlbmVyYXRvci4gQWRhcHRlZCBmcm9tIEZyYW1lci5qcywgY29weXJpZ2h0IEtvZW4gQm9rLiBNSVQgTGljZW5zZTogaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9NSVRfTGljZW5zZSAqL1xuICAgIC8qIEdpdmVuIGEgdGVuc2lvbiwgZnJpY3Rpb24sIGFuZCBkdXJhdGlvbiwgYSBzaW11bGF0aW9uIGF0IDYwRlBTIHdpbGwgZmlyc3QgcnVuIHdpdGhvdXQgYSBkZWZpbmVkIGR1cmF0aW9uIGluIG9yZGVyIHRvIGNhbGN1bGF0ZSB0aGUgZnVsbCBwYXRoLiBBIHNlY29uZCBwYXNzXG4gICAgICAgdGhlbiBhZGp1c3RzIHRoZSB0aW1lIGRlbHRhIC0tIHVzaW5nIHRoZSByZWxhdGlvbiBiZXR3ZWVuIGFjdHVhbCB0aW1lIGFuZCBkdXJhdGlvbiAtLSB0byBjYWxjdWxhdGUgdGhlIHBhdGggZm9yIHRoZSBkdXJhdGlvbi1jb25zdHJhaW5lZCBhbmltYXRpb24uICovXG4gICAgdmFyIGdlbmVyYXRlU3ByaW5nUks0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gc3ByaW5nQWNjZWxlcmF0aW9uRm9yU3RhdGUgKHN0YXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gKC1zdGF0ZS50ZW5zaW9uICogc3RhdGUueCkgLSAoc3RhdGUuZnJpY3Rpb24gKiBzdGF0ZS52KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNwcmluZ0V2YWx1YXRlU3RhdGVXaXRoRGVyaXZhdGl2ZSAoaW5pdGlhbFN0YXRlLCBkdCwgZGVyaXZhdGl2ZSkge1xuICAgICAgICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICAgICAgICAgIHg6IGluaXRpYWxTdGF0ZS54ICsgZGVyaXZhdGl2ZS5keCAqIGR0LFxuICAgICAgICAgICAgICAgIHY6IGluaXRpYWxTdGF0ZS52ICsgZGVyaXZhdGl2ZS5kdiAqIGR0LFxuICAgICAgICAgICAgICAgIHRlbnNpb246IGluaXRpYWxTdGF0ZS50ZW5zaW9uLFxuICAgICAgICAgICAgICAgIGZyaWN0aW9uOiBpbml0aWFsU3RhdGUuZnJpY3Rpb25cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJldHVybiB7IGR4OiBzdGF0ZS52LCBkdjogc3ByaW5nQWNjZWxlcmF0aW9uRm9yU3RhdGUoc3RhdGUpIH07XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzcHJpbmdJbnRlZ3JhdGVTdGF0ZSAoc3RhdGUsIGR0KSB7XG4gICAgICAgICAgICB2YXIgYSA9IHtcbiAgICAgICAgICAgICAgICAgICAgZHg6IHN0YXRlLnYsXG4gICAgICAgICAgICAgICAgICAgIGR2OiBzcHJpbmdBY2NlbGVyYXRpb25Gb3JTdGF0ZShzdGF0ZSlcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGIgPSBzcHJpbmdFdmFsdWF0ZVN0YXRlV2l0aERlcml2YXRpdmUoc3RhdGUsIGR0ICogMC41LCBhKSxcbiAgICAgICAgICAgICAgICBjID0gc3ByaW5nRXZhbHVhdGVTdGF0ZVdpdGhEZXJpdmF0aXZlKHN0YXRlLCBkdCAqIDAuNSwgYiksXG4gICAgICAgICAgICAgICAgZCA9IHNwcmluZ0V2YWx1YXRlU3RhdGVXaXRoRGVyaXZhdGl2ZShzdGF0ZSwgZHQsIGMpLFxuICAgICAgICAgICAgICAgIGR4ZHQgPSAxLjAgLyA2LjAgKiAoYS5keCArIDIuMCAqIChiLmR4ICsgYy5keCkgKyBkLmR4KSxcbiAgICAgICAgICAgICAgICBkdmR0ID0gMS4wIC8gNi4wICogKGEuZHYgKyAyLjAgKiAoYi5kdiArIGMuZHYpICsgZC5kdik7XG5cbiAgICAgICAgICAgIHN0YXRlLnggPSBzdGF0ZS54ICsgZHhkdCAqIGR0O1xuICAgICAgICAgICAgc3RhdGUudiA9IHN0YXRlLnYgKyBkdmR0ICogZHQ7XG5cbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBzcHJpbmdSSzRGYWN0b3J5ICh0ZW5zaW9uLCBmcmljdGlvbiwgZHVyYXRpb24pIHtcblxuICAgICAgICAgICAgdmFyIGluaXRTdGF0ZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgeDogLTEsXG4gICAgICAgICAgICAgICAgICAgIHY6IDAsXG4gICAgICAgICAgICAgICAgICAgIHRlbnNpb246IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGZyaWN0aW9uOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwYXRoID0gWzBdLFxuICAgICAgICAgICAgICAgIHRpbWVfbGFwc2VkID0gMCxcbiAgICAgICAgICAgICAgICB0b2xlcmFuY2UgPSAxIC8gMTAwMDAsXG4gICAgICAgICAgICAgICAgRFQgPSAxNiAvIDEwMDAsXG4gICAgICAgICAgICAgICAgaGF2ZV9kdXJhdGlvbiwgZHQsIGxhc3Rfc3RhdGU7XG5cbiAgICAgICAgICAgIHRlbnNpb24gPSBwYXJzZUZsb2F0KHRlbnNpb24pIHx8IDUwMDtcbiAgICAgICAgICAgIGZyaWN0aW9uID0gcGFyc2VGbG9hdChmcmljdGlvbikgfHwgMjA7XG4gICAgICAgICAgICBkdXJhdGlvbiA9IGR1cmF0aW9uIHx8IG51bGw7XG5cbiAgICAgICAgICAgIGluaXRTdGF0ZS50ZW5zaW9uID0gdGVuc2lvbjtcbiAgICAgICAgICAgIGluaXRTdGF0ZS5mcmljdGlvbiA9IGZyaWN0aW9uO1xuXG4gICAgICAgICAgICBoYXZlX2R1cmF0aW9uID0gZHVyYXRpb24gIT09IG51bGw7XG5cbiAgICAgICAgICAgIC8qIENhbGN1bGF0ZSB0aGUgYWN0dWFsIHRpbWUgaXQgdGFrZXMgZm9yIHRoaXMgYW5pbWF0aW9uIHRvIGNvbXBsZXRlIHdpdGggdGhlIHByb3ZpZGVkIGNvbmRpdGlvbnMuICovXG4gICAgICAgICAgICBpZiAoaGF2ZV9kdXJhdGlvbikge1xuICAgICAgICAgICAgICAgIC8qIFJ1biB0aGUgc2ltdWxhdGlvbiB3aXRob3V0IGEgZHVyYXRpb24uICovXG4gICAgICAgICAgICAgICAgdGltZV9sYXBzZWQgPSBzcHJpbmdSSzRGYWN0b3J5KHRlbnNpb24sIGZyaWN0aW9uKTtcbiAgICAgICAgICAgICAgICAvKiBDb21wdXRlIHRoZSBhZGp1c3RlZCB0aW1lIGRlbHRhLiAqL1xuICAgICAgICAgICAgICAgIGR0ID0gdGltZV9sYXBzZWQgLyBkdXJhdGlvbiAqIERUO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkdCA9IERUO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIC8qIE5leHQvc3RlcCBmdW5jdGlvbiAuKi9cbiAgICAgICAgICAgICAgICBsYXN0X3N0YXRlID0gc3ByaW5nSW50ZWdyYXRlU3RhdGUobGFzdF9zdGF0ZSB8fCBpbml0U3RhdGUsIGR0KTtcbiAgICAgICAgICAgICAgICAvKiBTdG9yZSB0aGUgcG9zaXRpb24uICovXG4gICAgICAgICAgICAgICAgcGF0aC5wdXNoKDEgKyBsYXN0X3N0YXRlLngpO1xuICAgICAgICAgICAgICAgIHRpbWVfbGFwc2VkICs9IDE2O1xuICAgICAgICAgICAgICAgIC8qIElmIHRoZSBjaGFuZ2UgdGhyZXNob2xkIGlzIHJlYWNoZWQsIGJyZWFrLiAqL1xuICAgICAgICAgICAgICAgIGlmICghKE1hdGguYWJzKGxhc3Rfc3RhdGUueCkgPiB0b2xlcmFuY2UgJiYgTWF0aC5hYnMobGFzdF9zdGF0ZS52KSA+IHRvbGVyYW5jZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBJZiBkdXJhdGlvbiBpcyBub3QgZGVmaW5lZCwgcmV0dXJuIHRoZSBhY3R1YWwgdGltZSByZXF1aXJlZCBmb3IgY29tcGxldGluZyB0aGlzIGFuaW1hdGlvbi4gT3RoZXJ3aXNlLCByZXR1cm4gYSBjbG9zdXJlIHRoYXQgaG9sZHMgdGhlXG4gICAgICAgICAgICAgICBjb21wdXRlZCBwYXRoIGFuZCByZXR1cm5zIGEgc25hcHNob3Qgb2YgdGhlIHBvc2l0aW9uIGFjY29yZGluZyB0byBhIGdpdmVuIHBlcmNlbnRDb21wbGV0ZS4gKi9cbiAgICAgICAgICAgIHJldHVybiAhaGF2ZV9kdXJhdGlvbiA/IHRpbWVfbGFwc2VkIDogZnVuY3Rpb24ocGVyY2VudENvbXBsZXRlKSB7IHJldHVybiBwYXRoWyAocGVyY2VudENvbXBsZXRlICogKHBhdGgubGVuZ3RoIC0gMSkpIHwgMCBdOyB9O1xuICAgICAgICB9O1xuICAgIH0oKSk7XG5cbiAgICAvKiBqUXVlcnkgZWFzaW5ncy4gKi9cbiAgICBWZWxvY2l0eS5FYXNpbmdzID0ge1xuICAgICAgICBsaW5lYXI6IGZ1bmN0aW9uKHApIHsgcmV0dXJuIHA7IH0sXG4gICAgICAgIHN3aW5nOiBmdW5jdGlvbihwKSB7IHJldHVybiAwLjUgLSBNYXRoLmNvcyggcCAqIE1hdGguUEkgKSAvIDIgfSxcbiAgICAgICAgLyogQm9udXMgXCJzcHJpbmdcIiBlYXNpbmcsIHdoaWNoIGlzIGEgbGVzcyBleGFnZ2VyYXRlZCB2ZXJzaW9uIG9mIGVhc2VJbk91dEVsYXN0aWMuICovXG4gICAgICAgIHNwcmluZzogZnVuY3Rpb24ocCkgeyByZXR1cm4gMSAtIChNYXRoLmNvcyhwICogNC41ICogTWF0aC5QSSkgKiBNYXRoLmV4cCgtcCAqIDYpKTsgfVxuICAgIH07XG5cbiAgICAvKiBDU1MzIGFuZCBSb2JlcnQgUGVubmVyIGVhc2luZ3MuICovXG4gICAgJC5lYWNoKFxuICAgICAgICBbXG4gICAgICAgICAgICBbIFwiZWFzZVwiLCBbIDAuMjUsIDAuMSwgMC4yNSwgMS4wIF0gXSxcbiAgICAgICAgICAgIFsgXCJlYXNlLWluXCIsIFsgMC40MiwgMC4wLCAxLjAwLCAxLjAgXSBdLFxuICAgICAgICAgICAgWyBcImVhc2Utb3V0XCIsIFsgMC4wMCwgMC4wLCAwLjU4LCAxLjAgXSBdLFxuICAgICAgICAgICAgWyBcImVhc2UtaW4tb3V0XCIsIFsgMC40MiwgMC4wLCAwLjU4LCAxLjAgXSBdLFxuICAgICAgICAgICAgWyBcImVhc2VJblNpbmVcIiwgWyAwLjQ3LCAwLCAwLjc0NSwgMC43MTUgXSBdLFxuICAgICAgICAgICAgWyBcImVhc2VPdXRTaW5lXCIsIFsgMC4zOSwgMC41NzUsIDAuNTY1LCAxIF0gXSxcbiAgICAgICAgICAgIFsgXCJlYXNlSW5PdXRTaW5lXCIsIFsgMC40NDUsIDAuMDUsIDAuNTUsIDAuOTUgXSBdLFxuICAgICAgICAgICAgWyBcImVhc2VJblF1YWRcIiwgWyAwLjU1LCAwLjA4NSwgMC42OCwgMC41MyBdIF0sXG4gICAgICAgICAgICBbIFwiZWFzZU91dFF1YWRcIiwgWyAwLjI1LCAwLjQ2LCAwLjQ1LCAwLjk0IF0gXSxcbiAgICAgICAgICAgIFsgXCJlYXNlSW5PdXRRdWFkXCIsIFsgMC40NTUsIDAuMDMsIDAuNTE1LCAwLjk1NSBdIF0sXG4gICAgICAgICAgICBbIFwiZWFzZUluQ3ViaWNcIiwgWyAwLjU1LCAwLjA1NSwgMC42NzUsIDAuMTkgXSBdLFxuICAgICAgICAgICAgWyBcImVhc2VPdXRDdWJpY1wiLCBbIDAuMjE1LCAwLjYxLCAwLjM1NSwgMSBdIF0sXG4gICAgICAgICAgICBbIFwiZWFzZUluT3V0Q3ViaWNcIiwgWyAwLjY0NSwgMC4wNDUsIDAuMzU1LCAxIF0gXSxcbiAgICAgICAgICAgIFsgXCJlYXNlSW5RdWFydFwiLCBbIDAuODk1LCAwLjAzLCAwLjY4NSwgMC4yMiBdIF0sXG4gICAgICAgICAgICBbIFwiZWFzZU91dFF1YXJ0XCIsIFsgMC4xNjUsIDAuODQsIDAuNDQsIDEgXSBdLFxuICAgICAgICAgICAgWyBcImVhc2VJbk91dFF1YXJ0XCIsIFsgMC43NywgMCwgMC4xNzUsIDEgXSBdLFxuICAgICAgICAgICAgWyBcImVhc2VJblF1aW50XCIsIFsgMC43NTUsIDAuMDUsIDAuODU1LCAwLjA2IF0gXSxcbiAgICAgICAgICAgIFsgXCJlYXNlT3V0UXVpbnRcIiwgWyAwLjIzLCAxLCAwLjMyLCAxIF0gXSxcbiAgICAgICAgICAgIFsgXCJlYXNlSW5PdXRRdWludFwiLCBbIDAuODYsIDAsIDAuMDcsIDEgXSBdLFxuICAgICAgICAgICAgWyBcImVhc2VJbkV4cG9cIiwgWyAwLjk1LCAwLjA1LCAwLjc5NSwgMC4wMzUgXSBdLFxuICAgICAgICAgICAgWyBcImVhc2VPdXRFeHBvXCIsIFsgMC4xOSwgMSwgMC4yMiwgMSBdIF0sXG4gICAgICAgICAgICBbIFwiZWFzZUluT3V0RXhwb1wiLCBbIDEsIDAsIDAsIDEgXSBdLFxuICAgICAgICAgICAgWyBcImVhc2VJbkNpcmNcIiwgWyAwLjYsIDAuMDQsIDAuOTgsIDAuMzM1IF0gXSxcbiAgICAgICAgICAgIFsgXCJlYXNlT3V0Q2lyY1wiLCBbIDAuMDc1LCAwLjgyLCAwLjE2NSwgMSBdIF0sXG4gICAgICAgICAgICBbIFwiZWFzZUluT3V0Q2lyY1wiLCBbIDAuNzg1LCAwLjEzNSwgMC4xNSwgMC44NiBdIF1cbiAgICAgICAgXSwgZnVuY3Rpb24oaSwgZWFzaW5nQXJyYXkpIHtcbiAgICAgICAgICAgIFZlbG9jaXR5LkVhc2luZ3NbZWFzaW5nQXJyYXlbMF1dID0gZ2VuZXJhdGVCZXppZXIuYXBwbHkobnVsbCwgZWFzaW5nQXJyYXlbMV0pO1xuICAgICAgICB9KTtcblxuICAgIC8qIERldGVybWluZSB0aGUgYXBwcm9wcmlhdGUgZWFzaW5nIHR5cGUgZ2l2ZW4gYW4gZWFzaW5nIGlucHV0LiAqL1xuICAgIGZ1bmN0aW9uIGdldEVhc2luZyh2YWx1ZSwgZHVyYXRpb24pIHtcbiAgICAgICAgdmFyIGVhc2luZyA9IHZhbHVlO1xuXG4gICAgICAgIC8qIFRoZSBlYXNpbmcgb3B0aW9uIGNhbiBlaXRoZXIgYmUgYSBzdHJpbmcgdGhhdCByZWZlcmVuY2VzIGEgcHJlLXJlZ2lzdGVyZWQgZWFzaW5nLFxuICAgICAgICAgICBvciBpdCBjYW4gYmUgYSB0d28tL2ZvdXItaXRlbSBhcnJheSBvZiBpbnRlZ2VycyB0byBiZSBjb252ZXJ0ZWQgaW50byBhIGJlemllci9zcHJpbmcgZnVuY3Rpb24uICovXG4gICAgICAgIGlmIChUeXBlLmlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICAgICAgLyogRW5zdXJlIHRoYXQgdGhlIGVhc2luZyBoYXMgYmVlbiBhc3NpZ25lZCB0byBqUXVlcnkncyBWZWxvY2l0eS5FYXNpbmdzIG9iamVjdC4gKi9cbiAgICAgICAgICAgIGlmICghVmVsb2NpdHkuRWFzaW5nc1t2YWx1ZV0pIHtcbiAgICAgICAgICAgICAgICBlYXNpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChUeXBlLmlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgZWFzaW5nID0gZ2VuZXJhdGVTdGVwLmFwcGx5KG51bGwsIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChUeXBlLmlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgLyogc3ByaW5nUks0IG11c3QgYmUgcGFzc2VkIHRoZSBhbmltYXRpb24ncyBkdXJhdGlvbi4gKi9cbiAgICAgICAgICAgIC8qIE5vdGU6IElmIHRoZSBzcHJpbmdSSzQgYXJyYXkgY29udGFpbnMgbm9uLW51bWJlcnMsIGdlbmVyYXRlU3ByaW5nUks0KCkgcmV0dXJucyBhbiBlYXNpbmdcbiAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdlbmVyYXRlZCB3aXRoIGRlZmF1bHQgdGVuc2lvbiBhbmQgZnJpY3Rpb24gdmFsdWVzLiAqL1xuICAgICAgICAgICAgZWFzaW5nID0gZ2VuZXJhdGVTcHJpbmdSSzQuYXBwbHkobnVsbCwgdmFsdWUuY29uY2F0KFsgZHVyYXRpb24gXSkpO1xuICAgICAgICB9IGVsc2UgaWYgKFR5cGUuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSA0KSB7XG4gICAgICAgICAgICAvKiBOb3RlOiBJZiB0aGUgYmV6aWVyIGFycmF5IGNvbnRhaW5zIG5vbi1udW1iZXJzLCBnZW5lcmF0ZUJlemllcigpIHJldHVybnMgZmFsc2UuICovXG4gICAgICAgICAgICBlYXNpbmcgPSBnZW5lcmF0ZUJlemllci5hcHBseShudWxsLCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlYXNpbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIFJldmVydCB0byB0aGUgVmVsb2NpdHktd2lkZSBkZWZhdWx0IGVhc2luZyB0eXBlLCBvciBmYWxsIGJhY2sgdG8gXCJzd2luZ1wiICh3aGljaCBpcyBhbHNvIGpRdWVyeSdzIGRlZmF1bHQpXG4gICAgICAgICAgIGlmIHRoZSBWZWxvY2l0eS13aWRlIGRlZmF1bHQgaGFzIGJlZW4gaW5jb3JyZWN0bHkgbW9kaWZpZWQuICovXG4gICAgICAgIGlmIChlYXNpbmcgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBpZiAoVmVsb2NpdHkuRWFzaW5nc1tWZWxvY2l0eS5kZWZhdWx0cy5lYXNpbmddKSB7XG4gICAgICAgICAgICAgICAgZWFzaW5nID0gVmVsb2NpdHkuZGVmYXVsdHMuZWFzaW5nO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlYXNpbmcgPSBFQVNJTkdfREVGQVVMVDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBlYXNpbmc7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqXG4gICAgICAgIENTUyBTdGFja1xuICAgICoqKioqKioqKioqKioqKioqL1xuXG4gICAgLyogVGhlIENTUyBvYmplY3QgaXMgYSBoaWdobHkgY29uZGVuc2VkIGFuZCBwZXJmb3JtYW50IENTUyBzdGFjayB0aGF0IGZ1bGx5IHJlcGxhY2VzIGpRdWVyeSdzLlxuICAgICAgIEl0IGhhbmRsZXMgdGhlIHZhbGlkYXRpb24sIGdldHRpbmcsIGFuZCBzZXR0aW5nIG9mIGJvdGggc3RhbmRhcmQgQ1NTIHByb3BlcnRpZXMgYW5kIENTUyBwcm9wZXJ0eSBob29rcy4gKi9cbiAgICAvKiBOb3RlOiBBIFwiQ1NTXCIgc2hvcnRoYW5kIGlzIGFsaWFzZWQgc28gdGhhdCBvdXIgY29kZSBpcyBlYXNpZXIgdG8gcmVhZC4gKi9cbiAgICB2YXIgQ1NTID0gVmVsb2NpdHkuQ1NTID0ge1xuXG4gICAgICAgIC8qKioqKioqKioqKioqXG4gICAgICAgICAgICBSZWdFeFxuICAgICAgICAqKioqKioqKioqKioqL1xuXG4gICAgICAgIFJlZ0V4OiB7XG4gICAgICAgICAgICBpc0hleDogL14jKFtBLWZcXGRdezN9KXsxLDJ9JC9pLFxuICAgICAgICAgICAgLyogVW53cmFwIGEgcHJvcGVydHkgdmFsdWUncyBzdXJyb3VuZGluZyB0ZXh0LCBlLmcuIFwicmdiYSg0LCAzLCAyLCAxKVwiID09PiBcIjQsIDMsIDIsIDFcIiBhbmQgXCJyZWN0KDRweCAzcHggMnB4IDFweClcIiA9PT4gXCI0cHggM3B4IDJweCAxcHhcIi4gKi9cbiAgICAgICAgICAgIHZhbHVlVW53cmFwOiAvXltBLXpdK1xcKCguKilcXCkkL2ksXG4gICAgICAgICAgICB3cmFwcGVkVmFsdWVBbHJlYWR5RXh0cmFjdGVkOiAvWzAtOS5dKyBbMC05Ll0rIFswLTkuXSsoIFswLTkuXSspPy8sXG4gICAgICAgICAgICAvKiBTcGxpdCBhIG11bHRpLXZhbHVlIHByb3BlcnR5IGludG8gYW4gYXJyYXkgb2Ygc3VidmFsdWVzLCBlLmcuIFwicmdiYSg0LCAzLCAyLCAxKSA0cHggM3B4IDJweCAxcHhcIiA9PT4gWyBcInJnYmEoNCwgMywgMiwgMSlcIiwgXCI0cHhcIiwgXCIzcHhcIiwgXCIycHhcIiwgXCIxcHhcIiBdLiAqL1xuICAgICAgICAgICAgdmFsdWVTcGxpdDogLyhbQS16XStcXCguK1xcKSl8KChbQS16MC05Iy0uXSs/KSg/PVxcc3wkKSkvaWdcbiAgICAgICAgfSxcblxuICAgICAgICAvKioqKioqKioqKioqXG4gICAgICAgICAgICBMaXN0c1xuICAgICAgICAqKioqKioqKioqKiovXG5cbiAgICAgICAgTGlzdHM6IHtcbiAgICAgICAgICAgIGNvbG9yczogWyBcImZpbGxcIiwgXCJzdHJva2VcIiwgXCJzdG9wQ29sb3JcIiwgXCJjb2xvclwiLCBcImJhY2tncm91bmRDb2xvclwiLCBcImJvcmRlckNvbG9yXCIsIFwiYm9yZGVyVG9wQ29sb3JcIiwgXCJib3JkZXJSaWdodENvbG9yXCIsIFwiYm9yZGVyQm90dG9tQ29sb3JcIiwgXCJib3JkZXJMZWZ0Q29sb3JcIiwgXCJvdXRsaW5lQ29sb3JcIiBdLFxuICAgICAgICAgICAgdHJhbnNmb3Jtc0Jhc2U6IFsgXCJ0cmFuc2xhdGVYXCIsIFwidHJhbnNsYXRlWVwiLCBcInNjYWxlXCIsIFwic2NhbGVYXCIsIFwic2NhbGVZXCIsIFwic2tld1hcIiwgXCJza2V3WVwiLCBcInJvdGF0ZVpcIiBdLFxuICAgICAgICAgICAgdHJhbnNmb3JtczNEOiBbIFwidHJhbnNmb3JtUGVyc3BlY3RpdmVcIiwgXCJ0cmFuc2xhdGVaXCIsIFwic2NhbGVaXCIsIFwicm90YXRlWFwiLCBcInJvdGF0ZVlcIiBdXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqKioqKioqKioqKlxuICAgICAgICAgICAgSG9va3NcbiAgICAgICAgKioqKioqKioqKioqL1xuXG4gICAgICAgIC8qIEhvb2tzIGFsbG93IGEgc3VicHJvcGVydHkgKGUuZy4gXCJib3hTaGFkb3dCbHVyXCIpIG9mIGEgY29tcG91bmQtdmFsdWUgQ1NTIHByb3BlcnR5XG4gICAgICAgICAgIChlLmcuIFwiYm94U2hhZG93OiBYIFkgQmx1ciBTcHJlYWQgQ29sb3JcIikgdG8gYmUgYW5pbWF0ZWQgYXMgaWYgaXQgd2VyZSBhIGRpc2NyZXRlIHByb3BlcnR5LiAqL1xuICAgICAgICAvKiBOb3RlOiBCZXlvbmQgZW5hYmxpbmcgZmluZS1ncmFpbmVkIHByb3BlcnR5IGFuaW1hdGlvbiwgaG9va2luZyBpcyBuZWNlc3Nhcnkgc2luY2UgVmVsb2NpdHkgb25seVxuICAgICAgICAgICB0d2VlbnMgcHJvcGVydGllcyB3aXRoIHNpbmdsZSBudW1lcmljIHZhbHVlczsgdW5saWtlIENTUyB0cmFuc2l0aW9ucywgVmVsb2NpdHkgZG9lcyBub3QgaW50ZXJwb2xhdGUgY29tcG91bmQtdmFsdWVzLiAqL1xuICAgICAgICBIb29rczoge1xuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgUmVnaXN0cmF0aW9uXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgLyogVGVtcGxhdGVzIGFyZSBhIGNvbmNpc2Ugd2F5IG9mIGluZGljYXRpbmcgd2hpY2ggc3VicHJvcGVydGllcyBtdXN0IGJlIGluZGl2aWR1YWxseSByZWdpc3RlcmVkIGZvciBlYWNoIGNvbXBvdW5kLXZhbHVlIENTUyBwcm9wZXJ0eS4gKi9cbiAgICAgICAgICAgIC8qIEVhY2ggdGVtcGxhdGUgY29uc2lzdHMgb2YgdGhlIGNvbXBvdW5kLXZhbHVlJ3MgYmFzZSBuYW1lLCBpdHMgY29uc3RpdHVlbnQgc3VicHJvcGVydHkgbmFtZXMsIGFuZCB0aG9zZSBzdWJwcm9wZXJ0aWVzJyBkZWZhdWx0IHZhbHVlcy4gKi9cbiAgICAgICAgICAgIHRlbXBsYXRlczoge1xuICAgICAgICAgICAgICAgIFwidGV4dFNoYWRvd1wiOiBbIFwiQ29sb3IgWCBZIEJsdXJcIiwgXCJibGFjayAwcHggMHB4IDBweFwiIF0sXG4gICAgICAgICAgICAgICAgXCJib3hTaGFkb3dcIjogWyBcIkNvbG9yIFggWSBCbHVyIFNwcmVhZFwiLCBcImJsYWNrIDBweCAwcHggMHB4IDBweFwiIF0sXG4gICAgICAgICAgICAgICAgXCJjbGlwXCI6IFsgXCJUb3AgUmlnaHQgQm90dG9tIExlZnRcIiwgXCIwcHggMHB4IDBweCAwcHhcIiBdLFxuICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZFBvc2l0aW9uXCI6IFsgXCJYIFlcIiwgXCIwJSAwJVwiIF0sXG4gICAgICAgICAgICAgICAgXCJ0cmFuc2Zvcm1PcmlnaW5cIjogWyBcIlggWSBaXCIsIFwiNTAlIDUwJSAwcHhcIiBdLFxuICAgICAgICAgICAgICAgIFwicGVyc3BlY3RpdmVPcmlnaW5cIjogWyBcIlggWVwiLCBcIjUwJSA1MCVcIiBdXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKiBBIFwicmVnaXN0ZXJlZFwiIGhvb2sgaXMgb25lIHRoYXQgaGFzIGJlZW4gY29udmVydGVkIGZyb20gaXRzIHRlbXBsYXRlIGZvcm0gaW50byBhIGxpdmUsXG4gICAgICAgICAgICAgICB0d2VlbmFibGUgcHJvcGVydHkuIEl0IGNvbnRhaW5zIGRhdGEgdG8gYXNzb2NpYXRlIGl0IHdpdGggaXRzIHJvb3QgcHJvcGVydHkuICovXG4gICAgICAgICAgICByZWdpc3RlcmVkOiB7XG4gICAgICAgICAgICAgICAgLyogTm90ZTogQSByZWdpc3RlcmVkIGhvb2sgbG9va3MgbGlrZSB0aGlzID09PiB0ZXh0U2hhZG93Qmx1cjogWyBcInRleHRTaGFkb3dcIiwgMyBdLFxuICAgICAgICAgICAgICAgICAgIHdoaWNoIGNvbnNpc3RzIG9mIHRoZSBzdWJwcm9wZXJ0eSdzIG5hbWUsIHRoZSBhc3NvY2lhdGVkIHJvb3QgcHJvcGVydHkncyBuYW1lLFxuICAgICAgICAgICAgICAgICAgIGFuZCB0aGUgc3VicHJvcGVydHkncyBwb3NpdGlvbiBpbiB0aGUgcm9vdCdzIHZhbHVlLiAqL1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qIENvbnZlcnQgdGhlIHRlbXBsYXRlcyBpbnRvIGluZGl2aWR1YWwgaG9va3MgdGhlbiBhcHBlbmQgdGhlbSB0byB0aGUgcmVnaXN0ZXJlZCBvYmplY3QgYWJvdmUuICovXG4gICAgICAgICAgICByZWdpc3RlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIC8qIENvbG9yIGhvb2tzIHJlZ2lzdHJhdGlvbjogQ29sb3JzIGFyZSBkZWZhdWx0ZWQgdG8gd2hpdGUgLS0gYXMgb3Bwb3NlZCB0byBibGFjayAtLSBzaW5jZSBjb2xvcnMgdGhhdCBhcmVcbiAgICAgICAgICAgICAgICAgICBjdXJyZW50bHkgc2V0IHRvIFwidHJhbnNwYXJlbnRcIiBkZWZhdWx0IHRvIHRoZWlyIHJlc3BlY3RpdmUgdGVtcGxhdGUgYmVsb3cgd2hlbiBjb2xvci1hbmltYXRlZCxcbiAgICAgICAgICAgICAgICAgICBhbmQgd2hpdGUgaXMgdHlwaWNhbGx5IGEgY2xvc2VyIG1hdGNoIHRvIHRyYW5zcGFyZW50IHRoYW4gYmxhY2sgaXMuIEFuIGV4Y2VwdGlvbiBpcyBtYWRlIGZvciB0ZXh0IChcImNvbG9yXCIpLFxuICAgICAgICAgICAgICAgICAgIHdoaWNoIGlzIGFsbW9zdCBhbHdheXMgc2V0IGNsb3NlciB0byBibGFjayB0aGFuIHdoaXRlLiAqL1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgQ1NTLkxpc3RzLmNvbG9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmdiQ29tcG9uZW50cyA9IChDU1MuTGlzdHMuY29sb3JzW2ldID09PSBcImNvbG9yXCIpID8gXCIwIDAgMCAxXCIgOiBcIjI1NSAyNTUgMjU1IDFcIjtcbiAgICAgICAgICAgICAgICAgICAgQ1NTLkhvb2tzLnRlbXBsYXRlc1tDU1MuTGlzdHMuY29sb3JzW2ldXSA9IFsgXCJSZWQgR3JlZW4gQmx1ZSBBbHBoYVwiLCByZ2JDb21wb25lbnRzIF07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHJvb3RQcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICAgICAgaG9va1RlbXBsYXRlLFxuICAgICAgICAgICAgICAgICAgICBob29rTmFtZXM7XG5cbiAgICAgICAgICAgICAgICAvKiBJbiBJRSwgY29sb3IgdmFsdWVzIGluc2lkZSBjb21wb3VuZC12YWx1ZSBwcm9wZXJ0aWVzIGFyZSBwb3NpdGlvbmVkIGF0IHRoZSBlbmQgdGhlIHZhbHVlIGluc3RlYWQgb2YgYXQgdGhlIGJlZ2lubmluZy5cbiAgICAgICAgICAgICAgICAgICBUaHVzLCB3ZSByZS1hcnJhbmdlIHRoZSB0ZW1wbGF0ZXMgYWNjb3JkaW5nbHkuICovXG4gICAgICAgICAgICAgICAgaWYgKElFKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAocm9vdFByb3BlcnR5IGluIENTUy5Ib29rcy50ZW1wbGF0ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2tUZW1wbGF0ZSA9IENTUy5Ib29rcy50ZW1wbGF0ZXNbcm9vdFByb3BlcnR5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2tOYW1lcyA9IGhvb2tUZW1wbGF0ZVswXS5zcGxpdChcIiBcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWZhdWx0VmFsdWVzID0gaG9va1RlbXBsYXRlWzFdLm1hdGNoKENTUy5SZWdFeC52YWx1ZVNwbGl0KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhvb2tOYW1lc1swXSA9PT0gXCJDb2xvclwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogUmVwb3NpdGlvbiBib3RoIHRoZSBob29rJ3MgbmFtZSBhbmQgaXRzIGRlZmF1bHQgdmFsdWUgdG8gdGhlIGVuZCBvZiB0aGVpciByZXNwZWN0aXZlIHN0cmluZ3MuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9va05hbWVzLnB1c2goaG9va05hbWVzLnNoaWZ0KCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRWYWx1ZXMucHVzaChkZWZhdWx0VmFsdWVzLnNoaWZ0KCkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogUmVwbGFjZSB0aGUgZXhpc3RpbmcgdGVtcGxhdGUgZm9yIHRoZSBob29rJ3Mgcm9vdCBwcm9wZXJ0eS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDU1MuSG9va3MudGVtcGxhdGVzW3Jvb3RQcm9wZXJ0eV0gPSBbIGhvb2tOYW1lcy5qb2luKFwiIFwiKSwgZGVmYXVsdFZhbHVlcy5qb2luKFwiIFwiKSBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyogSG9vayByZWdpc3RyYXRpb24uICovXG4gICAgICAgICAgICAgICAgZm9yIChyb290UHJvcGVydHkgaW4gQ1NTLkhvb2tzLnRlbXBsYXRlcykge1xuICAgICAgICAgICAgICAgICAgICBob29rVGVtcGxhdGUgPSBDU1MuSG9va3MudGVtcGxhdGVzW3Jvb3RQcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgICAgIGhvb2tOYW1lcyA9IGhvb2tUZW1wbGF0ZVswXS5zcGxpdChcIiBcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBob29rTmFtZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmdWxsSG9va05hbWUgPSByb290UHJvcGVydHkgKyBob29rTmFtZXNbaV0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaG9va1Bvc2l0aW9uID0gaTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogRm9yIGVhY2ggaG9vaywgcmVnaXN0ZXIgaXRzIGZ1bGwgbmFtZSAoZS5nLiB0ZXh0U2hhZG93Qmx1cikgd2l0aCBpdHMgcm9vdCBwcm9wZXJ0eSAoZS5nLiB0ZXh0U2hhZG93KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIHRoZSBob29rJ3MgcG9zaXRpb24gaW4gaXRzIHRlbXBsYXRlJ3MgZGVmYXVsdCB2YWx1ZSBzdHJpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBDU1MuSG9va3MucmVnaXN0ZXJlZFtmdWxsSG9va05hbWVdID0gWyByb290UHJvcGVydHksIGhvb2tQb3NpdGlvbiBdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICBJbmplY3Rpb24gYW5kIEV4dHJhY3Rpb25cbiAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAvKiBMb29rIHVwIHRoZSByb290IHByb3BlcnR5IGFzc29jaWF0ZWQgd2l0aCB0aGUgaG9vayAoZS5nLiByZXR1cm4gXCJ0ZXh0U2hhZG93XCIgZm9yIFwidGV4dFNoYWRvd0JsdXJcIikuICovXG4gICAgICAgICAgICAvKiBTaW5jZSBhIGhvb2sgY2Fubm90IGJlIHNldCBkaXJlY3RseSAodGhlIGJyb3dzZXIgd29uJ3QgcmVjb2duaXplIGl0KSwgc3R5bGUgdXBkYXRpbmcgZm9yIGhvb2tzIGlzIHJvdXRlZCB0aHJvdWdoIHRoZSBob29rJ3Mgcm9vdCBwcm9wZXJ0eS4gKi9cbiAgICAgICAgICAgIGdldFJvb3Q6IGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgIHZhciBob29rRGF0YSA9IENTUy5Ib29rcy5yZWdpc3RlcmVkW3Byb3BlcnR5XTtcblxuICAgICAgICAgICAgICAgIGlmIChob29rRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaG9va0RhdGFbMF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlcmUgd2FzIG5vIGhvb2sgbWF0Y2gsIHJldHVybiB0aGUgcHJvcGVydHkgbmFtZSB1bnRvdWNoZWQuICovXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyogQ29udmVydCBhbnkgcm9vdFByb3BlcnR5VmFsdWUsIG51bGwgb3Igb3RoZXJ3aXNlLCBpbnRvIGEgc3BhY2UtZGVsaW1pdGVkIGxpc3Qgb2YgaG9vayB2YWx1ZXMgc28gdGhhdFxuICAgICAgICAgICAgICAgdGhlIHRhcmdldGVkIGhvb2sgY2FuIGJlIGluamVjdGVkIG9yIGV4dHJhY3RlZCBhdCBpdHMgc3RhbmRhcmQgcG9zaXRpb24uICovXG4gICAgICAgICAgICBjbGVhblJvb3RQcm9wZXJ0eVZhbHVlOiBmdW5jdGlvbihyb290UHJvcGVydHksIHJvb3RQcm9wZXJ0eVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgLyogSWYgdGhlIHJvb3RQcm9wZXJ0eVZhbHVlIGlzIHdyYXBwZWQgd2l0aCBcInJnYigpXCIsIFwiY2xpcCgpXCIsIGV0Yy4sIHJlbW92ZSB0aGUgd3JhcHBpbmcgdG8gbm9ybWFsaXplIHRoZSB2YWx1ZSBiZWZvcmUgbWFuaXB1bGF0aW9uLiAqL1xuICAgICAgICAgICAgICAgIGlmIChDU1MuUmVnRXgudmFsdWVVbndyYXAudGVzdChyb290UHJvcGVydHlWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWUgPSByb290UHJvcGVydHlWYWx1ZS5tYXRjaChDU1MuUmVnRXgudmFsdWVVbndyYXApWzFdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qIElmIHJvb3RQcm9wZXJ0eVZhbHVlIGlzIGEgQ1NTIG51bGwtdmFsdWUgKGZyb20gd2hpY2ggdGhlcmUncyBpbmhlcmVudGx5IG5vIGhvb2sgdmFsdWUgdG8gZXh0cmFjdCksXG4gICAgICAgICAgICAgICAgICAgZGVmYXVsdCB0byB0aGUgcm9vdCdzIGRlZmF1bHQgdmFsdWUgYXMgZGVmaW5lZCBpbiBDU1MuSG9va3MudGVtcGxhdGVzLiAqL1xuICAgICAgICAgICAgICAgIC8qIE5vdGU6IENTUyBudWxsLXZhbHVlcyBpbmNsdWRlIFwibm9uZVwiLCBcImF1dG9cIiwgYW5kIFwidHJhbnNwYXJlbnRcIi4gVGhleSBtdXN0IGJlIGNvbnZlcnRlZCBpbnRvIHRoZWlyXG4gICAgICAgICAgICAgICAgICAgemVyby12YWx1ZXMgKGUuZy4gdGV4dFNoYWRvdzogXCJub25lXCIgPT0+IHRleHRTaGFkb3c6IFwiMHB4IDBweCAwcHggYmxhY2tcIikgZm9yIGhvb2sgbWFuaXB1bGF0aW9uIHRvIHByb2NlZWQuICovXG4gICAgICAgICAgICAgICAgaWYgKENTUy5WYWx1ZXMuaXNDU1NOdWxsVmFsdWUocm9vdFByb3BlcnR5VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlID0gQ1NTLkhvb2tzLnRlbXBsYXRlc1tyb290UHJvcGVydHldWzFdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiByb290UHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiBFeHRyYWN0ZWQgdGhlIGhvb2sncyB2YWx1ZSBmcm9tIGl0cyByb290IHByb3BlcnR5J3MgdmFsdWUuIFRoaXMgaXMgdXNlZCB0byBnZXQgdGhlIHN0YXJ0aW5nIHZhbHVlIG9mIGFuIGFuaW1hdGluZyBob29rLiAqL1xuICAgICAgICAgICAgZXh0cmFjdFZhbHVlOiBmdW5jdGlvbiAoZnVsbEhvb2tOYW1lLCByb290UHJvcGVydHlWYWx1ZSkge1xuICAgICAgICAgICAgICAgIHZhciBob29rRGF0YSA9IENTUy5Ib29rcy5yZWdpc3RlcmVkW2Z1bGxIb29rTmFtZV07XG5cbiAgICAgICAgICAgICAgICBpZiAoaG9va0RhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhvb2tSb290ID0gaG9va0RhdGFbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBob29rUG9zaXRpb24gPSBob29rRGF0YVsxXTtcblxuICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSA9IENTUy5Ib29rcy5jbGVhblJvb3RQcm9wZXJ0eVZhbHVlKGhvb2tSb290LCByb290UHJvcGVydHlWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogU3BsaXQgcm9vdFByb3BlcnR5VmFsdWUgaW50byBpdHMgY29uc3RpdHVlbnQgaG9vayB2YWx1ZXMgdGhlbiBncmFiIHRoZSBkZXNpcmVkIGhvb2sgYXQgaXRzIHN0YW5kYXJkIHBvc2l0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcm9vdFByb3BlcnR5VmFsdWUudG9TdHJpbmcoKS5tYXRjaChDU1MuUmVnRXgudmFsdWVTcGxpdClbaG9va1Bvc2l0aW9uXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgcHJvdmlkZWQgZnVsbEhvb2tOYW1lIGlzbid0IGEgcmVnaXN0ZXJlZCBob29rLCByZXR1cm4gdGhlIHJvb3RQcm9wZXJ0eVZhbHVlIHRoYXQgd2FzIHBhc3NlZCBpbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvb3RQcm9wZXJ0eVZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiBJbmplY3QgdGhlIGhvb2sncyB2YWx1ZSBpbnRvIGl0cyByb290IHByb3BlcnR5J3MgdmFsdWUuIFRoaXMgaXMgdXNlZCB0byBwaWVjZSBiYWNrIHRvZ2V0aGVyIHRoZSByb290IHByb3BlcnR5XG4gICAgICAgICAgICAgICBvbmNlIFZlbG9jaXR5IGhhcyB1cGRhdGVkIG9uZSBvZiBpdHMgaW5kaXZpZHVhbGx5IGhvb2tlZCB2YWx1ZXMgdGhyb3VnaCB0d2VlbmluZy4gKi9cbiAgICAgICAgICAgIGluamVjdFZhbHVlOiBmdW5jdGlvbiAoZnVsbEhvb2tOYW1lLCBob29rVmFsdWUsIHJvb3RQcm9wZXJ0eVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGhvb2tEYXRhID0gQ1NTLkhvb2tzLnJlZ2lzdGVyZWRbZnVsbEhvb2tOYW1lXTtcblxuICAgICAgICAgICAgICAgIGlmIChob29rRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaG9va1Jvb3QgPSBob29rRGF0YVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2tQb3NpdGlvbiA9IGhvb2tEYXRhWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWVQYXJ0cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlVXBkYXRlZDtcblxuICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSA9IENTUy5Ib29rcy5jbGVhblJvb3RQcm9wZXJ0eVZhbHVlKGhvb2tSb290LCByb290UHJvcGVydHlWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogU3BsaXQgcm9vdFByb3BlcnR5VmFsdWUgaW50byBpdHMgaW5kaXZpZHVhbCBob29rIHZhbHVlcywgcmVwbGFjZSB0aGUgdGFyZ2V0ZWQgdmFsdWUgd2l0aCBob29rVmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgIHRoZW4gcmVjb25zdHJ1Y3QgdGhlIHJvb3RQcm9wZXJ0eVZhbHVlIHN0cmluZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWVQYXJ0cyA9IHJvb3RQcm9wZXJ0eVZhbHVlLnRvU3RyaW5nKCkubWF0Y2goQ1NTLlJlZ0V4LnZhbHVlU3BsaXQpO1xuICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZVBhcnRzW2hvb2tQb3NpdGlvbl0gPSBob29rVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlVXBkYXRlZCA9IHJvb3RQcm9wZXJ0eVZhbHVlUGFydHMuam9pbihcIiBcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvb3RQcm9wZXJ0eVZhbHVlVXBkYXRlZDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgcHJvdmlkZWQgZnVsbEhvb2tOYW1lIGlzbid0IGEgcmVnaXN0ZXJlZCBob29rLCByZXR1cm4gdGhlIHJvb3RQcm9wZXJ0eVZhbHVlIHRoYXQgd2FzIHBhc3NlZCBpbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvb3RQcm9wZXJ0eVZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICBOb3JtYWxpemF0aW9uc1xuICAgICAgICAqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIC8qIE5vcm1hbGl6YXRpb25zIHN0YW5kYXJkaXplIENTUyBwcm9wZXJ0eSBtYW5pcHVsYXRpb24gYnkgcG9sbHlmaWxsaW5nIGJyb3dzZXItc3BlY2lmaWMgaW1wbGVtZW50YXRpb25zIChlLmcuIG9wYWNpdHkpXG4gICAgICAgICAgIGFuZCByZWZvcm1hdHRpbmcgc3BlY2lhbCBwcm9wZXJ0aWVzIChlLmcuIGNsaXAsIHJnYmEpIHRvIGxvb2sgbGlrZSBzdGFuZGFyZCBvbmVzLiAqL1xuICAgICAgICBOb3JtYWxpemF0aW9uczoge1xuICAgICAgICAgICAgLyogTm9ybWFsaXphdGlvbnMgYXJlIHBhc3NlZCBhIG5vcm1hbGl6YXRpb24gdGFyZ2V0IChlaXRoZXIgdGhlIHByb3BlcnR5J3MgbmFtZSwgaXRzIGV4dHJhY3RlZCB2YWx1ZSwgb3IgaXRzIGluamVjdGVkIHZhbHVlKSxcbiAgICAgICAgICAgICAgIHRoZSB0YXJnZXRlZCBlbGVtZW50ICh3aGljaCBtYXkgbmVlZCB0byBiZSBxdWVyaWVkKSwgYW5kIHRoZSB0YXJnZXRlZCBwcm9wZXJ0eSB2YWx1ZS4gKi9cbiAgICAgICAgICAgIHJlZ2lzdGVyZWQ6IHtcbiAgICAgICAgICAgICAgICBjbGlwOiBmdW5jdGlvbiAodHlwZSwgZWxlbWVudCwgcHJvcGVydHlWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJuYW1lXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY2xpcFwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2xpcCBuZWVkcyB0byBiZSB1bndyYXBwZWQgYW5kIHN0cmlwcGVkIG9mIGl0cyBjb21tYXMgZHVyaW5nIGV4dHJhY3Rpb24uICovXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZXh0cmFjdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHRyYWN0ZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiBWZWxvY2l0eSBhbHNvIGV4dHJhY3RlZCB0aGlzIHZhbHVlLCBza2lwIGV4dHJhY3Rpb24uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5SZWdFeC53cmFwcGVkVmFsdWVBbHJlYWR5RXh0cmFjdGVkLnRlc3QocHJvcGVydHlWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdGVkID0gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBSZW1vdmUgdGhlIFwicmVjdCgpXCIgd3JhcHBlci4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdGVkID0gcHJvcGVydHlWYWx1ZS50b1N0cmluZygpLm1hdGNoKENTUy5SZWdFeC52YWx1ZVVud3JhcCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU3RyaXAgb2ZmIGNvbW1hcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdGVkID0gZXh0cmFjdGVkID8gZXh0cmFjdGVkWzFdLnJlcGxhY2UoLywoXFxzKyk/L2csIFwiIFwiKSA6IHByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4dHJhY3RlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIENsaXAgbmVlZHMgdG8gYmUgcmUtd3JhcHBlZCBkdXJpbmcgaW5qZWN0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImluamVjdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcInJlY3QoXCIgKyBwcm9wZXJ0eVZhbHVlICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgYmx1cjogZnVuY3Rpb24odHlwZSwgZWxlbWVudCwgcHJvcGVydHlWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJuYW1lXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFZlbG9jaXR5LlN0YXRlLmlzRmlyZWZveCA/IFwiZmlsdGVyXCIgOiBcIi13ZWJraXQtZmlsdGVyXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZXh0cmFjdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHRyYWN0ZWQgPSBwYXJzZUZsb2F0KHByb3BlcnR5VmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgZXh0cmFjdGVkIGlzIE5hTiwgbWVhbmluZyB0aGUgdmFsdWUgaXNuJ3QgYWxyZWFkeSBleHRyYWN0ZWQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoZXh0cmFjdGVkIHx8IGV4dHJhY3RlZCA9PT0gMCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGJsdXJDb21wb25lbnQgPSBwcm9wZXJ0eVZhbHVlLnRvU3RyaW5nKCkubWF0Y2goL2JsdXJcXCgoWzAtOV0rW0Etel0rKVxcKS9pKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgZmlsdGVyIHN0cmluZyBoYWQgYSBibHVyIGNvbXBvbmVudCwgcmV0dXJuIGp1c3QgdGhlIGJsdXIgdmFsdWUgYW5kIHVuaXQgdHlwZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJsdXJDb21wb25lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RlZCA9IGJsdXJDb21wb25lbnRbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBjb21wb25lbnQgZG9lc24ndCBleGlzdCwgZGVmYXVsdCBibHVyIHRvIDAuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYWN0ZWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4dHJhY3RlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEJsdXIgbmVlZHMgdG8gYmUgcmUtd3JhcHBlZCBkdXJpbmcgaW5qZWN0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImluamVjdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZvciB0aGUgYmx1ciBlZmZlY3QgdG8gYmUgZnVsbHkgZGUtYXBwbGllZCwgaXQgbmVlZHMgdG8gYmUgc2V0IHRvIFwibm9uZVwiIGluc3RlYWQgb2YgMC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXBhcnNlRmxvYXQocHJvcGVydHlWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwibm9uZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcImJsdXIoXCIgKyBwcm9wZXJ0eVZhbHVlICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgIC8qIDw9SUU4IGRvIG5vdCBzdXBwb3J0IHRoZSBzdGFuZGFyZCBvcGFjaXR5IHByb3BlcnR5LiBUaGV5IHVzZSBmaWx0ZXI6YWxwaGEob3BhY2l0eT1JTlQpIGluc3RlYWQuICovXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogZnVuY3Rpb24gKHR5cGUsIGVsZW1lbnQsIHByb3BlcnR5VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKElFIDw9IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJuYW1lXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcImZpbHRlclwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJleHRyYWN0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIDw9SUU4IHJldHVybiBhIFwiZmlsdGVyXCIgdmFsdWUgb2YgXCJhbHBoYShvcGFjaXR5PVxcZHsxLDN9KVwiLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFeHRyYWN0IHRoZSB2YWx1ZSBhbmQgY29udmVydCBpdCB0byBhIGRlY2ltYWwgdmFsdWUgdG8gbWF0Y2ggdGhlIHN0YW5kYXJkIENTUyBvcGFjaXR5IHByb3BlcnR5J3MgZm9ybWF0dGluZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4dHJhY3RlZCA9IHByb3BlcnR5VmFsdWUudG9TdHJpbmcoKS5tYXRjaCgvYWxwaGFcXChvcGFjaXR5PSguKilcXCkvaSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4dHJhY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ29udmVydCB0byBkZWNpbWFsIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IGV4dHJhY3RlZFsxXSAvIDEwMDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFdoZW4gZXh0cmFjdGluZyBvcGFjaXR5LCBkZWZhdWx0IHRvIDEgc2luY2UgYSBudWxsIHZhbHVlIG1lYW5zIG9wYWNpdHkgaGFzbid0IGJlZW4gc2V0LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaW5qZWN0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE9wYWNpZmllZCBlbGVtZW50cyBhcmUgcmVxdWlyZWQgdG8gaGF2ZSB0aGVpciB6b29tIHByb3BlcnR5IHNldCB0byBhIG5vbi16ZXJvIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnpvb20gPSAxO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNldHRpbmcgdGhlIGZpbHRlciBwcm9wZXJ0eSBvbiBlbGVtZW50cyB3aXRoIGNlcnRhaW4gZm9udCBwcm9wZXJ0eSBjb21iaW5hdGlvbnMgY2FuIHJlc3VsdCBpbiBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hseSB1bmFwcGVhbGluZyB1bHRyYS1ib2xkaW5nIGVmZmVjdC4gVGhlcmUncyBubyB3YXkgdG8gcmVtZWR5IHRoaXMgdGhyb3VnaG91dCBhIHR3ZWVuLCBidXQgZHJvcHBpbmcgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlIGFsdG9nZXRoZXIgKHdoZW4gb3BhY2l0eSBoaXRzIDEpIGF0IGxlYXN0cyBlbnN1cmVzIHRoYXQgdGhlIGdsaXRjaCBpcyBnb25lIHBvc3QtdHdlZW5pbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYXJzZUZsb2F0KHByb3BlcnR5VmFsdWUpID49IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFzIHBlciB0aGUgZmlsdGVyIHByb3BlcnR5J3Mgc3BlYywgY29udmVydCB0aGUgZGVjaW1hbCB2YWx1ZSB0byBhIHdob2xlIG51bWJlciBhbmQgd3JhcCB0aGUgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiYWxwaGEob3BhY2l0eT1cIiArIHBhcnNlSW50KHBhcnNlRmxvYXQocHJvcGVydHlWYWx1ZSkgKiAxMDAsIDEwKSArIFwiKVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8qIFdpdGggYWxsIG90aGVyIGJyb3dzZXJzLCBub3JtYWxpemF0aW9uIGlzIG5vdCByZXF1aXJlZDsgcmV0dXJuIHRoZSBzYW1lIHZhbHVlcyB0aGF0IHdlcmUgcGFzc2VkIGluLiAqL1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm5hbWVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwib3BhY2l0eVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJleHRyYWN0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpbmplY3RcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICBCYXRjaGVkIFJlZ2lzdHJhdGlvbnNcbiAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAvKiBOb3RlOiBCYXRjaGVkIG5vcm1hbGl6YXRpb25zIGV4dGVuZCB0aGUgQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWQgb2JqZWN0LiAqL1xuICAgICAgICAgICAgcmVnaXN0ZXI6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICBUcmFuc2Zvcm1zXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAvKiBUcmFuc2Zvcm1zIGFyZSB0aGUgc3VicHJvcGVydGllcyBjb250YWluZWQgYnkgdGhlIENTUyBcInRyYW5zZm9ybVwiIHByb3BlcnR5LiBUcmFuc2Zvcm1zIG11c3QgdW5kZXJnbyBub3JtYWxpemF0aW9uXG4gICAgICAgICAgICAgICAgICAgc28gdGhhdCB0aGV5IGNhbiBiZSByZWZlcmVuY2VkIGluIGEgcHJvcGVydGllcyBtYXAgYnkgdGhlaXIgaW5kaXZpZHVhbCBuYW1lcy4gKi9cbiAgICAgICAgICAgICAgICAvKiBOb3RlOiBXaGVuIHRyYW5zZm9ybXMgYXJlIFwic2V0XCIsIHRoZXkgYXJlIGFjdHVhbGx5IGFzc2lnbmVkIHRvIGEgcGVyLWVsZW1lbnQgdHJhbnNmb3JtQ2FjaGUuIFdoZW4gYWxsIHRyYW5zZm9ybVxuICAgICAgICAgICAgICAgICAgIHNldHRpbmcgaXMgY29tcGxldGUgY29tcGxldGUsIENTUy5mbHVzaFRyYW5zZm9ybUNhY2hlKCkgbXVzdCBiZSBtYW51YWxseSBjYWxsZWQgdG8gZmx1c2ggdGhlIHZhbHVlcyB0byB0aGUgRE9NLlxuICAgICAgICAgICAgICAgICAgIFRyYW5zZm9ybSBzZXR0aW5nIGlzIGJhdGNoZWQgaW4gdGhpcyB3YXkgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZTogdGhlIHRyYW5zZm9ybSBzdHlsZSBvbmx5IG5lZWRzIHRvIGJlIHVwZGF0ZWRcbiAgICAgICAgICAgICAgICAgICBvbmNlIHdoZW4gbXVsdGlwbGUgdHJhbnNmb3JtIHN1YnByb3BlcnRpZXMgYXJlIGJlaW5nIGFuaW1hdGVkIHNpbXVsdGFuZW91c2x5LiAqL1xuICAgICAgICAgICAgICAgIC8qIE5vdGU6IElFOSBhbmQgQW5kcm9pZCBHaW5nZXJicmVhZCBoYXZlIHN1cHBvcnQgZm9yIDJEIC0tIGJ1dCBub3QgM0QgLS0gdHJhbnNmb3Jtcy4gU2luY2UgYW5pbWF0aW5nIHVuc3VwcG9ydGVkXG4gICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtIHByb3BlcnRpZXMgcmVzdWx0cyBpbiB0aGUgYnJvd3NlciBpZ25vcmluZyB0aGUgKmVudGlyZSogdHJhbnNmb3JtIHN0cmluZywgd2UgcHJldmVudCB0aGVzZSAzRCB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICBmcm9tIGJlaW5nIG5vcm1hbGl6ZWQgZm9yIHRoZXNlIGJyb3dzZXJzIHNvIHRoYXQgdHdlZW5pbmcgc2tpcHMgdGhlc2UgcHJvcGVydGllcyBhbHRvZ2V0aGVyXG4gICAgICAgICAgICAgICAgICAgKHNpbmNlIGl0IHdpbGwgaWdub3JlIHRoZW0gYXMgYmVpbmcgdW5zdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIuKSAqL1xuICAgICAgICAgICAgICAgIGlmICghKElFIDw9IDkpICYmICFWZWxvY2l0eS5TdGF0ZS5pc0dpbmdlcmJyZWFkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFNpbmNlIHRoZSBzdGFuZGFsb25lIENTUyBcInBlcnNwZWN0aXZlXCIgcHJvcGVydHkgYW5kIHRoZSBDU1MgdHJhbnNmb3JtIFwicGVyc3BlY3RpdmVcIiBzdWJwcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICBzaGFyZSB0aGUgc2FtZSBuYW1lLCB0aGUgbGF0dGVyIGlzIGdpdmVuIGEgdW5pcXVlIHRva2VuIHdpdGhpbiBWZWxvY2l0eTogXCJ0cmFuc2Zvcm1QZXJzcGVjdGl2ZVwiLiAqL1xuICAgICAgICAgICAgICAgICAgICBDU1MuTGlzdHMudHJhbnNmb3Jtc0Jhc2UgPSBDU1MuTGlzdHMudHJhbnNmb3Jtc0Jhc2UuY29uY2F0KENTUy5MaXN0cy50cmFuc2Zvcm1zM0QpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgQ1NTLkxpc3RzLnRyYW5zZm9ybXNCYXNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFdyYXAgdGhlIGR5bmFtaWNhbGx5IGdlbmVyYXRlZCBub3JtYWxpemF0aW9uIGZ1bmN0aW9uIGluIGEgbmV3IHNjb3BlIHNvIHRoYXQgdHJhbnNmb3JtTmFtZSdzIHZhbHVlIGlzXG4gICAgICAgICAgICAgICAgICAgIHBhaXJlZCB3aXRoIGl0cyByZXNwZWN0aXZlIGZ1bmN0aW9uLiAoT3RoZXJ3aXNlLCBhbGwgZnVuY3Rpb25zIHdvdWxkIHRha2UgdGhlIGZpbmFsIGZvciBsb29wJ3MgdHJhbnNmb3JtTmFtZS4pICovXG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0cmFuc2Zvcm1OYW1lID0gQ1NTLkxpc3RzLnRyYW5zZm9ybXNCYXNlW2ldO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFt0cmFuc2Zvcm1OYW1lXSA9IGZ1bmN0aW9uICh0eXBlLCBlbGVtZW50LCBwcm9wZXJ0eVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSBub3JtYWxpemVkIHByb3BlcnR5IG5hbWUgaXMgdGhlIHBhcmVudCBcInRyYW5zZm9ybVwiIHByb3BlcnR5IC0tIHRoZSBwcm9wZXJ0eSB0aGF0IGlzIGFjdHVhbGx5IHNldCBpbiBDU1MuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJuYW1lXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2Zvcm1cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVHJhbnNmb3JtIHZhbHVlcyBhcmUgY2FjaGVkIG9udG8gYSBwZXItZWxlbWVudCB0cmFuc2Zvcm1DYWNoZSBvYmplY3QuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJleHRyYWN0XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGlzIHRyYW5zZm9ybSBoYXMgeWV0IHRvIGJlIGFzc2lnbmVkIGEgdmFsdWUsIHJldHVybiBpdHMgbnVsbCB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChEYXRhKGVsZW1lbnQpID09PSB1bmRlZmluZWQgfHwgRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZVt0cmFuc2Zvcm1OYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU2NhbGUgQ1NTLkxpc3RzLnRyYW5zZm9ybXNCYXNlIGRlZmF1bHQgdG8gMSB3aGVyZWFzIGFsbCBvdGhlciB0cmFuc2Zvcm0gcHJvcGVydGllcyBkZWZhdWx0IHRvIDAuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC9ec2NhbGUvaS50ZXN0KHRyYW5zZm9ybU5hbWUpID8gMSA6IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBXaGVuIHRyYW5zZm9ybSB2YWx1ZXMgYXJlIHNldCwgdGhleSBhcmUgd3JhcHBlZCBpbiBwYXJlbnRoZXNlcyBhcyBwZXIgdGhlIENTUyBzcGVjLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGh1cywgd2hlbiBleHRyYWN0aW5nIHRoZWlyIHZhbHVlcyAoZm9yIHR3ZWVuIGNhbGN1bGF0aW9ucyksIHdlIHN0cmlwIG9mZiB0aGUgcGFyZW50aGVzZXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlW3RyYW5zZm9ybU5hbWVdLnJlcGxhY2UoL1soKV0vZywgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpbmplY3RcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbnZhbGlkID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIGFuIGluZGl2aWR1YWwgdHJhbnNmb3JtIHByb3BlcnR5IGNvbnRhaW5zIGFuIHVuc3VwcG9ydGVkIHVuaXQgdHlwZSwgdGhlIGJyb3dzZXIgaWdub3JlcyB0aGUgKmVudGlyZSogdHJhbnNmb3JtIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGh1cywgcHJvdGVjdCB1c2VycyBmcm9tIHRoZW1zZWx2ZXMgYnkgc2tpcHBpbmcgc2V0dGluZyBmb3IgdHJhbnNmb3JtIHZhbHVlcyBzdXBwbGllZCB3aXRoIGludmFsaWQgdW5pdCB0eXBlcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFN3aXRjaCBvbiB0aGUgYmFzZSB0cmFuc2Zvcm0gdHlwZTsgaWdub3JlIHRoZSBheGlzIGJ5IHJlbW92aW5nIHRoZSBsYXN0IGxldHRlciBmcm9tIHRoZSB0cmFuc2Zvcm0ncyBuYW1lLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0cmFuc2Zvcm1OYW1lLnN1YnN0cigwLCB0cmFuc2Zvcm1OYW1lLmxlbmd0aCAtIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogV2hpdGVsaXN0IHVuaXQgdHlwZXMgZm9yIGVhY2ggdHJhbnNmb3JtLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ0cmFuc2xhdGVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52YWxpZCA9ICEvKCV8cHh8ZW18cmVtfHZ3fHZofFxcZCkkL2kudGVzdChwcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU2luY2UgYW4gYXhpcy1mcmVlIFwic2NhbGVcIiBwcm9wZXJ0eSBpcyBzdXBwb3J0ZWQgYXMgd2VsbCwgYSBsaXR0bGUgaGFjayBpcyB1c2VkIGhlcmUgdG8gZGV0ZWN0IGl0IGJ5IGNob3BwaW5nIG9mZiBpdHMgbGFzdCBsZXR0ZXIuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInNjYWxcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2NhbGVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2hyb21lIG9uIEFuZHJvaWQgaGFzIGEgYnVnIGluIHdoaWNoIHNjYWxlZCBlbGVtZW50cyBibHVyIGlmIHRoZWlyIGluaXRpYWwgc2NhbGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUgaXMgYmVsb3cgMSAod2hpY2ggY2FuIGhhcHBlbiB3aXRoIGZvcmNlZmVlZGluZykuIFRodXMsIHdlIGRldGVjdCBhIHlldC11bnNldCBzY2FsZSBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgZW5zdXJlIHRoYXQgaXRzIGZpcnN0IHZhbHVlIGlzIGFsd2F5cyAxLiBNb3JlIGluZm86IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTA0MTc4OTAvY3NzMy1hbmltYXRpb25zLXdpdGgtdHJhbnNmb3JtLWNhdXNlcy1ibHVycmVkLWVsZW1lbnRzLW9uLXdlYmtpdC8xMDQxNzk2MiMxMDQxNzk2MiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkuU3RhdGUuaXNBbmRyb2lkICYmIERhdGEoZWxlbWVudCkudHJhbnNmb3JtQ2FjaGVbdHJhbnNmb3JtTmFtZV0gPT09IHVuZGVmaW5lZCAmJiBwcm9wZXJ0eVZhbHVlIDwgMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZhbGlkID0gIS8oXFxkKSQvaS50ZXN0KHByb3BlcnR5VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2tld1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZhbGlkID0gIS8oZGVnfFxcZCkkL2kudGVzdChwcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInJvdGF0ZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnZhbGlkID0gIS8oZGVnfFxcZCkkL2kudGVzdChwcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW52YWxpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFzIHBlciB0aGUgQ1NTIHNwZWMsIHdyYXAgdGhlIHZhbHVlIGluIHBhcmVudGhlc2VzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERhdGEoZWxlbWVudCkudHJhbnNmb3JtQ2FjaGVbdHJhbnNmb3JtTmFtZV0gPSBcIihcIiArIHByb3BlcnR5VmFsdWUgKyBcIilcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQWx0aG91Z2ggdGhlIHZhbHVlIGlzIHNldCBvbiB0aGUgdHJhbnNmb3JtQ2FjaGUgb2JqZWN0LCByZXR1cm4gdGhlIG5ld2x5LXVwZGF0ZWQgdmFsdWUgZm9yIHRoZSBjYWxsaW5nIGNvZGUgdG8gcHJvY2VzcyBhcyBub3JtYWwuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZVt0cmFuc2Zvcm1OYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgIENvbG9yc1xuICAgICAgICAgICAgICAgICoqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAvKiBTaW5jZSBWZWxvY2l0eSBvbmx5IGFuaW1hdGVzIGEgc2luZ2xlIG51bWVyaWMgdmFsdWUgcGVyIHByb3BlcnR5LCBjb2xvciBhbmltYXRpb24gaXMgYWNoaWV2ZWQgYnkgaG9va2luZyB0aGUgaW5kaXZpZHVhbCBSR0JBIGNvbXBvbmVudHMgb2YgQ1NTIGNvbG9yIHByb3BlcnRpZXMuXG4gICAgICAgICAgICAgICAgICAgQWNjb3JkaW5nbHksIGNvbG9yIHZhbHVlcyBtdXN0IGJlIG5vcm1hbGl6ZWQgKGUuZy4gXCIjZmYwMDAwXCIsIFwicmVkXCIsIGFuZCBcInJnYigyNTUsIDAsIDApXCIgPT0+IFwiMjU1IDAgMCAxXCIpIHNvIHRoYXQgdGhlaXIgY29tcG9uZW50cyBjYW4gYmUgaW5qZWN0ZWQvZXh0cmFjdGVkIGJ5IENTUy5Ib29rcyBsb2dpYy4gKi9cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IENTUy5MaXN0cy5jb2xvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgLyogV3JhcCB0aGUgZHluYW1pY2FsbHkgZ2VuZXJhdGVkIG5vcm1hbGl6YXRpb24gZnVuY3Rpb24gaW4gYSBuZXcgc2NvcGUgc28gdGhhdCBjb2xvck5hbWUncyB2YWx1ZSBpcyBwYWlyZWQgd2l0aCBpdHMgcmVzcGVjdGl2ZSBmdW5jdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgKE90aGVyd2lzZSwgYWxsIGZ1bmN0aW9ucyB3b3VsZCB0YWtlIHRoZSBmaW5hbCBmb3IgbG9vcCdzIGNvbG9yTmFtZS4pICovXG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29sb3JOYW1lID0gQ1NTLkxpc3RzLmNvbG9yc1tpXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogSW4gSUU8PTgsIHdoaWNoIHN1cHBvcnQgcmdiIGJ1dCBub3QgcmdiYSwgY29sb3IgcHJvcGVydGllcyBhcmUgcmV2ZXJ0ZWQgdG8gcmdiIGJ5IHN0cmlwcGluZyBvZmYgdGhlIGFscGhhIGNvbXBvbmVudC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2NvbG9yTmFtZV0gPSBmdW5jdGlvbih0eXBlLCBlbGVtZW50LCBwcm9wZXJ0eVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJuYW1lXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29sb3JOYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDb252ZXJ0IGFsbCBjb2xvciB2YWx1ZXMgaW50byB0aGUgcmdiIGZvcm1hdC4gKE9sZCBJRSBjYW4gcmV0dXJuIGhleCB2YWx1ZXMgYW5kIGNvbG9yIG5hbWVzIGluc3RlYWQgb2YgcmdiL3JnYmEuKSAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZXh0cmFjdFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4dHJhY3RlZDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGNvbG9yIGlzIGFscmVhZHkgaW4gaXRzIGhvb2thYmxlIGZvcm0gKGUuZy4gXCIyNTUgMjU1IDI1NSAxXCIpIGR1ZSB0byBoYXZpbmcgYmVlbiBwcmV2aW91c2x5IGV4dHJhY3RlZCwgc2tpcCBleHRyYWN0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5SZWdFeC53cmFwcGVkVmFsdWVBbHJlYWR5RXh0cmFjdGVkLnRlc3QocHJvcGVydHlWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYWN0ZWQgPSBwcm9wZXJ0eVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udmVydGVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvck5hbWVzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhY2s6IFwicmdiKDAsIDAsIDApXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibHVlOiBcInJnYigwLCAwLCAyNTUpXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmF5OiBcInJnYigxMjgsIDEyOCwgMTI4KVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JlZW46IFwicmdiKDAsIDEyOCwgMClcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZDogXCJyZ2IoMjU1LCAwLCAwKVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpdGU6IFwicmdiKDI1NSwgMjU1LCAyNTUpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENvbnZlcnQgY29sb3IgbmFtZXMgdG8gcmdiLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgvXltBLXpdKyQvaS50ZXN0KHByb3BlcnR5VmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2xvck5hbWVzW3Byb3BlcnR5VmFsdWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnZlcnRlZCA9IGNvbG9yTmFtZXNbcHJvcGVydHlWYWx1ZV1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIGFuIHVubWF0Y2hlZCBjb2xvciBuYW1lIGlzIHByb3ZpZGVkLCBkZWZhdWx0IHRvIGJsYWNrLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udmVydGVkID0gY29sb3JOYW1lcy5ibGFjaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENvbnZlcnQgaGV4IHZhbHVlcyB0byByZ2IuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChDU1MuUmVnRXguaXNIZXgudGVzdChwcm9wZXJ0eVZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0ZWQgPSBcInJnYihcIiArIENTUy5WYWx1ZXMuaGV4VG9SZ2IocHJvcGVydHlWYWx1ZSkuam9pbihcIiBcIikgKyBcIilcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgcHJvdmlkZWQgY29sb3IgZG9lc24ndCBtYXRjaCBhbnkgb2YgdGhlIGFjY2VwdGVkIGNvbG9yIGZvcm1hdHMsIGRlZmF1bHQgdG8gYmxhY2suICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICghKC9ecmdiYT9cXCgvaS50ZXN0KHByb3BlcnR5VmFsdWUpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0ZWQgPSBjb2xvck5hbWVzLmJsYWNrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFJlbW92ZSB0aGUgc3Vycm91bmRpbmcgXCJyZ2IvcmdiYSgpXCIgc3RyaW5nIHRoZW4gcmVwbGFjZSBjb21tYXMgd2l0aCBzcGFjZXMgYW5kIHN0cmlwXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwZWF0ZWQgc3BhY2VzIChpbiBjYXNlIHRoZSB2YWx1ZSBpbmNsdWRlZCBzcGFjZXMgdG8gYmVnaW4gd2l0aCkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdGVkID0gKGNvbnZlcnRlZCB8fCBwcm9wZXJ0eVZhbHVlKS50b1N0cmluZygpLm1hdGNoKENTUy5SZWdFeC52YWx1ZVVud3JhcClbMV0ucmVwbGFjZSgvLChcXHMrKT8vZywgXCIgXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTbyBsb25nIGFzIHRoaXMgaXNuJ3QgPD1JRTgsIGFkZCBhIGZvdXJ0aCAoYWxwaGEpIGNvbXBvbmVudCBpZiBpdCdzIG1pc3NpbmcgYW5kIGRlZmF1bHQgaXQgdG8gMSAodmlzaWJsZSkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShJRSA8PSA4KSAmJiBleHRyYWN0ZWQuc3BsaXQoXCIgXCIpLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RlZCArPSBcIiAxXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBleHRyYWN0ZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpbmplY3RcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoaXMgaXMgSUU8PTggYW5kIGFuIGFscGhhIGNvbXBvbmVudCBleGlzdHMsIHN0cmlwIGl0IG9mZi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChJRSA8PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5VmFsdWUuc3BsaXQoXCIgXCIpLmxlbmd0aCA9PT0gNCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gcHJvcGVydHlWYWx1ZS5zcGxpdCgvXFxzKy8pLnNsaWNlKDAsIDMpLmpvaW4oXCIgXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE90aGVyd2lzZSwgYWRkIGEgZm91cnRoIChhbHBoYSkgY29tcG9uZW50IGlmIGl0J3MgbWlzc2luZyBhbmQgZGVmYXVsdCBpdCB0byAxICh2aXNpYmxlKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcGVydHlWYWx1ZS5zcGxpdChcIiBcIikubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSArPSBcIiAxXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFJlLWluc2VydCB0aGUgYnJvd3Nlci1hcHByb3ByaWF0ZSB3cmFwcGVyKFwicmdiL3JnYmEoKVwiKSwgaW5zZXJ0IGNvbW1hcywgYW5kIHN0cmlwIG9mZiBkZWNpbWFsIHVuaXRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbiBhbGwgdmFsdWVzIGJ1dCB0aGUgZm91cnRoIChSLCBHLCBhbmQgQiBvbmx5IGFjY2VwdCB3aG9sZSBudW1iZXJzKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoSUUgPD0gOCA/IFwicmdiXCIgOiBcInJnYmFcIikgKyBcIihcIiArIHByb3BlcnR5VmFsdWUucmVwbGFjZSgvXFxzKy9nLCBcIixcIikucmVwbGFjZSgvXFwuKFxcZCkrKD89LCkvZywgXCJcIikgKyBcIilcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgIENTUyBQcm9wZXJ0eSBOYW1lc1xuICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgTmFtZXM6IHtcbiAgICAgICAgICAgIC8qIENhbWVsY2FzZSBhIHByb3BlcnR5IG5hbWUgaW50byBpdHMgSmF2YVNjcmlwdCBub3RhdGlvbiAoZS5nLiBcImJhY2tncm91bmQtY29sb3JcIiA9PT4gXCJiYWNrZ3JvdW5kQ29sb3JcIikuXG4gICAgICAgICAgICAgICBDYW1lbGNhc2luZyBpcyB1c2VkIHRvIG5vcm1hbGl6ZSBwcm9wZXJ0eSBuYW1lcyBiZXR3ZWVuIGFuZCBhY3Jvc3MgY2FsbHMuICovXG4gICAgICAgICAgICBjYW1lbENhc2U6IGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eS5yZXBsYWNlKC8tKFxcdykvZywgZnVuY3Rpb24gKG1hdGNoLCBzdWJNYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3ViTWF0Y2gudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qIEZvciBTVkcgZWxlbWVudHMsIHNvbWUgcHJvcGVydGllcyAobmFtZWx5LCBkaW1lbnNpb25hbCBvbmVzKSBhcmUgR0VUL1NFVCB2aWEgdGhlIGVsZW1lbnQncyBIVE1MIGF0dHJpYnV0ZXMgKGluc3RlYWQgb2YgdmlhIENTUyBzdHlsZXMpLiAqL1xuICAgICAgICAgICAgU1ZHQXR0cmlidXRlOiBmdW5jdGlvbiAocHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICB2YXIgU1ZHQXR0cmlidXRlcyA9IFwid2lkdGh8aGVpZ2h0fHh8eXxjeHxjeXxyfHJ4fHJ5fHgxfHgyfHkxfHkyXCI7XG5cbiAgICAgICAgICAgICAgICAvKiBDZXJ0YWluIGJyb3dzZXJzIHJlcXVpcmUgYW4gU1ZHIHRyYW5zZm9ybSB0byBiZSBhcHBsaWVkIGFzIGFuIGF0dHJpYnV0ZS4gKE90aGVyd2lzZSwgYXBwbGljYXRpb24gdmlhIENTUyBpcyBwcmVmZXJhYmxlIGR1ZSB0byAzRCBzdXBwb3J0LikgKi9cbiAgICAgICAgICAgICAgICBpZiAoSUUgfHwgKFZlbG9jaXR5LlN0YXRlLmlzQW5kcm9pZCAmJiAhVmVsb2NpdHkuU3RhdGUuaXNDaHJvbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIFNWR0F0dHJpYnV0ZXMgKz0gXCJ8dHJhbnNmb3JtXCI7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoXCJeKFwiICsgU1ZHQXR0cmlidXRlcyArIFwiKSRcIiwgXCJpXCIpLnRlc3QocHJvcGVydHkpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyogRGV0ZXJtaW5lIHdoZXRoZXIgYSBwcm9wZXJ0eSBzaG91bGQgYmUgc2V0IHdpdGggYSB2ZW5kb3IgcHJlZml4LiAqL1xuICAgICAgICAgICAgLyogSWYgYSBwcmVmaXhlZCB2ZXJzaW9uIG9mIHRoZSBwcm9wZXJ0eSBleGlzdHMsIHJldHVybiBpdC4gT3RoZXJ3aXNlLCByZXR1cm4gdGhlIG9yaWdpbmFsIHByb3BlcnR5IG5hbWUuXG4gICAgICAgICAgICAgICBJZiB0aGUgcHJvcGVydHkgaXMgbm90IGF0IGFsbCBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIsIHJldHVybiBhIGZhbHNlIGZsYWcuICovXG4gICAgICAgICAgICBwcmVmaXhDaGVjazogZnVuY3Rpb24gKHByb3BlcnR5KSB7XG4gICAgICAgICAgICAgICAgLyogSWYgdGhpcyBwcm9wZXJ0eSBoYXMgYWxyZWFkeSBiZWVuIGNoZWNrZWQsIHJldHVybiB0aGUgY2FjaGVkIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5TdGF0ZS5wcmVmaXhNYXRjaGVzW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyBWZWxvY2l0eS5TdGF0ZS5wcmVmaXhNYXRjaGVzW3Byb3BlcnR5XSwgdHJ1ZSBdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2ZW5kb3JzID0gWyBcIlwiLCBcIldlYmtpdFwiLCBcIk1velwiLCBcIm1zXCIsIFwiT1wiIF07XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIHZlbmRvcnNMZW5ndGggPSB2ZW5kb3JzLmxlbmd0aDsgaSA8IHZlbmRvcnNMZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5UHJlZml4ZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlQcmVmaXhlZCA9IHByb3BlcnR5O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDYXBpdGFsaXplIHRoZSBmaXJzdCBsZXR0ZXIgb2YgdGhlIHByb3BlcnR5IHRvIGNvbmZvcm0gdG8gSmF2YVNjcmlwdCB2ZW5kb3IgcHJlZml4IG5vdGF0aW9uIChlLmcuIHdlYmtpdEZpbHRlcikuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlQcmVmaXhlZCA9IHZlbmRvcnNbaV0gKyBwcm9wZXJ0eS5yZXBsYWNlKC9eXFx3LywgZnVuY3Rpb24obWF0Y2gpIHsgcmV0dXJuIG1hdGNoLnRvVXBwZXJDYXNlKCk7IH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBDaGVjayBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyB0aGlzIHByb3BlcnR5IGFzIHByZWZpeGVkLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFR5cGUuaXNTdHJpbmcoVmVsb2NpdHkuU3RhdGUucHJlZml4RWxlbWVudC5zdHlsZVtwcm9wZXJ0eVByZWZpeGVkXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDYWNoZSB0aGUgbWF0Y2guICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUucHJlZml4TWF0Y2hlc1twcm9wZXJ0eV0gPSBwcm9wZXJ0eVByZWZpeGVkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsgcHJvcGVydHlQcmVmaXhlZCwgdHJ1ZSBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGJyb3dzZXIgZG9lc24ndCBzdXBwb3J0IHRoaXMgcHJvcGVydHkgaW4gYW55IGZvcm0sIGluY2x1ZGUgYSBmYWxzZSBmbGFnIHNvIHRoYXQgdGhlIGNhbGxlciBjYW4gZGVjaWRlIGhvdyB0byBwcm9jZWVkLiAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyBwcm9wZXJ0eSwgZmFsc2UgXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICBDU1MgUHJvcGVydHkgVmFsdWVzXG4gICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICBWYWx1ZXM6IHtcbiAgICAgICAgICAgIC8qIEhleCB0byBSR0IgY29udmVyc2lvbi4gQ29weXJpZ2h0IFRpbSBEb3duOiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU2MjM4MzgvcmdiLXRvLWhleC1hbmQtaGV4LXRvLXJnYiAqL1xuICAgICAgICAgICAgaGV4VG9SZ2I6IGZ1bmN0aW9uIChoZXgpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2hvcnRmb3JtUmVnZXggPSAvXiM/KFthLWZcXGRdKShbYS1mXFxkXSkoW2EtZlxcZF0pJC9pLFxuICAgICAgICAgICAgICAgICAgICBsb25nZm9ybVJlZ2V4ID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaSxcbiAgICAgICAgICAgICAgICAgICAgcmdiUGFydHM7XG5cbiAgICAgICAgICAgICAgICBoZXggPSBoZXgucmVwbGFjZShzaG9ydGZvcm1SZWdleCwgZnVuY3Rpb24gKG0sIHIsIGcsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHIgKyByICsgZyArIGcgKyBiICsgYjtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHJnYlBhcnRzID0gbG9uZ2Zvcm1SZWdleC5leGVjKGhleCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmdiUGFydHMgPyBbIHBhcnNlSW50KHJnYlBhcnRzWzFdLCAxNiksIHBhcnNlSW50KHJnYlBhcnRzWzJdLCAxNiksIHBhcnNlSW50KHJnYlBhcnRzWzNdLCAxNikgXSA6IFsgMCwgMCwgMCBdO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgaXNDU1NOdWxsVmFsdWU6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIC8qIFRoZSBicm93c2VyIGRlZmF1bHRzIENTUyB2YWx1ZXMgdGhhdCBoYXZlIG5vdCBiZWVuIHNldCB0byBlaXRoZXIgMCBvciBvbmUgb2Ygc2V2ZXJhbCBwb3NzaWJsZSBudWxsLXZhbHVlIHN0cmluZ3MuXG4gICAgICAgICAgICAgICAgICAgVGh1cywgd2UgY2hlY2sgZm9yIGJvdGggZmFsc2luZXNzIGFuZCB0aGVzZSBzcGVjaWFsIHN0cmluZ3MuICovXG4gICAgICAgICAgICAgICAgLyogTnVsbC12YWx1ZSBjaGVja2luZyBpcyBwZXJmb3JtZWQgdG8gZGVmYXVsdCB0aGUgc3BlY2lhbCBzdHJpbmdzIHRvIDAgKGZvciB0aGUgc2FrZSBvZiB0d2VlbmluZykgb3IgdGhlaXIgaG9va1xuICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlcyBhcyBkZWZpbmVkIGFzIENTUy5Ib29rcyAoZm9yIHRoZSBzYWtlIG9mIGhvb2sgaW5qZWN0aW9uL2V4dHJhY3Rpb24pLiAqL1xuICAgICAgICAgICAgICAgIC8qIE5vdGU6IENocm9tZSByZXR1cm5zIFwicmdiYSgwLCAwLCAwLCAwKVwiIGZvciBhbiB1bmRlZmluZWQgY29sb3Igd2hlcmVhcyBJRSByZXR1cm5zIFwidHJhbnNwYXJlbnRcIi4gKi9cbiAgICAgICAgICAgICAgICByZXR1cm4gKHZhbHVlID09IDAgfHwgL14obm9uZXxhdXRvfHRyYW5zcGFyZW50fChyZ2JhXFwoMCwgPzAsID8wLCA/MFxcKSkpJC9pLnRlc3QodmFsdWUpKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qIFJldHJpZXZlIGEgcHJvcGVydHkncyBkZWZhdWx0IHVuaXQgdHlwZS4gVXNlZCBmb3IgYXNzaWduaW5nIGEgdW5pdCB0eXBlIHdoZW4gb25lIGlzIG5vdCBzdXBwbGllZCBieSB0aGUgdXNlci4gKi9cbiAgICAgICAgICAgIGdldFVuaXRUeXBlOiBmdW5jdGlvbiAocHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICBpZiAoL14ocm90YXRlfHNrZXcpL2kudGVzdChwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiZGVnXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgvKF4oc2NhbGV8c2NhbGVYfHNjYWxlWXxzY2FsZVp8YWxwaGF8ZmxleEdyb3d8ZmxleEhlaWdodHx6SW5kZXh8Zm9udFdlaWdodCkkKXwoKG9wYWNpdHl8cmVkfGdyZWVufGJsdWV8YWxwaGEpJCkvaS50ZXN0KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgICAgICAvKiBUaGUgYWJvdmUgcHJvcGVydGllcyBhcmUgdW5pdGxlc3MuICovXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIERlZmF1bHQgdG8gcHggZm9yIGFsbCBvdGhlciBwcm9wZXJ0aWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJweFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIC8qIEhUTUwgZWxlbWVudHMgZGVmYXVsdCB0byBhbiBhc3NvY2lhdGVkIGRpc3BsYXkgdHlwZSB3aGVuIHRoZXkncmUgbm90IHNldCB0byBkaXNwbGF5Om5vbmUuICovXG4gICAgICAgICAgICAvKiBOb3RlOiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgZm9yIGNvcnJlY3RseSBzZXR0aW5nIHRoZSBub24tXCJub25lXCIgZGlzcGxheSB2YWx1ZSBpbiBjZXJ0YWluIFZlbG9jaXR5IHJlZGlyZWN0cywgc3VjaCBhcyBmYWRlSW4vT3V0LiAqL1xuICAgICAgICAgICAgZ2V0RGlzcGxheVR5cGU6IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgdmFyIHRhZ05hbWUgPSBlbGVtZW50ICYmIGVsZW1lbnQudGFnTmFtZS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoL14oYnxiaWd8aXxzbWFsbHx0dHxhYmJyfGFjcm9ueW18Y2l0ZXxjb2RlfGRmbnxlbXxrYmR8c3Ryb25nfHNhbXB8dmFyfGF8YmRvfGJyfGltZ3xtYXB8b2JqZWN0fHF8c2NyaXB0fHNwYW58c3VifHN1cHxidXR0b258aW5wdXR8bGFiZWx8c2VsZWN0fHRleHRhcmVhKSQvaS50ZXN0KHRhZ05hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImlubGluZVwiO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoL14obGkpJC9pLnRlc3QodGFnTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwibGlzdC1pdGVtXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgvXih0cikkL2kudGVzdCh0YWdOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJ0YWJsZS1yb3dcIjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKC9eKHRhYmxlKSQvaS50ZXN0KHRhZ05hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcInRhYmxlXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgvXih0Ym9keSkkL2kudGVzdCh0YWdOYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJ0YWJsZS1yb3ctZ3JvdXBcIjtcbiAgICAgICAgICAgICAgICAvKiBEZWZhdWx0IHRvIFwiYmxvY2tcIiB3aGVuIG5vIG1hdGNoIGlzIGZvdW5kLiAqL1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcImJsb2NrXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLyogVGhlIGNsYXNzIGFkZC9yZW1vdmUgZnVuY3Rpb25zIGFyZSB1c2VkIHRvIHRlbXBvcmFyaWx5IGFwcGx5IGEgXCJ2ZWxvY2l0eS1hbmltYXRpbmdcIiBjbGFzcyB0byBlbGVtZW50cyB3aGlsZSB0aGV5J3JlIGFuaW1hdGluZy4gKi9cbiAgICAgICAgICAgIGFkZENsYXNzOiBmdW5jdGlvbiAoZWxlbWVudCwgY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lICs9IChlbGVtZW50LmNsYXNzTmFtZS5sZW5ndGggPyBcIiBcIiA6IFwiXCIpICsgY2xhc3NOYW1lO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHJlbW92ZUNsYXNzOiBmdW5jdGlvbiAoZWxlbWVudCwgY2xhc3NOYW1lKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUudG9TdHJpbmcoKS5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoXnxcXFxccylcIiArIGNsYXNzTmFtZS5zcGxpdChcIiBcIikuam9pbihcInxcIikgKyBcIihcXFxcc3wkKVwiLCBcImdpXCIpLCBcIiBcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgIFN0eWxlIEdldHRpbmcgJiBTZXR0aW5nXG4gICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgLyogVGhlIHNpbmd1bGFyIGdldFByb3BlcnR5VmFsdWUsIHdoaWNoIHJvdXRlcyB0aGUgbG9naWMgZm9yIGFsbCBub3JtYWxpemF0aW9ucywgaG9va3MsIGFuZCBzdGFuZGFyZCBDU1MgcHJvcGVydGllcy4gKi9cbiAgICAgICAgZ2V0UHJvcGVydHlWYWx1ZTogZnVuY3Rpb24gKGVsZW1lbnQsIHByb3BlcnR5LCByb290UHJvcGVydHlWYWx1ZSwgZm9yY2VTdHlsZUxvb2t1cCkge1xuICAgICAgICAgICAgLyogR2V0IGFuIGVsZW1lbnQncyBjb21wdXRlZCBwcm9wZXJ0eSB2YWx1ZS4gKi9cbiAgICAgICAgICAgIC8qIE5vdGU6IFJldHJpZXZpbmcgdGhlIHZhbHVlIG9mIGEgQ1NTIHByb3BlcnR5IGNhbm5vdCBzaW1wbHkgYmUgcGVyZm9ybWVkIGJ5IGNoZWNraW5nIGFuIGVsZW1lbnQnc1xuICAgICAgICAgICAgICAgc3R5bGUgYXR0cmlidXRlICh3aGljaCBvbmx5IHJlZmxlY3RzIHVzZXItZGVmaW5lZCB2YWx1ZXMpLiBJbnN0ZWFkLCB0aGUgYnJvd3NlciBtdXN0IGJlIHF1ZXJpZWQgZm9yIGEgcHJvcGVydHknc1xuICAgICAgICAgICAgICAgKmNvbXB1dGVkKiB2YWx1ZS4gWW91IGNhbiByZWFkIG1vcmUgYWJvdXQgZ2V0Q29tcHV0ZWRTdHlsZSBoZXJlOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9kb2NzL1dlYi9BUEkvd2luZG93LmdldENvbXB1dGVkU3R5bGUgKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uIGNvbXB1dGVQcm9wZXJ0eVZhbHVlIChlbGVtZW50LCBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgIC8qIFdoZW4gYm94LXNpemluZyBpc24ndCBzZXQgdG8gYm9yZGVyLWJveCwgaGVpZ2h0IGFuZCB3aWR0aCBzdHlsZSB2YWx1ZXMgYXJlIGluY29ycmVjdGx5IGNvbXB1dGVkIHdoZW4gYW5cbiAgICAgICAgICAgICAgICAgICBlbGVtZW50J3Mgc2Nyb2xsYmFycyBhcmUgdmlzaWJsZSAod2hpY2ggZXhwYW5kcyB0aGUgZWxlbWVudCdzIGRpbWVuc2lvbnMpLiBUaHVzLCB3ZSBkZWZlciB0byB0aGUgbW9yZSBhY2N1cmF0ZVxuICAgICAgICAgICAgICAgICAgIG9mZnNldEhlaWdodC9XaWR0aCBwcm9wZXJ0eSwgd2hpY2ggaW5jbHVkZXMgdGhlIHRvdGFsIGRpbWVuc2lvbnMgZm9yIGludGVyaW9yLCBib3JkZXIsIHBhZGRpbmcsIGFuZCBzY3JvbGxiYXIuXG4gICAgICAgICAgICAgICAgICAgV2Ugc3VidHJhY3QgYm9yZGVyIGFuZCBwYWRkaW5nIHRvIGdldCB0aGUgc3VtIG9mIGludGVyaW9yICsgc2Nyb2xsYmFyLiAqL1xuICAgICAgICAgICAgICAgIHZhciBjb21wdXRlZFZhbHVlID0gMDtcblxuICAgICAgICAgICAgICAgIC8qIElFPD04IGRvZXNuJ3Qgc3VwcG9ydCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSwgdGh1cyB3ZSBkZWZlciB0byBqUXVlcnksIHdoaWNoIGhhcyBhbiBleHRlbnNpdmUgYXJyYXlcbiAgICAgICAgICAgICAgICAgICBvZiBoYWNrcyB0byBhY2N1cmF0ZWx5IHJldHJpZXZlIElFOCBwcm9wZXJ0eSB2YWx1ZXMuIFJlLWltcGxlbWVudGluZyB0aGF0IGxvZ2ljIGhlcmUgaXMgbm90IHdvcnRoIGJsb2F0aW5nIHRoZVxuICAgICAgICAgICAgICAgICAgIGNvZGViYXNlIGZvciBhIGR5aW5nIGJyb3dzZXIuIFRoZSBwZXJmb3JtYW5jZSByZXBlcmN1c3Npb25zIG9mIHVzaW5nIGpRdWVyeSBoZXJlIGFyZSBtaW5pbWFsIHNpbmNlXG4gICAgICAgICAgICAgICAgICAgVmVsb2NpdHkgaXMgb3B0aW1pemVkIHRvIHJhcmVseSAoYW5kIHNvbWV0aW1lcyBuZXZlcikgcXVlcnkgdGhlIERPTS4gRnVydGhlciwgdGhlICQuY3NzKCkgY29kZXBhdGggaXNuJ3QgdGhhdCBzbG93LiAqL1xuICAgICAgICAgICAgICAgIGlmIChJRSA8PSA4KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkVmFsdWUgPSAkLmNzcyhlbGVtZW50LCBwcm9wZXJ0eSk7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgIC8qIEFsbCBvdGhlciBicm93c2VycyBzdXBwb3J0IGdldENvbXB1dGVkU3R5bGUuIFRoZSByZXR1cm5lZCBsaXZlIG9iamVjdCByZWZlcmVuY2UgaXMgY2FjaGVkIG9udG8gaXRzXG4gICAgICAgICAgICAgICAgICAgYXNzb2NpYXRlZCBlbGVtZW50IHNvIHRoYXQgaXQgZG9lcyBub3QgbmVlZCB0byBiZSByZWZldGNoZWQgdXBvbiBldmVyeSBHRVQuICovXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLyogQnJvd3NlcnMgZG8gbm90IHJldHVybiBoZWlnaHQgYW5kIHdpZHRoIHZhbHVlcyBmb3IgZWxlbWVudHMgdGhhdCBhcmUgc2V0IHRvIGRpc3BsYXk6XCJub25lXCIuIFRodXMsIHdlIHRlbXBvcmFyaWx5XG4gICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZSBkaXNwbGF5IHRvIHRoZSBlbGVtZW50IHR5cGUncyBkZWZhdWx0IHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG9nZ2xlRGlzcGxheSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICgvXih3aWR0aHxoZWlnaHQpJC8udGVzdChwcm9wZXJ0eSkgJiYgQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJkaXNwbGF5XCIpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVEaXNwbGF5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIENTUy5zZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiZGlzcGxheVwiLCBDU1MuVmFsdWVzLmdldERpc3BsYXlUeXBlKGVsZW1lbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHJldmVydERpc3BsYXkgKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRvZ2dsZURpc3BsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDU1Muc2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmb3JjZVN0eWxlTG9va3VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgPT09IFwiaGVpZ2h0XCIgJiYgQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJib3hTaXppbmdcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpICE9PSBcImJvcmRlci1ib3hcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb250ZW50Qm94SGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQgLSAocGFyc2VGbG9hdChDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcImJvcmRlclRvcFdpZHRoXCIpKSB8fCAwKSAtIChwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiYm9yZGVyQm90dG9tV2lkdGhcIikpIHx8IDApIC0gKHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJwYWRkaW5nVG9wXCIpKSB8fCAwKSAtIChwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwicGFkZGluZ0JvdHRvbVwiKSkgfHwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV2ZXJ0RGlzcGxheSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnRCb3hIZWlnaHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BlcnR5ID09PSBcIndpZHRoXCIgJiYgQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJib3hTaXppbmdcIikudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpICE9PSBcImJvcmRlci1ib3hcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb250ZW50Qm94V2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoIC0gKHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJib3JkZXJMZWZ0V2lkdGhcIikpIHx8IDApIC0gKHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJib3JkZXJSaWdodFdpZHRoXCIpKSB8fCAwKSAtIChwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwicGFkZGluZ0xlZnRcIikpIHx8IDApIC0gKHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJwYWRkaW5nUmlnaHRcIikpIHx8IDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldmVydERpc3BsYXkoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb250ZW50Qm94V2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgY29tcHV0ZWRTdHlsZTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBGb3IgZWxlbWVudHMgdGhhdCBWZWxvY2l0eSBoYXNuJ3QgYmVlbiBjYWxsZWQgb24gZGlyZWN0bHkgKGUuZy4gd2hlbiBWZWxvY2l0eSBxdWVyaWVzIHRoZSBET00gb24gYmVoYWxmXG4gICAgICAgICAgICAgICAgICAgICAgIG9mIGEgcGFyZW50IG9mIGFuIGVsZW1lbnQgaXRzIGFuaW1hdGluZyksIHBlcmZvcm0gYSBkaXJlY3QgZ2V0Q29tcHV0ZWRTdHlsZSBsb29rdXAgc2luY2UgdGhlIG9iamVjdCBpc24ndCBjYWNoZWQuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChEYXRhKGVsZW1lbnQpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkU3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKTsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBjb21wdXRlZFN0eWxlIG9iamVjdCBoYXMgeWV0IHRvIGJlIGNhY2hlZCwgZG8gc28gbm93LiAqL1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFEYXRhKGVsZW1lbnQpLmNvbXB1dGVkU3R5bGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkU3R5bGUgPSBEYXRhKGVsZW1lbnQpLmNvbXB1dGVkU3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKTsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIGNvbXB1dGVkU3R5bGUgaXMgY2FjaGVkLCB1c2UgaXQuICovXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFN0eWxlID0gRGF0YShlbGVtZW50KS5jb21wdXRlZFN0eWxlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogSUUgYW5kIEZpcmVmb3ggZG8gbm90IHJldHVybiBhIHZhbHVlIGZvciB0aGUgZ2VuZXJpYyBib3JkZXJDb2xvciAtLSB0aGV5IG9ubHkgcmV0dXJuIGluZGl2aWR1YWwgdmFsdWVzIGZvciBlYWNoIGJvcmRlciBzaWRlJ3MgY29sb3IuXG4gICAgICAgICAgICAgICAgICAgICAgIEFsc28sIGluIGFsbCBicm93c2Vycywgd2hlbiBib3JkZXIgY29sb3JzIGFyZW4ndCBhbGwgdGhlIHNhbWUsIGEgY29tcG91bmQgdmFsdWUgaXMgcmV0dXJuZWQgdGhhdCBWZWxvY2l0eSBpc24ndCBzZXR1cCB0byBwYXJzZS5cbiAgICAgICAgICAgICAgICAgICAgICAgU28sIGFzIGEgcG9seWZpbGwgZm9yIHF1ZXJ5aW5nIGluZGl2aWR1YWwgYm9yZGVyIHNpZGUgY29sb3JzLCB3ZSBqdXN0IHJldHVybiB0aGUgdG9wIGJvcmRlcidzIGNvbG9yIGFuZCBhbmltYXRlIGFsbCBib3JkZXJzIGZyb20gdGhhdCB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09PSBcImJvcmRlckNvbG9yXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gXCJib3JkZXJUb3BDb2xvclwiO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogSUU5IGhhcyBhIGJ1ZyBpbiB3aGljaCB0aGUgXCJmaWx0ZXJcIiBwcm9wZXJ0eSBtdXN0IGJlIGFjY2Vzc2VkIGZyb20gY29tcHV0ZWRTdHlsZSB1c2luZyB0aGUgZ2V0UHJvcGVydHlWYWx1ZSBtZXRob2RcbiAgICAgICAgICAgICAgICAgICAgICAgaW5zdGVhZCBvZiBhIGRpcmVjdCBwcm9wZXJ0eSBsb29rdXAuIFRoZSBnZXRQcm9wZXJ0eVZhbHVlIG1ldGhvZCBpcyBzbG93ZXIgdGhhbiBhIGRpcmVjdCBsb29rdXAsIHdoaWNoIGlzIHdoeSB3ZSBhdm9pZCBpdCBieSBkZWZhdWx0LiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoSUUgPT09IDkgJiYgcHJvcGVydHkgPT09IFwiZmlsdGVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkVmFsdWUgPSBjb21wdXRlZFN0eWxlLmdldFByb3BlcnR5VmFsdWUocHJvcGVydHkpOyAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkVmFsdWUgPSBjb21wdXRlZFN0eWxlW3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIEZhbGwgYmFjayB0byB0aGUgcHJvcGVydHkncyBzdHlsZSB2YWx1ZSAoaWYgZGVmaW5lZCkgd2hlbiBjb21wdXRlZFZhbHVlIHJldHVybnMgbm90aGluZyxcbiAgICAgICAgICAgICAgICAgICAgICAgd2hpY2ggY2FuIGhhcHBlbiB3aGVuIHRoZSBlbGVtZW50IGhhc24ndCBiZWVuIHBhaW50ZWQuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wdXRlZFZhbHVlID09PSBcIlwiIHx8IGNvbXB1dGVkVmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkVmFsdWUgPSBlbGVtZW50LnN0eWxlW3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldmVydERpc3BsYXkoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiBGb3IgdG9wLCByaWdodCwgYm90dG9tLCBhbmQgbGVmdCAoVFJCTCkgdmFsdWVzIHRoYXQgYXJlIHNldCB0byBcImF1dG9cIiBvbiBlbGVtZW50cyBvZiBcImZpeGVkXCIgb3IgXCJhYnNvbHV0ZVwiIHBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgIGRlZmVyIHRvIGpRdWVyeSBmb3IgY29udmVydGluZyBcImF1dG9cIiB0byBhIG51bWVyaWMgdmFsdWUuIChGb3IgZWxlbWVudHMgd2l0aCBhIFwic3RhdGljXCIgb3IgXCJyZWxhdGl2ZVwiIHBvc2l0aW9uLCBcImF1dG9cIiBoYXMgdGhlIHNhbWVcbiAgICAgICAgICAgICAgICAgICBlZmZlY3QgYXMgYmVpbmcgc2V0IHRvIDAsIHNvIG5vIGNvbnZlcnNpb24gaXMgbmVjZXNzYXJ5LikgKi9cbiAgICAgICAgICAgICAgICAvKiBBbiBleGFtcGxlIG9mIHdoeSBudW1lcmljIGNvbnZlcnNpb24gaXMgbmVjZXNzYXJ5OiBXaGVuIGFuIGVsZW1lbnQgd2l0aCBcInBvc2l0aW9uOmFic29sdXRlXCIgaGFzIGFuIHVudG91Y2hlZCBcImxlZnRcIlxuICAgICAgICAgICAgICAgICAgIHByb3BlcnR5LCB3aGljaCByZXZlcnRzIHRvIFwiYXV0b1wiLCBsZWZ0J3MgdmFsdWUgaXMgMCByZWxhdGl2ZSB0byBpdHMgcGFyZW50IGVsZW1lbnQsIGJ1dCBpcyBvZnRlbiBub24temVybyByZWxhdGl2ZVxuICAgICAgICAgICAgICAgICAgIHRvIGl0cyAqY29udGFpbmluZyogKG5vdCBwYXJlbnQpIGVsZW1lbnQsIHdoaWNoIGlzIHRoZSBuZWFyZXN0IFwicG9zaXRpb246cmVsYXRpdmVcIiBhbmNlc3RvciBvciB0aGUgdmlld3BvcnQgKGFuZCBhbHdheXMgdGhlIHZpZXdwb3J0IGluIHRoZSBjYXNlIG9mIFwicG9zaXRpb246Zml4ZWRcIikuICovXG4gICAgICAgICAgICAgICAgaWYgKGNvbXB1dGVkVmFsdWUgPT09IFwiYXV0b1wiICYmIC9eKHRvcHxyaWdodHxib3R0b218bGVmdCkkL2kudGVzdChwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvc2l0aW9uID0gY29tcHV0ZVByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJwb3NpdGlvblwiKTsgLyogR0VUICovXG5cbiAgICAgICAgICAgICAgICAgICAgLyogRm9yIGFic29sdXRlIHBvc2l0aW9uaW5nLCBqUXVlcnkncyAkLnBvc2l0aW9uKCkgb25seSByZXR1cm5zIHZhbHVlcyBmb3IgdG9wIGFuZCBsZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICByaWdodCBhbmQgYm90dG9tIHdpbGwgaGF2ZSB0aGVpciBcImF1dG9cIiB2YWx1ZSByZXZlcnRlZCB0byAwLiAqL1xuICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBBIGpRdWVyeSBvYmplY3QgbXVzdCBiZSBjcmVhdGVkIGhlcmUgc2luY2UgalF1ZXJ5IGRvZXNuJ3QgaGF2ZSBhIGxvdy1sZXZlbCBhbGlhcyBmb3IgJC5wb3NpdGlvbigpLlxuICAgICAgICAgICAgICAgICAgICAgICBOb3QgYSBiaWcgZGVhbCBzaW5jZSB3ZSdyZSBjdXJyZW50bHkgaW4gYSBHRVQgYmF0Y2ggYW55d2F5LiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9zaXRpb24gPT09IFwiZml4ZWRcIiB8fCAocG9zaXRpb24gPT09IFwiYWJzb2x1dGVcIiAmJiAvdG9wfGxlZnQvaS50ZXN0KHByb3BlcnR5KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IGpRdWVyeSBzdHJpcHMgdGhlIHBpeGVsIHVuaXQgZnJvbSBpdHMgcmV0dXJuZWQgdmFsdWVzOyB3ZSByZS1hZGQgaXQgaGVyZSB0byBjb25mb3JtIHdpdGggY29tcHV0ZVByb3BlcnR5VmFsdWUncyBiZWhhdmlvci4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkVmFsdWUgPSAkKGVsZW1lbnQpLnBvc2l0aW9uKClbcHJvcGVydHldICsgXCJweFwiOyAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBjb21wdXRlZFZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcHJvcGVydHlWYWx1ZTtcblxuICAgICAgICAgICAgLyogSWYgdGhpcyBpcyBhIGhvb2tlZCBwcm9wZXJ0eSAoZS5nLiBcImNsaXBMZWZ0XCIgaW5zdGVhZCBvZiB0aGUgcm9vdCBwcm9wZXJ0eSBvZiBcImNsaXBcIiksXG4gICAgICAgICAgICAgICBleHRyYWN0IHRoZSBob29rJ3MgdmFsdWUgZnJvbSBhIG5vcm1hbGl6ZWQgcm9vdFByb3BlcnR5VmFsdWUgdXNpbmcgQ1NTLkhvb2tzLmV4dHJhY3RWYWx1ZSgpLiAqL1xuICAgICAgICAgICAgaWYgKENTUy5Ib29rcy5yZWdpc3RlcmVkW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgIHZhciBob29rID0gcHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgIGhvb2tSb290ID0gQ1NTLkhvb2tzLmdldFJvb3QoaG9vayk7XG5cbiAgICAgICAgICAgICAgICAvKiBJZiBhIGNhY2hlZCByb290UHJvcGVydHlWYWx1ZSB3YXNuJ3QgcGFzc2VkIGluICh3aGljaCBWZWxvY2l0eSBhbHdheXMgYXR0ZW1wdHMgdG8gZG8gaW4gb3JkZXIgdG8gYXZvaWQgcmVxdWVyeWluZyB0aGUgRE9NKSxcbiAgICAgICAgICAgICAgICAgICBxdWVyeSB0aGUgRE9NIGZvciB0aGUgcm9vdCBwcm9wZXJ0eSdzIHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgIGlmIChyb290UHJvcGVydHlWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFNpbmNlIHRoZSBicm93c2VyIGlzIG5vdyBiZWluZyBkaXJlY3RseSBxdWVyaWVkLCB1c2UgdGhlIG9mZmljaWFsIHBvc3QtcHJlZml4aW5nIHByb3BlcnR5IG5hbWUgZm9yIHRoaXMgbG9va3VwLiAqL1xuICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSA9IENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIENTUy5OYW1lcy5wcmVmaXhDaGVjayhob29rUm9vdClbMF0pOyAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiBJZiB0aGlzIHJvb3QgaGFzIGEgbm9ybWFsaXphdGlvbiByZWdpc3RlcmVkLCBwZWZvcm0gdGhlIGFzc29jaWF0ZWQgbm9ybWFsaXphdGlvbiBleHRyYWN0aW9uLiAqL1xuICAgICAgICAgICAgICAgIGlmIChDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtob29rUm9vdF0pIHtcbiAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWUgPSBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtob29rUm9vdF0oXCJleHRyYWN0XCIsIGVsZW1lbnQsIHJvb3RQcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiBFeHRyYWN0IHRoZSBob29rJ3MgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IENTUy5Ib29rcy5leHRyYWN0VmFsdWUoaG9vaywgcm9vdFByb3BlcnR5VmFsdWUpO1xuXG4gICAgICAgICAgICAvKiBJZiB0aGlzIGlzIGEgbm9ybWFsaXplZCBwcm9wZXJ0eSAoZS5nLiBcIm9wYWNpdHlcIiBiZWNvbWVzIFwiZmlsdGVyXCIgaW4gPD1JRTgpIG9yIFwidHJhbnNsYXRlWFwiIGJlY29tZXMgXCJ0cmFuc2Zvcm1cIiksXG4gICAgICAgICAgICAgICBub3JtYWxpemUgdGhlIHByb3BlcnR5J3MgbmFtZSBhbmQgdmFsdWUsIGFuZCBoYW5kbGUgdGhlIHNwZWNpYWwgY2FzZSBvZiB0cmFuc2Zvcm1zLiAqL1xuICAgICAgICAgICAgLyogTm90ZTogTm9ybWFsaXppbmcgYSBwcm9wZXJ0eSBpcyBtdXR1YWxseSBleGNsdXNpdmUgZnJvbSBob29raW5nIGEgcHJvcGVydHkgc2luY2UgaG9vay1leHRyYWN0ZWQgdmFsdWVzIGFyZSBzdHJpY3RseVxuICAgICAgICAgICAgICAgbnVtZXJpY2FsIGFuZCB0aGVyZWZvcmUgZG8gbm90IHJlcXVpcmUgbm9ybWFsaXphdGlvbiBleHRyYWN0aW9uLiAqL1xuICAgICAgICAgICAgfSBlbHNlIGlmIChDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtwcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgICB2YXIgbm9ybWFsaXplZFByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZFByb3BlcnR5VmFsdWU7XG5cbiAgICAgICAgICAgICAgICBub3JtYWxpemVkUHJvcGVydHlOYW1lID0gQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbcHJvcGVydHldKFwibmFtZVwiLCBlbGVtZW50KTtcblxuICAgICAgICAgICAgICAgIC8qIFRyYW5zZm9ybSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgdmlhIG5vcm1hbGl6YXRpb24gZXh0cmFjdGlvbiAoc2VlIGJlbG93KSwgd2hpY2ggY2hlY2tzIGFnYWluc3QgdGhlIGVsZW1lbnQncyB0cmFuc2Zvcm1DYWNoZS5cbiAgICAgICAgICAgICAgICAgICBBdCBubyBwb2ludCBkbyB0cmFuc2Zvcm0gR0VUcyBldmVyIGFjdHVhbGx5IHF1ZXJ5IHRoZSBET007IGluaXRpYWwgc3R5bGVzaGVldCB2YWx1ZXMgYXJlIG5ldmVyIHByb2Nlc3NlZC5cbiAgICAgICAgICAgICAgICAgICBUaGlzIGlzIGJlY2F1c2UgcGFyc2luZyAzRCB0cmFuc2Zvcm0gbWF0cmljZXMgaXMgbm90IGFsd2F5cyBhY2N1cmF0ZSBhbmQgd291bGQgYmxvYXQgb3VyIGNvZGViYXNlO1xuICAgICAgICAgICAgICAgICAgIHRodXMsIG5vcm1hbGl6YXRpb24gZXh0cmFjdGlvbiBkZWZhdWx0cyBpbml0aWFsIHRyYW5zZm9ybSB2YWx1ZXMgdG8gdGhlaXIgemVyby12YWx1ZXMgKGUuZy4gMSBmb3Igc2NhbGVYIGFuZCAwIGZvciB0cmFuc2xhdGVYKS4gKi9cbiAgICAgICAgICAgICAgICBpZiAobm9ybWFsaXplZFByb3BlcnR5TmFtZSAhPT0gXCJ0cmFuc2Zvcm1cIikge1xuICAgICAgICAgICAgICAgICAgICBub3JtYWxpemVkUHJvcGVydHlWYWx1ZSA9IGNvbXB1dGVQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIENTUy5OYW1lcy5wcmVmaXhDaGVjayhub3JtYWxpemVkUHJvcGVydHlOYW1lKVswXSk7IC8qIEdFVCAqL1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSB2YWx1ZSBpcyBhIENTUyBudWxsLXZhbHVlIGFuZCB0aGlzIHByb3BlcnR5IGhhcyBhIGhvb2sgdGVtcGxhdGUsIHVzZSB0aGF0IHplcm8tdmFsdWUgdGVtcGxhdGUgc28gdGhhdCBob29rcyBjYW4gYmUgZXh0cmFjdGVkIGZyb20gaXQuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChDU1MuVmFsdWVzLmlzQ1NTTnVsbFZhbHVlKG5vcm1hbGl6ZWRQcm9wZXJ0eVZhbHVlKSAmJiBDU1MuSG9va3MudGVtcGxhdGVzW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZFByb3BlcnR5VmFsdWUgPSBDU1MuSG9va3MudGVtcGxhdGVzW3Byb3BlcnR5XVsxXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtwcm9wZXJ0eV0oXCJleHRyYWN0XCIsIGVsZW1lbnQsIG5vcm1hbGl6ZWRQcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogSWYgYSAobnVtZXJpYykgdmFsdWUgd2Fzbid0IHByb2R1Y2VkIHZpYSBob29rIGV4dHJhY3Rpb24gb3Igbm9ybWFsaXphdGlvbiwgcXVlcnkgdGhlIERPTS4gKi9cbiAgICAgICAgICAgIGlmICghL15bXFxkLV0vLnRlc3QocHJvcGVydHlWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAvKiBGb3IgU1ZHIGVsZW1lbnRzLCBkaW1lbnNpb25hbCBwcm9wZXJ0aWVzICh3aGljaCBTVkdBdHRyaWJ1dGUoKSBkZXRlY3RzKSBhcmUgdHdlZW5lZCB2aWFcbiAgICAgICAgICAgICAgICAgICB0aGVpciBIVE1MIGF0dHJpYnV0ZSB2YWx1ZXMgaW5zdGVhZCBvZiB0aGVpciBDU1Mgc3R5bGUgdmFsdWVzLiAqL1xuICAgICAgICAgICAgICAgIGlmIChEYXRhKGVsZW1lbnQpICYmIERhdGEoZWxlbWVudCkuaXNTVkcgJiYgQ1NTLk5hbWVzLlNWR0F0dHJpYnV0ZShwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogU2luY2UgdGhlIGhlaWdodC93aWR0aCBhdHRyaWJ1dGUgdmFsdWVzIG11c3QgYmUgc2V0IG1hbnVhbGx5LCB0aGV5IGRvbid0IHJlZmxlY3QgY29tcHV0ZWQgdmFsdWVzLlxuICAgICAgICAgICAgICAgICAgICAgICBUaHVzLCB3ZSB1c2UgdXNlIGdldEJCb3goKSB0byBlbnN1cmUgd2UgYWx3YXlzIGdldCB2YWx1ZXMgZm9yIGVsZW1lbnRzIHdpdGggdW5kZWZpbmVkIGhlaWdodC93aWR0aCBhdHRyaWJ1dGVzLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoL14oaGVpZ2h0fHdpZHRoKSQvaS50ZXN0KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogRmlyZWZveCB0aHJvd3MgYW4gZXJyb3IgaWYgLmdldEJCb3goKSBpcyBjYWxsZWQgb24gYW4gU1ZHIHRoYXQgaXNuJ3QgYXR0YWNoZWQgdG8gdGhlIERPTS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IGVsZW1lbnQuZ2V0QkJveCgpW3Byb3BlcnR5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8qIE90aGVyd2lzZSwgYWNjZXNzIHRoZSBhdHRyaWJ1dGUgdmFsdWUgZGlyZWN0bHkuICovXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUocHJvcGVydHkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IGNvbXB1dGVQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIENTUy5OYW1lcy5wcmVmaXhDaGVjayhwcm9wZXJ0eSlbMF0pOyAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIFNpbmNlIHByb3BlcnR5IGxvb2t1cHMgYXJlIGZvciBhbmltYXRpb24gcHVycG9zZXMgKHdoaWNoIGVudGFpbHMgY29tcHV0aW5nIHRoZSBudW1lcmljIGRlbHRhIGJldHdlZW4gc3RhcnQgYW5kIGVuZCB2YWx1ZXMpLFxuICAgICAgICAgICAgICAgY29udmVydCBDU1MgbnVsbC12YWx1ZXMgdG8gYW4gaW50ZWdlciBvZiB2YWx1ZSAwLiAqL1xuICAgICAgICAgICAgaWYgKENTUy5WYWx1ZXMuaXNDU1NOdWxsVmFsdWUocHJvcGVydHlWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKFZlbG9jaXR5LmRlYnVnID49IDIpIGNvbnNvbGUubG9nKFwiR2V0IFwiICsgcHJvcGVydHkgKyBcIjogXCIgKyBwcm9wZXJ0eVZhbHVlKTtcblxuICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VmFsdWU7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyogVGhlIHNpbmd1bGFyIHNldFByb3BlcnR5VmFsdWUsIHdoaWNoIHJvdXRlcyB0aGUgbG9naWMgZm9yIGFsbCBub3JtYWxpemF0aW9ucywgaG9va3MsIGFuZCBzdGFuZGFyZCBDU1MgcHJvcGVydGllcy4gKi9cbiAgICAgICAgc2V0UHJvcGVydHlWYWx1ZTogZnVuY3Rpb24oZWxlbWVudCwgcHJvcGVydHksIHByb3BlcnR5VmFsdWUsIHJvb3RQcm9wZXJ0eVZhbHVlLCBzY3JvbGxEYXRhKSB7XG4gICAgICAgICAgICB2YXIgcHJvcGVydHlOYW1lID0gcHJvcGVydHk7XG5cbiAgICAgICAgICAgIC8qIEluIG9yZGVyIHRvIGJlIHN1YmplY3RlZCB0byBjYWxsIG9wdGlvbnMgYW5kIGVsZW1lbnQgcXVldWVpbmcsIHNjcm9sbCBhbmltYXRpb24gaXMgcm91dGVkIHRocm91Z2ggVmVsb2NpdHkgYXMgaWYgaXQgd2VyZSBhIHN0YW5kYXJkIENTUyBwcm9wZXJ0eS4gKi9cbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJzY3JvbGxcIikge1xuICAgICAgICAgICAgICAgIC8qIElmIGEgY29udGFpbmVyIG9wdGlvbiBpcyBwcmVzZW50LCBzY3JvbGwgdGhlIGNvbnRhaW5lciBpbnN0ZWFkIG9mIHRoZSBicm93c2VyIHdpbmRvdy4gKi9cbiAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsRGF0YS5jb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsRGF0YS5jb250YWluZXJbXCJzY3JvbGxcIiArIHNjcm9sbERhdGEuZGlyZWN0aW9uXSA9IHByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICAgICAgLyogT3RoZXJ3aXNlLCBWZWxvY2l0eSBkZWZhdWx0cyB0byBzY3JvbGxpbmcgdGhlIGJyb3dzZXIgd2luZG93LiAqL1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzY3JvbGxEYXRhLmRpcmVjdGlvbiA9PT0gXCJMZWZ0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyhwcm9wZXJ0eVZhbHVlLCBzY3JvbGxEYXRhLmFsdGVybmF0ZVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyhzY3JvbGxEYXRhLmFsdGVybmF0ZVZhbHVlLCBwcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLyogVHJhbnNmb3JtcyAodHJhbnNsYXRlWCwgcm90YXRlWiwgZXRjLikgYXJlIGFwcGxpZWQgdG8gYSBwZXItZWxlbWVudCB0cmFuc2Zvcm1DYWNoZSBvYmplY3QsIHdoaWNoIGlzIG1hbnVhbGx5IGZsdXNoZWQgdmlhIGZsdXNoVHJhbnNmb3JtQ2FjaGUoKS5cbiAgICAgICAgICAgICAgICAgICBUaHVzLCBmb3Igbm93LCB3ZSBtZXJlbHkgY2FjaGUgdHJhbnNmb3JtcyBiZWluZyBTRVQuICovXG4gICAgICAgICAgICAgICAgaWYgKENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW3Byb3BlcnR5XSAmJiBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtwcm9wZXJ0eV0oXCJuYW1lXCIsIGVsZW1lbnQpID09PSBcInRyYW5zZm9ybVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFBlcmZvcm0gYSBub3JtYWxpemF0aW9uIGluamVjdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogVGhlIG5vcm1hbGl6YXRpb24gbG9naWMgaGFuZGxlcyB0aGUgdHJhbnNmb3JtQ2FjaGUgdXBkYXRpbmcuICovXG4gICAgICAgICAgICAgICAgICAgIENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW3Byb3BlcnR5XShcImluamVjdFwiLCBlbGVtZW50LCBwcm9wZXJ0eVZhbHVlKTtcblxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUgPSBcInRyYW5zZm9ybVwiO1xuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZVtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLyogSW5qZWN0IGhvb2tzLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ1NTLkhvb2tzLnJlZ2lzdGVyZWRbcHJvcGVydHldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaG9va05hbWUgPSBwcm9wZXJ0eSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rUm9vdCA9IENTUy5Ib29rcy5nZXRSb290KHByb3BlcnR5KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgYSBjYWNoZWQgcm9vdFByb3BlcnR5VmFsdWUgd2FzIG5vdCBwcm92aWRlZCwgcXVlcnkgdGhlIERPTSBmb3IgdGhlIGhvb2tSb290J3MgY3VycmVudCB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlID0gcm9vdFByb3BlcnR5VmFsdWUgfHwgQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgaG9va1Jvb3QpOyAvKiBHRVQgKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IENTUy5Ib29rcy5pbmplY3RWYWx1ZShob29rTmFtZSwgcHJvcGVydHlWYWx1ZSwgcm9vdFByb3BlcnR5VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkgPSBob29rUm9vdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIE5vcm1hbGl6ZSBuYW1lcyBhbmQgdmFsdWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbcHJvcGVydHldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbcHJvcGVydHldKFwiaW5qZWN0XCIsIGVsZW1lbnQsIHByb3BlcnR5VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkgPSBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtwcm9wZXJ0eV0oXCJuYW1lXCIsIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogQXNzaWduIHRoZSBhcHByb3ByaWF0ZSB2ZW5kb3IgcHJlZml4IGJlZm9yZSBwZXJmb3JtaW5nIGFuIG9mZmljaWFsIHN0eWxlIHVwZGF0ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lID0gQ1NTLk5hbWVzLnByZWZpeENoZWNrKHByb3BlcnR5KVswXTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBBIHRyeS9jYXRjaCBpcyB1c2VkIGZvciBJRTw9OCwgd2hpY2ggdGhyb3dzIGFuIGVycm9yIHdoZW4gXCJpbnZhbGlkXCIgQ1NTIHZhbHVlcyBhcmUgc2V0LCBlLmcuIGEgbmVnYXRpdmUgd2lkdGguXG4gICAgICAgICAgICAgICAgICAgICAgIFRyeS9jYXRjaCBpcyBhdm9pZGVkIGZvciBvdGhlciBicm93c2VycyBzaW5jZSBpdCBpbmN1cnMgYSBwZXJmb3JtYW5jZSBvdmVyaGVhZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKElFIDw9IDgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtwcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7IGlmIChWZWxvY2l0eS5kZWJ1ZykgY29uc29sZS5sb2coXCJCcm93c2VyIGRvZXMgbm90IHN1cHBvcnQgW1wiICsgcHJvcGVydHlWYWx1ZSArIFwiXSBmb3IgW1wiICsgcHJvcGVydHlOYW1lICsgXCJdXCIpOyB9XG4gICAgICAgICAgICAgICAgICAgIC8qIFNWRyBlbGVtZW50cyBoYXZlIHRoZWlyIGRpbWVuc2lvbmFsIHByb3BlcnRpZXMgKHdpZHRoLCBoZWlnaHQsIHgsIHksIGN4LCBldGMuKSBhcHBsaWVkIGRpcmVjdGx5IGFzIGF0dHJpYnV0ZXMgaW5zdGVhZCBvZiBhcyBzdHlsZXMuICovXG4gICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IElFOCBkb2VzIG5vdCBzdXBwb3J0IFNWRyBlbGVtZW50cywgc28gaXQncyBva2F5IHRoYXQgd2Ugc2tpcCBpdCBmb3IgU1ZHIGFuaW1hdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChEYXRhKGVsZW1lbnQpICYmIERhdGEoZWxlbWVudCkuaXNTVkcgJiYgQ1NTLk5hbWVzLlNWR0F0dHJpYnV0ZShwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IEZvciBTVkcgYXR0cmlidXRlcywgdmVuZG9yLXByZWZpeGVkIHByb3BlcnR5IG5hbWVzIGFyZSBuZXZlciB1c2VkLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogTm90IGFsbCBDU1MgcHJvcGVydGllcyBjYW4gYmUgYW5pbWF0ZWQgdmlhIGF0dHJpYnV0ZXMsIGJ1dCB0aGUgYnJvd3NlciB3b24ndCB0aHJvdyBhbiBlcnJvciBmb3IgdW5zdXBwb3J0ZWQgcHJvcGVydGllcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKHByb3BlcnR5LCBwcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbcHJvcGVydHlOYW1lXSA9IHByb3BlcnR5VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkuZGVidWcgPj0gMikgY29uc29sZS5sb2coXCJTZXQgXCIgKyBwcm9wZXJ0eSArIFwiIChcIiArIHByb3BlcnR5TmFtZSArIFwiKTogXCIgKyBwcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIFJldHVybiB0aGUgbm9ybWFsaXplZCBwcm9wZXJ0eSBuYW1lIGFuZCB2YWx1ZSBpbiBjYXNlIHRoZSBjYWxsZXIgd2FudHMgdG8ga25vdyBob3cgdGhlc2UgdmFsdWVzIHdlcmUgbW9kaWZpZWQgYmVmb3JlIGJlaW5nIGFwcGxpZWQgdG8gdGhlIERPTS4gKi9cbiAgICAgICAgICAgIHJldHVybiBbIHByb3BlcnR5TmFtZSwgcHJvcGVydHlWYWx1ZSBdO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qIFRvIGluY3JlYXNlIHBlcmZvcm1hbmNlIGJ5IGJhdGNoaW5nIHRyYW5zZm9ybSB1cGRhdGVzIGludG8gYSBzaW5nbGUgU0VULCB0cmFuc2Zvcm1zIGFyZSBub3QgZGlyZWN0bHkgYXBwbGllZCB0byBhbiBlbGVtZW50IHVudGlsIGZsdXNoVHJhbnNmb3JtQ2FjaGUoKSBpcyBjYWxsZWQuICovXG4gICAgICAgIC8qIE5vdGU6IFZlbG9jaXR5IGFwcGxpZXMgdHJhbnNmb3JtIHByb3BlcnRpZXMgaW4gdGhlIHNhbWUgb3JkZXIgdGhhdCB0aGV5IGFyZSBjaHJvbm9naWNhbGx5IGludHJvZHVjZWQgdG8gdGhlIGVsZW1lbnQncyBDU1Mgc3R5bGVzLiAqL1xuICAgICAgICBmbHVzaFRyYW5zZm9ybUNhY2hlOiBmdW5jdGlvbihlbGVtZW50KSB7XG4gICAgICAgICAgICB2YXIgdHJhbnNmb3JtU3RyaW5nID0gXCJcIjtcblxuICAgICAgICAgICAgLyogQ2VydGFpbiBicm93c2VycyByZXF1aXJlIHRoYXQgU1ZHIHRyYW5zZm9ybXMgYmUgYXBwbGllZCBhcyBhbiBhdHRyaWJ1dGUuIEhvd2V2ZXIsIHRoZSBTVkcgdHJhbnNmb3JtIGF0dHJpYnV0ZSB0YWtlcyBhIG1vZGlmaWVkIHZlcnNpb24gb2YgQ1NTJ3MgdHJhbnNmb3JtIHN0cmluZ1xuICAgICAgICAgICAgICAgKHVuaXRzIGFyZSBkcm9wcGVkIGFuZCwgZXhjZXB0IGZvciBza2V3WC9ZLCBzdWJwcm9wZXJ0aWVzIGFyZSBtZXJnZWQgaW50byB0aGVpciBtYXN0ZXIgcHJvcGVydHkgLS0gZS5nLiBzY2FsZVggYW5kIHNjYWxlWSBhcmUgbWVyZ2VkIGludG8gc2NhbGUoWCBZKS4gKi9cbiAgICAgICAgICAgIGlmICgoSUUgfHwgKFZlbG9jaXR5LlN0YXRlLmlzQW5kcm9pZCAmJiAhVmVsb2NpdHkuU3RhdGUuaXNDaHJvbWUpKSAmJiBEYXRhKGVsZW1lbnQpLmlzU1ZHKSB7XG4gICAgICAgICAgICAgICAgLyogU2luY2UgdHJhbnNmb3JtIHZhbHVlcyBhcmUgc3RvcmVkIGluIHRoZWlyIHBhcmVudGhlc2VzLXdyYXBwZWQgZm9ybSwgd2UgdXNlIGEgaGVscGVyIGZ1bmN0aW9uIHRvIHN0cmlwIG91dCB0aGVpciBudW1lcmljIHZhbHVlcy5cbiAgICAgICAgICAgICAgICAgICBGdXJ0aGVyLCBTVkcgdHJhbnNmb3JtIHByb3BlcnRpZXMgb25seSB0YWtlIHVuaXRsZXNzIChyZXByZXNlbnRpbmcgcGl4ZWxzKSB2YWx1ZXMsIHNvIGl0J3Mgb2theSB0aGF0IHBhcnNlRmxvYXQoKSBzdHJpcHMgdGhlIHVuaXQgc3VmZml4ZWQgdG8gdGhlIGZsb2F0IHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGdldFRyYW5zZm9ybUZsb2F0ICh0cmFuc2Zvcm1Qcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCB0cmFuc2Zvcm1Qcm9wZXJ0eSkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qIENyZWF0ZSBhbiBvYmplY3QgdG8gb3JnYW5pemUgYWxsIHRoZSB0cmFuc2Zvcm1zIHRoYXQgd2UnbGwgYXBwbHkgdG8gdGhlIFNWRyBlbGVtZW50LiBUbyBrZWVwIHRoZSBsb2dpYyBzaW1wbGUsXG4gICAgICAgICAgICAgICAgICAgd2UgcHJvY2VzcyAqYWxsKiB0cmFuc2Zvcm0gcHJvcGVydGllcyAtLSBldmVuIHRob3NlIHRoYXQgbWF5IG5vdCBiZSBleHBsaWNpdGx5IGFwcGxpZWQgKHNpbmNlIHRoZXkgZGVmYXVsdCB0byB0aGVpciB6ZXJvLXZhbHVlcyBhbnl3YXkpLiAqL1xuICAgICAgICAgICAgICAgIHZhciBTVkdUcmFuc2Zvcm1zID0ge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGU6IFsgZ2V0VHJhbnNmb3JtRmxvYXQoXCJ0cmFuc2xhdGVYXCIpLCBnZXRUcmFuc2Zvcm1GbG9hdChcInRyYW5zbGF0ZVlcIikgXSxcbiAgICAgICAgICAgICAgICAgICAgc2tld1g6IFsgZ2V0VHJhbnNmb3JtRmxvYXQoXCJza2V3WFwiKSBdLCBza2V3WTogWyBnZXRUcmFuc2Zvcm1GbG9hdChcInNrZXdZXCIpIF0sXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBzY2FsZSBwcm9wZXJ0eSBpcyBzZXQgKG5vbi0xKSwgdXNlIHRoYXQgdmFsdWUgZm9yIHRoZSBzY2FsZVggYW5kIHNjYWxlWSB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMgYmVoYXZpb3IgbWltaWNzIHRoZSByZXN1bHQgb2YgYW5pbWF0aW5nIGFsbCB0aGVzZSBwcm9wZXJ0aWVzIGF0IG9uY2Ugb24gSFRNTCBlbGVtZW50cykuICovXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlOiBnZXRUcmFuc2Zvcm1GbG9hdChcInNjYWxlXCIpICE9PSAxID8gWyBnZXRUcmFuc2Zvcm1GbG9hdChcInNjYWxlXCIpLCBnZXRUcmFuc2Zvcm1GbG9hdChcInNjYWxlXCIpIF0gOiBbIGdldFRyYW5zZm9ybUZsb2F0KFwic2NhbGVYXCIpLCBnZXRUcmFuc2Zvcm1GbG9hdChcInNjYWxlWVwiKSBdLFxuICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBTVkcncyByb3RhdGUgdHJhbnNmb3JtIHRha2VzIHRocmVlIHZhbHVlczogcm90YXRpb24gZGVncmVlcyBmb2xsb3dlZCBieSB0aGUgWCBhbmQgWSB2YWx1ZXNcbiAgICAgICAgICAgICAgICAgICAgICAgZGVmaW5pbmcgdGhlIHJvdGF0aW9uJ3Mgb3JpZ2luIHBvaW50LiBXZSBpZ25vcmUgdGhlIG9yaWdpbiB2YWx1ZXMgKGRlZmF1bHQgdGhlbSB0byAwKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgcm90YXRlOiBbIGdldFRyYW5zZm9ybUZsb2F0KFwicm90YXRlWlwiKSwgMCwgMCBdXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCB0aGUgdHJhbnNmb3JtIHByb3BlcnRpZXMgaW4gdGhlIHVzZXItZGVmaW5lZCBwcm9wZXJ0eSBtYXAgb3JkZXIuXG4gICAgICAgICAgICAgICAgICAgKFRoaXMgbWltaWNzIHRoZSBiZWhhdmlvciBvZiBub24tU1ZHIHRyYW5zZm9ybSBhbmltYXRpb24uKSAqL1xuICAgICAgICAgICAgICAgICQuZWFjaChEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlLCBmdW5jdGlvbih0cmFuc2Zvcm1OYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIEV4Y2VwdCBmb3Igd2l0aCBza2V3WC9ZLCByZXZlcnQgdGhlIGF4aXMtc3BlY2lmaWMgdHJhbnNmb3JtIHN1YnByb3BlcnRpZXMgdG8gdGhlaXIgYXhpcy1mcmVlIG1hc3RlclxuICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzIHNvIHRoYXQgdGhleSBtYXRjaCB1cCB3aXRoIFNWRydzIGFjY2VwdGVkIHRyYW5zZm9ybSBwcm9wZXJ0aWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoL150cmFuc2xhdGUvaS50ZXN0KHRyYW5zZm9ybU5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1OYW1lID0gXCJ0cmFuc2xhdGVcIjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgvXnNjYWxlL2kudGVzdCh0cmFuc2Zvcm1OYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtTmFtZSA9IFwic2NhbGVcIjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgvXnJvdGF0ZS9pLnRlc3QodHJhbnNmb3JtTmFtZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybU5hbWUgPSBcInJvdGF0ZVwiO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogQ2hlY2sgdGhhdCB3ZSBoYXZlbid0IHlldCBkZWxldGVkIHRoZSBwcm9wZXJ0eSBmcm9tIHRoZSBTVkdUcmFuc2Zvcm1zIGNvbnRhaW5lci4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKFNWR1RyYW5zZm9ybXNbdHJhbnNmb3JtTmFtZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFwcGVuZCB0aGUgdHJhbnNmb3JtIHByb3BlcnR5IGluIHRoZSBTVkctc3VwcG9ydGVkIHRyYW5zZm9ybSBmb3JtYXQuIEFzIHBlciB0aGUgc3BlYywgc3Vycm91bmQgdGhlIHNwYWNlLWRlbGltaXRlZCB2YWx1ZXMgaW4gcGFyZW50aGVzZXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1TdHJpbmcgKz0gdHJhbnNmb3JtTmFtZSArIFwiKFwiICsgU1ZHVHJhbnNmb3Jtc1t0cmFuc2Zvcm1OYW1lXS5qb2luKFwiIFwiKSArIFwiKVwiICsgXCIgXCI7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFmdGVyIHByb2Nlc3NpbmcgYW4gU1ZHIHRyYW5zZm9ybSBwcm9wZXJ0eSwgZGVsZXRlIGl0IGZyb20gdGhlIFNWR1RyYW5zZm9ybXMgY29udGFpbmVyIHNvIHdlIGRvbid0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZS1pbnNlcnQgdGhlIHNhbWUgbWFzdGVyIHByb3BlcnR5IGlmIHdlIGVuY291bnRlciBhbm90aGVyIG9uZSBvZiBpdHMgYXhpcy1zcGVjaWZpYyBwcm9wZXJ0aWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIFNWR1RyYW5zZm9ybXNbdHJhbnNmb3JtTmFtZV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHRyYW5zZm9ybVZhbHVlLFxuICAgICAgICAgICAgICAgICAgICBwZXJzcGVjdGl2ZTtcblxuICAgICAgICAgICAgICAgIC8qIFRyYW5zZm9ybSBwcm9wZXJ0aWVzIGFyZSBzdG9yZWQgYXMgbWVtYmVycyBvZiB0aGUgdHJhbnNmb3JtQ2FjaGUgb2JqZWN0LiBDb25jYXRlbmF0ZSBhbGwgdGhlIG1lbWJlcnMgaW50byBhIHN0cmluZy4gKi9cbiAgICAgICAgICAgICAgICAkLmVhY2goRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZSwgZnVuY3Rpb24odHJhbnNmb3JtTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1WYWx1ZSA9IERhdGEoZWxlbWVudCkudHJhbnNmb3JtQ2FjaGVbdHJhbnNmb3JtTmFtZV07XG5cbiAgICAgICAgICAgICAgICAgICAgLyogVHJhbnNmb3JtJ3MgcGVyc3BlY3RpdmUgc3VicHJvcGVydHkgbXVzdCBiZSBzZXQgZmlyc3QgaW4gb3JkZXIgdG8gdGFrZSBlZmZlY3QuIFN0b3JlIGl0IHRlbXBvcmFyaWx5LiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAodHJhbnNmb3JtTmFtZSA9PT0gXCJ0cmFuc2Zvcm1QZXJzcGVjdGl2ZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJzcGVjdGl2ZSA9IHRyYW5zZm9ybVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKiBJRTkgb25seSBzdXBwb3J0cyBvbmUgcm90YXRpb24gdHlwZSwgcm90YXRlWiwgd2hpY2ggaXQgcmVmZXJzIHRvIGFzIFwicm90YXRlXCIuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChJRSA9PT0gOSAmJiB0cmFuc2Zvcm1OYW1lID09PSBcInJvdGF0ZVpcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtTmFtZSA9IFwicm90YXRlXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1TdHJpbmcgKz0gdHJhbnNmb3JtTmFtZSArIHRyYW5zZm9ybVZhbHVlICsgXCIgXCI7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvKiBJZiBwcmVzZW50LCBzZXQgdGhlIHBlcnNwZWN0aXZlIHN1YnByb3BlcnR5IGZpcnN0LiAqL1xuICAgICAgICAgICAgICAgIGlmIChwZXJzcGVjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1TdHJpbmcgPSBcInBlcnNwZWN0aXZlXCIgKyBwZXJzcGVjdGl2ZSArIFwiIFwiICsgdHJhbnNmb3JtU3RyaW5nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgQ1NTLnNldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJ0cmFuc2Zvcm1cIiwgdHJhbnNmb3JtU3RyaW5nKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKiBSZWdpc3RlciBob29rcyBhbmQgbm9ybWFsaXphdGlvbnMuICovXG4gICAgQ1NTLkhvb2tzLnJlZ2lzdGVyKCk7XG4gICAgQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyKCk7XG5cbiAgICAvKiBBbGxvdyBob29rIHNldHRpbmcgaW4gdGhlIHNhbWUgZmFzaGlvbiBhcyBqUXVlcnkncyAkLmNzcygpLiAqL1xuICAgIFZlbG9jaXR5Lmhvb2sgPSBmdW5jdGlvbiAoZWxlbWVudHMsIGFyZzIsIGFyZzMpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIGVsZW1lbnRzID0gc2FuaXRpemVFbGVtZW50cyhlbGVtZW50cyk7XG5cbiAgICAgICAgJC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbihpLCBlbGVtZW50KSB7XG4gICAgICAgICAgICAvKiBJbml0aWFsaXplIFZlbG9jaXR5J3MgcGVyLWVsZW1lbnQgZGF0YSBjYWNoZSBpZiB0aGlzIGVsZW1lbnQgaGFzbid0IHByZXZpb3VzbHkgYmVlbiBhbmltYXRlZC4gKi9cbiAgICAgICAgICAgIGlmIChEYXRhKGVsZW1lbnQpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBWZWxvY2l0eS5pbml0KGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBHZXQgcHJvcGVydHkgdmFsdWUuIElmIGFuIGVsZW1lbnQgc2V0IHdhcyBwYXNzZWQgaW4sIG9ubHkgcmV0dXJuIHRoZSB2YWx1ZSBmb3IgdGhlIGZpcnN0IGVsZW1lbnQuICovXG4gICAgICAgICAgICBpZiAoYXJnMyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBWZWxvY2l0eS5DU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBhcmcyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBTZXQgcHJvcGVydHkgdmFsdWUuICovXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8qIHNQViByZXR1cm5zIGFuIGFycmF5IG9mIHRoZSBub3JtYWxpemVkIHByb3BlcnR5TmFtZS9wcm9wZXJ0eVZhbHVlIHBhaXIgdXNlZCB0byB1cGRhdGUgdGhlIERPTS4gKi9cbiAgICAgICAgICAgICAgICB2YXIgYWRqdXN0ZWRTZXQgPSBWZWxvY2l0eS5DU1Muc2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBhcmcyLCBhcmczKTtcblxuICAgICAgICAgICAgICAgIC8qIFRyYW5zZm9ybSBwcm9wZXJ0aWVzIGRvbid0IGF1dG9tYXRpY2FsbHkgc2V0LiBUaGV5IGhhdmUgdG8gYmUgZmx1c2hlZCB0byB0aGUgRE9NLiAqL1xuICAgICAgICAgICAgICAgIGlmIChhZGp1c3RlZFNldFswXSA9PT0gXCJ0cmFuc2Zvcm1cIikge1xuICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5DU1MuZmx1c2hUcmFuc2Zvcm1DYWNoZShlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGFkanVzdGVkU2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfTtcblxuICAgIC8qKioqKioqKioqKioqKioqKlxuICAgICAgICBBbmltYXRpb25cbiAgICAqKioqKioqKioqKioqKioqKi9cblxuICAgIHZhciBhbmltYXRlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgQ2FsbCBDaGFpblxuICAgICAgICAqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgLyogTG9naWMgZm9yIGRldGVybWluaW5nIHdoYXQgdG8gcmV0dXJuIHRvIHRoZSBjYWxsIHN0YWNrIHdoZW4gZXhpdGluZyBvdXQgb2YgVmVsb2NpdHkuICovXG4gICAgICAgIGZ1bmN0aW9uIGdldENoYWluICgpIHtcbiAgICAgICAgICAgIC8qIElmIHdlIGFyZSB1c2luZyB0aGUgdXRpbGl0eSBmdW5jdGlvbiwgYXR0ZW1wdCB0byByZXR1cm4gdGhpcyBjYWxsJ3MgcHJvbWlzZS4gSWYgbm8gcHJvbWlzZSBsaWJyYXJ5IHdhcyBkZXRlY3RlZCxcbiAgICAgICAgICAgICAgIGRlZmF1bHQgdG8gbnVsbCBpbnN0ZWFkIG9mIHJldHVybmluZyB0aGUgdGFyZ2V0ZWQgZWxlbWVudHMgc28gdGhhdCB1dGlsaXR5IGZ1bmN0aW9uJ3MgcmV0dXJuIHZhbHVlIGlzIHN0YW5kYXJkaXplZC4gKi9cbiAgICAgICAgICAgIGlmIChpc1V0aWxpdHkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZURhdGEucHJvbWlzZSB8fCBudWxsO1xuICAgICAgICAgICAgLyogT3RoZXJ3aXNlLCBpZiB3ZSdyZSB1c2luZyAkLmZuLCByZXR1cm4gdGhlIGpRdWVyeS0vWmVwdG8td3JhcHBlZCBlbGVtZW50IHNldC4gKi9cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRzV3JhcHBlZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgIEFyZ3VtZW50cyBBc3NpZ25tZW50XG4gICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgLyogVG8gYWxsb3cgZm9yIGV4cHJlc3NpdmUgQ29mZmVlU2NyaXB0IGNvZGUsIFZlbG9jaXR5IHN1cHBvcnRzIGFuIGFsdGVybmF0aXZlIHN5bnRheCBpbiB3aGljaCBcImVsZW1lbnRzXCIgKG9yIFwiZVwiKSwgXCJwcm9wZXJ0aWVzXCIgKG9yIFwicFwiKSwgYW5kIFwib3B0aW9uc1wiIChvciBcIm9cIilcbiAgICAgICAgICAgb2JqZWN0cyBhcmUgZGVmaW5lZCBvbiBhIGNvbnRhaW5lciBvYmplY3QgdGhhdCdzIHBhc3NlZCBpbiBhcyBWZWxvY2l0eSdzIHNvbGUgYXJndW1lbnQuICovXG4gICAgICAgIC8qIE5vdGU6IFNvbWUgYnJvd3NlcnMgYXV0b21hdGljYWxseSBwb3B1bGF0ZSBhcmd1bWVudHMgd2l0aCBhIFwicHJvcGVydGllc1wiIG9iamVjdC4gV2UgZGV0ZWN0IGl0IGJ5IGNoZWNraW5nIGZvciBpdHMgZGVmYXVsdCBcIm5hbWVzXCIgcHJvcGVydHkuICovXG4gICAgICAgIHZhciBzeW50YWN0aWNTdWdhciA9IChhcmd1bWVudHNbMF0gJiYgKGFyZ3VtZW50c1swXS5wIHx8ICgoJC5pc1BsYWluT2JqZWN0KGFyZ3VtZW50c1swXS5wcm9wZXJ0aWVzKSAmJiAhYXJndW1lbnRzWzBdLnByb3BlcnRpZXMubmFtZXMpIHx8IFR5cGUuaXNTdHJpbmcoYXJndW1lbnRzWzBdLnByb3BlcnRpZXMpKSkpLFxuICAgICAgICAgICAgLyogV2hldGhlciBWZWxvY2l0eSB3YXMgY2FsbGVkIHZpYSB0aGUgdXRpbGl0eSBmdW5jdGlvbiAoYXMgb3Bwb3NlZCB0byBvbiBhIGpRdWVyeS9aZXB0byBvYmplY3QpLiAqL1xuICAgICAgICAgICAgaXNVdGlsaXR5LFxuICAgICAgICAgICAgLyogV2hlbiBWZWxvY2l0eSBpcyBjYWxsZWQgdmlhIHRoZSB1dGlsaXR5IGZ1bmN0aW9uICgkLlZlbG9jaXR5KCkvVmVsb2NpdHkoKSksIGVsZW1lbnRzIGFyZSBleHBsaWNpdGx5XG4gICAgICAgICAgICAgICBwYXNzZWQgaW4gYXMgdGhlIGZpcnN0IHBhcmFtZXRlci4gVGh1cywgYXJndW1lbnQgcG9zaXRpb25pbmcgdmFyaWVzLiBXZSBub3JtYWxpemUgdGhlbSBoZXJlLiAqL1xuICAgICAgICAgICAgZWxlbWVudHNXcmFwcGVkLFxuICAgICAgICAgICAgYXJndW1lbnRJbmRleDtcblxuICAgICAgICB2YXIgZWxlbWVudHMsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzTWFwLFxuICAgICAgICAgICAgb3B0aW9ucztcblxuICAgICAgICAvKiBEZXRlY3QgalF1ZXJ5L1plcHRvIGVsZW1lbnRzIGJlaW5nIGFuaW1hdGVkIHZpYSB0aGUgJC5mbiBtZXRob2QuICovXG4gICAgICAgIGlmIChUeXBlLmlzV3JhcHBlZCh0aGlzKSkge1xuICAgICAgICAgICAgaXNVdGlsaXR5ID0gZmFsc2U7XG5cbiAgICAgICAgICAgIGFyZ3VtZW50SW5kZXggPSAwO1xuICAgICAgICAgICAgZWxlbWVudHMgPSB0aGlzO1xuICAgICAgICAgICAgZWxlbWVudHNXcmFwcGVkID0gdGhpcztcbiAgICAgICAgLyogT3RoZXJ3aXNlLCByYXcgZWxlbWVudHMgYXJlIGJlaW5nIGFuaW1hdGVkIHZpYSB0aGUgdXRpbGl0eSBmdW5jdGlvbi4gKi9cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlzVXRpbGl0eSA9IHRydWU7XG5cbiAgICAgICAgICAgIGFyZ3VtZW50SW5kZXggPSAxO1xuICAgICAgICAgICAgZWxlbWVudHMgPSBzeW50YWN0aWNTdWdhciA/IChhcmd1bWVudHNbMF0uZWxlbWVudHMgfHwgYXJndW1lbnRzWzBdLmUpIDogYXJndW1lbnRzWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgZWxlbWVudHMgPSBzYW5pdGl6ZUVsZW1lbnRzKGVsZW1lbnRzKTtcblxuICAgICAgICBpZiAoIWVsZW1lbnRzKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3ludGFjdGljU3VnYXIpIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXNNYXAgPSBhcmd1bWVudHNbMF0ucHJvcGVydGllcyB8fCBhcmd1bWVudHNbMF0ucDtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBhcmd1bWVudHNbMF0ub3B0aW9ucyB8fCBhcmd1bWVudHNbMF0ubztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb3BlcnRpZXNNYXAgPSBhcmd1bWVudHNbYXJndW1lbnRJbmRleF07XG4gICAgICAgICAgICBvcHRpb25zID0gYXJndW1lbnRzW2FyZ3VtZW50SW5kZXggKyAxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIFRoZSBsZW5ndGggb2YgdGhlIGVsZW1lbnQgc2V0IChpbiB0aGUgZm9ybSBvZiBhIG5vZGVMaXN0IG9yIGFuIGFycmF5IG9mIGVsZW1lbnRzKSBpcyBkZWZhdWx0ZWQgdG8gMSBpbiBjYXNlIGFcbiAgICAgICAgICAgc2luZ2xlIHJhdyBET00gZWxlbWVudCBpcyBwYXNzZWQgaW4gKHdoaWNoIGRvZXNuJ3QgY29udGFpbiBhIGxlbmd0aCBwcm9wZXJ0eSkuICovXG4gICAgICAgIHZhciBlbGVtZW50c0xlbmd0aCA9IGVsZW1lbnRzLmxlbmd0aCxcbiAgICAgICAgICAgIGVsZW1lbnRzSW5kZXggPSAwO1xuXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgIEFyZ3VtZW50IE92ZXJsb2FkaW5nXG4gICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAvKiBTdXBwb3J0IGlzIGluY2x1ZGVkIGZvciBqUXVlcnkncyBhcmd1bWVudCBvdmVybG9hZGluZzogJC5hbmltYXRlKHByb3BlcnR5TWFwIFssIGR1cmF0aW9uXSBbLCBlYXNpbmddIFssIGNvbXBsZXRlXSkuXG4gICAgICAgICAgIE92ZXJsb2FkaW5nIGlzIGRldGVjdGVkIGJ5IGNoZWNraW5nIGZvciB0aGUgYWJzZW5jZSBvZiBhbiBvYmplY3QgYmVpbmcgcGFzc2VkIGludG8gb3B0aW9ucy4gKi9cbiAgICAgICAgLyogTm90ZTogVGhlIHN0b3AgYW5kIGZpbmlzaCBhY3Rpb25zIGRvIG5vdCBhY2NlcHQgYW5pbWF0aW9uIG9wdGlvbnMsIGFuZCBhcmUgdGhlcmVmb3JlIGV4Y2x1ZGVkIGZyb20gdGhpcyBjaGVjay4gKi9cbiAgICAgICAgaWYgKCEvXihzdG9wfGZpbmlzaHxmaW5pc2hBbGwpJC9pLnRlc3QocHJvcGVydGllc01hcCkgJiYgISQuaXNQbGFpbk9iamVjdChvcHRpb25zKSkge1xuICAgICAgICAgICAgLyogVGhlIHV0aWxpdHkgZnVuY3Rpb24gc2hpZnRzIGFsbCBhcmd1bWVudHMgb25lIHBvc2l0aW9uIHRvIHRoZSByaWdodCwgc28gd2UgYWRqdXN0IGZvciB0aGF0IG9mZnNldC4gKi9cbiAgICAgICAgICAgIHZhciBzdGFydGluZ0FyZ3VtZW50UG9zaXRpb24gPSBhcmd1bWVudEluZGV4ICsgMTtcblxuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuXG4gICAgICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggYWxsIG9wdGlvbnMgYXJndW1lbnRzICovXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gc3RhcnRpbmdBcmd1bWVudFBvc2l0aW9uOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgLyogVHJlYXQgYSBudW1iZXIgYXMgYSBkdXJhdGlvbi4gUGFyc2UgaXQgb3V0LiAqL1xuICAgICAgICAgICAgICAgIC8qIE5vdGU6IFRoZSBmb2xsb3dpbmcgUmVnRXggd2lsbCByZXR1cm4gdHJ1ZSBpZiBwYXNzZWQgYW4gYXJyYXkgd2l0aCBhIG51bWJlciBhcyBpdHMgZmlyc3QgaXRlbS5cbiAgICAgICAgICAgICAgICAgICBUaHVzLCBhcnJheXMgYXJlIHNraXBwZWQgZnJvbSB0aGlzIGNoZWNrLiAqL1xuICAgICAgICAgICAgICAgIGlmICghVHlwZS5pc0FycmF5KGFyZ3VtZW50c1tpXSkgJiYgKC9eKGZhc3R8bm9ybWFsfHNsb3cpJC9pLnRlc3QoYXJndW1lbnRzW2ldKSB8fCAvXlxcZC8udGVzdChhcmd1bWVudHNbaV0pKSkge1xuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmR1cmF0aW9uID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgIC8qIFRyZWF0IHN0cmluZ3MgYW5kIGFycmF5cyBhcyBlYXNpbmdzLiAqL1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoVHlwZS5pc1N0cmluZyhhcmd1bWVudHNbaV0pIHx8IFR5cGUuaXNBcnJheShhcmd1bWVudHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZWFzaW5nID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgIC8qIFRyZWF0IGEgZnVuY3Rpb24gYXMgYSBjb21wbGV0ZSBjYWxsYmFjay4gKi9cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFR5cGUuaXNGdW5jdGlvbihhcmd1bWVudHNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuY29tcGxldGUgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqKioqKioqKioqKioqKlxuICAgICAgICAgICAgUHJvbWlzZXNcbiAgICAgICAgKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIHZhciBwcm9taXNlRGF0YSA9IHtcbiAgICAgICAgICAgICAgICBwcm9taXNlOiBudWxsLFxuICAgICAgICAgICAgICAgIHJlc29sdmVyOiBudWxsLFxuICAgICAgICAgICAgICAgIHJlamVjdGVyOiBudWxsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIC8qIElmIHRoaXMgY2FsbCB3YXMgbWFkZSB2aWEgdGhlIHV0aWxpdHkgZnVuY3Rpb24gKHdoaWNoIGlzIHRoZSBkZWZhdWx0IG1ldGhvZCBvZiBpbnZvY2F0aW9uIHdoZW4galF1ZXJ5L1plcHRvIGFyZSBub3QgYmVpbmcgdXNlZCksIGFuZCBpZlxuICAgICAgICAgICBwcm9taXNlIHN1cHBvcnQgd2FzIGRldGVjdGVkLCBjcmVhdGUgYSBwcm9taXNlIG9iamVjdCBmb3IgdGhpcyBjYWxsIGFuZCBzdG9yZSByZWZlcmVuY2VzIHRvIGl0cyByZXNvbHZlciBhbmQgcmVqZWN0ZXIgbWV0aG9kcy4gVGhlIHJlc29sdmVcbiAgICAgICAgICAgbWV0aG9kIGlzIHVzZWQgd2hlbiBhIGNhbGwgY29tcGxldGVzIG5hdHVyYWxseSBvciBpcyBwcmVtYXR1cmVseSBzdG9wcGVkIGJ5IHRoZSB1c2VyLiBJbiBib3RoIGNhc2VzLCBjb21wbGV0ZUNhbGwoKSBoYW5kbGVzIHRoZSBhc3NvY2lhdGVkXG4gICAgICAgICAgIGNhbGwgY2xlYW51cCBhbmQgcHJvbWlzZSByZXNvbHZpbmcgbG9naWMuIFRoZSByZWplY3QgbWV0aG9kIGlzIHVzZWQgd2hlbiBhbiBpbnZhbGlkIHNldCBvZiBhcmd1bWVudHMgaXMgcGFzc2VkIGludG8gYSBWZWxvY2l0eSBjYWxsLiAqL1xuICAgICAgICAvKiBOb3RlOiBWZWxvY2l0eSBlbXBsb3lzIGEgY2FsbC1iYXNlZCBxdWV1ZWluZyBhcmNoaXRlY3R1cmUsIHdoaWNoIG1lYW5zIHRoYXQgc3RvcHBpbmcgYW4gYW5pbWF0aW5nIGVsZW1lbnQgYWN0dWFsbHkgc3RvcHMgdGhlIGZ1bGwgY2FsbCB0aGF0XG4gICAgICAgICAgIHRyaWdnZXJlZCBpdCAtLSBub3QgdGhhdCBvbmUgZWxlbWVudCBleGNsdXNpdmVseS4gU2ltaWxhcmx5LCB0aGVyZSBpcyBvbmUgcHJvbWlzZSBwZXIgY2FsbCwgYW5kIGFsbCBlbGVtZW50cyB0YXJnZXRlZCBieSBhIFZlbG9jaXR5IGNhbGwgYXJlXG4gICAgICAgICAgIGdyb3VwZWQgdG9nZXRoZXIgZm9yIHRoZSBwdXJwb3NlcyBvZiByZXNvbHZpbmcgYW5kIHJlamVjdGluZyBhIHByb21pc2UuICovXG4gICAgICAgIGlmIChpc1V0aWxpdHkgJiYgVmVsb2NpdHkuUHJvbWlzZSkge1xuICAgICAgICAgICAgcHJvbWlzZURhdGEucHJvbWlzZSA9IG5ldyBWZWxvY2l0eS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgICAgICBwcm9taXNlRGF0YS5yZXNvbHZlciA9IHJlc29sdmU7XG4gICAgICAgICAgICAgICAgcHJvbWlzZURhdGEucmVqZWN0ZXIgPSByZWplY3Q7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgQWN0aW9uIERldGVjdGlvblxuICAgICAgICAqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgLyogVmVsb2NpdHkncyBiZWhhdmlvciBpcyBjYXRlZ29yaXplZCBpbnRvIFwiYWN0aW9uc1wiOiBFbGVtZW50cyBjYW4gZWl0aGVyIGJlIHNwZWNpYWxseSBzY3JvbGxlZCBpbnRvIHZpZXcsXG4gICAgICAgICAgIG9yIHRoZXkgY2FuIGJlIHN0YXJ0ZWQsIHN0b3BwZWQsIG9yIHJldmVyc2VkLiBJZiBhIGxpdGVyYWwgb3IgcmVmZXJlbmNlZCBwcm9wZXJ0aWVzIG1hcCBpcyBwYXNzZWQgaW4gYXMgVmVsb2NpdHknc1xuICAgICAgICAgICBmaXJzdCBhcmd1bWVudCwgdGhlIGFzc29jaWF0ZWQgYWN0aW9uIGlzIFwic3RhcnRcIi4gQWx0ZXJuYXRpdmVseSwgXCJzY3JvbGxcIiwgXCJyZXZlcnNlXCIsIG9yIFwic3RvcFwiIGNhbiBiZSBwYXNzZWQgaW4gaW5zdGVhZCBvZiBhIHByb3BlcnRpZXMgbWFwLiAqL1xuICAgICAgICB2YXIgYWN0aW9uO1xuXG4gICAgICAgIHN3aXRjaCAocHJvcGVydGllc01hcCkge1xuICAgICAgICAgICAgY2FzZSBcInNjcm9sbFwiOlxuICAgICAgICAgICAgICAgIGFjdGlvbiA9IFwic2Nyb2xsXCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgXCJyZXZlcnNlXCI6XG4gICAgICAgICAgICAgICAgYWN0aW9uID0gXCJyZXZlcnNlXCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgXCJmaW5pc2hcIjpcbiAgICAgICAgICAgIGNhc2UgXCJmaW5pc2hBbGxcIjpcbiAgICAgICAgICAgIGNhc2UgXCJzdG9wXCI6XG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgQWN0aW9uOiBTdG9wXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIC8qIENsZWFyIHRoZSBjdXJyZW50bHktYWN0aXZlIGRlbGF5IG9uIGVhY2ggdGFyZ2V0ZWQgZWxlbWVudC4gKi9cbiAgICAgICAgICAgICAgICAkLmVhY2goZWxlbWVudHMsIGZ1bmN0aW9uKGksIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKERhdGEoZWxlbWVudCkgJiYgRGF0YShlbGVtZW50KS5kZWxheVRpbWVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBTdG9wIHRoZSB0aW1lciBmcm9tIHRyaWdnZXJpbmcgaXRzIGNhY2hlZCBuZXh0KCkgZnVuY3Rpb24uICovXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoRGF0YShlbGVtZW50KS5kZWxheVRpbWVyLnNldFRpbWVvdXQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBNYW51YWxseSBjYWxsIHRoZSBuZXh0KCkgZnVuY3Rpb24gc28gdGhhdCB0aGUgc3Vic2VxdWVudCBxdWV1ZSBpdGVtcyBjYW4gcHJvZ3Jlc3MuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoRGF0YShlbGVtZW50KS5kZWxheVRpbWVyLm5leHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLmRlbGF5VGltZXIubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgRGF0YShlbGVtZW50KS5kZWxheVRpbWVyO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogSWYgd2Ugd2FudCB0byBmaW5pc2ggZXZlcnl0aGluZyBpbiB0aGUgcXVldWUsIHdlIGhhdmUgdG8gaXRlcmF0ZSB0aHJvdWdoIGl0XG4gICAgICAgICAgICAgICAgICAgICAgIGFuZCBjYWxsIGVhY2ggZnVuY3Rpb24uIFRoaXMgd2lsbCBtYWtlIHRoZW0gYWN0aXZlIGNhbGxzIGJlbG93LCB3aGljaCB3aWxsXG4gICAgICAgICAgICAgICAgICAgICAgIGNhdXNlIHRoZW0gdG8gYmUgYXBwbGllZCB2aWEgdGhlIGR1cmF0aW9uIHNldHRpbmcuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzTWFwID09PSBcImZpbmlzaEFsbFwiICYmIChvcHRpb25zID09PSB0cnVlIHx8IFR5cGUuaXNTdHJpbmcob3B0aW9ucykpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggdGhlIGl0ZW1zIGluIHRoZSBlbGVtZW50J3MgcXVldWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goJC5xdWV1ZShlbGVtZW50LCBUeXBlLmlzU3RyaW5nKG9wdGlvbnMpID8gb3B0aW9ucyA6IFwiXCIpLCBmdW5jdGlvbihfLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVGhlIHF1ZXVlIGFycmF5IGNhbiBjb250YWluIGFuIFwiaW5wcm9ncmVzc1wiIHN0cmluZywgd2hpY2ggd2Ugc2tpcC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVHlwZS5pc0Z1bmN0aW9uKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0oKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2xlYXJpbmcgdGhlICQucXVldWUoKSBhcnJheSBpcyBhY2hpZXZlZCBieSByZXNldHRpbmcgaXQgdG8gW10uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAkLnF1ZXVlKGVsZW1lbnQsIFR5cGUuaXNTdHJpbmcob3B0aW9ucykgPyBvcHRpb25zIDogXCJcIiwgW10pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgY2FsbHNUb1N0b3AgPSBbXTtcblxuICAgICAgICAgICAgICAgIC8qIFdoZW4gdGhlIHN0b3AgYWN0aW9uIGlzIHRyaWdnZXJlZCwgdGhlIGVsZW1lbnRzJyBjdXJyZW50bHkgYWN0aXZlIGNhbGwgaXMgaW1tZWRpYXRlbHkgc3RvcHBlZC4gVGhlIGFjdGl2ZSBjYWxsIG1pZ2h0IGhhdmVcbiAgICAgICAgICAgICAgICAgICBiZWVuIGFwcGxpZWQgdG8gbXVsdGlwbGUgZWxlbWVudHMsIGluIHdoaWNoIGNhc2UgYWxsIG9mIHRoZSBjYWxsJ3MgZWxlbWVudHMgd2lsbCBiZSBzdG9wcGVkLiBXaGVuIGFuIGVsZW1lbnRcbiAgICAgICAgICAgICAgICAgICBpcyBzdG9wcGVkLCB0aGUgbmV4dCBpdGVtIGluIGl0cyBhbmltYXRpb24gcXVldWUgaXMgaW1tZWRpYXRlbHkgdHJpZ2dlcmVkLiAqL1xuICAgICAgICAgICAgICAgIC8qIEFuIGFkZGl0aW9uYWwgYXJndW1lbnQgbWF5IGJlIHBhc3NlZCBpbiB0byBjbGVhciBhbiBlbGVtZW50J3MgcmVtYWluaW5nIHF1ZXVlZCBjYWxscy4gRWl0aGVyIHRydWUgKHdoaWNoIGRlZmF1bHRzIHRvIHRoZSBcImZ4XCIgcXVldWUpXG4gICAgICAgICAgICAgICAgICAgb3IgYSBjdXN0b20gcXVldWUgc3RyaW5nIGNhbiBiZSBwYXNzZWQgaW4uICovXG4gICAgICAgICAgICAgICAgLyogTm90ZTogVGhlIHN0b3AgY29tbWFuZCBydW5zIHByaW9yIHRvIFZlbG9jaXR5J3MgUXVldWVpbmcgcGhhc2Ugc2luY2UgaXRzIGJlaGF2aW9yIGlzIGludGVuZGVkIHRvIHRha2UgZWZmZWN0ICppbW1lZGlhdGVseSosXG4gICAgICAgICAgICAgICAgICAgcmVnYXJkbGVzcyBvZiB0aGUgZWxlbWVudCdzIGN1cnJlbnQgcXVldWUgc3RhdGUuICovXG5cbiAgICAgICAgICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggZXZlcnkgYWN0aXZlIGNhbGwuICovXG4gICAgICAgICAgICAgICAgJC5lYWNoKFZlbG9jaXR5LlN0YXRlLmNhbGxzLCBmdW5jdGlvbihpLCBhY3RpdmVDYWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIEluYWN0aXZlIGNhbGxzIGFyZSBzZXQgdG8gZmFsc2UgYnkgdGhlIGxvZ2ljIGluc2lkZSBjb21wbGV0ZUNhbGwoKS4gU2tpcCB0aGVtLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQ2FsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogSXRlcmF0ZSB0aHJvdWdoIHRoZSBhY3RpdmUgY2FsbCdzIHRhcmdldGVkIGVsZW1lbnRzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGFjdGl2ZUNhbGxbMV0sIGZ1bmN0aW9uKGssIGFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0cnVlIHdhcyBwYXNzZWQgaW4gYXMgYSBzZWNvbmRhcnkgYXJndW1lbnQsIGNsZWFyIGFic29sdXRlbHkgYWxsIGNhbGxzIG9uIHRoaXMgZWxlbWVudC4gT3RoZXJ3aXNlLCBvbmx5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXIgY2FsbHMgYXNzb2NpYXRlZCB3aXRoIHRoZSByZWxldmFudCBxdWV1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDYWxsIHN0b3BwaW5nIGxvZ2ljIHdvcmtzIGFzIGZvbGxvd3M6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBvcHRpb25zID09PSB0cnVlIC0tPiBzdG9wIGN1cnJlbnQgZGVmYXVsdCBxdWV1ZSBjYWxscyAoYW5kIHF1ZXVlOmZhbHNlIGNhbGxzKSwgaW5jbHVkaW5nIHJlbWFpbmluZyBxdWV1ZWQgb25lcy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIG9wdGlvbnMgPT09IHVuZGVmaW5lZCAtLT4gc3RvcCBjdXJyZW50IHF1ZXVlOlwiXCIgY2FsbCBhbmQgYWxsIHF1ZXVlOmZhbHNlIGNhbGxzLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gb3B0aW9ucyA9PT0gZmFsc2UgLS0+IHN0b3Agb25seSBxdWV1ZTpmYWxzZSBjYWxscy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIG9wdGlvbnMgPT09IFwiY3VzdG9tXCIgLS0+IHN0b3AgY3VycmVudCBxdWV1ZTpcImN1c3RvbVwiIGNhbGwsIGluY2x1ZGluZyByZW1haW5pbmcgcXVldWVkIG9uZXMgKHRoZXJlIGlzIG5vIGZ1bmN0aW9uYWxpdHkgdG8gb25seSBjbGVhciB0aGUgY3VycmVudGx5LXJ1bm5pbmcgcXVldWU6XCJjdXN0b21cIiBjYWxsKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcXVldWVOYW1lID0gKG9wdGlvbnMgPT09IHVuZGVmaW5lZCkgPyBcIlwiIDogb3B0aW9ucztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxdWV1ZU5hbWUgIT09IHRydWUgJiYgKGFjdGl2ZUNhbGxbMl0ucXVldWUgIT09IHF1ZXVlTmFtZSkgJiYgIShvcHRpb25zID09PSB1bmRlZmluZWQgJiYgYWN0aXZlQ2FsbFsyXS5xdWV1ZSA9PT0gZmFsc2UpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCB0aGUgY2FsbHMgdGFyZ2V0ZWQgYnkgdGhlIHN0b3AgY29tbWFuZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goZWxlbWVudHMsIGZ1bmN0aW9uKGwsIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2hlY2sgdGhhdCB0aGlzIGNhbGwgd2FzIGFwcGxpZWQgdG8gdGhlIHRhcmdldCBlbGVtZW50LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCA9PT0gYWN0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogT3B0aW9uYWxseSBjbGVhciB0aGUgcmVtYWluaW5nIHF1ZXVlZCBjYWxscy4gSWYgd2UncmUgZG9pbmcgXCJmaW5pc2hBbGxcIiB0aGlzIHdvbid0IGZpbmQgYW55dGhpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdWUgdG8gdGhlIHF1ZXVlLWNsZWFyaW5nIGFib3ZlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgPT09IHRydWUgfHwgVHlwZS5pc1N0cmluZyhvcHRpb25zKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCB0aGUgaXRlbXMgaW4gdGhlIGVsZW1lbnQncyBxdWV1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goJC5xdWV1ZShlbGVtZW50LCBUeXBlLmlzU3RyaW5nKG9wdGlvbnMpID8gb3B0aW9ucyA6IFwiXCIpLCBmdW5jdGlvbihfLCBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSBxdWV1ZSBhcnJheSBjYW4gY29udGFpbiBhbiBcImlucHJvZ3Jlc3NcIiBzdHJpbmcsIHdoaWNoIHdlIHNraXAuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUeXBlLmlzRnVuY3Rpb24oaXRlbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFBhc3MgdGhlIGl0ZW0ncyBjYWxsYmFjayBhIGZsYWcgaW5kaWNhdGluZyB0aGF0IHdlIHdhbnQgdG8gYWJvcnQgZnJvbSB0aGUgcXVldWUgY2FsbC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChTcGVjaWZpY2FsbHksIHRoZSBxdWV1ZSB3aWxsIHJlc29sdmUgdGhlIGNhbGwncyBhc3NvY2lhdGVkIHByb21pc2UgdGhlbiBhYm9ydC4pICAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbShudWxsLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2xlYXJpbmcgdGhlICQucXVldWUoKSBhcnJheSBpcyBhY2hpZXZlZCBieSByZXNldHRpbmcgaXQgdG8gW10uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5xdWV1ZShlbGVtZW50LCBUeXBlLmlzU3RyaW5nKG9wdGlvbnMpID8gb3B0aW9ucyA6IFwiXCIsIFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXNNYXAgPT09IFwic3RvcFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU2luY2UgXCJyZXZlcnNlXCIgdXNlcyBjYWNoZWQgc3RhcnQgdmFsdWVzICh0aGUgcHJldmlvdXMgY2FsbCdzIGVuZFZhbHVlcyksIHRoZXNlIHZhbHVlcyBtdXN0IGJlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZCB0byByZWZsZWN0IHRoZSBmaW5hbCB2YWx1ZSB0aGF0IHRoZSBlbGVtZW50cyB3ZXJlIGFjdHVhbGx5IHR3ZWVuZWQgdG8uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogSWYgb25seSBxdWV1ZTpmYWxzZSBhbmltYXRpb25zIGFyZSBjdXJyZW50bHkgcnVubmluZyBvbiBhbiBlbGVtZW50LCBpdCB3b24ndCBoYXZlIGEgdHdlZW5zQ29udGFpbmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0LiBBbHNvLCBxdWV1ZTpmYWxzZSBhbmltYXRpb25zIGNhbid0IGJlIHJldmVyc2VkLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChEYXRhKGVsZW1lbnQpICYmIERhdGEoZWxlbWVudCkudHdlZW5zQ29udGFpbmVyICYmIHF1ZXVlTmFtZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKERhdGEoZWxlbWVudCkudHdlZW5zQ29udGFpbmVyLCBmdW5jdGlvbihtLCBhY3RpdmVUd2Vlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlVHdlZW4uZW5kVmFsdWUgPSBhY3RpdmVUd2Vlbi5jdXJyZW50VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxzVG9TdG9wLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHByb3BlcnRpZXNNYXAgPT09IFwiZmluaXNoXCIgfHwgcHJvcGVydGllc01hcCA9PT0gXCJmaW5pc2hBbGxcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRvIGdldCBhY3RpdmUgdHdlZW5zIHRvIGZpbmlzaCBpbW1lZGlhdGVseSwgd2UgZm9yY2VmdWxseSBzaG9ydGVuIHRoZWlyIGR1cmF0aW9ucyB0byAxbXMgc28gdGhhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZXkgZmluaXNoIHVwb24gdGhlIG5leHQgckFmIHRpY2sgdGhlbiBwcm9jZWVkIHdpdGggbm9ybWFsIGNhbGwgY29tcGxldGlvbiBsb2dpYy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVDYWxsWzJdLmR1cmF0aW9uID0gMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8qIFByZW1hdHVyZWx5IGNhbGwgY29tcGxldGVDYWxsKCkgb24gZWFjaCBtYXRjaGVkIGFjdGl2ZSBjYWxsLiBQYXNzIGFuIGFkZGl0aW9uYWwgZmxhZyBmb3IgXCJzdG9wXCIgdG8gaW5kaWNhdGVcbiAgICAgICAgICAgICAgICAgICB0aGF0IHRoZSBjb21wbGV0ZSBjYWxsYmFjayBhbmQgZGlzcGxheTpub25lIHNldHRpbmcgc2hvdWxkIGJlIHNraXBwZWQgc2luY2Ugd2UncmUgY29tcGxldGluZyBwcmVtYXR1cmVseS4gKi9cbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllc01hcCA9PT0gXCJzdG9wXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGNhbGxzVG9TdG9wLCBmdW5jdGlvbihpLCBqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZUNhbGwoaiwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlRGF0YS5wcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJbW1lZGlhdGVseSByZXNvbHZlIHRoZSBwcm9taXNlIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHN0b3AgY2FsbCBzaW5jZSBzdG9wIHJ1bnMgc3luY2hyb25vdXNseS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VEYXRhLnJlc29sdmVyKGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qIFNpbmNlIHdlJ3JlIHN0b3BwaW5nLCBhbmQgbm90IHByb2NlZWRpbmcgd2l0aCBxdWV1ZWluZywgZXhpdCBvdXQgb2YgVmVsb2NpdHkuICovXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldENoYWluKCk7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgLyogVHJlYXQgYSBub24tZW1wdHkgcGxhaW4gb2JqZWN0IGFzIGEgbGl0ZXJhbCBwcm9wZXJ0aWVzIG1hcC4gKi9cbiAgICAgICAgICAgICAgICBpZiAoJC5pc1BsYWluT2JqZWN0KHByb3BlcnRpZXNNYXApICYmICFUeXBlLmlzRW1wdHlPYmplY3QocHJvcGVydGllc01hcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uID0gXCJzdGFydFwiO1xuXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgUmVkaXJlY3RzXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIC8qIENoZWNrIGlmIGEgc3RyaW5nIG1hdGNoZXMgYSByZWdpc3RlcmVkIHJlZGlyZWN0IChzZWUgUmVkaXJlY3RzIGFib3ZlKS4gKi9cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFR5cGUuaXNTdHJpbmcocHJvcGVydGllc01hcCkgJiYgVmVsb2NpdHkuUmVkaXJlY3RzW3Byb3BlcnRpZXNNYXBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcHRzID0gJC5leHRlbmQoe30sIG9wdGlvbnMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb25PcmlnaW5hbCA9IG9wdHMuZHVyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxheU9yaWdpbmFsID0gb3B0cy5kZWxheSB8fCAwO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBiYWNrd2FyZHMgb3B0aW9uIHdhcyBwYXNzZWQgaW4sIHJldmVyc2UgdGhlIGVsZW1lbnQgc2V0IHNvIHRoYXQgZWxlbWVudHMgYW5pbWF0ZSBmcm9tIHRoZSBsYXN0IHRvIHRoZSBmaXJzdC4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuYmFja3dhcmRzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50cyA9ICQuZXh0ZW5kKHRydWUsIFtdLCBlbGVtZW50cykucmV2ZXJzZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogSW5kaXZpZHVhbGx5IHRyaWdnZXIgdGhlIHJlZGlyZWN0IGZvciBlYWNoIGVsZW1lbnQgaW4gdGhlIHNldCB0byBwcmV2ZW50IHVzZXJzIGZyb20gaGF2aW5nIHRvIGhhbmRsZSBpdGVyYXRpb24gbG9naWMgaW4gdGhlaXIgcmVkaXJlY3QuICovXG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChlbGVtZW50cywgZnVuY3Rpb24oZWxlbWVudEluZGV4LCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgc3RhZ2dlciBvcHRpb24gd2FzIHBhc3NlZCBpbiwgc3VjY2Vzc2l2ZWx5IGRlbGF5IGVhY2ggZWxlbWVudCBieSB0aGUgc3RhZ2dlciB2YWx1ZSAoaW4gbXMpLiBSZXRhaW4gdGhlIG9yaWdpbmFsIGRlbGF5IHZhbHVlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlRmxvYXQob3B0cy5zdGFnZ2VyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuZGVsYXkgPSBkZWxheU9yaWdpbmFsICsgKHBhcnNlRmxvYXQob3B0cy5zdGFnZ2VyKSAqIGVsZW1lbnRJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFR5cGUuaXNGdW5jdGlvbihvcHRzLnN0YWdnZXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5kZWxheSA9IGRlbGF5T3JpZ2luYWwgKyBvcHRzLnN0YWdnZXIuY2FsbChlbGVtZW50LCBlbGVtZW50SW5kZXgsIGVsZW1lbnRzTGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGRyYWcgb3B0aW9uIHdhcyBwYXNzZWQgaW4sIHN1Y2Nlc3NpdmVseSBpbmNyZWFzZS9kZWNyZWFzZSAoZGVwZW5kaW5nIG9uIHRoZSBwcmVzZW5zZSBvZiBvcHRzLmJhY2t3YXJkcylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBkdXJhdGlvbiBvZiBlYWNoIGVsZW1lbnQncyBhbmltYXRpb24sIHVzaW5nIGZsb29ycyB0byBwcmV2ZW50IHByb2R1Y2luZyB2ZXJ5IHNob3J0IGR1cmF0aW9ucy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLmRyYWcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBEZWZhdWx0IHRoZSBkdXJhdGlvbiBvZiBVSSBwYWNrIGVmZmVjdHMgKGNhbGxvdXRzIGFuZCB0cmFuc2l0aW9ucykgdG8gMTAwMG1zIGluc3RlYWQgb2YgdGhlIHVzdWFsIGRlZmF1bHQgZHVyYXRpb24gb2YgNDAwbXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5kdXJhdGlvbiA9IHBhcnNlRmxvYXQoZHVyYXRpb25PcmlnaW5hbCkgfHwgKC9eKGNhbGxvdXR8dHJhbnNpdGlvbikvLnRlc3QocHJvcGVydGllc01hcCkgPyAxMDAwIDogRFVSQVRJT05fREVGQVVMVCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBGb3IgZWFjaCBlbGVtZW50LCB0YWtlIHRoZSBncmVhdGVyIGR1cmF0aW9uIG9mOiBBKSBhbmltYXRpb24gY29tcGxldGlvbiBwZXJjZW50YWdlIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW5hbCBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBCKSA3NSUgb2YgdGhlIG9yaWdpbmFsIGR1cmF0aW9uLCBvciBDKSBhIDIwMG1zIGZhbGxiYWNrIChpbiBjYXNlIGR1cmF0aW9uIGlzIGFscmVhZHkgc2V0IHRvIGEgbG93IHZhbHVlKS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgZW5kIHJlc3VsdCBpcyBhIGJhc2VsaW5lIG9mIDc1JSBvZiB0aGUgcmVkaXJlY3QncyBkdXJhdGlvbiB0aGF0IGluY3JlYXNlcy9kZWNyZWFzZXMgYXMgdGhlIGVuZCBvZiB0aGUgZWxlbWVudCBzZXQgaXMgYXBwcm9hY2hlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmR1cmF0aW9uID0gTWF0aC5tYXgob3B0cy5kdXJhdGlvbiAqIChvcHRzLmJhY2t3YXJkcyA/IDEgLSBlbGVtZW50SW5kZXgvZWxlbWVudHNMZW5ndGggOiAoZWxlbWVudEluZGV4ICsgMSkgLyBlbGVtZW50c0xlbmd0aCksIG9wdHMuZHVyYXRpb24gKiAwLjc1LCAyMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBQYXNzIGluIHRoZSBjYWxsJ3Mgb3B0cyBvYmplY3Qgc28gdGhhdCB0aGUgcmVkaXJlY3QgY2FuIG9wdGlvbmFsbHkgZXh0ZW5kIGl0LiBJdCBkZWZhdWx0cyB0byBhbiBlbXB0eSBvYmplY3QgaW5zdGVhZCBvZiBudWxsIHRvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZWR1Y2UgdGhlIG9wdHMgY2hlY2tpbmcgbG9naWMgcmVxdWlyZWQgaW5zaWRlIHRoZSByZWRpcmVjdC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LlJlZGlyZWN0c1twcm9wZXJ0aWVzTWFwXS5jYWxsKGVsZW1lbnQsIGVsZW1lbnQsIG9wdHMgfHwge30sIGVsZW1lbnRJbmRleCwgZWxlbWVudHNMZW5ndGgsIGVsZW1lbnRzLCBwcm9taXNlRGF0YS5wcm9taXNlID8gcHJvbWlzZURhdGEgOiB1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBTaW5jZSB0aGUgYW5pbWF0aW9uIGxvZ2ljIHJlc2lkZXMgd2l0aGluIHRoZSByZWRpcmVjdCdzIG93biBjb2RlLCBhYm9ydCB0aGUgcmVtYWluZGVyIG9mIHRoaXMgY2FsbC5cbiAgICAgICAgICAgICAgICAgICAgICAgKFRoZSBwZXJmb3JtYW5jZSBvdmVyaGVhZCB1cCB0byB0aGlzIHBvaW50IGlzIHZpcnR1YWxseSBub24tZXhpc3RhbnQuKSAqL1xuICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBUaGUgalF1ZXJ5IGNhbGwgY2hhaW4gaXMga2VwdCBpbnRhY3QgYnkgcmV0dXJuaW5nIHRoZSBjb21wbGV0ZSBlbGVtZW50IHNldC4gKi9cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldENoYWluKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFib3J0RXJyb3IgPSBcIlZlbG9jaXR5OiBGaXJzdCBhcmd1bWVudCAoXCIgKyBwcm9wZXJ0aWVzTWFwICsgXCIpIHdhcyBub3QgYSBwcm9wZXJ0eSBtYXAsIGEga25vd24gYWN0aW9uLCBvciBhIHJlZ2lzdGVyZWQgcmVkaXJlY3QuIEFib3J0aW5nLlwiO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlRGF0YS5wcm9taXNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlRGF0YS5yZWplY3RlcihuZXcgRXJyb3IoYWJvcnRFcnJvcikpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYWJvcnRFcnJvcik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0Q2hhaW4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgIENhbGwtV2lkZSBWYXJpYWJsZXNcbiAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgLyogQSBjb250YWluZXIgZm9yIENTUyB1bml0IGNvbnZlcnNpb24gcmF0aW9zIChlLmcuICUsIHJlbSwgYW5kIGVtID09PiBweCkgdGhhdCBpcyB1c2VkIHRvIGNhY2hlIHJhdGlvcyBhY3Jvc3MgYWxsIGVsZW1lbnRzXG4gICAgICAgICAgIGJlaW5nIGFuaW1hdGVkIGluIGEgc2luZ2xlIFZlbG9jaXR5IGNhbGwuIENhbGN1bGF0aW5nIHVuaXQgcmF0aW9zIG5lY2Vzc2l0YXRlcyBET00gcXVlcnlpbmcgYW5kIHVwZGF0aW5nLCBhbmQgaXMgdGhlcmVmb3JlXG4gICAgICAgICAgIGF2b2lkZWQgKHZpYSBjYWNoaW5nKSB3aGVyZXZlciBwb3NzaWJsZS4gVGhpcyBjb250YWluZXIgaXMgY2FsbC13aWRlIGluc3RlYWQgb2YgcGFnZS13aWRlIHRvIGF2b2lkIHRoZSByaXNrIG9mIHVzaW5nIHN0YWxlXG4gICAgICAgICAgIGNvbnZlcnNpb24gbWV0cmljcyBhY3Jvc3MgVmVsb2NpdHkgYW5pbWF0aW9ucyB0aGF0IGFyZSBub3QgaW1tZWRpYXRlbHkgY29uc2VjdXRpdmVseSBjaGFpbmVkLiAqL1xuICAgICAgICB2YXIgY2FsbFVuaXRDb252ZXJzaW9uRGF0YSA9IHtcbiAgICAgICAgICAgICAgICBsYXN0UGFyZW50OiBudWxsLFxuICAgICAgICAgICAgICAgIGxhc3RQb3NpdGlvbjogbnVsbCxcbiAgICAgICAgICAgICAgICBsYXN0Rm9udFNpemU6IG51bGwsXG4gICAgICAgICAgICAgICAgbGFzdFBlcmNlbnRUb1B4V2lkdGg6IG51bGwsXG4gICAgICAgICAgICAgICAgbGFzdFBlcmNlbnRUb1B4SGVpZ2h0OiBudWxsLFxuICAgICAgICAgICAgICAgIGxhc3RFbVRvUHg6IG51bGwsXG4gICAgICAgICAgICAgICAgcmVtVG9QeDogbnVsbCxcbiAgICAgICAgICAgICAgICB2d1RvUHg6IG51bGwsXG4gICAgICAgICAgICAgICAgdmhUb1B4OiBudWxsXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIC8qIEEgY29udGFpbmVyIGZvciBhbGwgdGhlIGVuc3VpbmcgdHdlZW4gZGF0YSBhbmQgbWV0YWRhdGEgYXNzb2NpYXRlZCB3aXRoIHRoaXMgY2FsbC4gVGhpcyBjb250YWluZXIgZ2V0cyBwdXNoZWQgdG8gdGhlIHBhZ2Utd2lkZVxuICAgICAgICAgICBWZWxvY2l0eS5TdGF0ZS5jYWxscyBhcnJheSB0aGF0IGlzIHByb2Nlc3NlZCBkdXJpbmcgYW5pbWF0aW9uIHRpY2tpbmcuICovXG4gICAgICAgIHZhciBjYWxsID0gW107XG5cbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICBFbGVtZW50IFByb2Nlc3NpbmdcbiAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIC8qIEVsZW1lbnQgcHJvY2Vzc2luZyBjb25zaXN0cyBvZiB0aHJlZSBwYXJ0cyAtLSBkYXRhIHByb2Nlc3NpbmcgdGhhdCBjYW5ub3QgZ28gc3RhbGUgYW5kIGRhdGEgcHJvY2Vzc2luZyB0aGF0ICpjYW4qIGdvIHN0YWxlIChpLmUuIHRoaXJkLXBhcnR5IHN0eWxlIG1vZGlmaWNhdGlvbnMpOlxuICAgICAgICAgICAxKSBQcmUtUXVldWVpbmc6IEVsZW1lbnQtd2lkZSB2YXJpYWJsZXMsIGluY2x1ZGluZyB0aGUgZWxlbWVudCdzIGRhdGEgc3RvcmFnZSwgYXJlIGluc3RhbnRpYXRlZC4gQ2FsbCBvcHRpb25zIGFyZSBwcmVwYXJlZC4gSWYgdHJpZ2dlcmVkLCB0aGUgU3RvcCBhY3Rpb24gaXMgZXhlY3V0ZWQuXG4gICAgICAgICAgIDIpIFF1ZXVlaW5nOiBUaGUgbG9naWMgdGhhdCBydW5zIG9uY2UgdGhpcyBjYWxsIGhhcyByZWFjaGVkIGl0cyBwb2ludCBvZiBleGVjdXRpb24gaW4gdGhlIGVsZW1lbnQncyAkLnF1ZXVlKCkgc3RhY2suIE1vc3QgbG9naWMgaXMgcGxhY2VkIGhlcmUgdG8gYXZvaWQgcmlza2luZyBpdCBiZWNvbWluZyBzdGFsZS5cbiAgICAgICAgICAgMykgUHVzaGluZzogQ29uc29saWRhdGlvbiBvZiB0aGUgdHdlZW4gZGF0YSBmb2xsb3dlZCBieSBpdHMgcHVzaCBvbnRvIHRoZSBnbG9iYWwgaW4tcHJvZ3Jlc3MgY2FsbHMgY29udGFpbmVyLlxuICAgICAgICAqL1xuXG4gICAgICAgIGZ1bmN0aW9uIHByb2Nlc3NFbGVtZW50ICgpIHtcblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgIFBhcnQgSTogUHJlLVF1ZXVlaW5nXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICBFbGVtZW50LVdpZGUgVmFyaWFibGVzXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gdGhpcyxcbiAgICAgICAgICAgICAgICAvKiBUaGUgcnVudGltZSBvcHRzIG9iamVjdCBpcyB0aGUgZXh0ZW5zaW9uIG9mIHRoZSBjdXJyZW50IGNhbGwncyBvcHRpb25zIGFuZCBWZWxvY2l0eSdzIHBhZ2Utd2lkZSBvcHRpb24gZGVmYXVsdHMuICovXG4gICAgICAgICAgICAgICAgb3B0cyA9ICQuZXh0ZW5kKHt9LCBWZWxvY2l0eS5kZWZhdWx0cywgb3B0aW9ucyksXG4gICAgICAgICAgICAgICAgLyogQSBjb250YWluZXIgZm9yIHRoZSBwcm9jZXNzZWQgZGF0YSBhc3NvY2lhdGVkIHdpdGggZWFjaCBwcm9wZXJ0eSBpbiB0aGUgcHJvcGVydHlNYXAuXG4gICAgICAgICAgICAgICAgICAgKEVhY2ggcHJvcGVydHkgaW4gdGhlIG1hcCBwcm9kdWNlcyBpdHMgb3duIFwidHdlZW5cIi4pICovXG4gICAgICAgICAgICAgICAgdHdlZW5zQ29udGFpbmVyID0ge30sXG4gICAgICAgICAgICAgICAgZWxlbWVudFVuaXRDb252ZXJzaW9uRGF0YTtcblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgRWxlbWVudCBJbml0XG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIGlmIChEYXRhKGVsZW1lbnQpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBWZWxvY2l0eS5pbml0KGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICBPcHRpb246IERlbGF5XG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIC8qIFNpbmNlIHF1ZXVlOmZhbHNlIGRvZXNuJ3QgcmVzcGVjdCB0aGUgaXRlbSdzIGV4aXN0aW5nIHF1ZXVlLCB3ZSBhdm9pZCBpbmplY3RpbmcgaXRzIGRlbGF5IGhlcmUgKGl0J3Mgc2V0IGxhdGVyIG9uKS4gKi9cbiAgICAgICAgICAgIC8qIE5vdGU6IFZlbG9jaXR5IHJvbGxzIGl0cyBvd24gZGVsYXkgZnVuY3Rpb24gc2luY2UgalF1ZXJ5IGRvZXNuJ3QgaGF2ZSBhIHV0aWxpdHkgYWxpYXMgZm9yICQuZm4uZGVsYXkoKVxuICAgICAgICAgICAgICAgKGFuZCB0aHVzIHJlcXVpcmVzIGpRdWVyeSBlbGVtZW50IGNyZWF0aW9uLCB3aGljaCB3ZSBhdm9pZCBzaW5jZSBpdHMgb3ZlcmhlYWQgaW5jbHVkZXMgRE9NIHF1ZXJ5aW5nKS4gKi9cbiAgICAgICAgICAgIGlmIChwYXJzZUZsb2F0KG9wdHMuZGVsYXkpICYmIG9wdHMucXVldWUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgJC5xdWV1ZShlbGVtZW50LCBvcHRzLnF1ZXVlLCBmdW5jdGlvbihuZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIFRoaXMgaXMgYSBmbGFnIHVzZWQgdG8gaW5kaWNhdGUgdG8gdGhlIHVwY29taW5nIGNvbXBsZXRlQ2FsbCgpIGZ1bmN0aW9uIHRoYXQgdGhpcyBxdWV1ZSBlbnRyeSB3YXMgaW5pdGlhdGVkIGJ5IFZlbG9jaXR5LiBTZWUgY29tcGxldGVDYWxsKCkgZm9yIGZ1cnRoZXIgZGV0YWlscy4gKi9cbiAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkudmVsb2NpdHlRdWV1ZUVudHJ5RmxhZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogVGhlIGVuc3VpbmcgcXVldWUgaXRlbSAod2hpY2ggaXMgYXNzaWduZWQgdG8gdGhlIFwibmV4dFwiIGFyZ3VtZW50IHRoYXQgJC5xdWV1ZSgpIGF1dG9tYXRpY2FsbHkgcGFzc2VzIGluKSB3aWxsIGJlIHRyaWdnZXJlZCBhZnRlciBhIHNldFRpbWVvdXQgZGVsYXkuXG4gICAgICAgICAgICAgICAgICAgICAgIFRoZSBzZXRUaW1lb3V0IGlzIHN0b3JlZCBzbyB0aGF0IGl0IGNhbiBiZSBzdWJqZWN0ZWQgdG8gY2xlYXJUaW1lb3V0KCkgaWYgdGhpcyBhbmltYXRpb24gaXMgcHJlbWF0dXJlbHkgc3RvcHBlZCB2aWEgVmVsb2NpdHkncyBcInN0b3BcIiBjb21tYW5kLiAqL1xuICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLmRlbGF5VGltZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0OiBzZXRUaW1lb3V0KG5leHQsIHBhcnNlRmxvYXQob3B0cy5kZWxheSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dDogbmV4dFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICBPcHRpb246IER1cmF0aW9uXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIC8qIFN1cHBvcnQgZm9yIGpRdWVyeSdzIG5hbWVkIGR1cmF0aW9ucy4gKi9cbiAgICAgICAgICAgIHN3aXRjaCAob3B0cy5kdXJhdGlvbi50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwiZmFzdFwiOlxuICAgICAgICAgICAgICAgICAgICBvcHRzLmR1cmF0aW9uID0gMjAwO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgXCJub3JtYWxcIjpcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5kdXJhdGlvbiA9IERVUkFUSU9OX0RFRkFVTFQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBcInNsb3dcIjpcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5kdXJhdGlvbiA9IDYwMDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAvKiBSZW1vdmUgdGhlIHBvdGVudGlhbCBcIm1zXCIgc3VmZml4IGFuZCBkZWZhdWx0IHRvIDEgaWYgdGhlIHVzZXIgaXMgYXR0ZW1wdGluZyB0byBzZXQgYSBkdXJhdGlvbiBvZiAwIChpbiBvcmRlciB0byBwcm9kdWNlIGFuIGltbWVkaWF0ZSBzdHlsZSBjaGFuZ2UpLiAqL1xuICAgICAgICAgICAgICAgICAgICBvcHRzLmR1cmF0aW9uID0gcGFyc2VGbG9hdChvcHRzLmR1cmF0aW9uKSB8fCAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICBHbG9iYWwgT3B0aW9uOiBNb2NrXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIGlmIChWZWxvY2l0eS5tb2NrICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIC8qIEluIG1vY2sgbW9kZSwgYWxsIGFuaW1hdGlvbnMgYXJlIGZvcmNlZCB0byAxbXMgc28gdGhhdCB0aGV5IG9jY3VyIGltbWVkaWF0ZWx5IHVwb24gdGhlIG5leHQgckFGIHRpY2suXG4gICAgICAgICAgICAgICAgICAgQWx0ZXJuYXRpdmVseSwgYSBtdWx0aXBsaWVyIGNhbiBiZSBwYXNzZWQgaW4gdG8gdGltZSByZW1hcCBhbGwgZGVsYXlzIGFuZCBkdXJhdGlvbnMuICovXG4gICAgICAgICAgICAgICAgaWYgKFZlbG9jaXR5Lm1vY2sgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5kdXJhdGlvbiA9IG9wdHMuZGVsYXkgPSAxO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdHMuZHVyYXRpb24gKj0gcGFyc2VGbG9hdChWZWxvY2l0eS5tb2NrKSB8fCAxO1xuICAgICAgICAgICAgICAgICAgICBvcHRzLmRlbGF5ICo9IHBhcnNlRmxvYXQoVmVsb2NpdHkubW9jaykgfHwgMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICBPcHRpb246IEVhc2luZ1xuICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgb3B0cy5lYXNpbmcgPSBnZXRFYXNpbmcob3B0cy5lYXNpbmcsIG9wdHMuZHVyYXRpb24pO1xuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgT3B0aW9uOiBDYWxsYmFja3NcbiAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIC8qIENhbGxiYWNrcyBtdXN0IGZ1bmN0aW9ucy4gT3RoZXJ3aXNlLCBkZWZhdWx0IHRvIG51bGwuICovXG4gICAgICAgICAgICBpZiAob3B0cy5iZWdpbiAmJiAhVHlwZS5pc0Z1bmN0aW9uKG9wdHMuYmVnaW4pKSB7XG4gICAgICAgICAgICAgICAgb3B0cy5iZWdpbiA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRzLnByb2dyZXNzICYmICFUeXBlLmlzRnVuY3Rpb24ob3B0cy5wcm9ncmVzcykpIHtcbiAgICAgICAgICAgICAgICBvcHRzLnByb2dyZXNzID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG9wdHMuY29tcGxldGUgJiYgIVR5cGUuaXNGdW5jdGlvbihvcHRzLmNvbXBsZXRlKSkge1xuICAgICAgICAgICAgICAgIG9wdHMuY29tcGxldGUgPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICBPcHRpb246IERpc3BsYXkgJiBWaXNpYmlsaXR5XG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIC8qIFJlZmVyIHRvIFZlbG9jaXR5J3MgZG9jdW1lbnRhdGlvbiAoVmVsb2NpdHlKUy5vcmcvI2Rpc3BsYXlBbmRWaXNpYmlsaXR5KSBmb3IgYSBkZXNjcmlwdGlvbiBvZiB0aGUgZGlzcGxheSBhbmQgdmlzaWJpbGl0eSBvcHRpb25zJyBiZWhhdmlvci4gKi9cbiAgICAgICAgICAgIC8qIE5vdGU6IFdlIHN0cmljdGx5IGNoZWNrIGZvciB1bmRlZmluZWQgaW5zdGVhZCBvZiBmYWxzaW5lc3MgYmVjYXVzZSBkaXNwbGF5IGFjY2VwdHMgYW4gZW1wdHkgc3RyaW5nIHZhbHVlLiAqL1xuICAgICAgICAgICAgaWYgKG9wdHMuZGlzcGxheSAhPT0gdW5kZWZpbmVkICYmIG9wdHMuZGlzcGxheSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG9wdHMuZGlzcGxheSA9IG9wdHMuZGlzcGxheS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgICAgICAgICAvKiBVc2VycyBjYW4gcGFzcyBpbiBhIHNwZWNpYWwgXCJhdXRvXCIgdmFsdWUgdG8gaW5zdHJ1Y3QgVmVsb2NpdHkgdG8gc2V0IHRoZSBlbGVtZW50IHRvIGl0cyBkZWZhdWx0IGRpc3BsYXkgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMuZGlzcGxheSA9PT0gXCJhdXRvXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5kaXNwbGF5ID0gVmVsb2NpdHkuQ1NTLlZhbHVlcy5nZXREaXNwbGF5VHlwZShlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChvcHRzLnZpc2liaWxpdHkgIT09IHVuZGVmaW5lZCAmJiBvcHRzLnZpc2liaWxpdHkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBvcHRzLnZpc2liaWxpdHkgPSBvcHRzLnZpc2liaWxpdHkudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgT3B0aW9uOiBtb2JpbGVIQVxuICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgLyogV2hlbiBzZXQgdG8gdHJ1ZSwgYW5kIGlmIHRoaXMgaXMgYSBtb2JpbGUgZGV2aWNlLCBtb2JpbGVIQSBhdXRvbWF0aWNhbGx5IGVuYWJsZXMgaGFyZHdhcmUgYWNjZWxlcmF0aW9uICh2aWEgYSBudWxsIHRyYW5zZm9ybSBoYWNrKVxuICAgICAgICAgICAgICAgb24gYW5pbWF0aW5nIGVsZW1lbnRzLiBIQSBpcyByZW1vdmVkIGZyb20gdGhlIGVsZW1lbnQgYXQgdGhlIGNvbXBsZXRpb24gb2YgaXRzIGFuaW1hdGlvbi4gKi9cbiAgICAgICAgICAgIC8qIE5vdGU6IEFuZHJvaWQgR2luZ2VyYnJlYWQgZG9lc24ndCBzdXBwb3J0IEhBLiBJZiBhIG51bGwgdHJhbnNmb3JtIGhhY2sgKG1vYmlsZUhBKSBpcyBpbiBmYWN0IHNldCwgaXQgd2lsbCBwcmV2ZW50IG90aGVyIHRyYW5mb3JtIHN1YnByb3BlcnRpZXMgZnJvbSB0YWtpbmcgZWZmZWN0LiAqL1xuICAgICAgICAgICAgLyogTm90ZTogWW91IGNhbiByZWFkIG1vcmUgYWJvdXQgdGhlIHVzZSBvZiBtb2JpbGVIQSBpbiBWZWxvY2l0eSdzIGRvY3VtZW50YXRpb246IFZlbG9jaXR5SlMub3JnLyNtb2JpbGVIQS4gKi9cbiAgICAgICAgICAgIG9wdHMubW9iaWxlSEEgPSAob3B0cy5tb2JpbGVIQSAmJiBWZWxvY2l0eS5TdGF0ZS5pc01vYmlsZSAmJiAhVmVsb2NpdHkuU3RhdGUuaXNHaW5nZXJicmVhZCk7XG5cbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgUGFydCBJSTogUXVldWVpbmdcbiAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAvKiBXaGVuIGEgc2V0IG9mIGVsZW1lbnRzIGlzIHRhcmdldGVkIGJ5IGEgVmVsb2NpdHkgY2FsbCwgdGhlIHNldCBpcyBicm9rZW4gdXAgYW5kIGVhY2ggZWxlbWVudCBoYXMgdGhlIGN1cnJlbnQgVmVsb2NpdHkgY2FsbCBpbmRpdmlkdWFsbHkgcXVldWVkIG9udG8gaXQuXG4gICAgICAgICAgICAgICBJbiB0aGlzIHdheSwgZWFjaCBlbGVtZW50J3MgZXhpc3RpbmcgcXVldWUgaXMgcmVzcGVjdGVkOyBzb21lIGVsZW1lbnRzIG1heSBhbHJlYWR5IGJlIGFuaW1hdGluZyBhbmQgYWNjb3JkaW5nbHkgc2hvdWxkIG5vdCBoYXZlIHRoaXMgY3VycmVudCBWZWxvY2l0eSBjYWxsIHRyaWdnZXJlZCBpbW1lZGlhdGVseS4gKi9cbiAgICAgICAgICAgIC8qIEluIGVhY2ggcXVldWUsIHR3ZWVuIGRhdGEgaXMgcHJvY2Vzc2VkIGZvciBlYWNoIGFuaW1hdGluZyBwcm9wZXJ0eSB0aGVuIHB1c2hlZCBvbnRvIHRoZSBjYWxsLXdpZGUgY2FsbHMgYXJyYXkuIFdoZW4gdGhlIGxhc3QgZWxlbWVudCBpbiB0aGUgc2V0IGhhcyBoYWQgaXRzIHR3ZWVucyBwcm9jZXNzZWQsXG4gICAgICAgICAgICAgICB0aGUgY2FsbCBhcnJheSBpcyBwdXNoZWQgdG8gVmVsb2NpdHkuU3RhdGUuY2FsbHMgZm9yIGxpdmUgcHJvY2Vzc2luZyBieSB0aGUgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHRpY2suICovXG4gICAgICAgICAgICBmdW5jdGlvbiBidWlsZFF1ZXVlIChuZXh0KSB7XG5cbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgIE9wdGlvbjogQmVnaW5cbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgLyogVGhlIGJlZ2luIGNhbGxiYWNrIGlzIGZpcmVkIG9uY2UgcGVyIGNhbGwgLS0gbm90IG9uY2UgcGVyIGVsZW1lbmV0IC0tIGFuZCBpcyBwYXNzZWQgdGhlIGZ1bGwgcmF3IERPTSBlbGVtZW50IHNldCBhcyBib3RoIGl0cyBjb250ZXh0IGFuZCBpdHMgZmlyc3QgYXJndW1lbnQuICovXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMuYmVnaW4gJiYgZWxlbWVudHNJbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvKiBXZSB0aHJvdyBjYWxsYmFja3MgaW4gYSBzZXRUaW1lb3V0IHNvIHRoYXQgdGhyb3duIGVycm9ycyBkb24ndCBoYWx0IHRoZSBleGVjdXRpb24gb2YgVmVsb2NpdHkgaXRzZWxmLiAqL1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5iZWdpbi5jYWxsKGVsZW1lbnRzLCBlbGVtZW50cyk7XG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyB0aHJvdyBlcnJvcjsgfSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICBUd2VlbiBEYXRhIENvbnN0cnVjdGlvbiAoZm9yIFNjcm9sbClcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIC8qIE5vdGU6IEluIG9yZGVyIHRvIGJlIHN1YmplY3RlZCB0byBjaGFpbmluZyBhbmQgYW5pbWF0aW9uIG9wdGlvbnMsIHNjcm9sbCdzIHR3ZWVuaW5nIGlzIHJvdXRlZCB0aHJvdWdoIFZlbG9jaXR5IGFzIGlmIGl0IHdlcmUgYSBzdGFuZGFyZCBDU1MgcHJvcGVydHkgYW5pbWF0aW9uLiAqL1xuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24gPT09IFwic2Nyb2xsXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogVGhlIHNjcm9sbCBhY3Rpb24gdW5pcXVlbHkgdGFrZXMgYW4gb3B0aW9uYWwgXCJvZmZzZXRcIiBvcHRpb24gLS0gc3BlY2lmaWVkIGluIHBpeGVscyAtLSB0aGF0IG9mZnNldHMgdGhlIHRhcmdldGVkIHNjcm9sbCBwb3NpdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIHNjcm9sbERpcmVjdGlvbiA9ICgvXngkL2kudGVzdChvcHRzLmF4aXMpID8gXCJMZWZ0XCIgOiBcIlRvcFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbE9mZnNldCA9IHBhcnNlRmxvYXQob3B0cy5vZmZzZXQpIHx8IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxQb3NpdGlvbkN1cnJlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxQb3NpdGlvbkN1cnJlbnRBbHRlcm5hdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxQb3NpdGlvbkVuZDtcblxuICAgICAgICAgICAgICAgICAgICAvKiBTY3JvbGwgYWxzbyB1bmlxdWVseSB0YWtlcyBhbiBvcHRpb25hbCBcImNvbnRhaW5lclwiIG9wdGlvbiwgd2hpY2ggaW5kaWNhdGVzIHRoZSBwYXJlbnQgZWxlbWVudCB0aGF0IHNob3VsZCBiZSBzY3JvbGxlZCAtLVxuICAgICAgICAgICAgICAgICAgICAgICBhcyBvcHBvc2VkIHRvIHRoZSBicm93c2VyIHdpbmRvdyBpdHNlbGYuIFRoaXMgaXMgdXNlZnVsIGZvciBzY3JvbGxpbmcgdG93YXJkIGFuIGVsZW1lbnQgdGhhdCdzIGluc2lkZSBhbiBvdmVyZmxvd2luZyBwYXJlbnQgZWxlbWVudC4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuY29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBFbnN1cmUgdGhhdCBlaXRoZXIgYSBqUXVlcnkgb2JqZWN0IG9yIGEgcmF3IERPTSBlbGVtZW50IHdhcyBwYXNzZWQgaW4uICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVHlwZS5pc1dyYXBwZWQob3B0cy5jb250YWluZXIpIHx8IFR5cGUuaXNOb2RlKG9wdHMuY29udGFpbmVyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEV4dHJhY3QgdGhlIHJhdyBET00gZWxlbWVudCBmcm9tIHRoZSBqUXVlcnkgd3JhcHBlci4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmNvbnRhaW5lciA9IG9wdHMuY29udGFpbmVyWzBdIHx8IG9wdHMuY29udGFpbmVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFVubGlrZSBvdGhlciBwcm9wZXJ0aWVzIGluIFZlbG9jaXR5LCB0aGUgYnJvd3NlcidzIHNjcm9sbCBwb3NpdGlvbiBpcyBuZXZlciBjYWNoZWQgc2luY2UgaXQgc28gZnJlcXVlbnRseSBjaGFuZ2VzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGR1ZSB0byB0aGUgdXNlcidzIG5hdHVyYWwgaW50ZXJhY3Rpb24gd2l0aCB0aGUgcGFnZSkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUG9zaXRpb25DdXJyZW50ID0gb3B0cy5jb250YWluZXJbXCJzY3JvbGxcIiArIHNjcm9sbERpcmVjdGlvbl07IC8qIEdFVCAqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogJC5wb3NpdGlvbigpIHZhbHVlcyBhcmUgcmVsYXRpdmUgdG8gdGhlIGNvbnRhaW5lcidzIGN1cnJlbnRseSB2aWV3YWJsZSBhcmVhICh3aXRob3V0IHRha2luZyBpbnRvIGFjY291bnQgdGhlIGNvbnRhaW5lcidzIHRydWUgZGltZW5zaW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0tIHNheSwgZm9yIGV4YW1wbGUsIGlmIHRoZSBjb250YWluZXIgd2FzIG5vdCBvdmVyZmxvd2luZykuIFRodXMsIHRoZSBzY3JvbGwgZW5kIHZhbHVlIGlzIHRoZSBzdW0gb2YgdGhlIGNoaWxkIGVsZW1lbnQncyBwb3NpdGlvbiAqYW5kKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBzY3JvbGwgY29udGFpbmVyJ3MgY3VycmVudCBzY3JvbGwgcG9zaXRpb24uICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUG9zaXRpb25FbmQgPSAoc2Nyb2xsUG9zaXRpb25DdXJyZW50ICsgJChlbGVtZW50KS5wb3NpdGlvbigpW3Njcm9sbERpcmVjdGlvbi50b0xvd2VyQ2FzZSgpXSkgKyBzY3JvbGxPZmZzZXQ7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgYSB2YWx1ZSBvdGhlciB0aGFuIGEgalF1ZXJ5IG9iamVjdCBvciBhIHJhdyBET00gZWxlbWVudCB3YXMgcGFzc2VkIGluLCBkZWZhdWx0IHRvIG51bGwgc28gdGhhdCB0aGlzIG9wdGlvbiBpcyBpZ25vcmVkLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmNvbnRhaW5lciA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgd2luZG93IGl0c2VsZiBpcyBiZWluZyBzY3JvbGxlZCAtLSBub3QgYSBjb250YWluaW5nIGVsZW1lbnQgLS0gcGVyZm9ybSBhIGxpdmUgc2Nyb2xsIHBvc2l0aW9uIGxvb2t1cCB1c2luZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGFwcHJvcHJpYXRlIGNhY2hlZCBwcm9wZXJ0eSBuYW1lcyAod2hpY2ggZGlmZmVyIGJhc2VkIG9uIGJyb3dzZXIgdHlwZSkuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxQb3NpdGlvbkN1cnJlbnQgPSBWZWxvY2l0eS5TdGF0ZS5zY3JvbGxBbmNob3JbVmVsb2NpdHkuU3RhdGVbXCJzY3JvbGxQcm9wZXJ0eVwiICsgc2Nyb2xsRGlyZWN0aW9uXV07IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogV2hlbiBzY3JvbGxpbmcgdGhlIGJyb3dzZXIgd2luZG93LCBjYWNoZSB0aGUgYWx0ZXJuYXRlIGF4aXMncyBjdXJyZW50IHZhbHVlIHNpbmNlIHdpbmRvdy5zY3JvbGxUbygpIGRvZXNuJ3QgbGV0IHVzIGNoYW5nZSBvbmx5IG9uZSB2YWx1ZSBhdCBhIHRpbWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxQb3NpdGlvbkN1cnJlbnRBbHRlcm5hdGUgPSBWZWxvY2l0eS5TdGF0ZS5zY3JvbGxBbmNob3JbVmVsb2NpdHkuU3RhdGVbXCJzY3JvbGxQcm9wZXJ0eVwiICsgKHNjcm9sbERpcmVjdGlvbiA9PT0gXCJMZWZ0XCIgPyBcIlRvcFwiIDogXCJMZWZ0XCIpXV07IC8qIEdFVCAqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBVbmxpa2UgJC5wb3NpdGlvbigpLCAkLm9mZnNldCgpIHZhbHVlcyBhcmUgcmVsYXRpdmUgdG8gdGhlIGJyb3dzZXIgd2luZG93J3MgdHJ1ZSBkaW1lbnNpb25zIC0tIG5vdCBtZXJlbHkgaXRzIGN1cnJlbnRseSB2aWV3YWJsZSBhcmVhIC0tXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgdGhlcmVmb3JlIGVuZCB2YWx1ZXMgZG8gbm90IG5lZWQgdG8gYmUgY29tcG91bmRlZCBvbnRvIGN1cnJlbnQgdmFsdWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUG9zaXRpb25FbmQgPSAkKGVsZW1lbnQpLm9mZnNldCgpW3Njcm9sbERpcmVjdGlvbi50b0xvd2VyQ2FzZSgpXSArIHNjcm9sbE9mZnNldDsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKiBTaW5jZSB0aGVyZSdzIG9ubHkgb25lIGZvcm1hdCB0aGF0IHNjcm9sbCdzIGFzc29jaWF0ZWQgdHdlZW5zQ29udGFpbmVyIGNhbiB0YWtlLCB3ZSBjcmVhdGUgaXQgbWFudWFsbHkuICovXG4gICAgICAgICAgICAgICAgICAgIHR3ZWVuc0NvbnRhaW5lciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlOiBzY3JvbGxQb3NpdGlvbkN1cnJlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlOiBzY3JvbGxQb3NpdGlvbkN1cnJlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWU6IHNjcm9sbFBvc2l0aW9uRW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRUeXBlOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZzogb3B0cy5lYXNpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsRGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXI6IG9wdHMuY29udGFpbmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb246IHNjcm9sbERpcmVjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWx0ZXJuYXRlVmFsdWU6IHNjcm9sbFBvc2l0aW9uQ3VycmVudEFsdGVybmF0ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKFZlbG9jaXR5LmRlYnVnKSBjb25zb2xlLmxvZyhcInR3ZWVuc0NvbnRhaW5lciAoc2Nyb2xsKTogXCIsIHR3ZWVuc0NvbnRhaW5lci5zY3JvbGwsIGVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgIFR3ZWVuIERhdGEgQ29uc3RydWN0aW9uIChmb3IgUmV2ZXJzZSlcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAvKiBSZXZlcnNlIGFjdHMgbGlrZSBhIFwic3RhcnRcIiBhY3Rpb24gaW4gdGhhdCBhIHByb3BlcnR5IG1hcCBpcyBhbmltYXRlZCB0b3dhcmQuIFRoZSBvbmx5IGRpZmZlcmVuY2UgaXNcbiAgICAgICAgICAgICAgICAgICB0aGF0IHRoZSBwcm9wZXJ0eSBtYXAgdXNlZCBmb3IgcmV2ZXJzZSBpcyB0aGUgaW52ZXJzZSBvZiB0aGUgbWFwIHVzZWQgaW4gdGhlIHByZXZpb3VzIGNhbGwuIFRodXMsIHdlIG1hbmlwdWxhdGVcbiAgICAgICAgICAgICAgICAgICB0aGUgcHJldmlvdXMgY2FsbCB0byBjb25zdHJ1Y3Qgb3VyIG5ldyBtYXA6IHVzZSB0aGUgcHJldmlvdXMgbWFwJ3MgZW5kIHZhbHVlcyBhcyBvdXIgbmV3IG1hcCdzIHN0YXJ0IHZhbHVlcy4gQ29weSBvdmVyIGFsbCBvdGhlciBkYXRhLiAqL1xuICAgICAgICAgICAgICAgIC8qIE5vdGU6IFJldmVyc2UgY2FuIGJlIGRpcmVjdGx5IGNhbGxlZCB2aWEgdGhlIFwicmV2ZXJzZVwiIHBhcmFtZXRlciwgb3IgaXQgY2FuIGJlIGluZGlyZWN0bHkgdHJpZ2dlcmVkIHZpYSB0aGUgbG9vcCBvcHRpb24uIChMb29wcyBhcmUgY29tcG9zZWQgb2YgbXVsdGlwbGUgcmV2ZXJzZXMuKSAqL1xuICAgICAgICAgICAgICAgIC8qIE5vdGU6IFJldmVyc2UgY2FsbHMgZG8gbm90IG5lZWQgdG8gYmUgY29uc2VjdXRpdmVseSBjaGFpbmVkIG9udG8gYSBjdXJyZW50bHktYW5pbWF0aW5nIGVsZW1lbnQgaW4gb3JkZXIgdG8gb3BlcmF0ZSBvbiBjYWNoZWQgdmFsdWVzO1xuICAgICAgICAgICAgICAgICAgIHRoZXJlIGlzIG5vIGhhcm0gdG8gcmV2ZXJzZSBiZWluZyBjYWxsZWQgb24gYSBwb3RlbnRpYWxseSBzdGFsZSBkYXRhIGNhY2hlIHNpbmNlIHJldmVyc2UncyBiZWhhdmlvciBpcyBzaW1wbHkgZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgIGFzIHJldmVydGluZyB0byB0aGUgZWxlbWVudCdzIHZhbHVlcyBhcyB0aGV5IHdlcmUgcHJpb3IgdG8gdGhlIHByZXZpb3VzICpWZWxvY2l0eSogY2FsbC4gKi9cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGFjdGlvbiA9PT0gXCJyZXZlcnNlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogQWJvcnQgaWYgdGhlcmUgaXMgbm8gcHJpb3IgYW5pbWF0aW9uIGRhdGEgdG8gcmV2ZXJzZSB0by4gKi9cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFEYXRhKGVsZW1lbnQpLnR3ZWVuc0NvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogRGVxdWV1ZSB0aGUgZWxlbWVudCBzbyB0aGF0IHRoaXMgcXVldWUgZW50cnkgcmVsZWFzZXMgaXRzZWxmIGltbWVkaWF0ZWx5LCBhbGxvd2luZyBzdWJzZXF1ZW50IHF1ZXVlIGVudHJpZXMgdG8gcnVuLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5kZXF1ZXVlKGVsZW1lbnQsIG9wdHMucXVldWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBPcHRpb25zIFBhcnNpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGVsZW1lbnQgd2FzIGhpZGRlbiB2aWEgdGhlIGRpc3BsYXkgb3B0aW9uIGluIHRoZSBwcmV2aW91cyBjYWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV2ZXJ0IGRpc3BsYXkgdG8gXCJhdXRvXCIgcHJpb3IgdG8gcmV2ZXJzYWwgc28gdGhhdCB0aGUgZWxlbWVudCBpcyB2aXNpYmxlIGFnYWluLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKERhdGEoZWxlbWVudCkub3B0cy5kaXNwbGF5ID09PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERhdGEoZWxlbWVudCkub3B0cy5kaXNwbGF5ID0gXCJhdXRvXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChEYXRhKGVsZW1lbnQpLm9wdHMudmlzaWJpbGl0eSA9PT0gXCJoaWRkZW5cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERhdGEoZWxlbWVudCkub3B0cy52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBsb29wIG9wdGlvbiB3YXMgc2V0IGluIHRoZSBwcmV2aW91cyBjYWxsLCBkaXNhYmxlIGl0IHNvIHRoYXQgXCJyZXZlcnNlXCIgY2FsbHMgYXJlbid0IHJlY3Vyc2l2ZWx5IGdlbmVyYXRlZC5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIEZ1cnRoZXIsIHJlbW92ZSB0aGUgcHJldmlvdXMgY2FsbCdzIGNhbGxiYWNrIG9wdGlvbnM7IHR5cGljYWxseSwgdXNlcnMgZG8gbm90IHdhbnQgdGhlc2UgdG8gYmUgcmVmaXJlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGEoZWxlbWVudCkub3B0cy5sb29wID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLm9wdHMuYmVnaW4gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS5vcHRzLmNvbXBsZXRlID0gbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogU2luY2Ugd2UncmUgZXh0ZW5kaW5nIGFuIG9wdHMgb2JqZWN0IHRoYXQgaGFzIGFscmVhZHkgYmVlbiBleHRlbmRlZCB3aXRoIHRoZSBkZWZhdWx0cyBvcHRpb25zIG9iamVjdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHdlIHJlbW92ZSBub24tZXhwbGljaXRseS1kZWZpbmVkIHByb3BlcnRpZXMgdGhhdCBhcmUgYXV0by1hc3NpZ25lZCB2YWx1ZXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMuZWFzaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG9wdHMuZWFzaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW9wdGlvbnMuZHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgb3B0cy5kdXJhdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogVGhlIG9wdHMgb2JqZWN0IHVzZWQgZm9yIHJldmVyc2FsIGlzIGFuIGV4dGVuc2lvbiBvZiB0aGUgb3B0aW9ucyBvYmplY3Qgb3B0aW9uYWxseSBwYXNzZWQgaW50byB0aGlzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXZlcnNlIGNhbGwgcGx1cyB0aGUgb3B0aW9ucyB1c2VkIGluIHRoZSBwcmV2aW91cyBWZWxvY2l0eSBjYWxsLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0cyA9ICQuZXh0ZW5kKHt9LCBEYXRhKGVsZW1lbnQpLm9wdHMsIG9wdHMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgVHdlZW5zIENvbnRhaW5lciBSZWNvbnN0cnVjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogQ3JlYXRlIGEgZGVlcHkgY29weSAoaW5kaWNhdGVkIHZpYSB0aGUgdHJ1ZSBmbGFnKSBvZiB0aGUgcHJldmlvdXMgY2FsbCdzIHR3ZWVuc0NvbnRhaW5lci4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXN0VHdlZW5zQ29udGFpbmVyID0gJC5leHRlbmQodHJ1ZSwge30sIERhdGEoZWxlbWVudCkudHdlZW5zQ29udGFpbmVyKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogTWFuaXB1bGF0ZSB0aGUgcHJldmlvdXMgdHdlZW5zQ29udGFpbmVyIGJ5IHJlcGxhY2luZyBpdHMgZW5kIHZhbHVlcyBhbmQgY3VycmVudFZhbHVlcyB3aXRoIGl0cyBzdGFydCB2YWx1ZXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBsYXN0VHdlZW4gaW4gbGFzdFR3ZWVuc0NvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEluIGFkZGl0aW9uIHRvIHR3ZWVuIGRhdGEsIHR3ZWVuc0NvbnRhaW5lcnMgY29udGFpbiBhbiBlbGVtZW50IHByb3BlcnR5IHRoYXQgd2UgaWdub3JlIGhlcmUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RUd2VlbiAhPT0gXCJlbGVtZW50XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RTdGFydFZhbHVlID0gbGFzdFR3ZWVuc0NvbnRhaW5lcltsYXN0VHdlZW5dLnN0YXJ0VmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFR3ZWVuc0NvbnRhaW5lcltsYXN0VHdlZW5dLnN0YXJ0VmFsdWUgPSBsYXN0VHdlZW5zQ29udGFpbmVyW2xhc3RUd2Vlbl0uY3VycmVudFZhbHVlID0gbGFzdFR3ZWVuc0NvbnRhaW5lcltsYXN0VHdlZW5dLmVuZFZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VHdlZW5zQ29udGFpbmVyW2xhc3RUd2Vlbl0uZW5kVmFsdWUgPSBsYXN0U3RhcnRWYWx1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBFYXNpbmcgaXMgdGhlIG9ubHkgb3B0aW9uIHRoYXQgZW1iZWRzIGludG8gdGhlIGluZGl2aWR1YWwgdHdlZW4gZGF0YSAoc2luY2UgaXQgY2FuIGJlIGRlZmluZWQgb24gYSBwZXItcHJvcGVydHkgYmFzaXMpLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBY2NvcmRpbmdseSwgZXZlcnkgcHJvcGVydHkncyBlYXNpbmcgdmFsdWUgbXVzdCBiZSB1cGRhdGVkIHdoZW4gYW4gb3B0aW9ucyBvYmplY3QgaXMgcGFzc2VkIGluIHdpdGggYSByZXZlcnNlIGNhbGwuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZSBzaWRlIGVmZmVjdCBvZiB0aGlzIGV4dGVuc2liaWxpdHkgaXMgdGhhdCBhbGwgcGVyLXByb3BlcnR5IGVhc2luZyB2YWx1ZXMgYXJlIGZvcmNlZnVsbHkgcmVzZXQgdG8gdGhlIG5ldyB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFUeXBlLmlzRW1wdHlPYmplY3Qob3B0aW9ucykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RUd2VlbnNDb250YWluZXJbbGFzdFR3ZWVuXS5lYXNpbmcgPSBvcHRzLmVhc2luZztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5kZWJ1ZykgY29uc29sZS5sb2coXCJyZXZlcnNlIHR3ZWVuc0NvbnRhaW5lciAoXCIgKyBsYXN0VHdlZW4gKyBcIik6IFwiICsgSlNPTi5zdHJpbmdpZnkobGFzdFR3ZWVuc0NvbnRhaW5lcltsYXN0VHdlZW5dKSwgZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0d2VlbnNDb250YWluZXIgPSBsYXN0VHdlZW5zQ29udGFpbmVyO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICBUd2VlbiBEYXRhIENvbnN0cnVjdGlvbiAoZm9yIFN0YXJ0KVxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChhY3Rpb24gPT09IFwic3RhcnRcIikge1xuXG4gICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICBWYWx1ZSBUcmFuc2ZlcnJpbmdcbiAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGlzIHF1ZXVlIGVudHJ5IGZvbGxvd3MgYSBwcmV2aW91cyBWZWxvY2l0eS1pbml0aWF0ZWQgcXVldWUgZW50cnkgKmFuZCogaWYgdGhpcyBlbnRyeSB3YXMgY3JlYXRlZFxuICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSB0aGUgZWxlbWVudCB3YXMgaW4gdGhlIHByb2Nlc3Mgb2YgYmVpbmcgYW5pbWF0ZWQgYnkgVmVsb2NpdHksIHRoZW4gdGhpcyBjdXJyZW50IGNhbGwgaXMgc2FmZSB0byB1c2VcbiAgICAgICAgICAgICAgICAgICAgICAgdGhlIGVuZCB2YWx1ZXMgZnJvbSB0aGUgcHJpb3IgY2FsbCBhcyBpdHMgc3RhcnQgdmFsdWVzLiBWZWxvY2l0eSBhdHRlbXB0cyB0byBwZXJmb3JtIHRoaXMgdmFsdWUgdHJhbnNmZXJcbiAgICAgICAgICAgICAgICAgICAgICAgcHJvY2VzcyB3aGVuZXZlciBwb3NzaWJsZSBpbiBvcmRlciB0byBhdm9pZCByZXF1ZXJ5aW5nIHRoZSBET00uICovXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIHZhbHVlcyBhcmVuJ3QgdHJhbnNmZXJyZWQgZnJvbSBhIHByaW9yIGNhbGwgYW5kIHN0YXJ0IHZhbHVlcyB3ZXJlIG5vdCBmb3JjZWZlZCBieSB0aGUgdXNlciAobW9yZSBvbiB0aGlzIGJlbG93KSxcbiAgICAgICAgICAgICAgICAgICAgICAgdGhlbiB0aGUgRE9NIGlzIHF1ZXJpZWQgZm9yIHRoZSBlbGVtZW50J3MgY3VycmVudCB2YWx1ZXMgYXMgYSBsYXN0IHJlc29ydC4gKi9cbiAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogQ29udmVyc2VseSwgYW5pbWF0aW9uIHJldmVyc2FsIChhbmQgbG9vcGluZykgKmFsd2F5cyogcGVyZm9ybSBpbnRlci1jYWxsIHZhbHVlIHRyYW5zZmVyczsgdGhleSBuZXZlciByZXF1ZXJ5IHRoZSBET00uICovXG4gICAgICAgICAgICAgICAgICAgIHZhciBsYXN0VHdlZW5zQ29udGFpbmVyO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIFRoZSBwZXItZWxlbWVudCBpc0FuaW1hdGluZyBmbGFnIGlzIHVzZWQgdG8gaW5kaWNhdGUgd2hldGhlciBpdCdzIHNhZmUgKGkuZS4gdGhlIGRhdGEgaXNuJ3Qgc3RhbGUpXG4gICAgICAgICAgICAgICAgICAgICAgIHRvIHRyYW5zZmVyIG92ZXIgZW5kIHZhbHVlcyB0byB1c2UgYXMgc3RhcnQgdmFsdWVzLiBJZiBpdCdzIHNldCB0byB0cnVlIGFuZCB0aGVyZSBpcyBhIHByZXZpb3VzXG4gICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5IGNhbGwgdG8gcHVsbCB2YWx1ZXMgZnJvbSwgZG8gc28uICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChEYXRhKGVsZW1lbnQpLnR3ZWVuc0NvbnRhaW5lciAmJiBEYXRhKGVsZW1lbnQpLmlzQW5pbWF0aW5nID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0VHdlZW5zQ29udGFpbmVyID0gRGF0YShlbGVtZW50KS50d2VlbnNDb250YWluZXI7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgIFR3ZWVuIERhdGEgQ2FsY3VsYXRpb25cbiAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIFRoaXMgZnVuY3Rpb24gcGFyc2VzIHByb3BlcnR5IGRhdGEgYW5kIGRlZmF1bHRzIGVuZFZhbHVlLCBlYXNpbmcsIGFuZCBzdGFydFZhbHVlIGFzIGFwcHJvcHJpYXRlLiAqL1xuICAgICAgICAgICAgICAgICAgICAvKiBQcm9wZXJ0eSBtYXAgdmFsdWVzIGNhbiBlaXRoZXIgdGFrZSB0aGUgZm9ybSBvZiAxKSBhIHNpbmdsZSB2YWx1ZSByZXByZXNlbnRpbmcgdGhlIGVuZCB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgb3IgMikgYW4gYXJyYXkgaW4gdGhlIGZvcm0gb2YgWyBlbmRWYWx1ZSwgWywgZWFzaW5nXSBbLCBzdGFydFZhbHVlXSBdLlxuICAgICAgICAgICAgICAgICAgICAgICBUaGUgb3B0aW9uYWwgdGhpcmQgcGFyYW1ldGVyIGlzIGEgZm9yY2VmZWQgc3RhcnRWYWx1ZSB0byBiZSB1c2VkIGluc3RlYWQgb2YgcXVlcnlpbmcgdGhlIERPTSBmb3JcbiAgICAgICAgICAgICAgICAgICAgICAgdGhlIGVsZW1lbnQncyBjdXJyZW50IHZhbHVlLiBSZWFkIFZlbG9jaXR5J3MgZG9jbWVudGF0aW9uIHRvIGxlYXJuIG1vcmUgYWJvdXQgZm9yY2VmZWVkaW5nOiBWZWxvY2l0eUpTLm9yZy8jZm9yY2VmZWVkaW5nICovXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHBhcnNlUHJvcGVydHlWYWx1ZSAodmFsdWVEYXRhLCBza2lwUmVzb2x2aW5nRWFzaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZW5kVmFsdWUgPSB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFzaW5nID0gdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEhhbmRsZSB0aGUgYXJyYXkgZm9ybWF0LCB3aGljaCBjYW4gYmUgc3RydWN0dXJlZCBhcyBvbmUgb2YgdGhyZWUgcG90ZW50aWFsIG92ZXJsb2FkczpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIEEpIFsgZW5kVmFsdWUsIGVhc2luZywgc3RhcnRWYWx1ZSBdLCBCKSBbIGVuZFZhbHVlLCBlYXNpbmcgXSwgb3IgQykgWyBlbmRWYWx1ZSwgc3RhcnRWYWx1ZSBdICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVHlwZS5pc0FycmF5KHZhbHVlRGF0YSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBlbmRWYWx1ZSBpcyBhbHdheXMgdGhlIGZpcnN0IGl0ZW0gaW4gdGhlIGFycmF5LiBEb24ndCBib3RoZXIgdmFsaWRhdGluZyBlbmRWYWx1ZSdzIHZhbHVlIG5vd1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpbmNlIHRoZSBlbnN1aW5nIHByb3BlcnR5IGN5Y2xpbmcgbG9naWMgZG9lcyB0aGF0LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gdmFsdWVEYXRhWzBdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVHdvLWl0ZW0gYXJyYXkgZm9ybWF0OiBJZiB0aGUgc2Vjb25kIGl0ZW0gaXMgYSBudW1iZXIsIGZ1bmN0aW9uLCBvciBoZXggc3RyaW5nLCB0cmVhdCBpdCBhcyBhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQgdmFsdWUgc2luY2UgZWFzaW5ncyBjYW4gb25seSBiZSBub24taGV4IHN0cmluZ3Mgb3IgYXJyYXlzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoIVR5cGUuaXNBcnJheSh2YWx1ZURhdGFbMV0pICYmIC9eW1xcZC1dLy50ZXN0KHZhbHVlRGF0YVsxXSkpIHx8IFR5cGUuaXNGdW5jdGlvbih2YWx1ZURhdGFbMV0pIHx8IENTUy5SZWdFeC5pc0hleC50ZXN0KHZhbHVlRGF0YVsxXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IHZhbHVlRGF0YVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBUd28gb3IgdGhyZWUtaXRlbSBhcnJheTogSWYgdGhlIHNlY29uZCBpdGVtIGlzIGEgbm9uLWhleCBzdHJpbmcgb3IgYW4gYXJyYXksIHRyZWF0IGl0IGFzIGFuIGVhc2luZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKChUeXBlLmlzU3RyaW5nKHZhbHVlRGF0YVsxXSkgJiYgIUNTUy5SZWdFeC5pc0hleC50ZXN0KHZhbHVlRGF0YVsxXSkpIHx8IFR5cGUuaXNBcnJheSh2YWx1ZURhdGFbMV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZyA9IHNraXBSZXNvbHZpbmdFYXNpbmcgPyB2YWx1ZURhdGFbMV0gOiBnZXRFYXNpbmcodmFsdWVEYXRhWzFdLCBvcHRzLmR1cmF0aW9uKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBEb24ndCBib3RoZXIgdmFsaWRhdGluZyBzdGFydFZhbHVlJ3MgdmFsdWUgbm93IHNpbmNlIHRoZSBlbnN1aW5nIHByb3BlcnR5IGN5Y2xpbmcgbG9naWMgaW5oZXJlbnRseSBkb2VzIHRoYXQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZURhdGFbMl0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IHZhbHVlRGF0YVsyXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEhhbmRsZSB0aGUgc2luZ2xlLXZhbHVlIGZvcm1hdC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSB2YWx1ZURhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIERlZmF1bHQgdG8gdGhlIGNhbGwncyBlYXNpbmcgaWYgYSBwZXItcHJvcGVydHkgZWFzaW5nIHR5cGUgd2FzIG5vdCBkZWZpbmVkLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFza2lwUmVzb2x2aW5nRWFzaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFzaW5nID0gZWFzaW5nIHx8IG9wdHMuZWFzaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiBmdW5jdGlvbnMgd2VyZSBwYXNzZWQgaW4gYXMgdmFsdWVzLCBwYXNzIHRoZSBmdW5jdGlvbiB0aGUgY3VycmVudCBlbGVtZW50IGFzIGl0cyBjb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcGx1cyB0aGUgZWxlbWVudCdzIGluZGV4IGFuZCB0aGUgZWxlbWVudCBzZXQncyBzaXplIGFzIGFyZ3VtZW50cy4gVGhlbiwgYXNzaWduIHRoZSByZXR1cm5lZCB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUeXBlLmlzRnVuY3Rpb24oZW5kVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSBlbmRWYWx1ZS5jYWxsKGVsZW1lbnQsIGVsZW1lbnRzSW5kZXgsIGVsZW1lbnRzTGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFR5cGUuaXNGdW5jdGlvbihzdGFydFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSBzdGFydFZhbHVlLmNhbGwoZWxlbWVudCwgZWxlbWVudHNJbmRleCwgZWxlbWVudHNMZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBBbGxvdyBzdGFydFZhbHVlIHRvIGJlIGxlZnQgYXMgdW5kZWZpbmVkIHRvIGluZGljYXRlIHRvIHRoZSBlbnN1aW5nIGNvZGUgdGhhdCBpdHMgdmFsdWUgd2FzIG5vdCBmb3JjZWZlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbIGVuZFZhbHVlIHx8IDAsIGVhc2luZywgc3RhcnRWYWx1ZSBdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogQ3ljbGUgdGhyb3VnaCBlYWNoIHByb3BlcnR5IGluIHRoZSBtYXAsIGxvb2tpbmcgZm9yIHNob3J0aGFuZCBjb2xvciBwcm9wZXJ0aWVzIChlLmcuIFwiY29sb3JcIiBhcyBvcHBvc2VkIHRvIFwiY29sb3JSZWRcIikuIEluamVjdCB0aGUgY29ycmVzcG9uZGluZ1xuICAgICAgICAgICAgICAgICAgICAgICBjb2xvclJlZCwgY29sb3JHcmVlbiwgYW5kIGNvbG9yQmx1ZSBSR0IgY29tcG9uZW50IHR3ZWVucyBpbnRvIHRoZSBwcm9wZXJ0aWVzTWFwICh3aGljaCBWZWxvY2l0eSB1bmRlcnN0YW5kcykgYW5kIHJlbW92ZSB0aGUgc2hvcnRoYW5kIHByb3BlcnR5LiAqL1xuICAgICAgICAgICAgICAgICAgICAkLmVhY2gocHJvcGVydGllc01hcCwgZnVuY3Rpb24ocHJvcGVydHksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBGaW5kIHNob3J0aGFuZCBjb2xvciBwcm9wZXJ0aWVzIHRoYXQgaGF2ZSBiZWVuIHBhc3NlZCBhIGhleCBzdHJpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoUmVnRXhwKFwiXlwiICsgQ1NTLkxpc3RzLmNvbG9ycy5qb2luKFwiJHxeXCIpICsgXCIkXCIpLnRlc3QocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogUGFyc2UgdGhlIHZhbHVlIGRhdGEgZm9yIGVhY2ggc2hvcnRoYW5kLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZURhdGEgPSBwYXJzZVByb3BlcnR5VmFsdWUodmFsdWUsIHRydWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IHZhbHVlRGF0YVswXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFzaW5nID0gdmFsdWVEYXRhWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gdmFsdWVEYXRhWzJdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5SZWdFeC5pc0hleC50ZXN0KGVuZFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDb252ZXJ0IHRoZSBoZXggc3RyaW5ncyBpbnRvIHRoZWlyIFJHQiBjb21wb25lbnQgYXJyYXlzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29sb3JDb21wb25lbnRzID0gWyBcIlJlZFwiLCBcIkdyZWVuXCIsIFwiQmx1ZVwiIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZVJHQiA9IENTUy5WYWx1ZXMuaGV4VG9SZ2IoZW5kVmFsdWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZVJHQiA9IHN0YXJ0VmFsdWUgPyBDU1MuVmFsdWVzLmhleFRvUmdiKHN0YXJ0VmFsdWUpIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEluamVjdCB0aGUgUkdCIGNvbXBvbmVudCB0d2VlbnMgaW50byBwcm9wZXJ0aWVzTWFwLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbG9yQ29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGFBcnJheSA9IFsgZW5kVmFsdWVSR0JbaV0gXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVhc2luZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFBcnJheS5wdXNoKGVhc2luZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFydFZhbHVlUkdCICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQXJyYXkucHVzaChzdGFydFZhbHVlUkdCW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc01hcFtwcm9wZXJ0eSArIGNvbG9yQ29tcG9uZW50c1tpXV0gPSBkYXRhQXJyYXk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBSZW1vdmUgdGhlIGludGVybWVkaWFyeSBzaG9ydGhhbmQgcHJvcGVydHkgZW50cnkgbm93IHRoYXQgd2UndmUgcHJvY2Vzc2VkIGl0LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgcHJvcGVydGllc01hcFtwcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBDcmVhdGUgYSB0d2VlbiBvdXQgb2YgZWFjaCBwcm9wZXJ0eSwgYW5kIGFwcGVuZCBpdHMgYXNzb2NpYXRlZCBkYXRhIHRvIHR3ZWVuc0NvbnRhaW5lci4gKi9cbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gcHJvcGVydGllc01hcCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0YXJ0IFZhbHVlIFNvdXJjaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogUGFyc2Ugb3V0IGVuZFZhbHVlLCBlYXNpbmcsIGFuZCBzdGFydFZhbHVlIGZyb20gdGhlIHByb3BlcnR5J3MgZGF0YS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZURhdGEgPSBwYXJzZVByb3BlcnR5VmFsdWUocHJvcGVydGllc01hcFtwcm9wZXJ0eV0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gdmFsdWVEYXRhWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZyA9IHZhbHVlRGF0YVsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gdmFsdWVEYXRhWzJdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3cgdGhhdCB0aGUgb3JpZ2luYWwgcHJvcGVydHkgbmFtZSdzIGZvcm1hdCBoYXMgYmVlbiB1c2VkIGZvciB0aGUgcGFyc2VQcm9wZXJ0eVZhbHVlKCkgbG9va3VwIGFib3ZlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgd2UgZm9yY2UgdGhlIHByb3BlcnR5IHRvIGl0cyBjYW1lbENhc2Ugc3R5bGluZyB0byBub3JtYWxpemUgaXQgZm9yIG1hbmlwdWxhdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gQ1NTLk5hbWVzLmNhbWVsQ2FzZShwcm9wZXJ0eSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEluIGNhc2UgdGhpcyBwcm9wZXJ0eSBpcyBhIGhvb2ssIHRoZXJlIGFyZSBjaXJjdW1zdGFuY2VzIHdoZXJlIHdlIHdpbGwgaW50ZW5kIHRvIHdvcmsgb24gdGhlIGhvb2sncyByb290IHByb3BlcnR5IGFuZCBub3QgdGhlIGhvb2tlZCBzdWJwcm9wZXJ0eS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb290UHJvcGVydHkgPSBDU1MuSG9va3MuZ2V0Um9vdChwcm9wZXJ0eSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWUgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogT3RoZXIgdGhhbiBmb3IgdGhlIGR1bW15IHR3ZWVuIHByb3BlcnR5LCBwcm9wZXJ0aWVzIHRoYXQgYXJlIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIgKGFuZCBkbyBub3QgaGF2ZSBhbiBhc3NvY2lhdGVkIG5vcm1hbGl6YXRpb24pIHdpbGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGluaGVyZW50bHkgcHJvZHVjZSBubyBzdHlsZSBjaGFuZ2VzIHdoZW4gc2V0LCBzbyB0aGV5IGFyZSBza2lwcGVkIGluIG9yZGVyIHRvIGRlY3JlYXNlIGFuaW1hdGlvbiB0aWNrIG92ZXJoZWFkLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgUHJvcGVydHkgc3VwcG9ydCBpcyBkZXRlcm1pbmVkIHZpYSBwcmVmaXhDaGVjaygpLCB3aGljaCByZXR1cm5zIGEgZmFsc2UgZmxhZyB3aGVuIG5vIHN1cHBvcnRlZCBpcyBkZXRlY3RlZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFNpbmNlIFNWRyBlbGVtZW50cyBoYXZlIHNvbWUgb2YgdGhlaXIgcHJvcGVydGllcyBkaXJlY3RseSBhcHBsaWVkIGFzIEhUTUwgYXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZXJlIGlzIG5vIHdheSB0byBjaGVjayBmb3IgdGhlaXIgZXhwbGljaXQgYnJvd3NlciBzdXBwb3J0LCBhbmQgc28gd2Ugc2tpcCBza2lwIHRoaXMgY2hlY2sgZm9yIHRoZW0uICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIURhdGEoZWxlbWVudCkuaXNTVkcgJiYgcm9vdFByb3BlcnR5ICE9PSBcInR3ZWVuXCIgJiYgQ1NTLk5hbWVzLnByZWZpeENoZWNrKHJvb3RQcm9wZXJ0eSlbMV0gPT09IGZhbHNlICYmIENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW3Jvb3RQcm9wZXJ0eV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5kZWJ1ZykgY29uc29sZS5sb2coXCJTa2lwcGluZyBbXCIgKyByb290UHJvcGVydHkgKyBcIl0gZHVlIHRvIGEgbGFjayBvZiBicm93c2VyIHN1cHBvcnQuXCIpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBkaXNwbGF5IG9wdGlvbiBpcyBiZWluZyBzZXQgdG8gYSBub24tXCJub25lXCIgKGUuZy4gXCJibG9ja1wiKSBhbmQgb3BhY2l0eSAoZmlsdGVyIG9uIElFPD04KSBpcyBiZWluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZWQgdG8gYW4gZW5kVmFsdWUgb2Ygbm9uLXplcm8sIHRoZSB1c2VyJ3MgaW50ZW50aW9uIGlzIHRvIGZhZGUgaW4gZnJvbSBpbnZpc2libGUsIHRodXMgd2UgZm9yY2VmZWVkIG9wYWNpdHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGEgc3RhcnRWYWx1ZSBvZiAwIGlmIGl0cyBzdGFydFZhbHVlIGhhc24ndCBhbHJlYWR5IGJlZW4gc291cmNlZCBieSB2YWx1ZSB0cmFuc2ZlcnJpbmcgb3IgcHJpb3IgZm9yY2VmZWVkaW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCgob3B0cy5kaXNwbGF5ICE9PSB1bmRlZmluZWQgJiYgb3B0cy5kaXNwbGF5ICE9PSBudWxsICYmIG9wdHMuZGlzcGxheSAhPT0gXCJub25lXCIpIHx8IChvcHRzLnZpc2liaWxpdHkgIT09IHVuZGVmaW5lZCAmJiBvcHRzLnZpc2liaWxpdHkgIT09IFwiaGlkZGVuXCIpKSAmJiAvb3BhY2l0eXxmaWx0ZXIvLnRlc3QocHJvcGVydHkpICYmICFzdGFydFZhbHVlICYmIGVuZFZhbHVlICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHZhbHVlcyBoYXZlIGJlZW4gdHJhbnNmZXJyZWQgZnJvbSB0aGUgcHJldmlvdXMgVmVsb2NpdHkgY2FsbCwgZXh0cmFjdCB0aGUgZW5kVmFsdWUgYW5kIHJvb3RQcm9wZXJ0eVZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgYWxsIG9mIHRoZSBjdXJyZW50IGNhbGwncyBwcm9wZXJ0aWVzIHRoYXQgd2VyZSAqYWxzbyogYW5pbWF0ZWQgaW4gdGhlIHByZXZpb3VzIGNhbGwuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBWYWx1ZSB0cmFuc2ZlcnJpbmcgY2FuIG9wdGlvbmFsbHkgYmUgZGlzYWJsZWQgYnkgdGhlIHVzZXIgdmlhIHRoZSBfY2FjaGVWYWx1ZXMgb3B0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuX2NhY2hlVmFsdWVzICYmIGxhc3RUd2VlbnNDb250YWluZXIgJiYgbGFzdFR3ZWVuc0NvbnRhaW5lcltwcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSBsYXN0VHdlZW5zQ29udGFpbmVyW3Byb3BlcnR5XS5lbmRWYWx1ZSArIGxhc3RUd2VlbnNDb250YWluZXJbcHJvcGVydHldLnVuaXRUeXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSBwcmV2aW91cyBjYWxsJ3Mgcm9vdFByb3BlcnR5VmFsdWUgaXMgZXh0cmFjdGVkIGZyb20gdGhlIGVsZW1lbnQncyBkYXRhIGNhY2hlIHNpbmNlIHRoYXQncyB0aGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZSBvZiByb290UHJvcGVydHlWYWx1ZSB0aGF0IGdldHMgZnJlc2hseSB1cGRhdGVkIGJ5IHRoZSB0d2VlbmluZyBwcm9jZXNzLCB3aGVyZWFzIHRoZSByb290UHJvcGVydHlWYWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dGFjaGVkIHRvIHRoZSBpbmNvbWluZyBsYXN0VHdlZW5zQ29udGFpbmVyIGlzIGVxdWFsIHRvIHRoZSByb290IHByb3BlcnR5J3MgdmFsdWUgcHJpb3IgdG8gYW55IHR3ZWVuaW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlID0gRGF0YShlbGVtZW50KS5yb290UHJvcGVydHlWYWx1ZUNhY2hlW3Jvb3RQcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB2YWx1ZXMgd2VyZSBub3QgdHJhbnNmZXJyZWQgZnJvbSBhIHByZXZpb3VzIFZlbG9jaXR5IGNhbGwsIHF1ZXJ5IHRoZSBET00gYXMgbmVlZGVkLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBIYW5kbGUgaG9va2VkIHByb3BlcnRpZXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5Ib29rcy5yZWdpc3RlcmVkW3Byb3BlcnR5XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFydFZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlID0gQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgcm9vdFByb3BlcnR5KTsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBUaGUgZm9sbG93aW5nIGdldFByb3BlcnR5VmFsdWUoKSBjYWxsIGRvZXMgbm90IGFjdHVhbGx5IHRyaWdnZXIgYSBET00gcXVlcnk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXRQcm9wZXJ0eVZhbHVlKCkgd2lsbCBleHRyYWN0IHRoZSBob29rIGZyb20gcm9vdFByb3BlcnR5VmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgcHJvcGVydHksIHJvb3RQcm9wZXJ0eVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgc3RhcnRWYWx1ZSBpcyBhbHJlYWR5IGRlZmluZWQgdmlhIGZvcmNlZmVlZGluZywgZG8gbm90IHF1ZXJ5IHRoZSBET00gZm9yIHRoZSByb290IHByb3BlcnR5J3MgdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGp1c3QgZ3JhYiByb290UHJvcGVydHkncyB6ZXJvLXZhbHVlIHRlbXBsYXRlIGZyb20gQ1NTLkhvb2tzLiBUaGlzIG92ZXJ3cml0ZXMgdGhlIGVsZW1lbnQncyBhY3R1YWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vdCBwcm9wZXJ0eSB2YWx1ZSAoaWYgb25lIGlzIHNldCksIGJ1dCB0aGlzIGlzIGFjY2VwdGFibGUgc2luY2UgdGhlIHByaW1hcnkgcmVhc29uIHVzZXJzIGZvcmNlZmVlZCBpc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhdm9pZCBET00gcXVlcmllcywgYW5kIHRodXMgd2UgbGlrZXdpc2UgYXZvaWQgcXVlcnlpbmcgdGhlIERPTSBmb3IgdGhlIHJvb3QgcHJvcGVydHkncyB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEdyYWIgdGhpcyBob29rJ3MgemVyby12YWx1ZSB0ZW1wbGF0ZSwgZS5nLiBcIjBweCAwcHggMHB4IGJsYWNrXCIuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSA9IENTUy5Ib29rcy50ZW1wbGF0ZXNbcm9vdFByb3BlcnR5XVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEhhbmRsZSBub24taG9va2VkIHByb3BlcnRpZXMgdGhhdCBoYXZlbid0IGFscmVhZHkgYmVlbiBkZWZpbmVkIHZpYSBmb3JjZWZlZWRpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdGFydFZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIHByb3BlcnR5KTsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFZhbHVlIERhdGEgRXh0cmFjdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZXBhcmF0ZWRWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZVVuaXRUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWVVbml0VHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRvciA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBTZXBhcmF0ZXMgYSBwcm9wZXJ0eSB2YWx1ZSBpbnRvIGl0cyBudW1lcmljIHZhbHVlIGFuZCBpdHMgdW5pdCB0eXBlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gc2VwYXJhdGVWYWx1ZSAocHJvcGVydHksIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVuaXRUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1lcmljVmFsdWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW1lcmljVmFsdWUgPSAodmFsdWUgfHwgXCIwXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50b1N0cmluZygpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE1hdGNoIHRoZSB1bml0IHR5cGUgYXQgdGhlIGVuZCBvZiB0aGUgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9bJUEtel0rJC8sIGZ1bmN0aW9uKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBHcmFiIHRoZSB1bml0IHR5cGUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0VHlwZSA9IG1hdGNoO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTdHJpcCB0aGUgdW5pdCB0eXBlIG9mZiBvZiB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIG5vIHVuaXQgdHlwZSB3YXMgc3VwcGxpZWQsIGFzc2lnbiBvbmUgdGhhdCBpcyBhcHByb3ByaWF0ZSBmb3IgdGhpcyBwcm9wZXJ0eSAoZS5nLiBcImRlZ1wiIGZvciByb3RhdGVaIG9yIFwicHhcIiBmb3Igd2lkdGgpLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdW5pdFR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFR5cGUgPSBDU1MuVmFsdWVzLmdldFVuaXRUeXBlKHByb3BlcnR5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyBudW1lcmljVmFsdWUsIHVuaXRUeXBlIF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNlcGFyYXRlIHN0YXJ0VmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXBhcmF0ZWRWYWx1ZSA9IHNlcGFyYXRlVmFsdWUocHJvcGVydHksIHN0YXJ0VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IHNlcGFyYXRlZFZhbHVlWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZVVuaXRUeXBlID0gc2VwYXJhdGVkVmFsdWVbMV07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNlcGFyYXRlIGVuZFZhbHVlLCBhbmQgZXh0cmFjdCBhIHZhbHVlIG9wZXJhdG9yIChlLmcuIFwiKz1cIiwgXCItPVwiKSBpZiBvbmUgZXhpc3RzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VwYXJhdGVkVmFsdWUgPSBzZXBhcmF0ZVZhbHVlKHByb3BlcnR5LCBlbmRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IHNlcGFyYXRlZFZhbHVlWzBdLnJlcGxhY2UoL14oWystXFwvKl0pPS8sIGZ1bmN0aW9uKG1hdGNoLCBzdWJNYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yID0gc3ViTWF0Y2g7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTdHJpcCB0aGUgb3BlcmF0b3Igb2ZmIG9mIHRoZSB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWVVbml0VHlwZSA9IHNlcGFyYXRlZFZhbHVlWzFdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBQYXJzZSBmbG9hdCB2YWx1ZXMgZnJvbSBlbmRWYWx1ZSBhbmQgc3RhcnRWYWx1ZS4gRGVmYXVsdCB0byAwIGlmIE5hTiBpcyByZXR1cm5lZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSBwYXJzZUZsb2F0KHN0YXJ0VmFsdWUpIHx8IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IHBhcnNlRmxvYXQoZW5kVmFsdWUpIHx8IDA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFByb3BlcnR5LVNwZWNpZmljIFZhbHVlIENvbnZlcnNpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogQ3VzdG9tIHN1cHBvcnQgZm9yIHByb3BlcnRpZXMgdGhhdCBkb24ndCBhY3R1YWxseSBhY2NlcHQgdGhlICUgdW5pdCB0eXBlLCBidXQgd2hlcmUgcG9sbHlmaWxsaW5nIGlzIHRyaXZpYWwgYW5kIHJlbGF0aXZlbHkgZm9vbHByb29mLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVuZFZhbHVlVW5pdFR5cGUgPT09IFwiJVwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQSAlLXZhbHVlIGZvbnRTaXplL2xpbmVIZWlnaHQgaXMgcmVsYXRpdmUgdG8gdGhlIHBhcmVudCdzIGZvbnRTaXplIChhcyBvcHBvc2VkIHRvIHRoZSBwYXJlbnQncyBkaW1lbnNpb25zKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aGljaCBpcyBpZGVudGljYWwgdG8gdGhlIGVtIHVuaXQncyBiZWhhdmlvciwgc28gd2UgcGlnZ3liYWNrIG9mZiBvZiB0aGF0LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgvXihmb250U2l6ZXxsaW5lSGVpZ2h0KSQvLnRlc3QocHJvcGVydHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENvbnZlcnQgJSBpbnRvIGFuIGVtIGRlY2ltYWwgdmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gZW5kVmFsdWUgLyAxMDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlVW5pdFR5cGUgPSBcImVtXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRm9yIHNjYWxlWCBhbmQgc2NhbGVZLCBjb252ZXJ0IHRoZSB2YWx1ZSBpbnRvIGl0cyBkZWNpbWFsIGZvcm1hdCBhbmQgc3RyaXAgb2ZmIHRoZSB1bml0IHR5cGUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgvXnNjYWxlLy50ZXN0KHByb3BlcnR5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IGVuZFZhbHVlIC8gMTAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZVVuaXRUeXBlID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBGb3IgUkdCIGNvbXBvbmVudHMsIHRha2UgdGhlIGRlZmluZWQgcGVyY2VudGFnZSBvZiAyNTUgYW5kIHN0cmlwIG9mZiB0aGUgdW5pdCB0eXBlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoLyhSZWR8R3JlZW58Qmx1ZSkkL2kudGVzdChwcm9wZXJ0eSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSAoZW5kVmFsdWUgLyAxMDApICogMjU1O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZVVuaXRUeXBlID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFVuaXQgUmF0aW8gQ2FsY3VsYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogV2hlbiBxdWVyaWVkLCB0aGUgYnJvd3NlciByZXR1cm5zIChtb3N0KSBDU1MgcHJvcGVydHkgdmFsdWVzIGluIHBpeGVscy4gVGhlcmVmb3JlLCBpZiBhbiBlbmRWYWx1ZSB3aXRoIGEgdW5pdCB0eXBlIG9mXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAlLCBlbSwgb3IgcmVtIGlzIGFuaW1hdGVkIHRvd2FyZCwgc3RhcnRWYWx1ZSBtdXN0IGJlIGNvbnZlcnRlZCBmcm9tIHBpeGVscyBpbnRvIHRoZSBzYW1lIHVuaXQgdHlwZSBhcyBlbmRWYWx1ZSBpbiBvcmRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIHZhbHVlIG1hbmlwdWxhdGlvbiBsb2dpYyAoaW5jcmVtZW50L2RlY3JlbWVudCkgdG8gcHJvY2VlZC4gRnVydGhlciwgaWYgdGhlIHN0YXJ0VmFsdWUgd2FzIGZvcmNlZmVkIG9yIHRyYW5zZmVycmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tIGEgcHJldmlvdXMgY2FsbCwgc3RhcnRWYWx1ZSBtYXkgYWxzbyBub3QgYmUgaW4gcGl4ZWxzLiBVbml0IGNvbnZlcnNpb24gbG9naWMgdGhlcmVmb3JlIGNvbnNpc3RzIG9mIHR3byBzdGVwczpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDEpIENhbGN1bGF0aW5nIHRoZSByYXRpbyBvZiAlL2VtL3JlbS92aC92dyByZWxhdGl2ZSB0byBwaXhlbHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDIpIENvbnZlcnRpbmcgc3RhcnRWYWx1ZSBpbnRvIHRoZSBzYW1lIHVuaXQgb2YgbWVhc3VyZW1lbnQgYXMgZW5kVmFsdWUgYmFzZWQgb24gdGhlc2UgcmF0aW9zLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogVW5pdCBjb252ZXJzaW9uIHJhdGlvcyBhcmUgY2FsY3VsYXRlZCBieSBpbnNlcnRpbmcgYSBzaWJsaW5nIG5vZGUgbmV4dCB0byB0aGUgdGFyZ2V0IG5vZGUsIGNvcHlpbmcgb3ZlciBpdHMgcG9zaXRpb24gcHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5nIHZhbHVlcyB3aXRoIHRoZSB0YXJnZXQgdW5pdCB0eXBlIHRoZW4gY29tcGFyaW5nIHRoZSByZXR1cm5lZCBwaXhlbCB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IEV2ZW4gaWYgb25seSBvbmUgb2YgdGhlc2UgdW5pdCB0eXBlcyBpcyBiZWluZyBhbmltYXRlZCwgYWxsIHVuaXQgcmF0aW9zIGFyZSBjYWxjdWxhdGVkIGF0IG9uY2Ugc2luY2UgdGhlIG92ZXJoZWFkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvZiBiYXRjaGluZyB0aGUgU0VUcyBhbmQgR0VUcyB0b2dldGhlciB1cGZyb250IG91dHdlaWdodHMgdGhlIHBvdGVudGlhbCBvdmVyaGVhZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb2YgbGF5b3V0IHRocmFzaGluZyBjYXVzZWQgYnkgcmUtcXVlcnlpbmcgZm9yIHVuY2FsY3VsYXRlZCByYXRpb3MgZm9yIHN1YnNlcXVlbnRseS1wcm9jZXNzZWQgcHJvcGVydGllcy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRvZG86IFNoaWZ0IHRoaXMgbG9naWMgaW50byB0aGUgY2FsbHMnIGZpcnN0IHRpY2sgaW5zdGFuY2Ugc28gdGhhdCBpdCdzIHN5bmNlZCB3aXRoIFJBRi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNhbGN1bGF0ZVVuaXRSYXRpb3MgKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTYW1lIFJhdGlvIENoZWNrc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSBwcm9wZXJ0aWVzIGJlbG93IGFyZSB1c2VkIHRvIGRldGVybWluZSB3aGV0aGVyIHRoZSBlbGVtZW50IGRpZmZlcnMgc3VmZmljaWVudGx5IGZyb20gdGhpcyBjYWxsJ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2aW91c2x5IGl0ZXJhdGVkIGVsZW1lbnQgdG8gYWxzbyBkaWZmZXIgaW4gaXRzIHVuaXQgY29udmVyc2lvbiByYXRpb3MuIElmIHRoZSBwcm9wZXJ0aWVzIG1hdGNoIHVwIHdpdGggdGhvc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZiB0aGUgcHJpb3IgZWxlbWVudCwgdGhlIHByaW9yIGVsZW1lbnQncyBjb252ZXJzaW9uIHJhdGlvcyBhcmUgdXNlZC4gTGlrZSBtb3N0IG9wdGltaXphdGlvbnMgaW4gVmVsb2NpdHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcyBpcyBkb25lIHRvIG1pbmltaXplIERPTSBxdWVyeWluZy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2FtZVJhdGlvSW5kaWNhdG9ycyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG15UGFyZW50OiBlbGVtZW50LnBhcmVudE5vZGUgfHwgZG9jdW1lbnQuYm9keSwgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJwb3NpdGlvblwiKSwgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJmb250U2l6ZVwiKSAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRGV0ZXJtaW5lIGlmIHRoZSBzYW1lICUgcmF0aW8gY2FuIGJlIHVzZWQuICUgaXMgYmFzZWQgb24gdGhlIGVsZW1lbnQncyBwb3NpdGlvbiB2YWx1ZSBhbmQgaXRzIHBhcmVudCdzIHdpZHRoIGFuZCBoZWlnaHQgZGltZW5zaW9ucy4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2FtZVBlcmNlbnRSYXRpbyA9ICgoc2FtZVJhdGlvSW5kaWNhdG9ycy5wb3NpdGlvbiA9PT0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0UG9zaXRpb24pICYmIChzYW1lUmF0aW9JbmRpY2F0b3JzLm15UGFyZW50ID09PSBjYWxsVW5pdENvbnZlcnNpb25EYXRhLmxhc3RQYXJlbnQpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRGV0ZXJtaW5lIGlmIHRoZSBzYW1lIGVtIHJhdGlvIGNhbiBiZSB1c2VkLiBlbSBpcyByZWxhdGl2ZSB0byB0aGUgZWxlbWVudCdzIGZvbnRTaXplLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYW1lRW1SYXRpbyA9IChzYW1lUmF0aW9JbmRpY2F0b3JzLmZvbnRTaXplID09PSBjYWxsVW5pdENvbnZlcnNpb25EYXRhLmxhc3RGb250U2l6ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTdG9yZSB0aGVzZSByYXRpbyBpbmRpY2F0b3JzIGNhbGwtd2lkZSBmb3IgdGhlIG5leHQgZWxlbWVudCB0byBjb21wYXJlIGFnYWluc3QuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0UGFyZW50ID0gc2FtZVJhdGlvSW5kaWNhdG9ycy5teVBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsVW5pdENvbnZlcnNpb25EYXRhLmxhc3RQb3NpdGlvbiA9IHNhbWVSYXRpb0luZGljYXRvcnMucG9zaXRpb247XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0Rm9udFNpemUgPSBzYW1lUmF0aW9JbmRpY2F0b3JzLmZvbnRTaXplO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVsZW1lbnQtU3BlY2lmaWMgVW5pdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBJRTggcm91bmRzIHRvIHRoZSBuZWFyZXN0IHBpeGVsIHdoZW4gcmV0dXJuaW5nIENTUyB2YWx1ZXMsIHRodXMgd2UgcGVyZm9ybSBjb252ZXJzaW9ucyB1c2luZyBhIG1lYXN1cmVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2YgMTAwIChpbnN0ZWFkIG9mIDEpIHRvIGdpdmUgb3VyIHJhdGlvcyBhIHByZWNpc2lvbiBvZiBhdCBsZWFzdCAyIGRlY2ltYWwgdmFsdWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBtZWFzdXJlbWVudCA9IDEwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFJhdGlvcyA9IHt9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFzYW1lRW1SYXRpbyB8fCAhc2FtZVBlcmNlbnRSYXRpbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZHVtbXkgPSBEYXRhKGVsZW1lbnQpLmlzU1ZHID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJyZWN0XCIpIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5pbml0KGR1bW15KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2FtZVJhdGlvSW5kaWNhdG9ycy5teVBhcmVudC5hcHBlbmRDaGlsZChkdW1teSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVG8gYWNjdXJhdGVseSBhbmQgY29uc2lzdGVudGx5IGNhbGN1bGF0ZSBjb252ZXJzaW9uIHJhdGlvcywgdGhlIGVsZW1lbnQncyBjYXNjYWRlZCBvdmVyZmxvdyBhbmQgYm94LXNpemluZyBhcmUgc3RyaXBwZWQuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNpbWlsYXJseSwgc2luY2Ugd2lkdGgvaGVpZ2h0IGNhbiBiZSBhcnRpZmljaWFsbHkgY29uc3RyYWluZWQgYnkgdGhlaXIgbWluLS9tYXgtIGVxdWl2YWxlbnRzLCB0aGVzZSBhcmUgY29udHJvbGxlZCBmb3IgYXMgd2VsbC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogT3ZlcmZsb3cgbXVzdCBiZSBhbHNvIGJlIGNvbnRyb2xsZWQgZm9yIHBlci1heGlzIHNpbmNlIHRoZSBvdmVyZmxvdyBwcm9wZXJ0eSBvdmVyd3JpdGVzIGl0cyBwZXItYXhpcyB2YWx1ZXMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChbIFwib3ZlcmZsb3dcIiwgXCJvdmVyZmxvd1hcIiwgXCJvdmVyZmxvd1lcIiBdLCBmdW5jdGlvbihpLCBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuQ1NTLnNldFByb3BlcnR5VmFsdWUoZHVtbXksIHByb3BlcnR5LCBcImhpZGRlblwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGR1bW15LCBcInBvc2l0aW9uXCIsIHNhbWVSYXRpb0luZGljYXRvcnMucG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5DU1Muc2V0UHJvcGVydHlWYWx1ZShkdW1teSwgXCJmb250U2l6ZVwiLCBzYW1lUmF0aW9JbmRpY2F0b3JzLmZvbnRTaXplKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuQ1NTLnNldFByb3BlcnR5VmFsdWUoZHVtbXksIFwiYm94U2l6aW5nXCIsIFwiY29udGVudC1ib3hcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogd2lkdGggYW5kIGhlaWdodCBhY3QgYXMgb3VyIHByb3h5IHByb3BlcnRpZXMgZm9yIG1lYXN1cmluZyB0aGUgaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgJSByYXRpb3MuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChbIFwibWluV2lkdGhcIiwgXCJtYXhXaWR0aFwiLCBcIndpZHRoXCIsIFwibWluSGVpZ2h0XCIsIFwibWF4SGVpZ2h0XCIsIFwiaGVpZ2h0XCIgXSwgZnVuY3Rpb24oaSwgcHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGR1bW15LCBwcm9wZXJ0eSwgbWVhc3VyZW1lbnQgKyBcIiVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBwYWRkaW5nTGVmdCBhcmJpdHJhcmlseSBhY3RzIGFzIG91ciBwcm94eSBwcm9wZXJ0eSBmb3IgdGhlIGVtIHJhdGlvLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5DU1Muc2V0UHJvcGVydHlWYWx1ZShkdW1teSwgXCJwYWRkaW5nTGVmdFwiLCBtZWFzdXJlbWVudCArIFwiZW1cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRGl2aWRlIHRoZSByZXR1cm5lZCB2YWx1ZSBieSB0aGUgbWVhc3VyZW1lbnQgdG8gZ2V0IHRoZSByYXRpbyBiZXR3ZWVuIDElIGFuZCAxcHguIERlZmF1bHQgdG8gMSBzaW5jZSB3b3JraW5nIHdpdGggMCBjYW4gcHJvZHVjZSBJbmZpbml0ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFJhdGlvcy5wZXJjZW50VG9QeFdpZHRoID0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0UGVyY2VudFRvUHhXaWR0aCA9IChwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGR1bW15LCBcIndpZHRoXCIsIG51bGwsIHRydWUpKSB8fCAxKSAvIG1lYXN1cmVtZW50OyAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFJhdGlvcy5wZXJjZW50VG9QeEhlaWdodCA9IGNhbGxVbml0Q29udmVyc2lvbkRhdGEubGFzdFBlcmNlbnRUb1B4SGVpZ2h0ID0gKHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZHVtbXksIFwiaGVpZ2h0XCIsIG51bGwsIHRydWUpKSB8fCAxKSAvIG1lYXN1cmVtZW50OyAvKiBHRVQgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFJhdGlvcy5lbVRvUHggPSBjYWxsVW5pdENvbnZlcnNpb25EYXRhLmxhc3RFbVRvUHggPSAocGFyc2VGbG9hdChDU1MuZ2V0UHJvcGVydHlWYWx1ZShkdW1teSwgXCJwYWRkaW5nTGVmdFwiKSkgfHwgMSkgLyBtZWFzdXJlbWVudDsgLyogR0VUICovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2FtZVJhdGlvSW5kaWNhdG9ycy5teVBhcmVudC5yZW1vdmVDaGlsZChkdW1teSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFJhdGlvcy5lbVRvUHggPSBjYWxsVW5pdENvbnZlcnNpb25EYXRhLmxhc3RFbVRvUHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MucGVyY2VudFRvUHhXaWR0aCA9IGNhbGxVbml0Q29udmVyc2lvbkRhdGEubGFzdFBlcmNlbnRUb1B4V2lkdGg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MucGVyY2VudFRvUHhIZWlnaHQgPSBjYWxsVW5pdENvbnZlcnNpb25EYXRhLmxhc3RQZXJjZW50VG9QeEhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRWxlbWVudC1BZ25vc3RpYyBVbml0c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFdoZXJlYXMgJSBhbmQgZW0gcmF0aW9zIGFyZSBkZXRlcm1pbmVkIG9uIGEgcGVyLWVsZW1lbnQgYmFzaXMsIHRoZSByZW0gdW5pdCBvbmx5IG5lZWRzIHRvIGJlIGNoZWNrZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbmNlIHBlciBjYWxsIHNpbmNlIGl0J3MgZXhjbHVzaXZlbHkgZGVwZW5kYW50IHVwb24gZG9jdW1lbnQuYm9keSdzIGZvbnRTaXplLiBJZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhhdCBjYWxjdWxhdGVVbml0UmF0aW9zKCkgaXMgYmVpbmcgcnVuIGR1cmluZyB0aGlzIGNhbGwsIHJlbVRvUHggd2lsbCBzdGlsbCBiZSBzZXQgdG8gaXRzIGRlZmF1bHQgdmFsdWUgb2YgbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbyB3ZSBjYWxjdWxhdGUgaXQgbm93LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsVW5pdENvbnZlcnNpb25EYXRhLnJlbVRvUHggPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRGVmYXVsdCB0byBicm93c2VycycgZGVmYXVsdCBmb250U2l6ZSBvZiAxNnB4IGluIHRoZSBjYXNlIG9mIDAuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxVbml0Q29udmVyc2lvbkRhdGEucmVtVG9QeCA9IHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZG9jdW1lbnQuYm9keSwgXCJmb250U2l6ZVwiKSkgfHwgMTY7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNpbWlsYXJseSwgdmlld3BvcnQgdW5pdHMgYXJlICUtcmVsYXRpdmUgdG8gdGhlIHdpbmRvdydzIGlubmVyIGRpbWVuc2lvbnMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxVbml0Q29udmVyc2lvbkRhdGEudndUb1B4ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxVbml0Q29udmVyc2lvbkRhdGEudndUb1B4ID0gcGFyc2VGbG9hdCh3aW5kb3cuaW5uZXJXaWR0aCkgLyAxMDA7IC8qIEdFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsVW5pdENvbnZlcnNpb25EYXRhLnZoVG9QeCA9IHBhcnNlRmxvYXQod2luZG93LmlubmVySGVpZ2h0KSAvIDEwMDsgLyogR0VUICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFJhdGlvcy5yZW1Ub1B4ID0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5yZW1Ub1B4O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MudndUb1B4ID0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS52d1RvUHg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFJhdGlvcy52aFRvUHggPSBjYWxsVW5pdENvbnZlcnNpb25EYXRhLnZoVG9QeDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5kZWJ1ZyA+PSAxKSBjb25zb2xlLmxvZyhcIlVuaXQgcmF0aW9zOiBcIiArIEpTT04uc3RyaW5naWZ5KHVuaXRSYXRpb3MpLCBlbGVtZW50KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1bml0UmF0aW9zO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFVuaXQgQ29udmVyc2lvblxuICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSAqIGFuZCAvIG9wZXJhdG9ycywgd2hpY2ggYXJlIG5vdCBwYXNzZWQgaW4gd2l0aCBhbiBhc3NvY2lhdGVkIHVuaXQsIGluaGVyZW50bHkgdXNlIHN0YXJ0VmFsdWUncyB1bml0LiBTa2lwIHZhbHVlIGFuZCB1bml0IGNvbnZlcnNpb24uICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoL1tcXC8qXS8udGVzdChvcGVyYXRvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZVVuaXRUeXBlID0gc3RhcnRWYWx1ZVVuaXRUeXBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgc3RhcnRWYWx1ZSBhbmQgZW5kVmFsdWUgZGlmZmVyIGluIHVuaXQgdHlwZSwgY29udmVydCBzdGFydFZhbHVlIGludG8gdGhlIHNhbWUgdW5pdCB0eXBlIGFzIGVuZFZhbHVlIHNvIHRoYXQgaWYgZW5kVmFsdWVVbml0VHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgaXMgYSByZWxhdGl2ZSB1bml0ICglLCBlbSwgcmVtKSwgdGhlIHZhbHVlcyBzZXQgZHVyaW5nIHR3ZWVuaW5nIHdpbGwgY29udGludWUgdG8gYmUgYWNjdXJhdGVseSByZWxhdGl2ZSBldmVuIGlmIHRoZSBtZXRyaWNzIHRoZXkgZGVwZW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvbiBhcmUgZHluYW1pY2FsbHkgY2hhbmdpbmcgZHVyaW5nIHRoZSBjb3Vyc2Ugb2YgdGhlIGFuaW1hdGlvbi4gQ29udmVyc2VseSwgaWYgd2UgYWx3YXlzIG5vcm1hbGl6ZWQgaW50byBweCBhbmQgdXNlZCBweCBmb3Igc2V0dGluZyB2YWx1ZXMsIHRoZSBweCByYXRpb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgd291bGQgYmVjb21lIHN0YWxlIGlmIHRoZSBvcmlnaW5hbCB1bml0IGJlaW5nIGFuaW1hdGVkIHRvd2FyZCB3YXMgcmVsYXRpdmUgYW5kIHRoZSB1bmRlcmx5aW5nIG1ldHJpY3MgY2hhbmdlIGR1cmluZyB0aGUgYW5pbWF0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogU2luY2UgMCBpcyAwIGluIGFueSB1bml0IHR5cGUsIG5vIGNvbnZlcnNpb24gaXMgbmVjZXNzYXJ5IHdoZW4gc3RhcnRWYWx1ZSBpcyAwIC0tIHdlIGp1c3Qgc3RhcnQgYXQgMCB3aXRoIGVuZFZhbHVlVW5pdFR5cGUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKChzdGFydFZhbHVlVW5pdFR5cGUgIT09IGVuZFZhbHVlVW5pdFR5cGUpICYmIHN0YXJ0VmFsdWUgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBVbml0IGNvbnZlcnNpb24gaXMgYWxzbyBza2lwcGVkIHdoZW4gZW5kVmFsdWUgaXMgMCwgYnV0ICpzdGFydFZhbHVlVW5pdFR5cGUqIG11c3QgYmUgdXNlZCBmb3IgdHdlZW4gdmFsdWVzIHRvIHJlbWFpbiBhY2N1cmF0ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBTa2lwcGluZyB1bml0IGNvbnZlcnNpb24gaGVyZSBtZWFucyB0aGF0IGlmIGVuZFZhbHVlVW5pdFR5cGUgd2FzIG9yaWdpbmFsbHkgYSByZWxhdGl2ZSB1bml0LCB0aGUgYW5pbWF0aW9uIHdvbid0IHJlbGF0aXZlbHlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaCB0aGUgdW5kZXJseWluZyBtZXRyaWNzIGlmIHRoZXkgY2hhbmdlLCBidXQgdGhpcyBpcyBhY2NlcHRhYmxlIHNpbmNlIHdlJ3JlIGFuaW1hdGluZyB0b3dhcmQgaW52aXNpYmlsaXR5IGluc3RlYWQgb2YgdG93YXJkIHZpc2liaWxpdHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpY2ggcmVtYWlucyBwYXN0IHRoZSBwb2ludCBvZiB0aGUgYW5pbWF0aW9uJ3MgY29tcGxldGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZW5kVmFsdWUgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWVVbml0VHlwZSA9IHN0YXJ0VmFsdWVVbml0VHlwZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBCeSB0aGlzIHBvaW50LCB3ZSBjYW5ub3QgYXZvaWQgdW5pdCBjb252ZXJzaW9uIChpdCdzIHVuZGVzaXJhYmxlIHNpbmNlIGl0IGNhdXNlcyBsYXlvdXQgdGhyYXNoaW5nKS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSWYgd2UgaGF2ZW4ndCBhbHJlYWR5LCB3ZSB0cmlnZ2VyIGNhbGN1bGF0ZVVuaXRSYXRpb3MoKSwgd2hpY2ggcnVucyBvbmNlIHBlciBlbGVtZW50IHBlciBjYWxsLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50VW5pdENvbnZlcnNpb25EYXRhID0gZWxlbWVudFVuaXRDb252ZXJzaW9uRGF0YSB8fCBjYWxjdWxhdGVVbml0UmF0aW9zKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVGhlIGZvbGxvd2luZyBSZWdFeCBtYXRjaGVzIENTUyBwcm9wZXJ0aWVzIHRoYXQgaGF2ZSB0aGVpciAlIHZhbHVlcyBtZWFzdXJlZCByZWxhdGl2ZSB0byB0aGUgeC1heGlzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBXM0Mgc3BlYyBtYW5kYXRlcyB0aGF0IGFsbCBvZiBtYXJnaW4gYW5kIHBhZGRpbmcncyBwcm9wZXJ0aWVzIChldmVuIHRvcCBhbmQgYm90dG9tKSBhcmUgJS1yZWxhdGl2ZSB0byB0aGUgKndpZHRoKiBvZiB0aGUgcGFyZW50IGVsZW1lbnQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBheGlzID0gKC9tYXJnaW58cGFkZGluZ3xsZWZ0fHJpZ2h0fHdpZHRofHRleHR8d29yZHxsZXR0ZXIvaS50ZXN0KHByb3BlcnR5KSB8fCAvWCQvLnRlc3QocHJvcGVydHkpIHx8IHByb3BlcnR5ID09PSBcInhcIikgPyBcInhcIiA6IFwieVwiO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEluIG9yZGVyIHRvIGF2b2lkIGdlbmVyYXRpbmcgbl4yIGJlc3Bva2UgY29udmVyc2lvbiBmdW5jdGlvbnMsIHVuaXQgY29udmVyc2lvbiBpcyBhIHR3by1zdGVwIHByb2Nlc3M6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDEpIENvbnZlcnQgc3RhcnRWYWx1ZSBpbnRvIHBpeGVscy4gMikgQ29udmVydCB0aGlzIG5ldyBwaXhlbCB2YWx1ZSBpbnRvIGVuZFZhbHVlJ3MgdW5pdCB0eXBlLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHN0YXJ0VmFsdWVVbml0VHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIiVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiB0cmFuc2xhdGVYIGFuZCB0cmFuc2xhdGVZIGFyZSB0aGUgb25seSBwcm9wZXJ0aWVzIHRoYXQgYXJlICUtcmVsYXRpdmUgdG8gYW4gZWxlbWVudCdzIG93biBkaW1lbnNpb25zIC0tIG5vdCBpdHMgcGFyZW50J3MgZGltZW5zaW9ucy5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eSBkb2VzIG5vdCBpbmNsdWRlIGEgc3BlY2lhbCBjb252ZXJzaW9uIHByb2Nlc3MgdG8gYWNjb3VudCBmb3IgdGhpcyBiZWhhdmlvci4gVGhlcmVmb3JlLCBhbmltYXRpbmcgdHJhbnNsYXRlWC9ZIGZyb20gYSAlIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub24tJSB2YWx1ZSB3aWxsIHByb2R1Y2UgYW4gaW5jb3JyZWN0IHN0YXJ0IHZhbHVlLiBGb3J0dW5hdGVseSwgdGhpcyBzb3J0IG9mIGNyb3NzLXVuaXQgY29udmVyc2lvbiBpcyByYXJlbHkgZG9uZSBieSB1c2VycyBpbiBwcmFjdGljZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlICo9IChheGlzID09PSBcInhcIiA/IGVsZW1lbnRVbml0Q29udmVyc2lvbkRhdGEucGVyY2VudFRvUHhXaWR0aCA6IGVsZW1lbnRVbml0Q29udmVyc2lvbkRhdGEucGVyY2VudFRvUHhIZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwicHhcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBweCBhY3RzIGFzIG91ciBtaWRwb2ludCBpbiB0aGUgdW5pdCBjb252ZXJzaW9uIHByb2Nlc3M7IGRvIG5vdGhpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSAqPSBlbGVtZW50VW5pdENvbnZlcnNpb25EYXRhW3N0YXJ0VmFsdWVVbml0VHlwZSArIFwiVG9QeFwiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEludmVydCB0aGUgcHggcmF0aW9zIHRvIGNvbnZlcnQgaW50byB0byB0aGUgdGFyZ2V0IHVuaXQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoZW5kVmFsdWVVbml0VHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIiVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlICo9IDEgLyAoYXhpcyA9PT0gXCJ4XCIgPyBlbGVtZW50VW5pdENvbnZlcnNpb25EYXRhLnBlcmNlbnRUb1B4V2lkdGggOiBlbGVtZW50VW5pdENvbnZlcnNpb25EYXRhLnBlcmNlbnRUb1B4SGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInB4XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogc3RhcnRWYWx1ZSBpcyBhbHJlYWR5IGluIHB4LCBkbyBub3RoaW5nOyB3ZSdyZSBkb25lLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgKj0gMSAvIGVsZW1lbnRVbml0Q29udmVyc2lvbkRhdGFbZW5kVmFsdWVVbml0VHlwZSArIFwiVG9QeFwiXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVsYXRpdmUgVmFsdWVzXG4gICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE9wZXJhdG9yIGxvZ2ljIG11c3QgYmUgcGVyZm9ybWVkIGxhc3Qgc2luY2UgaXQgcmVxdWlyZXMgdW5pdC1ub3JtYWxpemVkIHN0YXJ0IGFuZCBlbmQgdmFsdWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogUmVsYXRpdmUgKnBlcmNlbnQgdmFsdWVzKiBkbyBub3QgYmVoYXZlIGhvdyBtb3N0IHBlb3BsZSB0aGluazsgd2hpbGUgb25lIHdvdWxkIGV4cGVjdCBcIis9NTAlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGluY3JlYXNlIHRoZSBwcm9wZXJ0eSAxLjV4IGl0cyBjdXJyZW50IHZhbHVlLCBpdCBpbiBmYWN0IGluY3JlYXNlcyB0aGUgcGVyY2VudCB1bml0cyBpbiBhYnNvbHV0ZSB0ZXJtczpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDUwIHBvaW50cyBpcyBhZGRlZCBvbiB0b3Agb2YgdGhlIGN1cnJlbnQgJSB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAob3BlcmF0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiK1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IHN0YXJ0VmFsdWUgKyBlbmRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiLVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IHN0YXJ0VmFsdWUgLSBlbmRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiKlwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IHN0YXJ0VmFsdWUgKiBlbmRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiL1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IHN0YXJ0VmFsdWUgLyBlbmRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW5zQ29udGFpbmVyIFB1c2hcbiAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBDb25zdHJ1Y3QgdGhlIHBlci1wcm9wZXJ0eSB0d2VlbiBvYmplY3QsIGFuZCBwdXNoIGl0IHRvIHRoZSBlbGVtZW50J3MgdHdlZW5zQ29udGFpbmVyLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW5zQ29udGFpbmVyW3Byb3BlcnR5XSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZTogcm9vdFByb3BlcnR5VmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZTogc3RhcnRWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWU6IHN0YXJ0VmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWU6IGVuZFZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRUeXBlOiBlbmRWYWx1ZVVuaXRUeXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZzogZWFzaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkuZGVidWcpIGNvbnNvbGUubG9nKFwidHdlZW5zQ29udGFpbmVyIChcIiArIHByb3BlcnR5ICsgXCIpOiBcIiArIEpTT04uc3RyaW5naWZ5KHR3ZWVuc0NvbnRhaW5lcltwcm9wZXJ0eV0pLCBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIEFsb25nIHdpdGggaXRzIHByb3BlcnR5IGRhdGEsIHN0b3JlIGEgcmVmZXJlbmNlIHRvIHRoZSBlbGVtZW50IGl0c2VsZiBvbnRvIHR3ZWVuc0NvbnRhaW5lci4gKi9cbiAgICAgICAgICAgICAgICAgICAgdHdlZW5zQ29udGFpbmVyLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICBDYWxsIFB1c2hcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIC8qIE5vdGU6IHR3ZWVuc0NvbnRhaW5lciBjYW4gYmUgZW1wdHkgaWYgYWxsIG9mIHRoZSBwcm9wZXJ0aWVzIGluIHRoaXMgY2FsbCdzIHByb3BlcnR5IG1hcCB3ZXJlIHNraXBwZWQgZHVlIHRvIG5vdFxuICAgICAgICAgICAgICAgICAgIGJlaW5nIHN1cHBvcnRlZCBieSB0aGUgYnJvd3Nlci4gVGhlIGVsZW1lbnQgcHJvcGVydHkgaXMgdXNlZCBmb3IgY2hlY2tpbmcgdGhhdCB0aGUgdHdlZW5zQ29udGFpbmVyIGhhcyBiZWVuIGFwcGVuZGVkIHRvLiAqL1xuICAgICAgICAgICAgICAgIGlmICh0d2VlbnNDb250YWluZXIuZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAvKiBBcHBseSB0aGUgXCJ2ZWxvY2l0eS1hbmltYXRpbmdcIiBpbmRpY2F0b3IgY2xhc3MuICovXG4gICAgICAgICAgICAgICAgICAgIENTUy5WYWx1ZXMuYWRkQ2xhc3MoZWxlbWVudCwgXCJ2ZWxvY2l0eS1hbmltYXRpbmdcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogVGhlIGNhbGwgYXJyYXkgaG91c2VzIHRoZSB0d2VlbnNDb250YWluZXJzIGZvciBlYWNoIGVsZW1lbnQgYmVpbmcgYW5pbWF0ZWQgaW4gdGhlIGN1cnJlbnQgY2FsbC4gKi9cbiAgICAgICAgICAgICAgICAgICAgY2FsbC5wdXNoKHR3ZWVuc0NvbnRhaW5lcik7XG5cbiAgICAgICAgICAgICAgICAgICAgLyogU3RvcmUgdGhlIHR3ZWVuc0NvbnRhaW5lciBhbmQgb3B0aW9ucyBpZiB3ZSdyZSB3b3JraW5nIG9uIHRoZSBkZWZhdWx0IGVmZmVjdHMgcXVldWUsIHNvIHRoYXQgdGhleSBjYW4gYmUgdXNlZCBieSB0aGUgcmV2ZXJzZSBjb21tYW5kLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5xdWV1ZSA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS50d2VlbnNDb250YWluZXIgPSB0d2VlbnNDb250YWluZXI7XG4gICAgICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLm9wdHMgPSBvcHRzO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogU3dpdGNoIG9uIHRoZSBlbGVtZW50J3MgYW5pbWF0aW5nIGZsYWcuICovXG4gICAgICAgICAgICAgICAgICAgIERhdGEoZWxlbWVudCkuaXNBbmltYXRpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIE9uY2UgdGhlIGZpbmFsIGVsZW1lbnQgaW4gdGhpcyBjYWxsJ3MgZWxlbWVudCBzZXQgaGFzIGJlZW4gcHJvY2Vzc2VkLCBwdXNoIHRoZSBjYWxsIGFycmF5IG9udG9cbiAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuY2FsbHMgZm9yIHRoZSBhbmltYXRpb24gdGljayB0byBpbW1lZGlhdGVseSBiZWdpbiBwcm9jZXNzaW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudHNJbmRleCA9PT0gZWxlbWVudHNMZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBBZGQgdGhlIGN1cnJlbnQgY2FsbCBwbHVzIGl0cyBhc3NvY2lhdGVkIG1ldGFkYXRhICh0aGUgZWxlbWVudCBzZXQgYW5kIHRoZSBjYWxsJ3Mgb3B0aW9ucykgb250byB0aGUgZ2xvYmFsIGNhbGwgY29udGFpbmVyLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgQW55dGhpbmcgb24gdGhpcyBjYWxsIGNvbnRhaW5lciBpcyBzdWJqZWN0ZWQgdG8gdGljaygpIHByb2Nlc3NpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5TdGF0ZS5jYWxscy5wdXNoKFsgY2FsbCwgZWxlbWVudHMsIG9wdHMsIG51bGwsIHByb21pc2VEYXRhLnJlc29sdmVyIF0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgYW5pbWF0aW9uIHRpY2sgaXNuJ3QgcnVubmluZywgc3RhcnQgaXQuIChWZWxvY2l0eSBzaHV0cyBpdCBvZmYgd2hlbiB0aGVyZSBhcmUgbm8gYWN0aXZlIGNhbGxzIHRvIHByb2Nlc3MuKSAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFZlbG9jaXR5LlN0YXRlLmlzVGlja2luZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5TdGF0ZS5pc1RpY2tpbmcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU3RhcnQgdGhlIHRpY2sgbG9vcC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50c0luZGV4Kys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIFdoZW4gdGhlIHF1ZXVlIG9wdGlvbiBpcyBzZXQgdG8gZmFsc2UsIHRoZSBjYWxsIHNraXBzIHRoZSBlbGVtZW50J3MgcXVldWUgYW5kIGZpcmVzIGltbWVkaWF0ZWx5LiAqL1xuICAgICAgICAgICAgaWYgKG9wdHMucXVldWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgLyogU2luY2UgdGhpcyBidWlsZFF1ZXVlIGNhbGwgZG9lc24ndCByZXNwZWN0IHRoZSBlbGVtZW50J3MgZXhpc3RpbmcgcXVldWUgKHdoaWNoIGlzIHdoZXJlIGEgZGVsYXkgb3B0aW9uIHdvdWxkIGhhdmUgYmVlbiBhcHBlbmRlZCksXG4gICAgICAgICAgICAgICAgICAgd2UgbWFudWFsbHkgaW5qZWN0IHRoZSBkZWxheSBwcm9wZXJ0eSBoZXJlIHdpdGggYW4gZXhwbGljaXQgc2V0VGltZW91dC4gKi9cbiAgICAgICAgICAgICAgICBpZiAob3B0cy5kZWxheSkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGJ1aWxkUXVldWUsIG9wdHMuZGVsYXkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkUXVldWUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBPdGhlcndpc2UsIHRoZSBjYWxsIHVuZGVyZ29lcyBlbGVtZW50IHF1ZXVlaW5nIGFzIG5vcm1hbC4gKi9cbiAgICAgICAgICAgIC8qIE5vdGU6IFRvIGludGVyb3BlcmF0ZSB3aXRoIGpRdWVyeSwgVmVsb2NpdHkgdXNlcyBqUXVlcnkncyBvd24gJC5xdWV1ZSgpIHN0YWNrIGZvciBxdWV1aW5nIGxvZ2ljLiAqL1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkLnF1ZXVlKGVsZW1lbnQsIG9wdHMucXVldWUsIGZ1bmN0aW9uKG5leHQsIGNsZWFyUXVldWUpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGNsZWFyUXVldWUgZmxhZyB3YXMgcGFzc2VkIGluIGJ5IHRoZSBzdG9wIGNvbW1hbmQsIHJlc29sdmUgdGhpcyBjYWxsJ3MgcHJvbWlzZS4gKFByb21pc2VzIGNhbiBvbmx5IGJlIHJlc29sdmVkIG9uY2UsXG4gICAgICAgICAgICAgICAgICAgICAgIHNvIGl0J3MgZmluZSBpZiB0aGlzIGlzIHJlcGVhdGVkbHkgdHJpZ2dlcmVkIGZvciBlYWNoIGVsZW1lbnQgaW4gdGhlIGFzc29jaWF0ZWQgY2FsbC4pICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChjbGVhclF1ZXVlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZURhdGEucHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VEYXRhLnJlc29sdmVyKGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLyogRG8gbm90IGNvbnRpbnVlIHdpdGggYW5pbWF0aW9uIHF1ZXVlaW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKiBUaGlzIGZsYWcgaW5kaWNhdGVzIHRvIHRoZSB1cGNvbWluZyBjb21wbGV0ZUNhbGwoKSBmdW5jdGlvbiB0aGF0IHRoaXMgcXVldWUgZW50cnkgd2FzIGluaXRpYXRlZCBieSBWZWxvY2l0eS5cbiAgICAgICAgICAgICAgICAgICAgICAgU2VlIGNvbXBsZXRlQ2FsbCgpIGZvciBmdXJ0aGVyIGRldGFpbHMuICovXG4gICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LnZlbG9jaXR5UXVldWVFbnRyeUZsYWcgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGJ1aWxkUXVldWUobmV4dCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICBBdXRvLURlcXVldWluZ1xuICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICAvKiBBcyBwZXIgalF1ZXJ5J3MgJC5xdWV1ZSgpIGJlaGF2aW9yLCB0byBmaXJlIHRoZSBmaXJzdCBub24tY3VzdG9tLXF1ZXVlIGVudHJ5IG9uIGFuIGVsZW1lbnQsIHRoZSBlbGVtZW50XG4gICAgICAgICAgICAgICBtdXN0IGJlIGRlcXVldWVkIGlmIGl0cyBxdWV1ZSBzdGFjayBjb25zaXN0cyAqc29sZWx5KiBvZiB0aGUgY3VycmVudCBjYWxsLiAoVGhpcyBjYW4gYmUgZGV0ZXJtaW5lZCBieSBjaGVja2luZ1xuICAgICAgICAgICAgICAgZm9yIHRoZSBcImlucHJvZ3Jlc3NcIiBpdGVtIHRoYXQgalF1ZXJ5IHByZXBlbmRzIHRvIGFjdGl2ZSBxdWV1ZSBzdGFjayBhcnJheXMuKSBSZWdhcmRsZXNzLCB3aGVuZXZlciB0aGUgZWxlbWVudCdzXG4gICAgICAgICAgICAgICBxdWV1ZSBpcyBmdXJ0aGVyIGFwcGVuZGVkIHdpdGggYWRkaXRpb25hbCBpdGVtcyAtLSBpbmNsdWRpbmcgJC5kZWxheSgpJ3Mgb3IgZXZlbiAkLmFuaW1hdGUoKSBjYWxscywgdGhlIHF1ZXVlJ3NcbiAgICAgICAgICAgICAgIGZpcnN0IGVudHJ5IGlzIGF1dG9tYXRpY2FsbHkgZmlyZWQuIFRoaXMgYmVoYXZpb3IgY29udHJhc3RzIHRoYXQgb2YgY3VzdG9tIHF1ZXVlcywgd2hpY2ggbmV2ZXIgYXV0by1maXJlLiAqL1xuICAgICAgICAgICAgLyogTm90ZTogV2hlbiBhbiBlbGVtZW50IHNldCBpcyBiZWluZyBzdWJqZWN0ZWQgdG8gYSBub24tcGFyYWxsZWwgVmVsb2NpdHkgY2FsbCwgdGhlIGFuaW1hdGlvbiB3aWxsIG5vdCBiZWdpbiB1bnRpbFxuICAgICAgICAgICAgICAgZWFjaCBvbmUgb2YgdGhlIGVsZW1lbnRzIGluIHRoZSBzZXQgaGFzIHJlYWNoZWQgdGhlIGVuZCBvZiBpdHMgaW5kaXZpZHVhbGx5IHByZS1leGlzdGluZyBxdWV1ZSBjaGFpbi4gKi9cbiAgICAgICAgICAgIC8qIE5vdGU6IFVuZm9ydHVuYXRlbHksIG1vc3QgcGVvcGxlIGRvbid0IGZ1bGx5IGdyYXNwIGpRdWVyeSdzIHBvd2VyZnVsLCB5ZXQgcXVpcmt5LCAkLnF1ZXVlKCkgZnVuY3Rpb24uXG4gICAgICAgICAgICAgICBMZWFuIG1vcmUgaGVyZTogaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMDU4MTU4L2Nhbi1zb21lYm9keS1leHBsYWluLWpxdWVyeS1xdWV1ZS10by1tZSAqL1xuICAgICAgICAgICAgaWYgKChvcHRzLnF1ZXVlID09PSBcIlwiIHx8IG9wdHMucXVldWUgPT09IFwiZnhcIikgJiYgJC5xdWV1ZShlbGVtZW50KVswXSAhPT0gXCJpbnByb2dyZXNzXCIpIHtcbiAgICAgICAgICAgICAgICAkLmRlcXVldWUoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgRWxlbWVudCBTZXQgSXRlcmF0aW9uXG4gICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIC8qIElmIHRoZSBcIm5vZGVUeXBlXCIgcHJvcGVydHkgZXhpc3RzIG9uIHRoZSBlbGVtZW50cyB2YXJpYWJsZSwgd2UncmUgYW5pbWF0aW5nIGEgc2luZ2xlIGVsZW1lbnQuXG4gICAgICAgICAgIFBsYWNlIGl0IGluIGFuIGFycmF5IHNvIHRoYXQgJC5lYWNoKCkgY2FuIGl0ZXJhdGUgb3ZlciBpdC4gKi9cbiAgICAgICAgJC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbihpLCBlbGVtZW50KSB7XG4gICAgICAgICAgICAvKiBFbnN1cmUgZWFjaCBlbGVtZW50IGluIGEgc2V0IGhhcyBhIG5vZGVUeXBlIChpcyBhIHJlYWwgZWxlbWVudCkgdG8gYXZvaWQgdGhyb3dpbmcgZXJyb3JzLiAqL1xuICAgICAgICAgICAgaWYgKFR5cGUuaXNOb2RlKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzc0VsZW1lbnQuY2FsbChlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICBPcHRpb246IExvb3BcbiAgICAgICAgKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIC8qIFRoZSBsb29wIG9wdGlvbiBhY2NlcHRzIGFuIGludGVnZXIgaW5kaWNhdGluZyBob3cgbWFueSB0aW1lcyB0aGUgZWxlbWVudCBzaG91bGQgbG9vcCBiZXR3ZWVuIHRoZSB2YWx1ZXMgaW4gdGhlXG4gICAgICAgICAgIGN1cnJlbnQgY2FsbCdzIHByb3BlcnRpZXMgbWFwIGFuZCB0aGUgZWxlbWVudCdzIHByb3BlcnR5IHZhbHVlcyBwcmlvciB0byB0aGlzIGNhbGwuICovXG4gICAgICAgIC8qIE5vdGU6IFRoZSBsb29wIG9wdGlvbidzIGxvZ2ljIGlzIHBlcmZvcm1lZCBoZXJlIC0tIGFmdGVyIGVsZW1lbnQgcHJvY2Vzc2luZyAtLSBiZWNhdXNlIHRoZSBjdXJyZW50IGNhbGwgbmVlZHNcbiAgICAgICAgICAgdG8gdW5kZXJnbyBpdHMgcXVldWUgaW5zZXJ0aW9uIHByaW9yIHRvIHRoZSBsb29wIG9wdGlvbiBnZW5lcmF0aW5nIGl0cyBzZXJpZXMgb2YgY29uc3RpdHVlbnQgXCJyZXZlcnNlXCIgY2FsbHMsXG4gICAgICAgICAgIHdoaWNoIGNoYWluIGFmdGVyIHRoZSBjdXJyZW50IGNhbGwuIFR3byByZXZlcnNlIGNhbGxzICh0d28gXCJhbHRlcm5hdGlvbnNcIikgY29uc3RpdHV0ZSBvbmUgbG9vcC4gKi9cbiAgICAgICAgdmFyIG9wdHMgPSAkLmV4dGVuZCh7fSwgVmVsb2NpdHkuZGVmYXVsdHMsIG9wdGlvbnMpLFxuICAgICAgICAgICAgcmV2ZXJzZUNhbGxzQ291bnQ7XG5cbiAgICAgICAgb3B0cy5sb29wID0gcGFyc2VJbnQob3B0cy5sb29wKTtcbiAgICAgICAgcmV2ZXJzZUNhbGxzQ291bnQgPSAob3B0cy5sb29wICogMikgLSAxO1xuXG4gICAgICAgIGlmIChvcHRzLmxvb3ApIHtcbiAgICAgICAgICAgIC8qIERvdWJsZSB0aGUgbG9vcCBjb3VudCB0byBjb252ZXJ0IGl0IGludG8gaXRzIGFwcHJvcHJpYXRlIG51bWJlciBvZiBcInJldmVyc2VcIiBjYWxscy5cbiAgICAgICAgICAgICAgIFN1YnRyYWN0IDEgZnJvbSB0aGUgcmVzdWx0aW5nIHZhbHVlIHNpbmNlIHRoZSBjdXJyZW50IGNhbGwgaXMgaW5jbHVkZWQgaW4gdGhlIHRvdGFsIGFsdGVybmF0aW9uIGNvdW50LiAqL1xuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCByZXZlcnNlQ2FsbHNDb3VudDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgLyogU2luY2UgdGhlIGxvZ2ljIGZvciB0aGUgcmV2ZXJzZSBhY3Rpb24gb2NjdXJzIGluc2lkZSBRdWV1ZWluZyBhbmQgdGhlcmVmb3JlIHRoaXMgY2FsbCdzIG9wdGlvbnMgb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgaXNuJ3QgcGFyc2VkIHVudGlsIHRoZW4gYXMgd2VsbCwgdGhlIGN1cnJlbnQgY2FsbCdzIGRlbGF5IG9wdGlvbiBtdXN0IGJlIGV4cGxpY2l0bHkgcGFzc2VkIGludG8gdGhlIHJldmVyc2VcbiAgICAgICAgICAgICAgICAgICBjYWxsIHNvIHRoYXQgdGhlIGRlbGF5IGxvZ2ljIHRoYXQgb2NjdXJzIGluc2lkZSAqUHJlLVF1ZXVlaW5nKiBjYW4gcHJvY2VzcyBpdC4gKi9cbiAgICAgICAgICAgICAgICB2YXIgcmV2ZXJzZU9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGF5OiBvcHRzLmRlbGF5LFxuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzczogb3B0cy5wcm9ncmVzc1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvKiBJZiBhIGNvbXBsZXRlIGNhbGxiYWNrIHdhcyBwYXNzZWQgaW50byB0aGlzIGNhbGwsIHRyYW5zZmVyIGl0IHRvIHRoZSBsb29wIHJlZGlyZWN0J3MgZmluYWwgXCJyZXZlcnNlXCIgY2FsbFxuICAgICAgICAgICAgICAgICAgIHNvIHRoYXQgaXQncyB0cmlnZ2VyZWQgd2hlbiB0aGUgZW50aXJlIHJlZGlyZWN0IGlzIGNvbXBsZXRlIChhbmQgbm90IHdoZW4gdGhlIHZlcnkgZmlyc3QgYW5pbWF0aW9uIGlzIGNvbXBsZXRlKS4gKi9cbiAgICAgICAgICAgICAgICBpZiAoeCA9PT0gcmV2ZXJzZUNhbGxzQ291bnQgLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldmVyc2VPcHRpb25zLmRpc3BsYXkgPSBvcHRzLmRpc3BsYXk7XG4gICAgICAgICAgICAgICAgICAgIHJldmVyc2VPcHRpb25zLnZpc2liaWxpdHkgPSBvcHRzLnZpc2liaWxpdHk7XG4gICAgICAgICAgICAgICAgICAgIHJldmVyc2VPcHRpb25zLmNvbXBsZXRlID0gb3B0cy5jb21wbGV0ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBhbmltYXRlKGVsZW1lbnRzLCBcInJldmVyc2VcIiwgcmV2ZXJzZU9wdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqKioqKioqKioqKioqKlxuICAgICAgICAgICAgQ2hhaW5pbmdcbiAgICAgICAgKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIC8qIFJldHVybiB0aGUgZWxlbWVudHMgYmFjayB0byB0aGUgY2FsbCBjaGFpbiwgd2l0aCB3cmFwcGVkIGVsZW1lbnRzIHRha2luZyBwcmVjZWRlbmNlIGluIGNhc2UgVmVsb2NpdHkgd2FzIGNhbGxlZCB2aWEgdGhlICQuZm4uIGV4dGVuc2lvbi4gKi9cbiAgICAgICAgcmV0dXJuIGdldENoYWluKCk7XG4gICAgfTtcblxuICAgIC8qIFR1cm4gVmVsb2NpdHkgaW50byB0aGUgYW5pbWF0aW9uIGZ1bmN0aW9uLCBleHRlbmRlZCB3aXRoIHRoZSBwcmUtZXhpc3RpbmcgVmVsb2NpdHkgb2JqZWN0LiAqL1xuICAgIFZlbG9jaXR5ID0gJC5leHRlbmQoYW5pbWF0ZSwgVmVsb2NpdHkpO1xuICAgIC8qIEZvciBsZWdhY3kgc3VwcG9ydCwgYWxzbyBleHBvc2UgdGhlIGxpdGVyYWwgYW5pbWF0ZSBtZXRob2QuICovXG4gICAgVmVsb2NpdHkuYW5pbWF0ZSA9IGFuaW1hdGU7XG5cbiAgICAvKioqKioqKioqKioqKipcbiAgICAgICAgVGltaW5nXG4gICAgKioqKioqKioqKioqKiovXG5cbiAgICAvKiBUaWNrZXIgZnVuY3Rpb24uICovXG4gICAgdmFyIHRpY2tlciA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgckFGU2hpbTtcblxuICAgIC8qIEluYWN0aXZlIGJyb3dzZXIgdGFicyBwYXVzZSByQUYsIHdoaWNoIHJlc3VsdHMgaW4gYWxsIGFjdGl2ZSBhbmltYXRpb25zIGltbWVkaWF0ZWx5IHNwcmludGluZyB0byB0aGVpciBjb21wbGV0aW9uIHN0YXRlcyB3aGVuIHRoZSB0YWIgcmVmb2N1c2VzLlxuICAgICAgIFRvIGdldCBhcm91bmQgdGhpcywgd2UgZHluYW1pY2FsbHkgc3dpdGNoIHJBRiB0byBzZXRUaW1lb3V0ICh3aGljaCB0aGUgYnJvd3NlciAqZG9lc24ndCogcGF1c2UpIHdoZW4gdGhlIHRhYiBsb3NlcyBmb2N1cy4gV2Ugc2tpcCB0aGlzIGZvciBtb2JpbGVcbiAgICAgICBkZXZpY2VzIHRvIGF2b2lkIHdhc3RpbmcgYmF0dGVyeSBwb3dlciBvbiBpbmFjdGl2ZSB0YWJzLiAqL1xuICAgIC8qIE5vdGU6IFRhYiBmb2N1cyBkZXRlY3Rpb24gZG9lc24ndCB3b3JrIG9uIG9sZGVyIHZlcnNpb25zIG9mIElFLCBidXQgdGhhdCdzIG9rYXkgc2luY2UgdGhleSBkb24ndCBzdXBwb3J0IHJBRiB0byBiZWdpbiB3aXRoLiAqL1xuICAgIGlmICghVmVsb2NpdHkuU3RhdGUuaXNNb2JpbGUgJiYgZG9jdW1lbnQuaGlkZGVuICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInZpc2liaWxpdHljaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvKiBSZWFzc2lnbiB0aGUgckFGIGZ1bmN0aW9uICh3aGljaCB0aGUgZ2xvYmFsIHRpY2soKSBmdW5jdGlvbiB1c2VzKSBiYXNlZCBvbiB0aGUgdGFiJ3MgZm9jdXMgc3RhdGUuICovXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuaGlkZGVuKSB7XG4gICAgICAgICAgICAgICAgdGlja2VyID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgLyogVGhlIHRpY2sgZnVuY3Rpb24gbmVlZHMgYSB0cnV0aHkgZmlyc3QgYXJndW1lbnQgaW4gb3JkZXIgdG8gcGFzcyBpdHMgaW50ZXJuYWwgdGltZXN0YW1wIGNoZWNrLiAqL1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHsgY2FsbGJhY2sodHJ1ZSkgfSwgMTYpO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAvKiBUaGUgckFGIGxvb3AgaGFzIGJlZW4gcGF1c2VkIGJ5IHRoZSBicm93c2VyLCBzbyB3ZSBtYW51YWxseSByZXN0YXJ0IHRoZSB0aWNrLiAqL1xuICAgICAgICAgICAgICAgIHRpY2soKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGlja2VyID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCByQUZTaGltO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqXG4gICAgICAgIFRpY2tcbiAgICAqKioqKioqKioqKiovXG5cbiAgICAvKiBOb3RlOiBBbGwgY2FsbHMgdG8gVmVsb2NpdHkgYXJlIHB1c2hlZCB0byB0aGUgVmVsb2NpdHkuU3RhdGUuY2FsbHMgYXJyYXksIHdoaWNoIGlzIGZ1bGx5IGl0ZXJhdGVkIHRocm91Z2ggdXBvbiBlYWNoIHRpY2suICovXG4gICAgZnVuY3Rpb24gdGljayAodGltZXN0YW1wKSB7XG4gICAgICAgIC8qIEFuIGVtcHR5IHRpbWVzdGFtcCBhcmd1bWVudCBpbmRpY2F0ZXMgdGhhdCB0aGlzIGlzIHRoZSBmaXJzdCB0aWNrIG9jY3VyZW5jZSBzaW5jZSB0aWNraW5nIHdhcyB0dXJuZWQgb24uXG4gICAgICAgICAgIFdlIGxldmVyYWdlIHRoaXMgbWV0YWRhdGEgdG8gZnVsbHkgaWdub3JlIHRoZSBmaXJzdCB0aWNrIHBhc3Mgc2luY2UgUkFGJ3MgaW5pdGlhbCBwYXNzIGlzIGZpcmVkIHdoZW5ldmVyXG4gICAgICAgICAgIHRoZSBicm93c2VyJ3MgbmV4dCB0aWNrIHN5bmMgdGltZSBvY2N1cnMsIHdoaWNoIHJlc3VsdHMgaW4gdGhlIGZpcnN0IGVsZW1lbnRzIHN1YmplY3RlZCB0byBWZWxvY2l0eVxuICAgICAgICAgICBjYWxscyBiZWluZyBhbmltYXRlZCBvdXQgb2Ygc3luYyB3aXRoIGFueSBlbGVtZW50cyBhbmltYXRlZCBpbW1lZGlhdGVseSB0aGVyZWFmdGVyLiBJbiBzaG9ydCwgd2UgaWdub3JlXG4gICAgICAgICAgIHRoZSBmaXJzdCBSQUYgdGljayBwYXNzIHNvIHRoYXQgZWxlbWVudHMgYmVpbmcgaW1tZWRpYXRlbHkgY29uc2VjdXRpdmVseSBhbmltYXRlZCAtLSBpbnN0ZWFkIG9mIHNpbXVsdGFuZW91c2x5IGFuaW1hdGVkXG4gICAgICAgICAgIGJ5IHRoZSBzYW1lIFZlbG9jaXR5IGNhbGwgLS0gYXJlIHByb3Blcmx5IGJhdGNoZWQgaW50byB0aGUgc2FtZSBpbml0aWFsIFJBRiB0aWNrIGFuZCBjb25zZXF1ZW50bHkgcmVtYWluIGluIHN5bmMgdGhlcmVhZnRlci4gKi9cbiAgICAgICAgaWYgKHRpbWVzdGFtcCkge1xuICAgICAgICAgICAgLyogV2UgaWdub3JlIFJBRidzIGhpZ2ggcmVzb2x1dGlvbiB0aW1lc3RhbXAgc2luY2UgaXQgY2FuIGJlIHNpZ25pZmljYW50bHkgb2Zmc2V0IHdoZW4gdGhlIGJyb3dzZXIgaXNcbiAgICAgICAgICAgICAgIHVuZGVyIGhpZ2ggc3RyZXNzOyB3ZSBvcHQgZm9yIGNob3BwaW5lc3Mgb3ZlciBhbGxvd2luZyB0aGUgYnJvd3NlciB0byBkcm9wIGh1Z2UgY2h1bmtzIG9mIGZyYW1lcy4gKi9cbiAgICAgICAgICAgIHZhciB0aW1lQ3VycmVudCA9IChuZXcgRGF0ZSkuZ2V0VGltZSgpO1xuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgIENhbGwgSXRlcmF0aW9uXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgdmFyIGNhbGxzTGVuZ3RoID0gVmVsb2NpdHkuU3RhdGUuY2FsbHMubGVuZ3RoO1xuXG4gICAgICAgICAgICAvKiBUbyBzcGVlZCB1cCBpdGVyYXRpbmcgb3ZlciB0aGlzIGFycmF5LCBpdCBpcyBjb21wYWN0ZWQgKGZhbHNleSBpdGVtcyAtLSBjYWxscyB0aGF0IGhhdmUgY29tcGxldGVkIC0tIGFyZSByZW1vdmVkKVxuICAgICAgICAgICAgICAgd2hlbiBpdHMgbGVuZ3RoIGhhcyBiYWxsb29uZWQgdG8gYSBwb2ludCB0aGF0IGNhbiBpbXBhY3QgdGljayBwZXJmb3JtYW5jZS4gVGhpcyBvbmx5IGJlY29tZXMgbmVjZXNzYXJ5IHdoZW4gYW5pbWF0aW9uXG4gICAgICAgICAgICAgICBoYXMgYmVlbiBjb250aW51b3VzIHdpdGggbWFueSBlbGVtZW50cyBvdmVyIGEgbG9uZyBwZXJpb2Qgb2YgdGltZTsgd2hlbmV2ZXIgYWxsIGFjdGl2ZSBjYWxscyBhcmUgY29tcGxldGVkLCBjb21wbGV0ZUNhbGwoKSBjbGVhcnMgVmVsb2NpdHkuU3RhdGUuY2FsbHMuICovXG4gICAgICAgICAgICBpZiAoY2FsbHNMZW5ndGggPiAxMDAwMCkge1xuICAgICAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLmNhbGxzID0gY29tcGFjdFNwYXJzZUFycmF5KFZlbG9jaXR5LlN0YXRlLmNhbGxzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogSXRlcmF0ZSB0aHJvdWdoIGVhY2ggYWN0aXZlIGNhbGwuICovXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxzTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAvKiBXaGVuIGEgVmVsb2NpdHkgY2FsbCBpcyBjb21wbGV0ZWQsIGl0cyBWZWxvY2l0eS5TdGF0ZS5jYWxscyBlbnRyeSBpcyBzZXQgdG8gZmFsc2UuIENvbnRpbnVlIG9uIHRvIHRoZSBuZXh0IGNhbGwuICovXG4gICAgICAgICAgICAgICAgaWYgKCFWZWxvY2l0eS5TdGF0ZS5jYWxsc1tpXSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgQ2FsbC1XaWRlIFZhcmlhYmxlc1xuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgIHZhciBjYWxsQ29udGFpbmVyID0gVmVsb2NpdHkuU3RhdGUuY2FsbHNbaV0sXG4gICAgICAgICAgICAgICAgICAgIGNhbGwgPSBjYWxsQ29udGFpbmVyWzBdLFxuICAgICAgICAgICAgICAgICAgICBvcHRzID0gY2FsbENvbnRhaW5lclsyXSxcbiAgICAgICAgICAgICAgICAgICAgdGltZVN0YXJ0ID0gY2FsbENvbnRhaW5lclszXSxcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RUaWNrID0gISF0aW1lU3RhcnQsXG4gICAgICAgICAgICAgICAgICAgIHR3ZWVuRHVtbXlWYWx1ZSA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAvKiBJZiB0aW1lU3RhcnQgaXMgdW5kZWZpbmVkLCB0aGVuIHRoaXMgaXMgdGhlIGZpcnN0IHRpbWUgdGhhdCB0aGlzIGNhbGwgaGFzIGJlZW4gcHJvY2Vzc2VkIGJ5IHRpY2soKS5cbiAgICAgICAgICAgICAgICAgICBXZSBhc3NpZ24gdGltZVN0YXJ0IG5vdyBzbyB0aGF0IGl0cyB2YWx1ZSBpcyBhcyBjbG9zZSB0byB0aGUgcmVhbCBhbmltYXRpb24gc3RhcnQgdGltZSBhcyBwb3NzaWJsZS5cbiAgICAgICAgICAgICAgICAgICAoQ29udmVyc2VseSwgaGFkIHRpbWVTdGFydCBiZWVuIGRlZmluZWQgd2hlbiB0aGlzIGNhbGwgd2FzIGFkZGVkIHRvIFZlbG9jaXR5LlN0YXRlLmNhbGxzLCB0aGUgZGVsYXlcbiAgICAgICAgICAgICAgICAgICBiZXR3ZWVuIHRoYXQgdGltZSBhbmQgbm93IHdvdWxkIGNhdXNlIHRoZSBmaXJzdCBmZXcgZnJhbWVzIG9mIHRoZSB0d2VlbiB0byBiZSBza2lwcGVkIHNpbmNlXG4gICAgICAgICAgICAgICAgICAgcGVyY2VudENvbXBsZXRlIGlzIGNhbGN1bGF0ZWQgcmVsYXRpdmUgdG8gdGltZVN0YXJ0LikgKi9cbiAgICAgICAgICAgICAgICAvKiBGdXJ0aGVyLCBzdWJ0cmFjdCAxNm1zICh0aGUgYXBwcm94aW1hdGUgcmVzb2x1dGlvbiBvZiBSQUYpIGZyb20gdGhlIGN1cnJlbnQgdGltZSB2YWx1ZSBzbyB0aGF0IHRoZVxuICAgICAgICAgICAgICAgICAgIGZpcnN0IHRpY2sgaXRlcmF0aW9uIGlzbid0IHdhc3RlZCBieSBhbmltYXRpbmcgYXQgMCUgdHdlZW4gY29tcGxldGlvbiwgd2hpY2ggd291bGQgcHJvZHVjZSB0aGVcbiAgICAgICAgICAgICAgICAgICBzYW1lIHN0eWxlIHZhbHVlIGFzIHRoZSBlbGVtZW50J3MgY3VycmVudCB2YWx1ZS4gKi9cbiAgICAgICAgICAgICAgICBpZiAoIXRpbWVTdGFydCkge1xuICAgICAgICAgICAgICAgICAgICB0aW1lU3RhcnQgPSBWZWxvY2l0eS5TdGF0ZS5jYWxsc1tpXVszXSA9IHRpbWVDdXJyZW50IC0gMTY7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyogVGhlIHR3ZWVuJ3MgY29tcGxldGlvbiBwZXJjZW50YWdlIGlzIHJlbGF0aXZlIHRvIHRoZSB0d2VlbidzIHN0YXJ0IHRpbWUsIG5vdCB0aGUgdHdlZW4ncyBzdGFydCB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICh3aGljaCB3b3VsZCByZXN1bHQgaW4gdW5wcmVkaWN0YWJsZSB0d2VlbiBkdXJhdGlvbnMgc2luY2UgSmF2YVNjcmlwdCdzIHRpbWVycyBhcmUgbm90IHBhcnRpY3VsYXJseSBhY2N1cmF0ZSkuXG4gICAgICAgICAgICAgICAgICAgQWNjb3JkaW5nbHksIHdlIGVuc3VyZSB0aGF0IHBlcmNlbnRDb21wbGV0ZSBkb2VzIG5vdCBleGNlZWQgMS4gKi9cbiAgICAgICAgICAgICAgICB2YXIgcGVyY2VudENvbXBsZXRlID0gTWF0aC5taW4oKHRpbWVDdXJyZW50IC0gdGltZVN0YXJ0KSAvIG9wdHMuZHVyYXRpb24sIDEpO1xuXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICBFbGVtZW50IEl0ZXJhdGlvblxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAvKiBGb3IgZXZlcnkgY2FsbCwgaXRlcmF0ZSB0aHJvdWdoIGVhY2ggb2YgdGhlIGVsZW1lbnRzIGluIGl0cyBzZXQuICovXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGNhbGxMZW5ndGggPSBjYWxsLmxlbmd0aDsgaiA8IGNhbGxMZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdHdlZW5zQ29udGFpbmVyID0gY2FsbFtqXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSB0d2VlbnNDb250YWluZXIuZWxlbWVudDtcblxuICAgICAgICAgICAgICAgICAgICAvKiBDaGVjayB0byBzZWUgaWYgdGhpcyBlbGVtZW50IGhhcyBiZWVuIGRlbGV0ZWQgbWlkd2F5IHRocm91Z2ggdGhlIGFuaW1hdGlvbiBieSBjaGVja2luZyBmb3IgdGhlXG4gICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlZCBleGlzdGVuY2Ugb2YgaXRzIGRhdGEgY2FjaGUuIElmIGl0J3MgZ29uZSwgc2tpcCBhbmltYXRpbmcgdGhpcyBlbGVtZW50LiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAoIURhdGEoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIHRyYW5zZm9ybVByb3BlcnR5RXhpc3RzID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgRGlzcGxheSAmIFZpc2liaWxpdHkgVG9nZ2xpbmdcbiAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgZGlzcGxheSBvcHRpb24gaXMgc2V0IHRvIG5vbi1cIm5vbmVcIiwgc2V0IGl0IHVwZnJvbnQgc28gdGhhdCB0aGUgZWxlbWVudCBjYW4gYmVjb21lIHZpc2libGUgYmVmb3JlIHR3ZWVuaW5nIGJlZ2lucy5cbiAgICAgICAgICAgICAgICAgICAgICAgKE90aGVyd2lzZSwgZGlzcGxheSdzIFwibm9uZVwiIHZhbHVlIGlzIHNldCBpbiBjb21wbGV0ZUNhbGwoKSBvbmNlIHRoZSBhbmltYXRpb24gaGFzIGNvbXBsZXRlZC4pICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLmRpc3BsYXkgIT09IHVuZGVmaW5lZCAmJiBvcHRzLmRpc3BsYXkgIT09IG51bGwgJiYgb3B0cy5kaXNwbGF5ICE9PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuZGlzcGxheSA9PT0gXCJmbGV4XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZmxleFZhbHVlcyA9IFsgXCItd2Via2l0LWJveFwiLCBcIi1tb3otYm94XCIsIFwiLW1zLWZsZXhib3hcIiwgXCItd2Via2l0LWZsZXhcIiBdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGZsZXhWYWx1ZXMsIGZ1bmN0aW9uKGksIGZsZXhWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDU1Muc2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcImRpc3BsYXlcIiwgZmxleFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLnNldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJkaXNwbGF5XCIsIG9wdHMuZGlzcGxheSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKiBTYW1lIGdvZXMgd2l0aCB0aGUgdmlzaWJpbGl0eSBvcHRpb24sIGJ1dCBpdHMgXCJub25lXCIgZXF1aXZhbGVudCBpcyBcImhpZGRlblwiLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy52aXNpYmlsaXR5ICE9PSB1bmRlZmluZWQgJiYgb3B0cy52aXNpYmlsaXR5ICE9PSBcImhpZGRlblwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBDU1Muc2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcInZpc2liaWxpdHlcIiwgb3B0cy52aXNpYmlsaXR5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgUHJvcGVydHkgSXRlcmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAvKiBGb3IgZXZlcnkgZWxlbWVudCwgaXRlcmF0ZSB0aHJvdWdoIGVhY2ggcHJvcGVydHkuICovXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIHR3ZWVuc0NvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogSW4gYWRkaXRpb24gdG8gcHJvcGVydHkgdHdlZW4gZGF0YSwgdHdlZW5zQ29udGFpbmVyIGNvbnRhaW5zIGEgcmVmZXJlbmNlIHRvIGl0cyBhc3NvY2lhdGVkIGVsZW1lbnQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgIT09IFwiZWxlbWVudFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHR3ZWVuID0gdHdlZW5zQ29udGFpbmVyW3Byb3BlcnR5XSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBFYXNpbmcgY2FuIGVpdGhlciBiZSBhIHByZS1nZW5lcmVhdGVkIGZ1bmN0aW9uIG9yIGEgc3RyaW5nIHRoYXQgcmVmZXJlbmNlcyBhIHByZS1yZWdpc3RlcmVkIGVhc2luZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbiB0aGUgVmVsb2NpdHkuRWFzaW5ncyBvYmplY3QuIEluIGVpdGhlciBjYXNlLCByZXR1cm4gdGhlIGFwcHJvcHJpYXRlIGVhc2luZyAqZnVuY3Rpb24qLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmcgPSBUeXBlLmlzU3RyaW5nKHR3ZWVuLmVhc2luZykgPyBWZWxvY2l0eS5FYXNpbmdzW3R3ZWVuLmVhc2luZ10gOiB0d2Vlbi5lYXNpbmc7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ3VycmVudCBWYWx1ZSBDYWxjdWxhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoaXMgaXMgdGhlIGxhc3QgdGljayBwYXNzIChpZiB3ZSd2ZSByZWFjaGVkIDEwMCUgY29tcGxldGlvbiBmb3IgdGhpcyB0d2VlbiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5zdXJlIHRoYXQgY3VycmVudFZhbHVlIGlzIGV4cGxpY2l0bHkgc2V0IHRvIGl0cyB0YXJnZXQgZW5kVmFsdWUgc28gdGhhdCBpdCdzIG5vdCBzdWJqZWN0ZWQgdG8gYW55IHJvdW5kaW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwZXJjZW50Q29tcGxldGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlID0gdHdlZW4uZW5kVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogT3RoZXJ3aXNlLCBjYWxjdWxhdGUgY3VycmVudFZhbHVlIGJhc2VkIG9uIHRoZSBjdXJyZW50IGRlbHRhIGZyb20gc3RhcnRWYWx1ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHdlZW5EZWx0YSA9IHR3ZWVuLmVuZFZhbHVlIC0gdHdlZW4uc3RhcnRWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlID0gdHdlZW4uc3RhcnRWYWx1ZSArICh0d2VlbkRlbHRhICogZWFzaW5nKHBlcmNlbnRDb21wbGV0ZSwgb3B0cywgdHdlZW5EZWx0YSkpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIG5vIHZhbHVlIGNoYW5nZSBpcyBvY2N1cnJpbmcsIGRvbid0IHByb2NlZWQgd2l0aCBET00gdXBkYXRpbmcuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZmlyc3RUaWNrICYmIChjdXJyZW50VmFsdWUgPT09IHR3ZWVuLmN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW4uY3VycmVudFZhbHVlID0gY3VycmVudFZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgd2UncmUgdHdlZW5pbmcgYSBmYWtlICd0d2VlbicgcHJvcGVydHkgaW4gb3JkZXIgdG8gbG9nIHRyYW5zaXRpb24gdmFsdWVzLCB1cGRhdGUgdGhlIG9uZS1wZXItY2FsbCB2YXJpYWJsZSBzbyB0aGF0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXQgY2FuIGJlIHBhc3NlZCBpbnRvIHRoZSBwcm9ncmVzcyBjYWxsYmFjay4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgPT09IFwidHdlZW5cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0d2VlbkR1bW15VmFsdWUgPSBjdXJyZW50VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBIb29rczogUGFydCBJXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBGb3IgaG9va2VkIHByb3BlcnRpZXMsIHRoZSBuZXdseS11cGRhdGVkIHJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGUgaXMgY2FjaGVkIG9udG8gdGhlIGVsZW1lbnQgc28gdGhhdCBpdCBjYW4gYmUgdXNlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3Igc3Vic2VxdWVudCBob29rcyBpbiB0aGlzIGNhbGwgdGhhdCBhcmUgYXNzb2NpYXRlZCB3aXRoIHRoZSBzYW1lIHJvb3QgcHJvcGVydHkuIElmIHdlIGRpZG4ndCBjYWNoZSB0aGUgdXBkYXRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSwgZWFjaCBzdWJzZXF1ZW50IHVwZGF0ZSB0byB0aGUgcm9vdCBwcm9wZXJ0eSBpbiB0aGlzIHRpY2sgcGFzcyB3b3VsZCByZXNldCB0aGUgcHJldmlvdXMgaG9vaydzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZXMgdG8gcm9vdFByb3BlcnR5VmFsdWUgcHJpb3IgdG8gaW5qZWN0aW9uLiBBIG5pY2UgcGVyZm9ybWFuY2UgYnlwcm9kdWN0IG9mIHJvb3RQcm9wZXJ0eVZhbHVlIGNhY2hpbmcgaXMgdGhhdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJzZXF1ZW50bHkgY2hhaW5lZCBhbmltYXRpb25zIHVzaW5nIHRoZSBzYW1lIGhvb2tSb290IGJ1dCBhIGRpZmZlcmVudCBob29rIGNhbiB1c2UgdGhpcyBjYWNoZWQgcm9vdFByb3BlcnR5VmFsdWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDU1MuSG9va3MucmVnaXN0ZXJlZFtwcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBob29rUm9vdCA9IENTUy5Ib29rcy5nZXRSb290KHByb3BlcnR5KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZUNhY2hlID0gRGF0YShlbGVtZW50KS5yb290UHJvcGVydHlWYWx1ZUNhY2hlW2hvb2tSb290XTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0d2Vlbi5yb290UHJvcGVydHlWYWx1ZSA9IHJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERPTSBVcGRhdGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogc2V0UHJvcGVydHlWYWx1ZSgpIHJldHVybnMgYW4gYXJyYXkgb2YgdGhlIHByb3BlcnR5IG5hbWUgYW5kIHByb3BlcnR5IHZhbHVlIHBvc3QgYW55IG5vcm1hbGl6YXRpb24gdGhhdCBtYXkgaGF2ZSBiZWVuIHBlcmZvcm1lZC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogVG8gc29sdmUgYW4gSUU8PTggcG9zaXRpb25pbmcgYnVnLCB0aGUgdW5pdCB0eXBlIGlzIGRyb3BwZWQgd2hlbiBzZXR0aW5nIGEgcHJvcGVydHkgdmFsdWUgb2YgMC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFkanVzdGVkU2V0RGF0YSA9IENTUy5zZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIC8qIFNFVCAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0d2Vlbi5jdXJyZW50VmFsdWUgKyAocGFyc2VGbG9hdChjdXJyZW50VmFsdWUpID09PSAwID8gXCJcIiA6IHR3ZWVuLnVuaXRUeXBlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuLnJvb3RQcm9wZXJ0eVZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW4uc2Nyb2xsRGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSG9va3M6IFBhcnQgSUlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3cgdGhhdCB3ZSBoYXZlIHRoZSBob29rJ3MgdXBkYXRlZCByb290UHJvcGVydHlWYWx1ZSAodGhlIHBvc3QtcHJvY2Vzc2VkIHZhbHVlIHByb3ZpZGVkIGJ5IGFkanVzdGVkU2V0RGF0YSksIGNhY2hlIGl0IG9udG8gdGhlIGVsZW1lbnQuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDU1MuSG9va3MucmVnaXN0ZXJlZFtwcm9wZXJ0eV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNpbmNlIGFkanVzdGVkU2V0RGF0YSBjb250YWlucyBub3JtYWxpemVkIGRhdGEgcmVhZHkgZm9yIERPTSB1cGRhdGluZywgdGhlIHJvb3RQcm9wZXJ0eVZhbHVlIG5lZWRzIHRvIGJlIHJlLWV4dHJhY3RlZCBmcm9tIGl0cyBub3JtYWxpemVkIGZvcm0uID8/ICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbaG9va1Jvb3RdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS5yb290UHJvcGVydHlWYWx1ZUNhY2hlW2hvb2tSb290XSA9IENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2hvb2tSb290XShcImV4dHJhY3RcIiwgbnVsbCwgYWRqdXN0ZWRTZXREYXRhWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS5yb290UHJvcGVydHlWYWx1ZUNhY2hlW2hvb2tSb290XSA9IGFkanVzdGVkU2V0RGF0YVsxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVHJhbnNmb3Jtc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRmxhZyB3aGV0aGVyIGEgdHJhbnNmb3JtIHByb3BlcnR5IGlzIGJlaW5nIGFuaW1hdGVkIHNvIHRoYXQgZmx1c2hUcmFuc2Zvcm1DYWNoZSgpIGNhbiBiZSB0cmlnZ2VyZWQgb25jZSB0aGlzIHRpY2sgcGFzcyBpcyBjb21wbGV0ZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFkanVzdGVkU2V0RGF0YVswXSA9PT0gXCJ0cmFuc2Zvcm1cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtUHJvcGVydHlFeGlzdHMgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKlxuICAgICAgICAgICAgICAgICAgICAgICAgbW9iaWxlSEFcbiAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgICAgICAgICAvKiBJZiBtb2JpbGVIQSBpcyBlbmFibGVkLCBzZXQgdGhlIHRyYW5zbGF0ZTNkIHRyYW5zZm9ybSB0byBudWxsIHRvIGZvcmNlIGhhcmR3YXJlIGFjY2VsZXJhdGlvbi5cbiAgICAgICAgICAgICAgICAgICAgICAgSXQncyBzYWZlIHRvIG92ZXJyaWRlIHRoaXMgcHJvcGVydHkgc2luY2UgVmVsb2NpdHkgZG9lc24ndCBhY3R1YWxseSBzdXBwb3J0IGl0cyBhbmltYXRpb24gKGhvb2tzIGFyZSB1c2VkIGluIGl0cyBwbGFjZSkuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLm1vYmlsZUhBKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBEb24ndCBzZXQgdGhlIG51bGwgdHJhbnNmb3JtIGhhY2sgaWYgd2UndmUgYWxyZWFkeSBkb25lIHNvLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKERhdGEoZWxlbWVudCkudHJhbnNmb3JtQ2FjaGUudHJhbnNsYXRlM2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFsbCBlbnRyaWVzIG9uIHRoZSB0cmFuc2Zvcm1DYWNoZSBvYmplY3QgYXJlIGxhdGVyIGNvbmNhdGVuYXRlZCBpbnRvIGEgc2luZ2xlIHRyYW5zZm9ybSBzdHJpbmcgdmlhIGZsdXNoVHJhbnNmb3JtQ2FjaGUoKS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlLnRyYW5zbGF0ZTNkID0gXCIoMHB4LCAwcHgsIDBweClcIjtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybVByb3BlcnR5RXhpc3RzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cmFuc2Zvcm1Qcm9wZXJ0eUV4aXN0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLmZsdXNoVHJhbnNmb3JtQ2FjaGUoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiBUaGUgbm9uLVwibm9uZVwiIGRpc3BsYXkgdmFsdWUgaXMgb25seSBhcHBsaWVkIHRvIGFuIGVsZW1lbnQgb25jZSAtLSB3aGVuIGl0cyBhc3NvY2lhdGVkIGNhbGwgaXMgZmlyc3QgdGlja2VkIHRocm91Z2guXG4gICAgICAgICAgICAgICAgICAgQWNjb3JkaW5nbHksIGl0J3Mgc2V0IHRvIGZhbHNlIHNvIHRoYXQgaXQgaXNuJ3QgcmUtcHJvY2Vzc2VkIGJ5IHRoaXMgY2FsbCBpbiB0aGUgbmV4dCB0aWNrLiAqL1xuICAgICAgICAgICAgICAgIGlmIChvcHRzLmRpc3BsYXkgIT09IHVuZGVmaW5lZCAmJiBvcHRzLmRpc3BsYXkgIT09IFwibm9uZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLmNhbGxzW2ldWzJdLmRpc3BsYXkgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG9wdHMudmlzaWJpbGl0eSAhPT0gdW5kZWZpbmVkICYmIG9wdHMudmlzaWJpbGl0eSAhPT0gXCJoaWRkZW5cIikge1xuICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5TdGF0ZS5jYWxsc1tpXVsyXS52aXNpYmlsaXR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyogUGFzcyB0aGUgZWxlbWVudHMgYW5kIHRoZSB0aW1pbmcgZGF0YSAocGVyY2VudENvbXBsZXRlLCBtc1JlbWFpbmluZywgdGltZVN0YXJ0LCB0d2VlbkR1bW15VmFsdWUpIGludG8gdGhlIHByb2dyZXNzIGNhbGxiYWNrLiAqL1xuICAgICAgICAgICAgICAgIGlmIChvcHRzLnByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdHMucHJvZ3Jlc3MuY2FsbChjYWxsQ29udGFpbmVyWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbENvbnRhaW5lclsxXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBlcmNlbnRDb21wbGV0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgubWF4KDAsICh0aW1lU3RhcnQgKyBvcHRzLmR1cmF0aW9uKSAtIHRpbWVDdXJyZW50KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVTdGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuRHVtbXlWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyogSWYgdGhpcyBjYWxsIGhhcyBmaW5pc2hlZCB0d2VlbmluZywgcGFzcyBpdHMgaW5kZXggdG8gY29tcGxldGVDYWxsKCkgdG8gaGFuZGxlIGNhbGwgY2xlYW51cC4gKi9cbiAgICAgICAgICAgICAgICBpZiAocGVyY2VudENvbXBsZXRlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlQ2FsbChpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKiBOb3RlOiBjb21wbGV0ZUNhbGwoKSBzZXRzIHRoZSBpc1RpY2tpbmcgZmxhZyB0byBmYWxzZSB3aGVuIHRoZSBsYXN0IGNhbGwgb24gVmVsb2NpdHkuU3RhdGUuY2FsbHMgaGFzIGNvbXBsZXRlZC4gKi9cbiAgICAgICAgaWYgKFZlbG9jaXR5LlN0YXRlLmlzVGlja2luZykge1xuICAgICAgICAgICAgdGlja2VyKHRpY2spO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgQ2FsbCBDb21wbGV0aW9uXG4gICAgKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qIE5vdGU6IFVubGlrZSB0aWNrKCksIHdoaWNoIHByb2Nlc3NlcyBhbGwgYWN0aXZlIGNhbGxzIGF0IG9uY2UsIGNhbGwgY29tcGxldGlvbiBpcyBoYW5kbGVkIG9uIGEgcGVyLWNhbGwgYmFzaXMuICovXG4gICAgZnVuY3Rpb24gY29tcGxldGVDYWxsIChjYWxsSW5kZXgsIGlzU3RvcHBlZCkge1xuICAgICAgICAvKiBFbnN1cmUgdGhlIGNhbGwgZXhpc3RzLiAqL1xuICAgICAgICBpZiAoIVZlbG9jaXR5LlN0YXRlLmNhbGxzW2NhbGxJbmRleF0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIFB1bGwgdGhlIG1ldGFkYXRhIGZyb20gdGhlIGNhbGwuICovXG4gICAgICAgIHZhciBjYWxsID0gVmVsb2NpdHkuU3RhdGUuY2FsbHNbY2FsbEluZGV4XVswXSxcbiAgICAgICAgICAgIGVsZW1lbnRzID0gVmVsb2NpdHkuU3RhdGUuY2FsbHNbY2FsbEluZGV4XVsxXSxcbiAgICAgICAgICAgIG9wdHMgPSBWZWxvY2l0eS5TdGF0ZS5jYWxsc1tjYWxsSW5kZXhdWzJdLFxuICAgICAgICAgICAgcmVzb2x2ZXIgPSBWZWxvY2l0eS5TdGF0ZS5jYWxsc1tjYWxsSW5kZXhdWzRdO1xuXG4gICAgICAgIHZhciByZW1haW5pbmdDYWxsc0V4aXN0ID0gZmFsc2U7XG5cbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgRWxlbWVudCBGaW5hbGl6YXRpb25cbiAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICBmb3IgKHZhciBpID0gMCwgY2FsbExlbmd0aCA9IGNhbGwubGVuZ3RoOyBpIDwgY2FsbExlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IGNhbGxbaV0uZWxlbWVudDtcblxuICAgICAgICAgICAgLyogSWYgdGhlIHVzZXIgc2V0IGRpc3BsYXkgdG8gXCJub25lXCIgKGludGVuZGluZyB0byBoaWRlIHRoZSBlbGVtZW50KSwgc2V0IGl0IG5vdyB0aGF0IHRoZSBhbmltYXRpb24gaGFzIGNvbXBsZXRlZC4gKi9cbiAgICAgICAgICAgIC8qIE5vdGU6IGRpc3BsYXk6bm9uZSBpc24ndCBzZXQgd2hlbiBjYWxscyBhcmUgbWFudWFsbHkgc3RvcHBlZCAodmlhIFZlbG9jaXR5KFwic3RvcFwiKS4gKi9cbiAgICAgICAgICAgIC8qIE5vdGU6IERpc3BsYXkgZ2V0cyBpZ25vcmVkIHdpdGggXCJyZXZlcnNlXCIgY2FsbHMgYW5kIGluZmluaXRlIGxvb3BzLCBzaW5jZSB0aGlzIGJlaGF2aW9yIHdvdWxkIGJlIHVuZGVzaXJhYmxlLiAqL1xuICAgICAgICAgICAgaWYgKCFpc1N0b3BwZWQgJiYgIW9wdHMubG9vcCkge1xuICAgICAgICAgICAgICAgIGlmIChvcHRzLmRpc3BsYXkgPT09IFwibm9uZVwiKSB7XG4gICAgICAgICAgICAgICAgICAgIENTUy5zZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiZGlzcGxheVwiLCBvcHRzLmRpc3BsYXkpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChvcHRzLnZpc2liaWxpdHkgPT09IFwiaGlkZGVuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgQ1NTLnNldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJ2aXNpYmlsaXR5XCIsIG9wdHMudmlzaWJpbGl0eSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBJZiB0aGUgZWxlbWVudCdzIHF1ZXVlIGlzIGVtcHR5IChpZiBvbmx5IHRoZSBcImlucHJvZ3Jlc3NcIiBpdGVtIGlzIGxlZnQgYXQgcG9zaXRpb24gMCkgb3IgaWYgaXRzIHF1ZXVlIGlzIGFib3V0IHRvIHJ1blxuICAgICAgICAgICAgICAgYSBub24tVmVsb2NpdHktaW5pdGlhdGVkIGVudHJ5LCB0dXJuIG9mZiB0aGUgaXNBbmltYXRpbmcgZmxhZy4gQSBub24tVmVsb2NpdHktaW5pdGlhdGllZCBxdWV1ZSBlbnRyeSdzIGxvZ2ljIG1pZ2h0IGFsdGVyXG4gICAgICAgICAgICAgICBhbiBlbGVtZW50J3MgQ1NTIHZhbHVlcyBhbmQgdGhlcmVieSBjYXVzZSBWZWxvY2l0eSdzIGNhY2hlZCB2YWx1ZSBkYXRhIHRvIGdvIHN0YWxlLiBUbyBkZXRlY3QgaWYgYSBxdWV1ZSBlbnRyeSB3YXMgaW5pdGlhdGVkIGJ5IFZlbG9jaXR5LFxuICAgICAgICAgICAgICAgd2UgY2hlY2sgZm9yIHRoZSBleGlzdGVuY2Ugb2Ygb3VyIHNwZWNpYWwgVmVsb2NpdHkucXVldWVFbnRyeUZsYWcgZGVjbGFyYXRpb24sIHdoaWNoIG1pbmlmaWVycyB3b24ndCByZW5hbWUgc2luY2UgdGhlIGZsYWdcbiAgICAgICAgICAgICAgIGlzIGFzc2lnbmVkIHRvIGpRdWVyeSdzIGdsb2JhbCAkIG9iamVjdCBhbmQgdGh1cyBleGlzdHMgb3V0IG9mIFZlbG9jaXR5J3Mgb3duIHNjb3BlLiAqL1xuICAgICAgICAgICAgaWYgKG9wdHMubG9vcCAhPT0gdHJ1ZSAmJiAoJC5xdWV1ZShlbGVtZW50KVsxXSA9PT0gdW5kZWZpbmVkIHx8ICEvXFwudmVsb2NpdHlRdWV1ZUVudHJ5RmxhZy9pLnRlc3QoJC5xdWV1ZShlbGVtZW50KVsxXSkpKSB7XG4gICAgICAgICAgICAgICAgLyogVGhlIGVsZW1lbnQgbWF5IGhhdmUgYmVlbiBkZWxldGVkLiBFbnN1cmUgdGhhdCBpdHMgZGF0YSBjYWNoZSBzdGlsbCBleGlzdHMgYmVmb3JlIGFjdGluZyBvbiBpdC4gKi9cbiAgICAgICAgICAgICAgICBpZiAoRGF0YShlbGVtZW50KSkge1xuICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLmlzQW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIC8qIENsZWFyIHRoZSBlbGVtZW50J3Mgcm9vdFByb3BlcnR5VmFsdWVDYWNoZSwgd2hpY2ggd2lsbCBiZWNvbWUgc3RhbGUuICovXG4gICAgICAgICAgICAgICAgICAgIERhdGEoZWxlbWVudCkucm9vdFByb3BlcnR5VmFsdWVDYWNoZSA9IHt9O1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0cmFuc2Zvcm1IQVByb3BlcnR5RXhpc3RzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIC8qIElmIGFueSAzRCB0cmFuc2Zvcm0gc3VicHJvcGVydHkgaXMgYXQgaXRzIGRlZmF1bHQgdmFsdWUgKHJlZ2FyZGxlc3Mgb2YgdW5pdCB0eXBlKSwgcmVtb3ZlIGl0LiAqL1xuICAgICAgICAgICAgICAgICAgICAkLmVhY2goQ1NTLkxpc3RzLnRyYW5zZm9ybXMzRCwgZnVuY3Rpb24oaSwgdHJhbnNmb3JtTmFtZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlZmF1bHRWYWx1ZSA9IC9ec2NhbGUvLnRlc3QodHJhbnNmb3JtTmFtZSkgPyAxIDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWUgPSBEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlW3RyYW5zZm9ybU5hbWVdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZVt0cmFuc2Zvcm1OYW1lXSAhPT0gdW5kZWZpbmVkICYmIG5ldyBSZWdFeHAoXCJeXFxcXChcIiArIGRlZmF1bHRWYWx1ZSArIFwiW14uXVwiKS50ZXN0KGN1cnJlbnRWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1IQVByb3BlcnR5RXhpc3RzID0gdHJ1ZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlW3RyYW5zZm9ybU5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAvKiBNb2JpbGUgZGV2aWNlcyBoYXZlIGhhcmR3YXJlIGFjY2VsZXJhdGlvbiByZW1vdmVkIGF0IHRoZSBlbmQgb2YgdGhlIGFuaW1hdGlvbiBpbiBvcmRlciB0byBhdm9pZCBob2dnaW5nIHRoZSBHUFUncyBtZW1vcnkuICovXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLm1vYmlsZUhBKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1IQVByb3BlcnR5RXhpc3RzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlLnRyYW5zbGF0ZTNkO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLyogRmx1c2ggdGhlIHN1YnByb3BlcnR5IHJlbW92YWxzIHRvIHRoZSBET00uICovXG4gICAgICAgICAgICAgICAgICAgIGlmICh0cmFuc2Zvcm1IQVByb3BlcnR5RXhpc3RzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBDU1MuZmx1c2hUcmFuc2Zvcm1DYWNoZShlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8qIFJlbW92ZSB0aGUgXCJ2ZWxvY2l0eS1hbmltYXRpbmdcIiBpbmRpY2F0b3IgY2xhc3MuICovXG4gICAgICAgICAgICAgICAgICAgIENTUy5WYWx1ZXMucmVtb3ZlQ2xhc3MoZWxlbWVudCwgXCJ2ZWxvY2l0eS1hbmltYXRpbmdcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICBPcHRpb246IENvbXBsZXRlXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIC8qIENvbXBsZXRlIGlzIGZpcmVkIG9uY2UgcGVyIGNhbGwgKG5vdCBvbmNlIHBlciBlbGVtZW50KSBhbmQgaXMgcGFzc2VkIHRoZSBmdWxsIHJhdyBET00gZWxlbWVudCBzZXQgYXMgYm90aCBpdHMgY29udGV4dCBhbmQgaXRzIGZpcnN0IGFyZ3VtZW50LiAqL1xuICAgICAgICAgICAgLyogTm90ZTogQ2FsbGJhY2tzIGFyZW4ndCBmaXJlZCB3aGVuIGNhbGxzIGFyZSBtYW51YWxseSBzdG9wcGVkICh2aWEgVmVsb2NpdHkoXCJzdG9wXCIpLiAqL1xuICAgICAgICAgICAgaWYgKCFpc1N0b3BwZWQgJiYgb3B0cy5jb21wbGV0ZSAmJiAhb3B0cy5sb29wICYmIChpID09PSBjYWxsTGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgICAgICAgICAvKiBXZSB0aHJvdyBjYWxsYmFja3MgaW4gYSBzZXRUaW1lb3V0IHNvIHRoYXQgdGhyb3duIGVycm9ycyBkb24ndCBoYWx0IHRoZSBleGVjdXRpb24gb2YgVmVsb2NpdHkgaXRzZWxmLiAqL1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIG9wdHMuY29tcGxldGUuY2FsbChlbGVtZW50cywgZWxlbWVudHMpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHRocm93IGVycm9yOyB9LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICBQcm9taXNlIFJlc29sdmluZ1xuICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgICAgICAgICAgLyogTm90ZTogSW5maW5pdGUgbG9vcHMgZG9uJ3QgcmV0dXJuIHByb21pc2VzLiAqL1xuICAgICAgICAgICAgaWYgKHJlc29sdmVyICYmIG9wdHMubG9vcCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHJlc29sdmVyKGVsZW1lbnRzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgICAgIE9wdGlvbjogTG9vcCAoSW5maW5pdGUpXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgICAgICBpZiAoRGF0YShlbGVtZW50KSAmJiBvcHRzLmxvb3AgPT09IHRydWUgJiYgIWlzU3RvcHBlZCkge1xuICAgICAgICAgICAgICAgIC8qIElmIGEgcm90YXRlWC9ZL1ogcHJvcGVydHkgaXMgYmVpbmcgYW5pbWF0ZWQgdG8gMzYwIGRlZyB3aXRoIGxvb3A6dHJ1ZSwgc3dhcCB0d2VlbiBzdGFydC9lbmQgdmFsdWVzIHRvIGVuYWJsZVxuICAgICAgICAgICAgICAgICAgIGNvbnRpbnVvdXMgaXRlcmF0aXZlIHJvdGF0aW9uIGxvb3BpbmcuIChPdGhlcmlzZSwgdGhlIGVsZW1lbnQgd291bGQganVzdCByb3RhdGUgYmFjayBhbmQgZm9ydGguKSAqL1xuICAgICAgICAgICAgICAgICQuZWFjaChEYXRhKGVsZW1lbnQpLnR3ZWVuc0NvbnRhaW5lciwgZnVuY3Rpb24ocHJvcGVydHlOYW1lLCB0d2VlbkNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoL15yb3RhdGUvLnRlc3QocHJvcGVydHlOYW1lKSAmJiBwYXJzZUZsb2F0KHR3ZWVuQ29udGFpbmVyLmVuZFZhbHVlKSA9PT0gMzYwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0d2VlbkNvbnRhaW5lci5lbmRWYWx1ZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB0d2VlbkNvbnRhaW5lci5zdGFydFZhbHVlID0gMzYwO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKC9eYmFja2dyb3VuZFBvc2l0aW9uLy50ZXN0KHByb3BlcnR5TmFtZSkgJiYgcGFyc2VGbG9hdCh0d2VlbkNvbnRhaW5lci5lbmRWYWx1ZSkgPT09IDEwMCAmJiB0d2VlbkNvbnRhaW5lci51bml0VHlwZSA9PT0gXCIlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuQ29udGFpbmVyLmVuZFZhbHVlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuQ29udGFpbmVyLnN0YXJ0VmFsdWUgPSAxMDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIFZlbG9jaXR5KGVsZW1lbnQsIFwicmV2ZXJzZVwiLCB7IGxvb3A6IHRydWUsIGRlbGF5OiBvcHRzLmRlbGF5IH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqXG4gICAgICAgICAgICAgICBEZXF1ZXVlaW5nXG4gICAgICAgICAgICAqKioqKioqKioqKioqKiovXG5cbiAgICAgICAgICAgIC8qIEZpcmUgdGhlIG5leHQgY2FsbCBpbiB0aGUgcXVldWUgc28gbG9uZyBhcyB0aGlzIGNhbGwncyBxdWV1ZSB3YXNuJ3Qgc2V0IHRvIGZhbHNlICh0byB0cmlnZ2VyIGEgcGFyYWxsZWwgYW5pbWF0aW9uKSxcbiAgICAgICAgICAgICAgIHdoaWNoIHdvdWxkIGhhdmUgYWxyZWFkeSBjYXVzZWQgdGhlIG5leHQgY2FsbCB0byBmaXJlLiBOb3RlOiBFdmVuIGlmIHRoZSBlbmQgb2YgdGhlIGFuaW1hdGlvbiBxdWV1ZSBoYXMgYmVlbiByZWFjaGVkLFxuICAgICAgICAgICAgICAgJC5kZXF1ZXVlKCkgbXVzdCBzdGlsbCBiZSBjYWxsZWQgaW4gb3JkZXIgdG8gY29tcGxldGVseSBjbGVhciBqUXVlcnkncyBhbmltYXRpb24gcXVldWUuICovXG4gICAgICAgICAgICBpZiAob3B0cy5xdWV1ZSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAkLmRlcXVldWUoZWxlbWVudCwgb3B0cy5xdWV1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgICAgIENhbGxzIEFycmF5IENsZWFudXBcbiAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgICAgIC8qIFNpbmNlIHRoaXMgY2FsbCBpcyBjb21wbGV0ZSwgc2V0IGl0IHRvIGZhbHNlIHNvIHRoYXQgdGhlIHJBRiB0aWNrIHNraXBzIGl0LiBUaGlzIGFycmF5IGlzIGxhdGVyIGNvbXBhY3RlZCB2aWEgY29tcGFjdFNwYXJzZUFycmF5KCkuXG4gICAgICAgICAgKEZvciBwZXJmb3JtYW5jZSByZWFzb25zLCB0aGUgY2FsbCBpcyBzZXQgdG8gZmFsc2UgaW5zdGVhZCBvZiBiZWluZyBkZWxldGVkIGZyb20gdGhlIGFycmF5OiBodHRwOi8vd3d3Lmh0bWw1cm9ja3MuY29tL2VuL3R1dG9yaWFscy9zcGVlZC92OC8pICovXG4gICAgICAgIFZlbG9jaXR5LlN0YXRlLmNhbGxzW2NhbGxJbmRleF0gPSBmYWxzZTtcblxuICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggdGhlIGNhbGxzIGFycmF5IHRvIGRldGVybWluZSBpZiB0aGlzIHdhcyB0aGUgZmluYWwgaW4tcHJvZ3Jlc3MgYW5pbWF0aW9uLlxuICAgICAgICAgICBJZiBzbywgc2V0IGEgZmxhZyB0byBlbmQgdGlja2luZyBhbmQgY2xlYXIgdGhlIGNhbGxzIGFycmF5LiAqL1xuICAgICAgICBmb3IgKHZhciBqID0gMCwgY2FsbHNMZW5ndGggPSBWZWxvY2l0eS5TdGF0ZS5jYWxscy5sZW5ndGg7IGogPCBjYWxsc0xlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBpZiAoVmVsb2NpdHkuU3RhdGUuY2FsbHNbal0gIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmVtYWluaW5nQ2FsbHNFeGlzdCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZW1haW5pbmdDYWxsc0V4aXN0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgLyogdGljaygpIHdpbGwgZGV0ZWN0IHRoaXMgZmxhZyB1cG9uIGl0cyBuZXh0IGl0ZXJhdGlvbiBhbmQgc3Vic2VxdWVudGx5IHR1cm4gaXRzZWxmIG9mZi4gKi9cbiAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLmlzVGlja2luZyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvKiBDbGVhciB0aGUgY2FsbHMgYXJyYXkgc28gdGhhdCBpdHMgbGVuZ3RoIGlzIHJlc2V0LiAqL1xuICAgICAgICAgICAgZGVsZXRlIFZlbG9jaXR5LlN0YXRlLmNhbGxzO1xuICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuY2FsbHMgPSBbXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKipcbiAgICAgICAgRnJhbWV3b3Jrc1xuICAgICoqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qIEJvdGggalF1ZXJ5IGFuZCBaZXB0byBhbGxvdyB0aGVpciAkLmZuIG9iamVjdCB0byBiZSBleHRlbmRlZCB0byBhbGxvdyB3cmFwcGVkIGVsZW1lbnRzIHRvIGJlIHN1YmplY3RlZCB0byBwbHVnaW4gY2FsbHMuXG4gICAgICAgSWYgZWl0aGVyIGZyYW1ld29yayBpcyBsb2FkZWQsIHJlZ2lzdGVyIGEgXCJ2ZWxvY2l0eVwiIGV4dGVuc2lvbiBwb2ludGluZyB0byBWZWxvY2l0eSdzIGNvcmUgYW5pbWF0ZSgpIG1ldGhvZC4gIFZlbG9jaXR5XG4gICAgICAgYWxzbyByZWdpc3RlcnMgaXRzZWxmIG9udG8gYSBnbG9iYWwgY29udGFpbmVyICh3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5aZXB0byB8fCB3aW5kb3cpIHNvIHRoYXQgY2VydGFpbiBmZWF0dXJlcyBhcmVcbiAgICAgICBhY2Nlc3NpYmxlIGJleW9uZCBqdXN0IGEgcGVyLWVsZW1lbnQgc2NvcGUuIFRoaXMgbWFzdGVyIG9iamVjdCBjb250YWlucyBhbiAuYW5pbWF0ZSgpIG1ldGhvZCwgd2hpY2ggaXMgbGF0ZXIgYXNzaWduZWQgdG8gJC5mblxuICAgICAgIChpZiBqUXVlcnkgb3IgWmVwdG8gYXJlIHByZXNlbnQpLiBBY2NvcmRpbmdseSwgVmVsb2NpdHkgY2FuIGJvdGggYWN0IG9uIHdyYXBwZWQgRE9NIGVsZW1lbnRzIGFuZCBzdGFuZCBhbG9uZSBmb3IgdGFyZ2V0aW5nIHJhdyBET00gZWxlbWVudHMuICovXG4gICAgZ2xvYmFsLlZlbG9jaXR5ID0gVmVsb2NpdHk7XG5cbiAgICBpZiAoZ2xvYmFsICE9PSB3aW5kb3cpIHtcbiAgICAgICAgLyogQXNzaWduIHRoZSBlbGVtZW50IGZ1bmN0aW9uIHRvIFZlbG9jaXR5J3MgY29yZSBhbmltYXRlKCkgbWV0aG9kLiAqL1xuICAgICAgICBnbG9iYWwuZm4udmVsb2NpdHkgPSBhbmltYXRlO1xuICAgICAgICAvKiBBc3NpZ24gdGhlIG9iamVjdCBmdW5jdGlvbidzIGRlZmF1bHRzIHRvIFZlbG9jaXR5J3MgZ2xvYmFsIGRlZmF1bHRzIG9iamVjdC4gKi9cbiAgICAgICAgZ2xvYmFsLmZuLnZlbG9jaXR5LmRlZmF1bHRzID0gVmVsb2NpdHkuZGVmYXVsdHM7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgUGFja2FnZWQgUmVkaXJlY3RzXG4gICAgKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKiBzbGlkZVVwLCBzbGlkZURvd24gKi9cbiAgICAkLmVhY2goWyBcIkRvd25cIiwgXCJVcFwiIF0sIGZ1bmN0aW9uKGksIGRpcmVjdGlvbikge1xuICAgICAgICBWZWxvY2l0eS5SZWRpcmVjdHNbXCJzbGlkZVwiICsgZGlyZWN0aW9uXSA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zLCBlbGVtZW50c0luZGV4LCBlbGVtZW50c1NpemUsIGVsZW1lbnRzLCBwcm9taXNlRGF0YSkge1xuICAgICAgICAgICAgdmFyIG9wdHMgPSAkLmV4dGVuZCh7fSwgb3B0aW9ucyksXG4gICAgICAgICAgICAgICAgYmVnaW4gPSBvcHRzLmJlZ2luLFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlID0gb3B0cy5jb21wbGV0ZSxcbiAgICAgICAgICAgICAgICBjb21wdXRlZFZhbHVlcyA9IHsgaGVpZ2h0OiBcIlwiLCBtYXJnaW5Ub3A6IFwiXCIsIG1hcmdpbkJvdHRvbTogXCJcIiwgcGFkZGluZ1RvcDogXCJcIiwgcGFkZGluZ0JvdHRvbTogXCJcIiB9LFxuICAgICAgICAgICAgICAgIGlubGluZVZhbHVlcyA9IHt9O1xuXG4gICAgICAgICAgICBpZiAob3B0cy5kaXNwbGF5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAvKiBTaG93IHRoZSBlbGVtZW50IGJlZm9yZSBzbGlkZURvd24gYmVnaW5zIGFuZCBoaWRlIHRoZSBlbGVtZW50IGFmdGVyIHNsaWRlVXAgY29tcGxldGVzLiAqL1xuICAgICAgICAgICAgICAgIC8qIE5vdGU6IElubGluZSBlbGVtZW50cyBjYW5ub3QgaGF2ZSBkaW1lbnNpb25zIGFuaW1hdGVkLCBzbyB0aGV5J3JlIHJldmVydGVkIHRvIGlubGluZS1ibG9jay4gKi9cbiAgICAgICAgICAgICAgICBvcHRzLmRpc3BsYXkgPSAoZGlyZWN0aW9uID09PSBcIkRvd25cIiA/IChWZWxvY2l0eS5DU1MuVmFsdWVzLmdldERpc3BsYXlUeXBlKGVsZW1lbnQpID09PSBcImlubGluZVwiID8gXCJpbmxpbmUtYmxvY2tcIiA6IFwiYmxvY2tcIikgOiBcIm5vbmVcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG9wdHMuYmVnaW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAvKiBJZiB0aGUgdXNlciBwYXNzZWQgaW4gYSBiZWdpbiBjYWxsYmFjaywgZmlyZSBpdCBub3cuICovXG4gICAgICAgICAgICAgICAgYmVnaW4gJiYgYmVnaW4uY2FsbChlbGVtZW50cywgZWxlbWVudHMpO1xuXG4gICAgICAgICAgICAgICAgLyogQ2FjaGUgdGhlIGVsZW1lbnRzJyBvcmlnaW5hbCB2ZXJ0aWNhbCBkaW1lbnNpb25hbCBwcm9wZXJ0eSB2YWx1ZXMgc28gdGhhdCB3ZSBjYW4gYW5pbWF0ZSBiYWNrIHRvIHRoZW0uICovXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gY29tcHV0ZWRWYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5saW5lVmFsdWVzW3Byb3BlcnR5XSA9IGVsZW1lbnQuc3R5bGVbcHJvcGVydHldO1xuXG4gICAgICAgICAgICAgICAgICAgIC8qIEZvciBzbGlkZURvd24sIHVzZSBmb3JjZWZlZWRpbmcgdG8gYW5pbWF0ZSBhbGwgdmVydGljYWwgcHJvcGVydGllcyBmcm9tIDAuIEZvciBzbGlkZVVwLFxuICAgICAgICAgICAgICAgICAgICAgICB1c2UgZm9yY2VmZWVkaW5nIHRvIHN0YXJ0IGZyb20gY29tcHV0ZWQgdmFsdWVzIGFuZCBhbmltYXRlIGRvd24gdG8gMC4gKi9cbiAgICAgICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5VmFsdWUgPSBWZWxvY2l0eS5DU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBwcm9wZXJ0eSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkVmFsdWVzW3Byb3BlcnR5XSA9IChkaXJlY3Rpb24gPT09IFwiRG93blwiKSA/IFsgcHJvcGVydHlWYWx1ZSwgMCBdIDogWyAwLCBwcm9wZXJ0eVZhbHVlIF07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyogRm9yY2UgdmVydGljYWwgb3ZlcmZsb3cgY29udGVudCB0byBjbGlwIHNvIHRoYXQgc2xpZGluZyB3b3JrcyBhcyBleHBlY3RlZC4gKi9cbiAgICAgICAgICAgICAgICBpbmxpbmVWYWx1ZXMub3ZlcmZsb3cgPSBlbGVtZW50LnN0eWxlLm92ZXJmbG93O1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvcHRzLmNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgLyogUmVzZXQgZWxlbWVudCB0byBpdHMgcHJlLXNsaWRlIGlubGluZSB2YWx1ZXMgb25jZSBpdHMgc2xpZGUgYW5pbWF0aW9uIGlzIGNvbXBsZXRlLiAqL1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIGlubGluZVZhbHVlcykge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlW3Byb3BlcnR5XSA9IGlubGluZVZhbHVlc1twcm9wZXJ0eV07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLyogSWYgdGhlIHVzZXIgcGFzc2VkIGluIGEgY29tcGxldGUgY2FsbGJhY2ssIGZpcmUgaXQgbm93LiAqL1xuICAgICAgICAgICAgICAgIGNvbXBsZXRlICYmIGNvbXBsZXRlLmNhbGwoZWxlbWVudHMsIGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICBwcm9taXNlRGF0YSAmJiBwcm9taXNlRGF0YS5yZXNvbHZlcihlbGVtZW50cyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBWZWxvY2l0eShlbGVtZW50LCBjb21wdXRlZFZhbHVlcywgb3B0cyk7XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvKiBmYWRlSW4sIGZhZGVPdXQgKi9cbiAgICAkLmVhY2goWyBcIkluXCIsIFwiT3V0XCIgXSwgZnVuY3Rpb24oaSwgZGlyZWN0aW9uKSB7XG4gICAgICAgIFZlbG9jaXR5LlJlZGlyZWN0c1tcImZhZGVcIiArIGRpcmVjdGlvbl0gPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucywgZWxlbWVudHNJbmRleCwgZWxlbWVudHNTaXplLCBlbGVtZW50cywgcHJvbWlzZURhdGEpIHtcbiAgICAgICAgICAgIHZhciBvcHRzID0gJC5leHRlbmQoe30sIG9wdGlvbnMpLFxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXNNYXAgPSB7IG9wYWNpdHk6IChkaXJlY3Rpb24gPT09IFwiSW5cIikgPyAxIDogMCB9LFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsQ29tcGxldGUgPSBvcHRzLmNvbXBsZXRlO1xuXG4gICAgICAgICAgICAvKiBTaW5jZSByZWRpcmVjdHMgYXJlIHRyaWdnZXJlZCBpbmRpdmlkdWFsbHkgZm9yIGVhY2ggZWxlbWVudCBpbiB0aGUgYW5pbWF0ZWQgc2V0LCBhdm9pZCByZXBlYXRlZGx5IHRyaWdnZXJpbmdcbiAgICAgICAgICAgICAgIGNhbGxiYWNrcyBieSBmaXJpbmcgdGhlbSBvbmx5IHdoZW4gdGhlIGZpbmFsIGVsZW1lbnQgaGFzIGJlZW4gcmVhY2hlZC4gKi9cbiAgICAgICAgICAgIGlmIChlbGVtZW50c0luZGV4ICE9PSBlbGVtZW50c1NpemUgLSAxKSB7XG4gICAgICAgICAgICAgICAgb3B0cy5jb21wbGV0ZSA9IG9wdHMuYmVnaW4gPSBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvcHRzLmNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvcmlnaW5hbENvbXBsZXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbENvbXBsZXRlLmNhbGwoZWxlbWVudHMsIGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHByb21pc2VEYXRhICYmIHByb21pc2VEYXRhLnJlc29sdmVyKGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIElmIGEgZGlzcGxheSB3YXMgcGFzc2VkIGluLCB1c2UgaXQuIE90aGVyd2lzZSwgZGVmYXVsdCB0byBcIm5vbmVcIiBmb3IgZmFkZU91dCBvciB0aGUgZWxlbWVudC1zcGVjaWZpYyBkZWZhdWx0IGZvciBmYWRlSW4uICovXG4gICAgICAgICAgICAvKiBOb3RlOiBXZSBhbGxvdyB1c2VycyB0byBwYXNzIGluIFwibnVsbFwiIHRvIHNraXAgZGlzcGxheSBzZXR0aW5nIGFsdG9nZXRoZXIuICovXG4gICAgICAgICAgICBpZiAob3B0cy5kaXNwbGF5ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBvcHRzLmRpc3BsYXkgPSAoZGlyZWN0aW9uID09PSBcIkluXCIgPyBcImF1dG9cIiA6IFwibm9uZVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgVmVsb2NpdHkodGhpcywgcHJvcGVydGllc01hcCwgb3B0cyk7XG4gICAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gVmVsb2NpdHk7XG59KCh3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5aZXB0byB8fCB3aW5kb3cpLCB3aW5kb3csIGRvY3VtZW50KTtcbn0pKTtcblxuLyoqKioqKioqKioqKioqKioqKlxuICAgS25vd24gSXNzdWVzXG4qKioqKioqKioqKioqKioqKiovXG5cbi8qIFRoZSBDU1Mgc3BlYyBtYW5kYXRlcyB0aGF0IHRoZSB0cmFuc2xhdGVYL1kvWiB0cmFuc2Zvcm1zIGFyZSAlLXJlbGF0aXZlIHRvIHRoZSBlbGVtZW50IGl0c2VsZiAtLSBub3QgaXRzIHBhcmVudC5cblZlbG9jaXR5LCBob3dldmVyLCBkb2Vzbid0IG1ha2UgdGhpcyBkaXN0aW5jdGlvbi4gVGh1cywgY29udmVydGluZyB0byBvciBmcm9tIHRoZSAlIHVuaXQgd2l0aCB0aGVzZSBzdWJwcm9wZXJ0aWVzXG53aWxsIHByb2R1Y2UgYW4gaW5hY2N1cmF0ZSBjb252ZXJzaW9uIHZhbHVlLiBUaGUgc2FtZSBpc3N1ZSBleGlzdHMgd2l0aCB0aGUgY3gvY3kgYXR0cmlidXRlcyBvZiBTVkcgY2lyY2xlcyBhbmQgZWxsaXBzZXMuICovIiwiLyoqKioqKioqKioqKioqKioqKioqKipcbiAgIFZlbG9jaXR5IFVJIFBhY2tcbioqKioqKioqKioqKioqKioqKioqKiovXG5cbi8qIFZlbG9jaXR5SlMub3JnIFVJIFBhY2sgKDUuMC40KS4gKEMpIDIwMTQgSnVsaWFuIFNoYXBpcm8uIE1JVCBAbGljZW5zZTogZW4ud2lraXBlZGlhLm9yZy93aWtpL01JVF9MaWNlbnNlLiBQb3J0aW9ucyBjb3B5cmlnaHQgRGFuaWVsIEVkZW4sIENocmlzdGlhbiBQdWNjaS4gKi9cblxuOyhmdW5jdGlvbiAoZmFjdG9yeSkge1xuICAgIC8qIENvbW1vbkpTIG1vZHVsZS4gKi9cbiAgICBpZiAodHlwZW9mIHJlcXVpcmUgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIiApIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgLyogQU1EIG1vZHVsZS4gKi9cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbIFwidmVsb2NpdHlcIiBdLCBmYWN0b3J5KTtcbiAgICAvKiBCcm93c2VyIGdsb2JhbHMuICovXG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmFjdG9yeSgpO1xuICAgIH1cbn0oZnVuY3Rpb24oKSB7XG5yZXR1cm4gZnVuY3Rpb24gKGdsb2JhbCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG5cbiAgICAvKioqKioqKioqKioqKlxuICAgICAgICBDaGVja3NcbiAgICAqKioqKioqKioqKioqL1xuXG4gICAgaWYgKCFnbG9iYWwuVmVsb2NpdHkgfHwgIWdsb2JhbC5WZWxvY2l0eS5VdGlsaXRpZXMpIHtcbiAgICAgICAgd2luZG93LmNvbnNvbGUgJiYgY29uc29sZS5sb2coXCJWZWxvY2l0eSBVSSBQYWNrOiBWZWxvY2l0eSBtdXN0IGJlIGxvYWRlZCBmaXJzdC4gQWJvcnRpbmcuXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIFZlbG9jaXR5ID0gZ2xvYmFsLlZlbG9jaXR5LFxuICAgICAgICAgICAgJCA9IFZlbG9jaXR5LlV0aWxpdGllcztcbiAgICB9XG5cbiAgICB2YXIgdmVsb2NpdHlWZXJzaW9uID0gVmVsb2NpdHkudmVyc2lvbixcbiAgICAgICAgcmVxdWlyZWRWZXJzaW9uID0geyBtYWpvcjogMSwgbWlub3I6IDEsIHBhdGNoOiAwIH07XG5cbiAgICBmdW5jdGlvbiBncmVhdGVyU2VtdmVyIChwcmltYXJ5LCBzZWNvbmRhcnkpIHtcbiAgICAgICAgdmFyIHZlcnNpb25JbnRzID0gW107XG5cbiAgICAgICAgaWYgKCFwcmltYXJ5IHx8ICFzZWNvbmRhcnkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICAgICAgJC5lYWNoKFsgcHJpbWFyeSwgc2Vjb25kYXJ5IF0sIGZ1bmN0aW9uKGksIHZlcnNpb25PYmplY3QpIHtcbiAgICAgICAgICAgIHZhciB2ZXJzaW9uSW50c0NvbXBvbmVudHMgPSBbXTtcblxuICAgICAgICAgICAgJC5lYWNoKHZlcnNpb25PYmplY3QsIGZ1bmN0aW9uKGNvbXBvbmVudCwgdmFsdWUpIHtcbiAgICAgICAgICAgICAgICB3aGlsZSAodmFsdWUudG9TdHJpbmcoKS5sZW5ndGggPCA1KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gXCIwXCIgKyB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmVyc2lvbkludHNDb21wb25lbnRzLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZlcnNpb25JbnRzLnB1c2godmVyc2lvbkludHNDb21wb25lbnRzLmpvaW4oXCJcIikpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiAocGFyc2VGbG9hdCh2ZXJzaW9uSW50c1swXSkgPiBwYXJzZUZsb2F0KHZlcnNpb25JbnRzWzFdKSk7XG4gICAgfVxuXG4gICAgaWYgKGdyZWF0ZXJTZW12ZXIocmVxdWlyZWRWZXJzaW9uLCB2ZWxvY2l0eVZlcnNpb24pKXtcbiAgICAgICAgdmFyIGFib3J0RXJyb3IgPSBcIlZlbG9jaXR5IFVJIFBhY2s6IFlvdSBuZWVkIHRvIHVwZGF0ZSBWZWxvY2l0eSAoanF1ZXJ5LnZlbG9jaXR5LmpzKSB0byBhIG5ld2VyIHZlcnNpb24uIFZpc2l0IGh0dHA6Ly9naXRodWIuY29tL2p1bGlhbnNoYXBpcm8vdmVsb2NpdHkuXCI7XG4gICAgICAgIGFsZXJ0KGFib3J0RXJyb3IpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYWJvcnRFcnJvcik7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAgIEVmZmVjdCBSZWdpc3RyYXRpb25cbiAgICAqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKiBOb3RlOiBSZWdpc3RlclVJIGlzIGEgbGVnYWN5IG5hbWUuICovXG4gICAgVmVsb2NpdHkuUmVnaXN0ZXJFZmZlY3QgPSBWZWxvY2l0eS5SZWdpc3RlclVJID0gZnVuY3Rpb24gKGVmZmVjdE5hbWUsIHByb3BlcnRpZXMpIHtcbiAgICAgICAgLyogQW5pbWF0ZSB0aGUgZXhwYW5zaW9uL2NvbnRyYWN0aW9uIG9mIHRoZSBlbGVtZW50cycgcGFyZW50J3MgaGVpZ2h0IGZvciBJbi9PdXQgZWZmZWN0cy4gKi9cbiAgICAgICAgZnVuY3Rpb24gYW5pbWF0ZVBhcmVudEhlaWdodCAoZWxlbWVudHMsIGRpcmVjdGlvbiwgdG90YWxEdXJhdGlvbiwgc3RhZ2dlcikge1xuICAgICAgICAgICAgdmFyIHRvdGFsSGVpZ2h0RGVsdGEgPSAwLFxuICAgICAgICAgICAgICAgIHBhcmVudE5vZGU7XG5cbiAgICAgICAgICAgIC8qIFN1bSB0aGUgdG90YWwgaGVpZ2h0IChpbmNsdWRpbmcgcGFkZGluZyBhbmQgbWFyZ2luKSBvZiBhbGwgdGFyZ2V0ZWQgZWxlbWVudHMuICovXG4gICAgICAgICAgICAkLmVhY2goZWxlbWVudHMubm9kZVR5cGUgPyBbIGVsZW1lbnRzIF0gOiBlbGVtZW50cywgZnVuY3Rpb24oaSwgZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGlmIChzdGFnZ2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIEluY3JlYXNlIHRoZSB0b3RhbER1cmF0aW9uIGJ5IHRoZSBzdWNjZXNzaXZlIGRlbGF5IGFtb3VudHMgcHJvZHVjZWQgYnkgdGhlIHN0YWdnZXIgb3B0aW9uLiAqL1xuICAgICAgICAgICAgICAgICAgICB0b3RhbER1cmF0aW9uICs9IGkgKiBzdGFnZ2VyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUgPSBlbGVtZW50LnBhcmVudE5vZGU7XG5cbiAgICAgICAgICAgICAgICAkLmVhY2goWyBcImhlaWdodFwiLCBcInBhZGRpbmdUb3BcIiwgXCJwYWRkaW5nQm90dG9tXCIsIFwibWFyZ2luVG9wXCIsIFwibWFyZ2luQm90dG9tXCJdLCBmdW5jdGlvbihpLCBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgICAgICB0b3RhbEhlaWdodERlbHRhICs9IHBhcnNlRmxvYXQoVmVsb2NpdHkuQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgcHJvcGVydHkpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKiBBbmltYXRlIHRoZSBwYXJlbnQgZWxlbWVudCdzIGhlaWdodCBhZGp1c3RtZW50ICh3aXRoIGEgdmFyeWluZyBkdXJhdGlvbiBtdWx0aXBsaWVyIGZvciBhZXN0aGV0aWMgYmVuZWZpdHMpLiAqL1xuICAgICAgICAgICAgVmVsb2NpdHkuYW5pbWF0ZShcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLFxuICAgICAgICAgICAgICAgIHsgaGVpZ2h0OiAoZGlyZWN0aW9uID09PSBcIkluXCIgPyBcIitcIiA6IFwiLVwiKSArIFwiPVwiICsgdG90YWxIZWlnaHREZWx0YSB9LFxuICAgICAgICAgICAgICAgIHsgcXVldWU6IGZhbHNlLCBlYXNpbmc6IFwiZWFzZS1pbi1vdXRcIiwgZHVyYXRpb246IHRvdGFsRHVyYXRpb24gKiAoZGlyZWN0aW9uID09PSBcIkluXCIgPyAwLjYgOiAxKSB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogUmVnaXN0ZXIgYSBjdXN0b20gcmVkaXJlY3QgZm9yIGVhY2ggZWZmZWN0LiAqL1xuICAgICAgICBWZWxvY2l0eS5SZWRpcmVjdHNbZWZmZWN0TmFtZV0gPSBmdW5jdGlvbiAoZWxlbWVudCwgcmVkaXJlY3RPcHRpb25zLCBlbGVtZW50c0luZGV4LCBlbGVtZW50c1NpemUsIGVsZW1lbnRzLCBwcm9taXNlRGF0YSkge1xuICAgICAgICAgICAgdmFyIGZpbmFsRWxlbWVudCA9IChlbGVtZW50c0luZGV4ID09PSBlbGVtZW50c1NpemUgLSAxKTtcblxuICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wZXJ0aWVzLmRlZmF1bHREdXJhdGlvbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgcHJvcGVydGllcy5kZWZhdWx0RHVyYXRpb24gPSBwcm9wZXJ0aWVzLmRlZmF1bHREdXJhdGlvbi5jYWxsKGVsZW1lbnRzLCBlbGVtZW50cyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMuZGVmYXVsdER1cmF0aW9uID0gcGFyc2VGbG9hdChwcm9wZXJ0aWVzLmRlZmF1bHREdXJhdGlvbik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCBlYWNoIGVmZmVjdCdzIGNhbGwgYXJyYXkuICovXG4gICAgICAgICAgICBmb3IgKHZhciBjYWxsSW5kZXggPSAwOyBjYWxsSW5kZXggPCBwcm9wZXJ0aWVzLmNhbGxzLmxlbmd0aDsgY2FsbEluZGV4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY2FsbCA9IHByb3BlcnRpZXMuY2FsbHNbY2FsbEluZGV4XSxcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlNYXAgPSBjYWxsWzBdLFxuICAgICAgICAgICAgICAgICAgICByZWRpcmVjdER1cmF0aW9uID0gKHJlZGlyZWN0T3B0aW9ucy5kdXJhdGlvbiB8fCBwcm9wZXJ0aWVzLmRlZmF1bHREdXJhdGlvbiB8fCAxMDAwKSxcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb25QZXJjZW50YWdlID0gY2FsbFsxXSxcbiAgICAgICAgICAgICAgICAgICAgY2FsbE9wdGlvbnMgPSBjYWxsWzJdIHx8IHt9LFxuICAgICAgICAgICAgICAgICAgICBvcHRzID0ge307XG5cbiAgICAgICAgICAgICAgICAvKiBBc3NpZ24gdGhlIHdoaXRlbGlzdGVkIHBlci1jYWxsIG9wdGlvbnMuICovXG4gICAgICAgICAgICAgICAgb3B0cy5kdXJhdGlvbiA9IHJlZGlyZWN0RHVyYXRpb24gKiAoZHVyYXRpb25QZXJjZW50YWdlIHx8IDEpO1xuICAgICAgICAgICAgICAgIG9wdHMucXVldWUgPSByZWRpcmVjdE9wdGlvbnMucXVldWUgfHwgXCJcIjtcbiAgICAgICAgICAgICAgICBvcHRzLmVhc2luZyA9IGNhbGxPcHRpb25zLmVhc2luZyB8fCBcImVhc2VcIjtcbiAgICAgICAgICAgICAgICBvcHRzLmRlbGF5ID0gcGFyc2VGbG9hdChjYWxsT3B0aW9ucy5kZWxheSkgfHwgMDtcbiAgICAgICAgICAgICAgICBvcHRzLl9jYWNoZVZhbHVlcyA9IGNhbGxPcHRpb25zLl9jYWNoZVZhbHVlcyB8fCB0cnVlO1xuXG4gICAgICAgICAgICAgICAgLyogU3BlY2lhbCBwcm9jZXNzaW5nIGZvciB0aGUgZmlyc3QgZWZmZWN0IGNhbGwuICovXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxJbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvKiBJZiBhIGRlbGF5IHdhcyBwYXNzZWQgaW50byB0aGUgcmVkaXJlY3QsIGNvbWJpbmUgaXQgd2l0aCB0aGUgZmlyc3QgY2FsbCdzIGRlbGF5LiAqL1xuICAgICAgICAgICAgICAgICAgICBvcHRzLmRlbGF5ICs9IChwYXJzZUZsb2F0KHJlZGlyZWN0T3B0aW9ucy5kZWxheSkgfHwgMCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnRzSW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuYmVnaW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBPbmx5IHRyaWdnZXIgYSBiZWdpbiBjYWxsYmFjayBvbiB0aGUgZmlyc3QgZWZmZWN0IGNhbGwgd2l0aCB0aGUgZmlyc3QgZWxlbWVudCBpbiB0aGUgc2V0LiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZGlyZWN0T3B0aW9ucy5iZWdpbiAmJiByZWRpcmVjdE9wdGlvbnMuYmVnaW4uY2FsbChlbGVtZW50cywgZWxlbWVudHMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpcmVjdGlvbiA9IGVmZmVjdE5hbWUubWF0Y2goLyhJbnxPdXQpJC8pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTWFrZSBcImluXCIgdHJhbnNpdGlvbmluZyBlbGVtZW50cyBpbnZpc2libGUgaW1tZWRpYXRlbHkgc28gdGhhdCB0aGVyZSdzIG5vIEZPVUMgYmV0d2VlbiBub3dcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgdGhlIGZpcnN0IFJBRiB0aWNrLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZGlyZWN0aW9uICYmIGRpcmVjdGlvblswXSA9PT0gXCJJblwiKSAmJiBwcm9wZXJ0eU1hcC5vcGFjaXR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGVsZW1lbnRzLm5vZGVUeXBlID8gWyBlbGVtZW50cyBdIDogZWxlbWVudHMsIGZ1bmN0aW9uKGksIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwib3BhY2l0eVwiLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogT25seSB0cmlnZ2VyIGFuaW1hdGVQYXJlbnRIZWlnaHQoKSBpZiB3ZSdyZSB1c2luZyBhbiBJbi9PdXQgdHJhbnNpdGlvbi4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVkaXJlY3RPcHRpb25zLmFuaW1hdGVQYXJlbnRIZWlnaHQgJiYgZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuaW1hdGVQYXJlbnRIZWlnaHQoZWxlbWVudHMsIGRpcmVjdGlvblswXSwgcmVkaXJlY3REdXJhdGlvbiArIG9wdHMuZGVsYXksIHJlZGlyZWN0T3B0aW9ucy5zdGFnZ2VyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgdXNlciBpc24ndCBvdmVycmlkaW5nIHRoZSBkaXNwbGF5IG9wdGlvbiwgZGVmYXVsdCB0byBcImF1dG9cIiBmb3IgXCJJblwiLXN1ZmZpeGVkIHRyYW5zaXRpb25zLiAqL1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVkaXJlY3RPcHRpb25zLmRpc3BsYXkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZWRpcmVjdE9wdGlvbnMuZGlzcGxheSAhPT0gdW5kZWZpbmVkICYmIHJlZGlyZWN0T3B0aW9ucy5kaXNwbGF5ICE9PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuZGlzcGxheSA9IHJlZGlyZWN0T3B0aW9ucy5kaXNwbGF5O1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgvSW4kLy50ZXN0KGVmZmVjdE5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSW5saW5lIGVsZW1lbnRzIGNhbm5vdCBiZSBzdWJqZWN0ZWQgdG8gdHJhbnNmb3Jtcywgc28gd2Ugc3dpdGNoIHRoZW0gdG8gaW5saW5lLWJsb2NrLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWZhdWx0RGlzcGxheSA9IFZlbG9jaXR5LkNTUy5WYWx1ZXMuZ2V0RGlzcGxheVR5cGUoZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5kaXNwbGF5ID0gKGRlZmF1bHREaXNwbGF5ID09PSBcImlubGluZVwiKSA/IFwiaW5saW5lLWJsb2NrXCIgOiBkZWZhdWx0RGlzcGxheTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZWRpcmVjdE9wdGlvbnMudmlzaWJpbGl0eSAmJiByZWRpcmVjdE9wdGlvbnMudmlzaWJpbGl0eSAhPT0gXCJoaWRkZW5cIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy52aXNpYmlsaXR5ID0gcmVkaXJlY3RPcHRpb25zLnZpc2liaWxpdHk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvKiBTcGVjaWFsIHByb2Nlc3NpbmcgZm9yIHRoZSBsYXN0IGVmZmVjdCBjYWxsLiAqL1xuICAgICAgICAgICAgICAgIGlmIChjYWxsSW5kZXggPT09IHByb3BlcnRpZXMuY2FsbHMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICAvKiBBcHBlbmQgcHJvbWlzZSByZXNvbHZpbmcgb250byB0aGUgdXNlcidzIHJlZGlyZWN0IGNhbGxiYWNrLiAqL1xuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBpbmplY3RGaW5hbENhbGxiYWNrcyAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoKHJlZGlyZWN0T3B0aW9ucy5kaXNwbGF5ID09PSB1bmRlZmluZWQgfHwgcmVkaXJlY3RPcHRpb25zLmRpc3BsYXkgPT09IFwibm9uZVwiKSAmJiAvT3V0JC8udGVzdChlZmZlY3ROYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChlbGVtZW50cy5ub2RlVHlwZSA/IFsgZWxlbWVudHMgXSA6IGVsZW1lbnRzLCBmdW5jdGlvbihpLCBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZGlyZWN0T3B0aW9ucy5jb21wbGV0ZSAmJiByZWRpcmVjdE9wdGlvbnMuY29tcGxldGUuY2FsbChlbGVtZW50cywgZWxlbWVudHMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvbWlzZURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlRGF0YS5yZXNvbHZlcihlbGVtZW50cyB8fCBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIG9wdHMuY29tcGxldGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzLnJlc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcmVzZXRQcm9wZXJ0eSBpbiBwcm9wZXJ0aWVzLnJlc2V0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNldFZhbHVlID0gcHJvcGVydGllcy5yZXNldFtyZXNldFByb3BlcnR5XTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBGb3JtYXQgZWFjaCBub24tYXJyYXkgdmFsdWUgaW4gdGhlIHJlc2V0IHByb3BlcnR5IG1hcCB0byBbIHZhbHVlLCB2YWx1ZSBdIHNvIHRoYXQgY2hhbmdlcyBhcHBseVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbW1lZGlhdGVseSBhbmQgRE9NIHF1ZXJ5aW5nIGlzIGF2b2lkZWQgKHZpYSBmb3JjZWZlZWRpbmcpLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBEb24ndCBmb3JjZWZlZWQgaG9va3MsIG90aGVyd2lzZSB0aGVpciBob29rIHJvb3RzIHdpbGwgYmUgZGVmYXVsdGVkIHRvIHRoZWlyIG51bGwgdmFsdWVzLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkuQ1NTLkhvb2tzLnJlZ2lzdGVyZWRbcmVzZXRQcm9wZXJ0eV0gPT09IHVuZGVmaW5lZCAmJiAodHlwZW9mIHJlc2V0VmFsdWUgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHJlc2V0VmFsdWUgPT09IFwibnVtYmVyXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLnJlc2V0W3Jlc2V0UHJvcGVydHldID0gWyBwcm9wZXJ0aWVzLnJlc2V0W3Jlc2V0UHJvcGVydHldLCBwcm9wZXJ0aWVzLnJlc2V0W3Jlc2V0UHJvcGVydHldIF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTbyB0aGF0IHRoZSByZXNldCB2YWx1ZXMgYXJlIGFwcGxpZWQgaW5zdGFudGx5IHVwb24gdGhlIG5leHQgckFGIHRpY2ssIHVzZSBhIHplcm8gZHVyYXRpb24gYW5kIHBhcmFsbGVsIHF1ZXVlaW5nLiAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNldE9wdGlvbnMgPSB7IGR1cmF0aW9uOiAwLCBxdWV1ZTogZmFsc2UgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNpbmNlIHRoZSByZXNldCBvcHRpb24gdXNlcyB1cCB0aGUgY29tcGxldGUgY2FsbGJhY2ssIHdlIHRyaWdnZXIgdGhlIHVzZXIncyBjb21wbGV0ZSBjYWxsYmFjayBhdCB0aGUgZW5kIG9mIG91cnMuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbmFsRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNldE9wdGlvbnMuY29tcGxldGUgPSBpbmplY3RGaW5hbENhbGxiYWNrcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5hbmltYXRlKGVsZW1lbnQsIHByb3BlcnRpZXMucmVzZXQsIHJlc2V0T3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBPbmx5IHRyaWdnZXIgdGhlIHVzZXIncyBjb21wbGV0ZSBjYWxsYmFjayBvbiB0aGUgbGFzdCBlZmZlY3QgY2FsbCB3aXRoIHRoZSBsYXN0IGVsZW1lbnQgaW4gdGhlIHNldC4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZmluYWxFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5qZWN0RmluYWxDYWxsYmFja3MoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocmVkaXJlY3RPcHRpb25zLnZpc2liaWxpdHkgPT09IFwiaGlkZGVuXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMudmlzaWJpbGl0eSA9IHJlZGlyZWN0T3B0aW9ucy52aXNpYmlsaXR5O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgVmVsb2NpdHkuYW5pbWF0ZShlbGVtZW50LCBwcm9wZXJ0eU1hcCwgb3B0cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLyogUmV0dXJuIHRoZSBWZWxvY2l0eSBvYmplY3Qgc28gdGhhdCBSZWdpc3RlclVJIGNhbGxzIGNhbiBiZSBjaGFpbmVkLiAqL1xuICAgICAgICByZXR1cm4gVmVsb2NpdHk7XG4gICAgfTtcblxuICAgIC8qKioqKioqKioqKioqKioqKioqKipcbiAgICAgICBQYWNrYWdlZCBFZmZlY3RzXG4gICAgKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyogRXh0ZXJuYWxpemUgdGhlIHBhY2thZ2VkRWZmZWN0cyBkYXRhIHNvIHRoYXQgdGhleSBjYW4gb3B0aW9uYWxseSBiZSBtb2RpZmllZCBhbmQgcmUtcmVnaXN0ZXJlZC4gKi9cbiAgICAvKiBTdXBwb3J0OiA8PUlFODogQ2FsbG91dHMgd2lsbCBoYXZlIG5vIGVmZmVjdCwgYW5kIHRyYW5zaXRpb25zIHdpbGwgc2ltcGx5IGZhZGUgaW4vb3V0LiBJRTkvQW5kcm9pZCAyLjM6IE1vc3QgZWZmZWN0cyBhcmUgZnVsbHkgc3VwcG9ydGVkLCB0aGUgcmVzdCBmYWRlIGluL291dC4gQWxsIG90aGVyIGJyb3dzZXJzOiBmdWxsIHN1cHBvcnQuICovXG4gICAgVmVsb2NpdHkuUmVnaXN0ZXJFZmZlY3QucGFja2FnZWRFZmZlY3RzID1cbiAgICAgICAge1xuICAgICAgICAgICAgLyogQW5pbWF0ZS5jc3MgKi9cbiAgICAgICAgICAgIFwiY2FsbG91dC5ib3VuY2VcIjoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHREdXJhdGlvbjogNTUwLFxuICAgICAgICAgICAgICAgIGNhbGxzOiBbXG4gICAgICAgICAgICAgICAgICAgIFsgeyB0cmFuc2xhdGVZOiAtMzAgfSwgMC4yNSBdLFxuICAgICAgICAgICAgICAgICAgICBbIHsgdHJhbnNsYXRlWTogMCB9LCAwLjEyNSBdLFxuICAgICAgICAgICAgICAgICAgICBbIHsgdHJhbnNsYXRlWTogLTE1IH0sIDAuMTI1IF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeyB0cmFuc2xhdGVZOiAwIH0sIDAuMjUgXVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiBBbmltYXRlLmNzcyAqL1xuICAgICAgICAgICAgXCJjYWxsb3V0LnNoYWtlXCI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0RHVyYXRpb246IDgwMCxcbiAgICAgICAgICAgICAgICBjYWxsczogW1xuICAgICAgICAgICAgICAgICAgICBbIHsgdHJhbnNsYXRlWDogLTExIH0sIDAuMTI1IF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeyB0cmFuc2xhdGVYOiAxMSB9LCAwLjEyNSBdLFxuICAgICAgICAgICAgICAgICAgICBbIHsgdHJhbnNsYXRlWDogLTExIH0sIDAuMTI1IF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeyB0cmFuc2xhdGVYOiAxMSB9LCAwLjEyNSBdLFxuICAgICAgICAgICAgICAgICAgICBbIHsgdHJhbnNsYXRlWDogLTExIH0sIDAuMTI1IF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeyB0cmFuc2xhdGVYOiAxMSB9LCAwLjEyNSBdLFxuICAgICAgICAgICAgICAgICAgICBbIHsgdHJhbnNsYXRlWDogLTExIH0sIDAuMTI1IF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeyB0cmFuc2xhdGVYOiAwIH0sIDAuMTI1IF1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyogQW5pbWF0ZS5jc3MgKi9cbiAgICAgICAgICAgIFwiY2FsbG91dC5mbGFzaFwiOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdER1cmF0aW9uOiAxMTAwLFxuICAgICAgICAgICAgICAgIGNhbGxzOiBbXG4gICAgICAgICAgICAgICAgICAgIFsgeyBvcGFjaXR5OiBbIDAsIFwiZWFzZUluT3V0UXVhZFwiLCAxIF0gfSwgMC4yNSBdLFxuICAgICAgICAgICAgICAgICAgICBbIHsgb3BhY2l0eTogWyAxLCBcImVhc2VJbk91dFF1YWRcIiBdIH0sIDAuMjUgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMCwgXCJlYXNlSW5PdXRRdWFkXCIgXSB9LCAwLjI1IF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeyBvcGFjaXR5OiBbIDEsIFwiZWFzZUluT3V0UXVhZFwiIF0gfSwgMC4yNSBdXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qIEFuaW1hdGUuY3NzICovXG4gICAgICAgICAgICBcImNhbGxvdXQucHVsc2VcIjoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHREdXJhdGlvbjogODI1LFxuICAgICAgICAgICAgICAgIGNhbGxzOiBbXG4gICAgICAgICAgICAgICAgICAgIFsgeyBzY2FsZVg6IDEuMSwgc2NhbGVZOiAxLjEgfSwgMC41MCwgeyBlYXNpbmc6IFwiZWFzZUluRXhwb1wiIH0gXSxcbiAgICAgICAgICAgICAgICAgICAgWyB7IHNjYWxlWDogMSwgc2NhbGVZOiAxIH0sIDAuNTAgXVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiBBbmltYXRlLmNzcyAqL1xuICAgICAgICAgICAgXCJjYWxsb3V0LnN3aW5nXCI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0RHVyYXRpb246IDk1MCxcbiAgICAgICAgICAgICAgICBjYWxsczogW1xuICAgICAgICAgICAgICAgICAgICBbIHsgcm90YXRlWjogMTUgfSwgMC4yMCBdLFxuICAgICAgICAgICAgICAgICAgICBbIHsgcm90YXRlWjogLTEwIH0sIDAuMjAgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB7IHJvdGF0ZVo6IDUgfSwgMC4yMCBdLFxuICAgICAgICAgICAgICAgICAgICBbIHsgcm90YXRlWjogLTUgfSwgMC4yMCBdLFxuICAgICAgICAgICAgICAgICAgICBbIHsgcm90YXRlWjogMCB9LCAwLjIwIF1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyogQW5pbWF0ZS5jc3MgKi9cbiAgICAgICAgICAgIFwiY2FsbG91dC50YWRhXCI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0RHVyYXRpb246IDEwMDAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IHNjYWxlWDogMC45LCBzY2FsZVk6IDAuOSwgcm90YXRlWjogLTMgfSwgMC4xMCBdLFxuICAgICAgICAgICAgICAgICAgICBbIHsgc2NhbGVYOiAxLjEsIHNjYWxlWTogMS4xLCByb3RhdGVaOiAzIH0sIDAuMTAgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB7IHNjYWxlWDogMS4xLCBzY2FsZVk6IDEuMSwgcm90YXRlWjogLTMgfSwgMC4xMCBdLFxuICAgICAgICAgICAgICAgICAgICBbIFwicmV2ZXJzZVwiLCAwLjEyNSBdLFxuICAgICAgICAgICAgICAgICAgICBbIFwicmV2ZXJzZVwiLCAwLjEyNSBdLFxuICAgICAgICAgICAgICAgICAgICBbIFwicmV2ZXJzZVwiLCAwLjEyNSBdLFxuICAgICAgICAgICAgICAgICAgICBbIFwicmV2ZXJzZVwiLCAwLjEyNSBdLFxuICAgICAgICAgICAgICAgICAgICBbIFwicmV2ZXJzZVwiLCAwLjEyNSBdLFxuICAgICAgICAgICAgICAgICAgICBbIHsgc2NhbGVYOiAxLCBzY2FsZVk6IDEsIHJvdGF0ZVo6IDAgfSwgMC4yMCBdXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwidHJhbnNpdGlvbi5mYWRlSW5cIjoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHREdXJhdGlvbjogNTAwLFxuICAgICAgICAgICAgICAgIGNhbGxzOiBbXG4gICAgICAgICAgICAgICAgICAgIFsgeyBvcGFjaXR5OiBbIDEsIDAgXSB9IF1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ0cmFuc2l0aW9uLmZhZGVPdXRcIjoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHREdXJhdGlvbjogNTAwLFxuICAgICAgICAgICAgICAgIGNhbGxzOiBbXG4gICAgICAgICAgICAgICAgICAgIFsgeyBvcGFjaXR5OiBbIDAsIDEgXSB9IF1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyogU3VwcG9ydDogTG9zZXMgcm90YXRpb24gaW4gSUU5L0FuZHJvaWQgMi4zIChmYWRlcyBvbmx5KS4gKi9cbiAgICAgICAgICAgIFwidHJhbnNpdGlvbi5mbGlwWEluXCI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0RHVyYXRpb246IDcwMCxcbiAgICAgICAgICAgICAgICBjYWxsczogW1xuICAgICAgICAgICAgICAgICAgICBbIHsgb3BhY2l0eTogWyAxLCAwIF0sIHRyYW5zZm9ybVBlcnNwZWN0aXZlOiBbIDgwMCwgODAwIF0sIHJvdGF0ZVk6IFsgMCwgLTU1IF0gfSBdXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICByZXNldDogeyB0cmFuc2Zvcm1QZXJzcGVjdGl2ZTogMCB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyogU3VwcG9ydDogTG9zZXMgcm90YXRpb24gaW4gSUU5L0FuZHJvaWQgMi4zIChmYWRlcyBvbmx5KS4gKi9cbiAgICAgICAgICAgIFwidHJhbnNpdGlvbi5mbGlwWE91dFwiOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdER1cmF0aW9uOiA3MDAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMCwgMSBdLCB0cmFuc2Zvcm1QZXJzcGVjdGl2ZTogWyA4MDAsIDgwMCBdLCByb3RhdGVZOiA1NSB9IF1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJlc2V0OiB7IHRyYW5zZm9ybVBlcnNwZWN0aXZlOiAwLCByb3RhdGVZOiAwIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiBTdXBwb3J0OiBMb3NlcyByb3RhdGlvbiBpbiBJRTkvQW5kcm9pZCAyLjMgKGZhZGVzIG9ubHkpLiAqL1xuICAgICAgICAgICAgXCJ0cmFuc2l0aW9uLmZsaXBZSW5cIjoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHREdXJhdGlvbjogODAwLFxuICAgICAgICAgICAgICAgIGNhbGxzOiBbXG4gICAgICAgICAgICAgICAgICAgIFsgeyBvcGFjaXR5OiBbIDEsIDAgXSwgdHJhbnNmb3JtUGVyc3BlY3RpdmU6IFsgODAwLCA4MDAgXSwgcm90YXRlWDogWyAwLCAtNDUgXSB9IF1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJlc2V0OiB7IHRyYW5zZm9ybVBlcnNwZWN0aXZlOiAwIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiBTdXBwb3J0OiBMb3NlcyByb3RhdGlvbiBpbiBJRTkvQW5kcm9pZCAyLjMgKGZhZGVzIG9ubHkpLiAqL1xuICAgICAgICAgICAgXCJ0cmFuc2l0aW9uLmZsaXBZT3V0XCI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0RHVyYXRpb246IDgwMCxcbiAgICAgICAgICAgICAgICBjYWxsczogW1xuICAgICAgICAgICAgICAgICAgICBbIHsgb3BhY2l0eTogWyAwLCAxIF0sIHRyYW5zZm9ybVBlcnNwZWN0aXZlOiBbIDgwMCwgODAwIF0sIHJvdGF0ZVg6IDI1IH0gXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgcmVzZXQ6IHsgdHJhbnNmb3JtUGVyc3BlY3RpdmU6IDAsIHJvdGF0ZVg6IDAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qIEFuaW1hdGUuY3NzICovXG4gICAgICAgICAgICAvKiBTdXBwb3J0OiBMb3NlcyByb3RhdGlvbiBpbiBJRTkvQW5kcm9pZCAyLjMgKGZhZGVzIG9ubHkpLiAqL1xuICAgICAgICAgICAgXCJ0cmFuc2l0aW9uLmZsaXBCb3VuY2VYSW5cIjoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHREdXJhdGlvbjogOTAwLFxuICAgICAgICAgICAgICAgIGNhbGxzOiBbXG4gICAgICAgICAgICAgICAgICAgIFsgeyBvcGFjaXR5OiBbIDAuNzI1LCAwIF0sIHRyYW5zZm9ybVBlcnNwZWN0aXZlOiBbIDQwMCwgNDAwIF0sIHJvdGF0ZVk6IFsgLTEwLCA5MCBdIH0sIDAuNTAgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IDAuODAsIHJvdGF0ZVk6IDEwIH0sIDAuMjUgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IDEsIHJvdGF0ZVk6IDAgfSwgMC4yNSBdXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICByZXNldDogeyB0cmFuc2Zvcm1QZXJzcGVjdGl2ZTogMCB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyogQW5pbWF0ZS5jc3MgKi9cbiAgICAgICAgICAgIC8qIFN1cHBvcnQ6IExvc2VzIHJvdGF0aW9uIGluIElFOS9BbmRyb2lkIDIuMyAoZmFkZXMgb25seSkuICovXG4gICAgICAgICAgICBcInRyYW5zaXRpb24uZmxpcEJvdW5jZVhPdXRcIjoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHREdXJhdGlvbjogODAwLFxuICAgICAgICAgICAgICAgIGNhbGxzOiBbXG4gICAgICAgICAgICAgICAgICAgIFsgeyBvcGFjaXR5OiBbIDAuOSwgMSBdLCB0cmFuc2Zvcm1QZXJzcGVjdGl2ZTogWyA0MDAsIDQwMCBdLCByb3RhdGVZOiAtMTAgfSwgMC41MCBdLFxuICAgICAgICAgICAgICAgICAgICBbIHsgb3BhY2l0eTogMCwgcm90YXRlWTogOTAgfSwgMC41MCBdXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICByZXNldDogeyB0cmFuc2Zvcm1QZXJzcGVjdGl2ZTogMCwgcm90YXRlWTogMCB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyogQW5pbWF0ZS5jc3MgKi9cbiAgICAgICAgICAgIC8qIFN1cHBvcnQ6IExvc2VzIHJvdGF0aW9uIGluIElFOS9BbmRyb2lkIDIuMyAoZmFkZXMgb25seSkuICovXG4gICAgICAgICAgICBcInRyYW5zaXRpb24uZmxpcEJvdW5jZVlJblwiOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdER1cmF0aW9uOiA4NTAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMC43MjUsIDAgXSwgdHJhbnNmb3JtUGVyc3BlY3RpdmU6IFsgNDAwLCA0MDAgXSwgcm90YXRlWDogWyAtMTAsIDkwIF0gfSwgMC41MCBdLFxuICAgICAgICAgICAgICAgICAgICBbIHsgb3BhY2l0eTogMC44MCwgcm90YXRlWDogMTAgfSwgMC4yNSBdLFxuICAgICAgICAgICAgICAgICAgICBbIHsgb3BhY2l0eTogMSwgcm90YXRlWDogMCB9LCAwLjI1IF1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJlc2V0OiB7IHRyYW5zZm9ybVBlcnNwZWN0aXZlOiAwIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiBBbmltYXRlLmNzcyAqL1xuICAgICAgICAgICAgLyogU3VwcG9ydDogTG9zZXMgcm90YXRpb24gaW4gSUU5L0FuZHJvaWQgMi4zIChmYWRlcyBvbmx5KS4gKi9cbiAgICAgICAgICAgIFwidHJhbnNpdGlvbi5mbGlwQm91bmNlWU91dFwiOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdER1cmF0aW9uOiA4MDAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMC45LCAxIF0sIHRyYW5zZm9ybVBlcnNwZWN0aXZlOiBbIDQwMCwgNDAwIF0sIHJvdGF0ZVg6IC0xNSB9LCAwLjUwIF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeyBvcGFjaXR5OiAwLCByb3RhdGVYOiA5MCB9LCAwLjUwIF1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJlc2V0OiB7IHRyYW5zZm9ybVBlcnNwZWN0aXZlOiAwLCByb3RhdGVYOiAwIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiBNYWdpYy5jc3MgKi9cbiAgICAgICAgICAgIFwidHJhbnNpdGlvbi5zd29vcEluXCI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0RHVyYXRpb246IDg1MCxcbiAgICAgICAgICAgICAgICBjYWxsczogW1xuICAgICAgICAgICAgICAgICAgICBbIHsgb3BhY2l0eTogWyAxLCAwIF0sIHRyYW5zZm9ybU9yaWdpblg6IFsgXCIxMDAlXCIsIFwiNTAlXCIgXSwgdHJhbnNmb3JtT3JpZ2luWTogWyBcIjEwMCVcIiwgXCIxMDAlXCIgXSwgc2NhbGVYOiBbIDEsIDAgXSwgc2NhbGVZOiBbIDEsIDAgXSwgdHJhbnNsYXRlWDogWyAwLCAtNzAwIF0sIHRyYW5zbGF0ZVo6IDAgfSBdXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICByZXNldDogeyB0cmFuc2Zvcm1PcmlnaW5YOiBcIjUwJVwiLCB0cmFuc2Zvcm1PcmlnaW5ZOiBcIjUwJVwiIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiBNYWdpYy5jc3MgKi9cbiAgICAgICAgICAgIFwidHJhbnNpdGlvbi5zd29vcE91dFwiOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdER1cmF0aW9uOiA4NTAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMCwgMSBdLCB0cmFuc2Zvcm1PcmlnaW5YOiBbIFwiNTAlXCIsIFwiMTAwJVwiIF0sIHRyYW5zZm9ybU9yaWdpblk6IFsgXCIxMDAlXCIsIFwiMTAwJVwiIF0sIHNjYWxlWDogMCwgc2NhbGVZOiAwLCB0cmFuc2xhdGVYOiAtNzAwLCB0cmFuc2xhdGVaOiAwIH0gXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgcmVzZXQ6IHsgdHJhbnNmb3JtT3JpZ2luWDogXCI1MCVcIiwgdHJhbnNmb3JtT3JpZ2luWTogXCI1MCVcIiwgc2NhbGVYOiAxLCBzY2FsZVk6IDEsIHRyYW5zbGF0ZVg6IDAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qIE1hZ2ljLmNzcyAqL1xuICAgICAgICAgICAgLyogU3VwcG9ydDogTG9zZXMgcm90YXRpb24gaW4gSUU5L0FuZHJvaWQgMi4zLiAoRmFkZXMgYW5kIHNjYWxlcyBvbmx5LikgKi9cbiAgICAgICAgICAgIFwidHJhbnNpdGlvbi53aGlybEluXCI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0RHVyYXRpb246IDg1MCxcbiAgICAgICAgICAgICAgICBjYWxsczogW1xuICAgICAgICAgICAgICAgICAgICBbIHsgb3BhY2l0eTogWyAxLCAwIF0sIHRyYW5zZm9ybU9yaWdpblg6IFsgXCI1MCVcIiwgXCI1MCVcIiBdLCB0cmFuc2Zvcm1PcmlnaW5ZOiBbIFwiNTAlXCIsIFwiNTAlXCIgXSwgc2NhbGVYOiBbIDEsIDAgXSwgc2NhbGVZOiBbIDEsIDAgXSwgcm90YXRlWTogWyAwLCAxNjAgXSB9LCAxLCB7IGVhc2luZzogXCJlYXNlSW5PdXRTaW5lXCIgfSBdXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qIE1hZ2ljLmNzcyAqL1xuICAgICAgICAgICAgLyogU3VwcG9ydDogTG9zZXMgcm90YXRpb24gaW4gSUU5L0FuZHJvaWQgMi4zLiAoRmFkZXMgYW5kIHNjYWxlcyBvbmx5LikgKi9cbiAgICAgICAgICAgIFwidHJhbnNpdGlvbi53aGlybE91dFwiOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdER1cmF0aW9uOiA3NTAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMCwgXCJlYXNlSW5PdXRRdWludFwiLCAxIF0sIHRyYW5zZm9ybU9yaWdpblg6IFsgXCI1MCVcIiwgXCI1MCVcIiBdLCB0cmFuc2Zvcm1PcmlnaW5ZOiBbIFwiNTAlXCIsIFwiNTAlXCIgXSwgc2NhbGVYOiAwLCBzY2FsZVk6IDAsIHJvdGF0ZVk6IDE2MCB9LCAxLCB7IGVhc2luZzogXCJzd2luZ1wiIH0gXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgcmVzZXQ6IHsgc2NhbGVYOiAxLCBzY2FsZVk6IDEsIHJvdGF0ZVk6IDAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwidHJhbnNpdGlvbi5zaHJpbmtJblwiOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdER1cmF0aW9uOiA3NTAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMSwgMCBdLCB0cmFuc2Zvcm1PcmlnaW5YOiBbIFwiNTAlXCIsIFwiNTAlXCIgXSwgdHJhbnNmb3JtT3JpZ2luWTogWyBcIjUwJVwiLCBcIjUwJVwiIF0sIHNjYWxlWDogWyAxLCAxLjUgXSwgc2NhbGVZOiBbIDEsIDEuNSBdLCB0cmFuc2xhdGVaOiAwIH0gXVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInRyYW5zaXRpb24uc2hyaW5rT3V0XCI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0RHVyYXRpb246IDYwMCxcbiAgICAgICAgICAgICAgICBjYWxsczogW1xuICAgICAgICAgICAgICAgICAgICBbIHsgb3BhY2l0eTogWyAwLCAxIF0sIHRyYW5zZm9ybU9yaWdpblg6IFsgXCI1MCVcIiwgXCI1MCVcIiBdLCB0cmFuc2Zvcm1PcmlnaW5ZOiBbIFwiNTAlXCIsIFwiNTAlXCIgXSwgc2NhbGVYOiAxLjMsIHNjYWxlWTogMS4zLCB0cmFuc2xhdGVaOiAwIH0gXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgcmVzZXQ6IHsgc2NhbGVYOiAxLCBzY2FsZVk6IDEgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwidHJhbnNpdGlvbi5leHBhbmRJblwiOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdER1cmF0aW9uOiA3MDAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMSwgMCBdLCB0cmFuc2Zvcm1PcmlnaW5YOiBbIFwiNTAlXCIsIFwiNTAlXCIgXSwgdHJhbnNmb3JtT3JpZ2luWTogWyBcIjUwJVwiLCBcIjUwJVwiIF0sIHNjYWxlWDogWyAxLCAwLjYyNSBdLCBzY2FsZVk6IFsgMSwgMC42MjUgXSwgdHJhbnNsYXRlWjogMCB9IF1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ0cmFuc2l0aW9uLmV4cGFuZE91dFwiOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdER1cmF0aW9uOiA3MDAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMCwgMSBdLCB0cmFuc2Zvcm1PcmlnaW5YOiBbIFwiNTAlXCIsIFwiNTAlXCIgXSwgdHJhbnNmb3JtT3JpZ2luWTogWyBcIjUwJVwiLCBcIjUwJVwiIF0sIHNjYWxlWDogMC41LCBzY2FsZVk6IDAuNSwgdHJhbnNsYXRlWjogMCB9IF1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJlc2V0OiB7IHNjYWxlWDogMSwgc2NhbGVZOiAxIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiBBbmltYXRlLmNzcyAqL1xuICAgICAgICAgICAgXCJ0cmFuc2l0aW9uLmJvdW5jZUluXCI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0RHVyYXRpb246IDgwMCxcbiAgICAgICAgICAgICAgICBjYWxsczogW1xuICAgICAgICAgICAgICAgICAgICBbIHsgb3BhY2l0eTogWyAxLCAwIF0sIHNjYWxlWDogWyAxLjA1LCAwLjMgXSwgc2NhbGVZOiBbIDEuMDUsIDAuMyBdIH0sIDAuNDAgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB7IHNjYWxlWDogMC45LCBzY2FsZVk6IDAuOSwgdHJhbnNsYXRlWjogMCB9LCAwLjIwIF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeyBzY2FsZVg6IDEsIHNjYWxlWTogMSB9LCAwLjUwIF1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyogQW5pbWF0ZS5jc3MgKi9cbiAgICAgICAgICAgIFwidHJhbnNpdGlvbi5ib3VuY2VPdXRcIjoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHREdXJhdGlvbjogODAwLFxuICAgICAgICAgICAgICAgIGNhbGxzOiBbXG4gICAgICAgICAgICAgICAgICAgIFsgeyBzY2FsZVg6IDAuOTUsIHNjYWxlWTogMC45NSB9LCAwLjM1IF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeyBzY2FsZVg6IDEuMSwgc2NhbGVZOiAxLjEsIHRyYW5zbGF0ZVo6IDAgfSwgMC4zNSBdLFxuICAgICAgICAgICAgICAgICAgICBbIHsgb3BhY2l0eTogWyAwLCAxIF0sIHNjYWxlWDogMC4zLCBzY2FsZVk6IDAuMyB9LCAwLjMwIF1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJlc2V0OiB7IHNjYWxlWDogMSwgc2NhbGVZOiAxIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiBBbmltYXRlLmNzcyAqL1xuICAgICAgICAgICAgXCJ0cmFuc2l0aW9uLmJvdW5jZVVwSW5cIjoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHREdXJhdGlvbjogODAwLFxuICAgICAgICAgICAgICAgIGNhbGxzOiBbXG4gICAgICAgICAgICAgICAgICAgIFsgeyBvcGFjaXR5OiBbIDEsIDAgXSwgdHJhbnNsYXRlWTogWyAtMzAsIDEwMDAgXSB9LCAwLjYwLCB7IGVhc2luZzogXCJlYXNlT3V0Q2lyY1wiIH0gXSxcbiAgICAgICAgICAgICAgICAgICAgWyB7IHRyYW5zbGF0ZVk6IDEwIH0sIDAuMjAgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB7IHRyYW5zbGF0ZVk6IDAgfSwgMC4yMCBdXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qIEFuaW1hdGUuY3NzICovXG4gICAgICAgICAgICBcInRyYW5zaXRpb24uYm91bmNlVXBPdXRcIjoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHREdXJhdGlvbjogMTAwMCxcbiAgICAgICAgICAgICAgICBjYWxsczogW1xuICAgICAgICAgICAgICAgICAgICBbIHsgdHJhbnNsYXRlWTogMjAgfSwgMC4yMCBdLFxuICAgICAgICAgICAgICAgICAgICBbIHsgb3BhY2l0eTogWyAwLCBcImVhc2VJbkNpcmNcIiwgMSBdLCB0cmFuc2xhdGVZOiAtMTAwMCB9LCAwLjgwIF1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJlc2V0OiB7IHRyYW5zbGF0ZVk6IDAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qIEFuaW1hdGUuY3NzICovXG4gICAgICAgICAgICBcInRyYW5zaXRpb24uYm91bmNlRG93bkluXCI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0RHVyYXRpb246IDgwMCxcbiAgICAgICAgICAgICAgICBjYWxsczogW1xuICAgICAgICAgICAgICAgICAgICBbIHsgb3BhY2l0eTogWyAxLCAwIF0sIHRyYW5zbGF0ZVk6IFsgMzAsIC0xMDAwIF0gfSwgMC42MCwgeyBlYXNpbmc6IFwiZWFzZU91dENpcmNcIiB9IF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeyB0cmFuc2xhdGVZOiAtMTAgfSwgMC4yMCBdLFxuICAgICAgICAgICAgICAgICAgICBbIHsgdHJhbnNsYXRlWTogMCB9LCAwLjIwIF1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyogQW5pbWF0ZS5jc3MgKi9cbiAgICAgICAgICAgIFwidHJhbnNpdGlvbi5ib3VuY2VEb3duT3V0XCI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0RHVyYXRpb246IDEwMDAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IHRyYW5zbGF0ZVk6IC0yMCB9LCAwLjIwIF0sXG4gICAgICAgICAgICAgICAgICAgIFsgeyBvcGFjaXR5OiBbIDAsIFwiZWFzZUluQ2lyY1wiLCAxIF0sIHRyYW5zbGF0ZVk6IDEwMDAgfSwgMC44MCBdXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICByZXNldDogeyB0cmFuc2xhdGVZOiAwIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiBBbmltYXRlLmNzcyAqL1xuICAgICAgICAgICAgXCJ0cmFuc2l0aW9uLmJvdW5jZUxlZnRJblwiOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdER1cmF0aW9uOiA3NTAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMSwgMCBdLCB0cmFuc2xhdGVYOiBbIDMwLCAtMTI1MCBdIH0sIDAuNjAsIHsgZWFzaW5nOiBcImVhc2VPdXRDaXJjXCIgfSBdLFxuICAgICAgICAgICAgICAgICAgICBbIHsgdHJhbnNsYXRlWDogLTEwIH0sIDAuMjAgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB7IHRyYW5zbGF0ZVg6IDAgfSwgMC4yMCBdXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qIEFuaW1hdGUuY3NzICovXG4gICAgICAgICAgICBcInRyYW5zaXRpb24uYm91bmNlTGVmdE91dFwiOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdER1cmF0aW9uOiA3NTAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IHRyYW5zbGF0ZVg6IDMwIH0sIDAuMjAgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMCwgXCJlYXNlSW5DaXJjXCIsIDEgXSwgdHJhbnNsYXRlWDogLTEyNTAgfSwgMC44MCBdXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICByZXNldDogeyB0cmFuc2xhdGVYOiAwIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiBBbmltYXRlLmNzcyAqL1xuICAgICAgICAgICAgXCJ0cmFuc2l0aW9uLmJvdW5jZVJpZ2h0SW5cIjoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHREdXJhdGlvbjogNzUwLFxuICAgICAgICAgICAgICAgIGNhbGxzOiBbXG4gICAgICAgICAgICAgICAgICAgIFsgeyBvcGFjaXR5OiBbIDEsIDAgXSwgdHJhbnNsYXRlWDogWyAtMzAsIDEyNTAgXSB9LCAwLjYwLCB7IGVhc2luZzogXCJlYXNlT3V0Q2lyY1wiIH0gXSxcbiAgICAgICAgICAgICAgICAgICAgWyB7IHRyYW5zbGF0ZVg6IDEwIH0sIDAuMjAgXSxcbiAgICAgICAgICAgICAgICAgICAgWyB7IHRyYW5zbGF0ZVg6IDAgfSwgMC4yMCBdXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qIEFuaW1hdGUuY3NzICovXG4gICAgICAgICAgICBcInRyYW5zaXRpb24uYm91bmNlUmlnaHRPdXRcIjoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHREdXJhdGlvbjogNzUwLFxuICAgICAgICAgICAgICAgIGNhbGxzOiBbXG4gICAgICAgICAgICAgICAgICAgIFsgeyB0cmFuc2xhdGVYOiAtMzAgfSwgMC4yMCBdLFxuICAgICAgICAgICAgICAgICAgICBbIHsgb3BhY2l0eTogWyAwLCBcImVhc2VJbkNpcmNcIiwgMSBdLCB0cmFuc2xhdGVYOiAxMjUwIH0sIDAuODAgXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgcmVzZXQ6IHsgdHJhbnNsYXRlWDogMCB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ0cmFuc2l0aW9uLnNsaWRlVXBJblwiOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdER1cmF0aW9uOiA5MDAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMSwgMCBdLCB0cmFuc2xhdGVZOiBbIDAsIDIwIF0sIHRyYW5zbGF0ZVo6IDAgfSBdXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwidHJhbnNpdGlvbi5zbGlkZVVwT3V0XCI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0RHVyYXRpb246IDkwMCxcbiAgICAgICAgICAgICAgICBjYWxsczogW1xuICAgICAgICAgICAgICAgICAgICBbIHsgb3BhY2l0eTogWyAwLCAxIF0sIHRyYW5zbGF0ZVk6IC0yMCwgdHJhbnNsYXRlWjogMCB9IF1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJlc2V0OiB7IHRyYW5zbGF0ZVk6IDAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwidHJhbnNpdGlvbi5zbGlkZURvd25JblwiOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdER1cmF0aW9uOiA5MDAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMSwgMCBdLCB0cmFuc2xhdGVZOiBbIDAsIC0yMCBdLCB0cmFuc2xhdGVaOiAwIH0gXVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInRyYW5zaXRpb24uc2xpZGVEb3duT3V0XCI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0RHVyYXRpb246IDkwMCxcbiAgICAgICAgICAgICAgICBjYWxsczogW1xuICAgICAgICAgICAgICAgICAgICBbIHsgb3BhY2l0eTogWyAwLCAxIF0sIHRyYW5zbGF0ZVk6IDIwLCB0cmFuc2xhdGVaOiAwIH0gXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgcmVzZXQ6IHsgdHJhbnNsYXRlWTogMCB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ0cmFuc2l0aW9uLnNsaWRlTGVmdEluXCI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0RHVyYXRpb246IDEwMDAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMSwgMCBdLCB0cmFuc2xhdGVYOiBbIDAsIC0yMCBdLCB0cmFuc2xhdGVaOiAwIH0gXVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInRyYW5zaXRpb24uc2xpZGVMZWZ0T3V0XCI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0RHVyYXRpb246IDEwNTAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMCwgMSBdLCB0cmFuc2xhdGVYOiAtMjAsIHRyYW5zbGF0ZVo6IDAgfSBdXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICByZXNldDogeyB0cmFuc2xhdGVYOiAwIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInRyYW5zaXRpb24uc2xpZGVSaWdodEluXCI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0RHVyYXRpb246IDEwMDAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMSwgMCBdLCB0cmFuc2xhdGVYOiBbIDAsIDIwIF0sIHRyYW5zbGF0ZVo6IDAgfSBdXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwidHJhbnNpdGlvbi5zbGlkZVJpZ2h0T3V0XCI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0RHVyYXRpb246IDEwNTAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMCwgMSBdLCB0cmFuc2xhdGVYOiAyMCwgdHJhbnNsYXRlWjogMCB9IF1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJlc2V0OiB7IHRyYW5zbGF0ZVg6IDAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwidHJhbnNpdGlvbi5zbGlkZVVwQmlnSW5cIjoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHREdXJhdGlvbjogODUwLFxuICAgICAgICAgICAgICAgIGNhbGxzOiBbXG4gICAgICAgICAgICAgICAgICAgIFsgeyBvcGFjaXR5OiBbIDEsIDAgXSwgdHJhbnNsYXRlWTogWyAwLCA3NSBdLCB0cmFuc2xhdGVaOiAwIH0gXVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInRyYW5zaXRpb24uc2xpZGVVcEJpZ091dFwiOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdER1cmF0aW9uOiA4MDAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMCwgMSBdLCB0cmFuc2xhdGVZOiAtNzUsIHRyYW5zbGF0ZVo6IDAgfSBdXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICByZXNldDogeyB0cmFuc2xhdGVZOiAwIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInRyYW5zaXRpb24uc2xpZGVEb3duQmlnSW5cIjoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHREdXJhdGlvbjogODUwLFxuICAgICAgICAgICAgICAgIGNhbGxzOiBbXG4gICAgICAgICAgICAgICAgICAgIFsgeyBvcGFjaXR5OiBbIDEsIDAgXSwgdHJhbnNsYXRlWTogWyAwLCAtNzUgXSwgdHJhbnNsYXRlWjogMCB9IF1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ0cmFuc2l0aW9uLnNsaWRlRG93bkJpZ091dFwiOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdER1cmF0aW9uOiA4MDAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMCwgMSBdLCB0cmFuc2xhdGVZOiA3NSwgdHJhbnNsYXRlWjogMCB9IF1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJlc2V0OiB7IHRyYW5zbGF0ZVk6IDAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwidHJhbnNpdGlvbi5zbGlkZUxlZnRCaWdJblwiOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdER1cmF0aW9uOiA4MDAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMSwgMCBdLCB0cmFuc2xhdGVYOiBbIDAsIC03NSBdLCB0cmFuc2xhdGVaOiAwIH0gXVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInRyYW5zaXRpb24uc2xpZGVMZWZ0QmlnT3V0XCI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0RHVyYXRpb246IDc1MCxcbiAgICAgICAgICAgICAgICBjYWxsczogW1xuICAgICAgICAgICAgICAgICAgICBbIHsgb3BhY2l0eTogWyAwLCAxIF0sIHRyYW5zbGF0ZVg6IC03NSwgdHJhbnNsYXRlWjogMCB9IF1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJlc2V0OiB7IHRyYW5zbGF0ZVg6IDAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwidHJhbnNpdGlvbi5zbGlkZVJpZ2h0QmlnSW5cIjoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHREdXJhdGlvbjogODAwLFxuICAgICAgICAgICAgICAgIGNhbGxzOiBbXG4gICAgICAgICAgICAgICAgICAgIFsgeyBvcGFjaXR5OiBbIDEsIDAgXSwgdHJhbnNsYXRlWDogWyAwLCA3NSBdLCB0cmFuc2xhdGVaOiAwIH0gXVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInRyYW5zaXRpb24uc2xpZGVSaWdodEJpZ091dFwiOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdER1cmF0aW9uOiA3NTAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMCwgMSBdLCB0cmFuc2xhdGVYOiA3NSwgdHJhbnNsYXRlWjogMCB9IF1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJlc2V0OiB7IHRyYW5zbGF0ZVg6IDAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qIE1hZ2ljLmNzcyAqL1xuICAgICAgICAgICAgXCJ0cmFuc2l0aW9uLnBlcnNwZWN0aXZlVXBJblwiOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdER1cmF0aW9uOiA4MDAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMSwgMCBdLCB0cmFuc2Zvcm1QZXJzcGVjdGl2ZTogWyA4MDAsIDgwMCBdLCB0cmFuc2Zvcm1PcmlnaW5YOiBbIDAsIDAgXSwgdHJhbnNmb3JtT3JpZ2luWTogWyBcIjEwMCVcIiwgXCIxMDAlXCIgXSwgcm90YXRlWDogWyAwLCAtMTgwIF0gfSBdXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICByZXNldDogeyB0cmFuc2Zvcm1QZXJzcGVjdGl2ZTogMCwgdHJhbnNmb3JtT3JpZ2luWDogXCI1MCVcIiwgdHJhbnNmb3JtT3JpZ2luWTogXCI1MCVcIiB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyogTWFnaWMuY3NzICovXG4gICAgICAgICAgICAvKiBTdXBwb3J0OiBMb3NlcyByb3RhdGlvbiBpbiBJRTkvQW5kcm9pZCAyLjMgKGZhZGVzIG9ubHkpLiAqL1xuICAgICAgICAgICAgXCJ0cmFuc2l0aW9uLnBlcnNwZWN0aXZlVXBPdXRcIjoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHREdXJhdGlvbjogODUwLFxuICAgICAgICAgICAgICAgIGNhbGxzOiBbXG4gICAgICAgICAgICAgICAgICAgIFsgeyBvcGFjaXR5OiBbIDAsIDEgXSwgdHJhbnNmb3JtUGVyc3BlY3RpdmU6IFsgODAwLCA4MDAgXSwgdHJhbnNmb3JtT3JpZ2luWDogWyAwLCAwIF0sIHRyYW5zZm9ybU9yaWdpblk6IFsgXCIxMDAlXCIsIFwiMTAwJVwiIF0sIHJvdGF0ZVg6IC0xODAgfSBdXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICByZXNldDogeyB0cmFuc2Zvcm1QZXJzcGVjdGl2ZTogMCwgdHJhbnNmb3JtT3JpZ2luWDogXCI1MCVcIiwgdHJhbnNmb3JtT3JpZ2luWTogXCI1MCVcIiwgcm90YXRlWDogMCB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyogTWFnaWMuY3NzICovXG4gICAgICAgICAgICAvKiBTdXBwb3J0OiBMb3NlcyByb3RhdGlvbiBpbiBJRTkvQW5kcm9pZCAyLjMgKGZhZGVzIG9ubHkpLiAqL1xuICAgICAgICAgICAgXCJ0cmFuc2l0aW9uLnBlcnNwZWN0aXZlRG93bkluXCI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0RHVyYXRpb246IDgwMCxcbiAgICAgICAgICAgICAgICBjYWxsczogW1xuICAgICAgICAgICAgICAgICAgICBbIHsgb3BhY2l0eTogWyAxLCAwIF0sIHRyYW5zZm9ybVBlcnNwZWN0aXZlOiBbIDgwMCwgODAwIF0sIHRyYW5zZm9ybU9yaWdpblg6IFsgMCwgMCBdLCB0cmFuc2Zvcm1PcmlnaW5ZOiBbIDAsIDAgXSwgcm90YXRlWDogWyAwLCAxODAgXSB9IF1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJlc2V0OiB7IHRyYW5zZm9ybVBlcnNwZWN0aXZlOiAwLCB0cmFuc2Zvcm1PcmlnaW5YOiBcIjUwJVwiLCB0cmFuc2Zvcm1PcmlnaW5ZOiBcIjUwJVwiIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiBNYWdpYy5jc3MgKi9cbiAgICAgICAgICAgIC8qIFN1cHBvcnQ6IExvc2VzIHJvdGF0aW9uIGluIElFOS9BbmRyb2lkIDIuMyAoZmFkZXMgb25seSkuICovXG4gICAgICAgICAgICBcInRyYW5zaXRpb24ucGVyc3BlY3RpdmVEb3duT3V0XCI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0RHVyYXRpb246IDg1MCxcbiAgICAgICAgICAgICAgICBjYWxsczogW1xuICAgICAgICAgICAgICAgICAgICBbIHsgb3BhY2l0eTogWyAwLCAxIF0sIHRyYW5zZm9ybVBlcnNwZWN0aXZlOiBbIDgwMCwgODAwIF0sIHRyYW5zZm9ybU9yaWdpblg6IFsgMCwgMCBdLCB0cmFuc2Zvcm1PcmlnaW5ZOiBbIDAsIDAgXSwgcm90YXRlWDogMTgwIH0gXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgcmVzZXQ6IHsgdHJhbnNmb3JtUGVyc3BlY3RpdmU6IDAsIHRyYW5zZm9ybU9yaWdpblg6IFwiNTAlXCIsIHRyYW5zZm9ybU9yaWdpblk6IFwiNTAlXCIsIHJvdGF0ZVg6IDAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8qIE1hZ2ljLmNzcyAqL1xuICAgICAgICAgICAgLyogU3VwcG9ydDogTG9zZXMgcm90YXRpb24gaW4gSUU5L0FuZHJvaWQgMi4zIChmYWRlcyBvbmx5KS4gKi9cbiAgICAgICAgICAgIFwidHJhbnNpdGlvbi5wZXJzcGVjdGl2ZUxlZnRJblwiOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdER1cmF0aW9uOiA5NTAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMSwgMCBdLCB0cmFuc2Zvcm1QZXJzcGVjdGl2ZTogWyAyMDAwLCAyMDAwIF0sIHRyYW5zZm9ybU9yaWdpblg6IFsgMCwgMCBdLCB0cmFuc2Zvcm1PcmlnaW5ZOiBbIDAsIDAgXSwgcm90YXRlWTogWyAwLCAtMTgwIF0gfSBdXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICByZXNldDogeyB0cmFuc2Zvcm1QZXJzcGVjdGl2ZTogMCwgdHJhbnNmb3JtT3JpZ2luWDogXCI1MCVcIiwgdHJhbnNmb3JtT3JpZ2luWTogXCI1MCVcIiB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyogTWFnaWMuY3NzICovXG4gICAgICAgICAgICAvKiBTdXBwb3J0OiBMb3NlcyByb3RhdGlvbiBpbiBJRTkvQW5kcm9pZCAyLjMgKGZhZGVzIG9ubHkpLiAqL1xuICAgICAgICAgICAgXCJ0cmFuc2l0aW9uLnBlcnNwZWN0aXZlTGVmdE91dFwiOiB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdER1cmF0aW9uOiA5NTAsXG4gICAgICAgICAgICAgICAgY2FsbHM6IFtcbiAgICAgICAgICAgICAgICAgICAgWyB7IG9wYWNpdHk6IFsgMCwgMSBdLCB0cmFuc2Zvcm1QZXJzcGVjdGl2ZTogWyAyMDAwLCAyMDAwIF0sIHRyYW5zZm9ybU9yaWdpblg6IFsgMCwgMCBdLCB0cmFuc2Zvcm1PcmlnaW5ZOiBbIDAsIDAgXSwgcm90YXRlWTogLTE4MCB9IF1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIHJlc2V0OiB7IHRyYW5zZm9ybVBlcnNwZWN0aXZlOiAwLCB0cmFuc2Zvcm1PcmlnaW5YOiBcIjUwJVwiLCB0cmFuc2Zvcm1PcmlnaW5ZOiBcIjUwJVwiLCByb3RhdGVZOiAwIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvKiBNYWdpYy5jc3MgKi9cbiAgICAgICAgICAgIC8qIFN1cHBvcnQ6IExvc2VzIHJvdGF0aW9uIGluIElFOS9BbmRyb2lkIDIuMyAoZmFkZXMgb25seSkuICovXG4gICAgICAgICAgICBcInRyYW5zaXRpb24ucGVyc3BlY3RpdmVSaWdodEluXCI6IHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0RHVyYXRpb246IDk1MCxcbiAgICAgICAgICAgICAgICBjYWxsczogW1xuICAgICAgICAgICAgICAgICAgICBbIHsgb3BhY2l0eTogWyAxLCAwIF0sIHRyYW5zZm9ybVBlcnNwZWN0aXZlOiBbIDIwMDAsIDIwMDAgXSwgdHJhbnNmb3JtT3JpZ2luWDogWyBcIjEwMCVcIiwgXCIxMDAlXCIgXSwgdHJhbnNmb3JtT3JpZ2luWTogWyAwLCAwIF0sIHJvdGF0ZVk6IFsgMCwgMTgwIF0gfSBdXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICByZXNldDogeyB0cmFuc2Zvcm1QZXJzcGVjdGl2ZTogMCwgdHJhbnNmb3JtT3JpZ2luWDogXCI1MCVcIiwgdHJhbnNmb3JtT3JpZ2luWTogXCI1MCVcIiB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLyogTWFnaWMuY3NzICovXG4gICAgICAgICAgICAvKiBTdXBwb3J0OiBMb3NlcyByb3RhdGlvbiBpbiBJRTkvQW5kcm9pZCAyLjMgKGZhZGVzIG9ubHkpLiAqL1xuICAgICAgICAgICAgXCJ0cmFuc2l0aW9uLnBlcnNwZWN0aXZlUmlnaHRPdXRcIjoge1xuICAgICAgICAgICAgICAgIGRlZmF1bHREdXJhdGlvbjogOTUwLFxuICAgICAgICAgICAgICAgIGNhbGxzOiBbXG4gICAgICAgICAgICAgICAgICAgIFsgeyBvcGFjaXR5OiBbIDAsIDEgXSwgdHJhbnNmb3JtUGVyc3BlY3RpdmU6IFsgMjAwMCwgMjAwMCBdLCB0cmFuc2Zvcm1PcmlnaW5YOiBbIFwiMTAwJVwiLCBcIjEwMCVcIiBdLCB0cmFuc2Zvcm1PcmlnaW5ZOiBbIDAsIDAgXSwgcm90YXRlWTogMTgwIH0gXVxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgcmVzZXQ6IHsgdHJhbnNmb3JtUGVyc3BlY3RpdmU6IDAsIHRyYW5zZm9ybU9yaWdpblg6IFwiNTAlXCIsIHRyYW5zZm9ybU9yaWdpblk6IFwiNTAlXCIsIHJvdGF0ZVk6IDAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgLyogUmVnaXN0ZXIgdGhlIHBhY2thZ2VkIGVmZmVjdHMuICovXG4gICAgZm9yICh2YXIgZWZmZWN0TmFtZSBpbiBWZWxvY2l0eS5SZWdpc3RlckVmZmVjdC5wYWNrYWdlZEVmZmVjdHMpIHtcbiAgICAgICAgVmVsb2NpdHkuUmVnaXN0ZXJFZmZlY3QoZWZmZWN0TmFtZSwgVmVsb2NpdHkuUmVnaXN0ZXJFZmZlY3QucGFja2FnZWRFZmZlY3RzW2VmZmVjdE5hbWVdKTtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqXG4gICAgICAgU2VxdWVuY2UgUnVubmluZ1xuICAgICoqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKiBOb3RlOiBTZXF1ZW5jZSBjYWxscyBtdXN0IHVzZSBWZWxvY2l0eSdzIHNpbmdsZS1vYmplY3QgYXJndW1lbnRzIHN5bnRheC4gKi9cbiAgICBWZWxvY2l0eS5SdW5TZXF1ZW5jZSA9IGZ1bmN0aW9uIChvcmlnaW5hbFNlcXVlbmNlKSB7XG4gICAgICAgIHZhciBzZXF1ZW5jZSA9ICQuZXh0ZW5kKHRydWUsIFtdLCBvcmlnaW5hbFNlcXVlbmNlKTtcblxuICAgICAgICBpZiAoc2VxdWVuY2UubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgJC5lYWNoKHNlcXVlbmNlLnJldmVyc2UoKSwgZnVuY3Rpb24oaSwgY3VycmVudENhbGwpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dENhbGwgPSBzZXF1ZW5jZVtpICsgMV07XG5cbiAgICAgICAgICAgICAgICBpZiAobmV4dENhbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUGFyYWxsZWwgc2VxdWVuY2UgY2FsbHMgKGluZGljYXRlZCB2aWEgc2VxdWVuY2VRdWV1ZTpmYWxzZSkgYXJlIHRyaWdnZXJlZFxuICAgICAgICAgICAgICAgICAgICAgICBpbiB0aGUgcHJldmlvdXMgY2FsbCdzIGJlZ2luIGNhbGxiYWNrLiBPdGhlcndpc2UsIGNoYWluZWQgY2FsbHMgYXJlIG5vcm1hbGx5IHRyaWdnZXJlZFxuICAgICAgICAgICAgICAgICAgICAgICBpbiB0aGUgcHJldmlvdXMgY2FsbCdzIGNvbXBsZXRlIGNhbGxiYWNrLiAqL1xuICAgICAgICAgICAgICAgICAgICB2YXIgY3VycmVudENhbGxPcHRpb25zID0gY3VycmVudENhbGwubyB8fCBjdXJyZW50Q2FsbC5vcHRpb25zLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dENhbGxPcHRpb25zID0gbmV4dENhbGwubyB8fCBuZXh0Q2FsbC5vcHRpb25zO1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aW1pbmcgPSAoY3VycmVudENhbGxPcHRpb25zICYmIGN1cnJlbnRDYWxsT3B0aW9ucy5zZXF1ZW5jZVF1ZXVlID09PSBmYWxzZSkgPyBcImJlZ2luXCIgOiBcImNvbXBsZXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFja09yaWdpbmFsID0gbmV4dENhbGxPcHRpb25zICYmIG5leHRDYWxsT3B0aW9uc1t0aW1pbmddLFxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNbdGltaW5nXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5leHRDYWxsRWxlbWVudHMgPSBuZXh0Q2FsbC5lIHx8IG5leHRDYWxsLmVsZW1lbnRzO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW1lbnRzID0gbmV4dENhbGxFbGVtZW50cy5ub2RlVHlwZSA/IFsgbmV4dENhbGxFbGVtZW50cyBdIDogbmV4dENhbGxFbGVtZW50cztcblxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tPcmlnaW5hbCAmJiBjYWxsYmFja09yaWdpbmFsLmNhbGwoZWxlbWVudHMsIGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5KGN1cnJlbnRDYWxsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXh0Q2FsbC5vKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0Q2FsbC5vID0gJC5leHRlbmQoe30sIG5leHRDYWxsT3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXh0Q2FsbC5vcHRpb25zID0gJC5leHRlbmQoe30sIG5leHRDYWxsT3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgc2VxdWVuY2UucmV2ZXJzZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgVmVsb2NpdHkoc2VxdWVuY2VbMF0pO1xuICAgIH07XG59KCh3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5aZXB0byB8fCB3aW5kb3cpLCB3aW5kb3csIGRvY3VtZW50KTtcbn0pKTsiLCJWZWxvY2l0eSA9IHJlcXVpcmUoJ3ZlbG9jaXR5LWFuaW1hdGUnKVxucmVxdWlyZSgndmVsb2NpdHktYW5pbWF0ZS92ZWxvY2l0eS51aScpXG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIgXCJET01Db250ZW50TG9hZGVkXCIsIChldmVudCkgLT5cblx0a2V5RG93biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2hpY2xldC5kb3duLmFycm93LmtleVwiKVxuXHRrZXlMZWZ0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jaGljbGV0LmxlZnQuYXJyb3cua2V5XCIpXG5cdGtleVVwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5jaGljbGV0LnVwLmFycm93LmtleVwiKVxuXHRrZXlSaWdodCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuY2hpY2xldC5yaWdodC5hcnJvdy5rZXlcIilcblxuXHRteVNlcXVlbmNlID0gW1xuXHQgICAgeyBlOiBrZXlEb3duLCBwOiB7IG9wYWNpdHk6IDAgfSwgbzogeyBkdXJhdGlvbjogNzAwLCBkZWxheTogMTAwMCB9IH0sXG5cdCAgICB7IGU6IGtleVVwLCBwOiB7IG9wYWNpdHk6IDEgfSwgbzogeyBkdXJhdGlvbjogNzAwLCBzZXF1ZW5jZVF1ZXVlOmZhbHNlICB9IH0sXG5cdCAgICB7IGU6IGtleVVwLCBwOiB7IG9wYWNpdHk6IDAgfSwgbzogeyBkdXJhdGlvbjogNzAwLCBkZWxheTogMTAwMCB9IH1cblx0ICAgIHsgZToga2V5TGVmdCwgcDogeyBvcGFjaXR5OiAxIH0sIG86IHsgZHVyYXRpb246IDcwMCwgc2VxdWVuY2VRdWV1ZTpmYWxzZSAgfSB9LFxuXHQgICAgeyBlOiBrZXlMZWZ0LCBwOiB7IG9wYWNpdHk6IDAgfSwgbzogeyBkdXJhdGlvbjogNzAwLCBkZWxheTogMTAwMCB9IH0sXG5cdCAgICB7IGU6IGtleVJpZ2h0LCBwOiB7IG9wYWNpdHk6IDEgfSwgbzogeyBkdXJhdGlvbjogNzAwLCBzZXF1ZW5jZVF1ZXVlOmZhbHNlIH0gfSxcblx0ICAgIHsgZToga2V5UmlnaHQsIHA6IHsgb3BhY2l0eTogMCB9LCBvOiB7IGR1cmF0aW9uOiA3MDAsIGRlbGF5OiAxMDAwIH0gfSxcblx0ICAgIHsgZToga2V5RG93biwgcDogeyBvcGFjaXR5OiAxIH0sIG86IHsgZHVyYXRpb246IDcwMCwgc2VxdWVuY2VRdWV1ZTpmYWxzZSB9IH1cblx0XVxuXG5cdFZlbG9jaXR5LlJ1blNlcXVlbmNlKG15U2VxdWVuY2UpXG5cdHNldEludGVydmFsKCAtPlxuXHRcdCBWZWxvY2l0eS5SdW5TZXF1ZW5jZShteVNlcXVlbmNlKVxuXHQsIDgwMDApXG5cblxuXHRjb2cxID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvZy5vbmUnKVxuXHRjb2cyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvZy50d28nKVxuXHRjb2czID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvZy50aHJlZScpXG5cdGNvZzQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuY29nLmZvdXInKVxuXHRjb2c1ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNvZy5maXZlJylcblx0Y29nNiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb2cuc2l4Jylcblx0aGVybyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWN0aW9uLmhlcm8gPiAuY29udGFpbmVyJylcblx0aGVyb0ZpeGVkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlcm8ucGFyYWxsYXgnKVxuXG5cblxuXHRwYXJhbGxheCA9ICgpIC0+XG5cdFx0d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShwYXJhbGxheClcblx0XHRvZmZzZXQgPSBNYXRoLm1heCh3aW5kb3cucGFnZVlPZmZzZXQsIDApXG5cblx0XHRkZWdyZWVzID0gTWF0aC5yb3VuZChvZmZzZXQgKiAwLjEpXG5cdFx0Y29nMS5zdHlsZS50cmFuc2Zvcm0gPSBcInJvdGF0ZSgtI3tkZWdyZWVzfWRlZylcIlxuXHRcdGNvZzIuc3R5bGUudHJhbnNmb3JtID0gXCJyb3RhdGUoI3tkZWdyZWVzfWRlZylcIlxuXHRcdGNvZzMuc3R5bGUudHJhbnNmb3JtID0gXCJyb3RhdGUoI3tkZWdyZWVzfWRlZylcIlxuXHRcdGNvZzQuc3R5bGUudHJhbnNmb3JtID0gXCJyb3RhdGUoI3tkZWdyZWVzfWRlZylcIlxuXHRcdGNvZzUuc3R5bGUudHJhbnNmb3JtID0gXCJyb3RhdGUoLSN7ZGVncmVlc31kZWcpXCJcblx0XHRjb2c2LnN0eWxlLnRyYW5zZm9ybSA9IFwicm90YXRlKC0je2RlZ3JlZXN9ZGVnKVwiXG5cblx0XHQjIGhlcm9PZmZzZXQgPSBNYXRoLnJvdW5kKG9mZnNldCAqIDAuNTUpXG5cdFx0IyAkaGVyby5jc3MoJ3RyYW5zZm9ybScsIFwidHJhbnNsYXRlM2QoMCwje2hlcm9PZmZzZXR9cHgsMClcIilcblxuXHRcdGhlcm9PZmZzZXQgPSBNYXRoLnJvdW5kKC1vZmZzZXQgKiAwLjQ0KVxuXHRcdGhlcm9GaXhlZC5zdHlsZS50cmFuc2Zvcm0gPSBcInRyYW5zbGF0ZTNkKDAsI3toZXJvT2Zmc2V0fXB4LDApXCJcblxuXG5cdHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUocGFyYWxsYXgpXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyIFwibG9hZFwiLCAoZXZlbnQpIC0+XG5cdG1peHBhbmVsLnBlb3BsZS5zZXQoeyAkY3JlYXRlZDogbmV3IERhdGUoKSB9KVxuXHRtaXhwYW5lbF9pZCA9IG1peHBhbmVsLmdldF9kaXN0aW5jdF9pZCgpXG5cdG1peHBhbmVsLnRyYWNrKCdXZWxjb21lIFBhZ2UgRGlzcGxheWVkJywgeydNaXhwYW5lbDogVXNlciBJRCc6IG1peHBhbmVsX2lkfSlcblx0Y2hyb21lLnJ1bnRpbWUuc2V0VW5pbnN0YWxsVVJMKCdodHRwczovL3Ntb290aGtleXNjcm9sbC5oZXJva3VhcHAuY29tL3VuaW5zdGFsbGVkP2lkPScgKyBtaXhwYW5lbF9pZClcblxuIl19
