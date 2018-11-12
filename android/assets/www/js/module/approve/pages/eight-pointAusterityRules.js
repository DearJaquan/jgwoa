/**
 * Created by DingFengwu on 2017/10/26.
 */

//填报单位
var unitName;
//填报时间
var fillDate;
//报表日期
var fillMonth;
//是否可修改
var canEdit = false;
//是否总和
var isRelateLaunch = false;

$(document).ready(
    function init() {
        initCommonData();
        initContentInterface();
        $("#backIcon").append(
            '<a class="backIcon" href="javascript:;" onClick="operationBack()"><img src="../../resources/images/app/close.png" border="0" title="返回上一页"></a>'
        )
    }
);

/**
 * 初始化用户信息
 */
function initCommonData() {
    user = getUserInfo();
    var userRole = "";
    user.roleList.forEach(function (value) {
        if(value.name.indexOf("财务科科长") > -1){
            userRole = value.name;
        }
        if(value.name.indexOf("计划科科长") > -1){
            userRole = value.name;
        }
        if(value.name.indexOf("计划科八项规定发起人") > -1){
            userRole = value.name;
        }
    });
    instance = {};
    instance.type = "eight-pointAusterityRules";
    instance.isOperator = true;
    var relate = getParameter("relate");
    if(relate){
        isRelateLaunch = true;
        var callBack = function (data) {
            unitName = data.unitName;
            var fillYM = relate.substring(0,relate.length-1).split("年");
            var tempDate = new Date();
            tempDate.setFullYear(parseInt(fillYM[0]));
            tempDate.setMonth(parseInt(fillYM[1]));
            fillDate = new Date(tempDate);
            canEdit = false;
            fillCurrentMonth(data.content[0]);
            fillLastMonth(data.content[1]);
            fillCorrespondMonth(data.content[2]);
        };
        relate = decodeURI(relate);
        var idList = [];
        idList.push(relate);
        getRelatedInstanceDetail(idList,"ER",getUserSection(userRole),callBack);
    }else{
        var userUnit = getUserSection(userRole);
        if(userUnit == "计划科"){
            userUnit = "嘉定区建设和管理委员会"
        }
        if(getParameter("type") == "new"){
            unitName = userUnit;
            fillDate = new Date();
            canEdit = isRightDate(fillDate);
        }else{
            instance.id = getParameter("instanceID");
            var data = {
                instanceID:instance.id,
                instanceType:instance.type
            };
            var callBack = function (data) {
                unitName = data.unitName;
                fillDate = new Date(data.fillDate);
                canEdit = isRightDate(fillDate) && unitName == userUnit;
            };
            connectToServer("GET","/ws/process/detail",data,false,callBack);
        }
    }
}

function isRightDate(fillDate) {
    var isRight = true;
    var thisDate = new Date();
    isRight = isRight && fillDate.getDate() < 13;
    isRight = isRight && thisDate.getFullYear() == fillDate.getFullYear();
    isRight = isRight && thisDate.getMonth() == fillDate.getMonth();
    //临时开放填写2017年份和2018年1、2、3月份
    if(fillDate.getFullYear() == 2017){isRight = true;}
    if(fillDate.getFullYear() == 2018&&(fillDate.getMonth()== 0||fillDate.getMonth()== 1||fillDate.getMonth()== 2)){isRight = true;}
    return isRight;
}

/**
 * 初始化流程内容控件
 */
