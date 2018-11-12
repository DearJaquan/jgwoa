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
//执行开始时间
var executeTimeFrom;
//执行结束时间
var executeTimeTo;
//执行情况
var executeDetail;
//党工委会议时间
var partyMeetingDate;
//党工委会议地点
var partyMeetingPlace;
//会议出席人员
var conferenceAttendees;
//签名列表
var signatureList;
//是否关联发起
var isRelateLaunch = false;

//分管领导意见,为填写内容
var adviceBranchLeader;
//分管领导意见填写时间
var timeAdviceBranchLeader;
//分管领导意见的历史记录
var historyAdviceBranchLeader;

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
                instance.nextStep = "纪工委确认";
                break;
            case "纪工委确认":
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
    var relate = getParameter("relate");
    if(relate){
        isRelateLaunch = true;
        var callBack = function (value) {
            for(var i=1; i<value.length; i++){
                fileList.push({
                    id:value[i].instanceID,
                    name:value[i].name,
                    path:value[i].type,
                    step:instance.currentStep,
                    type:"procedure",
                    time:new Date().getTime()
                });
            }
            itemName = value[0].itemName;
            switch (value[0].projectProperty){
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
            instance.launcherSection = value[0].department;
        };
        var selectList = [];
        selectList.push(relate);
        getRelatedInstanceDetail(selectList,"SES",getUserSection(user.launchRole.name),callBack);
    }
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
    executeTimeFrom = data.executeTimeFrom;
    executeTimeTo = data.executeTimeTo;
    executeDetail = data.executeDetail;
    partyMeetingDate = data.partyMeetingDate;
    partyMeetingPlace = data.partyMeetingPlace;
    conferenceAttendees = data.conferenceAttendees;
    signatureList = data.signatureList;
    adviceBranchLeader = data.adviceBranchLeader;
    timeAdviceBranchLeader = data.timeAdviceBranchLeader;
    adviceAdminMainLeader = data.adviceAdminMainLeader;
    timeAdviceAdminMainLeader = data.timeAdviceAdminMainLeader;
    advicePartyMainLeader = data.advicePartyMainLeader;
    timeAdvicePartyMainLeader = data.timeAdvicePartyMainLeader;
    fileList = data.fileList;
    isRelateLaunch = data.isRelateLaunch;
    isBack = data.isBack;
}

