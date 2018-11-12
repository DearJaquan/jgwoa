/**
 * Created by feijiahui on 2017/11/1.
 */

/*初始控件*/
var user = getUserInfo();
var instanceList;
var searchPageNumber = 1;//查询页面
var pageSize = 6; //分页
var isOver = 1; //是否还有内容未加载

$(document).ready(function() {
    $('#table').BlocksIt({
        numOfCol: 1,
        offsetX: 0,
        offsetY: 3
    });
});

$(window).scroll(function(){
    if(isOver == 1){
        // 当滚动到最底部以上50像素时， 加载新内容
        if ($(document).height() - $(this).scrollTop() - $(this).height()<50){
            searchPageNumber +=1;
            searchInstanceFunc(searchPageNumber);
            $('#container').BlocksIt({
                numOfCol:1,
                offsetX: 0,
                offsetY: 3
            });
        }
    }
});

//页面初始化
window.onload = function init() {
    var condition_a = $("#condition_a");
    condition_a.empty();
    condition_a.append('<li onclick="conditiona(this)"><div><label>发&nbsp;起&nbsp;日&nbsp;期：</label><input class="dateinput" type="text"  placeholder="开始时间"  id="startTime"><span class="line">-</span><input class="dateinput" type="text"  placeholder="结束时间"  id="endTime"></div></li>');
    condition_a.append('<li onclick="conditiona(this)"><div><label>发&nbsp;起&nbsp;部&nbsp;门：</label><label><select id="depart" class="default"></select></label></div></li>');
    condition_a.append('<li onclick="conditiona(this)"><div><label>审&nbsp;批&nbsp;状&nbsp;态：</label><label><select id="status" class="default"><option value="all">全部</option><option value="0">进行中</option><option value="3">已完成</option><option value="2">被否决</option><option value="4">已关闭</option></select></label></div></li>');
    initDate("startTime","endTime");
    initUnitList();
    initInstanceList();
    var index = localStorage.getItem("nowIndex");
    if (index == "1"){
        var lastSearch = JSON.parse(localStorage.getItem("searchData"));
        if(lastSearch.instanceType){
            searchInstance(lastSearch.instanceType,lastSearch.startTime,lastSearch.endTime ,lastSearch.status,lastSearch.department,lastSearch.related,lastSearch.query,lastSearch.pageNumber,lastSearch.pageSize);
            $("#instanceName").val(lastSearch.instanceType);
            $("#startTime").val(lastSearch.startTime);
            $("#endTime").val(lastSearch.endTime);
            $("#status").val(lastSearch.status);
            $("#depart").val(lastSearch.department);
            $("#related").val(lastSearch.related);
        }
    }
    // alert(lastSearch);
};

function screening(){
    if ($('.condition').hasClass('grade-w-roll')) {
        $('.condition').removeClass('grade-w-roll');
    } else {
        $('.condition').addClass('grade-w-roll');
    }
}

//js点击事件监听开始

function conditiona(wbj){
    var arr = document.getElementById("condition_a").getElementsByTagName("li");
    for (var i = 0; i < arr.length; i++){
        var a = arr[i];
        a.style.background = "";
    }
    wbj.style.background = "#eee";
}



//流程查询时间控件
function initDate(from,to) {
    var cEndTime = $("#" + to);
    laydate.render({
        elem: '#' + from,
        //showBottom: false,
        max: 0,
        done: function (value, date) {
            changeMinTime(cEndTime, date);
        }
    });
    var cEndTime = laydate.render({
        elem: '#' + to,
        //showBottom: false,
        max: 0
    });
}

/**
 * 获得部门名称
 */
function initUnitList() {
    var data = {};
    //关联发起回调函数
    var callBackGetUnitList = function (data) {
        var cDepart = $("#depart");
        cDepart.append('<option value="all" selected>全部</option>');
        cDepart.append('<option value="person">领导</option>');
        for (var i = 0; i < data.length; i++) {
            if(data[i]!="领导"){
                cDepart.append("<option value=" + data[i] + ">" + data[i] + "</option>");
            }
        }
    };
    connectToServer("GET","/ws/user/list/receiveUnit",data,false,callBackGetUnitList);
}

