
window.App.Watch.WatchForwardView = function () {
    var doc = document, oThis = window.App.Watch.WatchForwardView;
    var watchForwardModel = this.WatchForwardModel();
    var lastRecordToNow = doc.getElementById('lastRecordToNow');
    var timeALL = {
        minute3: doc.getElementById('minute3'),
        minute2: doc.getElementById('minute2'),
        minute1: doc.getElementById('minute1'),
        second2: doc.getElementById('second2'),
        second1: doc.getElementById('second1'),
        milisecond: doc.getElementById('miliSecond')
    };
    var startAndStop = doc.getElementById('startAndStop');
    var resetAndRecord = doc.getElementById('resetAndRecord');
    var recordList = doc.getElementById('recordList');
    var pager = doc.getElementById("pager");
    var currentPage = 0;
    oThis.isStart = true;
    //var debug = App.debug();
    startAndStop.onclick = function () {
        resetAndRecord.removeAttribute('disabled');
        if (oThis.isStart) {

            watchForwardModel.start();
            oThis.isStart = false;
            this.className = 'stop';
            resetAndRecord.className = 'record';

            showRecord(watchForwardModel.getCurrentData());
        }
        else {
            watchForwardModel.stop();
            oThis.isStart = true;
            this.className = 'start';
            resetAndRecord.className = 'reset';
        }
    };

    resetAndRecord.onclick = function () {

        if (oThis.isStart) {
            watchForwardModel.reset();
            recordList.innerHTML = '';
            timeALL.milisecond.innerHTML = 0;
            timeALL.minute1.innerHTML = 0;
            timeALL.minute2.innerHTML = 0;
            timeALL.minute3.innerHTML = 0;
            timeALL.second1.innerHTML = 0;
            timeALL.second2.innerHTML = 0;
            lastRecordToNow.innerHTML = '';
            pager.innerHTML = '';
            oThis.isFull = false;

        }
        else {

            if (watchForwardModel.getCurrentData().recordList.length >= 30) {

                this.setAttribute('disabled', 'disabled');
                this.className = 'recordDisabled';
                oThis.isFull = true;
                return;
            }
            watchForwardModel.record();

            showRecord(watchForwardModel.getCurrentData());
        }
        return false;
    };
    watchForwardModel.refreshEvent = function (arg) {

        var timeAllValue = arg.timeAll;

        timeALL.milisecond.innerHTML = timeAllValue.miliSecond;
        var secondList = parseNumberToArray(timeAllValue.second, 2);
        timeALL.second2.innerHTML = secondList[0];
        timeALL.second1.innerHTML = secondList[1];
        var miniteList = parseNumberToArray(timeAllValue.minute, 3);
        timeALL.minute3.innerHTML = miniteList[0];
        timeALL.minute2.innerHTML = miniteList[1];
        timeALL.minute1.innerHTML = miniteList[2];

        lastRecordToNow.innerHTML = parseTime(arg.lastRecordToNow);
        /*----------------------------------------------------*/
        function parseNumberToArray(number, n) {

            if (!number) {
                if (n == 2) {
                    return [0, 0];
                }
                else {
                    return [0, 0, 0];
                }
            }
            var s = number + "";
            var list = s.split('');
            var count = n - list.length;

            var zeros = '';
            while (count) {
                zeros += '0';
                count--;
            }

            var returnValue = zeros + list.join('');
            return returnValue.split('');
        }
    };
    var othis = this;
    function parseTime(arg) {
        return othis.addZero(arg.minute) + ":" + othis.addZero(arg.second) + "." + arg.miliSecond;
    }
    function parseSpanTime(arg) {

        return arg.minute + ":" + othis.addZero(arg.second) + "." + arg.miliSecond;
    }
    function showRecord(arg, pageIndex) {
        var itemsPerPage = 9;
        var htmlStrings = [];
        var pass = 0;
        if (pageIndex != undefined) {
            pass = (pageIndex) * itemsPerPage;
        }
        else { //show current page
            currentPage = parseInt(arg.recordList.length / itemsPerPage);

            pass = parseInt(arg.recordList.length / itemsPerPage) * itemsPerPage;
            if (arg.recordList.length % itemsPerPage == 0 && arg.recordList.length >= itemsPerPage) {
                currentPage--;
                pass -= itemsPerPage;
            }
            if (pass < 0) {
                pass = 0;
            }
        }
        var width = 160, height = 30, line = 3;
        for (var i = pass, j = 0; j < itemsPerPage && i < arg.recordList.length; i++, j++) {
            var left = parseInt(i % itemsPerPage / line) * width + 'px',
            top = (i % line) * height + 10 + 'px';


            htmlStrings.push("<li style='left:" + left + "; top:" + top + "'><span>" + '计次' + (i + 1) + "</span>" + parseTime(arg.recordList[i].timeAll) + "</li>");

        }

        recordList.innerHTML = htmlStrings.join('');
        makePager(arg.recordList.length, itemsPerPage);
    }
    /*-----------pager----------*/
    pager.onclick = function (event) {

        var source = null;
        if (event) {
            source = event.target;
        }
        else {
            source = window.event.srcElement;
        }
        if (source.nodeName != "LI") {
            return;
        }
        var pageIndex = source.id.charAt(1) - 1;
        currentPage = pageIndex;
        showRecord(watchForwardModel.getCurrentData(), pageIndex);
    }
    function makePager(totalCount, itemsPerPage) {
        pager.innerHTML = '';
        if (totalCount <= itemsPerPage) {
            var child1 = document.createElement("li");
            child1.className = 'selected';
            child1.id = "p" + (i + 1);
            pager.appendChild(child1);
            return;
        }
        for (var i = 0; i < 4 && i < Math.ceil(totalCount / itemsPerPage); i++) {
            var child = document.createElement("li");

            if (i == currentPage) {

                child.className = 'selected';
            }
            child.id = "p" + (i + 1);
            pager.appendChild(child);
        }
    }
    //load image
    var images = ['record-disabled.png', 'record-hover.png', 'record-press.png', 'reset-hover.png', 'reset-press.png', 'start-hover.png', 'start-press.png', 'stop-hover.png', 'stop-press.png'];
    for (var k = 0; k < images.length; k++) {
        new Image().src = ("miaobiaoB/images/" + images[k]);
    }
};

