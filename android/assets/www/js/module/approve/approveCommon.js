/**
 * Created by Revan on 2017/7/18.
 */

/** @namespace data.startUser */
/** @namespace data.startUserId */
/** @namespace data.returnList */
/** @namespace data.personality */
/** @namespace data.pdf */

var user;//用户信息
var instance;//实例信息
var control;//控制信息
var fileList = [];
var relatedList = [];
var isRemember;

/**
 * 初始化
 * @param type
 */
function initCommon(type) {
    initUserData();
    initInstanceData(type);
    initControlData();
    initApproveInterface();
    initControlInterface();
    initUploadFileInterface();
    insertBackInterface($("#backIcon"));
    // initOthers();
}

/**
 * 初始化用户信息
 */
function initUserData() {
    user = getUserInfo();
    getLaunchRole();
}

/**
 * 初始化流程实例数据
 */
function initInstanceData(type) {
    instance = {};
    instance.isNew = getParameter("type") == "new";
    instance.type = type;
    if (instance.isNew) {
        instance.isLaunch = true;
        instance.isOperator = true;
        instance.launcherName = user.name;
        instance.launcherID = user.id;
        instance.launchTime = new Date();
        instance.launcherSection = getUserSection(user.launchRole.name);
        instance.currentStep = "发起流程";
        setNewData();
    } else {
        instance.id = getParameter("instanceID");
        getApproveData();
        instance.isLaunch = instance.currentStep.indexOf("发起流程") > -1;
    }
    getNextStep();
}

/**
 * 初始化流程控制数据
 */
function initControlData() {
    control = {};
    isAbleSelectCompanySuggestion = false;
    isAbleSelectChief = false;
    isAbleSelectDepartment = false;
    isAbleSelectSection = false;
    isAbleSelectBranch = false;
    isAbleSelectSecrecy = false;
    isAbleSelectMain = false;
    isShowLaunchRoleSelect = instance.currentStep.indexOf("发起流程") > -1 && user.launchRoleList.length > 1;
    isShowCompanySuggestionSelect = false;
    isShowChiefSelect = false;
    isShowDepartmentSelect = false;
    isShowSectionSelect = false;
    isShowBranchSelect = false;
    isShowSecrecySelect = false;
    isShowMainSelect = false;
    setControlData();
    isAbleSelectCompanySuggestion && getCompanySuggestion();
    isAbleSelectChief && getChief();
    isAbleSelectDepartment && getDepartment();
    isAbleSelectSection && getSection();
    isAbleSelectBranch && getBranchLeader();
    isAbleSelectSecrecy && getSecrecy();
    isAbleSelectMain && getMainLeader();
}

/**
 * 流程控制控件初始化
 */
function initControlInterface() {
    insertControlInterface();
    $("#launcherName").text(instance.launcherName);//显示发起人信息
    $("#launchTime").text(new Date(instance.launchTime).Format());//显示发起时间信息
    $("#currentStep").text(instance.currentStep);//显示当前步骤信息
    $("#nextStep").text(instance.nextStep);//显示下一步骤信息
    instance.isOperator&&instance.status != "已关闭"?$("#showCurrentStep").css("display", "none"):$("#showNextStep").css("display", "none");

    if(instance.isOperator) {
        if (isShowLaunchRoleSelect) {//显示发起身份信息
            var cLaunchRoleArea = $("#launchRoleArea");
            cLaunchRoleArea.addClass("control");
            cLaunchRoleArea.append("<span>身份选择：<select id='selectStatus' class='department'></select></span>");
            var cSelectStatus = $("#selectStatus");
            initSelect(cSelectStatus, user.launchRoleList, user.launchRole.id);
            cSelectStatus.change(function () {
                launchRoleChange();
            });
            if(instance.launcherSectionID){
                cSelectStatus.val(instance.launcherSectionID);
                cSelectStatus.attr("disabled","true");
                user.launchRole.id = cSelectStatus.val();
                user.launchRole.name = cSelectStatus.find("option:selected").text();
            }
        }
    }

    initOperateInterface();
}

/**
 * 初始化操作控件
 */
