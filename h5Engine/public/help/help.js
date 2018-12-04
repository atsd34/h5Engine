var currentPage = "Getting Started";
var Ind = helptext["Index.txt"].split('\n');
var indexList;
$(function () {
    var bookmark = decodeURI(window.location.href).split("#")
    if (bookmark.length == 2)
        currentPage = bookmark[1]
    indexList = getIndexList();
    var area = $(".IndexArea");
    $(".currentDocument").html('');
    addLi(area, indexList);
});
var codestarted = false;
var commentstarted = false;
var colonCount = 0;
var stringstarted = false;
function CreateHelp() {
    var area = $(".helpArea");
    var txt = helptext[currentPage];
    var final = "";
    var sp = txt.split("\n");
    for (var i = 0; i < sp.length; i++) {
        var it = sp[i];
        var re = it.replace("\t", "").replace("\t", "").replace(/\t/g, " &nbsp; &nbsp; &nbsp;");
        if (it[0] != "\t") {
            re = "<h2>" + re + "</h2>";
            if (codestarted)
                re = "</div>" + re;
            codestarted = false;
        }
        else if (it[1] != "\t") {
            re = "<h4 style='font-weight:700'>" + re + "</h4>";
            if (codestarted)
                re = "</div>" + re;
            codestarted = false;
        }
        else {
            var style = "";
            var start = "";

            if (re.startsWith("/*"))
                commentstarted = true;
            var firstcolonIndex = -1;
            var lastColonIndex = -1;
            var stillCode = false;

            if (codestarted) {
                var colonIn = getAllIndexes(re, "{");
                var colonOut = getAllIndexes(re, "}");
                if (colonCount == 0)
                    firstcolonIndex = re.indexOf("{");
                if (colonIn.length > 0)
                    colonCount += colonIn.length;
                if (colonOut.length > 0)
                    colonCount -= colonOut.length;
                if ((colonCount - colonOut.length) == 0) {
                    lastColonIndex = re.lastIndexOf("}");
                }
            }

            if (colonCount > 0 || firstcolonIndex != -1 || lastColonIndex != -1) {
                stillCode = true;
            }
            if (!codestarted && re.indexOf("@@") != -1) {
                var pg = re.substring(re.indexOf("@@") + 2, re.lastIndexOf("@@"));
                re = re.substring(0, re.indexOf("@@")) + "<p><img src='" + pg + "'/>" + re.substring(re.lastIndexOf("@@") + 2) + "</p>";

            }
            else if (!codestarted && re.indexOf("@") != -1) {
                var pg = re.substring(re.indexOf("@") + 1, re.lastIndexOf("@"));
                var url = "";
                if (!pg.startsWith("http") && !pg.startsWith("mailto"))
                    url = "javascript:openPage(\"" + pg + "\")";
                else
                    url = pg;
                re = re.substring(0, re.indexOf("@")) + "<b><a href='" + url + "'>" + pg + "</a></b>" + re.substring(re.lastIndexOf("@") + 1);

            }
            if (re.startsWith("//") || commentstarted) {
                re = changeWithCode(re);
                style = 'style="color:green"';
                if (!codestarted) {
                    start = "<div style='background-color:#dddddd;color:black;padding:10px 10px 10px 10px'>";
                }
                codestarted = true;
            }
            else if (!stillCode && it.indexOf(":") != -1 && !re.startsWith("NOTE")) {
                re = "<b>" + re.replace(":", ":</b><i>");
                re = "<span " + style + " >&emsp;" + re + "</i></span > ";
                if (codestarted)
                    re = "</div>" + re;
                codestarted = false;

            } else if (codestarted) {
                re = changeWithCode(re);
                var cmntind = re.indexOf("//");
                if (cmntind != -1) {
                    re = re.substring(0, cmntind) + '<span style="color: green">' + re.substring(cmntind) + "</span>";
                }
            }
            re = start + "<span " + style + " > " + re + "</span ><br/> ";
            if (commentstarted && it.indexOf("*/") != -1)
                commentstarted = false;
        }

        final += re;
    }
    if (codestarted)
        final += "</div>";
    codestarted = false;
    area.html(final + "<br /><br />");
}
function changeWithCode(str) {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
function openPage(txt) {
    window.scrollTo(0, 0)
    currentPage = txt;
    $(".IndexArea").html('');
    $(".currentDocument").html('');
    addLi($(".IndexArea"), indexList);
    window.location = window.location.href.split("#")[0] + "#" + currentPage;
}
function addLi(ul, list) {
    for (var i in list) {
        if (i == "__Order")
            continue;
        var it = list[i];
        var li = $("<li>" + i + "</li>").appendTo(ul);
        li.on("click", function () {
            var txt = $(this).text();
            if (childOfList(list[txt]).length > 0) {
                var ul1 = $("<ul />").appendTo($(this));
                addLi(ul1, list[txt]);
            }
            else if (helptext[txt] != undefined) {
                openPage(txt);
            }

        });
        if (i == currentPage && childOfList(it).length == 0) {
            li.css("font-weight", "bold");
            li.css("font-size", "15px");
            $(".currentDocument").append("<span>" + i + "</span>");
            CreateHelp();
        } else {
            li.css("font-size", "13px");

        }
        li.attr("order", it.__Order);
        var ch = currentIsChild(it);
        if (ch) {
            $(".currentDocument").append("<span>" + i + " \\ </span>");
            var ul1 = $("<ul />").appendTo(li);
            addLi(ul1, it);
        }
    }
}
function currentIsChild(list) {
    if (typeof (list) != "object")
        return false;
    for (var i in list) {
        if (i == currentPage)
            return true;
        var child = currentIsChild(list[i]);
        if (child)
            return true;
    }
    return false;
}
function getIndexList() {
    var iL = {};
    var ci = "";
    var ci2 = "";
    for (var i = 0; i < Ind.length; i++) {
        var item = Ind[i];
        if (item[0] != "\t") {
            var c = cleanIndexName(item);
            ci = c;
            iL[c] = { __Order: i };
        } else if (item[1] != "\t") {
            var c = cleanIndexName(item);
            iL[ci][c] = { __Order: i };
            ci2 = c;
        } else {
            var c = cleanIndexName(item);
            iL[ci][ci2][c] = { __Order: i };
        }
    }
    return iL;
}
function cleanIndexName(txt) {
    var retval = txt.trim();
    if (retval.startsWith("-"))
        retval = retval.substring(1).trim();;
    return retval;
}
function getAllIndexes(arr, val) {
    var indexes = [], i = -1;
    while ((i = arr.indexOf(val, i + 1)) != -1) {
        indexes.push(i);
    }
    return indexes;
}
function childOfList(list) {
    var retval = [];
    for (var i in list) {
        if (i != "__Order")
            retval.push(i);
    }
    return retval;
}

function search(text) {
    var tm1 = new Date();
    text = text.toLowerCase();
    var retval = [];
    for (var i in helptext) {
        if (i == "Index.txt")
            continue;
        var itm = helptext[i].toLowerCase();
        if (itm.indexOf(text) != -1 || i.toLowerCase().indexOf(text) != -1) {
            var o = { name: i };
            if (i.toLowerCase().indexOf(text) != -1) {
                o.score = 1000;
                o.highlight = i;
                retval.push(o);
                continue;
            }
            var score = 0;
            var splitted = itm.split("\n");
            var mostscore = 0;
            var highlight = "";
            for (var j = 0; j < splitted.length; j++) {
                var ln = splitted[j];
                if (ln.indexOf(text) != -1) {
                    var occ = getAllIndexes(ln, text).length;
                    let lnscore = 0;
                    if (ln[0] != "\t")
                        lnscore = 100;
                    else if (ln[1] != "\t")
                        lnscore = 10;
                    else
                        lnscore = 1;
                    lnscore = lnscore * occ;
                    score += lnscore;
                    if (lnscore > mostscore) {
                        highlight = ln;
                        mostscore = lnscore;
                    }
                }
            }
            o.score = score;
            o.highlight = highlight;
            retval.push(o);
        }
    }
    retval = retval.sort((i, j) => j.score - i.score);

    var tm2 = new Date();
    console.log("Searched " + text + " in " + (tm2.getTime() - tm1.getTime()) + "ms");
    return retval;
}

$(function () {
    var s = $(".inpSearch");
    s.on("blur", function () {
        $(".dvSearchBox").html('');
    });
    s.on("keypress", function (e) {
        if (e.which == 13) {
            var lines = $(".lineDiv");
            if (lines.length > 0) {
                var nm = $(lines[0]).attr("customAttr");
                openPage(nm);
                s.trigger("blur");
            }
        }
    });
    s.on("input", function () {
        var criteria = s.val().toLowerCase();
        var r = $(".dvSearchBox");
        if (!criteria) {
            r.html('');
            return;
        }
        var result = search(criteria);
        r.html('');
        r.width(window.innerWidth / 2);
        var tp = (s.position().top + s.height() + 14);
        r.css("max-height", (window.innerHeight - tp * 2) + "px");
        r.css("overflow","auto");
        r.css("top", tp+"px");
        r = $("<div style='width:100%;padding:8px 8px 8px 8px;background-color:#aaaaaa' />").appendTo(r);
        for (var i = 0; i < result.length; i++) {
            var evenodd = i % 2;
            var rs = result[i];
            var ln = $("<div style='width:100%;padding:3px 3px 3px 3px;' class='lineDiv'/>").appendTo(r);
        
            if (evenodd == 1)
                ln.css("background-color", "#eeeeee");
            else
                ln.css("background-color", "#cccccc");
            ln.append("<span style='font-size:18px'><b>" + rs.name + " : </b></span>");
            var sz = "'font-size:14px;font-weight:200'";
            if (rs.highlight[0] != "\t")
                sz = "'font-size:16px;font-weight:700'"
            else if (rs.highlight[1] != "\t")
                sz = "'font-size:14px;font-weight:600'";
            ;
            var inds = getAllIndexes(rs.highlight.toLowerCase(), criteria);
            inds = inds.sort((i, j) => j - i);
            var r2 = rs.highlight;
            for (var j = 0; j < inds.length; j++) {
                var ind = inds[j];
                r2 = r2.substr(0, ind) + "<span style='background-color:#99aaee'>" + r2.substr(ind, criteria.length) + "</span>" + r2.substr(ind + criteria.length);
            }
            rs.highlight.replace(new RegExp(criteria, "g"), "<span style='background-color:#aaaadd'>" + criteria + "</span>");
            ln.append("<span style=" + sz + ">" + r2 + "</span>");
            ln.attr("customAttr", rs.name);
            (function (nm) {
                ln.on("mousedown", function () {
                    openPage(nm);
                });
            })(rs.name);
        }
    });
});