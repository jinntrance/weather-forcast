	var init = {
		year : 2000,
		month : 1,
		day : 1,
		week : "Sat"
	};
	var week = ["日","一","二","三","四","五","六"];
	var monthLen = [31,28,31,30,31,30,31,31,30,31,30,31];
	/*
	 * year is full year with type of int
	 * month is start from 0
	 * day start from 1
	 *
	 */
	function calendar( year, month, day ){
		var y = ( typeof year === "undefined" ) ? parseInt( new Date().getFullYear() ) : year,
			m = ( typeof month === "undefined" ) ? parseInt( new Date().getMonth() ) : month,
			d = ( typeof day === "undefined" ) ? parseInt( new Date().getDate() ) : day;
		var leapYear = ( ( y/4 == 0 && y/100 != 0 ) || ( y/400 == 0 ) );
		if( leapYear ){
			monthLen[1] = 29;
		}
		var startWeek = parseInt( new Date( y, m, 1).getDay() );
		return createDynamicCalendar( startWeek, m, d);
	};
	/*
	 * if sun the startWeek = 0, if mon then startWeek = 1 ...
	 * curMonth start from 0
	 */
	function createDynamicCalendar( startWeek, curMonth, day ){
		var calendarContent = "<table class='T_calendar'><tr><th class=''>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th class=''>六</th></tr>";
		var curMonthLen = monthLen[curMonth],
			prevMonthLen = monthLen[(12+curMonth-1)%12];

		//日历的第一行特别处理
		// startWeek 0-6 对应星期日到星期六
		calendarContent += "<tr>";
		for( var i=(prevMonthLen - startWeek+1); i<=prevMonthLen; i++ ){
			calendarContent += "<td class='disable'>"+i+"</td>";
		}
		for( var i=startWeek; i<7; i++ ){
			if( ( i+1-startWeek ) != day ){				
				calendarContent += "<td class='enable'>"+(i+1-startWeek)+"</td>";
			}else{
				calendarContent += "<td class='cur_day enable'>"+(i+1-startWeek)+"</td>";
			}
		}
		calendarContent += "</tr>";

		// 填充日历的2-6行
		// startWeek are 0-6 0 represent for sunday
		for( var i = 0; i<5; i++ ){
			calendarContent += "<tr>";
			var startIndex = ( ( 7-startWeek )%7 != 0 ) ? (7-startWeek)%7+1 : 8;
			for( var j = startIndex; j<( startIndex+7 ); j++ ){
				if( (j+i*7) <= curMonthLen ){
					if( (j+i*7) != day ){
						calendarContent += "<td class='enable'>"+(j+i*7)+"</td>";
					}else{	
						calendarContent += "<td class='cur_day enable'>"+(j+i*7)+"</td>";
					}
				}else{
					calendarContent += "<td class='disable'>"+( (j+i*7)%curMonthLen )+"</td>";
				}
			}
			calendarContent += "</tr>";
		}
		calendarContent += "</table>";
		return calendarContent;
	}
//	var calendarStr = calendar(  undefined , 2, undefined );