function checkContent() {
    var isCorrect = true;
    if(instance.currentStep == "发起流程"){
        isCorrect = checkRelateProcedure($("#hintFileList")) && isCorrect;
        isCorrect = checkNotNull($("#executeDetail").val(),$("#hintExecuteDetail")) && isCorrect;
        var timeFrom = $("#executeTimeFrom").val();
        var timeTo = $("#executeTimeTo").val();
        var timeHint = $("#hintExecuteTimeFrom");
        var tempCorrect = true;
        tempCorrect = checkNotNullTimeDate(timeFrom,timeHint);
        tempCorrect = checkNotNullTimeDate(timeTo,timeHint) && tempCorrect;
        isCorrect = isCorrect && tempCorrect;
        if(tempCorrect){
            isCorrect = checkTimeRight(timeFrom,timeTo,timeHint) && isCorrect;
        }
    }
    if(instance.currentStep == "党委办填写"){
        isCorrect = checkNotNullTimeDate($("#partyMeetingDate").val(),$("#hintPartyMeetingDate")) && isCorrect;
        isCorrect = checkNotNull($("#partyMeetingPlace").val(),$("#hintPartyMeetingPlace")) && isCorrect;
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
    var cExecuteTimeFrom = $("#executeTimeFrom");
    var cExecuteTimeTo = $("#executeTimeTo");
    var cExecuteDetail = $("#executeDetail");
    var cPartyMeetingDate = $("#partyMeetingDate");
    var cPartyMeetingPlace = $("#partyMeetingPlace");
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
            content.executeTimeFrom = cExecuteTimeFrom.val();
            content.executeTimeTo = cExecuteTimeTo.val();
            content.executeDetail = cExecuteDetail.val();
            content.signatureSection = user.id;
            content.timeAdviceSection = new Date().Format();
            content.isRelateLaunch = isRelateLaunch;
            break;
        case "分管领导审批":
            content.adviceBranchLeader = $("#adviceBranchLeader").val();
            content.historyAdviceBranchLeader = "adviceBranchLeader";
            content.signatureBranchLeader = user.id;
            content.timeAdviceBranchLeader = $("#timeAdviceBranchLeader").text();
            break;
        case "行政主要领导审批":
            content.adviceAdminMainLeader = $("#adviceAdminMainLeader").val();
            content.historyAdviceAdminMainLeader = "adviceAdminMainLeader";
            content.signatureAdminMainLeader = user.id;
            content.timeAdviceAdminMainLeader = $("#timeAdviceAdminMainLeader").text();
            break;
        case "党工委书记审批":
            content.advicePartyMainLeader = $("#advicePartyMainLeader").val();
            content.historyAdvicePartyMainLeader = "advicePartyMainLeader";
            content.signaturePartyMainLeader = user.id;
            content.timeAdvicePartyMainLeader = $("#timeAdvicePartyMainLeader").text();
            break;
        case "党委办填写":
            content.partyMeetingDate = cPartyMeetingDate.val();
            content.partyMeetingPlace = cPartyMeetingPlace.val();
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
            case "发起流程":
                $("[name='delete']",$("[data-type='procedure']",$("#fileList"))).css("display","none");
                break;
            case "党委办填写":
                cRelateProcedure.css("display", "inline");
                cRelateProcedure.click(function () {
                    getRelatedInstanceList("SEM","党委办");
                });
                break;
        }
    }
    if(isRelateLaunch && instance.isOperator && instance.isLaunch){
        user.launchRoleList.forEach(function (role) {
            if(role.name.indexOf(instance.launcherSection)>-1){
                user.launchRole.id = role.id;
                user.launchRole.name = role.name;
            }
        });
        var cSelectStatus = $("#selectStatus");
        cSelectStatus.addClass("disableDepartment");
        cSelectStatus.attr("disabled",true);
    }
    var cItemName = $("#itemName");
    var cApplyDepartment = $("#applyDepartment");
    var cApplyDate = $("#applyDate");
    var cExecuteTimeFrom = $("#executeTimeFrom");
    var cExecuteTimeTo = $("#executeTimeTo");
    var cExecuteDetail = $("#executeDetail");
    var cPartyMeetingDate = $("#partyMeetingDate");
    var cPartyMeetingPlace = $("#partyMeetingPlace");
    var cConferenceAttendees = $("#conferenceAttendees");
    cItemName.val(itemName);
    $("#property"+projectProperty).attr('checked', 'checked');
    cApplyDepartment.val(applyDepartment);
    cApplyDate.val(applyDate);
    cExecuteTimeFrom.val(executeTimeFrom);
    cExecuteTimeTo.val(executeTimeTo);
    cExecuteDetail.val(executeDetail);
    cPartyMeetingDate.val(partyMeetingDate);
    cPartyMeetingPlace.val(partyMeetingPlace);
    if(conferenceAttendees){
        conferenceAttendees.forEach(function (value) {
            cConferenceAttendees.append("<li><a class='name'>"+value.name+"</a></li>");
        });
        $("#showAttendPerson").find("label").text("会议出席人员("+conferenceAttendees.length+")");
    }
    if(instance.isOperator && instance.isLaunch){
        cExecuteTimeFrom.attr("readonly",false);
        cExecuteTimeFrom.removeClass("disable");
        cExecuteTimeFrom.addClass("longDate");
        laydate.render({
            elem: '#executeTimeFrom',
            max: 0,
            type: 'datetime',
            done: function (value,date) {
                changeMinTime(cMeetingTimeTo,date);
            }
        });
        cExecuteTimeTo.attr("readonly",false);
        cExecuteTimeTo.removeClass("disable");
        cExecuteTimeTo.addClass("longDate");
        var cMeetingTimeTo = laydate.render({
            elem: '#executeTimeTo',
            max: 0,
            type: 'datetime'
        });
        cExecuteDetail.attr("readonly",false);
        cExecuteDetail.removeClass("disable");
        cExecuteDetail.addClass("default");
    }
    initBranchApproveControl(instance.currentStep == "分管领导审批",undefined);
    initAdminMainApproveControl(instance.currentStep == "行政主要领导审批",timeAdviceBranchLeader);
    initPartyMainApproveControl(instance.currentStep == "党工委书记审批",timeAdviceAdminMainLeader);
}


$(document).ready(
    function init() {
        initCommon("theTIOGMatterExecution");
        initContentInterface();
    }
);

function clickOnSelectRelate(type) {
    $("#relateTableDetail").find(".app").click(function () {
        var selectID = $(this).attr("data-id");
        var selectList = [];
        selectList.push(selectID);
        switch (instance.currentStep){
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