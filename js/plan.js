$(function(){
	/*
	$( '#tabTitle' ).on( 'click', function( e ){
		var target = e.target;
		$( '.tab' ).hide();
		$( '#'+$( target ).data( 'index' ) ).show()
	});
	chrome.storage.sync.clear( function(){
		console.log( 'clear success' );
	});
	*/
	
	function objExist( obj ){
		for( var item in obj ){
			return true;
		}
		return false;
	}
	var now = new Date(),
		curTimestamp = now.getTime(),
		curDate = now.getFullYear()+'-'+( now.getMonth()+1 )+'-'+now.getDate(),
		timeStart = new Date( curDate+' 00:00:00' ).getTime(), 
		timeEnd = timeStart+604800000;
	
	var planList = [];
	chrome.storage.sync.get( 'plans', function( planLists ){
		console.log( planLists.plans );
		if( objExist( planLists ) ){
			for( var i=0; i<planLists.plans.length; i++ ){
				//console.log( planLists.plans[i] );
				if( parseInt( planLists.plans[i].repeatTime ) == 0 ){
				// 判断单次计划
					if( planLists.plans[i].timestamp < timeEnd && planLists.plans[i].timestamp > curTimestamp ){
						planList.push( planLists.plans[i] );
					}
				}else if( planLists.plans[i].repeatTime == 1 ){
				// 判断按天重复计划
					// 存储重复计划设计的当天的0点0分0秒的时间戳，为后面判断是否在当前时间范围内提供起始时间坐标
					console.log( planLists.plans[i] );
					var repeatDayTimestamp = new Date( planLists.plans[i].calendarDay+' 00:00:00' );
					var intervalDay = ( timeStart - repeatDayTimestamp )/86400000,
						repeatCycle = parseInt( planLists.plans[i].repeatDay ),
						inListStartDay = 0;
					while( intervalDay%repeatCycle != 0 ){
						intervalDay++;
					}
					inListRepeatStart = planLists.plans[i].timestamp+86400000*( intervalDay );
					console.log( inListRepeatStart );
					var thisTimestamp = inListRepeatStart;
					while( thisTimestamp < timeEnd ){						
						var obj = {
							calendarTime : planLists.plans[i].calendarTime,
							diaoIndex : planLists.plans[i].diaoIndex,
							dongIndex : planLists.plans[i].dongIndex,
							ganIndex : planLists.plans[i].ganIndex,
							mingIndex : planLists.plans[i].mingIndex,
							shaiIndex : planLists.plans[i].shaiIndex,
							xiIndex : planLists.plans[i].xiIndex,
							yiIndex : planLists.plans[i].yiIndex,
							yuIndex : planLists.plans[i].yuIndex,
							planTitle : planLists.plans[i].planTitle,
							timestamp : thisTimestamp
						}
						planList.push( obj );
						thisTimestamp += 86400000*repeatCycle;
					}
				}else if( parseInt( planLists.plans[i].repeatTime ) == 2 ){
				// 判断按星期重复计划
					
					var repeatDayTimestamp = new Date( planLists.plans[i].calendarDay+' 00:00:00' );
					var intervalDay = ( timeStart - repeatDayTimestamp )/86400000;
					if( planLists.plans[i].repeatWeek == '一' ){
						var repeatWeek = 0;
					}else if( planLists.plans[i].repeatWeek == '二' ){
						var repeatWeek = 1;
					}else if( planLists.plans[i].repeatWeek == '三' ){
						var repeatWeek = 2;
					}else if( planLists.plans[i].repeatWeek == '四' ){
						var repeatWeek = 3;
					}else if( planLists.plans[i].repeatWeek == '五' ){
						var repeatWeek = 4;
					}else if( planLists.plans[i].repeatWeek == '六' ){
						var repeatWeek = 5;
					}else if( planLists.plans[i].repeatWeek == '七' ){
						var repeatWeek = 6;
					}
				
					for( var j=0; j<7; j++ ){
						intervalDay++;
						if( ( now.getDay()+j )%7 == repeatWeek ){
							var plantime = planLists.plans[i].timestamp + 86400000*intervalDay;
							
							var obj = {
								calendarTime : planLists.plans[i].calendarTime,
								diaoIndex : planLists.plans[i].diaoIndex,
								dongIndex : planLists.plans[i].dongIndex,
								ganIndex : planLists.plans[i].ganIndex,
								mingIndex : planLists.plans[i].mingIndex,
								shaiIndex : planLists.plans[i].shaiIndex,
								xiIndex : planLists.plans[i].xiIndex,
								yiIndex : planLists.plans[i].yiIndex,
								yuIndex : planLists.plans[i].yuIndex,
								planTitle : planLists.plans[i].planTitle,
								timestamp : plantime
							}
							planList.push( obj );
							break;
						}
					}
				}
			}
		}
		//planList.sort( sortByTimeStamp );
		console.log( planList );
		$( "#activePlan" ).html( fillPage( timeStart, planList.sort( sortByTimeStamp ) ) );
	});
	/*
	chrome.storage.sync.get( 'oncePlan', function( objs ){
		// tmptimestamp 存储当天时间的起始点，即当天的0点0分0秒的时间戳，用于fillPage函数中做判断 = timeStart
		//var tmptimestamp = new Date( now.getFullYear()+'-'+( now.getMonth()+1 )+'-'+now.getDate() ).getTime();
		if( objExist( objs ) ){
			if( objs.oncePlan[ objs.oncePlan.length-1 ].timestamp < timeStart ){
				console.log( 'all plan are out of date' );
				// 将所有的日程清空
			}
			if( objs.oncePlan[0].timestamp >= timeEnd ){
				console.log( 'no exist plan' );
				// 展示空日程
				$( "#activePlan" ).html( fillPage( timeStart, [] ) );
			}else{
				console.log( objs );
				var planList = []
				// 处理日程列表，保证传递给fillPage函数的日程都是有效日程
				for( var i in objs.oncePlan ){
					if( objs.oncePlan[i].timestamp < timeEnd && objs.oncePlan[i].timestamp > curTimestamp ){
						planList.push( objs.oncePlan[i] );
					}
				}
				console.log( planList );
				
		//		console.log( now.getFullYear() );
		//		console.log( now.getMonth() );
		//		console.log( now.getDate() );
		//		console.log( curTimestamp );
		//		console.log( tmptimestamp );
				
				$( "#activePlan" ).html( fillPage( timeStart, planList ) );
			}
		}
	});
	*/
	// timestamp 存储当前的时间戳
	// planList 存储所有的日程
	function fillPage( timestamp, planList){
		var str = '';
		var planListPos = 0;		//定位上一日的日程在日程列表中的位置，可以避免每天取日程都从日程列别的头部重复循环
		for( var i = 0; i<7; i++ ){
			if( i%2 == 0 ){
				str +=  '<li class="odd">';
			}else{
				str += '<li class="even">';
			}
			var tmpDate = new Date( timestamp + 86400000*i );
		//	console.log( timestamp + 86400000*i );
			str += '<p>'+tmpDate.getFullYear()+'年'+( tmpDate.getMonth()+1 ) +'月'+( tmpDate.getDate() )+'日</p>\
					<div class="operator_box">';
			if( planListPos >= planList.length ){
				str += '<p>无日程</p>';
			}else{
				var filled = false; // 阻止重复填充“无日程”到计划列表中去
				for( ; planListPos<planList.length; planListPos++ ){
					if( planList[planListPos].timestamp >= timestamp+86400000*(i+1) ){
						if( !filled ){
							str += '<p>无日程</p>';
						}
						filled = true;
						//planListPos--;
						break;
					}
					filled = true;
					str += '<div class="clearfix each_operator">\
								<span class="time">'+planList[planListPos].calendarTime+'</span>\
								<p class="plan">'+planList[planListPos].planTitle;
					if( planList[planListPos].yuIndex == 1 ){
						str += '<span class="weather_icon yu_icon"></span>';
					}
					if( planList[planListPos].yiIndex == 1 ){
						str += '<span class="weather_icon yi_icon"></span>';
					}
					if( planList[planListPos].dongIndex == 1 ){
						str += '<span class="weather_icon dong_icon"></span>';
					}
					if( planList[planListPos].ganIndex == 1 ){
						str += '<span class="weather_icon gan_icon"></span>';
					}
					if( planList[planListPos].mingIndex == 1 ){
						str += '<span class="weather_icon ming_icon"></span>';
					}
					if( planList[planListPos].shaiIndex == 1 ){
						str += '<span class="weather_icon shai_icon"></span>';
					}
					if( planList[planListPos].xiIndex == 1 ){
						str += '<span class="weather_icon xi_icon"></span>';
					}
					if( planList[planListPos].diaoIndex == 1 ){
						str += '<span class="weather_icon diao_icon"></span>';
					}
					str += '</p></div>';			
				}
			}
			str += '</div></li>';
		}
		return str;
	}
	// startTimestamp 为当前时间 
	// initStartTimestamp 为当天的0点0分0秒的时间戳
	function getPlanList( startTimestamp, endTimestamp, initStartTimestamp ){
		var planList = [];
		chrome.storage.sync.get( 'plans', function( planLists ){
			if( objExist( planLists ) ){
				for( var i=0; i<planLists.plans.length; i++ ){
					if( planLists.plans[i].repeatTime == 0 ){
					// 判断单次计划
						if( planLists.plans[i].timestamp < timeEnd && planLists.plans[i].timestamp > curTimestamp ){
							planList.push( planLists.plans[i] );
						}
					}else if( planLists.plans[i].repeatTime == 1 ){
					// 判断按天重复计划
						// 存储重复计划设计的当天的0点0分0秒的时间戳，为后面判断是否在当前时间范围内提供起始时间坐标
						var repeatDayTimestamp = new Date( planLists.plans[i].calendarDay+' 00:00:00' );
						var intervalDay = ( initStartTimestamp - repeatDayTimestamp )/86400000,
							repeatCycle = parseInt( planLists.plans[i].repeatDay ),
							inListStartDay = 0;
						while( intervalDay%repeatCycle != 0 ){
							inListStartDay++;
						}
						inListRepeatStart = planLists.plans[i].timestamp+86400000*( intervalDay+inListStartDay );
						var thisTimestamp = inListRepeatStart;
						while( thisTimestamp < endTimestamp ){						
							var obj = {
								calendarTime : planLists.plans[i].calendarTime,
								diaoIndex : planLists.plans[i].diaoIndex,
								dongIndex : planLists.plans[i].dongIndex,
								ganIndex : planLists.plans[i].ganIndex,
								mingIndex : planLists.plans[i].mingIndex,
								shaiIndex : planLists.plans[i].shaiIndex,
								xiIndex : planLists.plans[i].xiIndex,
								yiIndex : planLists.plans[i].yiIndex,
								yuIndex : planLists.plans[i].yuIndex,
								planTitle : planLists.plans[i].planTitle,
								timestamp : thisTimestamp
							}
							planList.push( obj );
							thisTimestamp += 86400000*intervalDay;
						}
					}else if( planLists.plans[i].repeatTime == 2 ){
					// 判断按星期重复计划
					}
				}
			}
		});
		return planList;
	}
	function sortByTimeStamp( a, b ){
		return a.timestamp - b.timestamp;
	}
});