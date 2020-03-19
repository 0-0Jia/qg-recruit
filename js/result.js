var page = 1;

//获得搜索选择栏的大容器
var search_con = document.getElementsByClassName("result-content")[0]
//获得搜索框的input
var search_con_input = search_con.getElementsByTagName("input")[0]
//获得添加学生信息的大容器
var stu_list = document.getElementsByClassName("result-list")[0];
//获得添加到学生信息的大容器
var list_container = stu_list.getElementsByClassName("student-information-container")[0];
let groupCon = document.getElementsByClassName("group")[0];
let typeCon = document.getElementsByClassName("type")[0];
let passCon = document.getElementsByClassName("pass")[0];
//获得保存按钮
var submit_btn = document.getElementsByClassName("save-btn")[0]
//获得添加学生信息的大容器
var add_container = document.getElementsByClassName("add-stu-container")[0];
//获得添加学生信息按钮
var add_btn = document.getElementsByClassName("add-stu-inf-btn")[0];
//获得两个删除按钮
var remove_btn1 = document.getElementsByClassName("close-btn")[0]
var remove_btn2 = document.getElementsByClassName("delate-stu-inf")[0];
//获得发送模板按钮
var previewMod = document.getElementsByClassName("send-notice")[0]
//获得发送模板容器
var previewCon = document.getElementsByClassName("notice-model")[0];
var sumbitJudge = true;
var requireData = 0;
//定义一个全局变量对象，存放勾选学生的学好信息
var storeid = {
    "gradeIds": [],
    "time": "",
    "location": "",
    "templateId": ""
};
//定义一个数组存放学生的gradeId
var savegraId = new Array();
//获得信息添加容器input框的容器
var add_input = document.getElementsByClassName("input-stuid-container");


function Selection() {
    if (event.target.nodeName == "LI") {
        let con = event.target.parentNode.parentNode;
        let input = con.getElementsByTagName("input")[0];
        let img = con.getElementsByTagName("img")[0];
        let ul = con.getElementsByTagName("ul")[0];

        input.value = event.target.innerText;
        ul.style.display = "none";
        img.setAttribute("tle", "hidden");
        img.setAttribute("src", "image/xiala.png");
        event.stopPropagation();
    } else if (event.target.nodeName == "IMG" || event.target.nodeName == "INPUT") {
        let con = event.target.parentNode;

        if (event.target.nodeName == "IMG") {
            var img = event.target;
        } else {
            var img = con.getElementsByTagName("img")[0];
        }
        let ul = con.getElementsByTagName("ul")[0];

        if (img.getAttribute("tle") == "show") {
            ul.style.display = "none";
            img.setAttribute("tle", "hidden");
            img.setAttribute("src", "image/xiala.png");
        } else if (img.getAttribute("tle") == "hidden") {
            ul.style.display = "block";
            img.setAttribute("tle", "show");
            img.setAttribute("src", "image/shouqi.png");
        }
        event.stopPropagation();
    }
}

groupCon.onclick = typeCon.onclick = passCon.onclick = Selection;
for (let i = 3; i < add_input.length; i++) {
    add_input[i].onclick = Selection;
}
//根据选择框重新拉取一次数据
function pullback() {
    var groupvalue = document.getElementsByClassName("group-value")[0].value;
    var typevalue = document.getElementsByClassName("type-value")[0].value;
    var passvalue = document.getElementsByClassName("pass-value")[0].value;
    var stuid = search_con.getElementsByTagName("input")[0].value
    var stu = judgetype(groupvalue, typevalue, passvalue, stuid);
    $.ajax({
        "url": serverUrl + "/grade/listGrade",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
        },
        "data": JSON.stringify(stu),
        "dataType": "json",
        "async": true,
        "crossDomain": true,
        xhrFields: {
            withCredentials: true
        },
        "success": function (data) {
            console.log(data);
            if (data.code == -1) {
                alert(data.msg)
            } else if (data.code == 0) {
                window.location.href = "login.html";
            } else if (data.code == 1) {
                showstuinf(data.data.data, "no");
                editoravailble(data.data.data);
                delatestu(data.data.data);
                createPage(data.data.page)
                tick();
                checkSelect(data.data.data);
                window.requireData = data.data.data;

            }
        }
    })
}

