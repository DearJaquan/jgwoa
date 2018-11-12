/**
 * Created by Dingfengwu on 2017/8/23.
 */

var canLaunch = ["科员", "科长", "分管领导", "主要领导"];
/**************************************************************************/
//会议编号
var meetingNum;
//会议名称
var meetingName;
//会议类别
var meetingType;
//召开事由
var meetingReason;
//会议人数
var meetingNumber;
//会议时间
var meetingDate;
//会议地点
var meetingPlace;
//会议责任单位
var meetingUnit;
//会议责任人
var meetingPerson;
//表内容
var content;
//修改的元素对象
var infoEditFor;
//转账
var transfer;
//公务卡
var officialCard;
//报销金额
var total;
//公用经费
var publishFunds;
// //项目经费
// var projectFunds;
// //项目名称
// var projectName;
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

/**
 * 依据当前步骤生成下一步骤
 */
function getNextStep() {
    if(instance.isOperator){
        switch (instance.currentStep) {
            case "发起流程":
                if(user.launchRole.name.indexOf("科员") > -1){
                    instance.nextStep = "科室审批";
                }else if(user.launchRole.name.indexOf("科长") > -1){
                    instance.nextStep = "分管领导审批";
                }else{
                    instance.nextStep = "行政办填写";
                }
                break;
            case "科室审批":
                instance.nextStep = "分管领导审批";
                break;
            case "分管领导审批":
                instance.nextStep = "发起人填写";
                break;
            case "发起人填写":
                instance.nextStep = "行政办填写";
                break;
            case "行政办填写":
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
    meetingUnit = instance.launcherSection=="领导"?user.name:instance.launcherSection;
    if(user.launchRole.name.indexOf("科员") == -1){
        meetingPerson = user.name;
    }
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
    instance.launcherSection = getUserSection(user.launchRole.name);
    getNextStep();
    $("#nextStep").text(instance.nextStep);
    $("#meetingUnit").val(instance.launcherSection=="领导"?user.name:instance.launcherSection);
    if(user.launchRole.name.indexOf("领导") > -1){
        $("#adviceSectionArea").css("display","none");
        $("#adviceBranchLeaderArea").css("display","none");
    }else{
        $("#adviceSectionArea").css("display","inline");
        $("#adviceBranchLeaderArea").css("display","inline");
        initSectionApproveControl(instance.nextStep == "分管领导审批",undefined);
    }
    $("#confirm").parent().empty();
    isShowBranchSelect = instance.nextStep == "分管领导审批";
    initOperateInterface();
}

/**
 * 获取流程内容数据
 */
function getContentData(data) {
    meetingNum = data.meetingNum;
    meetingName = data.meetingName;
    meetingType = data.meetingType;
    meetingReason = data.meetingReason;
    meetingNumber = data.meetingNumber;
    meetingDate = data.meetingDate;
    meetingPlace = data.meetingPlace;
    meetingUnit = data.meetingUnit;
    meetingPerson = data.meetingPerson;

    content = data.content;
    transfer = data.transfer;
    officialCard = data.officialCard;
    total = data.total;
    publishFunds = data.publishFunds;
    // projectFunds = data.projectFunds;
    // projectName = data.projectName;
    adviceSection = data.adviceSection;
    timeAdviceSection = data.timeAdviceSection;
    adviceBranchLeader = data.adviceBranchLeader;
    timeAdviceBranchLeader = data.timeAdviceBranchLeader;
    fileList = data.fileList;
    isBack = data.isBack;
}

function checkContent() {
    var isCorrect = true;
    switch (instance.currentStep){
        case "发起流程":
        case "发起人填写":
            isCorrect = checkNotNull($("#meetingName").val(),$("#hintMeetingName")) && isCorrect;
            isCorrect = checkNotNull($("#meetingType").val(),$("#hintMeetingType")) && isCorrect;
            isCorrect = checkNotNull($("#meetingReason").val(),$("#hintMeetingReason")) && isCorrect;
            isCorrect = checkNotNullPositiveInteger($("#meetingNumber").val(),$("#hintMeetingNumber")) && isCorrect;
            isCorrect = checkNotNullTimeDate($("#meetingDate").val(),$("#hintMeetingDate")) && isCorrect;
            isCorrect = checkNotNull($("#meetingPlace").val(),$("#hintMeetingPlace")) && isCorrect;
            // if(user.launchRole.name.indexOf("领导") > -1){
            //     isCorrect = checkNotNull($("#meetingNum").val(),$("#hintMeetingNum")) && isCorrect;
            // }
            break;
        case "行政办填写":
            isCorrect = checkHasContent($("#tableLineList").children().length,$("#hintForBillInfo")) && isCorrect;
            // var cPublicFunds = $("#publishFunds").val();
            // var cProjectFunds = $("#projectFunds").val();
            // isCorrect = checkPositiveNum(cPublicFunds,$("#hintPublishFunds")) && isCorrect;
            // isCorrect = checkPositiveNum(cProjectFunds,$("#hintProjectFunds")) && isCorrect;
            // if(!(checkNotNull(cPublicFunds) || checkNotNull(cProjectFunds))){
            //     $("#hintWay").text("至少选择一个列支渠道");
            //     isCorrect = false;
            // }else{
            //     $("#hintWay").text("");
            // }
            // if(checkNotNull(cProjectFunds)){
            //     isCorrect = checkNotNull(cProjectFunds,$("#hintProjectFunds")) && isCorrect;
            //     isCorrect = checkNotNull($("#projectName").val(),$("#hintProjectName")) && isCorrect;
            // }
            break;
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent() {
    var content = {};
    var cMeetingNum = $("#meetingNum");
    var cMeetingName = $("#meetingName");
    var cMeetingType = $("#meetingType");
    var cMeetingReason = $("#meetingReason");
    var cMeetingNumber = $("#meetingNumber");
    var cMeetingDate = $("#meetingDate");
    var cMeetingPlace = $("#meetingPlace");
    var cMeetingUnit = $("#meetingUnit");
    var cMeetingPerson = $("#meetingPerson");
    var cTransfer = $("#transferTotal");
    var cOfficialCard = $("#officialCardTotal");
    var cTotal = $("#total");
    var cPublishFunds = $("#publishFunds");
    // var cProjectFunds = $("#projectFunds");
    // var cProjectName = $("#projectName");
    switch (instance.currentStep) {
        case "发起流程":
            // if(user.launchRole.name.indexOf("领导") > -1){
            //     content.meetingNum = cMeetingNum.val();
            // }
            content.meetingName = cMeetingName.val();
            content.meetingType = cMeetingType.find("option:selected").text();
            content.meetingReason = cMeetingReason.val();
            content.meetingNumber = cMeetingNumber.val();
            content.meetingDate = cMeetingDate.val();
            content.meetingPlace = cMeetingPlace.val();
            content.meetingUnit = cMeetingUnit.val();
            if(user.launchRole.name.indexOf("科员") == -1){
                content.meetingPerson = cMeetingPerson.val();
                content.signatureTransactor = user.id;
                content.timeAdviceTransactor = new Date().Format();
            }
            if(user.launchRole.name.indexOf("科长") > -1){
                content.adviceSection = $("#adviceSection").val();
                content.historyAdviceSection = "adviceSection";
                content.signatureSection = user.id;
                content.timeAdviceSection = $("#timeAdviceSection").text();
            }
            break;
        case "科室审批":
            content.meetingPerson = cMeetingPerson.val();
            content.signatureTransactor = user.id;
            content.timeAdviceTransactor = new Date().Format();
            content.adviceSection = $("#adviceSection").val();
            content.historyAdviceSection = "adviceSection";
            content.signatureSection = user.id;
            content.timeAdviceSection = $("#timeAdviceSection").text();
            break;
        case "分管领导审批":
            content.adviceBranchLeader = $("#adviceBranchLeader").val();
            content.historyAdviceBranchLeader = "adviceBranchLeader";
            content.signatureBranchLeader = user.id;
            content.timeAdviceBranchLeader =$("#timeAdviceBranchLeader").text();
            break;
        case "发起人填写":
            // content.meetingNum = cMeetingNum.val();
            content.meetingName = cMeetingName.val();
            content.meetingType = cMeetingType.find("option:selected").text();
            content.meetingReason = cMeetingReason.val();
            content.meetingNumber = cMeetingNumber.val();
            content.meetingDate = cMeetingDate.val();
            content.meetingPlace = cMeetingPlace.val();
            break;
        case "行政办填写":
            content.content = getAll();
            content.transfer = cTransfer.val();
            content.officialCard = cOfficialCard.val();
            content.total = cTotal.val();
            content.publishFunds = cPublishFunds.val();
            // content.projectFunds = cProjectFunds.val();
            // content.projectName = cProjectName.val();
            break;
    }
    content.isBack = isBack;
    content.fileList = fileList;
    return content;
}

/**
 * 初始化流程内容控件
 */
function initContentInterface() {
    var cRelateProcedure = $("#relateProcedure");
    cRelateProcedure.css("display", "none");
    var cMeetingNum = $("#meetingNum");
    var cMeetingName = $("#meetingName");
    var cMeetingType = $("#meetingType");
    var cMeetingReason = $("#meetingReason");
    var cMeetingNumber = $("#meetingNumber");
    var cMeetingDate = $("#meetingDate");
    var cMeetingPlace = $("#meetingPlace");
    var cMeetingUnit = $("#meetingUnit");
    var cMeetingPerson = $("#meetingPerson");
    var cTransfer = $("#transferTotal");
    var cOfficialCard = $("#officialCardTotal");
    var cTotal = $("#total");
    var cEditTable = $(".tableLineEdit");
    var cPublishFunds = $("#publishFunds");
    // var cProjectFunds = $("#projectFunds");
    // var cProjectName = $("#projectName");
    cMeetingNum.val(meetingNum);
    cMeetingName.val(meetingName);
    meetingType && cMeetingType.val(meetingType);
    cMeetingReason.val(meetingReason);
    cMeetingNumber.val(meetingNumber);
    cMeetingDate.val(meetingDate);
    cMeetingPlace.val(meetingPlace);
    cMeetingUnit.val(meetingUnit);
    if(instance.isOperator && instance.currentStep == "科室审批"){
        meetingPerson = user.name;

    }
    cMeetingPerson.val(meetingPerson);
    cTransfer.val(transfer);
    cOfficialCard.val(officialCard);
    cTotal.val(total);
    cPublishFunds.val(publishFunds);
    // cProjectFunds.val(projectFunds);
    // cProjectName.val(projectName);
    if(instance.isOperator && (instance.currentStep == "发起流程" || instance.currentStep == "发起人填写")){
        cMeetingName.attr("readonly",false);
        cMeetingName.removeClass("disable");
        cMeetingName.addClass("default");
        cMeetingType.removeAttr("disabled");
        cMeetingType.removeClass("disable");
        cMeetingType.addClass("default");
        cMeetingReason.attr("readonly",false);
        cMeetingReason.removeClass("disable");
        cMeetingReason.addClass("default");
        cMeetingNumber.attr("readonly",false);
        cMeetingNumber.removeClass("disable");
        cMeetingNumber.addClass("default");
        cMeetingDate.attr("readonly",false);
        cMeetingDate.removeClass("disable");
        cMeetingDate.addClass("longDate");
        laydate.render({
            elem: '#meetingDate',
            type: 'datetime'
        });
        cMeetingPlace.attr("readonly",false);
        cMeetingPlace.removeClass("disable");
        cMeetingPlace.addClass("default");
    }
    // if(instance.isOperator && instance.currentStep == "发起流程" && user.launchRole.name.indexOf("领导") > -1){
    //     cMeetingNum.attr("readonly",false);
    //     cMeetingNum.removeClass("disable");
    //     cMeetingNum.addClass("default");
    // }
    // if(instance.isOperator && instance.currentStep == "发起人填写"){
    //     cMeetingNum.attr("readonly",false);
    //     cMeetingNum.removeClass("disable");
    //     cMeetingNum.addClass("default");
    // }
    if(instance.isOperator && instance.currentStep=="行政办填写"){
        cEditTable.removeClass("disappear");
        $("#moreTableLine").css("display","inline");
        // cPublishFunds.attr("readonly",false);
        // cPublishFunds.removeClass("disableMoney");
        // cPublishFunds.addClass("money");
        // cProjectFunds.attr("readonly",false);
        // cProjectFunds.removeClass("disableMoney");
        // cProjectFunds.addClass("money");
        // cProjectName.attr("readonly",false);
        // cProjectName.removeClass("disable");
        // cProjectName.addClass("default");
    }
    setAll();
    $("#saveForTableLine").click(function () {
        var cPayContent = $("#selectForPayContent");
        var cTransfer = $("#inputForTransfer");
        var cOfficialCard = $("#inputForOfficialCard");
        var cUnitOrNum = $("#inputForUnitOrNum");
        var cComment = $("#inputForComment");
        var isCorrect = true;
        isCorrect = checkNotNullPositiveNum(cTransfer.val(),$("#hintInputForTransfer")) && isCorrect;
        isCorrect = checkNotNullPositiveNum(cOfficialCard.val(),$("#hintForMoneyClass")) && isCorrect;
        // isCorrect = checkNotNull(cUnitOrNum.val(),$("#hintForUnitOrNum")) && isCorrect;
        // isCorrect = checkNotNull(cComment.val(),$("#hintForComment")) && isCorrect;
        if(isCorrect){
            if(infoEditFor){
                var cInfo = infoEditFor.find("span");
                cPayContent.removeClass("disable");
                cPayContent.addClass("default");
                cPayContent.find("option[value=temp]").remove();
                cPayContent.removeAttr("disabled");
                cInfo[1].innerText = cTransfer.val();
                cInfo[2].innerText = cOfficialCard.val();
                cInfo[3].innerText = cUnitOrNum.val();
                cInfo[4].innerText = cComment.val();
            }else{
                var info = {};
                info.content = cPayContent.val();
                info.transfer = cTransfer.val();
                info.card = cOfficialCard.val();
                info.unit = cUnitOrNum.val();
                info.comment = cComment.val();
                addBillInfo(info, true);
                if(info.content == "其他费用"){
                    var cSelected = cPayContent.find("option:selected");
                    var count = cSelected.attr("data-count")-1;
                    cSelected.attr("data-count",count);
                    if(cSelected.attr("data-count")==0){
                        cSelected.remove();
                    }
                }else{
                    cPayContent.find("option:selected").remove();
                }
                var num = $("#tableLineList").children().length;
                if(num > 5){
                    $("#moreTableLine").css("display","none");
                }
            }
            cEditTable.addClass("disappear");
            updateMoney();
        }
    });

    $("#moreTableLine").click(function () {
        cEditTable.removeClass("disappear");
        infoEditFor = undefined;
        var cPayContent = $("#selectForPayContent");
        cPayContent.removeClass("disable");
        cPayContent.addClass("default");
        cPayContent.find("option[value=temp]").remove();
        cPayContent.removeAttr("disabled");
        $("#inputForTransfer").val("");
        $("#inputForOfficialCard").val("");
        $("#inputForUnitOrNum").val("");
        $("#inputForComment").val("");
    });

    if(instance.launcherSection.indexOf("领导") == -1){
        initSectionApproveControl(instance.nextStep == "分管领导审批",undefined);//科长审批信息显示控制
        initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdviceSection);//分管领导审批信息显示控制
    }else{
        $("#adviceSectionArea").css("display","none");
        $("#adviceBranchLeaderArea").css("display","none");
    }
}

$(document).ready(
    function init() {
        initCommon("meetingCostGather");
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
        element.content = cInfo[0].innerText;
        element.transfer = cInfo[1].innerText;
        element.card = cInfo[2].innerText;
        element.unit = cInfo[3].innerText;
        element.comment = cInfo[4].innerText;
        tableArr.push(element);
    }
    return tableArr;
}
//填表
function setAll(){
    if(content){
        for(var i = 0; i<content.length; i++){
            if(instance.isOperator && instance.isLaunch){
                addBillInfo(content[i], true);
            }else{
                addBillInfo(content[i], false);
            }
        }
    }
}

function editTableLine(el) {
    infoEditFor = $(el).parent().parent();
    $(".tableLineEdit").removeClass("disappear");
    var cInfo = infoEditFor.find("span");
    var payType = cInfo[0].innerText;
    var cSelectForPayContent = $("#selectForPayContent");
    cSelectForPayContent.append("<option value='temp'>"+payType+"</option>");
    cSelectForPayContent.val("temp");
    cSelectForPayContent.removeClass("default");
    cSelectForPayContent.addClass("disable");
    cSelectForPayContent.attr("disabled",true);
    $("#inputForTransfer").val(cInfo[1].innerText);
    $("#inputForOfficialCard").val(cInfo[2].innerText);
    $("#inputForUnitOrNum").val(cInfo[3].innerText);
    $("#inputForComment").val(cInfo[4].innerText);
}

function deleteTableLine(el) {
    var rootE = $(el).parent().parent();
    var cInfo = rootE.find("span");
    var cPayContent = $("#selectForPayContent");
    if(cInfo[0].innerText == "其他费用"){
        var cSelected = $("#selectForPayContent option[value=其他费用]");
        if(cSelected.length > 0){
            var count = 1+parseInt(cSelected.attr("data-count"));
            cSelected.attr("data-count",count);
        }else{
            cPayContent.append("<option value='其他费用' data-count='1'>其他费用</option>");
        }
    }else{
        cPayContent.append("<option>"+cInfo[0].innerText+"</option>")
    }
    if(rootE.is(infoEditFor)){
        $("#tableLineEdit").addClass("disappear");
    }
    rootE.remove();
    if($("#tableLineList").children().length < 6){
        $("#moreTableLine").css("display","inline");
    }
    updateMoney();
    $(".tableLineEdit").addClass("disappear");
}

function addBillInfo(info, canOperate) {
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
        "<td width='120px' height='15px'><label>内容：<span>"+info.content+"</span></label></td>" +
        "<td width='150px' height='15px'><label>转账：<span>"+info.transfer+"</span></label></td>" +
        "</tr><tr>"+
        "<td width='150px' height='15px'><label>公务卡：<span>"+info.card+"</span></label></td>" +
        "<td width='200px' height='15px'><label>票据单位或号码：<span>"+info.unit+"</span></label></td>" +
        "</tr>" +
        "<tr>" +
        "<td colspan='2' height='20px'><label>备注：<span>"+info.comment+"</span></label></td>" +
        "</tr>" +
        "</table>" +
        "</div>";
    $("#tableLineList").append(newTableLine);
}

function updateMoney() {
    var details = $("#tableLineList").find(".tableDetail");
    transfer = 0;
    officialCard = 0;
    total = 0;
    for(var i=0; i<details.length; i++){
        var info = $(details[i]).find("span");
        var t = parseFloat(info[1].innerText);
        var c = parseFloat(info[2].innerText);
        transfer = accAdd(transfer,t);
        officialCard = accAdd(officialCard,c);
    }
    total = accAdd(transfer,officialCard);
    $("#transferTotal").val(transfer);
    $("#officialCardTotal").val(officialCard);
    $("#total").val(total);
    $("#publishFunds").val(total);
}