/**
 * Created by Revan on 2017/10/30.
 */

var relateType;
var relateDepartment;

/*初始控件*/
var pageNumber = 1;//查看页面
var pageSize = 3; //分页

function getRelatedInstanceList(type,department) {
    createSelectTable();
    type = createRelateTypeSelect(type,department);
    getRelateInstanceByType(type,department);
}

function searchInstanceFunc(page) {
    searchInstance(page);
}

function searchInstance(page) {
    var data = {
        type: relateType,
        department: relateDepartment,
        page: page,
        size: pageSize
    };
    var callBack = function (data) {
        var content = data.list;
        var count = data.count;
        showInstanceList("relateTableDetail",content,count,["选择"],pageSize,page,"searchInstanceFunc");
        clickOnSelectRelate(relateType);
    };
    connectToServer("GET","/ws/process/user/associate/search/app",data,false,callBack);
}

function getRelateInstanceByType(type,department) {
    relateType = type;
    relateDepartment = department;
    searchInstanceFunc(pageNumber);
}


function getRelatedInstanceDetail(selectList, type, department, callBack) {
    var data = {
        instanceID: JSON.stringify(selectList),
        type: type,
        department: department
    };
    connectToServer("GET","/ws/process/associate",data,false,callBack);
}

function createRelateTypeSelect(type,department) {
    switch (type){
    case "MMM":
        var cRelateTypeSelect = $("#relateTypeSelect");
        cRelateTypeSelect.append("<a id='selectMMA' href='javascript:void(0);' class='relateTypeSelect' data-type='MMA'>会议预约</a>");
        cRelateTypeSelect.append("<a id='selectMMN' href='javascript:void(0);' class='relateTypeNormal' data-type='MMN'>转发会议通知</a>");
        type = "MMA";
        break;
    }
    $("#selectMMA").click(function () {
        $("#selectMMN").removeClass("relateTypeSelect");
        $("#selectMMN").addClass("relateTypeNormal");
        $("#selectMMA").removeClass("relateTypeNormal");
        $("#selectMMA").addClass("relateTypeSelect");
        getRelateInstanceByType($(this).attr("data-type"),department,1);
    });
    $("#selectMMN").click(function () {
        $("#selectMMA").removeClass("relateTypeSelect");
        $("#selectMMA").addClass("relateTypeNormal");
        $("#selectMMN").removeClass("relateTypeNormal");
        $("#selectMMN").addClass("relateTypeSelect");
        getRelateInstanceByType($(this).attr("data-type"),department,1);
    });
    return type;
}

function createSelectTable() {
    //获取页面的高度和宽度,可视区域高度
    var sWidth = document.documentElement.scrollWidth;
    var sHeight = document.documentElement.scrollHeight;
    var wHeight = document.documentElement.clientHeight;
    //创建遮罩层
    var oMask = document.createElement("div");
    oMask.id = "maskHistory";
    oMask.style.height = sHeight + "px";
    oMask.style.width = sWidth + "px";
    document.body.appendChild(oMask);
    //创建显示框
    var oShow = document.createElement("div");
    oShow.id = "relateTableSelect";
    oShow.innerHTML = "<div id='relateTypeSelect'></div><div id='relateTableDetail'></div>";
    document.body.appendChild(oShow);
    var dHeight = oShow.offsetHeight;
    var dWidth = oShow.offsetWidth;
    oShow.style.left = sWidth / 2 - dWidth / 2 + "px";
    oShow.style.top = wHeight / 2 - dHeight / 2 + "px";
    //点击显示框以外的区域都可以关闭显示框
    oMask.onclick = function () {
        document.body.removeChild(oShow);
        document.body.removeChild(oMask);
    };
}
