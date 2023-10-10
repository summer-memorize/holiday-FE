import DisuniteSlice from '../../helper/array_helper';
import DateHelper from '../../helper/date_helper';
import dayjs from 'dayjs';

const CalendarRowBlock = ({ year, month, saveDate }) => {
    let days = getMonthDays(year, month, saveDate);
    getBeforeMonthOfDay(year, month, days, saveDate);
    getAfterMonthOfDay(year, month, days, saveDate);
    days = DisuniteSlice(days, 7);

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
                            <div className='calendar-block-row'>{date.date}</div>
                            <div className={`calendar-block-row ${date.isHoliday ? 'holiday' : ''}`}>{date.dateName}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};


const getBeforeMonthOfDay = (year, month, days, saveDate) => {
    let monthWeekDay = dayjs(`${year}-${month}`).startOf('month').day();
    const endOfBeforeMonthDate = dayjs(`${year}-${month}`).subtract(1, 'month').endOf('month');
    monthWeekDay = monthWeekDay === 0 ? 7 : monthWeekDay

    if (monthWeekDay === 1) return

    for(let index=0; index < monthWeekDay - 1; index++){
        console.log(endOfBeforeMonthDate.get('year'), DateHelper.ChangeMonthNumber(endOfBeforeMonthDate.get('month')));
        days.unshift({
                        year: endOfBeforeMonthDate.get('year'),
                        month: (DateHelper.ChangeMonthNumber(endOfBeforeMonthDate.get('month'))),
                        date: (endOfBeforeMonthDate.get('date') - index),
                        dateName: saveDate?.[endOfBeforeMonthDate.get('year')]?.[DateHelper.ChangeMonthNumber(endOfBeforeMonthDate.get('month'))]?.[(endOfBeforeMonthDate.get('date') - index)]?.dateName,
                        className: 'another-month'})
    }

    return
}

const getMonthDays = (year, month, saveDate) => {
    const lastDay = dayjs(`${year}-${month }`).endOf('month').get('date');
    return Array.from({ length: lastDay }, (_, index) => ({
        year: year,
        month: (month),
        date: (index + 1),
        dateName: saveDate?.[year]?.[month]?.[(index + 1)]?.dateName,
        className: 'this-month'
    }));
}

const getAfterMonthOfDay = (year, month, days, saveDate) => {
    const date = dayjs(`${year}-${month}`)
    const afterMonthDate = date.add(1, 'month').startOf('month');
    let monthWeekDay = date.endOf('month').day();
    monthWeekDay = monthWeekDay === 0 ? 7 : monthWeekDay

    if (monthWeekDay === 0 ) return

    for(let index = 1; index <= 7 - monthWeekDay; index++){
        days.push({
                    year: afterMonthDate.get('year'),
                    month: DateHelper.ChangeMonthNumber(afterMonthDate.get('month')),
                    date: (index),
                    dateName: saveDate?.[afterMonthDate.get('year')]?.[DateHelper.ChangeMonthNumber(afterMonthDate.get('month'))]?.[(index)]?.dateName,
                    className: 'another-month'})
    }

    return
}

export default CalendarRowBlock;