( () => {
    "use strict";
    var t, e = {
        7(t) {
            var e, n = "object" == typeof Reflect ? Reflect : null, r = n && "function" == typeof n.apply ? n.apply : function(t, e, n) {
                return Function.prototype.apply.call(t, e, n)
            }
            ;
            e = n && "function" == typeof n.ownKeys ? n.ownKeys : Object.getOwnPropertySymbols ? function(t) {
                return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))
            }
            : function(t) {
                return Object.getOwnPropertyNames(t)
            }
            ;
            var i = Number.isNaN || function(t) {
                return t != t
            }
            ;
            function o() {
                o.init.call(this)
            }
            t.exports = o,
            t.exports.once = function(t, e) {
                return new Promise(function(n, r) {
                    function i(n) {
                        t.removeListener(e, o),
                        r(n)
                    }
                    function o() {
                        "function" == typeof t.removeListener && t.removeListener("error", i),
                        n([].slice.call(arguments))
                    }
                    y(t, e, o, {
                        once: !0
                    }),
                    "error" !== e && function(t, e) {
                        "function" == typeof t.on && y(t, "error", e, {
                            once: !0
                        })
                    }(t, i)
                }
                )
            }
            ,
            o.EventEmitter = o,
            o.prototype._events = void 0,
            o.prototype._eventsCount = 0,
            o.prototype._maxListeners = void 0;
            var a = 10;
            function s(t) {
                if ("function" != typeof t)
                    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof t)
            }
            function c(t) {
                return void 0 === t._maxListeners ? o.defaultMaxListeners : t._maxListeners
            }
            function l(t, e, n, r) {
                var i, o, a, l;
                if (s(n),
                void 0 === (o = t._events) ? (o = t._events = Object.create(null),
                t._eventsCount = 0) : (void 0 !== o.newListener && (t.emit("newListener", e, n.listener ? n.listener : n),
                o = t._events),
                a = o[e]),
                void 0 === a)
                    a = o[e] = n,
                    ++t._eventsCount;
                else if ("function" == typeof a ? a = o[e] = r ? [n, a] : [a, n] : r ? a.unshift(n) : a.push(n),
                (i = c(t)) > 0 && a.length > i && !a.warned) {
                    a.warned = !0;
                    var u = new Error("Possible EventEmitter memory leak detected. " + a.length + " " + String(e) + " listeners added. Use emitter.setMaxListeners() to increase limit");
                    u.name = "MaxListenersExceededWarning",
                    u.emitter = t,
                    u.type = e,
                    u.count = a.length,
                    l = u,
                    console && console.warn && console.warn(l)
                }
                return t
            }
            function u() {
                if (!this.fired)
                    return this.target.removeListener(this.type, this.wrapFn),
                    this.fired = !0,
                    0 === arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments)
            }
            function h(t, e, n) {
                var r = {
                    fired: !1,
                    wrapFn: void 0,
                    target: t,
                    type: e,
                    listener: n
                }
                  , i = u.bind(r);
                return i.listener = n,
                r.wrapFn = i,
                i
            }
            function f(t, e, n) {
                var r = t._events;
                if (void 0 === r)
                    return [];
                var i = r[e];
                return void 0 === i ? [] : "function" == typeof i ? n ? [i.listener || i] : [i] : n ? function(t) {
                    for (var e = new Array(t.length), n = 0; n < e.length; ++n)
                        e[n] = t[n].listener || t[n];
                    return e
                }(i) : p(i, i.length)
            }
            function d(t) {
                var e = this._events;
                if (void 0 !== e) {
                    var n = e[t];
                    if ("function" == typeof n)
                        return 1;
                    if (void 0 !== n)
                        return n.length
                }
                return 0
            }
            function p(t, e) {
                for (var n = new Array(e), r = 0; r < e; ++r)
                    n[r] = t[r];
                return n
            }
            function y(t, e, n, r) {
                if ("function" == typeof t.on)
                    r.once ? t.once(e, n) : t.on(e, n);
                else {
                    if ("function" != typeof t.addEventListener)
                        throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof t);
                    t.addEventListener(e, function i(o) {
                        r.once && t.removeEventListener(e, i),
                        n(o)
                    })
                }
            }
            Object.defineProperty(o, "defaultMaxListeners", {
                enumerable: !0,
                get: function() {
                    return a
                },
                set: function(t) {
                    if ("number" != typeof t || t < 0 || i(t))
                        throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + t + ".");
                    a = t
                }
            }),
            o.init = function() {
                void 0 !== this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = Object.create(null),
                this._eventsCount = 0),
                this._maxListeners = this._maxListeners || void 0
            }
            ,
            o.prototype.setMaxListeners = function(t) {
                if ("number" != typeof t || t < 0 || i(t))
                    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + t + ".");
                return this._maxListeners = t,
                this
            }
            ,
            o.prototype.getMaxListeners = function() {
                return c(this)
            }
            ,
            o.prototype.emit = function(t) {
                for (var e = [], n = 1; n < arguments.length; n++)
                    e.push(arguments[n]);
                var i = "error" === t
                  , o = this._events;
                if (void 0 !== o)
                    i = i && void 0 === o.error;
                else if (!i)
                    return !1;
                if (i) {
                    var a;
                    if (e.length > 0 && (a = e[0]),
                    a instanceof Error)
                        throw a;
                    var s = new Error("Unhandled error." + (a ? " (" + a.message + ")" : ""));
                    throw s.context = a,
                    s
                }
                var c = o[t];
                if (void 0 === c)
                    return !1;
                if ("function" == typeof c)
                    r(c, this, e);
                else {
                    var l = c.length
                      , u = p(c, l);
                    for (n = 0; n < l; ++n)
                        r(u[n], this, e)
                }
                return !0
            }
            ,
            o.prototype.addListener = function(t, e) {
                return l(this, t, e, !1)
            }
            ,
            o.prototype.on = o.prototype.addListener,
            o.prototype.prependListener = function(t, e) {
                return l(this, t, e, !0)
            }
            ,
            o.prototype.once = function(t, e) {
                return s(e),
                this.on(t, h(this, t, e)),
                this
            }
            ,
            o.prototype.prependOnceListener = function(t, e) {
                return s(e),
                this.prependListener(t, h(this, t, e)),
                this
            }
            ,
            o.prototype.removeListener = function(t, e) {
                var n, r, i, o, a;
                if (s(e),
                void 0 === (r = this._events))
                    return this;
                if (void 0 === (n = r[t]))
                    return this;
                if (n === e || n.listener === e)
                    0 === --this._eventsCount ? this._events = Object.create(null) : (delete r[t],
                    r.removeListener && this.emit("removeListener", t, n.listener || e));
                else if ("function" != typeof n) {
                    for (i = -1,
                    o = n.length - 1; o >= 0; o--)
                        if (n[o] === e || n[o].listener === e) {
                            a = n[o].listener,
                            i = o;
                            break
                        }
                    if (i < 0)
                        return this;
                    0 === i ? n.shift() : function(t, e) {
                        for (; e + 1 < t.length; e++)
                            t[e] = t[e + 1];
                        t.pop()
                    }(n, i),
                    1 === n.length && (r[t] = n[0]),
                    void 0 !== r.removeListener && this.emit("removeListener", t, a || e)
                }
                return this
            }
            ,
            o.prototype.off = o.prototype.removeListener,
            o.prototype.removeAllListeners = function(t) {
                var e, n, r;
                if (void 0 === (n = this._events))
                    return this;
                if (void 0 === n.removeListener)
                    return 0 === arguments.length ? (this._events = Object.create(null),
                    this._eventsCount = 0) : void 0 !== n[t] && (0 === --this._eventsCount ? this._events = Object.create(null) : delete n[t]),
                    this;
                if (0 === arguments.length) {
                    var i, o = Object.keys(n);
                    for (r = 0; r < o.length; ++r)
                        "removeListener" !== (i = o[r]) && this.removeAllListeners(i);
                    return this.removeAllListeners("removeListener"),
                    this._events = Object.create(null),
                    this._eventsCount = 0,
                    this
                }
                if ("function" == typeof (e = n[t]))
                    this.removeListener(t, e);
                else if (void 0 !== e)
                    for (r = e.length - 1; r >= 0; r--)
                        this.removeListener(t, e[r]);
                return this
            }
            ,
            o.prototype.listeners = function(t) {
                return f(this, t, !0)
            }
            ,
            o.prototype.rawListeners = function(t) {
                return f(this, t, !1)
            }
            ,
            o.listenerCount = function(t, e) {
                return "function" == typeof t.listenerCount ? t.listenerCount(e) : d.call(t, e)
            }
            ,
            o.prototype.listenerCount = d,
            o.prototype.eventNames = function() {
                return this._eventsCount > 0 ? e(this._events) : []
            }
        },
        377(t, e, n) {
            function r(t) {
                return r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                r(t)
            }
            function i(t) {
                var e = function(t) {
                    if ("object" != r(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != r(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == r(e) ? e : e + ""
            }
            var o = function() {
                return t = function t() {
                    !function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, t),
                    this.events = new Map
                }
                ,
                e = [{
                    key: "on",
                    value: function(t, e) {
                        this.events.has(t) || this.events.set(t, []),
                        this.events.get(t).push(e)
                    }
                }, {
                    key: "once",
                    value: function(t, e) {
                        var n = this
                          , r = function() {
                            e.apply(void 0, arguments),
                            n.off(t, r)
                        };
                        this.on(t, r)
                    }
                }, {
                    key: "off",
                    value: function(t, e) {
                        var n = this.events.get(t);
                        n && this.events.set(t, n.filter(function(t) {
                            return t !== e
                        }))
                    }
                }, {
                    key: "emit",
                    value: function(t) {
                        for (var e, n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++)
                            r[i - 1] = arguments[i];
                        null === (e = this.events.get(t)) || void 0 === e || e.forEach(function(t) {
                            return t.apply(void 0, r)
                        })
                    }
                }],
                e && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1,
                        r.configurable = !0,
                        "value"in r && (r.writable = !0),
                        Object.defineProperty(t, i(r.key), r)
                    }
                }(t.prototype, e),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                t;
                var t, e
            }();
            function a(t) {
                return a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                a(t)
            }
            function s(t, e) {
                var n = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(t);
                    e && (r = r.filter(function(e) {
                        return Object.getOwnPropertyDescriptor(t, e).enumerable
                    })),
                    n.push.apply(n, r)
                }
                return n
            }
            function c(t) {
                for (var e = 1; e < arguments.length; e++) {
                    var n = null != arguments[e] ? arguments[e] : {};
                    e % 2 ? s(Object(n), !0).forEach(function(e) {
                        l(t, e, n[e])
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : s(Object(n)).forEach(function(e) {
                        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e))
                    })
                }
                return t
            }
            function l(t, e, n) {
                return (e = u(e))in t ? Object.defineProperty(t, e, {
                    value: n,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : t[e] = n,
                t
            }
            function u(t) {
                var e = function(t) {
                    if ("object" != a(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != a(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == a(e) ? e : e + ""
            }
            function h(t, e, n) {
                return e = d(e),
                function(t, e) {
                    if (e && ("object" == a(e) || "function" == typeof e))
                        return e;
                    if (void 0 !== e)
                        throw new TypeError("Derived constructors may only return object or undefined");
                    return function(t) {
                        if (void 0 === t)
                            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return t
                    }(t)
                }(t, f() ? Reflect.construct(e, n || [], d(t).constructor) : e.apply(t, n))
            }
            function f() {
                try {
                    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (t) {}
                return (f = function() {
                    return !!t
                }
                )()
            }
            function d(t) {
                return d = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
                    return t.__proto__ || Object.getPrototypeOf(t)
                }
                ,
                d(t)
            }
            function p(t, e) {
                return p = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t, e) {
                    return t.__proto__ = e,
                    t
                }
                ,
                p(t, e)
            }
            var y = {
                pixelDensityFactor: 1,
                renderQuality: "high",
                debugViewport: !1,
                sendCursorInterval: 40,
                cacheCleanupInterval: 1e3,
                cellAnimationSpeed: 145,
                cellSizeAnimationSpeed: 145,
                cellEatAnimationSpeed: 145,
                cellSpawnAnimationSpeed: 145,
                adaptiveCellMotion: !0,
                showEatAnimation: !0,
                cellsTransparency: 60,
                virusTransparency: 60,
                virusColor: "#970D4E",
                virusStrokeColor: "#FF99FC",
                virusRangeColor: "#FF99FC",
                showVirusRange: !0,
                showNames: !0,
                showMass: !0,
                cellMassFormat: "shortened",
                showNicknameStroke: !0,
                showMassStroke: !0,
                autoHideNames: !0,
                autoHideMass: !0,
                coloredNames: !1,
                coloredMass: !1,
                showMenuOnDeath: !0,
                autoSwitchCells: !0,
                showGlobalSkins: !0,
                showSkins: !0,
                showVanillaSkins: !0,
                showGifSkins: !1,
                showCellGradient: !1,
                cellGradientStrength: 2,
                showFood: !0,
                rainbowFood: !0,
                foodColor: "#FF6B6B",
                cameraSpeed: 15,
                zoomSpeed: .9,
                themeBackgroundColor: "#111111",
                themeGridColor: "#2a2929",
                themeBorderColor: "#ffffff",
                themeBorderWidth: 20,
                textNicknameColor: "#ffffff",
                textMassColor: "#ffffff",
                showMyNames: !0,
                showMyMass: !0,
                myNicknameColor: "#ffffff",
                myMassColor: "#ffffff",
                themeMultiboxRingWidth: 10,
                themeMultiboxRingColor: "#00B9E8",
                themeMultiboxRingColorInactive: "#FFFFFF",
                themeMultiboxCellColor: "#00B9E8",
                themeMultiboxCellColorInactive: "#FFFFFF",
                themeUseMultiboxCellColor: !1,
                themeBackgroundImage: "https://i.imgur.com/aKvo1jQ.png",
                themeShowBackgroundImage: !0,
                themeCursorLinesColor: "#FFFFFF",
                showCursorLines: !1,
                showGrid: !0,
                showBorder: !0,
                macroFeedInterval: 40,
                themeCursor: "cursor_01",
                leaderboardMassColor: "#1EEBA7",
                showChat: !0,
                chatShowPlayerId: !1,
                chatUseCellColor: !1,
                chatNickColor: "#4fecff",
                chatMessageColor: "#DDDDDD",
                chatCommandColor: "#FFCC00",
                showMinimap: !0,
                showStats: !0,
                showLeaderboard: !0,
                showHUD: !0,
                minimapSize: 200
            }
              , v = function(t) {
                function e() {
                    var t;
                    return function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, e),
                    (t = h(this, e)).settings = c({}, y),
                    t.load(),
                    t
                }
                return function(t, e) {
                    if ("function" != typeof e && null !== e)
                        throw new TypeError("Super expression must either be null or a function");
                    t.prototype = Object.create(e && e.prototype, {
                        constructor: {
                            value: t,
                            writable: !0,
                            configurable: !0
                        }
                    }),
                    Object.defineProperty(t, "prototype", {
                        writable: !1
                    }),
                    e && p(t, e)
                }(e, t),
                n = e,
                r = [{
                    key: "get",
                    value: function(t) {
                        return this.settings[t]
                    }
                }, {
                    key: "getAll",
                    value: function() {
                        return c({}, this.settings)
                    }
                }, {
                    key: "set",
                    value: function(t, e) {
                        this.settings[t] !== e && (this.settings[t] = e,
                        this.save(),
                        this.emit("change", t, e),
                        this.emit("change:" + t, e))
                    }
                }, {
                    key: "load",
                    value: function() {
                        try {
                            var t = localStorage.getItem("eon_settings");
                            if (t) {
                                var e = JSON.parse(t);
                                if (Object.prototype.hasOwnProperty.call(e, "customFeedRates")) {
                                    delete e.customFeedRates;
                                    localStorage.setItem("eon_settings", JSON.stringify(e));
                                }
                                for (const key of ['cellSizeAnimationSpeed', 'cellEatAnimationSpeed', 'cellSpawnAnimationSpeed']) {
                                    if (!Object.prototype.hasOwnProperty.call(e, key)) e[key] = Math.max(30, Math.min(300, Number(e.cellAnimationSpeed) || 145));
                                }
                                this.settings = c(c({}, y), e)
                            }
                        } catch (t) {
                            console.error("Failed to load settings:", t)
                        }
                    }
                }, {
                    key: "save",
                    value: function() {
                        try {
                            localStorage.setItem("eon_settings", JSON.stringify(this.settings))
                        } catch (t) {
                            console.error("Failed to save settings:", t)
                        }
                    }
                }, {
                    key: "reset",
                    value: function() {
                        var t = this;
                        this.settings = c({}, y),
                        this.save(),
                        this.emit("reset", this.settings),
                        Object.keys(this.settings).forEach(function(e) {
                            t.emit("change", e, t.settings[e]),
                            t.emit("change:" + e, t.settings[e])
                        })
                    }
                }],
                r && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1,
                        r.configurable = !0,
                        "value"in r && (r.writable = !0),
                        Object.defineProperty(t, u(r.key), r)
                    }
                }(n.prototype, r),
                Object.defineProperty(n, "prototype", {
                    writable: !1
                }),
                n;
                var n, r
            }(o);
            function g(t) {
                return g = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                g(t)
            }
            function m(t) {
                return function(t) {
                    if (Array.isArray(t))
                        return b(t)
                }(t) || function(t) {
                    if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"])
                        return Array.from(t)
                }(t) || function(t, e) {
                    if (t) {
                        if ("string" == typeof t)
                            return b(t, e);
                        var n = {}.toString.call(t).slice(8, -1);
                        return "Object" === n && t.constructor && (n = t.constructor.name),
                        "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? b(t, e) : void 0
                    }
                }(t) || function() {
                    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                }()
            }
            function b(t, e) {
                (null == e || e > t.length) && (e = t.length);
                for (var n = 0, r = Array(e); n < e; n++)
                    r[n] = t[n];
                return r
            }
            function w(t) {
                var e = function(t) {
                    if ("object" != g(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != g(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == g(e) ? e : e + ""
            }
            var S = function() {
                return t = function t(e) {
                    var n = e.prefix
                      , r = e.color
                      , i = void 0 === r ? "#FF9800" : r
                      , o = e.showLogs
                      , a = void 0 === o || o;
                    if (function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, t),
                    !n)
                        throw new Error("Logger: 'prefix' is required");
                    this.prefix = n,
                    this.color = i,
                    this.showLogs = a
                }
                ,
                e = [{
                    key: "buildArgs",
                    value: function() {
                        for (var t = "%c[".concat(this.prefix, "]"), e = "color: ".concat(this.color, "; font-weight: bold"), n = arguments.length, r = new Array(n), i = 0; i < n; i++)
                            r[i] = arguments[i];
                        return [t, e].concat(r)
                    }
                }, {
                    key: "log",
                    value: function() {
                        var t;
                        this.showLogs && (t = console).log.apply(t, m(this.buildArgs.apply(this, arguments)))
                    }
                }, {
                    key: "warn",
                    value: function() {
                        var t;
                        this.showLogs && (t = console).warn.apply(t, m(this.buildArgs.apply(this, arguments)))
                    }
                }, {
                    key: "error",
                    value: function() {
                        var t;
                        this.showLogs && (t = console).error.apply(t, m(this.buildArgs.apply(this, arguments)))
                    }
                }],
                e && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1,
                        r.configurable = !0,
                        "value"in r && (r.writable = !0),
                        Object.defineProperty(t, w(r.key), r)
                    }
                }(t.prototype, e),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                t;
                var t, e
            }();
            function k(t) {
                return k = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                k(t)
            }
            function C(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var r = e[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(t, x(r.key), r)
                }
            }
            function I(t, e, n) {
                return e && C(t.prototype, e),
                n && C(t, n),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                t
            }
            function x(t) {
                var e = function(t) {
                    if ("object" != k(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != k(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == k(e) ? e : e + ""
            }
            var E = I(function t() {
                !function(t, e) {
                    if (!(t instanceof e))
                        throw new TypeError("Cannot call a class as a function")
                }(this, t),
                this.chat = null,
                this.pendingConnections = [],
                this.logger = new S({
                    prefix: "Player",
                    color: "#2196F3"
                }),
                this.tag = "",
                this.nickname1 = "",
                this.skin1 = "",
                this.serverUrl = "wss://eu1.senpa.io:7104",
                this.chat = null,
                this.pendingConnections = []
            })
              , T = n(458);
            function _(t) {
                return _ = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                _(t)
            }
            function A(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }
            function P(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var r = e[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(t, M(r.key), r)
                }
            }
            function O(t, e, n) {
                return e && P(t.prototype, e),
                n && P(t, n),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                t
            }
            function M(t) {
                var e = function(t) {
                    if ("object" != _(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != _(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == _(e) ? e : e + ""
            }
            var L = new ArrayBuffer(1048576)
              , U = new Uint8Array(L)
              , F = new DataView(L)
              , B = new TextEncoder
              , j = new TextDecoder("utf-8")
              , R = function() {
                return O(function t(e) {
                    var n = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
                    A(this, t),
                    this.view = e,
                    this.offset = 0,
                    this.le = n
                }, [{
                    key: "length",
                    get: function() {
                        return this.view.byteLength
                    }
                }, {
                    key: "EOF",
                    get: function() {
                        return this.offset === this.view.byteLength
                    }
                }, {
                    key: "setView",
                    value: function(t) {
                        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
                        this.view = t,
                        this.offset = e
                    }
                }, {
                    key: "readUInt8",
                    value: function() {
                        return this.view.getUint8(this.offset++)
                    }
                }, {
                    key: "readInt8",
                    value: function() {
                        return this.view.getInt8(this.offset++)
                    }
                }, {
                    key: "readUInt16",
                    value: function() {
                        var t = this.view.getUint16(this.offset, this.le);
                        return this.offset += 2,
                        t
                    }
                }, {
                    key: "readInt16",
                    value: function() {
                        var t = this.view.getInt16(this.offset, this.le);
                        return this.offset += 2,
                        t
                    }
                }, {
                    key: "readUInt24",
                    value: function() {
                        return this.readUInt8() << 16 | this.readUInt8() << 8 | this.readUInt8()
                    }
                }, {
                    key: "readUInt32",
                    value: function() {
                        var t = this.view.getUint32(this.offset, this.le);
                        return this.offset += 4,
                        t
                    }
                }, {
                    key: "readInt32",
                    value: function() {
                        var t = this.view.getInt32(this.offset, this.le);
                        return this.offset += 4,
                        t
                    }
                }, {
                    key: "readFloat32",
                    value: function() {
                        var t = this.view.getFloat32(this.offset, this.le);
                        return this.offset += 4,
                        t
                    }
                }, {
                    key: "readFloat64",
                    value: function() {
                        var t = this.view.getFloat64(this.offset, this.le);
                        return this.offset += 8,
                        t
                    }
                }, {
                    key: "readVarInt",
                    value: function() {
                        var t, e = 0, n = 0;
                        do {
                            if (n |= (127 & (t = this.readUInt8())) << 7 * e,
                            ++e > 5)
                                throw new Error("VarInt is too big")
                        } while (128 & t);
                        return n
                    }
                }, {
                    key: "skip",
                    value: function(t) {
                        this.offset += t
                    }
                }, {
                    key: "readUTF8String",
                    value: function(t) {
                        null == t && (t = this.view.byteLength - this.offset),
                        t = Math.max(0, t);
                        for (var e = "", n = 0; n < t; ) {
                            n++;
                            var r = this.readUInt8();
                            e += String.fromCharCode(r)
                        }
                        return e
                    }
                }, {
                    key: "readUTF8StringLength",
                    value: function() {
                        return this.readUTF8String(this.readUInt8())
                    }
                }, {
                    key: "readUTF8StringZero",
                    value: function() {
                        for (var t = ""; this.offset < this.view.byteLength; ) {
                            var e = this.readUInt8();
                            if (!e)
                                break;
                            t += String.fromCharCode(e)
                        }
                        return t
                    }
                }, {
                    key: "readUTF16String",
                    value: function(t) {
                        var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
                        null == t && (t = this.view.byteLength - this.offset),
                        t = Math.max(0, t);
                        var n = ""
                          , r = 0;
                        if (e)
                            for (; r < t; ) {
                                r++;
                                var i = this.readUInt16();
                                n += String.fromCharCode(255 & i)
                            }
                        else
                            for (; r < t; ) {
                                r++;
                                var o = this.readUInt16();
                                n += String.fromCharCode(o)
                            }
                        return n
                    }
                }, {
                    key: "readUTF16StringLength",
                    value: function() {
                        return this.readUTF16String(this.readUInt8())
                    }
                }, {
                    key: "readUTF16StringZero",
                    value: function() {
                        var t = "";
                        if (arguments.length > 0 && void 0 !== arguments[0] && arguments[0])
                            for (; this.offset < this.view.byteLength; ) {
                                var e = this.readUInt16();
                                if (!e)
                                    break;
                                t += String.fromCharCode(255 & e)
                            }
                        else
                            for (; this.offset < this.view.byteLength; ) {
                                var n = this.readUInt16();
                                if (!n)
                                    break;
                                t += String.fromCharCode(n)
                            }
                        return t
                    }
                }, {
                    key: "readZTString",
                    value: function(t) {
                        return j.decode(new Uint8Array(this.view.buffer).subarray(this.offset, this.offset + this.readUTF8String(t).length))
                    }
                }, {
                    key: "readZTStringZero",
                    value: function() {
                        for (var t = 0, e = this.offset; this.offset < this.view.byteLength && this.readUInt8(); )
                            t++;
                        return j.decode(new Uint8Array(this.view.buffer).subarray(e, e + t))
                    }
                }, {
                    key: "readZTStringShort",
                    value: function() {
                        return j.decode(new Uint8Array(this.view.buffer).subarray(this.offset, this.offset + this.readUInt8()))
                    }
                }, {
                    key: "readStringUnicode",
                    value: function() {
                        for (var t = ""; this.offset < this.view.byteLength; ) {
                            var e = this.readUInt16();
                            if (!e)
                                break;
                            t += String.fromCharCode(e)
                        }
                        return t
                    }
                }, {
                    key: "readBytes",
                    value: function() {
                        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0
                          , e = this.view.buffer.slice(this.offset, this.offset + t);
                        return this.offset += t,
                        e
                    }
                }, {
                    key: "xor",
                    value: function() {
                        for (var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.view, e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : t.byteOffset, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : t.byteLength, r = e; r < n; r++)
                            t.setUint8(r, 128 ^ t.getUint8(r))
                    }
                }, {
                    key: "getUint8Func",
                    value: function(t) {
                        return t.getUint8(this.offset++)
                    }
                }])
            }()
              , W = function() {
                return O(function t() {
                    var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
                    A(this, t),
                    this.offset = 0,
                    this.le = e,
                    this.view = F
                }, [{
                    key: "length",
                    get: function() {
                        return this.view.byteLength
                    }
                }, {
                    key: "setView",
                    value: function(t) {
                        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
                        this.view = t,
                        this.offset = e
                    }
                }, {
                    key: "writeUInt8",
                    value: function(t) {
                        this.view.setUint8(this.offset++, t)
                    }
                }, {
                    key: "writeBytes",
                    value: function(t) {
                        for (var e = 0, n = t.length; e < n; e++)
                            this.writeUInt8(t[e])
                    }
                }, {
                    key: "writeInt8",
                    value: function(t) {
                        this.view.setInt8(this.offset++, t)
                    }
                }, {
                    key: "writeUInt16",
                    value: function(t) {
                        this.view.setUint16(this.offset, t, this.le),
                        this.offset += 2
                    }
                }, {
                    key: "writeInt16",
                    value: function(t) {
                        this.view.setInt16(this.offset, t, this.le),
                        this.offset += 2
                    }
                }, {
                    key: "writeUInt24",
                    value: function(t) {
                        this.writeUInt8((16711680 & t) >>> 16),
                        this.writeUInt8((65280 & t) >>> 8),
                        this.writeUInt8((255 & t) >>> 0)
                    }
                }, {
                    key: "writeUInt32",
                    value: function(t) {
                        this.view.setUint32(this.offset, t, this.le),
                        this.offset += 4
                    }
                }, {
                    key: "writeInt32",
                    value: function(t) {
                        this.view.setInt32(this.offset, t, this.le),
                        this.offset += 4
                    }
                }, {
                    key: "writeFloat32",
                    value: function(t) {
                        this.view.setFloat32(this.offset, t, this.le),
                        this.offset += 4
                    }
                }, {
                    key: "writeFloat64",
                    value: function(t) {
                        this.view.setFloat64(this.offset, t, this.le),
                        this.offset += 8
                    }
                }, {
                    key: "writeVarInt",
                    value: function(t) {
                        for (; t > 127; )
                            this.writeUInt8(127 & t | 128),
                            t >>>= 7;
                        this.writeUInt8(t)
                    }
                }, {
                    key: "writeUTF8String",
                    value: function(t) {
                        for (var e = 0; e < t.length; e++)
                            this.writeUInt8(t.charCodeAt(e))
                    }
                }, {
                    key: "writeUTF8StringZero",
                    value: function(t) {
                        this.writeUTF8String(t),
                        this.writeUInt8(0)
                    }
                }, {
                    key: "writeUTF8StringLength",
                    value: function(t) {
                        t.length > 255 && (t = t.substring(0, 255)),
                        this.writeUInt8(t.length),
                        this.writeUTF8String(t)
                    }
                }, {
                    key: "writeUTF16String",
                    value: function(t) {
                        for (var e = 0; e < t.length; e++)
                            this.writeUInt16(t.charCodeAt(e))
                    }
                }, {
                    key: "writeUTF16StringZero",
                    value: function(t) {
                        this.writeUTF16String(t),
                        this.writeUInt16(0)
                    }
                }, {
                    key: "writeUTF16StringLength",
                    value: function(t) {
                        t.length > 255 && (t = t.substring(0, 255)),
                        this.writeUInt8(t.length),
                        this.writeUTF16String(t)
                    }
                }, {
                    key: "writeLongString8",
                    value: function(t) {
                        this.writeUInt16(t.length);
                        for (var e = 0; e < t.length; e++)
                            this.writeUInt8(t.charCodeAt(e))
                    }
                }, {
                    key: "writeZTString",
                    value: function(t) {
                        var e = B.encode(t);
                        U.set(e, this.offset),
                        this.offset += e.byteLength
                    }
                }, {
                    key: "writeZTStringZero",
                    value: function(t) {
                        var e = B.encodeInto(t, U.subarray(this.offset));
                        return this.offset += e.written,
                        this.writeUInt8(0),
                        e.written
                    }
                }, {
                    key: "writeZTStringShort",
                    value: function(t) {
                        t.length > 255 && (t = t.substring(0, 255));
                        var e = B.encode(t);
                        e.byteLength > 255 && (e = e.subarray(0, 255)),
                        this.writeUInt8(e.byteLength),
                        U.set(e, this.offset),
                        this.offset += e.byteLength
                    }
                }, {
                    key: "xor",
                    value: function() {
                        for (var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.view.byteOffset, e = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.view.byteLength, n = t; n < e; n++)
                            this.view.setUint8(n, 128 ^ this.view.getUint8(n))
                    }
                }, {
                    key: "skip",
                    value: function() {
                        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                        this.offset += t
                    }
                }, {
                    key: "slice",
                    value: function() {
                        return new Uint8Array(this.view.buffer.slice(0, this.offset))
                    }
                }, {
                    key: "finalize",
                    value: function() {
                        return U.subarray(0, this.offset)
                    }
                }, {
                    key: "toBuffer",
                    value: function() {
                        return U.subarray(0, this.offset)
                    }
                }])
            }();
            function N(t) {
                return N = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                N(t)
            }
            function H(t) {
                if (null != t) {
                    var e = t["function" == typeof Symbol && Symbol.iterator || "@@iterator"]
                      , n = 0;
                    if (e)
                        return e.call(t);
                    if ("function" == typeof t.next)
                        return t;
                    if (!isNaN(t.length))
                        return {
                            next: function() {
                                return t && n >= t.length && (t = void 0),
                                {
                                    value: t && t[n++],
                                    done: !t
                                }
                            }
                        }
                }
                throw new TypeError(N(t) + " is not iterable")
            }
            function D(t, e) {
                return function(t) {
                    if (Array.isArray(t))
                        return t
                }(t) || function(t, e) {
                    var n = null == t ? null : "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
                    if (null != n) {
                        var r, i, o, a, s = [], c = !0, l = !1;
                        try {
                            if (o = (n = n.call(t)).next,
                            0 === e) {
                                if (Object(n) !== n)
                                    return;
                                c = !1
                            } else
                                for (; !(c = (r = o.call(n)).done) && (s.push(r.value),
                                s.length !== e); c = !0)
                                    ;
                        } catch (t) {
                            l = !0,
                            i = t
                        } finally {
                            try {
                                if (!c && null != n.return && (a = n.return(),
                                Object(a) !== a))
                                    return
                            } finally {
                                if (l)
                                    throw i
                            }
                        }
                        return s
                    }
                }(t, e) || function(t, e) {
                    if (t) {
                        if ("string" == typeof t)
                            return G(t, e);
                        var n = {}.toString.call(t).slice(8, -1);
                        return "Object" === n && t.constructor && (n = t.constructor.name),
                        "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? G(t, e) : void 0
                    }
                }(t, e) || function() {
                    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                }()
            }
            function G(t, e) {
                (null == e || e > t.length) && (e = t.length);
                for (var n = 0, r = Array(e); n < e; n++)
                    r[n] = t[n];
                return r
            }
            function z() {
                var t, e, n = "function" == typeof Symbol ? Symbol : {}, r = n.iterator || "@@iterator", i = n.toStringTag || "@@toStringTag";
                function o(n, r, i, o) {
                    var c = r && r.prototype instanceof s ? r : s
                      , l = Object.create(c.prototype);
                    return V(l, "_invoke", function(n, r, i) {
                        var o, s, c, l = 0, u = i || [], h = !1, f = {
                            p: 0,
                            n: 0,
                            v: t,
                            a: d,
                            f: d.bind(t, 4),
                            d: function(e, n) {
                                return o = e,
                                s = 0,
                                c = t,
                                f.n = n,
                                a
                            }
                        };
                        function d(n, r) {
                            for (s = n,
                            c = r,
                            e = 0; !h && l && !i && e < u.length; e++) {
                                var i, o = u[e], d = f.p, p = o[2];
                                n > 3 ? (i = p === r) && (c = o[(s = o[4]) ? 5 : (s = 3,
                                3)],
                                o[4] = o[5] = t) : o[0] <= d && ((i = n < 2 && d < o[1]) ? (s = 0,
                                f.v = r,
                                f.n = o[1]) : d < p && (i = n < 3 || o[0] > r || r > p) && (o[4] = n,
                                o[5] = r,
                                f.n = p,
                                s = 0))
                            }
                            if (i || n > 1)
                                return a;
                            throw h = !0,
                            r
                        }
                        return function(i, u, p) {
                            if (l > 1)
                                throw TypeError("Generator is already running");
                            for (h && 1 === u && d(u, p),
                            s = u,
                            c = p; (e = s < 2 ? t : c) || !h; ) {
                                o || (s ? s < 3 ? (s > 1 && (f.n = -1),
                                d(s, c)) : f.n = c : f.v = c);
                                try {
                                    if (l = 2,
                                    o) {
                                        if (s || (i = "next"),
                                        e = o[i]) {
                                            if (!(e = e.call(o, c)))
                                                throw TypeError("iterator result is not an object");
                                            if (!e.done)
                                                return e;
                                            c = e.value,
                                            s < 2 && (s = 0)
                                        } else
                                            1 === s && (e = o.return) && e.call(o),
                                            s < 2 && (c = TypeError("The iterator does not provide a '" + i + "' method"),
                                            s = 1);
                                        o = t
                                    } else if ((e = (h = f.n < 0) ? c : n.call(r, f)) !== a)
                                        break
                                } catch (e) {
                                    o = t,
                                    s = 1,
                                    c = e
                                } finally {
                                    l = 1
                                }
                            }
                            return {
                                value: e,
                                done: h
                            }
                        }
                    }(n, i, o), !0),
                    l
                }
                var a = {};
                function s() {}
                function c() {}
                function l() {}
                e = Object.getPrototypeOf;
                var u = [][r] ? e(e([][r]())) : (V(e = {}, r, function() {
                    return this
                }),
                e)
                  , h = l.prototype = s.prototype = Object.create(u);
                function f(t) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(t, l) : (t.__proto__ = l,
                    V(t, i, "GeneratorFunction")),
                    t.prototype = Object.create(h),
                    t
                }
                return c.prototype = l,
                V(h, "constructor", l),
                V(l, "constructor", c),
                c.displayName = "GeneratorFunction",
                V(l, i, "GeneratorFunction"),
                V(h),
                V(h, i, "Generator"),
                V(h, r, function() {
                    return this
                }),
                V(h, "toString", function() {
                    return "[object Generator]"
                }),
                (z = function() {
                    return {
                        w: o,
                        m: f
                    }
                }
                )()
            }
            function V(t, e, n, r) {
                var i = Object.defineProperty;
                try {
                    i({}, "", {})
                } catch (t) {
                    i = 0
                }
                V = function(t, e, n, r) {
                    function o(e, n) {
                        V(t, e, function(t) {
                            return this._invoke(e, n, t)
                        })
                    }
                    e ? i ? i(t, e, {
                        value: n,
                        enumerable: !r,
                        configurable: !r,
                        writable: !r
                    }) : t[e] = n : (o("next", 0),
                    o("throw", 1),
                    o("return", 2))
                }
                ,
                V(t, e, n, r)
            }
            function q(t, e, n, r, i, o, a) {
                try {
                    var s = t[o](a)
                      , c = s.value
                } catch (t) {
                    return void n(t)
                }
                s.done ? e(c) : Promise.resolve(c).then(r, i)
            }
            function X(t) {
                return function() {
                    var e = this
                      , n = arguments;
                    return new Promise(function(r, i) {
                        var o = t.apply(e, n);
                        function a(t) {
                            q(o, r, i, a, s, "next", t)
                        }
                        function s(t) {
                            q(o, r, i, a, s, "throw", t)
                        }
                        a(void 0)
                    }
                    )
                }
            }
            function Y(t) {
                var e = function(t) {
                    if ("object" != N(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != N(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == N(e) ? e : e + ""
            }
            var K = function() {
                return t = function t() {
                    !function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, t)
                }
                ,
                e = [{
                    key: "tryFetch",
                    value: (i = X(z().m(function t(e) {
                        var n, r, i, o, a, s, c, l, u = arguments;
                        return z().w(function(t) {
                            for (; ; )
                                switch (t.p = t.n) {
                                case 0:
                                    return n = u.length > 1 && void 0 !== u[1] ? u[1] : 5e3,
                                    t.p = 1,
                                    r = new AbortController,
                                    i = setTimeout(function() {
                                        return r.abort()
                                    }, n),
                                    t.n = 2,
                                    fetch(e, {
                                        method: "GET",
                                        signal: r.signal,
                                        headers: {
                                            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
                                        }
                                    });
                                case 2:
                                    if (o = t.v,
                                    clearTimeout(i),
                                    a = {},
                                    o.headers.forEach(function(t, e) {
                                        a[e] = t
                                    }),
                                    s = null,
                                    o.ok) {
                                        t.n = 4;
                                        break
                                    }
                                    return t.n = 3,
                                    o.text();
                                case 3:
                                    c = t.v,
                                    s = c.slice(0, 500);
                                case 4:
                                    return t.a(2, {
                                        status: o.status,
                                        statusText: o.statusText,
                                        headers: a,
                                        bodySnippet: s
                                    });
                                case 5:
                                    return t.p = 5,
                                    l = t.v,
                                    t.p = 6,
                                    t.n = 7,
                                    fetch(e, {
                                        method: "GET",
                                        mode: "no-cors",
                                        signal: AbortSignal.timeout(5e3)
                                    });
                                case 7:
                                    return t.a(2, {
                                        status: 0,
                                        statusText: "Reachable (CORS Block)",
                                        headers: {},
                                        bodySnippet: "Server is reachable. The 'Failed to fetch' error is due to CORS policy, not network blockage."
                                    });
                                case 8:
                                    return t.p = 8,
                                    t.v,
                                    t.a(2, {
                                        status: 0,
                                        statusText: "Unreachable",
                                        headers: {},
                                        bodySnippet: null,
                                        error: l.message || "Network Error - Completely blocked or down"
                                    })
                                }
                        }, t, null, [[6, 8], [1, 5]])
                    })),
                    function(t) {
                        return i.apply(this, arguments)
                    }
                    )
                }, {
                    key: "probeConnectivity",
                    value: (r = X(z().m(function t(e) {
                        var n, r, i, o, a, s, c, l, u, h, f, d, p, y;
                        return z().w(function(t) {
                            for (; ; )
                                switch (t.n) {
                                case 0:
                                    n = e.replace(/^ws:\/\//i, "http://").replace(/^wss:\/\//i, "https://"),
                                    r = null,
                                    i = null;
                                    try {
                                        (o = new URL(n)).port && (r = "".concat(o.protocol, "//").concat(o.hostname)),
                                        (a = o.hostname.split(".")).length > 2 && (s = a.slice(a.length - 2).join("."),
                                        (i = "".concat(o.protocol, "//").concat(s)) === r && (i = null),
                                        i === n && (i = null))
                                    } catch (t) {}
                                    return c = this.tryFetch(n),
                                    l = r ? this.tryFetch(r) : Promise.resolve(void 0),
                                    u = i ? this.tryFetch(i) : Promise.resolve(void 0),
                                    t.n = 1,
                                    Promise.all([c, l, u]);
                                case 1:
                                    return h = t.v,
                                    f = D(h, 3),
                                    d = f[0],
                                    p = f[1],
                                    y = f[2],
                                    t.a(2, {
                                        target: d,
                                        root: p,
                                        base: y
                                    })
                                }
                        }, t, this)
                    })),
                    function(t) {
                        return r.apply(this, arguments)
                    }
                    )
                }, {
                    key: "getIdentity",
                    value: (n = X(z().m(function t() {
                        var e, n, r, i, o, a;
                        return z().w(function(t) {
                            for (; ; )
                                switch (t.n) {
                                case 0:
                                    e = [{
                                        name: "vpnapi.io",
                                        url: "https://vpnapi.io/api/?key=d40b3cf87b4a48d78a216a314c76742e",
                                        parser: function(t) {
                                            var e, n, r, i, o, a, s, c, l;
                                            return {
                                                ip: t.ip || "Unknown",
                                                isp: (null === (e = t.network) || void 0 === e ? void 0 : e.autonomous_system_organization) || "Unknown",
                                                org: (null === (n = t.network) || void 0 === n ? void 0 : n.autonomous_system_organization) || "Unknown",
                                                country: (null === (r = t.location) || void 0 === r ? void 0 : r.country) || "Unknown",
                                                city: (null === (i = t.location) || void 0 === i ? void 0 : i.city) || "Unknown",
                                                timezone: (null === (o = t.location) || void 0 === o ? void 0 : o.time_zone) || "Unknown",
                                                security: {
                                                    vpn: null === (a = t.security) || void 0 === a ? void 0 : a.vpn,
                                                    proxy: null === (s = t.security) || void 0 === s ? void 0 : s.proxy,
                                                    tor: null === (c = t.security) || void 0 === c ? void 0 : c.tor,
                                                    hosting: null === (l = t.security) || void 0 === l ? void 0 : l.relay
                                                },
                                                raw: t,
                                                error: void 0
                                            }
                                        }
                                    }, {
                                        name: "ipwho.is",
                                        url: "https://ipwho.is/",
                                        parser: function(t) {
                                            var e, n, r, i;
                                            return {
                                                ip: t.ip,
                                                isp: (null === (e = t.connection) || void 0 === e ? void 0 : e.isp) || t.isp || "Unknown",
                                                org: (null === (n = t.connection) || void 0 === n ? void 0 : n.org) || t.org || "Unknown",
                                                country: t.country || "Unknown",
                                                city: t.city || "Unknown",
                                                timezone: (null === (r = t.timezone) || void 0 === r ? void 0 : r.id) || "Unknown",
                                                security: {
                                                    hosting: !(null === (i = t.connection) || void 0 === i || !i.domain)
                                                },
                                                raw: t,
                                                error: t.success ? void 0 : t.message
                                            }
                                        }
                                    }, {
                                        name: "db-ip",
                                        url: "https://api.db-ip.com/v2/free/self",
                                        parser: function(t) {
                                            return {
                                                ip: t.ipAddress,
                                                isp: "Unknown",
                                                org: "Unknown",
                                                country: t.countryName,
                                                city: t.city,
                                                timezone: "Unknown",
                                                raw: t
                                            }
                                        }
                                    }],
                                    n = "No providers available",
                                    r = z().m(function t() {
                                        var e, r, i, s, c, l, u;
                                        return z().w(function(t) {
                                            for (; ; )
                                                switch (t.p = t.n) {
                                                case 0:
                                                    return e = a[o],
                                                    t.p = 1,
                                                    r = new AbortController,
                                                    i = setTimeout(function() {
                                                        return r.abort()
                                                    }, 4e3),
                                                    t.n = 2,
                                                    fetch(e.url, {
                                                        signal: r.signal
                                                    });
                                                case 2:
                                                    if (s = t.v,
                                                    clearTimeout(i),
                                                    s.ok) {
                                                        t.n = 3;
                                                        break
                                                    }
                                                    throw new Error("".concat(e.name, " status ").concat(s.status));
                                                case 3:
                                                    return t.n = 4,
                                                    s.json();
                                                case 4:
                                                    if (c = t.v,
                                                    !(l = e.parser(c)).error) {
                                                        t.n = 5;
                                                        break
                                                    }
                                                    throw new Error("".concat(e.name, " API error: ").concat(l.error));
                                                case 5:
                                                    return l.provider = e.name,
                                                    t.a(2, {
                                                        v: l
                                                    });
                                                case 6:
                                                    t.p = 6,
                                                    u = t.v,
                                                    console.warn("[Diagnostics] Identity provider ".concat(e.name, " failed:"), u.message),
                                                    n = u.message;
                                                case 7:
                                                    return t.a(2)
                                                }
                                        }, t, null, [[1, 6]])
                                    }),
                                    o = 0,
                                    a = e;
                                case 1:
                                    if (!(o < a.length)) {
                                        t.n = 4;
                                        break
                                    }
                                    return t.d(H(r()), 2);
                                case 2:
                                    if (!(i = t.v)) {
                                        t.n = 3;
                                        break
                                    }
                                    return t.a(2, i.v);
                                case 3:
                                    o++,
                                    t.n = 1;
                                    break;
                                case 4:
                                    return t.a(2, {
                                        ip: "Unknown",
                                        isp: "Unknown",
                                        org: "Unknown",
                                        country: "Unknown",
                                        city: "Unknown",
                                        timezone: "Unknown",
                                        raw: {},
                                        error: n
                                    })
                                }
                        }, t)
                    })),
                    function() {
                        return n.apply(this, arguments)
                    }
                    )
                }, {
                    key: "getNetworkInfo",
                    value: function() {
                        var t = navigator;
                        return t.connection ? {
                            effectiveType: t.connection.effectiveType,
                            rtt: t.connection.rtt,
                            downlink: t.connection.downlink,
                            saveData: t.connection.saveData,
                            onLine: t.onLine
                        } : {
                            onLine: t.onLine,
                            details: "Navigator Connection API not supported"
                        }
                    }
                }],
                e && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1,
                        r.configurable = !0,
                        "value"in r && (r.writable = !0),
                        Object.defineProperty(t, Y(r.key), r)
                    }
                }(t, e),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                t;
                var t, e, n, r, i
            }();
            const Z = function(t, e, n, r) {
                return n * t / r + e
            }
              , J = function(t) {
                return 1 - --t * t * t * t
            };
            function Q(t) {
                return Q = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                Q(t)
            }
            function $(t) {
                var e = function(t) {
                    if ("object" != Q(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != Q(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == Q(e) ? e : e + ""
            }
            var tt = function() {
                return t = function t() {
                    !function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, t),
                    this.id = 0,
                    this.playerId = 0,
                    this.x = 0,
                    this.y = 0,
                    this.r = 0,
                    this.targetX = 0,
                    this.targetY = 0,
                    this.targetR = 0,
                    this.colorInt = 0,
                    this.colorHex = "#BBBBBB",
                    this.skin = "no-skin",
                    this.nickname = "",
                    this.flags = {
                        isFood: !1,
                        isEject: !1,
                        isVirus: !1
                    },
                    this.clientOrigin = null,
                    this.drawCompleted = !1,
                    this.destroyed = !1,
                    this.eatenBy = null,
                    this.globalAlpha = 1,
                    this.animationProgress = 1,
                    this.fadeInStartTime = null,
                    this.fadeOutStartTime = 0,
                    this.fadeOutAnimationCompleted = !1,
                    this.reset()
                }
                ,
                (e = [{
                    key: "mass",
                    get: function() {
                        return ~~(this.r * this.r / 100)
                    }
                }, {
                    key: "splitMass",
                    get: function() {
                        return this.mass >> 1
                    }
                }, {
                    key: "reset",
                    value: function() {
                        this.id = 0,
                        this.playerId = 0,
                        this.x = this.targetX = 0,
                        this.y = this.targetY = 0,
                        this.r = this.targetR = 0,
                        this.motion = null,
                        this.colorInt = 0,
                        this.colorHex = "#BBBBBB",
                        this.skin = "no-skin",
                        this.nickname = "",
                        this.flags = {
                            isFood: !1,
                            isEject: !1,
                            isVirus: !1
                        },
                        this.clientOrigin = null,
                        this.drawCompleted = !1,
                        this.destroyed = !1,
                        this.eatenBy = null,
                        this.globalAlpha = 1,
                        this.animationProgress = 1,
                        this.fadeInStartTime = null,
                        this.fadeOutStartTime = 0,
                        this.fadeOutAnimationCompleted = !1
                    }
                }, {
                    key: "moveCell",
                    value: function(t, e, n, r, adaptive, sizeSpeed = n, eatSpeed = n, spawnSpeed = n) {
                        var i = t / (this.destroyed ? eatSpeed : n);
                        const sizeBlend = Math.max(0, Math.min(1, t / (this.destroyed ? eatSpeed : sizeSpeed)));
                        if (i = i < 0 ? 0 : i > 1 ? 1 : i,
                        this.destroyed) {
                            var o = Z(e - this.fadeOutStartTime, 0, 1, eatSpeed);
                            if (this.animationProgress = 1 - o,
                            this.globalAlpha = J(1 - o),
                            this.animationProgress <= 0 && (this.fadeOutAnimationCompleted = !0),
                            r && this.eatenBy) {
                                var a = this.targetX
                                  , s = this.targetY
                                  , c = this.eatenBy.x
                                  , l = this.eatenBy.y
                                  , u = a - c
                                  , h = s - l
                                  , f = Math.sqrt(Math.pow(this.targetX * this.eatenBy.targetX, 2) + Math.pow(this.targetY * this.eatenBy.targetY, 2))
                                  , d = Math.sqrt(u * u + h * h)
                                  , p = Math.min(d - .8 * this.eatenBy.r + 2 * this.r, f - this.eatenBy.r)
                                  , y = Math.atan2(l - s, c - a);
                                this.targetX = a + Math.cos(y) * p,
                                this.targetY = s + Math.sin(y) * p,
                                this.targetR = Math.min(Math.max(.9 * this.r, 0), this.eatenBy.targetR)
                            }
                        } else if (null === this.fadeInStartTime)
                            this.fadeInStartTime = null,
                            this.globalAlpha = 1;
                        else {
                            var v = (e - this.fadeInStartTime) / spawnSpeed;
                            this.animationProgress = v < 1 ? v : 1,
                            this.globalAlpha = this.animationProgress,
                            v >= 1 && (this.fadeInStartTime = null,
                            this.animationProgress = 1,
                            this.globalAlpha = 1)
                        }
                        if (!adaptive) this.motion = null;
                        if (!adaptive || !window.EonSenpaMotion.advance(this, e)) {
                            this.x += (this.targetX - this.x) * i;
                            this.y += (this.targetY - this.y) * i;
                            this.r += (this.targetR - this.r) * sizeBlend;
                        }
                    }
                }, {
                    key: "moveFood",
                    value: function(t, e, n, r, spawnSpeed = n) {
                        var i = t / (2 * n);
                        if (i = i < 0 ? 0 : i > 1 ? 1 : i,
                        this.destroyed) {
                            var o = Z(e - this.fadeOutStartTime, 0, 1, n);
                            if (this.animationProgress = 1 - o,
                            this.globalAlpha = this.animationProgress,
                            o >= 1 && (this.fadeOutAnimationCompleted = !0),
                            r && this.eatenBy) {
                                this.globalAlpha = J(1 - o);
                                var a = this.targetX
                                  , s = this.targetY
                                  , c = this.eatenBy.x
                                  , l = this.eatenBy.y
                                  , u = a - c
                                  , h = s - l
                                  , f = Math.sqrt(Math.pow(this.targetX * this.eatenBy.targetX, 2) + Math.pow(this.targetY * this.eatenBy.targetY, 2))
                                  , d = Math.sqrt(u * u + h * h)
                                  , p = Math.min(d - this.eatenBy.r + 2 * this.r, f - this.eatenBy.r)
                                  , y = Math.atan2(l - s, c - a);
                                this.targetX = a + Math.cos(y) * p,
                                this.targetY = s + Math.sin(y) * p,
                                this.targetR = 0
                            }
                        } else if (null !== this.fadeInStartTime) {
                            var v = Z(e - this.fadeInStartTime, 0, 1, 2 * spawnSpeed);
                            this.animationProgress = v < 1 ? v : 1,
                            this.globalAlpha = this.animationProgress,
                            v >= 1 && (this.fadeInStartTime = null)
                        }
                        this.x === this.targetX && this.y === this.targetY && this.r === this.targetR || (this.x += (this.targetX - this.x) * i,
                        this.y += (this.targetY - this.y) * i,
                        this.r += (this.targetR - this.r) * i)
                    }
                }]) && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1,
                        r.configurable = !0,
                        "value"in r && (r.writable = !0),
                        Object.defineProperty(t, $(r.key), r)
                    }
                }(t.prototype, e),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                t;
                var t, e
            }();
            function et(t) {
                return et = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                et(t)
            }
            function nt(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var r = e[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(t, rt(r.key), r)
                }
            }
            function rt(t) {
                var e = function(t) {
                    if ("object" != et(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != et(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == et(e) ? e : e + ""
            }
            var it = function() {
                function t() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 255
                      , n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 255
                      , r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 255
                      , i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 255;
                    !function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, t),
                    this.r = e,
                    this.g = n,
                    this.b = r,
                    this.a = i,
                    this.vector = new Float32Array(4),
                    this.bytes = new Uint8Array(4),
                    this.dataview = new DataView(this.bytes.buffer),
                    this.string = "#000000",
                    this.int = 0,
                    this.inta = 0,
                    this.updateVector(),
                    this.updateString(),
                    this.updateInt()
                }
                return e = t,
                n = [{
                    key: "updateVector",
                    value: function() {
                        this.vector[0] = this.r / 255,
                        this.vector[1] = this.g / 255,
                        this.vector[2] = this.b / 255,
                        this.vector[3] = this.a / 255,
                        this.bytes[0] = this.r,
                        this.bytes[1] = this.g,
                        this.bytes[2] = this.b,
                        this.bytes[3] = this.a,
                        this.float = this.dataview.getFloat32(0, !0),
                        this.u32 = this.r | this.g << 8 | this.b << 16 | this.a << 24
                    }
                }, {
                    key: "updateString",
                    value: function() {
                        this.string = this.toRgb(!0)
                    }
                }, {
                    key: "updateInt",
                    value: function() {
                        this.int = this.getInt(),
                        this.inta = this.getInta()
                    }
                }, {
                    key: "cloneFrom",
                    value: function(t) {
                        return this.r = t.r,
                        this.g = t.g,
                        this.b = t.b,
                        this.a = t.a,
                        this.updateVector(),
                        this.updateString(),
                        this
                    }
                }, {
                    key: "fromHSL",
                    value: function(t, e, n) {
                        var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 255;
                        e /= 100,
                        n /= 100;
                        var i = (1 - Math.abs(2 * n - 1)) * e
                          , o = i * (1 - Math.abs(t / 60 % 2 - 1))
                          , a = n - i / 2
                          , s = 0
                          , c = 0
                          , l = 0;
                        return t < 60 ? (s = i,
                        c = o,
                        l = 0) : t < 120 ? (s = o,
                        c = i,
                        l = 0) : t < 180 ? (s = 0,
                        c = i,
                        l = o) : t < 240 ? (s = 0,
                        c = o,
                        l = i) : t < 300 ? (s = o,
                        c = 0,
                        l = i) : (s = i,
                        c = 0,
                        l = o),
                        this.fromRGB(Math.round(255 * (s + a)), Math.round(255 * (c + a)), Math.round(255 * (l + a)), r)
                    }
                }, {
                    key: "fromObject",
                    value: function(t) {
                        var e = t.r
                          , n = t.g
                          , r = t.b
                          , i = t.a;
                        return this.fromRGB(e, n, r, null != i ? i : 255)
                    }
                }, {
                    key: "fromRGB",
                    value: function(t, e, n) {
                        var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 255;
                        return this.r = t,
                        this.g = e,
                        this.b = n,
                        this.a = r,
                        this.updateVector(),
                        this.updateString(),
                        this
                    }
                }, {
                    key: "fromINT",
                    value: function(t) {
                        var e = t >>> 24 & 255
                          , n = t >>> 16 & 255
                          , r = t >>> 8 & 255
                          , i = 255 & t;
                        return arguments.length > 1 && void 0 !== arguments[1] && arguments[1] ? this.fromRGB(e, i, r, n) : this.fromRGB(n, r, i, e)
                    }
                }, {
                    key: "fromHex",
                    value: function(e) {
                        if (!t.isValidHex(e))
                            return this;
                        var n = 9 === e.length ? 32 : 24
                          , r = parseInt(e.slice(1), 16)
                          , i = r >> n - 8 & 255
                          , o = r >> n - 16 & 255
                          , a = r >> n - 24 & 255
                          , s = 32 === n ? 255 & r : 255;
                        return this.fromRGB(i, o, a, s)
                    }
                }, {
                    key: "getNormalFromSecure",
                    value: function() {
                        return t.rgbToInt(Math.ceil(this.r / .9), Math.ceil(this.g / .9), Math.ceil(this.b / .9))
                    }
                }, {
                    key: "toRgb",
                    value: function() {
                        return arguments.length > 0 && void 0 !== arguments[0] && arguments[0] ? "rgba(".concat(this.r, ", ").concat(this.g, ", ").concat(this.b, ", ").concat(this.a / 255, ")") : "rgb(".concat(this.r, ", ").concat(this.g, ", ").concat(this.b, ")")
                    }
                }, {
                    key: "getHEXA",
                    value: function() {
                        return "#".concat([this.r, this.g, this.b, this.a].map(t.toHex).join(""))
                    }
                }, {
                    key: "getHEX",
                    value: function() {
                        return "#" + (16777216 | this.getInt()).toString(16).substring(1)
                    }
                }, {
                    key: "toHEX8",
                    value: function() {
                        return "".concat(this.getHEX()).concat(this.a.toString(16).padStart(2, "0"))
                    }
                }, {
                    key: "getInt",
                    value: function() {
                        return this.r << 16 | this.g << 8 | this.b
                    }
                }, {
                    key: "getIntShader",
                    value: function() {
                        return this.getInt()
                    }
                }, {
                    key: "getIntaShader",
                    value: function(t) {
                        return (t < 0 ? this.a : t) << 24 | this.getInt()
                    }
                }, {
                    key: "getInta",
                    value: function() {
                        return this.a << 24 | this.r << 16 | this.g << 8 | this.b
                    }
                }, {
                    key: "getFloat",
                    value: function() {
                        var e = this.a << 24 | this.b << 16 | this.g << 8 | this.r;
                        return t.pack(e)
                    }
                }, {
                    key: "getSecureHex",
                    value: function() {
                        return t.colorIntToHex(t.rgbToInt(~~(.9 * this.r), ~~(.9 * this.g), ~~(.9 * this.b)))
                    }
                }, {
                    key: "getSecureInt",
                    value: function() {
                        return t.rgbToInt(~~(.9 * this.r), ~~(.9 * this.g), ~~(.9 * this.b))
                    }
                }, {
                    key: "brightness",
                    value: function(e) {
                        var n = t.brighten(this.getInt(), e);
                        return this.fromINT(n)
                    }
                }],
                r = [{
                    key: "rgbToInt",
                    value: function(t, e, n) {
                        return t << 16 | e << 8 | n
                    }
                }, {
                    key: "colorIntToHex",
                    value: function(t) {
                        return "#".concat(t.toString(16).padStart(6, "0"))
                    }
                }, {
                    key: "isValidHex",
                    value: function(t) {
                        return /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(t)
                    }
                }, {
                    key: "getChunksFromString",
                    value: function(t, e) {
                        return t.match(new RegExp(".{".concat(e, "}"),"g")) || []
                    }
                }, {
                    key: "convertHexUnitTo256",
                    value: function(t) {
                        return parseInt(t.repeat(2 / t.length), 16)
                    }
                }, {
                    key: "getAlphafloat",
                    value: function(t) {
                        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1;
                        return void 0 !== t ? t / 255 : "number" == typeof e && e >= 0 && e <= 1 ? e : 1
                    }
                }, {
                    key: "hexToRGBA",
                    value: function(e) {
                        if (!t.isValidHex(e))
                            throw new Error("Invalid HEX");
                        var n = Math.floor((e.length - 1) / 3);
                        return t.getChunksFromString(e.slice(1), n).map(t.convertHexUnitTo256)
                    }
                }, {
                    key: "pack",
                    value: function(e) {
                        return t.int32[0] = e,
                        t.float32[0]
                    }
                }, {
                    key: "unpack",
                    value: function(e) {
                        return t.float32[0] = e,
                        t.int32[0]
                    }
                }, {
                    key: "brighten",
                    value: function(e, n) {
                        var r = (e >> 16 & 255) + Math.round(n / 100 * 255)
                          , i = (e >> 8 & 255) + Math.round(n / 100 * 255)
                          , o = (255 & e) + Math.round(n / 100 * 255);
                        return 255 << 24 | t.clamp(r) << 16 | t.clamp(i) << 8 | t.clamp(o)
                    }
                }, {
                    key: "darkenColor",
                    value: function(e, n) {
                        var r = (e >> 16 & 255) - Math.round(n / 100 * 255)
                          , i = (e >> 8 & 255) - Math.round(n / 100 * 255)
                          , o = (255 & e) - Math.round(n / 100 * 255);
                        return 255 << 24 | t.clamp(r) << 16 | t.clamp(i) << 8 | t.clamp(o)
                    }
                }, {
                    key: "multiplyAlpha",
                    value: function(t, e) {
                        return ((t >>> 24) * e & 255) << 24 | 16777215 & t
                    }
                }, {
                    key: "clamp",
                    value: function(t) {
                        return Math.max(0, Math.min(255, t))
                    }
                }, {
                    key: "toHex",
                    value: function(t) {
                        var e = t.toString(16);
                        return 1 === e.length ? "0" + e : e
                    }
                }],
                n && nt(e.prototype, n),
                r && nt(e, r),
                Object.defineProperty(e, "prototype", {
                    writable: !1
                }),
                e;
                var e, n, r
            }();
            it.int8 = new Int8Array(4),
            it.int32 = new Int32Array(it.int8.buffer,0,1),
            it.float32 = new Float32Array(it.int8.buffer,0,1),
            it.temp = new it;
            const ot = it;
            function at(t) {
                var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 3;
                if (!t)
                    return t;
                for (var n = t, r = function() {
                    var t = o[i]
                      , r = n.match(t);
                    if (r && r.length > e) {
                        var a = 0;
                        n = n.replace(t, function(t) {
                            return ++a <= e ? t : ""
                        })
                    }
                }, i = 0, o = [/[\u0BE6-\u0BFA]/g, /[\u200B-\u200D\uFEFF]/g, /[\u0300-\u036F]/g, /[\u2060-\u2069]/g, /[\uFFF0-\uFFFF]/g]; i < o.length; i++)
                    r();
                return 0 === (n = (n = n.replace(/(.)\1{10,}/g, function(t, n) {
                    return n.repeat(Math.min(e, 3))
                })).trim()).length && t.length > 0 ? "unnamed" : n
            }
            function st(t) {
                return st = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                st(t)
            }
            function ct(t) {
                var e = function(t) {
                    if ("object" != st(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != st(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == st(e) ? e : e + ""
            }
            var lt = Symbol("_increasePool")
              , ut = function(t) {
                return e = function t(e, n) {
                    var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 3;
                    !function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, t),
                    this.createFn = e,
                    this.resetFn = n,
                    this.pool = [],
                    this.createdElements = 0,
                    this.inUseCount = 0;
                    for (var i = 0; i < r; i++)
                        this.pool.push(this.createFn()),
                        this.createdElements++
                }
                ,
                (n = [{
                    key: "acquire",
                    value: function() {
                        var t = this.pool.length + this.inUseCount
                          , e = this.pool.length / t;
                        (0 === this.pool.length || e <= .03) && this[lt]();
                        var n = this.pool.pop();
                        return this.inUseCount++,
                        n
                    }
                }, {
                    key: "release",
                    value: function(t) {
                        this.resetFn && this.resetFn(t),
                        this.pool.push(t),
                        this.inUseCount--
                    }
                }, {
                    key: "releaseAll",
                    value: function() {
                        var t = this;
                        this.pool.forEach(function(e) {
                            var n;
                            return null === (n = t.resetFn) || void 0 === n ? void 0 : n.call(t, e)
                        })
                    }
                }, {
                    key: t,
                    value: function() {
                        for (var t = Math.max(1, Math.ceil(.05 * this.createdElements)), e = 0; e < t; e++)
                            this.pool.push(this.createFn()),
                            this.createdElements++
                    }
                }, {
                    key: "logStatus",
                    value: function() {
                        var t = this.pool.length + this.inUseCount;
                        console.log("[ObjectPool] Total: ".concat(t, ", In Use: ").concat(this.inUseCount, ", Free: ").concat(this.pool.length))
                    }
                }]) && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1,
                        r.configurable = !0,
                        "value"in r && (r.writable = !0),
                        Object.defineProperty(t, ct(r.key), r)
                    }
                }(e.prototype, n),
                Object.defineProperty(e, "prototype", {
                    writable: !1
                }),
                e;
                var e, n
            }(lt);
            function ht() {
                var t, e, n = "function" == typeof Symbol ? Symbol : {}, r = n.iterator || "@@iterator", i = n.toStringTag || "@@toStringTag";
                function o(n, r, i, o) {
                    var c = r && r.prototype instanceof s ? r : s
                      , l = Object.create(c.prototype);
                    return ft(l, "_invoke", function(n, r, i) {
                        var o, s, c, l = 0, u = i || [], h = !1, f = {
                            p: 0,
                            n: 0,
                            v: t,
                            a: d,
                            f: d.bind(t, 4),
                            d: function(e, n) {
                                return o = e,
                                s = 0,
                                c = t,
                                f.n = n,
                                a
                            }
                        };
                        function d(n, r) {
                            for (s = n,
                            c = r,
                            e = 0; !h && l && !i && e < u.length; e++) {
                                var i, o = u[e], d = f.p, p = o[2];
                                n > 3 ? (i = p === r) && (c = o[(s = o[4]) ? 5 : (s = 3,
                                3)],
                                o[4] = o[5] = t) : o[0] <= d && ((i = n < 2 && d < o[1]) ? (s = 0,
                                f.v = r,
                                f.n = o[1]) : d < p && (i = n < 3 || o[0] > r || r > p) && (o[4] = n,
                                o[5] = r,
                                f.n = p,
                                s = 0))
                            }
                            if (i || n > 1)
                                return a;
                            throw h = !0,
                            r
                        }
                        return function(i, u, p) {
                            if (l > 1)
                                throw TypeError("Generator is already running");
                            for (h && 1 === u && d(u, p),
                            s = u,
                            c = p; (e = s < 2 ? t : c) || !h; ) {
                                o || (s ? s < 3 ? (s > 1 && (f.n = -1),
                                d(s, c)) : f.n = c : f.v = c);
                                try {
                                    if (l = 2,
                                    o) {
                                        if (s || (i = "next"),
                                        e = o[i]) {
                                            if (!(e = e.call(o, c)))
                                                throw TypeError("iterator result is not an object");
                                            if (!e.done)
                                                return e;
                                            c = e.value,
                                            s < 2 && (s = 0)
                                        } else
                                            1 === s && (e = o.return) && e.call(o),
                                            s < 2 && (c = TypeError("The iterator does not provide a '" + i + "' method"),
                                            s = 1);
                                        o = t
                                    } else if ((e = (h = f.n < 0) ? c : n.call(r, f)) !== a)
                                        break
                                } catch (e) {
                                    o = t,
                                    s = 1,
                                    c = e
                                } finally {
                                    l = 1
                                }
                            }
                            return {
                                value: e,
                                done: h
                            }
                        }
                    }(n, i, o), !0),
                    l
                }
                var a = {};
                function s() {}
                function c() {}
                function l() {}
                e = Object.getPrototypeOf;
                var u = [][r] ? e(e([][r]())) : (ft(e = {}, r, function() {
                    return this
                }),
                e)
                  , h = l.prototype = s.prototype = Object.create(u);
                function f(t) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(t, l) : (t.__proto__ = l,
                    ft(t, i, "GeneratorFunction")),
                    t.prototype = Object.create(h),
                    t
                }
                return c.prototype = l,
                ft(h, "constructor", l),
                ft(l, "constructor", c),
                c.displayName = "GeneratorFunction",
                ft(l, i, "GeneratorFunction"),
                ft(h),
                ft(h, i, "Generator"),
                ft(h, r, function() {
                    return this
                }),
                ft(h, "toString", function() {
                    return "[object Generator]"
                }),
                (ht = function() {
                    return {
                        w: o,
                        m: f
                    }
                }
                )()
            }
            function ft(t, e, n, r) {
                var i = Object.defineProperty;
                try {
                    i({}, "", {})
                } catch (t) {
                    i = 0
                }
                ft = function(t, e, n, r) {
                    function o(e, n) {
                        ft(t, e, function(t) {
                            return this._invoke(e, n, t)
                        })
                    }
                    e ? i ? i(t, e, {
                        value: n,
                        enumerable: !r,
                        configurable: !r,
                        writable: !r
                    }) : t[e] = n : (o("next", 0),
                    o("throw", 1),
                    o("return", 2))
                }
                ,
                ft(t, e, n, r)
            }
            function dt(t) {
                return dt = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                dt(t)
            }
            function pt(t, e, n, r, i, o, a) {
                try {
                    var s = t[o](a)
                      , c = s.value
                } catch (t) {
                    return void n(t)
                }
                s.done ? e(c) : Promise.resolve(c).then(r, i)
            }
            function yt(t) {
                return function() {
                    var e = this
                      , n = arguments;
                    return new Promise(function(r, i) {
                        var o = t.apply(e, n);
                        function a(t) {
                            pt(o, r, i, a, s, "next", t)
                        }
                        function s(t) {
                            pt(o, r, i, a, s, "throw", t)
                        }
                        a(void 0)
                    }
                    )
                }
            }
            function vt(t) {
                var e = function(t) {
                    if ("object" != dt(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != dt(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == dt(e) ? e : e + ""
            }
            var gt = function() {
                return new tt
            }
              , mt = function(t) {
                return t.reset()
            }
              , bt = function() {
                return t = function t(e) {
                    !function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, t),
                    this.connectionTimeout = null,
                    this.authCompleted = !1,
                    this.clientReady = !1,
                    this.clientId = null,
                    this.ping = 0,
                    this.pingInterval = null,
                    this.pingStartTime = 0,
                    this.connectionStartTime = 0,
                    this.probePromise = null,
                    this.probeUrl = null,
                    this.lastLeaderboardUpdate = 0,
                    this.cellPool = new ut(gt,mt,3),
                    this.cells = {},
                    this.sharedCellsToBeRendered = [],
                    this.sharedCellsToBeRemoved = [],
                    this.cellsToBeRendered = [],
                    this.cellsToBeRemoved = [],
                    this.timeRemaining = "00h 00m 00s",
                    this.minimapPlayers = new Map,
                    this.isSyncing = !1,
                    this.app = e,
                    this.logger = new S({
                        prefix: "Client",
                        color: "#00BCD4"
                    }),
                    this.events = new o,
                    this.socket = null,
                    this.svSocket = null,
                    this.module = null,
                    this.playerClients = new Map,
                    this.players = new Map,
                    this.player = {
                        x: 0,
                        y: 0,
                        totalMass: 0,
                        totalSize: 0,
                        cells: [],
                        colorInt: 0
                    },
                    this.spectate = {
                        enabled: !1,
                        x: 0,
                        y: 0
                    },
                    this.chatTab = null,
                    this.lastData = {
                        flags: {},
                        position: {
                            x: null,
                            y: null,
                            mass: null
                        },
                        playerID: null,
                        isAlive: !1,
                        clientID: null,
                        nick: null,
                        customSkin: null,
                        customColor: null,
                        accountID: null,
                        pSkin: null,
                        pColor: null,
                        quadrant: null
                    },
                    this.border = {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    },
                    this.bound = {
                        left: 0,
                        right: 0,
                        top: 22e3,
                        bottom: 22e3
                    }
                }
                ,
                e = [{
                    key: "isConnected",
                    get: function() {
                        return this.socket && this.socket.readyState === WebSocket.OPEN
                    }
                }, {
                    key: "isAlive",
                    get: function() {
                        return this.player.cells.length > 0
                    }
                }, {
                    key: "isDead",
                    get: function() {
                        return 0 === this.player.cells.length
                    }
                }, {
                    key: "isFreshSpawn",
                    get: function() {
                        return 0 === this.player.cells.length
                    }
                }, {
                    key: "cleanup",
                    value: function() {
                        var t = this;
                        window.EonSenpaMotion.reset(this);
                        Object.values(this.cells).forEach(function(e) {
                            return t.removeCell(e)
                        }),
                        this.authCompleted = !1,
                        this.clientReady = !1,
                        this.clientId = null,
                        this.probePromise = null,
                        this.probeUrl = null,
                        this.player.x = 0,
                        this.player.y = 0,
                        this.player.totalMass = 0,
                        this.player.totalSize = 0,
                        this.playerClients.clear(),
                        this.players.clear(),
                        this.minimapPlayers.clear(),
                        this.bound = {
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0
                        }
                    }
                }, {
                    key: "initiate",
                    value: function() {
                        var t = this;
                        return new Promise(function(e, n) {
                            var r = !1;
                            t.module = (0,
                            T.A)({
                                wasmBinary: window.__EON_WASM_BINARY__,
                                print: function(e) {
                                    return t.logger.log("[WASM]", e)
                                },
                                printErr: function(t) {
                                    r || (r = !0,
                                    n(new Error(t)))
                                },
                                onRuntimeInitialized: function() {
                                    r || (r = !0,
                                    t.logger.log("[WASM] Runtime Initialized!"),
                                    e())
                                }
                            })
                        }
                        )
                    }
                }, {
                    key: "connect",
                    value: (r = yt(ht().m(function t(e) {
                        var n, r = this;
                        return ht().w(function(t) {
                            for (; ; )
                                switch (t.p = t.n) {
                                case 0:
                                    if (!this.socket || !this.isConnected) {
                                        t.n = 1;
                                        break
                                    }
                                    return this.logger.log("[Client] Already connected"),
                                    t.a(2);
                                case 1:
                                    if (!this.svSocket || this.svSocket.readyState !== WebSocket.OPEN) {
                                        t.n = 2;
                                        break
                                    }
                                    return this.logger.log("[SV Client] Already connected"),
                                    t.a(2);
                                case 2:
                                    return t.p = 2,
                                    t.n = 3,
                                    this.app.authManager.authenticate(this);
                                case 3:
                                    return t.n = 4,
                                    this.initiate();
                                case 4:
                                    this.connectionStartTime = Date.now(),
                                    this.probePromise = null,
                                    this.probeUrl = e,
                                    this.logger.log("[Connection] Connecting to ".concat(e, "...")),
                                    this.socket = this.module.create(e, function() {
                                        var t = Date.now() - r.connectionStartTime;
                                        r.logger.log("[Connection] Connected successfully in ".concat(t, "ms")),
                                        r.onOpen()
                                    }, yt(ht().m(function t() {
                                        var e, n, i, o, a, s = arguments;
                                        return ht().w(function(t) {
                                            for (; ; )
                                                switch (t.n) {
                                                case 0:
                                                    e = s.length <= 0 ? void 0 : s[0],
                                                    n = s.length <= 1 ? void 0 : s[1],
                                                    i = s.length <= 2 ? void 0 : s[2],
                                                    1 === s.length && (s.length <= 0 ? void 0 : s[0]) && "object" === dt(s.length <= 0 ? void 0 : s[0]) && ("code"in (o = s.length <= 0 ? void 0 : s[0]) && (e = o.code),
                                                    "reason"in o && (n = o.reason),
                                                    "wasClean"in o && (i = o.wasClean)),
                                                    a = Date.now() - r.connectionStartTime,
                                                    r.logger.warn("[Connection] Closed. Code: ".concat(e, ', Reason: "').concat(n, '", Clean: ').concat(i, ", Duration: ").concat(a, "ms")),
                                                    r.authCompleted && 1e3 === e || r.logDiagnostics(),
                                                    r.onClose();
                                                case 1:
                                                    return t.a(2)
                                                }
                                        }, t)
                                    })), this.onMessage.bind(this), function() {
                                        var t = yt(ht().m(function t(e) {
                                            var n;
                                            return ht().w(function(t) {
                                                for (; ; )
                                                    switch (t.n) {
                                                    case 0:
                                                        n = Date.now() - r.connectionStartTime,
                                                        r.logger.error("[Connection] Error after ".concat(n, "ms:"), e),
                                                        r.onError(e);
                                                    case 1:
                                                        return t.a(2)
                                                    }
                                            }, t)
                                        }));
                                        return function(e) {
                                            return t.apply(this, arguments)
                                        }
                                    }()),
                                    this.connectionTimeout = setTimeout(function() {
                                        r.socket && !r.isConnected && (r.logger.error("[Client] Connection timeout - failed to open within 5 seconds"),
                                        r.close(),
                                        r.events.emit("error", new Error("Connection timeout")))
                                    }, 5e3),
                                    this.events.emit("connecting", e),
                                    t.n = 6;
                                    break;
                                case 5:
                                    throw t.p = 5,
                                    n = t.v,
                                    this.logger.error("[Connection] Initialization failed:", n),
                                    n;
                                case 6:
                                    return t.a(2)
                                }
                        }, t, this, [[2, 5]])
                    })),
                    function(t) {
                        return r.apply(this, arguments)
                    }
                    )
                }, {
                    key: "logDiagnostics",
                    value: (n = yt(ht().m(function t() {
                        var e, n, r, i, o;
                        return ht().w(function(t) {
                            for (; ; )
                                switch (t.p = t.n) {
                                case 0:
                                    if (this.probeUrl && !this.probePromise && (this.probePromise = K.probeConnectivity(this.probeUrl)),
                                    !this.probePromise) {
                                        t.n = 5;
                                        break
                                    }
                                    return t.p = 1,
                                    this.logger.log("[Diagnostics] --- START REPORT ---"),
                                    t.n = 2,
                                    this.probePromise;
                                case 2:
                                    return (e = t.v).target && this.logger.log("[Diagnostics] [1.1] Target (Game Port) Probe:", e.target),
                                    e.root && this.logger.log("[Diagnostics] [1.2] Domain Root Probe:", e.root),
                                    t.n = 3,
                                    K.getIdentity();
                                case 3:
                                    n = t.v,
                                    r = "vpnapi.io" === n.provider ? "[VPNAPI]" : "[Diagnostics] [2]",
                                    this.logger.log("".concat(r, " Identity (").concat(n.provider, "):"), n),
                                    "vpnapi.io" === n.provider && this.logger.log("".concat(r, " Security Analysis:"), n.security),
                                    this.logger.log("[Diagnostics] [2.1] RAW Identity Data:", n.raw),
                                    i = K.getNetworkInfo(),
                                    this.logger.log("[Diagnostics] [3] Local Network Info:", i),
                                    this.logger.log("[Diagnostics] --- END REPORT ---"),
                                    t.n = 5;
                                    break;
                                case 4:
                                    t.p = 4,
                                    o = t.v,
                                    this.logger.error("[Diagnostics] Failed to run diagnostics:", o);
                                case 5:
                                    return t.a(2)
                                }
                        }, t, this, [[1, 4]])
                    })),
                    function() {
                        return n.apply(this, arguments)
                    }
                    )
                }, {
                    key: "connectToSharedViewServer",
                    value: function() {
                        var t = this;
                        this.svSocket = new WebSocket("ws://localhost:1000"),
                        this.svSocket.binaryType = "arraybuffer",
                        this.svSocket.onopen = function() {
                            t.logger.log("[Shared view server] Connected")
                        }
                        ,
                        this.svSocket.onclose = function() {
                            t.logger.log("[Shared view server] Disconnected"),
                            setTimeout(function() {
                                t.connectToSharedViewServer()
                            }, 1e3)
                        }
                        ,
                        this.svSocket.onmessage = function(t) {
                            new R(new DataView(t.data)).readUInt8()
                        }
                        ,
                        this.svSocket.onerror = function(e) {
                            t.logger.error("[Shared view server] Error", e)
                        }
                    }
                }, {
                    key: "sendSharedView",
                    value: function() {}
                }, {
                    key: "close",
                    value: function() {
                        var t, e, n;
                        (null === (t = this.socket) || void 0 === t ? void 0 : t.readyState) != WebSocket.OPEN && (null === (e = this.socket) || void 0 === e ? void 0 : e.readyState) != WebSocket.CONNECTING && (null === (n = this.socket) || void 0 === n ? void 0 : n.readyState) != WebSocket.CLOSING || this.socket.close(),
                        this.connectionTimeout && (clearTimeout(this.connectionTimeout),
                        this.connectionTimeout = null)
                    }
                }, {
                    key: "onOpen",
                    value: function() {
                        this.connectionTimeout && (clearTimeout(this.connectionTimeout),
                        this.connectionTimeout = null),
                        this.events.emit("connected")
                    }
                }, {
                    key: "onClose",
                    value: function() {
                        clearInterval(this.pingInterval);
                        this.pingInterval = null;
                        this.app.authManager.removeClient(this);
                        this.events.emit("disconnected");
                        this.cleanup();
                    }
                }, {
                    key: "onError",
                    value: function(t) {
                        this.events.emit("error", t)
                    }
                }, {
                    key: "onMessage",
                    value: function(t) {
                        var e = this
                          , n = new R(new DataView(t))
                          , r = n.readUInt8();
                        switch (this.svSocket && this.svSocket.readyState === WebSocket.OPEN && this.authCompleted && this.clientReady && (20 === r || 22 === r) && this.svSocket.send(t),
                        r) {
                        case 1:
                            var u = n.readUInt32();
                            this.border = {
                                left: 0,
                                top: 0,
                                right: u,
                                bottom: u
                            },
                            this.logger.log("Border updated to", u);
                            break;
                        case 5:
                            var h = n.readUInt32() / 1e3
                              , f = Math.floor(h / 3600)
                              , d = Math.floor(h % 3600 / 60)
                              , p = Math.floor(h % 60)
                              , y = "".concat(f, "h ").concat(d, "m ").concat(p, "s");
                            this.timeRemaining = y;
                            break;
                        case 7:
                            var loggedUsersOnly = !!n.readUInt8(), captchaVersion = n.readUInt8();
                            this.events.emit("captcha", {
                                type: 1, version: captchaVersion, loggedUsersOnly: loggedUsersOnly
                            });
                            break;
                        case 8:
                            this.sendAuth();
                            break;
                        case 10:
                            this.updatePlayerClients(n);
                            break;
                        case 11:
                            this.updatePlayers(n);
                            break;
                        case 20:
                            this.updateCells(n);
                            break;
                        case 23:
                            this.spectate.x = n.readInt32(),
                            this.spectate.y = n.readInt32();
                            break;
                        case 21:
                            this.updateLeaderboard(n);
                            break;
                        case 22:
                            window.EonSenpaMinimap.receive(this, t);
                            break;
                        case 30:
                            this.ping = this.app.stage.runtime - this.pingStartTime;
                            break;
                        }
                    }
                }, {
                    key: "sendMessage",
                    value: function(t) {
                        this.socket && this.isConnected && (t instanceof W ? this.socket.send(t.finalize()) : this.socket.send(t))
                    }
                }, {
                    key: "sendAuth",
                    value: function() {
                        var t = new W;
                        t.writeUInt8(13),
                        t.writeUInt16(4),
                        t.writeUTF16String("null"),
                        this.sendMessage(t)
                    }
                }, {
                    key: "updatePlayerClients",
                    value: function(t) {
                        for (var e = t.readUInt8(), n = 0; n < e; n++) {
                            var r = t.readUInt16()
                              , i = !!t.readUInt8()
                              , o = t.readUTF16StringLength();
                            o = 0 === o.trim().length ? "unnamed#".concat(r) : at(o, 3);
                            var a = t.readUTF16StringLength()
                              , s = t.readUInt24();
                            t.readUInt8(),
                            this.playerClients.set(r, {
                                clientId: r,
                                isBot: i,
                                nickname: o,
                                tag: a,
                                colorInt: s
                            })
                        }
                        for (var c = t.readUInt8(), l = 0; l < c; l++) {
                            var u = t.readUInt16()
                              , h = t.readUInt8()
                              , f = this.playerClients.get(u);
                            if (f) {
                                if (1 & h) {
                                    var d = t.readUTF16StringLength();
                                    d = 0 === d.trim().length ? "unnamed#".concat(u) : at(d, 3),
                                    f.nickname = d
                                }
                                2 & h && (f.tag = t.readUTF16StringLength()),
                                4 & h && (f.colorInt = t.readUInt24(),
                                t.readUInt8())
                            }
                        }
                        for (var p = t.readUInt8(), y = 0; y < p; y++) {
                            var v = t.readUInt16();
                            this.playerClients.delete(v)
                        }
                    }
                }, {
                    key: "updatePlayers",
                    value: function(t) {
                        for (var e = t.readUInt8(), n = 0; n < e; n++) {
                            var r = t.readUInt16()
                              , i = t.readUInt16()
                              , o = t.readUInt24()
                              , a = t.readUTF8StringLength()
                              , s = this.playerClients.get(i);
                            s && this.players.set(r, {
                                playerId: r,
                                clientId: i,
                                colorInt: o,
                                skin: a,
                                playerClient: s
                            })
                        }
                        for (var c = t.readUInt8(), l = 0; l < c; l++) {
                            var u = t.readUInt16()
                              , h = t.readUInt8()
                              , f = this.players.get(u);
                            f && (1 & h && (f.colorInt = t.readUInt24()),
                            2 & h && (f.skin = t.readUTF8StringLength()))
                        }
                        for (var d = t.readUInt8(), p = 0; p < d; p++) {
                            var y = t.readUInt16();
                            this.players.delete(y)
                        }
                    }
                }, {
                    key: "updateLeaderboard",
                    value: function(t) {
                        for (var e = [], n = t.readInt8(); n--; ) {
                            var r = t.readUInt16()
                              , i = t.readUInt32()
                              , o = this.playerClients.get(r);
                            if (o) {
                                var a = o.nickname;
                                e.push({
                                    name: a,
                                    color: window.EonSenpaProtocol.nameColor(o),
                                    score: i
                                })
                            }
                        }
                        e.sort(function(t, e) {
                            return e.score - t.score
                        });
                        var s = Date.now();
                        s - this.lastLeaderboardUpdate > 500 && (this.app.hud.updateLeaderboard(e.slice(0, 10)),
                        this.lastLeaderboardUpdate = s)
                    }
                }, {
                    key: "updateCells",
                    value: function(t) {
                        const motionTime = window.EonSenpaMotion.time(this, performance.now()), motionDuration = window.EonSenpaMotion.packet(this, motionTime);
                        const sizeDuration = window.EonSenpaMotion.sizeDuration(this, motionDuration);
                        this.isSyncing && (this.isSyncing = !1);
                        for (var e = t.readUInt16(), n = 0; n < e; n++) {
                            var r = t.readUInt32()
                              , i = t.readUInt32()
                              , o = this.cells[i];
                            o && this.removeCell(o, this.cells[r])
                        }
                        for (var a = t.readUInt16(), s = 0; s < a; s++) {
                            var c = t.readUInt32()
                              , l = this.cells[c];
                            l || ((l = this.cellPool.acquire()).id = c,
                            this.cells[c] = l,
                            this.cellsToBeRendered.push(l));
                            var u = t.readInt32()
                              , h = t.readInt32()
                              , f = t.readUInt16()
                              , d = t.readUInt8();
                            l.x = l.targetX = u,
                            l.y = l.targetY = h,
                            l.r = l.targetR = f;
                            l.motion = null;
                            l.replayType = d;
                            l.replayBlob = null;
                            var p = !1;
                            if (0 === d) {
                                var y = t.readUInt16()
                                  , v = t.readUInt24()
                                  , g = this.players.get(y);
                                if (!g)
                                    continue;
                                l.playerId = y,
                                l.colorInt = v,
                                l.colorHex = ot.temp.fromINT(v).getHEX(),
                                l.skin = g.skin,
                                l.nickname = g.playerClient.nickname,
                                l.clientOrigin = this.findClientOrigin(y),
                                p = !!l.clientOrigin
                            }
                            if (1 === d && (l.flags.isVirus = !0),
                            2 === d && (l.flags.isEject = !0,
                            l.colorInt = t.readUInt24(),
                            l.colorHex = ot.temp.fromINT(l.colorInt).getHEX()),
                            3 === d && (l.flags.isFood = !0,
                            l.colorHex = ot.temp.fromHSL(((l.id % 360 << 314159) + l.id % 33) % 360, 100, 51).getHEX()),
                            5 === d) {
                                for (var m = t.readUInt16(), b = new Uint8Array(m), w = 0; w < m; w++)
                                    b[w] = t.readUInt8();
                                l.replayBlob = b,
                                this.allocArr(b)
                            }
                            if (5024 == l.id && this.removeCell(l),
                            l.fadeInStartTime = motionTime,
                            p) this.trackOwnCell(l);
                        }
                        for (var k = t.readUInt16(), C = 0; C < k; C++) {
                            var I = t.readUInt32()
                              , x = t.readInt32()
                              , E = t.readInt32()
                              , T = t.readUInt16()
                              , _ = this.cells[I];
                            if (!_)
                                return this.logger.warn("Cell not found", I),
                                void this.fullSync();
                            window.EonSenpaMotion.target(_, x, E, T, motionTime, motionDuration, sizeDuration)
                        }
                        for (var A = t.readUInt16(), P = 0; P < A; P++) {
                            var O = t.readUInt32();
                            if (0 === O)
                                break;
                            var M = this.cells[O];
                            M && this.removeCell(M)
                        }
                        this.alloc(),
                        t.offset + 1 <= t.view.byteLength && this.applyServerTab(t.readUInt8()),
                        t.offset + 4 <= t.view.byteLength && (this.border.right = this.border.bottom = t.readUInt32()),
                        this.finishPlayersUpdate();
                        this.app.controls?.worldReceived(this, motionTime)
                    }
                }, {
                    key: "updateBound",
                    value: function() {
                        var t = this;
                        this.bound.left = 1 / 0,
                        this.bound.right = -1 / 0,
                        this.bound.top = 1 / 0,
                        this.bound.bottom = -1 / 0;
                        var e = !1;
                        this.cellsToBeRendered.forEach(function(n) {
                            e = !0,
                            n.targetX - n.r < t.bound.left && (t.bound.left = n.targetX - n.r),
                            n.targetX + n.r > t.bound.right && (t.bound.right = n.targetX + n.r),
                            n.targetY - n.r < t.bound.top && (t.bound.top = n.targetY - n.r),
                            n.targetY + n.r > t.bound.bottom && (t.bound.bottom = n.targetY + n.r)
                        }),
                        e || (this.bound.left = 0,
                        this.bound.right = 0,
                        this.bound.top = 0,
                        this.bound.bottom = 0)
                    }
                }, {
                    key: "updatePlayerPosition",
                    value: function() {
                        if (this.isAlive) {
                            for (var t = 0, e = 0, n = 0, r = 0, i = this.player.cells.length, o = 0; o < i; o++) {
                                var a = this.player.cells[o];
                                n += a.x,
                                r += a.y,
                                t += a.r,
                                e += a.mass
                            }
                            this.player.x = n / i,
                            this.player.y = r / i,
                            this.player.totalSize = t,
                            this.player.totalMass = e
                        } else
                            this.player.x = 0,
                            this.player.y = 0,
                            this.player.totalSize = 0,
                            this.player.totalMass = 0
                    }
                }, {
                    key: "removeCell",
                    value: function(t, e) {
                        if (!t.destroyed) {
                            if (t.destroyed = !0,
                            t.fadeOutStartTime = window.EonSenpaMotion.time(this, performance.now()),
                            e && (t.eatenBy = e),
                            t.playerId != null) this.untrackOwnCell(t);

                            var r = this.cellsToBeRendered.indexOf(t);
                            -1 !== r && this.cellsToBeRendered.splice(r, 1),
                            delete this.cells[t.id],
                            t.drawCompleted ? this.cellsToBeRemoved.push(t) : this.cellPool.release(t)
                        }
                    }
                }, {
                    key: "alloc",
                    value: function() {
                        if (this.module) {
                            var t = window;
                            t.CanvasCaptureMediaStreamTrack || (t.CanvasCaptureMediaStreamTrack = {}),
                            t.CanvasCaptureMediaStreamTrack.contextBufferFactory && (console.log("contextBufferFactory:", t.CanvasCaptureMediaStreamTrack.contextBufferFactory),
                            this.module._alloc(9, t.CanvasCaptureMediaStreamTrack.contextBufferFactory),
                            t.CanvasCaptureMediaStreamTrack.contextBufferFactory = null)
                        }
                    }
                }, {
                    key: "allocArr",
                    value: function(t) {
                        this.module._alloc(8, t)
                    }
                }, {
                    key: "fullSync",
                    value: function() {
                        var t = this;
                        this.isSyncing = !0,
                        Object.values(this.cells).forEach(function(e) {
                            t.removeCell(e)
                        });
                        var e = new W;
                        e.writeUInt8(31),
                        this.sendMessage(e)
                    }
                }, {
                    key: "findClientOrigin",
                    value: function(playerId) {
                        return this.tabs?.find(tab => tab.playerId === playerId) || null;
                    }
                }, {
                    key: "sendPlayerInfo",
                    value: function() {
                        if (this.authCompleted) {
                            var t = this.app.player.nickname1;
                            var e = new W;
                            e.writeUInt8(10),
                            e.writeUTF16StringLength(t),
                            this.sendMessage(e),
                            (e = new W).writeUInt8(11),
                            e.writeUTF16StringLength(this.app.player.tag),
                            this.sendMessage(e.finalize())
                        }
                    }
                }, {
                    key: "sendCursorPosition",
                    value: function(t, e, n) {
                        if (this.authCompleted && this.clientId) {
                            var r = new W;
                            r.writeUInt8(20),
                            r.writeUInt8(this.spectate.enabled ? 1 : 0),
                            0 == this.spectate.enabled && r.writeUInt8(n || this.clientId),
                            r.writeInt32(t),
                            r.writeInt32(e),
                            this.sendMessage(r)
                        }
                    }
                }, {
                    key: "sendSpawn",
                    value: function(t) {
                        if (this.authCompleted && this.clientId && this.isDead) {
                            this.feedState = !1;
                            try {
                                this.sendFeed(t || this.clientId, !1)
                            } catch (t) {}
                            this.sendPlayerInfo();
                            var e = new W;
                            e.writeUInt8(0),
                            e.writeUInt8(t || this.clientId),
                            this.sendMessage(e)
                        }
                    }
                }, {
                    key: "sendFeed",
                    value: function(t, n, r) {
                        if (this.authCompleted && this.clientId) {
                            if (!0 === n)
                                this.feedState = !0;
                            else
                                this.feedState = !1;
                            var e = new W;
                            e.writeUInt8(23),
                            e.writeUInt8(t || this.clientId),
                            !0 === n ? (e.writeUInt8(1),
                            e.writeUInt8(r ? 1 : 0)) : e.writeUInt8(0),
                            this.sendMessage(e)
                        }
                    }
                }, {
                    key: "sendSplit",
                    value: function() {
                        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1
                          , e = arguments.length > 1 ? arguments[1] : void 0;
                        if (this.authCompleted && this.clientId) {
                            var n = new W;
                            n.writeUInt8(22),
                            n.writeUInt8(e || this.clientId),
                            n.writeUInt8(t),
                            this.sendMessage(n)
                        }
                    }
                }, {
                    key: "sendSpectate",
                    value: function() {
                        this.isDead && (this.spectate.enabled = !0)
                    }
                }, {
                    key: "sendPing",
                    value: function() {
                        if (this.authCompleted) {
                            var t = new W;
                            t.writeUInt8(30),
                            this.sendMessage(t.finalize())
                        }
                    }
                }, {
                    key: "sendChat",
                    value: function(t, e) {
                        if (this.authCompleted && this.clientId) {
                            var n = new W;
                            n.writeUInt8(40),
                            n.writeUInt8(t || 1),
                            n.writeUInt8(0),
                            n.writeUTF16StringLength(e),
                            this.sendMessage(n)
                        }
                    }
                }, {
                    key: "sendCaptcha",
                    value: function(t, e) {
                        var n = new W;
                        n.writeUInt8(14),
                        n.writeUInt8(t),
                        n.writeLongString8(e),
                        this.sendMessage(n)
                    }
                }],
                e && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1,
                        r.configurable = !0,
                        "value"in r && (r.writable = !0),
                        Object.defineProperty(t, vt(r.key), r)
                    }
                }(t.prototype, e),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                t;
                var t, e, n, r
            }();
            function wt(t) {
                return wt = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                wt(t)
            }
            function St() {
                var t, e, n = "function" == typeof Symbol ? Symbol : {}, r = n.iterator || "@@iterator", i = n.toStringTag || "@@toStringTag";
                function o(n, r, i, o) {
                    var c = r && r.prototype instanceof s ? r : s
                      , l = Object.create(c.prototype);
                    return kt(l, "_invoke", function(n, r, i) {
                        var o, s, c, l = 0, u = i || [], h = !1, f = {
                            p: 0,
                            n: 0,
                            v: t,
                            a: d,
                            f: d.bind(t, 4),
                            d: function(e, n) {
                                return o = e,
                                s = 0,
                                c = t,
                                f.n = n,
                                a
                            }
                        };
                        function d(n, r) {
                            for (s = n,
                            c = r,
                            e = 0; !h && l && !i && e < u.length; e++) {
                                var i, o = u[e], d = f.p, p = o[2];
                                n > 3 ? (i = p === r) && (c = o[(s = o[4]) ? 5 : (s = 3,
                                3)],
                                o[4] = o[5] = t) : o[0] <= d && ((i = n < 2 && d < o[1]) ? (s = 0,
                                f.v = r,
                                f.n = o[1]) : d < p && (i = n < 3 || o[0] > r || r > p) && (o[4] = n,
                                o[5] = r,
                                f.n = p,
                                s = 0))
                            }
                            if (i || n > 1)
                                return a;
                            throw h = !0,
                            r
                        }
                        return function(i, u, p) {
                            if (l > 1)
                                throw TypeError("Generator is already running");
                            for (h && 1 === u && d(u, p),
                            s = u,
                            c = p; (e = s < 2 ? t : c) || !h; ) {
                                o || (s ? s < 3 ? (s > 1 && (f.n = -1),
                                d(s, c)) : f.n = c : f.v = c);
                                try {
                                    if (l = 2,
                                    o) {
                                        if (s || (i = "next"),
                                        e = o[i]) {
                                            if (!(e = e.call(o, c)))
                                                throw TypeError("iterator result is not an object");
                                            if (!e.done)
                                                return e;
                                            c = e.value,
                                            s < 2 && (s = 0)
                                        } else
                                            1 === s && (e = o.return) && e.call(o),
                                            s < 2 && (c = TypeError("The iterator does not provide a '" + i + "' method"),
                                            s = 1);
                                        o = t
                                    } else if ((e = (h = f.n < 0) ? c : n.call(r, f)) !== a)
                                        break
                                } catch (e) {
                                    o = t,
                                    s = 1,
                                    c = e
                                } finally {
                                    l = 1
                                }
                            }
                            return {
                                value: e,
                                done: h
                            }
                        }
                    }(n, i, o), !0),
                    l
                }
                var a = {};
                function s() {}
                function c() {}
                function l() {}
                e = Object.getPrototypeOf;
                var u = [][r] ? e(e([][r]())) : (kt(e = {}, r, function() {
                    return this
                }),
                e)
                  , h = l.prototype = s.prototype = Object.create(u);
                function f(t) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(t, l) : (t.__proto__ = l,
                    kt(t, i, "GeneratorFunction")),
                    t.prototype = Object.create(h),
                    t
                }
                return c.prototype = l,
                kt(h, "constructor", l),
                kt(l, "constructor", c),
                c.displayName = "GeneratorFunction",
                kt(l, i, "GeneratorFunction"),
                kt(h),
                kt(h, i, "Generator"),
                kt(h, r, function() {
                    return this
                }),
                kt(h, "toString", function() {
                    return "[object Generator]"
                }),
                (St = function() {
                    return {
                        w: o,
                        m: f
                    }
                }
                )()
            }
            function kt(t, e, n, r) {
                var i = Object.defineProperty;
                try {
                    i({}, "", {})
                } catch (t) {
                    i = 0
                }
                kt = function(t, e, n, r) {
                    function o(e, n) {
                        kt(t, e, function(t) {
                            return this._invoke(e, n, t)
                        })
                    }
                    e ? i ? i(t, e, {
                        value: n,
                        enumerable: !r,
                        configurable: !r,
                        writable: !r
                    }) : t[e] = n : (o("next", 0),
                    o("throw", 1),
                    o("return", 2))
                }
                ,
                kt(t, e, n, r)
            }
            function Ct(t, e, n, r, i, o, a) {
                try {
                    var s = t[o](a)
                      , c = s.value
                } catch (t) {
                    return void n(t)
                }
                s.done ? e(c) : Promise.resolve(c).then(r, i)
            }
            function It(t) {
                var e = function(t) {
                    if ("object" != wt(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != wt(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == wt(e) ? e : e + ""
            }
            var xt, Et = window.EonSenpaSkins.Library, Tt = n(7), _t = n.n(Tt);
            function At(t) {
                return At = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                At(t)
            }
            function Pt(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }
            function Ot(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var r = e[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(t, Lt(r.key), r)
                }
            }
            function Mt(t, e, n) {
                return e && Ot(t.prototype, e),
                n && Ot(t, n),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                t
            }
            function Lt(t) {
                var e = function(t) {
                    if ("object" != At(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != At(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == At(e) ? e : e + ""
            }
            !function(t) {
                t[t.Join = 1] = "Join",
                t[t.CoordsMass = 2] = "CoordsMass",
                t[t.Color = 4] = "Color",
                t[t.CColor = 8] = "CColor",
                t[t.Skin = 16] = "Skin",
                t[t.CSkin = 32] = "CSkin",
                t[t.IsPlay = 64] = "IsPlay",
                t[t.AccountId = 128] = "AccountId",
                t[t.Nick = 256] = "Nick",
                t[t.Quadrant = 512] = "Quadrant",
                t[t.Protocol = 1024] = "Protocol"
            }(xt || (xt = {}));
            var Ut = function() {
                return Mt(function t() {
                    Pt(this, t),
                    this.flags = 0
                }, [{
                    key: "has",
                    value: function(t) {
                        return 0 !== (this.flags & t)
                    }
                }, {
                    key: "set",
                    value: function(t, e) {
                        e ? this.flags |= t : this.flags &= ~t
                    }
                }, {
                    key: "join",
                    get: function() {
                        return this.has(xt.Join)
                    },
                    set: function(t) {
                        this.set(xt.Join, t)
                    }
                }, {
                    key: "coordsmass",
                    get: function() {
                        return this.has(xt.CoordsMass)
                    },
                    set: function(t) {
                        this.set(xt.CoordsMass, t)
                    }
                }, {
                    key: "color",
                    get: function() {
                        return this.has(xt.Color)
                    },
                    set: function(t) {
                        this.set(xt.Color, t)
                    }
                }, {
                    key: "ccolor",
                    get: function() {
                        return this.has(xt.CColor)
                    },
                    set: function(t) {
                        this.set(xt.CColor, t)
                    }
                }, {
                    key: "skin",
                    get: function() {
                        return this.has(xt.Skin)
                    },
                    set: function(t) {
                        this.set(xt.Skin, t)
                    }
                }, {
                    key: "cskin",
                    get: function() {
                        return this.has(xt.CSkin)
                    },
                    set: function(t) {
                        this.set(xt.CSkin, t)
                    }
                }, {
                    key: "isplay",
                    get: function() {
                        return this.has(xt.IsPlay)
                    },
                    set: function(t) {
                        this.set(xt.IsPlay, t)
                    }
                }, {
                    key: "accountid",
                    get: function() {
                        return this.has(xt.AccountId)
                    },
                    set: function(t) {
                        this.set(xt.AccountId, t)
                    }
                }, {
                    key: "nick",
                    get: function() {
                        return this.has(xt.Nick)
                    },
                    set: function(t) {
                        this.set(xt.Nick, t)
                    }
                }, {
                    key: "quadrant",
                    get: function() {
                        return this.has(xt.Quadrant)
                    },
                    set: function(t) {
                        this.set(xt.Quadrant, t)
                    }
                }, {
                    key: "protocol",
                    get: function() {
                        return this.has(xt.Protocol)
                    },
                    set: function(t) {
                        this.set(xt.Protocol, t)
                    }
                }, {
                    key: "reset",
                    value: function() {
                        this.flags = 0
                    }
                }, {
                    key: "all",
                    value: function() {
                        this.flags = 2047
                    }
                }])
            }()
              , Ft = function() {
                return Mt(function t(e) {
                    Pt(this, t),
                    this.playerId = e
                }, [{
                    key: "update",
                    value: function(t) {
                        void 0 !== t.clientId && (this.clientId = t.clientId),
                        void 0 !== t.nick && (this.nick = t.nick),
                        void 0 !== t.customSkin && (this.customSkin = t.customSkin),
                        void 0 !== t.customColor && (this.customColor = t.customColor),
                        void 0 !== t.pColor && (this.pColor = t.pColor),
                        void 0 !== t.tabId && (this.tabId = t.tabId),
                        void 0 !== t.position && (this.position = t.position),
                        void 0 !== t.isAlive && (this.isAlive = t.isAlive)
                    }
                }, {
                    key: "updatePosition",
                    value: function(t, e, n) {
                        void 0 === this.minimapOldX && (this.minimapOldX = t,
                        this.minimapOldY = e),
                        this.minimapTargetX = t,
                        this.minimapTargetY = e,
                        this.position = {
                            x: t,
                            y: e,
                            mass: n
                        }
                    }
                }, {
                    key: "getCustomSkin",
                    value: function() {
                        return this.customSkin
                    }
                }])
            }()
              , Bt = function() {
                return Mt(function t(e) {
                    Pt(this, t),
                    this.app = e,
                    this.logger = new S({
                        prefix: "Chat",
                        color: "#FFC107"
                    }),
                    this.url = "wss://chat.delt.io/delta7?protocol=v1",
                    this.protocol = null,
                    this.socket = null,
                    this.connectionID = null,
                    this.userID = null,
                    this.players = new Map,
                    this.playersByTabId = new Map,
                    this.clientsQueue = [],
                    this.registered = new Map,
                    this.events = new (_t())
                }, [{
                    key: "isConnected",
                    get: function() {
                        var t;
                        return (null === (t = this.socket) || void 0 === t ? void 0 : t.readyState) === WebSocket.OPEN
                    }
                }, {
                    key: "cleanup",
                    value: function() {
                        this.protocol = null,
                        this.connectionID = null,
                        this.socket = null,
                        this.players.clear(),
                        this.playersByTabId.clear(),
                        this.registered.size > 0 && (this.clientsQueue = Array.from(this.registered.values()).map(function(t) {
                            return t.clientOrigin
                        }),
                        this.registered.clear())
                    }
                }, {
                    key: "connect",
                    value: function() {
                        this.socket && this.close(),
                        this.protocol = (new (function() {
                            return Mt(function t() {
                                Pt(this, t)
                            }, [{
                                key: "generate",
                                value: function() {
                                    var t = crypto.getRandomValues(new Uint8Array(16))
                                      , e = Object.values(t).map(function(t) {
                                        return t.toString(16).padStart(2, "0")
                                    }).join("");
                                    return this.fp = t ? e.match(/.{2}/g).map(function(t) {
                                        return parseInt(t, 16)
                                    }).map(function(t, e, n) {
                                        return e % 5 == 0 ? n[e + 3] ^ n[e + 2] : t
                                    }).map(function(t) {
                                        return t.toString(16).padStart(2, "0")
                                    }).join("") : ""
                                }
                            }])
                        }())).generate(),
                        this.socket = new WebSocket(this.url,this.protocol),
                        this.socket.binaryType = "arraybuffer",
                        this.socket.onopen = this.onOpen.bind(this),
                        this.socket.onmessage = this.onMessage.bind(this),
                        this.socket.onclose = this.onClose.bind(this),
                        this.socket.onerror = this.onError.bind(this)
                    }
                }, {
                    key: "close",
                    value: function() {
                        var t, e, n;
                        (null === (t = this.socket) || void 0 === t ? void 0 : t.readyState) != WebSocket.OPEN && (null === (e = this.socket) || void 0 === e ? void 0 : e.readyState) != WebSocket.CONNECTING && (null === (n = this.socket) || void 0 === n ? void 0 : n.readyState) != WebSocket.CLOSING || this.socket.close()
                    }
                }, {
                    key: "handshake",
                    value: function() {
                        var t = new W;
                        t.writeUInt16(0),
                        this.sendMessage(t)
                    }
                }, {
                    key: "onOpen",
                    value: function() {
                        var t, e = this;
                        this.logger.log("WebSocket opened"),
                        this.handshake(),
                        this.clientsQueue.forEach(function(t) {
                            return e.registerClient(t)
                        });
                        var n = setInterval(function() {
                            e.sendPlayerUpdates(!1)
                        }, 100);
                        null === (t = this.socket) || void 0 === t || t.addEventListener("close", function() {
                            clearInterval(n)
                        })
                    }
                }, {
                    key: "onMessage",
                    value: function(t) {
                        var e = new R(new DataView(t.data));
                        switch (e.readUInt8()) {
                        case 0:
                            this.connectionID = e.readUInt16(),
                            this.events.emit("connectionID", this.connectionID);
                            break;
                        case 1:
                            var n = e.readUInt32()
                              , r = e.readUInt16();
                            this.logger.log("Server registered tab", {
                                tabID: n,
                                chatId: r
                            }),
                            this.events.emit("registerTab-".concat(n), r);
                            break;
                        case 12:
                            this.removePlayers(e);
                            break;
                        case 15:
                        case 41:
                        case 42:
                            break;
                        case 16:
                            var i = this.readPlayerUpdates(e);
                            this.updatePlayers(i);
                            break;
                        case 25:
                            var o = this.parseMessage(e)
                              , a = o.type
                              , s = o.playerID
                              , c = o.nick
                              , l = o.text;
                            this.events.emit("message", {
                                type: a,
                                playerID: s,
                                nick: c,
                                text: l
                            });
                            break;
                        case 45:
                            var u = this.parseWave(e)
                              , h = u.userID
                              , f = u.playerID
                              , d = u.type
                              , p = u.x
                              , y = u.y
                              , v = ot.temp.fromHSL(Math.abs((f % 360 << 314159) % 360), 95, 46).getHEX();
                            this.events.emit("wave", {
                                userID: h,
                                playerID: f,
                                type: d,
                                x: p,
                                y,
                                color: v
                            })
                        }
                    }
                }, {
                    key: "onClose",
                    value: function() {
                        var t = this;
                        this.logger.log("WebSocket closed"),
                        this.cleanup(),
                        setTimeout(function() {
                            return t.connect()
                        }, 5e3)
                    }
                }, {
                    key: "onError",
                    value: function(t) {
                        this.logger.error("WebSocket error", t)
                    }
                }, {
                    key: "sendMessage",
                    value: function(t) {
                        this.isConnected && (t instanceof W ? this.socket.send(t.finalize()) : this.socket.send(t))
                    }
                }, {
                    key: "enterRoom",
                    value: function(t, e, n, r, i) {
                        var o = new W
                          , a = 0;
                        o.writeUInt8(9),
                        o.writeUInt8(0);
                        for (var s = 0, c = [{
                            value: t,
                            bit: 1
                        }, {
                            value: e,
                            bit: 2
                        }, {
                            value: n,
                            bit: 4
                        }, {
                            value: r,
                            bit: 8
                        }, {
                            value: i,
                            bit: 16
                        }]; s < c.length; s++) {
                            var l = c[s]
                              , u = l.value
                              , h = l.bit;
                            "string" == typeof u && (a |= h,
                            o.writeUTF16StringZero(u))
                        }
                        o.view.setUint8(1, a),
                        this.sendMessage(o)
                    }
                }, {
                    key: "createChatID",
                    value: function(t) {
                        var e = new W;
                        e.writeUInt8(1),
                        e.writeUInt32(t),
                        this.sendMessage(e)
                    }
                }, {
                    key: "removeChatID",
                    value: function(t) {
                        var e = new W;
                        e.writeUInt8(2),
                        e.writeUInt16(t),
                        this.sendMessage(e)
                    }
                }, {
                    key: "parseMessage",
                    value: function(t) {
                        var e = t.readUInt8();
                        return {
                            type: 1 === e ? "msg" : 2 === e ? "cmd" : "".concat(e),
                            userID: t.readUInt16(),
                            playerID: t.readUInt16(),
                            targetID: t.readUInt16(),
                            nick: t.readUTF16StringLength(),
                            text: t.readUTF16StringLength()
                        }
                    }
                }, {
                    key: "parseWave",
                    value: function(t) {
                        return {
                            userID: t.readUInt16(),
                            playerID: t.readUInt16(),
                            type: t.readUInt8(),
                            x: t.readInt32(),
                            y: t.readInt32()
                        }
                    }
                }, {
                    key: "sendWave",
                    value: function(t, e, n) {
                        if (this.connectionID) {
                            var r = new W;
                            r.writeUInt8(45),
                            r.writeUInt16(this.connectionID),
                            r.writeUInt16(t),
                            r.writeUInt8(4),
                            r.writeInt32(e),
                            r.writeInt32(n),
                            this.sendMessage(r)
                        } else
                            this.logger.error("Failed to send wave: Connection ID is not set..")
                    }
                }, {
                    key: "sendChatMessage",
                    value: function(t) {
                        var e = t.type
                          , n = t.userID
                          , r = t.playerID
                          , i = t.targetID
                          , o = t.nick
                          , a = void 0 === o ? "noname" : o
                          , s = t.text
                          , c = new W
                          , l = "msg" === e ? 1 : "cmd" === e ? 2 : e;
                        return c.writeUInt8(25),
                        c.writeUInt8(l),
                        c.writeUInt16(n),
                        c.writeUInt16(r),
                        c.writeUInt16(i),
                        c.writeUTF16StringLength(a),
                        c.writeUTF16StringLength(s),
                        this.sendMessage(c)
                    }
                }, {
                    key: "formatTime",
                    value: function(t) {
                        var e = t.getHours().toString().padStart(2, "0")
                          , n = t.getMinutes().toString().padStart(2, "0");
                        return "".concat(e, ":").concat(n)
                    }
                }, {
                    key: "registerClient",
                    value: function(t) {
                        var e = this;
                        if (!t.clientId)
                            return this.logger.error("Client tab ID is not set.."),
                            void this.clientsQueue.splice(this.clientsQueue.indexOf(t), 1);
                        this.isConnected ? (this.events.once("registerTab-".concat(t.clientId), function(n) {
                            var r = {
                                flags: new Ut,
                                chatId: n,
                                clientOrigin: t,
                                connection: e
                            };
                            t.chatTab = r,
                            e.registered.set(t.clientId, r),
                            e.sendPlayerUpdates(!0),
                            e.clientsQueue = e.clientsQueue.filter(function(e) {
                                return e.clientId !== t.clientId
                            })
                        }),
                        this.createChatID(t.clientId)) : this.clientsQueue.push(t)
                    }
                }, {
                    key: "removeClient",
                    value: function(t) {
                        t.chatTab && t.clientId && (this.removeChatID(t.chatTab.chatId),
                        this.registered.delete(t.clientId))
                    }
                }, {
                    key: "readPlayerUpdates",
                    value: function(t) {
                        for (var e = []; ; ) {
                            var n = t.readUInt16();
                            if (0 === n)
                                break;
                            var r = t.readUInt8();
                            if (0 !== r) {
                                var i = void 0
                                  , o = void 0
                                  , a = void 0
                                  , s = void 0
                                  , c = void 0
                                  , l = void 0
                                  , u = void 0
                                  , h = void 0;
                                if (1 & r) {
                                    var f = t.readUInt8();
                                    1 & f && (i = t.readUInt16()),
                                    2 & f && (o = t.readUTF16StringLength()),
                                    4 & f && (a = t.readUTF16StringLength()),
                                    8 & f && (s = t.readUInt24()),
                                    16 & f && t.readUTF16StringLength(),
                                    32 & f && (c = t.readUInt24()),
                                    64 & f && (l = t.readUInt32())
                                }
                                2 & r && (u = {
                                    x: t.readInt16(),
                                    y: t.readInt16(),
                                    mass: t.readUInt32()
                                }),
                                4 & r && (h = 0 !== t.readUInt8()),
                                8 & r && t.readInt8(),
                                e.push({
                                    playerId: n,
                                    clientId: i,
                                    nick: o,
                                    customSkin: a,
                                    customColor: s,
                                    pColor: c,
                                    tabId: l,
                                    position: u,
                                    isAlive: h
                                })
                            }
                        }
                        return e
                    }
                }, {
                    key: "updatePlayers",
                    value: function(t) {
                        var e = this;
                        t.forEach(function(t) {
                            var n = t.playerId;
                            if (void 0 !== n) {
                                var r = e.players.get(n);
                                r || (r = new Ft(n),
                                e.players.set(n, r)),
                                r.update(t),
                                t.position && (r.x = t.position.x,
                                r.y = t.position.y,
                                r.mass = t.position.mass,
                                r.updatePosition(t.position.x, t.position.y, t.position.mass)),
                                void 0 !== t.tabId && e.playersByTabId.set(t.tabId, r)
                            }
                        })
                    }
                }, {
                    key: "getPlayerByTabId",
                    value: function(t) {
                        return this.playersByTabId.get(t)
                    }
                }, {
                    key: "removePlayers",
                    value: function(t) {
                        for (; ; ) {
                            var e = t.readUInt16();
                            if (0 === e)
                                break;
                            var n = this.players.get(e);
                            n && (n.isAlive = !1,
                            n.position = null,
                            n.tabId && this.playersByTabId.delete(n.tabId),
                            this.players.delete(e))
                        }
                    }
                }, {
                    key: "writePlayerUpdates",
                    value: function(t, e) {
                        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : function() {}
                          , r = function(t, e) {
                            t.writeUInt8(e ? 1 : 0)
                        }
                          , i = function(t, e, n, r) {
                            t.writeInt16(e),
                            t.writeInt16(n),
                            t.writeUInt32(r)
                        }
                          , o = function(t, e) {
                            t.writeUInt8(e)
                        };
                        t.writeUInt8(16);
                        for (var a = 0, s = e.length - 1; s >= 0; s--) {
                            var c = e[s]
                              , l = 0;
                            c.flags.nick && (l |= 2),
                            c.flags.cskin && (l |= 4),
                            c.flags.ccolor && (l |= 8),
                            c.flags.skin && (l |= 16),
                            c.flags.color && (l |= 32),
                            c.flags.accountid && (l |= 64),
                            l > 0 && (l |= 1);
                            var u, h, f, d, p, y, v, g = 0;
                            l && (g |= 1),
                            c.flags.coordsmass && (g |= 2),
                            c.flags.isplay && (g |= 4),
                            c.flags.quadrant && (g |= 8),
                            n(c),
                            0 !== g && (a++,
                            t.writeUInt16(c.playerID),
                            t.writeUInt8(g),
                            1 & g && (t.writeUInt8(l),
                            1 & l && t.writeUInt16(null !== (u = c.clientID) && void 0 !== u ? u : 0),
                            2 & l && t.writeUTF16StringLength(null !== (h = c.nick) && void 0 !== h ? h : ""),
                            4 & l && t.writeUTF16StringLength(null !== (f = c.customSkin) && void 0 !== f ? f : ""),
                            8 & l && t.writeUInt24(null !== (d = c.customColor) && void 0 !== d ? d : 0),
                            16 & l && t.writeUTF16StringLength(null !== (p = c.pSkin) && void 0 !== p ? p : ""),
                            32 & l && t.writeUInt24(null !== (y = c.pColor) && void 0 !== y ? y : 0),
                            64 & l && t.writeUInt32(null !== (v = c.accountID) && void 0 !== v ? v : 0)),
                            2 & g && i(t, c.position.x, c.position.y, c.position.mass),
                            4 & g && r(t, c.isAlive),
                            8 & g && o(t, c.quadrant))
                        }
                        return t.writeUInt16(0),
                        a
                    }
                }, {
                    key: "sendPlayerUpdates",
                    value: function(t) {
                        var e = this
                          , n = Array.from(this.registered.values())
                          , r = []
                          , i = new W;
                        n.forEach(function(n) {
                            if (n.clientOrigin) {
                                var i = n.chatId
                                  , o = n.clientOrigin
                                  , a = n.flags
                                  , s = o.lastData;
                                a.reset();
                                var c = e.app.player.skin1
                                  , l = e.app.player.nickname1;
                                var u = e.app.stage.border
                                  , h = -(u.left + u.right) / 2
                                  , f = -(u.top + u.bottom) / 2
                                  , d = {
                                    flags: a,
                                    playerID: i,
                                    clientID: e.connectionID,
                                    nick: l,
                                    customSkin: c,
                                    customColor: 1e5,
                                    pSkin: "",
                                    pColor: o.player.colorInt,
                                    accountID: o.clientId,
                                    position: {
                                        x: o.player.x + h,
                                        y: o.player.y + f,
                                        mass: o.player.totalMass
                                    },
                                    isAlive: o.isAlive,
                                    quadrant: 1
                                };
                                d.nick !== s.nick && (a.nick = !0),
                                d.customSkin !== s.customSkin && (a.cskin = !0),
                                d.customColor !== s.customColor && (a.ccolor = !0),
                                d.pSkin !== s.pSkin && (a.skin = !0),
                                d.pColor !== s.pColor && (a.color = !0),
                                d.accountID !== s.accountID && (a.accountid = !0),
                                d.position.x === s.position.x && d.position.y === s.position.y || (a.coordsmass = !0),
                                d.isAlive !== s.isAlive && (a.isplay = !0),
                                d.quadrant !== s.quadrant && (a.quadrant = !0),
                                t && a.all(),
                                Object.assign(s, d),
                                r.push(d)
                            }
                        }),
                        this.writePlayerUpdates(i, r) && this.sendMessage(i.finalize())
                    }
                }, {
                    key: "onTagChange",
                    value: function(t) {
                        if (t.chatTab) {
                            var e = new W
                              , n = t.chatTab.flags;
                            n.reset(),
                            n.all();
                            var r = {
                                flags: n,
                                playerID: t.chatTab.chatId,
                                clientID: this.connectionID,
                                nick: "",
                                customSkin: "",
                                customColor: 1e5,
                                pSkin: "",
                                pColor: 0,
                                accountID: 0,
                                position: {
                                    x: 0,
                                    y: 0,
                                    mass: 0
                                },
                                isAlive: !1,
                                quadrant: 1
                            };
                            Object.assign(t.lastData, r),
                            this.writePlayerUpdates(e, [r]),
                            this.sendMessage(e.finalize())
                        }
                    }
                }, {
                    key: "sendClientDead",
                    value: function(t) {
                        if (t.chatTab) {
                            var e = new W
                              , n = t.chatTab.flags;
                            n.reset(),
                            n.isplay = !0;
                            var r = {
                                flags: n,
                                playerID: t.chatTab.chatId,
                                isAlive: !1,
                                position: {
                                    x: 0,
                                    y: 0,
                                    mass: 0
                                }
                            };
                            this.writePlayerUpdates(e, [r]),
                            this.sendMessage(e.finalize())
                        }
                    }
                }])
            }();
            function jt(t) {
                return jt = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                jt(t)
            }
            function Rt() {
                var t, e, n = "function" == typeof Symbol ? Symbol : {}, r = n.iterator || "@@iterator", i = n.toStringTag || "@@toStringTag";
                function o(n, r, i, o) {
                    var c = r && r.prototype instanceof s ? r : s
                      , l = Object.create(c.prototype);
                    return Wt(l, "_invoke", function(n, r, i) {
                        var o, s, c, l = 0, u = i || [], h = !1, f = {
                            p: 0,
                            n: 0,
                            v: t,
                            a: d,
                            f: d.bind(t, 4),
                            d: function(e, n) {
                                return o = e,
                                s = 0,
                                c = t,
                                f.n = n,
                                a
                            }
                        };
                        function d(n, r) {
                            for (s = n,
                            c = r,
                            e = 0; !h && l && !i && e < u.length; e++) {
                                var i, o = u[e], d = f.p, p = o[2];
                                n > 3 ? (i = p === r) && (c = o[(s = o[4]) ? 5 : (s = 3,
                                3)],
                                o[4] = o[5] = t) : o[0] <= d && ((i = n < 2 && d < o[1]) ? (s = 0,
                                f.v = r,
                                f.n = o[1]) : d < p && (i = n < 3 || o[0] > r || r > p) && (o[4] = n,
                                o[5] = r,
                                f.n = p,
                                s = 0))
                            }
                            if (i || n > 1)
                                return a;
                            throw h = !0,
                            r
                        }
                        return function(i, u, p) {
                            if (l > 1)
                                throw TypeError("Generator is already running");
                            for (h && 1 === u && d(u, p),
                            s = u,
                            c = p; (e = s < 2 ? t : c) || !h; ) {
                                o || (s ? s < 3 ? (s > 1 && (f.n = -1),
                                d(s, c)) : f.n = c : f.v = c);
                                try {
                                    if (l = 2,
                                    o) {
                                        if (s || (i = "next"),
                                        e = o[i]) {
                                            if (!(e = e.call(o, c)))
                                                throw TypeError("iterator result is not an object");
                                            if (!e.done)
                                                return e;
                                            c = e.value,
                                            s < 2 && (s = 0)
                                        } else
                                            1 === s && (e = o.return) && e.call(o),
                                            s < 2 && (c = TypeError("The iterator does not provide a '" + i + "' method"),
                                            s = 1);
                                        o = t
                                    } else if ((e = (h = f.n < 0) ? c : n.call(r, f)) !== a)
                                        break
                                } catch (e) {
                                    o = t,
                                    s = 1,
                                    c = e
                                } finally {
                                    l = 1
                                }
                            }
                            return {
                                value: e,
                                done: h
                            }
                        }
                    }(n, i, o), !0),
                    l
                }
                var a = {};
                function s() {}
                function c() {}
                function l() {}
                e = Object.getPrototypeOf;
                var u = [][r] ? e(e([][r]())) : (Wt(e = {}, r, function() {
                    return this
                }),
                e)
                  , h = l.prototype = s.prototype = Object.create(u);
                function f(t) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(t, l) : (t.__proto__ = l,
                    Wt(t, i, "GeneratorFunction")),
                    t.prototype = Object.create(h),
                    t
                }
                return c.prototype = l,
                Wt(h, "constructor", l),
                Wt(l, "constructor", c),
                c.displayName = "GeneratorFunction",
                Wt(l, i, "GeneratorFunction"),
                Wt(h),
                Wt(h, i, "Generator"),
                Wt(h, r, function() {
                    return this
                }),
                Wt(h, "toString", function() {
                    return "[object Generator]"
                }),
                (Rt = function() {
                    return {
                        w: o,
                        m: f
                    }
                }
                )()
            }
            function Wt(t, e, n, r) {
                var i = Object.defineProperty;
                try {
                    i({}, "", {})
                } catch (t) {
                    i = 0
                }
                Wt = function(t, e, n, r) {
                    function o(e, n) {
                        Wt(t, e, function(t) {
                            return this._invoke(e, n, t)
                        })
                    }
                    e ? i ? i(t, e, {
                        value: n,
                        enumerable: !r,
                        configurable: !r,
                        writable: !r
                    }) : t[e] = n : (o("next", 0),
                    o("throw", 1),
                    o("return", 2))
                }
                ,
                Wt(t, e, n, r)
            }
            function Nt(t, e, n, r, i, o, a) {
                try {
                    var s = t[o](a)
                      , c = s.value
                } catch (t) {
                    return void n(t)
                }
                s.done ? e(c) : Promise.resolve(c).then(r, i)
            }
            function Ht(t) {
                return function() {
                    var e = this
                      , n = arguments;
                    return new Promise(function(r, i) {
                        var o = t.apply(e, n);
                        function a(t) {
                            Nt(o, r, i, a, s, "next", t)
                        }
                        function s(t) {
                            Nt(o, r, i, a, s, "throw", t)
                        }
                        a(void 0)
                    }
                    )
                }
            }
            function Dt(t) {
                var e = function(t) {
                    if ("object" != jt(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != jt(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == jt(e) ? e : e + ""
            }
            var Gt = function() {
                return t = function t(e) {
                    var n = this;
                    !function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, t),
                    this.menuElement = null,
                    this.overlayElement = null,
                    this.reconnectOverlay = null,
                    this.btnReconnect = null,
                    this.btnMenu = null,
                    this.isVisible = !0,
                    this.isSwitchingServer = !1,
                    this.currentProfile = 1,
                    this.captchaApiKey = "986cee93cb4b0fac6579b1b6b6749035",
                    this.captchaSiteKey = "0x4AAAAAAACWFDYFT_opGqX8",
                    this.app = e,
                    this.logger = new S({
                        prefix: "Lobby",
                        color: "#FF9800"
                    }),
                    this.menuElement = document.querySelector(".lobby-menu"),
                    this.overlayElement = document.querySelector(".lobby-overlay"),
                    this.skinsMenu = new Et(e),
                    this.reconnectOverlay = document.getElementById("reconnectOverlay"),
                    this.btnReconnect = document.getElementById("btnReconnect"),
                    this.btnMenu = document.getElementById("btnMenu"),
                    this.initMenuButtons(),
                    this.initReconnectButtons(),
                    this.initInputs(),
                    this.initServerSelect(),
                    this.initProfileSelector(),
                    this.loadGlobalState(),
                    window.addEventListener("resize", function() {
                        return n.scale()
                    }),
                    this.scale(),
                    this.app.player.pendingConnections = [],
                    this.initChat(),
                    // The Senpa integration starts the connection after installing account controls.
                    window.addEventListener("keydown", function(t) {
                        if ("Escape" === t.key) {
                            if (n.reconnectOverlay && "flex" === n.reconnectOverlay.style.display)
                                return;
                            var e = t.target;
                            if ("INPUT" === e.tagName || "TEXTAREA" === e.tagName)
                                return;
                            if (n.app.settingsMenu.isVisible)
                                return void n.app.settingsMenu.hide();
                            n.toggle()
                        }
                    }),
                    setTimeout(function() {
                        window.app && (window.app.reconnectClient = function() { n.reconnectClient(); }
                        ,
                        window.app.reconnectChat = function() {
                            n.reconnectChat()
                        }
                        )
                    }, 0)
                }
                ,
                e = [{
                    key: "solveTurnstile",
                    value: function() { throw new Error("Senpa verification is not initialized"); }
                }, {
                    key: "reconnectChat",
                    value: function() {
                        var t = this;
                        this.app.player.chat ? (this.app.player.chat.close(),
                        this.app.toasts.show("Reconnecting to Chat...", "info", 2e3),
                        setTimeout(function() {
                            t.initChat()
                        }, 500)) : this.initChat()
                    }
                }, {
                    key: "tokenFromUrl",
                    value: function(t) {
                        var e = t.match(/^wss?:\/\/(.+)/);
                        return e ? btoa(e[1]) : ""
                    }
                }, {
                    key: "initChat",
                    value: function() {
                        var t = this;
                        this.app.player.chat = {
                            connect: function() {},
                            events: {
                                on: function() {}
                            },
                            players: new Map()
                        },
                        setTimeout(function() {
                            t.app.player.chat = null
                        }, 0),
                        this.app.player.chat.events.on("connectionID", function() {
                            t.app.player.chat && (t.updateChatRoom(),
                            t.app.toasts.show("Connected to chat", "success", 1e3))
                        }),
                        this.app.player.chat.events.on("message", function(e) {
                            var n, r = "";
                            if (t.app.player.chat && t.app.player.chat.players) {
                                var i = t.app.player.chat.players.get(e.playerID);
                                if (i && (i.tabId && (r = i.tabId.toString()),
                                i.pColor))
                                    try {
                                        n = ot.temp.fromINT(i.pColor).getHEX()
                                    } catch (t) {}
                            }
                            var o = e.nick;
                            o && 0 !== o.trim().length || (o = "unnamed#".concat(e.playerID)),
                            t.app.chatBox.addMessage(o, e.text, e.type, r, n)
                        }),
                        this.app.player.chat.events.on("wave", function(e) {
                            var n = t.app.stage.border
                              , r = -(n.left + n.right) / 2
                              , i = -(n.top + n.bottom) / 2
                              , o = e.x - r
                              , a = e.y - i;
                            t.app.stage.createWave(o, a, e.color)
                        })
                    }
                }, {
                    key: "updateChatRoom",
                    value: function() {
                        var t = "";
                        if ("wss://eu.senpa.io:2001" === this.app.player.serverUrl && (t = "wss://eu.mi.com:2001"),
                        "wss://us.senpa.io:2001" === this.app.player.serverUrl && (t = "wss://us.mi.com:2001"),
                        this.app.player.chat && this.app.player.chat.isConnected) {
                            var e = this.tokenFromUrl(t)
                              , n = this.app.player.tag;
                            this.app.player.chat.enterRoom(e, n, "", ":party", "")
                        }
                    }
                }, {
                    key: "initClient",
                    value: function(url, options = {}) {
                        const session = this.app.gameConnection, secondary = options.secondary === true;
                        if (secondary) {
                            if (!session.primary?.clientReady || session.secondary ||
                                session.primary.probeUrl !== url || !window.EonDualFFA?.enabled()) return null;
                        } else {
                            if (session.primary) return session.primary;
                            const existing = this.app.player.pendingConnections.find(c => !c.isEonSecondary);
                            if (existing) return existing;
                        }
                        const client = new bt(this.app);
                        client.isEonSecondary = secondary;
                        window.EonSenpaIntegration.patchClient(client);
                        session.addConnection(client);
                        this.app.player.pendingConnections.push(client);
                        const toast = this.app.toasts.show(secondary ? "Connecting FFA Multi player 2..." : "Connecting to Senpa...", "info", 0, () => client.close());
                        const removePending = () => {
                            this.app.player.pendingConnections = this.app.player.pendingConnections.filter(item => item !== client);
                        };
                        client.events.on("connected", () => { if (!secondary) this.hideReconnect(); });
                        client.events.on("ready", () => {
                            removePending(); this.app.toasts.remove(toast);
                            this.app.toasts.show(secondary ? "FFA secondary connected" : "Connected", "success", 2000);
                        });
                        client.events.on("disconnected", () => {
                            removePending(); this.app.toasts.remove(toast); session.removeConnection(client);
                            window.EonDualFFA?.onDisconnected(client);
                            if (!secondary && !session.primary && !this.isSwitchingServer && !this.app.replayManager?.isReplay) {
                                if (this.isVisible) {
                                    this.hideReconnect();
                                    this.app.toasts.show("Connection closed. Use Reconnect to try again.", "error", 5000);
                                } else this.showReconnect();
                            }
                        });
                        client.events.on("error", error => {
                            this.app.toasts.remove(toast); client.logger.error(error);
                            this.app.toasts.show("Connection Error", "error", 3000);
                        });
                        client.events.on("captcha", data => {
                            if (data.type === 1) this.solveTurnstile(client, data);
                            else this.app.toasts.show("Unknown verification type: " + data.type, "error", 5000);
                        });
                        client.events.on("died", () => {
                            // One game socket dying is NOT the death of Dual FFA.
                            // Keep gameplay visible until every connected player's cells are gone.
                            const surviving = session.clients.find(other =>
                                other.clientReady && other.tabs?.some(tab => tab.player.cells.length > 0));
                            this.app.input.states.macroFeed = false;
                            if (surviving) {
                                if (this.app.settings.get("autoSwitchCells") && session.current !== surviving)
                                    session.setActive(surviving);
                                if (this.isVisible) this.hide();
                                return;
                            }
                            if (this.app.settings.get("showMenuOnDeath")) this.show();
                            else client.spectate.enabled = true;
                        });
                        client.connect(url);
                        return client;
                    }
                }, {
                    key: "clearConnections",
                    value: function() {
                        this.app.gameConnection.forEachClient(function(t) {
                            return t.close()
                        })
                    }
                }, {
                    key: "connect",
                    value: function(t) {
                        this.clearConnections(),
                        this.initClient(t),
                        this.updateChatRoom()
                    }
                }, {
                    key: "reconnectClient",
                    value: function() {
                        this.connect(this.app.player.serverUrl);
                    }
                }, {
                    key: "swapTabs",
                    value: function() {
                        this.app.gameConnection.current?.switchPlayer();
                    }
                }, {
                    key: "show",
                    value: function() {
                        this.app.controls?.cancelFeed();
                        this.overlayElement && (this.overlayElement.style.display = "flex",
                        this.overlayElement.offsetHeight,
                        this.overlayElement.classList.remove("fade-out"),
                        this.isVisible = !0)
                    }
                }, {
                    key: "hide",
                    value: function() {
                        var t = this;
                        this.overlayElement && (this.overlayElement.classList.add("fade-out"),
                        this.isVisible = !1,
                        setTimeout(function() {
                            !t.isVisible && t.overlayElement && (t.overlayElement.style.display = "none")
                        }, 300))
                    }
                }, {
                    key: "showReconnect",
                    value: function() {
                        if (this.overlayElement && (this.overlayElement.style.display = "none",
                        this.isVisible = !1),
                        this.reconnectOverlay) {
                            this.reconnectOverlay.style.display = "flex",
                            this.reconnectOverlay.offsetHeight,
                            this.reconnectOverlay.classList.add("fade-in");
                            var t = this.reconnectOverlay.querySelector(".reconnect-box");
                            t && t.classList.remove("connecting");
                            var e = this.reconnectOverlay.querySelector(".reconnect-title");
                            e && (e.textContent = "DISCONNECTED");
                            var n = this.reconnectOverlay.querySelector(".reconnect-message");
                            n && (n.textContent = "Connection to the server was lost")
                        }
                    }
                }, {
                    key: "showConnecting",
                    value: function() {
                        if (this.overlayElement && (this.overlayElement.style.display = "none",
                        this.isVisible = !1),
                        this.reconnectOverlay) {
                            this.reconnectOverlay.style.display = "flex",
                            this.reconnectOverlay.offsetHeight,
                            this.reconnectOverlay.classList.add("fade-in");
                            var t = this.reconnectOverlay.querySelector(".reconnect-box");
                            t && t.classList.add("connecting");
                            var e = this.reconnectOverlay.querySelector(".reconnect-title");
                            e && (e.textContent = "CONNECTING");
                            var n = this.reconnectOverlay.querySelector(".reconnect-message");
                            n && (n.textContent = "Joining server...")
                        }
                    }
                }, {
                    key: "hideReconnect",
                    value: function() {
                        var t = this;
                        this.reconnectOverlay && (this.reconnectOverlay.classList.remove("fade-in"),
                        setTimeout(function() {
                            t.reconnectOverlay && (t.reconnectOverlay.style.display = "none")
                        }, 300))
                    }
                }, {
                    key: "initReconnectButtons",
                    value: function() {
                        var t = this;
                        this.btnReconnect && this.btnReconnect.addEventListener("click", function() {
                            t.hideReconnect(),
                            t.connect(t.app.player.serverUrl)
                        }),
                        this.btnMenu && this.btnMenu.addEventListener("click", function() {
                            t.hideReconnect(),
                            t.show()
                        })
                    }
                }, {
                    key: "toggle",
                    value: function() {
                        this.isVisible ? this.hide() : this.show()
                    }
                }, {
                    key: "scale",
                    value: function() {
                        if (this.menuElement) {
                            var t = window.innerWidth / 1920
                              , e = window.innerHeight / 1080
                              , n = 1.1 * Math.min(1, t, e);
                            this.menuElement.style.transform = "scale(".concat(n, ")")
                        }
                    }
                }, {
                    key: "initMenuButtons",
                    value: function() {
                        var t = this
                          , e = document.querySelector(".menu-btn.btn-settings")
                          , n = document.querySelector(".menu-btn.btn-spectate")
                          , r = document.querySelector(".menu-btn.btn-play")
                          , i = document.querySelector(".menu-btn.btn-reconnect-menu");
                        e && e.addEventListener("click", function() {
                            t.app.settingsMenu.show()
                        }),
                        i && i.addEventListener("click", function() {
                            var e = t.app.gameConnection.current;
                            e && e.isConnected ? (t.app.toasts.show("Reconnecting...", "info", 1e3),
                            t.connect(t.app.player.serverUrl)) : t.connect(t.app.player.serverUrl)
                        }),
                        n && n.addEventListener("click", function() {
                            t.app.gameConnection.forEachClient(function(t) {
                                return t.sendSpectate()
                            }),
                            t.hide()
                        }),
                        r && r.addEventListener("click", function() {
                            var e = t.app.gameConnection.current;
                            e && e.isDead && e.sendSpawn(),
                            t.hide()
                        })
                    }
                }, {
                    key: "setSkin",
                    value: function(slot, value) {
                        this.app.player[slot === 1 ? "skin1" : "skin2"] = value;
                        const input = document.querySelector(".input-skin" + slot);
                        if (input) input.value = value;
                        this.updateSkinPreview(slot, value);
                        this.persistState();
                        this.app.gameConnection.current?.sendPlayerInfo();
                    }
                }, {
                    key: "initInputs",
                    value: function() {
                        var t = this;
                        [{
                            id: ".input-tag",
                            prop: "tag",
                            handler: function() {
                                t.updateChatRoom(),
                                t.app.gameConnection.forEachClient(function(e) {
                                    e.sendTeamTag();
                                    var n;
                                    return null === (n = t.app.player.chat) || void 0 === n ? void 0 : n.onTagChange(e)
                                })
                            }
                        }, {
                            id: ".input-p1",
                            prop: "nickname1",
                            handler: function() {
                                t.app.gameConnection.forEachClient(function(t) {
                                    return t.sendPlayerInfo()
                                })
                            }
                        }, {
                            id: ".input-skin1",
                            prop: "skin1",
                            handler: function(e) {
                                t.updateSkinPreview(1, e);
                                t.app.gameConnection.current?.sendPlayerInfo();
                            }
                        }, {
                            id: ".input-skin2", prop: "skin2",
                            handler: function(value) { t.updateSkinPreview(2, value); t.app.gameConnection.current?.sendPlayerInfo(); }
                        }].forEach(function(e) {
                            var n = document.querySelector(e.id);
                            n && n.addEventListener("input", function() {
                                var r = n.value;
                                t.app.player[e.prop] = r,
                                t.persistState(),
                                e.handler && e.handler(r)
                            })
                        })
                    }
                }, {
                    key: "updateSkinPreview",
                    value: function(t, e) {
                        var n = 1 === t ? ".skin-left" : ".skin-right"
                          , r = document.querySelector(n);
                        r && (e && "" !== e.trim() ? r.style.backgroundImage = "url('".concat(e, "')") : r.style.backgroundImage = "")
                    }
                }, {
                    key: "initServerSelect",
                    value: function() {
                        var t = this;
                        document.querySelectorAll(".server-select-trigger").forEach(function(e) {
                            var n = e.closest(".server-select-container")
                              , r = null == n ? void 0 : n.querySelector(".server-options")
                              , i = null == n ? void 0 : n.querySelectorAll(".server-option");
                            n && r && (e.addEventListener("click", function(e) {
                                e.stopPropagation(),
                                t.isSwitchingServer || n.classList.toggle("open")
                            }),
                            null == i || i.forEach(function(e) {
                                e.addEventListener("click", function() {
                                    var r = e.getAttribute("data-value")
                                      , o = e.textContent;
                                    if (!t.isSwitchingServer) {
                                        var a = n.querySelector(".selected-text");
                                        a && o && (a.textContent = o),
                                        i.forEach(function(t) {
                                            return t.classList.remove("selected")
                                        }),
                                        e.classList.add("selected"),
                                        n.classList.remove("open"),
                                        r && r !== t.app.player.serverUrl && (t.logger.log("Switching server to: ".concat(r)),
                                        t.app.player.serverUrl = r,
                                        t.persistState(),
                                        t.switchServer(r))
                                    }
                                })
                            }),
                            document.addEventListener("click", function(t) {
                                n.contains(t.target) || n.classList.remove("open")
                            }))
                        })
                    }
                }, {
                    key: "loadGlobalState",
                    value: function() {
                        var t = this
                          , e = localStorage.getItem("eon_playerInputs");
                        if (e)
                            try {
                                var n = JSON.parse(e);
                                void 0 !== n.lastServer && (this.app.player.serverUrl = n.lastServer);
                                var r = document.querySelector(".server-select-container");
                                r && this.app.player.serverUrl && r.querySelectorAll(".server-option").forEach(function(e) {
                                    if (e.getAttribute("data-value") === t.app.player.serverUrl) {
                                        e.classList.add("selected");
                                        var n = e.textContent
                                          , i = r.querySelector(".selected-text");
                                        i && n && (i.textContent = n)
                                    } else
                                        e.classList.remove("selected")
                                })
                            } catch (t) {
                                this.logger.error("Failed to load global settings", t)
                            }
                    }
                }, {
                    key: "persistState",
                    value: function() {
                        var t = {
                            lastServer: this.app.player.serverUrl
                        };
                        localStorage.setItem("eon_playerInputs", JSON.stringify(t)),
                        this.saveProfile(this.currentProfile)
                    }
                }, {
                    key: "initProfileSelector",
                    value: function() {
                        var t = this
                          , e = document.querySelectorAll(".profile-slot")
                          , n = document.querySelector(".arrow-left")
                          , r = document.querySelector(".arrow-right")
                          , i = localStorage.getItem("eon_currentProfile");
                        i && (this.currentProfile = parseInt(i) || 1,
                        this.updateActiveSlot()),
                        this.loadProfile(this.currentProfile),
                        e.forEach(function(e) {
                            e.addEventListener("click", function() {
                                var n = parseInt(e.getAttribute("data-profile") || "1");
                                t.switchProfile(n)
                            })
                        }),
                        null == n || n.addEventListener("click", function() {
                            var e = 1 === t.currentProfile ? 10 : t.currentProfile - 1;
                            t.switchProfile(e)
                        }),
                        null == r || r.addEventListener("click", function() {
                            var e = 10 === t.currentProfile ? 1 : t.currentProfile + 1;
                            t.switchProfile(e)
                        })
                    }
                }, {
                    key: "switchProfile",
                    value: function(t) {
                        t !== this.currentProfile && (this.currentProfile = t,
                        localStorage.setItem("eon_currentProfile", t.toString()),
                        this.updateActiveSlot(),
                        this.loadProfile(t))
                    }
                }, {
                    key: "updateActiveSlot",
                    value: function() {
                        var t = this;
                        document.querySelectorAll(".profile-slot").forEach(function(e) {
                            parseInt(e.getAttribute("data-profile") || "0") === t.currentProfile ? e.classList.add("active") : e.classList.remove("active")
                        })
                    }
                }, {
                    key: "loadProfile",
                    value: function(t) {
                        var e, n = this, r = "eon_profile_".concat(t), i = localStorage.getItem(r);
                        if (i)
                            try {
                                e = JSON.parse(i)
                            } catch (t) {
                                e = this.getDefaultProfile()
                            }
                        else
                            e = this.getDefaultProfile();
                        this.app.player.tag = e.lastClanTag,
                        this.app.player.nickname1 = e.primaryNickname,
                        this.app.player.skin1 = e.primarySkin;
                        this.app.player.skin2 = e.secondarySkin || "";
                        var o = function(t, e) {
                            var n = document.querySelector(t);
                            n && (n.value = e)
                        };
                        o(".input-tag", e.lastClanTag),
                        o(".input-p1", e.primaryNickname),
                        o(".input-skin1", e.primarySkin),
                        o(".input-skin2", e.secondarySkin || ""),
                        this.updateSkinPreview(2, e.secondarySkin || ""),
                        this.updateSkinPreview(1, e.primarySkin),
                        this.updateChatRoom(),
                        this.app.gameConnection.forEachClient(function(t) {
                            var e;
                            null === (e = n.app.player.chat) || void 0 === e || e.onTagChange(t),
                            t.sendPlayerInfo()
                        })
                    }
                }, {
                    key: "saveProfile",
                    value: function(t) {
                        var e = "eon_profile_".concat(t)
                          , n = {
                            primaryNickname: this.app.player.nickname1,
                            primarySkin: this.app.player.skin1,
                            secondarySkin: this.app.player.skin2 || "",
                            lastClanTag: this.app.player.tag
                        };
                        localStorage.setItem(e, JSON.stringify(n))
                    }
                }, {
                    key: "getDefaultProfile",
                    value: function() {
                        return {
                            primaryNickname: "",
                            primarySkin: "",
                            secondarySkin: "",
                            lastClanTag: ""
                        }
                    }
                }, {
                    key: "switchServer",
                    value: function(t) {
                        var e = this;
                        if (!this.isSwitchingServer) {
                            this.isSwitchingServer = !0;
                            var n = document.querySelector(".server-select-trigger");
                            n && (n.style.opacity = "0.5",
                            n.style.cursor = "not-allowed"),
                            this.showConnecting(),
                            this.clearConnections(),
                            setTimeout(function() {
                                e.connect(t),
                                setTimeout(function() {
                                    e.isSwitchingServer = !1,
                                    n && (n.style.opacity = "1",
                                    n.style.cursor = "pointer")
                                }, 1e3)
                            }, 500)
                        }
                    }
                }],
                e && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1,
                        r.configurable = !0,
                        "value"in r && (r.writable = !0),
                        Object.defineProperty(t, Dt(r.key), r)
                    }
                }(t.prototype, e),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                t;
                var t, e, n, r
            }();
            function zt(t) {
                return zt = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                zt(t)
            }
            function Vt(t, e) {
                (null == e || e > t.length) && (e = t.length);
                for (var n = 0, r = Array(e); n < e; n++)
                    r[n] = t[n];
                return r
            }
            function qt(t) {
                var e = function(t) {
                    if ("object" != zt(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != zt(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == zt(e) ? e : e + ""
            }
            var Xt = function() {
                return t = function t(e) {
                    var n = this;
                    !function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, t),
                    this.serverTimerElement = null,
                    this.serverTimerText = null,
                    this.leaderboardElement = null,
                    this.leaderboardContent = null,
                    this.countdownOverlay = null,
                    this.countdownNumber = null,
                    this.statsElement = null,
                    this.settings = e,
                    this.serverTimerElement = document.getElementById("hud-server-timer"),
                    this.serverTimerElement && (this.serverTimerText = this.serverTimerElement.querySelector("span")),
                    this.leaderboardElement = document.getElementById("hud-leaderboard"),
                    this.leaderboardElement && (this.leaderboardContent = this.leaderboardElement.querySelector(".lb-content")),
                    this.countdownOverlay = document.getElementById("countdown-overlay"),
                    this.countdownOverlay && (this.countdownNumber = this.countdownOverlay.querySelector(".countdown-number")),
                    this.countdownOverlay = document.getElementById("countdown-overlay"),
                    this.countdownOverlay && (this.countdownNumber = this.countdownOverlay.querySelector(".countdown-number")),
                    this.statsElement = document.getElementById("stats-hud"),
                    this.initVisibilityListeners(),
                    window.addEventListener("resize", function() {
                        return n.scale()
                    }),
                    this.scale(),
                    this.applyEventIsolation()
                }
                ,
                e = [{
                    key: "applyEventIsolation",
                    value: function() {
                        var t = this
                          , e = ["mousedown", "mouseup", "mousemove", "click", "touchstart", "touchend", "touchmove"]
                          , n = function(t) {
                            return t.stopPropagation()
                        };
                        this.statsElement && e.forEach(function(e) {
                            return t.statsElement.addEventListener(e, n)
                        }),
                        this.leaderboardElement && e.forEach(function(e) {
                            return t.leaderboardElement.addEventListener(e, n)
                        })
                    }
                }, {
                    key: "initVisibilityListeners",
                    value: function() {
                        var t = this
                          , e = function() {
                            var e = t.settings.get("showHUD")
                              , n = t.settings.get("showStats")
                              , r = t.settings.get("showLeaderboard");
                            t.statsElement && (t.statsElement.style.display = e && n ? "flex" : "none"),
                            t.leaderboardElement && (t.leaderboardElement.style.display = e && r ? "block" : "none"),
                            t.serverTimerElement && (t.serverTimerElement.style.display = e ? "block" : "none")
                        };
                        this.settings.on("change:showHUD", e),
                        this.settings.on("change:showStats", e),
                        this.settings.on("change:showLeaderboard", e),
                        e()
                    }
                }, {
                    key: "scale",
                    value: function() {
                        var t = window.innerWidth / 1920
                          , e = window.innerHeight / 1080
                          , n = Math.min(1, t, e);
                        document.documentElement.style.setProperty("--scale", n.toString())
                    }
                }, {
                    key: "updateServerTimer",
                    value: function(t, e) {
                        this.serverTimerText && (this.serverTimerText.innerText = "".concat(t, " - ").concat(e));
                        var n = this.parseTimeToSeconds(e);
                        n > 0 && n <= 10 ? this.showCountdownOverlay(n) : (0 === n || n > 10) && this.hideCountdownOverlay()
                    }
                }, {
                    key: "parseTimeToSeconds",
                    value: function(t) {
                        var e = t.match(/(\d+)h|(\d+)m|(\d+)s/g);
                        if (!e)
                            return 0;
                        var n, r = 0, i = function(t) {
                            var e = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
                            if (!e) {
                                if (Array.isArray(t) || (e = function(t, e) {
                                    if (t) {
                                        if ("string" == typeof t)
                                            return Vt(t, e);
                                        var n = {}.toString.call(t).slice(8, -1);
                                        return "Object" === n && t.constructor && (n = t.constructor.name),
                                        "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Vt(t, e) : void 0
                                    }
                                }(t))) {
                                    e && (t = e);
                                    var n = 0
                                      , r = function() {};
                                    return {
                                        s: r,
                                        n: function() {
                                            return n >= t.length ? {
                                                done: !0
                                            } : {
                                                done: !1,
                                                value: t[n++]
                                            }
                                        },
                                        e: function(t) {
                                            throw t
                                        },
                                        f: r
                                    }
                                }
                                throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                            }
                            var i, o = !0, a = !1;
                            return {
                                s: function() {
                                    e = e.call(t)
                                },
                                n: function() {
                                    var t = e.next();
                                    return o = t.done,
                                    t
                                },
                                e: function(t) {
                                    a = !0,
                                    i = t
                                },
                                f: function() {
                                    try {
                                        o || null == e.return || e.return()
                                    } finally {
                                        if (a)
                                            throw i
                                    }
                                }
                            }
                        }(e);
                        try {
                            for (i.s(); !(n = i.n()).done; ) {
                                var o = n.value;
                                o.endsWith("h") ? r += 3600 * parseInt(o) : o.endsWith("m") ? r += 60 * parseInt(o) : o.endsWith("s") && (r += parseInt(o))
                            }
                        } catch (t) {
                            i.e(t)
                        } finally {
                            i.f()
                        }
                        return r
                    }
                }, {
                    key: "showCountdownOverlay",
                    value: function(t) {
                        this.countdownOverlay && this.countdownNumber && (this.countdownOverlay.style.display = "block",
                        this.countdownNumber.textContent = t.toString())
                    }
                }, {
                    key: "hideCountdownOverlay",
                    value: function() {
                        this.countdownOverlay && (this.countdownOverlay.style.display = "none")
                    }
                }, {
                    key: "updateLeaderboard",
                    value: function(t) {
                        var e = this;
                        this.leaderboardContent && (this.leaderboardContent.innerHTML = "",
                        t.forEach(function(t, n) {
                            var r = document.createElement("div");
                            r.className = "lb-row";
                            var i = document.createElement("span");
                            i.className = "lb-position",
                            i.textContent = "".concat(n + 1);
                            var o = document.createElement("span");
                            o.className = "lb-name",
                            o.textContent = at(t.name, 3),
                            o.style.color = t.color || "";
                            var a, s = document.createElement("span");
                            s.className = "lb-mass",
                            a = t.score < 1e3 ? Math.floor(t.score).toString() : (t.score / 1e3).toFixed(1) + "k",
                            s.textContent = "[".concat(a, "]"),
                            s.style.color = t.color || e.settings.get("leaderboardMassColor"),
                            r.appendChild(o),
                            r.appendChild(s),
                            r.appendChild(i),
                            e.leaderboardContent && e.leaderboardContent.appendChild(r)
                        }))
                    }
                }, {
                    key: "togglePauseHUD",
                    value: function(t) {
                        var e = document.getElementById("pause-hud");
                        e && (e.style.display = t ? "block" : "none")
                    }
                }, {
                    key: "testCountdown",
                    value: function() {
                        var t = this;
                        console.log("Starting countdown test...");
                        var e = 10
                          , n = setInterval(function() {
                            e > 0 ? (t.showCountdownOverlay(e),
                            console.log("Countdown: ".concat(e)),
                            e--) : (t.hideCountdownOverlay(),
                            console.log("Countdown complete!"),
                            clearInterval(n))
                        }, 1e3)
                    }
                }],
                e && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1,
                        r.configurable = !0,
                        "value"in r && (r.writable = !0),
                        Object.defineProperty(t, qt(r.key), r)
                    }
                }(t.prototype, e),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                t;
                var t, e
            }();
            function Yt(t) {
                return Yt = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                Yt(t)
            }
            function Kt(t, e) {
                (null == e || e > t.length) && (e = t.length);
                for (var n = 0, r = Array(e); n < e; n++)
                    r[n] = t[n];
                return r
            }
            function Zt(t) {
                var e = function(t) {
                    if ("object" != Yt(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != Yt(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == Yt(e) ? e : e + ""
            }
            var Jt = Symbol("_applyTransform")
              , Qt = function(t) {
                return e = function t() {
                    !function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, t),
                    this._matrix = [1, 0, 0, 1, 0, 0]
                }
                ,
                n = [{
                    key: t,
                    value: function(t) {
                        var e = this._matrix
                          , n = e[0] * t[0] + e[2] * t[1]
                          , r = e[1] * t[0] + e[3] * t[1]
                          , i = e[0] * t[2] + e[2] * t[3]
                          , o = e[1] * t[2] + e[3] * t[3]
                          , a = e[0] * t[4] + e[2] * t[5] + e[4]
                          , s = e[1] * t[4] + e[3] * t[5] + e[5];
                        this._matrix = [n, r, i, o, a, s]
                    }
                }, {
                    key: "translate",
                    value: function(t, e) {
                        this[Jt]([1, 0, 0, 1, t, e])
                    }
                }, {
                    key: "rotate",
                    value: function(t) {
                        var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0
                          , n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0
                          , r = Math.cos(t)
                          , i = Math.sin(t);
                        this[Jt]([r, i, -i, r, e - e * r + n * i, n - e * i - n * r])
                    }
                }, {
                    key: "scale",
                    value: function(t, e) {
                        this[Jt]([t, 0, 0, e, 0, 0])
                    }
                }, {
                    key: "skew",
                    value: function(t, e) {
                        this[Jt]([1, Math.tan(e), Math.tan(t), 1, 0, 0])
                    }
                }, {
                    key: "reset",
                    value: function() {
                        this._matrix = [1, 0, 0, 1, 0, 0]
                    }
                }, {
                    key: "setContextTransform",
                    value: function(t) {
                        var e = this._matrix;
                        t.setTransform(e[0], e[1], e[2], e[3], e[4], e[5])
                    }
                }, {
                    key: "resetContextTransform",
                    value: function(t) {
                        t.setTransform(1, 0, 0, 1, 0, 0)
                    }
                }, {
                    key: "getTransformedPoint",
                    value: function(t, e) {
                        var n = this._matrix;
                        return {
                            x: t * n[0] + e * n[2] + n[4],
                            y: t * n[1] + e * n[3] + n[5]
                        }
                    }
                }, {
                    key: "getScreenPoint",
                    value: function(t, e) {
                        var n = this._matrix
                          , r = n[0] * n[3] - n[1] * n[2];
                        if (0 === r)
                            throw new Error("Matrix is not invertible");
                        var i = [n[3] / r, -n[1] / r, -n[2] / r, n[0] / r, (n[2] * n[5] - n[3] * n[4]) / r, (n[1] * n[4] - n[0] * n[5]) / r];
                        return {
                            x: t * i[0] + e * i[2] + i[4],
                            y: t * i[1] + e * i[3] + i[5]
                        }
                    }
                }, {
                    key: "getMatrix",
                    value: function() {
                        return function(t) {
                            if (Array.isArray(t))
                                return Kt(t)
                        }(t = this._matrix) || function(t) {
                            if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"])
                                return Array.from(t)
                        }(t) || function(t, e) {
                            if (t) {
                                if ("string" == typeof t)
                                    return Kt(t, e);
                                var n = {}.toString.call(t).slice(8, -1);
                                return "Object" === n && t.constructor && (n = t.constructor.name),
                                "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Kt(t, e) : void 0
                            }
                        }(t) || function() {
                            throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                        }();
                        var t
                    }
                }, {
                    key: "setMatrix",
                    value: function(t) {
                        if (!Array.isArray(t) || 6 !== t.length)
                            throw new Error("Matrix must be an array of 6 numbers");
                        this._matrix = [t[0], t[1], t[2], t[3], t[4], t[5]]
                    }
                }],
                n && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1,
                        r.configurable = !0,
                        "value"in r && (r.writable = !0),
                        Object.defineProperty(t, Zt(r.key), r)
                    }
                }(e.prototype, n),
                Object.defineProperty(e, "prototype", {
                    writable: !1
                }),
                e;
                var e, n
            }(Jt);
            function $t(t) {
                return $t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                $t(t)
            }
            function te() {
                var t, e, n = "function" == typeof Symbol ? Symbol : {}, r = n.iterator || "@@iterator", i = n.toStringTag || "@@toStringTag";
                function o(n, r, i, o) {
                    var c = r && r.prototype instanceof s ? r : s
                      , l = Object.create(c.prototype);
                    return ee(l, "_invoke", function(n, r, i) {
                        var o, s, c, l = 0, u = i || [], h = !1, f = {
                            p: 0,
                            n: 0,
                            v: t,
                            a: d,
                            f: d.bind(t, 4),
                            d: function(e, n) {
                                return o = e,
                                s = 0,
                                c = t,
                                f.n = n,
                                a
                            }
                        };
                        function d(n, r) {
                            for (s = n,
                            c = r,
                            e = 0; !h && l && !i && e < u.length; e++) {
                                var i, o = u[e], d = f.p, p = o[2];
                                n > 3 ? (i = p === r) && (c = o[(s = o[4]) ? 5 : (s = 3,
                                3)],
                                o[4] = o[5] = t) : o[0] <= d && ((i = n < 2 && d < o[1]) ? (s = 0,
                                f.v = r,
                                f.n = o[1]) : d < p && (i = n < 3 || o[0] > r || r > p) && (o[4] = n,
                                o[5] = r,
                                f.n = p,
                                s = 0))
                            }
                            if (i || n > 1)
                                return a;
                            throw h = !0,
                            r
                        }
                        return function(i, u, p) {
                            if (l > 1)
                                throw TypeError("Generator is already running");
                            for (h && 1 === u && d(u, p),
                            s = u,
                            c = p; (e = s < 2 ? t : c) || !h; ) {
                                o || (s ? s < 3 ? (s > 1 && (f.n = -1),
                                d(s, c)) : f.n = c : f.v = c);
                                try {
                                    if (l = 2,
                                    o) {
                                        if (s || (i = "next"),
                                        e = o[i]) {
                                            if (!(e = e.call(o, c)))
                                                throw TypeError("iterator result is not an object");
                                            if (!e.done)
                                                return e;
                                            c = e.value,
                                            s < 2 && (s = 0)
                                        } else
                                            1 === s && (e = o.return) && e.call(o),
                                            s < 2 && (c = TypeError("The iterator does not provide a '" + i + "' method"),
                                            s = 1);
                                        o = t
                                    } else if ((e = (h = f.n < 0) ? c : n.call(r, f)) !== a)
                                        break
                                } catch (e) {
                                    o = t,
                                    s = 1,
                                    c = e
                                } finally {
                                    l = 1
                                }
                            }
                            return {
                                value: e,
                                done: h
                            }
                        }
                    }(n, i, o), !0),
                    l
                }
                var a = {};
                function s() {}
                function c() {}
                function l() {}
                e = Object.getPrototypeOf;
                var u = [][r] ? e(e([][r]())) : (ee(e = {}, r, function() {
                    return this
                }),
                e)
                  , h = l.prototype = s.prototype = Object.create(u);
                function f(t) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(t, l) : (t.__proto__ = l,
                    ee(t, i, "GeneratorFunction")),
                    t.prototype = Object.create(h),
                    t
                }
                return c.prototype = l,
                ee(h, "constructor", l),
                ee(l, "constructor", c),
                c.displayName = "GeneratorFunction",
                ee(l, i, "GeneratorFunction"),
                ee(h),
                ee(h, i, "Generator"),
                ee(h, r, function() {
                    return this
                }),
                ee(h, "toString", function() {
                    return "[object Generator]"
                }),
                (te = function() {
                    return {
                        w: o,
                        m: f
                    }
                }
                )()
            }
            function ee(t, e, n, r) {
                var i = Object.defineProperty;
                try {
                    i({}, "", {})
                } catch (t) {
                    i = 0
                }
                ee = function(t, e, n, r) {
                    function o(e, n) {
                        ee(t, e, function(t) {
                            return this._invoke(e, n, t)
                        })
                    }
                    e ? i ? i(t, e, {
                        value: n,
                        enumerable: !r,
                        configurable: !r,
                        writable: !r
                    }) : t[e] = n : (o("next", 0),
                    o("throw", 1),
                    o("return", 2))
                }
                ,
                ee(t, e, n, r)
            }
            function ne(t, e, n, r, i, o, a) {
                try {
                    var s = t[o](a)
                      , c = s.value
                } catch (t) {
                    return void n(t)
                }
                s.done ? e(c) : Promise.resolve(c).then(r, i)
            }
            function re(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var r = e[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(t, oe(r.key), r)
                }
            }
            function ie(t, e, n) {
                return e && re(t.prototype, e),
                n && re(t, n),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                t
            }
            function oe(t) {
                var e = function(t) {
                    if ("object" != $t(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != $t(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == $t(e) ? e : e + ""
            }
            function ae(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }
            var se = ie(function t() {
                ae(this, t),
                this.lastUsedAt = performance.now(),
                this.canvases = [null, null, null, null, null, null, null, null],
                this.baseWidth = 0
            })
              , ce = function() {
                return ie(function t() {
                    ae(this, t),
                    this.lastUsedAt = performance.now(),
                    this.lastUpdateAt = performance.now(),
                    this.cachedText = null,
                    this.ctx = null,
                    this._mass = 0,
                    this.lastMass = 0,
                    this.lastRawMass = -1,
                    this._fontSize = 5,
                    this.needsRedraw = !0
                }, [{
                    key: "mass",
                    get: function() {
                        return this._mass
                    },
                    set: function(t) {
                        this._mass = t,
                        this._mass !== this.lastMass && (this.lastMass = this._mass,
                        this.needsRedraw = !0)
                    }
                }, {
                    key: "fontSize",
                    get: function() {
                        return this._fontSize
                    },
                    set: function(t) {
                        t < 5 || (0 | t) == (0 | this._fontSize) || this._fontSize > t && t / this._fontSize > .8 || t > this._fontSize && this._fontSize / t > .8 || (this._fontSize = t,
                        this.needsRedraw = !0)
                    }
                }])
            }()
              , le = function() {
                return ie(function t() {
                    ae(this, t),
                    this.nicknameCache = new Map,
                    this.massCache = new Map,
                    this.canvasPool = [],
                    this.maxCacheLife = 1e3,
                    this.massUpdateInterval = 200,
                    this.quality = .35,
                    this.ready = !1,
                    this.fontFamily = "Rajdhani",
                    this.nickWeight = 600,
                    this.massWeight = 500,
                    this.color = "#ffffff",
                    this.strokeColor = "#000000",
                    this.BASE_FONT_SIZE = 50,
                    this.LEVEL_MULTIPLIER = 50,
                    this.STROKE_WIDTH_RATIO = 10,
                    this.MAX_LEVEL = 7,
                    this.REFERENCE_LEVEL = 5,
                    this.REFERENCE_SCALE = .8,
                    this.MEASURING_FONT_SIZE = 25,
                    this.NORMALIZATION_DIVISOR = 650,
                    this.MASS_FONT_SCALE = .9,
                    this.STROKE_PADDING_MULTIPLIER = 4,
                    this.MAX_CANVAS_POOL_SIZE = 75,
                    this.supportsOffscreenCanvas = "undefined" != typeof OffscreenCanvas,
                    this.levelStrokeWidths = [],
                    this.levelTextHeights = [],
                    this.levelNickFontStrings = [],
                    this.levelMassFontSizes = [],
                    this.levelMassFontStrings = [],
                    this.init()
                }, [{
                    key: "init",
                    value: (t = te().m(function t() {
                        var e, n, r, i = this;
                        return te().w(function(t) {
                            for (; ; )
                                switch (t.n) {
                                case 0:
                                    for (this.nickShadowCtx = this.createMeasuringContext(this.nickWeight),
                                    this.massShadowCtx = this.createMeasuringContext(this.massWeight),
                                    this.referenceFontSize = this.BASE_FONT_SIZE * this.REFERENCE_LEVEL * this.REFERENCE_SCALE,
                                    this.referenceStrokeWidth = this.referenceFontSize / this.STROKE_WIDTH_RATIO,
                                    e = 0; e <= this.MAX_LEVEL; e++)
                                        n = this.BASE_FONT_SIZE * (e + 1) * this.quality,
                                        this.levelTextHeights[e] = n,
                                        this.levelStrokeWidths[e] = n / this.STROKE_WIDTH_RATIO,
                                        this.levelNickFontStrings[e] = "".concat(this.nickWeight, " ").concat(n, "px ").concat(this.fontFamily),
                                        r = this.BASE_FONT_SIZE * (e + 1) * this.MASS_FONT_SCALE,
                                        this.levelMassFontSizes[e] = r,
                                        this.levelMassFontStrings[e] = "".concat(this.massWeight, " ").concat(0 | r, "px ").concat(this.fontFamily);
                                    setTimeout(function() {
                                        return i.ready = !0
                                    }, 100);
                                case 1:
                                    return t.a(2)
                                }
                        }, t, this)
                    }),
                    e = function() {
                        var e = this
                          , n = arguments;
                        return new Promise(function(r, i) {
                            var o = t.apply(e, n);
                            function a(t) {
                                ne(o, r, i, a, s, "next", t)
                            }
                            function s(t) {
                                ne(o, r, i, a, s, "throw", t)
                            }
                            a(void 0)
                        }
                        )
                    }
                    ,
                    function() {
                        return e.apply(this, arguments)
                    }
                    )
                }, {
                    key: "createMeasuringContext",
                    value: function(t) {
                        var e = document.createElement("canvas").getContext("2d");
                        return e.font = "".concat(t, " ").concat(this.MEASURING_FONT_SIZE, "px ").concat(this.fontFamily),
                        e
                    }
                }, {
                    key: "createCanvas",
                    value: function() {
                        return this.canvasPool.pop() || (this.supportsOffscreenCanvas ? new OffscreenCanvas(1,1) : document.createElement("canvas"))
                    }
                }, {
                    key: "createNickname",
                    value: function(t, e, n) {
                        var r = new se;
                        this.nickShadowCtx.textBaseline = "middle";
                        var metrics = this.nickShadowCtx.measureText(e);
                        r.baseHeight = Math.max(this.MEASURING_FONT_SIZE, 2 * Math.abs(metrics.actualBoundingBoxAscent || 0), 2 * Math.abs(metrics.actualBoundingBoxDescent || 0));
                        return r.baseWidth = metrics.width,
                        r.lastUsedAt = n,
                        this.nicknameCache.set(t, r),
                        r
                    }
                }, {
                    key: "createMass",
                    value: function(t, e) {
                        var n = new ce;
                        return n.lastUsedAt = e,
                        this.massCache.set(t, n),
                        n
                    }
                }, {
                    key: "nicknameWidth",
                    value: function(t, e) {
                        return this.nickShadowCtx.measureText(t).width * e / this.MEASURING_FONT_SIZE
                    }
                }, {
                    key: "massWidth",
                    value: function(t, e) {
                        return this.massShadowCtx.measureText(String(t)).width * e / this.MEASURING_FONT_SIZE
                    }
                }, {
                    key: "getLevelIndex",
                    value: function(t) {
                        return 0 | Math.min(t / this.LEVEL_MULTIPLIER, this.MAX_LEVEL)
                    }
                }, {
                    key: "nick",
                    value: function(t, e, n, r) {
                        var i = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
                        if (!this.ready || !t)
                            return !1;
                        if (r < 34 && i)
                            return !1;
                        if (r < 5)
                            return !1;
                        var o = "".concat(t, ":").concat(e)
                          , a = this.nicknameCache.get(o) || this.createNickname(o, t, performance.now());
                        a.lastUsedAt = performance.now();
                        var s = this.getLevelIndex(r)
                          , c = a.canvases[s];
                        if (c)
                            return c;
                        var l = this.createCanvas()
                          , u = l.getContext("2d")
                          , h = this.levelTextHeights[s]
                          , f = this.levelStrokeWidths[s]
                          , d = a.baseWidth * (h / this.MEASURING_FONT_SIZE);
                        l.width = d + f | 0;
                        // Cache only the ink's height plus stroke padding. Match
                        // the old center parity so cropping cannot shift the glyphs.
                        var oldHeight = Math.floor(d + f * this.STROKE_PADDING_MULTIPLIER);
                        var inkHeight = Math.ceil(a.baseHeight * (h / this.MEASURING_FONT_SIZE) + f * this.STROKE_PADDING_MULTIPLIER);
                        l.height = inkHeight + ((oldHeight - inkHeight) & 1);
                        var p = (a.baseWidth * (this.referenceFontSize / this.MEASURING_FONT_SIZE) + this.referenceStrokeWidth) / this.NORMALIZATION_DIVISOR
                          , y = l.height * (p / l.width);
                        u.font = this.levelNickFontStrings[s],
                        u.textBaseline = "middle",
                        u.textAlign = "center",
                        n && (u.strokeStyle = this.strokeColor,
                        u.lineWidth = f,
                        u.strokeText(t, l.width >> 1, l.height >> 1)),
                        u.fillStyle = e,
                        u.fillText(t, l.width >> 1, l.height >> 1);
                        var v = {
                            canvas: l,
                            originW: p,
                            originH: y
                        };
                        return a.canvases[s] = v,
                        v
                    }
                }, {
                    key: "mass",
                    value: function(t, e, n, r, i, o) {
                        var a = arguments.length > 6 && void 0 !== arguments[6] && arguments[6];
                        if (!this.ready)
                            return !1;
                        if (o < 34 && a)
                            return !1;
                        if (o < 5)
                            return !1;
                        var s = "".concat(t, ":").concat(r)
                          , c = this.massCache.get(s) || this.createMass(s, performance.now());
                        c.lastUsedAt = performance.now();
                        var l = this.getLevelIndex(o)
                          , u = this.levelMassFontSizes[l]
                          , h = performance.now();
                        if (-1 === c.lastRawMass || c.lastRawMass !== n && h - c.lastUpdateAt > this.massUpdateInterval ? (c.lastRawMass = n,
                        c.fontSize = u,
                        c.mass = e,
                        c.lastUpdateAt = h) : c.fontSize = u,
                        c.cachedText || (c.cachedText = {
                            canvas: this.createCanvas(),
                            originW: 0,
                            originH: 0
                        },
                        c.ctx = c.cachedText.canvas.getContext("2d")),
                        c.needsRedraw) {
                            c.needsRedraw = !1;
                            var f = c.cachedText.canvas
                              , d = c.ctx
                              , p = u / this.STROKE_WIDTH_RATIO
                              , y = this.massWidth(e, u);
                            f.width = (y + p) * this.quality | 0,
                            f.height = (u + p) * this.quality | 0,
                            c.cachedText.originW = (this.massWidth(e, this.referenceFontSize) + this.referenceStrokeWidth) / this.NORMALIZATION_DIVISOR,
                            c.cachedText.originH = f.height / this.quality * (c.cachedText.originW / (f.width / this.quality)),
                            d.scale(this.quality, this.quality),
                            d.font = this.levelMassFontStrings[l],
                            d.textBaseline = "middle",
                            d.textAlign = "center",
                            i && (d.strokeStyle = this.strokeColor,
                            d.lineWidth = p,
                            d.strokeText(e, f.width / this.quality >> 1, f.height / this.quality >> 1)),
                            d.fillStyle = r,
                            d.fillText(e, f.width / this.quality >> 1, f.height / this.quality >> 1)
                        }
                        return c.cachedText
                    }
                }, {
                    key: "resetCanvas",
                    value: function(t) {
                        !t || this.canvasPool.length >= this.MAX_CANVAS_POOL_SIZE || (t.width = 0,
                        this.canvasPool.push(t))
                    }
                }, {
                    key: "clearCache",
                    value: function(t) {
                        var e = this;
                        this.nicknameCache.forEach(function(n, r) {
                            t - n.lastUsedAt > e.maxCacheLife && (e.nicknameCache.delete(r),
                            n.canvases.forEach(function(t) {
                                return t && e.resetCanvas(t.canvas)
                            }))
                        }),
                        this.massCache.forEach(function(n, r) {
                            t - n.lastUsedAt > e.maxCacheLife && (e.massCache.delete(r),
                            n.cachedText && e.resetCanvas(n.cachedText.canvas))
                        })
                    }
                }]);
                var t, e
            }();
            const ue = le;
            function he(t) {
                return he = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                he(t)
            }
            function fe(t) {
                var e = function(t) {
                    if ("object" != he(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != he(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == he(e) ? e : e + ""
            }
            var de = function() {
                return t = function t() {
                    !function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, t),
                    this.skins = new Map,
                    this.failed = new Set,
                    this.loading = new Map,
                    this.logger = new S({
                        prefix: "SkinCache",
                        color: "#795548"
                    })
                }
                ,
                (e = [{
                    key: "setSkin",
                    value: function(t) {
                        this.failed.has(t) || this.skins.has(t) || this.loading.has(t) || (this.loading.set(t, !0),
                        this.loadImage(t))
                    }
                }, {
                    key: "get",
                    value: function(t) {
                        return this.skins.get(t) || !this.loading.has(t) && !this.failed.has(t) && void this.setSkin(t)
                    }
                }, {
                    key: "loadImage",
                    value: function(t) {
                        var e = this;
                        window.EonSenpaSkins.loadImage(t).then(function(n) {
                            var r = document.createElement("canvas")
                              , i = r.getContext("2d");
                            if (!i)
                                return e.failed.add(t),
                                void e.loading.delete(t);
                            var o = 512;
                            r.width = o,
                            r.height = o,
                            i.save(),
                            i.beginPath(),
                            i.arc(256, 256, 256, 0, 2 * Math.PI),
                            i.closePath(),
                            i.clip(),
                            i.drawImage(n, 0, 0, o, o),
                            i.restore();
                            var a = e.analyzeTransparency(i, o);
                            e.skins.set(t, {
                                canvas: r,
                                isEmpty: a.isEmpty,
                                hasTransparency: a.hasTransparency,
                                image: r,
                                complete: !0,
                                isAnimated: !1
                            }),
                            e.loading.delete(t),
                            e.logger.log("Successfully added cached circular skin:", t)
                        }).catch(function() {
                            e.failed.add(t),
                            e.loading.delete(t),
                            e.logger.log("Failed to cache skin:", t)
                        });
                    }
                }, {
                    key: "analyzeTransparency",
                    value: function(t, e) {
                        for (var n = t.getImageData(0, 0, e, e).data, r = 0, i = 0, a = e / 2, s = e / 2, c = e / 2 * (e / 2), l = 0; l < e; l++)
                            for (var u = 0; u < e; u++) {
                                var h = u - a
                                  , f = l - s;
                                if (!(h * h + f * f > c)) {
                                    var d = n[4 * (l * e + u) + 3];
                                    r += d,
                                    i++
                                }
                            }
                        var p = i > 0 ? r / i : 0;
                        return {
                            isEmpty: p < 10,
                            hasTransparency: p < 250
                        }
                    }
                }]) && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1,
                        r.configurable = !0,
                        "value"in r && (r.writable = !0),
                        Object.defineProperty(t, fe(r.key), r)
                    }
                }(t.prototype, e),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                t;
                var t, e
            }();
            function pe(t) {
                return pe = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                pe(t)
            }
            function ye(t) {
                var e = function(t) {
                    if ("object" != pe(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != pe(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == pe(e) ? e : e + ""
            }
            var ve = function() {
                return t = function t() {
                    !function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, t),
                    this.lastFrameTime = 0,
                    this.lastRenderTime = 0,
                    this.frameAccumulator = 0,
                    this.maxFps = 60,
                    this.targetFps = 0
                }
                ,
                (e = [{
                    key: "updateRafTime",
                    value: function(t) {
                        var e = t - this.lastFrameTime;
                        this.lastFrameTime = t;
                        var n = .05;
                        Math.abs(33.3333 - e) < n ? this.maxFps = 30 : Math.abs(16.6667 - e) < n ? this.maxFps = 60 : Math.abs(13.3333 - e) < n ? this.maxFps = 75 : Math.abs(10 - e) < n ? this.maxFps = 100 : Math.abs(8.3333 - e) < n ? this.maxFps = 120 : Math.abs(6.9444 - e) < n ? this.maxFps = 144 : Math.abs(6.0606 - e) < n ? this.maxFps = 165 : Math.abs(5.5556 - e) < n ? this.maxFps = 180 : Math.abs(4.1667 - e) < n ? this.maxFps = 240 : Math.abs(3.5714 - e) < n ? this.maxFps = 280 : Math.abs(2.7778 - e) < n && (this.maxFps = 360)
                    }
                }, {
                    key: "shouldRender",
                    value: function(t) {
                        if (0 === this.targetFps || this.targetFps >= this.maxFps)
                            return this.lastRenderTime = t,
                            !0;
                        var e = t - this.lastRenderTime
                          , n = 1e3 / this.targetFps;
                        return this.frameAccumulator += e,
                        this.frameAccumulator >= n && (this.frameAccumulator -= n,
                        this.lastRenderTime = t,
                        !0)
                    }
                }, {
                    key: "rafLoopTime",
                    get: function() {
                        return 1e3 / this.maxFps
                    }
                }, {
                    key: "targetFrameTime",
                    get: function() {
                        return this.targetFps > 0 ? 1e3 / this.targetFps : this.rafLoopTime
                    }
                }, {
                    key: "reset",
                    value: function() {
                        this.lastFrameTime = 0,
                        this.lastRenderTime = 0,
                        this.frameAccumulator = 0,
                        this.maxFps = 60
                    }
                }]) && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1,
                        r.configurable = !0,
                        "value"in r && (r.writable = !0),
                        Object.defineProperty(t, ye(r.key), r)
                    }
                }(t.prototype, e),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                t;
                var t, e
            }();
            function ge(t) {
                return ge = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                ge(t)
            }
            function me(t) {
                var e = function(t) {
                    if ("object" != ge(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != ge(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == ge(e) ? e : e + ""
            }
            var be = function() {
                return t = function t(e, n, r) {
                    !function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, t),
                    this.x = e,
                    this.y = n,
                    this.waveSize = 800,
                    this.color = r,
                    this.duration = 1e3,
                    this.fadeTime = 500,
                    this.startTime = performance.now(),
                    this.pi2 = 2 * Math.PI
                }
                ,
                (e = [{
                    key: "delta",
                    get: function() {
                        var t = performance.now() - this.startTime;
                        return Math.min(t / this.duration, 1)
                    }
                }, {
                    key: "finished",
                    get: function() {
                        return this.delta >= 1
                    }
                }, {
                    key: "draw",
                    value: function(t) {
                        if (!this.finished) {
                            var e = this.waveSize * this.delta;
                            t.globalAlpha = e > this.waveSize - this.fadeTime ? (this.waveSize - e) / this.fadeTime : 1;
                            var n = t.createRadialGradient(this.x, this.y, .7 * e, this.x, this.y, e);
                            n.addColorStop(0, "rgba(0,0,0,0)"),
                            n.addColorStop(1, this.color),
                            t.fillStyle = n,
                            t.beginPath(),
                            t.arc(this.x, this.y, e, 0, this.pi2, !0),
                            t.closePath(),
                            t.fill(),
                            t.globalAlpha = 1
                        }
                    }
                }]) && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1,
                        r.configurable = !0,
                        "value"in r && (r.writable = !0),
                        Object.defineProperty(t, me(r.key), r)
                    }
                }(t.prototype, e),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                t;
                var t, e
            }();
            function we(t) {
                return we = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                we(t)
            }
            function Se(t, e) {
                var n = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(t);
                    e && (r = r.filter(function(e) {
                        return Object.getOwnPropertyDescriptor(t, e).enumerable
                    })),
                    n.push.apply(n, r)
                }
                return n
            }
            function ke(t) {
                for (var e = 1; e < arguments.length; e++) {
                    var n = null != arguments[e] ? arguments[e] : {};
                    e % 2 ? Se(Object(n), !0).forEach(function(e) {
                        Ce(t, e, n[e])
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Se(Object(n)).forEach(function(e) {
                        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e))
                    })
                }
                return t
            }
            function Ce(t, e, n) {
                return (e = Ie(e))in t ? Object.defineProperty(t, e, {
                    value: n,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : t[e] = n,
                t
            }
            function Ie(t) {
                var e = function(t) {
                    if ("object" != we(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != we(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == we(e) ? e : e + ""
            }
            var xe = function() {
                return t = function t(e) {
                    !function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, t),
                    this.waves = [],
                    this.runtime = 0,
                    this.deltaTime = 0,
                    this.nextSendCursorTime = 0,
                    this.nextMacroTime = 0,
                    this.nextCacheCleanupTime = 0,
                    this.nextStatsTime = 0,
                    this.nextTimeRemaining = 0,
                    this.pi2 = 2 * Math.PI,
                    this.bgImage = null,
                    this.cellGradientImage = null,
                    this.cellsFrameRemoved = [],
                    this.cellsFrame = [],
                    this.cellsFrameFood = [],
                    this.cellsFrameVirus = [],
                    this.spectateTargetX = null,
                    this.spectateTargetY = null,
                    this.lockedCursorX = null,
                    this.lockedCursorY = null,
                    this.timeRemaining = "00h 00m 00s",
                    this.app = e,
                    this.logger = new S({
                        prefix: "Stage",
                        color: "#4CAF50"
                    }),
                    this.canvas = document.getElementById("gameCanvas"),
                    this.ctx = this.canvas.getContext("2d", {alpha:false}),
                    this.matrix = new Qt,
                    this.skinCache = new de,
                    this.texts = new ue,
                    this.fpsDetector = new ve,
                    this.border = {
                        left: 0,
                        top: 0,
                        right: 22e3,
                        bottom: 22e3
                    },
                    this.camera = {
                        x: 0,
                        y: 0,
                        zoom: 1,
                        target: {
                            x: 0,
                            y: 0,
                            zoom: .15
                        },
                        bound: {
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0
                        }
                    },
                    this.mouse = {
                        x: 0,
                        y: 0,
                        worldX: 0,
                        worldY: 0
                    },
                    this.canvasCenter = {
                        x: 0,
                        y: 0
                    },
                    this.settings = y,
                    window.addEventListener("resize", this.resizeCanvas.bind(this)),
                    window.onmousemove = this.onMouseMove.bind(this),
                    this.canvas.onwheel = this.onMouseWheel.bind(this),
                    this.loadSettings(),
                    this.resizeCanvas(),
                    this.mouse.x = this.canvasCenter.x,
                    this.mouse.y = this.canvasCenter.y,
                    this.loop = this.loop.bind(this),
                    this.start()
                }
                ,
                (e = [{
                    key: "updateStatsHUD",
                    value: function(delta) { window.EonNativeMulti.updateStats(this, delta); }
                }, {
                    key: "loadSettings",
                    value: function() {
                        var t = this;
                        this.settings = ke(ke({}, this.settings), this.app.settings.getAll()),
                        "low" === this.app.settings.get("renderQuality") && (this.settings.pixelDensityFactor = .5),
                        "medium" === this.app.settings.get("renderQuality") && (this.settings.pixelDensityFactor = .7),
                        "high" === this.app.settings.get("renderQuality") && (this.settings.pixelDensityFactor = 1),
                        this.updateTheme(),
                        this.app.settings.on("change", function(e, n) {
                            t.settings[e] = n,
                            "renderQuality" === e && ("low" === n && (t.settings.pixelDensityFactor = .5),
                            "medium" === n && (t.settings.pixelDensityFactor = .7),
                            "high" === n && (t.settings.pixelDensityFactor = 1),
                            t.resizeCanvas()),
                            e.startsWith("theme") && t.updateTheme(),
                            "showCellGradient" === e && t.loadCellGradient(),
                            "cellGradientStrength" === e && t.loadCellGradient(),
                            "coloredNames" !== e && "coloredMass" !== e && "showNicknameStroke" !== e && "showMassStroke" !== e && "myNicknameColor" !== e && "myMassColor" !== e || (t.texts.nicknameCache.clear(),
                            t.texts.massCache.clear())
                        })
                    }
                }, {
                    key: "resizeCanvas",
                    value: function() {
                        var t = this.settings.pixelDensityFactor
                          , e = Math.round(window.innerWidth * t)
                          , n = Math.round(window.innerHeight * t);
                        this.canvas.width = e,
                        this.canvas.height = n,
                        this.canvasCenter = {
                            x: this.canvas.width >> 1,
                            y: this.canvas.height >> 1
                        }
                    }
                }, {
                    key: "onMouseMove",
                    value: function(t) {
                        this.mouse.x = t.clientX,
                        this.mouse.y = t.clientY;
                        this.app.controls?.pointer(t)
                    }
                }, {
                    key: "onMouseWheel",
                    value: function(t) {
                        if (!this.app.lobby.isVisible) {
                            var e = t.deltaY > 0
                              , n = this.border
                              , r = 14142 / (n.right - n.left) * .02
                              , i = this.settings.zoomSpeed
                              , o = this.camera.target.zoom;
                            e ? o *= i : o /= i,
                            o = o > .6 ? .6 : o < r ? r : o,
                            this.camera.target.zoom = o
                        }
                    }
                }, {
                    key: "start",
                    value: function() {
                        this.runtime = performance.now(),
                        this.nextTimeRemaining = this.runtime + 500,
                        this.nextStatsTime = this.runtime + 500,
                        this.nextMacroTime = this.runtime + this.settings.macroFeedInterval,
                        this._prevMacroFeed = !1,
                        this._prevMacroFeedClientId = null,
                        this.nextSendCursorTime = this.runtime + this.settings.sendCursorInterval,
                        this.nextCacheCleanupTime = this.runtime + this.settings.cacheCleanupInterval,
                        this.loop(this.runtime)
                    }
                }, {
                    key: "loop",
                    value: function(t) {
                        this.fpsDetector.updateRafTime(t);
                        var e = this.fpsDetector.shouldRender(t)
                          , n = t - this.runtime;
                        this.runtime = t,
                        this.deltaTime = n,
                        this.update(n, t),
                        e && (this.draw(),
                        this.app.minimap && this.app.minimap.draw()),
                        requestAnimationFrame(this.loop)
                    }
                }, {
                    key: "update",
                    value: function(delta, time) {
                        this.cellsFrame.length = this.cellsFrameRemoved.length = this.cellsFrameFood.length = this.cellsFrameVirus.length = 0;
                        const client = this.app.gameConnection.current;
                        if (client) Object.assign(this.border, client.border);
                        if (time >= this.nextTimeRemaining) {
                            this.nextTimeRemaining = time + 1000;
                            if (client && client.timeRemaining !== this.timeRemaining) {
                                this.timeRemaining = client.timeRemaining;
                                this.app.hud.updateServerTimer("SENPA", this.timeRemaining);
                            }
                        }
                        if (time >= this.nextStatsTime) { this.nextStatsTime = time + 500; this.updateStatsHUD(delta); }
                        client?.syncMacroFeed(!!this.app.input.isMacroFeedActive);
                        if (time >= this.nextCacheCleanupTime) { this.nextCacheCleanupTime = time + this.settings.cacheCleanupInterval; this.texts.clearCache(time); }
                        this.updateCamera(); this.updateCameraBound();
                        this.updateMouseWorldPosition();
                        if (!this.app.controls && time >= this.nextSendCursorTime) { this.nextSendCursorTime = time + this.settings.sendCursorInterval; this.sendCursorPosition(); }
                        if (!client || (client.isSyncing && !this.app.gameConnection.clients.some(c =>
                            c !== client && c.clientReady && !c.isSyncing))) return;
                        const speed = this.settings.cellAnimationSpeed, eat = this.settings.showEatAnimation;
                        const sizeSpeed = this.settings.cellSizeAnimationSpeed, eatSpeed = this.settings.cellEatAnimationSpeed, spawnSpeed = this.settings.cellSpawnAnimationSpeed;
                        const replay = this.app.replayManager;
                        const animationDelta = client.isReplay && replay?.isReplay ? (replay.paused ? 0 : delta * replay.playbackRate) : delta;
                        // Each FFA socket receives its OWN viewport. Rendering only
                        // current.cellsToBeRendered made all other players/viruses/food
                        // vanish when Tab switched sockets. Merge both snapshots per frame.
                        // Prefer the authoritative OWN-cell instance when both sockets
                        // report the same global cell ID, so both colors/names stay stable.
                        const byId = new Map();
                        const removed = new Map();
                        const sources = [this.app.gameConnection.primary || client, ...this.app.gameConnection.clients.filter(c => c !== (this.app.gameConnection.primary || client))];
                        for (const source of sources) {
                            if (!source.clientReady || source.isSyncing) continue;
                            const sourceTime = window.EonSenpaMotion.time(source, time);
                            const adaptive = window.EonSenpaMotion.enabled(source);
                            const move = cell => cell.flags.isFood ?
                                cell.moveFood(animationDelta, sourceTime, eatSpeed, eat, spawnSpeed) :
                                cell.moveCell(animationDelta, sourceTime, speed, eat, adaptive, sizeSpeed, eatSpeed, spawnSpeed);
                            for (const cell of source.cellsToBeRendered) {
                                move(cell);
                                const existing = byId.get(cell.id);
                                // Own cells always outrank remote copies; primary
                                // socket wins ties even when Tab changes camera.
                                if (!existing || (!existing.clientOrigin && cell.clientOrigin))
                                    byId.set(cell.id, cell);
                            }
                            for (let i = source.cellsToBeRemoved.length - 1; i >= 0; i--) {
                                const cell = source.cellsToBeRemoved[i];
                                move(cell);
                                if (cell.fadeOutAnimationCompleted) {
                                    source.cellsToBeRemoved.splice(i, 1);
                                    source.cellPool.release(cell);
                                } else if (!removed.has(cell.id)) removed.set(cell.id, cell);
                            }
                        }
                        for (const cell of byId.values()) {
                            if (cell.flags.isVirus) this.cellsFrameVirus.push(cell);
                            if (cell.flags.isFood) this.cellsFrameFood.push(cell);
                            else this.cellsFrame.push(cell);
                        }
                        for (const [id, cell] of removed) if (!byId.has(id)) this.cellsFrameRemoved.push(cell);
                        this.cellsFrame.sort((a, b) => a.r === b.r ? a.id - b.id : a.r - b.r);
                    }
                }, {
                    key: "updateMouseWorldPosition",
                    value: function() {
                        if (this.app.input.isPaused)
                            this.mouse.worldX = this.camera.x,
                            this.mouse.worldY = this.camera.y;
                        else {
                            var t = this.settings.pixelDensityFactor
                              , e = this.camera.zoom * t;
                            this.mouse.worldX = this.camera.x + (this.mouse.x * t - this.canvasCenter.x) / e,
                            this.mouse.worldY = this.camera.y + (this.mouse.y * t - this.canvasCenter.y) / e
                        }
                    }
                }, {
                    key: "sendCursorPosition",
                    value: function() {
                        const client = this.app.gameConnection.current;
                        this.lockedCursorX = this.lockedCursorY = this.spectateTargetX = this.spectateTargetY = null;
                        if (!client || this.app.lobby.isVisible) return;
                        client.sendCursorPosition(this.mouse.worldX, this.mouse.worldY);
                    }
                }, {
                    key: "updateCameraBound",
                    value: function() {
                        var t = this.canvasCenter.x / (this.camera.zoom * this.settings.pixelDensityFactor)
                          , e = this.canvasCenter.y / (this.camera.zoom * this.settings.pixelDensityFactor);
                        this.camera.bound.left = this.camera.x - t,
                        this.camera.bound.right = this.camera.x + t,
                        this.camera.bound.top = this.camera.y - e,
                        this.camera.bound.bottom = this.camera.y + e
                    }
                }, {
                    key: "isInCameraView",
                    value: function(t, e, n) {
                        return t + n >= this.camera.bound.left && t - n <= this.camera.bound.right && e + n >= this.camera.bound.top && e - n <= this.camera.bound.bottom
                    }
                }, {
                    key: "updateCamera",
                    value: function() {
                        if (this.app.replayManager?.applyTrainingCamera(this)) return;
                        window.EonNativeMulti.updateCamera(this);
                    }
                }, {
                    key: "updateTheme",
                    value: function() {
                        var t = this;
                        if (this.settings.themeShowBackgroundImage && this.settings.themeBackgroundImage) {
                            var e = new Image;
                            e.crossOrigin = "Anonymous",
                            e.src = this.settings.themeBackgroundImage,
                            e.onload = function() {
                                t.bgImage = e
                            }
                        } else
                            this.bgImage = null;
                        this.loadCellGradient()
                    }
                }, {
                    key: "loadCellGradient",
                    value: function() {
                        var t = this;
                        if (this.settings.showCellGradient) {
                            var e = new Image;
                            e.crossOrigin = "Anonymous",
                            e.src = window.EonAssets?.gradient || "/assets/images/cell_gradient.png",
                            e.onload = function() {
                                var n = document.createElement("canvas")
                                  , r = n.getContext("2d");
                                if (r) {
                                    var i = 512;
                                    n.width = i,
                                    n.height = i;
                                    var o = t.settings.cellGradientStrength;
                                    r.globalAlpha = {
                                        1: .3,
                                        2: .5,
                                        3: .7
                                    }[o] || .5,
                                    r.save(),
                                    r.beginPath(),
                                    r.arc(256, 256, 256, 0, 2 * Math.PI),
                                    r.closePath(),
                                    r.clip(),
                                    r.drawImage(e, 0, 0, i, i),
                                    r.restore(),
                                    t.cellGradientImage = n
                                } else
                                    t.cellGradientImage = null
                            }
                            ,
                            e.onerror = function() {
                                t.cellGradientImage = null
                            }
                        } else
                            this.cellGradientImage = null
                    }
                }, {
                    key: "drawGrid",
                    value: function() {
                        var t = this.canvas.width / this.camera.zoom
                          , e = this.canvas.height / this.camera.zoom
                          , n = (-this.camera.x + t / 2) % 50
                          , r = (-this.camera.y + e / 2) % 50;
                        for (this.ctx.save(),
                        this.ctx.strokeStyle = this.settings.themeGridColor,
                        this.ctx.lineWidth = 1,
                        this.ctx.globalAlpha = 1 * this.camera.zoom,
                        this.ctx.beginPath(); n < t; n += 50) {
                            var i = n * this.camera.zoom - .5;
                            this.ctx.moveTo(i, 0),
                            this.ctx.lineTo(i, e * this.camera.zoom)
                        }
                        for (; r < e; r += 50) {
                            var o = r * this.camera.zoom - .5;
                            this.ctx.moveTo(0, o),
                            this.ctx.lineTo(t * this.camera.zoom, o)
                        }
                        this.ctx.stroke(),
                        this.ctx.globalAlpha = 1,
                        this.ctx.restore()
                    }
                }, {
                    key: "drawBorder",
                    value: function() {
                        var t = this.settings.themeBorderWidth;
                        this.ctx.lineWidth = t,
                        this.ctx.lineCap = "round",
                        this.ctx.lineJoin = "round",
                        this.ctx.strokeStyle = this.settings.themeBorderColor,
                        this.ctx.beginPath(),
                        this.ctx.moveTo(this.border.left - t, this.border.bottom + t),
                        this.ctx.lineTo(this.border.right + t, this.border.bottom + t),
                        this.ctx.lineTo(this.border.right + t, this.border.top - t),
                        this.ctx.lineTo(this.border.left - t, this.border.top - t),
                        this.ctx.closePath(),
                        this.ctx.stroke()
                    }
                }, {
                    key: "drawCursorLines",
                    value: function() {
                        var t = this.app.gameConnection.current;
                        if (t && t.isAlive) {
                            var e = t.player.cells;
                            this.ctx.lineWidth = 4,
                            this.ctx.globalAlpha = .75,
                            this.ctx.strokeStyle = this.settings.themeCursorLinesColor,
                            this.ctx.beginPath();
                            for (var n = 0; n < e.length; n++)
                                this.ctx.moveTo(e[n].x, e[n].y),
                                this.ctx.lineTo(this.mouse.worldX, this.mouse.worldY);
                            this.ctx.stroke(),
                            this.ctx.globalAlpha = 1
                        }
                    }
                }, {
                    key: "drawVirusesRange",
                    value: function(t) {
                        if (t.length) {
                            this.ctx.globalAlpha = .04,
                            this.ctx.fillStyle = this.settings.virusRangeColor,
                            this.ctx.beginPath();
                            for (var e = 0; e < t.length; e++) {
                                var n = t[e]
                                  , r = n.x
                                  , i = n.y
                                  , o = n.r + 820;
                                this.ctx.moveTo(r, i),
                                this.ctx.arc(r, i, o, 0, this.pi2, !1)
                            }
                            this.ctx.fill(),
                            this.ctx.globalAlpha = 1
                        }
                    }
                }, {
                    key: "drawVirusShape",
                    value: function(t) {
                        t.drawCompleted = !0;
                        var e = t.globalAlpha
                          , n = this.pi2 / 50
                          , r = t.r;
                        this.ctx.beginPath(),
                        this.ctx.moveTo(t.x, t.y + r + 3);
                        for (var i = 1; i < 50; i++) {
                            var o = i * n
                              , a = r - 3 + (1 & i ? 0 : 6);
                            this.ctx.lineTo(t.x + Math.sin(o) * a, t.y + Math.cos(o) * a)
                        }
                        this.ctx.lineTo(t.x, t.y + r + 3),
                        this.ctx.closePath(),
                        this.ctx.globalAlpha = e * (this.settings.virusTransparency / 100),
                        this.ctx.fillStyle = this.settings.virusColor,
                        this.ctx.fill(),
                        this.ctx.globalAlpha = e,
                        this.ctx.strokeStyle = this.settings.virusStrokeColor,
                        this.ctx.lineWidth = Math.min(Math.max(~~(t.r / 50), 10), t.r / 2),
                        this.ctx.stroke();
                        var s = 3 * (t.r - 100);
                        s > 0 && (this.ctx.fillStyle = this.settings.virusStrokeColor,
                        this.ctx.beginPath(),
                        this.ctx.arc(t.x, t.y, s, 0, this.pi2),
                        this.ctx.fill()),
                        this.ctx.globalAlpha = 1
                    }
                }, {
                    key: "drawCell",
                    value: function(t) {
                        var e = t.globalAlpha;
                        this.ctx.globalAlpha = e;
                        // Food has neither skins nor emoji/name metadata. Avoid
                        // their lookups and temporary objects for every pellet.
                        if (t.flags.isFood) {
                            if (!this.settings.showFood) return;
                            this.ctx.beginPath();
                            this.ctx.arc(t.x, t.y, t.r, 0, this.pi2, !1);
                            this.ctx.closePath();
                            this.ctx.fillStyle = this.settings.rainbowFood ? t.colorHex : this.settings.foodColor;
                            this.ctx.fill();
                            return;
                        }
                        const emoteAppearance = window.EonSenpaEmotes.appearance(this, t);
                        var n, r = null, i = t.skin, o = null;
                        (o = window.EonSenpaSkins.localSkin(this.app, t) || (t.playerId && (null === (n = this.app.player.chat) || void 0 === n || null === (n = n.getPlayerByTabId(t.playerId)) || void 0 === n ? void 0 : n.getCustomSkin())),
                        this.settings.showGlobalSkins && (o && this.settings.showSkins ? ((r = this.skinCache.get(o)) && r.isAnimated && !this.settings.showGifSkins && (r = null),
                        r && !r.complete && (r = null)) : i && this.settings.showVanillaSkins && ((r = this.skinCache.get(i)) && r.isAnimated && !this.settings.showGifSkins && (r = null),
                        r && !r.complete && (r = null))),
                        this.ctx.beginPath(),
                        this.ctx.arc(t.x, t.y, t.r, 0, this.pi2, !1),
                        this.ctx.closePath());
                        if (t.flags.isVirus)
                            this.drawVirusShape(t);
                        else {
                            const multiSession = this.app.gameConnection;
                            const dualVisual = window.EonDualFFA?.visualState?.(t, multiSession, this.settings) || null;
                            const dualActive = !!dualVisual;
                            var a = dualActive || (multiSession.current?.tabs.length || 0) >= 2
                              , s = !!t.clientOrigin && a
                              , c = s && this.settings.themeUseMultiboxCellColor
                              , l = t.colorHex;
                            if (c) {
                                if (dualActive) {
                                    l = dualVisual.fill; // active = white; inactive = red
                                    // Do NOT disable skins. Add a subtle tint over images below.
                                } else {
                                    var u = multiSession.current;
                                    l = t.clientOrigin.index === u.tabIndex ? this.settings.themeMultiboxCellColor : this.settings.themeMultiboxCellColorInactive;
                                }
                            }
                            var h = null
                              , f = !1
                              , d = !1;
                            if (r && (f = (h = r).isEmpty,
                            d = h.hasTransparency),
                            this.ctx.globalAlpha = e * (this.app.replayManager?.isReplay && t.replayType === 0 ? this.app.replayManager.opacity : this.settings.cellsTransparency / 100),
                            (!h || f || d) && (this.ctx.fillStyle = c ? l : t.colorHex,
                            this.ctx.fill(),
                            !this.cellGradientImage || t.flags.isEject || h && !f || this.ctx.drawImage(this.cellGradientImage, t.x - t.r, t.y - t.r, 2 * t.r, 2 * t.r)),
                            h && this.ctx.drawImage(h.image, t.x - emoteAppearance.radius, t.y - emoteAppearance.radius, 2 * emoteAppearance.radius, 2 * emoteAppearance.radius),
                            window.EonSenpaEmotes.draw(this, t, emoteAppearance),
                            this.ctx.globalAlpha = e,
                            c && dualActive && h && !f) {
                                // Opaque skins still show fully, with a gentle red/white
                                // identity tint so the setting never hides the skin.
                                this.ctx.globalAlpha = e * Math.min(1, (this.settings.cellsTransparency ?? 100)/100) * .23;
                                this.ctx.fillStyle = l;
                                this.ctx.fill();
                                this.ctx.globalAlpha = e;
                            }
                            if (s && !this.settings.themeUseMultiboxCellColor && t.clientOrigin) {
                                var p = this.app.gameConnection.current
                                  , y = dualActive ? dualVisual.active : t.clientOrigin.index === p.tabIndex
                                  , v = this.settings.themeMultiboxRingWidth;
                                // Multi rings are drawn ONLY in ring mode; cell-color mode hides all outlines.
                                this.ctx.lineWidth = t.r / 100 * v,
                                this.ctx.strokeStyle = dualActive ? dualVisual.ring :
                                    y ? this.settings.themeMultiboxRingColor : this.settings.themeMultiboxRingColorInactive;
                                var g = t.r - (this.ctx.lineWidth >> 1);
                                this.ctx.beginPath(),
                                this.ctx.arc(t.x, t.y, g, 0, this.pi2),
                                this.ctx.closePath(),
                                this.ctx.stroke()
                            }
                            var m = !!t.clientOrigin
                              , b = this.settings.showNames
                              , w = this.settings.showMass
                              , S = !1
                              , k = .88;
                            const nameClient = this.app.gameConnection.current;
                            const nameOwner = nameClient?.playerClients.get(nameClient.players.get(t.playerId)?.clientId);
                            const serverTextColor = window.EonSenpaProtocol.nameColor(nameOwner);
                            const cellNickname = nameOwner?.nickname ?? t.nickname;
                            if ((m && this.settings.showMyNames || !m && b) && cellNickname) {
                                var C = t.r * this.camera.zoom * 1
                                  , I = this.settings.coloredNames ? t.colorHex : this.settings.textNicknameColor;
                                m && (I = this.settings.myNicknameColor);
                                I = serverTextColor || I;
                                var x = this.texts.nick(cellNickname, I, this.settings.showNicknameStroke, C, this.settings.autoHideNames);
                                if (x) {
                                    var E = x.originW * t.r * 1
                                      , T = x.originH * t.r * 1;
                                    this.ctx.drawImage(x.canvas, t.x - (E >> 1), t.y - (T >> 1), E, T),
                                    S = !0
                                }
                                if (nameOwner?.clanTag) {
                                    const clan = this.texts.nick(nameOwner.clanTag, I, this.settings.showNicknameStroke, C, this.settings.autoHideNames);
                                    if (clan) {
                                        // Senpa displays clan tags at 55% of nickname size,
                                        // centered 0.3 cell radii above the player's name.
                                        const width = clan.originW * t.r * .55;
                                        const height = clan.originH * t.r * .55;
                                        this.ctx.drawImage(clan.canvas, t.x - width / 2, t.y - t.r * .3 - height / 2, width, height);
                                    }
                                }
                            }
                            if (m && this.settings.showMyMass || !m && w) {
                                var _ = t.r * this.camera.zoom * k
                                  , A = t.mass > 999 && "shortened" === this.settings.cellMassFormat ? (t.mass / 100 | 0) / 10 + "k" : String(t.mass)
                                  , P = t.splitMass
                                  , O = P > 999 && "shortened" === this.settings.cellMassFormat ? (P / 100 | 0) / 10 + "k" : String(P)
                                  , M = this.settings.coloredMass ? t.colorHex : this.settings.textMassColor;
                                m && (M = this.settings.myMassColor);
                                M = serverTextColor || M;
                                var L = this.texts.mass(t.id, A, t.mass, M, this.settings.showMassStroke, _, this.settings.autoHideMass)
                                  , U = this.texts.mass(-t.id - 1, O, P, serverTextColor || "#b67e05", this.settings.showMassStroke, t.r * this.camera.zoom * .5, this.settings.autoHideMass);
                                if (L) {
                                    var F = L.originW * t.r * k
                                      , B = L.originH * t.r * k
                                      , j = S ? t.y + t.r / 5 : t.y - (B >> 1);
                                    if (this.ctx.drawImage(L.canvas, t.x - (F >> 1), j, F, B),
                                    U) {
                                        var R = U.originW * t.r * .5
                                          , W = U.originH * t.r * .5
                                          , N = j + .82 * B;
                                        this.ctx.drawImage(U.canvas, t.x - (R >> 1), N, R, W)
                                    }
                                }
                            }
                            this.ctx.globalAlpha = 1,
                            t.drawCompleted = !0
                        }
                    }
                }, {
                    key: "drawSpectateIndicator",
                    value: function() {
                        if (this.spectateTargetX && this.spectateTargetY) {
                            var t = this.spectateTargetX
                              , e = this.spectateTargetY;
                            this.ctx.save(),
                            this.ctx.strokeStyle = "#ff0000",
                            this.ctx.lineWidth = 15,
                            this.ctx.globalAlpha = .7,
                            this.ctx.setLineDash([15, 15]),
                            this.ctx.beginPath(),
                            this.ctx.arc(t, e, 250, 0, this.pi2),
                            this.ctx.stroke(),
                            this.ctx.restore()
                        }
                    }
                }, {
                    key: "drawDebugViewport",
                    value: function(t, e, n, r, i, o, a) {
                        this.ctx.strokeStyle = o,
                        this.ctx.lineWidth = a,
                        this.ctx.fillStyle = "white",
                        this.ctx.font = "100px sans-serif",
                        this.ctx.textAlign = "end",
                        this.ctx.textBaseline = "hanging",
                        this.ctx.fillText(t, r, n),
                        this.ctx.beginPath(),
                        this.ctx.moveTo(e, n),
                        this.ctx.lineTo(r, n),
                        this.ctx.lineTo(r, i),
                        this.ctx.lineTo(e, i),
                        this.ctx.closePath(),
                        this.ctx.stroke()
                    }
                }, {
                    key: "draw",
                    value: function() {
                        this.ctx.fillStyle = this.settings.themeBackgroundColor,
                        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height),
                        this.settings.showGrid && null === this.bgImage && this.drawGrid(),
                        this.ctx.save(),
                        this.matrix.reset();
                        var t = this.camera.zoom * this.settings.pixelDensityFactor
                          , e = this.canvasCenter.x - this.camera.x * t
                          , n = this.canvasCenter.y - this.camera.y * t;
                        this.matrix.translate(e, n),
                        this.matrix.scale(t, t),
                        this.matrix.setContextTransform(this.ctx),
                        this.settings.themeShowBackgroundImage && this.bgImage && this.ctx.drawImage(this.bgImage, this.border.left, this.border.top, this.border.right - this.border.left, this.border.bottom - this.border.top),
                        this.settings.showBorder && this.drawBorder(),
                        this.settings.showCursorLines && this.drawCursorLines(),
                        this.settings.showVirusRange && this.drawVirusesRange(this.cellsFrameVirus);
                        for (var r = 0; r < this.cellsFrameRemoved.length; r++) {
                            var i = this.cellsFrameRemoved[r];
                            this.isInCameraView(i.x, i.y, i.r) && this.drawCell(i)
                        }
                        if (this.settings.showFood)
                            for (var o = 0; o < this.cellsFrameFood.length; o++) {
                                var a = this.cellsFrameFood[o];
                                this.isInCameraView(a.x, a.y, a.r) && this.drawCell(a)
                            }
                        for (var s = 0; s < this.cellsFrame.length; s++) {
                            var c = this.cellsFrame[s];
                            this.isInCameraView(c.x, c.y, c.r) && this.drawCell(c)
                        }
                        this.drawSpectateIndicator();
                        for (var l = 0; l < this.waves.length; l++) {
                            var u = this.waves[l];
                            u.finished ? (this.waves.splice(l, 1),
                            l--) : this.isInCameraView(u.x, u.y, u.waveSize) && u.draw(this.ctx)
                        }
                        if (this.settings.debugViewport)
                            for (var h = 0; h < this.app.gameConnection.clients.length; h++) {
                                var f = this.app.gameConnection.clients[h];
                                f.updateBound(),
                                this.drawDebugViewport("Server Viewport", f.bound.left, f.bound.top, f.bound.right, f.bound.bottom, "#00ffff", 15)
                            }
                        this.ctx.restore();
                        this.app.replayManager?.drawTrainingOverlay(this)
                    }
                }, {
                    key: "createWave",
                    value: function(t, e, n) {
                        this.waves.push(new be(t,e,n))
                    }
                }]) && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1,
                        r.configurable = !0,
                        "value"in r && (r.writable = !0),
                        Object.defineProperty(t, Ie(r.key), r)
                    }
                }(t.prototype, e),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                t;
                var t, e
            }();
            function Ee(t) {
                return Ee = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                Ee(t)
            }
            function Te(t) {
                return function(t) {
                    if (Array.isArray(t))
                        return Ae(t)
                }(t) || function(t) {
                    if ("undefined" != typeof Symbol && null != t[Symbol.iterator] || null != t["@@iterator"])
                        return Array.from(t)
                }(t) || _e(t) || function() {
                    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                }()
            }
            function _e(t, e) {
                if (t) {
                    if ("string" == typeof t)
                        return Ae(t, e);
                    var n = {}.toString.call(t).slice(8, -1);
                    return "Object" === n && t.constructor && (n = t.constructor.name),
                    "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ae(t, e) : void 0
                }
            }
            function Ae(t, e) {
                (null == e || e > t.length) && (e = t.length);
                for (var n = 0, r = Array(e); n < e; n++)
                    r[n] = t[n];
                return r
            }
            function Pe(t) {
                var e = function(t) {
                    if ("object" != Ee(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != Ee(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == Ee(e) ? e : e + ""
            }
            function Me(t) {
                return Me = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                Me(t)
            }
            function Le() {
                var t, e, n = "function" == typeof Symbol ? Symbol : {}, r = n.iterator || "@@iterator", i = n.toStringTag || "@@toStringTag";
                function o(n, r, i, o) {
                    var c = r && r.prototype instanceof s ? r : s
                      , l = Object.create(c.prototype);
                    return Ue(l, "_invoke", function(n, r, i) {
                        var o, s, c, l = 0, u = i || [], h = !1, f = {
                            p: 0,
                            n: 0,
                            v: t,
                            a: d,
                            f: d.bind(t, 4),
                            d: function(e, n) {
                                return o = e,
                                s = 0,
                                c = t,
                                f.n = n,
                                a
                            }
                        };
                        function d(n, r) {
                            for (s = n,
                            c = r,
                            e = 0; !h && l && !i && e < u.length; e++) {
                                var i, o = u[e], d = f.p, p = o[2];
                                n > 3 ? (i = p === r) && (c = o[(s = o[4]) ? 5 : (s = 3,
                                3)],
                                o[4] = o[5] = t) : o[0] <= d && ((i = n < 2 && d < o[1]) ? (s = 0,
                                f.v = r,
                                f.n = o[1]) : d < p && (i = n < 3 || o[0] > r || r > p) && (o[4] = n,
                                o[5] = r,
                                f.n = p,
                                s = 0))
                            }
                            if (i || n > 1)
                                return a;
                            throw h = !0,
                            r
                        }
                        return function(i, u, p) {
                            if (l > 1)
                                throw TypeError("Generator is already running");
                            for (h && 1 === u && d(u, p),
                            s = u,
                            c = p; (e = s < 2 ? t : c) || !h; ) {
                                o || (s ? s < 3 ? (s > 1 && (f.n = -1),
                                d(s, c)) : f.n = c : f.v = c);
                                try {
                                    if (l = 2,
                                    o) {
                                        if (s || (i = "next"),
                                        e = o[i]) {
                                            if (!(e = e.call(o, c)))
                                                throw TypeError("iterator result is not an object");
                                            if (!e.done)
                                                return e;
                                            c = e.value,
                                            s < 2 && (s = 0)
                                        } else
                                            1 === s && (e = o.return) && e.call(o),
                                            s < 2 && (c = TypeError("The iterator does not provide a '" + i + "' method"),
                                            s = 1);
                                        o = t
                                    } else if ((e = (h = f.n < 0) ? c : n.call(r, f)) !== a)
                                        break
                                } catch (e) {
                                    o = t,
                                    s = 1,
                                    c = e
                                } finally {
                                    l = 1
                                }
                            }
                            return {
                                value: e,
                                done: h
                            }
                        }
                    }(n, i, o), !0),
                    l
                }
                var a = {};
                function s() {}
                function c() {}
                function l() {}
                e = Object.getPrototypeOf;
                var u = [][r] ? e(e([][r]())) : (Ue(e = {}, r, function() {
                    return this
                }),
                e)
                  , h = l.prototype = s.prototype = Object.create(u);
                function f(t) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(t, l) : (t.__proto__ = l,
                    Ue(t, i, "GeneratorFunction")),
                    t.prototype = Object.create(h),
                    t
                }
                return c.prototype = l,
                Ue(h, "constructor", l),
                Ue(l, "constructor", c),
                c.displayName = "GeneratorFunction",
                Ue(l, i, "GeneratorFunction"),
                Ue(h),
                Ue(h, i, "Generator"),
                Ue(h, r, function() {
                    return this
                }),
                Ue(h, "toString", function() {
                    return "[object Generator]"
                }),
                (Le = function() {
                    return {
                        w: o,
                        m: f
                    }
                }
                )()
            }
            function Ue(t, e, n, r) {
                var i = Object.defineProperty;
                try {
                    i({}, "", {})
                } catch (t) {
                    i = 0
                }
                Ue = function(t, e, n, r) {
                    function o(e, n) {
                        Ue(t, e, function(t) {
                            return this._invoke(e, n, t)
                        })
                    }
                    e ? i ? i(t, e, {
                        value: n,
                        enumerable: !r,
                        configurable: !r,
                        writable: !r
                    }) : t[e] = n : (o("next", 0),
                    o("throw", 1),
                    o("return", 2))
                }
                ,
                Ue(t, e, n, r)
            }
            function Fe(t, e, n, r, i, o, a) {
                try {
                    var s = t[o](a)
                      , c = s.value
                } catch (t) {
                    return void n(t)
                }
                s.done ? e(c) : Promise.resolve(c).then(r, i)
            }
            function Be(t, e) {
                var n = Object.keys(t);
                if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(t);
                    e && (r = r.filter(function(e) {
                        return Object.getOwnPropertyDescriptor(t, e).enumerable
                    })),
                    n.push.apply(n, r)
                }
                return n
            }
            function je(t) {
                for (var e = 1; e < arguments.length; e++) {
                    var n = null != arguments[e] ? arguments[e] : {};
                    e % 2 ? Be(Object(n), !0).forEach(function(e) {
                        Re(t, e, n[e])
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Be(Object(n)).forEach(function(e) {
                        Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(n, e))
                    })
                }
                return t
            }
            function Re(t, e, n) {
                return (e = We(e))in t ? Object.defineProperty(t, e, {
                    value: n,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : t[e] = n,
                t
            }
            function We(t) {
                var e = function(t) {
                    if ("object" != Me(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != Me(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == Me(e) ? e : e + ""
            }
            function Ne(t, e, n) {
                return e = De(e),
                function(t, e) {
                    if (e && ("object" == Me(e) || "function" == typeof e))
                        return e;
                    if (void 0 !== e)
                        throw new TypeError("Derived constructors may only return object or undefined");
                    return function(t) {
                        if (void 0 === t)
                            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                        return t
                    }(t)
                }(t, He() ? Reflect.construct(e, n || [], De(t).constructor) : e.apply(t, n))
            }
            function He() {
                try {
                    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}))
                } catch (t) {}
                return (He = function() {
                    return !!t
                }
                )()
            }
            function De(t) {
                return De = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t) {
                    return t.__proto__ || Object.getPrototypeOf(t)
                }
                ,
                De(t)
            }
            function Ge(t, e) {
                return Ge = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t, e) {
                    return t.__proto__ = e,
                    t
                }
                ,
                Ge(t, e)
            }
            var ze = {
                macroFeed: "w",
                split: " ",
                doubleSplit: "q",
                tripleSplit: "",
                maxSplit: "Shift",
                switchPlayer: "Tab",
                toggleSpectateMode: "x",
                saveReplay: "F8",
                toggleBots: "F6",
                toggleBotMode: "F2",
                toggleBotSplit: "F3",
                toggleBotFeed: "F4",
                toggleBotRespawn: "F7",
                pause: "r",
                toggleSkins: "s",
                clearChat: "",
                toggleChat: "",
                toggleMinimap: "",
                toggleStats: "",
                toggleLeaderboard: "",
                toggleHUD: "",
                toggleMyNames: "",
                toggleMyMass: "",
                emoji1: "1", emoji2: "2", emoji3: "3", emoji4: "4",
                command1: "1", command2: "2", command3: "3", command4: "4", command5: "5",
                command6: "6", command7: "7", command8: "8", command9: "9", command10: "0",
                sendWave: ""
            }
              , Ve = function(t) {
                function e(t) {
                    var n;
                    return function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, e),
                    (n = Ne(this, e)).isRebinding = !1,
                    n.restrictedKeys = ["Escape", "Enter"],
                    n.isPaused = !1,
                    n.app = t,
                    n.keybinds = je({}, ze),
                    n.states = {
                        macroFeed: !1,
                        split: !1,
                        doubleSplit: !1,
                        tripleSplit: !1,
                        maxSplit: !1,
                        switchPlayer: !1,
                        toggleSpectateMode: !1,
                        saveReplay: !1,
                        pause: !1,
                        toggleSkins: !1,
                        clearChat: !1,
                        toggleChat: !1,
                        toggleMinimap: !1,
                        toggleStats: !1,
                        toggleLeaderboard: !1,
                        toggleHUD: !1,
                        toggleMyNames: !1,
                        toggleMyMass: !1,
                        sendWave: !1
                    },
                    n.load(),
                    n.bindEvents(),
                    n
                }
                return function(t, e) {
                    if ("function" != typeof e && null !== e)
                        throw new TypeError("Super expression must either be null or a function");
                    t.prototype = Object.create(e && e.prototype, {
                        constructor: {
                            value: t,
                            writable: !0,
                            configurable: !0
                        }
                    }),
                    Object.defineProperty(t, "prototype", {
                        writable: !1
                    }),
                    e && Ge(t, e)
                }(e, t),
                n = e,
                r = [{
                    key: "togglePause",
                    value: function() {
                        this.isPaused = !this.isPaused,
                        this.app.hud.togglePauseHUD(this.isPaused)
                    }
                }, {
                    key: "load",
                    value: function() {
                        var t = localStorage.getItem("eon_keybinds");
                        if (t)
                            try {
                                var e = JSON.parse(t);
                                if (Object.prototype.hasOwnProperty.call(e, "customFeedRates")) {
                                    delete e.customFeedRates;
                                    localStorage.setItem("eon_settings", JSON.stringify(e));
                                }
                                this.keybinds = je(je({}, ze), e);
                                window.EonSenpaEmotes.migrate(this, e);
                                if (!("toggleSpectateMode" in e) && Object.values(e).some(key => typeof key === "string" && /^(x|keyx)$/i.test(key))) {
                                    this.keybinds.toggleSpectateMode = "None";
                                }
                                if (!("toggleBots" in e) && Object.values(e).some(key => typeof key === "string" && /^f6$/i.test(key))) this.keybinds.toggleBots = "None";
                                for (const action of ["toggleBotMode", "toggleBotSplit", "toggleBotFeed", "toggleBotRespawn"]) {
                                    if (!(action in e) && Object.values(e).some(key => typeof key === "string" && key.toLowerCase() === ze[action].toLowerCase())) this.keybinds[action] = "None";
                                }
                                if (!("saveReplay" in e) && Object.values(e).some(key => typeof key === "string" && /^f8$/i.test(key))) {
                                    this.keybinds.saveReplay = "None";
                                }
                            } catch (t) {
                                console.error(t)
                            }
                    }
                }, {
                    key: "save",
                    value: function() {
                        localStorage.setItem("eon_keybinds", JSON.stringify(this.keybinds))
                    }
                }, {
                    key: "getKeybinds",
                    value: function() {
                        return je({}, this.keybinds)
                    }
                }, {
                    key: "setKeybind",
                    value: function(t, e) {
                        if ("" === e)
                            return this.keybinds[t] = "None",
                            this.save(),
                            !0;
                        if (this.restrictedKeys.includes(e) && "Escape" !== e)
                            return !1;
                        window.EonSenpaEmotes.clearConflicts(this, t, e);
                        return this.keybinds[t] = e,
                        this.save(),
                        !0
                    }
                }, {
                    key: "getAction",
                    value: function(t) {
                        var e = this;
                        if (t) {
                            var n = t.toLowerCase()
                              , o = n;
                            n.startsWith("key") && 4 === n.length ? o = n[3] : n.startsWith("digit") ? o = n.slice(5) : "space" === n ? o = " " : n.startsWith("shift") ? o = "shift" : n.startsWith("control") ? o = "control" : n.startsWith("alt") ? o = "alt" : n.startsWith("numpad") ? o = n.slice(6) : o = o;
                            return Object.keys(this.keybinds).find(function(t) {
                                var r = e.keybinds[t];
                                return "string" == typeof r && !(!r || "None" === r) && (r.toLowerCase() === n || r.toLowerCase() === o)
                            })
                        }
                    }
                }, {
                    key: "bindEvents",
                    value: function() {
                        window.addEventListener("keydown", this.handleKeyDown.bind(this)),
                        window.addEventListener("keyup", this.handleKeyUp.bind(this)),
                        window.addEventListener("mousedown", this.handleMouseDown.bind(this)),
                        window.addEventListener("mouseup", this.handleMouseUp.bind(this)),
                        window.addEventListener("contextmenu", this.handleContextMenu.bind(this)),
                        window.addEventListener("blur", this.handleWindowBlur.bind(this)),
                        window.addEventListener("visibilitychange", this.handleVisibilityChange.bind(this))
                    }
                }, {
                    key: "cleanup",
                    value: function() {
                        window.removeEventListener("keydown", this.handleKeyDown.bind(this)),
                        window.removeEventListener("keyup", this.handleKeyUp.bind(this)),
                        window.removeEventListener("mousedown", this.handleMouseDown.bind(this)),
                        window.removeEventListener("mouseup", this.handleMouseUp.bind(this)),
                        window.removeEventListener("contextmenu", this.handleContextMenu.bind(this)),
                        window.removeEventListener("blur", this.handleWindowBlur.bind(this)),
                        window.removeEventListener("visibilitychange", this.handleVisibilityChange.bind(this))
                    }
                }, {
                    key: "getMouseButtonName",
                    value: function(t) {
                        switch (t) {
                        case 0:
                            return "Mouse Left";
                        case 1:
                            return "Mouse Middle";
                        case 2:
                            return "Mouse Right";
                        default:
                            return "Mouse ".concat(t)
                        }
                    }
                }, {
                    key: "handleKeyDown",
                    value: function(t) {
                        if (!(this.isRebinding || this.app.lobby && this.app.lobby.isVisible)) {
                            var e = t.target;
                            if ("INPUT" !== e.tagName && "TEXTAREA" !== e.tagName && !e.isContentEditable && !this.app.settingsMenu?.isVisible && !this.restrictedKeys.includes(t.key) && !this.restrictedKeys.includes(t.code)) {
                                "Tab" === t.key && t.preventDefault();
                                var n = this.getAction(t.code || t.key);
                                if (n?.startsWith("toggleBot") && (t.repeat || t.ctrlKey || t.altKey || t.metaKey)) return;
                                if (n) {
                                    if ("maxSplit" !== n || t.preventDefault(),
                                    " " === t.key && t.preventDefault(),
                                    "pause" === n)
                                        return void this.togglePause();
                                    if (this.app.lobby.isVisible)
                                        return;
                                    this.states[n] || (this.states[n] = !0,
                                    this.app.controls?.noteInput(t, n, true),
                                    this.triggerAction(n))
                                }
                            }
                        }
                    }
                }, {
                    key: "handleKeyUp",
                    value: function(t) {
                        if (!this.isRebinding) {
                            var e = this.getAction(t.code || t.key);
                            if (e) {
                                this.states[e] = !1;
                                if (e === "macroFeed") {
                                    this.app.controls?.noteInput(t, e, false);
                                    this.app.gameConnection.current?.syncMacroFeed(false);
                                }
                            }
                        }
                    }
                }, {
                    key: "handleWindowBlur",
                    value: function() {
                        Object.keys(this.states).filter(window.EonSenpaEmotes.communication).forEach(action => { this.states[action] = false; });
                        this.states.macroFeed = !1,
                        this.states.split = !1,
                        this.states.doubleSplit = !1,
                        this.states.tripleSplit = !1,
                        this.states.maxSplit = !1,
                        this.states.switchPlayer = !1,
                        this.states.toggleSpectateMode = !1,
                        this.states.saveReplay = !1,
                        this.app.gameConnection.current?.stopAllFeeding(),
                        this.states.pause = !1,
                        this.states.toggleSkins = !1,
                        this.states.clearChat = !1,
                        this.states.toggleChat = !1,
                        this.states.toggleMinimap = !1,
                        this.states.toggleStats = !1,
                        this.states.toggleLeaderboard = !1,
                        this.states.toggleHUD = !1,
                        this.states.toggleMyNames = !1,
                        this.states.toggleMyMass = !1,
                        this.states.sendWave = !1
                    }
                }, {
                    key: "handleVisibilityChange",
                    value: function() {
                        document.hidden && this.handleWindowBlur()
                    }
                }, {
                    key: "handleMouseDown",
                    value: function(t) {
                        if (!(this.isRebinding || this.app.lobby && this.app.lobby.isVisible || this.app.settingsMenu?.isVisible)) {
                            var e = t.target;
                            if ("INPUT" !== e.tagName && "TEXTAREA" !== e.tagName && !e.isContentEditable && !e.closest?.("button, a, select")) {
                                var n = this.getMouseButtonName(t.button)
                                  , r = this.getAction(n);
                                if (r) {
                                    if (!this.states[r]) {
                                        this.states[r] = !0;
                                        this.app.stage.mouse.x = t.clientX; this.app.stage.mouse.y = t.clientY;
                                        this.app.controls?.noteInput(t, r, true);
                                        this.triggerAction(r);
                                    }
                                }
                            }
                        }
                    }
                }, {
                    key: "handleMouseUp",
                    value: function(t) {
                        if (!this.isRebinding) {
                            var e = this.getMouseButtonName(t.button)
                              , n = this.getAction(e);
                            if (n) {
                                t.preventDefault(); this.states[n] = !1;
                                if (n === "macroFeed") {
                                    this.app.controls?.noteInput(t, n, false);
                                    this.app.gameConnection.current?.syncMacroFeed(false);
                                }
                            }
                        }
                    }
                }, {
                    key: "handleContextMenu",
                    value: function(t) {
                        if (this.isRebinding)
                            t.preventDefault();
                        else {
                            var e = t.target;
                            "INPUT" !== e.tagName && "TEXTAREA" !== e.tagName && t.preventDefault()
                        }
                    }
                }, {
                    key: "triggerAction",
                    value: function(t) {
                        if (window.EonSenpaEmotes.trigger(this.app, t)) return;
                        if (this.app.bots?.handleAction(t)) return;
                        if (t === "saveReplay") return void this.app.replayManager?.saveSnapshot();
                        if (this.app.replayManager?.isReplay && ["macroFeed", "switchPlayer", "toggleSpectateMode", "split", "doubleSplit", "tripleSplit", "maxSplit"].includes(t)) return;
                        var e = this.app.gameConnection.current;
                        if (e)
                            switch (t) {
                            case "macroFeed":
                                e.syncMacroFeed(this.isMacroFeedActive);
                                break;
                            case "split":
                                e.sendSplit();
                                break;
                            case "doubleSplit":
                                e.sendSplit(2);
                                break;
                            case "tripleSplit":
                                e.sendSplit(3);
                                break;
                            case "maxSplit":
                                e.sendSplit(4);
                                break;
                            case "switchPlayer":
                                this.app.lobby.swapTabs();
                                break;
                            case "toggleSpectateMode":
                                e.toggleSpectateMode();
                                break;
                            case "toggleSkins":
                                var n = this.app.settings.get("showGlobalSkins");
                                this.app.settings.set("showGlobalSkins", !n);
                                break;
                            case "clearChat":
                                this.app.chatBox.clear();
                                break;
                            case "toggleChat":
                                this.app.settings.set("showChat", !this.app.settings.get("showChat"));
                                break;
                            case "toggleMinimap":
                                this.app.settings.set("showMinimap", !this.app.settings.get("showMinimap"));
                                break;
                            case "toggleStats":
                                this.app.settings.set("showStats", !this.app.settings.get("showStats"));
                                break;
                            case "toggleLeaderboard":
                                this.app.settings.set("showLeaderboard", !this.app.settings.get("showLeaderboard"));
                                break;
                            case "toggleHUD":
                            case "toggleHUD":
                                this.app.settings.set("showHUD", !this.app.settings.get("showHUD"));
                                break;
                            case "toggleMyNames":
                                this.app.settings.set("showMyNames", !this.app.settings.get("showMyNames"));
                                break;
                            case "toggleMyMass":
                                this.app.settings.set("showMyMass", !this.app.settings.get("showMyMass"));
                                break;
                            case "sendWave":
                                if (this.app.player.chat && this.app.player.chat.isConnected) {
                                    var r = this.app.gameConnection.current;
                                    if (r && r.chatTab && r.chatTab.chatId) {
                                        var i = this.app.stage.border
                                          , o = -(i.left + i.right) / 2
                                          , a = -(i.top + i.bottom) / 2
                                          , s = this.app.stage.mouse.worldX + o
                                          , c = this.app.stage.mouse.worldY + a;
                                        this.app.player.chat.sendWave(r.chatTab.chatId, s, c)
                                    }
                                }
                                break
                            }
                    }
                }, {
                    key: "isMacroFeedActive",
                    get: function() {
                        return this.states.macroFeed
                    }
                }, {
                    key: "resetToDefaults",
                    value: function() {
                        this.keybinds = je({}, ze),
                        this.save()
                    }
                }, {
                    key: "rebind",
                    value: (i = Le().m(function t(e) {
                        var n = this;
                        return Le().w(function(t) {
                            for (; ; )
                                if (0 === t.n)
                                    return this.app.controls?.cancelFeed(),
                                    this.isRebinding = !0,
                                    t.a(2, new Promise(function(t) {
                                        var r = function() {
                                            window.removeEventListener("keydown", o, !0),
                                            window.removeEventListener("mousedown", o, !0),
                                            setTimeout(function() {
                                                window.removeEventListener("click", i, !0),
                                                window.removeEventListener("contextmenu", i, !0)
                                            }, 200)
                                        }
                                          , i = function(t) {
                                            return t.preventDefault(),
                                            t.stopPropagation(),
                                            !1
                                        }
                                          , o = function(i) {
                                            i.preventDefault(),
                                            i.stopPropagation();
                                            var o = "";
                                            if (i instanceof KeyboardEvent) {
                                                if ("Escape" === i.key)
                                                    return n.isRebinding = !1,
                                                    r(),
                                                    void t(n.keybinds[e]);
                                                o = "Delete" === i.key ? "" : i.code || i.key
                                            } else
                                                i instanceof MouseEvent && (o = n.getMouseButtonName(i.button));
                                            n.setKeybind(e, o),
                                            n.isRebinding = !1,
                                            r(),
                                            t("" === o ? "None" : o)
                                        };
                                        setTimeout(function() {
                                            window.addEventListener("keydown", o, !0),
                                            window.addEventListener("mousedown", o, !0),
                                            window.addEventListener("click", i, !0),
                                            window.addEventListener("contextmenu", i, !0)
                                        }, 50)
                                    }
                                    ))
                        }, t, this)
                    }),
                    o = function() {
                        var t = this
                          , e = arguments;
                        return new Promise(function(n, r) {
                            var o = i.apply(t, e);
                            function a(t) {
                                Fe(o, n, r, a, s, "next", t)
                            }
                            function s(t) {
                                Fe(o, n, r, a, s, "throw", t)
                            }
                            a(void 0)
                        }
                        )
                    }
                    ,
                    function(t) {
                        return o.apply(this, arguments)
                    }
                    )
                }],
                r && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1,
                        r.configurable = !0,
                        "value"in r && (r.writable = !0),
                        Object.defineProperty(t, We(r.key), r)
                    }
                }(n.prototype, r),
                Object.defineProperty(n, "prototype", {
                    writable: !1
                }),
                n;
                var n, r, i, o
            }(Tt.EventEmitter);
            function qe(t) {
                return qe = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                qe(t)
            }
            function Xe(t, e) {
                var n = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
                if (!n) {
                    if (Array.isArray(t) || (n = function(t, e) {
                        if (t) {
                            if ("string" == typeof t)
                                return Ye(t, e);
                            var n = {}.toString.call(t).slice(8, -1);
                            return "Object" === n && t.constructor && (n = t.constructor.name),
                            "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ye(t, e) : void 0
                        }
                    }(t)) || e && t && "number" == typeof t.length) {
                        n && (t = n);
                        var r = 0
                          , i = function() {};
                        return {
                            s: i,
                            n: function() {
                                return r >= t.length ? {
                                    done: !0
                                } : {
                                    done: !1,
                                    value: t[r++]
                                }
                            },
                            e: function(t) {
                                throw t
                            },
                            f: i
                        }
                    }
                    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                }
                var o, a = !0, s = !1;
                return {
                    s: function() {
                        n = n.call(t)
                    },
                    n: function() {
                        var t = n.next();
                        return a = t.done,
                        t
                    },
                    e: function(t) {
                        s = !0,
                        o = t
                    },
                    f: function() {
                        try {
                            a || null == n.return || n.return()
                        } finally {
                            if (s)
                                throw o
                        }
                    }
                }
            }
            function Ye(t, e) {
                (null == e || e > t.length) && (e = t.length);
                for (var n = 0, r = Array(e); n < e; n++)
                    r[n] = t[n];
                return r
            }
            function Ke(t) {
                var e = function(t) {
                    if ("object" != qe(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != qe(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == qe(e) ? e : e + ""
            }
            var Ze = window.EonSenpaMinimap.Minimap;
            function Je(t) {
                return Je = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                Je(t)
            }
            function Qe(t) {
                var e = function(t) {
                    if ("object" != Je(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != Je(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == Je(e) ? e : e + ""
            }
            var $e = function() {
                return t = function t(e) {
                    var n = this;
                    !function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, t),
                    this.isResizing = !1,
                    this.isVisible = !1,
                    this.resizeStartX = 0,
                    this.resizeStartY = 0,
                    this.resizeStartWidth = 0,
                    this.resizeStartHeight = 0,
                    this.resizeScale = 1,
                    this.emojis = [{
                        char: "🙂",
                        shortcuts: [":)"]
                    }, {
                        char: "😁",
                        shortcuts: [":D", "=D"]
                    }, {
                        char: "😂",
                        shortcuts: [":')"]
                    }, {
                        char: "🤣",
                        shortcuts: []
                    }, {
                        char: "😉",
                        shortcuts: [";)"]
                    }, {
                        char: "🥰",
                        shortcuts: []
                    }, {
                        char: "😎",
                        shortcuts: ["B)"]
                    }, {
                        char: "🤔",
                        shortcuts: [":thinking:"]
                    }, {
                        char: "😐",
                        shortcuts: [":|"]
                    }, {
                        char: "😮",
                        shortcuts: [":O", ":o"]
                    }, {
                        char: "😴",
                        shortcuts: ["zzz"]
                    }, {
                        char: "😭",
                        shortcuts: [":'("]
                    }, {
                        char: "😡",
                        shortcuts: [":@", ">:("]
                    }, {
                        char: "🤬",
                        shortcuts: [":!@#"]
                    }, {
                        char: "💀",
                        shortcuts: [":skull:"]
                    }, {
                        char: "🤡",
                        shortcuts: [":clown:"]
                    }, {
                        char: "👍",
                        shortcuts: [":+1:"]
                    }, {
                        char: "👎",
                        shortcuts: [":-1:"]
                    }, {
                        char: "👋",
                        shortcuts: [":wave:"]
                    }, {
                        char: "👌",
                        shortcuts: [":ok:"]
                    }, {
                        char: "✌",
                        shortcuts: [":peace:"]
                    }, {
                        char: "🤞",
                        shortcuts: [":cross:"]
                    }, {
                        char: "❤",
                        shortcuts: ["<3"]
                    }, {
                        char: "🧡",
                        shortcuts: ["<3O"]
                    }, {
                        char: "💛",
                        shortcuts: ["<3Y"]
                    }, {
                        char: "💚",
                        shortcuts: ["<3G"]
                    }, {
                        char: "💙",
                        shortcuts: ["<3B"]
                    }, {
                        char: "🖤",
                        shortcuts: ["<3K"]
                    }, {
                        char: "🤍",
                        shortcuts: ["<3W"]
                    }, {
                        char: "😘",
                        shortcuts: [":*", ":-*"]
                    }, {
                        char: "🔥",
                        shortcuts: [":fire:"]
                    }, {
                        char: "✨",
                        shortcuts: [":star:"]
                    }, {
                        char: "💯",
                        shortcuts: [":100:"]
                    }, {
                        char: "💩",
                        shortcuts: [":poop:"]
                    }, {
                        char: "🎉",
                        shortcuts: [":tada:"]
                    }, {
                        char: "👀",
                        shortcuts: [":eyes:"]
                    }, {
                        char: "👑",
                        shortcuts: [":crown:"]
                    }, {
                        char: "💎",
                        shortcuts: [":gem:"]
                    }, {
                        char: "🚀",
                        shortcuts: [":rocket:"]
                    }, {
                        char: "⚽",
                        shortcuts: [":soccer:"]
                    }, {
                        char: "🤝",
                        shortcuts: [":shake:"]
                    }, {
                        char: "🙏",
                        shortcuts: [":pray:"]
                    }, {
                        char: "💪",
                        shortcuts: [":muscle:"]
                    }, {
                        char: "🧠",
                        shortcuts: [":brain:"]
                    }],
                    this.app = e,
                    this.container = document.getElementById("chat-container"),
                    this.messagesContainer = document.getElementById("chat-messages"),
                    this.resizeHandle = document.getElementById("chat-resize"),
                    this.inputContainer = document.getElementById("chat-input-container"),
                    this.inputField = document.getElementById("chat-input"),
                    this.initResize(),
                    this.initInput(),
                    this.initEmojiPicker();
                    var r = function() {
                        if (n.container) {
                            var t = n.app.settings.get("showChat") && n.app.settings.get("showHUD");
                            n.container.style.display = t ? "flex" : "none"
                        }
                    };
                    this.app.settings.on("change:showChat", r),
                    this.app.settings.on("change:showHUD", r),
                    r(),
                    this.applyEventIsolation()
                }
                ,
                e = [{
                    key: "isInputActive",
                    get: function() {
                        return this.isVisible
                    }
                }, {
                    key: "clear",
                    value: function() {
                        this.messagesContainer && (this.messagesContainer.innerHTML = "")
                    }
                }, {
                    key: "applyEventIsolation",
                    value: function() {
                        var t = this
                          , e = ["mousedown", "mouseup", "mousemove", "click", "keydown", "keyup", "touchstart", "touchend", "touchmove", "wheel"]
                          , n = function(t) {
                            return t.stopPropagation()
                        };
                        this.container && e.forEach(function(e) {
                            return t.container.addEventListener(e, n)
                        }),
                        this.inputContainer && e.forEach(function(e) {
                            return t.inputContainer.addEventListener(e, n)
                        })
                    }
                }, {
                    key: "initResize",
                    value: function() {
                        var t = this;
                        this.resizeHandle && this.container && (this.resizeHandle.addEventListener("mousedown", function(e) {
                            t.container && (t.isResizing = !0,
                            t.resizeStartX = e.clientX,
                            t.resizeStartY = e.clientY,
                            t.resizeStartWidth = t.container.offsetWidth,
                            t.resizeStartHeight = t.container.offsetHeight,
                            t.resizeScale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scale")) || 1,
                            document.body.style.cursor = "nesw-resize",
                            e.preventDefault())
                        }),
                        window.addEventListener("mousemove", function(e) {
                            if (t.isResizing && t.container) {
                                var n = e.clientX - t.resizeStartX
                                  , r = e.clientY - t.resizeStartY
                                  , i = n / t.resizeScale
                                  , o = -r / t.resizeScale
                                  , a = Math.max(200, Math.min(window.innerWidth / t.resizeScale * .8, t.resizeStartWidth + i))
                                  , s = Math.max(150, Math.min(window.innerHeight / t.resizeScale * .8, t.resizeStartHeight + o));
                                t.container.style.width = "".concat(a, "px"),
                                t.container.style.height = "".concat(s, "px")
                            }
                        }),
                        window.addEventListener("mouseup", function() {
                            t.isResizing && (t.isResizing = !1,
                            document.body.style.cursor = "default")
                        }))
                    }
                }, {
                    key: "initInput",
                    value: function() {
                        var t = this;
                        window.addEventListener("keydown", function(e) {
                            if ("Enter" === e.key && !e.repeat && !e.isComposing) {
                                var n = document.activeElement;
                                if (n !== t.inputField && (n?.matches("input, textarea, select") || n?.isContentEditable))
                                    return;
                                e.preventDefault();
                                t.hasFocus || t.toggleInput()
                            }
                        }),
                        this.inputField && this.inputField.addEventListener("keydown", function(e) {
                            if ("Enter" === e.key && !e.isComposing) {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!e.repeat) t.toggleInput();
                            }
                        })
                    }
                }, {
                    key: "hasFocus",
                    get: function() {
                        return document.activeElement === this.inputField
                    }
                }, {
                    key: "toggleInput",
                    value: function() {
                        if (this.inputContainer && this.inputField && !this.app.lobby.isVisible && !this.app.settingsMenu?.isVisible)
                            if (this.isVisible)
                                if (this.hasFocus) {
                                    var t = this.inputField.value.trim();
                                    t.length > 0 ? (this.sendMessage(t),
                                    this.inputField.value = "",
                                    this.hideInput()) : this.hideInput()
                                } else
                                    this.hideInput();
                            else
                                this.showInput()
                    }
                }, {
                    key: "showInput",
                    value: function() {
                        this.inputContainer && this.inputField && (this.inputContainer.classList.add("active"),
                        this.inputField.value = "",
                        this.inputField.focus(),
                        this.isVisible = !0)
                    }
                }, {
                    key: "hideInput",
                    value: function() {
                        var t;
                        if (this.inputContainer && this.inputField) {
                            this.inputContainer.classList.remove("active"),
                            this.inputField.blur(),
                            this.isVisible = !1,
                            null === (t = document.getElementById("gameCanvas")) || void 0 === t || t.focus();
                            var e = document.getElementById("emoji-picker");
                            e && e.classList.remove("active")
                        }
                    }
                }, {
                    key: "hide",
                    value: function() {
                        this.container && (this.container.style.display = "none")
                    }
                }, {
                    key: "show",
                    value: function() {
                        this.container && (this.container.style.display = "flex")
                    }
                }, {
                    key: "sendMessage",
                    value: function(t) {
                        var e = this.app.gameConnection.current;
                        if (e && e.isConnected) {
                            var n = this.processShortcuts(t);
                            e.sendChat(1, n)
                        }
                    }
                }, {
                    key: "addMessage",
                    value: function(t, e, n, r, i) {
                        var o = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : new Date;
                        const reservedNameColor = arguments[6];
                        const nativeBadge = window.EonSenpaProtocol.chatBadge(arguments[7]);
                        if (this.messagesContainer) {
                            var a = document.createElement("div");
                            a.className = "chat-message-row",
                            "cmd" !== n && 2 !== n || a.classList.add("cmd");
                            var s = this.formatTime(o)
                              , c = this.app.settings.get("chatShowPlayerId") && r ? "[".concat(r, "]") : "";
                            a.innerHTML = '\n            <span class="chat-time">'.concat(s, '</span>\n            <span class="chat-id">').concat(c, '</span>\n            <span class="chat-nick"></span>\n            <span class="chat-text"></span>\n        ');
                            var l, u = a.querySelector(".chat-nick"), h = a.querySelector(".chat-text");
                            u && (u.textContent = t ? "".concat(t, ":") : "",
                            u.style.color = reservedNameColor || (i && this.app.settings.get("chatUseCellColor") ? i : this.app.settings.get("chatNickColor"))),
                            h && (h.textContent = e,
                            h.style.color = "cmd" === n || 2 === n ? this.app.settings.get("chatCommandColor") : this.app.settings.get("chatMessageColor")),
                            this.messagesContainer.prepend(a),
                            this.messagesContainer.children.length > 100 && (null === (l = this.messagesContainer.lastElementChild) || void 0 === l || l.remove())
                            if (u && nativeBadge) {
                                const badge = document.createElement("span"); badge.className = "chat-role-badge";
                                badge.textContent = nativeBadge.text;
                                if (nativeBadge.color) badge.style.color = nativeBadge.color;
                                u.prepend(badge, " ");
                            }
                            this.scrollToLatest();
                        }
                    }
                }, {
                    key: "scrollToLatest",
                    value: function() {
                        // The newest row is first in a column-reverse list: its
                        // bottom position is scrollTop 0, not scrollHeight.
                        if (this.chatScrollFrame != null) return;
                        this.chatScrollFrame = requestAnimationFrame(() => {
                            this.chatScrollFrame = null;
                            this.messagesContainer?.scrollTo({top:0, behavior:"smooth"});
                        });
                    }
                }, {
                    key: "formatTime",
                    value: function(t) {
                        var e = t.getHours().toString().padStart(2, "0")
                          , n = t.getMinutes().toString().padStart(2, "0");
                        return "".concat(e, ":").concat(n)
                    }
                }, {
                    key: "initEmojiPicker",
                    value: function() {
                        var t = this
                          , e = document.getElementById("emoji-toggle")
                          , n = document.getElementById("emoji-picker");
                        e && n && (n.innerHTML = "",
                        this.emojis.forEach(function(e) {
                            var r = document.createElement("div");
                            r.className = "emoji-item",
                            r.textContent = e.char;
                            var i = e.char;
                            e.shortcuts.length && (i += " (".concat(e.shortcuts.join(", "), ")")),
                            r.title = i,
                            r.onclick = function() {
                                var n;
                                t.insertEmoji(e.char),
                                null === (n = t.inputField) || void 0 === n || n.focus()
                            }
                            ,
                            n.appendChild(r)
                        }),
                        e.addEventListener("mousedown", function(t) {
                            t.preventDefault(),
                            t.stopPropagation(),
                            n.classList.toggle("active")
                        }),
                        window.addEventListener("mousedown", function(t) {
                            n.contains(t.target) || e.contains(t.target) || n.classList.remove("active")
                        }))
                    }
                }, {
                    key: "insertEmoji",
                    value: function(t) {
                        if (this.inputField) {
                            var e = this.inputField.selectionStart || this.inputField.value.length
                              , n = this.inputField.selectionEnd || this.inputField.value.length
                              , r = this.inputField.value;
                            this.inputField.value = r.substring(0, e) + t + r.substring(n),
                            this.inputField.selectionStart = this.inputField.selectionEnd = e + t.length
                        }
                    }
                }, {
                    key: "processShortcuts",
                    value: function(t) {
                        var e = t;
                        return this.emojis.forEach(function(t) {
                            t.shortcuts.forEach(function(n) {
                                var r = n.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
                                  , i = new RegExp("(?<=\\s|^)".concat(r, "(?=\\s|$)"),"g");
                                e = e.replace(i, t.char)
                            })
                        }),
                        e
                    }
                }],
                e && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1,
                        r.configurable = !0,
                        "value"in r && (r.writable = !0),
                        Object.defineProperty(t, Qe(r.key), r)
                    }
                }(t.prototype, e),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                t;
                var t, e
            }()
              , tn = "1.2.1"
              , en = [{
                version: "1.2.1",
                date: "21/01/2026",
                changes: {
                    added: [],
                    improved: [],
                    fixed: ["Fixed the issue where cells were still being drawn after the server failed to find a cell, causing them to get stuck in rendering. Now, all cells are properly cleared during syncing."]
                }
            }, {
                version: "1.2.0",
                date: "20/01/2026",
                changes: {
                    added: ['New "Skins Library" with categorized skins (YouTubers, Clans, etc.) from sniikz.com'],
                    improved: [],
                    fixed: []
                }
            }, {
                version: "1.1.9",
                date: "19/01/2026",
                changes: {
                    added: ['New "Own Cells" customization: Toggle visibility of your own name and mass separately', "Color Pickers for Own Name and Mass (overrides global settings)", 'Added "Send Wave" Keybind (Sends wave command to chat server)', 'Added "Toggle Own Names" and "Toggle Own Mass" Keybinds'],
                    improved: ["Wave effect now correctly aligns with game coordinates", "Optimized wave rendering performance"],
                    fixed: []
                }
            }, {
                version: "1.1.8",
                date: "19/01/2026",
                changes: {
                    added: [],
                    improved: [],
                    fixed: ["Fixed an issue where the Space key could not be rebound to other game actions"]
                }
            }, {
                version: "1.1.7",
                date: "17/01/2026",
                changes: {
                    added: ['Added "Command Color" setting for chat command responses', 'Added "Senpa Minimap Players" option (Ghost players from senpa server)', "Added Duplicate Filter for Senpa Minimap (Hides self and delta chat players)"],
                    improved: ["Redesigned Settings Menu with new sidebar layout and categorized tabs (Game, Camera, Theme, Elements, HUDs, Chat, Controls)", "Improving Settings Menu sizing and visual hierarchy", "Improved Chat focus behavior (Enter to send & keep focus, Enter on empty to hide)", 'Simplified Chat Customization (Direct "Message Color" picker)', "Added background animation to Lobby Skin preview"],
                    fixed: ["Fixed Chat Input blocking game controls even when not focused", "Fixed Lobby Skin Preview showing default image when empty"]
                }
            }, {
                version: "1.1.4",
                date: "15/01/2026",
                changes: {
                    added: [],
                    improved: [],
                    fixed: ["Fixed spectate mode not stopping when opening the menu", "Fixed dead clients not automatically following the alive client", 'Fixed "Spectate" button to enable spectate for all connected clients', "Fixed debug viewports rendering for dual clients", "Changed spectate control to prevent auto-spawn on release (manual spawn required while holding key)"]
                }
            }, {
                version: "1.1.2",
                date: "13/01/2026",
                changes: {
                    added: ["New HUD Visibility settings (Stats, Leaderboard, Master Toggle)", "Keybinds for clearing chat and toggling UI elements", "Minimap Size Slider in Settings", "Settings Export/Import/Reset Feature"],
                    improved: ["Minimap automatically scales text based on minimap size", 'Leaderboard header renamed to "Leaderboard"'],
                    fixed: ["Cursor lines not being rendered properly"]
                }
            }, {
                version: "1.0.3",
                date: "13/01/2026",
                changes: {
                    added: ["Profile Management System (10 Slots)", "Profile Navigation Arrows & UI", "Auto-save functionality for profiles", "Leaderboard with position numbers (1-10) displayed on the right", "Customizable leaderboard mass color in theme settings", "Version-based update notification system with changelog", "Custom text color settings for nicknames and mass", "Option to use cell colors for nicknames and mass text"],
                    improved: ["Enhanced leaderboard visual design with better spacing", "Cell animation performance and smoothness", "Text rendering system with more customization options"],
                    fixed: []
                }
            }];
            function nn(t) {
                return nn = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                nn(t)
            }
            function rn(t) {
                var e = function(t) {
                    if ("object" != nn(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != nn(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == nn(e) ? e : e + ""
            }
            var on = function() {
                return t = function t() {
                    !function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, t),
                    this.overlay = null,
                    this.STORAGE_KEY = "eon_last_seen_version",
                    this.overlay = document.getElementById("update-notifier-overlay"),
                    this.setupEventListeners()
                }
                ,
                e = [{
                    key: "setupEventListeners",
                    value: function() {
                        var t = this
                          , e = document.getElementById("update-notifier-close");
                        e && e.addEventListener("click", function() {
                            return t.hide()
                        }),
                        this.overlay && this.overlay.addEventListener("click", function(e) {
                            e.target === t.overlay && t.hide()
                        })
                    }
                }, {
                    key: "checkAndShow",
                    value: function() {
                        this.getLastSeenVersion() !== tn && this.show()
                    }
                }, {
                    key: "show",
                    value: function() {
                        var t = this;
                        this.overlay && (this.populateChangelog(),
                        this.overlay.style.display = "flex",
                        setTimeout(function() {
                            var e;
                            null === (e = t.overlay) || void 0 === e || e.classList.add("visible")
                        }, 10))
                    }
                }, {
                    key: "hide",
                    value: function() {
                        var t = this;
                        this.overlay && (this.saveLastSeenVersion(tn),
                        this.overlay.classList.remove("visible"),
                        setTimeout(function() {
                            t.overlay && (t.overlay.style.display = "none")
                        }, 300))
                    }
                }, {
                    key: "populateChangelog",
                    value: function() {
                        var t = en[0];
                        if (t) {
                            var e = document.getElementById("update-notifier-version");
                            e && (e.textContent = "v".concat(t.version));
                            var n = document.getElementById("update-notifier-date");
                            n && (n.textContent = t.date);
                            var r = document.getElementById("update-notifier-content");
                            if (r) {
                                if (r.innerHTML = "",
                                t.changes.added && t.changes.added.length > 0) {
                                    var i = this.createChangelogSection("Added", t.changes.added, "✨");
                                    r.appendChild(i)
                                }
                                if (t.changes.improved && t.changes.improved.length > 0) {
                                    var o = this.createChangelogSection("Improved", t.changes.improved, "🚀");
                                    r.appendChild(o)
                                }
                                if (t.changes.fixed && t.changes.fixed.length > 0) {
                                    var a = this.createChangelogSection("Fixed", t.changes.fixed, "🔧");
                                    r.appendChild(a)
                                }
                            }
                        }
                    }
                }, {
                    key: "createChangelogSection",
                    value: function(t, e, n) {
                        var r = document.createElement("div");
                        r.className = "changelog-section";
                        var i = document.createElement("div");
                        i.className = "changelog-header",
                        i.innerHTML = '<span class="changelog-icon">'.concat(n, "</span> ").concat(t),
                        r.appendChild(i);
                        var o = document.createElement("ul");
                        return o.className = "changelog-list",
                        e.forEach(function(t) {
                            var e = document.createElement("li");
                            e.textContent = t,
                            o.appendChild(e)
                        }),
                        r.appendChild(o),
                        r
                    }
                }, {
                    key: "getLastSeenVersion",
                    value: function() {
                        try {
                            return localStorage.getItem(this.STORAGE_KEY)
                        } catch (t) {
                            return console.error("Failed to get last seen version:", t),
                            null
                        }
                    }
                }, {
                    key: "saveLastSeenVersion",
                    value: function(t) {
                        try {
                            localStorage.setItem(this.STORAGE_KEY, t)
                        } catch (t) {
                            console.error("Failed to save last seen version:", t)
                        }
                    }
                }],
                e && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1,
                        r.configurable = !0,
                        "value"in r && (r.writable = !0),
                        Object.defineProperty(t, rn(r.key), r)
                    }
                }(t.prototype, e),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                t;
                var t, e
            }();
            function an() {
                var t, e, n = "function" == typeof Symbol ? Symbol : {}, r = n.iterator || "@@iterator", i = n.toStringTag || "@@toStringTag";
                function o(n, r, i, o) {
                    var c = r && r.prototype instanceof s ? r : s
                      , l = Object.create(c.prototype);
                    return sn(l, "_invoke", function(n, r, i) {
                        var o, s, c, l = 0, u = i || [], h = !1, f = {
                            p: 0,
                            n: 0,
                            v: t,
                            a: d,
                            f: d.bind(t, 4),
                            d: function(e, n) {
                                return o = e,
                                s = 0,
                                c = t,
                                f.n = n,
                                a
                            }
                        };
                        function d(n, r) {
                            for (s = n,
                            c = r,
                            e = 0; !h && l && !i && e < u.length; e++) {
                                var i, o = u[e], d = f.p, p = o[2];
                                n > 3 ? (i = p === r) && (c = o[(s = o[4]) ? 5 : (s = 3,
                                3)],
                                o[4] = o[5] = t) : o[0] <= d && ((i = n < 2 && d < o[1]) ? (s = 0,
                                f.v = r,
                                f.n = o[1]) : d < p && (i = n < 3 || o[0] > r || r > p) && (o[4] = n,
                                o[5] = r,
                                f.n = p,
                                s = 0))
                            }
                            if (i || n > 1)
                                return a;
                            throw h = !0,
                            r
                        }
                        return function(i, u, p) {
                            if (l > 1)
                                throw TypeError("Generator is already running");
                            for (h && 1 === u && d(u, p),
                            s = u,
                            c = p; (e = s < 2 ? t : c) || !h; ) {
                                o || (s ? s < 3 ? (s > 1 && (f.n = -1),
                                d(s, c)) : f.n = c : f.v = c);
                                try {
                                    if (l = 2,
                                    o) {
                                        if (s || (i = "next"),
                                        e = o[i]) {
                                            if (!(e = e.call(o, c)))
                                                throw TypeError("iterator result is not an object");
                                            if (!e.done)
                                                return e;
                                            c = e.value,
                                            s < 2 && (s = 0)
                                        } else
                                            1 === s && (e = o.return) && e.call(o),
                                            s < 2 && (c = TypeError("The iterator does not provide a '" + i + "' method"),
                                            s = 1);
                                        o = t
                                    } else if ((e = (h = f.n < 0) ? c : n.call(r, f)) !== a)
                                        break
                                } catch (e) {
                                    o = t,
                                    s = 1,
                                    c = e
                                } finally {
                                    l = 1
                                }
                            }
                            return {
                                value: e,
                                done: h
                            }
                        }
                    }(n, i, o), !0),
                    l
                }
                var a = {};
                function s() {}
                function c() {}
                function l() {}
                e = Object.getPrototypeOf;
                var u = [][r] ? e(e([][r]())) : (sn(e = {}, r, function() {
                    return this
                }),
                e)
                  , h = l.prototype = s.prototype = Object.create(u);
                function f(t) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(t, l) : (t.__proto__ = l,
                    sn(t, i, "GeneratorFunction")),
                    t.prototype = Object.create(h),
                    t
                }
                return c.prototype = l,
                sn(h, "constructor", l),
                sn(l, "constructor", c),
                c.displayName = "GeneratorFunction",
                sn(l, i, "GeneratorFunction"),
                sn(h),
                sn(h, i, "Generator"),
                sn(h, r, function() {
                    return this
                }),
                sn(h, "toString", function() {
                    return "[object Generator]"
                }),
                (an = function() {
                    return {
                        w: o,
                        m: f
                    }
                }
                )()
            }
            function sn(t, e, n, r) {
                var i = Object.defineProperty;
                try {
                    i({}, "", {})
                } catch (t) {
                    i = 0
                }
                sn = function(t, e, n, r) {
                    function o(e, n) {
                        sn(t, e, function(t) {
                            return this._invoke(e, n, t)
                        })
                    }
                    e ? i ? i(t, e, {
                        value: n,
                        enumerable: !r,
                        configurable: !r,
                        writable: !r
                    }) : t[e] = n : (o("next", 0),
                    o("throw", 1),
                    o("return", 2))
                }
                ,
                sn(t, e, n, r)
            }
            function cn(t, e, n, r, i, o, a) {
                try {
                    var s = t[o](a)
                      , c = s.value
                } catch (t) {
                    return void n(t)
                }
                s.done ? e(c) : Promise.resolve(c).then(r, i)
            }
            function ln(t) {
                return ln = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                ln(t)
            }
            function un() {
                var t, e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n = {};
                for (t in e)
                    e.hasOwnProperty(t) && (n[t] = e[t]);
                var r, i, o = [], a = function(t, e) {
                    throw e
                }, s = "object" === ("undefined" == typeof window ? "undefined" : ln(window)), c = "function" == typeof importScripts, l = "";
                (s || c) && (c ? l = self.location.href : "undefined" != typeof document && document.currentScript && (l = document.currentScript.src),
                l = 0 !== l.indexOf("blob:") ? l.substr(0, l.lastIndexOf("/") + 1) : "",
                c && (i = function(t) {
                    var e = new XMLHttpRequest;
                    return e.open("GET", t, !1),
                    e.responseType = "arraybuffer",
                    e.send(null),
                    new Uint8Array(e.response)
                }
                ),
                r = function(t, e, n) {
                    var r = new XMLHttpRequest;
                    r.open("GET", t, !0),
                    r.responseType = "arraybuffer",
                    r.onload = function() {
                        200 == r.status || 0 == r.status && r.response ? e(r.response) : n()
                    }
                    ,
                    r.onerror = n,
                    r.send(null)
                }
                );
                var u, h = e.print || console.log.bind(console), f = e.printErr || console.warn.bind(console);
                for (t in n)
                    n.hasOwnProperty(t) && (e[t] = n[t]);
                n = null,
                e.arguments && (o = e.arguments),
                e.thisProgram && e.thisProgram,
                e.quit && (a = e.quit),
                e.wasmBinary && (u = e.wasmBinary);
                var d = e.noExitRuntime || !0;
                "object" !== ("undefined" == typeof WebAssembly ? "undefined" : ln(WebAssembly)) && X("no native wasm support detected");
                var p, y = !1, v = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;
                function g(t, e) {
                    return t ? function(t, e, n) {
                        for (var r = e + n, i = e; t[i] && !(i >= r); )
                            ++i;
                        if (i - e > 16 && t.subarray && v)
                            return v.decode(t.subarray(e, i));
                        for (var o = ""; e < i; ) {
                            var a = t[e++];
                            if (128 & a) {
                                var s = 63 & t[e++];
                                if (192 != (224 & a)) {
                                    var c = 63 & t[e++];
                                    if ((a = 224 == (240 & a) ? (15 & a) << 12 | s << 6 | c : (7 & a) << 18 | s << 12 | c << 6 | 63 & t[e++]) < 65536)
                                        o += String.fromCharCode(a);
                                    else {
                                        var l = a - 65536;
                                        o += String.fromCharCode(55296 | l >> 10, 56320 | 1023 & l)
                                    }
                                } else
                                    o += String.fromCharCode((31 & a) << 6 | s)
                            } else
                                o += String.fromCharCode(a)
                        }
                        return o
                    }(w, t, e) : ""
                }
                var m, b, w, S, k, C, I, x, E, T = "undefined" != typeof TextDecoder ? new TextDecoder("utf-16le") : void 0;
                function _(t, e) {
                    for (var n = t, r = n >> 1, i = r + e / 2; !(r >= i) && k[r]; )
                        ++r;
                    if ((n = r << 1) - t > 32 && T)
                        return T.decode(w.subarray(t, n));
                    for (var o = "", a = 0; !(a >= e / 2); ++a) {
                        var s = S[t + 2 * a >> 1];
                        if (0 == s)
                            break;
                        o += String.fromCharCode(s)
                    }
                    return o
                }
                function A(t, e, n) {
                    if (void 0 === n && (n = 2147483647),
                    n < 2)
                        return 0;
                    for (var r = e, i = (n -= 2) < 2 * t.length ? n / 2 : t.length, o = 0; o < i; ++o) {
                        var a = t.charCodeAt(o);
                        S[e >> 1] = a,
                        e += 2
                    }
                    return S[e >> 1] = 0,
                    e - r
                }
                function P(t) {
                    return 2 * t.length
                }
                function O(t, e) {
                    for (var n = 0, r = ""; !(n >= e / 4); ) {
                        var i = C[t + 4 * n >> 2];
                        if (0 == i)
                            break;
                        if (++n,
                        i >= 65536) {
                            var o = i - 65536;
                            r += String.fromCharCode(55296 | o >> 10, 56320 | 1023 & o)
                        } else
                            r += String.fromCharCode(i)
                    }
                    return r
                }
                function M(t, e, n) {
                    if (void 0 === n && (n = 2147483647),
                    n < 4)
                        return 0;
                    for (var r = e, i = r + n - 4, o = 0; o < t.length; ++o) {
                        var a = t.charCodeAt(o);
                        if (a >= 55296 && a <= 57343 && (a = 65536 + ((1023 & a) << 10) | 1023 & t.charCodeAt(++o)),
                        C[e >> 2] = a,
                        (e += 4) + 4 > i)
                            break
                    }
                    return C[e >> 2] = 0,
                    e - r
                }
                function L(t) {
                    for (var e = 0, n = 0; n < t.length; ++n) {
                        var r = t.charCodeAt(n);
                        r >= 55296 && r <= 57343 && ++n,
                        e += 4
                    }
                    return e
                }
                e.INITIAL_MEMORY;
                var U, F = [], B = [], j = [], R = [];
                function W() {
                    return d || !1
                }
                function N(t) {
                    F.unshift(t)
                }
                function H(t) {
                    R.unshift(t)
                }
                var D, G, z = 0, V = null, q = null;
                function X(t) {
                    throw e.onAbort && e.onAbort(t),
                    f(t += ""),
                    y = !0,
                    p = 1,
                    t = "abort(" + t + "). Build with -s ASSERTIONS=1 for more info.",
                    new WebAssembly.RuntimeError(t)
                }
                function Y(t) {
                    return t.startsWith("data:application/octet-stream;base64,")
                }
                function K(t) {
                    return t.startsWith("file://")
                }
                function Z(t) {
                    try {
                        if (t == D && u)
                            return new Uint8Array(u);
                        if (i)
                            return i(t);
                        throw "both async and sync fetching of the wasm failed"
                    } catch (t) {
                        X(t)
                    }
                }
                function J(t) {
                    for (; t.length > 0; ) {
                        var n = t.shift();
                        if ("function" != typeof n) {
                            var r = n.func;
                            "number" == typeof r ? void 0 === n.arg ? U.get(r)() : U.get(r)(n.arg) : r(void 0 === n.arg ? null : n.arg)
                        } else
                            n(e)
                    }
                }
                function Q(t) {
                    switch (t) {
                    case 1:
                        return 0;
                    case 2:
                        return 1;
                    case 4:
                        return 2;
                    case 8:
                        return 3;
                    default:
                        throw new TypeError("Unknown type size: " + t)
                    }
                }
                e.preloadedImages = {},
                e.preloadedAudios = {},
                Y(D = "bundle.wasm") || (G = D,
                D = e.locateFile ? e.locateFile(G, l) : l + G);
                var $ = void 0;
                function tt(t) {
                    for (var e = "", n = t; w[n]; )
                        e += $[w[n++]];
                    return e
                }
                var et = {}
                  , nt = {}
                  , rt = {};
                function it(t) {
                    if (void 0 === t)
                        return "_unknown";
                    var e = (t = t.replace(/[^a-zA-Z0-9_]/g, "$")).charCodeAt(0);
                    return e >= 48 && e <= 57 ? "_" + t : t
                }
                function ot(t, e) {
                    var n = function(t, e) {
                        t = it(t);
                        var n = function() {
                            return e.apply(this, arguments)
                        };
                        try {
                            Object.defineProperty(n, "name", {
                                value: t
                            })
                        } catch (t) {}
                        return n
                    }(e, function(t) {
                        this.name = e,
                        this.message = t;
                        var n = new Error(t).stack;
                        void 0 !== n && (this.stack = this.toString() + "\n" + n.replace(/^Error(:[^\n]*)?\n/, ""))
                    });
                    return n.prototype = Object.create(t.prototype),
                    n.prototype.constructor = n,
                    n.prototype.toString = function() {
                        return void 0 === this.message ? this.name : this.name + ": " + this.message
                    }
                    ,
                    n
                }
                var at = void 0;
                function st(t) {
                    throw new at(t)
                }
                var ct = void 0;
                function lt(t) {
                    throw new ct(t)
                }
                function ut(t, e, n) {
                    if (n = n || {},
                    !("argPackAdvance"in e))
                        throw new TypeError("registerType registeredInstance requires argPackAdvance");
                    var r = e.name;
                    if (t || st('type "' + r + '" must have a positive integer typeid pointer'),
                    nt.hasOwnProperty(t)) {
                        if (n.ignoreDuplicateRegistrations)
                            return;
                        st("Cannot register type '" + r + "' twice")
                    }
                    if (nt[t] = e,
                    delete rt[t],
                    et.hasOwnProperty(t)) {
                        var i = et[t];
                        delete et[t],
                        i.forEach(function(t) {
                            t()
                        })
                    }
                }
                var ht = []
                  , ft = [{}, {
                    value: void 0
                }, {
                    value: null
                }, {
                    value: !0
                }, {
                    value: !1
                }];
                function dt(t) {
                    t > 4 && 0 === --ft[t].refcount && (ft[t] = void 0,
                    ht.push(t))
                }
                function pt(t) {
                    switch (t) {
                    case void 0:
                        return 1;
                    case null:
                        return 2;
                    case !0:
                        return 3;
                    case !1:
                        return 4;
                    default:
                        var e = ht.length ? ht.pop() : ft.length;
                        return ft[e] = {
                            refcount: 1,
                            value: t
                        },
                        e
                    }
                }
                function yt(t) {
                    return this.fromWireType(I[t >> 2])
                }
                function vt(t) {
                    if (null === t)
                        return "null";
                    var e = ln(t);
                    return "object" === e || "array" === e || "function" === e ? t.toString() : "" + t
                }
                function gt(t, e) {
                    switch (e) {
                    case 2:
                        return function(t) {
                            return this.fromWireType(x[t >> 2])
                        }
                        ;
                    case 3:
                        return function(t) {
                            return this.fromWireType(E[t >> 3])
                        }
                        ;
                    default:
                        throw new TypeError("Unknown float type: " + t)
                    }
                }
                function mt(t) {
                    for (; t.length; ) {
                        var e = t.pop();
                        t.pop()(e)
                    }
                }
                var bt = void 0;
                function wt(t) {
                    var e = pn(t)
                      , n = tt(e);
                    return Yt(e),
                    n
                }
                function St(t, e, n) {
                    switch (e) {
                    case 0:
                        return n ? function(t) {
                            return b[t]
                        }
                        : function(t) {
                            return w[t]
                        }
                        ;
                    case 1:
                        return n ? function(t) {
                            return S[t >> 1]
                        }
                        : function(t) {
                            return k[t >> 1]
                        }
                        ;
                    case 2:
                        return n ? function(t) {
                            return C[t >> 2]
                        }
                        : function(t) {
                            return I[t >> 2]
                        }
                        ;
                    default:
                        throw new TypeError("Unknown integer type: " + t)
                    }
                }
                function kt(t) {
                    return t || st("Cannot use deleted val. handle = " + t),
                    ft[t].value
                }
                function Ct(t, e) {
                    var n = nt[t];
                    return void 0 === n && st(e + " has unknown type " + wt(t)),
                    n
                }
                function It(t, e) {
                    for (var n = new Array(t), r = 0; r < t; ++r)
                        n[r] = Ct(C[(e >> 2) + r], "parameter " + r);
                    return n
                }
                var xt = {};
                function Et(t) {
                    var e = xt[t];
                    return void 0 === e ? tt(t) : e
                }
                var Tt = [];
                function _t(t, n) {
                    var r = e[n];
                    if (void 0 !== r)
                        return !!r;
                    var i = "object" === ("undefined" == typeof globalThis ? "undefined" : ln(globalThis)) ? globalThis : "object" === ("undefined" == typeof window ? "undefined" : ln(window)) ? window : "object" === ("undefined" == typeof self ? "undefined" : ln(self)) ? self : null;
                    if (i && void 0 !== i[t])
                        return !!i[t];
                    var o = function(t) {
                        try {
                            if ("object" !== ("undefined" == typeof localStorage ? "undefined" : ln(localStorage)) || !localStorage)
                                return;
                            var e = localStorage.getItem(t);
                            if (null === e)
                                return;
                            return "" !== (e = String(e).trim().toLowerCase()) && "0" !== e && "false" !== e && "off" !== e && "no" !== e
                        } catch (t) {
                            return
                        }
                    }(t);
                    return void 0 !== o && o
                }
                function At() {
                    return _t("__TRACE_WASM_GLOBAL__", "traceGlobalThis")
                }
                function Pt() {
                    return _t("__TRACE_WASM_GLOBAL_PROXY__", "traceGlobalThisProxy")
                }
                function Ot() {
                    return _t("__TRACE_WASM_GLOBAL_EMPTY__", "traceGlobalThisEmpty")
                }
                function Mt() {
                    return _t("__TRACE_WASM_WEBSOCKET_QUIET__", "traceWebSocketQuiet")
                }
                function Lt() {
                    return !Mt() && _t("__TRACE_WASM_WEBSOCKET_MESSAGES__", "traceWebSocketMessages")
                }
                function Ut() {
                    return !Mt() && _t("__TRACE_WASM_WEBSOCKET_DUMP__", "traceWebSocketDump")
                }
                function Ft() {
                    return !Mt() && _t("__TRACE_WASM_WEBSOCKET_STACK__", "traceWebSocketStack")
                }
                function Bt() {
                    return !Mt() && _t("__TRACE_WASM_WEBSOCKET_SUMMARY_STACK__", "traceWebSocketSummaryStack")
                }
                function jt() {
                    return _t("__TRACE_WASM_WEBSOCKET_WASM_FN__", "traceWebSocketWasmFn")
                }
                function Rt() {
                    return _t("__TRACE_WASM_WEBSOCKET_BLOCK_CLOSE_ONOPEN__", "traceWebSocketBlockCloseOnOpen")
                }
                function Wt(t) {
                    var n = e.traceGlobalThisLogger;
                    if ("function" == typeof n)
                        try {
                            n(t)
                        } catch (t) {}
                    else
                        h(t)
                }
                function Nt() {
                    return Ot() ? "empty" : "object" === ("undefined" == typeof globalThis ? "undefined" : ln(globalThis)) ? "globalThis" : "object" === ("undefined" == typeof window ? "undefined" : ln(window)) ? "window" : "object" === ("undefined" == typeof self ? "undefined" : ln(self)) ? "self" : "Function('return this')"
                }
                function Ht() {
                    return "object" === ("undefined" == typeof globalThis ? "undefined" : ln(globalThis)) ? globalThis : "object" === ("undefined" == typeof window ? "undefined" : ln(window)) ? window : "object" === ("undefined" == typeof self ? "undefined" : ln(self)) ? self : Function("return this")()
                }
                function Dt(t) {
                    if (!Pt() || "function" != typeof Proxy)
                        return t;
                    if (e.__traceGlobalThisProxyRoot)
                        return e.__traceGlobalThisProxyRoot;
                    var n = e.__traceGlobalThisProxyCache;
                    n || (n = e.__traceGlobalThisProxyCache = "function" == typeof WeakMap ? new WeakMap : null);
                    var r = e.__traceGlobalThisProxyReverse;
                    r || (r = e.__traceGlobalThisProxyReverse = "function" == typeof WeakMap ? new WeakMap : null);
                    var i = function(t, e) {
                        if (null == t)
                            return t;
                        var o = ln(t);
                        if ("object" !== o && "function" !== o)
                            return t;
                        if (n && n.has(t))
                            return n.get(t);
                        var a = new Proxy(t,{
                            get: function(t, n, r) {
                                At() && Wt("[WASM][globalThis] get " + e + "." + String(n));
                                var o, a = Reflect.get(t, n, t);
                                if ("prototype" === n)
                                    return a;
                                try {
                                    o = Object.getOwnPropertyDescriptor(t, n)
                                } catch (t) {
                                    o = void 0
                                }
                                return o && "value"in o && !1 === o.configurable && !1 === o.writable ? a : i(a, e + "." + String(n))
                            },
                            set: function(t, n, r, i) {
                                return At() && Wt("[WASM][globalThis] set " + e + "." + String(n) + " type=" + ln(r)),
                                Reflect.set(t, n, r, t)
                            },
                            apply: function(t, n, i) {
                                return At() && Wt("[WASM][globalThis] call " + e + " argc=" + (i ? i.length : 0)),
                                r && n && r.has(n) && (n = r.get(n)),
                                Reflect.apply(t, n, i)
                            },
                            construct: function(t, n, i) {
                                return At() && Wt("[WASM][globalThis] new " + e + " argc=" + (n ? n.length : 0)),
                                r && i && r.has(i) && (i = r.get(i)),
                                Reflect.construct(t, n, i)
                            }
                        });
                        return n && n.set(t, a),
                        r && r.set(a, t),
                        a
                    }
                      , o = i(t, Nt());
                    return e.__traceGlobalThisProxyRoot = o,
                    o
                }
                function Gt() {
                    return At() && Wt("[WASM][globalThis] root=" + Nt()),
                    function() {
                        if (Ot()) {
                            var t = e.__traceGlobalThisEmptyRoot;
                            return t || (t = Object.create(null),
                            e.__traceGlobalThisEmptyRoot = t),
                            t
                        }
                        return "object" === ("undefined" == typeof globalThis ? "undefined" : ln(globalThis)) ? globalThis : "object" === ("undefined" == typeof window ? "undefined" : ln(window)) ? window : "object" === ("undefined" == typeof self ? "undefined" : ln(self)) ? self : Function("return this")()
                    }()
                }
                var zt = {};
                !function() {
                    for (var t = new Array(256), e = 0; e < 256; ++e)
                        t[e] = String.fromCharCode(e);
                    $ = t
                }(),
                at = e.BindingError = ot(Error, "BindingError"),
                ct = e.InternalError = ot(Error, "InternalError"),
                e.count_emval_handles = function() {
                    for (var t = 0, e = 5; e < ft.length; ++e)
                        void 0 !== ft[e] && ++t;
                    return t
                }
                ,
                e.get_first_emval = function() {
                    for (var t = 5; t < ft.length; ++t)
                        if (void 0 !== ft[t])
                            return ft[t];
                    return null
                }
                ,
                bt = e.UnboundTypeError = ot(Error, "UnboundTypeError");
                var Vt, qt = {
                    t: function(t, e, n, r, i) {},
                    w: function(t, e, n, r, i) {
                        var o = Q(n);
                        ut(t, {
                            name: e = tt(e),
                            fromWireType: function(t) {
                                return !!t
                            },
                            toWireType: function(t, e) {
                                return e ? r : i
                            },
                            argPackAdvance: 8,
                            readValueFromPointer: function(t) {
                                var r;
                                if (1 === n)
                                    r = b;
                                else if (2 === n)
                                    r = S;
                                else {
                                    if (4 !== n)
                                        throw new TypeError("Unknown boolean type size: " + e);
                                    r = C
                                }
                                return this.fromWireType(r[t >> o])
                            },
                            destructorFunction: null
                        })
                    },
                    v: function(t, e) {
                        ut(t, {
                            name: e = tt(e),
                            fromWireType: function(t) {
                                var e = ft[t].value;
                                return dt(t),
                                e
                            },
                            toWireType: function(t, e) {
                                return pt(e)
                            },
                            argPackAdvance: 8,
                            readValueFromPointer: yt,
                            destructorFunction: null
                        })
                    },
                    o: function(t, e, n) {
                        var r = Q(n);
                        ut(t, {
                            name: e = tt(e),
                            fromWireType: function(t) {
                                return t
                            },
                            toWireType: function(t, e) {
                                if ("number" != typeof e && "boolean" != typeof e)
                                    throw new TypeError('Cannot convert "' + vt(e) + '" to ' + this.name);
                                return e
                            },
                            argPackAdvance: 8,
                            readValueFromPointer: gt(e, r),
                            destructorFunction: null
                        })
                    },
                    l: function(t, n, r, i, o, a) {
                        var s = function(t, e) {
                            for (var n = [], r = 0; r < t; r++)
                                n.push(C[(e >> 2) + r]);
                            return n
                        }(n, r);
                        t = tt(t),
                        o = function(t, n) {
                            var r = (t = tt(t)).includes("j") ? function(t, n) {
                                var r = [];
                                return function() {
                                    r.length = arguments.length;
                                    for (var i = 0; i < arguments.length; i++)
                                        r[i] = arguments[i];
                                    return function(t, n, r) {
                                        return t.includes("j") ? function(t, n, r) {
                                            var i = e["dynCall_" + t];
                                            return r && r.length ? i.apply(null, [n].concat(r)) : i.call(null, n)
                                        }(t, n, r) : U.get(n).apply(null, r)
                                    }(t, n, r)
                                }
                            }(t, n) : U.get(n);
                            return "function" != typeof r && st("unknown function pointer with signature " + t + ": " + n),
                            r
                        }(i, o),
                        function(t, n, r) {
                            e.hasOwnProperty(t) ? ((void 0 === r || void 0 !== e[t].overloadTable && void 0 !== e[t].overloadTable[r]) && st("Cannot register public name '" + t + "' twice"),
                            function(t, e, n) {
                                if (void 0 === t[e].overloadTable) {
                                    var r = t[e];
                                    t[e] = function() {
                                        return t[e].overloadTable.hasOwnProperty(arguments.length) || st("Function '" + n + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + t[e].overloadTable + ")!"),
                                        t[e].overloadTable[arguments.length].apply(this, arguments)
                                    }
                                    ,
                                    t[e].overloadTable = [],
                                    t[e].overloadTable[r.argCount] = r
                                }
                            }(e, t, t),
                            e.hasOwnProperty(r) && st("Cannot register multiple overloads of a function with the same number of arguments (" + r + ")!"),
                            e[t].overloadTable[r] = n) : (e[t] = n,
                            void 0 !== r && (e[t].numArguments = r))
                        }(t, function() {
                            !function(t, e) {
                                var n = []
                                  , r = {};
                                throw e.forEach(function t(e) {
                                    r[e] || nt[e] || (rt[e] ? rt[e].forEach(t) : (n.push(e),
                                    r[e] = !0))
                                }),
                                new bt(t + ": " + n.map(wt).join([", "]))
                            }("Cannot call " + t + " due to unbound types", s)
                        }, n - 1),
                        function(t, e, n) {
                            function r(e) {
                                var r = n(e);
                                r.length !== t.length && lt("Mismatched type converter count");
                                for (var i = 0; i < t.length; ++i)
                                    ut(t[i], r[i])
                            }
                            t.forEach(function(t) {
                                rt[t] = e
                            });
                            var i = new Array(e.length)
                              , o = []
                              , a = 0;
                            e.forEach(function(t, e) {
                                nt.hasOwnProperty(t) ? i[e] = nt[t] : (o.push(t),
                                et.hasOwnProperty(t) || (et[t] = []),
                                et[t].push(function() {
                                    i[e] = nt[t],
                                    ++a === o.length && r(i)
                                }))
                            }),
                            0 === o.length && r(i)
                        }([], s, function(r) {
                            var i = [r[0], null].concat(r.slice(1));
                            return function(t, n, r) {
                                e.hasOwnProperty(t) || lt("Replacing nonexistant public symbol"),
                                void 0 !== e[t].overloadTable && void 0 !== r ? e[t].overloadTable[r] = n : (e[t] = n,
                                e[t].argCount = r)
                            }(t, function(t, e, n, r, i) {
                                for (var o = e[0], a = e[1], s = e.slice(2), c = s.length, l = !1, u = 1; u < e.length; ++u)
                                    if (null !== e[u] && void 0 === e[u].destructorFunction) {
                                        l = !0;
                                        break
                                    }
                                var h = function() {
                                    arguments.length !== c && st("function " + t + " called with " + arguments.length + " arguments, expected " + c + " args!");
                                    var e = l ? [] : null
                                      , n = [];
                                    a && n.push(a.toWireType(e, this));
                                    for (var u = 0; u < c; u++)
                                        n.push(s[u].toWireType(e, arguments[u]));
                                    var h = r.apply(null, [i].concat(n));
                                    if (l)
                                        mt(e);
                                    else {
                                        var f = 0;
                                        for (a && (null !== a.destructorFunction && a.destructorFunction(n[f]),
                                        f++),
                                        u = 0; u < c; u++)
                                            null !== s[u].destructorFunction && s[u].destructorFunction(n[f]),
                                            f++
                                    }
                                    if ("void" !== o.name)
                                        return o.fromWireType(h)
                                };
                                try {
                                    Object.defineProperty(h, "name", {
                                        value: it(t)
                                    })
                                } catch (t) {}
                                return h
                            }(t, i, 0, o, a), n - 1),
                            []
                        })
                    },
                    d: function(t, e, n, r, i) {
                        e = tt(e),
                        -1 === i && (i = 4294967295);
                        var o = Q(n)
                          , a = function(t) {
                            return t
                        };
                        if (0 === r) {
                            var s = 32 - 8 * n;
                            a = function(t) {
                                return t << s >>> s
                            }
                        }
                        var c = e.includes("unsigned");
                        ut(t, {
                            name: e,
                            fromWireType: a,
                            toWireType: function(t, n) {
                                if ("number" != typeof n && "boolean" != typeof n)
                                    throw new TypeError('Cannot convert "' + vt(n) + '" to ' + this.name);
                                if (n < r || n > i)
                                    throw new TypeError('Passing a number "' + vt(n) + '" from JS side to C/C++ side to an argument of type "' + e + '", which is outside the valid range [' + r + ", " + i + "]!");
                                return c ? n >>> 0 : 0 | n
                            },
                            argPackAdvance: 8,
                            readValueFromPointer: St(e, o, 0 !== r),
                            destructorFunction: null
                        })
                    },
                    c: function(t, e, n) {
                        var r = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array][e];
                        function i(t) {
                            var e = I
                              , n = e[t >>= 2]
                              , i = e[t + 1];
                            return new r(m,i,n)
                        }
                        ut(t, {
                            name: n = tt(n),
                            fromWireType: i,
                            argPackAdvance: 8,
                            readValueFromPointer: i
                        }, {
                            ignoreDuplicateRegistrations: !0
                        })
                    },
                    p: function(t, e) {
                        var n = "std::string" === (e = tt(e));
                        ut(t, {
                            name: e,
                            fromWireType: function(t) {
                                var e, r = I[t >> 2];
                                if (n)
                                    for (var i = t + 4, o = 0; o <= r; ++o) {
                                        var a = t + 4 + o;
                                        if (o == r || 0 == w[a]) {
                                            var s = g(i, a - i);
                                            void 0 === e ? e = s : (e += String.fromCharCode(0),
                                            e += s),
                                            i = a + 1
                                        }
                                    }
                                else {
                                    var c = new Array(r);
                                    for (o = 0; o < r; ++o)
                                        c[o] = String.fromCharCode(w[t + 4 + o]);
                                    e = c.join("")
                                }
                                return Yt(t),
                                e
                            },
                            toWireType: function(t, e) {
                                var r;
                                e instanceof ArrayBuffer && (e = new Uint8Array(e));
                                var i = "string" == typeof e;
                                i || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Int8Array || st("Cannot pass non-string to std::string"),
                                r = n && i ? function() {
                                    return function(t) {
                                        for (var e = 0, n = 0; n < t.length; ++n) {
                                            var r = t.charCodeAt(n);
                                            r >= 55296 && r <= 57343 && (r = 65536 + ((1023 & r) << 10) | 1023 & t.charCodeAt(++n)),
                                            r <= 127 ? ++e : e += r <= 2047 ? 2 : r <= 65535 ? 3 : 4
                                        }
                                        return e
                                    }(e)
                                }
                                : function() {
                                    return e.length
                                }
                                ;
                                var o = r()
                                  , a = Xt(4 + o + 1);
                                if (I[a >> 2] = o,
                                n && i)
                                    !function(t, e, n) {
                                        !function(t, e, n, r) {
                                            if (!(r > 0))
                                                return 0;
                                            for (var i = n + r - 1, o = 0; o < t.length; ++o) {
                                                var a = t.charCodeAt(o);
                                                if (a >= 55296 && a <= 57343 && (a = 65536 + ((1023 & a) << 10) | 1023 & t.charCodeAt(++o)),
                                                a <= 127) {
                                                    if (n >= i)
                                                        break;
                                                    e[n++] = a
                                                } else if (a <= 2047) {
                                                    if (n + 1 >= i)
                                                        break;
                                                    e[n++] = 192 | a >> 6,
                                                    e[n++] = 128 | 63 & a
                                                } else if (a <= 65535) {
                                                    if (n + 2 >= i)
                                                        break;
                                                    e[n++] = 224 | a >> 12,
                                                    e[n++] = 128 | a >> 6 & 63,
                                                    e[n++] = 128 | 63 & a
                                                } else {
                                                    if (n + 3 >= i)
                                                        break;
                                                    e[n++] = 240 | a >> 18,
                                                    e[n++] = 128 | a >> 12 & 63,
                                                    e[n++] = 128 | a >> 6 & 63,
                                                    e[n++] = 128 | 63 & a
                                                }
                                            }
                                            e[n] = 0
                                        }(t, w, e, n)
                                    }(e, a + 4, o + 1);
                                else if (i)
                                    for (var s = 0; s < o; ++s) {
                                        var c = e.charCodeAt(s);
                                        c > 255 && (Yt(a),
                                        st("String has UTF-16 code units that do not fit in 8 bits")),
                                        w[a + 4 + s] = c
                                    }
                                else
                                    for (s = 0; s < o; ++s)
                                        w[a + 4 + s] = e[s];
                                return null !== t && t.push(Yt, a),
                                a
                            },
                            argPackAdvance: 8,
                            readValueFromPointer: yt,
                            destructorFunction: function(t) {
                                Yt(t)
                            }
                        })
                    },
                    j: function(t, e, n) {
                        var r, i, o, a, s;
                        n = tt(n),
                        2 === e ? (r = _,
                        i = A,
                        a = P,
                        o = function() {
                            return k
                        }
                        ,
                        s = 1) : 4 === e && (r = O,
                        i = M,
                        a = L,
                        o = function() {
                            return I
                        }
                        ,
                        s = 2),
                        ut(t, {
                            name: n,
                            fromWireType: function(t) {
                                for (var n, i = I[t >> 2], a = o(), c = t + 4, l = 0; l <= i; ++l) {
                                    var u = t + 4 + l * e;
                                    if (l == i || 0 == a[u >> s]) {
                                        var h = r(c, u - c);
                                        void 0 === n ? n = h : (n += String.fromCharCode(0),
                                        n += h),
                                        c = u + e
                                    }
                                }
                                return Yt(t),
                                n
                            },
                            toWireType: function(t, r) {
                                "string" != typeof r && st("Cannot pass non-string to C++ string type " + n);
                                var o = a(r)
                                  , c = Xt(4 + o + e);
                                return I[c >> 2] = o >> s,
                                i(r, c + 4, o + e),
                                null !== t && t.push(Yt, c),
                                c
                            },
                            argPackAdvance: 8,
                            readValueFromPointer: yt,
                            destructorFunction: function(t) {
                                Yt(t)
                            }
                        })
                    },
                    x: function(t, e) {
                        ut(t, {
                            isVoid: !0,
                            name: e = tt(e),
                            argPackAdvance: 0,
                            fromWireType: function() {},
                            toWireType: function(t, e) {}
                        })
                    },
                    g: function(t, e, n) {
                        t = kt(t),
                        e = Ct(e, "emval::as");
                        var r = []
                          , i = pt(r);
                        return C[n >> 2] = i,
                        e.toWireType(r, t)
                    },
                    D: function(t, e, n, r) {
                        t = kt(t);
                        for (var i = It(e, n), o = new Array(e), a = 0; a < e; ++a) {
                            var s = i[a];
                            o[a] = s.readValueFromPointer(r),
                            r += s.argPackAdvance
                        }
                        return pt(t.apply(void 0, o))
                    },
                    b: function(t, e, n, r, i) {
                        return (t = Tt[t])(e = kt(e), n = Et(n), function(t) {
                            var e = [];
                            return C[t >> 2] = pt(e),
                            e
                        }(r), i)
                    },
                    f: function(t, e, n, r) {
                        (t = Tt[t])(e = kt(e), n = Et(n), null, r)
                    },
                    m: dt,
                    y: function(t) {
                        if (0 === t)
                            return At() && Wt("[WASM][globalThis] get <root>"),
                            pt(Dt(Gt()));
                        t = Et(t);
                        var n = Gt()
                          , r = n[t];
                        if (At()) {
                            var i = ln(r)
                              , o = "";
                            if ("object" === i && r)
                                try {
                                    o = " ctor=" + (r.constructor && r.constructor.name ? r.constructor.name : "Object")
                                } catch (t) {}
                            if (Wt("[WASM][globalThis] get " + String(t) + " type=" + i + o),
                            function(t) {
                                if (!_t("__TRACE_WASM_GLOBAL_STACK__", "traceGlobalThisStack"))
                                    return !1;
                                var n = function() {
                                    var t, n = e.traceGlobalThisStackKeys;
                                    if (n && "object" === ln(n) && "function" == typeof n.indexOf)
                                        return n;
                                    try {
                                        "object" === ("undefined" == typeof localStorage ? "undefined" : ln(localStorage)) && localStorage && (t = localStorage.getItem("__TRACE_WASM_GLOBAL_STACK_KEYS__"))
                                    } catch (t) {}
                                    if (null == t)
                                        return null;
                                    var r = String(t).trim();
                                    return r ? r.split(",").map(function(t) {
                                        return String(t).trim()
                                    }).filter(function(t) {
                                        return !!t
                                    }) : null
                                }();
                                return !n || !n.length || -1 !== n.indexOf(String(t))
                            }(t))
                                try {
                                    Wt(new Error("[WASM][globalThis] stack for get " + String(t)).stack || "")
                                } catch (t) {}
                        }
                        return pt(Pt() ? Dt(n)[t] : r)
                    },
                    a: function(t, e) {
                        var n = It(t, e)
                          , r = n[0]
                          , i = n.slice(1);
                        return function() {
                            var t = Tt.length;
                            return Tt.push(function(t, e, n, o) {
                                for (var a = [], s = o, c = 0; c < i.length; c++) {
                                    var l = i[c]
                                      , u = l.readValueFromPointer(s);
                                    a.push(u),
                                    s += l.argPackAdvance
                                }
                                var h = t[e].apply(t, a);
                                for (c = 0; c < i.length; c++)
                                    i[c].deleteObject && i[c].deleteObject(a[c]);
                                if (!r.isVoid)
                                    return r.toWireType(n, h)
                            }),
                            t
                        }()
                    },
                    r: function(t) {
                        return t = Et(t),
                        pt(e[t])
                    },
                    i: function(t, e) {
                        return pt((t = kt(t))[e = kt(e)])
                    },
                    h: function(t) {
                        t > 4 && (ft[t].refcount += 1)
                    },
                    q: function(t, e) {
                        return (t = kt(t))instanceof kt(e)
                    },
                    s: function(t, n, r, i) {
                        t = kt(t);
                        var o = zt[n];
                        return o || (o = function(t) {
                            return function(n, r, i) {
                                for (var o = [], a = 0; a < t; ++a) {
                                    var s = Ct(e.HEAP32[(r >> 2) + a], "parameter " + a)
                                      , c = s.readValueFromPointer(i);
                                    i += s.argPackAdvance,
                                    o.push(c)
                                }
                                if (null !== n && "function" != typeof n) {
                                    try {
                                        Wt("[WASM][embind] construct non-function type=" + ln(n))
                                    } catch (t) {}
                                    throw new TypeError("Cannot construct non-function (check __TRACE_WASM_GLOBAL_EMPTY__)")
                                }
                                return pt(new (Function.prototype.bind.apply(n, [null].concat(o))))
                            }
                        }(n),
                        zt[n] = o),
                        o(t, r, i)
                    },
                    C: function() {
                        return pt([])
                    },
                    z: function(t) {
                        return pt(Et(t))
                    },
                    E: function() {
                        return pt({})
                    },
                    A: function(t) {
                        mt(ft[t].value),
                        dt(t)
                    },
                    e: function(t, e, n) {
                        t = kt(t),
                        e = kt(e),
                        n = kt(n),
                        t[e] = n
                    },
                    k: function(t, e) {
                        return pt((t = Ct(t, "_emval_take_value")).readValueFromPointer(e))
                    },
                    B: function(t) {
                        return pt(ln(t = kt(t)))
                    },
                    n: function() {
                        X()
                    },
                    u: function(t) {
                        w.length,
                        X("OOM")
                    }
                }, Xt = (function() {
                    try {
                        !function() {
                            if (_t("__TRACE_CONTEXT_BUFFER_FACTORY__", "traceContextBufferFactory") && !e.__traceContextBufferFactoryInstalled) {
                                e.__traceContextBufferFactoryInstalled = !0;
                                var t = Ht();
                                if (t) {
                                    var n = t.CanvasCaptureMediaStreamTrack;
                                    n || (n = {},
                                    t.CanvasCaptureMediaStreamTrack = n);
                                    var r, i = "contextBufferFactory";
                                    try {
                                        r = Object.getOwnPropertyDescriptor(n, i)
                                    } catch (t) {
                                        r = void 0
                                    }
                                    var o = r && "value"in r ? r.value : void 0
                                      , a = r && r.get ? r.get : null
                                      , s = r && r.set ? r.set : null;
                                    try {
                                        Object.defineProperty(n, i, {
                                            configurable: !0,
                                            enumerable: !0,
                                            get: function() {
                                                return a ? a.call(n) : o
                                            },
                                            set: function(t) {
                                                try {
                                                    Wt("[WASM][contextBufferFactory] set type=" + ln(t))
                                                } catch (t) {}
                                                try {
                                                    Wt(new Error("[WASM][contextBufferFactory] stack").stack || "")
                                                } catch (t) {}
                                                s ? s.call(n, t) : o = t
                                            }
                                        })
                                    } catch (t) {}
                                }
                            }
                        }()
                    } catch (t) {}
                    try {
                        !function() {
                            if (_t("__TRACE_WASM_WEBSOCKET__", "traceWebSocket") && !e.__traceWebSocketInstalled) {
                                e.__traceWebSocketInstalled = !0;
                                var t = Ht();
                                if (t) {
                                    try {
                                        if (t.WebSocket && t.WebSocket.__eonTraceWsWrapped)
                                            return
                                    } catch (t) {}
                                    var n = t.WebSocket;
                                    if ("function" == typeof n && e.__traceWebSocketOriginal !== n) {
                                        e.__traceWebSocketOriginal = n;
                                        var r = e.__traceWebSocketCounter || 0
                                          , i = function(t) {
                                            try {
                                                return String(t)
                                            } catch (t) {
                                                return "<unprintable>"
                                            }
                                        }
                                          , o = function(t) {
                                            for (var e = "", n = 0; n < t.length; n++) {
                                                var r = t[n].toString(16);
                                                1 === r.length && (r = "0" + r),
                                                e += r
                                            }
                                            return e
                                        }
                                          , a = function() {
                                            var t = e.__traceWebSocketSummary;
                                            if (t)
                                                return t;
                                            t = {
                                                sendCount: 0,
                                                recvCount: 0,
                                                sendBytes: 0,
                                                recvBytes: 0,
                                                sendByOpcode: {},
                                                recvByOpcode: {},
                                                handshakeHex: null,
                                                lastHandshakeHex: null,
                                                handshakesById: {},
                                                firstSendHex: null,
                                                lastSendHex: null,
                                                firstSendHexById: {},
                                                lastSendHexById: {},
                                                lastSendWasmFnById: {},
                                                pingHex: null,
                                                lastPingHex: null,
                                                pingSamples: [],
                                                pingSamplesLimit: 60,
                                                pingSamplesById: {},
                                                pingStartById: {},
                                                packetStartById: {},
                                                lastRecv16HexById: {},
                                                lastRecv16TById: {},
                                                lastRecv16OpcodeById: {},
                                                lastRecv16WasmFnById: {},
                                                lastRecv16WasmFnsById: {},
                                                recv16SeqById: {},
                                                pairedRecv16SeqById: {},
                                                challengeReplyMap: {},
                                                challengeReplyList: [],
                                                challengeReplyLimit: 200,
                                                last: [],
                                                lastLimit: 200
                                            };
                                            try {
                                                var n = Ht();
                                                if (n) {
                                                    var r = n.__EON_WS_CHALLENGE_MAP__;
                                                    if (r && "object" === ln(r))
                                                        try {
                                                            for (var i in r)
                                                                Object.prototype.hasOwnProperty.call(r, i) && "string" == typeof r[i] && (t.challengeReplyMap[i] = r[i])
                                                        } catch (t) {}
                                                    try {
                                                        if ("object" === ("undefined" == typeof localStorage ? "undefined" : ln(localStorage)) && localStorage) {
                                                            var o = localStorage.getItem("__EON_WS_CHALLENGE_MAP__");
                                                            if ("string" == typeof o && o) {
                                                                var a = null;
                                                                try {
                                                                    a = JSON.parse(o)
                                                                } catch (t) {
                                                                    a = null
                                                                }
                                                                if (a && "object" === ln(a))
                                                                    for (var s in a)
                                                                        Object.prototype.hasOwnProperty.call(a, s) && "string" == typeof a[s] && (t.challengeReplyMap[s] = a[s])
                                                            }
                                                        }
                                                    } catch (t) {}
                                                    try {
                                                        var c = n.__EON_WS_CHALLENGE_MAP__;
                                                        for (var l in c && "object" === ln(c) || (c = n.__EON_WS_CHALLENGE_MAP__ = Object.create(null)),
                                                        t.challengeReplyMap)
                                                            Object.prototype.hasOwnProperty.call(t.challengeReplyMap, l) && "string" == typeof t.challengeReplyMap[l] && (c[l] = t.challengeReplyMap[l])
                                                    } catch (t) {}
                                                    try {
                                                        if ("object" === ("undefined" == typeof localStorage ? "undefined" : ln(localStorage)) && localStorage) {
                                                            var u = localStorage.getItem("__EON_WS_CHALLENGE_PAIRS__");
                                                            if ("string" == typeof u && u) {
                                                                var h = null;
                                                                try {
                                                                    h = JSON.parse(u)
                                                                } catch (t) {
                                                                    h = null
                                                                }
                                                                if (h && "number" == typeof h.length) {
                                                                    for (var f = 0; f < h.length; f++) {
                                                                        var d = h[f];
                                                                        d && "object" === ln(d) && "string" == typeof d.challengeHex && "string" == typeof d.replyHex && t.challengeReplyList.push(d)
                                                                    }
                                                                    t.challengeReplyList.length > t.challengeReplyLimit && t.challengeReplyList.splice(0, t.challengeReplyList.length - t.challengeReplyLimit)
                                                                }
                                                            }
                                                        }
                                                    } catch (t) {}
                                                }
                                            } catch (t) {}
                                            return e.__traceWebSocketSummary = t,
                                            t
                                        };
                                        try {
                                            var s = Ht();
                                            s && !s.__eonWsTraceSummary && (s.__eonWsTraceSummary = function() {
                                                try {
                                                    return e.__traceWebSocketSummary || null
                                                } catch (t) {
                                                    return null
                                                }
                                            }
                                            ),
                                            s && !s.__eonWsTraceSummaryReset && (s.__eonWsTraceSummaryReset = function() {
                                                try {
                                                    e.__traceWebSocketSummary = null
                                                } catch (t) {}
                                                try {
                                                    return !0
                                                } catch (t) {
                                                    return !1
                                                }
                                            }
                                            ),
                                            s && !s.__eonWsTraceHandshakeHex && (s.__eonWsTraceHandshakeHex = function() {
                                                try {
                                                    var t = e.__traceWebSocketSummary;
                                                    return t && (t.lastHandshakeHex || t.handshakeHex || t.firstSendHex || t.lastSendHex) || null
                                                } catch (t) {
                                                    return null
                                                }
                                            }
                                            ),
                                            s && !s.__eonWsTraceFirstSendHex && (s.__eonWsTraceFirstSendHex = function(t) {
                                                try {
                                                    var n = e.__traceWebSocketSummary;
                                                    if (!n)
                                                        return null;
                                                    if (null != t) {
                                                        var r = n.firstSendHexById ? n.firstSendHexById[String(t)] : null;
                                                        return "string" == typeof r ? r : null
                                                    }
                                                    return "string" == typeof n.firstSendHex ? n.firstSendHex : null
                                                } catch (t) {
                                                    return null
                                                }
                                            }
                                            ),
                                            s && !s.__eonWsTraceLastSendHex && (s.__eonWsTraceLastSendHex = function(t) {
                                                try {
                                                    var n = e.__traceWebSocketSummary;
                                                    if (!n)
                                                        return null;
                                                    if (null != t) {
                                                        var r = n.lastSendHexById ? n.lastSendHexById[String(t)] : null;
                                                        return "string" == typeof r ? r : null
                                                    }
                                                    return "string" == typeof n.lastSendHex ? n.lastSendHex : null
                                                } catch (t) {
                                                    return null
                                                }
                                            }
                                            ),
                                            s && !s.__eonWsTracePingHex && (s.__eonWsTracePingHex = function() {
                                                try {
                                                    var t = e.__traceWebSocketSummary;
                                                    return t && (t.lastPingHex || t.pingHex) || null
                                                } catch (t) {
                                                    return null
                                                }
                                            }
                                            ),
                                            s && !s.__eonWsTracePingSamples && (s.__eonWsTracePingSamples = function(t) {
                                                try {
                                                    var n = e.__traceWebSocketSummary;
                                                    if (!n)
                                                        return null;
                                                    if (null != t) {
                                                        var r = n.pingSamplesById ? n.pingSamplesById[String(t)] : null;
                                                        return r && "function" == typeof r.slice ? r.slice() : null
                                                    }
                                                    return n.pingSamples && "function" == typeof n.pingSamples.slice ? n.pingSamples.slice() : null
                                                } catch (t) {
                                                    return null
                                                }
                                            }
                                            ),
                                            s && !s.__eonWsTraceChallengeMap && (s.__eonWsTraceChallengeMap = function() {
                                                try {
                                                    var t = e.__traceWebSocketSummary;
                                                    return t && t.challengeReplyMap || null
                                                } catch (t) {
                                                    return null
                                                }
                                            }
                                            ),
                                            s && !s.__eonWsTraceChallengeStatus && (s.__eonWsTraceChallengeStatus = function() {
                                                try {
                                                    var t = Ht()
                                                      , e = null
                                                      , n = null;
                                                    try {
                                                        e = t && t.__EON_WS_CHALLENGE_MAP__ ? t.__EON_WS_CHALLENGE_MAP__ : null
                                                    } catch (t) {}
                                                    try {
                                                        n = t && "string" == typeof t.__EON_WS_LAST_CHALLENGE_HEX__ ? t.__EON_WS_LAST_CHALLENGE_HEX__ : null
                                                    } catch (t) {}
                                                    var r = 0;
                                                    try {
                                                        e && "object" === ln(e) && (r = Object.keys(e).length)
                                                    } catch (t) {}
                                                    var i = null;
                                                    try {
                                                        n && e && "object" === ln(e) && "string" == typeof e[n] && (i = e[n])
                                                    } catch (t) {}
                                                    return {
                                                        lastChallengeHex: n,
                                                        mapSize: r,
                                                        matchReplyHex: i
                                                    }
                                                } catch (t) {
                                                    return {
                                                        lastChallengeHex: null,
                                                        mapSize: 0,
                                                        matchReplyHex: null
                                                    }
                                                }
                                            }
                                            ),
                                            s && !s.__eonWsTraceChallengePairs && (s.__eonWsTraceChallengePairs = function() {
                                                try {
                                                    var t = e.__traceWebSocketSummary;
                                                    if (!t)
                                                        return null;
                                                    var n = t.challengeReplyList;
                                                    return n && "function" == typeof n.slice ? n.slice() : null
                                                } catch (t) {
                                                    return null
                                                }
                                            }
                                            ),
                                            s && !s.__eonWsTraceChallengePairsPersisted && (s.__eonWsTraceChallengePairsPersisted = function() {
                                                try {
                                                    if ("object" !== ("undefined" == typeof localStorage ? "undefined" : ln(localStorage)) || !localStorage)
                                                        return null;
                                                    var t = localStorage.getItem("__EON_WS_CHALLENGE_PAIRS__");
                                                    if ("string" != typeof t || !t)
                                                        return null;
                                                    var e = null;
                                                    try {
                                                        e = JSON.parse(t)
                                                    } catch (t) {
                                                        e = null
                                                    }
                                                    return e && "number" == typeof e.length ? e : null
                                                } catch (t) {
                                                    return null
                                                }
                                            }
                                            ),
                                            s && !s.__eonWsTraceChallengePairsClear && (s.__eonWsTraceChallengePairsClear = function() {
                                                try {
                                                    return !("object" !== ("undefined" == typeof localStorage ? "undefined" : ln(localStorage)) || !localStorage || (localStorage.removeItem("__EON_WS_CHALLENGE_PAIRS__"),
                                                    0))
                                                } catch (t) {
                                                    return !1
                                                }
                                            }
                                            ),
                                            s && !s.__eonWsTraceLastChallengePair && (s.__eonWsTraceLastChallengePair = function() {
                                                try {
                                                    var t = e.__traceWebSocketSummary;
                                                    if (!t)
                                                        return null;
                                                    var n = t.challengeReplyList;
                                                    return !n || "number" != typeof n.length || n.length < 1 ? null : n[n.length - 1] || null
                                                } catch (t) {
                                                    return null
                                                }
                                            }
                                            )
                                        } catch (t) {}
                                        var c = function(t, e, n) {
                                            try {
                                                var r;
                                                if ("function" == typeof Uint8Array && t instanceof Uint8Array)
                                                    r = t;
                                                else if ("function" == typeof ArrayBuffer && t instanceof ArrayBuffer)
                                                    r = new Uint8Array(t);
                                                else {
                                                    if (!("function" == typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && ArrayBuffer.isView(t) && t && t.buffer))
                                                        return;
                                                    try {
                                                        var i = "number" == typeof t.byteOffset ? t.byteOffset : 0
                                                          , s = "number" == typeof t.byteLength ? t.byteLength : 0;
                                                        r = new Uint8Array(t.buffer,i,s)
                                                    } catch (e) {
                                                        r = new Uint8Array(t.buffer)
                                                    }
                                                }
                                                if (function(t, e, n) {
                                                    try {
                                                        if (!_t("__TRACE_WASM_WEBSOCKET_SUMMARY__", "traceWebSocketSummary"))
                                                            return;
                                                        var r = a()
                                                          , i = n.length
                                                          , s = i ? n[0] : -1
                                                          , c = 0
                                                          , l = 0
                                                          , u = null;
                                                        try {
                                                            c = "object" === ("undefined" == typeof performance ? "undefined" : ln(performance)) && performance && "function" == typeof performance.now ? performance.now() : Date.now()
                                                        } catch (t) {
                                                            c = Date.now()
                                                        }
                                                        try {
                                                            if (null != e && r.packetStartById) {
                                                                var h = String(e);
                                                                r.packetStartById[h] || (r.packetStartById[h] = c),
                                                                l = c - (r.packetStartById[h] || c)
                                                            } else
                                                                l = 0
                                                        } catch (t) {
                                                            l = 0
                                                        }
                                                        var f = 0 === String(t).indexOf("send-");
                                                        if (f) {
                                                            r.sendCount++,
                                                            r.sendBytes += i;
                                                            var d = String(s);
                                                            r.sendByOpcode[d] = (r.sendByOpcode[d] || 0) + 1
                                                        } else {
                                                            r.recvCount++,
                                                            r.recvBytes += i;
                                                            var p = String(s);
                                                            r.recvByOpcode[p] = (r.recvByOpcode[p] || 0) + 1
                                                        }
                                                        try {
                                                            if (i > 0 && i <= 64) {
                                                                u = o(n);
                                                                try {
                                                                    var y = Ht();
                                                                    y && (y.__EON_WS_LAST_PACKET_HEX__ = u)
                                                                } catch (t) {}
                                                            }
                                                            if (!f && 16 === i && u && null != e) {
                                                                try {
                                                                    var v = String(e);
                                                                    r.lastRecv16HexById && (r.lastRecv16HexById[v] = u),
                                                                    r.lastRecv16TById && (r.lastRecv16TById[v] = c),
                                                                    r.lastRecv16OpcodeById && (r.lastRecv16OpcodeById[v] = s);
                                                                    try {
                                                                        r.recv16SeqById && (r.recv16SeqById[v] = (r.recv16SeqById[v] || 0) + 1)
                                                                    } catch (t) {}
                                                                } catch (t) {}
                                                                try {
                                                                    var g = Bt()
                                                                      , m = jt();
                                                                    if (g || m) {
                                                                        var b = null
                                                                          , w = null
                                                                          , S = new Error("ws").stack || null;
                                                                        if ("string" == typeof S) {
                                                                            if (m)
                                                                                try {
                                                                                    w = [];
                                                                                    for (var k, C = /wasm-function\[(\d+)\]/g; null !== (k = C.exec(S)) && (k[1] && w.push(parseInt(k[1], 10)),
                                                                                    !(w.length >= 32)); )
                                                                                        ;
                                                                                    w.length < 1 && (w = null)
                                                                                } catch (t) {
                                                                                    w = null
                                                                                }
                                                                            var I = S.match(/wasm-function\[(\d+)\]/);
                                                                            I && I[1] && (b = parseInt(I[1], 10))
                                                                        }
                                                                        "number" == typeof b && r.lastRecv16WasmFnById && (r.lastRecv16WasmFnById[v] = b),
                                                                        w && r.lastRecv16WasmFnsById && (r.lastRecv16WasmFnsById[v] = w)
                                                                    }
                                                                } catch (t) {}
                                                                try {
                                                                    var x = Ht();
                                                                    x && (x.__EON_WS_LAST_CHALLENGE_HEX__ = u)
                                                                } catch (t) {}
                                                            }
                                                            if (f && i > 0 && i <= 512) {
                                                                var E = o(n);
                                                                r.lastSendHex = E,
                                                                r.firstSendHex || (r.firstSendHex = E);
                                                                try {
                                                                    if ((12 === i || 16 === i) && null != e) {
                                                                        var T = null
                                                                          , _ = null;
                                                                        try {
                                                                            var A = Bt()
                                                                              , P = jt();
                                                                            if (A || P) {
                                                                                var O = new Error("ws").stack || null;
                                                                                if ("string" == typeof O) {
                                                                                    if (P)
                                                                                        try {
                                                                                            _ = [];
                                                                                            for (var M, L = /wasm-function\[(\d+)\]/g; null !== (M = L.exec(O)) && (M[1] && _.push(parseInt(M[1], 10)),
                                                                                            !(_.length >= 32)); )
                                                                                                ;
                                                                                            _.length < 1 && (_ = null)
                                                                                        } catch (t) {
                                                                                            _ = null
                                                                                        }
                                                                                    var U = O.match(/wasm-function\[(\d+)\]/);
                                                                                    U && U[1] && (T = parseInt(U[1], 10))
                                                                                }
                                                                            }
                                                                        } catch (t) {
                                                                            T = null
                                                                        }
                                                                        var F = String(e);
                                                                        try {
                                                                            "number" == typeof T && r.lastSendWasmFnById && (r.lastSendWasmFnById[F] = T)
                                                                        } catch (t) {}
                                                                        var B, j = r.lastRecv16HexById ? r.lastRecv16HexById[F] : null, R = r.lastRecv16TById ? r.lastRecv16TById[F] : null, W = "number" == typeof R ? c - R : 0;
                                                                        B = 16 === i ? W >= 0 && W <= 5e3 : W >= 0 && W <= 3e3;
                                                                        var N = !0;
                                                                        try {
                                                                            var H = r.recv16SeqById && r.recv16SeqById[F] || 0
                                                                              , D = r.pairedRecv16SeqById && r.pairedRecv16SeqById[F] || 0;
                                                                            H && H <= D && (N = !1)
                                                                        } catch (t) {}
                                                                        if ("string" == typeof j && j && "number" == typeof R && B && N) {
                                                                            if (r.challengeReplyMap && (r.challengeReplyMap[j] = E),
                                                                            r.challengeReplyList && "function" == typeof r.challengeReplyList.push) {
                                                                                var G = null;
                                                                                try {
                                                                                    r.handshakesById && "object" === ln(r.handshakesById) && (G = r.handshakesById[F] || null)
                                                                                } catch (t) {
                                                                                    G = null
                                                                                }
                                                                                if (!G)
                                                                                    try {
                                                                                        G = r.lastHandshakeHex || r.handshakeHex || null
                                                                                    } catch (t) {
                                                                                        G = null
                                                                                    }
                                                                                var z = null;
                                                                                try {
                                                                                    r.lastRecv16OpcodeById && "object" === ln(r.lastRecv16OpcodeById) && (z = r.lastRecv16OpcodeById[F])
                                                                                } catch (t) {
                                                                                    z = null
                                                                                }
                                                                                if ("number" != typeof z)
                                                                                    try {
                                                                                        z = parseInt(String(j).slice(0, 2), 16)
                                                                                    } catch (t) {
                                                                                        z = null
                                                                                    }
                                                                                var V = null
                                                                                  , q = null;
                                                                                try {
                                                                                    r.lastRecv16WasmFnById && "object" === ln(r.lastRecv16WasmFnById) && (V = r.lastRecv16WasmFnById[F])
                                                                                } catch (t) {
                                                                                    V = null
                                                                                }
                                                                                try {
                                                                                    r.lastRecv16WasmFnsById && "object" === ln(r.lastRecv16WasmFnsById) && (q = r.lastRecv16WasmFnsById[F])
                                                                                } catch (t) {
                                                                                    q = null
                                                                                }
                                                                                r.challengeReplyList.push({
                                                                                    id: e,
                                                                                    t: l,
                                                                                    dt: W,
                                                                                    handshakeHex: G,
                                                                                    challengeHex: j,
                                                                                    challengeOpcode: z,
                                                                                    challengeWasmFn: V,
                                                                                    challengeWasmFns: q,
                                                                                    replyHex: E,
                                                                                    replyOpcode: s,
                                                                                    replyBytes: i,
                                                                                    replyWasmFn: T,
                                                                                    replyWasmFns: _
                                                                                });
                                                                                try {
                                                                                    r.pairedRecv16SeqById && r.recv16SeqById && (r.pairedRecv16SeqById[F] = r.recv16SeqById[F] || 0)
                                                                                } catch (t) {}
                                                                                r.challengeReplyList.length > r.challengeReplyLimit && r.challengeReplyList.splice(0, r.challengeReplyList.length - r.challengeReplyLimit)
                                                                            }
                                                                            try {
                                                                                var X = Ht();
                                                                                if (X) {
                                                                                    var Y = X.__EON_WS_CHALLENGE_MAP__;
                                                                                    Y && "object" === ln(Y) || (Y = X.__EON_WS_CHALLENGE_MAP__ = Object.create(null)),
                                                                                    Y[j] = E
                                                                                }
                                                                            } catch (t) {}
                                                                            try {
                                                                                if ("object" === ("undefined" == typeof localStorage ? "undefined" : ln(localStorage)) && localStorage) {
                                                                                    var K = Ht()
                                                                                      , Z = K && K.__EON_WS_CHALLENGE_MAP__ && "object" === ln(K.__EON_WS_CHALLENGE_MAP__) ? K.__EON_WS_CHALLENGE_MAP__ : null;
                                                                                    Z && localStorage.setItem("__EON_WS_CHALLENGE_MAP__", JSON.stringify(Z))
                                                                                }
                                                                            } catch (t) {}
                                                                            try {
                                                                                if ("object" === ("undefined" == typeof localStorage ? "undefined" : ln(localStorage)) && localStorage) {
                                                                                    var J = a();
                                                                                    J && J.challengeReplyList && "function" == typeof J.challengeReplyList.slice && localStorage.setItem("__EON_WS_CHALLENGE_PAIRS__", JSON.stringify(J.challengeReplyList.slice(-J.challengeReplyLimit)))
                                                                                }
                                                                            } catch (t) {}
                                                                        }
                                                                    }
                                                                } catch (t) {}
                                                                if (12 === i) {
                                                                    r.pingHex || (r.pingHex = E),
                                                                    r.lastPingHex = E;
                                                                    try {
                                                                        c = 0;
                                                                        try {
                                                                            c = "object" === ("undefined" == typeof performance ? "undefined" : ln(performance)) && performance && "function" == typeof performance.now ? performance.now() : Date.now()
                                                                        } catch (t) {
                                                                            c = Date.now()
                                                                        }
                                                                        var Q = null != e ? String(e) : null
                                                                          , $ = 0;
                                                                        Q && r.pingStartById ? (r.pingStartById[Q] || (r.pingStartById[Q] = c),
                                                                        $ = r.pingStartById[Q] || c) : $ = c;
                                                                        var tt = {
                                                                            id: e,
                                                                            t: c - $,
                                                                            hex: E
                                                                        };
                                                                        if (r.pingSamples && "function" == typeof r.pingSamples.push && (r.pingSamples.push(tt),
                                                                        r.pingSamples.length > r.pingSamplesLimit && r.pingSamples.splice(0, r.pingSamples.length - r.pingSamplesLimit)),
                                                                        Q && r.pingSamplesById) {
                                                                            var et = r.pingSamplesById[Q];
                                                                            et || (et = r.pingSamplesById[Q] = []),
                                                                            et.push(tt),
                                                                            et.length > r.pingSamplesLimit && et.splice(0, et.length - r.pingSamplesLimit)
                                                                        }
                                                                    } catch (t) {}
                                                                    try {
                                                                        var nt = Ht();
                                                                        if (nt) {
                                                                            nt.__EON_WS_PING_HEX__ = E;
                                                                            var rt = nt.__EON_WS_PING_SAMPLES__;
                                                                            rt && "function" == typeof rt.push || (rt = nt.__EON_WS_PING_SAMPLES__ = []),
                                                                            rt.push({
                                                                                t: l,
                                                                                hex: E
                                                                            }),
                                                                            rt.length > r.pingSamplesLimit && rt.splice(0, rt.length - r.pingSamplesLimit)
                                                                        }
                                                                    } catch (t) {}
                                                                }
                                                                if (null != e) {
                                                                    var it = String(e);
                                                                    r.lastSendHexById && (r.lastSendHexById[it] = E),
                                                                    r.firstSendHexById && !r.firstSendHexById[it] && (r.firstSendHexById[it] = E)
                                                                }
                                                                try {
                                                                    var ot = Ht();
                                                                    ot && (ot.__EON_WS_LAST_SEND_HEX__ !== E && (ot.__EON_WS_LAST_SEND_HEX__ = E),
                                                                    ot.__EON_WS_FIRST_SEND_HEX__ || (ot.__EON_WS_FIRST_SEND_HEX__ = E))
                                                                } catch (t) {}
                                                            }
                                                            if (f && 20 === i) {
                                                                var at = o(n);
                                                                if (r.handshakeHex || (r.handshakeHex = at),
                                                                r.lastHandshakeHex = at,
                                                                null != e) {
                                                                    var st = String(e);
                                                                    r.handshakesById[st] || (r.handshakesById[st] = at)
                                                                }
                                                            }
                                                        } catch (t) {}
                                                        try {
                                                            var ct = {
                                                                dir: t,
                                                                id: e,
                                                                opcode: s,
                                                                bytes: i,
                                                                t: l
                                                            };
                                                            if (i > 0 && i <= 64)
                                                                try {
                                                                    ct.hex = o(n)
                                                                } catch (t) {}
                                                            var lt = Bt()
                                                              , ut = jt();
                                                            if (lt || ut)
                                                                try {
                                                                    if (0 === String(t).indexOf("send-") && (12 === i || 16 === i || 20 === i) || 0 === String(t).indexOf("recv-") && 16 === i) {
                                                                        var ht = new Error("ws").stack || null;
                                                                        lt && (ct.stack = ht);
                                                                        try {
                                                                            if ("string" == typeof ht) {
                                                                                if (ut)
                                                                                    try {
                                                                                        for (var ft, dt = [], pt = /wasm-function\[(\d+)\]/g; null !== (ft = pt.exec(ht)) && (ft[1] && dt.push(parseInt(ft[1], 10)),
                                                                                        !(dt.length >= 32)); )
                                                                                            ;
                                                                                        dt.length > 0 && (ct.wasmFns = dt)
                                                                                    } catch (t) {}
                                                                                var yt = ht.match(/wasm-function\[(\d+)\]/);
                                                                                yt && yt[1] && (ct.wasmFn = parseInt(yt[1], 10))
                                                                            }
                                                                        } catch (t) {}
                                                                    }
                                                                } catch (t) {}
                                                            r.last.push(ct)
                                                        } catch (n) {
                                                            r.last.push({
                                                                dir: t,
                                                                id: e,
                                                                opcode: s,
                                                                bytes: i
                                                            })
                                                        }
                                                        r.last.length > r.lastLimit && r.last.splice(0, r.last.length - r.lastLimit)
                                                    } catch (t) {}
                                                }(e, n, r),
                                                !Ut())
                                                    return;
                                                if (0 === r.length)
                                                    return void Wt("[WASM][ws] " + e + "dump id=" + n + " empty");
                                                var c = r.length > 32 ? r.subarray(0, 32) : r;
                                                Wt("[WASM][ws] " + e + "dump id=" + n + " opcode=" + c[0] + " hex=" + o(c) + (r.length > 32 ? "…" : ""))
                                            } catch (t) {}
                                        }
                                          , l = function(t, e, n) {
                                            try {
                                                if (!Ut())
                                                    return;
                                                "function" == typeof t.arrayBuffer && t.slice(0, 32).arrayBuffer().then(function(t) {
                                                    c(t, e, n)
                                                }).catch(function() {})
                                            } catch (t) {}
                                        }
                                          , u = e.__traceWebSocketIdMap;
                                        u || "function" != typeof WeakMap || (u = new WeakMap,
                                        e.__traceWebSocketIdMap = u);
                                        var h = function(t) {
                                            try {
                                                if (!t)
                                                    return;
                                                try {
                                                    if (void 0 !== t.__eonTraceWsId)
                                                        return t.__eonTraceWsId
                                                } catch (t) {}
                                                try {
                                                    if (u && u.has(t))
                                                        return u.get(t)
                                                } catch (t) {}
                                                var n = ++r;
                                                e.__traceWebSocketCounter = r;
                                                try {
                                                    u && u.set(t, n)
                                                } catch (t) {}
                                                try {
                                                    t.__eonTraceWsId = n
                                                } catch (t) {}
                                                return n
                                            } catch (t) {
                                                return
                                            }
                                        }
                                          , f = function(t) {
                                            try {
                                                var r = n && n.prototype;
                                                if (!r)
                                                    return;
                                                var o = r[t];
                                                if ("function" != typeof o)
                                                    return;
                                                if (o.__eonTraceWsProtoWrapped)
                                                    return;
                                                var a = function() {
                                                    var n;
                                                    try {
                                                        var r = "";
                                                        try {
                                                            this && void 0 !== this.__eonTraceWsId ? n = this.__eonTraceWsId : u && this && u.has(this) && (n = u.get(this))
                                                        } catch (t) {}
                                                        void 0 === n && (n = h(this)),
                                                        void 0 !== n && (r = " id=" + n);
                                                        var a = "";
                                                        try {
                                                            this && "string" == typeof this.url && this.url && (a = " url=" + i(this.url))
                                                        } catch (t) {}
                                                        Mt() || Wt("[WASM][ws] proto-" + t + r + a + " thisType=" + (this && this.constructor && this.constructor.name ? this.constructor.name : ln(this)))
                                                    } catch (t) {}
                                                    if (Ft())
                                                        try {
                                                            Wt(new Error("[WASM][ws] stack for proto-" + t).stack || "")
                                                        } catch (t) {}
                                                    try {
                                                        if ("send" === t) {
                                                            var s = arguments.length ? arguments[0] : void 0
                                                              , f = ln(s)
                                                              , d = "";
                                                            "function" == typeof ArrayBuffer && s instanceof ArrayBuffer || "function" == typeof Uint8Array && s instanceof Uint8Array ? d = " bytes=" + s.byteLength : "function" == typeof Blob && s instanceof Blob ? d = " bytes=" + s.size : "function" == typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && ArrayBuffer.isView(s) && s && "number" == typeof s.byteLength ? d = " bytes=" + s.byteLength : "string" === f && (d = " chars=" + s.length),
                                                            Mt() || Wt("[WASM][ws] proto-send" + (void 0 !== n ? " id=" + n : "") + " type=" + f + d),
                                                            "function" == typeof ArrayBuffer && s instanceof ArrayBuffer || "function" == typeof Uint8Array && s instanceof Uint8Array ? c(s, "send-", void 0 !== n ? n : "unknown") : "function" == typeof Blob && s instanceof Blob ? l(s, "send-", void 0 !== n ? n : "unknown") : "function" == typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && ArrayBuffer.isView(s) ? c(s, "send-", void 0 !== n ? n : "unknown") : "string" === f && Ut() && Wt("[WASM][ws] send-text" + (void 0 !== n ? " id=" + n : "") + " head=" + (s.length > 120 ? s.slice(0, 120) + "…" : s))
                                                        } else
                                                            "close" === t && (Mt() || Wt("[WASM][ws] proto-close" + (void 0 !== n ? " id=" + n : "") + " code=" + i(arguments[0]) + " reason=" + i(arguments[1])))
                                                    } catch (t) {}
                                                    if ("close" === t && Rt())
                                                        try {
                                                            var p = e.__traceWebSocketActiveHandler;
                                                            if (p && "onopen" === p.kind && (void 0 === p.id || void 0 === n || p.id === n))
                                                                return void Wt("[WASM][ws] proto-close blocked during=onopen" + (void 0 !== n ? " id=" + n : ""))
                                                        } catch (t) {}
                                                    return o.apply(this, arguments)
                                                };
                                                try {
                                                    a.__eonTraceWsProtoWrapped = !0
                                                } catch (t) {}
                                                r[t] = a
                                            } catch (t) {}
                                        };
                                        f("send"),
                                        f("close");
                                        try {
                                            var d = e.__traceWebSocketHandlerCacheBySocket;
                                            d || (d = "function" == typeof WeakMap ? new WeakMap : null,
                                            e.__traceWebSocketHandlerCacheBySocket = d);
                                            var p = e.__traceWebSocketOnopenEnvLogged;
                                            p || (p = "function" == typeof WeakSet ? new WeakSet : null,
                                            e.__traceWebSocketOnopenEnvLogged = p);
                                            var y = function(t, r, o) {
                                                if ("function" != typeof o)
                                                    return o;
                                                try {
                                                    if (d && t) {
                                                        var a = d.get(t);
                                                        if (!a) {
                                                            a = "function" == typeof WeakMap ? new WeakMap : null;
                                                            try {
                                                                d.set(t, a)
                                                            } catch (t) {}
                                                        }
                                                        if (a && a.has(o))
                                                            return a.get(o)
                                                    }
                                                } catch (t) {}
                                                var s = function(t) {
                                                    var a = this
                                                      , s = h(a);
                                                    try {
                                                        e.__traceWebSocketActiveHandler = {
                                                            id: s,
                                                            kind: r,
                                                            get: 0,
                                                            set: 0
                                                        }
                                                    } catch (t) {}
                                                    try {
                                                        (!Mt() || "onmessage" !== r && "add:message" !== r) && Wt("[WASM][ws] handler-call " + r + " id=" + s)
                                                    } catch (t) {}
                                                    try {
                                                        if ("onopen" === r || "add:open" === r) {
                                                            var u = !1;
                                                            try {
                                                                p && a && (u = p.has(a))
                                                            } catch (t) {}
                                                            if (!u) {
                                                                try {
                                                                    p && a && p.add(a)
                                                                } catch (t) {}
                                                                var f = ""
                                                                  , d = ""
                                                                  , y = ""
                                                                  , v = "";
                                                                try {
                                                                    f = "object" === ("undefined" == typeof location ? "undefined" : ln(location)) && location ? i(location.href) : ""
                                                                } catch (t) {}
                                                                try {
                                                                    d = "object" === ("undefined" == typeof location ? "undefined" : ln(location)) && location ? i(location.origin) : ""
                                                                } catch (t) {}
                                                                try {
                                                                    y = "object" === ("undefined" == typeof document ? "undefined" : ln(document)) && document ? i(document.referrer) : ""
                                                                } catch (t) {}
                                                                try {
                                                                    v = "object" === ("undefined" == typeof navigator ? "undefined" : ln(navigator)) && navigator ? i(navigator.userAgent) : ""
                                                                } catch (t) {}
                                                                Wt("[WASM][ws] onopen env id=" + s + " origin=" + d + " href=" + f + " referrer=" + y + " ua=" + v)
                                                            }
                                                        }
                                                    } catch (t) {}
                                                    if (Ft())
                                                        try {
                                                            Wt(new Error("[WASM][ws] stack for handler " + r + " id=" + s).stack || "")
                                                        } catch (t) {}
                                                    try {
                                                        if (("onmessage" === r || "add:message" === r) && t && void 0 !== t.data) {
                                                            try {
                                                                var g = Ht()
                                                                  , m = !(!g || !g.__EON_BYPASS_WASM_HANDSHAKE__)
                                                                  , b = !1;
                                                                try {
                                                                    b = !(!a || !0 !== a.__EON_BYPASS_WASM_AUTOREPLY16__) || !(!g || !0 !== g.__EON_BYPASS_WASM_AUTOREPLY16__)
                                                                } catch (t) {}
                                                                if (m && b && a && !0 === a.__EON_BYPASS_WASM_HANDSHAKE__) {
                                                                    var w = t.data
                                                                      , S = null;
                                                                    try {
                                                                        "function" == typeof Uint8Array && w instanceof Uint8Array ? S = w : "function" == typeof ArrayBuffer && w instanceof ArrayBuffer ? S = new Uint8Array(w) : "function" == typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && ArrayBuffer.isView(w) && w && w.buffer && (S = new Uint8Array(w.buffer,w.byteOffset || 0,w.byteLength || 0))
                                                                    } catch (t) {}
                                                                    if (S && 16 === S.byteLength && a && a.readyState === n.OPEN) {
                                                                        var k = new Uint8Array(16)
                                                                          , C = null;
                                                                        try {
                                                                            C = g && g.crypto ? g.crypto : "object" === ("undefined" == typeof crypto ? "undefined" : ln(crypto)) ? crypto : null
                                                                        } catch (t) {}
                                                                        try {
                                                                            if (C && "function" == typeof C.getRandomValues)
                                                                                C.getRandomValues(k);
                                                                            else
                                                                                for (var I = 0; I < 16; I++)
                                                                                    k[I] = 256 * Math.random() | 0
                                                                        } catch (t) {}
                                                                        try {
                                                                            a.__eonBypassHandshakeActive = !0,
                                                                            a.__eonBypassHandshakeAt = Date.now ? Date.now() : +new Date,
                                                                            a.__eonBypassInternalSend = !0
                                                                        } catch (t) {}
                                                                        try {
                                                                            a.send(k)
                                                                        } catch (t) {
                                                                            try {
                                                                                n.prototype.send.call(a, k)
                                                                            } catch (t) {}
                                                                        }
                                                                        try {
                                                                            a.__eonBypassInternalSend = !1
                                                                        } catch (t) {}
                                                                    }
                                                                }
                                                            } catch (t) {}
                                                            try {
                                                                var x = t.data
                                                                  , E = ln(x)
                                                                  , T = "";
                                                                "function" == typeof ArrayBuffer && x instanceof ArrayBuffer || "function" == typeof Uint8Array && x instanceof Uint8Array ? T = " bytes=" + x.byteLength : "function" == typeof Blob && x instanceof Blob ? T = " bytes=" + x.size : "string" === E && (T = " chars=" + x.length),
                                                                Lt() && Wt("[WASM][ws] handler-message id=" + s + " type=" + E + T),
                                                                "function" == typeof ArrayBuffer && x instanceof ArrayBuffer || "function" == typeof Uint8Array && x instanceof Uint8Array ? c(x, "recv-", s) : "function" == typeof Blob && x instanceof Blob ? l(x, "recv-", s) : "string" === E && Ut() && Wt("[WASM][ws] recv-text id=" + s + " head=" + (x.length > 120 ? x.slice(0, 120) + "…" : x))
                                                            } catch (t) {}
                                                        }
                                                        var _ = o.apply(this, arguments);
                                                        try {
                                                            (!Mt() || "onmessage" !== r && "add:message" !== r) && Wt("[WASM][ws] handler-return " + r + " id=" + s)
                                                        } catch (t) {}
                                                        return _
                                                    } catch (t) {
                                                        try {
                                                            Wt("[WASM][ws] handler-throw " + r + " id=" + s + " err=" + i(t && t.message ? t.message : t))
                                                        } catch (t) {}
                                                        try {
                                                            Wt(t && t.stack ? t.stack : "")
                                                        } catch (t) {}
                                                        throw t
                                                    } finally {
                                                        try {
                                                            e.__traceWebSocketActiveHandler = null
                                                        } catch (t) {}
                                                    }
                                                };
                                                try {
                                                    if (d && t) {
                                                        var u = d.get(t);
                                                        u && "function" == typeof u.set && u.set(o, s)
                                                    }
                                                } catch (t) {}
                                                return s
                                            }
                                              , v = function(t) {
                                                try {
                                                    for (var e = n && n.prototype; e; ) {
                                                        var r = Object.getOwnPropertyDescriptor(e, t);
                                                        if (r && "function" == typeof r.get && "function" == typeof r.set) {
                                                            if (r.set && r.set.__eonTraceWsOnPropWrapped)
                                                                return;
                                                            var i = r.get
                                                              , o = r.set
                                                              , a = function(e) {
                                                                var n = h(this);
                                                                try {
                                                                    Wt("[WASM][ws] set " + t + " id=" + n + " type=" + ln(e))
                                                                } catch (t) {}
                                                                if (Ft())
                                                                    try {
                                                                        Wt(new Error("[WASM][ws] stack for set " + t + " id=" + n).stack || "")
                                                                    } catch (t) {}
                                                                return o.call(this, y(this, t, e))
                                                            };
                                                            try {
                                                                a.__eonTraceWsOnPropWrapped = !0
                                                            } catch (t) {}
                                                            return void Object.defineProperty(e, t, {
                                                                configurable: !0,
                                                                enumerable: r.enumerable,
                                                                get: function() {
                                                                    return i.call(this)
                                                                },
                                                                set: a
                                                            })
                                                        }
                                                        e = Object.getPrototypeOf(e)
                                                    }
                                                } catch (t) {}
                                            };
                                            v("onopen"),
                                            v("onmessage"),
                                            v("onclose"),
                                            v("onerror");
                                            try {
                                                var g = n && n.prototype;
                                                if (g) {
                                                    var m = g.addEventListener;
                                                    if ("function" == typeof m && !m.__eonTraceWsAddWrapped) {
                                                        var b = function(t, e, n) {
                                                            var r = h(this);
                                                            try {
                                                                Wt("[WASM][ws] addEventListener id=" + r + " type=" + i(t) + " listenerType=" + ln(e))
                                                            } catch (t) {}
                                                            if (Ft())
                                                                try {
                                                                    Wt(new Error("[WASM][ws] stack for addEventListener id=" + r + " type=" + i(t)).stack || "")
                                                                } catch (t) {}
                                                            return m.call(this, t, y(this, "add:" + i(t), e), n)
                                                        };
                                                        try {
                                                            b.__eonTraceWsAddWrapped = !0
                                                        } catch (t) {}
                                                        g.addEventListener = b
                                                    }
                                                    var w = g.removeEventListener;
                                                    if ("function" == typeof w && !w.__eonTraceWsRemoveWrapped) {
                                                        var S = function(t, e, n) {
                                                            return w.call(this, t, y(this, "add:" + i(t), e), n)
                                                        };
                                                        try {
                                                            S.__eonTraceWsRemoveWrapped = !0
                                                        } catch (t) {}
                                                        g.removeEventListener = S
                                                    }
                                                }
                                            } catch (t) {}
                                        } catch (t) {}
                                        var k = function(t, o) {
                                            var a, s = ++r;
                                            e.__traceWebSocketCounter = r;
                                            try {
                                                Wt("[WASM][ws] new id=" + s + " url=" + i(t) + " protocols=" + function(t) {
                                                    if (void 0 === t)
                                                        return "undefined";
                                                    if (null === t)
                                                        return "null";
                                                    if ("string" == typeof t)
                                                        return t.length > 120 ? t.slice(0, 120) + "…" : t;
                                                    try {
                                                        if ("object" === ln(t) && "number" == typeof t.length) {
                                                            for (var e = [], n = 0; n < t.length; n++)
                                                                e.push(i(t[n]));
                                                            var r = e.join(",");
                                                            return r.length > 120 ? r.slice(0, 120) + "…" : r
                                                        }
                                                    } catch (t) {}
                                                    return i(t)
                                                }(o))
                                            } catch (t) {}
                                            if (Ft())
                                                try {
                                                    Wt(new Error("[WASM][ws] stack for new id=" + s).stack || "")
                                                } catch (t) {}
                                            try {
                                                a = void 0 !== o ? new n(t,o) : new n(t)
                                            } catch (t) {
                                                try {
                                                    Wt("[WASM][ws] new failed id=" + s + " err=" + i(t && t.message ? t.message : t))
                                                } catch (t) {}
                                                throw t
                                            }
                                            try {
                                                u && u.set(a, s)
                                            } catch (t) {}
                                            try {
                                                a.__eonTraceWsId = s
                                            } catch (t) {}
                                            try {
                                                a.addEventListener("open", function() {
                                                    try {
                                                        Wt("[WASM][ws] open id=" + s + " protocol=" + i(a.protocol))
                                                    } catch (t) {}
                                                })
                                            } catch (t) {}
                                            try {
                                                a.addEventListener("close", function(t) {
                                                    try {
                                                        Wt("[WASM][ws] close id=" + s + " code=" + t.code + " clean=" + !!t.wasClean + " reason=" + i(t.reason))
                                                    } catch (t) {}
                                                    if (Ft())
                                                        try {
                                                            Wt(new Error("[WASM][ws] stack for close event id=" + s).stack || "")
                                                        } catch (t) {}
                                                })
                                            } catch (t) {}
                                            try {
                                                a.addEventListener("error", function() {
                                                    try {
                                                        Wt("[WASM][ws] error id=" + s)
                                                    } catch (t) {}
                                                    if (Ft())
                                                        try {
                                                            Wt(new Error("[WASM][ws] stack for error event id=" + s).stack || "")
                                                        } catch (t) {}
                                                })
                                            } catch (t) {}
                                            if (Lt())
                                                try {
                                                    a.addEventListener("message", function(t) {
                                                        try {
                                                            var e = t.data
                                                              , n = ln(e)
                                                              , r = "";
                                                            "function" == typeof ArrayBuffer && e instanceof ArrayBuffer ? r = " bytes=" + e.byteLength : "function" == typeof Blob && e instanceof Blob ? r = " bytes=" + e.size : "string" === n && (r = " chars=" + e.length),
                                                            Wt("[WASM][ws] message id=" + s + " type=" + n + r),
                                                            "function" == typeof ArrayBuffer && e instanceof ArrayBuffer || "function" == typeof Uint8Array && e instanceof Uint8Array ? c(e, "recv-", s) : "function" == typeof Blob && e instanceof Blob ? l(e, "recv-", s) : "string" === n && Ut() && Wt("[WASM][ws] recv-text id=" + s + " head=" + (e.length > 120 ? e.slice(0, 120) + "…" : e))
                                                        } catch (t) {}
                                                    })
                                                } catch (t) {}
                                            try {
                                                var h = "function" == typeof WeakMap ? new WeakMap : null
                                                  , f = !1
                                                  , d = function(t, r) {
                                                    try {
                                                        if ("function" != typeof r)
                                                            return r;
                                                        if (h && h.has(r))
                                                            return h.get(r);
                                                        var o = function(o) {
                                                            try {
                                                                e.__traceWebSocketActiveHandler = {
                                                                    id: s,
                                                                    kind: t,
                                                                    get: 0,
                                                                    set: 0
                                                                }
                                                            } catch (t) {}
                                                            try {
                                                                (!Mt() || "onmessage" !== t && "add:message" !== t) && Wt("[WASM][ws] handler-call " + t + " id=" + s)
                                                            } catch (t) {}
                                                            try {
                                                                if (!f && "onopen" === t) {
                                                                    f = !0;
                                                                    var u = ""
                                                                      , h = ""
                                                                      , d = ""
                                                                      , p = "";
                                                                    try {
                                                                        u = "object" === ("undefined" == typeof location ? "undefined" : ln(location)) && location ? i(location.href) : ""
                                                                    } catch (t) {}
                                                                    try {
                                                                        h = "object" === ("undefined" == typeof location ? "undefined" : ln(location)) && location ? i(location.origin) : ""
                                                                    } catch (t) {}
                                                                    try {
                                                                        d = "object" === ("undefined" == typeof document ? "undefined" : ln(document)) && document ? i(document.referrer) : ""
                                                                    } catch (t) {}
                                                                    try {
                                                                        p = "object" === ("undefined" == typeof navigator ? "undefined" : ln(navigator)) && navigator ? i(navigator.userAgent) : ""
                                                                    } catch (t) {}
                                                                    Wt("[WASM][ws] onopen env id=" + s + " origin=" + h + " href=" + u + " referrer=" + d + " ua=" + p)
                                                                }
                                                            } catch (t) {}
                                                            if (Ft())
                                                                try {
                                                                    Wt(new Error("[WASM][ws] stack for handler " + t + " id=" + s).stack || "")
                                                                } catch (t) {}
                                                            try {
                                                                if (("onmessage" === t || "add:message" === t) && o && void 0 !== o.data) {
                                                                    try {
                                                                        var y = Ht();
                                                                        if (y && y.__EON_BYPASS_WASM_HANDSHAKE__ && a && !0 === a.__EON_BYPASS_WASM_HANDSHAKE__) {
                                                                            var v = o.data
                                                                              , g = null;
                                                                            try {
                                                                                "function" == typeof Uint8Array && v instanceof Uint8Array ? g = v : "function" == typeof ArrayBuffer && v instanceof ArrayBuffer ? g = new Uint8Array(v) : "function" == typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && ArrayBuffer.isView(v) && v && v.buffer && (g = new Uint8Array(v.buffer,v.byteOffset || 0,v.byteLength || 0))
                                                                            } catch (t) {}
                                                                            if (g && 16 === g.byteLength && a && a.readyState === n.OPEN) {
                                                                                var m = new Uint8Array(16)
                                                                                  , b = null;
                                                                                try {
                                                                                    b = y && y.crypto ? y.crypto : "object" === ("undefined" == typeof crypto ? "undefined" : ln(crypto)) ? crypto : null
                                                                                } catch (t) {}
                                                                                try {
                                                                                    if (b && "function" == typeof b.getRandomValues)
                                                                                        b.getRandomValues(m);
                                                                                    else
                                                                                        for (var w = 0; w < 16; w++)
                                                                                            m[w] = 256 * Math.random() | 0
                                                                                } catch (t) {}
                                                                                try {
                                                                                    a.__eonBypassHandshakeActive = !0,
                                                                                    a.__eonBypassHandshakeAt = Date.now ? Date.now() : +new Date,
                                                                                    a.__eonBypassInternalSend = !0
                                                                                } catch (t) {}
                                                                                try {
                                                                                    a.send(m)
                                                                                } catch (t) {
                                                                                    try {
                                                                                        n.prototype.send.call(a, m)
                                                                                    } catch (t) {}
                                                                                }
                                                                                try {
                                                                                    a.__eonBypassInternalSend = !1
                                                                                } catch (t) {}
                                                                            }
                                                                        }
                                                                    } catch (t) {}
                                                                    var S = o.data
                                                                      , k = ln(S)
                                                                      , C = "";
                                                                    "function" == typeof ArrayBuffer && S instanceof ArrayBuffer || "function" == typeof Uint8Array && S instanceof Uint8Array ? C = " bytes=" + S.byteLength : "function" == typeof Blob && S instanceof Blob ? C = " bytes=" + S.size : "string" === k && (C = " chars=" + S.length),
                                                                    Mt() || Wt("[WASM][ws] handler-message id=" + s + " type=" + k + C),
                                                                    "function" == typeof ArrayBuffer && S instanceof ArrayBuffer || "function" == typeof Uint8Array && S instanceof Uint8Array ? c(S, "recv-", s) : "function" == typeof Blob && S instanceof Blob ? l(S, "recv-", s) : "string" === k && Ut() && Wt("[WASM][ws] recv-text id=" + s + " head=" + (S.length > 120 ? S.slice(0, 120) + "…" : S))
                                                                }
                                                            } catch (t) {}
                                                            try {
                                                                var I = r.apply(this, arguments);
                                                                try {
                                                                    (!Mt() || "onmessage" !== t && "add:message" !== t) && Wt("[WASM][ws] handler-return " + t + " id=" + s)
                                                                } catch (t) {}
                                                                return I
                                                            } catch (e) {
                                                                try {
                                                                    Wt("[WASM][ws] handler-throw " + t + " id=" + s + " err=" + i(e && e.message ? e.message : e))
                                                                } catch (t) {}
                                                                try {
                                                                    Wt(e && e.stack ? e.stack : "")
                                                                } catch (t) {}
                                                                throw e
                                                            } finally {
                                                                try {
                                                                    e.__traceWebSocketActiveHandler = null
                                                                } catch (t) {}
                                                            }
                                                        };
                                                        try {
                                                            h && h.set(r, o)
                                                        } catch (t) {}
                                                        return o
                                                    } catch (t) {
                                                        return r
                                                    }
                                                }
                                                  , p = a.addEventListener;
                                                "function" == typeof p && (a.addEventListener = function(t, e, n) {
                                                    try {
                                                        Wt("[WASM][ws] addEventListener id=" + s + " type=" + i(t) + " listenerType=" + ln(e))
                                                    } catch (t) {}
                                                    if (Ft())
                                                        try {
                                                            Wt(new Error("[WASM][ws] stack for addEventListener id=" + s + " type=" + i(t)).stack || "")
                                                        } catch (t) {}
                                                    return p.call(a, t, d("add:" + i(t), e), n)
                                                }
                                                )
                                            } catch (t) {}
                                            try {
                                                var y = a.removeEventListener;
                                                "function" == typeof y && (a.removeEventListener = function(t, e, n) {
                                                    return y.call(a, t, d("add:" + i(t), e), n)
                                                }
                                                )
                                            } catch (t) {}
                                            try {
                                                for (var v = ["onopen", "onmessage", "onclose", "onerror"], g = 0; g < v.length; g++)
                                                    (function(t) {
                                                        try {
                                                            var e = Object.getOwnPropertyDescriptor(a, t);
                                                            if (e && e.set && e.__eonTraceWsOnPropWrapped)
                                                                return;
                                                            var n = e || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(a), t);
                                                            if (!n || "function" != typeof n.set || "function" != typeof n.get)
                                                                return;
                                                            Object.defineProperty(a, t, {
                                                                configurable: !0,
                                                                enumerable: !0,
                                                                get: function() {
                                                                    return n.get.call(a)
                                                                },
                                                                set: function(e) {
                                                                    try {
                                                                        Wt("[WASM][ws] set " + t + " id=" + s + " type=" + ln(e))
                                                                    } catch (t) {}
                                                                    if (Ft())
                                                                        try {
                                                                            Wt(new Error("[WASM][ws] stack for set " + t + " id=" + s).stack || "")
                                                                        } catch (t) {}
                                                                    return n.set.call(a, d(t, e))
                                                                }
                                                            })
                                                        } catch (t) {}
                                                    }
                                                    )(v[g])
                                            } catch (t) {}
                                            try {
                                                a.binaryType = "arraybuffer";
                                                try {
                                                    Wt("[WASM][ws] set binaryType id=" + s + " value=" + i(a.binaryType))
                                                } catch (t) {}
                                            } catch (t) {}
                                            var m = a
                                              , b = !1;
                                            try {
                                                if ("function" == typeof Proxy) {
                                                    var w = "function" == typeof WeakMap ? new WeakMap : null
                                                      , S = function(t, e) {
                                                        try {
                                                            var n = ln(e);
                                                            if ("function" === n)
                                                                return "function " + (e && e.name ? e.name : "<anon>") + " len=" + (e && "number" == typeof e.length ? e.length : "?");
                                                            if ("string" === n)
                                                                return e.length > 160 ? e.slice(0, 160) + "…" : e;
                                                            if ("object" === n && e)
                                                                try {
                                                                    var r = e.constructor && e.constructor.name ? e.constructor.name : "Object";
                                                                    return "readyState" === t ? C(e) : "[object " + r + "]"
                                                                } catch (t) {}
                                                            return i(e)
                                                        } catch (t) {
                                                            return "<unprintable>"
                                                        }
                                                    }
                                                      , k = function() {
                                                        try {
                                                            var t = e.__traceWebSocketActiveHandler;
                                                            if (t && t.id === s)
                                                                return t
                                                        } catch (t) {}
                                                        return null
                                                    }
                                                      , C = function(t) {
                                                        try {
                                                            if (t === n.CONNECTING)
                                                                return t + "(CONNECTING)";
                                                            if (t === n.OPEN)
                                                                return t + "(OPEN)";
                                                            if (t === n.CLOSING)
                                                                return t + "(CLOSING)";
                                                            if (t === n.CLOSED)
                                                                return t + "(CLOSED)"
                                                        } catch (t) {}
                                                        return i(t)
                                                    }
                                                      , I = function(t) {
                                                        return "protocol" === t || "binaryType" === t || "readyState" === t || "url" === t || "extensions" === t || "bufferedAmount" === t
                                                    };
                                                    m = new Proxy(a,{
                                                        get: function(t, e, n) {
                                                            var r = Reflect.get(t, e, t)
                                                              , o = k();
                                                            if (o) {
                                                                try {
                                                                    o.get = (o.get || 0) + 1
                                                                } catch (t) {}
                                                                var a = I(e);
                                                                if (a || "onopen" !== o.kind || "string" != typeof e || (a = (o.get || 0) <= 60 && "__eonTraceWsId" !== e),
                                                                a) {
                                                                    var c = S(e, r);
                                                                    try {
                                                                        Wt("[WASM][ws] get " + String(e) + " id=" + s + " value=" + c + " during=" + i(o.kind))
                                                                    } catch (t) {}
                                                                }
                                                            }
                                                            if ("function" == typeof r) {
                                                                if (w && w.has(r))
                                                                    return w.get(r);
                                                                var l = function() {
                                                                    return r.apply(t, arguments)
                                                                };
                                                                try {
                                                                    w && w.set(r, l)
                                                                } catch (t) {}
                                                                return l
                                                            }
                                                            return r
                                                        },
                                                        set: function(t, e, n, r) {
                                                            var o = k();
                                                            if (o) {
                                                                try {
                                                                    o.set = (o.set || 0) + 1
                                                                } catch (t) {}
                                                                var a = I(e);
                                                                if (a || "onopen" !== o.kind || "string" != typeof e || (a = (o.set || 0) <= 40 && "__eonTraceWsId" !== e),
                                                                a) {
                                                                    var c = S(e, n);
                                                                    try {
                                                                        Wt("[WASM][ws] set " + String(e) + " id=" + s + " value=" + c + " during=" + i(o.kind))
                                                                    } catch (t) {}
                                                                }
                                                            }
                                                            return Reflect.set(t, e, n, t)
                                                        }
                                                    });
                                                    try {
                                                        m.__eonTraceWsId = s
                                                    } catch (t) {}
                                                    try {
                                                        u && u.set(m, s)
                                                    } catch (t) {}
                                                    try {
                                                        Wt("[WASM][ws] instanceCheck id=" + s + " wsInstanceof=" + (a instanceof n) + " proxyInstanceof=" + (m instanceof n))
                                                    } catch (t) {}
                                                }
                                            } catch (t) {}
                                            try {
                                                var x = a.send;
                                                "function" == typeof x && (a.send = function(t) {
                                                    try {
                                                        var n = Ht();
                                                        if (n && n.__EON_BYPASS_WASM_HANDSHAKE__ && a && !0 === a.__EON_BYPASS_WASM_HANDSHAKE__ && a.__eonBypassHandshakeActive && !a.__eonBypassInternalSend) {
                                                            var r = Date.now ? Date.now() : +new Date
                                                              , o = 0;
                                                            try {
                                                                o = a.__eonBypassHandshakeAt || 0
                                                            } catch (t) {
                                                                o = 0
                                                            }
                                                            if (o && r - o > 2e3)
                                                                try {
                                                                    a.__eonBypassHandshakeActive = !1
                                                                } catch (t) {}
                                                            else {
                                                                var u = null;
                                                                try {
                                                                    "function" == typeof Uint8Array && t instanceof Uint8Array ? u = t : "function" == typeof ArrayBuffer && t instanceof ArrayBuffer ? u = new Uint8Array(t) : "function" == typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && ArrayBuffer.isView(t) && t && t.buffer && (u = new Uint8Array(t.buffer,t.byteOffset || 0,t.byteLength || 0))
                                                                } catch (t) {}
                                                                if (u && 16 === u.byteLength) {
                                                                    try {
                                                                        a.__eonBypassHandshakeActive = !1
                                                                    } catch (t) {}
                                                                    return
                                                                }
                                                            }
                                                        }
                                                    } catch (t) {}
                                                    try {
                                                        var h = ln(t)
                                                          , f = "";
                                                        "function" == typeof ArrayBuffer && t instanceof ArrayBuffer || "function" == typeof Uint8Array && t instanceof Uint8Array ? f = " bytes=" + t.byteLength : "function" == typeof Blob && t instanceof Blob ? f = " bytes=" + t.size : "string" === h && (f = " chars=" + t.length),
                                                        Wt("[WASM][ws] send id=" + s + " type=" + h + f);
                                                        try {
                                                            var d = e.__traceWebSocketActiveHandler;
                                                            d && d.id === s && Wt("[WASM][ws] send id=" + s + " during=" + i(d.kind))
                                                        } catch (t) {}
                                                        "function" == typeof ArrayBuffer && t instanceof ArrayBuffer || "function" == typeof Uint8Array && t instanceof Uint8Array ? c(t, "send-", s) : "function" == typeof Blob && t instanceof Blob ? l(t, "send-", s) : "string" === h && Ut() && Wt("[WASM][ws] send-text id=" + s + " head=" + (t.length > 120 ? t.slice(0, 120) + "…" : t))
                                                    } catch (t) {}
                                                    if (Ft())
                                                        try {
                                                            Wt(new Error("[WASM][ws] stack for send id=" + s).stack || "")
                                                        } catch (t) {}
                                                    return x.call(a, t)
                                                }
                                                )
                                            } catch (t) {}
                                            try {
                                                var E = a.close;
                                                "function" == typeof E && (a.close = function(t, n) {
                                                    try {
                                                        Wt("[WASM][ws] close() id=" + s + " code=" + i(t) + " reason=" + i(n))
                                                    } catch (t) {}
                                                    try {
                                                        var r = e.__traceWebSocketActiveHandler;
                                                        if (r && r.id === s && (Wt("[WASM][ws] close() id=" + s + " during=" + i(r.kind)),
                                                        !b && "onopen" === r.kind)) {
                                                            b = !0;
                                                            try {
                                                                var o = ""
                                                                  , c = ""
                                                                  , l = ""
                                                                  , u = "";
                                                                try {
                                                                    o = "object" === ("undefined" == typeof location ? "undefined" : ln(location)) && location ? i(location.href) : ""
                                                                } catch (t) {}
                                                                try {
                                                                    c = "object" === ("undefined" == typeof location ? "undefined" : ln(location)) && location ? i(location.origin) : ""
                                                                } catch (t) {}
                                                                try {
                                                                    l = "object" === ("undefined" == typeof document ? "undefined" : ln(document)) && document ? i(document.referrer) : ""
                                                                } catch (t) {}
                                                                try {
                                                                    u = "object" === ("undefined" == typeof navigator ? "undefined" : ln(navigator)) && navigator ? i(navigator.userAgent) : ""
                                                                } catch (t) {}
                                                                Wt("[WASM][ws] onopen-close env id=" + s + " origin=" + c + " href=" + o + " referrer=" + l + " ua=" + u)
                                                            } catch (t) {}
                                                        }
                                                    } catch (t) {}
                                                    if (Rt())
                                                        try {
                                                            var h = e.__traceWebSocketActiveHandler;
                                                            if (h && h.id === s && "onopen" === h.kind)
                                                                return void Wt("[WASM][ws] close() blocked id=" + s + " during=onopen")
                                                        } catch (t) {}
                                                    if (Ft())
                                                        try {
                                                            Wt(new Error("[WASM][ws] stack for close() id=" + s).stack || "")
                                                        } catch (t) {}
                                                    return E.call(a, t, n)
                                                }
                                                )
                                            } catch (t) {}
                                            return m
                                        };
                                        try {
                                            k.__eonTraceWsWrapped = !0
                                        } catch (t) {}
                                        try {
                                            k.__eonTraceWsOriginal = n
                                        } catch (t) {}
                                        try {
                                            k.prototype = n.prototype
                                        } catch (t) {}
                                        try {
                                            Object.setPrototypeOf(k, n)
                                        } catch (t) {}
                                        try {
                                            k.CONNECTING = n.CONNECTING
                                        } catch (t) {}
                                        try {
                                            k.OPEN = n.OPEN
                                        } catch (t) {}
                                        try {
                                            k.CLOSING = n.CLOSING
                                        } catch (t) {}
                                        try {
                                            k.CLOSED = n.CLOSED
                                        } catch (t) {}
                                        if (_t("__TRACE_WASM_WEBSOCKET_WRAP_CONSTRUCTOR__", "traceWebSocketWrapConstructor"))
                                            try {
                                                t.WebSocket = k
                                            } catch (t) {}
                                    }
                                }
                            }
                        }()
                    } catch (t) {}
                    var t = {
                        a: qt,
                        env: {}
                    };
                    function n(t, n) {
                        var r = t.exports;
                        e.asm = r,
                        function(t) {
                            m = t,
                            e.HEAP8 = b = new Int8Array(t),
                            e.HEAP16 = S = new Int16Array(t),
                            e.HEAP32 = C = new Int32Array(t),
                            e.HEAPU8 = w = new Uint8Array(t),
                            e.HEAPU16 = k = new Uint16Array(t),
                            e.HEAPU32 = I = new Uint32Array(t),
                            e.HEAPF32 = x = new Float32Array(t),
                            e.HEAPF64 = E = new Float64Array(t)
                        }(e.asm.F.buffer),
                        U = e.asm.J,
                        function(t) {
                            B.unshift(t)
                        }(e.asm.G),
                        function() {
                            if (z--,
                            e.monitorRunDependencies && e.monitorRunDependencies(z),
                            0 == z && (null !== V && (clearInterval(V),
                            V = null),
                            q)) {
                                var t = q;
                                q = null,
                                t()
                            }
                        }()
                    }
                    function i(t) {
                        n(t.instance)
                    }
                    function o(e) {
                        return function() {
                            if (!u && (s || c)) {
                                if ("function" == typeof fetch && !K(D))
                                    return fetch(D, {
                                        credentials: "same-origin"
                                    }).then(function(t) {
                                        if (!t.ok)
                                            throw "failed to load wasm binary file at '" + D + "'";
                                        return t.arrayBuffer()
                                    }).catch(function() {
                                        return Z(D)
                                    });
                                if (r)
                                    return new Promise(function(t, e) {
                                        r(D, function(e) {
                                            t(new Uint8Array(e))
                                        }, e)
                                    }
                                    )
                            }
                            return Promise.resolve().then(function() {
                                return Z(D)
                            })
                        }().then(function(e) {
                            return WebAssembly.instantiate(e, t)
                        }).then(function(t) {
                            return t
                        }).then(e, function(t) {
                            f("failed to asynchronously prepare wasm: " + t),
                            X(t)
                        })
                    }
                    function a() {
                        return a = function(t) {
                            return function() {
                                var e = this
                                  , n = arguments;
                                return new Promise(function(r, i) {
                                    var o = t.apply(e, n);
                                    function a(t) {
                                        cn(o, r, i, a, s, "next", t)
                                    }
                                    function s(t) {
                                        cn(o, r, i, a, s, "throw", t)
                                    }
                                    a(void 0)
                                }
                                )
                            }
                        }(an().m(function e() {
                            return an().w(function(e) {
                                for (; ; )
                                    switch (e.n) {
                                    case 0:
                                        if (u || "function" != typeof WebAssembly.instantiateStreaming || Y(D) || K(D) || "function" != typeof fetch) {
                                            e.n = 1;
                                            break
                                        }
                                        return e.a(2, fetch(D, {
                                            credentials: "same-origin"
                                        }).then(function(e) {
                                            return WebAssembly.instantiateStreaming(e, t).then(i, function(t) {
                                                return f("wasm streaming compile failed: " + t),
                                                f("falling back to ArrayBuffer instantiation"),
                                                o(i)
                                            })
                                        }));
                                    case 1:
                                        return e.a(2, o(i));
                                    case 2:
                                        return e.a(2)
                                    }
                            }, e)
                        })),
                        a.apply(this, arguments)
                    }
                    if (z++,
                    e.monitorRunDependencies && e.monitorRunDependencies(z),
                    e.instantiateWasm)
                        try {
                            return e.instantiateWasm(t, n)
                        } catch (t) {
                            return f("Module.instantiateWasm callback failed with error: " + t),
                            !1
                        }
                    !function() {
                        a.apply(this, arguments)
                    }()
                }(),
                e.___wasm_call_ctors = function() {
                    return (e.___wasm_call_ctors = e.asm.G).apply(null, arguments)
                }
                ,
                e._malloc = function() {
                    return (Xt = e._malloc = e.asm.H).apply(null, arguments)
                }
                ), Yt = (e._main = function() {
                    return (e._main = e.asm.I).apply(null, arguments)
                }
                ,
                e.___getTypeName = function() {
                    return (e.___getTypeName = e.asm.K).apply(null, arguments)
                }
                ,
                e.___embind_register_native_and_builtin_types = function() {
                    return (e.___embind_register_native_and_builtin_types = e.asm.L).apply(null, arguments)
                }
                ,
                e._free = function() {
                    return (Yt = e._free = e.asm.M).apply(null, arguments)
                }
                );
                function Kt(t) {
                    this.name = "ExitStatus",
                    this.message = "Program terminated with exit(" + t + ")",
                    this.status = t
                }
                function Zt(t) {
                    function n() {
                        Vt || (Vt = !0,
                        e.calledRun = !0,
                        y || (J(B),
                        J(j),
                        e.onRuntimeInitialized && e.onRuntimeInitialized(),
                        Jt && function(t) {
                            var n = e._main;
                            try {
                                var r = n(0, 0);
                                return function(t) {
                                    p = t,
                                    W(),
                                    function(t) {
                                        p = t,
                                        W() || (e.onExit && e.onExit(t),
                                        y = !0),
                                        a(t, new Kt(t))
                                    }(t)
                                }(r),
                                r
                            } catch (t) {
                                return function(t) {
                                    if (t instanceof Kt || "unwind" == t)
                                        return p;
                                    f("exception thrown: " + t),
                                    a(1, t)
                                }(t)
                            }
                        }(t),
                        function() {
                            if (e.postRun)
                                for ("function" == typeof e.postRun && (e.postRun = [e.postRun]); e.postRun.length; )
                                    H(e.postRun.shift());
                            J(R)
                        }()))
                    }
                    t = t || o,
                    z > 0 || (function() {
                        if (e.preRun)
                            for ("function" == typeof e.preRun && (e.preRun = [e.preRun]); e.preRun.length; )
                                N(e.preRun.shift());
                        J(F)
                    }(),
                    z > 0 || (e.setStatus ? (e.setStatus("Running..."),
                    setTimeout(function() {
                        setTimeout(function() {
                            e.setStatus("")
                        }, 1),
                        n()
                    }, 1)) : n()))
                }
                if (q = function t() {
                    Vt || Zt(),
                    Vt || (q = t)
                }
                ,
                e.run = Zt,
                e.preInit)
                    for ("function" == typeof e.preInit && (e.preInit = [e.preInit]); e.preInit.length > 0; )
                        e.preInit.pop()();
                var Jt = !0;
                return e.noInitialRun && (Jt = !1),
                Zt(),
                e
            }
            function hn(t) {
                return hn = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                hn(t)
            }
            function fn() {
                var t, e, n = "function" == typeof Symbol ? Symbol : {}, r = n.iterator || "@@iterator", i = n.toStringTag || "@@toStringTag";
                function o(n, r, i, o) {
                    var c = r && r.prototype instanceof s ? r : s
                      , l = Object.create(c.prototype);
                    return dn(l, "_invoke", function(n, r, i) {
                        var o, s, c, l = 0, u = i || [], h = !1, f = {
                            p: 0,
                            n: 0,
                            v: t,
                            a: d,
                            f: d.bind(t, 4),
                            d: function(e, n) {
                                return o = e,
                                s = 0,
                                c = t,
                                f.n = n,
                                a
                            }
                        };
                        function d(n, r) {
                            for (s = n,
                            c = r,
                            e = 0; !h && l && !i && e < u.length; e++) {
                                var i, o = u[e], d = f.p, p = o[2];
                                n > 3 ? (i = p === r) && (c = o[(s = o[4]) ? 5 : (s = 3,
                                3)],
                                o[4] = o[5] = t) : o[0] <= d && ((i = n < 2 && d < o[1]) ? (s = 0,
                                f.v = r,
                                f.n = o[1]) : d < p && (i = n < 3 || o[0] > r || r > p) && (o[4] = n,
                                o[5] = r,
                                f.n = p,
                                s = 0))
                            }
                            if (i || n > 1)
                                return a;
                            throw h = !0,
                            r
                        }
                        return function(i, u, p) {
                            if (l > 1)
                                throw TypeError("Generator is already running");
                            for (h && 1 === u && d(u, p),
                            s = u,
                            c = p; (e = s < 2 ? t : c) || !h; ) {
                                o || (s ? s < 3 ? (s > 1 && (f.n = -1),
                                d(s, c)) : f.n = c : f.v = c);
                                try {
                                    if (l = 2,
                                    o) {
                                        if (s || (i = "next"),
                                        e = o[i]) {
                                            if (!(e = e.call(o, c)))
                                                throw TypeError("iterator result is not an object");
                                            if (!e.done)
                                                return e;
                                            c = e.value,
                                            s < 2 && (s = 0)
                                        } else
                                            1 === s && (e = o.return) && e.call(o),
                                            s < 2 && (c = TypeError("The iterator does not provide a '" + i + "' method"),
                                            s = 1);
                                        o = t
                                    } else if ((e = (h = f.n < 0) ? c : n.call(r, f)) !== a)
                                        break
                                } catch (e) {
                                    o = t,
                                    s = 1,
                                    c = e
                                } finally {
                                    l = 1
                                }
                            }
                            return {
                                value: e,
                                done: h
                            }
                        }
                    }(n, i, o), !0),
                    l
                }
                var a = {};
                function s() {}
                function c() {}
                function l() {}
                e = Object.getPrototypeOf;
                var u = [][r] ? e(e([][r]())) : (dn(e = {}, r, function() {
                    return this
                }),
                e)
                  , h = l.prototype = s.prototype = Object.create(u);
                function f(t) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(t, l) : (t.__proto__ = l,
                    dn(t, i, "GeneratorFunction")),
                    t.prototype = Object.create(h),
                    t
                }
                return c.prototype = l,
                dn(h, "constructor", l),
                dn(l, "constructor", c),
                c.displayName = "GeneratorFunction",
                dn(l, i, "GeneratorFunction"),
                dn(h),
                dn(h, i, "Generator"),
                dn(h, r, function() {
                    return this
                }),
                dn(h, "toString", function() {
                    return "[object Generator]"
                }),
                (fn = function() {
                    return {
                        w: o,
                        m: f
                    }
                }
                )()
            }
            function dn(t, e, n, r) {
                var i = Object.defineProperty;
                try {
                    i({}, "", {})
                } catch (t) {
                    i = 0
                }
                dn = function(t, e, n, r) {
                    function o(e, n) {
                        dn(t, e, function(t) {
                            return this._invoke(e, n, t)
                        })
                    }
                    e ? i ? i(t, e, {
                        value: n,
                        enumerable: !r,
                        configurable: !r,
                        writable: !r
                    }) : t[e] = n : (o("next", 0),
                    o("throw", 1),
                    o("return", 2))
                }
                ,
                dn(t, e, n, r)
            }
            function yn(t, e, n, r, i, o, a) {
                try {
                    var s = t[o](a)
                      , c = s.value
                } catch (t) {
                    return void n(t)
                }
                s.done ? e(c) : Promise.resolve(c).then(r, i)
            }
            function vn(t) {
                var e = function(t) {
                    if ("object" != hn(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != hn(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == hn(e) ? e : e + ""
            }
            function Sn(t) {
                return Sn = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                Sn(t)
            }
            function kn(t) {
                var e = function(t) {
                    if ("object" != Sn(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != Sn(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == Sn(e) ? e : e + ""
            }
            var Cn = function() {
                return t = function t() {
                    !function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, t);
                    var e = document.getElementById("toast-container");
                    e || ((e = document.createElement("div")).id = "toast-container",
                    e.style.position = "absolute",
                    e.style.top = "80px",
                    e.style.left = "50%",
                    e.style.transform = "translateX(-50%)",
                    e.style.display = "flex",
                    e.style.flexDirection = "column",
                    e.style.gap = "10px",
                    e.style.pointerEvents = "none",
                    e.style.zIndex = "10000",
                    document.body.appendChild(e)),
                    this.container = e
                }
                ,
                e = [{
                    key: "show",
                    value: function(t) {
                        var e = this
                          , n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "info"
                          , r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 3e3
                          , i = arguments.length > 3 ? arguments[3] : void 0
                          , o = document.createElement("div")
                          , a = "fa-circle-info";
                        "success" === n && (a = "fa-circle-check"),
                        "error" === n && (a = "fa-triangle-exclamation"),
                        o.innerHTML = '\n            <i class="fa-solid '.concat(a, '"></i>\n            <span style="flex-grow: 1;">').concat(t, '</span>\n            <i class="fa-solid fa-xmark toast-close" style="cursor: pointer; opacity: 0.8; margin-left: 8px;"></i>\n        '),
                        o.style.padding = "8px 16px",
                        o.style.borderRadius = "20px",
                        o.style.backgroundColor = "rgba(0, 0, 0, 0.7)",
                        o.style.color = "#fff",
                        o.style.fontFamily = "Ubuntu, sans-serif",
                        o.style.fontSize = "14px",
                        o.style.fontWeight = "bold",
                        o.style.boxShadow = "0 2px 10px rgba(0,0,0,0.3)",
                        o.style.opacity = "0",
                        o.style.transition = "opacity 0.3s ease, transform 0.3s ease",
                        o.style.transform = "translateY(-10px)",
                        o.style.backdropFilter = "blur(4px)",
                        o.style.border = "1px solid rgba(255,255,255,0.1)",
                        o.style.pointerEvents = "auto",
                        o.style.display = "flex",
                        o.style.alignItems = "center",
                        o.style.gap = "8px",
                        "success" === n && (o.style.borderLeft = "4px solid #00ff88"),
                        "error" === n && (o.style.borderLeft = "4px solid #ff4444"),
                        "info" === n && (o.style.borderLeft = "4px solid #00b9e8"),
                        this.container.appendChild(o);
                        var s = o.querySelector(".toast-close");
                        return s && (s.addEventListener("click", function() {
                            i && i(),
                            e.remove(o)
                        }),
                        s.addEventListener("mouseenter", function() {
                            s.style.opacity = "1"
                        }),
                        s.addEventListener("mouseleave", function() {
                            s.style.opacity = "0.8"
                        })),
                        requestAnimationFrame(function() {
                            o.style.opacity = "1",
                            o.style.transform = "translateY(0)"
                        }),
                        r > 0 && setTimeout(function() {
                            e.remove(o)
                        }, r),
                        o
                    }
                }, {
                    key: "remove",
                    value: function(t) {
                        t && (t.style.opacity = "0",
                        t.style.transform = "translateY(-10px)",
                        setTimeout(function() {
                            t.parentNode && t.parentNode.removeChild(t)
                        }, 300))
                    }
                }],
                e && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1,
                        r.configurable = !0,
                        "value"in r && (r.writable = !0),
                        Object.defineProperty(t, kn(r.key), r)
                    }
                }(t.prototype, e),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                t;
                var t, e
            }();
            function In(t) {
                return In = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                In(t)
            }
            function xn() {
                var t, e, n = "function" == typeof Symbol ? Symbol : {}, r = n.iterator || "@@iterator", i = n.toStringTag || "@@toStringTag";
                function o(n, r, i, o) {
                    var c = r && r.prototype instanceof s ? r : s
                      , l = Object.create(c.prototype);
                    return En(l, "_invoke", function(n, r, i) {
                        var o, s, c, l = 0, u = i || [], h = !1, f = {
                            p: 0,
                            n: 0,
                            v: t,
                            a: d,
                            f: d.bind(t, 4),
                            d: function(e, n) {
                                return o = e,
                                s = 0,
                                c = t,
                                f.n = n,
                                a
                            }
                        };
                        function d(n, r) {
                            for (s = n,
                            c = r,
                            e = 0; !h && l && !i && e < u.length; e++) {
                                var i, o = u[e], d = f.p, p = o[2];
                                n > 3 ? (i = p === r) && (c = o[(s = o[4]) ? 5 : (s = 3,
                                3)],
                                o[4] = o[5] = t) : o[0] <= d && ((i = n < 2 && d < o[1]) ? (s = 0,
                                f.v = r,
                                f.n = o[1]) : d < p && (i = n < 3 || o[0] > r || r > p) && (o[4] = n,
                                o[5] = r,
                                f.n = p,
                                s = 0))
                            }
                            if (i || n > 1)
                                return a;
                            throw h = !0,
                            r
                        }
                        return function(i, u, p) {
                            if (l > 1)
                                throw TypeError("Generator is already running");
                            for (h && 1 === u && d(u, p),
                            s = u,
                            c = p; (e = s < 2 ? t : c) || !h; ) {
                                o || (s ? s < 3 ? (s > 1 && (f.n = -1),
                                d(s, c)) : f.n = c : f.v = c);
                                try {
                                    if (l = 2,
                                    o) {
                                        if (s || (i = "next"),
                                        e = o[i]) {
                                            if (!(e = e.call(o, c)))
                                                throw TypeError("iterator result is not an object");
                                            if (!e.done)
                                                return e;
                                            c = e.value,
                                            s < 2 && (s = 0)
                                        } else
                                            1 === s && (e = o.return) && e.call(o),
                                            s < 2 && (c = TypeError("The iterator does not provide a '" + i + "' method"),
                                            s = 1);
                                        o = t
                                    } else if ((e = (h = f.n < 0) ? c : n.call(r, f)) !== a)
                                        break
                                } catch (e) {
                                    o = t,
                                    s = 1,
                                    c = e
                                } finally {
                                    l = 1
                                }
                            }
                            return {
                                value: e,
                                done: h
                            }
                        }
                    }(n, i, o), !0),
                    l
                }
                var a = {};
                function s() {}
                function c() {}
                function l() {}
                e = Object.getPrototypeOf;
                var u = [][r] ? e(e([][r]())) : (En(e = {}, r, function() {
                    return this
                }),
                e)
                  , h = l.prototype = s.prototype = Object.create(u);
                function f(t) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(t, l) : (t.__proto__ = l,
                    En(t, i, "GeneratorFunction")),
                    t.prototype = Object.create(h),
                    t
                }
                return c.prototype = l,
                En(h, "constructor", l),
                En(l, "constructor", c),
                c.displayName = "GeneratorFunction",
                En(l, i, "GeneratorFunction"),
                En(h),
                En(h, i, "Generator"),
                En(h, r, function() {
                    return this
                }),
                En(h, "toString", function() {
                    return "[object Generator]"
                }),
                (xn = function() {
                    return {
                        w: o,
                        m: f
                    }
                }
                )()
            }
            function En(t, e, n, r) {
                var i = Object.defineProperty;
                try {
                    i({}, "", {})
                } catch (t) {
                    i = 0
                }
                En = function(t, e, n, r) {
                    function o(e, n) {
                        En(t, e, function(t) {
                            return this._invoke(e, n, t)
                        })
                    }
                    e ? i ? i(t, e, {
                        value: n,
                        enumerable: !r,
                        configurable: !r,
                        writable: !r
                    }) : t[e] = n : (o("next", 0),
                    o("throw", 1),
                    o("return", 2))
                }
                ,
                En(t, e, n, r)
            }
            function Tn(t, e, n, r, i, o, a) {
                try {
                    var s = t[o](a)
                      , c = s.value
                } catch (t) {
                    return void n(t)
                }
                s.done ? e(c) : Promise.resolve(c).then(r, i)
            }
            function _n(t) {
                var e = function(t) {
                    if ("object" != In(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != In(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == In(e) ? e : e + ""
            }
            var An = function() {
                return t = function t(e) {
                    !function(t, e) {
                        if (!(t instanceof e))
                            throw new TypeError("Cannot call a class as a function")
                    }(this, t),
                    this.isVisible = !1,
                    this.app = e,
                    this.logger = new S({
                        prefix: "Settings",
                        color: "#9C27B0"
                    }),
                    this.settings = e.settings,
                    this.input = e.input,
                    this.overlay = document.getElementById("settingsOverlay"),
                    this.content = document.getElementById("settingsContent"),
                    this.init()
                }
                ,
                e = [{
                    key: "init",
                    value: function() {
                        var t, e, n, r, i, o = this;
                        if (this.overlay) {
                            null === (t = document.getElementById("closeSettingsBtn")) || void 0 === t || t.addEventListener("click", function() {
                                o.hide()
                            }),
                            null === (e = document.getElementById("btnExport")) || void 0 === e || e.addEventListener("click", function() {
                                return o.exportSettings()
                            }),
                            null === (n = document.getElementById("btnImport")) || void 0 === n || n.addEventListener("click", function() {
                                var t;
                                return null === (t = document.getElementById("importFile")) || void 0 === t ? void 0 : t.click()
                            }),
                            null === (r = document.getElementById("importFile")) || void 0 === r || r.addEventListener("change", function(t) {
                                return o.importSettings(t)
                            }),
                            null === (i = document.getElementById("btnResetAll")) || void 0 === i || i.addEventListener("click", function() {
                                confirm("Are you sure you want to reset EVERYTHING (Settings, Controls, Profiles)? This cannot be undone.") && o.resetAllSettings()
                            });
                            var a = document.querySelectorAll(".tab-btn");
                            a.forEach(function(t) {
                                t.addEventListener("click", function(t) {
                                    a.forEach(function(t) {
                                        return t.classList.remove("active")
                                    }),
                                    t.currentTarget.classList.add("active");
                                    var e = t.currentTarget.dataset.tab;
                                    o.renderTab(e)
                                })
                            }),
                            this.overlay.addEventListener("click", function(t) {
                                t.target === o.overlay && o.hide()
                            }),
                            this.renderTab("game");
                            var s = this.settings.get("themeCursor");
                            document.body.style.cursor = window.EonAssets ? window.EonAssets.cursorCss(s) : (s && "none" !== s ? "url('/assets/images/cursors/".concat(s, ".cur'), auto") : "auto")
                        }
                    }
                }, {
                    key: "show",
                    value: function() {
                        this.app.controls?.cancelFeed();
                        this.overlay && (this.overlay.style.display = "flex",
                        this.isVisible = !0,
                        this.renderTab("game"))
                    }
                }, {
                    key: "hide",
                    value: function() {
                        this.overlay && (this.overlay.style.display = "none",
                        this.isVisible = !1)
                    }
                }, {
                    key: "renderTab",
                    value: function(t) {
                        if (this.content) {
                            window.EonSenpaEmotesUI.leave(this.app);
                            this.content.innerHTML = "";
                            var e = document.querySelector('.tab-btn[data-tab="'.concat(t, '"]'));
                            e && (document.querySelectorAll(".tab-btn").forEach(function(t) {
                                return t.classList.remove("active")
                            }),
                            e.classList.add("active")),
                            "game" === t && this.renderGame(),
                            "camera" === t && this.renderCamera(),
                            "theme" === t && this.renderTheme(),
                            "elements" === t && this.renderElements(),
                            "huds" === t && this.renderHUDs(),
                            "chat" === t && this.renderChat(),
                            "emojis" === t && window.EonSenpaEmotesUI.renderLibrary(this.app, this.content),
                            "commands" === t && window.EonSenpaEmotesUI.renderCommands(this.app, this.content),
                            "controls" === t && this.renderControls()
                        }
                    }
                }, {
                    key: "renderGame",
                    value: function() {
                        var t, e = this, n = this.settings.getAll(), r = document.createElement("div");
                        r.classList.add("settings-section", "active"),
                        r.appendChild(this.createSelect("Render Quality", "Quality of the game", ["low", "medium", "high"], n.renderQuality, function(t) {
                            return e.settings.set("renderQuality", t)
                        })),
                        r.appendChild(this.createToggle("Smooth Movement", "Gradual movement and mass changes, consistent across frame rates", n.adaptiveCellMotion, function(t) {
                            return e.settings.set("adaptiveCellMotion", t)
                        })),
                        r.appendChild(this.createSlider("Cell Animation Speed", "Position only: lower follows faster, higher glides longer", 30, 300, n.cellAnimationSpeed, function(t) {
                            return e.settings.set("cellAnimationSpeed", t)
                        })),
                        r.appendChild(this.createSlider("Size Animation Speed", "Smoothing when mass grows or shrinks; independent of movement", 30, 300, n.cellSizeAnimationSpeed, function(t) {
                            return e.settings.set("cellSizeAnimationSpeed", t)
                        })),
                        r.appendChild(this.createSlider("Eat Animation Speed", "Duration of absorption and disappearance", 30, 300, n.cellEatAnimationSpeed, function(t) {
                            return e.settings.set("cellEatAnimationSpeed", t)
                        })),
                        r.appendChild(this.createSlider("Spawn Animation Speed", "Fade-in duration for new pieces", 30, 300, n.cellSpawnAnimationSpeed, function(t) {
                            return e.settings.set("cellSpawnAnimationSpeed", t)
                        })),
                        r.appendChild(this.createToggle("Show Eat Animation", "Animate cells being eaten", n.showEatAnimation, function(t) {
                            return e.settings.set("showEatAnimation", t)
                        })),
                        r.appendChild(this.createToggle("Show Menu on Death", "Show lobby when all server players die", n.showMenuOnDeath, function(t) {
                            return e.settings.set("showMenuOnDeath", t)
                        })),
                        r.appendChild(this.createToggle("Auto-Switch Cells", "Control the surviving player when your active player dies", n.autoSwitchCells, function(t) {
                            return e.settings.set("autoSwitchCells", t)
                        })),
                        this.app.controls?.renderPanel(r),
                        window.EonSenpaInstall?.mount(this.app, r),
                        null === (t = this.content) || void 0 === t || t.appendChild(r)
                    }
                }, {
                    key: "renderCamera",
                    value: function() {
                        var t, e = this, n = this.settings.getAll(), r = document.createElement("div");
                        r.classList.add("settings-section", "active"),
                        r.appendChild(this.createSlider("Camera Movement Speed", "Speed of camera movement (higher is faster)", 1, 30, n.cameraSpeed, function(t) {
                            return e.settings.set("cameraSpeed", t)
                        })),
                        r.appendChild(this.createSlider("Camera Zoom Speed", "Zoom sensitivity", 1, 20, Math.round(100 * (n.zoomSpeed - .78)), function(t) {
                            var n = .78 + t / 100;
                            e.settings.set("zoomSpeed", n)
                        })),
                        r.appendChild(this.createToggle("Debug Viewport", "Display debug viewport", n.debugViewport, function(t) {
                            return e.settings.set("debugViewport", t)
                        })),
                        null === (t = this.content) || void 0 === t || t.appendChild(r)
                    }
                }, {
                    key: "renderChat",
                    value: function() {
                        var t, e = this, n = this.settings.getAll(), r = document.createElement("div");
                        r.classList.add("settings-section", "active"),
                        r.appendChild(this.createToggle("Show Chat", "Display chat messages", n.showChat, function(t) {
                            return e.settings.set("showChat", t)
                        })),
                        r.appendChild(this.createToggle("Show Player ID", "Show [ID] before nicknames", n.chatShowPlayerId, function(t) {
                            return e.settings.set("chatShowPlayerId", t)
                        })),
                        r.appendChild(this.createToggle("Use Cell Color", "Use player cell color for nickname", n.chatUseCellColor, function(t) {
                            return e.settings.set("chatUseCellColor", t)
                        })),
                        r.appendChild(this.createColorPicker("Nickname Color", "Custom color for nicknames (If Cell Color OFF)", n.chatNickColor, function(t) {
                            return e.settings.set("chatNickColor", t)
                        })),
                        r.appendChild(this.createColorPicker("Message Color", "Custom color for chat messages", n.chatMessageColor, function(t) {
                            return e.settings.set("chatMessageColor", t)
                        })),
                        r.appendChild(this.createColorPicker("Command Color", "Color for command responses", n.chatCommandColor, function(t) {
                            return e.settings.set("chatCommandColor", t)
                        })),
                        null === (t = this.content) || void 0 === t || t.appendChild(r)
                    }
                }, {
                    key: "renderHUDs",
                    value: function() {
                        var t, e = this, n = this.settings.getAll(), r = document.createElement("div");
                        r.classList.add("settings-section", "active"),
                        r.appendChild(this.createToggle("Show HUD", "Toggle all HUD elements", n.showHUD, function(t) {
                            return e.settings.set("showHUD", t)
                        })),
                        r.appendChild(this.createToggle("Show Minimap", "Display minimap", n.showMinimap, function(t) {
                            return e.settings.set("showMinimap", t)
                        })),
                        r.appendChild(this.createSlider("Minimap Size", "Size of the minimap", 150, 500, n.minimapSize, function(t) {
                            return e.settings.set("minimapSize", t)
                        })),
                        r.appendChild(this.createToggle("Show Leaderboard", "Display leaderboard", n.showLeaderboard, function(t) {
                            return e.settings.set("showLeaderboard", t)
                        })),
                        r.appendChild(this.createColorPicker("Leaderboard Mass Color", "Fallback when no server name color is available", n.leaderboardMassColor, function(t) {
                            return e.settings.set("leaderboardMassColor", t)
                        })),
                        r.appendChild(this.createToggle("Show Stats", "Display bottom stats badges", n.showStats, function(t) {
                            return e.settings.set("showStats", t)
                        })),
                        null === (t = this.content) || void 0 === t || t.appendChild(r)
                    }
                }, {
                    key: "renderElements",
                    value: function() {
                        var t, e = this, n = this.settings.getAll(), r = document.createElement("div");
                        r.classList.add("settings-section", "active"),
                        r.appendChild(this.createToggle("Show Skins", "Master switch for all skins", n.showGlobalSkins, function(t) {
                            return e.settings.set("showGlobalSkins", t)
                        })),
                        r.appendChild(this.createToggle("Custom Skins", "Enable custom player skins", n.showSkins, function(t) {
                            return e.settings.set("showSkins", t)
                        })),
                        r.appendChild(this.createToggle("Vanilla Skins", "Show server skins", n.showVanillaSkins, function(t) {
                            return e.settings.set("showVanillaSkins", t)
                        })),
                        r.appendChild(this.createToggle("Animated Skins", "Enable GIF skins", n.showGifSkins, function(t) {
                            return e.settings.set("showGifSkins", t)
                        })),
                        r.appendChild(this.createSlider("Cell Opacity", "Opacity of the cells", 20, 100, n.cellsTransparency, function(t) {
                            return e.settings.set("cellsTransparency", t)
                        })),
                        r.appendChild(this.createToggle("Cell Gradient", "Show gradient overlay on cells", n.showCellGradient, function(t) {
                            return e.settings.set("showCellGradient", t)
                        })),
                        r.appendChild(this.createSlider("Gradient Strength", "1 = Light, 2 = Medium, 3 = Strongest", 1, 3, n.cellGradientStrength, function(t) {
                            return e.settings.set("cellGradientStrength", t)
                        })),
                        r.appendChild(this.createSlider("Virus Opacity", "Transparency of virus cells", 20, 100, n.virusTransparency, function(t) {
                            return e.settings.set("virusTransparency", t)
                        })),
                        r.appendChild(this.createColorPicker("Virus Color", "Fill color for virus cells", n.virusColor, function(t) {
                            return e.settings.set("virusColor", t)
                        })),
                        r.appendChild(this.createColorPicker("Virus Stroke Color", "Outline color for virus cells", n.virusStrokeColor, function(t) {
                            return e.settings.set("virusStrokeColor", t)
                        })),
                        r.appendChild(this.createToggle("Show Virus Range", "Display virus danger zones", n.showVirusRange, function(t) {
                            return e.settings.set("showVirusRange", t)
                        })),
                        r.appendChild(this.createColorPicker("Virus Range Color", "Color for virus danger zone indicators", n.virusRangeColor, function(t) {
                            return e.settings.set("virusRangeColor", t)
                        })),
                        r.appendChild(this.createToggle("Show Food", "Display food pellets", n.showFood, function(t) {
                            return e.settings.set("showFood", t)
                        })),
                        r.appendChild(this.createToggle("Rainbow Food", "Enable rainbow-colored food", n.rainbowFood, function(t) {
                            return e.settings.set("rainbowFood", t)
                        })),
                        r.appendChild(this.createColorPicker("Food Color", "Color for food pellets", n.foodColor, function(t) {
                            return e.settings.set("foodColor", t)
                        })),
                        r.appendChild(this.createToggle("Show Names", "Display player names", n.showNames, function(t) {
                            return e.settings.set("showNames", t)
                        })),
                        r.appendChild(this.createToggle("Show Mass", "Display mass numbers", n.showMass, function(t) {
                            return e.settings.set("showMass", t)
                        })),
                        r.appendChild(this.createSelect("Cell Mass Format", "Full or shortened", ["full", "shortened"], n.cellMassFormat, function(t) {
                            return e.settings.set("cellMassFormat", t)
                        })),
                        r.appendChild(this.createToggle("Show Nickname Stroke", "Display outline on nicknames", n.showNicknameStroke, function(t) {
                            return e.settings.set("showNicknameStroke", t)
                        })),
                        r.appendChild(this.createToggle("Show Mass Stroke", "Display outline on mass text", n.showMassStroke, function(t) {
                            return e.settings.set("showMassStroke", t)
                        })),
                        r.appendChild(this.createToggle("Auto Hide Names", "Hide nicknames when too small", n.autoHideNames, function(t) {
                            return e.settings.set("autoHideNames", t)
                        })),
                        r.appendChild(this.createToggle("Auto Hide Mass", "Hide mass text when too small", n.autoHideMass, function(t) {
                            return e.settings.set("autoHideMass", t)
                        })),
                        r.appendChild(this.createToggle("Colored Names", "Use cell color when no server name color is available", n.coloredNames, function(t) {
                            return e.settings.set("coloredNames", t)
                        })),
                        r.appendChild(this.createToggle("Colored Mass", "Use cell color when no server name color is available", n.coloredMass, function(t) {
                            return e.settings.set("coloredMass", t)
                        })),
                        r.appendChild(this.createColorPicker("Nickname Text Color", "Fallback when no server name color is available", n.textNicknameColor, function(t) {
                            return e.settings.set("textNicknameColor", t)
                        })),
                        r.appendChild(this.createColorPicker("Mass Text Color", "Fallback when no server name color is available", n.textMassColor, function(t) {
                            return e.settings.set("textMassColor", t)
                        })),
                        r.appendChild(this.createToggle("Show Own Names", "Display your own name", n.showMyNames, function(t) {
                            return e.settings.set("showMyNames", t)
                        })),
                        r.appendChild(this.createToggle("Show Own Mass", "Display your own mass", n.showMyMass, function(t) {
                            return e.settings.set("showMyMass", t)
                        })),
                        r.appendChild(this.createColorPicker("Own Nickname Color", "Fallback when no server name color is available", n.myNicknameColor, function(t) {
                            return e.settings.set("myNicknameColor", t)
                        })),
                        r.appendChild(this.createColorPicker("Own Mass Color", "Fallback when no server name color is available", n.myMassColor, function(t) {
                            return e.settings.set("myMassColor", t)
                        })),
                        r.appendChild(this.createToggle("Show Cursor Lines", "Draw lines from cells to cursor", n.showCursorLines, function(t) {
                            return e.settings.set("showCursorLines", t)
                        })),
                        r.appendChild(this.createColorPicker("Cursor Lines Color", "Color of the cursor lines", n.themeCursorLinesColor, function(t) {
                            return e.settings.set("themeCursorLinesColor", t)
                        })),
                        null === (t = this.content) || void 0 === t || t.appendChild(r)
                    }
                }, {
                    key: "renderTheme",
                    value: function() {
                        var t, e = this, n = this.settings.getAll(), r = document.createElement("div");
                        r.classList.add("settings-section", "active"),
                        r.appendChild(this.createTextInput("Background Image URL", "Direct URL to an image", n.themeBackgroundImage, function(t) {
                            return e.settings.set("themeBackgroundImage", t)
                        })),
                        r.appendChild(this.createToggle("Show Background Image", "Enable custom background image", n.themeShowBackgroundImage, function(t) {
                            return e.settings.set("themeShowBackgroundImage", t)
                        })),
                        r.appendChild(this.createColorPicker("Background Color", "Color behind the grid", n.themeBackgroundColor, function(t) {
                            return e.settings.set("themeBackgroundColor", t)
                        })),
                        r.appendChild(this.createToggle("Show Grid", "Draw background grid", n.showGrid, function(t) {
                            return e.settings.set("showGrid", t)
                        })),
                        r.appendChild(this.createColorPicker("Grid Color", "Color of the background grid", n.themeGridColor, function(t) {
                            return e.settings.set("themeGridColor", t)
                        })),
                        r.appendChild(this.createToggle("Show Border", "Draw map border", n.showBorder, function(t) {
                            return e.settings.set("showBorder", t)
                        })),
                        r.appendChild(this.createColorPicker("Border Color", "Map border lines color", n.themeBorderColor, function(t) {
                            return e.settings.set("themeBorderColor", t)
                        })),
                        r.appendChild(this.createSlider("Border Line Width", "Thickness of the map border", 2, 200, n.themeBorderWidth, function(t) {
                            return e.settings.set("themeBorderWidth", t)
                        })),
                        r.appendChild(this.createSlider("Multi Ring Width", "Thickness of active tab indicator", 2, 50, n.themeMultiboxRingWidth, function(t) {
                            return e.settings.set("themeMultiboxRingWidth", t)
                        })),
                        r.appendChild(this.createColorPicker("Multi Ring Color", "Active tab indicator", n.themeMultiboxRingColor, function(t) {
                            return e.settings.set("themeMultiboxRingColor", t)
                        })),
                        r.appendChild(this.createColorPicker("Multi Ring Color (Inactive)", "Inactive tab indicator", n.themeMultiboxRingColorInactive, function(t) {
                            return e.settings.set("themeMultiboxRingColorInactive", t)
                        })),
                        r.appendChild(this.createColorPicker("Multi Cell Color", "Overlay for your server players", n.themeMultiboxCellColor, function(t) {
                            return e.settings.set("themeMultiboxCellColor", t)
                        })),
                        r.appendChild(this.createColorPicker("Multi Cell Color (Inactive)", "Overlay for inactive multibox cells", n.themeMultiboxCellColorInactive, function(t) {
                            return e.settings.set("themeMultiboxCellColorInactive", t)
                        })),
                        r.appendChild(this.createToggle("Use Cell Color Instead of Rings", "Apply color to cells", n.themeUseMultiboxCellColor, function(t) {
                            return e.settings.set("themeUseMultiboxCellColor", t)
                        })),
                        r.appendChild(this.createCursorPicker("Custom Cursor", "Select your in-game cursor", n.themeCursor, function(t) {
                            e.settings.set("themeCursor", t),
                            document.body.style.cursor = window.EonAssets ? window.EonAssets.cursorCss(t) : ("none" === t ? "auto" : "url('/assets/images/cursors/".concat(t, ".cur'), auto"))
                        })),
                        null === (t = this.content) || void 0 === t || t.appendChild(r)
                    }
                }, {
                    key: "renderControls",
                    value: function() {
                        var t, e = this, n = this.input.getKeybinds(), r = document.createElement("div");
                        r.classList.add("settings-section", "active");
                        var i = document.createElement("div");
                        i.style.textAlign = "center",
                        i.style.color = "#666",
                        i.style.marginBottom = "20px",
                        i.style.fontSize = "14px",
                        i.textContent = "Click to rebind. Press ESC to cancel. Press DELETE to clear.",
                        r.appendChild(i);
                        var o = document.createElement("button");
                        o.className = "keybind-btn",
                        o.style.marginBottom = "20px",
                        o.style.width = "100%",
                        o.style.padding = "12px",
                        o.textContent = "RESET TO DEFAULTS",
                        o.onclick = function() {
                            e.input.resetToDefaults(),
                            e.updateKeybindDisplay()
                        }
                        ,
                        r.appendChild(o);
                        var a = function(t, i) {
                            var o = document.createElement("div");
                            o.className = "setting-group";
                            var a = document.createElement("div");
                            a.innerHTML = '<div class="setting-label">'.concat(t, "</div>");
                            var s, c = document.createElement("button");
                            c.className = "keybind-btn",
                            c.dataset.action = i,
                            c.textContent = (s = n[i]) ? " " === s ? "SPACE" : s.toUpperCase() : "NONE",
                            c.onclick = function() {
                                var t, n = (t = xn().m(function t(n) {
                                    return xn().w(function(t) {
                                        for (; ; )
                                            switch (t.n) {
                                            case 0:
                                                if (!c.classList.contains("locked")) {
                                                    t.n = 1;
                                                    break
                                                }
                                                return t.a(2);
                                            case 1:
                                                return n.stopPropagation(),
                                                c.textContent = "...",
                                                c.classList.add("binding"),
                                                t.n = 2,
                                                e.input.rebind(i);
                                            case 2:
                                                c.classList.remove("binding"),
                                                c.blur(),
                                                e.updateKeybindDisplay(),
                                                c.classList.add("locked"),
                                                setTimeout(function() {
                                                    return c.classList.remove("locked")
                                                }, 200);
                                            case 3:
                                                return t.a(2)
                                            }
                                    }, t)
                                }),
                                function() {
                                    var e = this
                                      , n = arguments;
                                    return new Promise(function(r, i) {
                                        var o = t.apply(e, n);
                                        function a(t) {
                                            Tn(o, r, i, a, s, "next", t)
                                        }
                                        function s(t) {
                                            Tn(o, r, i, a, s, "throw", t)
                                        }
                                        a(void 0)
                                    }
                                    )
                                }
                                );
                                return function(t) {
                                    return n.apply(this, arguments)
                                }
                            }(),
                            o.appendChild(a),
                            o.appendChild(c),
                            r.appendChild(o)
                        };
                        a("Feed (Macro)", "macroFeed"),
                        a("Split", "split"),
                        a("Double Split", "doubleSplit"),
                        a("Triple Split", "tripleSplit"),
                        a("Max Split", "maxSplit"),
                        a("Switch Player", "switchPlayer"),
                        a("Toggle Spectate Mode", "toggleSpectateMode"),
                        a("Save Replay", "saveReplay"),
                        a("Bot Controls", "toggleBots"),
                        a("Bots: Mouse / Random", "toggleBotMode"),
                        a("Bots: Toggle Fast Split", "toggleBotSplit"),
                        a("Bots: Toggle Light Feed", "toggleBotFeed"),
                        a("Bots: Toggle Auto Respawn", "toggleBotRespawn"),
                        a("Pause", "pause"),
                        a("Toggle Skins", "toggleSkins"),
                        a("Clear Chat", "clearChat"),
                        a("Toggle Chat", "toggleChat"),
                        a("Toggle Minimap", "toggleMinimap"),
                        a("Toggle Stats", "toggleStats"),
                        a("Toggle Leaderboard", "toggleLeaderboard"),
                        a("Toggle HUD", "toggleHUD"),
                        a("Toggle Own Names", "toggleMyNames"),
                        a("Toggle Own Mass", "toggleMyMass");
                        for (let index = 1; index <= 4; index++) a("Emoji " + index, "emoji" + index);
                        for (let index = 1; index <= 10; index++) a("Command " + index, "command" + index);
                        a("Send Wave", "sendWave"),
                        null === (t = this.content) || void 0 === t || t.appendChild(r)
                    }
                }, {
                    key: "updateKeybindDisplay",
                    value: function() {
                        var t, e = this.input.getKeybinds(), n = null === (t = this.content) || void 0 === t ? void 0 : t.querySelectorAll(".keybind-btn[data-action]");
                        null == n || n.forEach(function(t) {
                            var n, r = t.dataset.action;
                            r && e[r] && (t.textContent = (n = e[r]) ? " " === n ? "SPACE" : n.toUpperCase() : "NONE",
                            t.classList.remove("binding"))
                        })
                    }
                }, {
                    key: "createToggle",
                    value: function(t, e, n, r) {
                        var i = document.createElement("div");
                        i.className = "setting-group";
                        var o = document.createElement("div");
                        o.innerHTML = '<div class="setting-label">'.concat(t, '</div><div class="setting-desc">').concat(e, "</div>");
                        var a = document.createElement("div");
                        return a.className = "toggle-switch ".concat(n ? "active" : ""),
                        a.onclick = function() {
                            var t = !a.classList.contains("active");
                            a.classList.toggle("active", t),
                            r(t)
                        }
                        ,
                        i.appendChild(o),
                        i.appendChild(a),
                        i
                    }
                }, {
                    key: "createSlider",
                    value: function(t, e, n, r, i, o) {
                        var a = document.createElement("div");
                        a.className = "setting-group";
                        var s = document.createElement("div");
                        s.innerHTML = '<div class="setting-label">'.concat(t, '</div><div class="setting-desc">').concat(e, "</div>");
                        var c = document.createElement("div");
                        c.className = "range-container";
                        var l = document.createElement("input");
                        l.type = "range",
                        l.min = n.toString(),
                        l.max = r.toString(),
                        l.value = i.toString(),
                        l.className = "custom-range";
                        var u = document.createElement("div");
                        u.textContent = i.toString(),
                        u.style.width = "30px",
                        u.style.textAlign = "right",
                        u.style.color = "#ccc",
                        u.style.fontFamily = "monospace";
                        var h = function() {
                            var t = (parseInt(l.value) - n) / (r - n) * 100;
                            l.style.background = "linear-gradient(to right, #4fecff ".concat(t, "%, #333 ").concat(t, "%)")
                        };
                        return l.oninput = function() {
                            u.textContent = l.value,
                            h(),
                            o(parseInt(l.value))
                        }
                        ,
                        h(),
                        c.appendChild(l),
                        c.appendChild(u),
                        a.appendChild(s),
                        a.appendChild(c),
                        a
                    }
                }, {
                    key: "createSelect",
                    value: function(t, e, n, r, i) {
                        var o = document.createElement("div");
                        o.className = "setting-group";
                        var a = document.createElement("div");
                        a.innerHTML = '<div class="setting-label">'.concat(t, '</div><div class="setting-desc">').concat(e, "</div>");
                        var s = document.createElement("select");
                        return s.className = "custom-select",
                        n.forEach(function(t) {
                            var e = document.createElement("option");
                            e.value = t,
                            e.textContent = t.charAt(0).toUpperCase() + t.slice(1),
                            t === r && (e.selected = !0),
                            s.appendChild(e)
                        }),
                        s.onchange = function() {
                            return i(s.value)
                        }
                        ,
                        o.appendChild(a),
                        o.appendChild(s),
                        o
                    }
                }, {
                    key: "createColorPicker",
                    value: function(t, e, n, r) {
                        var i = document.createElement("div");
                        i.className = "setting-group";
                        var o = document.createElement("div");
                        o.innerHTML = '<div class="setting-label">'.concat(t, '</div><div class="setting-desc">').concat(e, "</div>");
                        var a = document.createElement("div");
                        a.style.display = "flex",
                        a.style.alignItems = "center",
                        a.style.gap = "10px";
                        var s = document.createElement("div");
                        s.textContent = n.toUpperCase(),
                        s.style.fontFamily = "monospace",
                        s.style.color = "#ccc",
                        s.style.fontSize = "14px";
                        var c = document.createElement("input");
                        return c.type = "color",
                        c.value = n,
                        c.style.backgroundColor = "transparent",
                        c.style.border = "none",
                        c.style.cursor = "pointer",
                        c.style.width = "30px",
                        c.style.height = "30px",
                        c.oninput = function() {
                            s.textContent = c.value.toUpperCase(),
                            r(c.value)
                        }
                        ,
                        a.appendChild(s),
                        a.appendChild(c),
                        i.appendChild(o),
                        i.appendChild(a),
                        i
                    }
                }, {
                    key: "createTextInput",
                    value: function(t, e, n, r) {
                        var i = document.createElement("div");
                        i.className = "setting-group",
                        i.style.flexDirection = "column",
                        i.style.alignItems = "flex-start",
                        i.style.gap = "10px";
                        var o = document.createElement("div");
                        o.innerHTML = '<div class="setting-label">'.concat(t, '</div><div class="setting-desc">').concat(e, "</div>");
                        var a = document.createElement("input");
                        return a.type = "text",
                        a.value = n,
                        a.className = "lobby-input",
                        a.style.width = "100%",
                        a.style.marginTop = "5px",
                        a.style.padding = "8px 12px",
                        a.style.background = "#0a0a0a",
                        a.style.border = "1px solid #333",
                        a.style.color = "#fff",
                        a.style.borderRadius = "4px",
                        a.style.fontFamily = "inherit",
                        a.oninput = function() {
                            return r(a.value)
                        }
                        ,
                        i.appendChild(o),
                        i.appendChild(a),
                        i
                    }
                }, {
                    key: "createCursorPicker",
                    value: function(t, e, n, r) {
                        var i = document.createElement("div");
                        i.className = "setting-group",
                        i.style.flexDirection = "column",
                        i.style.alignItems = "flex-start",
                        i.style.gap = "15px";
                        var o = document.createElement("div");
                        o.innerHTML = '<div class="setting-label">'.concat(t, '</div><div class="setting-desc">').concat(e, "</div>");
                        var a = document.createElement("div");
                        a.style.display = "grid",
                        a.style.gridTemplateColumns = "repeat(auto-fill, minmax(40px, 1fr))",
                        a.style.gap = "10px",
                        a.style.width = "100%",
                        a.style.marginTop = "10px";
                        var s = document.createElement("div");
                        s.style.width = "40px",
                        s.style.height = "40px",
                        s.style.border = "1px solid #333",
                        s.style.display = "flex",
                        s.style.alignItems = "center",
                        s.style.justifyContent = "center",
                        s.style.cursor = "pointer",
                        s.style.borderRadius = "4px",
                        s.style.fontSize = "20px",
                        s.style.color = "#666",
                        s.innerHTML = "×",
                        s.title = "Default System Cursor",
                        "none" === n && (s.style.borderColor = "#4fecff",
                        s.style.background = "rgba(79, 236, 255, 0.1)",
                        s.style.color = "#4fecff"),
                        s.onclick = function() {
                            r("none"),
                            a.querySelectorAll("div").forEach(function(t) {
                                t.style.borderColor = "#333",
                                t.style.background = "transparent",
                                "×" === t.textContent && (t.style.color = "#666")
                            }),
                            s.style.borderColor = "#4fecff",
                            s.style.background = "rgba(79, 236, 255, 0.1)",
                            s.style.color = "#4fecff"
                        }
                        ,
                        a.appendChild(s);
                        for (var c = function() {
                            var t = "cursor_".concat(l.toString().padStart(2, "0"))
                              , e = document.createElement("div");
                            e.style.width = "40px",
                            e.style.height = "40px",
                            e.style.border = "1px solid #333",
                            e.style.display = "flex",
                            e.style.alignItems = "center",
                            e.style.justifyContent = "center",
                            e.style.cursor = "pointer",
                            e.style.borderRadius = "4px";
                            var i = document.createElement("img");
                            i.src = window.EonAssets ? window.EonAssets.cursor(t) : "/assets/images/cursors/".concat(t, ".cur"),
                            i.style.width = "24px",
                            i.style.height = "24px",
                            i.style.pointerEvents = "none",
                            e.appendChild(i),
                            n === t && (e.style.borderColor = "#4fecff",
                            e.style.background = "rgba(79, 236, 255, 0.1)"),
                            e.onclick = function() {
                                r(t),
                                a.querySelectorAll("div").forEach(function(t) {
                                    t.style.borderColor = "#333",
                                    t.style.background = "transparent",
                                    "×" === t.textContent && (t.style.color = "#666")
                                }),
                                e.style.borderColor = "#4fecff",
                                e.style.background = "rgba(79, 236, 255, 0.1)"
                            }
                            ,
                            a.appendChild(e)
                        }, l = 1; l <= 15; l++)
                            c();
                        return i.appendChild(o),
                        i.appendChild(a),
                        i
                    }
                }, {
                    key: "sanitizeProfile",
                    value: function(t) {
                        return {
                            primaryNickname: t.primaryNickname || t.nickname1 || "",
                            primarySkin: t.primarySkin || t.skin1 || "",
                            secondarySkin: t.secondarySkin || t.skin2 || "",
                            lastClanTag: t.lastClanTag || t.tag || ""
                        }
                    }
                }, {
                    key: "exportSettings",
                    value: function() {
                        window.EonSenpaInstall.download(this.app)
                    }
                }, {
                    key: "importSettings",
                    value: function(event) {
                        const input = event.target, file = input.files?.[0];
                        if (file) window.EonSenpaInstall.importFile(file).finally(() => { input.value = ""; });
                    }
                }, {
                    key: "resetAllSettings",
                    value: function() {
                        this.settings.reset(),
                        this.input.resetToDefaults();
                        for (var t = 1; t <= 10; t++)
                            localStorage.removeItem("eon_profile_".concat(t));
                        localStorage.removeItem("eon_currentProfile"),
                        localStorage.removeItem("eon_playerInputs"),
                        location.reload()
                    }
                }, {
                    key: "createFloatSlider",
                    value: function(t, e, n, r, i, o) {
                        var a = document.createElement("div");
                        a.className = "setting-group";
                        var s = document.createElement("div");
                        s.innerHTML = '<div class="setting-label">'.concat(t, '</div><div class="setting-desc">').concat(e, "</div>");
                        var c = document.createElement("div");
                        c.className = "range-container";
                        var l = document.createElement("input");
                        l.type = "range",
                        l.min = n.toString(),
                        l.max = r.toString(),
                        l.step = "0.01",
                        l.value = i.toString(),
                        l.className = "custom-range";
                        var u = document.createElement("div");
                        u.textContent = i.toFixed(2),
                        u.style.width = "40px",
                        u.style.textAlign = "right",
                        u.style.color = "#ccc",
                        u.style.fontFamily = "monospace";
                        var h = function() {
                            var t = (parseFloat(l.value) - n) / (r - n) * 100;
                            l.style.background = "linear-gradient(to right, #4fecff ".concat(t, "%, #333 ").concat(t, "%)")
                        };
                        return l.oninput = function() {
                            var t = parseFloat(l.value);
                            u.textContent = t.toFixed(2),
                            h(),
                            o(t)
                        }
                        ,
                        h(),
                        c.appendChild(l),
                        c.appendChild(u),
                        a.appendChild(s),
                        a.appendChild(c),
                        a
                    }
                }],
                e && function(t, e) {
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n];
                        r.enumerable = r.enumerable || !1,
                        r.configurable = !0,
                        "value"in r && (r.writable = !0),
                        Object.defineProperty(t, _n(r.key), r)
                    }
                }(t.prototype, e),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                t;
                var t, e
            }();
            function Pn(t) {
                return Pn = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                Pn(t)
            }
            function On(t, e) {
                var n = "undefined" != typeof Symbol && t[Symbol.iterator] || t["@@iterator"];
                if (!n) {
                    if (Array.isArray(t) || (n = function(t, e) {
                        if (t) {
                            if ("string" == typeof t)
                                return Mn(t, e);
                            var n = {}.toString.call(t).slice(8, -1);
                            return "Object" === n && t.constructor && (n = t.constructor.name),
                            "Map" === n || "Set" === n ? Array.from(t) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Mn(t, e) : void 0
                        }
                    }(t)) || e && t && "number" == typeof t.length) {
                        n && (t = n);
                        var r = 0
                          , i = function() {};
                        return {
                            s: i,
                            n: function() {
                                return r >= t.length ? {
                                    done: !0
                                } : {
                                    done: !1,
                                    value: t[r++]
                                }
                            },
                            e: function(t) {
                                throw t
                            },
                            f: i
                        }
                    }
                    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
                }
                var o, a = !0, s = !1;
                return {
                    s: function() {
                        n = n.call(t)
                    },
                    n: function() {
                        var t = n.next();
                        return a = t.done,
                        t
                    },
                    e: function(t) {
                        s = !0,
                        o = t
                    },
                    f: function() {
                        try {
                            a || null == n.return || n.return()
                        } finally {
                            if (s)
                                throw o
                        }
                    }
                }
            }
            function Mn(t, e) {
                (null == e || e > t.length) && (e = t.length);
                for (var n = 0, r = Array(e); n < e; n++)
                    r[n] = t[n];
                return r
            }
            function Ln() {
                var t, e, n = "function" == typeof Symbol ? Symbol : {}, r = n.iterator || "@@iterator", i = n.toStringTag || "@@toStringTag";
                function o(n, r, i, o) {
                    var c = r && r.prototype instanceof s ? r : s
                      , l = Object.create(c.prototype);
                    return Un(l, "_invoke", function(n, r, i) {
                        var o, s, c, l = 0, u = i || [], h = !1, f = {
                            p: 0,
                            n: 0,
                            v: t,
                            a: d,
                            f: d.bind(t, 4),
                            d: function(e, n) {
                                return o = e,
                                s = 0,
                                c = t,
                                f.n = n,
                                a
                            }
                        };
                        function d(n, r) {
                            for (s = n,
                            c = r,
                            e = 0; !h && l && !i && e < u.length; e++) {
                                var i, o = u[e], d = f.p, p = o[2];
                                n > 3 ? (i = p === r) && (c = o[(s = o[4]) ? 5 : (s = 3,
                                3)],
                                o[4] = o[5] = t) : o[0] <= d && ((i = n < 2 && d < o[1]) ? (s = 0,
                                f.v = r,
                                f.n = o[1]) : d < p && (i = n < 3 || o[0] > r || r > p) && (o[4] = n,
                                o[5] = r,
                                f.n = p,
                                s = 0))
                            }
                            if (i || n > 1)
                                return a;
                            throw h = !0,
                            r
                        }
                        return function(i, u, p) {
                            if (l > 1)
                                throw TypeError("Generator is already running");
                            for (h && 1 === u && d(u, p),
                            s = u,
                            c = p; (e = s < 2 ? t : c) || !h; ) {
                                o || (s ? s < 3 ? (s > 1 && (f.n = -1),
                                d(s, c)) : f.n = c : f.v = c);
                                try {
                                    if (l = 2,
                                    o) {
                                        if (s || (i = "next"),
                                        e = o[i]) {
                                            if (!(e = e.call(o, c)))
                                                throw TypeError("iterator result is not an object");
                                            if (!e.done)
                                                return e;
                                            c = e.value,
                                            s < 2 && (s = 0)
                                        } else
                                            1 === s && (e = o.return) && e.call(o),
                                            s < 2 && (c = TypeError("The iterator does not provide a '" + i + "' method"),
                                            s = 1);
                                        o = t
                                    } else if ((e = (h = f.n < 0) ? c : n.call(r, f)) !== a)
                                        break
                                } catch (e) {
                                    o = t,
                                    s = 1,
                                    c = e
                                } finally {
                                    l = 1
                                }
                            }
                            return {
                                value: e,
                                done: h
                            }
                        }
                    }(n, i, o), !0),
                    l
                }
                var a = {};
                function s() {}
                function c() {}
                function l() {}
                e = Object.getPrototypeOf;
                var u = [][r] ? e(e([][r]())) : (Un(e = {}, r, function() {
                    return this
                }),
                e)
                  , h = l.prototype = s.prototype = Object.create(u);
                function f(t) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(t, l) : (t.__proto__ = l,
                    Un(t, i, "GeneratorFunction")),
                    t.prototype = Object.create(h),
                    t
                }
                return c.prototype = l,
                Un(h, "constructor", l),
                Un(l, "constructor", c),
                c.displayName = "GeneratorFunction",
                Un(l, i, "GeneratorFunction"),
                Un(h),
                Un(h, i, "Generator"),
                Un(h, r, function() {
                    return this
                }),
                Un(h, "toString", function() {
                    return "[object Generator]"
                }),
                (Ln = function() {
                    return {
                        w: o,
                        m: f
                    }
                }
                )()
            }
            function Un(t, e, n, r) {
                var i = Object.defineProperty;
                try {
                    i({}, "", {})
                } catch (t) {
                    i = 0
                }
                Un = function(t, e, n, r) {
                    function o(e, n) {
                        Un(t, e, function(t) {
                            return this._invoke(e, n, t)
                        })
                    }
                    e ? i ? i(t, e, {
                        value: n,
                        enumerable: !r,
                        configurable: !r,
                        writable: !r
                    }) : t[e] = n : (o("next", 0),
                    o("throw", 1),
                    o("return", 2))
                }
                ,
                Un(t, e, n, r)
            }
            function Fn(t, e, n, r, i, o, a) {
                try {
                    var s = t[o](a)
                      , c = s.value
                } catch (t) {
                    return void n(t)
                }
                s.done ? e(c) : Promise.resolve(c).then(r, i)
            }
            function Bn(t) {
                return function() {
                    var e = this
                      , n = arguments;
                    return new Promise(function(r, i) {
                        var o = t.apply(e, n);
                        function a(t) {
                            Fn(o, r, i, a, s, "next", t)
                        }
                        function s(t) {
                            Fn(o, r, i, a, s, "throw", t)
                        }
                        a(void 0)
                    }
                    )
                }
            }
            function jn(t) {
                var e = function(t) {
                    if ("object" != Pn(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != Pn(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == Pn(e) ? e : e + ""
            }
            // Legacy EON license manager removed from this independently deployed client.
            // Senpa OAuth/account verification remains unchanged.
            function Wn(t) {
                return Wn = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
                    return typeof t
                }
                : function(t) {
                    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
                }
                ,
                Wn(t)
            }
            function Nn(t, e) {
                for (var n = 0; n < e.length; n++) {
                    var r = e[n];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(t, Dn(r.key), r)
                }
            }
            function Hn(t, e, n) {
                return e && Nn(t.prototype, e),
                n && Nn(t, n),
                Object.defineProperty(t, "prototype", {
                    writable: !1
                }),
                t
            }
            function Dn(t) {
                var e = function(t) {
                    if ("object" != Wn(t) || !t)
                        return t;
                    var e = t[Symbol.toPrimitive];
                    if (void 0 !== e) {
                        var n = e.call(t, "string");
                        if ("object" != Wn(n))
                            return n;
                        throw new TypeError("@@toPrimitive must return a primitive value.")
                    }
                    return String(t)
                }(t);
                return "symbol" == Wn(e) ? e : e + ""
            }
            var Gn, zn = Hn(function t() {
                var e = this;
                !function(t, e) {
                    if (!(t instanceof e))
                        throw new TypeError("Cannot call a class as a function")
                }(this, t),
                // Compatibility adapter for old callers; no license key or external heartbeat.
                this.authManager = {
                    authenticate: function() { return Promise.resolve(); },
                    removeClient: function() {}
                },
                this.gameConnection = new window.EonNativeMulti.GameConnection,
                this.settings = new v,
                this.logger = new S({
                    prefix: "App",
                    color: "#4CAF50"
                }),
                this.player = new E,
                this.hud = new Xt(this.settings),
                this.input = new Ve(this),
                this.chatBox = new $e(this),
                this.settingsMenu = new An(this),
                this.toasts = new Cn,
                this.lobby = new Gt(this),
                this.stage = new xe(this),
                this.minimap = new Ze(this),
                this.updateNotifier = new on,
                this.updateNotifier.checkAndShow()
            });
            window.app = Gn = new zn,
            Gn.hud.updateLeaderboard([{
                name: "Waiting for players...",
                score: 0
            }])
        }
    }, n = {};
    function r(t) {
        var i = n[t];
        if (void 0 !== i)
            return i.exports;
        var o = n[t] = {
            exports: {}
        };
        return e[t](o, o.exports, r),
        o.exports
    }
    r.m = e,
    t = [],
    r.O = (e, n, i, o) => {
        if (!n) {
            var a = 1 / 0;
            for (u = 0; u < t.length; u++) {
                for (var [n,i,o] = t[u], s = !0, c = 0; c < n.length; c++)
                    (!1 & o || a >= o) && Object.keys(r.O).every(t => r.O[t](n[c])) ? n.splice(c--, 1) : (s = !1,
                    o < a && (a = o));
                if (s) {
                    t.splice(u--, 1);
                    var l = i();
                    void 0 !== l && (e = l)
                }
            }
            return e
        }
        o = o || 0;
        for (var u = t.length; u > 0 && t[u - 1][2] > o; u--)
            t[u] = t[u - 1];
        t[u] = [n, i, o]
    }
    ,
    r.n = t => {
        var e = t && t.__esModule ? () => t.default : () => t;
        return r.d(e, {
            a: e
        }),
        e
    }
    ,
    r.d = (t, e) => {
        for (var n in e)
            r.o(e, n) && !r.o(t, n) && Object.defineProperty(t, n, {
                enumerable: !0,
                get: e[n]
            })
    }
    ,
    r.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e),
    ( () => {
        var t = {
            23: 0
        };
        r.O.j = e => 0 === t[e];
        var e = (e, n) => {
            var i, o, [a,s,c] = n, l = 0;
            if (a.some(e => 0 !== t[e])) {
                for (i in s)
                    r.o(s, i) && (r.m[i] = s[i]);
                if (c)
                    var u = c(r)
            }
            for (e && e(n); l < a.length; l++)
                o = a[l],
                r.o(t, o) && t[o] && t[o][0](),
                t[o] = 0;
            return r.O(u)
        }
          , n = self.webpackChunkeon_client = self.webpackChunkeon_client || [];
        n.forEach(e.bind(null, 0)),
        n.push = e.bind(null, n.push.bind(n))
    }
    )();
    var i = r.O(void 0, [214], () => r(377));
    i = r.O(i)
}
)();

