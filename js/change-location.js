/**
 *
 *�л�����,GB18030���롣
 */

var contentType="text/html;charset=GB18030";

var provinces=[];

$(function(){
    var ppp=ls()['provinces'];
    if(undefined!=ppp)
    provinces=ppp;//�洢���г���������Ӧ����id���ݣ�3k�����ҡ�
    //��ȡ�������������ݡ�
    request_in_mime('http://tianqi.2345.com/js/citySelectData.js',function(rsp){
        eval(rsp);
        //�������ݽ�����ȥ����������
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
        ls_set({provinces:provinces});//�洢���������ؼ�ʱʹ�á�
    },contentType);

    $('#otherCity').autocomplete({
        source:function(req,response){
            //�л��������������
            var key=$('#otherCity').val();
            if(key.length>0){
                //�л����й���������
                var url='http://tianqi.2345.com/t/q_lx.php?city='+req.term;
                console.log("requesting "+url);
                request_in_mime(url,function(rsp){
//                        console.log(rsp);
                        var reg=/\[[\s\S]+\]/;
                        var src=$.parseJSON(reg.exec(rsp)[0].replace(/'/g,'"')).map(function(e){
//                            console.log(e);
                            var arry= e.split('|');
                            //ȡ���������֣�������autocomplete�����ʽ��
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
            //����autocompleteѡ������
            var name=$('#otherCity').val();
            console.log(name + "chosen");
            var city=provinces.filter(function(c){
                    return c.indexOf(name)>=0;
                });//�ҵ���������Ӧ��id
                if(city.length>=1){
                    console.log(city);
                    air_condition_with_city_id(city[0].split('-')[0],process);
                }

            }
    });
});

/**
 *
 * //ȡ����ǰСʱ���������
 * http://tianqi.2345.com/t/wea_hour_js/58457.js
 * http://tianqi.2345.com/js/citySelectData.js
 * http://tianqi.2345.com/t/shikuang/58457.js
 * @param city_id
 * @param callback
 */


function realtime_condition(city_id,callback){
    var url='http://tianqi.2345.com/t/wea_hour_js/'+city_id+'.js';
    request_in_mime(url,function(rsp){
        var reg=/\[[\s\S]+?\]/;
        var hour=(new Date()).getHours();//��ǰʱ���Сʱ��

        var rt=$.parseJSON(reg.exec(rsp)[0]);
        console.log(rt);
        callback(rt[hour]);
    },contentType);
    return true;
}

/**
 * ����������⣬��װmime_string����������ݡ�
 * �ο�����request
 * @param url
 * @param callback
 * @param mime_string
 * @param request_headers
 */
function request_in_mime(url,callback,mime_string,request_headers){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type",mime_string);
    xhr.overrideMimeType(mime_string);
    if(request_headers!=undefined){
        for(var h in request_headers){
            xhr.setRequestHeader(h,request_headers[h]);
        }
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
//            console.log(xhr.response);
            callback(xhr.response.replace(/<img[\s\S]+?\/>/g,""));
        }
    };
    xhr.send();
    console.log("GETing "+url);
}

function request_in_mime_on_load(url,callback,mime_string,request_headers){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-type",mime_string);
    if(request_headers!=undefined){
        for(var h in request_headers){
            xhr.setRequestHeader(h,request_headers[h]);
        }
    }
    xhr.overrideMimeType(mime_string);
    xhr.onloadend = function () {
        if (xhr.status == 200 )
        {
//            console.log(xhr.response);
            callback(xhr.response.replace(/<img[\s\S]+?\/>/g,""));
        }
    };
    xhr.send();
    console.log("GETing "+url);
}