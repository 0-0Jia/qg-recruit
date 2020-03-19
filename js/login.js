var serverUrl = "https://manager.qgailab.com/api";
var judeg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$)^.{6,20}$/;

$(function () {
    var storage = window.localStorage;
    if ("yes" == storage["isstorename"]) {
        $("#remembrMe").attr("checked", true);
        $("#username").val(storage["username"]);
        $("#password").val($.base64.decode(storage["password"]));
    }
    $("#username").focus(function () {
        $(".judge")[0].innerHTML = "必须为数字 字母 特殊符号中最少两种(6-20)";
    })
    $("#password").focus(function () {
        $(".judge")[1].innerHTML = "必须为数字 字母 特殊符号中最少两种(6-20)";
    })
    $("#username").blur(function () {
        $(".judge")[0].innerHTML = "";
    })
    $("#password").blur(function () {
        $(".judge")[1].innerHTML = "";
    })
    $("#button").click(function () {
        var data = {
            userName: $("#username").val(),
            password: $("#password").val()
        };
        if (!isNotNullTrim(data.userName)) {
            $(".judge")[0].innerHTML = "<font>输入不能为空</font>";
            return;
        }
        if (!isNotNullTrim(data.password)) {
            $(".judge")[1].innerHTML = "<font>输入不能为空</font>";
            return;
        }
        if (!judeg.test($("input:eq(0)").val())) {
            $(".judge")[0].innerHTML = "<font>用户名格式不正确</font>";
            return;
        }
        if (!judeg.test($("input:eq(1)").val())) {
            $(".judge")[1].innerHTML = "<font>密码格式不正确</font>";
            return;
        }
        if ($("#rememberMe").is(":checked")) {
            storage["username"] = $("#username").val();
            storage["password"] = $.base64.encode($("#password").val());
            storage["isstorename"] = "yes";
        } else {
            storage["username"] = "";
            storage["isstorename"] = "no";
        }
        $.ajax({
            type: "POST",
            url: serverUrl + "/user/login",
            dataType: "json",
            contentType: "application/json",
            xhrFields: {
                withCredentials: true
            },
            data: JSON.stringify(data),
            success: function (data) {
                console.log(data);
                if (data.code == 1) {
                    alert(data.msg);
                    document.cookie = "path=/";   
                    document.cookie = "expires=7";                  
                    window.location.href = "index.html";
                } else {
                    alert(data.msg);
                    $("input").val("");
                }
            }
        })
    });
    $("body").bind("keydown", function (e) {
        var theEvent = e || window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code == 13) {
            $("button:eq(0)").click();
        }
    });
});
function isNotNullTrim(source) {
    if (source != null && source != undefined && source != 'undefined' && $.trim(source) != "")
        return true;
    return false;
}
