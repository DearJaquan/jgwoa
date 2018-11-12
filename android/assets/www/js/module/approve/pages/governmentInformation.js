/**
 * Created by Dingfengwu on 2017/8/22.
 */

//可发起角色列表
var canLaunch = ["行政办科长","行政办科员"];

//申请编号
var applicationNum;
//登记日期
var registration;
//申请人
var proposer;
//申请公开内容
var publicContent;
//核实情况
var checkDetail;
//处理结果
var processResult;
//答复日期
var replyDate;
//下属单位列表
var departmentList = [];
//选中单位列表
var selectDepartmentList = [];
//下属单位意见
var departmentAdvice;
//下属单位意见集合
var departmentAdviceTotal;
//是否已选择下属单位
var isSelect;
//是否被退回
var isBack;

//业务科室意见
var adviceSection;
//业务科室意见填写时间
var timeAdviceSection;
//业务科室意见的历史记录
var historyAdviceSection;

//法规科意见
var adviceLawSection;
//法规科意见填写时间
var timeAdviceLawSection;
//法规科意见的历史记录
var historyAdviceLawSection;

//分管领导意见,为填写内容
var adviceBranchLeader;
//科室意见填写时间
var timeAdviceBranchLeader;
//分管领导意见的历史记录
var historyAdviceBranchLeader;

//保密审查意见
var adviceSecrecyBranchLeader;
//保密审查意见填写时间
var timeAdviceSecrecyBranchLeader;
//保密审查意见的历史记录
var historyAdviceSecrecyBranchLeader;

//主要领导意见,为填写内容
var adviceAdminMainLeader;
//科室意见填写时间
var timeAdviceAdminMainLeader;
//主要领导意见的历史记录
var historyAdviceAdminMainLeader;

/**
 * 依据当前步骤生成下一步骤
 */
function getNextStep() {
    if(instance.isOperator){
        switch (instance.currentStep){
            case "发起流程":
                instance.nextStep = "业务科室审批";
                break;
            case "业务科室审批":
                instance.nextStep = "发起人确认";
                break;
            case "发起人确认":
                instance.nextStep = "法规科审批";
                break;
            case "法规科审批":
                instance.nextStep = "分管领导审批";
                break;
            case "分管领导审批":
                instance.nextStep = "保密审查审批";
                break;
            case "保密审查审批":
                instance.nextStep = "发起人填写";
                break;
            case "发起人填写":
                instance.nextStep = "行政主要领导审批";
                break;
            case "行政主要领导审批":
                instance.nextStep = "行政办填写";
                break;
            case "行政办填写":
                instance.nextStep = "流程结束";
                break;
            case "征集意见":
                instance.nextStep = "意见统和";
                break;
        }
    }else{
        instance.nextStep = instance.currentStep;
    }
}

function setNewData() {
    registration = new Date().Format();
}

/**
 * 设置控制面板显示,不存在可不写
 */
function setControlData() {
    isShowSectionSelect = instance.currentStep == "发起流程";
    isShowBranchSelect = instance.currentStep == "法规科审批";
    isShowSecrecySelect = instance.currentStep == "法规科审批";
    isAbleSelectSection = isShowSectionSelect;
    isAbleSelectBranch = isShowBranchSelect;
    isAbleSelectSecrecy = isShowSecrecySelect;
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
}

/**
 * 获取需要提交服务器的流程控制
 */
function getMoreControl(controlInfo){
    switch (instance.currentStep){
        case "业务科室审批":
            controlInfo.subunit = [];
            selectDepartmentList.forEach(function (value) {
                controlInfo.subunit.push(value.id);
            });
            break;
    }
    return controlInfo;
}

/**
 * 获取流程内容数据
 */
function getContentData(data) {
    applicationNum = data.applicationNum;
    registration = data.registration;
    proposer = data.proposer;
    publicContent = data.publicContent;
    checkDetail = data.checkDetail;
    processResult = data.processResult;
    replyDate = data.replyDate;
    departmentAdviceTotal = data.departmentAdviceTotal;
    selectDepartmentList = data.selectDepartmentList;
    if(selectDepartmentList){

    }else{
        selectDepartmentList = [];
    }
    isSelect = data.isSelect;

    adviceSection = data.adviceSection;
    timeAdviceSection = data.timeAdviceSection;
    adviceLawSection = data.adviceLawSection;
    timeAdviceLawSection = data.timeAdviceLawSection;
    adviceSecrecyBranchLeader = data.adviceSecrecyBranchLeader;
    timeAdviceSecrecyBranchLeader = data.timeAdviceSecrecyBranchLeader;
    adviceBranchLeader = data.adviceBranchLeader;
    timeAdviceBranchLeader = data.timeAdviceBranchLeader;
    adviceAdminMainLeader = data.adviceAdminMainLeader;
    timeAdviceAdminMainLeader = data.timeAdviceAdminMainLeader;
    fileList = data.fileList;
    isBack = data.isBack;
}