function initContentInterface(){
    var cUnitName = $("#unitName");
    var cFillDate = $("#fillDate");
    cUnitName.text(unitName);
    if(canEdit || getParameter("type") == "old" || isRelateLaunch){
        cFillDate.text(fillDate.Format());
    }else{
        cFillDate.text("当前时间不可填报");
    }
    var cFillMonth = $("#fillMonth");
    var currentYear = fillDate.getFullYear();
    var currentMonth = fillDate.getMonth();
    if(currentMonth == 0){
        currentMonth = 12;
        currentYear--;
    }
    var lastYear = currentYear;
    var lastMonth = currentMonth == 1?1:currentMonth-1;
    var correspondYear = currentYear - 1;
    var correspondMonth = currentMonth;
    if(currentMonth < 10){
        fillMonth = currentYear + "年0" + currentMonth + "月";
    }else {
        fillMonth = currentYear + "年" + currentMonth + "月";
    }
    var lastFillMonth = "";
    if(lastMonth < 10){
        lastFillMonth = lastYear + "年0" + lastMonth + "月";
    }else{
        lastFillMonth = lastYear + "年" + lastMonth + "月";
    }
    var correspondFillMonth = "";
    if(correspondMonth < 10){
        correspondFillMonth = correspondYear + "年0" + correspondMonth + "月";
    }else {
        correspondFillMonth = correspondYear + "年" + correspondMonth + "月";
    }
    cFillMonth.text(fillMonth);
    if(!isRelateLaunch){
        getInstanceData(unitName,fillMonth,fillCurrentMonth);
        if(lastMonth < currentMonth){
            getInstanceData(unitName,lastFillMonth,fillLastMonth);
        }
        getInstanceData(unitName,correspondFillMonth,fillCorrespondMonth);
    }
    if(canEdit){
        var cMeetingCharge = $("#meetingCharge");
        var cOfficialEntertainment = $("#officialEntertainment");
        var cNormalOE = $("#normal_OE");
        var cOtherOE = $("#other_OE");
        var cVehiclePurchaseAndOperatingCost = $("#vehiclePurchaseAndOperatingCost");
        var cNormalVPOC = $("#normal_VPOC");
        var cOtherVPOC = $("#other_VPOC");
        var cVehiclePurchase = $("#vehiclePurchase");
        var cNormalVP = $("#normal_VP");
        var cOtherVP = $("#other_VP");
        var cGoingAbroadFee = $("#goingAbroadFee");
        var cNormalGAF = $("#normal_GAF");
        var cOtherGAF = $("#other_GAF");
        var cDomesticTravelExpenses = $("#domesticTravelExpenses");
        var cTrainingExpense = $("#trainingExpense");
        cMeetingCharge.on('input',function(){updateTotal();});
        cNormalOE.on('input',function(){updateTotal();});
        cOtherOE.on('input',function(){updateTotal();});
        cNormalVPOC.on('input',function(){updateTotal();});
        cOtherVPOC.on('input',function(){updateTotal();});
        cNormalVP.on('input',function(){updateTotal();});
        cOtherVP.on('input',function(){updateTotal();});
        cNormalGAF.on('input',function(){updateTotal();});
        cOtherGAF.on('input',function(){updateTotal();});
        cDomesticTravelExpenses.on('input',function(){updateTotal();});
        cTrainingExpense.on('input',function(){updateTotal();});
        cMeetingCharge.attr("readonly",false);
        cMeetingCharge.removeClass("disable");
        cMeetingCharge.addClass("default");
        cNormalOE.attr("readonly",false);
        cNormalOE.removeClass("disable");
        cNormalOE.addClass("default");
        cOtherOE.attr("readonly",false);
        cOtherOE.removeClass("disable");
        cOtherOE.addClass("default");
        cNormalVPOC.attr("readonly",false);
        cNormalVPOC.removeClass("disable");
        cNormalVPOC.addClass("default");
        cOtherVPOC.attr("readonly",false);
        cOtherVPOC.removeClass("disable");
        cOtherVPOC.addClass("default");
        cNormalVP.attr("readonly",false);
        cNormalVP.removeClass("disable");
        cNormalVP.addClass("default");
        cOtherVP.attr("readonly",false);
        cOtherVP.removeClass("disable");
        cOtherVP.addClass("default");
        cNormalGAF.attr("readonly",false);
        cNormalGAF.removeClass("disable");
        cNormalGAF.addClass("default");
        cOtherGAF.attr("readonly",false);
        cOtherGAF.removeClass("disable");
        cOtherGAF.addClass("default");
        cDomesticTravelExpenses.attr("readonly",false);
        cDomesticTravelExpenses.removeClass("disable");
        cDomesticTravelExpenses.addClass("default");
        cTrainingExpense.attr("readonly",false);
        cTrainingExpense.removeClass("disable");
        cTrainingExpense.addClass("default");
        // $("#download").css("display","none");
    }else{
        $("#confirm").css("display","none");
    }
}

function getInstanceData(unitName, date, callBack) {
    var data = {
        unitName: unitName,
        date: date
    };
    connectToServer("GET","/ws/process/user/eightregulation/search",data,false,callBack);
}

