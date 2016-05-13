var SpinningWheel = {
    cellHeight: 44,
    friction: .003,
    slotData: [],
    slotCallback: [],
    _settings: {
        item: 5,
        title: null ,
        is3D: !1
    },
    init: function(t) {
        for (var s in t)
            this._settings[s] = t[s]
    },
    handleEvent: function(t) {
        "touchstart" == t.type ? (this.lockScreen(t),
        "sw-cancel" == t.currentTarget.id || "sw-done" == t.currentTarget.id ? this.tapDown(t) : "sw-frame" == t.currentTarget.id && this.scrollStart(t)) : "touchmove" == t.type ? (this.lockScreen(t),
        "sw-cancel" == t.currentTarget.id || "sw-done" == t.currentTarget.id || "sw-frame" == t.currentTarget.id && this.scrollMove(t)) : "touchend" == t.type ? "sw-cancel" == t.currentTarget.id || "sw-done" == t.currentTarget.id ? this.tapUp(t) : "sw-frame" == t.currentTarget.id && this.scrollEnd(t) : "webkitTransitionEnd" == t.type ? "sw-wrapper" == t.target.id ? this.destroy() : this.backWithinBoundaries(t) : "orientationchange" == t.type ? this.onOrientationChange(t) : "scroll" == t.type && this.onScroll(t)
    },
    onOrientationChange: function() {
        window.scrollTo(0, 0),
        this.swWrapper.style.top = window.innerHeight + window.pageYOffset + "px",
        this.calculateSlotsWidth()
    },
    onScroll: function() {
        this.swWrapper.style.top = window.innerHeight + window.pageYOffset + "px"
    },
    lockScreen: function(t) {
        // t.preventDefault(),  // 不需要阻止
        t.stopPropagation()
    },
    reset: function() {
        this.slotEl = [],
        this.activeSlot = null ,
        this.swWrapper = void 0,
        this.swSlotWrapper = void 0,
        this.swSlots = void 0,
        this.swFrame = void 0
    },
    calculateSlotsWidth: function() {
        for (var t = this.swSlots.getElementsByTagName("div"), s = 0; s < t.length; s += 1)
            this.slotEl[s].slotWidth = t[s].offsetWidth
    },
    create: function() {
        var t, s, e, i, o;
        for (this.reset(),
        this._settings.selectedItem = Math.ceil(this._settings.item / 2) - 1,
        o = document.createElement("div"),
        o.id = "sw-wrapper",
        o.style.top = window.innerHeight + window.pageYOffset + "px",
        o.style.webkitTransitionProperty = "-webkit-transform",
        o.innerHTML = '<div id="sw-header"><div id="sw-cancel">取消</div><div id="sw-tip">' + (this._settings.title || "") + '</div><div id="sw-done">确定</div></div><div id="sw-slots-wrapper"><div id="sw-slots"></div></div><div id="sw-frame"></div><div id="sw-line"></div>',
        document.body.appendChild(o),
        this.swWrapper = o,
        this.swSlotWrapper = document.getElementById("sw-slots-wrapper"),
        this.swSlots = document.getElementById("sw-slots"),
        this.swFrame = document.getElementById("sw-frame"),
        this.swLine = document.getElementById("sw-line"),
        this.swLine.style.top = 43 + 43 * Math.floor(this._settings.item / 2) + "px",
        this.swSlotWrapper.style.height = 43 * this._settings.item + "px",
        /*this.swFrame.style.height = 43 * this._settings.item + "px",*/
        s = 0; s < this.slotData.length; s += 1) {
            i = document.createElement("ul"),
            e = "";
            for (t in this.slotData[s].values)
                e += "<li>" + this.slotData[s].values[t] + "</li>";
            i.innerHTML = e,
            o = document.createElement("div"),
            o.className = this.slotData[s].style,
            o.appendChild(i),
            this.swSlots.appendChild(o),
            i.slotPosition = s,
            i.slotYPosition = 0,
            i.slotWidth = 0,
            i.slotMaxScroll = this.swSlotWrapper.clientHeight - i.clientHeight - 43 * Math.floor(this._settings.item / 2),
            i.style.webkitTransitionTimingFunction = "cubic-bezier(0, 0, 0.2, 1)",
            this.slotEl.push(i),
            this.slotData[s].defaultValue && this.scrollToValue(s, this.slotData[s].defaultValue),
            this.changeStyle()
        }
        this.calculateSlotsWidth(),
        document.addEventListener("touchstart", this, !1),
        document.addEventListener("touchmove", this, !1),
        window.addEventListener("orientationchange", this, !0),
        window.addEventListener("scroll", this, !0),
        document.getElementById("sw-cancel").addEventListener("touchstart", this, !1),
        document.getElementById("sw-done").addEventListener("touchstart", this, !1),
        this.swFrame.addEventListener("touchstart", this, !1)
    },
    open: function() {
        this.create();
        var t = window.pageYOffset;
        window.pageYOffset > 100 && (t = 120);
        var s = t - 20;
        0 > s && (s = 0);
        var e = 43 + 43 * this._settings.item
          , i = e;
        this.swWrapper.style.webkitTransitionTimingFunction = "ease-out",
        this.swWrapper.style.webkitTransitionDuration = "400ms",
        this.swWrapper.style.webkitTransform = "translate3d(0, -" + i + "px, 0)"
    },
    destroy: function() {
        this.swWrapper.removeEventListener("webkitTransitionEnd", this, !1),
        this.swFrame.removeEventListener("touchstart", this, !1),
        document.getElementById("sw-cancel").removeEventListener("touchstart", this, !1),
        document.getElementById("sw-done").removeEventListener("touchstart", this, !1),
        document.removeEventListener("touchstart", this, !1),
        document.removeEventListener("touchmove", this, !1),
        window.removeEventListener("orientationchange", this, !0),
        window.removeEventListener("scroll", this, !0),
        this._settings = {
            item: 5,
            title: null ,
            is3D: !1
        },
        this.slotData = [],
        this.slotCallback = [],
        this.cancelAction = function() {
            return !1
        }
        ,
        this.cancelDone = function() {
            return !0
        }
        ,
        this.reset(),
        document.body.removeChild(document.getElementById("sw-wrapper"))
    },
    close: function() {
        this.swWrapper && (this.swWrapper.style.webkitTransitionTimingFunction = "ease-in",
        this.swWrapper.style.webkitTransitionDuration = "400ms",
        this.swWrapper.style.webkitTransform = "translate3d(0, 0, 0)",
        this.swWrapper.addEventListener("webkitTransitionEnd", this, !1))
    },
    addSlot: function(t, s, e, i) {
        s || (s = ""),
        s = s.split(" ");
        for (var o = 0; o < s.length; o += 1)
            s[o] = "sw-" + s[o];
        s = s.join(" ");
        var l = {
            values: t,
            style: s,
            defaultValue: e
        };
        this.slotData.push(l),
        i && "function" == typeof i && this.slotCallback.push(i)
    },
    editSlot: function(t, s) {
        var e = []
          , i = this.swSlots.querySelectorAll("ul")[t];
        if (!i)
            return console.error("未能获取到slot"),
            !1;
        this.slotData[t].values = s;
        for (var o in s)
            e.push("<li>" + s[o] + "</li>");
        i.innerHTML = e.join(""),
        i.slotYPosition = 0,
        i.slotMaxScroll = this.swSlotWrapper.clientHeight - i.clientHeight - 43 * Math.floor(this._settings.item / 2),
        this.setPosition(t, 0)
    },
    getSelectedValues: function() {
        var t, s, e, i, o = [], l = [];
        for (e in this.slotEl) {
            this.slotEl[e].removeEventListener("webkitTransitionEnd", this, !1),
            this.slotEl[e].style.webkitTransitionDuration = "0",
            this.slotEl[e].slotYPosition > 0 ? this.setPosition(e, 0) : this.slotEl[e].slotYPosition < this.slotEl[e].slotMaxScroll && this.setPosition(e, this.slotEl[e].slotMaxScroll),
            t = -Math.round(this.slotEl[e].slotYPosition / this.cellHeight) + (-2 + this._settings.selectedItem),
            s = 0;
            for (i in this.slotData[e].values) {
                if (s == t) {
                    o.push(i),
                    l.push(this.slotData[e].values[i]);
                    break
                }
                s += 1
            }
        }
        return {
            keys: o,
            values: l
        }
    },
    setPosition: function(t, s) {
        this.slotEl[t].slotYPosition = s,
        this.slotEl[t].style.webkitTransform = "translate3d(0, " + s + "px, 0)",
        this.changeStyle()
    },
    changeStyle: function() {
        if (this._settings.is3D) {
            var t, s, e;
            for (i in this.slotEl) {
                t = -Math.round(this.slotEl[i].slotYPosition / this.cellHeight) + (-2 + this._settings.selectedItem),
                s = this.slotEl[i].children,
                e = s.length,
                t >= e && (t = e - 1),
                0 > t && (t = 0);
                for (var o = t - 1; o >= 0 && o > t - this._settings.selectedItem - 1; o--)
                    s[o].className = "sw-item-prev-list";
                for (var l = t + 1; e > l && l < t + this._settings.selectedItem + 2; l++)
                    s[l].className = "sw-item-next-list";
                t - 1 >= 0 && (delete s[t - 1].style.webkitTransform,
                s[t - 1].className = "sw-item-prev"),
                e > t + 1 && (delete s[t + 1].style.webkitTransform,
                s[t + 1].className = "sw-item-next"),
                s[t].className = "sw-item-active"
            }
        }
    },
    scrollStart: function(t) {
        for (var s = t.targetTouches[0].clientX - this.swSlots.offsetLeft, e = 0, i = 0; i < this.slotEl.length; i += 1)
            if (e += this.slotEl[i].slotWidth,
            e > s) {
                this.activeSlot = i;
                break
            }
        if (this.slotData[this.activeSlot].style.match("readonly"))
            return this.swFrame.removeEventListener("touchmove", this, !1),
            this.swFrame.removeEventListener("touchend", this, !1),
            !1;
        this.slotEl[this.activeSlot].removeEventListener("webkitTransitionEnd", this, !1),
        this.slotEl[this.activeSlot].style.webkitTransitionDuration = "0";
        var o = window.getComputedStyle(this.slotEl[this.activeSlot]).webkitTransform;
        return o = new WebKitCSSMatrix(o).m42,
        o != this.slotEl[this.activeSlot].slotYPosition && this.setPosition(this.activeSlot, o),
        this.startY = t.targetTouches[0].clientY,
        this.scrollStartY = this.slotEl[this.activeSlot].slotYPosition,
        this.scrollStartTime = t.timeStamp,
        this.swFrame.addEventListener("touchmove", this, !1),
        this.swFrame.addEventListener("touchend", this, !1),
        !0
    },
    scrollMove: function(t) {
        var s = t.targetTouches[0].clientY - this.startY;
        (this.slotEl[this.activeSlot].slotYPosition > 0 || this.slotEl[this.activeSlot].slotYPosition < this.slotEl[this.activeSlot].slotMaxScroll) && (s /= 2),
        this.setPosition(this.activeSlot, this.slotEl[this.activeSlot].slotYPosition + s),
        this.startY = t.targetTouches[0].clientY,
        t.timeStamp - this.scrollStartTime > 80 && (this.scrollStartY = this.slotEl[this.activeSlot].slotYPosition,
        this.scrollStartTime = t.timeStamp)
    },
    scrollEnd: function(t) {
        this.swFrame.removeEventListener("touchmove", this, !1),
        this.swFrame.removeEventListener("touchend", this, !1);
        var s = this.slotCallback[this.activeSlot]
          , e = this;
        if (s && setTimeout(function() {
            s.call(e, e.getSelectedValues())
        }, 30),
        this.slotEl[this.activeSlot].slotYPosition > 0 || this.slotEl[this.activeSlot].slotYPosition < this.slotEl[this.activeSlot].slotMaxScroll)
            return this.scrollTo(this.activeSlot, this.slotEl[this.activeSlot].slotYPosition > 0 ? 0 : this.slotEl[this.activeSlot].slotMaxScroll),
            !1;
        var i = this.slotEl[this.activeSlot].slotYPosition - this.scrollStartY;
        if (i < this.cellHeight / 1.5 && i > -this.cellHeight / 1.5)
            return this.slotEl[this.activeSlot].slotYPosition % this.cellHeight && this.scrollTo(this.activeSlot, Math.round(this.slotEl[this.activeSlot].slotYPosition / this.cellHeight) * this.cellHeight, "100ms"),
            !1;
        var o = t.timeStamp - this.scrollStartTime
          , l = 2 * i / o / this.friction
          , n = this.friction / 2 * l * l;
        0 > l && (l = -l,
        n = -n);
        var r = this.slotEl[this.activeSlot].slotYPosition + n;
        return r > 0 ? (r /= 2,
        l /= 3,
        r > this.swSlotWrapper.clientHeight / 4 && (r = this.swSlotWrapper.clientHeight / 4)) : r < this.slotEl[this.activeSlot].slotMaxScroll ? (r = (r - this.slotEl[this.activeSlot].slotMaxScroll) / 2 + this.slotEl[this.activeSlot].slotMaxScroll,
        l /= 3,
        r < this.slotEl[this.activeSlot].slotMaxScroll - this.swSlotWrapper.clientHeight / 4 && (r = this.slotEl[this.activeSlot].slotMaxScroll - this.swSlotWrapper.clientHeight / 4)) : r = Math.round(r / this.cellHeight) * this.cellHeight,
        this.scrollTo(this.activeSlot, Math.round(r), Math.round(l) + "ms"),
        !0
    },
    scrollTo: function(t, s, e) {
        this.slotEl[t].style.webkitTransitionDuration = e ? e : "100ms",
        this.setPosition(t, s ? s : (-2 + this._settings.selectedItem) * this.cellHeight),
        (this.slotEl[t].slotYPosition > 0 || this.slotEl[t].slotYPosition < this.slotEl[t].slotMaxScroll) && this.slotEl[t].addEventListener("webkitTransitionEnd", this, !1)
    },
    scrollToValue: function(t, s) {
        var e, i, o;
        this.slotEl[t].removeEventListener("webkitTransitionEnd", this, !1),
        this.slotEl[t].style.webkitTransitionDuration = "0",
        i = -2 + this._settings.selectedItem;
        for (o in this.slotData[t].values) {
            if (o == s) {
                e = i * this.cellHeight,
                this.setPosition(t, e);
                break
            }
            i -= 1
        }
    },
    backWithinBoundaries: function(t) {
        return t.target.removeEventListener("webkitTransitionEnd", this, !1),
        this.scrollTo(t.target.slotPosition, t.target.slotYPosition > (-2 + this._settings.selectedItem) * this.cellHeight ? (-2 + this._settings.selectedItem) * this.cellHeight : t.target.slotMaxScroll, "150ms"),
        !1
    },
    tapDown: function(t) {
        t.currentTarget.addEventListener("touchmove", this, !1),
        t.currentTarget.addEventListener("touchend", this, !1),
        t.currentTarget.className = "sw-pressed"
    },
    tapCancel: function(t) {
        t.currentTarget.removeEventListener("touchmove", this, !1),
        t.currentTarget.removeEventListener("touchend", this, !1),
        t.currentTarget.className = ""
    },
    tapUp: function(t) {
        this.tapCancel(t),
        "sw-cancel" == t.currentTarget.id ? this.cancelAction() : this.doneAction(),
        this.close()
    },
    setCancelAction: function(t) {
        this.cancelAction = t
    },
    setDoneAction: function(t) {
        this.doneAction = t
    },
    cancelAction: function() {
        return !1
    },
    cancelDone: function() {
        return !0
    }
};