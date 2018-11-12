/**
 * Created by Revan on 2017/8/14.
 */

function testCase01() {
    showTestResult("------------------------------------------------------------------------------------------");
    showTestResult("印章流转流程测试");
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
function InitSealCirculation() {
    instanceID = null;
    instanceType = "sealCirculation";
    control = {};
    content = {};
}

/**
 * 科员保存
 */
function clerkSave01(user, classify) {
    if(classify){
        testTask([user],classify);
        testGetData(user);
    }
    content.fileName = "文件" + new Date().getTime();
    content.sealType = "印章" + new Date().getTime();
    content.launchSection = user.roleName.substring(0,3);
    content.transactor = user.name;
    content.signatureStaff = user.id;
    testSave(user);
}

/**
 * 科员发起
 */
function clerkLaunch01(user, classify) {
    if(classify){
        testTask([user],classify);
        testGetData(user);
    }
    content.fileName = "文件" + new Date().getTime();
    content.sealType = "印章" + new Date().getTime();
    content.launchSection = user.roleName.substring(0,3);
    content.transactor = user.name;
    content.signatureStaff = user.id;
    testLaunch(user);
}

/**
 * 科长保存
 */
function sectionSave01(user, to, classify) {
    if(classify){
        testTask([user],classify);
        testGetData(user);
    }
    content.fileName = "文件" + new Date().getTime();
    content.sealType = "印章" + new Date().getTime();
    content.launchSection = user.roleName.substring(0,3);
    content.transactor = user.name;
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
function sectionLaunch01(user, to, classify) {
    if(classify){
        testTask([user],classify);
        testGetData(user);
    }
    content.fileName = "文件" + new Date().getTime();
    content.sealType = "印章" + new Date().getTime();
    content.launchSection = user.roleName.substring(0,3);
    content.transactor = user.name;
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
function sectionApprove01(user, classify, approve, to) {
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
function branchApprove01(user, classify, approve, backTo) {
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
function mainApprove01(user, classify, approve, backTo) {
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
function testCase0101() {
    showTestResult("测试用例ID:0101----------------------------------------");
    InitSealCirculation();
    clerkLaunch01(clerkOne);
    sectionApprove01(chiefOne,"待审批","agree",branchOne);
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","agree");
}

/**
 * 科员发起-科长同意-分管领导同意-主要领导否决
 */
function testCase0102() {
    showTestResult("测试用例ID:0102----------------------------------------");
    InitSealCirculation();
    clerkLaunch01(clerkOne);
    sectionApprove01(chiefOne,"待审批","agree",branchOne);
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","reject");
}

/**
 * 科员发起-科长同意-分管领导同意-主要领导退回分管-分管领导同意-主要领导同意
 */
function testCase0103() {
    showTestResult("测试用例ID:0103----------------------------------------");
    InitSealCirculation();
    clerkLaunch01(clerkOne);
    sectionApprove01(chiefOne,"待审批","agree",branchOne);
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","sendBack","分管领导");
    branchApprove01(branchOne,"被退回","agree");
    mainApprove01(mainOne,"待审批","agree");
}

/**
 * 科员发起-科长同意-分管领导同意-主要领导退回科长-科长同意-分管领导同意-主要领导同意
 */
function testCase0104() {
    showTestResult("测试用例ID:0104----------------------------------------");
    InitSealCirculation();
    clerkLaunch01(clerkOne);
    sectionApprove01(chiefOne,"待审批","agree",branchOne);
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","sendBack","科长");
    sectionApprove01(chiefOne,"被退回","agree",branchOne);
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","agree");
}

/**
 * 科员发起-科长同意-分管领导同意-主要领导退回科长-科长同意并换分管-分管领导同意-主要领导同意
 */
function testCase0105() {
    showTestResult("测试用例ID:0105----------------------------------------");
    InitSealCirculation();
    clerkLaunch01(clerkOne);
    sectionApprove01(chiefOne,"待审批","agree",branchOne);
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","sendBack","科长");
    sectionApprove01(chiefOne,"被退回","agree",branchTwo);
    branchApprove01(branchTwo,"待审批","agree");
    mainApprove01(mainOne,"待审批","agree");
}

/**
 * 科员发起-科长同意-分管领导同意-主要领导退回发起-发起人修改发起-科长同意-分管领导同意-主要领导同意
 */
function testCase0106() {
    showTestResult("测试用例ID:0106----------------------------------------");
    InitSealCirculation();
    clerkLaunch01(clerkOne);
    sectionApprove01(chiefOne,"待审批","agree",branchOne);
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","sendBack","发起人");
    clerkLaunch01(clerkOne,"被退回");
    sectionApprove01(chiefOne,"待审批","agree",branchOne);
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","agree");
}

/**
 * 科员发起-科长同意-分管领导否决
 */
function testCase0107() {
    showTestResult("测试用例ID:0107----------------------------------------");
    InitSealCirculation();
    clerkLaunch01(clerkOne);
    sectionApprove01(chiefOne,"待审批","agree",branchOne);
    branchApprove01(branchOne,"待审批","reject");
}

/**
 * 科员发起-科长同意-分管领导退回科长-科长同意-分管领导同意-主要领导同意
 */
function testCase0108() {
    showTestResult("测试用例ID:0108----------------------------------------");
    InitSealCirculation();
    clerkLaunch01(clerkOne);
    sectionApprove01(chiefOne,"待审批","agree",branchOne);
    branchApprove01(branchOne,"待审批","sendBack","科长");
    sectionApprove01(chiefOne,"被退回","agree",branchOne);
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","agree");
}

/**
 * 科员发起-科长同意-分管领导退回科长-科长同意并换分管-分管领导同意-主要领导同意
 */
function testCase0109() {
    showTestResult("测试用例ID:0109----------------------------------------");
    InitSealCirculation();
    clerkLaunch01(clerkOne);
    sectionApprove01(chiefOne,"待审批","agree",branchOne);
    branchApprove01(branchOne,"待审批","sendBack","科长");
    sectionApprove01(chiefOne,"被退回","agree",branchTwo);
    branchApprove01(branchTwo,"待审批","agree");
    mainApprove01(mainOne,"待审批","agree");
}

/**
 * 科员发起-科长同意-分管领导退回发起-发起人修改发起-科长同意-分管领导同意-主要领导同意
 */
function testCase0110() {
    showTestResult("测试用例ID:0110----------------------------------------");
    InitSealCirculation();
    clerkLaunch01(clerkOne);
    sectionApprove01(chiefOne,"待审批","agree",branchOne);
    branchApprove01(branchOne,"待审批","sendBack","发起人");
    clerkLaunch01(clerkOne,"被退回");
    sectionApprove01(chiefOne,"待审批","agree",branchOne);
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","agree");
}

/**
 * 科员发起-科长否决
 */
function testCase0111() {
    showTestResult("测试用例ID:0111----------------------------------------");
    InitSealCirculation();
    clerkLaunch01(clerkOne);
    sectionApprove01(chiefOne,"待审批","reject");
}

/**
 * 科员发起-科长退回发起-发起人修改发起-科长同意-分管领导同意-主要领导同意
 */
function testCase0112() {
    showTestResult("测试用例ID:0112----------------------------------------");
    InitSealCirculation();
    clerkLaunch01(clerkOne);
    sectionApprove01(chiefOne,"待审批","sendBack","发起人");
    clerkLaunch01(clerkOne,"被退回");
    sectionApprove01(chiefOne,"待审批","agree",branchOne);
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","agree");
}

/**
 * 科长发起-分管同意-主要同意
 */
function testCase0113() {
    showTestResult("测试用例ID:0113----------------------------------------");
    InitSealCirculation();
    sectionLaunch01(chiefOne,branchOne);
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","agree");
}

/**
 * 科长发起-分管同意-主要否决
 */
function testCase0114() {
    showTestResult("测试用例ID:0114----------------------------------------");
    InitSealCirculation();
    sectionLaunch01(chiefOne,branchOne);
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","reject");
}

/**
 * 科长发起-分管同意-主要退回分管-分管同意-主要同意
 */
function testCase0115() {
    showTestResult("测试用例ID:0115----------------------------------------");
    InitSealCirculation();
    sectionLaunch01(chiefOne,branchOne);
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","sendBack","分管领导");
    branchApprove01(branchOne,"被退回","agree");
    mainApprove01(mainOne,"待审批","agree");
}

/**
 * 科长发起-分管同意-主要退回发起-发起人修改并发起-分管同意-主要同意
 */
function testCase0116() {
    showTestResult("测试用例ID:0116----------------------------------------");
    InitSealCirculation();
    sectionLaunch01(chiefOne,branchOne);
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","sendBack","发起人");
    sectionLaunch01(chiefOne,branchOne,"被退回");
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","agree");
}

/**
 * 科长发起-分管同意-主要退回发起-发起人修改并发起并换分管-分管同意-主要同意
 */
function testCase0117() {
    showTestResult("测试用例ID:0117----------------------------------------");
    InitSealCirculation();
    sectionLaunch01(chiefOne,branchOne);
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","sendBack","发起人");
    sectionLaunch01(chiefOne,branchTwo,"被退回");
    branchApprove01(branchTwo,"待审批","agree");
    mainApprove01(mainOne,"待审批","agree");
}

/**
 * 科长发起-分管否决
 */
function testCase0118() {
    showTestResult("测试用例ID:0118----------------------------------------");
    InitSealCirculation();
    sectionLaunch01(chiefOne,branchOne);
    branchApprove01(branchOne,"待审批","reject");
}

/**
 * 科长发起-分管退回发起-发起人修改并发起-分管同意-主要同意
 */
function testCase0119() {
    showTestResult("测试用例ID:0119----------------------------------------");
    InitSealCirculation();
    sectionLaunch01(chiefOne,branchOne);
    branchApprove01(branchOne,"待审批","sendBack","发起人");
    sectionLaunch01(chiefOne,branchOne,"被退回");
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","agree");
}

/**
 * 科长发起-分管退回发起-发起人修改并发起并换分管-分管同意-主要同意
 */
function testCase0120() {
    showTestResult("测试用例ID:0120----------------------------------------");
    InitSealCirculation();
    sectionLaunch01(chiefOne,branchOne);
    branchApprove01(branchOne,"待审批","sendBack","发起人");
    sectionLaunch01(chiefOne,branchTwo,"被退回");
    branchApprove01(branchTwo,"待审批","agree");
    mainApprove01(mainOne,"待审批","agree");
}

/**
 * 科员发起-科长退回发起-发起人修改身份并发起-分管同意-主要同意
 */
function testCase0121() {
    showTestResult("测试用例ID:0121----------------------------------------");
    InitSealCirculation();
    clerkLaunch01(clerkOne);
    sectionApprove01(chiefOne,"待审批","sendBack","发起人");
    sectionLaunch01(chiefTwo,branchOne,"被退回");
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","agree");
}

/**
 * 科员发起-科长同意-分管退回发起-发起人修改身份并发起并换分管-分管同意-主要同意
 */
function testCase0122() {
    showTestResult("测试用例ID:0122----------------------------------------");
    InitSealCirculation();
    clerkLaunch01(clerkOne);
    sectionApprove01(chiefOne,"待审批","agree",branchOne);
    branchApprove01(branchOne,"待审批","sendBack","发起人");
    sectionLaunch01(chiefTwo,branchTwo,"被退回");
    branchApprove01(branchTwo,"待审批","agree");
    mainApprove01(mainOne,"待审批","agree");
}

/**
 * 科员保存-科员修改发起-科长同意-分管同意-主要同意
 */
function testCase0123() {
    showTestResult("测试用例ID:0123----------------------------------------");
    InitSealCirculation();
    clerkSave01(clerkOne);
    clerkLaunch01(clerkOne,"草稿");
    sectionApprove01(chiefOne,"待审批","agree",branchOne);
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","agree");
}

/**
 * 科长保存-科长保存-科长发起-分管同意-主要同意
 */
function testCase0124() {
    showTestResult("测试用例ID:0124----------------------------------------");
    InitSealCirculation();
    sectionSave01(chiefOne,branchOne);
    sectionSave01(chiefOne,branchOne,"草稿");
    sectionLaunch01(chiefOne,branchOne,"草稿");
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","agree");
}

/**
 * 科长发起-分管退回发起-发起人修改保存-发起人发起-分管同意-主要同意
 */
function testCase0125() {
    showTestResult("测试用例ID:0125----------------------------------------");
    InitSealCirculation();
    sectionLaunch01(chiefOne,branchOne);
    branchApprove01(branchOne,"待审批","sendBack","发起人");
    sectionSave01(chiefOne,branchOne,"被退回");
    sectionLaunch01(chiefOne,branchOne,"草稿");
    branchApprove01(branchOne,"待审批","agree");
    mainApprove01(mainOne,"待审批","agree");
}