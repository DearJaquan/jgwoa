/**
 * Created by DingFengwu on 2017/10/12.
 */
/****************************以下内容为流程控制变量****************************/
//可发起角色列表
var canLaunch = ["科长","科员","领导"];

/****************************以下内容为流程内容变量****************************/
var amountApply;
var isSelfUnit;
var unitName;
var businessContent;
var toWhere;
var placeName;
var isGoUrbanCenter;
var isGoUrbanOne;
var isGoUrbanTwo;
var urbanCenterName;
var urbanOneName;
var urbanTwoName;
var outTimeFrom;
var outTimeTo;
var outDays;
var attendSection;
var allPersonList = [];
var attendList = [];
var eatWay;
var isLive;
var outWay;
var kilometers;
var adviceSectionOld;
var timeAdviceSectionOld;
var adviceLeaderOld;
var isReimbursementPart = false;
var amountPay;
var reimbursementStandard;
var selfDrivePay;
var cityTrafficPay;
var throughPay;
var livePay;
var totalPay;
var isBack;

//科室意见
var adviceSection;
//科室意见填写时间
var timeAdviceSection;
//科室意见的历史记录
var historyAdviceSection;
//科室意见
var advicePlanningSection;
//科室意见填写时间
var timeAdvicePlanningSection;
//科室意见的历史记录
var historyAdvicePlanningSection;
//分管领导意见,为填写内容
var adviceBranchLeader;
//分管领导意见填写时间
var timeAdviceBranchLeader;
//分管领导意见的历史记录
var historyAdviceBranchLeader;

/****************************以下内容为流程必须函数****************************/
/**
 * 依据当前步骤生成下一步骤
 */
function getNextStep() {
    if(instance.isOperator){
        switch (instance.currentStep){
            case "发起流程":
                if(user.launchRole.name.indexOf("科员") > -1){
                    instance.nextStep = "科室审批（申请）";
                }else if(user.launchRole.name.indexOf("科长") > -1){
                    instance.nextStep = "分管领导审批";
                }else{
                    instance.nextStep = "外出用车";
                }
                break;
            case "科室审批（申请）":
                instance.nextStep = "分管领导审批";
                break;
            case "分管领导审批":
                instance.nextStep = "外出用车";
                break;
            case "行政办确认":
                instance.nextStep = "外出用车";
                break;
            case "行政办填写":
                instance.nextStep = "流程结束";
                break;
            case "发起人填写":
                if(user.launchRole.name.indexOf("科员") > -1){
                    instance.nextStep = "科室审批（报销）";
                }else{
                    instance.nextStep = "计划科审批";
                }
                break;
            case "科室审批（报销）":
                instance.nextStep = "计划科审批";
                break;
            case "计划科审批":
                instance.nextStep = "流程结束";
                break;
        }
    }
}

/**
 * 新建流程时的初始化流程内容数据
 */