//根据流程类型生成内部查询条件
function changeQueryCriteria(){
    var instanceType = $("#instanceName").find("option:selected").val();
    var condition_a = $("#condition_a");
    condition_a.empty();
    condition_a.append('<li onclick="conditiona(this)"><div><label>发&nbsp;起&nbsp;日&nbsp;期：</label><input class="dateinput" type="text"  placeholder="开始时间"  id="startTime"><span class="line">-</span><input class="dateinput" type="text"  placeholder="结束时间"  id="endTime"></div></li>');
    condition_a.append('<li onclick="conditiona(this)"><div><label>发&nbsp;起&nbsp;部&nbsp;门：</label><label><select class="default" id="depart"></select></label></div></li>');
    initDate("startTime","endTime");
    initUnitList();
    condition_a.append('<li onclick="conditiona(this)"><div><label>审&nbsp;批&nbsp;状&nbsp;态：</label><label><select class="default" id="status"><option value="all">全部</option><option value="0">进行中</option><option value="3">已完成</option><option value="2">被否决</option><option value="4">已关闭</option></select></label></div></li>');
    switch(instanceType.replace(/\d+/g,'')){
        case "documentCircularize":
            condition_a.append('<li onclick="conditiona(this)"><div ><label>文&nbsp;件&nbsp;标&nbsp;题：</label><input type="text" id="fileTitle" class="dfinput" /></div></li>');
            break;
        case "financeBillDestroy":
            condition_a.append('<li onclick="conditiona(this)"><div ><label>领&nbsp;购&nbsp;证&nbsp;号：</label><input class="dfinput" id="billLicenseNumber" /></div></li>');
            break;
        case "projectFundsWithdrawal":
        case "projectAppropriationReview":
        case "projectBudgetApplication":
            condition_a.append('<li onclick="conditiona(this)"><div><label>项&nbsp;目&nbsp;名&nbsp;称：</label><input class="dfinput" id="projectName" /></div></li>');
            break;
        case "contractReview":
        case "contractApprove":
            condition_a.append('<li onclick="conditiona(this)"><div><label>项&nbsp;目&nbsp;名&nbsp;称：</label><input class="dfinput" id="projectName" /></div></li>');
            condition_a.append('<li onclick="conditiona(this)"><div><label>合&nbsp;同&nbsp;编&nbsp;号：</label><input class="dfinput" id="contractNumber" /></div></li>');
            break;
        case "projectPreview":
            condition_a.append('<li onclick="conditiona(this)"><div><label>项&nbsp;目&nbsp;名&nbsp;称：</label><input class="dfinput" id="projectName" /></div></li>');
            condition_a.append('<li onclick="conditiona(this)"><div><label>项&nbsp;目&nbsp;编&nbsp;号：</label><input class="dfinput" id="projectNumber" /></div></li>');
            break;
        case "governmentInformation":
            condition_a.append('<li onclick="conditiona(this)"><div><label>申&nbsp;请&nbsp;编&nbsp;号：</label><input class="dfinput" id="applicationNum" /></div></li>');
            condition_a.append('<li onclick="conditiona(this)"><div><label>登&nbsp;记&nbsp;日&nbsp;期：</label><input class="dateinput" type="text"  placeholder="开始时间"  id="from"><span>-</span><input class="dateinput" type="text"  placeholder="结束时间"  id="to"></div></li>');
            condition_a.append('<li onclick="conditiona(this)"><div><label>申&nbsp;&nbsp;&nbsp;请&nbsp;&nbsp;&nbsp;人：</label><input class="dfinput" id="proposer" /></div></li>');
            break;
        case "informationSubmissionExamination":
            condition_a.append('<li onclick="conditiona(this)"><div><label>发&nbsp;文&nbsp;日&nbsp;期：</label><input class="dateinput" type="text"  placeholder="开始时间"  id="from"><span>-</span><input class="dateinput" type="text"  placeholder="结束时间"  id="to"></div></li>');
            break;
        case "sealCirculation":
            condition_a.append('<li onclick="conditiona(this)"><div><label>文&nbsp;件&nbsp;名&nbsp;称：</label><input class="dfinput" id="fileName" /></div></li>');
            break;
        case "dispatchDocumentUnion":
        case "dispatchDocument":
            condition_a.append('<li onclick="conditiona(this)"><div><label>标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;题：</label><input class="dfinput" id="title" /></div></li>');
            break;
        case "meetingSummary":
            condition_a.append('<li onclick="conditiona(this)"><div><label>会&nbsp;议&nbsp;名&nbsp;称：</label><input class="dfinput" id="meetingName" /></div></li>');
            break;
        case "theTIOGMatterApply":
        case "theTIOGMatterExecution":
            condition_a.append('<li onclick="conditiona(this)"><div><label>事&nbsp;项&nbsp;名&nbsp;称：</label><input class="dfinput" id="itemName" /></div></li>');
            break;
        case "restaurantReception":
            condition_a.append('<li onclick="conditiona(this)"><div><label>是否被关联：</label><label><select class="default" id="related"><option value="all"></option><option value="1">是</option><option value="0">否</option></select></label></div></li>');
            condition_a.append('<li onclick="conditiona(this)"><div><label>申&nbsp;&nbsp;&nbsp;请&nbsp;&nbsp;&nbsp;人：</label><input class="dfinput" id="transactor" /></div></li>');
            condition_a.append('<li onclick="conditiona(this)"><div><label>用&nbsp;餐&nbsp;时&nbsp;间：</label><input class="dateinput" type="text"  placeholder="开始时间"  id="from"><span>-</span><input class="dateinput" type="text"  placeholder="结束时间"  id="to"></div></li>');
            break;
        case "meetingCostGather":
            condition_a.append('<li onclick="conditiona(this)"><div><label>是否被关联：</label><label><select class="default" id="related"><option value="all"></option><option value="1">是</option><option value="0">否</option></select></label></div></li>');
            condition_a.append('<li onclick="conditiona(this)"><div><label>会&nbsp;议&nbsp;时&nbsp;间：</label><input class="dateinput" type="text"  placeholder="开始时间"  id="from"><span>-</span><input class="dateinput" type="text"  placeholder="结束时间"  id="to"></div></li>');
            break;
        case "publicAffairsAndVehicleApplication":
            condition_a.append('<li onclick="conditiona(this)"><div><label>是否被关联：</label><label><select class="default" id="related"><option value="all"></option><option value="1">是</option><option value="0">否</option></select></label></div></li>');
            condition_a.append('<li onclick="conditiona(this)"><div><label>出&nbsp;行&nbsp;时&nbsp;间：</label><input class="dateinput" type="text"  placeholder="开始时间"  id="from"><span>-</span><input class="dateinput" type="text"  placeholder="结束时间"  id="to"></div></li>');
            break;
        case "eight-pointAusterityRules":
            condition_a.find("li:eq(0)").css("display","none");
            condition_a.find("li:eq(1)").css("display","none");
            condition_a.find("li:eq(2)").css("display","none");
            condition_a.append('<li onclick="conditiona(this)"><div><label>月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;份：</label><label><input placeholder="选择年月" id="epMonth" class="dateinput" style="width: 67%"></label></div></li>');
            laydate.render({
                elem: '#epMonth',
                max: new Date().getTime(),
                format: 'yyyy年MM月',
                type: 'month'
            });
            break;
        default:
            break;
    }
    initDate("from","to");
}

