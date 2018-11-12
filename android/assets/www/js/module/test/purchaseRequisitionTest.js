/**
 * Created by Dingfengwu on 2017/8/22.
 */

function testCase05() {
    showTestResult("------------------------------------------------------------------------------------------");
    showTestResult("建管委（交通委）请购申请单流程测试");
    showTestResult("------------------------------------------------------------------------------------------");
    var caseCount = 20;
    for(var i=1; i<=caseCount; i++){
        var caseID = "testCase05"+((i < 10)?('0' + i):i);
        var testCase = eval(caseID);
        testCase();
    }
}

/**
 * 初始化数据
 */
function InitPurchaseRequisition() {
    instanceID = null;
    instanceType = "purchaseRequisition";
    control = {};
    content = {};
}

/**
 * 科长保存
 */
function sectionSave05(user, to, classify) {
    if(classify){
        testTask([user],classify);
        testGetData(user);
    }
    content.purchaseDepartment = "计划科"+new Date().getTime();
    content.purchaseDate = new Date().getTime();
    content.tableContent1 = "tableContent1";
    content.tableContent2 = "tableContent2";
    content.signatureStaff = user.id;
    content.adviceSection = "科室同意" + new Date().getTime();
    content.signatureSection = user.id;
    content.timeAdviceSection = new Date().toLocaleDateString();
    control.branchLeader = to.id;
    testSave(user);
}

/**
 * 科长发起
 */
function sectionLaunch05(user, to, classify) {
    if(classify){
        testTask([user],classify);
        testGetData(user);
    }
    content.purchaseDepartment = "计划科"+new Date().getTime();
    content.purchaseDate = new Date().getTime();
    content.tableContent1 = "tableContent1";
    content.tableContent2 = "tableContent2";
    content.signatureStaff = user.id;
    content.adviceSection = "科室同意" + new Date().getTime();
    content.signatureSection = user.id;
    content.timeAdviceSection = new Date().toLocaleDateString();
    control.branchLeader = to.id;
    testLaunch(user);
}



/**
 * 分管领导审批
 */
function branchApprove05(user, classify, approve, backTo) {
    testTask([user],classify);
    testGetData(user);
    content.signatureBrachLeader = user.id;
    content.timeAdviceBranchLeader = new Date().toLocaleDateString();
    switch (approve){
        case "agree":
            content.adviceBranchLeader = "分管同意" + new Date().getTime();
            testAgree(user);
            break;
        case "reject":
            content.adviceBranchLeader = "分管否决" + new Date().getTime();
            testReject(user);
            break;
        case "sendBack":
            content.adviceBranchLeader = "分管退回" + backTo;
            testSendBack(user,backTo);
            break;
    }
}

/**
 * 主要领导审批
 */
function mainApprove05(user,classify,approve,backTo) {
    testTask([user],classify);
    testGetData(user);
    content.signatureMainLeader = user.id;
    content.timeAdviceMainLeader = new Date().toLocaleDateString();
    switch (approve){
        case "agree":
            content.adviceMainLeader = "主要同意" + new Date().getTime();
            testAgree(user);
            break;
        case "reject":
            content.adviceMainLeader = "主要否决" + new Date().getTime();
            testReject(user);
            break;
        case "sendBack":
            content.adviceMainLeader = "主要退回" + backTo;
            testSendBack(user,backTo);
            break;
    }
}

/**
 * 行政办确认
 */
function executiveConfirm05(user, classify, approve) {
    testTask([user],classify);
    testGetData(user);
    content.signatureExecutive = user.id;
    content.timeExecutive = new Date().toLocaleDateString();
    switch (approve){
        case "confirm":
            testConfirm(user);
            break;
        default:
            break;
    }
}

/***************************************************************************************/

/**
 * 科长发起并选择分管-分管领导同意-主要领导同意-行政办确认
 */
function testCase0501() {
    showTestResult("测试用例ID:0501----------------------------------------");
    InitPurchaseRequisition();
    sectionLaunch05(chiefOne,branchOne);
    branchApprove05(branchOne,"待审批","agree");
    mainApprove05(mainOne,"待审批","agree");
    executiveConfirm05(chiefTwo,"待执行","confirm");
}

