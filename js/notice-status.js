var page = 1;
var pageSize = 6;
var pageList = document.getElementsByClassName('choosePage')[0];
var con = document.getElementsByClassName("con")[0];


// 拉取数据
function dataAjax(stuId, group, type, accept) {
    if(group == "全部") {
        group = null;
    }
    if(type == "全部") {
        type = null;
    }
    if(accept == "全部") {
        accept = null;
    }

    var data = {
        page: page,
        pageSize: pageSize,
        stuId: stuId,
        group: group,
        type: type,
        accept: accept
    }
    data = JSON.stringify(data);

    $.ajax({
        type: "POST",
        url: serverUrl + "/notice/listNotice",
        dataType: "json",
        contentType: "application/json",
        data: data,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            console.log(data);
            if (data.code == 1) {
                for (var i = 0; i < data.data.data.length; i++) {
                    addUl(data.data.data[i]);
                    if (i % 2 == 1) {
                        document.getElementsByClassName("students")[i].classList.add("changeColor");
                    }
                }
                createPage(data.data.page);

                // 保存本次数据
                window.stuIdLast = data.stuId;
                window.groupLast = data.group;
                window.typeLast = data.type;
                window.acceptLast = data.accept;
            } else if (data.code == 0) {
                window.location.href = "login.html";
            } else {
                alert(data.msg);
            }
        }
    })
}
dataAjax();

// 根据学号查询通知信息
function searchOneAjax(stuId) {
    var data = {
        "stuId": stuId,
    }
    data = JSON.stringify(data);

    $.ajax({
        type: "POST",
        url: serverUrl + "/notice/listNotice",
        dataType: "json",
        contentType: "application/json",
        data: data,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            console.log(data);
            if (data.code == 1) {

            } else {
                alert(data.msg);
            }
        }
    })
}

// 更新通知信息
function updateAjax(noticeId, stuId, notice, accept) {
    var data = {
        "noticeId": noticeId,
        "stuId": stuId,
        "notice": notice,
        "accept": accept
    }
    data = JSON.stringify(data);

    $.ajax({
        type: "POST",
        url: serverUrl + "/notice/updateNotice",
        dataType: "json",
        contentType: "application/json",
        data: data,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            console.log(data);
            if (data.code == 1) {
                alert(data.msg);
                location.reload();
            } else {
                alert(data.msg);
            }
        }
    })
}

// 删除报名信息
function removeAjax(noticeId) {
    var data = {
        "noticeId": noticeId,
    }
    data = JSON.stringify(data);

    $.ajax({
        type: "POST",
        url: serverUrl + "/notice/removeNotice",
        dataType: "json",
        contentType: "application/json",
        data: data,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            console.log(data);
            if (data.code == 1) {
                alert(data.msg);
            } else {
                alert(data.msg);
            }
        }
    })
}


// 增加表格行
function addUl(data) {
    let str = `
                <ul notice_id="${data.noticeId}" class="students">
                    <li>${data.name}</li>
                    <li class="idLi">${data.stuId}</li>
                    <li>${data.group}</li>
                    <li>${data.phone}</li>
                    <li>${data.type}</li>
                    <li class="noticeLi"><textarea disabled="disabled">${data.notice}</textarea></li>
                    <li>${data.accept}</li>
                    <li class="editor-img">
                        <img src = "image/edit.png"  class="editor-icon" click="editNotice" name="编辑">
                        <img src = "image/delete.png"  class="delete-icon" click="removeNotice" name="删除信息">
                    </li>
                </ul>
    `;
    document.getElementsByClassName("trAll")[0].insertAdjacentHTML('beforeend', str);
}


// 页数格式选择与创建
function createPage(pages) {
    pageList.innerHTML = "";
    if (pages <= 9) {
        for (var i = 1; i <= pages; i++) {
            creatOnePage(i);
        }
    }
    else if (page <= 5) {
        for (var i = 1; i <= 7; i++) {
            creatOnePage(i);
        }
        creatOnePage("...");
        creatOnePage(pages);
    }
    else if (page >= pages - 4) {
        creatOnePage(1);
        creatOnePage("...");
        for (var i = pages - 6; i <= pages; i++) {
            creatOnePage(i);
        }
    }
    else {
        creatOnePage(1);
        creatOnePage("...");
        for (var i = pages - 2; i <= pages + 2; i++) {
            creatOnePage(i);
        }
        creatOnePage("...");
        creatOnePage(pages);
    }
}
// 创建一页
function creatOnePage(i) {
    if (i == page) {
        pageList.innerHTML += `<div class="page pageNow">${i}</div>`;
        //pageList.insertAdjacentHTML('beforeend', `<div class="page" onclick="pageClick()">${i}</div>`);
    } else if (i == "...") {
        pageList.innerHTML += `<div class="page noPage">${i}</div>`;
        //pageList.insertAdjacentHTML('beforeend', `<div class="page">${i}</div>`);
    } else {
        pageList.innerHTML += `<div class="page">${i}</div>`;
        //pageList.insertAdjacentHTML('beforeend', `<div class="page" onclick="pageClick()>${i}</div>`);
    }
}
var pageLi = document.getElementsByClassName("page");
// 换页

document.getElementsByClassName("choosePage")[0].onclick = function () {
    if (event.target && event.target.className == "page") {
        if(event.target.innerHTML != "...") {
            document.getElementsByClassName("trAll")[0].innerHTML = "";
            page = event.target.innerHTML;
            dataAjax();
        } else {
            return false;
        }
    }
}