/**
 * 流程查询
 */
function search() {
    searchPageNumber = 1;
    if ($('.condition').hasClass('grade-w-roll')) {
        $('.condition').removeClass('grade-w-roll');
    }
    searchInstanceFunc(searchPageNumber);
}

//流程查询方法
function searchInstanceFunc(searchPageNumber){
    var instanceType = $("#instanceName").find("option:selected").val();
    var startTime = $("#startTime").val();
    var endTime = $("#endTime").val();
    var depart = $("#depart").find("option:selected").val();
    var content = getInstanceQueryCriteria(instanceType);
    var status =  $("#status").find("option:selected").val();
    var related =  $("#related").find("option:selected").val();
    searchInstance(instanceType,startTime,endTime,status,depart,related,JSON.stringify(content),searchPageNumber,pageSize);
}

//获取流程
function getInstanceQueryCriteria(instanceType){
    var content = {};
    var date = {};
    date.from = $("#from").val();
    date.to = $("#to").val();
    switch(instanceType.replace(/\d+/g,'')){
        case "documentCircularize":
            content.title = $("#fileTitle").val();
            break;
        case "financeBillDestroy":
            if ($("#billLicenseNumber").val() != ""){
                content.billLicenseNumber = $("#billLicenseNumber").val();
            }
            break;
        case "projectFundsWithdrawal":
        case "projectAppropriationReview":
        case "projectBudgetApplication":
            content.projectName = $("#projectName").val();
            break;
        case "contractReview":
        case "contractApprove":
            content.projectName = $("#projectName").val();
            content.contractNumber = $("#contractNumber").val();
            break;
        case "projectPreview":
            content.projectName = $("#projectName").val();
            content.projectNum = $("#projectNumber").val();
            break;
        case "governmentInformation":
            content.applicationNum = $("#applicationNum").val();
            content.registration = date;
            content.proposer = $("#proposer").val();
            break;
        case "informationSubmissionExamination":
            content.contentDate = date;
            break;
        case "sealCirculation":
            content.fileName = $("#fileName").val();
            break;
        case "dispatchDocumentUnion":
        case "dispatchDocument":
            content.title = $("#title").val();
            break;
        case "meetingSummary":
            content.meetingName = $("#meetingName").val();
            break;
        case "theTIOGMatterApply":
        case "theTIOGMatterExecution":
            content.itemName = $("#itemName").val();
            break;
        case "restaurantReception":
            content.transactor = $("#transactor").val();
            content.dinnerDate = date;
            break;
        case "meetingCostGather":
            content.meetingDate = date;
            break;
        case "publicAffairsAndVehicleApplication":
            content.tripDate = date;
            break;
        case "eight-pointAusterityRules":
            content.month = $("#epMonth").val();
            break;
        default:
            break;
    }
    return content;
}

