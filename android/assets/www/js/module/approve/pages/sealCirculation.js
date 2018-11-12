/**
 * Created by Revan on 2017/9/4.
 */
/****************************以下内容为流程控制变量****************************/
//可发起角色列表
var canLaunch = ["科长","科员"];

/****************************以下内容为流程内容变量****************************/
//文件名称
var fileName;
//用章类别
var sealType;
var sealTypeValue;
//申办科室
var launchSection;
//经办人
var transactor;
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
var adviceAdminMainLeader;
//主要领导意见填写时间
var timeAdviceAdminMainLeader;
//主要领导意见的历史记录
var historyAdviceAdminMainLeader;
//主要领导意见,为填写内容
var advicePartyMainLeader;
//主要领导意见填写时间
var timeAdvicePartyMainLeader;
//主要领导意见的历史记录
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
                if(user.launchRole.name.indexOf("科员") > -1){
                    instance.nextStep = "科室审批";
                }else{
                    instance.nextStep = "分管领导审批";
                }
                break;
            case "科室审批":
                instance.nextStep = "分管领导审批";
                break;
            case "分管领导审批":
                if(sealTypeValue == "行政类印章"){
                    instance.nextStep = "行政办确认";
                }else{
                    instance.nextStep = "党委办确认";
                }
                break;
            case "行政办确认":
                instance.nextStep = "行政主要领导审批";
                break;
            case "党委办确认":
                instance.nextStep = "党工委书记审批";
                break;
            case "行政主要领导审批":
                instance.nextStep = "流程结束";
                break;
            case "党工委书记审批":
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
    instance.launcherSection = getUserSection(user.launchRole.name);
    transactor = instance.launcherName;
    launchSection = instance.launcherSection;
}

/**
 * 设置控制面板显示,不存在可不写
 */
function setControlData() {
    user.launchRoleList.forEach(function (value) {
        if(value.name.indexOf("科长")>-1){
            isAbleSelectBranch = true;
        }
    });
    isShowBranchSelect = instance.nextStep == "分管领导审批";
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
    launchSection = instance.launcherSection;
    $("#launchSection").val(launchSection);
    initSectionApproveControl(instance.nextStep == "分管领导审批",undefined);
    $("#confirm").parent().empty();
    isShowBranchSelect = instance.nextStep == "分管领导审批";
    initOperateInterface();
}

/**
 * 获取流程内容数据
 */
function getContentData(data) {
    fileName = data.fileName;
    sealType = data.sealType;
    sealTypeValue = data.sealTypeValue;
    launchSection = data.launchSection;
    transactor = data.transactor;
    adviceSection = data.adviceSection;
    timeAdviceSection = data.timeAdviceSection;
    adviceBranchLeader = data.adviceBranchLeader;
    timeAdviceBranchLeader = data.timeAdviceBranchLeader;
    adviceAdminMainLeader = data.adviceAdminMainLeader;
    timeAdviceAdminMainLeader = data.timeAdviceAdminMainLeader;
    advicePartyMainLeader = data.advicePartyMainLeader;
    timeAdvicePartyMainLeader = data.timeAdvicePartyMainLeader;
    fileList = data.fileList;
    isBack = data.isBack;
}

/**
 * 检测需提交内容的合法性
 */
function checkContent() {
    var isCorrect = true;
    if(instance.currentStep.indexOf("发起")>-1){
        isCorrect = checkNotNull($("#fileName").val(),$("#hintFileName")) && isCorrect;
        isCorrect = checkNotNull($("#sealType").val(),$("#hintSealType")) && isCorrect;
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
            controlInfo.sealTypeValue = $("#sealType").val();
            break;
        case "行政办确认":
            controlInfo.isToMain = $("#isToMain").is(":checked");
            break;
    }
    return controlInfo;
}
/**
 * 获取需要提交服务器的流程内容
 */
function getContent(){
    var content = {};
    var cFileName = $("#fileName");
    var cSealType = $("#sealType");
    var cLaunchSection = $("#launchSection");
    switch (instance.currentStep){
        case "发起流程":
            content.fileName = cFileName.val();
            content.sealType = cSealType.find("option:selected").text();
            content.sealTypeValue = cSealType.val();
            content.launchSection = cLaunchSection.val();
            content.transactor = transactor;
            if(user.launchRole.name.indexOf("科员") > -1){
                content.signatureStaff = user.id;
                content.timeAdviceStaff = new Date().Format();
            }else{
                content.signatureSection = user.id;
                content.adviceSection = $("#adviceSection").val();
                content.historyAdviceSection = "adviceSection";
                content.timeAdviceSection = $("#timeAdviceSection").text();
            }
            break;
        case "科室审批":
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
    //是否需要行政主要领导审批控制
    if(instance.isOperator && instance.currentStep.indexOf("行政办确认") > -1){
        var isToMain = "<a class='isToWhere'><input type='checkbox' id='isToMain' checked>递交主要领导</a>";
        $("#moreSelectArea").append(isToMain);
        $("#isToMain").click(function () {
            if($(this).is(":checked")){
                instance.nextStep = "行政主要领导审批";
            }else{
                instance.nextStep = "流程结束";
            }
            $("#nextStep").text(instance.nextStep);
        });
    }
    var cFileName = $("#fileName");
    var cSealType = $("#sealType");
    var cSelectSection = $("#launchSection");
    var cTransactor = $("#transactor");
    cFileName.val(fileName);
    sealType && cSealType.find("option:contains("+sealType+")").attr("selected",true);
    cSelectSection.val(launchSection);
    cTransactor.val(transactor);
    if(instance.isOperator && instance.isLaunch) {
        cFileName.attr("readonly",false);
        cFileName.removeClass("disable");
        cFileName.addClass("default");
        cSealType.removeAttr("disabled");
        cSealType.removeClass("disable");
        cSealType.addClass("default");
    }

    initSectionApproveControl(instance.nextStep == "分管领导审批",undefined);//科长审批信息显示控制
    initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdviceSection);//分管领导审批信息显示控制
    if(cSealType.val() == "行政类印章"){
        initAdminMainApproveControl(instance.currentStep.indexOf("行政主要领导审批") > -1,timeAdviceBranchLeader);//主要领导审批信息显示控制
        $("#advicePartyMainLeaderArea").css("display","none");
    }else{
        initPartyMainApproveControl(instance.currentStep.indexOf("党工委书记审批") > -1,timeAdviceBranchLeader);//主要领导审批信息显示控制
        $("#adviceAdminMainLeaderArea").css("display","none");
    }
}

$(document).ready(
    function init() {
        initCommon("sealCirculation");
        initContentInterface();
    }
);