/**
 * Created by DingFengwu on 2017/8/18.
 */

function testCase04() {
    showTestResult("------------------------------------------------------------------------------------------");
    showTestResult("政府信息公开流程测试");
    showTestResult("------------------------------------------------------------------------------------------");
    var caseCount = 38;
    for(var i=1; i<=caseCount; i++){
        var caseID = "testCase04"+((i < 10)?('0' + i):i);
        var testCase = eval(caseID);
        testCase();
    }
}

/**
 * 初始化数据
 */
function InitGovernmentInformation() {
    instanceID = null;
    instanceType = "governmentInformation";
    control = {};
    content = {};
}

/**
 * 发起人（行政办科员、行政办科长）保存
 */
function sectionSave04(user, to, classify) {
    if(classify){
        testTask([user],classify);
        testGetData(user);
    }
    content.applicationNum = "NO"+new Date().getTime();
    content.registration = new Date().getTime();
    content.publicContent = "申请公开内容"+new Date().getTime();
    content.proposer = user.name;
    content.signatureStaff = user.id;
    control.section = to.id;
    testSave(user);
}

/**
 * 发起人（行政办科员、行政办科长）发起
 */
function sectionLaunch04(user, to, classify) {
    if(classify){
        testTask([user],classify);
        testGetData(user);
    }
    content.applicationNum = "NO"+new Date().getTime();
    content.registration = new Date().getTime();
    content.publicContent = "申请公开内容"+new Date().getTime();
    content.proposer = user.name;
    content.signatureStaff = user.id;
    control.section = to.id;      //业务科室
    testLaunch(user);
}
/**
 * 业务科室审批
 */
function sectionApprove04(user, classify, approve, backTo) {
    testTask([user],classify);
    testGetData(user);
    content.signatureSection = user.id;
    content.timeAdviceSection = new Date().toLocaleDateString();
    switch (approve){
        case "agree":
            content.adviceSection = "业务科室同意" + new Date().getTime();
            testAgree(user);
            break;
        case "reject":
            content.adviceSection = "业务科室否决" + new Date().getTime();
            testReject(user);
            break;
        case "sendBack":
            content.adviceSection = "业务科室退回" + backTo;
            testSendBack(user,backTo);
            break;
    }
}

/**
 * 法规科审批
 */
function lawSectionApprove04(user, classify, approve,toBranch,toSecrecy, backTo) {
    testTask([user],classify);
    testGetData(user);
    content.branchLeader=toBranch.id;
    content.secrecy = toSecrecy.id;
    content.signatureLawSection = user.id;
    content.timeAdviceLawSection = new Date().toLocaleDateString();
    switch (approve){
        case "agree":
            content.adviceLawSection = "法规科同意" + new Date().getTime();
            testAgree(user);
            break;
        case "reject":
            content.adviceLawSection = "法规科否决" + new Date().getTime();
            testReject(user);
            break;
        case "sendBack":
            content.adviceLawSection = "法规科退回" + backTo;
            testSendBack(user,backTo);
            break;
    }
}

/**
 * 分管领导审批
 */
