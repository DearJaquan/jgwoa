/**
 * Created by DingFengwu on 2017/8/18.
 */

function testCase03() {
    showTestResult("------------------------------------------------------------------------------------------");
    showTestResult("小餐厅接待用餐流程测试");
    showTestResult("------------------------------------------------------------------------------------------");
    var caseCount = 10;
    for(var i=1; i<=caseCount; i++){
        var caseID = "testCase03"+((i < 10)?('0' + i):i);
        var testCase = eval(caseID);
        testCase();
    }
}

/**
 * 初始化数据
 */
function InitRestaurantReception() {
    instanceID = null;
    instanceType = "restaurantReception";
    control = {};
    content = {};
}

/**
 * 科员、科长保存
 */
function sectionSave03(user, to, classify) {
    if(classify){
        testTask([user],classify);
        testGetData(user);
    }
    content.dinnerDate = new Date().getTime();
    content.dinnerNum = "10";
    content.dinnerStandard = "50";
    content.dinnerReason = "用餐原因"+ new Date().getTime();
    content.transactor = user.name;
    content.signatureStaff = user.id;
    control.branchLeader = to.id;
    testSave(user);
}

/**
 * 科员、科长发起
 */
function sectionLaunch03(user, to, classify) {
    if(classify){
        testTask([user],classify);
        testGetData(user);
    }
    content.dinnerDate = new Date().getTime();
    content.dinnerNum = "10";
    content.dinnerStandard = "50";
    content.dinnerReason = "用餐原因"+ new Date().getTime();
    content.transactor = user.name;
    content.signatureStaff = user.id;
    control.branchLeader = to.id;
    testLaunch(user);
}



/**
 * 分管领导审批
 */
function branchApprove03(user, classify, approve, backTo) {
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
 * 行政办确认
 */
function executiveConfirm03(user, classify, approve, backTo) {
    testTask([user],classify);
    testGetData(user);
    content.signatureExecutive = user.id;
    content.timeExecutive = new Date().toLocaleDateString();
    switch (approve){
        case "confirm":
            content.dinnerPlace = "餐厅" + new Date().getTime();
            content.dinnerPlace = "500";
            testConfirm(user);
            break;
        case "sendBack":
            content.adviceExecutive = "行政办退回" + backTo;
            testSendBack(user,backTo);
            break;
    }
}

/**
 * 科员发起-分管领导同意-行政办确认
 */
function testCase0301() {
    showTestResult("测试用例ID:0301----------------------------------------");
    InitRestaurantReception();
    sectionLaunch03(clerkOne,branchOne);
    branchApprove03(branchOne,"待审批","agree");
    executiveConfirm03(chiefTwo,"待执行","confirm");
}

/**
 * 科长发起-分管领导同意-行政办确认
 */
function testCase0302() {
    showTestResult("测试用例ID:0302----------------------------------------");
    InitRestaurantReception();
    sectionLaunch03(chiefTwo,branchOne);
    branchApprove03(branchOne,"待审批","agree");
    executiveConfirm03(chiefTwo,"待执行","confirm");
}

/**
 * 科员保存-科员发起-分管领导同意-行政办确认
 */
function testCase0303() {
    showTestResult("测试用例ID:0303----------------------------------------");
    InitRestaurantReception();
    sectionSave03(clerkOne,branchOne);
    sectionLaunch03(clerkOne,branchOne,"草稿");
    branchApprove03(branchOne,"待审批","agree");
    executiveConfirm03(chiefTwo,"待执行","confirm");
}
/**
 * 科长保存-科长发起-分管领导同意-行政办确认
 */
function testCase0304() {
    showTestResult("测试用例ID:0304----------------------------------------");
    InitRestaurantReception();
    sectionSave03(chiefTwo,branchOne);
    sectionLaunch03(chiefTwo,branchOne,"草稿");
    branchApprove03(branchOne,"待审批","agree");
    executiveConfirm03(chiefTwo,"待执行","confirm");
}

/**
 * 科员发起-分管领导否决
 */
function testCase0305() {
    showTestResult("测试用例ID:0305----------------------------------------");
    InitRestaurantReception();
    sectionLaunch03(clerkOne,branchOne);
    branchApprove03(branchOne,"待审批","reject");
}
/**
 * 科长发起-分管领导否决
 */
function testCase0306() {
    showTestResult("测试用例ID:0306----------------------------------------");
    InitRestaurantReception();
    sectionLaunch03(chiefOne,branchOne);
    branchApprove03(branchOne,"待审批","reject");
}
/**
 * 科员保存-科员发起-分管领导否决
 */
function testCase0307() {
    showTestResult("测试用例ID:0307----------------------------------------");
    InitRestaurantReception();
    sectionSave03(clerkOne,branchOne);
    sectionLaunch03(clerkOne,branchOne,"草稿");
    branchApprove03(branchOne,"待审批","reject");
}

/**
 * 科长保存-科长发起-分管领导否决
 */
function testCase0308() {
    showTestResult("测试用例ID:0308----------------------------------------");
    InitRestaurantReception();
    sectionSave03(chiefOne,branchOne);
    sectionLaunch03(chiefOne,branchOne,"草稿");
    branchApprove03(branchOne,"待审批","reject");
}

/**
 * 科员保存-科员发起-分管领导退回-科员发起-分管领导同意-行政办确认
 */
function testCase0309() {
    showTestResult("测试用例ID:0309----------------------------------------");
    InitRestaurantReception();
    sectionSave03(clerkOne,branchOne);
    sectionLaunch03(clerkOne,branchOne,"草稿");
    branchApprove03(branchOne,"待审批","sendBack","发起人");
    sectionLaunch03(clerkOne,branchOne,"被退回");
    branchApprove03(branchOne,"待审批","agree");
    executiveConfirm03(chiefTwo,"待执行","confirm");
}
/**
 * 科员保存-科员发起-分管领导退回-科员发起-分管领导同意-行政办退回
 */
function testCase0310() {
    showTestResult("测试用例ID:0310----------------------------------------");
    InitRestaurantReception();
    sectionSave03(clerkOne,branchOne);
    sectionLaunch03(clerkOne,branchOne,"草稿");
    branchApprove03(branchOne,"待审批","sendBack","发起人");
    sectionLaunch03(clerkOne,branchOne,"被退回");
    branchApprove03(branchOne,"待审批","agree");
    executiveConfirm03(chiefTwo,"待执行","sendBack","发起人");
}