function initOperateInterface() {
    var controlArea = $("#contentControl");
    var operates = [];
    if (instance.isOperator && instance.status != "已关闭") {
        switch (instance.currentStep) {
            case "发起流程":
                operates = ["发起", "保存"];
                if (user.launchRole.name.indexOf("科长") > -1 && instance.type != "governmentInformation") {
                    if(user.launchRole.name.indexOf("财务科科长") == -1) {
                        var temp = $("#sectionControl");
                        if (temp.length > 0) {
                            controlArea = temp;
                        }
                    }
                }
                break;
            case "行政办确认":
            case "行政办处理并填写":
            case "纪工委确认":
            case "党委办确认":
            case "行政办填写":
            case "党委办填写":
            case "发起人填写":
            case "文件传阅":
            case "发起人确认":
                operates = ["执行"];
                break;
            case "单位负责人审批":
                controlArea = $("#unitManagerControl");
                operates = ["同意", "退回", "否决"];
                break;
            case "科室审批(初审)":
                controlArea = $("#sectionFirstControl");
                operates = ["拟同意","退回","否决"];
                break;
            case "科室审批":
            case "科室审批(拟办)":
            case "科室审批（申请）":
            case "科室审批（报销）":
            case "组织/老干部负责人审批":
            case "负责人审批":
            case "行政办审批":
            case "联席办负责人审批":
                controlArea = $("#sectionControl");
                operates = ["拟同意", "退回", "否决"];
                break;
            case "业务科室审批":
                controlArea = $("#sectionControl");
                if (isSelect) {
                    operates = ["拟同意", "退回", "否决"];
                } else {
                    operates = ["获取意见", "拟同意", "退回", "否决"];
                }
                break;
            case "委工会负责人审批":
            case "妇工委负责人审批":
                controlArea = $("#managerControl");
                operates = ["拟同意","退回","否决"];
                break;
            case "计划科审批":
                controlArea = $("#planningSectionControl");
                operates = ["拟同意", "退回", "否决"];
                break;
            case "主任办公会审批":
                controlArea = $("#executiveSectionControl");
                operates = ["拟同意", "退回", "否决"];
                break;
            case "办公室审批":
                controlArea = $("#officeRoomControl");
                operates = ["拟同意","退回","否决"];
                break;
            case "党委办审批":
                controlArea = $("#partySectionControl");
                operates = ["同意","退回","否决"];
                break;
            case "法规科审批":
                controlArea = $("#lawSectionControl");
                operates = ["拟同意", "退回", "否决"];
                break;
            case "分管领导审批(批示)":
                controlArea = $("#branchLeaderFirstControl");
                operates = ["同意","拟同意","退回","否决"];
                break;
            case "分管领导审批(审核)":
            case "分管领导审批":
            case "传阅人审批":
                controlArea = $("#branchLeaderControl");
                operates = ["同意", "拟同意", "退回", "否决"];
                if(instance.type == "documentCircularize2"||instance.type == "documentCircularize3"){
                    operates = ["已阅","同意"];
                }
                break;
            case "保密审查审批":
                controlArea = $("#secrecyBranchLeaderControl");
                operates = ["同意", "拟同意", "退回", "否决"];
                break;
            case "保密领导审批":
                operates = ["同意", "拟同意", "退回", "否决"];
                break;
            case "主要领导审批":
                controlArea = $("#mainLeaderControl");
                operates = ["同意", "退回", "否决"];
                if(instance.type == "documentCircularize2"||instance.type == "documentCircularize3"){
                    operates = ["已阅","同意"];
                }
                break;
            case "行政主要领导审批":
                controlArea = $("#adminMainLeaderControl");
                operates = ["同意", "退回", "否决"];
                break;
            case "党工委书记审批":
                controlArea = $("#partyMainLeaderControl");
                operates = ["同意", "退回", "否决"];
                break;
            case "审批人审批":
                controlArea = $("#approveControl");
                operates = ["同意", "退回"];
                if (instance.type == "forwardMeetingNotice"||instance.type == "meetingAppointment2"||instance.type == "meetingAppointment3") {
                    controlArea = $("#contentControl");
                    operates = ["执行"];
                }
                break;
            case "核稿（科长审批）":
            case "核稿（单位负责人审批）":
            case "核稿（分管领导审批）":
                controlArea = $("#examineControl");
                operates = ["拟同意", "同意", "退回", "否决"];
                break;
            case "签发（分管领导审批）":
            case "签发（主要领导审批）":
                controlArea = $("#signControl");
                operates = ["同意", "退回", "否决"];
                break;
            case "评审小组审批":
                controlArea = $("#reviewGroupControl");
                operates = ["同意", "退回", "否决"];
                break;
            case "评审小组确认":
                controlArea = $("#reviewGroupControl");
                operates = ["执行"];
                break;
            case "法律顾问、投资监理审批":
                controlArea = $("#legalAdviserControl");
                operates = ["同意", "退回", "否决"];
                break;
            case "征集意见":
                operates = ["执行"];
                break;
            case "划出单位审批":
                controlArea = $("#outUnitSControl");
                operates = ["同意","退回","否决"];
                break;
            case "划出单位主管部门审批":
                controlArea = $("#outUnitMControl");
                operates = ["同意","退回","否决"];
                break;
            case "接收单位财务审批":
                operates = ["同意","退回"];
                break;
            case "接收单位审批":
                controlArea = $("#getUnitSControl");
                operates = ["同意","退回"];
                break;
            case "接收单位主管部门审批":
                controlArea = $("#getUnitMControl");
                operates = ["同意","退回"];
                break;
        }
    }
    if((instance.type == "meetingAppointment3"||instance.type == "meetingAppointment2"||instance.type == "meetingAppointment"||instance.type == "forwardMeetingNotice")&& user.id == instance.launcherID && !instance.isLaunch && instance.status != "已关闭"){
        if (!instance.isOperator){
            operates = ["取消"];
        } else {
            operates = ["同意", "取消"];
        }
    }
    if(instance.isOperator && instance.type == "documentCircularize" && instance.currentStep == "主要领导审批"){
        operates = ["同意"];
    }
    controlArea.addClass("control");
    if (operates.length > 0) {
        var moreSelectArea = $("<span id='moreSelectArea'></span>").appendTo(controlArea);
    }
    if(instance.type != "reportReview"&&instance.type != "personnelRequisition"&&instance.type != "documentReview"){
        controlArea.append("<button id='preview' class='confirm' style='float: right;margin-top: 5px'>预览</button>");
    }
    if (operates.length > 0) {
        controlArea.append("<button id='confirm' class='confirm' style='float: right;margin-top: 5px'>确认</button>");
        var operateSelect = $("<select id='operate' class='operate' style='float: right;margin-top: 5px'></select>").appendTo(controlArea);
        operates.forEach(function (value) {
            operateSelect.append("<option>" + value + "</option>");
        });
        operateSelect.change(function () {
            moreSelectArea.empty();
            switch (operateSelect.find("option:selected").text()) {
                case "保存":
                case "发起":
                case "确认":
                case "拟同意":
                case "同意":
                case "执行":
                    if(isShowCompanySuggestionSelect){//显示合作公司选择（仅合同会审表）
                        moreSelectArea.append("<span>推荐建议：<select id='companySuggestion' class='person'></select></span>");
                        initSelect($("#companySuggestion"),control.companySuggestionList,control.companySuggestion);
                    }
                    if(isShowChiefSelect){//显示科长选择
                        moreSelectArea.append("<span>科长：<select id='selectChief' class='person'></select></span>");
                        initSelect($("#selectChief"),control.chiefList,control.chief);
                    }
                    if (isShowDepartmentSelect) {//显示单位选择
                        moreSelectArea.append("<span>单位：<select id='selectDepartment' class='person'></select></span>");
                        initSelect($("#selectDepartment"), control.departmentList, control.department);
                    }
                    if (isShowSectionSelect) {//显示业务科室选择
                        moreSelectArea.append("<span>业务科室：<select id='selectSection' class='person'></select></span>");
                        initSelect($("#selectSection"), control.sectionList, control.section);
                        if(instance.type == "keepLawCertificate"){
                            $("#selectSection").val("007");
                        }
                    }
                    if (isShowBranchSelect) {//显示分管领导选择
                        moreSelectArea.append("<span>分管领导：<select id='selectBranch' class='person'></select></span>");
                        initSelect($("#selectBranch"), control.branchList, control.branch);
                    }
                    if (isShowSecrecySelect) {//显示保密领导选择
                        moreSelectArea.append("<span>保密领导：<select id='selectSecrecy' class='person'></select></span>");
                        initSelect($("#selectSecrecy"), control.secrecyList, control.secrecy);
                        if(instance.type == "governmentInformation"){
                            $("#selectSecrecy").val("013");
                        }
                    }
                    if (isShowMainSelect) {//显示主要领导选择
                        moreSelectArea.append("<span>主要领导：<select id='selectMain' class='person'></select></span>");
                        initSelect($("#selectMain"), control.mainList, control.main);
                    }
                    addMoreControlOperate();
                    break;
                case "退回":
                    moreSelectArea.append("<span>退回到：<select id='sendBackTo' class='back'></select></span>");
                    initSelect($("#sendBackTo"), instance.sendBackToList);
                    break;
            }
        });
        operateSelect.change();

        $("#confirm").click(function () {
            var operateType = operateSelect.find("option:selected").text();
            switch (operateType) {
                case "保存":
                    if (instance.isOperator) {
                        save();
                    }
                    break;
                case "发起":
                    if (instance.isOperator && checkContent()) {
                        launch();
                    }
                    break;
                case "执行":
                    if (instance.isOperator && checkContent()) {
                        approve("confirm");
                    }
                    break;
                case "已阅":
                    if(instance.isOperator){
                        approve("approve",4);
                    }
                    break;
                case "退回":
                    if (instance.isOperator) {
                        approve("sendBack", 3);
                    }
                    break;
                case "否决":
                    if (instance.isOperator) {
                        approve("reject", 2);
                    }
                    break;
                case "拟同意":
                    if (instance.isOperator && checkContent()) {
                        approve("approve", 1);
                    }
                    break;
                case "同意":
                    if (instance.isOperator && checkContent()) {
                        approve("approve", 0);
                    }
                    break;
                case "获取意见":
                    if (instance.isOperator && checkContent()) {
                        approve("getAdvice");
                    }
                    break;
                case "取消":
                    closeProcedure();
                    break;
            }
        });
    }

    //控制是否显示预览按钮在代码313行
    $("#preview").click(function () {
        if (!instance.isOperator || checkContent()) {
            preview();
        }
    });
}

