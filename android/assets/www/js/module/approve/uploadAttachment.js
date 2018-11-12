/**
 * Created by Revan on 2017/10/16.
 */

/**
 * 创建附件文件上传控件
 */
function createAttachmentFile() {
    var file = $("#fileSelect")[0].files[0];
    if (file.type == "application/msword"
        || file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        || file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        || file.type == "application/vnd.ms-excel"
        || file.type == "application/pdf"
        || file.type == "") {
        var newID = "f" + user.id + new Date().getTime();
        var fileName = file.name.substring(0,file.name.lastIndexOf("."));
        $("#fileList").append(
            "<tr id='" + newID + "'>" +
            "<td width='80px'><img src='../../resources/images/attachmentFile.png' align='absmiddle'>附件：</td>" +
            "<td><a name='preview' href='javascript:void(0);' target='_blank'><div class='abridgeFileName'>" + fileName + "</div></a></td>" +
            // "<td width='200px'><progress value='0' max='100' style='width:150px;'></progress><span style='margin-left: 10px'></span></td>" +
            "<td width='35px'>" +
            "<a style='display: none' name='reload' href='javascript:void(0);' onclick='uploadAttachment(" + file + "," + newID + ")' title='重新上传'>" +
            "<img src='../../resources/images/attachmentReload.png'>" +
            "</a>" +
            // "<a style='display: none' name='download' title='下载' download='" + fileName + "'>" +
            // "<img src='../../resources/images/attachmentDownload.png'>" +
            // "</a>" +
            "</td>" +
            "<td width='35px'>" +
            "<a style='display: none' name='delete' href='javascript:void(0);' onclick='deleteFile(" + newID + ")' title='删除'>" +
            "<img src='../../resources/images/attachmentDelete.png'>" +
            "</a>" +
            "</td>" +
            "</tr>"
        );
        uploadAttachment(file, newID);
    }else{
        jAlert("系统提示：只能上传doc,docx,xls,xlsx,pdf文件！","请选择正确文件类型");
    }
    $("#fileSelect").val("");
}

/**
 * 上传附件文件
 * @param file
 * @param newID
 */
function uploadAttachment(file, newID) {
    var fileControl = $("#" + newID)[0];
    var url = urlBase + "/ws/attachment/file/upload";
    var form = new FormData();
    form.append("userID", user.id);
    form.append("fileName", file.name);
    form.append("file", file);
    var onLoadEnd = function (result) {
        afterLoadEnd(result, fileControl);
    };
    // var progress = $("progress", fileControl)[0];
    // var percent = $("span", fileControl)[0];
    // var onProgress = function (result) {
    //     progressFunction(result, progress, percent);
    // };
    uploadFile(url, form, onLoadEnd);
}

/**
 * 上传文件后的回调函数
 * @param data
 * @param fileControl
 */
function afterLoadEnd(data, fileControl) {
    data = $.parseJSON(data);
    // $("progress", fileControl).css("display", "none");
    $("a", fileControl).css("display", "inline");
    if (data.code == 200) {
        var fileID = data.data.id;
        var fileName = $("a[name='preview']",fileControl).text();
        var filePath = urlFileBase + data.data.path;
        var fileType = filePath.substring(filePath.lastIndexOf(".")+1,filePath.length);
        var filePDFPath;
        if(fileType.toLowerCase() =="pdf"){
            filePDFPath = filePath;
        }else {
            filePDFPath = filePath.substring(0,filePath.lastIndexOf(".")) + ".pdf";
        }
        $("span", fileControl).css("display", "none");
        $("a[name='preview']",fileControl).attr("data-id",fileID);
        $("a[name='preview']",fileControl).attr("onclick", "readFile(" + filePDFPath +");");
        $("a[name='reload']",fileControl).css("display", "none");
        // $("a[name='download']",fileControl).attr("href", filePath);
        fileList.push({id:fileID,name:fileName,path:data.data.path,step:instance.currentStep,type:"file"});
    } else {
        // $("span", fileControl)[0].innerHTML = "上传失败";
        $("a[name='download']",fileControl).css("display", "none");
    }
}

/**
 * 上传进度显示
 * @param evt
 * @param progress
 * @param percent
 */
function progressFunction(evt, progress, percent) {
    if (evt.lengthComputable) {
        progress.max = evt.total;
        progress.value = evt.loaded;
        percent.innerHTML = Math.round(evt.loaded / evt.total * 100) + "%";
    }
}

/**
 * 删除上传文件
 * @param elementID
 * @returns {boolean}
 */
function deleteFile(elementID) {
    var fileControl = $(elementID);
    var fileID = $("a[name='preview']",fileControl).attr("data-id");
    if (fileID) {
        for (var i = 0; i < fileList.length; i++) {
            if (fileID == fileList[i].id) {
                fileList.splice(i, 1);
            }
        }
    }
    fileControl.remove();
}

