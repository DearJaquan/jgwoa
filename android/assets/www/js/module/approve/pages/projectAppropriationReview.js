/**
 * Created by Dingfengwu on 2017/9/29.
 */
/****************************以下内容为流程控制变量****************************/
//可发起角色列表
var canLaunch = ["计划科科长", "计划科科员", "财务科科长"];

//预算单位
var budgetUnit;
//单位负责人
var headUnit;
//联系人
var contacts;
//联系电话
var tel;
//项目名称
var projectName;

//预算内资金
var budgetFund;
//财政专户资金
var specialAccountFund;
//财政专项资金
var specialFund;
//预算安排
var budgetPlan;
//本次申请拨款说明
var appropriationExplain;
//表内容
var content;
//修改的元素对象
var infoEditFor;
//合计 本次申请数
var applyTotal;
//合计 累计批拨数
var cumulativeTotal;
//合计 预算数
var budgetTotal;
//是否被退回
var isBack;

//单位负责人意见
var adviceUnitManager;
//单位负责人意见填写时间
var timeAdviceUnitManager;
//单位负责人意见的历史记录
var historyAdviceUnitManager;

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
        switch (instance.currentStep) {
            case "发起流程":
                if(user.launchRole.name.indexOf("财务科科长") > -1){
                    instance.nextStep = "单位负责人审批";
                }else{
                    instance.nextStep = "流程结束";
                }
                break;
            case "单位负责人审批":
                instance.nextStep = "分管领导审批";
                break;
            case "分管领导审批":
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
    budgetUnit = getUserSection(user.launchRole.name)=="计划科"?"嘉定区建设和管理委员会":getUserSection(user.launchRole.name);
}

/**
 * 设置控制面板显示,不存在可不写
 */
function setControlData() {
    isAbleSelectBranch = instance.nextStep == "分管领导审批";
    isShowBranchSelect = isAbleSelectBranch;
    isShowLaunchRoleSelect = instance.currentStep.indexOf("发起流程") > -1 && user.launchRoleList.length > 1;
}

//发起身份变化对应函数
var launchRoleChange = function () {
    var cSelectStatus = $("#selectStatus");
    user.launchRole.id = cSelectStatus.val();
    user.launchRole.name = cSelectStatus.find("option:selected").text();
    instance.launcherSection = getUserSection(user.launchRole.name);
    getNextStep();
    $("#nextStep").text(instance.nextStep);
    if(user.launchRole.name.indexOf("财务科科长") > -1){
        $("#adviceUnitManagerArea").css("display","inline");
        $("#adviceBranchLeaderArea").css("display","inline");
        initUnitManagerApproveControl(instance.nextStep == "分管领导审批",undefined);//科长审批信息显示控制
        initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdviceUnitManager);//分管领导审批信息显示控制
    }else{
        $("#adviceSectionArea").css("display","none");
        $("#adviceBranchLeaderArea").css("display","none");
    }
    $("#confirm").parent().empty();
    initOperateInterface();
    setNewData();
    $("#budgetUnit").val(budgetUnit);
};

/**
 * 获取流程内容数据
 */
function getContentData(data) {
    budgetUnit = data.budgetUnit;
    headUnit = data.headUnit;
    contacts = data.contacts;
    tel = data.tel;
    projectName = data.projectName;
    budgetFund = data.budgetFund;
    specialAccountFund = data.specialAccountFund;
    specialFund = data.specialFund;
    budgetPlan = data.budgetPlan;
    appropriationExplain = data.appropriationExplain;

    content = data.content;
    applyTotal = data.applyTotal;
    cumulativeTotal = data.cumulativeTotal;
    budgetTotal = data.budgetTotal;

    adviceUnitManager = data.adviceUnitManager;
    timeAdviceUnitManager = data.timeAdviceUnitManager;
    adviceBranchLeader = data.adviceBranchLeader;
    timeAdviceBranchLeader = data.timeAdviceBranchLeader;
    fileList = data.fileList;
    isBack = data.isBack;
}

