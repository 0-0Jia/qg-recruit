var pageSize = 10;
var page = 1;
var groupPage = 1;
var student = document.getElementsByClassName("students");
var idInput = document.getElementsByClassName("idInput")[0];
var idSearch = document.getElementsByClassName("search")[0];
var pageList = document.getElementsByClassName('choosePage')[0];
var increaseTable = document.getElementsByClassName('increase-table')[0];
var exportSome = document.getElementsByClassName("export-some-table")[0];
var stuLi = document.getElementsByClassName("labels")[0].children;
var liCount = 2;
var arr = [];
var flag = false;


// 拉取数据
function dataAjax(pages, group) {
    var data = {
        page: pages,
        pageSize: pageSize,
        student: {
            group: group
        }
    }
    data = JSON.stringify(data);

    $.ajax({
        type: "POST",
        url: serverUrl + "/student/listStudent",
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
                createPage(data.data.page, pages);
                // 换页保证“√”显示不变
                arr.find(function (value) {
                    for (let i = 0; i < ulAll.getElementsByClassName("idLi").length; i++) {
                        console.log(ulAll.getElementsByClassName("idLi")[i].parentNode.getElementsByClassName("get-stu-div")[i])
                        if (value === ulAll.getElementsByClassName("idLi")[i].innerHTML) {
                            ulAll.getElementsByClassName("idLi")[i].parentNode.getElementsByClassName("get-stu-div")[0].innerHTML = "√";
                        }
                    }
                })
            } else if (data.code == 0) {
                window.location.href = "login.html";
            } else {
                alert(data.msg);
            }
        }
    })
}
dataAjax(page);

// 搜索单个学生
function stuAjax() {
    var data = {
        "stuId": idInput.value
    }
    data = JSON.stringify(data);
    console.log(data);

    $.ajax({
        type: "POST",
        url: serverUrl + "/student/selectStudent",
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
                oneUl(data.data)
            } else {
                alert(data.msg);
            }
        }
    })
}
idSearch.onclick = function () {
    pageList.innerHTML = "";
    stuAjax();
    var returnAll = document.getElementsByClassName("return")[0];
    returnAll.style.display = "block";
    returnAll.onclick = function () {
        location.reload();
    }
}

