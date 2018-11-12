/**
 * Created by Dingfengwu on 2017/9/29.
 */
/****************************以下内容为流程控制变量****************************/
//可发起角色列表
var canLaunch = ["计划科科长", "计划科科员", "财务科科长"];

var unitName;
var declareDate;
var declarationNum;
var evaluateNum;
var operator;
var telPhone;

//表内容
var content;
//修改的元素对象
var infoEditFor;

var disposalReason;

//是否被退回
var isBack;

//单位负责人意见
var adviceUnitManager;
//单位负责人意见填写时间
var timeAdviceUnitManager;
//单位负责人意见的历史记录
var historyAdviceUnitManager;
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
        switch (instance.currentStep) {
            case "发起流程":
                if(user.launchRole.name.indexOf("财务科科长") > -1){
                    instance.nextStep = "单位负责人审批";
                }else if(user.launchRole.name.indexOf("科员") > -1){
                    instance.nextStep = "科室审批";
                }else{
                    instance.nextStep = "分管领导审批";
                }
                break;
            case "单位负责人审批":
                instance.nextStep = "分管领导审批";
                break;
            case "科室审批":
                instance.nextStep = "分管领导审批";
                break;
            case "分管领导审批":
                if(instance.launcherSection == "计划科"){
                    instance.nextStep = "行政主要领导审批";
                }else{
                    instance.nextStep = "流程结束";
                }
                break;
            case "行政主要领导审批":
                instance.nextStep = "流程结束";
                break;
        }
    }
}

/**
 * 新建流程时的初始化流程内容数据
 */
function setNewData() {
    unitName = getUserSection(user.launchRole.name);
    declareDate = new Date().Format();
    operator = user.name;
}

/**
 * 设置控制面板显示,不存在可不写
 */
function setControlData() {
    isAbleSelectBranch = instance.nextStep == "分管领导审批";
    isShowBranchSelect = isAbleSelectBranch;
    user.launchRoleList.forEach(function (value) {
        if(value.name.indexOf("计划科科长")>-1){
            isAbleSelectBranch = true;
        }
    });
    isShowLaunchRoleSelect = instance.currentStep.indexOf("发起流程") > -1 && user.launchRoleList.length > 1;
}

//发起身份变化对应函数
var launchRoleChange = function () {
    var cSelectStatus = $("#selectStatus");
    user.launchRole.id = cSelectStatus.val();
    user.launchRole.name = cSelectStatus.find("option:selected").text();
    instance.launcherSection = getUserSection(user.launchRole.name);
    getNextStep();
    $("#nextStep").text(instance.nextStep);
    if(user.launchRole.name.indexOf("财务科科长") > -1){
        $("#adviceUnitManagerArea").css("display","inline");
        $("#adviceSectionArea").css("display","none");
        $("#adviceBranchLeaderArea").css("display","inline");
        $("#adviceAdminMainLeaderArea").css("display","none");
        initUnitManagerApproveControl(instance.nextStep == "分管领导审批",undefined);//科长审批信息显示控制
        initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdviceUnitManager);//分管领导审批信息显示控制
    }else{
        $("#adviceUnitManagerArea").css("display","none");
        $("#adviceSectionArea").css("display","inline");
        $("#adviceBranchLeaderArea").css("display","inline");
        $("#adviceAdminMainLeaderArea").css("display","inline");
        initSectionApproveControl(instance.nextStep == "分管领导审批",undefined);
        initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdviceSection);
        initAdminMainApproveControl(instance.currentStep == "行政主要领导审批",timeAdviceAdminMainLeader);
    }
    $("#confirm").parent().empty();
    initOperateInterface();
    $("#unitName").val(getUserSection(user.launchRole.name));
};

/**
 * 获取流程内容数据
 */
function getContentData(data) {
    unitName = data.unitName;
    declareDate = data.declareDate;
    declarationNum = data.declarationNum;
    evaluateNum = data.evaluateNum;
    operator = data.operator;
    telPhone = data.telPhone;

    content = data.content;

    disposalReason = data.disposalReason;

    adviceUnitManager = data.adviceUnitManager;
    timeAdviceUnitManager = data.timeAdviceUnitManager;
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
    if (instance.currentStep == "发起流程") {
        isCorrect = checkNotNullTel($("#telPhone").val(), $("#hintTelPhone")) && isCorrect;
        isCorrect = checkNotNull($("#disposalReason").val(), $("#hintDisposalReason")) && isCorrect;
        isCorrect = checkHasContent($("#tableLineList").children().length, $("#hintForApply")) && isCorrect;
    }
    return isCorrect;
}

