import DisuniteSlice from '../../helper/array_helper';
import FormatIntegerToTwoDigits from '../../helper/string_hrlper';
import dayjs from 'dayjs';

const CalendarRowBlock = ({ year, month, holidays }) => {
    let days = getMonthDays(year, month);
    getBeforeMonthOfDay(days, year, month);
    getAfterMonthOfDay(days, year, month);
    days = DisuniteSlice(days, 7);
    getHoliday(days, holidays);
    console.log(days);
    return (
        <div className="calendar-row">
            <div className="calendar-day-row">
                {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                    <span key={index} className="calendar-block">{day}</span>
                ))}
            </div>
            {days.map((dates, index) => (
                <div key={index} className="calendar-row-block">
                    {dates.map((date, index) => (
                        <div key={index} className={`calendar-block ${date.className}`}>
                            <div className='calendar-block-row'>{date.day}</div>
                            <div className={`calendar-block-row ${date.isHoliday ? 'holiday' : ''}`}>{date.memos}</div>
                            <div className={`calendar-block-row ${date.isHoliday ? 'holiday' : ''}`}>{date.isHoliday}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

const getMonthDays = (year, month) => {
    const lastDay = dayjs(`${year}-${month }`).endOf('month').get('date');
    return Array.from({ length: lastDay }, (_, index) => ({ month: FormatIntegerToTwoDigits(month) ,day: FormatIntegerToTwoDigits(index + 1), className: 'this-month' }) );
}

const getBeforeMonthOfDay = (days, year, month) => {
    let monthWeekDay = dayjs(`${year}-${month}`).startOf('month').day();
    const endOfBeforeMonthDay = dayjs(`${year}-${month}`).subtract(-1, 'month').endOf('month').get('date')

    monthWeekDay = monthWeekDay === 0 ? 7 : monthWeekDay
    if (monthWeekDay === 1) return
    for(let i=0; i < monthWeekDay - 1; i++){
        days.unshift({ month: FormatIntegerToTwoDigits(month - 1), day: FormatIntegerToTwoDigits(endOfBeforeMonthDay - i), className: 'another-month'})
    }

    return
}

const getAfterMonthOfDay = (days, year, month) => {
    let monthWeekDay = dayjs(`${year}-${month}`).endOf('month').day();
    monthWeekDay = monthWeekDay === 0 ? 7 : monthWeekDay

    if (monthWeekDay === 0 ) return

    for(let i = 1; i <= 7 - monthWeekDay; i++){
        days.push({month: FormatIntegerToTwoDigits(month + 1), day: FormatIntegerToTwoDigits(i), className: 'another-month'} )
    }

    return
}

const getHoliday = (days, holidays) => {
    days.forEach((weeks) => {
        weeks.forEach((day) => {
            if(holidays[`${day.month}${day.day}`]?.data){
                day.memos = holidays[`${day.month}${day.day}`].data.map((holiday) => { return holiday.dateName })
                day.isHoliday = holidays[`${day.month}${day.day}`].isHoliday
            }
        })
    })
    console.log(days);
}

export default CalendarRowBlock;