// 删除报名信息
function removeAjax() {
    var data = {
        "stuId": idInput.value
    }
    data = JSON.stringify(data);

    $.ajax({
        type: "POST",
        url: serverUrl + "/student/removeStudent",
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

// // 导出报名信息
// function exportAjax(data) {
//     console.log("请求的地址",serverUrl + "/student/exportStudent");
//     var xhr = new XMLHttpRequest();
//     xhr.open('POST', serverUrl + "/student/exportStudent", true);    //也可以使用POST方式，根据接口
//     xhr.setRequestHeader("Content-Type", "application/json");
//     xhr.setRequestHeader("crossDomain", true);
//     xhr.responseType = "blob";   //返回类型blob
//     xhr.onload = function () {
//         //定义请求完成的处理函数
//         var blob = this.response;
//         var reader = new FileReader();
//         reader.onload = function(event) {
//             console.log(reader.result);
//         }


//         if (this.status == 200) {
//             if (blob.size > 0) {
//                 alert("这是200");

//                 reader.readAsDataURL(blob);   // 转换为base64，可以直接放入a标签href
//                 // reader.onload = function (e) {
//                 //     // 转换完成，创建一个a标签用于下载
//                 //     var a = document.createElement('a');
//                 //     a.download = '报名信息.zip';
//                 //     a.href = e.target.result;
//                 //     $("body").append(a);    // 修复firefox中无法触发click
//                 //     a.click();
//                 //     $(a).remove();
//                 //     // window.location.reload();
//                 // }
//             }
//         }else if (this.status === 250) {
//             response = JSON.parse(response);
//             alert(response.message);
//         // } else if (this.status == 250) {
//         //     var response = binaryToStr(this);
//         //     response = JSON.parse(this);
//         //     if(response.code == -1) {
//         //         alert(response.msg);
//         //     }
//         }
//     };
//     xhr.send(data);
// }

// 导出报名信息
function exportAjax(data) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', serverUrl + "/student/exportStudent", true);    //也可以使用POST方式，根据接口
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("crossDomain", true);
    xhr.responseType = "blob"; 
    xhr.onload = function () {
        //定义请求完成的处理函数
        if (this.status === 200) {
            var blob = this.response;
            if (blob.size > 0) {
                var reader = new FileReader();
                reader.readAsDataURL(blob);   // 转换为base64，可以直接放入a标签href
                reader.onload = function (e) {
                    // 转换完成，创建一个a标签用于下载
                    var a = document.createElement('a');
                    a.download = '报名信息.zip';
                    a.href = e.target.result;
                    $("body").append(a);    // 修复firefox中无法触发click
                    a.click();
                    $(a).remove();
                    // window.location.reload();
                }
            }
        } else if (this.status === 250) {
            var reader = new FileReader();
            reader.readAsText(this.response)
            reader.onload = function (e) {
            var responseData = JSON.parse(e.currentTarget.result);
            console.log(responseData)
            alert(responseData.msg);
            }

        }
    };
    xhr.send(data);
}


// 增加表格行
function addUl(data) {
    let str = `
                <ul class="students">
                    <li class="nameLi">
                        <div class="get-stu-div">
                            
                        </div>
                        <span class="nameSpan">${data.name}</span>
                    </li>
                    <li class="idLi">${data.stuId}</li>
                    <li>${data.sex}</li>
                    <li>${data.group}</li>
                    <li>${data.grade}</li>
                    <li>${data.department}</li>
                    <li>${data.phone}</li>
                </ul>
    `;
    document.getElementsByClassName("trAll")[0].insertAdjacentHTML('beforeend', str);
}
// 搜索id增加单行
function oneUl(data) {
    let str = `
    <ul class="students">
        <li>${data.name}</li>
        <li>${data.stuId}</li>
        <li>${data.sex}</li>
        <li>${data.group}</li>
        <li>${data.grade}</li>
        <li>${data.department}</li>
        <li>${data.phone}</li>
    </ul>
`;
    document.getElementsByClassName("trAll")[0].innerHTML = str;
}
// 增加表格
function addTable(data) {
    if(data.experiences == "null"){
        data.experiences = " ";
    }
    if(data.description == "null"){
        data.description = " ";
    }
    if(data.oneThing == "null"){
        data.oneThing = " ";
    }
    if(data.plan == "null"){
        data.plan = " ";
    }

    let str = `
    <div class="con${liCount} stuTable">    
    <div class="edit">
        <span class="editTable changeTab">编辑</span>
        <span class="saveTable changeTab">保存</span>
        <span class="removeTable changeTab">删除</span>
        <span class="exportTable changeTab">导出</span>
    </div>           
    <table cellspacing="6px">
        <tr>
            <td class="changeCol">姓名</td>
            <td><input value="${data.name}" disabled="disabled" placeholder="15位以内（包含15位）"></td>
            <td class="changeCol">性别</td>
            <td><input value="${data.sex}" disabled="disabled" placeholder="请输入男/女"></td>
        </tr>
        <tr>
            <td class="changeCol">年龄</td>
            <td><input value="${data.age}" disabled="disabled" placeholder="年龄在15-24"></td>
            <td class="changeCol">宿舍</td>
            <td><input value="${data.dormitory}" disabled="disabled"></td>
        </tr>
        <tr>
            <td class="changeCol">QQ</td>
            <td><input value="${data.qq}" disabled="disabled"></td>
            <td class="changeCol">邮箱</td>
            <td><input value="${data.email}" disabled="disabled"></td>
        </tr>
        <tr>
            <td class="changeCol">手机</td>
            <td><input value="${data.phone}" disabled="disabled"></td>
            <td class="changeCol">学号</td>
            <td><input value="${data.stuId}" disabled="disabled"></td>
        </tr>
        <tr>
            <td class="changeCol">年级</td>
            <td><input value="${data.grade}" disabled="disabled"></td>
            <td class="changeCol">专业班级</td>
            <td><input value="${data.department}" disabled="disabled" placeholder="24字以内"></td>
        </tr>
        <tr>
            <td class="changeCol">班级职务</td>
            <td><input value="${data.duty}" disabled="disabled"></td>
            <td class="changeCol">挂科</td>
            <td><input value="${data.fail}" disabled="disabled" placeholder="是为true， 否为false"></td>
        </tr>
        <tr>
            <td class="changeCol">绩点（大一上学期）</td>
            <td><input value="${data.point}" disabled="disabled" placeholder="最高为5.0"></td>
            <td class="changeCol">上学期班级排名</td>
            <td><input value="${data.rank}" disabled="disabled"></td>
        </tr>
        <tr>
            <td class="changeCol">C理论成绩</td>
            <td><input value="${data.cTheory}" disabled="disabled" placeholder="百分制，小数位为5或者0"></td>
            <td class="changeCol">C实验成绩</td>
            <td><input value="${data.cExperiment}" disabled="disabled" placeholder="百分制，小数位为5或者0"></td>
        </tr>
        <tr>
            <td class="changeCol">英语（1）成绩</td>
            <td><input value="${data.english}" disabled="disabled"></td>
        </tr>
        <tr>
            <td class="changeCol">应征方向</td>
            <td>            
            <div class="groups choose-sth">
            <input class="group-values" type="text" value="${data.group}" disabled="disabled">
            <img src="image/xiala.png" tle="hidden">
            <ul class="group-lists" style="display: none;">
                <li>前端组</li>
                <li>后台组</li>
                <li>移动组</li>
                <li>数据挖掘组</li>
                <li>嵌入式组</li>
                <li>图形组</li>
                <li>设计组</li>
            </ul>
        </div>
        </td>
            <td class="changeCol">是否服从调剂</td>
            <td><input value="${data.adjust}" disabled="disabled" placeholder="是为true，否为flase"></td>
        </tr>
        <tr>
            <td class="changeCol">特长、爱好</td>
            <td colspan="3"><input value="${data.hobby}" disabled="disabled" placeholder="40字以内"></td>
        </tr>
        <tr>
            <td class="changeCol">座右铭</td>
            <td colspan="3"><input value="${data.motto}" disabled="disabled" placeholder="22字以内"></td>
        </tr>
        <tr>
            <td class="changeCol" colspan="4">参加其它学生科技团队、普通社团情况说明</td>
        </tr>
        <tr>
            <td colspan="4"><textarea disabled="disabled" placeholder="50字以内">${data.explain}</textarea></td>
        </tr>
        <tr>
            <td class="changeCol" colspan="4">是否组队报名，是则填写同组别同学姓名（3人及3人以内）</td>
        </tr>
        <tr>
            <td colspan="4"><textarea disabled="disabled" placeholder="是则填是，并加上队友名称，否则为否。20字以内">${data.organize}</textarea></td>
        </tr>
        <tr>
            <td class="changeCol" colspan="4">奖惩情况和实践经历（社会实践或计算机相关技术学习掌握情况）</td>
        </tr>
        <tr>
            <td colspan="4"><textarea disabled="disabled" placeholder="20字以内（非必填）">${data.experiences}</textarea></td>
        </tr>
        <tr>
            <td class="changeCol" colspan="4">自我评价</td>
        </tr>
        <tr>
            <td colspan="4"><textarea disabled="disabled" placeholder="190字以内（非必填）">${data.description}</textarea></td>
        </tr>
        <tr>
            <td class="changeCol" colspan="4">简述能体现以下四个方面的个人事件：善于协作、刻苦努力、甘于奉献、持之以恒</td>
        </tr>
        <tr>
            <td colspan="4"><textarea disabled="disabled" placeholder="（非必填）">${data.oneThing}</textarea></td>
        </tr>
        <tr>
            <td class="changeCol" colspan="4">请说一下大学四年的个人规划以及为什么希望加入QG工作室</td>
        </tr>
        <tr>
            <td colspan="4"><textarea disabled="disabled" placeholder="220字以内（非必填）">${data.plan}</textarea></td>
        </tr>
    </table>
</div>
    `;
    document.getElementsByClassName("con1")[0].insertAdjacentHTML('afterend', str);
}

// 页数格式选择与创建
function createPage(pages, pageCurent) {
    pageList.innerHTML = "";
    if (pages <= 9) {
        for (var i = 1; i <= pages; i++) {
            creatOnePage(i, pageCurent);
        }
    }
    else if (page <= 5) {
        for (var i = 1; i <= 7; i++) {
            creatOnePage(i, pageCurent);
        }
        creatOnePage("...");
        creatOnePage(pages);
    }
    else if (page >= pages - 4) {
        creatOnePage(1);
        creatOnePage("...");
        for (var i = pages - 6; i <= pages; i++) {
            creatOnePage(i, pageCurent);
        }
    }
    else {
        creatOnePage(1);
        creatOnePage("...");
        for (var i = pages - 2; i <= pages + 2; i++) {
            creatOnePage(i, pageCurent);
        }
        creatOnePage("...");
        creatOnePage(pages);
    }
}
// 创建一页
function creatOnePage(i, pageCurent) {
    if (i == pageCurent) {
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
    let groupValue = document.getElementsByClassName("group-value")[0];

    if (event.target && event.target.className == "page") {
        if (event.target.innerHTML != "...") {
            document.getElementsByClassName("trAll")[0].innerHTML = "";
            if (groupValue.value == "全部") {
                page = event.target.innerHTML;
                dataAjax(page);
            } else {
                groupPage = event.target.innerHTML;
                dataAjax(groupPage, groupValue.value);
            }
        } else {
            return false;
        }
    }
}

// 板块选择
function selectStu() {
    var stuLiNow = event.target;
    console.log(stuLiNow.title)
    for (var i = 0; i < stuLi.length; i++) {
        stuLi[i].style.background = "#e7e3eb";
        document.getElementsByClassName(('con' + (i + 1)))[0].style.display = "none";
    }
    stuLiNow.style.background = "white";
    document.getElementsByClassName("con" + (stuLiNow.title))[0].style.display = "block";
}

// 搜索单个学生信息
function stuMesAjax() {
    var data = {
        "stuId": idInput.value
    }
    data = JSON.stringify(data);
    console.log(data);

    $.ajax({
        type: "POST",
        url: serverUrl + "/student/selectStudent",
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
                addTable(data.data);
                editOne();
            } else {
                alert(data.msg);
            }
        }
    })
}

// 显示单个学生的详细信息
function chooseOne() {
    var choose = event.target;
    console.log(choose.parentNode)
    var data = {
        "stuId": choose.parentNode.children[1].innerHTML
    }
    data = JSON.stringify(data);
    console.log(data);

    $.ajax({
        type: "POST",
        url: serverUrl + "/student/selectStudent",
        dataType: "json",
        contentType: "application/json",
        data: data,
        async: false,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            console.log(data);
            if (data.code == 1) {
                addTable(data.data);
            } else {
                alert(data.msg);
            }
        }
    })
    stuLi[0].style.background = "#e7e3eb";
    document.getElementsByClassName(('con1'))[0].style.display = "none";
    stuLi[1].style.background = "white";
    document.getElementsByClassName("con2")[0].style.display = "block";

    editOne();

}