// 监听事件
con.onclick = function () {
    if (event.target.getAttribute("click") == "insertNotice") {  // 添加通知信息
        event.stopPropagation();
    } else if (event.target.getAttribute("click") == "editNotice") {   // 更新通知信息
        var noticeUl = event.target.parentNode.parentNode;
        var noticeTextarea = noticeUl.getElementsByTagName("textarea")[0];
        window.noticeLast = noticeTextarea.value;

        event.target.src = "image/save.png";
        event.target.parentNode.getElementsByClassName("delete-icon")[0].src = "image/cancel.png";
        event.target.parentNode.getElementsByClassName("editor-icon")[0].removeAttribute("click");
        event.target.parentNode.getElementsByClassName("editor-icon")[0].setAttribute("click","saveNotice");
        event.target.parentNode.getElementsByClassName("delete-icon")[0].setAttribute("click","cancel");
        console.log(event.target.parentNode.getElementsByClassName("delete-icon")[0])
        noticeTextarea.removeAttribute("disabled");

        event.stopPropagation();
    } else if (event.target.getAttribute("click") == "removeNotice") {   // 删除通知信息
        if (confirm("你确定要删除我吗？")) {
            console.log(event.target.parentNode.parentNode.notice_id)
            removeAjax(event.target.parentNode.parentNode.getAttribute("notice_id"));
            location.reload();
        } else {
            return false;
        }
        event.stopPropagation();
    }  else if (event.target.getAttribute("click") == "cancel") {   // 取消通知信息
        if(confirm("确定取消编辑吗？")) {
            event.target.src = "image/delete.png";
            console.log(event.target.parentNode)
            event.target.parentNode.getElementsByClassName("editor-icon")[0].src = "image/edit.png";
            event.target.parentNode.getElementsByClassName("editor-icon")[0].removeAttribute("click");
            event.target.parentNode.getElementsByClassName("editor-icon")[0].setAttribute("click","editNotice");
            event.target.parentNode.parentNode.getElementsByTagName("textarea")[0].setAttribute("disabled", "disabled");
            event.target.parentNode.parentNode.getElementsByTagName("textarea")[0].value = noticeLast;
        } else {
            return ;
        }
        event.stopPropagation();
    }   else if (event.target.getAttribute("click") == "saveNotice") {   // 保存通知信息
        if(confirm("确定保存吗？")) {
            var noticeUl = event.target.parentNode.parentNode;
            var noticeTextarea = noticeUl.getElementsByTagName("textarea")[0];
            let noticeId = noticeUl.getAttribute("notice_id");
            let stuId = noticeUl.getElementsByTagName("li")[1].innerHTML;
            let notice = noticeTextarea.value;
            let accept = noticeUl.getElementsByTagName("li")[6].innerHTML;
            if(isNotNull(notice)) {
                event.target.src = "image/edit.png";
                event.target.parentNode.getElementsByClassName("delete-icon")[0].src = "image/delete.png";
                noticeTextarea.setAttribute("disabled", "disabled");
                updateAjax(noticeId, stuId, notice, accept);
            } else {
                alert("填写不能为空哦")
                return;
            }                  
        } else {
            return ;
        }
        event.stopPropagation();
    } else {
        event.stopPropagation();
        return;
    }
}

// 非空判断
function isNotNull(source) {
    if (source != null && source != undefined && source != 'undefined' && $.trim(source) != "")
        return true;
    return false;
}


var groupCon = document.getElementsByClassName("group")[0];
var typeCon = document.getElementsByClassName("type")[0];
var readCon = document.getElementsByClassName("read")[0];

// 选择
function chooseSth() {
    chooseSthOne(groupCon);
    chooseSthOne(typeCon);
    chooseSthOne(readCon);
}
chooseSth();

function chooseSthOne(chooseCon) {
    var groupValue = chooseCon.getElementsByTagName("input")[0];
    var groupShow = chooseCon.getElementsByTagName("img")[0];
    var groupList = chooseCon.getElementsByTagName("ul")[0];

    groupList.onclick = function () {
        if (event.target && event.target.nodeName == "LI") {
            groupValue.value = event.target.innerText;
        }
    }
    chooseCon.onclick = function () {
        if (groupShow.getAttribute("tle") == "show") {
            groupShow.setAttribute("tle", "hidden");
            groupList.style.display = "none";
            groupShow.setAttribute("src", "image/xiala.png");
        } else {
            groupShow.setAttribute("tle", "show");
            groupList.style.display = "block";
            groupShow.setAttribute("src", "image/shouqi.png");
        }
    }
}

// 筛选
document.getElementsByClassName("submit-query-result")[0].onclick = function () {
    let stuIdInput = document.getElementsByClassName("search")[0].value;
    let groupChoose = groupCon.getElementsByTagName("input")[0].value;
    let typeChoose = typeCon.getElementsByTagName("input")[0].value;
    let readChoose = readCon.getElementsByTagName("input")[0].value;

    document.getElementsByClassName("trAll")[0].innerHTML = "";
    pageList.innerHTML = "";
    if(stuIdInput != stuIdLast || groupChoose != groupLast || typeChoose != typeLast || readChoose != acceptLast) {
        page = 1;
    }
    dataAjax(stuIdInput, groupChoose, typeChoose, readChoose);
}