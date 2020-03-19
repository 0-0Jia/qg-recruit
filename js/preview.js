//获得选择模板的最大容器
var preview_con = document.getElementsByClassName("preview-model-input-container")[0];
//获得模板添加文本区域
var textarea = preview_con.getElementsByClassName("preview-model-input")[0];
//获得输入时间和地点的输入容器
var time_input = previewCon.getElementsByClassName("time")[0]
var location_input = previewCon.getElementsByClassName("place")[0]
let sendJudge = true;

function previewChoice(data) {
    var model = preview_con.getElementsByClassName("model-value")[0]
    var model_li = preview_con.getElementsByClassName("model-list")[0]
    previewCon.onclick = function () {
        if ((event.target.nodeName == "LI")) {
            model.innerHTML = event.target.innerText + `<img src='image/xiala.png' tle='hidden'></img>`;
            model.setAttribute("model_num", event.target.getAttribute("model_num"))
            var str = findmodel(data, event.target.getAttribute("model_num"))
            textarea.innerHTML = str;
            model_li.style.display = "none"
        } else if ((event.target.nodeName == "IMG")) {
            if (event.target.getAttribute("src") == "image/xiala.png") {
                model_li.style.display = "block"
                event.target.setAttribute("src", "image/shouqi.png")
            } else if (event.target.getAttribute("src") == "image/shouqi.png") {
                model_li.style.display = "none"
                event.target.setAttribute("src", "image/xiala.png")
            }
        }
    }
}

//根据模板的名字去寻找对应的模板内容
function findmodel(data, model_num) {
    for (var i = 0; i < data.length; i++) {
        console.log(data[i].name)
        if (data[i].templateId == model_num) {
            return data[i].message;
        }
    }
}

previewCon.getElementsByClassName("preview-cancel")[0].onclick = function () {
    var model = preview_con.getElementsByClassName("model-value")[0];

    document.documentElement.style.overflow = "scroll";
    previewCon.style.display = "none";
    //关闭掉要删除原来的数据
    model.innerHTML = "请选择一种模板<img src='image/xiala.png' tle='hidden'></img>"
    document.getElementsByClassName("model-list")[0].innerHTML = "";
    textarea.innerHTML = "";
    location_input.value = "";
    time_input.value = "";
}

function sendmodel() {
    var model = preview_con.getElementsByClassName("model-value")[0];
    previewCon.getElementsByClassName("send-btn")[0].onclick = function () {
        storeid.gradeIds = savegraId;
        storeid.time = (time_input.value);
        storeid.location = (location_input.value);
        storeid.templateId = (model.getAttribute("model_num"));
        var r = confirm("你确定要发送吗")
        if (r == true) {
            if (model.getAttribute("model_num") == 0) {
                alert("请选择一种模板")
            } else {
                console.log(storeid)
                $.ajax({
                    "url": serverUrl + "/notice/insertNotice",
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json",
                    },
                    "data": JSON.stringify(storeid),
                    "dataType": "json",
                    "async": true,
                    "crossDomain": true,
                    xhrFields: {
                        withCredentials: true
                    },
                    "success": function (data) {
                        if (data.code == -1) {
                            alert(data.msg)
                        } else {
                            alert(data.msg);
                            location.reload()
                        }
                    }
                })
            }
        }
    }
}
