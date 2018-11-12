/**
 * Created by feijiahui on 2017/10/21.
 */


$(window).resize(function(e) {
    $("#bd").height($(window).height() - $("#hd").height() - $("#ft").height());
    $("#iframe").height($(window).height() - $("#hd").height() - $("#ft").height()-8);
}).resize();

/*初始控件*/
window.onload = function init() {
    var cookie = getCookieValue();
    if(cookie['']=="undefined"){
        window.location.href="../../login.html";
    }
    initUserInfo();
    initLaunchInstance();
    initInstanceNum();
};

//个人信息
function initUserInfo(){
    var data = {};
    var callback = function(data){
        document.getElementById("name").innerHTML = data.name;
        // var gender = data.gender;
        // if(null==gender){gender="暂无数据";}
        // document.getElementById("gender").innerHTML = gender;
        // var idCode = data.idCode;
        // if(null==idCode){idCode="XXXXXXXXXXXXXXXXXX";}
        // document.getElementById("IDCode").innerHTML = idCode;
        document.getElementById("position").innerHTML = data.architecture;
        if(data.department!=undefined){
            document.getElementById("department").innerHTML = data.department;
        }else
            $('#otherDepartment').hide();

    };
    connectToServer("GET","/ws/user/userinfo",data,false,callback);
}


/*查看Task的类别*/
function setTaskStatusToCookie(status){
    var cookieName = encodeURI("status");
    var cookieValue =encodeURI(status);
    var expires = new Date();
    expires.setTime(expires.getTime() + 10 * 3600000 * 24);   //过期时间设置为10天
    document.cookie = cookieName + "=" + cookieValue +";expires=" + expires.toUTCString() +";path=/";
}

/*目录控制*/

$(document).ready(function (argument) {
    $.each($('.container'), function () {
        var trigger = $(this).data('trigger'),
            $self = $(this);
        $(this).on(trigger, '.tab>a', function () {
            $(this).siblings().removeClass('mui-active').end().addClass('mui-active');
            tabShowIndex($self, $(this).index());
        });
        var index = localStorage.getItem("nowIndex");
        document.querySelectorAll('.mui-tab-item').item(index).click();
    });
    function tabShowIndex($tab, index) {
        $tab.find('.content-item').hide().eq(index).show();
        localStorage.setItem("nowIndex",index);
    }
});



function exit(){
    clearCookie();
    localStorage.removeItem("remember");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    window.JPush.setAlias({ sequence: 1, alias: "" });
    // window.JPush.deleteAlias({ sequence: 1 });
    window.location.href="../../login.html";
}

function meeting(){
    window.location.href="meetingPerson.html";
}

/**********************************************************************************************************************/

//初始化可发起流程实例
function initLaunchInstance() {
    var data={};
    //获取可发起流程的回调
    var callBackGetCanLaunchInstance = function (value) {
        var canLaunchInstance = $("#canLaunchInstance");
        var canLaunchInstanceContract = $("#canLaunchInstanceContract");
        var canLaunchInstanceFile = $("#canLaunchInstanceFile");
        var canLaunchInstanceMeeting = $("#canLaunchInstanceMeeting");
        var canLaunchInstanceFinance = $("#canLaunchInstanceFinance");
        for (var i = 0; i < value.length; i++) {
            if(value[i].status==true) {
                var type = value[i].type;
                if (type) {
                    switch(type){
                        case 1:
                            canLaunchInstance.append('<div class="block"><a href=../approve/' + value[i].id + '.html?type=new target="blank" class="clearfix"><span style="font-size:16px">' + value[i].name + '</span></a></div>');
                            break;
                        case 2:
                            canLaunchInstanceContract.append('<div class="block"><a href=../approve/' + value[i].id + '.html?type=new target="blank" class="clearfix"><span style="font-size:16px">' + value[i].name + '</span></a></div>');
                            canLaunchInstanceContract.addClass("line");
                            break;
                        case 3:
                            canLaunchInstanceFile.append('<div class="block"><a href=../approve/' + value[i].id + '.html?type=new target="blank" class="clearfix"><span style="font-size:16px">' + value[i].name + '</span></a></div>');
                            canLaunchInstanceFile.addClass("line");
                            break;
                        case 4:
                            canLaunchInstanceMeeting.append('<div class="block"><a href=../approve/' + value[i].id + '.html?type=new target="blank" class="clearfix"><span style="font-size:16px">' + value[i].name + '</span></a></div>');
                            canLaunchInstanceMeeting.addClass("line");
                            break;
                        case 5:
                            canLaunchInstanceFinance.append('<div class="block"><a href=../approve/' + value[i].id + '.html?type=new target="blank" class="clearfix"><span style="font-size:16px">' + value[i].name + '</span></a></div>');
                            canLaunchInstanceFinance.addClass("line");
                            break;
                        default :
                            break;
                    }
                    // canLaunchInstance.append('<div class="block"><a href=../approve/' + value[i].id + '.html?type=new target="blank" class="clearfix"><span style="font-size:16px">' + value[i].name + '</span></a></div>');
                }
            }
        }
    };
    connectToServer("GET","/ws/document/list/user",data,false,callBackGetCanLaunchInstance);
}

/**
 * 流程状态统计
 */
function initInstanceNum() {
    var data = {};
    //回调函数，显示流程名称
    var callBack = function (info) {
        for(var key in info){
            switch (key){
                case "我的关注":
                    $("#concern").html(info[key]);
                    $("#concern").css("display","inline");
                    break;
                case "待审批":
                    $("#approve").html(info[key]);
                    $("#approve").css("display","inline");
                    break;
                case "被否决":
                    $("#reject").html(info[key]);
                    $("#reject").css("display","inline");
                    break;
                case "被退回":
                    $("#return").html(info[key]);
                    $("#return").css("display","inline");
                    break;
                // case "进行中":
                //     $("#underWay").html(info[key]);
                //     $("#underWay").css("display","inline");
                //     break;
                case "待执行":
                    $("#executed").html(info[key]);
                    $("#executed").css("display","inline");
                    break;
                case "草稿":
                    $("#draft").html(info[key]);
                    $("#draft").css("display","inline");
                    break;
                case "已完成":
                    $("#finish").html(info[key]);
                    $("#finish").css("display","inline");
                    break;
                default:
                    break;
            }
        }
    };
    connectToServer("GET","/ws/process/user/statistics",data,false,callBack);
}

setInterval("initInstanceNum()",5*1000);