// 对单个学生详细信息进行操作
function editOne() {
    var editTable = document.getElementsByClassName("editTable")[0];
    var saveTable = document.getElementsByClassName("saveTable")[0];
    var exportTable = document.getElementsByClassName("exportTable")[0];
    var removeTable = document.getElementsByClassName("removeTable")[0];
    var tableInput = document.getElementsByClassName("stuTable")[0].getElementsByTagName("input");
    var tableTextarea = document.getElementsByClassName("stuTable")[0].getElementsByTagName("textarea");

    editTable.onclick = function () {
        for (var i = 0; i < tableInput.length; i++) {
            if(i != 17) {
                tableInput[i].removeAttribute("disabled");
            }
            tableInput[i].style.color = "black";
        }
        for (var j = 0; j < tableTextarea.length; j++) {
            tableTextarea[j].removeAttribute("disabled");
            tableTextarea[j].style.color = "black";
        }
        flag = true;
        chooseSth();
    }

    saveTable.onclick = function () {
        changeOne();
        for (var i = 0; i < tableInput.length; i++) {
            tableInput[i].setAttribute("disabled", "disabled");
            tableInput[i].style.color = "gray";
        }
        for (var j = 0; j < tableTextarea.length; j++) {
            tableTextarea[j].setAttribute("disabled", "disabled");
            tableTextarea[j].style.color = "gary";
        }
        flag = false;
        chooseSth();
    }
    removeTable.onclick = function () {
        if (confirm("你真的要把我删除嘛？(；´д｀)ゞ")) {
            removeOneAjax();
            location.reload();
        } else {
            return false;
        }
    }
    exportTable.onclick = function () {
        var tableInput = document.getElementsByClassName("stuTable")[0].getElementsByTagName("input");
        var data = {
            'stuIds': [
                tableInput[7].value,
            ]
        }
        data = JSON.stringify(data);
        exportAjax(data);
    }
}

