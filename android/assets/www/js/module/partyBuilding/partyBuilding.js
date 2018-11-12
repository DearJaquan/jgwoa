/**
 * Created by Revan on 2017/8/29.
 */

function uploadBrief(userID, file, callBack, fileControl) {
    var url = urlBase+"/ws/brief/file/upload";
    var form = new FormData();
    form.append("uid",userID);
    form.append("fileName",file.name);
    form.append("file",file);
    var onLoadEnd = function (result) {
        callBack(result,fileControl);
    };
    var onProgress = function (result) {
    };
    uploadFile(url,form,onLoadEnd,onProgress);
}

function uploadNotice(userID, file, callBack, fileControl) {
    var url = urlBase+"/ws/notice/file/upload";
    var form = new FormData();
    form.append("uid",userID);
    form.append("fileName",file.name);
    form.append("file",file);
    var onLoadEnd = function (result) {
        callBack(result,fileControl);
    };
    var onProgress = function (result) {
    };
    uploadFile(url,form,onLoadEnd,onProgress);
}

function uploadHonor(userID, file, callBack, fileControl) {
    var url = urlBase+"/ws/honor/file/upload";
    var form = new FormData();
    form.append("uid",userID);
    form.append("fileName",file.name);
    form.append("file",file);
    var onLoadEnd = function (result) {
        callBack(result,fileControl);
    };
    var onProgress = function (result) {
    };
    uploadFile(url,form,onLoadEnd,onProgress);
}

function getNoticeList(userID,fromNum,count,callback,isAsync) {
    if(isAsync == null){
        isAsync = true;
    }
    $.ajax({
        type:"GET",
        url:urlBase+"/ws/notice/list",  //流程发起url
        data:{
            uid:userID,
            fromNum:fromNum,
            count:count
        },
        async: isAsync,
        dataType:"JSON",
        success:function(data){
            callback(data);
        },
        error:function(){

        }
    });
}

function getBriefList(userID,fromNum,count,callback,isAsync) {
    if(isAsync == null){
        isAsync = true;
    }
    $.ajax({
        type:"GET",
        url:urlBase+"/ws/brief/list",  //流程发起url
        data:{
            uid:userID,
            fromNum:fromNum,
            count:count
        },
        async: isAsync,
        dataType:"JSON",
        success:function(data){
            callback(data);
        },
        error:function(){

        }
    });
}

function getHonorList(userID,fromNum,count,callback,isAsync) {
    if(isAsync == null){
        isAsync = true;
    }
    $.ajax({
        type:"GET",
        url:urlBase+"/ws/honor/list",  //流程发起url
        data:{
            uid:userID,
            fromNum:fromNum,
            count:count
        },
        async: isAsync,
        dataType:"JSON",
        success:function(data){
            callback(data);
        },
        error:function(){

        }
    });
}