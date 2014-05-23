(function(){
    var init = {
        year : 2000,
        month : 1,
        day : 1,
        week : "Sat"
    };
    var week = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
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
        document.getElementById('month').innerHTML= 1+m;
        return createCalendar( startWeek, m, d);
    };
    /*
     * if sun the startWeek = 0, if mon then startWeek = 1 ...
     * curMonth start from 0
     */
    function createCalendar( startWeek, curMonth, day ){
        var calendarContent = "<table class='T_calendar'><tr><th class='calendar_title_highlight'>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th class='calendar_title_highlight'>Sat</th></tr>";
        var curMonthLen = monthLen[curMonth],
            prevMonthLen = monthLen[(12+curMonth-1)%12];

        //日历的第一行特别处理
        // startWeek 0-6 对应星期日到星期六
        calendarContent += "<tr>";
        for( var i=(prevMonthLen - startWeek+1); i<=prevMonthLen; i++ ){
            calendarContent += "<td>"+i+"</td>";
        }
        for( var i=startWeek; i<7; i++ ){
            if( i != day ){
                calendarContent += "<td>"+(i+1-startWeek)+"</td>";
            }else{
                calendarContent += "<td class='cur_day'>"+(i+1-startWeek)+"</td>";
            }
        }
        calendarContent += "</tr>";

        // 填充日历的2-6行
        for( var i = 0; i<5; i++ ){
            calendarContent += "<tr>";
            var startIndex = ( ( 7-startWeek )%7 != 0 ) ? (7-startWeek)%7+1 : 8;
			for( var j = startIndex; j<( startIndex+7 ); j++ ){
                if( (j+i*7) <= curMonthLen ){
                    if( (j+i*7) != day ){
                        calendarContent += "<td>"+(j+i*7)+"</td>";
                    }else{
                        calendarContent += "<td class='cur_day'>"+(j+i*7)+"</td>";
                    }
                }else{
                    calendarContent += "<td>"+( (j+i*7)%curMonthLen )+"</td>";
                }
            }
            calendarContent += "</tr>";
        }
        calendarContent += "</table>";
        return calendarContent;
    }
    var calendarStr = calendar(  undefined , undefined, undefined );
    document.getElementById( "calendarBox" ).innerHTML = calendarStr;
})();