/**
 * 科长保存-科长发起并选择分管-分管领导同意-主要领导同意-行政办确认
 */
function testCase0502() {
    showTestResult("测试用例ID:0502----------------------------------------");
    InitPurchaseRequisition();
    sectionSave05(chiefOne,branchTwo);
    sectionLaunch05(chiefOne,branchOne,"草稿");
    branchApprove05(branchOne,"待审批","agree");
    mainApprove05(mainOne,"待审批","agree");
    executiveConfirm05(chiefTwo,"待执行","confirm");
}


/**
 * 科长发起并选择分管-分管领导否决
 */
function testCase0503() {
    showTestResult("测试用例ID:0503----------------------------------------");
    InitPurchaseRequisition();
    sectionLaunch05(chiefOne,branchOne);
    branchApprove05(branchOne,"待审批","reject");
}

/**
 * 科长保存-科长发起并选择分管-分管领导否决
 */
function testCase0504() {
    showTestResult("测试用例ID:0504----------------------------------------");
    InitPurchaseRequisition();
    sectionSave05(chiefOne,branchTwo);
    sectionLaunch05(chiefOne,branchOne,"草稿");
    branchApprove05(branchOne,"待审批","reject");
}


/**
 * 科长保存-科长发起并选择分管-分管领导退回-科长发起并选择分管-分管领导否决
 */
function testCase0505() {
    showTestResult("测试用例ID:0505----------------------------------------");
    InitPurchaseRequisition();
    sectionSave05(chiefOne,branchTwo);
    sectionLaunch05(chiefOne,branchOne,"草稿");
    branchApprove05(branchOne,"待审批","sendBack","发起人");
    sectionLaunch05(chiefOne,branchTwo,"被退回");
    branchApprove05(branchTwo,"待审批","reject");
}


/**
 * 科长发起并选择分管-分管领导同意-主要领导否决
 */
function testCase0506() {
    showTestResult("测试用例ID:0506----------------------------------------");
    InitPurchaseRequisition();
    sectionLaunch05(chiefOne,branchOne);
    branchApprove05(branchOne,"待审批","agree");
    mainApprove05(mainOne,"待审批","reject");
}

/**
 * 科长保存-科长发起并选择分管-分管领导退回-科长发起并选择分管-分管领导同意-主要领导否决
 */
function testCase0507() {
    showTestResult("测试用例ID:0507----------------------------------------");
    InitPurchaseRequisition();
    sectionSave05(chiefOne,branchTwo);
    sectionLaunch05(chiefOne,branchOne,"草稿");
    branchApprove05(branchOne,"待审批","sendBack","发起人");
    sectionLaunch05(chiefOne,branchTwo,"被退回");
    branchApprove05(branchTwo,"待审批","agree");
    mainApprove05(mainOne,"待审批","reject");
}

/**
 * 科长发起并选择分管-分管领导同意-主要领导退回至发起人-发起人发起-分管领导同意-主要领导否决
 */
function testCase0508() {
    showTestResult("测试用例ID:0508----------------------------------------");
    InitPurchaseRequisition();
    sectionLaunch05(chiefOne,branchOne);
    branchApprove05(branchOne,"待审批","agree");
    mainApprove05(mainOne,"待审批","sendBack","发起人");
    sectionLaunch05(chiefOne,branchOne,"被退回");
    branchApprove05(branchOne,"待审批","agree");
    mainApprove05(mainOne,"待审批","reject");
}

/**
 * 科长保存-科长发起并选择分管-分管领导同意-主要领导退回至发起人-发起人发起-分管领导同意-主要领导否决
 */
function testCase0509() {
    showTestResult("测试用例ID:0509----------------------------------------");
    InitPurchaseRequisition();
    sectionSave05(chiefOne,branchOne);
    sectionLaunch05(chiefOne,branchOne,"草稿");
    branchApprove05(branchOne,"待审批","agree");
    mainApprove05(mainOne,"待审批","sendBack","发起人");
    sectionLaunch05(chiefOne,branchOne,"被退回");
    branchApprove05(branchOne,"待审批","agree");
    mainApprove05(mainOne,"待审批","reject");
}