pullback();
//点击提交按钮向后台发出请求，基于学号，组别，是否通过，考试类型的请求
//这个用于防止暴力点击的按钮的变量
var submitstatus = 1;
$(function () {
    $('.submit-query-result').click(function () {
        if (submitstatus == 1) {
            console.log("fuck")
            submitstatus = 0;
            pullback();
            alert("提交成功")
            storeid.gradeIds.length = 0;
            setTimeout(function () {
                submitstatus = 1
            }, 2000);
        }
    })
})

var flag = false;

//点击编辑按钮变为可编辑状态
function editoravailble(pagesize) {
    //获得编辑按钮
    var editor_icon = document.getElementsByClassName("editor-icon");

    for (let i = 0; i < pagesize.length; i++) {
        editor_icon[i].onclick = function () {
            if (this.getAttribute("src") == "image/save.png") {
                sendreq(i);
                console.log(window.flag)
                if (!window.flag) {
                    adddisabled(i);
                    this.setAttribute("name", "edit")
                    this.nextSibling.nextSibling.src = "image/delete.png";
                    this.nextSibling.nextSibling.setAttribute("name", "delete");
                    stu_list.getElementsByClassName("student-information")[i].style.borderColor = "white";
                }
            } else if (this.getAttribute("src") == "image/edit.png") {
                window.flag = true;
                stu_list.getElementsByClassName("student-information")[i].style.borderColor = "red";
                removedisabled(i);
                this.setAttribute("name", "save")
                this.nextSibling.nextSibling.src = "image/cancel.png";
                this.nextSibling.nextSibling.setAttribute("name", "cancel");
            }
            this.src = "image/" + this.getAttribute("name") + ".png";
        }
    }
}

//给保存按钮点击后台执行的函数
function sendreq(i) {
    var stu_inf = stu_list.getElementsByClassName("student-information")[i];
    var stu_inf_input = stu_inf.getElementsByTagName("input");
    var data = {
        "gradeId": (stu_inf.getAttribute("stu_id")),
        "stuId": (stu_inf_input[0].value),
        "name": (stu_inf_input[1].value),
        "sex": (stu_inf_input[2].value),
        "grade": (stu_inf_input[3].value),
        "remark": (stu_inf_input[4].value),
        "type": (stu_inf_input[5].value),
        "pass": (stu_inf_input[6].value),
        "group": (stu_inf_input[7].value),
    }

    if (isNull(data)) {
        var r = confirm("你确认要修改吗")
        if (r == true) {
            $.ajax({
                url: serverUrl + "/grade/updateGrade",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(data),
                crossDomain: true,
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    console.log(data)
                    window.flag = false;
                    if (data.code == -1) {
                        alert(data.msg);
                        pullback()
                    } else if (data.code == 1) {
                        alert("修改成功");
                        pullback()
                    }
                }
            })
        } else {
            pullback()
        }
    } else {
        alert("你的输入貌似有没填的，再看看?");
        console.log(window.requireData);
        window.flag = true;
        stu_inf_input[3].value = window.requireData[i].grade;
        stu_inf_input[4].value = window.requireData[i].remark;
        stu_inf_input[5].value = window.requireData[i].type;
        stu_inf_input[6].value = window.requireData[i].pass;
        stu_inf_input[7].value = window.requireData[i].group;

    }
}

function isNull(data) {
    if (data.name == "") {
        return false;
    } else if (data.stuId == "") {
        return false;
    } else if (data.sex == "") {
        return false;
    } else if (data.grade == "") {
        return false;
    } else if (data.remark == "") {
        return false;
    } else if (data.type == "") {
        return false;
    } else if (data.pass == "") {
        return false;
    } else if (data.group == "") {
        return false;
    }

    return true
}


