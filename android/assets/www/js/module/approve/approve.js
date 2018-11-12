/**
 * Created by Dingfengwu on 2017/9/21.
 */
/*初始控件*/
var user = getUserInfo();

window.onload = function init() {
    initDate();
    initInstance();
    initCanLaunchInstance();

};

function initInstance() {
    getApproveTypeList(user.id, callBackGetInstance);
}

var callBackGetInstance = function (value) {
    var instanceName = $("#instanceName");
    for (var i = 0; i < value.length; i++) {
        instanceName.append("<option value=" + value[i].id + ">" + value[i].name + "</option>");
    }
};


//
function initDate() {
    var cEndTime = $("#endTime");
    laydate.render({
        elem: '#startTime',
        showBottom: false,
        max: 0,
        done: function (value,date) {
            changeMinTime(cEndTime,date);
        }
    });
    var cEndTime = laydate.render({
        elem: '#endTime',
        showBottom: false,
        max: 0
    });
}

/**
 * 流程查询
 */
function search() {
    var instanceType = $("#instanceName").find("option:selected").val();
    //console.log(instanceName+"iiii");
    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();
    searchInstance(user.id, instanceType,startTime,endTime ,"","","",searchValue);
    //searchInstance(user.id, instanceName, startTime, endTime, searchValue);
}

/*回调函数，显示流程名称*/
var searchValue = function (data) {
    var info = data.data;
    var str = "";
    var associate = '<input type="button" onclick="associate()" value="关联发起"/>';
    for (var i = 0; i < info.length; i++) {
        if (info[0].id != null) {
            var href = info[i].type + ".html?type=old&instanceID=" + info[i].id;
            var checkbox;
            if(info[i].status=="已完成"&&info[i].is_related==false){
                checkbox = '<input  type="checkbox" name="q" value=' + info[i].id + ">";
            }else
                checkbox = '<input  type="checkbox" name="q" disabled="disabled" value=' + info[i].id + ">";
            str +=  '<div class="rowinfo"><a target="blank" href='+ href + '>'+
                "<span>" + info[i].name +"</span><br>"+
                '<table style="width: 100%"><tr>'+
                '<td style="width: 60%">' + date + "</td>"+
                '<td style="width: 20%">' + info[i].startUser + "</td>"+
                '<td style="width: 20%">' + info[i].status + "</td>"+
                "</tr></table></a></div>";
        }
    }
    document.getElementById("search").innerHTML = str;
    if (info.length > 0&&(info[0].type=="meetingCostGather")) {
        $("#choose").css("display", "inline");
        document.getElementById("choose").innerHTML = associate;
    }else {
        $("#choose").css("display", "none");
        $('input[name="q"]').attr("disabled","true");
    }

};


/**
 * 关联发起
 */
function associate() {
    var instanceID = null;
    var id_array = new Array();
    $('input[name="q"]:checked').each(function () {
        id_array.push($(this).val());
       // instanceID = $(this).val();
    });
    if (id_array.length > 0) {
        associateLaunch(user.id, JSON.stringify(id_array), callBackAssociate);
    }
}

/**
 * 关联发起回调函数
 * @param data
 */
var callBackAssociate = function (data) {
    var content = encodeURI(JSON.stringify(data.data));
    //var associateInstance = $("#associate").find("option:selected").val();
    window.open("paymentApprove.html?type=new&content=" + content, "_blank");
};

