/**
 * Created by Dingfengwu on 2017/10/20.
 */

/**************************************************************************/
//申报单位
var applyDepartment;
//项目名称
var projectName;
//项目性质
var projectNature;
//项目分类
var projectClassify;
//本年度申请金额
var amountAppliedForThisYear;
//上年度预算金额
var budgetAmountForLastYear;
//上年度实际支出金额
var actualExpenditureAmountForLastYear;
//二级
var secondLevel;
//三级
var thirdLevel;

//一季度
var firstQuarter;
//二季度
var secondQuarter;
//三季度
var thirdQuarter;
//四季度
var fourthQuarter;

//现金使用额度
var cashAmount;
//现金支出内容
var cashContent;
//项目依据
var projectBasis;
//项目主要内容
var projectContent;

//会场费
var meeting_transfer;
//
var meeting_officialCard;
//
var meeting_bill;
//
var meeting_remark;

//年份
var year;
//申报单位名称
var unitName;
//项目名称
var projectName_1;
//项目类型
var projectType;

//项目负责人
var principal;
//联系人
var contact;
//联系电话
var tel;
//计划开始日期
var scheduledStartDate;
//计划完成日期
var scheduledCompletionDate;
//资金用途
var capitalUSES;

//资金总预算
var capitalBudget;
//项目当年预算
var projectBudget;
//同名项目上年预算表
var sameProjectNameBudgetNumForLastYear;
//同名项目上年执行数
var sameProjectNameExecutionNumForLastYear;

//预算执行率
var budgetExecutionRate;
//项目概况
var basicFacts;
//立项依据
var basisForProjectApproval;
//项目设立必要性
var necessityOfProjectEstablishment;
//保证项目实施的制度、措施
var ensureProjectImplementation;
//项目实施计划
var projectExecutionPlan;
//项目总目标
var generalObjectiveOfProject;
//年度绩效目标
var annualPerformanceTarget;
//需要说明的其他问题
var remark;

//分管领导意见,为填写内容
var adviceBranchLeader;
//分管领导意见填写时间
var timeAdviceBranchLeader;
//分管领导意见的历史记录
var historyAdviceBranchLeader;

//计划科科长意见,为填写内容
var adviceSectionChief;
//计划科科长意见填写时间
var timeAdviceSectionChief;
//计划科科长意见的历史记录
var historyAdviceSectionChief;

var canLaunch = ["科员"];
var canLaunchSelectBranch = ["科长"];
var canConfirm = [];
var canApprove = ["科长审批", "分管领导审批","计划科科长审批"];
var canReject = ["科长审批", "分管领导审批","计划科科长审批"];
var canSendBack = ["科长审批", "分管领导审批","计划科科长审批"];

function initDate() {
    laydate.render({
        elem: '#meetingDate',
        type: 'datetime'
    });
}


/**
 * 新建流程时的初始化流程内容数据
 */
function setNewData() {
    getLaunchSection(user.launchRole.name);
    if (isOperator && currentStep.indexOf("科员") > -1) {
        meetingUnit = launchSection;
    } else {
        meetingUnit = launchSection;
        meetingPerson = launcherName;
    }
    unitName="上海市嘉定区人民政府办公室";
    year = launchTime.split("-")[0]+1;
}


//发起身份变化对应函数
var launchRoleChange = function () {
    var cSelectStatus = $("#selectStatus");
    user.launchRole = user.launchRoleList[cSelectStatus.val()];
    if (user.launchRole.name.indexOf("科长") > -1) {
        currentStep = "科长发起";
    } else {
        currentStep = "科员发起";
    }
    getNextStep();
    $("#currentStep").text(currentStep);
    $("#nextStep").text(nextStep);
    //选择分管领导；
    if (isShowBranchSelect()) {
        $("#showSelectBranch").css("display", "inline");
    } else {
        $("#showSelectBranch").css("display", "none");
    }

    $("#launchSection").val(user.launchRole.name);
};

/**
 * 依据当前步骤生成下一步骤
 */
function getNextStep() {
    if(instance.isOperator){
        switch (currentStep) {
            case "科员发起":
                nextStep = "科长审批";
                break;
            case "科长审批":
                nextStep = "分管领导审批";
                break;
            case "分管领导审批":
                nextStep = "计划科科长审批";
                break;
            case "计划科科长审批":
                nextStep = "流程结束";
                break;
            default:
                break;
        }
    }else{
        instance.nextStep = instance.currentStep;
    }
}