function branchApprove04(user, classify, approve, backTo) {
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
 * 保密单位审批
 */
function secrecyApprove04(user, classify, approve, backTo) {
    testTask([user],classify);
    testGetData(user);
    content.signatureSecrecy = user.id;
    content.timeAdviceSecrecy = new Date().toLocaleDateString();
    switch (approve){
        case "agree":
            content.adviceSecrecy = "保密单位同意" + new Date().getTime();
            testAgree(user);
            break;
        case "reject":
            content.adviceSecrecy = "保密单位否决" + new Date().getTime();
            testReject(user);
            break;
        case "sendBack":
            content.adviceSecrecy = "保密单位退回" + backTo;
            testSendBack(user,backTo);
            break;
    }
}

/**
 * 主要领导审批
 */
function mainApprove04(user,classify,approve,backTo) {
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
function executiveConfirm04(user, classify, approve) {
    testTask([user],classify);
    testGetData(user);
    content.signatureExecutive = user.id;
    content.timeExecutive = new Date().toLocaleDateString();
    switch (approve){
        case "confirm":
            content.replyDate =  new Date().getTime();
            content.processResult = "完成"+ new Date().getTime();
            testConfirm(user);
            break;
    }
}
/************************************************************************/

/**
 * 发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导同意-行政办确认
 */
function testCase0401() {
    showTestResult("测试用例ID:0401----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree",branchTwo,secrecy);
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","agree");
    executiveConfirm04(chiefTwo,"待执行","confirm");
}
/**
 * 发起人发起-业务科室否决
 */
function testCase0402() {
    showTestResult("测试用例ID:0402----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "reject");
}
/**
 * 发起人保存-发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导同意-行政办确认
 */
function testCase0403() {
    showTestResult("测试用例ID:0403----------------------------------------");
    InitGovernmentInformation();
    sectionSave04(chiefTwo,section);
    sectionLaunch04(chiefTwo,section,"草稿");
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree",branchTwo,secrecy);
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","agree");
    executiveConfirm04(chiefTwo,"待执行","confirm");
}
/**
 * 发起人保存-发起人发起-业务科室否决
 */
function testCase0404() {
    showTestResult("测试用例ID:0404----------------------------------------");
    InitGovernmentInformation();
    sectionSave04(chiefTwo,section);
    sectionLaunch04(chiefTwo,section,"草稿");
    sectionApprove04(section, "待审批", "reject");
}

/**
 * 发起人发起-业务科室退回-发起人保存-发起人发起-业务科室否决
 */
function testCase0405() {
    showTestResult("测试用例ID:0405----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "sendBack","发起人");
    sectionSave04(chiefTwo,section,"被退回");
    sectionLaunch04(chiefTwo,section,"草稿");
    sectionApprove04(section, "待审批", "reject");
}

/**
 * 发起人发起-业务科室退回-发起人保存-发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导同意-行政办确认
 */
function testCase0406() {
    showTestResult("测试用例ID:0406----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "sendBack","发起人");
    sectionSave04(chiefTwo,section,"被退回");
    sectionLaunch04(chiefTwo,section,"草稿");
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree",branchTwo,secrecy);
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","agree");
    executiveConfirm04(chiefTwo,"待执行","confirm");
}
/**
 * 发起人发起-业务科室同意-法规科否决
 */
function testCase0407() {
    showTestResult("测试用例ID:0407----------------------------------------");
    InitGovernmentInformation();
    sectionSave04(chiefTwo,section);
    sectionLaunch04(chiefTwo,section,"草稿");
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","reject");
}

/**
 * 发起人发起-业务科室同意-法规科退回至业务科室-业务科室同意-法规科否决
 */
function testCase0408() {
    showTestResult("测试用例ID:0408----------------------------------------");
    InitGovernmentInformation();
    sectionSave04(chiefTwo,section);
    sectionLaunch04(chiefTwo,section,"草稿");
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","sendBack",branchTwo,secrecy,"业务科室");
    sectionApprove04(section, "被退回", "agree");
    lawSectionApprove04(clerkTwo, "待审批","reject");
}

/**
 * 发起人保存-发起人发起-业务科室同意-法规科退回至业务科室-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导同意-行政办确认
 */
function testCase0409() {
    showTestResult("测试用例ID:0409----------------------------------------");
    InitGovernmentInformation();
    sectionSave04(chiefTwo,section);
    sectionLaunch04(chiefTwo,section,"草稿");
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","sendBack",branchTwo,secrecy,"业务科室");
    sectionApprove04(section, "被退回", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","agree");
    executiveConfirm04(chiefTwo,"待执行","confirm");
}
/**
 * 发起人保存-发起人发起-业务科室同意-法规科退回至发起人-发起人发起-业务科室同意-法规科否决
 */
function testCase0410() {
    showTestResult("测试用例ID:0410----------------------------------------");
    InitGovernmentInformation();
    sectionSave04(chiefTwo,section);
    sectionLaunch04(chiefTwo,section,"草稿");
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","sendBack",branchTwo,secrecy,"发起人");
    sectionLaunch04(chiefTwo,section,"被退回");
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","reject");
}

/**
 * 发起人保存-发起人发起-业务科室同意-法规科退回至发起人-发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导同意-行政办确认
 */
function testCase0411() {
    showTestResult("测试用例ID:0411----------------------------------------");
    InitGovernmentInformation();
    sectionSave04(chiefTwo,section);
    sectionLaunch04(chiefTwo,section,"草稿");
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","sendBack",branchTwo,secrecy,"发起人");
    sectionLaunch04(chiefTwo,section,"被退回");
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","agree");
    executiveConfirm04(chiefTwo,"待执行","confirm");
}

/**
 * 发起人发起-业务科室同意-法规科同意-分管领导否决
 */
function testCase0412() {
    showTestResult("测试用例ID:0412----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","reject");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导退回至法规科-法规科同意-分管领导同意-保密单位同意-主要领导同意-行政办确认
 */
function testCase0413() {
    showTestResult("测试用例ID:0413----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","sendBack","法规科");
    lawSectionApprove04(clerkTwo, "被退回","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","agree");
    executiveConfirm04(chiefTwo,"待执行","confirm");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导退回至业务科室-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导同意-行政办确认
 */
function testCase0414() {
    showTestResult("测试用例ID:0414----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","sendBack","业务科室");
    sectionApprove04(section, "被退回", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","agree");
    executiveConfirm04(chiefTwo,"待执行","confirm");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导退回至发起人-发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导同意-行政办确认
 */
function testCase0415() {
    showTestResult("测试用例ID:0415----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","sendBack","发起人");
    sectionLaunch04(chiefTwo,section,"被退回");
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","agree");
    executiveConfirm04(chiefTwo,"待执行","confirm");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导退回至法规科-法规科同意-分管领导否决
 */
function testCase0416() {
    showTestResult("测试用例ID:0413----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","sendBack","法规科");
    lawSectionApprove04(clerkTwo, "被退回","agree");
    branchApprove04(branchTwo,"待审批","reject");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导退回至业务科室-业务科室同意-法规科同意-分管领导否决
 */
function testCase0417() {
    showTestResult("测试用例ID:0417----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","sendBack","业务科室");
    sectionApprove04(section, "被退回", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","reject");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导退回至发起人-发起人发起-业务科室同意-法规科同意-分管领导否决
 */
function testCase0418() {
    showTestResult("测试用例ID:0418----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","sendBack","发起人");
    sectionLaunch04(chiefTwo,section,"被退回");
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","reject");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位否决
 */
function testCase0419() {
    showTestResult("测试用例ID:0419----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "reject");
}

/**
 * 发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位退回至分管领导-分管领导同意-保密单位同意-主要领导同意-行政办确认
 */
function testCase0420() {
    showTestResult("测试用例ID:0420----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "sendBack","分管领导");
    branchApprove04(branchTwo,"被退回","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","agree");
    executiveConfirm04(chiefTwo,"待执行","confirm");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位退回至分管领导-分管领导同意-保密单位否决
 */
function testCase0421() {
    showTestResult("测试用例ID:0421----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "sendBack","分管领导");
    branchApprove04(branchTwo,"被退回","agree");
    secrecyApprove04(secrecy, "待审批", "reject");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位退回至法规科-法规科同意-分管领导同意-保密单位同意-主要领导同意-行政办确认
 */
function testCase0422() {
    showTestResult("测试用例ID:0422----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "sendBack","法规科");
    lawSectionApprove04(clerkTwo, "被退回","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","agree");
    executiveConfirm04(chiefTwo,"待执行","confirm");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位退回至法规科-法规科同意-分管领导同意-保密单位否决
 */
function testCase0423() {
    showTestResult("测试用例ID:0423----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "sendBack","法规科");
    lawSectionApprove04(clerkTwo, "被退回","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "reject");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位退回至业务科室-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导同意-行政办确认
 */
function testCase0424() {
    showTestResult("测试用例ID:0424----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "sendBack","业务科室");
    sectionApprove04(section, "被退回", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","agree");
    executiveConfirm04(chiefTwo,"待执行","confirm");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位退回至业务科室-业务科室同意-法规科同意-分管领导同意-保密单位否决
 */
function testCase0425() {
    showTestResult("测试用例ID:0425----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "sendBack","业务科室");
    sectionApprove04(section, "被退回", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "reject");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位退回至发起人-发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导同意-行政办确认
 */
function testCase0426() {
    showTestResult("测试用例ID:0426----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "sendBack","发起人");
    sectionLaunch04(chiefTwo,section,"被退回");
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","agree");
    executiveConfirm04(chiefTwo,"待执行","confirm");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位退回至发起人-发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位否决
 */
function testCase0427() {
    showTestResult("测试用例ID:0427----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "sendBack","发起人");
    sectionLaunch04(chiefTwo,section,"被退回");
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "reject");
}

/**
 * 发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导否决
 */
function testCase0428() {
    showTestResult("测试用例ID:0428----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","reject");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导退回至发起人-发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导同意-行政办确认
 */
function testCase0429() {
    showTestResult("测试用例ID:0429----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","sendBack","发起人");
    sectionLaunch04(chiefTwo,section,"被退回");
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","agree");
    executiveConfirm04(chiefTwo,"待执行","confirm");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导退回至发起人-发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导否决
 */
function testCase0430() {
    showTestResult("测试用例ID:0430----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","sendBack","发起人");
    sectionLaunch04(chiefTwo,section,"被退回");
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","reject");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导退回至业务科室-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导同意-行政办确认
 */
function testCase0431() {
    showTestResult("测试用例ID:0431----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","sendBack","业务科室");
    sectionApprove04(section, "被退回", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","agree");
    executiveConfirm04(chiefTwo,"待执行","confirm");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导退回至业务科室-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导否决
 */
function testCase0432() {
    showTestResult("测试用例ID:0432----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","sendBack","业务科室");
    sectionApprove04(section, "被退回", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","reject");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导退回至法规科-法规科同意-分管领导同意-保密单位同意-主要领导同意-行政办确认
 */
function testCase0433() {
    showTestResult("测试用例ID:0433----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","sendBack","法规科");
    lawSectionApprove04(clerkTwo, "被退回","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","agree");
    executiveConfirm04(chiefTwo,"待执行","confirm");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导退回至法规科-法规科同意-分管领导同意-保密单位同意-主要领导否决
 */
function testCase0434() {
    showTestResult("测试用例ID:0434----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","sendBack","法规科");
    lawSectionApprove04(clerkTwo, "被退回","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","reject");
}

/**
 * 发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导退回至分管领导-分管领导同意-保密单位同意-主要领导同意-行政办确认
 */
function testCase0435() {
    showTestResult("测试用例ID:0435----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","sendBack","分管领导");
    branchApprove04(branchTwo,"被退回","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","agree");
    executiveConfirm04(chiefTwo,"待执行","confirm");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导退回至分管领导-分管领导同意-保密单位同意-主要领导否决
 */
function testCase0436() {
    showTestResult("测试用例ID:0436----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","sendBack","分管领导");
    branchApprove04(branchTwo,"被退回","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","reject");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导退回至保密单位-保密单位同意-主要领导同意-行政办确认
 */
function testCase0437() {
    showTestResult("测试用例ID:0437----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","sendBack","保密单位");
    secrecyApprove04(secrecy, "被退回", "agree");
    mainApprove04(mainOne,"待审批","agree");
    executiveConfirm04(chiefTwo,"待执行","confirm");
}
/**
 * 发起人发起-业务科室同意-法规科同意-分管领导同意-保密单位同意-主要领导退回至保密单位-保密单位同意-主要领导否决
 */
function testCase0438() {
    showTestResult("测试用例ID:0438----------------------------------------");
    InitGovernmentInformation();
    sectionLaunch04(chiefTwo,section);
    sectionApprove04(section, "待审批", "agree");
    lawSectionApprove04(clerkTwo, "待审批","agree");
    branchApprove04(branchTwo,"待审批","agree");
    secrecyApprove04(secrecy, "待审批", "agree");
    mainApprove04(mainOne,"待审批","sendBack","保密单位");
    secrecyApprove04(secrecy, "被退回", "agree");
    mainApprove04(mainOne,"待审批","reject");
}