//点击删除按钮删除信息
function delatestu(pagesize) {
    //获得删除按钮
    var delate_icon = document.getElementsByClassName("cancel-icon");

    for (let i = 0; i < pagesize.length; i++) {
        delate_icon[i].onclick = function () {
            //还原编辑的时候边框变的颜色
            stu_list.getElementsByClassName("student-information")[i].style.borderColor = "white";
            if (delate_icon[i].getAttribute("name") == "删除信息") {
                //要用户确认是否删除
                var r = confirm("你确认要删除吗")
                if (r == true) {
                    var data = {
                        gradeId: document.getElementsByClassName("student-information")[i].getAttribute("stu_id")
                    }
                    console.log(data)
                    $.ajax({
                        url: serverUrl + "/grade/removeGrade",
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: JSON.stringify(data),
                        crossDomain: true,
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (data) {
                            console.log(data)
                            if (data.code == -1) {
                                alert(data.msg);
                            } else if (data.code == 1) {
                                list_container.removeChild(list_container.getElementsByClassName("student-information")[i]);
                                alert("删除成功")
                                pullback();
                                storeid.gradeIds.length = 0;
                            }
                        }
                    })
                }
            } else if (delate_icon[i].getAttribute("name") == "cancel") {
                var li = document.getElementsByClassName("student-information")[i]
                stu_list.getElementsByClassName("editor-icon")[i].setAttribute("name", "edit")
                stu_list.getElementsByClassName("editor-icon")[i].src = "image/edit.png";
                this.src = "image/delete.png";
                this.setAttribute("name", "删除信息");
                li.getElementsByClassName("editor-input")[3].value = pagesize[i].grade
                li.getElementsByClassName("editor-input")[4].value = pagesize[i].remark
                li.getElementsByClassName("editor-input")[5].value = pagesize[i].type
                li.getElementsByClassName("editor-input")[6].value = pagesize[i].pass
                li.getElementsByClassName("editor-input")[7].value = pagesize[i].group
                adddisabled(i)
            }
        }
    }
}

//去掉input的disable属性
function removedisabled(i) {
    var stu_inf = document.getElementsByClassName("student-information")[i].getElementsByClassName("editor-input");
    for (var j = 3; j < stu_inf.length; j++) {
        stu_inf[j].disabled = "";
    }
}

//添加input的disabled属性
function adddisabled(i) {
    var stu_inf = document.getElementsByClassName("student-information")[i].getElementsByClassName("editor-input");
    for (var j = 0; j < stu_inf.length; j++) {
        stu_inf[j].disabled = "disabled";
    }
}

remove_btn1.onclick = function () {
    document.documentElement.style.overflow = "scroll";
    var add_item_input = add_container.getElementsByTagName("input");
    for (var i = 0; i < add_item_input.length; i++) {
        add_item_input[i].value = ""
    }
    add_container.style.display = "none";
}

//添加成绩信息
add_btn.onclick = function () {
    console.log(previewCon.getAttribute("style"))
    if (previewCon.getAttribute("style") == "display: block;") {
        alert("请先关闭另外的弹出窗口")
    } else {
        add_container.style.display = "block";
        // 禁止页面滚动
        document.documentElement.style.overflow = "hidden";
    }
}


submit_btn.onclick = function () {
    if (!sumbitJudge) {
        return;
    }
    sumbitJudge = false;
    setTimeout(function () {
        sumbitJudge = true;
    }, 1000);
    var add_item_input = add_container.getElementsByTagName("input");
    var data = {
        stuId: (add_item_input[0].value),
        grade: (add_item_input[1].value),
        remark: (add_item_input[2].value),
        type: (add_item_input[3].value),
        pass: (add_item_input[4].value)
    }
    console.log(data)
    $.ajax({
        url: serverUrl + "/grade/insertGrade",
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(data),
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            console.log(data)
            if (data.code == -1) {
                alert(data.msg);
                pullback();
            } else if (data.code == 1) {
                alert("添加成功");
                document.documentElement.style.overflow = "scroll";
                for (var i = 0; i < add_item_input.length; i++) {
                    add_item_input[i].value = ""
                }
                add_container.style.display = "none"
                //重新拉去一次数据
                pullback();
            }
        }
    })
}

