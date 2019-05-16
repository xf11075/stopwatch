var m_t = [0, 0, 0, 0, 0, 0, 0, 1];
var firstsplitflag = 0;
var splittime;
function stopstart() {
    m_t[m_t[2]] = (new Date()).valueOf();
    m_t[2] = 1 - m_t[2];
    if (0 == m_t[2]) {
        clearInterval(m_t[4]);
        m_t[3] += m_t[1] - m_t[0];
        document.getElementById("startstopbutton").value = "\u5f00\u59cb";
        document.getElementById("split").innerHTML += (m_t[7]++) + " \u505c\u6b62: " + format(m_t[1] - m_t[0]) + "<br />";
        m_t[4] = m_t[1] = m_t[0] = 0;
        disp();
        firstsplitflag = 0
    } else {
        document.getElementById("startstopbutton").value = "\u505c\u6b62";
        m_t[4] = setInterval(disp, 43)
    }
}
function dosplit() {
    if (0 !== m_t[2]) {
        document.getElementById("split").innerHTML += (m_t[7]++) + " \u5206\u5272: " + format(m_t[1] - m_t[0]) + "<br>"
    }
}
function reset_it() {
    if (m_t[2]) {
        stopstart()
    }
    m_t[4] = m_t[3] = m_t[2] = m_t[1] = m_t[0] = 0;
    disp();
    document.getElementById("split").innerHTML = "";
    m_t[7] = 1
}

function disp() {
    if (m_t[2]) {
        m_t[1] = (new Date()).valueOf()
    }
    m_t[6].value = format(m_t[3] + m_t[1] - m_t[0])
}
function format(b) {
    var c = new Date(b + m_t[5]).toString().replace(/.*([0-9][0-9]:[0-9][0-9]:[0-9][0-9]).*/, "$1");
    var a = String(b % 1000);
    while (a.length < 3) {
        a = "0" + a
    }
    c += "." + a;
    return c
}
function load() {
    m_t[5] = new Date(1970,1,1,0,0,0,0).valueOf();
    m_t[6] = document.getElementById("disp");
    disp()
}

load();
