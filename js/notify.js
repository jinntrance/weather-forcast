/**
 *
 */

function notify(){
    var list=ls()['notifications'];
    var date=new Date();
    var currentTime=date.getMilliseconds();
    var notifications=list.filter(function(item){
        //提前20min提醒
       return (item.time+20*60*1000>currentTime)
    });
    //右下角的提醒
    chrome.extension.sendMessage({
        method: 'notify',
        action: 'notify',
        data: notifications
    },function(resp){
        console.log(resp.data)
    });
    //每60min提醒一次。
    setTimeout(function(){
        notify()
    },60*60*1000);
}

$(function(){
    notify();
});