//监听保存按钮，当点击的时候向后台添加数据
function submitadd() {
    var add_btn = document.getElementsByClassName("add-editor-icon")[0];
    var add_item = list_container.getElementsByClassName("student-information");
    var add_item_input = add_item[0].getElementsByTagName("input")
    console.log(add_item_input);

    add_btn.onclick = function () {
        var data = {
            stuId: (add_item_input[0].value),
            grade: (add_item_input[3].value),
            remark: (add_item_input[4].value),
            type: (add_item_input[5].value),
            pass: (add_item_input[6].value),
            group: (add_item_input[7].value),
        }
        console.log(data)
        $.ajax({
            url: serverUrl + "/grade/insertGrade",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data),
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                console.log(data)
                if (data.code == -1) {
                    alert(data.msg);
                    pullback();
                } else if (data.code == 1) {
                    alert("添加成功");
                    //重新拉去一次数据
                    pullback();
                }
            }
        })
    }
    add_item[0].getElementsByClassName("add-cancel-icon")[0].onclick = function () {
        pullback();
    }
}

//点击显示全部信息按钮
// $(function() {
//     $('.show-all-stu').click(function() {
//         var student = {
//             page: 1,
//             pageSize: 9,
//             grade: {    
//                 stuId: ,
//                 type: typevalue,
//                 pass: passvalue,
//                 group: groupvalue
//             }       
//         }
//         console.log(student)
//         $.ajax({
//             "url":  "http://ba2a0247.ngrok.io/grade/listGrade",
//             "method": "POST",
//             "headers": {
//             "Content-Type": "application/json"
//             },
//             "data": JSON.stringify(student),
//             "dataType": "json",
//             "async": true,
//             "crossDomain": true,
//             "success": function(data) {
//                 console.log(data);
//                 //记得做出错处理，不然要被人吊死
//                 if(data.data.data.length == 0 ) {
//                     alert("很抱歉没有查询到结果")
//                 } else if(data.data.data.length != 0) {
//                     showstuinf(data.data.data)
//                 }
//             }
//         })
//     })
// })


//点击选中框则打一个勾勾
function tick() {
    var tick = document.getElementsByClassName("selection-none")
    for (let i = 0; i < tick.length; i++) {
        tick[i].onclick = function () {
            if (this.getAttribute("class") == "selection-none haha") {
                this.setAttribute("class", "selection haha")
                storeid.gradeIds.push(this.parentNode.getAttribute("stu_Id"))
                savegraId.push(this.parentNode.getAttribute("stu_Id"));
            } else if (this.getAttribute("class") == "selection haha") {
                this.setAttribute("class", "selection-none haha")
                // storeid.gradeIds.pop(this.parentNode.getAttribute("stu_Id"))
                // savegraId.pop(this.parentNode.getAttribute("stu_Id"));
                for (var i = 0; i < savegraId.length; i++) {
                    if (savegraId[i] == this.parentNode.getAttribute("stu_Id")) {
                        savegraId.splice(i, 1)
                    }
                }
            }
            console.log(savegraId)
        }
    }
}



// Array.prototype.indexOf = function (val) {
//     for (var i = 0; i < this.length; i++) {
//         if (this[i] == val) return i;
//     }
//     return -1;
// };

// Array.prototype.remove = function (val) {
//     var index = this.indexOf(val);
//     if (index > -1) {
//         this.splice(index, 1);
//     }
// };

//根据保存打勾选择的学生学号，当换页的时候监听一下哪一些学生是被选中过的，有的话则重新打勾
function checkSelect(data) {
    var temp = savegraId
    console.log(temp)
    var tick1 = document.getElementsByClassName("haha")
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < temp.length; j++) {
            if (data[i].gradeId == temp[j]) {
                tick1[i].onclick();
                // storeid.gradeIds.remove(data[i].gradeId);
                // savegraId.remove(data[i].gradeId);
                break;
            }
        }
    }
}






