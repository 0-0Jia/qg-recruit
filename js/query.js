let groupCon = document.getElementsByClassName("group")[0];
let groupValue = groupCon.getElementsByClassName("group-value")[0];
let groupShow = groupCon.getElementsByTagName("img")[0];
let groupList = groupCon.getElementsByClassName("group-list")[0];

groupList.onclick = function () {
    if (event.target && event.target.nodeName == "LI") {
        groupValue.value = event.target.innerText;

        document.getElementsByClassName("trAll")[0].innerHTML = "";
        if(groupValue.value == "全部") {
            dataAjax(page);
        }else {
            dataAjax(groupPage, groupValue.value);
        }
    }
}
groupCon.onclick = function () {
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



