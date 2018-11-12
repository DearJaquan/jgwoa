/**
 * Created by Revan on 2017/8/14.
 */

function testCase07() {
    showTestResult("------------------------------------------------------------------------------------------");
    showTestResult("项目预审表流程测试");
    showTestResult("------------------------------------------------------------------------------------------");
    var caseCount = 25;
    for(var i=1; i<=caseCount; i++){
        var caseID = "testCase01"+((i < 10)?('0' + i):i);
        var testCase = eval(caseID);
        testCase();
    }
}

/**
 * 初始化数据
 */
function InitProjectPreview() {
    instanceID = null;
    instanceType = "projectPreview";
    control = {};
    content = {};
}

/**
 * 科员保存
 */
function clerkSave07(user, classify) {
    if(classify){
        testTask([user],classify);
        testGetData(user);
    }
    content.projectName = "项目" + new Date().getTime();
    content.investmentAmount = new Date().getTime();
    content.tenderType = "方式" + new Date().getTime();
    testSave(user);
}

/**
 * 科员发起
 */
function clerkLaunch07(user, classify) {
    if(classify){
        testTask([user],classify);
        testGetData(user);
    }
    content.projectName = "项目" + new Date().getTime();
    content.investmentAmount = new Date().getTime();
    content.tenderType = "方式" + new Date().getTime();
    testLaunch(user);
}

/**
 * 科长保存
 */
function sectionSave07(user, to, classify) {
    if(classify){
        testTask([user],classify);
        testGetData(user);
    }
    content.projectName = "项目" + new Date().getTime();
    content.investmentAmount = new Date().getTime();
    content.tenderType = "方式" + new Date().getTime();
    content.adviceSection = "科室同意" + new Date().getTime();
    content.signatureSection = user.id;
    content.timeAdviceSection = new Date().toLocaleDateString();
    control.branchLeader = to.id;
    testSave(user);
}

/**
 * 科长发起
 */
function sectionLaunch07(user, to, classify) {
    if(classify){
        testTask([user],classify);
        testGetData(user);
    }
    content.projectName = "项目" + new Date().getTime();
    content.investmentAmount = new Date().getTime();
    content.tenderType = "方式" + new Date().getTime();
    content.adviceSection = "科室同意" + new Date().getTime();
    content.signatureSection = user.id;
    content.timeAdviceSection = new Date().toLocaleDateString();
    control.branchLeader = to.id;
    testLaunch(user);
}

/**
 * 科室审批
 */
