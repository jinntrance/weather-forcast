

var contentTypeUTF8="text/html;charset=UTF-8";

/**
 * ��ȡ��ǰPC����IP���ڵĳ���ID������ȡʵʱ������δ������ָ�������ݡ�
 * @see http://tianqi.2345.com/t/tq_common_json/58457.json
 */
function air_condition(callback){
    var pre_url="http://tianqi.2345.com/t/detect2012_json.php";
    request(pre_url,function(rsp){
        console.log(rsp);
        var reg=/\d+/g;
        var city_id=reg.exec(rsp)[0];
        air_condition_with_city_id(city_id,callback);
        //realtime_condition_from_wcn(city_id,callback)
    })
}
/**
 * ����й��������Ķ�Ӧ�ĳ���ID��������2345�Ĳ�һ�£�
 * http://tianqi.2345.com/t/shikuang/58457.js
 * @param city_id
 * @param callback
 */
function realtime_condition_from_wcn(city_id,callback){
    var url='http://tianqi.2345.com/t/shikuang/'+city_id+'.js';
    request(url,function(rsp){
        eval(rsp);//����jsonp
        console.log("cn weather city id is:");
        var new_city_id=weatherinfovar.weatherinfo.cityid;//�й��������Ķ�Ӧ�ĳ���ID
        console.log(new_city_id);
        weather_info(new_city_id,callback);
    })
}

/**
 *
 * @param city_id ����2345�ϵĳ���id
 * @param callback
 */
function air_condition_with_city_id(city_id,callback){
    var weather_temp=undefined;
    var url="http://tianqi.2345.com/t/tq_common_json/"+city_id+".json";
    realtime_condition(city_id,function(w){
        if(undefined!=w) {
            ls_set(w);
            weather_temp=w;
        }
    });

    request(url,function(rsp){
        var json=$.parseJSON(rsp);
        //��ȡδ��һ�ܵ�����
//        var week=[json.day1,json.day2,json.day3,json.day4,json.day5,json.day6,json.day7];
        var week=[json.day2,json.day3,json.day4,json.day5,json.day6,json.day7];
        var today=json.day1;
        if(weather_temp==undefined)
            ls_set({
                tq:today.weather,
                temp:today.tempLow+'+'

            });
        ls_set(json);
        ls_set({
            today:today.tempLow+'~'+today.tempHigh
        });
        console.log("fetched json: ");
        console.log(json);
        var new_url="http://tianqi.2345.com/"+json.pinyin+"/"+city_id+".htm";
        request_in_mime_on_load(new_url,function(response){
            var reg=/<ul[\s\S]+?<\/ul>/g;
            var uls=response.match(reg).filter(function(ul){
                return ul.indexOf('lifeindex')>=1
            });
            console.log("all uls:");
            console.log(uls);
//            if(undefined!=uls&&uls.length==1) {
            var rsp = $(response);
            console.log(rsp);
            console.log("life_data is:");
            console.log(rsp.find('#life_data').text());
//                var str=cond.find('em a').html()+"("+cond.find('b a').html()+")";
            callback({
                week: week,
                indices_name: rsp.find('ul.lifeindex .des h4').map(function (item) {
                    console.log(item);
                    console.log("name:" + $(this).text());
                    return $(this).text();//��ȡָ������
                }).toArray(),
                indices: rsp.find('ul.lifeindex .des p').map(function (item) {
                    console.log("content:" + $(this).text());
                    return $(this).text();//��ȡָ����Ӧ����
                }).toArray()
            })
        },contentType,{
            Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
//           'Accept-Encoding':'gzip,deflate,sdch',
         'Accept-Language':'zh,en-US;q=0.8,en;q=0.6,en-GB;q=0.4,fr;q=0.2,zh-TW;q=0.2,zh-CN;q=0.2',
         'Cache-Control':'max-age=0'
//         'Cookie':'defaultCityID='+city_id+'; wc='+city_id+'; lc='+city_id+'; lc2='+city_id+';',
//          'Origin':'http://tianqi.2345.com/'
//         'Connection':'keep-alive',
//            'Host':'tianqi.2345.com',
//            Referer:new_url,
//            'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36'
        })
    })
}

