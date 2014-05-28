
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    console.log("received method: "+request.method)
    switch(request.method){
        case "getLocalStorage":
            sendResponse({data: localStorage});
            break;
        case "setLocalStorage":
            var object=request.data;
            for(var key in object) {
                if (object.hasOwnProperty(key)) {
                    var value = object[key];
                    localStorage.setItem(key,value);
                }
            }
            sendResponse({data: localStorage});
            break;
        case 'notify':
            var notificationsMsg=request.data;
            show_notification(notificationsMsg);
            sendResponse({data:localStorage});
            break;
        case 'openSettings':
            chrome.tabs.create({url: chrome.runtime.getURL("options.html")+'#'+request.anchor});
            sendResponse({data:{tabid:sender.tab.id}});
            break;
        default :
            sendResponse({data:[]}); // snub them.
    }
});

chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
    var tabid = sender.tab.id;
    console.log("received "+message.data)
    switch(message.action) {
        case 'is_user_signed_on':
            isUserSignedOn();
            break;
        case 'lookup':
            isUserSignedOn(function() {
                getClickHandler(message.data, sender.tab);
            });
            break;
    }
});

function show_notification(notificationsMsg){
    var notification = webkitNotifications.createNotification("./weather_plugin.png", "提醒",notificationsMsg );
    notification.addEventListener('click', function () {
        notification.cancel();
        chrome.tabs.create({
            url:"http://tianqi.2345.com"
        })
    });
    setTimeout(function(){
        notification.cancel();
    },10000);
    notification.show();
}

function notify(){
    var list=JSON.parse(localStorage['planList']);
    var indices=JSON.parse(localStorage['indices_name']);
    var first_notify=1;
    if(localStorage['first_notify']!=undefined)
        first_notify=parseInt(localStorage['first_notify']);
    var date=new Date();
    var currentTime=date.getTime();
    var notifications=list.filter(function(item){
        //提前60min提醒
        if (item.timestamp<currentTime+first_notify*60*60*1000 || localStorage['notify_reg']=='oclock'){

          var show_indices=[item.yiIndex,item.yuIndex,item.dongIndex,item.ganIndex,item.shaiIndex,item.mingIndex,item.xiIndex,item.diaoIndex];
          console.log("indices selected:");
          console.log(show_indices);
          var indices_msg=indices.filter(function(e,i){
                return show_indices[i]==1;
          }).join('，');
          show_notification('【'+item.calendarTime+"】【"+item.planTitle+'】'+indices_msg)
        }
    });
/*    //右下角的提醒
    chrome.extension.sendMessage({
        method: 'notify',
        action: 'notify',
        data: notifications
    },function(resp){
        console.log(resp.data)
    });*/
    chrome.browserAction.setBadgeText({text: localStorage['temp']});
}

function notify_helper(){
    var inter=60;
    if(localStorage['interval']!=undefined)
        inter=parseInt(localStorage['interval']);
    notify();
    setTimeout(function(){
        notify_helper()
    },inter*60*1000);
}

$(function(){
    chrome.browserAction.setBadgeText({text: localStorage['temp']});
    if(localStorage['notify_on_start']!='no')
        notify();
    var interval=60;//60 min提醒一次。
    if(localStorage['notify_reg']=='oclock'){
        localStorage['interval']=60;
        var d=new Date();
        interval= 60-d.getMinutes();
    }
    setTimeout(function(){
        notify_helper()
    },interval*60*1000);
});