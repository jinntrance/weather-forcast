/**
 *
 */

$(function(){
   //即时显示历史存储的相关数据，增强用户体验
   show_weather(ls());

    //
   air_condition(process);
});

function find_exact_img(weather,size) {
    if(size=='64') size="64";
    else size='40';
    var img = "images/icons/weather_icon_"+size+'_';
    //把天气状况转化成对应的icon
    var dict={
        '晴': '01',
        '多云': '02',
        '阴': '03',
        '雾': '04',
        '小雨': '05',
        '中雨': '06',
        '大雨': '07',
        '暴雨': '08',
        '雷雨': '09',
        '冰雹': '10',
        '雨雪': '11',
        '小雪': '12',
        '中雪': '13',
        '大雪': '14',
        '暴雪': '15',
        '阵雨': '16',
        '阵雪': '17',
        '霾': '18',
        '': '19'
    };

    var icon=undefined;
    if(weather!=undefined){
        icon=dict[weather[weather.length-1]];
        if(icon==undefined)
            icon=dict[weather.substr(weather.length-2,2)];
    }

    if(icon==undefined)
        icon='19';
    img+=icon;
    return img+'.png';
}
/**
 * 显示未来一周天气
 * @param pre_in_6
 */
function show_condition_weekly(pre_in_6) {
    if (undefined != pre_in_6) {
        var html = pre_in_6.map(function (day, index) {
            var tag = index == 5 ? ' last' : '';
            var img = find_exact_img(day.weather);
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
 * 处理并在页面上展示数据
 * @param data
 */
function process(data){
    console.log(data);
    ls_set({
        week:JSON.stringify(data.week)
    });
    if(data.indices.length>=8&&data.indices.length==data.indices_name.length)
    ls_set({
        indices_name:JSON.stringify(data.indices_name),
        indices:JSON.stringify(data.indices)
    });
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
        var pinyin=undefined;
        if(w.pinyin!=undefined) pinyin= w.pinyin.toUpperCase();
        var maps = [
            ['cityname', w.city],
            ['temp', w.temp],
            ['condition', w.tq],
            ['cityname_en', pinyin],
            ['time', w.hour],
            ['weatherIndex', w.aqi+"("+air_condition_desc(w.aqi)+")"]
        ];
        set_values(maps);
        $('#current_condition').attr('src',find_exact_img(w.tq,'64'))
    }
    console.log("week data: ");
    console.log(w.week);
    if(undefined!=w.week)    {
        show_condition_weekly(JSON.parse(w.week));
        //各类指数显示
        console.log('life index:');

        var indices_name=JSON.parse(w['indices_name']);//指数的Titles
        var indices=JSON.parse(w['indices']);//指数具体内容提示
        var pre_in_6=JSON.parse(w['week']);//未来6天天气
        console.log(indices);
        console.log(indices_name);

//    var pre_in_6=data.week.slice(1,7);//未来6天天气
        if(undefined!=indices&&indices.length>1){
            $('#weather_index_box').html('');
            indices.forEach(function(content,i){
                console.log("index content:"+content);
                var div='<div class="T_weather_each_index">' +
                    '<p>'+indices_name[i]+'</p><div>'+content+'</div></div>';
                $('#weather_index_box').append(div);//在页面上添加天气指数
            });
            //找到对应的四个天气指数并添加，后面需要做成左右可滑动的。
            /*        set_values([
             ['umbrellaIndex div',indices.filter(function(e){return e.title==="雨伞指数"})[0].detail],
             ['clothIndex div',indices.filter(function(e){return e.title==="穿衣指数"})[0].detail],
             ['sportIndex div',indices.filter(function(e){return e.title==="运动指数"})[0].detail],
             ['coldIndex div',indices.filter(function(e){return e.title==="感冒指数"})[0].detail]
             ]);*/
        }
    }
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
var enableScroll = true;
function scroll( container, eachScrollWidth, direction){
	if( !enableScroll ){
		return false;
	}
	if( direction == 1 ){
	// 向左滑动
		enableScroll = false;
		$( container ).animate({
			left : "-="+eachScrollWidth
		}, 400, function(){
			enableScroll = true;
		});
	}else if( direction == 2 ){
	// 向右滑动
		enableScroll = false;
		$( container ).animate({
			left:"+="+eachScrollWidth
		}, 400, function(){
			enableScroll = true;
		});
	}
}
$( '#scrollRight' ).on( 'click', function( e ){
	e.preventDefault();
	console.log( parseInt( $( "#scrollerBox" ).css( "left" ) ) );
	var left = parseInt( $( "#scrollerBox" ).css( "left" ) );
	if( left >= 0 ){
		$( '#scrollerBox' ).css( "left","0px" );
		return false;
	}else if( left >= -124 ){
		$( '#scrollRight' ).hide();
	}
	scroll( "#scrollerBox", 124, 2 );
	if( $( '#scrollLeft' ).is( ":hidden" ) ){
		$( '#scrollLeft' ).show();
	}	
});
$( '#scrollLeft' ).on( 'click', function( e ){
	console.log( 'scroll left' );
	var left = parseInt( $( "#scrollerBox" ).css( "left" ) );
	if(  left <= -496 ){
		$( '#scrollerBox' ).css( "left","-496px" );
		return false;
	}else if( left <= -372 ){
		$( '#scrollLeft' ).hide();
	}
	scroll( "#scrollerBox", 124, 1 );
	if( $( '#scrollRight' ).is( ':hidden' ) ){
		$( '#scrollRight' ).show();
	}
});