function setNewData() {
    attendSection = getUserSection(user.launchRole.name);
    if(attendSection == "领导"){
        attendSection = "个人";
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
    isShowBranchSelect = instance.nextStep == "分管领导审批";
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
    amountApply = data.amountApply;
    isSelfUnit = data.isSelfUnit;
    unitName = data.unitName;
    businessContent = data.businessContent;
    toWhere = data.toWhere;
    placeName = data.placeName;
    isGoUrbanCenter = data.isGoUrbanCenter;
    isGoUrbanOne = data.isGoUrbanOne;
    isGoUrbanTwo = data.isGoUrbanTwo;
    urbanCenterName = data.urbanCenterName;
    urbanOneName = data.urbanOneName;
    urbanTwoName = data.urbanTwoName;
    outTimeFrom = data.outTimeFrom;
    outTimeTo = data.outTimeTo;
    outDays = data.outDays;
    attendSection = data.attendSection;
    attendList = data.attendList;
    eatWay = data.eatWay;
    isLive = data.isLive;
    outWay = data.outWay;
    kilometers = data.kilometers;
    adviceSectionOld = data.adviceSectionOld;
    timeAdviceSectionOld = data.timeAdviceSectionOld;
    adviceLeaderOld = data.adviceBranchLeader;
    isReimbursementPart = data.isReimbursementPart;
    amountPay = data.amountPay;
    reimbursementStandard = data.reimbursementStandard;
    selfDrivePay = data.selfDrivePay;
    cityTrafficPay = data.cityTrafficPay;
    throughPay = data.throughPay;
    livePay = data.livePay;
    totalPay = data.totalPay;
    adviceSection = data.adviceSection;
    timeAdviceSection = data.timeAdviceSection;
    advicePlanningSection = data.advicePlanningSection;
    timeAdvicePlanningSection = data.timeAdvicePlanningSection;
    adviceBranchLeader = data.adviceBranchLeader;
    timeAdviceBranchLeader = data.timeAdviceBranchLeader;
    fileList = data.fileList;
    isBack = data.isBack;
}

function checkContent() {
    var isCorrect = true;
    if(instance.currentStep.indexOf("发起流程")>-1){
        isCorrect = checkPositiveInteger($("#amountApply").val(),$("#hintAmountApply")) && isCorrect;
        if($("#isSelfUnit").val() == "false"){
            isCorrect = checkNotNull($("#unitName").val(),$("#hintUnitName")) && isCorrect;
        }
        isCorrect = checkNotNull($("#businessContent").val(),$("#hintBusinessContent")) && isCorrect;
        if($("#toWhere").val() == "区内"){
            if($("input[name='urban']:checked").length == 0){
                isCorrect = false;
                $("#hintUrbanPlace").text("至少选择一个地方");
            }else {
                if($("#urbanCenterCheckBox").is(':checked')){
                    isCorrect = checkNotNull($("#urbanCenterPlace").val(),$("#hintUrbanCenterPlace")) && isCorrect;
                }
                if($("#urbanOneCheckBox").is(':checked')){
                    isCorrect = checkNotNull($("#urbanOnePlace").val(),$("#hintUrbanOnePlace")) && isCorrect;
                }
                if($("#urbanTwoCheckBox").is(':checked')){
                    isCorrect = checkNotNull($("#urbanTwoPlace").val(),$("#hintUrbanTwoPlace")) && isCorrect;
                }
            }
        }else{
            isCorrect = checkNotNull($("#placeName").val(),$("#hintPlaceName")) && isCorrect;
        }
        isCorrect = checkNotNull($("#outTimeFrom").val(),$("#hintOutTime")) && isCorrect;
        isCorrect = checkNotNull($("#outTimeTo").val(),$("#hintOutTime")) && isCorrect;
        if($("#outWay").val() == "外省自驾"){
            isCorrect = checkNotNullPositiveInteger($("#kilometers").val(),$("#hintKilometers")) && isCorrect;
        }
    }
    if(instance.currentStep == "发起人填写"){
        isCorrect = checkPositiveInteger($("#cAmountPay").val(),$("#hintAmountPay")) && isCorrect;
        isCorrect = checkPositiveNum($("#cityTrafficPay").val(),$("#hintCityTrafficPay")) && isCorrect;
        isCorrect = checkPositiveNum($("#throughPay").val(),$("#hintThroughPay")) && isCorrect;
        isCorrect = checkPositiveNum($("#livePay").val(),$("#hintLivePay")) && isCorrect;
        isCorrect = checkNotNullPositiveNum($("#totalPay").val(),$("#hintTotalPay")) && isCorrect;
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent(){
    var content = {};
    var cAmountApply = $("#amountApply");
    var cIsSelfUnit = $("#isSelfUnit");
    var cUnitName = $("#unitName");
    var cBusinessContent = $("#businessContent");
    var cToWhere = $("#toWhere");
    var cPlaceName = $("#placeName");
    var cOutTimeFrom = $("#outTimeFrom");
    var cOutTimeTo = $("#outTimeTo");
    var cOutDays = $("#outDays");
    var cAttendSection = $("#attendSection");
    var cEatWay = $("#eatWay");
    var cIsLive = $("#isLive");
    var cOutWay = $("#outWay");
    var cKilometers = $("#kilometers");

    var cAmountPay = $("#amountPay");
    var cReimbursementStandard = $("#reimbursementStandard");
    var cSelfDrivePay = $("#selfDrivePay");
    var cCityTrafficPay = $("#cityTrafficPay");
    var cThroughPay = $("#throughPay");
    var cLivePay = $("#livePay");
    var cTotalPay = $("#totalPay");
    switch (instance.currentStep) {
        case "发起流程":
            content.amountApply = cAmountApply.val();
            content.isSelfUnit = cIsSelfUnit.val();
            content.unitName = cUnitName.val();
            content.businessContent = cBusinessContent.val();
            content.toWhere = cToWhere.val();
            content.placeName = cPlaceName.val();
            content.isGoUrbanCenter = $("#urbanCenterCheckBox").is(':checked');
            content.isGoUrbanOne = $("#urbanOneCheckBox").is(':checked');
            content.isGoUrbanTwo = $("#urbanTwoCheckBox").is(':checked');
            content.urbanCenterName = content.isGoUrbanCenter?$("#urbanCenterPlace").val():"";
            content.urbanOneName = content.isGoUrbanOne?$("#urbanOnePlace").val():"";
            content.urbanTwoName = content.isGoUrbanTwo?$("#urbanTwoPlace").val():"";
            content.outTimeFrom = cOutTimeFrom.val();
            content.outTimeTo = cOutTimeTo.val();
            content.outDays = cOutDays.val();
            content.attendSection = cAttendSection.val();
            content.attendList = attendList;
            content.eatWay = cEatWay.val();
            content.isLive = cIsLive.val();
            content.outWay = cOutWay.val();
            content.kilometers = cKilometers.val();
            if(user.launchRole.name.indexOf("科员") > -1){
                content.signatureStaff = user.id;
                content.timeAdviceStaff = new Date().Format();
            }else if(user.launchRole.name.indexOf("领导") > -1){
                content.signatureLeader = user.id;
                content.timeAdviceLeader = new Date().Format();
            }else{
                content.signatureSection = user.id;
                content.adviceSection = $("#adviceSection").val();
                content.historyAdviceSection = "adviceSection";
                content.timeAdviceSection = $("#timeAdviceSection").text();
            }
            content.isReimbursementPart = isReimbursementPart;
            break;
        case "科室审批（申请）":
        case "科室审批（报销）":
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
            if(user.launchRole.name.indexOf("科长") > -1){
                content.signatureSection = user.id;
                content.adviceSection = $("#adviceSection").val();
                content.historyAdviceSection = "adviceSection";
                content.timeAdviceSection = $("#timeAdviceSection").text();
            }
            content.amountPay = cAmountPay.val();
            content.reimbursementStandard = cReimbursementStandard.val();
            content.selfDrivePay = cSelfDrivePay.val();
            content.cityTrafficPay = cCityTrafficPay.val();
            content.throughPay = cThroughPay.val();
            content.livePay = cLivePay.val();
            content.totalPay = cTotalPay.val();
            break;
        case "计划科审批":
            content.advicePlanningSection = $("#advicePlanningSection").val();
            content.historyAdvicePlanningSection = "advicePlanningSection";
            content.signaturePlanningSection = user.id;
            content.timeAdvicePlanningSection = $("#timeAdvicePlanningSection").text();
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

    var cAmountApply = $("#amountApply");
    var cIsSelfUnit = $("#isSelfUnit");
    var cUnitName = $("#unitName");
    var cBusinessContent = $("#businessContent");
    var cToWhere = $("#toWhere");
    var cPlaceName = $("#placeName");
    var cUrbanCenterCheckBox = $("#urbanCenterCheckBox");
    var cUrbanOneCheckBox = $("#urbanOneCheckBox");
    var cUrbanTwoCheckBox = $("#urbanTwoCheckBox");
    var cUrbanCenterPlace = $("#urbanCenterPlace");
    var cUrbanOnePlace = $("#urbanOnePlace");
    var cUrbanTwoPlace = $("#urbanTwoPlace");
    var cOutTimeFrom = $("#outTimeFrom");
    var cOutTimeTo = $("#outTimeTo");
    var cOutDays = $("#outDays");
    var cAttendSection = $("#attendSection");
    var cEatWay = $("#eatWay");
    var cIsLive = $("#isLive");
    var cOutWay = $("#outWay");
    var cKilometers = $("#kilometers");
    var cOldSectionAdvice = $("#oldSectionAdvice");
    var cOldLeaderAdvice = $("#oldLeaderAdvice");

    var cAmountPay = $("#amountPay");
    var cReimbursementStandard = $("#reimbursementStandard");
    var cSelfDrivePay = $("#selfDrivePay");
    var cCityTrafficPay = $("#cityTrafficPay");
    var cThroughPay = $("#throughPay");
    var cLivePay = $("#livePay");
    var cTotalPay = $("#totalPay");
    cAmountApply.val(amountApply);
    isSelfUnit && cIsSelfUnit.val(isSelfUnit);
    cUnitName.val(unitName);
    cBusinessContent.val(businessContent);
    toWhere && cToWhere.val(toWhere);
    cPlaceName.val(placeName);
    isGoUrbanCenter && cUrbanCenterCheckBox.attr('checked', true);
    isGoUrbanOne && cUrbanOneCheckBox.attr('checked', true);
    isGoUrbanTwo && cUrbanTwoCheckBox.attr('checked', true);
    cUrbanCenterPlace.val(urbanCenterName);
    cUrbanOnePlace.val(urbanOneName);
    cUrbanTwoPlace.val(urbanTwoName);
    cOutTimeFrom.val(outTimeFrom);
    cOutTimeTo.val(outTimeTo);
    cOutDays.val(outDays);
    initPAVASection();
    attendSection && cAttendSection.val(attendSection);
    attendList.forEach(function (value) {
        $("#attendList").append("<li><a class='name'>"+value.name+"</a></li>");
    });
    eatWay && cEatWay.val(eatWay);
    isLive && cIsLive.val(isLive);
    if(outWay == "公务派车"){
        cOutWay.append("<option value='公务派车'>"+"公务派车"+"</option>");
    }
    outWay && cOutWay.val(outWay);
    cKilometers.val(kilometers);
    if(isReimbursementPart){
        cOldSectionAdvice.val(adviceSectionOld);
        cOldLeaderAdvice.val(adviceLeaderOld);
    }
    cAmountPay.val(amountPay);
    cSelfDrivePay.val(kilometers);
    cCityTrafficPay.val(cityTrafficPay);
    cThroughPay.val(throughPay);
    cLivePay.val(livePay);
    cTotalPay.val(totalPay);
    var cShowUnitName = $(".isShowUnitName");
    if(cIsSelfUnit.val() == "true"){
        cShowUnitName.css("display","none");
    }
    var cShowKilometers = $(".isShowKilometers");
    if(cOutWay.val() != "外省自驾"){
        cShowKilometers.css("display","none");
    }
    var cShowPlaceName = $(".isShowPlaceName");
    var cShowSelectUrbanPlace = $("#showSelectUrbanPlace");
    if(cToWhere.val() == "区内"){
        cShowPlaceName.css("display","none");
    }else{
        cShowSelectUrbanPlace.css("display","none");
    }
    $("#showPersonSelect").css("display","none");
    if(!isReimbursementPart){
        $(".showNewPart").css("display","none");
    }
    if(instance.isOperator && instance.currentStep == "发起流程"){
        cAmountApply.attr("readonly",false);
        cAmountApply.removeClass("disable");
        cAmountApply.addClass("default");
        cIsSelfUnit.removeAttr("disabled");
        cIsSelfUnit.removeClass("disable");
        cIsSelfUnit.addClass("default");
        cAmountApply.attr("readonly",false);
        cAmountApply.removeClass("disable");
        cAmountApply.addClass("default");
        cUnitName.attr("readonly",false);
        cUnitName.removeClass("disable");
        cUnitName.addClass("default");
        cIsSelfUnit.change(function () {
            $("#hintUnitName").text("");
            if(cIsSelfUnit.val() == "true"){
                cShowUnitName.css("display","none");
            }else{
                cShowUnitName.css("display","block");
            }
        });
        cIsSelfUnit.change();
        cBusinessContent.attr("readonly",false);
        cBusinessContent.removeClass("disable");
        cBusinessContent.addClass("default");
        cToWhere.removeAttr("disabled");
        cToWhere.removeClass("disable");
        cToWhere.addClass("default");
        cPlaceName.attr("readonly",false);
        cPlaceName.removeClass("disable");
        cPlaceName.addClass("default");
        cUrbanCenterCheckBox.attr("disabled",false);
        cUrbanOneCheckBox.attr("disabled",false);
        cUrbanTwoCheckBox.attr("disabled",false);
        cUrbanCenterPlace.attr("readonly",false);
        cUrbanCenterPlace.removeClass("disableUrbanPlace");
        cUrbanCenterPlace.addClass("urbanPlace");
        cUrbanOnePlace.attr("readonly",false);
        cUrbanOnePlace.removeClass("disableUrbanPlace");
        cUrbanOnePlace.addClass("urbanPlace");
        cUrbanTwoPlace.attr("readonly",false);
        cUrbanTwoPlace.removeClass("disableUrbanPlace");
        cUrbanTwoPlace.addClass("urbanPlace");
        cToWhere.change(function () {
            $("#hintPlaceName").text("");
            $("#hintUrbanPlace").text("");
            if(cToWhere.val() == "区内"){
                cShowPlaceName.css("display","none");
                cShowSelectUrbanPlace.css("display","table-row");
            }else{
                cShowPlaceName.css("display","block");
                cShowSelectUrbanPlace.css("display","none");
            }
        });
        cToWhere.change();
        cOutTimeFrom.attr("readonly",false);
        cOutTimeFrom.removeClass("disableDate");
        cOutTimeFrom.addClass("date");
        laydate.render({
            elem: '#outTimeFrom',
            type: 'datetime',
            min:startDate(),
            done: function (value,date) {
                changeMinTime(cMaxTimeTo,date);
                cOutDays.val(DateMinus(cOutTimeTo.val(),value));
            }
        });
        cOutTimeTo.attr("readonly",false);
        cOutTimeTo.removeClass("disableDate");
        cOutTimeTo.addClass("date");
        var cMaxTimeTo = laydate.render({
            elem: '#outTimeTo',
            type: 'datetime',
            done: function (value,date) {
                cOutDays.val(DateMinus(value,cOutTimeFrom.val()));
            }
        });
        cAttendSection.removeAttr("disabled");
        cAttendSection.removeClass("disable");
        cAttendSection.addClass("default");
        $("#showPersonSelect").css("display","table-row");
        initPersonList();
        var cRoleType = $("#roleType");
        allPersonList.forEach(function (value, key) {
            var option = "<option value='" + key + "'>" + value.name + "</option>";
            cRoleType.append(option);
        });
        cRoleType.change(initControlPersonName);
        cRoleType.change();
        var cPersonName = $("#personName");
        cPersonName.change(function () {
            selectPerson($(this).val(),$("option:selected", this).text());
            $(this).val(0);
        });
        cEatWay.removeAttr("disabled");
        cEatWay.removeClass("disable");
        cEatWay.addClass("default");
        cIsLive.removeAttr("disabled");
        cIsLive.removeClass("disable");
        cIsLive.addClass("default");
        cOutWay.removeAttr("disabled");
        cOutWay.removeClass("disable");
        cOutWay.addClass("default");
        cKilometers.attr("readonly",false);
        cKilometers.removeClass("disableMoney");
        cKilometers.addClass("money");
        cOutWay.change(function () {
            $("#hintKilometers").text("");
            if(cOutWay.val() == "外省自驾"){
                cShowKilometers.css("display","block");
            }else{
                cShowKilometers.css("display","none");
            }
            if(cOutWay.val() == "公务派车"){
                $("#nextStep").text("行政办确认");
            }else{
                if(instance.launcherSection == "领导"){
                    $("#nextStep").text("外出用车");
                }
            }
        });
        cOutWay.change();
    }

    if(isReimbursementPart){
        if(toWhere == "区内"){
            $("#placeSingleSelect").css("display","none");
            if(isGoUrbanOne && outWay != "公务派车"){
                $("#urbanOneRCheckBox").attr('checked', true);
            }
            if(isGoUrbanTwo && outWay != "公务派车"){
                $("#urbanTwoRCheckBox").attr('checked', true);
            }
        }else{
            $("#placeMultipleSelect").css("display","none");
            //reimbursementStandard
            if(toWhere == "外省"){
                cReimbursementStandard.append("<option value='外省：180元/人天'>外省：180元/人天  市内其他地区：150元/人天</option>");
            }else{

                cReimbursementStandard.append("<option value='崇明：180元/人天'>崇明：180元/人天</option>");
                cReimbursementStandard.append("<option value='市内其他地区：150元/人天'>市内其他地区：150元/人天</option>");
            }
        }
        reimbursementStandard && cReimbursementStandard.val(reimbursementStandard);
    }

    if(instance.isOperator && (instance.currentStep == "发起人填写" || instance.currentStep == "行政办填写")){
        cAmountPay.attr("readonly",false);
        cAmountPay.removeClass("disable");
        cAmountPay.addClass("default");
        cReimbursementStandard.removeAttr("disabled");
        cReimbursementStandard.removeClass("disable");
        cReimbursementStandard.addClass("default");
        cCityTrafficPay.attr("readonly",false);
        cCityTrafficPay.removeClass("disableMoney");
        cCityTrafficPay.addClass("money");
        cThroughPay.attr("readonly",false);
        cThroughPay.removeClass("disableMoney");
        cThroughPay.addClass("money");
        cLivePay.attr("readonly",false);
        cLivePay.removeClass("disableMoney");
        cLivePay.addClass("money");
        cTotalPay.attr("readonly",false);
        cTotalPay.removeClass("disableMoney");
        cTotalPay.addClass("money");
    }
    initSectionApproveControl(instance.nextStep == "分管领导审批" || instance.nextStep == "计划科审批",undefined);//科长审批信息显示控制
    if(isReimbursementPart){
        initPlaningSectionApproveControl(instance.currentStep == "计划科审批",timeAdviceSection);//计划科科长审批信息控制显示
        $("#adviceBranchLeaderArea").css("display","none");
    }else{
        $("#advicePlanningSectionArea").css("display","none");
        initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdvicePlanningSection);//分管领导审批信息显示控制
    }
    if(instance.launcherSection == "领导"){
        $("#adviceSectionArea").css("display","none");
        if(!isReimbursementPart){
            $("#adviceBranchLeaderArea").css("display","none");
        }
    }
    if(outWay == "公务派车" && isReimbursementPart){
        $("#adviceSectionArea").css("display","none");
        $("#advicePlanningSectionArea").css("display","none");
    }
    updatePersonCount();
}

$(document).ready(
    function init() {
        initCommon("publicAffairsAndVehicleApplication");
        initContentInterface();
    }
);

function startDate() {
    var now = Date.parse(new Date());
    var start= new Date(now - 14*24*60*60*1000);
    start=start.getFullYear() + "-" + (start.getMonth() + 1) + "-"+ start.getDate();
    return start;
}

function DateMinus(to,from){
    var toDay = new Date(to.split(" ")[0].replace(/-/g, "/"));
    var fromDay = new Date(from.split(" ")[0].replace(/-/g, "/"));
    var days = toDay.getTime() - fromDay.getTime();
    var day = parseInt(days / (1000 * 60 * 60 * 24));
    if(isNaN(day)){
        return "";
    }
    return day + 1;
}

function initPAVASection() {
    var data = {};
    var cAttendSection = $("#attendSection");
    var callBack = function (data) {
        cAttendSection.append("<option value='个人'>个人</option>");
        data.all.forEach(function (value) {
            cAttendSection.append("<option value='"+value.name+"'>"+value.name+"</option>");
        });
    };
    connectToServer("GET","/ws/user/personality/unit",data,false,callBack);
}


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
        attendList.push({id : personID, name : personName});
    }
    if(attendList.length == 5){
        $("#outWay").append("<option value='公务派车'>"+"公务派车"+"</option>");
    }
    updatePersonCount();
}

/**
 * 使人员删除有效
 */
function deletePerson(el) {
    var personID = $(el).attr("data-id");
    $(el).parent().remove();
    var attendIDList = [];
    attendList.forEach(function (value) {
        attendIDList.push(value.id);
    });
    var position;
    position = $.inArray(personID, attendIDList);
    if(position > -1){
        attendList.splice(position,1);
    }
    if(attendList.length == 4){
        if($("#outWay").val() == "公务派车"){
            $("#outWay").val("自行前往");
        }
        $("#outWay option:last").remove();
    }
    updatePersonCount();
}

function updatePersonCount() {
    $("#showAttendPerson").find("label").text("出席人员("+attendList.length+")");
}