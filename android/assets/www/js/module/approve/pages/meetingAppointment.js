/**
 * Created by Revan on 2017/9/5.
 */
//可发起角色列表
var canLaunch = ["科长","科员","分管领导","主要领导"];

//会议起始时间
var meetingTimeFrom;
//会议结束时间
var meetingTimeTo;
//会议名称名称
var meetingName;
//会议室
var meetingRoom;
//备注
var meetingComment;
//人员列表
var allPersonList = [];
//出席人员列表
var attendList = [];
//列席人员列表
var observeList = [];

/**
 * 依据当前步骤生成下一步骤
 */
function getNextStep() {
    if(instance.isOperator){
        switch (instance.currentStep){
            case "发起流程":
                instance.nextStep = "系统检测";
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
 * 发起身份变化对应函数
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
    meetingTimeFrom = data.meetingTimeFrom;
    meetingTimeTo = data.meetingTimeTo;
    meetingName = data.meetingName;
    meetingRoom = data.meetingRoom;
    meetingComment = data.meetingComment;
    attendList = data.attendList;
    observeList = data.observeList;
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
        isCorrect = checkNotNullTimeDate(timeFrom,timeHint) && isCorrect;
        isCorrect = checkNotNullTimeDate(timeTo,timeHint) && isCorrect;
        isCorrect = checkTimeRight(timeFrom,timeTo,timeHint) && isCorrect;
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
            content.attendList = attendList;
            content.observeList = observeList;
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
    cTimeForm.val(meetingTimeFrom);
    cTimeTo.val(meetingTimeTo);
    cMeetingName.val(meetingName);
    meetingRoom && cMeetingRoom.val(meetingRoom);
    cMeetingComment.val(meetingComment);
    attendList.forEach(function (value) {
        $("#attendList").append("<li><a class='name'>"+value.name+"</a></li>");
    });
    observeList.forEach(function (value) {
        $("#observeList").append("<li><a class='name'>"+value.name+"</a></li>");
    });
    $("#showPersonSelect").css("display","none");
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
        cMeetingRoom.removeAttr("disabled");
        cMeetingRoom.removeClass("disable");
        cMeetingRoom.addClass("default");
        $("#showPersonSelect").css("display","table-row");
        initPersonList();
        var cRoleType = $("#roleType");
        allPersonList.forEach(function (value, key) {
            var option = "<option value='" + key + "'>" + value.name + "</option>";
            cRoleType.append(option);
        });
        cRoleType.change(initControlPersonName);
        cRoleType.change();
        $("#personName").change(selectPerson);
        cMeetingComment.attr("readonly",false);
        cMeetingComment.removeClass("disable");
        cMeetingComment.addClass("default");
    }
    updatePersonCount();
}

$(document).ready(
    function init() {
        initCommon("meetingAppointment");
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
function selectPerson() {
    var personID = $(this).val();
    var isPersonContain = false;
    var personList;
    var addTo;
    switch ($("#addPersonTo").val()){
        case "出席人员":
            personList = attendList;
            addTo = $("#attendList");
            break;
        case "列席人员":
            personList = observeList;
            addTo = $("#observeList");
            break;
    }
    attendList.forEach(function (value) {
        if(value.id == personID){
            isPersonContain = true;
        }
    });
    observeList.forEach(function (value) {
        if(value.id == personID){
            isPersonContain = true;
        }
    });
    if(!isPersonContain){
        var personName = $("option:selected", this).text();
        var newPerson =
            "<li>" +
            "<a class='name'>"+personName+"</a>" +
            "<a class='del' title='删除' data-id='"+personID+"' onclick='deletePerson(this)'>㊀</a>" +
            "</li>";
        addTo.append(newPerson);
        personList.push({
            id : personID,
            name : personName
        });
    }
    $(this).val(0);
    updatePersonCount();
}

/**
 * 使人员删除有效
 */
function deletePerson(el) {
    var cPerson = $(el).parent();
    var personID = $(el).attr("data-id");
    var personList;
    switch (cPerson.parent().attr("id")){
        case "attendList":
            personList = attendList;
            break;
        case "observeList":
            personList = observeList;
            break;
    }
    personList.forEach(function (value, key) {
        if(value.id == personID){
            personList.splice(key,1);
        }
    });
    cPerson.remove();
    updatePersonCount();
}

function updatePersonCount() {
    $("#showAttendPerson").find("label").text("出席人员("+attendList.length+")");
    $("#showObservePerson").find("label").text("列席人员("+observeList.length+")");
}
