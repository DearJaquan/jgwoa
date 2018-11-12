/**
 * Created by Dingfengwu on 2017/9/5.
 */
/****************************以下内容为流程控制变量****************************/
//可发起角色列表
var canLaunch = ["计划科科长","计划科科员"];

/****************************以下内容为流程内容变量****************************/
//单位名称
var companyName;
//日期
var date;
//票据领购证号
var billLicenseNumber;
//财务负责人
var financialController;
//联系电话
var financeTel;
//票据经管人
var billManager;
//联系电话
var billManagerTel;
//表内容
var content;
//修改的元素对象
var infoEditFor;
//是否被退回
var isBack;

//科室意见
var adviceSection;
//科室意见填写时间
var timeAdviceSection;
//科室意见的历史记录
var historyAdviceSection;

//分管领导意见,为填写内容
var adviceBranchLeader;
//分管领导意见填写时间
var timeAdviceBranchLeader;
//分管领导意见的历史记录
var historyAdviceBranchLeader;

/****************************以下内容为流程必须函数****************************/
/**
 * 依据当前步骤生成下一步骤
 */
function getNextStep() {
    if(instance.isOperator){
        switch (instance.currentStep){
            case "发起流程":
                if(user.launchRole.name.indexOf("科员") > -1){
                    instance.nextStep = "科室审批";
                }else{
                    instance.nextStep = "分管领导审批";
                }
                break;
            case "科室审批":
                instance.nextStep = "分管领导审批";
                break;
            case "分管领导审批":
                instance.nextStep = "流程结束";
                break;
        }
    }
}

/**
 * 新建流程时的初始化流程内容数据
 */
function setNewData() {
    date = instance.launchTime.Format();
    companyName="建管委";
}

/**
 * 设置控制面板显示,不存在可不写
 */
function setControlData() {
    isAbleSelectBranch = instance.nextStep == "分管领导审批";
    isShowBranchSelect = isAbleSelectBranch;
}

/**
 * 获取流程内容数据
 */
function getContentData(data) {
    companyName = data.companyName;
    date = data.date;
    billLicenseNumber = data.billLicenseNumber;
    financialController = data.financialController;
    financeTel = data.financeTel;
    billManager = data.billManager;
    billManagerTel = data.billManagerTel;
    content = data.content;
    adviceSection = data.adviceSection;
    timeAdviceSection = data.timeAdviceSection;
    adviceBranchLeader = data.adviceBranchLeader;
    timeAdviceBranchLeader = data.timeAdviceBranchLeader;
    fileList = data.fileList;
    isBack = data.isBack;
}

/**
 * 数据检测
 * @returns {boolean}
 */