/*******************************************/
//科员可发起流程
var clerkCanLaunch = ["projectBudgetApplication","publicAffairsAndVehicleApplication","paymentApprove","meetingCostGather","contractReview","projectPreview","contractApprove","sealCirculation","dispatchDocument","dispatchDocumentUnion"];
//单位财务科科长可发起流程
var unitChiefOfFinanceDeptCanLaunch = ["eight-pointAusterityRules","nationalAssetDisposeTwo","nationalAssetDisposeOne","nationalAssetLend","nationalAssetBill", "projectFundsWithdrawal","projectFundsOverWithdrawal","projectAppropriationReview"];
//计划科科员可发起流程；
var clerkPlanCanLaunch = ["eight-pointAusterityRules","financeBillDestroy","nationalAssetDisposeTwo","nationalAssetDisposeOne","nationalAssetLend","nationalAssetBill", "projectFundsWithdrawal","projectFundsOverWithdrawal","projectAppropriationReview"];
//行政办科员可发起流程；
var clerkExecutiveCanLaunch = ["governmentInformation","informationSubmissionExamination"];
//科长可发起流程；
var chiefCanLaunch = ["projectBudgetApplication","publicAffairsAndVehicleApplication","restaurantReception","meetingCostGather", "contractReview","projectPreview","contractApprove","sealCirculation","purchaseRequisition","dispatchDocument","dispatchDocumentUnion","theTIOGMatterApply"];
//计划科科长可发起流程；
var chiefPlanCanLaunch =["eight-pointAusterityRules","financeBillDestroy","nationalAssetDisposeTwo","nationalAssetDisposeOne","nationalAssetLend","nationalAssetBill", "projectFundsWithdrawal","projectFundsOverWithdrawal","projectAppropriationReview"];
//行政办科长可发起流程；(缺转发会议通知流程文件传阅流程)
var chiefExecutiveCanLaunch = ["governmentInformation","informationSubmissionExamination"];
//党委办科长可发起流程（缺转发会议通知流程）
var partyChiefCanLaunch = [];
//分管领导可发起流程
var branchCanLaunch = ["publicAffairsAndVehicleApplication","paymentApprove","restaurantReception","meetingCostGather"];
//行政主要领导可发起流程
var mainLeaderCanLaunch = ["publicAffairsAndVehicleApplication","paymentApprove","restaurantReception","meetingCostGather"];
//党委主要领导可发起流程
var partyMainLeaderCanLaunch=["publicAffairsAndVehicleApplication","paymentApprove","restaurantReception","meetingCostGather"];
/*******************************************/


//初始化可发起流程实例
function initCanLaunchInstance() {
    getApproveTypeList(user.id, callBackGetCanLaunchInstance);
}


//获取发起流程列表
function getCanLaunchList(){
    var canLaunchList=[];
    for (var i = 0; i < user.roleList.length; i++) {
        var userRole = user.roleList[i].name;
        var canLaunch = getCanLaunchInstance(userRole);
        for(var k in canLaunch) {
            canLaunchList.push(canLaunch[k]);
        }
    }
    console.log(canLaunchList);
    return canLaunchList;
}

//根据用户角色获取可发起流程；
function getCanLaunchInstance(userRole){
    var canLaunch = [];
    if (userRole.indexOf("财务科科长") > -1) {
        canLaunch = unitChiefOfFinanceDeptCanLaunch;
    } else if(userRole.indexOf("计划科科员") > -1){
        for(var i in clerkCanLaunch){
            clerkPlanCanLaunch.push(clerkCanLaunch[i]);
        }
        canLaunch = clerkPlanCanLaunch;
    } else if(userRole.indexOf("计划科科长") > -1){
        for(var i in chiefCanLaunch){
            chiefPlanCanLaunch.push(chiefCanLaunch[i]);
        }
        canLaunch = chiefPlanCanLaunch;
    }else if(userRole.indexOf("行政办科员") > -1){
        for(var i in clerkCanLaunch){
            clerkExecutiveCanLaunch.push(clerkCanLaunch[i]);
        }
        canLaunch = clerkExecutiveCanLaunch;
    }else if(userRole.indexOf("行政办科长") > -1){
        for(var i in chiefCanLaunch){
            chiefExecutiveCanLaunch.push(chiefCanLaunch[i]);
        }
        canLaunch = chiefExecutiveCanLaunch;
    }else if(userRole.indexOf("科长") > -1){
        canLaunch = chiefCanLaunch;
    }else if(userRole.indexOf("科员") > -1){
        canLaunch = clerkCanLaunch;
    }else if(userRole.indexOf("分管领导") > -1){
        canLaunch = branchCanLaunch;
    }else if(userRole.indexOf("行政主要领导") > -1){
        canLaunch = mainLeaderCanLaunch;
    }else if(userRole.indexOf("党委主要领导") > -1){
        canLaunch = partyMainLeaderCanLaunch;
    }
    return canLaunch;
}