window.App.Watch.WatchForwardModel = function () {
    var recordList = [];
    var step = 100;
    var intervalHandle = null;
    var lastRecordTime = 0,
        lastRecordToNow = 0,
        timeAll = 0,
        recordCount = 0,
        timeBegin = 0,
        timePause = 0,
        timeBreak = 0;
    var that = {};
    that.refreshEvent = function () { throw new Error('not impliment'); };
    that.start = function () {
        if (timePause) {
            timeBreak = new Date().getTime() - timePause;
            lastRecordTime += timeBreak;
            timeBegin += timeBreak;
        }
        else {
            timeBegin = new Date().getTime();
            lastRecordTime = timeBegin;
            lastRecordToNow = 0;
        }
        intervalHandle = window.setInterval(refreshEventWrap, step);
    };
    that.stop = function () {
        clearInterval(intervalHandle);
        intervalHandle = null;
        /*lastRecordTime = 0;
        lastRecordToNow = 0;
        timeAll = 0;*/
        timePause = new Date().getTime();
    };

    that.reset = function () {
        clearInterval(intervalHandle);
        intervalHandle = null;
        lastRecordToNow = 0;
        lastRecordTime = 0;
        timeAll = 0;
        timePause = 0;
        recordCount = 0;
        recordList = [];
    };
    that.getCurrentData = function () {
        return {
            recordList: recordList,
            timeAll: parseTime(timeAll),
            lastRecordToNow: parseTime(lastRecordToNow)
        }
    };
    that.record = function () {

        //recordList[recordCount] = { timeAll: , lastRecordToNow: calLastRecordToNow() };
        recordList[recordCount] = {};
        recordList[recordCount].timeAll = parseTime(timeAll);

        recordCount++;
        lastRecordTime = new Date().getTime();
    };
    return that;

    function refreshEventWrap() {

        var now = new Date().getTime();
        timeAll = now - timeBegin;
        lastRecordToNow = now - lastRecordTime;

        that.refreshEvent({
            timeAll: parseTime(timeAll),
            lastRecordToNow: parseTime(lastRecordToNow)
        });
    }
    function parseTime(timeValue) {
        var secondAll = Math.floor(timeValue / 1000);
        var minute = Math.floor(secondAll / 60);

        var second = Math.floor(secondAll - minute * 60);

        var miliSecond = Math.floor((timeValue - secondAll * 1000) / 100);

        return {
            minute: minute,
            second: second,
            miliSecond: miliSecond
        }
    }
};