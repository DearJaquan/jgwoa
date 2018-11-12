/**
 * Created by DingFengwu on 2017/10/12.
 */

/****************************以下内容为流程控制变量****************************/
//可发起角色列表
var canLaunch = ["科长"];

/****************************以下内容为流程内容变量****************************/
//申请科室
var applyDepartment;
//时间
var applyDate;
//事项名称
var itemName;
//项目属性
var projectProperty;
//党工委会议时间
var partyMeetingDate;
//党工委会议地点
var partyMeetingPlace;
//会议出席人员
var conferenceAttendees;
//会议主要内容
var meetingContent;
//会议结果
var meetingResult;
//签名列表
var signatureList;

//分管领导意见,为填写内容
var adviceBranchLeader;
//分管领导意见填写时间
var timeAdviceBranchLeader;
//分管领导意见的历史记录
var historyAdviceBranchLeader;

//主任办公室
var adviceExecutiveSection;
//主任办公室意见填写时间
var timeAdviceExecutiveSection;
//主任办公室意见的历史记录
var historyAdviceExecutiveSection;

//行政主要领导意见,为填写内容
var adviceAdminMainLeader;
//行政主要领导意见填写时间
var timeAdviceAdminMainLeader;
//行政主要领导意见的历史记录
var historyAdviceAdminMainLeader;

//党工委书记意见,为填写内容
var advicePartyMainLeader;
//党工委书记意见填写时间
var timeAdvicePartyMainLeader;
//党工委书记意见的历史记录
var historyAdvicePartyMainLeader;
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
                instance.nextStep = "主任办公会审批";
                break;
            case "主任办公会审批":
                instance.nextStep = "行政主要领导审批";
                break;
            case "行政主要领导审批":
                instance.nextStep = "党委办确认";
                break;
            case "党委办确认":
                instance.nextStep = "党工委书记审批";
                break;
            case "党工委书记审批":
                instance.nextStep = "党委办填写";
                break;
            case "党委办填写":
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
    applyDepartment = getUserSection(user.launchRole.name);
    applyDate = instance.launchTime.Format();
}

/**
 * 设置控制面板显示,不存在可不写
 */
function setControlData() {
    isAbleSelectBranch = instance.nextStep == "分管领导审批";
    isShowBranchSelect = instance.nextStep == "分管领导审批";
    isShowLaunchRoleSelect = instance.currentStep.indexOf("发起流程") > -1 && user.launchRoleList.length > 1;
}

/**
 * 发起身份变化对应函数
 */
function launchRoleChange() {
    var cSelectStatus = $("#selectStatus");
    user.launchRole.id = cSelectStatus.val();
    user.launchRole.name = cSelectStatus.find("option:selected").text();
    instance.launcherSection = getUserSection(user.launchRole.name);
    applyDepartment = instance.launcherSection;
    $("#applyDepartment").val(applyDepartment);
}

/**
 * 获取流程内容数据
 */
function getContentData(data) {
    applyDepartment = data.applyDepartment;
    applyDate = data.applyDate;
    itemName = data.itemName;
    switch (data.projectProperty){
        case "重大决策":
            projectProperty = "A";
            break;
        case "重要干部任免":
            projectProperty = "B";
            break;
        case "重大项目安排":
            projectProperty = "C";
            break;
        case "大额度资金使用":
            projectProperty = "D";
            break;
    }
    partyMeetingDate = data.partyMeetingDate;
    partyMeetingPlace = data.partyMeetingPlace;
    conferenceAttendees = data.conferenceAttendees;
    meetingContent = data.meetingContent;
    meetingResult = data.meetingResult;
    signatureList = data.signatureList;
    adviceBranchLeader = data.adviceBranchLeader;
    timeAdviceBranchLeader = data.timeAdviceBranchLeader;
    adviceExecutiveSection = data.adviceExecutiveSection;
    timeAdviceExecutiveSection = data.timeAdviceExecutiveSection;
    adviceAdminMainLeader = data.adviceAdminMainLeader;
    timeAdviceAdminMainLeader = data.timeAdviceAdminMainLeader;
    advicePartyMainLeader = data.advicePartyMainLeader;
    timeAdvicePartyMainLeader = data.timeAdvicePartyMainLeader;
    fileList = data.fileList;
    isBack = data.isBack;
}