function sectionApprove07(user, classify, approve, to) {
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
function branchApprove07(user, classify, approve, backTo) {
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
function mainApprove07(user, classify, approve, backTo) {
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
 * 科员发起-科长同意-分管领导同意-主要领导同意
 */
function testCase0707() {
    showTestResult("测试用例ID:0701----------------------------------------");
    InitProjectPreview();
    clerkLaunch07(clerkOne);
    sectionApprove07(chiefOne,"待审批","agree",branchOne);
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","agree");
}

/**
 * 科员发起-科长同意-分管领导同意-主要领导否决
 */
function testCase0702() {
    showTestResult("测试用例ID:0702----------------------------------------");
    InitProjectPreview();
    clerkLaunch07(clerkOne);
    sectionApprove07(chiefOne,"待审批","agree",branchOne);
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","reject");
}

/**
 * 科员发起-科长同意-分管领导同意-主要领导退回分管-分管领导同意-主要领导同意
 */
function testCase0703() {
    showTestResult("测试用例ID:0703----------------------------------------");
    InitProjectPreview();
    clerkLaunch07(clerkOne);
    sectionApprove07(chiefOne,"待审批","agree",branchOne);
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","sendBack","分管领导");
    branchApprove07(branchOne,"被退回","agree");
    mainApprove07(mainOne,"待审批","agree");
}

/**
 * 科员发起-科长同意-分管领导同意-主要领导退回科长-科长同意-分管领导同意-主要领导同意
 */
function testCase0704() {
    showTestResult("测试用例ID:0704----------------------------------------");
    InitProjectPreview();
    clerkLaunch07(clerkOne);
    sectionApprove07(chiefOne,"待审批","agree",branchOne);
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","sendBack","科长");
    sectionApprove07(chiefOne,"被退回","agree",branchOne);
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","agree");
}

/**
 * 科员发起-科长同意-分管领导同意-主要领导退回科长-科长同意并换分管-分管领导同意-主要领导同意
 */
function testCase0705() {
    showTestResult("测试用例ID:0705----------------------------------------");
    InitProjectPreview();
    clerkLaunch07(clerkOne);
    sectionApprove07(chiefOne,"待审批","agree",branchOne);
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","sendBack","科长");
    sectionApprove07(chiefOne,"被退回","agree",branchTwo);
    branchApprove07(branchTwo,"待审批","agree");
    mainApprove07(mainOne,"待审批","agree");
}

/**
 * 科员发起-科长同意-分管领导同意-主要领导退回发起-发起人修改发起-科长同意-分管领导同意-主要领导同意
 */
function testCase0706() {
    showTestResult("测试用例ID:0706----------------------------------------");
    InitProjectPreview();
    clerkLaunch07(clerkOne);
    sectionApprove07(chiefOne,"待审批","agree",branchOne);
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","sendBack","发起人");
    clerkLaunch07(clerkOne,"被退回");
    sectionApprove07(chiefOne,"待审批","agree",branchOne);
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","agree");
}

/**
 * 科员发起-科长同意-分管领导否决
 */
function testCase0707() {
    showTestResult("测试用例ID:0707----------------------------------------");
    InitProjectPreview();
    clerkLaunch07(clerkOne);
    sectionApprove07(chiefOne,"待审批","agree",branchOne);
    branchApprove07(branchOne,"待审批","reject");
}

/**
 * 科员发起-科长同意-分管领导退回科长-科长同意-分管领导同意-主要领导同意
 */
function testCase0708() {
    showTestResult("测试用例ID:0708----------------------------------------");
    InitProjectPreview();
    clerkLaunch07(clerkOne);
    sectionApprove07(chiefOne,"待审批","agree",branchOne);
    branchApprove07(branchOne,"待审批","sendBack","科长");
    sectionApprove07(chiefOne,"被退回","agree",branchOne);
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","agree");
}

/**
 * 科员发起-科长同意-分管领导退回科长-科长同意并换分管-分管领导同意-主要领导同意
 */
function testCase0709() {
    showTestResult("测试用例ID:0709----------------------------------------");
    InitProjectPreview();
    clerkLaunch07(clerkOne);
    sectionApprove07(chiefOne,"待审批","agree",branchOne);
    branchApprove07(branchOne,"待审批","sendBack","科长");
    sectionApprove07(chiefOne,"被退回","agree",branchTwo);
    branchApprove07(branchTwo,"待审批","agree");
    mainApprove07(mainOne,"待审批","agree");
}

/**
 * 科员发起-科长同意-分管领导退回发起-发起人修改发起-科长同意-分管领导同意-主要领导同意
 */
function testCase0710() {
    showTestResult("测试用例ID:0710----------------------------------------");
    InitProjectPreview();
    clerkLaunch07(clerkOne);
    sectionApprove07(chiefOne,"待审批","agree",branchOne);
    branchApprove07(branchOne,"待审批","sendBack","发起人");
    clerkLaunch07(clerkOne,"被退回");
    sectionApprove07(chiefOne,"待审批","agree",branchOne);
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","agree");
}

/**
 * 科员发起-科长否决
 */
function testCase0711() {
    showTestResult("测试用例ID:0711----------------------------------------");
    InitProjectPreview();
    clerkLaunch07(clerkOne);
    sectionApprove07(chiefOne,"待审批","reject");
}

/**
 * 科员发起-科长退回发起-发起人修改发起-科长同意-分管领导同意-主要领导同意
 */
function testCase0712() {
    showTestResult("测试用例ID:0712----------------------------------------");
    InitProjectPreview();
    clerkLaunch07(clerkOne);
    sectionApprove07(chiefOne,"待审批","sendBack","发起人");
    clerkLaunch07(clerkOne,"被退回");
    sectionApprove07(chiefOne,"待审批","agree",branchOne);
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","agree");
}

/**
 * 科长发起-分管同意-主要同意
 */
function testCase0713() {
    showTestResult("测试用例ID:0713----------------------------------------");
    InitProjectPreview();
    sectionLaunch07(chiefOne,branchOne);
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","agree");
}

/**
 * 科长发起-分管同意-主要否决
 */
function testCase0714() {
    showTestResult("测试用例ID:0714----------------------------------------");
    InitProjectPreview();
    sectionLaunch07(chiefOne,branchOne);
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","reject");
}

/**
 * 科长发起-分管同意-主要退回分管-分管同意-主要同意
 */
function testCase0715() {
    showTestResult("测试用例ID:0715----------------------------------------");
    InitProjectPreview();
    sectionLaunch07(chiefOne,branchOne);
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","sendBack","分管领导");
    branchApprove07(branchOne,"被退回","agree");
    mainApprove07(mainOne,"待审批","agree");
}

/**
 * 科长发起-分管同意-主要退回发起-发起人修改并发起-分管同意-主要同意
 */
function testCase0716() {
    showTestResult("测试用例ID:0716----------------------------------------");
    InitProjectPreview();
    sectionLaunch07(chiefOne,branchOne);
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","sendBack","发起人");
    sectionLaunch07(chiefOne,branchOne,"被退回");
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","agree");
}

/**
 * 科长发起-分管同意-主要退回发起-发起人修改并发起并换分管-分管同意-主要同意
 */
function testCase0717() {
    showTestResult("测试用例ID:0717----------------------------------------");
    InitProjectPreview();
    sectionLaunch07(chiefOne,branchOne);
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","sendBack","发起人");
    sectionLaunch07(chiefOne,branchTwo,"被退回");
    branchApprove07(branchTwo,"待审批","agree");
    mainApprove07(mainOne,"待审批","agree");
}

/**
 * 科长发起-分管否决
 */
function testCase0718() {
    showTestResult("测试用例ID:0718----------------------------------------");
    InitProjectPreview();
    sectionLaunch07(chiefOne,branchOne);
    branchApprove07(branchOne,"待审批","reject");
}

/**
 * 科长发起-分管退回发起-发起人修改并发起-分管同意-主要同意
 */
function testCase0719() {
    showTestResult("测试用例ID:0719----------------------------------------");
    InitProjectPreview();
    sectionLaunch07(chiefOne,branchOne);
    branchApprove07(branchOne,"待审批","sendBack","发起人");
    sectionLaunch07(chiefOne,branchOne,"被退回");
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","agree");
}

/**
 * 科长发起-分管退回发起-发起人修改并发起并换分管-分管同意-主要同意
 */
function testCase0720() {
    showTestResult("测试用例ID:0720----------------------------------------");
    InitProjectPreview();
    sectionLaunch07(chiefOne,branchOne);
    branchApprove07(branchOne,"待审批","sendBack","发起人");
    sectionLaunch07(chiefOne,branchTwo,"被退回");
    branchApprove07(branchTwo,"待审批","agree");
    mainApprove07(mainOne,"待审批","agree");
}

/**
 * 科员发起-科长退回发起-发起人修改身份并发起-分管同意-主要同意
 */
function testCase0721() {
    showTestResult("测试用例ID:0721----------------------------------------");
    InitProjectPreview();
    clerkLaunch07(clerkOne);
    sectionApprove07(chiefOne,"待审批","sendBack","发起人");
    sectionLaunch07(chiefTwo,branchOne,"被退回");
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","agree");
}

/**
 * 科员发起-科长同意-分管退回发起-发起人修改身份并发起并换分管-分管同意-主要同意
 */
function testCase0722() {
    showTestResult("测试用例ID:0722----------------------------------------");
    InitProjectPreview();
    clerkLaunch07(clerkOne);
    sectionApprove07(chiefOne,"待审批","agree",branchOne);
    branchApprove07(branchOne,"待审批","sendBack","发起人");
    sectionLaunch07(chiefTwo,branchTwo,"被退回");
    branchApprove07(branchTwo,"待审批","agree");
    mainApprove07(mainOne,"待审批","agree");
}

/**
 * 科员保存-科员修改发起-科长同意-分管同意-主要同意
 */
function testCase0723() {
    showTestResult("测试用例ID:0723----------------------------------------");
    InitProjectPreview();
    clerkSave07(clerkOne);
    clerkLaunch07(clerkOne,"草稿");
    sectionApprove07(chiefOne,"待审批","agree",branchOne);
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","agree");
}

/**
 * 科长保存-科长保存-科长发起-分管同意-主要同意
 */
function testCase0724() {
    showTestResult("测试用例ID:0724----------------------------------------");
    InitProjectPreview();
    sectionSave07(chiefOne,branchOne);
    sectionSave07(chiefOne,branchOne,"草稿");
    sectionLaunch07(chiefOne,branchOne,"草稿");
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","agree");
}

/**
 * 科长发起-分管退回发起-发起人修改保存-发起人发起-分管同意-主要同意
 */
function testCase0725() {
    showTestResult("测试用例ID:0725----------------------------------------");
    InitProjectPreview();
    sectionLaunch07(chiefOne,branchOne);
    branchApprove07(branchOne,"待审批","sendBack","发起人");
    sectionSave07(chiefOne,branchOne,"被退回");
    sectionLaunch07(chiefOne,branchOne,"草稿");
    branchApprove07(branchOne,"待审批","agree");
    mainApprove07(mainOne,"待审批","agree");
}