/**
 * 获取需要提交服务器的流程内容
 */
function getContent() {
    var content = {};
    var cUnitName = $("#unitName");
    var cDeclareDate = $("#declareDate");
    var cDeclarationNum = $("#declarationNum");
    var cEvaluateNum = $("#evaluateNum");
    var cOperator = $("#operator");
    var cTelPhone = $("#telPhone");
    var cDisposalReason = $("#disposalReason");
    switch (instance.currentStep) {
        case "发起流程":
            content.unitName = cUnitName.val();
            content.declareDate = cDeclareDate.val();
            content.declarationNum = cDeclarationNum.val();
            content.evaluateNum = cEvaluateNum.val();
            content.operator = cOperator.val();
            content.telPhone = cTelPhone.val();
            content.disposalReason = cDisposalReason.val();
            content.content = getAll();
            content.signatureStaff = user.id;
            content.timeAdviceStaff = new Date().Format();
            if(user.launchRole.name.indexOf("计划科科长") > -1){
                content.signatureSection = user.id;
                content.adviceSection = $("#adviceSection").val();
                content.historyAdviceSection = "adviceSection";
                content.timeAdviceSection = $("#timeAdviceSection").text();
            }
            break;
        case "单位负责人审批":
            content.adviceUnitManager = $("#adviceUnitManager").val();
            content.historyAdviceUnitManager = "adviceUnitManager";
            content.signatureUnitManager = user.id;
            content.timeAdviceUnitManager = $("#timeAdviceUnitManager").text();
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

    var cUnitName = $("#unitName");
    var cDeclareDate = $("#declareDate");
    var cDeclarationNum = $("#declarationNum");
    var cEvaluateNum = $("#evaluateNum");
    var cOperator = $("#operator");
    var cTelPhone = $("#telPhone");
    var cDisposalReason = $("#disposalReason");

    cUnitName.val(unitName);
    cDeclareDate.val(declareDate);
    cDeclarationNum.val(declarationNum);
    cEvaluateNum.val(evaluateNum);
    cOperator.val(operator);
    cTelPhone.val(telPhone);
    cDisposalReason.val(disposalReason);

    var cEditTable = $(".tableLineEdit");
    laydate.render({
        elem: '#inputForGetDate',
        max: new Date().getTime()
    });
    laydate.render({
        elem: '#inputForTimeFrom'
    });
    laydate.render({
        elem: '#inputForTimeTo'
    });

    setAll();
    if(instance.isOperator && instance.currentStep == "发起流程"){
        cDeclarationNum.attr("readonly",false);
        cDeclarationNum.removeClass("disable");
        cDeclarationNum.addClass("default");
        cEvaluateNum.attr("readonly",false);
        cEvaluateNum.removeClass("disable");
        cEvaluateNum.addClass("default");
        cTelPhone.attr("readonly",false);
        cTelPhone.removeClass("disable");
        cTelPhone.addClass("default");
        cDisposalReason.attr("readonly",false);
        cDisposalReason.removeClass("disable");
        cDisposalReason.addClass("default");

        var detailNum = $("#tableLineList").children().length;
        if(detailNum == 0){
            cEditTable.removeClass("disappear");
        }
        if(detailNum < 5){
            $("#moreTableLine").css("display","inline");
        }
    }
    $("#saveForTableLine").click(function () {
        var cCardNum = $("#inputForCardNum");
        var cAssetName = $("#inputForAssetName");
        var cAssetClass = $("#selectForAssetClass");
        var cDetailClass = $("#selectForDetailClass");
        var cAssetSource = $("#selectForAssetSource");
        var cModel = $("#inputForModel");
        var cMeasureUnit = $("#inputForMeasureUnit");
        var cNumber = $("#inputForNumber");
        var cGetDate = $("#inputForGetDate");
        var cOValue = $("#inputForOValue");
        var cAuthorityNum = $("#inputForAuthorityNum");
        var cOutWay = $("#selectForOutWay");
        var cOutName = $("#inputForOutName");
        var cTimeFrom = $("#inputForTimeFrom");
        var cTimeTo = $("#inputForTimeTo");
        var cIncome = $("#inputForIncome");
        var cComment = $("#inputForComment");
        var isCorrect = true;
        isCorrect = checkNotNull(cCardNum.val(), $("#hintForCardNum")) && isCorrect;
        isCorrect = checkNotNull(cAssetName.val(), $("#hintForAssetName")) && isCorrect;
        isCorrect = checkNotNull(cModel.val(), $("#hintForModel")) && isCorrect;
        isCorrect = checkNotNull(cMeasureUnit.val(), $("#hintForMeasureUnit")) && isCorrect;
        isCorrect = checkNotNullPositiveInteger(cNumber.val(), $("#hintForNumber")) && isCorrect;
        isCorrect = checkNotNull(cGetDate.val(), $("#hintForGetDate")) && isCorrect;
        isCorrect = checkNotNullPositiveNum(cOValue.val(), $("#hintForOValue")) && isCorrect;
        isCorrect = checkNotNull(cOutName.val(), $("#hintForOutName")) && isCorrect;
        var tempCorrect = true;
        var timeHint = $("#hintForTimeFromTo");
        tempCorrect = checkNotNull(cTimeFrom.val(),timeHint);
        tempCorrect = checkNotNull(cTimeTo.val(),timeHint) && tempCorrect;
        isCorrect = isCorrect && tempCorrect;
        if(tempCorrect){
            isCorrect = checkTimeRight(cTimeFrom.val(),cTimeTo.val(),timeHint) && isCorrect;
        }
        isCorrect = checkNotNullPositiveNum(cIncome.val(), $("#hintForIncome")) && isCorrect;
        if (isCorrect) {
            if (infoEditFor) {
                var cInfo = infoEditFor.find("span");
                cInfo[0].innerText = cCardNum.val();
                cInfo[1].innerText = cAssetName.val();
                cInfo[2].innerText = cAssetClass.val();
                cInfo[3].innerText = cDetailClass.val();
                cInfo[4].innerText = cAssetSource.val();
                cInfo[5].innerText = cModel.val();
                cInfo[6].innerText = cMeasureUnit.val();
                cInfo[7].innerText = cNumber.val();
                cInfo[8].innerText = cGetDate.val();
                cInfo[9].innerText = cOValue.val();
                cInfo[10].innerText = cAuthorityNum.val();
                cInfo[11].innerText = cOutWay.val();
                cInfo[12].innerText = cOutName.val();
                cInfo[13].innerText = cTimeFrom.val();
                cInfo[14].innerText = cTimeTo.val();
                cInfo[15].innerText = cIncome.val();
                cInfo[16].innerText = cComment.val();
            } else {
                var info = {};
                info.cardNum = cCardNum.val();
                info.assetName = cAssetName.val();
                info.assetClass = cAssetClass.val();
                info.detailClass = cDetailClass.val();
                info.assetSource = cAssetSource.val();
                info.model = cModel.val();
                info.measureUnit = cMeasureUnit.val();
                info.number = cNumber.val();
                info.getDate = cGetDate.val();
                info.OValue = cOValue.val();
                info.authorityNum = cAuthorityNum.val();
                info.outWay = cOutWay.val();
                info.outName = cOutName.val();
                info.timeFrom = cTimeFrom.val();
                info.timeTo = cTimeTo.val();
                info.income = cIncome.val();
                info.comment = cComment.val();
                addBillInfo(info, true);
                var num = $("#tableLineList").children().length;
                if (num > 3) {
                    $("#moreTableLine").css("display", "none");
                }
            }
            cEditTable.addClass("disappear");
        }
    });

    $("#selectForAssetClass").change(function () {
        var cDetailClass = $("#selectForDetailClass");
        cDetailClass.empty();
        switch($("#selectForAssetClass").val()){
            case "流动资产":
                cDetailClass.append("<option value='货币性资金'>货币性资金</option>");
                cDetailClass.append("<option value='短期投资'>短期投资</option>");
                cDetailClass.append("<option value='应收票据'>应收票据</option>");
                cDetailClass.append("<option value='应收账款'>应收账款</option>");
                cDetailClass.append("<option value='其他'>其他</option>");
                break;
            case "固定资产":
                cDetailClass.append("<option value='房屋及构筑物'>房屋及构筑物</option>");
                cDetailClass.append("<option value='通用设备'>通用设备</option>");
                cDetailClass.append("<option value='专用设备'>专用设备</option>");
                cDetailClass.append("<option value='家具、用具、装具及动植物'>家具、用具、装具及动植物</option>");
                cDetailClass.append("<option value='文物和成列品'>文物和成列品</option>");
                cDetailClass.append("<option value='图书、档案'>图书、档案</option>");
                break;
            case "无形资产":
                cDetailClass.append("<option value='专利权'>专利权</option>");
                cDetailClass.append("<option value='著作权'>著作权</option>");
                cDetailClass.append("<option value='商标权'>商标权</option>");
                cDetailClass.append("<option value='土地使用权'>土地使用权</option>");
                cDetailClass.append("<option value='非专利技术'>非专利技术</option>");
                break;
            case "长期投资":
                cDetailClass.append("<option value='长期投资'>长期投资</option>");
                break;
            case "其他资产":
                cDetailClass.append("<option value='其他资产'>其他资产</option>");
                break;
        }
    });
    $("#selectForAssetClass").change();

    $("#moreTableLine").click(function () {
        cEditTable.removeClass("disappear");
        infoEditFor = $("#tableLineList").children("div:last");
        var cInfo = infoEditFor.find("span");
        $("#inputForCardNum").val(cInfo[0].innerText);
        $("#inputForAssetName").val(cInfo[1].innerText);
        $("#selectForAssetClass").val(cInfo[2].innerText);
        $("#selectForDetailClass").val(cInfo[3].innerText);
        $("#selectForAssetSource").val(cInfo[4].innerText);
        $("#inputForModel").val(cInfo[5].innerText);
        $("#inputForMeasureUnit").val(cInfo[6].innerText);
        $("#inputForNumber").val(cInfo[7].innerText);
        $("#inputForGetDate").val(cInfo[8].innerText);
        $("#inputForOValue").val(cInfo[9].innerText);
        $("#inputForAuthorityNum").val(cInfo[10].innerText);
        $("#selectForOutWay").val(cInfo[11].innerText);
        $("#inputForOutName").val(cInfo[12].innerText);
        $("#inputForTimeFrom").val(cInfo[13].innerText);
        $("#inputForTimeTo").val(cInfo[14].innerText);
        $("#inputForIncome").val(cInfo[15].innerText);
        $("#inputForComment").val(cInfo[16].innerText);
        infoEditFor = undefined;
    });

    if(instance.launcherSection.indexOf("计划科") == -1){
        initUnitManagerApproveControl(instance.nextStep == "分管领导审批",undefined);//科长审批信息显示控制
        $("#adviceSectionArea").css("display","none");
        initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdviceUnitManager);//分管领导审批信息显示控制
        $("#adviceAdminMainLeaderArea").css("display","none");
    }else{
        $("#adviceUnitManagerArea").css("display","none");
        initSectionApproveControl(instance.nextStep == "分管领导审批",undefined);
        initBranchApproveControl(instance.currentStep == "分管领导审批",timeAdviceSection);
        initAdminMainApproveControl(instance.currentStep == "行政主要领导审批",timeAdviceBranchLeader);
    }
}

