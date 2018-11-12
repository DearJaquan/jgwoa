/**
 * Created by Revan on 2017/9/4.
 */
/****************************以下内容为流程控制变量****************************/
//可发起角色列表
var canLaunch = ["文件传阅发起人","行政办科长"];

var canTransmit = ["026"];//026徐佳

/****************************以下内容为流程内容变量****************************/
//收文号
var getNumber;
//日期
var getDate;
//来文机关
var docDepartment;
//文号
var docNumber;
//标题
var title;
//拟办意见
// var imitateAdvice;
//人员列表
var allPersonList = [];
//审阅人员列表
var checkList = [];
//原始审阅人员列表
var oldCheckList = [];
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
//主要领导意见,为填写内容
var adviceMainLeader;
//主要领导意见填写时间
var timeAdviceMainLeader;
//主要领导意见的历史记录
var historyAdviceMainLeader;

/****************************以下内容为流程必须函数****************************/
/**
 * 依据当前步骤生成下一步骤
 */
function getNextStep() {
    if(instance.isOperator){
        switch (instance.currentStep){
            case "发起流程":
                if(user.launchRole.name.indexOf("文件传阅发起人") > -1){
                    instance.nextStep = "科室审批";
                }else{
                    instance.nextStep = "主要领导审批";
                }
                break;
            case "科室审批":
                instance.nextStep = "主要领导审批";
                break;
            case "主要领导审批":
                instance.nextStep = "行政办确认";
                break;
            case "行政办确认":
                instance.nextStep = "分管领导审批";
                break;
            case "分管领导审批":
                instance.nextStep = "文件传阅";
                break;
            case "文件传阅":
                instance.nextStep = "流程结束";
                break;
        }
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
    user.launchRoleList.forEach(function (value) {
        if(value.name.indexOf("科长")>-1){
            isAbleSelectMain = true;
        }
    });
    isShowMainSelect = instance.nextStep == "主要领导审批";
}

/**
 * 获取需要提交服务器的流程控制
 */
function getMoreControl(controlInfo){
    switch (instance.currentStep){
        case "发起流程":
        case "科室审批":
            if(isShowMainSelect){
                controlInfo.isToMain = $("#isToMain").is(":checked");
                if(!controlInfo.isToMain){
                    controlInfo.approve = [];
                    checkList.forEach(function (value) {
                        controlInfo.approve.push(value.id);
                    });
                }
            }
            break;
        case "行政办确认":
            controlInfo.isGoingOn = $("#isGoingOn").is(":checked");
            if(controlInfo.isGoingOn){
                controlInfo.approve = [];
                checkList.forEach(function (value) {
                    controlInfo.approve.push(value.id);
                });
            }
            break;
        case "分管领导审批":
            controlInfo.approve = [];
            checkList.forEach(function (value,key) {
                if(key >= oldCheckList){
                    controlInfo.approve.push(value.id);
                }
            });
            break;
    }
    return controlInfo;
}

/**
 * 发起身份变化对应函数
 */
function launchRoleChange() {
    var cSelectStatus = $("#selectStatus");
    user.launchRole.id = cSelectStatus.val();
    user.launchRole.name = cSelectStatus.find("option:selected").text();
    getNextStep();
    $("#nextStep").text(instance.nextStep);
    instance.launcherSection = getUserSection(user.launchRole.name);
    initSectionApproveControl(instance.nextStep == "主要领导审批",undefined);
    $("#confirm").parent().empty();
    isShowMainSelect = instance.nextStep == "主要领导审批";
    initOperateInterface();
}

/**
 * 获取流程内容数据
 */
function getContentData(data) {
    getNumber = data.getNumber;
    getDate = data.getDate;
    docDepartment = data.docDepartment;
    docNumber = data.docNumber;
    title = data.title;
    // imitateAdvice = data.imitateAdvice;
    checkList = data.checkList;
    oldCheckList = data.checkList.length;
    adviceSection = data.adviceSection;
    timeAdviceSection = data.timeAdviceSection;
    adviceMainLeader = data.adviceMainLeader;
    timeAdviceMainLeader = data.timeAdviceMainLeader;
    fileList = data.fileList;
}

/**
 * 检测需提交内容的合法性
 */
function checkContent() {
    var isCorrect = true;
    if(instance.currentStep == "发起流程"){
        isCorrect = checkNotNull($("#getNumber").val(),$("#hintGetNumber")) && isCorrect;
        isCorrect = checkNotNull($("#getDate").val(),$("#hintGetDate")) && isCorrect;
        isCorrect = checkNotNull($("#docDepartment").val(),$("#hintDocDepartment")) && isCorrect;
        isCorrect = checkNotNull($("#docNumber").val(),$("#hintDocNumber")) && isCorrect;
        isCorrect = checkNotNull($("#title").val(),$("#hintTitle")) && isCorrect;
        // isCorrect = checkNotNull($("#imitateAdvice").val(),$("#hintImitateAdvice")) && isCorrect;
        isCorrect = checkUploadFile($("#hintFileList")) && isCorrect;
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent(){
    var content = {};
    var cGetNumber = $("#getNumber");
    var cGetDate = $("#getDate");
    var cDocDepartment = $("#docDepartment");
    var cDocNumber = $("#docNumber");
    var cTitle = $("#title");
    var cImitateAdvice = $("#imitateAdvice");
    switch (instance.currentStep){
        case "科室审批":
            content.adviceSection = $("#adviceSection").val();
            content.signatureSection = user.id;
            content.timeAdviceSection = $("#timeAdviceSection").text();
            content.getNumber = cGetNumber.val();
            content.getDate = cGetDate.val();
            content.docDepartment = cDocDepartment.val();
            content.docNumber = cDocNumber.val();
            content.title = cTitle.val();
            content.checkList = checkList;
            break;
        case "发起流程":
            if(user.launchRole.name.indexOf("科长")>-1){
                content.adviceSection = $("#adviceSection").val();
                content.signatureSection = user.id;
                content.timeAdviceSection = $("#timeAdviceSection").text();
            }
        case "行政办确认":
            content.getNumber = cGetNumber.val();
            content.getDate = cGetDate.val();
            content.docDepartment = cDocDepartment.val();
            content.docNumber = cDocNumber.val();
            content.title = cTitle.val();
            content.checkList = checkList;
            break;
        case "主要领导审批":
            content.adviceMainLeader = $("#adviceMainLeader").val();
            content.signatureMainLeader = user.id;
            content.timeAdviceMainLeader = $("#timeAdviceMainLeader").text();
            break;
        case "分管领导审批":
            content.adviceBranchLeader = $("#adviceBranchLeader").val();
            content.signatureBranchLeader = user.id;
            content.timeAdviceBranchLeader =$("#timeAdviceBranchLeader").text();
            content.newCheckList = checkList;
            break;
        case "文件传阅":
            content.check = {
                id: user.id,
                time: new Date().Format()
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
    var cRelateProcedure = $("#relateProcedure");
    cRelateProcedure.css("display", "none");
    //是否需要行政主要领导审批控制
    if(instance.isOperator && instance.currentStep == "行政办确认"){
        var isGoingOn = "<a class='isToWhere'><input type='checkbox' id='isGoingOn' checked>继续传阅</a>";
        $("#moreSelectArea").append(isGoingOn);
        $("#isGoingOn").click(function () {
            if($(this).is(":checked")){
                instance.nextStep = "分管领导审批";
            }else{
                instance.nextStep = "流程结束";
            }
            $("#nextStep").text(instance.nextStep);
        });
    }
    var cGetNumber = $("#getNumber");
    var cGetDate = $("#getDate");
    var cDocDepartment = $("#docDepartment");
    var cDocNumber = $("#docNumber");
    var cTitle = $("#title");
    cGetNumber.val(getNumber);
    cGetDate.val(getDate);
    cDocDepartment.val(docDepartment);
    cDocNumber.val(docNumber);
    cTitle.val(title);
    checkList.forEach(function (value) {
        var reader = value.name;
        if(value.isRead){
            reader +="（已阅）";
        }
        $("#checkList").append("<li><a class='name'>"+reader+"</a></li>");
    });
    $("#showPersonSelect").css("display","none");
    if(instance.isOperator && (instance.currentStep == "发起流程" || instance.currentStep == "科室审批" || instance.currentStep == "行政办确认")) {
        cGetNumber.attr("readonly",false);
        cGetNumber.removeClass("disable");
        cGetNumber.addClass("default");
        cGetDate.attr("readonly",false);
        cGetDate.removeClass("disable");
        cGetDate.addClass("longDate");
        laydate.render({
            elem: '#getDate'
        });
        cDocDepartment.attr("readonly",false);
        cDocDepartment.removeClass("disable");
        cDocDepartment.addClass("default");
        cDocNumber.attr("readonly",false);
        cDocNumber.removeClass("disable");
        cDocNumber.addClass("default");
        cTitle.attr("readonly",false);
        cTitle.removeClass("disable");
        cTitle.addClass("default");
        $("#checkList").empty();
        checkList.forEach(function (value) {
            var newPerson =
                "<li>" +
                "<a class='name'>"+value.name+"</a>" +
                "<a class='del' title='删除' data-id='"+value.id+"' onclick='deletePerson(this)'>㊀</a>" +
                "</li>";
            $("#checkList").append(newPerson);
        });
    }
    if(instance.isOperator && (instance.currentStep == "发起流程" || instance.currentStep == "科室审批" ||instance.currentStep == "行政办确认" || instance.currentStep == "分管领导审批")){
        $("#showPersonSelect").css("display","table-row");
        initPersonList();
        var cRoleType = $("#roleType");
        // allPersonList.forEach(function (value, key) {
        //     var option = "<option value='" + key + "'>" + value.name + "</option>";
        //     cRoleType.append(option);
        // });
        if(instance.currentStep == "发起流程" ||instance.currentStep == "行政办确认" || instance.currentStep == "科室审批"){
            cRoleType.append("<option value='0'>主要领导</option>");
            cRoleType.append("<option value='1'>分管领导</option>");
        }else{
            cRoleType.append("<option value='2'>科长</option>");
            cRoleType.append("<option value='3'>科员</option>");
            cRoleType.append("<option value='4'>单位负责人</option>");
            cRoleType.append("<option value='5'>单位办公室主任</option>");
        }
        cRoleType.change(initControlPersonName);
        cRoleType.change();
        $("#personName").change(selectPerson);
    }
    updatePersonCount();
    initSectionApproveControl(instance.currentStep == "科室审批" ||　instance.currentStep == "发起流程" && instance.nextStep != "科室审批",undefined);
    initMainApproveControl(instance.currentStep == "主要领导审批",timeAdviceSection);//主要领导审批信息显示控制
    initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdviceSection);//分管领导审批信息显示控制
}

$(document).ready(
    function init() {
        initCommon("documentCircularize2");
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
    var unitManager = {
        name : "单位负责人",
        person : []
    };
    var unitOffice = {
        name : "单位办公室主任",
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
            case "单位负责人":
                unitManager.person.push({id:value.id,name:value.name});
                break;
            case "单位办公室主任":
                unitOffice.person.push({id:value.id,name:value.name});
                break;
        }
    });
    allPersonList = [];
    allPersonList.push(main);
    allPersonList.push(branch);
    allPersonList.push(section);
    allPersonList.push(clerk);
    allPersonList.push(unitManager);
    allPersonList.push(unitOffice);
};

/**
 *初始化人员可选人员名称控件
 */
function initControlPersonName(){
    var cPersonName = $("#personName");
    var selectType = $("#roleType").val();
    var rolePersonList = allPersonList[selectType].person;
    $("option", cPersonName).remove();
    cPersonName.append("<option value='0'>请选择...</option>");
    if(selectType == "3"){
        rolePersonList.forEach(function (value) {
            canTransmit.forEach(function (person) {
                if(value.id == person){
                    var option = "<option value='" + value.id + "'>" + value.name + "</option>";
                    cPersonName.append(option);
                }
            });
        });
    }else{
        rolePersonList.forEach(function (value) {
            var option = "<option value='" + value.id + "'>" + value.name + "</option>";
            cPersonName.append(option);
        });
    }
}

/**
 * 选择人员后操作
 */
function selectPerson() {
    var personID = $(this).val();
    var isPersonContain = false;
    checkList.forEach(function (value) {
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
        $("#checkList").append(newPerson);
        checkList.push({
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
    checkList.forEach(function (value, key) {
        if(value.id == personID){
            checkList.splice(key,1);
        }
    });
    cPerson.remove();
    updatePersonCount();
}

function updatePersonCount() {
    $("#showCheckPerson").find("label").text("审阅人员("+checkList.length+")");
}

function initApproveSelectControl(addTo,personName,personID) {
    var newPerson =
        "<li>" +
        "<a class='name'>"+personName+"</a>" +
        "<a class='del' title='删除' data-id='"+personID+"' onclick='deletePerson(this)'>㊀</a>" +
        "</li>";
    addTo.append(newPerson);
}

function addMoreControlOperate() {
    //是否需要行政主要领导审批控制
    if(instance.isOperator && (instance.currentStep == "科室审批" || instance.currentStep == "发起流程" &&　instance.nextStep != "科室审批")){
        var isToMain = "<a class='isToWhere'><input type='checkbox' id='isToMain' checked>递交主要领导</a>";
        $("#moreSelectArea").prepend(isToMain);
        $("#isToMain").click(function () {
            if($(this).is(":checked")){
                instance.nextStep = "主要领导审批";
            }else{
                instance.nextStep = "文件传阅";
            }
            $("#nextStep").text(instance.nextStep);
        });
    }
}