/**
 * 科长发起并选择分管-分管领导同意-主要领导退回至分管领导-分管领导同意-主要领导否决
 */
function testCase0510() {
    showTestResult("测试用例ID:0510----------------------------------------");
    InitPurchaseRequisition();
    sectionLaunch05(chiefOne,branchOne);
    branchApprove05(branchOne,"待审批","agree");
    mainApprove05(mainOne,"待审批","sendBack","分管领导");
    branchApprove05(branchOne,"被退回","agree");
    mainApprove05(mainOne,"待审批","reject");
}


/**
 * 科长发起并选择分管-分管领导同意-主要领导退回至分管领导-分管领导退回至发起人-发起人发起-分管否决
 */
function testCase0511() {
    showTestResult("测试用例ID:0511----------------------------------------");
    InitPurchaseRequisition();
    sectionLaunch05(chiefOne,branchOne);
    branchApprove05(branchOne,"待审批","agree");
    mainApprove05(mainOne,"待审批","sendBack","分管领导");
    branchApprove05(branchOne,"被退回","sendBack","发起人");
    sectionLaunch05(chiefOne,branchOne,"被退回");
    branchApprove05(branchOne,"待审批","reject");
}
/**
 * 科长发起并选择分管-分管领导同意-主要领导退回至分管领导-分管领导退回至发起人-发起人发起-分管同意-主要否决
 */
function testCase0512() {
    showTestResult("测试用例ID:0512----------------------------------------");
    InitPurchaseRequisition();
    sectionLaunch05(chiefOne,branchOne);
    branchApprove05(branchOne,"待审批","agree");
    mainApprove05(mainOne,"待审批","sendBack","分管领导");
    branchApprove05(branchOne,"被退回","sendBack","发起人");
    sectionLaunch05(chiefOne,branchOne,"被退回");
    branchApprove05(branchOne,"待审批","agree");
    mainApprove05(mainOne,"待审批","reject")
}


/**
 * 科长发起并选择分管-分管领导同意-主要领导退回至分管领导-分管领导同意-主要领导同意-行政办确认
 */
function testCase0513() {
    showTestResult("测试用例ID:0513----------------------------------------");
    InitPurchaseRequisition();
    sectionLaunch05(chiefOne,branchOne);
    branchApprove05(branchOne,"待审批","agree");
    mainApprove05(mainOne,"待审批","sendBack","分管领导");
    branchApprove05(branchOne,"被退回","agree");
    mainApprove05(mainOne,"待审批","agree");
    executiveConfirm05(chiefTwo,"待执行","confirm")
}

/**
 * 科长发起并选择分管-分管领导同意-主要领导退回至分管领导-分管领导退回至发起人-发起人发起-分管同意-主要同意-行政办确认
 */
function testCase0514() {
    showTestResult("测试用例ID:0514----------------------------------------");
    InitPurchaseRequisition();
    sectionLaunch05(chiefOne,branchOne);
    branchApprove05(branchOne,"待审批","agree");
    mainApprove05(mainOne,"待审批","sendBack","分管领导");
    branchApprove05(branchOne,"被退回","sendBack","发起人");
    sectionLaunch05(chiefOne,branchOne,"被退回");
    branchApprove05(branchOne,"待审批","agree");
    mainApprove05(mainOne,"待审批","agree");
    executiveConfirm05(chiefTwo,"待执行","confirm")
}

/**
 * 科长保存-科长发起并选择分管-分管领导同意-主要领导退回至分管领导-分管领导同意-主要领导否决
 */
function testCase0515() {
    showTestResult("测试用例ID:0515----------------------------------------");
    InitPurchaseRequisition();
    sectionSave05(chiefOne,branchOne);
    sectionLaunch05(chiefOne,branchOne,"草稿");
    branchApprove05(branchOne,"待审批","agree");
    mainApprove05(mainOne,"待审批","sendBack","分管领导");
    branchApprove05(branchOne,"被退回","agree");
    mainApprove05(mainOne,"待审批","reject");
}