/**
 * 流程实例查询
 */
function searchInstance(instanceType,startTime,endTime ,status,depart,related,query,pageNumber,pageSize) {
    var data = {
        instanceType: instanceType,
        startTime: startTime,
        endTime: endTime,
        status: status,
        department: depart,
        related: related,
        query:query,
        pageNo:pageNumber,
        pageSize:pageSize
    };
    localStorage.setItem("searchData",JSON.stringify(data));
    //回调函数，查询显示流程名称
    var searchValue = function (value) {
        var count = value.count;
        var content = value.list;
        if(count < (pageSize*(pageNumber-1))){
            isOver = 0;
        }else {
            isOver = 1;
        }
        var cAssociate = $("#associate");
        cAssociate.css("display", "none");
        // var canAssociateLaunch = ["meetingCostGather","publicAffairsAndVehicleApplication","restaurantReception"];
        if(content.length>1){
            if(content[1][content[0].length+2]==true){
                cAssociate.css("display", "inline");
            }else if($("#instanceName").val() == getInstanceNewVersion("eight-pointAusterityRules")){
                console.log(user.roleList);
                var isPlanningSection = false;
                user.roleList.forEach(function (value) {
                    if(value.id == "139"){
                        isPlanningSection = true;
                    }
                });
                isPlanningSection = isPlanningSection && $("#epMonth").val() != "";
                isPlanningSection && cAssociate.css("display", "inline");
            }
        }
        showInstanceList("table",content,0,[],pageSize,pageNumber);
    };
    connectToServer("GET", "/ws/process/processinfo", data, false, searchValue);
}

