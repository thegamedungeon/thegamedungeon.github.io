( () => {
    var e, t = {
        77: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/rotation_axis_x_positive.svg"
        }
        ,
        493: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/empty.svg"
        }
        ,
        516: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/arrow_down.svg"
        }
        ,
        540: e => {
            "use strict";
            e.exports = function(e) {
                var t = document.createElement("style");
                return e.setAttributes(t, e.attributes),
                e.insert(t, e.options),
                t
            }
        }
        ,
        813: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/winter.svg"
        }
        ,
        853: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/icon.svg"
        }
        ,
        858: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/discord.svg"
        }
        ,
        1113: e => {
            "use strict";
            e.exports = function(e) {
                var t = "";
                return Object.keys(e).forEach((function(n) {
                    t += n + ": " + e[n] + ";"
                }
                )),
                t
            }
        }
        ,
        1441: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/spring.svg"
        }
        ,
        1555: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/trash.svg"
        }
        ,
        1745: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/arrow_up.svg"
        }
        ,
        2175: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/rotation_axis_y_positive.svg"
        }
        ,
        2259: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/autumn.svg"
        }
        ,
        2862: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/summer.svg"
        }
        ,
        2939: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/plus.svg"
        }
        ,
        3422: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/rotation_axis_z_positive.svg"
        }
        ,
        3438: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/undo.svg"
        }
        ,
        3712: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/pencil.svg"
        }
        ,
        4523: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/github.svg"
        }
        ,
        4551: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/eye.svg"
        }
        ,
        4691: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/export.svg"
        }
        ,
        5008: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/settings.svg"
        }
        ,
        5098: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/copy.svg"
        }
        ,
        5793: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/search.svg"
        }
        ,
        5975: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/import.svg"
        }
        ,
        6036: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/world.svg"
        }
        ,
        6427: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/save.svg"
        }
        ,
        6583: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/redo.svg"
        }
        ,
        6730: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/help.svg"
        }
        ,
        7158: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/checkmark.svg"
        }
        ,
        7863: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/cross.svg"
        }
        ,
        8385: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/pause.svg"
        }
        ,
        8954: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/folder.svg"
        }
        ,
        9608: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/play.svg"
        }
        ,
        9707: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/stop.svg"
        }
        ,
        9914: (e, t, n) => {
            "use strict";
            e.exports = n.p + "images/fast_forward.svg"
        }
    }
    , n = {};
    function r(e) {
        var o = n[e];
        if (void 0 !== o)
            return o.exports;
        var i = n[e] = {
            id: e,
            exports: {}
        };
        return t[e](i, i.exports, r),
        i.exports
    }
    r.m = t,
    e = [],
    r.O = (t, n, o, i) => {
        if (!n) {
            var s = 1 / 0;
            for (l = 0; l < e.length; l++) {
                for (var [n,o,i] = e[l], a = !0, c = 0; c < n.length; c++)
                    (!1 & i || s >= i) && Object.keys(r.O).every((e => r.O[e](n[c]))) ? n.splice(c--, 1) : (a = !1,
                    i < s && (s = i));
                if (a) {
                    e.splice(l--, 1);
                    var u = o();
                    void 0 !== u && (t = u)
                }
            }
            return t
        }
        i = i || 0;
        for (var l = e.length; l > 0 && e[l - 1][2] > i; l--)
            e[l] = e[l - 1];
        e[l] = [n, o, i]
    }
    ,
    r.n = e => {
        var t = e && e.__esModule ? () => e.default : () => e;
        return r.d(t, {
            a: t
        }),
        t
    }
    ,
    r.d = (e, t) => {
        for (var n in t)
            r.o(t, n) && !r.o(e, n) && Object.defineProperty(e, n, {
                enumerable: !0,
                get: t[n]
            })
    }
    ,
    r.g = function() {
        if ("object" == typeof globalThis)
            return globalThis;
        try {
            return this || new Function("return this")()
        } catch (e) {
            if ("object" == typeof window)
                return window
        }
    }(),
    r.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t),
    r.p = "",
    ( () => {
        var e = {
            179: 0
        };
        r.O.j = t => 0 === e[t];
        var t = (t, n) => {
            var o, i, [s,a,c] = n, u = 0;
            if (s.some((t => 0 !== e[t]))) {
                for (o in a)
                    r.o(a, o) && (r.m[o] = a[o]);
                if (c)
                    var l = c(r)
            }
            for (t && t(n); u < s.length; u++)
                i = s[u],
                r.o(e, i) && e[i] && e[i][0](),
                e[i] = 0;
            return r.O(l)
        }
          , n = self.webpackChunkpolytrack = self.webpackChunkpolytrack || [];
        n.forEach(t.bind(null, void 0)),
        n.push = t.bind(null, n.push.bind(n))
    }
    )(),
    ( () => {
        "use strict";
        r.O(void 0, [342], ( () => r(1261))),
        r.O(void 0, [342], ( () => r(6654))),
        r.O(void 0, [342], ( () => r(8232))),
        r.O(void 0, [342], ( () => r(4583))),
        r.O(void 0, [342], ( () => r(1553))),
        r.O(void 0, [342], ( () => r(3959))),
        r.O(void 0, [342], ( () => r(1279))),
        r.O(void 0, [342], ( () => r(725))),
        r.O(void 0, [342], ( () => r(7444))),
        r.O(void 0, [342], ( () => r(9723))),
        r.O(void 0, [342], ( () => r(6978))),
        r.O(void 0, [342], ( () => r(7248))),
        r.O(void 0, [342], ( () => r(1478))),
        r.O(void 0, [342], ( () => r(631))),
        r.O(void 0, [342], ( () => r(4680))),
        r.O(void 0, [342], ( () => r(1194))),
        r.O(void 0, [342], ( () => r(4898))),
        r.O(void 0, [342], ( () => r(6554))),
        r.O(void 0, [342], ( () => r(6689))),
        r.O(void 0, [342], ( () => r(1863))),
        r.O(void 0, [342], ( () => r(9795))),
        r.O(void 0, [342], ( () => r(1530))),
        r.O(void 0, [342], ( () => r(8083))),
        r.O(void 0, [342], ( () => r(6425))),
        r.O(void 0, [342], ( () => r(6240))),
        r.O(void 0, [342], ( () => r(9197))),
        r.O(void 0, [342], ( () => r(894))),
        r.O(void 0, [342], ( () => r(8930))),
        r.O(void 0, [342], ( () => r(4975))),
        r.O(void 0, [342], ( () => r(3211))),
        r.O(void 0, [342], ( () => r(3950))),
        r.O(void 0, [342], ( () => r(535))),
        r.O(void 0, [342], ( () => r(929))),
        r.O(void 0, [342], ( () => r(9187))),
        r.O(void 0, [342], ( () => r(6703))),
        r.O(void 0, [342], ( () => r(1847))),
        r.O(void 0, [342], ( () => r(8699))),
        r.O(void 0, [342], ( () => r(721))),
        r.O(void 0, [342], ( () => r(9945))),
        r.O(void 0, [342], ( () => r(2476))),
        r.O(void 0, [342], ( () => r(2169))),
        r.O(void 0, [342], ( () => r(147))),
        r.O(void 0, [342], ( () => r(7311))),
        r.O(void 0, [342], ( () => r(7979))),
        r.O(void 0, [342], ( () => r(2617))),
        r.O(void 0, [342], ( () => r(5821))),
        r.O(void 0, [342], ( () => r(1469))),
        r.O(void 0, [342], ( () => r(4899))),
        r.O(void 0, [342], ( () => r(4088))),
        r.O(void 0, [342], ( () => r(4706))),
        r.O(void 0, [342], ( () => r(9946))),
        r.O(void 0, [342], ( () => r(9900))),
        r.O(void 0, [342], ( () => r(1679))),
        r.O(void 0, [342], ( () => r(8847))),
        r.O(void 0, [342], ( () => r(271))),
        r.O(void 0, [342], ( () => r(8810))),
        r.O(void 0, [342], ( () => r(5512))),
        r.O(void 0, [342], ( () => r(9949))),
        r.O(void 0, [342], ( () => r(9826))),
        r.O(void 0, [342], ( () => r(6079))),
        r.O(void 0, [342], ( () => r(7757))),
        r.O(void 0, [342], ( () => r(7286))),
        r.O(void 0, [342], ( () => r(3989))),
        r.O(void 0, [342], ( () => r(1028))),
        r.O(void 0, [342], ( () => r(4800))),
        r.O(void 0, [342], ( () => r(969))),
        r.O(void 0, [342], ( () => r(6245))),
        r.O(void 0, [342], ( () => r(6558))),
        r.O(void 0, [342], ( () => r(5304))),
        r.O(void 0, [342], ( () => r(143))),
        r.O(void 0, [342], ( () => r(2935))),
        r.O(void 0, [342], ( () => r(9865))),
        r.O(void 0, [342], ( () => r(2444))),
        r.O(void 0, [342], ( () => r(8528))),
        r.O(void 0, [342], ( () => r(3111))),
        r.O(void 0, [342], ( () => r(1029))),
        r.O(void 0, [342], ( () => r(767))),
        r.O(void 0, [342], ( () => r(3403))),
        r.O(void 0, [342], ( () => r(7246))),
        r.O(void 0, [342], ( () => r(5639))),
        r.O(void 0, [342], ( () => r(1637))),
        r.O(void 0, [342], ( () => r(221))),
        r.O(void 0, [342], ( () => r(2081))),
        r.O(void 0, [342], ( () => r(4385))),
        r.O(void 0, [342], ( () => r(7240))),
        r.O(void 0, [342], ( () => r(607))),
        r.O(void 0, [342], ( () => r(4436))),
        r.O(void 0, [342], ( () => r(802))),
        r.O(void 0, [342], ( () => r(947))),
        r.O(void 0, [342], ( () => r(2711))),
        r.O(void 0, [342], ( () => r(8313))),
        r.O(void 0, [342], ( () => r(6313))),
        r.O(void 0, [342], ( () => r(234))),
        r.O(void 0, [342], ( () => r(5359))),
        r.O(void 0, [342], ( () => r(5021))),
        r.O(void 0, [342], ( () => r(4025))),
        r.O(void 0, [342], ( () => r(8583))),
        r.O(void 0, [342], ( () => r(4103))),
        r.O(void 0, [342], ( () => r(1750))),
        r.O(void 0, [342], ( () => r(2025))),
        r.O(void 0, [342], ( () => r(141))),
        r.O(void 0, [342], ( () => r(7347))),
        r.O(void 0, [342], ( () => r(8787))),
        r.O(void 0, [342], ( () => r(2003))),
        r.O(void 0, [342], ( () => r(9535))),
        r.O(void 0, [342], ( () => r(919))),
        r.O(void 0, [342], ( () => r(3223))),
        r.O(void 0, [342], ( () => r(747))),
        r.O(void 0, [342], ( () => r(9645))),
        r.O(void 0, [342], ( () => r(2347))),
        r.O(void 0, [342], ( () => r(347))),
        r.O(void 0, [342], ( () => r(1079))),
        r.O(void 0, [342], ( () => r(9023))),
        r.O(void 0, [342], ( () => r(248))),
        r.O(void 0, [342], ( () => r(48))),
        r.O(void 0, [342], ( () => r(1103))),
        r.O(void 0, [342], ( () => r(703))),
        r.O(void 0, [342], ( () => r(6023))),
        r.O(void 0, [342], ( () => r(123))),
        r.O(void 0, [342], ( () => r(4123))),
        r.O(void 0, [342], ( () => r(9103))),
        r.O(void 0, [342], ( () => r(3123))),
        r.O(void 0, [342], ( () => r(6503))),
        r.O(void 0, [342], ( () => r(1503))),
        r.O(void 0, [342], ( () => r(2103))),
        r.O(void 0, [342], ( () => r(340))),
        r.O(void 0, [342], ( () => r(240))),
        r.O(void 0, [342], ( () => r(140))),
        r.O(void 0, [342], ( () => r(60))),
        r.O(void 0, [342], ( () => r(20))),
        r.O(void 0, [342], ( () => r(10))),
        r.O(void 0, [342], ( () => r(40))),
        r.O(void 0, [342], ( () => r(80))),
        r.O(void 0, [342], ( () => r(90))),
        r.O(void 0, [342], ( () => r(100))),
        r.O(void 0, [342], ( () => r(200))),
        r.O(void 0, [342], ( () => r(300))),
        r.O(void 0, [342], ( () => r(400))),
        r.O(void 0, [342], ( () => r(500))),
        r.O(void 0, [342], ( () => r(600))),
        r.O(void 0, [342], ( () => r(700))),
        r.O(void 0, [342], ( () => r(800))),
        r.O(void 0, [342], ( () => r(900))),
        r.O(void 0, [342], ( () => r(1000))),
        r.O(void 0, [342], ( () => r(2000))),
        r.O(void 0, [342], ( () => r(3000))),
        r.O(void 0, [342], ( () => r(4000))),
        r.O(void 0, [342], ( () => r(5000))),
        r.O(void 0, [342], ( () => r(6000))),
        r.O(void 0, [342], ( () => r(7000))),
        r.O(void 0, [342], ( () => r(8000))),
        r.O(void 0, [342], ( () => r(9000))),
        r.O(void 0, [342], ( () => r(1100))),
        r.O(void 0, [342], ( () => r(1200))),
        r.O(void 0, [342], ( () => r(1300))),
        r.O(void 0, [342], ( () => r(1400))),
        r.O(void 0, [342], ( () => r(1500))),
        r.O(void 0, [342], ( () => r(1600))),
        r.O(void 0, [342], ( () => r(1700))),
        r.O(void 0, [342], ( () => r(1800))),
        r.O(void 0, [342], ( () => r(1900))),
        r.O(void 0, [342], ( () => r(2100))),
        r.O(void 0, [342], ( () => r(2200))),
        r.O(void 0, [342], ( () => r(2300))),
        r.O(void 0, [342], ( () => r(2400))),
        r.O(void 0, [342], ( () => r(2500))),
        r.O(void 0, [342], ( () => r(2600))),
        r.O(void 0, [342], ( () => r(2700))),
        r.O(void 0, [342], ( () => r(2800))),
        r.O(void 0, [342], ( () => r(2900))),
        r.O(void 0, [342], ( () => r(3100))),
        r.O(void 0, [342], ( () => r(3200))),
        r.O(void 0, [342], ( () => r(3300))),
        r.O(void 0, [342], ( () => r(3400))),
        r.O(void 0, [342], ( () => r(3500))),
        r.O(void 0, [342], ( () => r(3600))),
        r.O(void 0, [342], ( () => r(3700))),
        r.O(void 0, [342], ( () => r(3800))),
        r.O(void 0, [342], ( () => r(3900))),
        r.O(void 0, [342], ( () => r(4100))),
        r.O(void 0, [342], ( () => r(4200))),
        r.O(void 0, [342], ( () => r(4300))),
        r.O(void 0, [342], ( () => r(4400))),
        r.O(void 0, [342], ( () => r(4500))),
        r.O(void 0, [342], ( () => r(4600))),
        r.O(void 0, [342], ( () => r(4700))),
        r.O(void 0, [342], ( () => r(4800))),
        r.O(void 0, [342], ( () => r(4900))),
        r.O(void 0, [342], ( () => r(5100))),
        r.O(void 0, [342], ( () => r(5200))),
        r.O(void 0, [342], ( () => r(5300))),
        r.O(void 0, [342], ( () => r(5400))),
        r.O(void 0, [342], ( () => r(5500))),
        r.O(void 0, [342], ( () => r(5600))),
        r.O(void 0, [342], ( () => r(5700))),
        r.O(void 0, [342], ( () => r(5800))),
        r.O(void 0, [342], ( () => r(5900))),
        r.O(void 0, [342], ( () => r(6100))),
        r.O(void 0, [342], ( () => r(6200))),
        r.O(void 0, [342], ( () => r(6300))),
        r.O(void 0, [342], ( () => r(6400))),
        r.O(void 0, [342], ( () => r(6500))),
        r.O(void 0, [342], ( () => r(6600))),
        r.O(void 0, [342], ( () => r(6700))),
        r.O(void 0, [342], ( () => r(6800))),
        r.O(void 0, [342], ( () => r(6900))),
        r.O(void 0, [342], ( () => r(7100))),
        r.O(void 0, [342], ( () => r(7200))),
        r.O(void 0, [342], ( () => r(7300))),
        r.O(void 0, [342], ( () => r(7400))),
        r.O(void 0, [342], ( () => r(7500))),
        r.O(void 0, [342], ( () => r(7600))),
        r.O(void 0, [342], ( () => r(7700))),
        r.O(void 0, [342], ( () => r(7800))),
        r.O(void 0, [342], ( () => r(7900))),
        r.O(void 0, [342], ( () => r(8100))),
        r.O(void 0, [342], ( () => r(8200))),
        r.O(void 0, [342], ( () => r(8300))),
        r.O(void 0, [342], ( () => r(8400))),
        r.O(void 0, [342], ( () => r(8500))),
        r.O(void 0, [342], ( () => r(8600))),
        r.O(void 0, [342], ( () => r(8700))),
        r.O(void 0, [342], ( () => r(8800))),
        r.O(void 0, [342], ( () => r(8900))),
        r.O(void 0, [342], ( () => r(9100))),
        r.O(void 0, [342], ( () => r(9200))),
        r.O(void 0, [342], ( () => r(9300))),
        r.O(void 0, [342], ( () => r(9400))),
        r.O(void 0, [342], ( () => r(9500))),
        r.O(void 0, [342], ( () => r(9600))),
        r.O(void 0, [342], ( () => r(9700))),
        r.O(void 0, [342], ( () => r(9800))),
        r.O(void 0, [342], ( () => r(9900))),
        r.O(void 0, [342], ( () => r(110))),
        r.O(void 0, [342], ( () => r(120))),
        r.O(void 0, [342], ( () => r(130))),
        r.O(void 0, [342], ( () => r(140))),
        r.O(void 0, [342], ( () => r(150))),
        r.O(void 0, [342], ( () => r(160))),
        r.O(void 0, [342], ( () => r(170))),
        r.O(void 0, [342], ( () => r(180))),
        r.O(void 0, [342], ( () => r(190))),
        r.O(void 0, [342], ( () => r(210))),
        r.O(void 0, [342], ( () => r(220))),
        r.O(void 0, [342], ( () => r(230))),
        r.O(void 0, [342], ( () => r(240))),
        r.O(void 0, [342], ( () => r(250))),
        r.O(void 0, [342], ( () => r(260))),
        r.O(void 0, [342], ( () => r(270))),
        r.O(void 0, [342], ( () => r(280))),
        r.O(void 0, [342], ( () => r(290))),
        r.O(void 0, [342], ( () => r(310))),
        r.O(void 0, [342], ( () => r(320))),
        r.O(void 0, [342], ( () => r(330))),
        r.O(void 0, [342], ( () => r(340))),
        r.O(void 0, [342], ( () => r(350))),
        r.O(void 0, [342], ( () => r(360))),
        r.O(void 0, [342], ( () => r(370))),
        r.O(void 0, [342], ( () => r(380))),
        r.O(void 0, [342], ( () => r(390))),
        r.O(void 0, [342], ( () => r(410))),
        r.O(void 0, [342], ( () => r(420))),
        r.O(void 0, [342], ( () => r(430))),
        r.O(void 0, [342], ( () => r(440))),
        r.O(void 0, [342], ( () => r(450))),
        r.O(void 0, [342], ( () => r(460))),
        r.O(void 0, [342], ( () => r(470))),
        r.O(void 0, [342], ( () => r(480))),
        r.O(void 0, [342], ( () => r(490))),
        r.O(void 0, [342], ( () => r(510))),
        r.O(void 0, [342], ( () => r(520))),
        r.O(void 0, [342], ( () => r(530))),
        r.O(void 0, [342], ( () => r(540))),
        r.O(void 0, [342], ( () => r(550))),
        r.O(void 0, [342], ( () => r(560))),
        r.O(void 0, [342], ( () => r(570))),
        r.O(void 0, [342], ( () => r(580))),
        r.O(void 0, [342], ( () => r(590))),
        r.O(void 0, [342], ( () => r(610))),
        r.O(void 0, [342], ( () => r(620))),
        r.O(void 0, [342], ( () => r(630))),
        r.O(void 0, [342], ( () => r(640))),
        r.O(void 0, [342], ( () => r(650))),
        r.O(void 0, [342], ( () => r(660))),
        r.O(void 0, [342], ( () => r(670))),
        r.O(void 0, [342], ( () => r(680))),
        r.O(void 0, [342], ( () => r(690))),
        r.O(void 0, [342], ( () => r(710))),
        r.O(void 0, [342], ( () => r(720))),
        r.O(void 0, [342], ( () => r(730))),
        r.O(void 0, [342], ( () => r(740))),
        r.O(void 0, [342], ( () => r(750))),
        r.O(void 0, [342], ( () => r(760))),
        r.O(void 0, [342], ( () => r(770))),
        r.O(void 0, [342], ( () => r(780))),
        r.O(void 0, [342], ( () => r(790))),
        r.O(void 0, [342], ( () => r(810))),
        r.O(void 0, [342], ( () => r(820))),
        r.O(void 0, [342], ( () => r(830))),
        r.O(void 0, [342], ( () => r(840))),
        r.O(void 0, [342], ( () => r(850))),
        r.O(void 0, [342], ( () => r(860))),
        r.O(void 0, [342], ( () => r(870))),
        r.O(void 0, [342], ( () => r(880))),
        r.O(void 0, [342], ( () => r(890))),
        r.O(void 0, [342], ( () => r(910))),
        r.O(void 0, [342], ( () => r(920))),
        r.O(void 0, [342], ( () => r(930))),
        r.O(void 0, [342], ( () => r(940))),
        r.O(void 0, [342], ( () => r(950))),
        r.O(void 0, [342], ( () => r(960))),
        r.O(void 0, [342], ( () => r(970))),
        r.O(void 0, [342], ( () => r(980))),
        r.O(void 0, [342], ( () => r(990))),
        r.O(void 0, [342], ( () => {
            const e = {}
              , t = {}
              , n = ["track1.track", "track2.track", "track3.track", "track4.track", "track5.track", "track6.track", "track7.track", "track8.track", "track9.track", "track10.track", "track11.track", "track12.track", "track13.track", "track14.track", "track15.track", "track16.track", "track17.track", "track18.track", "track19.track", "track20.track", "track21.track", "track22.track", "track23.track", "track24.track", "track25.track", "track26.track", "track27.track", "track28.track", "track29.track", "track30.track", "track31.track", "track32.track", "track33.track", "track34.track", "track35.track", "track36.track", "track37.track", "track38.track", "track39.track", "track40.track", "track41.track", "track42.track", "track43.track", "track44.track", "track45.track", "track46.track", "track47.track", "track48.track", "track49.track", "track50.track", "track51.track", "track52.track", "track53.track", "track54.track", "track55.track", "track56.track", "track57.track", "track58.track", "track59.track", "track60.track"]
              , o = ["community_track1.track", "Crib_Nightmare.track"]
              , i = {
                officialTrackFallbacks: n,
                communityTrackFallbacks: o
            }
              , s = async (e, t) => {
                const n = `tracks/${e}/${t}`;
                try {
                    const e = await fetch(n);
                    if (!e.ok)
                        throw new Error(`Failed to fetch track: ${t}`);
                    return await e.text()
                } catch (e) {
                    return console.error(e),
                    null
                }
            }
            ;
            (async () => {
                const n = new gP
                  , a = new sE
                  , c = new vO(n)
                  , u = new rM
                  , l = new tA
                  , f = new oL
                  , d = new pM
                  , p = new hC
                  , h = new mR
                  , m = new fG
                  , g = new vU
                  , v = new yM
                  , w = new wL
                  , y = new bS
                  , x = new xT
                  , b = new AM
                  , A = new BM
                  , E = new CM
                  , S = new DM
                  , T = new EM
                  , C = new FM
                  , _ = new GM
                  , P = e => {
                    r.trigger(( () => {
                        QP(),
                        L.dispose(),
                        L = new fO(s,c,v,x,h,o,t,e,( () => {
                            M(!1)
                        }
                        )),
                        KP(),
                        GP()
                    }
                    ))
                }
                  , I = e => {
                    r.trigger(( () => {
                        QP(),
                        L.dispose(),
                        L = new fO(s,c,v,x,h,o,t,e,( () => {
                            M(!1)
                        }
                        )),
                        KP(),
                        GP()
                    }
                    ))
                }
                  , R = e => {
                    r.trigger(( () => {
                        QP(),
                        L.dispose(),
                        L = new MW(s,c,E,o,x,v,e,( () => {
                            M(!1)
                        }
                        )),
                        KP(),
                        GP()
                    }
                    ))
                }
                ;
                let L = new WN(u,A,b,y,x,m,E,g,w,c,s,e,o,v,t,!1,_,T,C,P,I,R)
                  , D = 0;
                c.setAnimationLoop((function(e) {
                    const t = Math.max(e - D, 0) / 1e3;
                    D = e,
                    L.update(t),
                    k.update(t)
                }
                )),
                window.addEventListener("keyup", (e => {
                    o.checkKeyBinding(e, gk.ToggleFpsCounter) && k.toggle()
                }
                ))
            })()
        }
        ))
    }
    )()
}
)();