// 修改单个学生报名信息ajax
function changeOne() {
    var tableInput = document.getElementsByClassName("stuTable")[0].getElementsByTagName("input");
    var tableTextarea = document.getElementsByClassName("stuTable")[0].getElementsByTagName("textarea");

    if (!isNumber(tableInput[2].value)) {
        alert("年龄输入应该为数字");
        return false;
    }
    if (!isNumber(tableInput[12].value)) {
        alert("绩点输入应该为数字");
        return false;
    }
    if (!isNumber(tableInput[13].value)) {
        alert("排名输入应该为数字");
        return false;
    }
    if (!isNumber(tableInput[14].value) || !isNumber(tableInput[15].value) || !isNumber(tableInput[16].value)) {
        alert("成绩输入应该为数字");
        return false;
    }
    if (!isNumber(tableInput[7].value)) {
        alert("学号输入应该为数字");
        return false;
    }

    if (tableInput[11].value != "true" && tableInput[11].value != "false") {
        alert("挂科一栏请填写true（有）或者false（无）");
        return false;
    }
    if (tableInput[18].value != "true" && tableInput[18].value != "false") {
        alert("是否服从调剂一栏请填写true（有）或者false（无）");
        return false;
    }

    var data = {
        name: (tableInput[0].value),
        sex: (tableInput[1].value),
        age: (tableInput[2].value),
        dormitory: (tableInput[3].value),
        qq: (tableInput[4].value),
        email: (tableInput[5].value),
        phone: (tableInput[6].value),
        stuId: (tableInput[7].value),
        grade: (tableInput[8].value),
        department: (tableInput[9].value),
        duty: (tableInput[10].value),
        fail: (tableInput[11].value),
        point: (tableInput[12].value),
        rank: (tableInput[13].value),
        cTheory: (tableInput[14].value),
        cExperiment: (tableInput[15].value),
        english: (tableInput[16].value),
        group: (tableInput[17].value),
        adjust: (tableInput[18].value),
        hobby: (tableInput[19].value),
        motto: (tableInput[20].value),
        organize: (tableTextarea[1].value),
        experiences: (tableTextarea[2].value),
        description: (tableTextarea[3].value),
        oneThing: (tableTextarea[4].value),
        plan: (tableTextarea[5].value),
        explain: (tableTextarea[0].value),
    }

    // var data = "{
    // "stuId": "学号",
    // "name\":\"姓名(15位以内（包含15位）)\",
    // "phone\":\"手机\",
    // "sex\":\"性别\",
    // "grade\":\"年级\",
    // "department\":\"专业班级(24字以内)\",
    // "point\":\"绩点(最高为5.0)\",
    // "dormitory\":\"宿舍\",
    // "qq\":\"qq\",
    // "group\":\"组别\",
    // "email\":\"邮箱\",
    // "age\":\"年龄(年龄在15-24)\",
    // "rank\":\"上学期排名\",
    // "duty\":\"职务\",
    // "fail\":\"是否挂科(是为true， 否为false)\",
    // "cTheory\":\"C语言理论成绩(百分制，小数位为5或者0.如：90.5.如出现90.3则为错误，后台限制)\",
    // "cExperiment\":\"C语言实验成绩(百分制，小数位为5或者0.如：90.5.如出现90.3则为错误，后台限制)\",
    // "english\":\"英语成绩\",
    // "hobby\":\"爱好(40字以内)\",
    // "motto\":\"座右铭(22字以内)\",
    // "organize\":\"是否组队报名(是则填是，并加上队友名称，否则为否   20字以内)\",
    // "experiences\":\"奖惩情况和实践经历(社会实践或计算机相关技术学习掌握情况(220字以内（非必填）)\",
    // "description\":\"自我评价(190字以内（非必填）)\",
    // "oneThing\":\"简述能体现你四个方面的一件事（1）善于协作（2）刻苦努力（3）()甘于奉献（4）持之以恒220字以内（非必填）\",
    // "plan\":\"个人规划和为什么加入qg工作室（220字以内（非必填））\",
    // "explain\":\"参加其他学生科技团队/社团的情况说明（50字以内）\",
    // "adjust\":\"是否服从调剂（是为true，否为flase）\"}"
    data = JSON.stringify(data);
    console.log(data);

    $.ajax({
        type: "POST",
        url: serverUrl + "/student/updateStudent",
        dataType: "json",
        contentType: "application/json",
        data: data,
        async: false,
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            console.log(data);
            if (data.code == 1) {
                alert("修改成功");
                location.reload();
            } else {
                alert(data.msg);
            }
        }
    })
}