/**
 * 审批控件初始化
 */
function initApproveInterface() {
    if (instance.type == "paymentApproveWomenUnion"){
        insertApproveInterface($("#adviceManagerArea"),"妇工委负责人意见：","adviceManager","timeAdviceManager","historyAdviceManager","managerControl");
    }else {
        insertApproveInterface($("#adviceManagerArea"),"委工会负责人意见：","adviceManager","timeAdviceManager","historyAdviceManager","managerControl");
    }
    if (instance.type == "keepLawCertificate"){
        insertApproveInterface($("#adviceSectionArea"),"拟办意见：","adviceSection","timeAdviceSection","historyAdviceSection","sectionControl");
    }else {
        insertApproveInterface($("#adviceSectionArea"),"科室意见：","adviceSection","timeAdviceSection","historyAdviceSection","sectionControl");
    }
    insertApproveInterface($("#adviceSectionFirstArea"),"科室意见(初审)：","adviceSectionFirst","timeAdviceSectionFirst","historyAdviceSectionFirst","sectionFirstControl");
    insertApproveInterface($("#advicePlanningSectionArea"),"计划科意见：","advicePlanningSection","timeAdvicePlanningSection","historyAdvicePlanningSection","planningSectionControl");
    insertApproveInterface($("#adviceExecutiveSectionArea"),"主任办公会意见：","adviceExecutiveSection","timeAdviceExecutiveSection","historyAdviceExecutiveSection","executiveSectionControl");
    insertApproveInterface($("#advicePartySectionArea"),"党委办意见：","advicePartySection","timeAdvicePartySection","historyAdvicePartySection","partySectionControl");
    if(instance.type == "documentCircularize2"){
        insertApproveInterface($("#adviceBranchLeaderArea"),"领导意见：","adviceBranchLeader","timeAdviceBranchLeader","historyAdviceBranchLeader","branchLeaderControl");
    }else {
        if (instance.type == "documentCircularize3") {
            insertApproveInterface($("#adviceBranchLeaderArea"), "审阅人意见：", "adviceBranchLeader", "timeAdviceBranchLeader", "historyAdviceBranchLeader", "branchLeaderControl");
        } else {
            insertApproveInterface($("#adviceBranchLeaderArea"), "分管领导意见：", "adviceBranchLeader", "timeAdviceBranchLeader", "historyAdviceBranchLeader", "branchLeaderControl");
        }
    }
    insertApproveInterface($("#adviceBranchLeaderFirstArea"),"分管领导意见(批示)：","adviceBranchLeaderFirst","timeAdviceBranchLeaderFirst","historyAdviceBranchLeaderFirst","branchLeaderFirstControl");
    insertApproveInterface($("#adviceMainLeaderArea"),"主要领导意见：","adviceMainLeader","timeAdviceMainLeader","historyAdviceMainLeader","mainLeaderControl");
    insertApproveInterface($("#adviceAdminMainLeaderArea"),"行政主要领导意见：","adviceAdminMainLeader","timeAdviceAdminMainLeader","historyAdviceAdminMainLeader","adminMainLeaderControl");
    insertApproveInterface($("#advicePartyMainLeaderArea"),"党工委书记意见：","advicePartyMainLeader","timeAdvicePartyMainLeader","historyAdvicePartyMainLeader","partyMainLeaderControl");
    insertApproveInterface($("#adviceApproveArea"),"审核意见：","adviceApprove","timeAdviceApprove","historyAdviceApprove","approveControl");
    insertApproveInterface($("#adviceExamineArea"),"核稿意见：","adviceExamine","timeAdviceExamine","historyAdviceExamine","examineControl");
    insertApproveInterface($("#adviceSignArea"),"签发意见：","adviceSign","timeAdviceSign","historyAdviceSign","signControl");
    insertApproveInterface($("#adviceReviewGroupArea"),"评审小组意见：","adviceReviewGroup","timeAdviceReviewGroup","historyAdviceReviewGroup","reviewGroupControl");
    insertApproveInterface($("#adviceLegalAdviserArea"),"法律顾问、投资监理意见：","adviceLegalAdviser","timeAdviceLegalAdviser","historyAdviceLegalAdviser","legalAdviserControl");
    insertApproveInterface($("#adviceLawSectionArea"),"法规科意见：","adviceLawSection","timeAdviceLawSection","historyAdviceLawSection","lawSectionControl");
    insertApproveInterface($("#adviceSecrecyBranchLeaderArea"),"保密领导意见：","adviceSecrecyBranchLeader","timeAdviceSecrecyBranchLeader","historyAdviceSecrecyBranchLeader","secrecyBranchLeaderControl");
    insertApproveInterface($("#adviceUnitManagerArea"),"单位负责人意见：","adviceUnitManager","timeAdviceUnitManager","historyAdviceUnitManager","unitManagerControl");
    insertApproveInterface($("#adviceOutUnitSArea"),"划出单位意见：","adviceOutUnitS","timeAdviceOutUnitS","historyAdviceOutUnitS","outUnitSControl");
    insertApproveInterface($("#adviceOutUnitMArea"),"划出单位主管部门意见：","adviceOutUnitM","timeAdviceOutUnitM","historyAdviceOutUnitM","outUnitMControl");
    insertApproveInterface($("#adviceGetUnitSArea"),"接收单位意见：","adviceGetUnitS","timeAdviceGetUnitS","historyAdviceGetUnitS","getUnitSControl");
    insertApproveInterface($("#adviceGetUnitMArea"),"接收单位主管部门意见：","adviceGetUnitM","timeAdviceGetUnitM","historyAdviceGetUnitM","getUnitMControl");
    insertApproveInterface($("#adviceOfficeRoomArea"),"办公室审批意见：","adviceOfficeRoom","timeAdviceOfficeRoom","historyAdviceOfficeRoom","officeRoomControl");
}