function checkContent() {
    var isCorrect = true;
    if(instance.currentStep.indexOf("发起")>-1){
        isCorrect = checkNotNull($("#billLicenseNumber").val(),$("#hintBillLicenseNumber")) && isCorrect;
        isCorrect = checkNotNull($("#financialController").val(),$("#hintFinancialController")) && isCorrect;
        isCorrect = checkNotNullTel($("#financeTel").val(),$("#hintFinanceTel")) && isCorrect;
        isCorrect = checkNotNull($("#billManager").val(),$("#hintBillManager")) && isCorrect;
        isCorrect = checkNotNullTel($("#billManagerTel").val(),$("#hintBillManagerTel")) && isCorrect;
        isCorrect = checkHasContent($("#tableLineList").children().length,$("#hintForBillInfo")) && isCorrect;
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent(){
    var content = {};
    var cCompanyName = $("#companyName");
    var cDate = $("#date");
    var cBillLicenseNumber = $("#billLicenseNumber");
    var cFinancialController = $("#financialController");
    var cFinanceTel = $("#financeTel");
    var cBillManager = $("#billManager");
    var cBillManagerTel = $("#billManagerTel");
    switch (instance.currentStep){
        case "发起流程":
            content.companyName = cCompanyName.val();
            content.date = cDate.val();
            content.billLicenseNumber = cBillLicenseNumber.val();
            content.financialController = cFinancialController.val();
            content.financeTel = cFinanceTel.val();
            content.billManager = cBillManager.val();
            content.billManagerTel = cBillManagerTel.val();
            content.content = getAll();
            content.signatureTransactor = user.id;
            content.timeAdviceTransactor = new Date().Format();
            if(user.launchRole.name.indexOf("科长") > -1){
                content.adviceSection = $("#adviceSection").val();
                content.historyAdviceSection = "adviceSection";
                content.signatureSection = user.id;
                content.timeAdviceSection = new Date().Format();
            }
            break;
        case "科室审批":
            content.adviceSection = $("#adviceSection").val();
            content.historyAdviceSection = "adviceSection";
            content.signatureSection = user.id;
            content.timeAdviceSection = $("#timeAdviceSection").text();
            break;
        case "分管领导审批":
            content.adviceBranchLeader = $("#adviceBranchLeader").val();
            content.historyAdviceBranchLeader = "adviceBranchLeader";
            content.signatureBranchLeader = user.id;
            content.timeAdviceBranchLeader = $("#timeAdviceBranchLeader").text();
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
    
    var cCompanyName = $("#companyName");
    var cDate = $("#date");
    var cBillLicenseNumber = $("#billLicenseNumber");
    var cFinancialController = $("#financialController");
    var cFinanceTel = $("#financeTel");
    var cBillManager = $("#billManager");
    var cBillManagerTel = $("#billManagerTel");
    var cEditTable = $(".tableLineEdit");
    cCompanyName.val(companyName);
    cDate.val(date);
    cBillLicenseNumber.val(billLicenseNumber);
    cFinancialController.val(financialController);
    cFinanceTel.val(financeTel);
    cBillManager.val(billManager);
    cBillManagerTel.val(billManagerTel);
    setAll();
    if(instance.isOperator && instance.isLaunch){
        cBillLicenseNumber.attr("readonly",false);
        cBillLicenseNumber.removeClass("disable");
        cBillLicenseNumber.addClass("default");
        cFinancialController.attr("readonly",false);
        cFinancialController.removeClass("disable");
        cFinancialController.addClass("default");
        cFinanceTel.attr("readonly",false);
        cFinanceTel.removeClass("disable");
        cFinanceTel.addClass("default");
        cBillManager.attr("readonly",false);
        cBillManager.removeClass("disable");
        cBillManager.addClass("default");
        cBillManagerTel.attr("readonly",false);
        cBillManagerTel.removeClass("disable");
        cBillManagerTel.addClass("default");
        var detailNum = $("#tableLineList").children().length;
        if(detailNum == 0){
            cEditTable.removeClass("disappear");
        }
        if(detailNum < 10){
            $("#moreTableLine").css("display","inline");
        }
    }
    $("#saveForTableLine").click(function () {
        var cBillName = $("#inputForBillName");
        var cBillNum = $("#inputForBillNum");
        var cBillFrom = $("#inputForBillFrom");
        var cBillTo = $("#inputForBillTo");
        var cBillMoney = $("#inputForBillMoney");
        var isCorrect = true;
        isCorrect = checkNotNull(cBillName.val(),$("#hintForBillName")) && isCorrect;
        isCorrect = checkNotNullPositiveInteger(cBillNum.val(),$("#hintForBillNum")) && isCorrect;
        isCorrect = checkNotNull(cBillFrom.val(),$("#hintForBillFromTo")) && isCorrect;
        isCorrect = checkNotNull(cBillTo.val(),$("#hintForBillFromTo")) && isCorrect;
        isCorrect = checkNotNullPositiveNum(cBillMoney.val(),$("#hintForBillMoney")) && isCorrect;
        if(isCorrect){
            if(infoEditFor){
                var cInfo = infoEditFor.find("span");
                cInfo[0].innerText = cBillName.val();
                cInfo[1].innerText = cBillNum.val();
                cInfo[2].innerText = cBillFrom.val();
                cInfo[3].innerText = cBillTo.val();
                cInfo[4].innerText = cBillMoney.val();
            }else{
                var info = {};
                info.name = cBillName.val();
                info.num = cBillNum.val();
                info.from = cBillFrom.val();
                info.to = cBillTo.val();
                info.money = cBillMoney.val();
                addBillInfo(info, true);
                var num = $("#tableLineList").children().length;
                if(num > 9){
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
        $("#inputForBillName").val(cInfo[0].innerText);
        $("#inputForBillNum").val(cInfo[1].innerText);
        $("#inputForBillFrom").val(cInfo[2].innerText);
        $("#inputForBillTo").val(cInfo[3].innerText);
        $("#inputForBillMoney").val(cInfo[4].innerText);
        infoEditFor = undefined;
    });

    initSectionApproveControl(instance.nextStep == "分管领导审批",undefined);//科长审批信息显示控制
    initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdviceSection);//分管领导审批信息显示控制
}

function editTableLine(el) {
    infoEditFor = $(el).parent().parent();
    var cTableLineEdit = $(".tableLineEdit");
    cTableLineEdit.removeClass("disappear");
    var cInfo = infoEditFor.find("span");
    $("#inputForBillName").val(cInfo[0].innerText);
    $("#inputForBillNum").val(cInfo[1].innerText);
    $("#inputForBillFrom").val(cInfo[2].innerText);
    $("#inputForBillTo").val(cInfo[3].innerText);
    $("#inputForBillMoney").val(cInfo[4].innerText);
}

function deleteTableLine(el) {
    var rootE = $(el).parent().parent();
    if(rootE.is(infoEditFor)){
        $("#tableLineEdit").addClass("disappear");
    }
    rootE.remove();
    if($("#tableLineList").children().length < 10){
        $("#moreTableLine").css("display","inline");
    }
    $(".tableLineEdit").addClass("disappear");
}

$(document).ready(
    function init() {
        initCommon("financeBillDestroy");
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
        element.num = cInfo[1].innerText;
        element.from = cInfo[2].innerText;
        element.to = cInfo[3].innerText;
        element.money = cInfo[4].innerText;
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
        "<td width='750px' height='15px'>" +
        "<label class='combine'>票据名称：<span>"+info.name+"</span></label>" +
        "<label class='combine'>本数/份数：<span>"+info.num+"</span></label>" +
        "<label class='combine'>号码：起<span>"+info.from+"</span></label>" +
        "<label class='combine'>至<span>"+info.to+"</span></label>" +
        "<label class='combine'>金额：<span>"+info.money+"</span>万元</label>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</div>";
    $("#tableLineList").append(newTableLine);
}


