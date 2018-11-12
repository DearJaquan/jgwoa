/**
 * Created by Dingfengwu on 2017/8/22.
 */
/****************************以下内容为流程控制变量****************************/
//可发起角色列表
var canLaunch = ["科长"];

/****************************以下内容为流程内容变量****************************/
//请购部门
var purchaseDepartment;
//请购日期
var purchaseDate;
//表内容
var content;
//修改的元素对象
var infoEditFor;
//科室意见
var adviceSection;
//科室意见填写时间
var timeAdviceSection;
//科室意见的历史记录
var historyAdviceSection;
//分管领导意见,为填写内容
var adviceBranchLeader;
//科室意见填写时间
var timeAdviceBranchLeader;
//分管领导意见的历史记录
var historyAdviceBranchLeader;
//主要领导意见,为填写内容
var adviceAdminMainLeader;
//科室意见填写时间
var timeAdviceAdminMainLeader;
//主要领导意见的历史记录
var historyAdviceAdminMainLeader;
//是否被退回
var isBack;

/****************************以下内容为流程必须函数****************************/
/**
 * 依据当前步骤生成下一步骤
 */
function getNextStep() {
    if(instance.isOperator){
        switch (instance.currentStep){
            case "发起流程":
                instance.nextStep = "分管领导审批";
                break;
            case "分管领导审批":
                instance.nextStep = "行政主要领导审批";
                break;
            case "行政主要领导审批":
                instance.nextStep = "行政办确认";
                break;
            case "行政办确认":
                instance.nextStep = "流程结束";
                break;
        }
    }else{
        instance.nextStep = instance.currentStep;
    }
}

/**
 * 新建流程时的初始化流程内容数据
 */
function setNewData() {
    purchaseDepartment=getUserSection(user.launchRole.name);
    purchaseDate = instance.launchTime.Format();
}

/**
 * 设置控制面板显示,不存在可不写
 */
function setControlData() {
    isAbleSelectBranch = instance.nextStep == "分管领导审批";
    isShowBranchSelect = isAbleSelectBranch;
    isShowLaunchRoleSelect = instance.currentStep.indexOf("发起流程") > -1 && user.launchRoleList.length > 1;
}

/**
 * 发起身份变化对应函数,不存在可不写
 */
function launchRoleChange() {
    var cSelectStatus = $("#selectStatus");
    user.launchRole.id = cSelectStatus.val();
    user.launchRole.name = cSelectStatus.find("option:selected").text();
    instance.launcherSection = getUserSection(user.launchRole.name);
}

/**
 * 获取流程内容数据
 */
function getContentData(data) {
    purchaseDepartment = data.purchaseDepartment;
    purchaseDate = data.purchaseDate;
    content = data.content;
    adviceSection = data.adviceSection;
    timeAdviceSection = data.timeAdviceSection;
    adviceBranchLeader = data.adviceBranchLeader;
    timeAdviceBranchLeader = data.timeAdviceBranchLeader;
    adviceAdminMainLeader = data.adviceAdminMainLeader;
    timeAdviceAdminMainLeader = data.timeAdviceAdminMainLeader;
    fileList = data.fileList;
    isBack= data.isBack;
}