$(document).ready(
    function init() {
        initCommon("nationalAssetLend");
        initContentInterface();
    }
);


function editTableLine(el) {
    infoEditFor = $(el).parent().parent();
    var cTableLineEdit = $(".tableLineEdit");
    cTableLineEdit.removeClass("disappear");
    var cInfo = infoEditFor.find("span");
    $("#inputForCardNum").val(cInfo[0].innerText);
    $("#inputForAssetName").val(cInfo[1].innerText);
    $("#selectForAssetClass").val(cInfo[2].innerText);
    $("#selectForDetailClass").val(cInfo[3].innerText);
    $("#selectForAssetSource").val(cInfo[4].innerText);
    $("#inputForModel").val(cInfo[5].innerText);
    $("#inputForMeasureUnit").val(cInfo[6].innerText);
    $("#inputForNumber").val(cInfo[7].innerText);
    $("#inputForGetDate").val(cInfo[8].innerText);
    $("#inputForOValue").val(cInfo[9].innerText);
    $("#inputForAuthorityNum").val(cInfo[10].innerText);
    $("#selectForOutWay").val(cInfo[11].innerText);
    $("#inputForOutName").val(cInfo[12].innerText);
    $("#inputForTimeFrom").val(cInfo[13].innerText);
    $("#inputForTimeTo").val(cInfo[14].innerText);
    $("#inputForIncome").val(cInfo[15].innerText);
    $("#inputForComment").val(cInfo[16].innerText);
}