// 删除单个学生报名信息
function removeOneAjax() {
    var tableInput = document.getElementsByClassName("stuTable")[0].getElementsByTagName("input");
    var data = {
        "stuId": tableInput[7].value
    }
    data = JSON.stringify(data);
    console.log(data);

    $.ajax({
        type: "POST",
        url: serverUrl + "/student/removeStudent",
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
                alert("删除成功啦~")
            } else {
                alert(data.msg);
            }
        }
    })
}


// 增加表格
function addOneTable() {
    let str = `
    <div class="con${liCount} stuTable">    
    <div class="edit">
        <span class="saveTable changeTab">保存</span>
    </div>           
    <table cellspacing="6px">
        <tr>
            <td class="changeCol">姓名</td>
            <td><input value="" placeholder="15位以内（包含15位）"></td>
            <td class="changeCol">性别</td>
            <td>
            <div class="sex choose-sth">
            <input class="sex-value" type="text" value="" disabled="disabled" readonly="readonly">
            <img src="image/xiala.png" tle="hidden">
            <ul class="sex-list" style="display: none;">
                <li>男</li>
                <li>女</li>
            </ul>
            </div>
            </td>
        </tr>
        <tr>
            <td class="changeCol">年龄</td>
            <td><input value="" placeholder="年龄在15-24"></td>
            <td class="changeCol">宿舍</td>
            <td><input value=""></td>
        </tr>
        <tr>
            <td class="changeCol">QQ</td>
            <td><input value=""></td>
            <td class="changeCol">邮箱</td>
            <td><input value=""></td>
        </tr>
        <tr>
            <td class="changeCol">手机</td>
            <td><input value=""></td>
            <td class="changeCol">学号</td>
            <td><input value=""></td>
        </tr>
        <tr>
            <td class="changeCol">年级</td>
            <td><input value=""></td>
            <td class="changeCol">专业班级</td>
            <td><input value="" placeholder="24字以内"></td>
        </tr>
        <tr>
            <td class="changeCol">班级职务</td>
            <td><input value=""></td>
            <td class="changeCol">挂科</td>
            <td>
                <div class="fail choose-sth">
                <input class="fail-value" type="text" value="" disabled="disabled" readonly="readonly">
                <img src="image/xiala.png" tle="hidden">
                <ul class="fail-list" style="display: none;">
                    <li>是</li>
                    <li>否</li>
                </ul>
                </div>
            </td>
        </tr>
        <tr>
            <td class="changeCol">绩点（大一上学期）</td>
            <td><input value="" placeholder="最高为5.0"></td>
            <td class="changeCol">上学期班级排名</td>
            <td><input value="" placeholder="不清楚填0"></td>
        </tr>
        <tr>
            <td class="changeCol">C理论成绩</td>
            <td><input value="" placeholder="百分制，小数位为5或者0"></td>
            <td class="changeCol">C实验成绩</td>
            <td><input value="" placeholder="百分制，小数位为5或者0"></td>
        </tr>
        <tr>
            <td class="changeCol">英语（1）成绩</td>
            <td><input value="" placeholder="百分制，小数位为5或者0"></td>
        </tr>
        <tr>
            <td class="changeCol">应征方向</td>
            <td>            
            <div class="groups choose-sth">
            <input class="group-values" type="text" value="" readonly="readonly">
            <img src="image/xiala.png" tle="hidden">
            <ul class="group-lists" style="display: none;">
                <li>前端组</li>
                <li>后台组</li>
                <li>移动组</li>
                <li>数据挖掘组</li>
                <li>嵌入式组</li>
                <li>图形组</li>
                <li>设计组</li>
            </ul>
        </div>
        </td>
            <td class="changeCol">是否服从调剂</td>
            <td>
            <div class="adjust choose-sth">
            <input class="adjust-value" type="text" value="" disabled="disabled" readonly="readonly">
            <img src="image/xiala.png" tle="hidden">
            <ul class="adjust-list" style="display: none;">
                <li>是</li>
                <li>否</li>
            </ul>
            </div>
            </td>
        </tr>
        <tr>
            <td class="changeCol">特长、爱好</td>
            <td colspan="3"><input value="" placeholder="40字以内"></td>
        </tr>
        <tr>
            <td class="changeCol">座右铭</td>
            <td colspan="3"><input value="" placeholder="22字以内"></td>
        </tr>
        <tr>
            <td class="changeCol" colspan="4">参加其它学生科技团队、普通社团情况说明</td>
        </tr>
        <tr>
            <td colspan="4"><textarea placeholder="50字以内"></textarea></td>
        </tr>
        <tr>
            <td class="changeCol" colspan="4">是否组队报名，是则填写同组别同学姓名（3人及3人以内）</td>
        </tr>
        <tr>
            <td colspan="4"><textarea placeholder="是则填是，并加上队友名称，否则为否。20字以内"></textarea></td>
        </tr>
        <tr>
            <td class="changeCol" colspan="4">奖惩情况和实践经历（社会实践或计算机相关技术学习掌握情况）</td>
        </tr>
        <tr>
            <td colspan="4"><textarea placeholder="20字以内（非必填）"></textarea></td>
        </tr>
        <tr>
            <td class="changeCol" colspan="4">自我评价</td>
        </tr>
        <tr>
            <td colspan="4"><textarea placeholder="190字以内（非必填）"></textarea></td>
        </tr>
        <tr>
            <td class="changeCol" colspan="4">简述能体现以下四个方面的个人事件：善于协作、刻苦努力、甘于奉献、持之以恒</td>
        </tr>
        <tr>
            <td colspan="4"><textarea placeholder="（非必填）"></textarea></td>
        </tr>
        <tr>
            <td class="changeCol" colspan="4">请说一下大学四年的个人规划以及为什么希望加入QG工作室</td>
        </tr>
        <tr>
            <td colspan="4"><textarea placeholder="220字以内（非必填）"></textarea></td>
        </tr>
    </table>
</div>
    `;
    document.getElementsByClassName("con1")[0].insertAdjacentHTML('afterend', str);
}

