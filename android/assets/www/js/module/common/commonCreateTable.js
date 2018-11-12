/**
 * Created by Ding-PC on 2017/11/1.
 */
//生成表格

// var content = [["日期","文件名称","发起人","状态"],
//     ["2017-11-1","八项规定","金阮园","已完成","1","eight-pointAusterityRules",false],
//     ["2017-10-1","八项规定","金阮园","进行中","1","eight-pointAusterityRules",false]];

function showInstanceList(id,content,count,operate,pageSize,pageNumber,callback){
    //当div下还存在子节点时 循环继续
    if(pageNumber == 1||operate[0] == "选择"){
        $("#"+id).empty();
    }
    var checkbox;//关联发起时选择框
    //var strTitle;//表头
    var strContent;//表内容
    //$("#"+id).append('<div id="associate" style="margin-bottom: 3px;margin-right: -10px"></div>');
    var contentLength = content.length;
    if(contentLength>1){
        for(var j=1;j<contentLength;j++){
            var table = 'tableContent'+ j + pageNumber;
            $("#"+id).append('<table id="'+table+'" class="tableStyle"></table>');
            if(content[j][content[0].length+2]==true){
                if(content[j][content[0].length+3]==true){
                    checkbox = '<input  type="checkbox" name="q" value=' + content[j][content[0].length] + ">";
                    //
                }else
                    checkbox = '<input  type="checkbox" name="q" disabled="disabled"><label class="checkbox"></label>';
                    if (content[j][4] == "进行中"){
                        strContent = "<tr><td style='width: 10%' rowspan='3' align='center' valign='middle'>"+checkbox+"</td>";
                    }else{
                        strContent = "<tr><td style='width: 10%' rowspan='3' align='center' valign='middle'><span class='isNew'></span>"+checkbox+"</td>";
                    }
            }else{
                if(content[j][4] == "进行中"){
                    strContent = "<tr><td style='width: 10%' rowspan='3' align='center' valign='middle'></td>";
                }else {
                    strContent = "<tr><td style='width: 10%' rowspan='3' align='center' valign='middle'><span class='isNew'></span></td>";
                }
            }
            var instanceid ="'"+ content[j][content[0].length]+"'";
            var instancetype = "'"+content[j][content[0].length+1]+"'";
            strContent +='<td onclick="viewTask('+instanceid+','+instancetype+')" class="firstLine" colspan="4" align="center">'+content[j][1]+'</td><td style="width: 10%" rowspan="3" align="center" valign="middle">';
            for(var op=0;op< operate.length;op++){
                var concern = operate[op];
                var concernStatus = 1;
                if(concern == "关注"){
                    if(content[j][content[0].length+4]==false){
                        concern = '<img class="img-concern" src="../../resources/images/app/unconcerned.png"/>';
                    }else {
                        concern = '<img class="img-concern" src="../../resources/images/app/concerned.png"/>';
                        concernStatus = 0;
                    }

                }
                strContent += '<a class="app" target="_blank" href="javascript:void(0)" data-id='+content[j][content[0].length]+' data-type='+content[j][content[0].length+1]+' data-concern='+concernStatus+'>'+concern+" </a>";
            }
            if(concern == "选择"){
                strContent +='</td></tr><tr><td class="secondLine1" colspan="4" onclick="viewTask('+instanceid+','+instancetype+')"><span style="margin-left: 10px;margin-right: 10px">'+content[j][0]+'</span><span style="margin-right: 10px">'+content[j][2]+'</span><span>'+content[j][3]+'</span></td></tr><tr><td class="thirdLine" onclick="viewTask('+instanceid+','+instancetype+')" colspan="4">'
                for(var i=5;i<content[0].length;i++){
                    strContent  += '<span>'+content[0][i]+':'+content[j][i]+'</span><br>';
                }
            }else {
                strContent += '</td></tr><tr><td class="secondLine1" colspan="3" onclick="viewTask(' + instanceid + ',' + instancetype + ')"><span style="margin-right: 10px">' + content[j][0] + '</span><span style="margin-right: 10px">' + content[j][2] + '</span><span>' + content[j][3] + '</span></td><td colspan="1" class="secondLine2" onclick="viewTask(' + instanceid + ',' + instancetype + ')" align="center"><a>' + content[j][4] + '</a></td></tr><tr><td class="thirdLine" onclick="viewTask(' + instanceid + ',' + instancetype + ')" colspan="4">';
                for(var k=5;k<content[0].length;k++){
                    strContent  += '<span>'+content[0][k]+':'+content[j][k]+'&nbsp;&nbsp;</span>';
                }
            }
            strContent  +='</td></tr>';
            $("#"+table).append(strContent);
        }
        $("#"+id).append('<div class="pagin" id="pagePosition"></div>');
        if(concern == "选择"){
            if(count>0){
                addPagingFunc("pagePosition",count,pageSize,pageNumber,callback);
            }
        }
    }

}function viewTask(instanceid,instancetype) {

    var el = document.createElement("a");
    document.body.appendChild(el);
    el.href = "../approve/" +instancetype + ".html?type=old&instanceID="+instanceid;
    el.target = '_blank'; //指定在新窗口打开
    el.click();
    document.body.removeChild(el);
}