function deleteTableLine(el) {
    var rootE = $(el).parent().parent();
    if (rootE.is(infoEditFor)) {
        $("#tableLineEdit").addClass("disappear");
    }
    rootE.remove();
    if ($("#tableLineList").children().length < 4) {
        $("#moreTableLine").css("display", "inline");
    }
    $(".tableLineEdit").addClass("disappear");
}

//获取表中的值
function getAll() {
    var tableArr = [];
    var tableList = $("#tableLineList").children();
    for (var i = 0; i < tableList.length; i++) {
        var cInfo = $(tableList[i]).find("span");
        var element = {};
        element.cardNum = cInfo[0].innerText;
        element.assetName = cInfo[1].innerText;
        element.assetClass = cInfo[2].innerText;
        element.detailClass = cInfo[3].innerText;
        element.assetSource = cInfo[4].innerText;
        element.model = cInfo[5].innerText;
        element.measureUnit = cInfo[6].innerText;
        element.number = cInfo[7].innerText;
        element.getDate = cInfo[8].innerText;
        element.OValue = cInfo[9].innerText;
        element.authorityNum = cInfo[10].innerText;
        element.outWay = cInfo[11].innerText;
        element.outName = cInfo[12].innerText;
        element.timeFrom = cInfo[13].innerText;
        element.timeTo = cInfo[14].innerText;
        element.income = cInfo[15].innerText;
        element.comment = cInfo[16].innerText;
        tableArr.push(element);
    }
    return tableArr;
}
//填表
function setAll() {
    if (content) {
        for (var i = 0; i < content.length; i++) {
            if (instance.isOperator && instance.isLaunch) {
                addBillInfo(content[i], true);
            } else {
                addBillInfo(content[i], false);
            }
        }
    }
}