// 增加单个学生报名信息
function addOneAjax() {
    var tableInput = document.getElementsByClassName("stuTable")[0].getElementsByTagName("input");
    var tableTextarea = document.getElementsByClassName("stuTable")[0].getElementsByTagName("textarea");

    if (!isNumber(tableInput[2].value)) {
        alert("年龄输入应该为数字");
        return false;
    }
    if (!isNumber(tableInput[12].value)) {
        alert("绩点输入应该为数字");
        return false;
    }
    if (!isNumber(tableInput[13].value)) {
        alert("排名输入应该为数字");
        return false;
    }
    if (!isNumber(tableInput[14].value) || !isNumber(tableInput[15].value) || !isNumber(tableInput[16].value)) {
        alert("成绩输入应该为数字");
        return false;
    }
    if (!isNumber(tableInput[7].value)) {
        alert("学号输入应该为数字");
        return false;
    }

    var data = {
        name: (tableInput[0].value),
        sex: (tableInput[1].value),
        age: (tableInput[2].value),
        dormitory: (tableInput[3].value),
        qq: (tableInput[4].value),
        email: (tableInput[5].value),
        phone: (tableInput[6].value),
        stuId: (tableInput[7].value),
        grade: (tableInput[8].value),
        department: (tableInput[9].value),
        duty: (tableInput[10].value),
        fail: (tableInput[11].value == "是")? true: false,
        point: (tableInput[12].value),
        rank: (tableInput[13].value),
        cTheory: (tableInput[14].value),
        cExperiment: (tableInput[15].value),
        english: (tableInput[16].value),
        group: (tableInput[17].value),
        adjust: (tableInput[18].value == "是")? true: false,
        hobby: (tableInput[19].value),
        motto: (tableInput[20].value),
        organize: (tableTextarea[1].value),
        experiences: (tableTextarea[2].value),
        description: (tableTextarea[3].value),
        oneThing: (tableTextarea[4].value),
        plan: (tableTextarea[5].value),
        explain: (tableTextarea[0].value),
    }
    data = JSON.stringify(data);
    console.log(data);

    $.ajax({
        type: "POST",
        url: serverUrl + "/recruit",
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
                alert("添加成功啦~");
                location.reload();
            } else {
                alert(data.msg);
            }
        }
    })
}

