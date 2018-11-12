/**
 * Created by Revan on 2017/9/5.
 */
//可发起角色列表
var canLaunch = ["行政办科长","党委办科长","转发会议通知发起人"];

//会议起始时间
var meetingTimeFrom;
//会议结束时间
var meetingTimeTo;
//会议名称名称
var meetingName;
//会议室
var meetingRoom;
//会议备注
var meetingComment;
//备注
var changeReason;
//人员列表
var allPersonList = [];
//出席人员列表
var attendList = [];
//审批轮数
var round;
//邀请列表
var inviteList = [];
//拒绝参加列表
var rejectList = [];
//下次审批人员列表
var approveList = [];
//变化情况
var changeDetail = [];

/**
 * 依据当前步骤生成下一步骤
 */
function getNextStep() {
    if(instance.isOperator){
        switch (instance.currentStep){
            case "发起流程":
                instance.nextStep = "审批人审批";
                break;
            case "审批人审批":
                instance.nextStep = "意见统和";
                break;
        }
    }else{
        instance.nextStep = instance.currentStep;
    }
    if(instance.status == "已关闭"){
        instance.currentStep = "已关闭";
    }
}

/**
 * 新建流程时的初始化流程内容数据
 */
function setNewData() {}

/**
 * 发起身份变化对应函数
 */
function launchRoleChange() {
    var cSelectStatus = $("#selectStatus");
    user.launchRole.id = cSelectStatus.val();
    user.launchRole.name = cSelectStatus.find("option:selected").text();
    instance.launcherSection = getUserSection(user.launchRole.name);
}

/**
 * 获取需要提交服务器的流程控制
 */
function getMoreControl(controlInfo){
    controlInfo.approve = approveList;
    return controlInfo;
}

/**
 * 获取流程内容数据
 */
function getContentData(data) {
    meetingTimeFrom = data.meetingTimeFrom;
    meetingTimeTo = data.meetingTimeTo;
    meetingName = data.meetingName;
    meetingRoom = data.meetingRoom;
    meetingComment = data.meetingComment;
    attendList = data.attendList;
    round = data.round;
    changeDetail = data.changeDetail;
    fileList = data.fileList;
}

/**
 * 检测需提交内容的合法性
 */