//预览发送信息模板部分逻辑
previewMod.onclick = function () {
    document.documentElement.style.overflow = "hidden";
    console.log(add_container.getAttribute("style"))
    if (add_container.getAttribute("style") == "display: block;") {
        alert("请先关闭另外的弹出窗口")
    } else {
        previewCon.style.display = "block";
        var data = {
            page: 1,
            pageSize: 1000,
        }
        console.log(data)
        $.ajax({
            "url": serverUrl + "/template/listTemplate",
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
            },
            "data": JSON.stringify(data),
            "dataType": "json",
            "async": true,
            "crossDomain": true,
            xhrFields: {
                withCredentials: true
            },
            "success": function (data) {
                if (data.code == -1) {
                    alert(data.msg)
                    //如果请求失败则强制关闭预选框
                    previewCon.getElementsByClassName("preview-cancel")[0].onclick();
                } else {
                    console.log(data)
                    addmodel(data.data.data);
                    //绑定发送按钮点击发送请求事件
                    sendmodel()
                }
            }
        })
    }
}

function addmodel(data) {
    for (let i = 0; i < data.length; i++) {
        document.getElementsByClassName("model-list")[0].innerHTML += `<li model_num='${data[i].templateId}'>${data[i].name}</li>`
    }
    previewChoice(data)
}


//判断三个选择字段是否选择内容
function judgetype(group, type, pass, stu) {
    //获得四个选择容器的字段
    var groupvalue = document.getElementsByClassName("group-value")[0].value;
    var typevalue = document.getElementsByClassName("type-value")[0].value;
    var passvalue = document.getElementsByClassName("pass-value")[0].value;
    var stuid = search_con.getElementsByTagName("input")[0].value

    if (group == groupvalue && typevalue == type && passvalue == pass && stu == stuid) {
        if (groupvalue == "全部") {
            groupvalue = null;
        }
        if (typevalue == "全部") {
            typevalue = null;
        }
        if (passvalue == "全部") {
            passvalue = null;
        }
        if (stuid == "") {
            stuid = null
        }
        return {
            page: page,
            pageSize: 4,
            grade: {
                stuId: (stuid),
                type: (typevalue),
                pass: (passvalue),
                group: (groupvalue)
            }
        }
    } else {
        if (groupvalue == "全部") {
            groupvalue = null;
        }
        if (typevalue == "全部") {
            typevalue = null;
        }
        if (passvalue == "全部") {
            passvalue = null;
        }
        if (stuid == "") {
            stuid = null
        }
        return {
            page: 1,
            pageSize: 9,
            grade: {
                stuId: (stuid),
                type: (typevalue),
                pass: (passvalue),
                group: (groupvalue)
            }
        }
    }

}

//动态添加学生的信息。
function showstuinf(stuinf, delate) {
    //每一次添加都要把前面的字段全部清除
    list_container.innerHTML = "";

    if (delate == "no") {
        for (var i = 0; i < stuinf.length; i++) {
            var str = createstr(stuinf[i], i)
            list_container.innerHTML += str
        }
    } else if (delate != "no") {
        for (var i = 0; i < stuinf.length && i != delate; i++) {
            var str = createstr(stuinf[i], i)
            list_container.innerHTML += str
        }
    }


    //给每一个学生的信息添加点击事件，点开展示学生的报名信息
}