/**
 * 文件上传控件初始化
 */
function initUploadFileInterface() {
    var area = $("#attachmentArea");
    area.addClass("attachment");
    var controlArea = $("<div class='aControl'></div>").appendTo(area);
    controlArea.append("<div class='aControlTitle'>附件列表：</div>");
    if(instance.isOperator){
        controlArea.append("<div class='aControlFile'>" +
            "<a href='javascript:void(0);' class='aControlFileButton'>添加文件</a>" +
            "<input type='file' class='aControlFileInput' id='fileSelect' onchange='createAttachmentFile()'>" +
            "</div>");
        controlArea.append("<a href='javascript:void(0);' id='relateProcedure' class='aControlProcedure'>关联流程</a>");
        controlArea.append("<i id='hintFileList' class='special'></i>");
    }
    area.append("<table id='fileList' class='aContent'></table>");
    createExistFile();
}

function initOthers() {
    var textAreas = $("textarea");
    for(var i=0; i<textAreas.length; i++){
        var textarea = $(textAreas[i]);
        var width = textarea.width();
        textarea.width(width - 20);
    }
}

/**
 * 插入审批控件
 */
function insertApproveInterface(area, name, textID, timeID, historyID, controlID) {
    area.append(
        "<tr>" +
        "<td class='title'>" +
        name +
        "<span id='" + timeID + "'></span>" +
        "<button id='" + historyID + "'>H</button>" +
        "</td>"+
        "</tr>"+
        "<tr>"+
        "<td>"+
        "<div id='" + controlID + "'></div>" +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td align='center'>" +
        "<textarea id='" + textID + "' class='default'></textarea>" +
        "</td>" +
        "</tr>"
    );
}

/**
 * 获取可发起流程角色列表
 */
function getLaunchRole() {
    user.launchRoleList = [];
    for (var i = 0; i < user.roleList.length; i++) {
        canLaunch.forEach(function (value) {
            if(user.roleList[i].name.indexOf(value) > -1){
                if(value == "科长" && user.roleList[i].name.indexOf("财务科科长") > -1){
                }else{
                    user.launchRoleList.push(user.roleList[i]);
                }
            }
        });
    }
    user.launchRole = {};
    if (user.launchRoleList.length > 0) {
        user.launchRole.id = user.launchRoleList[0].id;
        user.launchRole.name = user.launchRoleList[0].name;
    }
}

/**
 * 插入控制面板
 */
function insertControlInterface() {
    var control = $("#control");
    var infoControl = $("<table style='width:100%'></table>").appendTo(control);
    var infoControlTr = $("<tr></tr>").appendTo(infoControl);
    infoControlTr.append("<td class='infoleft'>发起人：<span id='launcherName'></span></td>");
    infoControlTr.append("<td class='infocenter'>发起时间：<span id='launchTime'></span></td>");
    var centerControl = $("<table style='width:100%'></table>").appendTo(control);
    var centerControlTr = $("<tr></tr>").appendTo(centerControl);
    centerControlTr.append("<td id='showCurrentStep' class='inforight'>进行中：<span id='currentStep'></span></td>");
    centerControlTr.append("<td id='showNextStep' class='inforight'>下一步：<span id='nextStep'></span></td>");
    control.find("td").addClass("formLabel");
    control.find("span").addClass("formContent");
}

/**
 * 设置控制面板显示
 */
function setControlData() {}

/**
 * 初始化选择器
 * @param select
 * @param list
 * @param selected
 */
function initSelect(select,list,selected) {
    list.forEach(function (value) {
        select.append("<option value=" + value.id + ">" + value.name + "</option>");
    });
    selected && select.val(selected);
}

/**
 * 获取流程控制信息
 */
function getControl() {
    var controlInfo = {};
    controlInfo.section = isShowSectionSelect?$("#selectSection").val():undefined;
    controlInfo.branchLeader = isShowBranchSelect?$("#selectBranch").val():undefined;
    controlInfo.secrecyLeader = isShowSecrecySelect?$("#selectSecrecy").val():undefined;
    controlInfo.mainLeader = isShowMainSelect?$("#selectMain").val():undefined;
    controlInfo.sectionChief = isShowChiefSelect?$("#selectChief").val():undefined;
    controlInfo.companySuggestion = isShowCompanySuggestionSelect?$("#companySuggestion").val():undefined;
    controlInfo = getMoreControl(controlInfo);
    return controlInfo;
}

/**
 * 获取更多流程控制信息
 */
function getMoreControl(controlInfo) {return controlInfo;}

/**
 * 操作后的回调函
 */
function callBackOperate() {
    setTimeout("closeWindow()",3000);
    jAlert('系统提示：您的操作已成功，系统将在3秒后自动关闭页面。', '操作成功', function() {
        closeWindow();
    });
}

function closeWindow() {
    operationBack();
}

/**
 * 初始化科室审批
 * @param canSetTime
 * @param minTime
 */