/**
 * 判断是否需要获取分管领导
 */
function isAbleSelectBranch() {
    return nextStep == "分管领导审批";
}



/**
 * 判断是否需要显示选择分管领导
 */
function isShowBranchSelect() {
    return nextStep == "分管领导审批";
}

/**
 * 获取流程内容数据
 */
function getContentData(data) {
    applyDepartment = data.applyDepartment;
    projectName = data.projectName;
    projectNature = data.projectNature;
    projectClassify = data.projectClassify;
    amountAppliedForThisYear = data.amountAppliedForThisYear;
    budgetAmountForLastYear = data.budgetAmountForLastYear;
    actualExpenditureAmountForLastYear = data.actualExpenditureAmountForLastYear;
    secondLevel = data.secondLevel;
    thirdLevel = data.thirdLevel;

    firstQuarter = data.firstQuarter;
    secondQuarter = data.secondQuarter;
    thirdQuarter = data.thirdQuarter;
    fourthQuarter = data.fourthQuarter;
    cashAmount = data.cashAmount;
    cashContent = data.cashContent;
    projectBasis = data.projectBasis;
    projectContent = data.projectContent;

    year = data.year;
    unitName = data.unitName;
    projectName_1 = data.projectName_1;
    projectType = data.projectType;
    principal = data.principal;
    contact = data.contact;
    tel = data.tel;
    scheduledStartDate = data.scheduledStartDate;
    scheduledCompletionDate = data.scheduledCompletionDate;
    capitalUSES = data.capitalUSES;

    capitalBudget = data.capitalBudget;
    projectBudget = data.projectBudget;
    sameProjectNameBudgetNumForLastYear = data.sameProjectNameBudgetNumForLastYear;
    sameProjectNameExecutionNumForLastYear = data.sameProjectNameExecutionNumForLastYear;
    budgetExecutionRate = data.budgetExecutionRate;
    basicFacts = data.basicFacts;
    basisForProjectApproval = data.basisForProjectApproval;
    necessityOfProjectEstablishment = data.necessityOfProjectEstablishment;
    ensureProjectImplementation = data.ensureProjectImplementation;
    projectExecutionPlan = data.projectExecutionPlan;

    generalObjectiveOfProject = data.generalObjectiveOfProject;
    annualPerformanceTarget = data.annualPerformanceTarget;
    remark = data.remark;

    adviceBranchLeader = data.adviceBranchLeader;
    adviceSectionChief = data.adviceSectionChief;
}

/**
 * 获取需要提交服务器的流程控制
 */
function getControl() {
    return {};
}

/**
 * 检测需提交内容的合法性
 */
