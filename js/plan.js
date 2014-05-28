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
		var newPlanList = [];
		if( objExist( planLists ) ){
			for( var i=0; i<planLists.plans.length; i++ ){
				//console.log( planLists.plans[i] );
				if( parseInt( planLists.plans[i].repeatTime ) == 0 ){
				// 判断单次计划，如果在时间范围内则添加到待展示列表，否则如果已经过了时间，则删除掉
					if( planLists.plans[i].timestamp >= curTimestamp ){
						newPlanList.push( planLists.plans[i] );
						if( planLists.plans[i].timestamp < timeEnd ){
							planList.push( planLists.plans[i] );
						}
					}
					/*
					if( planLists.plans[i].timestamp < timeEnd && planLists.plans[i].timestamp >= curTimestamp ){
						planList.push( planLists.plans[i] );
					}
					*/
				}else if( planLists.plans[i].repeatTime == 1 ){
				// 判断按天重复计划
					newPlanList.push( planLists.plans[i] );
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
							timestamp : thisTimestamp,
							repeatTime : planLists.plans[i].repeatTime
						}
						planList.push( obj );
						thisTimestamp += 86400000*repeatCycle;
					}
				}else if( parseInt( planLists.plans[i].repeatTime ) == 2 ){
				// 判断按星期重复计划
					newPlanList.push( planLists.plans[i] );
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
								timestamp : plantime,
								repeatTime : planLists.plans[i].repeatTime
							}
							planList.push( obj );
							break;
						}
					}
				}
			}
			// 最后将新列存储下来，新列表中已经不包括过期了的任务了，所以就表现为删除掉了过期任务
			chrome.storage.sync.set( {'plans' : newPlanList}, function(){
				console.log( 'delete outdate plan success' );
			});
            ls_set({
                'planList':JSON.stringify(newPlanList)
            });
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
//					console.log( planList[planListPos] );
					str += '<div class="clearfix each_operator" data-timestamp='+planList[planListPos].timestamp+' data-repeat='+planList[planListPos].repeatTime+'>\
								<span class="time">'+planList[planListPos].calendarTime+'</span>\
								<p class="plan"><span class="plan_title">'+planList[planListPos].planTitle+'</span>';
					//			<p class="plan"><input class="plan_title" value="'+planList[planListPos].planTitle+'" />';								
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
					str += '<a href="#" class="delete_plan">删除</a></p></div>';			
				}
			}
			str += '</div></li>';
		}
		return str;
	}
	/*
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
								timestamp : thisTimestamp,
								repeatTime : planLists.plans[i].repeatTime
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
	*/
	function sortByTimeStamp( a, b ){
		return a.timestamp - b.timestamp;
	}
	$( document ).on( 'click', '.delete_plan', function( e ){
		e.preventDefault();
		var target = e.target;
		var repeat = $( this ).parents( '.each_operator' ).data( 'repeat' ),
			timestamp = $( this ).parents( '.each_operator' ).data( 'timestamp' ),
			title = $( this ).siblings( '.plan_title' ).text();
		chrome.storage.sync.get( 'plans' , function( objs ){
			console.log( 'before delete' );
			var displayList = $( '.each_operator' );
			console.log( objs.plans );
			console.log( timestamp );
			console.log( repeat );
			if( repeat == 1 || repeat == 2){ // 属于重复任务，删除的时候不能仅仅判断时间戳是否相等
				for( var i in objs.plans ){
					if( Math.abs( timestamp-objs.plans[i].timestamp )%86400000 == 0 && title == objs.plans[i].planTitle ){
						objs.plans.splice( i, 1 );
					}
				}
				for( var i=0; i<displayList.length; i++ ){
					if( Math.abs( parseInt( $( displayList[i] ).data( 'timestamp' ) )-timestamp )%86400000 == 0 && $( displayList[i] ).find( '.plan_title' ).text() == title ){
						$( displayList[i] ).remove();
					}
				}
				// 删除显示列表中的所有相同项
			}else{
				for( var i in objs.plans ){
					if( timestamp == objs.plans[i].timestamp ){
						console.log( 'delete' );
						objs.plans.splice( i, 1 );
						break;
					}
				}
				console.log( displayList );
				for( var i=0; i<displayList.length; i++ ){
					console.log( $( displayList[i] ).data( 'timestamp' ) );
					if( $( displayList[i] ).data( 'timestamp' ) == timestamp ){
						$( displayList[i] ).remove();
						break;
					}
				}
				// 删除显示列表中的对应项
			}
			for( var i=0; i<$( '.operator_box' ).length; i++ ){
				if( $( '.operator_box' ).eq( i ).html() == "" ){
					$( '.operator_box' ).eq( i ).html( "<p>无日程</p>" );
				}
			}
			// 更新存储列表数据
			chrome.storage.sync.set({ 'plans' : objs.plans }, function(){
				console.log( 'update planlist success' );
			})
		});
	});
	$( document ).on( 'click', '.plan_title', function(){
		console.log( 'click' );
		var val = $( this ).text();
		var repeatFlag = $( this ).parents( '.each_operator' ).data( 'repeat' );
		if( repeatFlag == 0 || repeatFlag == 2 ){
			$( this ).replaceWith( '<input class="plan_title_modify" type="text" value="'+val+'"/>' );
		}else{
			$( this ).replaceWith( '<input class="plan_title_modify plan_repeated" type="text" value="'+val+'"/>' );
		}
	});
	$( document ).on( 'blur', '.plan_title_modify', function(){
		var text = $( this ).val();
		var timestamp = $( this ).parents( '.each_operator' ).data( 'timestamp' ),
			repeat = $( this ).parents( '.each_operator' ).data( 'repeat' );
		chrome.storage.sync.get( 'plans', function( objs ){
			if( objExist( objs ) ){
				for( var i in objs.plans ){
					console.log( objs.plans[i] );
					if( objs.plans[i].repeatTime == repeat ){
						if( Math.abs( objs.plans[i].timestamp - timestamp )%86400000 == 0 ){
							objs.plans[i].planTitle = text;
						}
					}
				}
				console.log( objs.plans );
				chrome.storage.sync.set( { 'plans':objs.plans }, function(){
					console.log( 'modified' );
				});
			}
		});
		$( this ).replaceWith( '<span class="plan_title">'+text+'</span>' );
	});
	$( document ).on( 'keydown', '.plan_repeated', function(){
		var val = $( this ).val();
		var len = $( '.each_operator' ).length;
		for( var i=0; i<len; i++ ){
			if( $( '.each_operator' ).eq( i ).data( 'repeat' ) == 1 ){
				$( '.each_operator' ).eq( i ).find( '.plan_title' ).text( val );
			}
		}
	});
});