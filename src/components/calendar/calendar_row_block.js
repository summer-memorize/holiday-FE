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
                        <div key={index} className={`calendar-block ${date.className} ${date.isHoliday ? 'holiday-color' : ''}`}>
                            <div className={`calendar-block-row`}>{date.date}</div>
                                {
                                    date.dateName?.map((name, index) => (
                                    <div key={index}>
                                        {name}
                                    </div>))
                                }
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};


const getBeforeMonthOfDay = (year, month, days, saveDate) => {
    let first_day = dayjs(`${year}-${month}`).startOf('month').day();
    first_day = first_day === 0 ? 7 : first_day
    if (first_day === 1) return

    const before_date = dayjs(`${year}-${month}`).subtract(1, 'month').endOf('month');
    const before_date_year = before_date.year();
    const before_date_month = DateHelper.ChangeMonthNumber(before_date.month());
    const before_date_date = before_date.date();
    for(let index=0; index < first_day - 1; index++){
        days.unshift({
                        year: before_date_year,
                        month: before_date_month,
                        date: (before_date_date - index),
                        dateName: saveDate?.[before_date_year]?.[before_date_month]?.[before_date_date - index]?.dateName,
                        isHoliday: saveDate?.[before_date_year]?.[before_date_month]?.[before_date_date - index]?.isHoliday,
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
        isHoliday: saveDate?.[year]?.[month]?.[(index + 1)]?.isHoliday,
        className: 'this-month'
    }));
}

const getAfterMonthOfDay = (year, month, days, saveDate) => {
    const select_date = dayjs(`${year}-${month}`)
    const after_date = select_date.add(1, 'month').startOf('month');
    const after_date_month = DateHelper.ChangeMonthNumber(after_date.get('month'));
    const after_date_year = after_date.get('year');

    let monthWeekDay = select_date.endOf('month').day();
    monthWeekDay = monthWeekDay === 0 ? 7 : monthWeekDay

    if (monthWeekDay === 0 ) return

    for(let index = 1; index <= 7 - monthWeekDay; index++){
        days.push({
                    year: after_date_year,
                    month: after_date_month,
                    date: index,
                    dateName: saveDate?.[after_date_year]?.[after_date_month]?.[index]?.dateName,
                    isHoliday: saveDate?.[after_date_year]?.[after_date_month]?.[index]?.isHoliday,
                    className: 'another-month'})
    }

    return
}

export default CalendarRowBlock;