function createAttachmentProcedure(data) {
    var newID = "f" + user.id + new Date().getTime();
    var fileName = data.name;
    var href = data.type + ".html?type=old&instanceID=" + data.instanceID;
    $("#fileList").append(
        "<tr id='" + newID + "'>" +
        "<td width='80px'><img src='../../resources/images/attachmentProcedure.png' align='absmiddle'>附件：</td>" +
        "<td><a name='preview' data-id='"+data.instanceID+"' href='"+href+"' target='_blank'><div class='abridgeFileName'>" + fileName + "</div></a></td>" +
        // "<td width='200px'></td>" +
        "<td width='35px'>" +
        "</td>" +
        "<td width='35px'>" +
        "<a name='delete' href='javascript:void(0);' onclick='deleteFile("+newID+")' title='删除'>" +
        "<img src='../../resources/images/attachmentDelete.png'>" +
        "</a>" +
        "</td>" +
        "</tr>"
    );
    
    fileList.push({
        id:data.instanceID,
        name:data.name,
        path:data.type,
        step:instance.currentStep,
        type:"procedure",
        time:new Date().getTime()
    });
}

function createExistFile() {
    fileList.forEach(function (value) {
        var newID = "f" + user.id + new Date().getTime();
        var addTo = $("#fileList");
        var newElement = "";
        switch (value.type){
            case "file":
                var filePath = urlFileBase + value.path;
                var fileType = filePath.substring(filePath.lastIndexOf(".")+1,filePath.length);
                var filePDFPath;
                if(fileType.toLowerCase() =="pdf"){
                    filePDFPath = filePath;
                }else {
                    filePDFPath = filePath.substring(0,filePath.lastIndexOf(".")) + ".pdf";
                }
                if(instance.isOperator && instance.currentStep == value.step){
                    newElement =
                        "<tr id='" + newID + "'>" +
                        "<td width='80px'><img src='../../resources/images/attachmentFile.png' align='absmiddle'>附件：</td>" +
                        "<td><a name='preview' data-id='"+value.id+"' onclick='readFile(\""+filePDFPath+"\");' target='_blank'><div class='abridgeFileName'>" + value.name + "</div></a></td>" +
                        // "<td width='200px'></td>" +
                        "<td width='35px'>" +
                        // "<a href='"+filePath+"' name='download' title='下载' download='"+value.name+"'>" +
                        // "<img src='../../resources/images/attachmentDownload.png'>" +
                        // "</a>" +
                        "</td>" +
                        "<td width='35px'>" +
                        "<a name='delete' href='javascript:void(0);' onclick='deleteFile("+newID+")' title='删除'>" +
                        "<img src='../../resources/images/attachmentDelete.png'>" +
                        "</a>" +
                        "</td>" +
                        "</tr>";
                }else{
                    newElement =
                        "<tr id='" + newID + "'>" +
                        "<td width='80px'><img src='../../resources/images/attachmentFile.png' align='absmiddle'>附件：</td>" +
                        "<td><a name='preview' data-id='"+value.id+"' onclick='readFile(\""+filePDFPath+"\");' target='_blank'><div class='abridgeFileName'>" + value.name + "</div></a></td>" +
                        // "<td width='200px'></td>" +
                        "<td width='35px'>" +
                        // "<a href='"+filePath+"' name='download' title='下载' download='"+value.name+"'>" +
                        // "<img src='../../resources/images/attachmentDownload.png'>" +
                        // "</a>" +
                        "</td>" +
                        "<td width='35px'>" +
                        "</td>" +
                        "</tr>";
                }
                break;
            case "procedure":
                var href = value.path + ".html?type=old&instanceID=" + value.id;
                if(instance.isOperator && instance.currentStep == value.step){
                    var newElement =
                        "<tr id='" + newID + "' data-type='procedure'>" +
                        "<td width='80px'><img src='../../resources/images/attachmentProcedure.png' align='absmiddle'>附件：</td>" +
                        "<td><a data-id='"+value.id+"' name='preview' href='"+href+"' target='_blank'><div class='abridgeFileName'>" + value.name + "</div></a></td>" +
                        // "<td width='200px'></td>" +
                        "<td width='35px'>" +
                        "</td>" +
                        "<td width='35px'>" +
                        "<a name='delete' href='javascript:void(0);' onclick='deleteFile("+newID+")' title='删除'>" +
                        "<img src='../../resources/images/attachmentDelete.png'>" +
                        "</a>" +
                        "</td>" +
                        "</tr>";
                }else{
                    var newElement =
                        "<tr id='" + newID + "' data-type='procedure'>" +
                        "<td width='80px'><img src='../../resources/images/attachmentProcedure.png' align='absmiddle'>附件：</td>" +
                        "<td><a data-id='"+value.id+"' name='preview' href='"+href+"' target='_blank'><div class='abridgeFileName'>" + value.name + "</div></a></td>" +
                        // "<td width='200px'></td>" +
                        "<td width='35px'>" +
                        "</td>" +
                        "<td width='35px'>" +
                        "</td>" +
                        "</tr>";
                }
                break;
        }
        addTo.append(newElement);
    });
}
