/**
 * Created by feijiahui on 2018/3/11.
 */
/****************************以下内容为流程控制变量****************************/
//可发起角色列表
var canLaunch = ["办公室主任","行政办科员"];

/****************************以下内容为流程内容变量****************************/
//人员姓名
var staffName;
//所属部门
var section;
//所任职务
var duty;
//系统角色
var systemRole;
//备注
var remark;
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
                instance.nextStep = "行政办审批";
                break;
            case "行政办审批":
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
function setNewData() {}

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
    getNextStep();
    $("#nextStep").text(instance.nextStep);
    instance.launcherSection = getUserSection(user.launchRole.name);
    initSectionApproveControl(instance.nextStep == "分管领导审批",undefined);
    $("#confirm").parent().empty();
    isShowBranchSelect = instance.nextStep == "分管领导审批";
    initOperateInterface();
}

/**
 * 获取流程内容数据
 */
function getContentData(data) {
    staffName = data.staffName;
    section = data.section;
    duty = data.duty;
    systemRole=data.systemRole;
    remark = data.remark;
    adviceSection = data.adviceSection;
    timeAdviceSection = data.timeAdviceSection;
    adviceBranchLeader = data.adviceBranchLeader;
    timeAdviceBranchLeader = data.timeAdviceBranchLeader;
    fileList = data.fileList;
    isBack = data.isBack;
}

function checkContent() {
    var isCorrect = true;
    if(instance.currentStep.indexOf("发起")>-1){
        isCorrect = checkNotNull($("#staffName").val(),$("#hintStaffName")) && isCorrect;
        isCorrect = checkNotNull($("#section").val(),$("#hintSection")) && isCorrect;
        isCorrect = checkNotNull($("#duty").val(),$("#hintDuty")) && isCorrect;
        isCorrect = checkNotNull($("#systemRole").val(),$("#hintSystemRole")) && isCorrect;
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent(){
    var content = {};
    var cStaffName = $("#staffName");
    var cSection = $("#section");
    var cDuty = $("#duty");
    var cSystemRole = $("#systemRole");
    var cRemark = $("#remark");
    switch (instance.currentStep){
        case "发起流程":
            content.staffName = cStaffName.val();
            content.section = cSection.val();
            content.duty = cDuty.val();
            content.systemRole = cSystemRole.val();
            content.remark = cRemark.val();
            content.signatureStaff = user.id;
            content.timeAdviceStaff = new Date().Format();
            break;
        case "行政办审批":
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
function initContentInterface() {
    var cRelateProcedure = $("#relateProcedure");
    cRelateProcedure.css("display", "none");
    var cStaffName = $("#staffName");
    var cSection = $("#section");
    var cDuty = $("#duty");
    var cSystemRole = $("#systemRole");
    var cRemark = $("#remark");
    cStaffName.val(staffName);
    cSection.val(section);
    cDuty.val(duty);
    initRoleList();
    systemRole && cSystemRole.val(systemRole);
    cRemark.val(remark);
    if (instance.isOperator && instance.isLaunch) {
        cStaffName.attr("readonly", false);
        cStaffName.removeClass("disable");
        cStaffName.addClass("default");
        cSection.attr("readonly", false);
        cSection.removeClass("disable");
        cSection.addClass("default");
        cDuty.attr("readonly", false);
        cDuty.removeClass("disable");
        cDuty.addClass("default");
        cSystemRole.removeAttr("disabled");
        cSystemRole.removeClass("disable");
        cSystemRole.addClass("default");
        cRemark.attr("readonly", false);
        cRemark.removeClass("disable");
        cRemark.addClass("default");
    }
    initSectionApproveControl(instance.nextStep == "分管领导审批", undefined);//科长审批信息显示控制
    initBranchApproveControl(instance.currentStep == "分管领导审批", timeAdviceSection);//分管领导审批信息显示控制
}

/**
 *初始化可选角色列表控件
 */
function initRoleList() {
    getRoleList(callbackGetRole);
}

var callbackGetRole = function (data) {
    var cSystemRole = $("#systemRole");
    $("option", cSystemRole).remove();
    cSystemRole.append("<option value='0'>请选择...</option>");
    var obj = JSON.parse(data);
    obj.forEach(function (value){
        var option = "<option value='" + value.id + "'>" + value.name + "</option>";
        cSystemRole.append(option);
    })
};

$(document).ready(
    function init() {
        initCommon("personnelRequisition");
        initContentInterface();
    }
);