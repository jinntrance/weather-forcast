$(function(){
	var now = new Date(),
		curYear = now.getFullYear(),
		curMonth = parseInt( now.getMonth() )+1;
	$( '#calendarMonth' ).text( curYear+'年'+curMonth+'月' );
	var calendarStr = calendar(  undefined , undefined, undefined );
	$( '#popCalendar' ).html( calendarStr );
	$( '.calendar_day,.calendar_time' ).on( 'mouseenter', showpop );
	$( '.calendar_day,.calendar_time' ).on( 'mouseleave', hidepop );
/*
	$( '.calendar_day,.calendar_time,.repeat_day,.repeat_week' ).hover(
		function(){
			$( this ).find( '.pop_up' ).show();
		},
		function(){
			$( this ).find( '.pop_up' ).hide();
		}
	))
	$( '.calendar_day,.calendar_time,.repeat_day,.repeat_week' ).on( 'mouseenter', showpop );
	$( '.calendar_day,.calendar_time,.repeat_day,.repeat_week' ).on( 'mouseleave', hidepop );	
*/
	function showpop(){
		$( this ).find( '.pop_up' ).show();
	}
	function hidepop(){
		$( this ).find( '.pop_up' ).hide();
	}
	
	$( '.pop_up li' ).on( 'click', function(){
		$( this ).parents( '.pop_up' ).find( '.current' ).removeClass( 'current' );
		$( this ).addClass( 'current' );
		$( this ).parents( '.pop_up' ).siblings( 'input' ).val( $( this ).text() );
	});
	
	var reg = /(\d+)[^0-9]*(\d+)/
	$( '#prevMonth' ).on( 'click', function( e ){
		e.preventDefault();
		var monthStr = $( this ).siblings( '#calendarMonth' ).text(),
			regMonthStr = monthStr.match( reg );
		var year = parseInt( regMonthStr[1] ),
			month = parseInt( regMonthStr[2] )-1;
//		console.log( month );
		if( parseInt( month ) > 0 ){
			month = month-1;
		}else{
			year--;
			month = 11
		}
		$( this ).siblings( '#calendarMonth' ).text( year+'年'+( month+1 )+'月' );
//		console.log( 'year: '+year );
		calendarStr = calendar( year, month, undefined )
		$( '#popCalendar' ).html( calendarStr );
	});
	$( '#nextMonth' ).on( 'click', function( e ){
		e.preventDefault();
		var monthStr = $( this ).siblings( '#calendarMonth' ).text(),
			regMonthStr = monthStr.match( reg );
//		console.log( regMonthStr );
		var year = parseInt( regMonthStr[1] ),
			month = parseInt( regMonthStr[2] )-1;
//		console.log( month );
		if( parseInt( month ) < 11 ){
			month++;
		}else{
			year++;
			month = 0
		}
//		console.log( month );
		$( this ).siblings( '#calendarMonth' ).text( year+'年'+( month+1 )+'月' );
		calendarStr = calendar( year, month, undefined )
		$( '#popCalendar' ).html( calendarStr );
	});
	
	$( document ).on( 'click', '#popCalendar .enable', function(){
		var monthStr = $( this ).parents( '#popCalendar' ).siblings( '#calendarMonthTitle' ).find( '#calendarMonth' ).text(),
			regMonthStr = monthStr.match( reg ),
			year = regMonthStr[1],
			month = parseInt( regMonthStr[2] );
		if( month < 10 ){
			month = '0'+month;
		}
		var text = year+'-'+month+'-'+$( this ).text();
		$( '#calendarDay' ).val( text );
	});
	
	$( '#repeatTime' ).on( 'change', function(){
		if( $( this ).is( ':checked' ) ){
			$( 'input[name="repeattime"]' ).attr( 'disabled', false );
		}else{
			$( 'input[name="repeattime"]' ).attr( 'checked', false );
			$( 'input[name="repeattime"],#repeatDay,#repeatWeek' ).attr( 'disabled', true );
			$( document ).off( 'mouseenter', '.repeat_day' );
			$( document ).off( 'mouseenter', '.repeat_week' );
		}
	});
	$( 'input[name="repeattime"]' ).on( 'change', function(){
		if( $( this ).val() == 1 ){
			$( '#repeatDay' ).attr( 'disabled', false );
			$( '#repeatWeek' ).attr( 'disabled', true );
			$( document ).on( 'mouseenter', '.repeat_day', showpop );
			$( document ).on( 'mouseleave', '.repeat_day', hidepop );
			$( document ).off( 'mouseenter', '.repeat_week' );
		}else if( $( this ).val() == 2 ){
			$( '#repeatDay' ).attr( 'disabled', true );
			$( '#repeatWeek' ).attr( 'disabled', false );
			$( document ).on( 'mouseenter', '.repeat_week', showpop );
			$( document ).on( 'mouseleave', '.repeat_week', hidepop );
			$( document ).off( 'mouseenter', '.repeat_day' );
		}
	});
	
	var hideFlag = true;
	function showErr( flag, container, msg ){
		$( container ).text( msg ).show();
		if( flag ){
			flag = false;
			setTimeout( function(){
				$( container ).fadeOut("fast", function(){
					flag = true;
				});
			}, 1500 );
		}
	}
	$( '#createPlan' ).on( 'click', function(){
		var planTitle = $( '#planTitle' ).val(),
			calendarDay = $( '#calendarDay' ).val(),
			calendarTime = $( '#calendarTime' ).val(),
			planTime = Date.parse( calendarDay+' '+calendarTime );
			
		if( planTitle == '' ){
			showErr( hideFlag, '#errMsg', '请填写活动标题' );
			return false;
		}
		/*
		if( planTime < ( new Date().getTime() ) ){
			console.log( 'here' );
			showErr( hideFlag, '#errMsg', '计划活动时间必须是将来的某个时间' );
			return false;
		}
		*/
		var plan = {};
		plan.timestamp = planTime;
		plan.planTitle = planTitle;
		plan.calendarDay = calendarDay;
		plan.calendarTime = calendarTime;
		plan.repeatTime = 0;
		plan.yuIndex = 0;
		plan.yiIndex = 0;
		plan.dongIndex = 0;
		plan.ganIndex = 0;
		plan.mingIndex = 0;
		plan.shaiIndex = 0;
		plan.xiIndex = 0;
		plan.diaoIndex = 0;
		
		if( $( '#repeatTime' ).is( ':checked' ) ){
			if( $( 'input[name="repeattime"]:checked' ).val() == 1 ){
				plan.repeatTime = 1;
				plan.repeatDay = $( '#repeatDay' ).val();
				// 将按天重复的计划加入到存储列表中，用repeatTime字段来区分
				/*
				chrome.storage.sync.get( 'plans', function( objs ){
					if( !objExist( objs ) ){
						var planList = [];
						planList.push( plan );
						chrome.storage.sync.set( {'plans':planList}, function( obj ){
							console.log( 'init plans success' );
						})
					}else{
						objs.plans.push( plan );
						//newPlanList = objs.plans.sort( sortByTimeStamp );
						console.log( newPlanList );
						chrome.storage.sync.set( {'plans' : newPlanList }, function( obj ){
							console.log( 'set new plans success' );
							console.log( obj.plans );
						});
					}
				})
				*/
			}else if( $( 'input[name="repeattime"]:checked' ).val() == 2 ){
				plan.repeatTime = 2;
				plan.repeatWeek = $( '#repeatWeek' ).val();
				console.log( 'repeattime: '+2 );
				console.log( "repeatWeek: "+$( '#repeatWeek' ).val() );
			}
			chrome.storage.sync.get( 'plans', function( objs ){
				if( !objExist( objs ) ){
					var planList = [];
					planList.push( plan );
					chrome.storage.sync.set( {'plans':planList}, function( obj ){
						console.log( 'init plans success' );
					})
				}else{
					objs.plans.push( plan );
					//newPlanList = objs.plans.sort( sortByTimeStamp );
					console.log( newPlanList );
					chrome.storage.sync.set( {'plans' : newPlanList }, function( obj ){
						console.log( 'set new plans success' );
						console.log( obj.plans );
					});
				}
			})
		}
		if( $( '#yuIndex' ).is( ':checked' ) ){
			plan.yuIndex = 1;
		}
		if( $( '#yiIndex' ).is( ':checked' ) ){
			plan.yiIndex = 1;
		}
		if( $( '#dongIndex' ).is( ':checked' ) ){
			plan.dongIndex = 1;
		}
		if( $( '#ganIndex' ).is( ':checked' ) ){
			plan.ganIndex = 1;
		}
		if( $( '#mingIndex' ).is( ':checked' ) ){
			plan.mingIndex = 1;
		}
		if( $( '#shaiIndex' ).is( ':checked' ) ){
			plan.shaiIndex = 1;
		}
		if( $( '#xiIndex' ).is( ':checked' ) ){
			plan.xiIndex = 1;
		}
		if( $( '#diaoIndex' ).is( ':checked' ) ){
			plan.diaoIndex = 1;
		}
	/* 调试用，清空单次计划列表
		chrome.storage.sync.clear( function(){
			console.log( 'clear success' );
		});
	*/
		console.log( plan );
		// 将单次计划添加到存储列表中，注意此时没有对列表中内容进行排序
		chrome.storage.sync.get( 'plans', function( objs ){
			console.log( !objExist( objs ) );
			if( !objExist( objs ) ){
				console.log( 'not exist' );
				var planList = [];
				planList.push( plan );
				chrome.storage.sync.set( {'plans':planList}, function( obj ){
					console.log( 'init plans success' );
				})
			}else{
				objs.plans.push( plan );
				//newPlanList = objs.plans.sort( sortByTimeStamp );
				console.log( objs.plans );
				chrome.storage.sync.set( {'plans' : objs.plans }, function( obj ){
					console.log( 'set new plans success' );
					console.log( obj.plans );
				});
			}
		});
		window.location.href = 'plan.html'
	});
	
	function objExist( obj ){
		for( var item in obj ){
			return true;
		}
		return false;
	}
	function sortByTimeStamp( a, b ){
		return a.timestamp - b.timestamp;
	}
});