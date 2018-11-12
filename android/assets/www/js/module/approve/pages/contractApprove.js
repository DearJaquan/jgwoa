/****************************以下内容为流程控制变量****************************/
//可发起角色列表
var canLaunch = ["科长","科员"];

/****************************以下内容为流程内容变量****************************/
//项目名称
var projectName;
//合同类型
var contractType;
//合同编号
var contractNumber;
//合同对方
var contractParty;
//主要原因
var mainContent;
//是否关联发起
var isRelateLaunch = false;
//是否被退回
var isBack;

//科室意见
var adviceSection;
//科室意见填写时间
var timeAdviceSection;
//科室意见的历史记录
var historyAdviceSection;

//法律顾问、投资监理意见
var adviceLegalAdviser;
//法律顾问、投资监理意见填写时间
var timeAdviceLegalAdviser;
//法律顾问、投资监理意见的历史记录
var historyAdviceLegalAdviser;


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

/****************************以下内容为流程必须函数****************************/
/**
 * 依据当前步骤生成下一步骤
 */
function getNextStep() {
    if(instance.isOperator) {
        switch (instance.currentStep) {
            case "发起流程":
                if (user.launchRole.name.indexOf("科员") > -1) {
                    instance.nextStep = "科室审批";
                } else {
                    instance.nextStep = "法律顾问、投资监理审批";
                }
                break;
            case "科室审批":
                instance.nextStep = "法律顾问、投资监理审批";
                break;
            case "法律顾问、投资监理审批":
                instance.nextStep = "分管领导审批";
                break;
            case "分管领导审批":
                instance.nextStep = "行政主要领导审批";
                break;
            case "行政主要领导审批":
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
            projectName = value[0].projectName;
            contractNumber = value[0].projectNum;
            instance.launcherSection = value[0].department;
        };
        var selectList = [];
        selectList.push(relate);
        getRelatedInstanceDetail(selectList,"CP",getUserSection(user.launchRole.name),callBack);
    }
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
    isShowBranchSelect = instance.nextStep == "法律顾问、投资监理审批";
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
    projectName = data.projectName;
    contractType = data.contractType;
    contractNumber = data.contractNumber;
    contractParty=data.contractParty;
    mainContent = data.mainContent;
    adviceSection = data.adviceSection;
    timeAdviceSection = data.timeAdviceSection;
    adviceLegalAdviser = data.adviceLegalAdviser;
    timeAdviceLegalAdviser = data.timeAdviceLegalAdviser;
    adviceBranchLeader = data.adviceBranchLeader;
    timeAdviceBranchLeader = data.timeAdviceBranchLeader;
    adviceAdminMainLeader = data.adviceAdminMainLeader;
    timeAdviceAdminMainLeader = data.timeAdviceMainLeader;
    fileList = data.fileList;
    isRelateLaunch = data.isRelateLaunch;
    isBack = data.isBack;
}