function addBillInfo(info, canOperate) {
    var newTableLine = "<div>";
    if (canOperate) {
        newTableLine +=
            "<div style='margin-top: 5px'>" +
            "<a href='javascript:void(0);' onclick='editTableLine(this)' title='修改' style='padding-left: 10px'><img src='../../resources/images/editTableLine.png'></a>" +
            "<a href='javascript:void(0);' onclick='deleteTableLine(this)' title='删除' style='padding-left: 10px'><img src='../../resources/images/deleteTableLine.png'></a>" +
            "</div>";
    }
    newTableLine +=
        "<table class='tableDetail'>" +
        "<tr>" +
        "<td width='750px' height='15px'>" +
        "<label class='combine'>卡片编号：<span>"+info.cardNum+"</span></label>" +
        "<label class='combine'>资产名称：<span>"+info.assetName+"</span></label>" +
        "<label class='combine'>资产分类：<span>"+info.assetClass+"</span></label>" +
        "<label class='combine'>明细类别：<span>"+info.detailClass+"</span></label>" +
        "<label class='combine'>资产来源：<span>"+info.assetSource+"</span></label>" +
        "<label class='combine'>规格型号：<span>"+info.model+"</span></label>" +
        "<label class='combine'>计量单位：<span>"+info.measureUnit+"</span></label>" +
        "<label class='combine'>数量：<span>"+info.number+"</span></label>" +
        "<label class='combine'>购置日期：<span>"+info.getDate+"</span></label>" +
        "<label class='combine'>账面原值：<span>"+info.OValue+"</span>元</label>" +
        "<label class='combine'>权属证号：<span>"+info.authorityNum+"</span></label>" +
        "<label class='combine'>租借方式：<span>"+info.outWay+"</span></label>" +
        "<label class='combine'>承租借方：<span>"+info.outName+"</span></label>" +
        "<label class='combine'>预出租期限：从<span>"+info.timeFrom+"</span>到<span>"+info.timeTo+"</span></label>" +
        "<label class='combine'>预计收益：<span>"+info.income+"</span>元</label>" +
        "<label class='combine'>备注：<span>"+info.comment+"</span></label>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</div>";
    $("#tableLineList").append(newTableLine);
}