//插入学生信息的字符串
function createstr(stuinf, i) {
    if (i % 2 == 0) {
        var str = `

            <ul class="student-information" stu_id = "${(stuinf.gradeId)}">
                <input class="editor-input input-id" value="${(stuinf.stuId)}" disabled="disabled" maxlength="10">
                <input class="editor-input" value="${(stuinf.name)}" disabled="disabled" maxlength="10">
                <input class="editor-input" value="${(stuinf.sex)}" disabled="disabled" maxlength="2">
                <input class="editor-input" value="${(stuinf.grade)}" disabled="disabled" maxlength="4">
                <input class="editor-input remark" value="${(stuinf.remark)}" disabled="disabled">
                <input class="editor-input" value="${(stuinf.type)}" disabled="disabled" maxlength="4">
                <input class="editor-input" value="${(stuinf.pass)}" disabled="disabled" maxlength="3">
                <input class="editor-input" value="${(stuinf.group)}" disabled="disabled" maxlength="5">
                <div class="selection-container" stu_id="${(stuinf.gradeId)}">
                    <div class="selection-none haha" stu_id = "${(stuinf.stuId)}"></div>
                </div>
                <li class="editor-img">
                <img src = "image/edit.png"  class="editor-icon"  name="编辑">
                <img src = "image/delete.png"  class="cancel-icon" name="删除信息">
            </li>
        </ul>
          `
    } else if (i % 2 == 1) {
        var str = `
            <ul class="student-information student-change-color" stu_id = "${(stuinf.gradeId)}">
                <input class="editor-input input-id" value="${(stuinf.stuId)}" disabled="disabled" maxlength="10">
                <input class="editor-input" value="${(stuinf.name)}" disabled="disabled"  maxlength="10">
                <input class="editor-input" value="${(stuinf.sex)}" disabled="disabled" maxlength="2">
                <input class="editor-input" value="${(stuinf.grade)}" disabled="disabled" maxlength="4">
                <input class="editor-input" value="${(stuinf.remark)}" disabled="disabled">
                <input class="editor-input" value="${(stuinf.type)}" disabled="disabled"" maxlength="4">
                <input class="editor-input" value="${(stuinf.pass)}" disabled="disabled" maxlength="3">
                <input class="editor-input" value="${(stuinf.group)}" disabled="disabled"  maxlength="5">
                <div class="selection-container" style="background-color: #e7e3eb" stu_id="${(stuinf.gradeId)}">
                    <div class="selection-none haha" stu_id = "${(stuinf.stuId)}"></div>
                </div>
                <li class="editor-img">
                <img src = "image/edit.png"  class="editor-icon" name="编辑">
                <img src = "image/delete.png"  class="cancel-icon" name="删除信息">
            </li>
        </ul>`
    }

    return str
}

var pageList = document.getElementsByClassName('choosePage')[0];

// // 生成页数
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
        pageList.innerHTML += `<div class="page pageNow" onclick="pageClick()">${i}</div>`;
        //pageList.insertAdjacentHTML('beforeend', `<div class="page" onclick="pageClick()">${i}</div>`);
    } else if (i == "...") {
        pageList.innerHTML += `<div class="page noPage">${i}</div>`;
        //pageList.insertAdjacentHTML('beforeend', `<div class="page">${i}</div>`);
    } else {
        pageList.innerHTML += `<div class="page" onclick="pageClick()">${i}</div>`;
        //pageList.insertAdjacentHTML('beforeend', `<div class="page" onclick="pageClick()>${i}</div>`);
    }
}


var pageLi = document.getElementsByClassName("page");
function pageClick() {
    page = event.target.innerHTML;
    document.getElementsByClassName("student-information-container")[0].innerHTML = "";
    document.getElementsByClassName("choosePage")[0].innerHTML = "";
    //当点击换页码的时候需要重新拉去一次数据，同时把存放学生学号的数组清空
    pullback();
}


// 导入成绩信息
var importButton = document.getElementsByClassName("import")[0];
importButton.onchange = function () {
    var fileValue = event.target.files[0].name;
    var extName = fileValue.substring(fileValue.lastIndexOf(".")).toLowerCase();
    var AllImgExt = ".xls|.xlsx|";
    if (AllImgExt.indexOf(extName + "|") == -1) {
        errMsg = "该文件不允许上传。请上传" + AllImgExt + "类型的文件，当前文件类型为" + extName;
        alert(errMsg);
        return;
    }

    var file = event.target.files[0];
    console.log(file)
    file.type = 'multipart/form-data'
    var formdata = new FormData();
    formdata.append("file", file);
    console.log(formdata)
    console.log(formdata.get("file"))

    $.ajax({
        type: "POST",
        url: serverUrl + "/grade/importGrade",
        dataType: "json",
        data: formdata,
        contentType: false,
        processData: false,
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            console.log(data);
            if (data.code == 1) {
                alert("导入成功");
                location.reload();
            } else {
                alert(data.msg);
            }
        }
    })
}