function checkContent() {
    var isCorrect = true;
    if(instance.currentStep.indexOf("发起")>-1){
        isCorrect = checkNotNull($("#projectName").val(),$("#hintProjectName")) && isCorrect;
        isCorrect = checkNotNull($("#contractParty").val(),$("#hintContractParty")) && isCorrect;
        isCorrect = checkNotNull($("#mainContent").val(),$("#hintMainContent")) && isCorrect;
        if(isRelateLaunch){
            isCorrect = checkRelateProcedure($("#hintFileList")) && isCorrect;
        }
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent(){
    var content = {};
    var cProjectName = $("#projectName");
    var cContractType = $("#contractType");
    var cContractNumber = $("#contractNumber");
    var cContractParty = $("#contractParty");
    var cMainContent = $("#mainContent");
    switch (instance.currentStep){
        case "发起流程":
            content.projectName = cProjectName.val();
            content.contractType = cContractType.val();
            content.contractNumber = cContractNumber.val();
            content.contractParty = cContractParty.val();
            content.mainContent = cMainContent.val();
            if(user.launchRole.name.indexOf("科员") > -1){
                content.signatureStaff = user.id;
                content.timeAdviceStaff = new Date().Format();
            }else{
                content.signatureSection = user.id;
                content.adviceSection = $("#adviceSection").val();
                content.historyAdviceSection = "adviceSection";
                content.timeAdviceSection = $("#timeAdviceSection").text();
            }
            content.isRelateLaunch = isRelateLaunch;
            break;
        case "科室审批":
            content.adviceSection = $("#adviceSection").val();
            content.historyAdviceSection = "adviceSection";
            content.signatureSection = user.id;
            content.timeAdviceSection = $("#timeAdviceSection").text();
            break;
        case "法律顾问、投资监理审批":
            content.adviceLegalAdviser = $("#adviceLegalAdviser").val();
            content.historyAdviceLegalAdviser = "adviceLegalAdviser";
            content.signatureLegalAdviser = user.id;
            content.timeAdviceLegalAdviser = $("#timeAdviceLegalAdviser").text();
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
    // if(instance.isOperator){
    //     switch (instance.currentStep){
    //         case "发起流程":
    //             if(isRelateLaunch){
    //                 $("[name='delete']",$("[data-type='procedure']",$("#fileList"))).css("display","none");
    //             }else{
    //                 cRelateProcedure.css("display", "inline");
    //                 cRelateProcedure.click(function () {
    //                     getRelatedInstanceList("CP",instance.launcherSection);
    //                 });
    //             }
    //             break;
    //     }
    // }
    var cProjectName = $("#projectName");
    var cContractType = $("#contractType");
    var cContractNumber = $("#contractNumber");
    var cContractParty = $("#contractParty");
    var cMainContent = $("#mainContent");
    cProjectName.val(projectName);
    contractType && cContractType.val(contractType);
    cContractNumber.val(contractNumber);
    cContractParty.val(contractParty);
    cMainContent.val(mainContent);
    if(instance.isOperator && instance.isLaunch) {
        if(isRelateLaunch){
            cContractType.css("display","none");
        }else{
            cContractNumber.css("display","none");
            cContractType.removeAttr("disabled");
            cContractType.removeClass("disable");
            cContractType.addClass("default");
            cProjectName.attr("readonly",false);
            cProjectName.removeClass("disable");
            cProjectName.addClass("default");
        }
        cContractParty.attr("readonly",false);
        cContractParty.removeClass("disable");
        cContractParty.addClass("default");
        cMainContent.attr("readonly",false);
        cMainContent.removeClass("disable");
        cMainContent.addClass("default");
    }else{
        cContractType.css("display","none");
    }
    initSectionApproveControl(instance.nextStep == "法律顾问、投资监理审批",undefined);//科长审批信息显示控制
    initLegalAdviserApproveControl(instance.currentStep == "法律顾问、投资监理审批",timeAdviceSection);
    initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdviceLegalAdviser);//分管领导审批信息显示控制
    initAdminMainApproveControl(instance.currentStep.indexOf("行政主要领导审批") > -1,timeAdviceBranchLeader);//主要领导审批信息显示控制
}

$(document).ready(
    function init() {
        initCommon("contractApprove");
        initContentInterface();
    }
);
//
// function clickOnSelectRelate(type) {
//     $("#tableContent").find("a").click(function () {
//         var selectID = $(this).attr("data-id");
//         switch (instance.currentStep){
//             case "发起流程":
//                 var callBack = function (data) {
//                     createAttachmentProcedure(data[1]);
//                     projectName = data[0].name;
//                     contractNumber = data[0].projectNum;
//                     var cProjectName = $("#projectName");
//                     var cContractType = $("#contractType");
//                     var cContractNumber = $("#contractNumber");
//                     cProjectName.val(projectName);
//                     cContractNumber.val(contractNumber);
//                     cContractType.css("display","none");
//                     cContractNumber.css("display","inline");
//                     cProjectName.attr("readonly",true);
//                     cProjectName.removeClass("default");
//                     cProjectName.addClass("disable");
//                     cContractNumber.attr("readonly",true);
//                     cContractNumber.removeClass("default");
//                     cContractNumber.addClass("disable");
//                     isRelate = true;
//                 };
//                 break;
//         }
//         var selectList = [];
//         selectList.push(selectID);
//         getRelatedInstanceDetail(selectList,type,instance.launcherSection,callBack);
//         $("#maskHistory").click();
//     });
// }