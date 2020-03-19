var serverUrl = "https://manager.qgailab.com/api";
var exit = document.getElementsByClassName("exit")[0];

// 退出登录
exit.onclick = function() {
    if(confirm("确定要退出吗？")) {
    var data = "{}";
    data = JSON.stringify(data);
    console.log(data);

    $.ajax({
        type: "POST",
        url: serverUrl + "/user/logout",
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
                window.location.href = "login.html";
            } else {
                alert(data.msg);
            }
        }
    })
    }else {
        return false;
    }
}


/**
* 校验只要是数字（包含正负整数，0以及正负浮点数）就返回true
**/

function isNumber(val){
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }

}
// var pic = document.getElementsByClassName("pic")[0];
// //深色
// var getRandomColor = function() {
// 	return '#' +
// 		(function(color) {
// 			return(color += '0123401234abcabc' [Math.floor(Math.random() * 16)]) &&
// 				(color.length == 6) ? color : arguments.callee(color);
// 		})('');
// }
// var color = getRandomColor();
// console.log(color);
// console.log(pic)
// pic.style.background = color;
// // //浅色
// // var getRandomColorT = function() {
// // 	return '#' +
// // 		(function(color) {
// // 			return(color += '5678956789defdef' [Math.floor(Math.random() * 16)]) &&
// // 				(color.length == 6) ? color : arguments.callee(color);
// // 		})('');
// // }

// // 过滤html标签
// function filterHTMLTag(msg) {
//     if(msg != null) {
//         var msg = msg.replace(/<\/?[^>]*>/g, ''); //去除HTML Tag
//         msg = msg.replace(/[|]*\n/, '') //去除行尾空格
//         msg = msg.replace(/&npsp;/ig, ''); //去掉npsp
//         return msg;
//     }
// }