/**
 * 科长保存-科长发起并选择分管-分管领导同意-主要领导退回至分管领导-分管领导退回至发起人-发起人发起-分管否决
 */
function testCase0516() {
    showTestResult("测试用例ID:0516----------------------------------------");
    InitPurchaseRequisition();
    sectionSave05(chiefOne,branchOne);
    sectionLaunch05(chiefOne,branchOne,"草稿");
    branchApprove05(branchOne,"待审批","agree");
    mainApprove05(mainOne,"待审批","sendBack","分管领导");
    branchApprove05(branchOne,"被退回","sendBack","发起人");
    sectionLaunch05(chiefOne,branchOne,"被退回");
    branchApprove05(branchOne,"待审批","reject");
}
/**
 * 科长保存-科长发起并选择分管-分管领导同意-主要领导退回至分管领导-分管领导退回至发起人-发起人发起-分管同意-主要否决
 */
function testCase0517() {
    showTestResult("测试用例ID:0517----------------------------------------");
    InitPurchaseRequisition();
    sectionSave05(chiefOne,branchOne);
    sectionLaunch05(chiefOne,branchOne,"草稿");
    branchApprove05(branchOne,"待审批","agree");
    mainApprove05(mainOne,"待审批","sendBack","分管领导");
    branchApprove05(branchOne,"被退回","sendBack","发起人");
    sectionLaunch05(chiefOne,branchOne,"被退回");
    branchApprove05(branchOne,"待审批","agree");
    mainApprove05(mainOne,"待审批","reject")
}


/**
 * 科长保存-科长发起并选择分管-分管领导同意-主要领导退回至分管领导-分管领导同意-主要领导同意-行政办确认
 */
function testCase0518() {
    showTestResult("测试用例ID:0518----------------------------------------");
    InitPurchaseRequisition();
    sectionSave05(chiefOne,branchOne);
    sectionLaunch05(chiefOne,branchOne,"草稿");
    branchApprove05(branchOne,"待审批","agree");
    mainApprove05(mainOne,"待审批","sendBack","分管领导");
    branchApprove05(branchOne,"被退回","agree");
    mainApprove05(mainOne,"待审批","agree");
    executiveConfirm05(chiefTwo,"待执行","confirm")
}

/**
 * 科长保存-科长发起并选择分管-分管领导同意-主要领导退回至分管领导-分管领导退回至发起人-发起人发起-分管同意-主要同意-行政办确认
 */
function testCase0519() {
    showTestResult("测试用例ID:0519----------------------------------------");
    InitPurchaseRequisition();
    sectionSave05(chiefOne,branchOne);
    sectionLaunch05(chiefOne,branchOne,"草稿");
    branchApprove05(branchOne,"待审批","agree");
    mainApprove05(mainOne,"待审批","sendBack","分管领导");
    branchApprove05(branchOne,"被退回","sendBack","发起人");
    sectionLaunch05(chiefOne,branchOne,"被退回");
    branchApprove05(branchOne,"待审批","agree");
    mainApprove05(mainOne,"待审批","agree");
    executiveConfirm05(chiefTwo,"待执行","confirm")
}

/**
 * 科长保存-科长发起并选择分管-分管领导退回-科长发起并选择分管-分管领导同意-主要领导同意-行政办确认
 */
function testCase0520() {
    showTestResult("测试用例ID:0520----------------------------------------");
    InitPurchaseRequisition();
    sectionSave05(chiefOne,branchTwo);
    sectionLaunch05(chiefOne,branchOne,"草稿");
    branchApprove05(branchOne,"待审批","sendBack","发起人");
    sectionLaunch05(chiefOne,branchTwo,"被退回");
    branchApprove05(branchTwo,"待审批","agree");
    mainApprove05(mainOne,"待审批","agree");
    executiveConfirm05(chiefTwo,"待执行","confirm")
}