//获取流程列表
function initInstanceList() {
    var data={};
    var callBackGetCanLaunchInstance = function (value) {
        $("#relatedStatus").css("display","none");
        $("#associate").css("display", "none");
        var instanceName = $("#instanceName");
        for (var i = 0; i < value.length; i++) {
            if(value[i].versionList.length>1){
                var str = '<optgroup label="'+value[i].name+'">';
                for(var k in value[i].versionList){
                    if(value[i].originalType =="paymentApprove"){
                        str += '<option value="'+value[i].versionList[k].type+'" selected>'+value[i].name +value[i].versionList[k].version+'</option>';
                    }else
                        str += '<option value="'+value[i].versionList[k].type+'">'+value[i].name +value[i].versionList[k].version+'</option>';
                }
                str  += '</optgroup>';
                instanceName.append(str);
            }else{
                if(value[i].originalType=="paymentApprove"){
                    instanceName.append("<option value=" + value[i].id + " selected>" + value[i].name + "</option>");
                }else{
                    instanceName.append("<option value=" + value[i].id + ">" + value[i].name + "</option>");
                }
            }

        }
    };
    connectToServer("GET","/ws/document/type",data,false,callBackGetCanLaunchInstance);
}

function getInstanceNewVersion(instanceType){
    var instanceVersion ;
    var data = {
        instanceType:instanceType
    };
    var callBackAssociate = function (data) {
        instanceVersion = data;
    };
    connectToServer("GET","/ws/document/latest",data,false,callBackAssociate);
    return instanceVersion;
}

/**
 * 关联发起
 */
function associate() {
    var id_array = [];
    $('input[name="q"]:checked').each(function () {
        id_array.push($(this).val());
    });
    var canLaunch = false;
    var procedureType = $("#instanceName").val();
    var relateType = "";
    procedureType = procedureType.replace(/\d+/g,'');
    if (id_array.length > 0) {
        switch (procedureType){
            case "restaurantReception":
            case "meetingCostGather":
            case "publicAffairsAndVehicleApplication":
                canLaunch = true;
                relateType = getInstanceNewVersion("paymentApprove");
                break;
            case "theTIOGMatterApply":
                if (id_array.length == 1){
                    canLaunch = true;
                    relateType = getInstanceNewVersion("theTIOGMatterExecution");
                }else {
                    jAlert("系统提示：只能关联一个流程", "系统提示");
                }
                break;
            case "projectPreview":
                if (id_array.length == 1){
                    canLaunch = true;
                    relateType = getInstanceNewVersion("contractApprove");
                }else{
                    jAlert("系统提示：只能关联一个流程","系统提示");
                }
                break;
            default:
                break;
        }
    }
    if(procedureType == "eight-pointAusterityRules"){
        canLaunch = true;
        relateType = getInstanceNewVersion("eight-pointAusterityRules");
        checkedIds = $("#epMonth").val();
    }
    if(canLaunch){
        var el = document.createElement("a");
        document.body.appendChild(el);
        el.href = "../approve/"+relateType + ".html?type=new&relate=" + id_array+"&from="+procedureType;
        el.target = '_new'; //指定在新窗口打开
        el.click();
        document.body.removeChild(el);
    }
}

//关注
function concern(obj){
    var follow = 1;
    var instanceID = $(obj).data("id");
    if(($(obj).text()).indexOf("取消关注")>-1){
        follow = 0;
        $(obj).text("关注");
    }else
        $(obj).text("取消关注");
    concernFunc(instanceID,follow);
}

/**
 * 关注接口
 * @param instanceID
 * @param follow
 */
function concernFunc(instanceID,follow) {
    var data = {
        instanceID:instanceID,
        follow:follow
    };
    var callBackAssociate = function (data) {
        console.log("Success");
    };
    connectToServer("POST","/ws/process/user/follow/update",data,false,callBackAssociate);
}