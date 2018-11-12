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
//人员列表
var allPersonList = [];
//出席人员列表
var attendList = [];
//列席人员列表
var observeList = [];
//缺席人员列表
var absentList = [];
//审批人意见,为填写内容
var adviceApprove;
//审批人意见填写时间
var timeAdviceApprove;
//审批人意见的历史记录
var historyAdviceApprove;
//退回人员列表与意见
var returnAdviceList = [];

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
                instance.nextStep = "行政办确认";
                break;
            case "行政办确认":
                instance.nextStep = "流程结束";
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
    attendList = data.attendList;
    observeList = data.observeList;
    absentList = data.absentList;
    returnAdviceList = data.returnAdviceList;
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
        isCorrect = checkNotNullArray(attendList.length + absentList.length, $("#hintForMeetingPerson")) && isCorrect;
        isCorrect = checkUploadFile($("#hintFileList")) && isCorrect;
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程控制
 */
function getMoreControl(controlInfo){
    switch (instance.currentStep){
        case "发起流程":
            controlInfo.approve = [];
            attendList.forEach(function (value) {
                controlInfo.approve.push(value.id);
            });
            observeList.forEach(function (value) {
                controlInfo.approve.push(value.id);
            });
            break;
    }
    return controlInfo;
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
            content.attendList = attendList;
            content.observeList = observeList;
            content.absentList = absentList;
            break;
        case "审批人审批":
            content.returnAdvice = {
                id: user.id,
                name: user.name,
                time: $("#timeAdviceApprove").val(),
                advice: $("#adviceApprove").val()
            };
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
    if(instance.isOperator && instance.isNew){
        cRelateProcedure.css("display", "inline");
        cRelateProcedure.click(function () {
            getRelatedInstanceList("MMM","全部");
        });
    }else{
        $("[name='delete']",$("[data-type='procedure']",$("#fileList"))).css("display","none");
    }
    var cTimeForm = $("#meetingTimeFrom");
    var cTimeTo = $("#meetingTimeTo");
    var cMeetingName = $("#meetingName");
    var cMeetingRoom = $("#meetingRoom");
    cTimeForm.val(meetingTimeFrom);
    cTimeTo.val(meetingTimeTo);
    cMeetingName.val(meetingName);
    cMeetingRoom.val(meetingRoom);
    attendList.forEach(function (value) {
        $("#attendList").append("<li><a class='name'>"+value.name+"</a></li>");
    });
    observeList.forEach(function (value) {
        $("#observeList").append("<li><a class='name'>"+value.name+"</a></li>");
    });
    absentList.forEach(function (value) {
        $("#absentList").append("<li><a class='name'>"+value.name+"</a></li>");
    });
    $("[data-show=showReturnReason]").css("display","none");
    $("#showPersonSelect").css("display","none");
    if(instance.isOperator && instance.currentStep == "发起流程"){
        if(instance.isNew || returnAdviceList == undefined){
            cTimeForm.attr("readonly",false);
            cTimeForm.removeClass("disableDate");
            cTimeForm.addClass("date");
            laydate.render({
                elem: '#meetingTimeFrom',
                max: new Date().getTime(),
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
                max: new Date().getTime(),
                type: 'datetime'
            });
            cMeetingName.attr("readonly",false);
            cMeetingName.removeClass("disable");
            cMeetingName.addClass("default");
            cMeetingRoom.attr("readonly",false);
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
        }else{
            $("[data-show=showReturnReason]").css("display","table-row");
            returnAdviceList.forEach(function (value) {
                if(!value.isAgree){
                    $("#returnReason").append(value.name+"："+value.advice+"\r\n");
                }
            });
        }
    }
    if(instance.isOperator && instance.currentStep == "审批人审批"){
        if(returnAdviceList){
            returnAdviceList.forEach(function (value) {
                if(value.id == user.id){
                    adviceApprove = value.advice;
                    timeAdviceApprove = value.time;
                }
            });
        }
        initApproveApproveControl(instance.currentStep == "审批人审批",undefined);//科长审批信息显示控制
    }else{
        $("#adviceApproveArea").css("display","none");
    }
    updatePersonCount();
}

$(document).ready(
    function init() {
        initCommon("meetingSummary");
        initContentInterface();
    }
);

function initPersonList() {
    getPersonList(callbackGetPerson);
}

var callbackGetPerson = function (data) {
    console.log(allPersonList);
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
        case "缺席人员":
            personList = absentList;
            addTo = $("#absentList");
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
    absentList.forEach(function (value) {
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
        case "absentList":
            personList = absentList;
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
    $("#showAbsentPerson").find("label").text("缺席人员("+absentList.length+")");
}

function clickOnSelectRelate(type) {
    $("#relateTableDetail").find(".app").click(function () {
        var selectID = $(this).attr("data-id");
        var callBack = function (data) {
            createAttachmentProcedure(data[1]);
            $("#meetingTimeFrom").val(data[0].meetingTimeFrom);
            $("#meetingTimeTo").val(data[0].meetingTimeTo);
            $("#meetingName").val(data[0].meetingName);
            $("#meetingRoom").val(data[0].meetingRoom);
            attendList = JSON.parse(data[0].attendList);
            if(data[0].observeList){
                observeList = JSON.parse(data[0].observeList);
            }else{
                observeList = [];
            }
            absentList = [];
            $("#attendList").empty();
            $("#observeList").empty();
            $("#absentList").empty();
            attendList.forEach(function (value) {
                initApproveSelectControl($("#attendList"),value.name,value.id);
            });
            observeList.forEach(function (value) {
                initApproveSelectControl($("#observeList"),value.name,value.id);
            });
            updatePersonCount();
        };
        var selectList = [];
        selectList.push(selectID);
        getRelatedInstanceDetail(selectList,type,"全部",callBack);
        $("#maskHistory").click();
    });
}

function initApproveSelectControl(addTo,personName,personID) {
    var newPerson =
        "<li>" +
        "<a class='name'>"+personName+"</a>" +
        "<a class='del' title='删除' data-id='"+personID+"' onclick='deletePerson(this)'>㊀</a>" +
        "</li>";
    addTo.append(newPerson);
}