/***
 * 添加分页
 * @param el
 * @param count
 * @param pageSize
 * @param pageNum
 * @param func
 */
function addPagingFunc(el,count,pageSize,pageNum,func){
    var pagePosition = document.getElementById(el);
    pagePosition.innerHTML='<div><label class="message">共<i class="blue" id="pageSum"></i>条记录，当前显示第&nbsp;<i class="blue" id="pageNum"></i>&nbsp;页</label></div><div><ul class="paginList" id="page"></ul></div>';
    $("#pageSum").text(count); $("#pageNum").text(pageNum);
    this.getLink = function(func, index, pageNum, text) {
        var s = '<li class="paginItem"><a href="#p' + index + '" onclick="' + func + '(' + index + ');" ';
        if(index == pageNum) {
            s += 'class="current" ';
        }
        text = text || index;
        s += '>' + text + '</a> ';
        return s;
    };
    var divPage = document.getElementById('page');
    //总页数
    var pageNumAll = Math.ceil(count / pageSize);
    if (pageNumAll == 1) {
        divPage.innerHTML = '';
        return;
    }
    var itemNum = 2; //当前页左右两边显示个数
    pageNum = Math.max(pageNum, 1);
    pageNum = Math.min(pageNum, pageNumAll);
    var s = '';
    if (pageNum > 1) {
        s += this.getLink(func, pageNum-1, pageNum, '<span style="display:block" class="pagepre"></span>');
    } else {
        s += '<li class="paginItem"><a><span style="display:block" class="pagepre"></span></a></li> ';
    }
    var begin = 1;
    if (pageNum - itemNum > 1) {
        s += this.getLink(func, 1, pageNum) + '<li class="paginItem other"><a href="javascript:;">...</a></li>';
        begin = pageNum - itemNum;
    }
    var end = Math.min(pageNumAll, begin + itemNum*2);
    if((pageNumAll-itemNum*2-1>0)&&(begin > pageNumAll-itemNum*2-1)){
        begin = pageNumAll-itemNum*2-1;
    }
    if(end == pageNumAll - 1){
        end = pageNumAll;
    }
    for (var i = begin; i <= end; i++) {
        s += this.getLink(func, i, pageNum);
    }
    if (end < pageNumAll) {
        s += '<li class="paginItem other"><a href="javascript:;">...</a></li>' + this.getLink(func, pageNumAll, pageNum);
    }
    if (pageNum < pageNumAll) {
        s += this.getLink(func, pageNum+1, pageNum, '<span style="display:block" class="pagenxt"></span>');
    } else {
        s += ' <li class="paginItem"><a><span style="display:block" class="pagenxt"></span></a></li> ';
    }
    divPage.innerHTML = s;
}