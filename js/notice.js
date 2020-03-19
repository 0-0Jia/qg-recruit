var page = 1;
var pageSize = 10;
let noticeDate = [];
let con = document.getElementsByClassName("noticeCon")[0];
let dateCon = con.getElementsByClassName("noticeAll")[0];
let pageList = con.getElementsByClassName("noticPage")[0];

// 拉取通知模板数据
function noticeAjax() {
    var data = {
        "page": page,
        "pageSize": pageSize
    }

    $.ajax({
        type: "POST",
        url: serverUrl + "/template/listTemplate",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(data),
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            console.log("请求结果",data);
            if (data.code == 1) {
                noticeDate = data.data.data;
                noticeInsert(noticeDate);
                createPage(data.data.page);
            } else if(data.code == 0) {
                window.location.href = "login.html";
            } else {
                alert(data.msg);
            }
        }
    })
}

// 插入数据
function noticeInsert(data) {
    dateCon.innerHTML = "";
    for (let i = data.length - 1; i >= 0; i--) {
        dateCon.innerHTML += noticeModel(data[i]);
    }
}
// 模板
function noticeModel(data) {
    if (data) {
        var model =    `<div class="noticeDiv" tle="${data.templateId}">
                            <img click="noticeDelete" src="image/remove2.png">
                            <textarea maxlength="150" disabled="disabled">${data.message || ""}</textarea>
                            <input maxlength="20" disabled="disabled" value="${data.name || ""}">
                            <button class="edit-button" click="noticeEditAble" style="display:block;">编辑</button>
                            <button class="save-button" click="noticeEditSubmit" style="display:none;">保存</button>
                        </div>`
    } else {
        console.log(data);
        var model =    `<div class="noticeDiv" tle="null">
                            <img click="noticeDelete" src="image/remove2.png">
                            <textarea maxlength="150" disabled="disabled"></textarea>
                            <input maxlength="20" disabled="disabled" value="">
                            <button class="edit-button" click="noticeEditAble" style="display:block;">编辑</button>
                            <button class="save-button" click="noticeAddSubmit" style="display:none;">提交</button>
                        </div>`

    }
    return model;
}
// 监听事件
con.onclick =  function() {
    if (event.target.getAttribute("click") == "noticeDelete") {
        noticeDelete();
        console.log(this.getAttribute("class"));
        event.stopPropagation();
    } else if (event.target.getAttribute("click") == "noticeEditAble") {
        noticeEditAble();
        console.log(this.getAttribute("class"));
        event.stopPropagation();
    } else if (event.target.getAttribute("click") == "noticeEditSubmit") {
        noticeEditSubmit();
        console.log(this.getAttribute("class"));
        event.stopPropagation();
    } else if (event.target.getAttribute("click") == "noticeAddSubmit") {
        noticeAddSubmit();
        console.log(this.getAttribute("class"));
        event.stopPropagation();
    } else if (event.target.getAttribute("click") == "noticeAdd") {
        if(dateCon.children[0].getAttribute("tle") == "null") {
            return ;
        }
        dateCon.insertAdjacentHTML('afterbegin', noticeModel());
        console.log(this.getAttribute("class"));
        event.stopPropagation();
    } else if (event.target.getAttribute("click") == "changePage") {
        page = event.target.innerText;
        noticeAjax();
        console.log(this.getAttribute("class"));
        event.stopPropagation();
    } else {
        console.log(this.getAttribute("class"));
        event.stopPropagation();
        return;
    }
}


// 进入编辑
function noticeEditAble() {
    let con = event.target.parentNode;
    let message =  con.getElementsByTagName("textarea")[0];
    let name  = con.getElementsByTagName("input")[0];
    let saveClick = con.getElementsByTagName("button")[1];
    
    message.removeAttribute("disabled");
    name.removeAttribute("disabled");
    event.target.style.display = "none";
    saveClick.style.display = "block";

}
// 提交编辑
function noticeEditSubmit() {

    console.log("aaaaaa");
    let con = event.target.parentNode;    
    let templateId = con.getAttribute("tle");
    let message =  con.getElementsByTagName("textarea")[0].value;
    let name  = con.getElementsByTagName("input")[0].value;

    let send = {
        templateId: templateId,
        message: (message),
        name: (name)
    }
    console.log(send);

    var judge = true;
    for (var p in send) {
        if (!isNotNullTrim(send[p])) {
            judge = false;
            break;
        }
    }
    if (!judge) {
        alert("输入不能为空");
        return;
    }

    if (confirm("确定修改？")) {
        $.ajax({
            url: serverUrl + "/template/updateTemplate",
            method: "POST",
            data: JSON.stringify(send),
            headers: {
               "Content-Type":"application/json"
            },
            contentType: false,
            processData: false,
            dataType: "json",
            async: false,
            success: function (data) {
                if (data.code == 1) {
                    alert ("修改成功");
                    noticeAjax();
                } else {
                    alert(data.msg);
                }
            }
        })
    } else {
        alert("取消成功");
    }
} 
// 删除
function noticeDelete() {
    let con = event.target.parentNode;
    let templateId = con.getAttribute("tle");
    
    if (templateId == "null") {
        con.parentNode.removeChild(con);
        return;
    }
    
    let send = {
        templateId: templateId
    }

    if (confirm("确定删除？")) {
        $.ajax({
            url: serverUrl + "/template/deleteTemplate",
            method: "POST",
            data: JSON.stringify(send),
            headers: {
               "Content-Type":"application/json"
            },
            contentType: false,
            processData: false,
            dataType: "json",
            async: false,
            success: function (data) {
                if (data.code == 1) {
                    alert ("删除成功");
                } else {
                alert(data.msg);
                }
                noticeAjax();
            }
        })
    } else {
        alert("取消成功");
    }
}

// 提交添加
function noticeAddSubmit() {
    let con = event.target.parentNode;    
    let message =  con.getElementsByTagName("textarea")[0].value;
    let name  = con.getElementsByTagName("input")[0].value;

    let send = {
        message: (message),
        name: (name)
    }

    var judge = true;
    for (var p in send) {
        if (!isNotNullTrim(send[p])) {
            judge = false;
            break;
        }
    }
    if (!judge) {
        alert("输入不能为空");
        return;
    }


   if (confirm("确定添加？")) {
        $.ajax({
            url: serverUrl + "/template/insertTemplate",
            method: "POST",
            data: JSON.stringify(send),
            headers: {
               "Content-Type":"application/json"
            },
            contentType: false,
            processData: false,
            dataType: "json",
            async: false,
            success: function (data) {
                if (data.code == 1) {
                    alert ("添加成功");
                    noticeAjax();
                } else {
                    alert(data.msg);
                } 
            }
        })
    } else {
        alert("取消成功");
    }
}




noticeAjax();


// 生成页数

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
        pageList.innerHTML += `<li class="onPage">${i}</li>`;
    } else if (i == "..."){
        pageList.innerHTML += `<li class="noPage">${i}</li>`;
    } else {
        pageList.innerHTML += `<li click="changePage">${i}</li>`;
    }
}

// 判断是否为空
function isNotNullTrim(source){
    if(source != null && source != undefined && source != 'undefined' && $.trim(source) != "")
        return true;
    return false;
}