function checkContent() {
    var isCorrect = true;
    switch (instance.currentStep){
        case "发起流程":
            isCorrect = checkNotNull($("#applicationNum").val(), $("#hintApplicationNum")) && isCorrect;
            isCorrect = checkNotNull($("#registration").val(), $("#hintRegistration")) && isCorrect;
            isCorrect = checkNotNull($("#proposer").val(), $("#hintProposer")) && isCorrect;
            isCorrect = checkNotNull($("#publicContent").val(), $("#hintPublicContent")) && isCorrect;
            break;
        case "业务科室审批":
            if($("#operate").val() == "获取意见" && selectDepartmentList.length == 0){
                isCorrect = false;
                jAlert("系统提示：获取意见需选择下属单位！","操作错误");
            }
            break;
        case "发起人填写":
            isCorrect = checkNotNull($("#checkDetail").val(), $("#hintCheckDetail")) && isCorrect;
            break;
        case "行政办填写":
            isCorrect = checkNotNull($("#processResult").val(), $("#hintProcessResult")) && isCorrect;
            isCorrect = checkNotNull($("#replyDate").val(), $("#hintReplyDate")) && isCorrect;
            break;
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent(){
    var content = {};
    var cApplicationNum = $("#applicationNum");
    var cRegistration = $("#registration");
    var cProposer = $("#proposer");
    var cPublicContent = $("#publicContent");
    var cCheckDetail = $("#checkDetail");
    var cProcessResult = $("#processResult");
    var cReplyDate = $("#replyDate");
    switch (instance.currentStep){
        case "发起流程":
            content.applicationNum = cApplicationNum.val();
            content.registration = cRegistration.val();
            content.proposer = cProposer.val();
            content.publicContent = cPublicContent.val();
            content.signatureStaff = user.id;
            content.timeAdviceStaff = new Date().Format();
            break;
        case "业务科室审批":
            content.selectDepartmentList = selectDepartmentList;
            content.adviceSection = $("#adviceSection").val();
            content.historyAdviceSection = "adviceSection";
            content.signatureSection = user.id;
            content.timeAdviceSection = $("#timeAdviceSection").text();
            break;
        case "法规科审批":
            content.adviceLawSection = $("#adviceLawSection").val();
            content.historyAdviceLawSection = "adviceLawSection";
            content.signatureLawSection = user.id;
            content.timeAdviceLawSection = $("#timeAdviceLawSection").text();
            break;
        case "分管领导审批":
            content.adviceBranchLeader = $("#adviceBranchLeader").val();
            content.historyAdviceBranchLeader = "adviceBranchLeader";
            content.signatureBranchLeader = user.id;
            content.timeAdviceBranchLeader = $("#timeAdviceBranchLeader").text();
            break;
        case "保密审查审批":
            content.adviceSecrecyBranchLeader = $("#adviceSecrecyBranchLeader").val();
            content.historyAdviceSecrecyBranchLeader = "adviceSecrecyBranchLeader";
            content.signatureSecrecyBranchLeader = user.id;
            content.timeAdviceSecrecyBranchLeader = $("#timeAdviceSecrecyBranchLeader").text();
            break;
        case "发起人填写":
            content.checkDetail = cCheckDetail.val();
            break;
        case "行政主要领导审批":
            content.adviceAdminMainLeader = $("#adviceAdminMainLeader").val();
            content.historyAdviceAdminMainLeader = "adviceAdminMainLeader";
            content.signatureAdminMainLeader = user.id;
            content.timeAdviceAdminMainLeader = $("#timeAdviceAdminMainLeader").text();
            break;
        case "行政办填写":
            content.processResult = cProcessResult.val();
            content.replyDate = cReplyDate.val();
            content.signatureExecutive = user.id;
            content.timeExecutive = new Date().Format();
            break;
        case "征集意见":
            content.departmentAdvice = $("#departmentAdvice").val();
            content.historyDepartmentAdvice = "departmentAdvice";
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
    var cApplicationNum = $("#applicationNum");
    var cRegistration = $("#registration");
    var cProposer = $("#proposer");
    var cPublicContent = $("#publicContent");
    var cCheckDetail = $("#checkDetail");
    var cProcessResult = $("#processResult");
    var cReplyDate = $("#replyDate");
    cApplicationNum.val(applicationNum);
    cRegistration.val(registration);
    cProposer.val(proposer);
    cPublicContent.val(publicContent);
    cCheckDetail.val(checkDetail);
    cProcessResult.val(processResult);
    cReplyDate.val(replyDate);
    selectDepartmentList.forEach(function (value) {
        $("#departmentList").append("<li><a class='name'>"+value.name+"</a></li>");
    });
    var cDepartmentAdviceArea = $("[data-show=showDepartmentAdvice]");
    cDepartmentAdviceArea.css("display","none");
    if(instance.isOperator && instance.currentStep == "发起流程"){
        cApplicationNum.attr("readonly",false);
        cApplicationNum.removeClass("disable");
        cApplicationNum.addClass("default");
        cRegistration.attr("readonly",false);
        cRegistration.removeClass("disable");
        cRegistration.addClass("longDate");
        laydate.render({
            elem: '#registration'
        });
        cProposer.attr("readonly",false);
        cProposer.removeClass("disable");
        cProposer.addClass("default");
        cPublicContent.attr("readonly",false);
        cPublicContent.removeClass("disable");
        cPublicContent.addClass("default");
    }
    if(instance.isOperator && instance.currentStep == "业务科室审批"){
        cDepartmentAdviceArea.css("display","table-row");
        if(isSelect){
            $("#showDepartmentSelect").css("display","none");
            var cDepartmentAdvice = $("#departmentAdvice");
            var stringAdviceDepartment = "";
            departmentAdviceTotal && departmentAdviceTotal.forEach(function (value) {
                stringAdviceDepartment += value + "\r\n";
            });
            cDepartmentAdvice.val(stringAdviceDepartment);
        }else{
            $("#departmentList").empty();
            selectDepartmentList = [];
            initDepartmentList();
            var cDepartmentName = $("#departmentName");
            cDepartmentName.append("<option value='0'>请选择...</option>");
            departmentList.forEach(function (value) {
                var option = "<option value='" + value.id + "'>" + value.name + "</option>";
                cDepartmentName.append(option);
            });
            cDepartmentName.change(selectDepartment);
        }
    }
    if(instance.isOperator && instance.currentStep == "征集意见"){
        cDepartmentAdviceArea.css("display","table-row");
        $("#showDepartmentSelect").css("display","none");
        var cDepartmentAdvice = $("#departmentAdvice");
        cDepartmentAdvice.attr("readonly",false);
        cDepartmentAdvice.removeClass("disable");
        cDepartmentAdvice.addClass("default");
    }
    if(instance.isOperator && instance.currentStep == "发起人填写"){
        cCheckDetail.attr("readonly",false);
        cCheckDetail.removeClass("disable");
        cCheckDetail.addClass("default");
    }
    if(instance.isOperator && instance.currentStep == "行政办填写"){
        cProcessResult.attr("readonly",false);
        cProcessResult.removeClass("disable");
        cProcessResult.addClass("default");
        cReplyDate.attr("readonly",false);
        cReplyDate.removeClass("disable");
        cReplyDate.addClass("longDate");
        laydate.render({
            elem: '#replyDate'
        });
    }
    updateDepartmentCount();
    initSectionApproveControl(instance.currentStep == "业务科室审批",undefined);//科长审批信息显示控制
    initLawSectionApproveControl(instance.currentStep == "法规科审批",timeAdviceSection);
    initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdviceLawSection);//分管领导审批信息显示控制
    initSecrecyBranchApproveControl(instance.currentStep == "保密审查审批",timeAdviceBranchLeader);
    initAdminMainApproveControl(instance.currentStep == "行政主要领导审批",timeAdviceSecrecyBranchLeader);//主要领导审批信息显示控制
}

$(document).ready(
    function init() {
        initCommon("governmentInformation");
        initContentInterface();
    }
);

function initDepartmentList() {
    getDepartmentList(callbackGetDepartment);
}

var callbackGetDepartment = function (data) {
    departmentList = data.all;
};

/**
 * 选择人员后操作
 */
function selectDepartment() {
    var departmentID = $(this).val();
    var isDepartmentContain = false;
    selectDepartmentList.forEach(function (value) {
        if(value.id == departmentID){
            isDepartmentContain = true;
        }
    });
    if(!isDepartmentContain){
        var departmentName = $("option:selected", this).text();
        var newDepartment =
            "<li>" +
            "<a class='name'>"+departmentName+"</a>" +
            "<a class='del' title='删除' data-id='"+departmentID+"' onclick='deleteDepartment(this)'>㊀</a>" +
            "</li>";
        $("#departmentList").append(newDepartment);
        selectDepartmentList.push({
            id : departmentID,
            name : departmentName
        });
    }
    $(this).val(0);
    updateDepartmentCount();
}

function deleteDepartment(el) {
    var cDepartment = $(el).parent();
    var departmentID = $(el).attr("data-id");
    selectDepartmentList.forEach(function (value, key) {
        if(value.id == departmentID){
            selectDepartmentList.splice(key,1);
        }
    });
    cDepartment.remove();
    updateDepartmentCount();
}

function updateDepartmentCount() {
    $("#showAdviceDepartment").find("label").text("单位列表("+selectDepartmentList.length+")");
}