function fillCurrentMonth(data) {
    $("#meetingCharge").val(data.meetingCharge);
    $("#officialEntertainment").val(data.officialEntertainment);
    $("#normal_OE").val(data.normalOE);
    $("#other_OE").val(data.otherOE);
    $("#vehiclePurchaseAndOperatingCost").val(data.vehiclePurchaseAndOperatingCost);
    $("#normal_VPOC").val(data.normalVPOC);
    $("#other_VPOC").val(data.otherVPOC);
    $("#vehiclePurchase").val(data.vehiclePurchase);
    $("#normal_VP").val(data.normalVP);
    $("#other_VP").val(data.otherVP);
    $("#goingAbroadFee").val(data.goingAbroadFee);
    $("#normal_GAF").val(data.normalGAF);
    $("#other_GAF").val(data.otherGAF);
    $("#domesticTravelExpenses").val(data.domesticTravelExpenses);
    $("#trainingExpense").val(data.trainingExpense);
    $("#total").val(data.total);
}

function fillLastMonth(data) {
    $("#meetingCharge_lastMonth").val(data.meetingCharge);
    $("#officialEntertainment_lastMonth").val(data.officialEntertainment);
    $("#normal_OE_lastMonth").val(data.normalOE);
    $("#other_OE_lastMonth").val(data.otherOE);
    $("#vehiclePurchaseAndOperatingCost_lastMonth").val(data.vehiclePurchaseAndOperatingCost);
    $("#normal_VPOC_lastMonth").val(data.normalVPOC);
    $("#other_VPOC_lastMonth").val(data.otherVPOC);
    $("#vehiclePurchase_lastMonth").val(data.vehiclePurchase);
    $("#normal_VP_lastMonth").val(data.normalVP);
    $("#other_VP_lastMonth").val(data.otherVP);
    $("#goingAbroadFee_lastMonth").val(data.goingAbroadFee);
    $("#normal_GAF_lastMonth").val(data.normalGAF);
    $("#other_GAF_lastMonth").val(data.otherGAF);
    $("#domesticTravelExpenses_lastMonth").val(data.domesticTravelExpenses);
    $("#trainingExpense_lastMonth").val(data.trainingExpense);
    $("#total_lastMonth").val(data.total);
}

function fillCorrespondMonth(data) {
    $("#meetingCharge_last").val(data.meetingCharge);
    $("#officialEntertainment_last").val(data.officialEntertainment);
    $("#normal_OE_last").val(data.normalOE);
    $("#other_OE_last").val(data.otherOE);
    $("#vehiclePurchaseAndOperatingCost_last").val(data.vehiclePurchaseAndOperatingCost);
    $("#normal_VPOC_last").val(data.normalVPOC);
    $("#other_VPOC_last").val(data.otherVPOC);
    $("#vehiclePurchase_last").val(data.vehiclePurchase);
    $("#normal_VP_last").val(data.normalVP);
    $("#other_VP_last").val(data.otherVP);
    $("#goingAbroadFee_last").val(data.goingAbroadFee);
    $("#normal_GAF_last").val(data.normalGAF);
    $("#other_GAF_last").val(data.otherGAF);
    $("#domesticTravelExpenses_last").val(data.domesticTravelExpenses);
    $("#trainingExpense_last").val(data.trainingExpense);
    $("#total_last").val(data.total);
}

function commitData(){
    if(checkContent()) {
        confirmInstanceData();
    }
}

/**
 * 流程审批
 */
function confirmInstanceData() {
    var data = {
        content: JSON.stringify(getContent())
    };
    var cookie = getCookieValue();
    isRememberApprove();
    if(cookie.approvePS && isRemember){
        connectToServer("GET","/ws/process/user/eightregulation/save",data,false,callBackOperate,true);
    }else{
        jPrompt('请输入审批密码:', '', '审批权限', function(r) {
            if(r!=null){
                addCookie("approvePS",r,0.5);
                connectToServer("GET","/ws/process/user/eightregulation/save",data,false,callBackOperate,true);
            }
        });
    }
}

// function downloadInstance() {
//     var data = {
//         instanceID: instance.id,
//         instanceType: instance.type,
//         content: JSON.stringify(getContent())
//     };
//     var callBack = function (data) {
//         var el = document.createElement("a");
//         document.body.appendChild(el);
//         el.href = urlBase + "/" + data.xls;
//         el.download = "八项规定";
//         el.click();
//         document.body.removeChild(el);
//     };
//     connectToServer("POST","/ws/document/instance/download",data,false,callBack,false);
// }

function getContent(){
    var content = {};
    content.unitName=unitName;
    content.fillDate=fillDate.getTime();
    content.fillMonth=fillMonth;
    content.content =getAll();
    return content;
}

