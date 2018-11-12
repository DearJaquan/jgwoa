/**
 * Created by Dingfengwu on 2017/8/22.
 */

function testCase06() {
    showTestResult("------------------------------------------------------------------------------------------");
    showTestResult("（区交通委）合同审批表流程测试");
    showTestResult("------------------------------------------------------------------------------------------");
    var caseCount = 25;
    for(var i=1; i<=caseCount; i++){
        var caseID = "testCase06"+((i < 10)?('0' + i):i);
        var testCase = eval(caseID);
        testCase();
    }
}

/**
 * 初始化数据
 */
function InitContractApprove() {
    instanceID = null;
    instanceType = "contractApprove";
    control = {};
    content = {};
}

/**
 * 科员保存
 */
function clerkSave06(user, classify) {
    if(classify){
        testTask([user],classify);
        testGetData(user);
    }
    content.projectName = "项目"+ new Date().getTime();
    content.contractNumber = new Date().toLocaleDateString();
    content.contractParty = "合作方"+ new Date().getTime();
    content.mainContent = "主要内容"+ new Date().getTime();
    content.signatureStaff = user.id;
    testSave(user);
}

/**
 * 科员发起
 */
function clerkLaunch06(user, classify) {
    if(classify){
        testTask([user],classify);
        testGetData(user);
    }
    content.projectName = "项目"+ new Date().getTime();
    content.contractNumber = new Date().toLocaleDateString();
    content.contractParty = "合作方"+ new Date().getTime();
    content.mainContent = "主要内容"+ new Date().getTime();
    content.signatureStaff = user.id;
    testLaunch(user);
}

/**
 * 科长保存
 */
