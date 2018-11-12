/**
 * Created by Revan on 2017/8/18.
 */

function testCase01() {
    showTestResult("------------------------------------------------------------------------------------------");
    showTestResult("会议纪要流程测试");
    showTestResult("------------------------------------------------------------------------------------------");
    var caseCount = 25;
    for(var i=1; i<=caseCount; i++){
        var caseID = "testCase02"+((i < 10)?('0' + i):i);
        var testCase = eval(caseID);
        testCase();
    }
}

/**
 * 初始化数据
 */
function InitMeetingSummary() {
    instanceID = null;
    instanceType = "meetingSummary";
    control = {};
    content = {};
}

function launch02(user, classify) {
    if(classify){
        testTask([user],classify);
        testGetData(user);
    }
    if(classify && classify == "被退回"){
        content.approveList = content.returnList;
    }else{
        content.meetingTimeFrom = new Date().toLocaleTimeString();
        content.meetingTimeTo = new Date().toLocaleTimeString();
        content.meetingName = "会议" + new Date().getTime();
        content.meetingRoom = "房间" + new Date().getTime();
        content.attendList = [chiefOne.id,branchOne.id,branchTwo.id,mainOne.id];
        content.observeList = [chiefTwo.id,mainTwo.id];
        content.approveList = content.attendList.concat(content.observeList);
        content.absentList = [chiefThree.id,branchThree.id];
    }

}

function approve02(user){
    testTask([user],"待审批");
    testGetData(user);
}