function checkContent() {
    var isCorrect = true;
    if (instance.currentStep == "发起流程") {
        isCorrect = checkHasContent($("#tableLineList").children().length, $("#hintForList")) && isCorrect;
    }
    return true;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent(){
    var content = {};
    var cPurchaseDepartment = $("#purchaseDepartment");
    var cPurchaseDate = $("#purchaseDate");
    switch (instance.currentStep){
        case "发起流程":
            content.purchaseDepartment = cPurchaseDepartment.val();
            content.purchaseDate = cPurchaseDate.val();
            content.content = getAll();
            content.adviceSection = $("#adviceSection").val();
            content.historyAdviceSection = "adviceSection";
            content.signatureSection = user.id;
            content.timeAdviceSection = new Date().Format();
            break;
        case "分管领导审批":
            content.adviceBranchLeader = $("#adviceBranchLeader").val();
            content.historyAdviceBranchLeader = "adviceBranchLeader";
            content.signatureBranchLeader = user.id;
            content.timeAdviceBranchLeader = new Date().Format();
            break;
        case "行政主要领导审批":
            content.adviceAdminMainLeader = $("#adviceAdminMainLeader").val();
            content.historyAdviceAdminMainLeader = "adviceAdminMainLeader";
            content.signatureAdminMainLeader = user.id;
            content.timeAdviceAdminMainLeader = new Date().Format();
            break;
        case "行政办确认":
            content.signatureConfirm = user.id;
            content.TimeAdviceConfirm = new Date().Format();
            break;
    }
    content.isBack = isBack;
    content.fileList = fileList;
    return content;
}

/**
 * 初始化流程内容控件
 */
function initContentInterface(){
    var cRelateProcedure = $("#relateProcedure");
    cRelateProcedure.css("display", "none");
    var cPurchaseDepartment = $("#purchaseDepartment");
    var cPurchaseDate = $("#purchaseDate");
    cPurchaseDepartment.val(purchaseDepartment);
    cPurchaseDate.val(purchaseDate);
    var cEditTable = $(".tableLineEdit");
    setAll();
    if(instance.isOperator && instance.isLaunch){
        var detailNum = $("#tableLineList").children().length;
        if(detailNum == 0){
            cEditTable.removeClass("disappear");
        }
        if(detailNum < 8){
            $("#moreTableLine").css("display","inline");
        }
    }
    $("#saveForTableLine").click(function () {
        var cRequestName = $("#inputForRequestName");
        var cRequestSpec = $("#inputForRequestSpec");
        var cRequestNum = $("#inputForRequestNum");
        var cRequestUse = $("#inputForRequestUse");
        var cRequestComment = $("#inputForRequestComment");
        var isCorrect = true;
        isCorrect = checkNotNull(cRequestName.val(),$("#hintForRequestName")) && isCorrect;
        isCorrect = checkNotNull(cRequestSpec.val(),$("#hintForRequestSpec")) && isCorrect;
        isCorrect = checkNotNullPositiveInteger(cRequestNum.val(),$("#hintForRequestNum")) && isCorrect;
        isCorrect = checkNotNull(cRequestUse.val(),$("#hintForRequestUse")) && isCorrect;
        if(isCorrect){
            if(infoEditFor){
                var cInfo = infoEditFor.find("span");
                cInfo[0].innerText = cRequestName.val();
                cInfo[1].innerText = cRequestSpec.val();
                cInfo[2].innerText = cRequestNum.val();
                cInfo[3].innerText = cRequestUse.val();
                cInfo[4].innerText = cRequestComment.val();
            }else{
                var info = {};
                info.name = cRequestName.val();
                info.spec = cRequestSpec.val();
                info.num = cRequestNum.val();
                info.use = cRequestUse.val();
                info.comment = cRequestComment.val();
                addBillInfo(info, true);
                var num = $("#tableLineList").children().length;
                if(num > 7){
                    $("#moreTableLine").css("display","none");
                }
            }
            cEditTable.addClass("disappear");
        }
    });

    $("#moreTableLine").click(function () {
        cEditTable.removeClass("disappear");
        infoEditFor = $("#tableLineList").children("div:last");
        var cInfo = infoEditFor.find("span");
        $("#inputForRequestName").val(cInfo[0].innerText);
        $("#inputForRequestSpec").val(cInfo[1].innerText);
        $("#inputForRequestNum").val(cInfo[2].innerText);
        $("#inputForRequestUse").val(cInfo[3].innerText);
        $("#inputForRequestComment").val(cInfo[4].innerText);
        infoEditFor = undefined;
    });

    initSectionApproveControl(instance.nextStep == "分管领导审批",undefined);//科长审批信息显示控制
    initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdviceSection);//分管领导审批信息显示控制
    initAdminMainApproveControl(instance.currentStep == "行政主要领导审批",timeAdviceBranchLeader);//主要领导审批信息显示控制
}

function editTableLine(el) {
    infoEditFor = $(el).parent().parent();
    $(".tableLineEdit").removeClass("disappear");
    var cInfo = infoEditFor.find("span");
    $("#inputForRequestName").val(cInfo[0].innerText);
    $("#inputForRequestSpec").val(cInfo[1].innerText);
    $("#inputForRequestNum").val(cInfo[2].innerText);
    $("#inputForRequestUse").val(cInfo[3].innerText);
    $("#inputForRequestComment").val(cInfo[4].innerText);
}

function deleteTableLine(el) {
    var rootE = $(el).parent().parent();
    if(rootE.is(infoEditFor)){
        $("#tableLineEdit").addClass("disappear");
    }
    rootE.remove();
    if($("#tableLineList").children().length < 8){
        $("#moreTableLine").css("display","inline");
    }
    $(".tableLineEdit").addClass("disappear");
}

$(document).ready(
    function init() {
        initCommon("purchaseRequisition");
        initContentInterface();
    }
);

/****************************以下内容为页面独有函数****************************/
//获取表中的值
function getAll(){
    var tableArr = [];
    var tableList = $("#tableLineList").children();
    for(var i=0; i<tableList.length; i++){
        var cInfo = $(tableList[i]).find("span");
        var element = {};
        element.name = cInfo[0].innerText;
        element.spec = cInfo[1].innerText;
        element.num = cInfo[2].innerText;
        element.use = cInfo[3].innerText;
        element.comment = cInfo[4].innerText;
        tableArr.push(element);
    }
    return tableArr;
}
//填表
function setAll(){
    if(content){
        for(var i = 0; i<content.length; i++){
            if(instance.isOperator && instance.isLaunch){
                addBillInfo(content[i], true);
            }else{
                addBillInfo(content[i], false);
            }
        }
    }
}

function addBillInfo(info, canOperate) {
    var newTableLine = "<div>";
    if(canOperate){
        newTableLine +=
            "<div style='margin-top: 5px'>" +
            "<a href='javascript:void(0);' onclick='editTableLine(this)' title='修改' style='padding-left: 10px'><img src='../../resources/images/editTableLine.png'></a>" +
            "<a href='javascript:void(0);' onclick='deleteTableLine(this)' title='删除' style='padding-left: 10px'><img src='../../resources/images/deleteTableLine.png'></a>" +
            "</div>";
    }
    newTableLine +=
            "<table class='tableDetail'>" +
            "<tr>" +
            "<td width='220px' height='15px'><label>品名：<span>"+info.name+"</span></label></td>" +
            "<td width='180px' height='15px'><label>规格型号：<span>"+info.spec+"</span></label></td>" +
            "</tr><tr>"+
            "<td width='150px' height='15px'><label>单位数量：<span>"+info.num+"</span></label></td>" +
            "<td width='250px' height='15px'><label>用途：<span>"+info.use+"</span></label></td>" +
            "</tr>" +
            "<tr>" +
            "<td colspan='2' height='20px'><label>备注：<span>"+info.comment+"</span></label></td>" +
            "</tr>" +
            "</table>" +
            "</div>";
    $("#tableLineList").append(newTableLine);
}