function sectionSave06(user, to, classify) {
    if(classify){
        testTask([user],classify);
        testGetData(user);
    }
    content.projectName = "项目"+ new Date().getTime();
    content.contractNumber = new Date().toLocaleDateString();
    content.contractParty = "合作方"+ new Date().getTime();
    content.mainContent = "主要内容"+ new Date().getTime();
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
function sectionLaunch06(user, to, classify) {
    if(classify){
        testTask([user],classify);
        testGetData(user);
    }
    content.projectName = "项目"+ new Date().getTime();
    content.contractNumber = new Date().toLocaleDateString();
    content.contractParty = "合作方"+ new Date().getTime();
    content.mainContent = "主要内容"+ new Date().getTime();
    content.signatureStaff = user.id;
    content.adviceSection = "科室同意" + new Date().getTime();
    content.signatureSection = user.id;
    content.timeAdviceSection = new Date().toLocaleDateString();
    control.branchLeader = to.id;
    testLaunch(user);
}

/**
 * 科室审批
 */
function sectionApprove06(user, classify, approve, to) {
    testTask([user],classify);
    testGetData(user);
    content.signatureBrachLeader = user.id;
    content.timeAdviceBranchLeader = new Date().toLocaleDateString();
    switch (approve){
        case "agree":
            control.branchLeader = to.id;
            content.adviceBranchLeader = "科室同意" + new Date().getTime();
            testAgree(user);
            break;
        case "reject":
            content.adviceBranchLeader = "科室否决" + new Date().getTime();
            testReject(user);
            break;
        case "sendBack":
            content.adviceBranchLeader = "科室退回" + to;
            testSendBack(user,to);
            break;
    }
}

/**
 * 分管领导审批
 */
function branchApprove06(user, classify, approve, backTo) {
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
function mainApprove06(user, classify, approve, backTo) {
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
function executiveConfirm06(user, classify, approve) {
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

/******************************************************************************/

/**
 * 科员发起-科长同意-分管领导同意-主要领导同意-行政办确认
 */
function testCase0601() {
    showTestResult("测试用例ID:0601----------------------------------------");
    InitContractApprove();
    clerkLaunch06(clerkOne);
    sectionApprove06(chiefOne,"待审批","agree",branchOne);
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","agree");
    executiveConfirm06(chiefTwo,"待执行","confirm");
}

/**
 * 科员发起-科长同意-分管领导同意-主要领导否决
 */
function testCase0602() {
    showTestResult("测试用例ID:0602----------------------------------------");
    InitContractApprove();
    clerkLaunch06(clerkOne);
    sectionApprove06(chiefOne,"待审批","agree",branchOne);
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","reject");
}

/**
 * 科员发起-科长同意-分管领导同意-主要领导退回分管-分管领导同意-主要领导同意-行政办确认
 */
function testCase0603() {
    showTestResult("测试用例ID:0603----------------------------------------");
    InitContractApprove();
    clerkLaunch06(clerkOne);
    sectionApprove06(chiefOne,"待审批","agree",branchOne);
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","sendBack","分管领导");
    branchApprove06(branchOne,"被退回","agree");
    mainApprove06(mainOne,"待审批","agree");
    executiveConfirm06(chiefTwo,"待执行","confirm");
}

/**
 * 科员发起-科长同意-分管领导同意-主要领导退回科长-科长同意-分管领导同意-主要领导同意-行政办确认
 */
function testCase0604() {
    showTestResult("测试用例ID:0604----------------------------------------");
    InitContractApprove();
    clerkLaunch06(clerkOne);
    sectionApprove06(chiefOne,"待审批","agree",branchOne);
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","sendBack","科长");
    sectionApprove06(chiefOne,"被退回","agree",branchOne);
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","agree");
    executiveConfirm06(chiefTwo,"待执行","confirm");
}

/**
 * 科员发起-科长同意-分管领导同意-主要领导退回科长-科长同意并换分管-分管领导同意-主要领导同意-行政办确认
 */
function testCase0605() {
    showTestResult("测试用例ID:0605----------------------------------------");
    InitContractApprove();
    clerkLaunch06(clerkOne);
    sectionApprove06(chiefOne,"待审批","agree",branchOne);
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","sendBack","科长");
    sectionApprove06(chiefOne,"被退回","agree",branchTwo);
    branchApprove06(branchTwo,"待审批","agree");
    mainApprove06(mainOne,"待审批","agree");
    executiveConfirm06(chiefTwo,"待执行","confirm");
}

/**
 * 科员发起-科长同意-分管领导同意-主要领导退回发起-发起人修改发起-科长同意-分管领导同意-主要领导同意-行政办确认
 */
function testCase0606() {
    showTestResult("测试用例ID:0606----------------------------------------");
    InitContractApprove();
    clerkLaunch06(clerkOne);
    sectionApprove06(chiefOne,"待审批","agree",branchOne);
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","sendBack","发起人");
    clerkLaunch06(clerkOne,"被退回");
    sectionApprove06(chiefOne,"待审批","agree",branchOne);
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","agree");
    executiveConfirm06(chiefTwo,"待执行","confirm");
}

/**
 * 科员发起-科长同意-分管领导否决
 */
function testCase0607() {
    showTestResult("测试用例ID:0607----------------------------------------");
    InitContractApprove();
    clerkLaunch06(clerkOne);
    sectionApprove06(chiefOne,"待审批","agree",branchOne);
    branchApprove06(branchOne,"待审批","reject");
}

/**
 * 科员发起-科长同意-分管领导退回科长-科长同意-分管领导同意-主要领导同意-行政办确认
 */
function testCase0608() {
    showTestResult("测试用例ID:0608----------------------------------------");
    InitContractApprove();
    clerkLaunch06(clerkOne);
    sectionApprove06(chiefOne,"待审批","agree",branchOne);
    branchApprove06(branchOne,"待审批","sendBack","科长");
    sectionApprove06(chiefOne,"被退回","agree",branchOne);
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","agree");
    executiveConfirm06(chiefTwo,"待执行","confirm");
}

/**
 * 科员发起-科长同意-分管领导退回科长-科长同意并换分管-分管领导同意-主要领导同意-行政办确认
 */
function testCase0609() {
    showTestResult("测试用例ID:0609----------------------------------------");
    InitContractApprove();
    clerkLaunch06(clerkOne);
    sectionApprove06(chiefOne,"待审批","agree",branchOne);
    branchApprove06(branchOne,"待审批","sendBack","科长");
    sectionApprove06(chiefOne,"被退回","agree",branchTwo);
    branchApprove06(branchTwo,"待审批","agree");
    mainApprove06(mainOne,"待审批","agree");
    executiveConfirm06(chiefTwo,"待执行","confirm");
}

/**
 * 科员发起-科长同意-分管领导退回发起-发起人修改发起-科长同意-分管领导同意-主要领导同意-行政办确认
 */
function testCase0610() {
    showTestResult("测试用例ID:0610----------------------------------------");
    InitContractApprove();
    clerkLaunch06(clerkOne);
    sectionApprove06(chiefOne,"待审批","agree",branchOne);
    branchApprove06(branchOne,"待审批","sendBack","发起人");
    clerkLaunch06(clerkOne,"被退回");
    sectionApprove06(chiefOne,"待审批","agree",branchOne);
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","agree");
    executiveConfirm06(chiefTwo,"待执行","confirm");
}

/**
 * 科员发起-科长否决
 */
function testCase0611() {
    showTestResult("测试用例ID:0611----------------------------------------");
    InitContractApprove();
    clerkLaunch06(clerkOne);
    sectionApprove06(chiefOne,"待审批","reject");
}

/**
 * 科员发起-科长退回发起-发起人修改发起-科长同意-分管领导同意-主要领导同意-行政办确认
 */
function testCase0612() {
    showTestResult("测试用例ID:0612----------------------------------------");
    InitContractApprove();
    clerkLaunch06(clerkOne);
    sectionApprove06(chiefOne,"待审批","sendBack","发起人");
    clerkLaunch06(clerkOne,"被退回");
    sectionApprove06(chiefOne,"待审批","agree",branchOne);
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","agree");
    executiveConfirm06(chiefTwo,"待执行","confirm");
}

/**
 * 科长发起-分管同意-主要同意-行政办确认
 */
function testCase0613() {
    showTestResult("测试用例ID:0613----------------------------------------");
    InitContractApprove();
    sectionLaunch06(chiefOne,branchOne);
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","agree");
    executiveConfirm06(chiefTwo,"待执行","confirm");
}

/**
 * 科长发起-分管同意-主要否决
 */
function testCase0614() {
    showTestResult("测试用例ID:0614----------------------------------------");
    InitContractApprove();
    sectionLaunch06(chiefOne,branchOne);
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","reject");
}

/**
 * 科长发起-分管同意-主要退回分管-分管同意-主要同意-行政办确认
 */
function testCase0615() {
    showTestResult("测试用例ID:0615----------------------------------------");
    InitContractApprove();
    sectionLaunch06(chiefOne,branchOne);
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","sendBack","分管领导");
    branchApprove06(branchOne,"被退回","agree");
    mainApprove06(mainOne,"待审批","agree");
    executiveConfirm06(chiefTwo,"待执行","confirm");
}

/**
 * 科长发起-分管同意-主要退回发起-发起人修改并发起-分管同意-主要同意-行政办确认
 */
function testCase0616() {
    showTestResult("测试用例ID:0616----------------------------------------");
    InitContractApprove();
    sectionLaunch06(chiefOne,branchOne);
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","sendBack","发起人");
    sectionLaunch06(chiefOne,branchOne,"被退回");
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","agree");
    executiveConfirm06(chiefTwo,"待执行","confirm");
}

/**
 * 科长发起-分管同意-主要退回发起-发起人修改并发起并换分管-分管同意-主要同意-行政办确认
 */
function testCase0617() {
    showTestResult("测试用例ID:0617----------------------------------------");
    InitContractApprove();
    sectionLaunch06(chiefOne,branchOne);
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","sendBack","发起人");
    sectionLaunch06(chiefOne,branchTwo,"被退回");
    branchApprove06(branchTwo,"待审批","agree");
    mainApprove06(mainOne,"待审批","agree");
    executiveConfirm06(chiefTwo,"待执行","confirm");
}

/**
 * 科长发起-分管否决
 */
function testCase0618() {
    showTestResult("测试用例ID:0618----------------------------------------");
    InitContractApprove();
    sectionLaunch06(chiefOne,branchOne);
    branchApprove06(branchOne,"待审批","reject");
}

/**
 * 科长发起-分管退回发起-发起人修改并发起-分管同意-主要同意-行政办确认
 */
function testCase0619() {
    showTestResult("测试用例ID:0619----------------------------------------");
    InitContractApprove();
    sectionLaunch06(chiefOne,branchOne);
    branchApprove06(branchOne,"待审批","sendBack","发起人");
    sectionLaunch06(chiefOne,branchOne,"被退回");
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","agree");
    executiveConfirm06(chiefTwo,"待执行","confirm");
}

/**
 * 科长发起-分管退回发起-发起人修改并发起并换分管-分管同意-主要同意-行政办确认
 */
function testCase0620() {
    showTestResult("测试用例ID:0620----------------------------------------");
    InitContractApprove();
    sectionLaunch06(chiefOne,branchOne);
    branchApprove06(branchOne,"待审批","sendBack","发起人");
    sectionLaunch06(chiefOne,branchTwo,"被退回");
    branchApprove06(branchTwo,"待审批","agree");
    mainApprove06(mainOne,"待审批","agree");
    executiveConfirm06(chiefTwo,"待执行","confirm");
}

/**
 * 科员发起-科长退回发起-发起人修改身份并发起-分管同意-主要同意-行政办确认
 */
function testCase0621() {
    showTestResult("测试用例ID:0621----------------------------------------");
    InitContractApprove();
    clerkLaunch06(clerkOne);
    sectionApprove06(chiefOne,"待审批","sendBack","发起人");
    sectionLaunch06(chiefTwo,branchOne,"被退回");
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","agree");
    executiveConfirm06(chiefTwo,"待执行","confirm");
}

/**
 * 科员发起-科长同意-分管退回发起-发起人修改身份并发起并换分管-分管同意-主要同意-行政办确认
 */
function testCase0622() {
    showTestResult("测试用例ID:0622----------------------------------------");
    InitContractApprove();
    clerkLaunch06(clerkOne);
    sectionApprove06(chiefOne,"待审批","agree",branchOne);
    branchApprove06(branchOne,"待审批","sendBack","发起人");
    sectionLaunch06(chiefTwo,branchTwo,"被退回");
    branchApprove06(branchTwo,"待审批","agree");
    mainApprove06(mainOne,"待审批","agree");
    executiveConfirm06(chiefTwo,"待执行","confirm");
}

/**
 * 科员保存-科员修改发起-科长同意-分管同意-主要同意-行政办确认
 */
function testCase0623() {
    showTestResult("测试用例ID:0623----------------------------------------");
    InitContractApprove();
    clerkSave06(clerkOne);
    clerkLaunch06(clerkOne,"草稿");
    sectionApprove06(chiefOne,"待审批","agree",branchOne);
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","agree");
    executiveConfirm06(chiefTwo,"待执行","confirm");
}

/**
 * 科长保存-科长保存-科长发起-分管同意-主要同意-行政办确认
 */
function testCase0624() {
    showTestResult("测试用例ID:0624----------------------------------------");
    InitContractApprove();
    sectionSave06(chiefOne,branchOne);
    sectionSave06(chiefOne,branchOne,"草稿");
    sectionLaunch06(chiefOne,branchOne,"草稿");
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","agree");
    executiveConfirm06(chiefTwo,"待执行","confirm");
}

/**
 * 科长发起-分管退回发起-发起人修改保存-发起人发起-分管同意-主要同意-行政办确认
 */
function testCase0625() {
    showTestResult("测试用例ID:0625----------------------------------------");
    InitContractApprove();
    sectionLaunch06(chiefOne,branchOne);
    branchApprove06(branchOne,"待审批","sendBack","发起人");
    sectionSave06(chiefOne,branchOne,"被退回");
    sectionLaunch06(chiefOne,branchOne,"草稿");
    branchApprove06(branchOne,"待审批","agree");
    mainApprove06(mainOne,"待审批","agree");
    executiveConfirm06(chiefTwo,"待执行","confirm");
}