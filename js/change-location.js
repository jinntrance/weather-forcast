/**
 *
 *切换城市,GB18030编码。
 */

var contentType="text/html;charset=GB18030";

var provinces= $.parseJSON(ls()['provinces']);//存储所有城市名及对应城市id数据，3k条左右。

$(function(){
    //获取并解析城市数据。
    request_in_mime('http://tianqi.2345.com/js/citySelectData.js',function(rsp){
        eval(rsp);
        //城乡数据解析，去除多余数据
        var prov=[];
        provqx.map(function(p){
            p.map(function(item){
               item.split('|').map(function(city){
                    var c=city.split(' ');
                    prov.push(city);
                })

            })
        });
        provinces=prov;
        ls_set({provinces:JSON.stringify(provinces)});//存储下来，本地即时使用。
    },contentType);

    $('#otherCity').autocomplete({
        source:function(req,response){
            //切换城市输入框内容
            var key=$('#otherCity').val();
            if(key.length>0){
                //切换城市过程中搜索
                var url='http://tianqi.2345.com/t/q_lx.php?city='+req.term;
                console.log("requesting "+url);
                request_in_mime(url,function(rsp){
//                        console.log(rsp);
                        var reg=/\[[\s\S]+\]/;
                        var src=$.parseJSON(reg.exec(rsp)[0].replace(/'/g,'"')).map(function(e){
//                            console.log(e);
                            var arry= e.split('|');
                            //取出城市名字，并返回autocomplete所需格式。
                            return {
                                label:e,
                                value:arry[0]
                            }
                        });
//                        console.log(src)
                        response(src);
                    },contentType
                );

            }

        },
        close:function(evt,ui){
//            var name=ui.item.value;
            //结束autocomplete选择后调用
            var name=$('#otherCity').val();
            console.log(name + "chosen");
            var city=provinces.filter(function(c){
                    return c.indexOf(name)>=0;
                });//找到城市名对应的id
                if(city.length>=1){
                    console.log(city);
                    air_condition_with_city_id(city[0].split('-')[0],process);
                }

            }
    });
});

/**
 *
 * //取出当前小时的天气情况
 * http://tianqi.2345.com/t/wea_hour_js/58457.js
 * http://tianqi.2345.com/js/citySelectData.js
 * http://tianqi.2345.com/t/shikuang/58457.js
 * @param city_id
 */


function realtime_condition(city_id,callback){
    var url='http://tianqi.2345.com/t/wea_hour_js/'+city_id+'.js';
    request_in_mime(url,function(rsp){
        var reg=/\[[\s\S]+?\]/;
        var hour=(new Date()).getHours();//当前时间的小时。

        var rt=$.parseJSON(reg.exec(rsp)[0]);
        console.log(rt);
        callback(rt[hour]);
    },contentType)
}

/**
 * 解决编码问题，安装mime_string编码解析数据。
 * 参看函数request
 * @param url
 * @param callback
 * @param mime_string
 */
function request_in_mime(url,callback,mime_string){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type",mime_string);
    xhr.overrideMimeType(mime_string);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 ) {
//            console.log(xhr.response);
            callback(xhr.response.replace(/<img[\s\S]+?\/>/g,""));
        }
    };
    xhr.send();
    console.log("GETing "+url);
}

function request_in_mime_on_load(url,callback,mime_string){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type",mime_string);
    xhr.overrideMimeType(mime_string);
    xhr.onload = function () {
        if (xhr.readyState == 4 ) {
//            console.log(xhr.response);
            callback(xhr.response.replace(/<img[\s\S]+?\/>/g,""));
        }
    };
    xhr.send();
    console.log("GETing "+url);
}