function getAll(){
    var info = {};
    info.meetingCharge = toDecimal($("#meetingCharge").val());
    info.officialEntertainment = toDecimal($("#officialEntertainment").val());
    info.normalOE = toDecimal($("#normal_OE").val());
    info.otherOE = toDecimal($("#other_OE").val());
    info.vehiclePurchaseAndOperatingCost = toDecimal($("#vehiclePurchaseAndOperatingCost").val());
    info.normalVPOC = toDecimal($("#normal_VPOC").val());
    info.otherVPOC = toDecimal($("#other_VPOC").val());
    info.vehiclePurchase = toDecimal($("#vehiclePurchase").val());
    info.normalVP = toDecimal($("#normal_VP").val());
    info.otherVP = toDecimal($("#other_VP").val());
    info.goingAbroadFee = toDecimal($("#goingAbroadFee").val());
    info.normalGAF = toDecimal($("#normal_GAF").val());
    info.otherGAF = toDecimal($("#other_GAF").val());
    info.domesticTravelExpenses = toDecimal($("#domesticTravelExpenses").val());
    info.trainingExpense = toDecimal($("#trainingExpense").val());
    info.total = toDecimal($("#total").val());
    for(var key in info){
        if (info[key] == ""){
            info[key] = 0;
        }
    }
    return info;
}

function updateTotal(){
    if(checkContent()){
        var temp1 = parseFloat($("#meetingCharge").val());
        var temp2 = parseFloat($("#officialEntertainment").val());
        var temp3 = parseFloat($("#vehiclePurchaseAndOperatingCost").val());
        var temp4 = parseFloat($("#vehiclePurchase").val());
        var temp5 = parseFloat($("#goingAbroadFee").val());
        var temp6 = parseFloat($("#domesticTravelExpenses").val());
        var temp7 = parseFloat($("#trainingExpense").val());

        isNaN(temp1)?temp1=0:temp1=Math.round(temp1*100)/100;
        isNaN(temp2)?temp2=0:temp2=Math.round(temp2*100)/100;
        isNaN(temp3)?temp3=0:temp3=Math.round(temp3*100)/100;
        isNaN(temp4)?temp4=0:temp4=Math.round(temp4*100)/100;
        isNaN(temp5)?temp5=0:temp5=Math.round(temp5*100)/100;
        isNaN(temp6)?temp6=0:temp6=Math.round(temp6*100)/100;
        isNaN(temp7)?temp7=0:temp7=Math.round(temp7*100)/100;

        var total = accAdd(temp1,temp2);
        total = accAdd(total,temp3);
        // total = accAdd(total,temp4);
        total = accAdd(total,temp5);
        total = accAdd(total,temp6);
        total = accAdd(total,temp7);

        $("#total").val(total);
    }
}

