/**
 *
 */

$(function(){
   //即时显示历史存储的相关数据，增强用户体验
   show_weather(ls());
/*   weather_condition("realtime",function(wi){
       var w=wi.weatherinfo;

       if(undefined!=w) {
           ls_set(w);
           show_weather(w)
       }
   });*/

   air_condition(process);
});

function show_condition_weekly(pre_in_6) {
    if (undefined != pre_in_6) {
        var html = pre_in_6.map(function (day, index) {
            var tag = index == 5 ? ' last' : '';
            var img = "images/weather_icon/";
            //把天气状况转化成对应的icon
            switch (day.weather) {
                case '小雨':
                    img += "1.png";
                    break;
                case '阵雨':
                    img += "2.png";
                    break;

                case '阴':
                    img += "4.png";
                    break;

                case '晴':
                    img += "5.png";
                    break;

                case '多云':
                    img += "6.png";
                    break;
                default :
                    img += "3.png";
            }
            var div = '<div class="T_weather_week_each ' + tag + '">' +
                '<p class="week_calendar">' + day.month + '/' + day.day + '周' + day.week + ' </p>' +
                '<img src="' + img + '" alt="" />' +
                '<p class="week_each_temperature">' + day.tempLow + '~' + day.tempHigh + '℃</p></div>';
            return div;
        }).join("");
        //在页面上添加拼接好的未来几天天气情况。
        $('#prediction_in_week').html(html);
    }
}
/**
 * 处理并再页面上展示数据
 * @param data
 */
function process(data){
    console.log(data);
    var indices_name=data.indices_name;//指数的Titles
    var indices=data.indices;//指数具体内容提示
    var pre_in_6=data.week;//未来6天天气
//    var pre_in_6=data.week.slice(1,7);//未来6天天气
    ls_set({week:JSON.stringify(pre_in_6)});
    if(undefined!=indices&&indices.length>1){
        $('#weather_index_box').html('');
        indices.forEach(function(content,i){
            console.log("index content:"+content);
            var div='<div class="T_weather_each_index">' +
                '<p>'+indices_name[i]+'</p><div>'+content+'</div></div>';
            $('#weather_index_box').append(div);//在页面上添加天气指数
        });
        //找到对应的四个天气指数并添加，后面需要做成左右可滑动的。
        set_values([
            ['umbrellaIndex div',indices.filter(function(e){return e.title==="雨伞指数"})[0].detail],
            ['clothIndex div',indices.filter(function(e){return e.title==="穿衣指数"})[0].detail],
            ['sportIndex div',indices.filter(function(e){return e.title==="运动指数"})[0].detail],
            ['coldIndex div',indices.filter(function(e){return e.title==="感冒指数"})[0].detail]
        ]);
    }
    show_weather(ls());
}

/**
 * 找到mapping中id为key的元素并把innerHTML改成对应的value
 * @param mapping
 */
function set_values(mapping){
    mapping.forEach(function(e){
        console.log("handling "+e[0] );
        console.log(e[1]);
        if(undefined!=e)
            $('#'+e[0]).html(e[1]);
    })
}

//展示实时天气情况，后面可以把所有数据都本地化，不然每次都重新获取体验不好。
function show_weather(w){
    if(undefined!=w) {
        console.log(w);
        var maps = [
            ['cityname', w.city],
            ['temp', w.temp],
            ['condition', w.tq],
            ['cityname_en', w.cityname_en],
            ['time', w.hour],
            ['weatherIndex', w.aqi+"("+air_condition_desc(w.aqi)+")"]
        ];
        set_values(maps);
    }
    if(undefined!=w.week)
    show_condition_weekly(JSON.parse(w.week));
}

function air_condition_desc(aqi_string){
    var aqi=parseInt(aqi_string);
    if(aqi<=50) return "优";
    else if (aqi<=100) return "良好";
    else if (aqi<=150) return "轻度污染";
    else if (aqi<=200) return "中度污染";
    else if (aqi<=300) return "重度污染";
    else if(aqi>300) return "严重污染";
    else return "无数据";

}