/**
 * �й��������ϵ������������Ҫ��ָ�����������ĳ�����2345��
 * @see http://m.weather.com.cn/data/101210101.html
 * @param city_id
 * @param callback
 */
function weather_info(city_id,callback){
    var url="http://www.weather.com.cn/weather/"+city_id+".shtml";
    request_in_jquery(url,function(rsp){
        var weather=$($.parseHTML(rsp));
        var prediction=[];
        weather.find('table.yuBaoTable').each(function(index) {

            if(2==$(this).find('tr').size()) {
                console.log("pushing "+index);
                console.log($(this));
                prediction.push({
                    title: $(this).find('td.t0').text(),
                    temp_day: $(this).find('strong')[0].innerHTML,
                    temp_night: $(this).find('strong')[1].innerHTML,
                    cond_day: $($(this).find('tr')[0]).find('td')[3].textContent,
                    cond_night: $($(this).find('tr')[1]).find('td')[3].textContent,
                    wind_day: $($(this).find('tr')[0]).find('td')[6].textContent
                    //wind_night: $($(this).find('tr')[1]).find('td')[6].textContent
                });
            }
        });
        console.log(weather.find('.zs li'));
        var indices = weather.find('.zs li').map(function(item){
            return {
                title: $(item).find('h3').text(),
                detail: $(item).find('aside').html()
            }
        });
        var reg=/\w+/g;
        callback({
//            week:prediction,
            indices:indices
        });
    });

}



function weather_in_days_of(number){
    var url="http://tianqi.2345.com/plugin/widget/index.htm?s=1&z=1&t=1&v=0&d=6&k=&f=1&q=1&e=1&a=1&c=54512&w=810&h=98"
    //��Ѷ���� http://weather.news.qq.com/index2012/js/autoSearch_v3.js
    //http://weather.news.qq.com/
}
/**
 * remove the item at index i from array
 * @param array
 * @param i
 */
function removeFrom(array,i){
    var a=array.slice(0,i).concat( array.slice(i+1));
    array=a;
    return a;
}

//����ͨ�ţ���chrome.storage��ȡ�����ڱ���localStorage��
function ls(){
    chrome.extension.sendRequest({method: "getLocalStorage"}, function (response) {
        for (var k in response.data)
            localStorage[k] = response.data[k];
        return localStorage;
    });
    return localStorage;
}

//����ͨ�ţ��ѱ���localStorage����chrome.storage���Ա�ͬ����
function ls_set(data){
    for (var k in data)
        localStorage[k] = data[k];
    chrome.extension.sendRequest({method: "setLocalStorage",data:data}, function (response) {
        for (var k in response.data)
            localStorage[k] = response.data[k];
    });
    return localStorage;
}

/**
 * ����url����callback����
 * @param url
 * @param callback
 */
function request(url,callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);//GET url�����ݲ��첽����
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200 ) {
//            console.log(responseText);
            callback(xhr.responseText.replace(/<img[\s\S]+?\/>/g,""));//ȥ������<img/>��ǩ�Է�ֹ����ʱ�������ܻ�ȡ��ͼƬ����
        }
    };
    xhr.send();
    console.log("GETing "+url);
}

function request_in_jquery(url,callback){
    $.get(url,function (rsp) {
      callback(rsp.replace(/<img[\s\S]+?\/>/g,""));//ȥ������<img/>��ǩ�Է�ֹ����ʱ�������ܻ�ȡ��ͼƬ����

    });
    console.log("GETing "+url);
}

/**
 * �Ȳ���jsִ�к�(onload)�ŵ���callback
 * @param url
 * @param callback
 */
function request_on_load(url,callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function () {
        if (xhr.status==200) {
//            console.log(xhr.responseText);
            var data=xhr.responseText.replace(/<img[\s\S]+?\/>/g,"");
            callback(data);

        }
    };
    xhr.send();
    console.log("GETing "+url);

}