function checkContent() {
    var isCorrect = true;
    var isNormalC = true;
    var isOtherC = true;
    var cMeetingCharge = $("#meetingCharge");
    var cHintMeetingCharge = $("#hintMeetingCharge");
    var cOfficialEntertainment = $("#officialEntertainment");
    var cHintOfficialEntertainment = $("#hintOfficialEntertainment");
    var cNormalOE = $("#normal_OE");
    var cHintNormalOE = $("#hintNormal_OE");
    var cOtherOE = $("#other_OE");
    var cHintOtherOE = $("#hintOther_OE");
    var cVehiclePurchaseAndOperatingCost = $("#vehiclePurchaseAndOperatingCost");
    var cHintVehiclePurchaseAndOperatingCost = $("#hintVehiclePurchaseAndOperatingCost");
    var cNormalVPOC = $("#normal_VPOC");
    var cHintNormalVPOC = $("#hintNormal_VPOC");
    var cOtherVPOC = $("#other_VPOC");
    var cHintOtherVPOC = $("#hintOther_VPOC");
    var cVehiclePurchase = $("#vehiclePurchase");
    var cHintVehiclePurchase = $("#hintVehiclePurchase");
    var cNormalVP = $("#normal_VP");
    var cHintNormalVP = $("#hintNormal_VP");
    var cOtherVP = $("#other_VP");
    var cHintOtherVP = $("#hintOther_VP");
    var cGoingAbroadFee = $("#goingAbroadFee");
    var cHintGoingAbroadFee = $("#hintGoingAbroadFee");
    var cNormalGAF = $("#normal_GAF");
    var cHintNormalGAF = $("#hintNormal_GAF");
    var cOtherGAF = $("#other_GAF");
    var cHintOtherGAF = $("#hintOther_GAF");
    var cDomesticTravelExpenses = $("#domesticTravelExpenses");
    var cHintDomesticTravelExpenses = $("#hintDomesticTravelExpenses");
    var cTrainingExpense = $("#trainingExpense");
    var cHintTrainingExpense = $("#hintTrainingExpense");
    if(checkPositiveNum(cMeetingCharge.val(),cHintMeetingCharge)){
        checkMoney(cMeetingCharge,$("#meetingCharge_lastMonth"),$("#meetingCharge_last"),cHintMeetingCharge);
    }else{
        isCorrect = false;
    }
    isNormalC = checkPositiveNum(cNormalOE.val(),cHintNormalOE);
    isOtherC = checkPositiveNum(cOtherOE.val(),cHintOtherOE);
    if(isNormalC && isOtherC){
        cOfficialEntertainment.val(combineMoney(cNormalOE,cOtherOE));
        checkMoney(cOfficialEntertainment,$("#officialEntertainment_lastMonth"),$("#officialEntertainment_last"),cHintOfficialEntertainment);
    }else{
        isCorrect = false;
    }
    isNormalC = checkPositiveNum(cNormalVPOC.val(),cHintNormalVPOC);
    isOtherC = checkPositiveNum(cOtherVPOC.val(),cHintOtherVPOC);
    if(isNormalC && isOtherC){
        cVehiclePurchaseAndOperatingCost.val(combineMoney(cNormalVPOC,cOtherVPOC));
        checkMoney(cVehiclePurchaseAndOperatingCost,$("#vehiclePurchaseAndOperatingCost_lastMonth"),$("#vehiclePurchaseAndOperatingCost_last"),cHintVehiclePurchaseAndOperatingCost);
    }else{
        isCorrect = false;
    }
    isNormalC = checkPositiveNum(cNormalVP.val(),cHintNormalVP);
    isOtherC = checkPositiveNum(cOtherVP.val(),cHintOtherVP);
    if(isNormalC && isOtherC){
        cVehiclePurchase.val(combineMoney(cNormalVP,cOtherVP));
        isCorrect = checkVehiclePurchase() && isCorrect;
    }else{
        isCorrect = false;
    }
    isNormalC = checkPositiveNum(cNormalGAF.val(),cHintNormalGAF);
    isOtherC = checkPositiveNum(cOtherGAF.val(),cHintOtherGAF);
    if(isNormalC && isOtherC){
        cGoingAbroadFee.val(combineMoney(cNormalGAF,cOtherGAF));
        checkMoney(cGoingAbroadFee,$("#goingAbroadFee_lastMonth"),$("#goingAbroadFee_last"),cHintGoingAbroadFee);
    }else{
        isCorrect = false;
    }
    if(checkPositiveNum(cDomesticTravelExpenses.val(),cHintDomesticTravelExpenses)){
        checkMoney(cDomesticTravelExpenses,$("#domesticTravelExpenses_lastMonth"),$("#domesticTravelExpenses_last"),cHintDomesticTravelExpenses);
    }else{
        isCorrect = false;
    }
    if(checkPositiveNum(cTrainingExpense.val(),cHintTrainingExpense)){
        checkMoney(cTrainingExpense,$("#trainingExpense_lastMonth"),$("#trainingExpense_last"),cHintTrainingExpense);
    }else{
        isCorrect = false;
    }
    return isCorrect;
}

function combineMoney(cNormal, cOther) {
    var normalVal = parseFloat(cNormal.val());
    var otherVal = parseFloat(cOther.val());
    if(isNaN(normalVal)){
        normalVal = 0;
    }
    if(isNaN(otherVal)){
        otherVal = 0;
    }
    var resultVal = accAdd(normalVal,otherVal);
    // if(resultVal == 0){
    //     resultVal = "";
    // }
    return resultVal;
}

function checkMoney(current, last, correspond, hint) {
    hint.text("");
    var currentVal = parseFloat(current.val());
    var lastVal = parseFloat(last.val());
    var correspondVal = parseFloat(correspond.val());
    if(currentVal < lastVal){
        hint.css("color","blue");
        hint.text("不应小于上月金额，请核实");
    }else if(currentVal > correspondVal){
        hint.css("color","blue");
        hint.text("不应大于同期金额，请核实");
    }
}

function checkVehiclePurchase() {
    var all = parseFloat($("#vehiclePurchaseAndOperatingCost").val());
    var part = parseFloat($("#vehiclePurchase").val());
    var hint = $("#hintVehiclePurchase");
    hint.text("");
    if((isNaN(all) && !isNaN(part)) || (!isNaN(all) && !isNaN(part) && all < part)){
        hint.text("不能超出总费用");
        return false;
    }
    return true;
}