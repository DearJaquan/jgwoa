/**
 * Created by feijiahui on 2017/10/20.
 */
/*初始控件*/
var taskPageNumber = 1;//查看页面
var pageSize = 10; //分页
var isOver = 1; //是否还有内容未加载
var status;

/**
 * 任务查看
 * @param userID
 * @param status
 * @param callback
 * @param isAsync
 */
function getTask(status,pageNumber,pageSize ) {
    var data = {
        pageNo:pageNumber,
        pageSize:pageSize,
        status: status
    };
    //回调函数，显示流程
    var callBack = function (info) {
        var length = info.length;
        if(info.length < pageSize){
            isOver = 0;
        }else {
            isOver = 1;
            length = pageSize;
        }
        showInstanceList("text", info,0,["关注"],pageSize,pageNumber);
        for(var i=0;i < length;i++){
            if(info[i][info[0].length+5] == false){
                var table = document.getElementById("tableContent"+ i + pageNumber);
                $(".isNew",table).append("<img src='../../resources/images/gifnew.gif'/>");
            }
        }
    };
    connectToServer("GET","/ws/process/user/task/app",data,false,callBack);
}

window.onload = function init() {
    var map = getCookieValue();
    var task = $("#task");
    status = map.status;
    switch(status){
        case "1":
            task.text("我的关注");
            break;
        case "2":
            task.text("待审批");
            break;
        case "3":
            task.text("被否决");
            break;
        case "4":
            task.text("被退回");
            break;
        case "5":
            task.text("进行中");
            break;
        case "6":
            task.text("待执行");
            break;
        case "7":
            task.text("草稿");
            break;
        case "8":
            task.text("已完成");
            break;
    }
    getTask(status,taskPageNumber,pageSize);
    clickOnConcern();
};

$(document).ready(function() {
    $('#text').BlocksIt({
        numOfCol: 1,
        offsetX: 0,
        offsetY: 3
    });
});

$(window).scroll(function(){
    if(isOver == 1){
        // 当滚动到最底部以上50像素时， 加载新内容
        if ($(document).height() - $(this).scrollTop() - $(this).height()<50){
            taskPageNumber +=1;
            getTask(status,taskPageNumber,pageSize);
            clickOnConcern();
            $('#container').BlocksIt({
                numOfCol:1,
                offsetX: 0,
                offsetY: 3
            });
        }
    }
});

//关注功能
function clickOnConcern(){
    $("#text").find("a").click(function (){
        var con= $(this);
        var instanceID = $(this).attr("data-id");
        var follow = $(this).attr("data-concern");
        var data = {
            instanceID:instanceID,
            follow:follow
        };
        var callBackAssociate = function () {
            if(follow == 1){
                $(con).attr("data-concern",0);
                $(con).find("img").attr("src","../../resources/images/app/concerned.png");
            }else {
                $(con).attr("data-concern",1);
                $(con).find("img").attr("src","../../resources/images/app/unconcerned.png");
            }
            console.log("Success");
        };
        connectToServer("POST","/ws/process/user/follow/update",data,false,callBackAssociate);
    });
}