function checkContent() {
    var isCorrect = true;
    if (instance.currentStep == "发起流程") {
        isCorrect = checkNotNull($("#headUnit").val(), $("#hintHeadUnit")) && isCorrect;
        isCorrect = checkNotNull($("#contacts").val(), $("#hintContacts")) && isCorrect;
        isCorrect = checkNotNullTel($("#tel").val(), $("#hintTel")) && isCorrect;
        isCorrect = checkNotNull($("#projectName").val(), $("#hintProjectName")) && isCorrect;
        // isCorrect = checkNotNullPositiveNum($("#specialAccountFund").val(), $("#hintSpecialAccountFund")) && isCorrect;
        // isCorrect = checkNotNullPositiveNum($("#specialFund").val(), $("#hintSpecialFund")) && isCorrect;
        // isCorrect = checkNotNullPositiveNum($("#budgetFund").val(), $("#hintBudgetFund")) && isCorrect;
        isCorrect = checkNotNullPositiveNum($("#budgetPlan").val(), $("#hintBudgetPlan")) && isCorrect;
        isCorrect = checkPositiveNum($("#cumulativeTotal").val(), $("#hintCumulativeTotal")) && isCorrect;
        isCorrect = checkPositiveNum($("#budgetTotal").val(), $("#hintBudgetTotal")) && isCorrect;
        isCorrect = checkHasContent($("#tableLineList").children().length, $("#hintForApply")) && isCorrect;
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent() {
    var content = {};
    var cBudgetUnit = $("#budgetUnit");
    var cHeadUnit = $("#headUnit");
    var cContacts = $("#contacts");
    var cTel = $("#tel");
    var cProjectName = $("#projectName");
    var cBudgetFund = $("#budgetFund");
    var cSpecialAccountFund = $("#specialAccountFund");
    var cSpecialFund = $("#specialFund");
    var cBudgetPlan = $("#budgetPlan");
    var cAppropriationExplain = $("#appropriationExplain");

    var cApplyTotal = $("#applyTotal");
    var cCumulativeTotal = $("#cumulativeTotal");
    var cBudgetTotal = $("#budgetTotal");
    switch (instance.currentStep) {
        case "发起流程":
            content.year = new Date().getFullYear();
            content.budgetUnit = cBudgetUnit.val();
            content.headUnit = cHeadUnit.val();
            content.contacts = cContacts.val();
            content.tel = cTel.val();
            content.projectName = cProjectName.val();
            content.budgetFund = cBudgetFund.val();
            content.specialAccountFund = cSpecialAccountFund.val();
            content.specialFund = cSpecialFund.val();
            content.budgetPlan = cBudgetPlan.val();
            content.appropriationExplain = cAppropriationExplain.val();
            content.applyTotal = cApplyTotal.val();
            content.cumulativeTotal = cCumulativeTotal.val();
            content.budgetTotal = cBudgetTotal.val();
            content.content = getAll();
            if(instance.launcherSection == "计划科"){
                content.signatureStaff = user.id;
                content.timeAdviceStaff = new Date().Format();
            }
            break;
        case "单位负责人审批":
            content.adviceUnitManager = $("#adviceUnitManager").val();
            content.historyAdviceUnitManager = "adviceUnitManager";
            content.signatureUnitManager = user.id;
            content.timeAdviceUnitManager = $("#timeAdviceUnitManager").text();
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
function initContentInterface() {
    var cRelateProcedure = $("#relateProcedure");
    cRelateProcedure.css("display", "none");
    
    var cBudgetUnit = $("#budgetUnit");
    var cHeadUnit = $("#headUnit");
    var cContacts = $("#contacts");
    var cTel = $("#tel");
    var cProjectName = $("#projectName");
    var cBudgetFund = $("#budgetFund");
    var cSpecialAccountFund = $("#specialAccountFund");
    var cSpecialFund = $("#specialFund");
    var cBudgetPlan = $("#budgetPlan");
    var cAppropriationExplain = $("#appropriationExplain");
    var cEditTable = $(".tableLineEdit");
    var cApplyTotal = $("#applyTotal");
    var cCumulativeTotal = $("#cumulativeTotal");
    var cBudgetTotal = $("#budgetTotal");

    cBudgetUnit.val(budgetUnit);
    cHeadUnit.val(headUnit);
    cContacts.val(contacts);
    cTel.val(tel);
    cProjectName.val(projectName);
    cBudgetFund.val(budgetFund);
    cBudgetFund.on('input',function(){updateBudgetPlan();});
    cSpecialAccountFund.val(specialAccountFund);
    cSpecialAccountFund.on('input',function(){updateBudgetPlan();});
    cSpecialFund.val(specialFund);
    cSpecialFund.on('input',function(){updateBudgetPlan();});
    cBudgetPlan.val(budgetPlan);
    cAppropriationExplain.val(appropriationExplain);
    cApplyTotal.val(applyTotal);
    cCumulativeTotal.val(cumulativeTotal);
    cBudgetTotal.val(budgetTotal);
    setAll();
    if(instance.isOperator && instance.currentStep == "发起流程"){
        cHeadUnit.attr("readonly",false);
        cHeadUnit.removeClass("disable");
        cHeadUnit.addClass("default");
        cContacts.attr("readonly",false);
        cContacts.removeClass("disable");
        cContacts.addClass("default");
        cTel.attr("readonly",false);
        cTel.removeClass("disable");
        cTel.addClass("default");
        cProjectName.attr("readonly",false);
        cProjectName.removeClass("disable");
        cProjectName.addClass("default");
        cBudgetFund.attr("readonly",false);
        cBudgetFund.removeClass("disableMoney");
        cBudgetFund.addClass("money");
        cSpecialAccountFund.attr("readonly",false);
        cSpecialAccountFund.removeClass("disableMoney");
        cSpecialAccountFund.addClass("money");
        cSpecialFund.attr("readonly",false);
        cSpecialFund.removeClass("disableMoney");
        cSpecialFund.addClass("money");
        cCumulativeTotal.attr("readonly",false);
        cCumulativeTotal.removeClass("disableMoney");
        cCumulativeTotal.addClass("money");
        cBudgetTotal.attr("readonly",false);
        cBudgetTotal.removeClass("disableMoney");
        cBudgetTotal.addClass("money");
        cAppropriationExplain.attr("readonly",false);
        cAppropriationExplain.removeClass("disable");
        cAppropriationExplain.addClass("default");
        var detailNum = $("#tableLineList").children().length;
        if(detailNum == 0){
            cEditTable.removeClass("disappear");
        }
        if(detailNum < 7){
            $("#moreTableLine").css("display","inline");
        }
    }
    $("#saveForTableLine").click(function () {
        var cTwoLevel = $("#inputForTwoLevel");
        var cThreeLevel = $("#inputForThreeLevel");
        var cFundNature = $("#selectForFundNature");
        var cExpendType = $("#selectForExpendType");
        var cBudgetAmount = $("#inputForBudgetAmount");
        var cApplyNumber = $("#inputForApplyNumber");
        var cCumulativeNumber = $("#inputForCumulativeNumber");
        var cPayType = $("#selectForPayType");
        var cBeneficiaryName = $("#inputForBeneficiaryName");
        var cAccount = $("#inputForAccount");
        var cBankDeposit = $("#inputForBankDeposit");
        var isCorrect = true;
        isCorrect = checkNotNull(cTwoLevel.val(), $("#hintForTwoLevel")) && isCorrect;
        isCorrect = checkNotNull(cThreeLevel.val(), $("#hintForThreeLevel")) && isCorrect;
        isCorrect = checkNotNullPositiveNum(cBudgetAmount.val(), $("#hintForBudgetAmount")) && isCorrect;
        isCorrect = checkNotNullPositiveNum(cApplyNumber.val(), $("#hintForApplyNumber")) && isCorrect;
        isCorrect = checkNotNullPositiveNum(cCumulativeNumber.val(), $("#hintForCumulativeNumber")) && isCorrect;
        if (cPayType.val() == "直接支付") {
            isCorrect = checkNotNull(cBeneficiaryName.val(), $("#hintForBeneficiaryName")) && isCorrect;
            isCorrect = checkNotNull(cAccount.val(), $("#hintForAccount")) && isCorrect;
            isCorrect = checkNotNull(cBankDeposit.val(), $("#hintForBankDeposit")) && isCorrect;
        }else {
            $("#hintForBeneficiaryName").text("");
            $("#hintForAccount").text("");
            $("#hintForBankDeposit").text("");
        }
        if (isCorrect) {
            if (infoEditFor) {
                var cInfo = infoEditFor.find("span");
                cInfo[0].innerText = cTwoLevel.val();
                cInfo[1].innerText = cThreeLevel.val();
                cInfo[2].innerText = cFundNature.val();
                cInfo[3].innerText = cExpendType.val();
                cInfo[4].innerText = cBudgetAmount.val();
                cInfo[5].innerText = cApplyNumber.val();
                cInfo[6].innerText = cCumulativeNumber.val();
                cInfo[7].innerText = cPayType.val();
                cInfo[8].innerText = cBeneficiaryName.val();
                cInfo[9].innerText = cAccount.val();
                cInfo[10].innerText = cBankDeposit.val();
            } else {
                var info = {};
                info.twoLevel = cTwoLevel.val();
                info.threeLevel = cThreeLevel.val();
                info.fundNature = cFundNature.val();
                info.expendType = cExpendType.val();
                info.budgetAmount = cBudgetAmount.val();
                info.applyNumber = cApplyNumber.val();
                info.cumulativeNumber = cCumulativeNumber.val();
                info.payType = cPayType.val();
                info.beneficiaryName = cBeneficiaryName.val();
                info.account = cAccount.val();
                info.bankDeposit = cBankDeposit.val();
                addBillInfo(info, true);
                var num = $("#tableLineList").children().length;
                if (num > 6) {
                    $("#moreTableLine").css("display", "none");
                }
            }
            cEditTable.addClass("disappear");
            updateMoney();
        }
    });

    $("#selectForPayType").change(function () {
        var cBeneficiaryName = $("#inputForBeneficiaryName");
        var cAccount = $("#inputForAccount");
        var cBankDeposit = $("#inputForBankDeposit");
        cBeneficiaryName.val("");
        cAccount.val("");
        cBankDeposit.val("");
        if($("#selectForPayType").val() == "直接支付"){
            cBeneficiaryName.attr("readonly",false);
            cBeneficiaryName.removeClass("disable");
            cBeneficiaryName.addClass("default");
            cAccount.attr("readonly",false);
            cAccount.removeClass("disable");
            cAccount.addClass("default");
            cBankDeposit.attr("readonly",false);
            cBankDeposit.removeClass("disable");
            cBankDeposit.addClass("default");
        }else{
            cBeneficiaryName.attr("readonly",true);
            cBeneficiaryName.removeClass("default");
            cBeneficiaryName.addClass("disable");
            cAccount.attr("readonly",true);
            cAccount.removeClass("default");
            cAccount.addClass("disable");
            cBankDeposit.attr("readonly",true);
            cBankDeposit.removeClass("default");
            cBankDeposit.addClass("disable");
        }
    });


    $("#moreTableLine").click(function () {
        cEditTable.removeClass("disappear");
        infoEditFor = $("#tableLineList").children("div:last");
        var cInfo = infoEditFor.find("span");
        $("#inputForTwoLevel").val(cInfo[0].innerText);
        $("#inputForThreeLevel").val(cInfo[1].innerText);
        $("#selectForFundNature").val(cInfo[2].innerText);
        $("#selectForExpendType").val(cInfo[3].innerText);
        $("#inputForBudgetAmount").val(cInfo[4].innerText);
        $("#inputForApplyNumber").val(cInfo[5].innerText);
        $("#inputForCumulativeNumber").val(cInfo[6].innerText);
        $("#selectForPayType").val(cInfo[7].innerText);
        $("#inputForBeneficiaryName").val(cInfo[8].innerText);
        $("#inputForAccount").val(cInfo[9].innerText);
        $("#inputForBankDeposit").val(cInfo[10].innerText);
        infoEditFor = undefined;
    });
    
    if(instance.launcherSection.indexOf("计划科") == -1){
        initUnitManagerApproveControl(instance.nextStep == "分管领导审批",undefined);//科长审批信息显示控制
        initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdviceUnitManager);//分管领导审批信息显示控制
    }else{
        $("#adviceUnitManagerArea").css("display","none");
        $("#adviceBranchLeaderArea").css("display","none");
    }
}

$(document).ready(
    function init() {
        initCommon("projectAppropriationReview");
        initContentInterface();
    }
);


function editTableLine(el) {
    infoEditFor = $(el).parent().parent();
    var cTableLineEdit = $(".tableLineEdit");
    cTableLineEdit.removeClass("disappear");
    var cInfo = infoEditFor.find("span");
    $("#inputForTwoLevel").val(cInfo[0].innerText);
    $("#inputForThreeLevel").val(cInfo[1].innerText);
    $("#selectForFundNature").val(cInfo[2].innerText);
    $("#selectForExpendType").val(cInfo[3].innerText);
    $("#inputForBudgetAmount").val(cInfo[4].innerText);
    $("#inputForApplyNumber").val(cInfo[5].innerText);
    $("#inputForCumulativeNumber").val(cInfo[6].innerText);
    $("#selectForPayType").val(cInfo[7].innerText);
    $("#inputForBeneficiaryName").val(cInfo[8].innerText);
    $("#inputForAccount").val(cInfo[9].innerText);
    $("#inputForBankDeposit").val(cInfo[10].innerText);

}

function deleteTableLine(el) {
    var rootE = $(el).parent().parent();
    if (rootE.is(infoEditFor)) {
        $("#tableLineEdit").addClass("disappear");
    }
    rootE.remove();
    if ($("#tableLineList").children().length < 7) {
        $("#moreTableLine").css("display", "inline");
    }
    updateMoney();
    $(".tableLineEdit").addClass("disappear");
}

//获取表中的值
function getAll() {
    var tableArr = [];
    var tableList = $("#tableLineList").children();
    for (var i = 0; i < tableList.length; i++) {
        var cInfo = $(tableList[i]).find("span");
        var element = {};
        element.twoLevel = cInfo[0].innerText;
        element.threeLevel = cInfo[1].innerText;
        element.fundNature = cInfo[2].innerText;
        element.expendType = cInfo[3].innerText;
        element.budgetAmount = cInfo[4].innerText;
        element.applyNumber = cInfo[5].innerText;
        element.cumulativeNumber = cInfo[6].innerText;
        element.payType = cInfo[7].innerText;
        if(element.payType == "直接支付"){
            element.beneficiaryName = cInfo[8].innerText;
            element.account = cInfo[9].innerText;
            element.bankDeposit = cInfo[10].innerText;
        }
        tableArr.push(element);
    }
    return tableArr;
}
//填表
function setAll() {
    if (content) {
        for (var i = 0; i < content.length; i++) {
            if (instance.isOperator && instance.isLaunch) {
                addBillInfo(content[i], true);
            } else {
                addBillInfo(content[i], false);
            }
        }
    }
}

function addBillInfo(info, canOperate) {
    var newTableLine = "<div>";
    if (canOperate) {
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
            "<label class='combine'>二级构成：<span>"+info.twoLevel+"</span></label>" +
            "<label class='combine'>三级构成：<span>"+info.threeLevel+"</span></label>" +
            "<label class='combine'>资金性质：<span>"+info.fundNature+"</span></label>" +
            "<label class='combine'>是否政府采购：<span>"+info.expendType+"</span></label>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td width='750px' height='15px'>" +
            "<label class='combine'>预算数：<span>"+info.budgetAmount+"</span></label>" +
            "<label class='combine'>本次申请数：<span>"+info.applyNumber+"</span></label>" +
            "<label class='combine'>累计批拨数：<span>"+info.cumulativeNumber+"</span></label>" +
            "<label class='combine'>支付方式：<span>"+info.payType+"</span></label>" +
        "</td>" +
        "</tr>";
    if(info.payType == "直接支付"){
        newTableLine +=
            "<tr>" +
            "<td width='750px' height='15px'>" +
            "<label class='combine'>收款人户名：<span>"+info.beneficiaryName+"</span></label>" +
            "<label class='combine'>账号：<span>"+info.account+"</span></label>" +
            "<label class='combine'>开户行：<span>"+info.bankDeposit+"</span></label>" +
            "</td>" +
            "</tr>" +
            "</table>" +
            "</div>";
    }else{
        newTableLine +=
            "</table>" +
            "</div>";
    }
    $("#tableLineList").append(newTableLine);
}

function updateMoney() {
    var details = $("#tableLineList").find(".tableDetail");
    applyTotal = 0;
    for(var i=0; i<details.length; i++){
        var info = $(details[i]).find("span");
        applyTotal = accAdd(applyTotal,parseFloat(info[5].innerText));
    }
    $("#applyTotal").val(applyTotal);
}

function updateBudgetPlan() {
    var partOne = parseFloat($("#budgetFund").val());
    var partTwo = parseFloat($("#specialAccountFund").val());
    var partThree = parseFloat($("#specialFund").val());
    var total = 0;
    if(!isNaN(partOne)){
        total += partOne;
    }
    if(!isNaN(partTwo)){
        total += partTwo;
    }
    if(!isNaN(partThree)){
        total += partThree;
    }
    if(total != 0){
        $("#budgetPlan").val(total);
    }else {
        $("#budgetPlan").val("");
    }
}