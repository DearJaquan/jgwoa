/**
 * Created by feijiahui on 2017/11/29.
 */

$(document).ready(function () {
    initMeetingCalendarShow();
});

setInterval(function(){initMeetingCalendarShow();},1000*5);

/**
 *个人日程表
 */
function initMeetingCalendarShow() {
    var date = new Date();
    // var nextDate = new Date((date/1000+86400*2)*1000);
    var data={
        all:"0",
        meetingTimeFrom:date.format('yyyy-MM-dd h:m:s'),
        limit:5
    };
    $("#fullCalendar").empty();
    var callBack = function (info) {
        if(info.length<1){
            $("#fullCalendar").append('<tr><td><label style="margin-left: 16%">暂无需要参加的会议</label></td></tr>');
        }else{
            for(var i in info) {
                var href = '../approve/'+info[i].type+'.html?type=old&instanceID='+info[i].processInstanceId ;
                var meetingTime = (info[i].meetingTimeFrom);
                var str = '<tr>' +
                    '<td><a href="'+href+'" target="_blank" ><div class="firstLine" style="width: 90%;margin-left: 5%" align="center"><label style="color:#000000">' + info[i].meetingName + '</label></div><div class="secondLine1" style="width: 90%;margin-left: 5%">会议时间：'+meetingTime+'</div><div class="secondLine1" style="width: 90%;margin-left: 5%">会议地点：' + info[i].meetingRoom + '</div></a>'+
                    '<div style="padding-bottom: 2px;background-color: #efeff4"/></td>' +
                    '</tr>';
                $("#fullCalendar").append(str);
            }
        }
    };
    connectToServer("GET","/ws/user/meeting/calendar",data,false,callBack);
}

Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};