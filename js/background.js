
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
            var notifications=request.data.map(function(item){
               return item.time + ' '+item.title
            }).join('\n');
            var notification = webkitNotifications.createNotification("images/weather.png", "提醒",notifications );
            notification.addEventListener('click', function () {
                notification.cancel();
                chrome.tabs.create({
                    url:"http://tianqi.2345.com"
                })
            })
            setTimeout(function(){
                notification.cancel();
            },5000);
            notification.show();
            sendResponse({data:{tabid:sender.tab.id}});
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