//获取可发起流程的回调
var callBackGetCanLaunchInstance = function (value) {
    var canLaunchInstance = $("#canLaunchInstance");
    var canLaunchList = getCanLaunchList();
    for (var i = 0; i < value.length; i++) {
        var ins = value[i].id;
        if($.inArray(value[i].id, canLaunchList)>-1){
            canLaunchInstance.append('<div class="block"><a href='+value[i].id+'.html?type=new target="blank" class="clearfix"><span style="font-size:16px">'+value[i].name+'</span></a></div>');
        }
    }
};

/***********************************************/

/*目录控制*/
$(document).ready(function (argument) {
    $.each($('.container'), function () {
        var index = $(this).find('.tab').find('.current').index();
        tabShowIndex($(this), index);
        var trigger = $(this).data('trigger'),
            $self = $(this);
        $(this).on(trigger, '.tab>a', function () {
            $(this).siblings().removeClass('current').end().addClass('current');
            tabShowIndex($self, $(this).index());
        });
    });
    function tabShowIndex($tab, index) {
        $tab.find('.content-item').hide().eq(index).show();
    }
});


/**
 * 任务查看
 * @param userID
 * @param status
 * @param callback
 * @param isAsync
 */
function getTask(userID, status, callback, isAsync) {
    if (isAsync == null) {
        isAsync = true;
    }
    $.ajax({
        type: "GET",
        url: urlBase + "/ws/process/user/task",  //流程发起url
        data: {
            userID: userID,
            validateCode: "",
            processInstanceId: "",
            status: status
        },
        async: isAsync,
        dataType: "JSON",
        success: function (data) {
            callback(data);
        },
        error: function () {

        }
    });
}

/**
 * 查询流程
 * @param userID
 * @param name
 * @param startTime
 * @param endTime
 * @param callback
 * @param isAsync
 */
function searchInstance(userID, instanceType,startTime,endTime ,status,initiator,related,callback, isAsync) {
    if (isAsync == null) {
        isAsync = true;
    }
    $.ajax({
        type: "GET",
        url: urlBase + "/ws/process/processinfo",
        data: {
            userID: userID,
            validateCode: "",
            instanceType: instanceType,
            startTime:startTime,
            endTime:endTime,
            status:status,
            initiator:initiator,
            related:related
        },
        async: isAsync,
        dataType: "JSON",
        success: function (data) {
            callback(data);
        },
        error: function () {

        }
    });
}

/**
 * 获取流程实例类型
 * @param userID
 * @param callback
 * @param isAsync
 */
function getApproveTypeList(userID, callback, isAsync) {
    if (isAsync == null) {
        isAsync = true;
    }
    $.ajax({
        type: "GET",
        url: urlBase + "/ws/document/documenttype",
        data: {
            userID: userID
        },
        async: isAsync,
        dataType: "JSON",
        success: function (data) {
            switch (data.code){
                case 200:
                    callback(data.data);
                    break;
            }
        },
        error: function () {

        }
    });
}

function associateLaunch(userID, instanceID,callback, isAsync) {
    if (isAsync == null) {
        isAsync = true;
    }
    $.ajax({
        type: "GET",
        url: urlBase + "/ws/process/associate",
        data: {
            instanceID:instanceID,
            userID: userID
        },
        async: isAsync,
        dataType: "JSON",
        success: function (data) {
            callback(data);
        },
        error: function () {

        }
    });
}