function checkContent() {
    var isCorrect = true;
    if(instance.currentStep == "发起流程"){
        isCorrect = checkNotNull($("#itemName").val(),$("#hintItemName")) && isCorrect;
        isCorrect = checkNotNull($("input[name='projectProperty']:checked").val(),$("#hintProjectProperty")) && isCorrect;
    }
    if(instance.currentStep == "党委办填写"){
        isCorrect = checkRelateProcedure($("#hintFileList")) && isCorrect;
        isCorrect = checkNotNull($("#meetingContent").val(),$("#hintMeetingContent")) && isCorrect;
        isCorrect = checkNotNull($("#meetingResult").val(),$("#hintMeetingResult")) && isCorrect;
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent(){
    var content = {};
    var cApplyDepartment = $("#applyDepartment");
    var cApplyDate = $("#applyDate");
    var cItemName = $("#itemName");
    var cProjectProperty = $("input[name='projectProperty']:checked");
    var cPartyMeetingDate = $("#partyMeetingDate");
    var cPartyMeetingPlace = $("#partyMeetingPlace");
    var cConferenceAttendees = $("#conferenceAttendees");
    var cMeetingContent = $("#meetingContent");
    var cMeetingResult = $("#meetingResult");
    switch (instance.currentStep){
        case "发起流程":
            content.applyDepartment = cApplyDepartment.val();
            content.applyDate = cApplyDate.val();
            content.itemName = cItemName.val();
            switch (cProjectProperty.val()){
                case "A":
                    content.projectProperty = "重大决策";
                    break;
                case "B":
                    content.projectProperty = "重要干部任免";
                    break;
                case "C":
                    content.projectProperty = "重大项目安排";
                    break;
                case "D":
                    content.projectProperty = "大额度资金使用";
                    break;
            }
            content.signatureSection = user.id;
            content.timeAdviceSection = new Date().Format();
            break;
        case "分管领导审批":
            content.adviceBranchLeader = $("#adviceBranchLeader").val();
            content.adviceBranchLeader = "adviceBranchLeader";
            content.signatureBranchLeader = user.id;
            content.timeAdviceBranchLeader = $("#timeAdviceBranchLeader").text();
            break;
        case "主任办公会审批":
            content.adviceExecutiveSection = $("#adviceExecutiveSection").val();
            content.adviceExecutiveSection = "adviceExecutiveSection";
            content.signatureExecutiveSection = user.id;
            content.timeAdviceExecutiveSection = $("#timeAdviceExecutiveSection").text();
            break;
        case "行政主要领导审批":
            content.adviceAdminMainLeader = $("#adviceAdminMainLeader").val();
            content.adviceAdminMainLeader = "adviceAdminMainLeader";
            content.signatureAdminMainLeader = user.id;
            content.timeAdviceAdminMainLeader = $("#timeAdviceAdminMainLeader").text();
            break;
        case "党工委书记审批":
            content.advicePartyMainLeader = $("#advicePartyMainLeader").val();
            content.advicePartyMainLeader = "advicePartyMainLeader";
            content.signaturePartyMainLeader = user.id;
            content.timeAdvicePartyMainLeader = $("#timeAdvicePartyMainLeader").text();
            break;
        case "党委办填写":
            content.partyMeetingDate = cPartyMeetingDate.val();
            content.partyMeetingPlace = cPartyMeetingPlace.val();
            content.conferenceAttendees = conferenceAttendees;
            content.meetingContent = cMeetingContent.val();
            content.meetingResult = cMeetingResult.val();
            content.signatureList = signatureList;
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
    if(instance.isOperator){
        switch (instance.currentStep){
            case "主任办公会审批":
                cRelateProcedure.css("display", "inline");
                cRelateProcedure.click(function () {
                    getRelatedInstanceList("SME","行政办");
                });
                break;
            case "党委办填写":
                cRelateProcedure.css("display", "inline");
                cRelateProcedure.click(function () {
                    getRelatedInstanceList("SMP","党委办");
                });
                break;
        }
    }
    var cItemName = $("#itemName");
    var cApplyDepartment = $("#applyDepartment");
    var cApplyDate = $("#applyDate");
    var cPartyMeetingDate = $("#partyMeetingDate");
    var cPartyMeetingPlace = $("#partyMeetingPlace");
    var cConferenceAttendees = $("#conferenceAttendees");
    var cMeetingContent = $("#meetingContent");
    var cMeetingResult = $("#meetingResult");
    cItemName.val(itemName);
    $("#property"+projectProperty).attr('checked', 'checked');
    cApplyDepartment.val(applyDepartment);
    cApplyDate.val(applyDate);
    cPartyMeetingDate.val(partyMeetingDate);
    cPartyMeetingPlace.val(partyMeetingPlace);
    cMeetingContent.val(meetingContent);
    cMeetingResult.val(meetingResult);
    if(conferenceAttendees){
        conferenceAttendees.forEach(function (value) {
            cConferenceAttendees.append("<li><a class='name'>"+value.name+"</a></li>");
        });
        $("#showAttendPerson").find("label").text("会议出席人员("+conferenceAttendees.length+")");
    }
    if(instance.isOperator && instance.isLaunch){
        cItemName.attr("readonly",false);
        cItemName.removeClass("disable");
        cItemName.addClass("default");
        $("#propertyA").attr("disabled",false);
        $("#propertyB").attr("disabled",false);
        $("#propertyC").attr("disabled",false);
        $("#propertyD").attr("disabled",false);
    }
    if(instance.isOperator && instance.currentStep=="党委办填写"){
        cMeetingContent.attr("readonly",false);
        cMeetingContent.removeClass("disable");
        cMeetingContent.addClass("default");
        cMeetingResult.attr("readonly",false);
        cMeetingResult.removeClass("disable");
        cMeetingResult.addClass("default");
    }
    initBranchApproveControl(instance.currentStep == "分管领导审批",undefined);
    initExecutiveSectionApproveControl(instance.currentStep == "主任办公会审批",timeAdviceBranchLeader);
    initAdminMainApproveControl(instance.currentStep == "行政主要领导审批",timeAdviceExecutiveSection);
    initPartyMainApproveControl(instance.currentStep == "党工委书记审批",timeAdviceAdminMainLeader);
}


$(document).ready(
    function init() {
        initCommon("theTIOGMatterApply");
        initContentInterface();
    }
);

function clickOnSelectRelate(type) {
    $("#relateTableDetail").find(".app").click(function () {
        var selectID = $(this).attr("data-id");
        var selectList = [];
        selectList.push(selectID);
        switch (instance.currentStep){
            case "主任办公会审批":
                var callBack = function (data) {
                    createAttachmentProcedure(data[1]);
                };
                getRelatedInstanceDetail(selectList,type,"行政办",callBack);
                break;
            case "党委办填写":
                var callBack = function (data) {
                    createAttachmentProcedure(data[1]);
                    partyMeetingDate = data[0].meetingDate;
                    partyMeetingPlace = data[0].meetingRoom;
                    conferenceAttendees = data[0].attendList;
                    $("#partyMeetingDate").val(partyMeetingDate);
                    $("#partyMeetingPlace").val(partyMeetingPlace);
                    var cAttendList = $("#conferenceAttendees");
                    cAttendList.empty();
                    signatureList = [];
                    conferenceAttendees.forEach(function (value) {
                        cAttendList.append("<li><a class='name'>"+value.name+"</a></li>");
                        signatureList.push(value.id);
                    });
                    $("#showAttendPerson").find("label").text("会议出席人员("+conferenceAttendees.length+")");
                };
                getRelatedInstanceDetail(selectList,type,"党委办",callBack);
                break;
        }
        $("#maskHistory").click();
    });
}