function checkContent() {
    var isCorrect = true;
    if(instance.currentStep == "发起流程"){
        isCorrect = checkNotNull($("#meetingName").val(),$("#hintMeetingName")) && isCorrect;
        isCorrect = checkNotNull($("#meetingRoom").val(),$("#hintMeetingRome")) && isCorrect;
        var timeFrom = $("#meetingTimeFrom").val();
        var timeTo = $("#meetingTimeTo").val();
        var timeHint = $("#hintMeetingTime");
        var tempCorrect = true;
        tempCorrect = checkNotNullTimeDate(timeFrom,timeHint);
        tempCorrect = checkNotNullTimeDate(timeTo,timeHint) && tempCorrect;
        isCorrect = isCorrect && tempCorrect;
        if(tempCorrect){
            isCorrect = checkTimeRight(timeFrom,timeTo,timeHint) && isCorrect;
        }
        isCorrect = checkNotNullArray(attendList.length, $("#hintForMeetingPerson")) && isCorrect;
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent(){
    var content = {};
    switch (instance.currentStep){
        case "发起流程":
            content.meetingTimeFrom = $("#meetingTimeFrom").val();
            content.meetingTimeTo = $("#meetingTimeTo").val();
            content.meetingName = $("#meetingName").val();
            content.meetingRoom = $("#meetingRoom").val();
            content.meetingComment = $("#meetingComment").val();
            content.attendList = inviteList;
            content.round = 1;
            content.changeDetail = [];
            break;
        default:
            content.inviteList = inviteList;
            content.rejectList = [];
            if($("#isAttend").val() == "no"){
                content.rejectList.push({
                    id:user.id,
                    name:user.name
                });
            }
            content.newChangeDetail = getNewChangeDetail();
            break;
    }
    content.fileList = fileList;
    return content;
}

/**
 * 初始化流程内容控件
 */
function initContentInterface(){
    //控制是否可关联流程
    var cRelateProcedure = $("#relateProcedure");
    cRelateProcedure.css("display", "none");
    var cTimeForm = $("#meetingTimeFrom");
    var cTimeTo = $("#meetingTimeTo");
    var cMeetingName = $("#meetingName");
    var cMeetingRoom = $("#meetingRoom");
    var cMeetingComment = $("#meetingComment");
    var cIsAttend = $("#isAttend");
    var cPersonName = $("#personName");
    var cChangeDetail = $("#meetingChange");
    cTimeForm.val(meetingTimeFrom);
    cTimeTo.val(meetingTimeTo);
    cMeetingName.val(meetingName);
    cMeetingRoom.val(meetingRoom);
    cMeetingComment.val(meetingComment);
    attendList.forEach(function (value) {
        var newPerson;
        newPerson = "<li><a class='name'>"+value.name+"</a></li>";
        if(instance.isOperator && value.id == user.id && instance.currentStep !="已关闭"){
            newPerson =
                "<li>" +
                "<a class='name'>"+value.name+"</a>" +
                "<a class='del' title='删除' data-id='"+value.id+"' onclick='deletePerson(this)'>㊀</a>" +
                "</li>";
            cIsAttend.val("yes");
        }
        $("#attendList").append(newPerson);
    });
    cIsAttend.change(function () {
        var isAttend = $(this).val();
        if(isAttend == "yes"){
            selectPerson(user.id,user.name);
        }else{
            $("#attendList").find("[data-id='"+user.id+"']").click();
        }
    });
    initPersonList();
    var cRoleType = $("#roleType");
    allPersonList.forEach(function (value, key) {
        var option = "<option value='" + key + "'>" + value.name + "</option>";
        cRoleType.append(option);
    });
    cRoleType.change(initControlPersonName);
    cRoleType.change();
    cPersonName.change(function () {
        selectPerson($(this).val(),$("option:selected", this).text());
        $(this).val(0);
    });
    changeReason = "";
    changeDetail.forEach(function (value) {
        if(value.round == round - 1){
            value.inviteList.forEach(function (inviter) {
                if(inviter.id == user.id){
                    changeReason += value.changeReason + " ";
                }
            });
        }
        var describe = value.user.name + " ";
        describe += value.isGo?"确认":"不能";
        describe += "参加会议。";
        if(value.inviteList.length > 0){
            describe += "并邀请 ";
            value.inviteList.forEach(function (attender) {
                describe += attender.name + " ";
            });
            describe += "参加。";
        }
        cChangeDetail.append(describe + "\r\n");
    });
    if(instance.isOperator && instance.currentStep == "发起流程"){
        cTimeForm.attr("readonly",false);
        cTimeForm.removeClass("disableDate");
        cTimeForm.addClass("date");
        laydate.render({
            elem: '#meetingTimeFrom',
            min: new Date().getTime(),
            type: 'datetime',
            done: function (value,date) {
                changeMinTime(cMeetingTimeTo,date);
            }
        });
        cTimeTo.attr("readonly",false);
        cTimeTo.removeClass("disableDate");
        cTimeTo.addClass("date");
        var cMeetingTimeTo = laydate.render({
            elem: '#meetingTimeTo',
            type: 'datetime',
            min: new Date().getTime()
        });
        cMeetingName.attr("readonly",false);
        cMeetingName.removeClass("disable");
        cMeetingName.addClass("default");
        cMeetingRoom.attr("readonly",false);
        cMeetingRoom.removeClass("disable");
        cMeetingRoom.addClass("default");
        cMeetingComment.attr("readonly",false);
        cMeetingComment.removeClass("disable");
        cMeetingComment.addClass("default");
        $("#showReturnReason").css("display","none");
    }
    if(instance.isOperator && instance.currentStep != "已关闭"){
        if(instance.currentStep != "发起流程"){
            $("#showIsAttend").css("display","inline");
        }
        var cMeetingReason = $("#meetingChangeReason");
        cMeetingReason.attr("placeholder",changeReason);
        cMeetingReason.attr("readonly",false);
        cMeetingReason.removeClass("disable");
        cMeetingReason.addClass("default");
    }else{
        $("#showPersonSelect").css("display","none");
        $("#showReturnReason").css("display","none");
    }
    if(user.id != instance.launcherID || instance.isLaunch){
        $(".showReturnDetail").css("display","none");
    }
    updatePersonCount();
}

$(document).ready(
    function init() {
        initCommon("forwardMeetingNotice");
        initContentInterface();
    }
);

function initPersonList() {
    getPersonList(callbackGetPerson);
}

var callbackGetPerson = function (data) {
    var main = {
        name : "主要领导",
        person : []
    };
    var branch = {
        name : "分管领导",
        person : []
    };
    var section = {
        name : "科长",
        person : []
    };
    var clerk = {
        name : "科员",
        person : []
    };
    data.forEach(function (value) {
        switch (value.position){
            case "主要领导":
                main.person.push({id:value.id,name:value.name});
                break;
            case "分管领导":
                branch.person.push({id:value.id,name:value.name});
                break;
            case "科长":
                section.person.push({id:value.id,name:value.name});
                break;
            case "科员":
                clerk.person.push({id:value.id,name:value.name});
                break;
        }
    });
    allPersonList = [];
    allPersonList.push(main);
    allPersonList.push(branch);
    allPersonList.push(section);
    allPersonList.push(clerk);
};

/**
 *初始化人员可选人员名称控件
 */
function initControlPersonName(){
    var cPersonName = $("#personName");
    var rolePersonList = allPersonList[$("#roleType").val()].person;
    $("option", cPersonName).remove();
    cPersonName.append("<option value='0'>请选择...</option>");
    rolePersonList.forEach(function (value) {
        var option = "<option value='" + value.id + "'>" + value.name + "</option>";
        cPersonName.append(option);
    });
}

/**
 * 选择人员后操作
 */
function selectPerson(personID, personName) {
    var addTo = $("#attendList");
    var isContain = false;
    attendList.forEach(function (value) {
        if(value.id == personID){
            isContain = true;
        }
    });
    if(!isContain){
        var newPerson =
            "<li>" +
            "<a class='name'>"+personName+"</a>" +
            "<a class='del' title='删除' data-id='"+personID+"' onclick='deletePerson(this)'>㊀</a>" +
            "</li>";
        addTo.append(newPerson);
        var invitePerson = {id : personID, name : personName};
        attendList.push(invitePerson);
        if(personID != user.id){
            inviteList.push(invitePerson);
            approveList.push(personID);
        }else{
            $("#isAttend").val("yes");
        }
    }
    updatePersonCount();
}

/**
 * 使人员删除有效
 */
function deletePerson(el) {
    var personID = $(el).attr("data-id");
    $(el).parent().remove();
    if(personID == user.id){
        $("#isAttend").val("no");
    }
    var attendIDList = [];
    attendList.forEach(function (value) {
        attendIDList.push(value.id);
    });
    var position;
    position = $.inArray(personID, attendIDList);
    if(position > -1){
        attendList.splice(position,1);
    }
    var inviteIDList = [];
    inviteList.forEach(function (value) {
        inviteIDList.push(value.id);
    });
    position = $.inArray(personID, inviteIDList);
    if(position > -1){
        inviteList.splice(position,1);
    }
    position = $.inArray(personID, approveList);
    if(position > -1){
        approveList.splice(position,1);
    }
    updatePersonCount();
}

function updateChangeDetail() {
    // var cChangeDetail = $("#meetingChange");
    // cChangeDetail.empty();
    // if(instance.currentStep == "发起流程"){
    //     inviteList.forEach(function (value) {
    //         cChangeDetail.append("您邀请"+value.name+"参加会议。\r\n");
    //     });
    // }else{
    //     var isContain = false;
    //     attendList.forEach(function (value) {
    //         if(value.id == user.id){
    //             isContain = true;
    //         }
    //     });
    //     changeDetail.forEach(function (value) {
    //         value.operate.forEach(function (operate) {
    //             if(operate.type && operate.id == user.id){
    //                 if(isContain){
    //                     cChangeDetail.append("您接受了"+value.operateName+"的会议邀请。\r\n");
    //                 }else{
    //                     cChangeDetail.append("您拒绝了"+value.operateName+"的会议邀请。\r\n");
    //                 }
    //             }
    //         });
    //     });
    //     inviteList.forEach(function (value) {
    //         cChangeDetail.append("您邀请"+value.name+"参加会议。\r\n");
    //     });
    // }
}

function getNewChangeDetail() {
    // var newChangeDetail = {};
    // newChangeDetail.operateID = user.id;
    // newChangeDetail.operateName = user.name;
    // newChangeDetail.reason = $("#meetingChangeReason").val();
    // var operates = [];
    // var isContain = false;
    // attendList.forEach(function (value) {
    //     if(value.id == user.id){
    //         isContain = true;
    //     }
    // });
    // inviteList.forEach(function (value) {
    //     operates.push({type:true,id:value.id});
    // });
    // if(!isContain){
    //     changeDetail.forEach(function (value) {
    //         value.operate.forEach(function (operate) {
    //             if(operate.type && operate.id == user.id){
    //                 operates.push({type:false,id:value.operateID});
    //             }
    //         });
    //     });
    // }
    // newChangeDetail.operate = operates;
    // var result = [];
    // result.push(newChangeDetail);
    var newChangeDetail = {};
    newChangeDetail.round = round;
    newChangeDetail.user = {
        id:user.id,
        name:user.name
    };
    newChangeDetail.isGo = $("#isAttend").val() == "yes"?true:false;
    newChangeDetail.inviteList = inviteList;
    newChangeDetail.changeReason = $("#meetingChangeReason").val();
    return newChangeDetail;
}
//
// function getNewAttendList() {
//     var newAttendList = {};
//     var isContain = false;
//     attendList.forEach(function (value) {
//         if(value.id == user.id){
//             isContain = true;
//         }
//     });
//     newAttendList.selfGo = isContain;
//     newAttendList.selfID = user.id;
//     newAttendList.invite = inviteList;
//     return newAttendList
// }

function updatePersonCount() {
    $("#showAttendPerson").find("label").text("出席人员("+attendList.length+")");
}