// 绑定增加表格事件
increaseTable.onclick = function () {
    addOneTable();
    flag = true;
    chooseSth();

    var tableInput = document.getElementsByClassName("stuTable")[0].getElementsByTagName("input");
    var tableTextarea = document.getElementsByClassName("stuTable")[0].getElementsByTagName("textarea");

    stuLi[0].style.background = "#e7e3eb";
    document.getElementsByClassName(('con1'))[0].style.display = "none";
    stuLi[1].style.background = "white";
    document.getElementsByClassName("con2")[0].style.display = "block";
    for (var i = 0; i < tableInput.length; i++) {
        tableInput[i].style.color = "black";
    }
    for (var j = 0; j < tableTextarea.length; j++) {
        tableTextarea[j].style.color = "black";
    }

    var saveTable = document.getElementsByClassName("saveTable")[0];

    saveTable.onclick = function () {
        addOneAjax();
    }

}
// 绑定选择导出事件
exportSome.onclick = function () {
    console.log(arr);
    if (!arr.length) {
        alert("请选择学生导出报名信息");
    } else {
        var data = {
            'stuIds': arr
        }
        data = JSON.stringify(data);
        exportAjax(data);
    }
}
// 勾选事件和显示单个学生报名信息的绑定
var ulAll = document.getElementsByClassName("ulAll")[0];
ulAll.onclick = function () {
    if (event.target.getAttribute("class") == "get-stu-div") {
        if (event.target.innerHTML == "√") {
            event.target.innerHTML = " ";
            arr.pop();
        } else {
            event.target.innerHTML = "√";
            var getStuId = event.target.parentNode.parentNode.getElementsByTagName("li")[1].innerHTML;
            arr.push(getStuId);
        }
    } else if (event.target && event.target.nodeName == "LI" && event.target.parentNode.className != "th" && event.target.getAttribute("class") != "nameLi") {
        chooseOne();
    }
}

