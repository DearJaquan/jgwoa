/**
 * Created by DingFengwu on 2017/8/28.
 */
/****************************以下内容为流程控制变量****************************/
//可发起角色列表
var canLaunch = ["科长", "科员", "财务科科长"];
/****************************以下内容为流程内容变量****************************/
var unitName;
var declareDate;
var declarationNum;
var evaluateNum;
var operatorOut;
var telPhoneOut;
var operatorGet;
var telPhoneGet;
//表内容
var content;
//修改的元素对象
var infoEditFor;
var getUnitName;
var disposalReason;

//是否被退回
var isBack;

var adviceSection;
var timeAdviceSection;
var historyAdviceSection;

var adviceOutUnitS;
var timeAdviceOutUnitS;
var historyAdviceOutUnitS;
var adviceOutUnitM;
var timeAdviceOutUnitM;
var historyAdviceOutUnitM;
var timeAdviceGetUnitF;
var adviceGetUnitS;
var timeAdviceGetUnitS;
var historyAdviceGetUnitS;
var adviceGetUnitM;
var timeAdviceGetUnitM;
var historyAdviceGetUnitM;
/****************************以下内容为流程必须函数****************************/
/**
 * 依据当前步骤生成下一步骤
 */
function getNextStep() {
    if(instance.isOperator){
        switch (instance.currentStep) {
            case "发起流程":
                if(user.launchRole.name.indexOf("科长") > -1){
                    instance.nextStep = "划出单位审批";
                }else{
                    instance.nextStep = "科室审批";
                }
                break;
            case "科室审批":
                instance.nextStep = "划出单位审批";
                break;
            case "划出单位审批":
                instance.nextStep = "划出单位主管部门审批";
                break;
            case "划出单位主管部门审批":
                instance.nextStep = "接收单位财务审批";
                break;
            case "接收单位财务审批":
                instance.nextStep = "接收单位审批";
                break;
            case "接收单位审批":
                instance.nextStep = "接收单位主管部门审批";
                break;
            case "接收单位主管部门审批":
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
    operatorOut = user.name;
}

/**
 * 设置控制面板显示,不存在可不写
 */
function setControlData() {
    if(instance.currentStep == "发起流程"){
        user.launchRoleList.forEach(function (value) {
            if(value.name.indexOf("科长")>-1){
                isAbleSelectBranch = true;
            }
        });
        if(isAbleSelectBranch && instance.nextStep == "划出单位审批"){
            isShowBranchSelect = true;
        }else {
            isShowBranchSelect = false;
        }
    }else{
        if(instance.launcherSection == "计划科"){
            if(instance.nextStep == "划出单位审批"){
                isAbleSelectBranch = true;
                isShowBranchSelect = true;
            }
        }
        if(instance.nextStep == "接收单位审批"){
            isAbleSelectBranch = true;
            isShowBranchSelect = true;
        }
    }
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
        $("#adviceSectionArea").css("display","none");
        initOutUnitSApproveControl(instance.currentStep == "划出单位审批",undefined);
    }else{
        $("#adviceSectionArea").css("display","inline");
        initSectionApproveControl(instance.nextStep == "划出单位审批",undefined);
        initOutUnitSApproveControl(instance.currentStep == "划出单位审批",timeAdviceSection);
    }
    $("#confirm").parent().empty();
    setControlData();
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
    operatorOut = data.operatorOut;
    telPhoneOut = data.telPhoneOut;
    operatorGet = data.operatorGet;
    telPhoneGet = data.telPhoneGet;

    content = data.content;

    getUnitName = data.getUnitName;
    disposalReason = data.disposalReason;

    adviceSection = data.adviceSection;
    timeAdviceSection = data.timeAdviceSection;
    adviceOutUnitS = data.adviceOutUnitS;
    timeAdviceOutUnitS = data.timeAdviceOutUnitS;
    adviceOutUnitM = data.adviceOutUnitM;
    timeAdviceOutUnitM = data.timeAdviceOutUnitM;
    timeAdviceGetUnitF = data.timeAdviceGetUnitF;
    adviceGetUnitS = data.adviceGetUnitS;
    timeAdviceGetUnitS = data.timeAdviceGetUnitS;
    adviceGetUnitM = data.adviceGetUnitM;
    timeAdviceGetUnitM = data.timeAdviceGetUnitM;
    fileList = data.fileList;
    isBack = data.isBack;
}

function checkContent() {
    var isCorrect = true;
    if (instance.currentStep == "发起流程") {
        isCorrect = checkNotNullTel($("#telPhoneOut").val(), $("#hintTelPhoneOut")) && isCorrect;
        isCorrect = checkNotNull($("#disposalReason").val(), $("#hintDisposalReason")) && isCorrect;
        isCorrect = checkHasContent($("#tableLineList").children().length, $("#hintForApply")) && isCorrect;
    }
    if (instance.currentStep == "接收单位财务审批") {
        isCorrect = checkNotNullTel($("#telPhoneGet").val(), $("#hintTelPhoneGet")) && isCorrect;
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
    var cOperatorOut = $("#operatorOut");
    var cTelPhoneOut = $("#telPhoneOut");
    var cGetUnitName = $("#getUnitName");
    var cDisposalReason = $("#disposalReason");
    var cOperatorGet = $("#operatorGet");
    var cTelPhoneGet = $("#telPhoneGet");
    switch (instance.currentStep) {
        case "发起流程":
            content.unitName = cUnitName.val();
            content.declareDate = cDeclareDate.val();
            content.declarationNum = cDeclarationNum.val();
            content.evaluateNum = cEvaluateNum.val();
            content.operatorOut = cOperatorOut.val();
            content.telPhoneOut = cTelPhoneOut.val();
            content.getUnitName = cGetUnitName.val();
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
        case "科室审批":
            content.signatureSection = user.id;
            content.adviceSection = $("#adviceSection").val();
            content.historyAdviceSection = "adviceSection";
            content.timeAdviceSection = $("#timeAdviceSection").text();
            break;
        case "划出单位审批":
            content.adviceOutUnitS = $("#adviceOutUnitS").val();
            content.historyAdviceOutUnitS = "adviceOutUnitS";
            content.signatureOutUnitS = user.id;
            content.timeAdviceOutUnitS = $("#timeAdviceOutUnitS").text();
            break;
        case "划出单位主管部门审批":
            content.adviceOutUnitM = $("#adviceOutUnitM").val();
            content.historyAdviceOutUnitM = "adviceOutUnitM";
            content.signatureOutUnitM = user.id;
            content.timeAdviceOutUnitM = $("#timeAdviceOutUnitM").text();
            break;
        case "接收单位财务审批":
            content.operatorGet = cOperatorGet.val();
            content.telPhoneGet = cTelPhoneGet.val();
            content.signatureGetUnitF = user.id;
            content.timeAdviceGetUnitF = new Date().Format();
            break;
        case "接收单位审批":
            content.adviceGetUnitS = $("#adviceGetUnitS").val();
            content.historyAdviceGetUnitS = "adviceGetUnitS";
            content.signatureGetUnitS = user.id;
            content.timeAdviceGetUnitS = $("#timeAdviceGetUnitS").text();
            break;
        case "接收单位主管部门审批":
            content.adviceGetUnitM = $("#adviceGetUnitM").val();
            content.historyAdviceGetUnitM = "adviceGetUnitM";
            content.signatureGetUnitM = user.id;
            content.timeAdviceGetUnitM = $("#timeAdviceGetUnitM").text();
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

    getGetUnit();
    var cUnitName = $("#unitName");
    var cDeclareDate = $("#declareDate");
    var cDeclarationNum = $("#declarationNum");
    var cEvaluateNum = $("#evaluateNum");
    var cOperatorOut = $("#operatorOut");
    var cTelPhoneOut = $("#telPhoneOut");
    var cGetUnitName = $("#getUnitName");
    var cDisposalReason = $("#disposalReason");
    var cOperatorGet = $("#operatorGet");
    var cTelPhoneGet = $("#telPhoneGet");

    cUnitName.val(unitName);
    cDeclareDate.val(declareDate);
    cDeclarationNum.val(declarationNum);
    cEvaluateNum.val(evaluateNum);
    cOperatorOut.val(operatorOut);
    cTelPhoneOut.val(telPhoneOut);
    getUnitName && cGetUnitName.val(getUnitName);
    cDisposalReason.val(disposalReason);
    cOperatorGet.val(operatorGet);
    cTelPhoneGet.val(telPhoneGet);

    var cEditTable = $(".tableLineEdit");
    $("#inputForOValue").on("input",function () {updateFValue();});
    $("#inputForPValue").on('input',function () {updateFValue();});
    laydate.render({
        elem: '#inputForGetDate',
        max: new Date().getTime()
    });

    setAll();
    if(instance.isOperator && instance.currentStep == "发起流程"){
        
        cDeclarationNum.attr("readonly",false);
        cDeclarationNum.removeClass("disable");
        cDeclarationNum.addClass("default");
        cEvaluateNum.attr("readonly",false);
        cEvaluateNum.removeClass("disable");
        cEvaluateNum.addClass("default");
        cTelPhoneOut.attr("readonly",false);
        cTelPhoneOut.removeClass("disable");
        cTelPhoneOut.addClass("default");
        cGetUnitName.removeAttr("disabled");
        cGetUnitName.removeClass("disable");
        cGetUnitName.addClass("default");
        cDisposalReason.attr("readonly",false);
        cDisposalReason.removeClass("disable");
        cDisposalReason.addClass("default");

        var detailNum = $("#tableLineList").children().length;
        if(detailNum == 0){
            cEditTable.removeClass("disappear");
        }
        if(detailNum < 4){
            $("#moreTableLine").css("display","inline");
        }
    }

    if(instance.isOperator && instance.currentStep == "接收单位财务审批"){
        cOperatorGet.val(user.name);
        cTelPhoneGet.attr("readonly",false);
        cTelPhoneGet.removeClass("disable");
        cTelPhoneGet.addClass("default");
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
        var cPValue = $("#inputForPValue");
        var cFValue = $("#inputForFValue");
        var cEValue = $("#inputForEValue");
        var cComment = $("#inputForComment");
        var isCorrect = true;
        isCorrect = checkNotNull(cCardNum.val(), $("#hintForCardNum")) && isCorrect;
        isCorrect = checkNotNull(cAssetName.val(), $("#hintForAssetName")) && isCorrect;
        isCorrect = checkNotNull(cModel.val(), $("#hintForModel")) && isCorrect;
        isCorrect = checkNotNull(cMeasureUnit.val(), $("#hintForMeasureUnit")) && isCorrect;
        isCorrect = checkNotNullPositiveInteger(cNumber.val(), $("#hintForNumber")) && isCorrect;
        isCorrect = checkNotNull(cGetDate.val(), $("#hintForGetDate")) && isCorrect;
        isCorrect = checkNotNullPositiveNum(cOValue.val(), $("#hintForOValue")) && isCorrect;
        isCorrect = checkNotNullPositiveNum(cPValue.val(), $("#hintForPValue")) && isCorrect;
        isCorrect = checkNotNullPositiveNum(cFValue.val(), $("#hintForFValue")) && isCorrect;
        isCorrect = checkPositiveNum(cPValue.val(), $("#hintForEValue")) && isCorrect;
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
                cInfo[10].innerText = cPValue.val();
                cInfo[11].innerText = cFValue.val();
                cInfo[12].innerText = cEValue.val();
                cInfo[13].innerText = cComment.val();
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
                info.PValue = cPValue.val();
                info.FValue = cFValue.val();
                info.EValue = cEValue.val();
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
        $("#inputForPValue").val(cInfo[10].innerText);
        $("#inputForFValue").val(cInfo[11].innerText);
        $("#inputForEValue").val(cInfo[12].innerText);
        $("#inputForComment").val(cInfo[13].innerText);
        infoEditFor = undefined;
    });

    if(instance.launcherSection.indexOf("计划科") == -1){
        $("#adviceSectionArea").css("display","none");
        initOutUnitSApproveControl(instance.currentStep == "划出单位审批",undefined);
    }else{
        initSectionApproveControl(instance.nextStep == "划出单位审批",undefined);
        initOutUnitSApproveControl(instance.currentStep == "划出单位审批",timeAdviceSection);
        if(instance.currentStep.indexOf("接收单位") > -1){
            $("#adviceSectionArea").css("display","none");
        }
    }
    initOutUnitMApproveControl(instance.currentStep == "划出单位主管部门审批",timeAdviceOutUnitS);
    initGetUnitSApproveControl(instance.currentStep == "接收单位审批",timeAdviceGetUnitF);
    initGetUnitMApproveControl(instance.currentStep == "接收单位主管部门审批",timeAdviceGetUnitS);
}

$(document).ready(
    function init() {
        initCommon("nationalAssetDisposeTwo");
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
    $("#inputForPValue").val(cInfo[10].innerText);
    $("#inputForFValue").val(cInfo[11].innerText);
    $("#inputForEValue").val(cInfo[12].innerText);
    $("#inputForComment").val(cInfo[13].innerText);
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
        element.PValue = cInfo[10].innerText;
        element.FValue = cInfo[11].innerText;
        element.EValue = cInfo[12].innerText;
        element.comment = cInfo[13].innerText;
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
        "<label class='combine'>计提折旧额：<span>"+info.PValue+"</span>元</label>" +
        "<label class='combine'>账面净值：<span>"+info.FValue+"</span>元</label>" +
        "<label class='combine'>评估价值：<span>"+info.EValue+"</span>元</label>" +
        "<label class='combine'>备注：<span>"+info.comment+"</span></label>" +
        "</td>" +
        "</tr>" +
        "</table>" +
        "</div>";
    $("#tableLineList").append(newTableLine);
}

function updateFValue() {
    var partOne = parseFloat($("#inputForOValue").val());
    var partTwo = parseFloat($("#inputForPValue").val());
    var final = 0;
    if (!isNaN(partOne) && !isNaN(partTwo)) {
        final = accSub(partOne,partTwo);
    }
    $("#inputForFValue").val(final);
}

/**
 * 获取部门
 */
function getGetUnit() {
    var data = {
        instanceType: instance.type
    };
    var callBack = function (data) {
        var cGetUnitName = $("#getUnitName");
        cGetUnitName.empty();
        cGetUnitName.append("<option value='嘉定区建设和管理委员会'>嘉定区建设和管理委员会</option>");
        data.all.forEach(function (value) {
            cGetUnitName.append("<option value='"+value.name+"'>"+value.name+"</option>");
        });
    };
    connectToServer("GET","/ws/user/personality/subunit",data,false,callBack);
}