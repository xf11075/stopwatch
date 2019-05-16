if (!window.App) {
    window.App = {};
} else {
    throw Error("app namespace conflict");
}
window.App.Watch = {
    addZero: function(arg) {
        if (arg < 10) {
            arg = "0" + arg;
        }
        return arg;
    }
};
window.App.Tools = {
    _eventsList: {},
    getElementsByClassName: function(classNameArg) {
        var resultArray = [];
        var oList = document.getElementsByTagName("div");

        for (var i = 0; i < oList.length; i++) {
            if (oList[i].className == classNameArg) {
                resultArray.push(oList[i]);
            }
        }

        return resultArray;
    },
    sleepEvent: function(obj, eventName, eventId) {
        this._eventsList[eventId] = obj[eventName];
        obj[eventName] = null;
    },
    awakeEvent: function(obj, eventName, eventId) {
        obj[eventName] = this._eventsList[eventId];
        this._eventsList[eventId] = null;
    },
    getCurrentStyle: function(obj) {
        if (obj.currentStyle) {
            return obj.currentStyle;
        } else if (window.getComputedStyle) {
            return window.getComputedStyle(obj, null);
        }
    },
    documentReady: function(callback) {
        if (window.attachEvent) {
            window.attachEvent('onload', callback);
        } else {
            window.addEventListener('load', callback, false);
        }
    },
    bindEvent: function(obj, eventName, fun) {
        if (window.attachEvent) {
            obj.attachEvent('on' + eventName, fun);
        } else {
            obj.addEventListener(eventName, fun, false);
        }
    },
    checkIsIE6: function() {
        var agent = window.navigator.userAgent;

        if (agent.indexOf('MSIE 6.0') > 0) {
            return true;
        } else {
            return false;
        }
    }
};
window.App.position = {
    doc: document,
    tools: App.Tools,
    getOffsetTop: function(obj) {
        var offsetTop = obj.offsetTop;
        obj = obj.parentNode;
        while (obj != this.doc.body) {
            var position = obj.style.position;
            if (position == 'relative' || position == 'absolute') {
                offsetTop += obj.offsetTop;
            }
            obj = obj.parentNode;
        }
        return offsetTop;
    },
    getOffsetLeft: function(obj) {
        var offsetLeft = obj.offsetLeft;
        obj = obj.parentNode;
        while (obj != this.doc.body) {

            var position = this.tools.getCurrentStyle(obj).position;
            if (position == 'relative' || position == 'absolute') {
                offsetLeft += obj.offsetLeft;
            }
            obj = obj.parentNode;
        }
        return offsetLeft;
    },
    getOffsetParent: function(obj) {
        while (obj != this.doc.body) {
            obj = obj.parentNode;
            var position = this.tools.getCurrentStyle(obj).position;
            if (position == 'relative' || position == 'absolute') {
                return obj;
            }
        }
        return this.doc.body;
    }
};
