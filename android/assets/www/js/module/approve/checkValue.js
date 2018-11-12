/**
 * Created by Revan on 2017/10/11.
 */

/**
 * 清除提示
 * @param hint
 */
function clearHint(hint) {
    if(hint){
        hint.text("");
        hint.css("color","red");
    }
}

/**
 * 设置提示
 * @param hint
 * @param content
 */
function setHint(hint, content) {
    if(hint){
        hint.text(content);
    }
}

/**
 * 非空检测
 * @param value
 * @param hint
 */
function checkNotNull(value, hint) {
    clearHint(hint);
    if(!(value && value != "")){
        setHint(hint, "内容不可为空");
        return false;
    }
    return true;
}

/**
 * 电话号码检测
 * @param value
 * @param hint
 */
function checkTel(value, hint) {
    clearHint(hint);
    if(value && value != ""){
        var reg = /^[\d]{5,20}$/;
        if(!reg.test(value)){
            setHint(hint, "联系方式不正确");
            return false;
        }
    }
    return true;
}

/**
 * 非空电话号码检测
 * @param value
 * @param hint
 */
function checkNotNullTel(value, hint) {
    clearHint(hint);
    if(value && value != ""){
        var reg = /^[\d]{5,20}$/;
        if(!reg.test(value)){
            setHint(hint, "联系方式不正确");
            return false;
        }
    }else{
        setHint(hint, "内容不可为空");
        return false;
    }
    return true;
}

/**
 * 非空到秒时间检测
 * @param value
 * @param hint
 */
function checkNotNullTimeDate(value, hint) {
    clearHint(hint);
    if(value && value != ""){
        var reg = /^[\d]{4}-[\d]{2}-[\d]{2} [\d]{2}:[\d]{2}:[\d]{2}$/;
        if(!reg.test(value)){
            setHint(hint, "时间不正确");
            return false;
        }
    }else{
        setHint(hint, "内容不可为空");
        return false;
    }
    return true;
}

/**
 * 非空到秒时间检测
 * @param value
 * @param hint
 */
function checkNotNullArray(value, hint) {
    clearHint(hint);
    if(value == 0){
        setHint(hint, "至少具有一项内容");
        return false;
    }
    return true;
}

/**
 * 检查是否上传附件
 * @param hint
 * @returns {boolean}
 */
function checkUploadFile(hint) {
    clearHint(hint);
    for (var i = 0; i < fileList.length; i++) {
        if(fileList[i].type == "file" && fileList[i].step == instance.currentStep){
            return true;
        }
    }
    setHint(hint, "至少上传一个附件");
    return false;
}


/**
 * 检查是否关联流程
 * @param hint
 * @returns {boolean}
 */
function checkRelateProcedure(hint) {
    clearHint(hint);
    for (var i = 0; i < fileList.length; i++) {
        if(fileList[i].type == "procedure" && fileList[i].step == instance.currentStep){
            return true;
        }
    }
    setHint(hint, "至少关联一个流程");
    return false;
}


/**
 * 正整数检测
 * @param value
 * @param hint
 * @returns {boolean}
 */
function checkPositiveInteger(value, hint) {
    clearHint(hint);
    if(value && value != ""){
        var reg = /^[1-9]\d*$/;
        if(!reg.test(value)){
            setHint(hint, "请输入正确数字");
            return false;
        }
    }
    return true;
}

/**
 * 正整数检测
 * @param value
 * @param hint
 * @returns {boolean}
 */
function checkInteger(value, hint) {
    clearHint(hint);
    if(value && value != ""){
        var reg = /^\d*$/;
        if(!reg.test(value)){
            setHint(hint, "请输入正确数字");
            return false;
        }
    }
    return true;
}

/**
 * 非空正整数检测
 * @param value
 * @param hint
 * @returns {boolean}
 */
function checkNotNullPositiveInteger(value, hint) {
    clearHint(hint);
    if(value && value != ""){
        var reg = /^\d*$/;
        if(!reg.test(value)){
            setHint(hint, "请输入正确数字");
            return false;
        }
    }else{
        setHint(hint, "内容不可为空");
        return false;
    }
    return true;
}

/**
 * 正数检测
 * @param value
 * @param hint
 * @returns {boolean}
 */
function checkPositiveNum(value, hint) {
    clearHint(hint);
    if(value && value.length > 0){
        var reg = /^\d+(\.\d+)?$/;
        if(!reg.test(value)){
            setHint(hint, "请输入正确数字");
            return false;
        }
    }
    return true;
}

/**
 * 非空正数数值
 * @returns {boolean}
 */
function checkNotNullPositiveNum(value, hint) {
    clearHint(hint);
    if(value && value.length > 0){
        var reg = /^\d+(\.\d+)?$/;
        if(!reg.test(value)){
            setHint(hint, "请输入正确数字");
            return false;
        }
    }else{
        setHint(hint, "内容不可为空");
        return false;
    }
    return true;
}

/**
 * 检测列表内容不为空
 * @param value
 * @param hint
 */
function checkHasContent(value, hint) {
    clearHint(hint);
    if(value < 1){
        setHint(hint, "至少需要一条信息");
        return false;
    }
    return true;
}

function checkTimeRight(from, to, hint) {
    clearHint(hint);
    from = parseInt(from.replace(/[^0-9]/ig,""));
    to = parseInt(to.replace(/[^0-9]/ig,""));
    if(from > to){
        setHint(hint, "开始时间比结束时间晚");
        return false;
    }
    return true;
}