document.getElementsByClassName("labels")[0].onclick = function () {
    if (event.target && event.target.nodeName == "LI") {
        selectStu();
    }
}

// 报名表选择
function chooseSth() {
    var groupCons = document.getElementsByClassName("groups")[0];
    var sexCon = document.getElementsByClassName("sex")[0];
    var failCon = document.getElementsByClassName("fail")[0];
    var adjustCon = document.getElementsByClassName("adjust")[0];

    chooseSthOne(groupCons);
    chooseSthOne(sexCon);
    chooseSthOne(failCon);
    chooseSthOne(adjustCon);


}

function chooseSthOne(con) {
    var groupValues = con.getElementsByTagName("input")[0];
    var groupShows = con.getElementsByTagName("img")[0];
    var groupLists = con.getElementsByTagName("ul")[0];

    groupLists.onclick = function () {
        if (event.target && event.target.nodeName == "LI") {
            groupValues.value = event.target.innerText;
        }
    }
    if (flag) {
        con.onclick = function () {
            if (groupShows.getAttribute("tle") == "show") {
                groupShows.setAttribute("tle", "hidden");
                groupLists.style.display = "none";
                groupShows.setAttribute("src", "image/xiala.png");
            } else {
                groupShows.setAttribute("tle", "show");
                groupLists.style.display = "block";
                groupShows.setAttribute("src", "image/shouqi.png");
            }
        }
    } else {
        con.onclick = function () {};
        groupShows.setAttribute("tle", "hidden");
        groupLists.style.display = "none";
        groupShows.setAttribute("src", "image/xiala.png");
    }
}