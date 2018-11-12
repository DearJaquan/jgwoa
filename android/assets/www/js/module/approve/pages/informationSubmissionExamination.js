/**
 * Created by DingFengwu on 2017/8/24.
 */

/****************************以下内容为流程控制变量****************************/
//可发起角色列表
var canLaunch = ["科长","科员"];

/****************************以下内容为流程内容变量****************************/
//编号
var num;
//时间
var date;
//信息名称
var infoName;
//发布机构
var publishUnit;
//文号
var contentCount;
//发文日期
var contentDate;
//内容描述
var contentDescribe;
//表内容
var content;
//修改的元素对象
var infoEditFor;
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
                instance.nextStep = "行政主要领导审批";
                break;
            case "行政主要领导审批":
                instance.nextStep = "流程结束";
                break;
            default:
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
    infoName = "嘉定区建设管理委公文类信息";
    publishUnit = "嘉定区建设管理委";
}

/**
 * 设置控制面板显示,不存在可不写
 */
function setControlData() {
    isShowBranchSelect = instance.nextStep == "分管领导审批";
    isAbleSelectBranch = user.launchRoleList.length > 1 || isShowBranchSelect;
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
    num = data.num;
    date = data.date;
    infoName=data.infoName;
    publishUnit = data.publishUnit;
    contentCount = data.contentCount;
    contentDate=data.contentDate;
    contentDescribe = data.contentDescribe;
    content = data.content;
    adviceSection = data.adviceSection;
    timeAdviceSection = data.timeAdviceSection;
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
            isCorrect = checkNotNull($("#date").val(), $("#hintDate")) && isCorrect;
            isCorrect = checkNotNull($("#infoName").val(), $("#hintInfoName")) && isCorrect;
            isCorrect = checkNotNull($("#publishUnit").val(), $("#hintPublishUnit")) && isCorrect;
            isCorrect = checkNotNull($("#contentCount").val(), $("#hintContentCount")) && isCorrect;
            isCorrect = checkNotNull($("#contentDate").val(), $("#hintContentDate")) && isCorrect;
            isCorrect = checkNotNull($("#contentDescribe").val(), $("#hintContentDescribe")) && isCorrect;
            break;
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent(){
    var content = {};
    var cNum = $("#num");
    var cDate = $("#date");
    var cInfoName = $("#infoName");
    var cPublishUnit = $("#publishUnit");
    var cContentCount = $("#contentCount");
    var cContentDate = $("#contentDate");
    var cContentDescribe = $("#contentDescribe");
    switch (instance.currentStep) {
        case "发起流程":
            content.num = cNum.val();
            content.date = cDate.val();
            content.infoName = cInfoName.val();
            content.publishUnit = cPublishUnit.val();
            content.contentCount = cContentCount.val();
            content.contentDate = cContentDate.val();
            content.contentDescribe = cContentDescribe.val();
            content.content = getAll();
            content.signatureTransactor = user.id;
            content.timeAdviceTransactor = new Date().Format();
            if(user.launchRole.name.indexOf("科长") > -1){
                content.adviceSection = $("#adviceSection").val();
                content.historyAdviceSection = "adviceSection";
                content.signatureSection = user.id;
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
            content.historyAdviceMainLeader = "adviceAdminMainLeader";
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
    var cNum = $("#num");
    var cDate = $("#date");
    var cInfoName = $("#infoName");
    var cPublishUnit = $("#publishUnit");
    var cContentCount = $("#contentCount");
    var cContentDate = $("#contentDate");
    var cContentDescribe = $("#contentDescribe");
    var cEditTable = $(".tableLineEdit");
    cNum.val(num);
    cDate.val(date);
    cInfoName.val(infoName);
    cPublishUnit.val(publishUnit);
    cContentCount.val(contentCount);
    cContentDate.val(contentDate);
    cContentDescribe.val(contentDescribe);
    if(instance.isOperator && instance.currentStep == "发起流程"){
        cDate.attr("readonly",false);
        cDate.removeClass("disable");
        cDate.addClass("longDate");
        laydate.render({
            elem: '#date'
        });
        cContentCount.attr("readonly",false);
        cContentCount.removeClass("disable");
        cContentCount.addClass("default");
        cContentDate.attr("readonly",false);
        cContentDate.removeClass("disable");
        cContentDate.addClass("longDate");
        laydate.render({
            elem: '#contentDate'
        });
        cContentDescribe.attr("readonly",false);
        cContentDescribe.removeClass("disable");
        cContentDescribe.addClass("default");

        cEditTable.removeClass("disappear");
        $("#moreTableLine").css("display","inline");
    }
    setAll();
    laydate.render({
        elem: '#inputForGenerateDate',
    });
    $("#saveForTableLine").click(function () {
        var cInfoName = $("#inputForInfoName");
        var cContentDescribe = $("#inputForContentDescribe");
        var cGetNum = $("#inputForGetNum");
        var cReleaseOrg = $("#inputForReleaseOrg");
        var cGenerateDate = $("#inputForGenerateDate");
        var cKeyWord = $("#inputForKeyWord");
        var isCorrect = true;
        isCorrect = checkNotNull(cInfoName.val(),$("#hintForInfoName")) && isCorrect;
        isCorrect = checkNotNull(cContentDescribe.val(),$("#hintForContentDescribe")) && isCorrect;
        isCorrect = checkNotNull(cGetNum.val(),$("#hintForGetNum")) && isCorrect;
        isCorrect = checkNotNull(cReleaseOrg.val(),$("#hintForReleaseOrg")) && isCorrect;
        isCorrect = checkNotNull(cGenerateDate.val(),$("#hintForGenerateDate")) && isCorrect;
        isCorrect = checkNotNull(cKeyWord.val(),$("#hintForKeyWord")) && isCorrect;
        if(isCorrect){
            if(infoEditFor){
                var cInfo = infoEditFor.find("span");
                cInfo[0].innerText = cGetNum.val();
                cInfo[1].innerText = cInfoName.val();
                cInfo[2].innerText = cReleaseOrg.val();
                cInfo[3].innerText = cGenerateDate.val();
                cInfo[4].innerText = cContentDescribe.val();
                cInfo[5].innerText = cKeyWord.val();
            }else{
                var info = {};
                info.getNum = cGetNum.val();
                info.infoName = cInfoName.val();
                info.releaseOrg = cReleaseOrg.val();
                info.generateDate = cGenerateDate.val();
                info.contentDescribe = cContentDescribe.val();
                info.keyWord = cKeyWord.val();
                addListInfo(info, true);
                var num = $("#tableLineList").children().length;
                if(num > 6){
                    $("#moreTableLine").css("display","none");
                }
            }
            cEditTable.addClass("disappear");
        }
    });

    $("#moreTableLine").click(function () {
        cEditTable.removeClass("disappear");
        infoEditFor = $("#tableLineList").children("div:last");
        var cInfo = infoEditFor.find("span");
        var cGetNum = $("#inputForGetNum");
        var cInfoName = $("#inputForInfoName");
        var cReleaseOrg = $("#inputForReleaseOrg");
        var cGenerateDate = $("#inputForGenerateDate");
        var cContentDescribe = $("#inputForContentDescribe");
        var cKeyWord = $("#inputForKeyWord");
        cGetNum.val(cInfo[0].innerText);
        cInfoName.val(cInfo[1].innerText);
        cReleaseOrg.val(cInfo[2].innerText);
        cGenerateDate.val(cInfo[3].innerText);
        cContentDescribe.val(cInfo[4].innerText);
        cKeyWord.val(cInfo[5].innerText);
        infoEditFor = undefined;
    });

    initSectionApproveControl(instance.nextStep == "分管领导审批",undefined);//科长审批信息显示控制
    initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdviceSection);//分管领导审批信息显示控制
    initAdminMainApproveControl(instance.currentStep == "行政主要领导审批",timeAdviceBranchLeader);//主要领导审批信息显示控制
}

$(document).ready(
    function init() {
        initCommon("informationSubmissionExamination");
        initContentInterface();
    }
);

//获取表中的值
function getAll(){
    var tableArr = [];
    var tableList = $("#tableLineList").children();
    for(var i=0; i<tableList.length; i++){
        var cInfo = $(tableList[i]).find("span");
        var element = {};
        element.getNum = cInfo[0].innerText;
        element.infoName = cInfo[1].innerText;
        element.releaseOrg = cInfo[2].innerText;
        element.generateDate = cInfo[3].innerText;
        element.contentDescribe = cInfo[4].innerText;
        element.keyWord = cInfo[5].innerText;
        tableArr.push(element);
    }
    return tableArr;
}

//填表
function setAll(){
    if(content){
        for(var i = 0; i<content.length; i++){
            if(instance.isOperator && instance.isLaunch){
                addListInfo(content[i], true);
            }else{
                addListInfo(content[i], false);
            }
        }
    }
}

function editTableLine(el) {
    infoEditFor = $(el).parent().parent();
    $(".tableLineEdit").removeClass("disappear");
    var cInfo = infoEditFor.find("span");
    var cGetNum = $("#inputForGetNum");
    var cInfoName = $("#inputForInfoName");
    var cReleaseOrg = $("#inputForReleaseOrg");
    var cGenerateDate = $("#inputForGenerateDate");
    var cContentDescribe = $("#inputForContentDescribe");
    var cKeyWord = $("#inputForKeyWord");
    cGetNum.val(cInfo[0].innerText);
    cInfoName.val(cInfo[1].innerText);
    cReleaseOrg.val(cInfo[2].innerText);
    cGenerateDate.val(cInfo[3].innerText);
    cContentDescribe.val(cInfo[4].innerText);
    cKeyWord.val(cInfo[5].innerText);
}

function deleteTableLine(el) {
    var rootE = $(el).parent().parent();
    if(rootE.is(infoEditFor)){
        $("#tableLineEdit").addClass("disappear");
    }
    rootE.remove();
    if($("#tableLineList").children().length < 7){
        $("#moreTableLine").css("display","inline");
    }
    $(".tableLineEdit").addClass("disappear");
}

function addListInfo(info, canOperate) {
    var newTableLine = "<div class='tableDetail'>";
    if(canOperate){
        newTableLine +=
            "<div style='margin-top: 5px'>" +
            "<a href='javascript:void(0);' onclick='editTableLine(this)' title='修改' style='padding-left: 10px'><img src='../../resources/images/editTableLine.png'></a>" +
            "<a href='javascript:void(0);' onclick='deleteTableLine(this)' title='删除' style='padding-left: 10px'><img src='../../resources/images/deleteTableLine.png'></a>" +
            "</div>";
    }
    newTableLine +=
        "<table>" +
        "<tr>" +
        "<td width='150px' height='15px'><label>索取号：<span>"+info.getNum+"</span></label></td>" +
        "<td width='300px' height='15px'><label>信息名称：<span>"+info.infoName+"</span></label></td>" +
        "<td width='150px' height='15px'><label>发布机构：<span>"+info.releaseOrg+"</span></label></td>" +
        "<td width='150px' height='15px'><label>产生日期：<span>"+info.generateDate+"</span></label></td>" +
        "</tr>" +
        "<tr>" +
        "<td colspan='2' height='20px'><label>内容描述：<span>"+info.contentDescribe+"</span></label></td>" +
        "<td colspan='2' height='20px'><label>关键字：<span>"+info.keyWord+"</span></label></td>" +
        "</tr>" +
        "</table>" +
        "</div>";
    $("#tableLineList").append(newTableLine);
}