function trim(str) {
    return str.replace(/^\s+|\s+$/g, '');
}
function checkContent() {
    var num = 0;
    if (currentStep.indexOf("发起") > -1) {

    }
    return true;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent() {
    var content = {};

    var cApplyDepartment = $("#applyDepartment");
    var cProjectName = $("#projectName");
    var cProjectNature = $("#projectNature");
    var cProjectClassify = $("#projectClassify");
    var cAmountAppliedForThisYear = $("#amountAppliedForThisYear");
    var cBudgetAmountForLastYear = $("#budgetAmountForLastYear");
    var cActualExpenditureAmountForLastYear = $("#actualExpenditureAmountForLastYear");
    var cSecondLevel = $("#secondLevel");
    var cThirdLevel = $("#thirdLevel");

    var cFirstQuarter = $("#firstQuarter");
    var cSecondQuarter = $("#secondQuarter");
    var cThirdQuarter = $("#thirdQuarter");
    var cFourthQuarter = $("#fourthQuarter");
    var cCashAmount = $("#cashAmount");
    var cCashContent = $("#cashContent");
    var cProjectBasis = $("#projectBasis");
    var cProjectContent = $("#projectContent");

    var cYear = $("#year");
    var cUnitName = $("#unitName");
    var cProjectName_1 = $("#projectName_1");
    var cProjectType = $("#projectType");

    var cPrincipal = $("#principal");
    var cContact = $("#contact");
    var cTel = $("#tel");
    var cScheduledStartDate = $("#scheduledStartDate");

    var cScheduledCompletionDate = $("#scheduledCompletionDate");
    var cCapitalUSES = $("#capitalUSES");
    var cCapitalBudget = $("#capitalBudget");
    var cProjectBudget = $("#projectBudget");

    var cSameProjectNameBudgetNumForLastYear = $("#sameProjectNameBudgetNumForLastYear");
    var cSameProjectNameExecutionNumForLastYear = $("#sameProjectNameExecutionNumForLastYear");
    var cBudgetExecutionRate = $("#budgetExecutionRate");
    var cBasicFacts = $("#basicFacts");

    var cBasisForProjectApproval = $("#basisForProjectApproval");
    var cNecessityOfProjectEstablishment = $("#necessityOfProjectEstablishment");
    var cEnsureProjectImplementation = $("#ensureProjectImplementation");
    var cProjectExecutionPlan = $("#projectExecutionPlan");

    var cGeneralObjectiveOfProject = $("#generalObjectiveOfProject");
    var cAnnualPerformanceTarget = $("#annualPerformanceTarget");
    var cRemark = $("#remark");

    switch (currentStep) {
        case "科员发起":
            content.applyDepartment = cApplyDepartment.val();
            content.projectName = cProjectName.val();
            content.projectNature = cProjectNature.find("option:selected").text();
            content.projectClassify = cProjectClassify.find("option:selected").text();
            content.amountAppliedForThisYear = cAmountAppliedForThisYear.val();
            content.budgetAmountForLastYear = cBudgetAmountForLastYear.val();
            content.actualExpenditureAmountForLastYear = cActualExpenditureAmountForLastYear.val();
            content.secondLevel = cSecondLevel.val();
            content.thirdLevel = cThirdLevel.val();
            content.firstQuarter = cFirstQuarter.val();
            content.secondQuarter = cSecondQuarter.val();
            content.thirdQuarter = cThirdQuarter.val();
            content.fourthQuarter = cFourthQuarter.val();
            content.cashAmount = cCashAmount.val();
            content.cashContent = cCashContent.val();
            content.projectBasis = cProjectBasis.val();
            content.projectContent = cProjectContent.val();
            content.year = cYear.val();
            content.unitName = cUnitName.val();
            content.projectName_1 = cProjectName_1.val();
            content.projectType = cProjectType.find("option:selected").text();
            content.principal = cPrincipal.val();
            content.contact = cContact.val();
            content.tel = cTel.val();
            content.scheduledStartDate = cScheduledStartDate.val();
            content.scheduledCompletionDate = cScheduledCompletionDate.val();
            content.capitalUSES = cCapitalUSES.find("option:selected").text();
            content.capitalBudget = cCapitalBudget.val();
            content.projectBudget = cProjectBudget.val();
            content.sameProjectNameBudgetNumForLastYear = cSameProjectNameBudgetNumForLastYear.val();
            content.sameProjectNameExecutionNumForLastYear = cSameProjectNameExecutionNumForLastYear.val();
            content.budgetExecutionRate = cBudgetExecutionRate.val();
            content.basicFacts = cBasicFacts.val();
            content.basisForProjectApproval = cBasisForProjectApproval.val();
            content.necessityOfProjectEstablishment = cNecessityOfProjectEstablishment.val();
            content.ensureProjectImplementation = cEnsureProjectImplementation.val();
            content.projectExecutionPlan = cProjectExecutionPlan.val();
            content.generalObjectiveOfProject = cGeneralObjectiveOfProject.val();
            content.annualPerformanceTarget = cAnnualPerformanceTarget.val();
            content.remark = cRemark.val();
            content.signatureStaff = user.ID;
            break;
        case "科长审批":
           // content.meetingPerson = cMeetingPerson.val();
            content.signatureSection = user.ID;
            break;
        case "分管领导审批":
            content.adviceBranchLeader = $("#adviceBranchLeader").val();
            content.signatureBranchLeader = user.ID;
            content.timeAdviceBranchLeader = new Date().toLocaleDateString();
            break;
        case "计划科科长审批":
            content.adviceSectionChief = $("#adviceSectionChief").val();
            content.signatureSectionChief = user.ID;
            content.timeAdviceSectionChief = new Date().toLocaleDateString();
            break;
    }
    return content;
}

/**
 * 初始化流程内容控件
 */
function initContentControl() {
    var cApplyDepartment = $("#applyDepartment");
    var cProjectName = $("#projectName");
    var cProjectNature = $("#projectNature");
    var cProjectClassify = $("#projectClassify");
    var cAmountAppliedForThisYear = $("#amountAppliedForThisYear");
    var cBudgetAmountForLastYear = $("#budgetAmountForLastYear");
    var cActualExpenditureAmountForLastYear = $("#actualExpenditureAmountForLastYear");
    var cSecondLevel = $("#secondLevel");
    var cThirdLevel = $("#thirdLevel");
    var cFirstQuarter = $("#firstQuarter");
    var cSecondQuarter = $("#secondQuarter");
    var cThirdQuarter = $("#thirdQuarter");
    var cFourthQuarter = $("#fourthQuarter");
    var cCashAmount = $("#cashAmount");
    var cCashContent = $("#cashContent");
    var cProjectBasis = $("#projectBasis");
    var cProjectContent = $("#projectContent");

    var cYear = $("#year");
    var cUnitName = $("#unitName");
    var cProjectName_1 = $("#projectName_1");
    var cProjectType = $("#projectType");
    var cPrincipal = $("#principal");
    var cContact = $("#contact");
    var cTel = $("#tel");
    var cScheduledStartDate = $("#scheduledStartDate");
    var cScheduledCompletionDate = $("#scheduledCompletionDate");
    var cCapitalUSES = $("#capitalUSES");
    var cCapitalBudget = $("#capitalBudget");
    var cProjectBudget = $("#projectBudget");
    var cSameProjectNameBudgetNumForLastYear = $("#sameProjectNameBudgetNumForLastYear");
    var cSameProjectNameExecutionNumForLastYear = $("#sameProjectNameExecutionNumForLastYear");
    var cBudgetExecutionRate = $("#budgetExecutionRate");
    var cBasicFacts = $("#basicFacts");
    var cBasisForProjectApproval = $("#basisForProjectApproval");
    var cNecessityOfProjectEstablishment = $("#necessityOfProjectEstablishment");
    var cEnsureProjectImplementation = $("#ensureProjectImplementation");
    var cProjectExecutionPlan = $("#projectExecutionPlan");
    var cGeneralObjectiveOfProject = $("#generalObjectiveOfProject");
    var cAnnualPerformanceTarget = $("#annualPerformanceTarget");
    var cRemark = $("#remark");

    cApplyDepartment.val(applyDepartment);
    cProjectName.val(projectName);
    cProjectNature.val(projectNature);
    cProjectClassify.val(projectClassify);
    cAmountAppliedForThisYear.val(amountAppliedForThisYear);
    cBudgetAmountForLastYear.val(budgetAmountForLastYear);
    cActualExpenditureAmountForLastYear.val(actualExpenditureAmountForLastYear);
    cSecondLevel.val(secondLevel);
    cThirdLevel.val(thirdLevel);
    cFirstQuarter.val(firstQuarter);
    cSecondQuarter.val(secondQuarter);
    cThirdQuarter.val(thirdQuarter);
    cFourthQuarter.val(fourthQuarter);
    cCashAmount.val(cashAmount);
    cCashContent.val(cashContent);
    cProjectBasis.val(projectBasis);
    cProjectContent.val(projectContent);

    cYear.val(year);
    cUnitName.val(unitName);
    cProjectName_1.val(projectName_1);
    cProjectType.val(projectType);
    cPrincipal.val(principal);
    cContact.val(contact);
    cTel.val(tel);
    cScheduledStartDate.val(scheduledStartDate);
    cScheduledCompletionDate.val(scheduledCompletionDate);
    cCapitalUSES.val(capitalUSES);
    cCapitalBudget.val(capitalBudget);
    cProjectBudget.val(projectBudget);
    cSameProjectNameBudgetNumForLastYear.val(sameProjectNameBudgetNumForLastYear);
    cSameProjectNameExecutionNumForLastYear.val(sameProjectNameExecutionNumForLastYear);
    cBudgetExecutionRate.val(budgetExecutionRate);
    cBasicFacts.val(basicFacts);
    cBasisForProjectApproval.val(basisForProjectApproval);
    cNecessityOfProjectEstablishment.val(necessityOfProjectEstablishment);
    cEnsureProjectImplementation.val(ensureProjectImplementation);
    cProjectExecutionPlan.val(projectExecutionPlan);
    cGeneralObjectiveOfProject.val(generalObjectiveOfProject);
    cAnnualPerformanceTarget.val(annualPerformanceTarget);
    cRemark.val(remark);

    if (isOperator && isLaunch) {

    } else {
        cApplyDepartment.attr("readonly", true);
        cProjectName.attr("readonly", true);
        cProjectNature.attr("readonly", true);
        cProjectClassify.attr("readonly", true);
        cAmountAppliedForThisYear.attr("readonly", true);
        cBudgetAmountForLastYear.attr("readonly", true);
        cActualExpenditureAmountForLastYear.attr("readonly", true);
        cSecondLevel.attr("readonly", true);
        cThirdLevel.attr("readonly", true);
        cFirstQuarter.attr("readonly", true);
        cSecondQuarter.attr("readonly", true);
        cThirdQuarter.attr("readonly", true);
        cFourthQuarter.attr("readonly", true);
        cCashAmount.attr("readonly", true);
        cCashContent.attr("readonly", true);
        cProjectBasis.attr("readonly", true);
        cProjectContent.attr("readonly", true);

        cYear.attr("readonly", true);
        cUnitName.attr("readonly", true);
        cProjectName_1.attr("readonly", true);
        cProjectType.attr("readonly", true);
        cPrincipal.attr("readonly", true);
        cContact.attr("readonly", true);
        cTel.attr("readonly", true);
        cScheduledStartDate.attr("readonly", true);
        cScheduledCompletionDate.attr("readonly", true);
        cCapitalUSES.attr("readonly", true);
        cCapitalBudget.attr("readonly", true);
        cProjectBudget.attr("readonly", true);
        cSameProjectNameBudgetNumForLastYear.attr("readonly", true);
        cSameProjectNameExecutionNumForLastYear.attr("readonly", true);
        cBudgetExecutionRate.attr("readonly", true);
        cBasicFacts.attr("readonly", true);
        cBasisForProjectApproval.attr("readonly", true);
        cNecessityOfProjectEstablishment.attr("readonly", true);
        cEnsureProjectImplementation.attr("readonly", true);
        cProjectExecutionPlan.attr("readonly", true);
        cGeneralObjectiveOfProject.attr("readonly", true);
        cAnnualPerformanceTarget.attr("readonly", true);
        cRemark.attr("readonly", true);
    }
    //会议类别
    var cMeetingType = $("#meetingType");
    if (projectType != null) {
        cProjectType.find("option:contains(" + projectType + ")").attr("selected", true);
    }
    if (capitalUSES != null) {
        cCapitalUSES.find("option:contains(" + capitalUSES + ")").attr("selected", true);
    }
    if (isOperator && isLaunch) {
        // $("#hintMeetingType").text("（用章类别为必选项）");
    } else {
        cProjectType.prop("disabled", true);
        cCapitalUSES.prop("disabled", true);
    }


    //分管领导审批信息显示控制
    var cAdviceBranchLeader = $("#adviceBranchLeader");
    cAdviceBranchLeader.val(adviceBranchLeader);
    if (isOperator && currentStep == "分管领导审批") {
        $("#hintAdviceBranchLeader").text("（填写审批意见，默认为‘同意’）");
    } else {
        cAdviceBranchLeader.attr("readonly", true);
    }
    var cHistoryAdviceBranchLeader = $("#historyAdviceBranchLeader");
    cHistoryAdviceBranchLeader.click(function () {
        dialog(historyAdviceBranchLeader);
    });
    if (historyAdviceBranchLeader == null) {
        cHistoryAdviceBranchLeader.css("display", "none");
    }
    //计划科科长审批信息显示控制
    var cAdviceSectionChief = $("#adviceSectionChief");
    cAdviceSectionChief.val(adviceSectionChief);
    if (isOperator && currentStep == "分管领导审批") {
        $("#hintAdviceSectionChief").text("（填写审批意见，默认为‘同意’）");
    } else {
        cAdviceSectionChief.attr("readonly", true);
    }
    var cHistoryAdviceSectionChief = $("#historyAdviceSectionChief");
    cHistoryAdviceSectionChief.click(function () {
        dialog(historyAdviceSectionChief);
    });
    if (historyAdviceSectionChief == null) {
        cHistoryAdviceSectionChief.css("display", "none");
    }

}
/**
 * 根据用户角色判断科室
 */
function getLaunchSection(userRole) {
    launchSection = userRole;
    if (launchSection.indexOf("科长") >= 0 || launchSection.indexOf("科员") >= 0) {
        launchSection = launchSection.substring(0, launchSection.length - 2);
    }
}

$(document).ready(
    function init() {
        initSize($("#workArea"),1.0);
        initDate();
        initData("projectBudgetApplication");
        initControlControl();
        initContentControl();
    }
);