function initSectionApproveControl(canSetTime, minTime) {
    var cAdvice = $("#adviceSection");
    var advice = adviceSection;
    var cHistory = $("#historyAdviceSection");
    var historyContent = historyAdviceSection;
    var cTime = "#timeAdviceSection";
    var setTime = timeAdviceSection;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 * 初始化科室审批(初审)
 * @param canSetTime
 * @param minTime
 */
function initSectionFirstApproveControl(canSetTime, minTime) {
    var cAdvice = $("#adviceSectionFirst");
    var advice = adviceSectionFirst;
    var cHistory = $("#historyAdviceSectionFirst");
    var historyContent = historyAdviceSectionFirst;
    var cTime = "#timeAdviceSectionFirst";
    var setTime = timeAdviceSectionFirst;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 * 初始化办公室审批
 * @param canSetTime
 * @param minTime
 */
function initOfficeRoomApproveControl(canSetTime, minTime) {
    var cAdvice = $("#adviceOfficeRoom");
    var advice = adviceOfficeRoom;
    var cHistory = $("#historyAdviceOfficeRoom");
    var historyContent = historyAdviceOfficeRoom;
    var cTime = "#timeAdviceOfficeRoom";
    var setTime = timeAdviceOfficeRoom;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 * 初始化负责人审批
 * @param canSetTime
 * @param minTime
 */
function initManagerApproveControl(canSetTime, minTime) {
    var cAdvice = $("#adviceManager");
    var advice = adviceManager;
    var cHistory = $("#historyAdviceManager");
    var historyContent = historyAdviceManager;
    var cTime = "#timeAdviceManager";
    var setTime = timeAdviceManager;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 * 初始化计划科室审批
 * @param canSetTime
 * @param minTime
 */
function initPlaningSectionApproveControl(canSetTime, minTime) {
    var cAdvice = $("#advicePlanningSection");
    var advice = advicePlanningSection;
    var cHistory = $("#historyAdvicePlanningSection");
    var historyContent = historyAdvicePlanningSection;
    var cTime = "#timeAdvicePlanningSection";
    var setTime = timeAdvicePlanningSection;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 * 初始化主任办公室审批
 * @param canSetTime
 * @param minTime
 */
function initExecutiveSectionApproveControl(canSetTime, minTime) {
    var cAdvice = $("#adviceExecutiveSection");
    var advice = adviceExecutiveSection;
    var cHistory = $("#historyAdviceExecutiveSection");
    var historyContent = historyAdviceExecutiveSection;
    var cTime = "#timeAdviceExecutiveSection";
    var setTime = timeAdviceExecutiveSection;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 * 初始化党委办审批
 * @param canSetTime
 * @param minTime
 */
function initPartySectionApproveControl(canSetTime, minTime) {
    var cAdvice = $("#advicePartySection");
    var advice = advicePartySection;
    var cHistory = $("#historyAdvicePartySection");
    var historyContent = historyAdvicePartySection;
    var cTime = "#timeAdvicePartySection";
    var setTime = timeAdvicePartySection;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 * 初始化分管领导审批
 * @param canSetTime
 * @param minTime
 */
function initBranchApproveControl(canSetTime, minTime) {
    var cAdvice = $("#adviceBranchLeader");
    var advice = adviceBranchLeader;
    var cHistory = $("#historyAdviceBranchLeader");
    var historyContent = historyAdviceBranchLeader;
    var cTime = "#timeAdviceBranchLeader";
    var setTime = timeAdviceBranchLeader;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 * 初始化分管领导审批(审核)
 * @param canSetTime
 * @param minTime
 */
function initBranchFirstApproveControl(canSetTime, minTime) {
    var cAdvice = $("#adviceBranchLeaderFirst");
    var advice = adviceBranchLeaderFirst;
    var cHistory = $("#historyAdviceBranchLeaderFirst");
    var historyContent = historyAdviceBranchLeaderFirst;
    var cTime = "#timeAdviceBranchLeaderFirst";
    var setTime = timeAdviceBranchLeaderFirst;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 * 初始化主要领导审批
 * @param canSetTime
 * @param minTime
 */
function initMainApproveControl(canSetTime, minTime) {
    var cAdvice = $("#adviceMainLeader");
    var advice = adviceMainLeader;
    var cHistory = $("#historyAdviceMainLeader");
    var historyContent = historyAdviceMainLeader;
    var cTime = "#timeAdviceMainLeader";
    var setTime = timeAdviceMainLeader;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 * 初始化行政主要领导审批
 * @param canSetTime
 * @param minTime
 */
function initAdminMainApproveControl(canSetTime, minTime) {
    var cAdvice = $("#adviceAdminMainLeader");
    var advice = adviceAdminMainLeader;
    var cHistory = $("#historyAdviceAdminMainLeader");
    var historyContent = historyAdviceAdminMainLeader;
    var cTime = "#timeAdviceAdminMainLeader";
    var setTime = timeAdviceAdminMainLeader;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 * 初始化党工委书记审批
 * @param canSetTime
 * @param minTime
 */
function initPartyMainApproveControl(canSetTime, minTime) {
    var cAdvice = $("#advicePartyMainLeader");
    var advice = advicePartyMainLeader;
    var cHistory = $("#historyAdvicePartyMainLeader");
    var historyContent = historyAdvicePartyMainLeader;
    var cTime = "#timeAdvicePartyMainLeader";
    var setTime = timeAdvicePartyMainLeader;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 * 初始化审批人领导审批
 * @param canSetTime
 * @param minTime
 */
function initApproveApproveControl(canSetTime, minTime) {
    var cAdvice = $("#adviceApprove");
    var advice = adviceApprove;
    var cHistory = $("#historyAdviceApprove");
    var historyContent = historyAdviceApprove;
    var cTime = "#timeAdviceApprove";
    var setTime = timeAdviceApprove;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 * 初始化核稿人审批
 * @param canSetTime
 * @param minTime
 */
function initExamineApproveControl(canSetTime, minTime) {
    var cAdvice = $("#adviceExamine");
    var advice = adviceExamine;
    var cHistory = $("#historyAdviceExamine");
    var historyContent = historyAdviceExamine;
    var cTime = "#timeAdviceExamine";
    var setTime = timeAdviceExamine;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 * 初始化签发人审批
 * @param canSetTime
 * @param minTime
 */
function initSignApproveControl(canSetTime, minTime) {
    var cAdvice = $("#adviceSign");
    var advice = adviceSign;
    var cHistory = $("#historyAdviceSign");
    var historyContent = historyAdviceSign;
    var cTime = "#timeAdviceSign";
    var setTime = timeAdviceSign;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 * 初始化审批小组审批
 * @param canSetTime
 * @param minTime
 */
function initReviewGroupApproveControl(canSetTime, minTime) {
    var cAdvice = $("#adviceReviewGroup");
    var advice = adviceReviewGroup;
    var cHistory = $("#historyAdviceReviewGroup");
    var historyContent = historyAdviceReviewGroup;
    var cTime = "#timeAdviceReviewGroup";
    var setTime = timeAdviceReviewGroup;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 * 初始化法律顾问审批
 * @param canSetTime
 * @param minTime
 */
function initLegalAdviserApproveControl(canSetTime, minTime) {
    var cAdvice = $("#adviceLegalAdviser");
    var advice = adviceLegalAdviser;
    var cHistory = $("#historyAdviceLegalAdviser");
    var historyContent = historyAdviceLegalAdviser;
    var cTime = "#timeAdviceLegalAdviser";
    var setTime = timeAdviceLegalAdviser;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 * 初始化法规科审批
 * @param canSetTime
 * @param minTime
 */
function initLawSectionApproveControl(canSetTime, minTime) {
    var cAdvice = $("#adviceLawSection");
    var advice = adviceLawSection;
    var cHistory = $("#historyAdviceLawSection");
    var historyContent = historyAdviceLawSection;
    var cTime = "#timeAdviceLawSection";
    var setTime = timeAdviceLawSection;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 * 初始化保密领导审批
 * @param canSetTime
 * @param minTime
 */
function initSecrecyBranchApproveControl(canSetTime, minTime) {
    var cAdvice = $("#adviceSecrecyBranchLeader");
    var advice = adviceSecrecyBranchLeader;
    var cHistory = $("#historyAdviceSecrecyBranchLeader");
    var historyContent = historyAdviceSecrecyBranchLeader;
    var cTime = "#timeAdviceSecrecyBranchLeader";
    var setTime = timeAdviceSecrecyBranchLeader;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 * 初始化单位负责人审批
 * @param canSetTime
 * @param minTime
 */
function initUnitManagerApproveControl(canSetTime, minTime) {
    var cAdvice = $("#adviceUnitManager");
    var advice = adviceUnitManager;
    var cHistory = $("#historyAdviceUnitManager");
    var historyContent = historyAdviceUnitManager;
    var cTime = "#timeAdviceUnitManager";
    var setTime = timeAdviceUnitManager;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 *
 * @param canSetTime
 * @param minTime
 */
function initOutUnitSApproveControl(canSetTime, minTime) {
    var cAdvice = $("#adviceOutUnitS");
    var advice = adviceOutUnitS;
    var cHistory = $("#historyAdviceOutUnitS");
    var historyContent = historyAdviceOutUnitS;
    var cTime = "#timeAdviceOutUnitS";
    var setTime = timeAdviceOutUnitS;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 *
 * @param canSetTime
 * @param minTime
 */
function initOutUnitMApproveControl(canSetTime, minTime) {
    var cAdvice = $("#adviceOutUnitM");
    var advice = adviceOutUnitM;
    var cHistory = $("#historyAdviceOutUnitM");
    var historyContent = historyAdviceOutUnitM;
    var cTime = "#timeAdviceOutUnitM";
    var setTime = timeAdviceOutUnitM;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 *
 * @param canSetTime
 * @param minTime
 */
function initGetUnitSApproveControl(canSetTime, minTime) {
    var cAdvice = $("#adviceGetUnitS");
    var advice = adviceGetUnitS;
    var cHistory = $("#historyAdviceGetUnitS");
    var historyContent = historyAdviceGetUnitS;
    var cTime = "#timeAdviceGetUnitS";
    var setTime = timeAdviceGetUnitS;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 *
 * @param canSetTime
 * @param minTime
 */
function initGetUnitMApproveControl(canSetTime, minTime) {
    var cAdvice = $("#adviceGetUnitM");
    var advice = adviceGetUnitM;
    var cHistory = $("#historyAdviceGetUnitM");
    var historyContent = historyAdviceGetUnitM;
    var cTime = "#timeAdviceGetUnitM";
    var setTime = timeAdviceGetUnitM;
    canSetTime = instance.isOperator && canSetTime;
    initApproveControl(cAdvice,advice,cHistory,historyContent,canSetTime,cTime,minTime,setTime);
}

/**
 * 初始化审批控件
 */
function initApproveControl(cAdvice, advice, cHistory, historyContent, canSetTime, cTime, minTime, setTime) {
    cAdvice.val(advice);
    cHistory.click(function () {
        dialog(historyContent);
    });
    historyContent || cHistory.css("display","none");
    if(canSetTime){
        $(cTime).css("display","inline");
        if(!minTime){
            minTime = "2000-01-01";
        }
        laydate.render({
            elem: cTime,
            showBottom: false,
            max: 0,
            min: minTime,
            value: new Date().Format()
        });
        cAdvice.attr("readonly",false);
        var width = cAdvice.width();
        cAdvice.removeClass("disable");
        cAdvice.addClass("default");
        cAdvice.width(width);
    }else{
        if(setTime){
            $(cTime).html(setTime);
        }else{
            $(cTime).css("display","none");
        }
        cAdvice.attr("readonly",true);
        var width = cAdvice.width();
        cAdvice.removeClass("default");
        cAdvice.addClass("disable");
        cAdvice.width(width);
    }
}

/**
 * 历史记录显示框
 * @param text
 */
function dialog(text) {
    //获取页面的高度和宽度,可视区域高度

    var sWidth = document.documentElement.scrollWidth>document.body.scrollWidth?document.documentElement.scrollWidth:document.body.scrollWidth;
    var sHeight = document.documentElement.scrollHeight>document.body.scrollHeight?document.documentElement.scrollHeight:document.body.scrollHeight;
    var wHeight = document.documentElement.clientHeight>document.body.clientHeight?document.documentElement.clientHeight:document.body.clientHeight;
    //创建遮罩层
    var oMask = document.createElement("div");
    oMask.id = "maskHistory";
    oMask.style.height = sHeight + "px";
    oMask.style.width = sWidth + "px";
    document.body.appendChild(oMask);
    //创建显示框
    var oShow = document.createElement("div");
    oShow.id = "showHistory";
    oShow.innerHTML =
        "<div class='showCon'>" +
        "<div id='historyTitle'>历史记录</div>" +
        "<textarea id='historyInfo' readonly></textarea>" +
        "</div>";
    document.body.appendChild(oShow);
    $("#historyInfo").html(text);
    var dHeight = oShow.offsetHeight;
    var dWidth = oShow.offsetWidth;
    oShow.style.left = sWidth / 2 - dWidth / 2 + "px";
    oShow.style.top = wHeight / 2 - dHeight / 2 + "px";
    //点击显示框以外的区域都可以关闭显示框
    oMask.onclick = function () {
        document.body.removeChild(oShow);
        document.body.removeChild(oMask);
    };
}

/**
 * 获取发起部门
 * @param userRole
 * @returns {*}
 */
function getUserSection(userRole) {
    if(userRole.indexOf("办公室主任") > -1){
        return userRole.substring(0, userRole.length - 5);
    } else if (userRole.indexOf("财务科科长") > -1) {
        return userRole.substring(0, userRole.length - 5);
    } else if (userRole.indexOf("科长") > -1 || userRole.indexOf("科员") > -1) {
        return userRole.substring(0, userRole.length - 2);
    } else if (userRole.indexOf("负责人") > -1) {
        return userRole.substring(0, userRole.length - 3);
    } else if (userRole.indexOf("领导") > -1) {
        return "领导";
    } else if (userRole.indexOf("文件传阅发起人" ) > -1){
        return "行政办";
    } else if (userRole.indexOf("转发会议通知发起人" ) > -1){
        return "行政办";
    } else if (userRole.indexOf("计划科八项规定发起人" ) > -1){
        return "计划科";
    } else if (userRole.indexOf("付款审批单(妇工委)发起人" ) > -1){
        return "妇工委";
    } else if (userRole.indexOf("付款审批单(团委)发起人" ) > -1){
        return "团委";
    } else if (userRole.indexOf("付款审批单(机关工会)发起人" ) > -1){
        return "机关工会";
    } else if (userRole.indexOf("付款审批单(委工会)发起人" ) > -1){
        return "委工会";
    } else if (userRole.indexOf("发起人(联席办)") > -1) {
        return "联席办";
    }else{
        return "其他";
    }
}
//******************************************************************************************//
//**************************以下为获取服务器方法************************************************//
//******************************************************************************************//

/**
 * 获取流程数据
 */
function getApproveData() {
    var data = {
        instanceID: instance.id,
        instanceType: instance.type
    };
    var callBack = function (data) {
        instance.launcherName = data.startUser;
        instance.launcherID = data.startUserId;
        instance.launcherSection = data.startUserSection;
        instance.launcherSectionID = data.launchRole;
        instance.launchTime = data.startDate;
        instance.isOperator = !data.readOnly;
        instance.currentStep = data.currentStep;
        instance.sendBackToList = [];
        instance.status = data.status;
        if(data.returnList){
            var sendListCount = 1;
            data.returnList.forEach(function (value) {
                var element = {};
                element.id = sendListCount++;
                element.name = value;
                instance.sendBackToList.push(element);
            });
        }
        instance.content = data.content;
        getContentData(data.content);
    };
    connectToServer("GET","/ws/process/detail",data,false,callBack);
}

/**
 * 获取组织人事科科长
 */
function getCompanySuggestion() {
    control.companySuggestionList = [];
    var cCompanySuggestion = instance.content.content;
    if (cCompanySuggestion){
        for (var i = 0; i < cCompanySuggestion.length; i++){
            var newOption = {};
            newOption.id = cCompanySuggestion[i].companyName;
            newOption.name = cCompanySuggestion[i].companyName;
            control.companySuggestionList.push(newOption);
        }
    }
    control.companySuggestion = control.companySuggestionList[0].id;
}

/**
 * 获取组织人事科科长
 */
function getChief() {
    control.chiefList = [{id:"016",name:"瞿志红"},{id:"015",name:"姜小静"}];
    control.chief = control.chiefList[0].id;
}

/**
 * 获取部门
 */
function getDepartment() {
    var data = {
        instanceType: instance.type
    };
    var callBack = function (data) {
        control.departmentList = data.all;
        control.department = data.personality?data.personality:control.departmentList[0].id;
    };
    connectToServer("GET","/ws/user/personality/subunit",data,false,callBack);
}

/**
 * 获取业务科室
 */
function getSection() {
    var data = {
        instanceType: instance.type
    };
    var callBack = function (data) {
        control.sectionList = data.all;
        control.section = data.personality?data.personality:control.sectionList[0].id;
    };
    connectToServer("GET","/ws/user/personality/unit",data,false,callBack);
}

/**
 * 获取分管领导
 */
function getBranchLeader() {
    var data = {
        instanceType: instance.type
    };
    var callBack = function (data) {
        control.branchList = data.all;
        control.branch = data.personality?data.personality:control.branchList[0].id;
    };
    connectToServer("GET","/ws/user/personality/branchleader",data,false,callBack);
}

/**
 * 获取保密领导
 */
function getSecrecy() {
    var data = {
        instanceType: instance.type
    };
    var callBack = function (data) {
        control.secrecyList = data.all;
        control.secrecy = data.personality?data.personality:control.secrecyList[0].id;
    };
    connectToServer("GET","/ws/user/personality/branchleader",data,false,callBack);
}

/**
 * 获取主要领导
 */
function getMainLeader() {  
    var data = {
        instanceType: instance.type
    };
    var callBack = function (data) {
        control.mainList = data.all;
        control.main = data.personality?data.personality:control.mainList[0].id;
    };
    connectToServer("GET","/ws/user/personality/mainleader",data,false,callBack);
}

/**
 * 文档预览
 */
function preview() {
    var data = {
        instanceID: instance.id,
        instanceType: instance.type,
        content: instance.isOperator?JSON.stringify(forPreview(getContent())):undefined
    };
    var callBack = function (data) {
        var view = document.createElement("div");
        view.id = "viewer";
        document.body.appendChild(view);
        var pdfView = document.createElement("iframe");
        pdfView.src = "../../js/extend/showPDF/generic/web/viewer.html?file=" + urlFileBase + data.pdf;
        pdfView.style.height = document.documentElement.clientHeight + "px";
        pdfView.style.width = document.documentElement.clientWidth + "px";
        view.append(pdfView);
        var backPDF = document.createElement("div");
        backPDF.id = "backPDF";
        document.body.appendChild(backPDF);
        $("#backPDF").append("<a href='javascript:;' onClick='closePDF()'><img src='../../resources/images/app/close.png' border='0' title='关闭'></a>");
    };
    connectToServer("POST","/ws/document/instance/preview",data,false,callBack);
}

function forPreview(content) {
    for(var key in content){
        if(key.indexOf("signature") > -1) {
            if(content[key] == user.id ){
                delete content[key];
                var name = key.split("signature")[1];
                delete content["timeAdvice"+name];
            }
        }
    }
    return content;
}

function readFile(filePath) {
    var view = document.createElement("div");
    view.id = "viewer";
    document.body.appendChild(view);
    var pdfView = document.createElement("iframe");
    pdfView.src = "../../js/extend/showPDF/generic/web/viewer.html?file=" + filePath;
    pdfView.style.height = document.documentElement.clientHeight + "px";
    pdfView.style.width = document.documentElement.clientWidth + "px";
    view.append(pdfView);
    var backPDF = document.createElement("div");
    backPDF.id = "backPDF";
    document.body.appendChild(backPDF);
    $("#backPDF").append("<a href='javascript:;' onClick='closePDF()'><img src='../../resources/images/app/close.png' border='0' title='关闭'></a>");
}

function closePDF() {
    $("#viewer").remove();
    $("#backPDF").remove();
    // document.body.remove($("#backPDF"));
}

/**
 * 流程保存
 */
function save() {
    var controlInfo = getControl();
    controlInfo.operate = "save";
    var data = {
        userType: user.launchRole.id,
        userSection: instance.launcherSection,
        instanceID: instance.id,
        instanceType: instance.type,
        control: JSON.stringify(controlInfo),
        content: JSON.stringify(getContent())
    };
    connectToServer("POST","/ws/process/user/save",data,false,callBackOperate);
}

/**
 * 流程发起
 */
function launch() {
    var controlInfo = getControl();
    controlInfo.operate = "launch";
    var data = {
        userType: user.launchRole.id,
        userSection: instance.launcherSection,
        instanceID: instance.id,
        instanceType: instance.type,
        control: JSON.stringify(controlInfo),
        content: JSON.stringify(getContent())
    };
    var cookie = getCookieValue();
    isRememberApprove();
    if(cookie.approvePS && isRemember){
        connectToServer("POST","/ws/process/user/launch",data,false,callBackOperate,true);
    }else{
        jPrompt('请输入审批密码:', '', '审批权限', function(r) {
            if(r!=null){
                addCookie("approvePS",r,0.5);
                connectToServer("POST","/ws/process/user/launch",data,false,callBackOperate,true);
            }
        });
    }
}

/**
 * 流程审批
 */
function approve(operateType,agree) {
    var controlInfo = getControl();
    controlInfo.operate = operateType;
    if(operateType == "sendBack"){
        controlInfo.sendBackTo = $("#sendBackTo").find("option:selected").text();
    }
    var content = getContent();
    for(var name in content){
        if(name.indexOf("advice") > -1){
            if(content[name] == ""){
                switch (agree){
                    case 0:
                        content[name] = "同意";
                        break;
                    case 1:
                        content[name] = "拟同意";
                        break;
                    case 2:
                        content[name] = "否决";
                        break;
                    case 3:
                        content[name] = "退回";
                        break;
                    case 4:
                        content[name] = "已阅";
                        break;
                }
            }
        }else if(name.indexOf("signature") > -1){
            if(operateType == "sendBack" || operateType == "reject"){
                content[name] = undefined;
            }
        }else if(name.indexOf("timeAdvice") > -1){
            if(operateType == "sendBack" || operateType == "reject"){
                content[name] = undefined;
            }
        }
    }
    var data = {
        instanceID: instance.id,
        control: JSON.stringify(controlInfo),
        content: JSON.stringify(content)
    };
    var cookie = getCookieValue();
    isRememberApprove();
    if(cookie.approvePS && isRemember){
        connectToServer("POST","/ws/process/user/approve",data,false,callBackOperate,true);
    }else{
        jPrompt('请输入审批密码:', '', '审批权限', function(r) {
            if(r!=null){
                addCookie("approvePS",r,0.5);
                connectToServer("POST","/ws/process/user/approve",data,false,callBackOperate,true);
            }
        });
    }
}

/**
 * 流程关闭
 */
function closeProcedure() {
    var controlInfo = getControl();
    controlInfo.operate = "close";
    var data = {
        instanceID: instance.id,
        instanceType: instance.type,
        control: JSON.stringify(controlInfo)
    };
    var cookie = getCookieValue();
    isRememberApprove();
    if(cookie.approvePS && isRemember){
        connectToServer("POST","/ws/process/user/close",data,false,callBackOperate,true);
    }else{
        jPrompt('请输入审批密码:', '', '审批权限', function(r) {
            if(r!=null){
                addCookie("approvePS",r,0.25);
                connectToServer("POST","/ws/process/user/close",data,false,callBackOperate,true);
            }
        });
    }
}

/**
 * 获取历史记录
 * @param callback
 */
function getHistory(callback) {
    var data = {
        instanceID: instance.id
    };
    connectToServer("GET","/ws/user/list",data,false,callback);
}

/**
 * 获取人员列表
 * @param callback
 */
function getPersonList(callback) {
    var data = {};
    connectToServer("GET","/ws/user/list",data,false,callback);
}

/**
 * 获取角色列表
 * @param callback
 */
function getRoleList(callback) {
    var data = {};
    connectToServer("GET","/ws/user/list/role/all",data,false,callback);
}

function  getDepartmentList(callback) {
    var data = {};
    connectToServer("GET","/ws/user/personality/subunit",data,false,callback);
}

/**
 * 判断是否在审批密码持续时间内
 */
function isRememberApprove() {
    var data = {};
    var callback = function (data) {
        if(!data.invalid){
            var cookie = getCookieValue();
            addCookie("approvePS",cookie.approvePS,0.5);
            isRemember = true;
        }else{
            isRemember = false;
        }
    };
    connectToServer("GET","/ws/user/password/approve/status",data,false,callback);
}

/**
 *插入返回控件
*/
function insertBackInterface(area) {
    area.append(
        '<a class="backIcon" href="javascript:;" onClick="operationBack()"><img src="../../resources/images/app/close.png" border="0" title="返回上一页"></a>'
    )
}

/**
 *页面退回
 */
function operationBack() {
    var index = localStorage.getItem("nowIndex");
    switch (index){
        case "0":
            window.location.href="../index/workClassify.html";
            break;
        case "1":
            window.location.href="../index/indexInfo.html";
            break;
        case "2":
            window.location.href="../index/indexInfo.html";
            break;
        case "3":
            window.location.href="../index/meetingPerson.html";
            break;
        default:
            break;
    }
}

function addMoreControlOperate() {

}

function accAdd(arg1,arg2){
    var r1,r2,m;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    return (arg1*m+arg2*m)/m
}

function accSub(arg1,arg2){
    var r1,r2,m;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m=Math.pow(10,Math.max(r1,r2));
    return (arg1*m-arg2*m)/m
}