import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'react-calendar/dist/Calendar.css'; // CSS import
import '../css/calendar.css';
import BackEndUrl from '../constant';
import FormatIntegerToTwoDigits from '../helper/string_hrlper';
import DisuniteSlice from '../helper/array_helper';

const Calendar = () => {
    const [date, setDate] = useState(dayjs());
    const [holidays, setHolidays] = useState({});

    const year = date.year();
    const month = date.month() + 1;
    const queryString = new URLSearchParams({ year, month: FormatIntegerToTwoDigits(month) }).toString();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BackEndUrl}/holiday?${queryString}`, {
                    method: 'GET',
                    headers: { 'Content-type': 'application/json' },
                });
                if (!response.ok) {
                    throw new Error('네트워크 응답이 정상이 아닙니다');
                }
                const response_data = await response.json();
                const data = response_data.data;
                const tmp = {};

                data.forEach((holiday) => {
                    const calcDay = dayjs(holiday.date);
                    const holidayMonth = FormatIntegerToTwoDigits(calcDay.month() + 1);
                    const holidayDay = FormatIntegerToTwoDigits(calcDay.date());
                    const key = `${holidayMonth}${holidayDay}`;

                    if (!tmp[key]) {
                        tmp[key] = {data: []};
                    }
                    tmp[key].isHoliday = tmp[key].isHoliday || holiday.isHoliday ? true : false
                    tmp[key].data.push({ dateName: holiday.dateName, month, day: holidayDay });
                });
                setHolidays(tmp);
            } catch (error) {
                console.error('휴일 가져오기 오류:', error);
            }
        };
        fetchData();
        return () => {
            console.log('언마운트');
        }
    }, [date]);

    const handleKeyDown = (e) => {
        switch (e.keyCode) {
            case 38:
                setDate((prevDate) => prevDate.add(1, 'year'));
                break;
            case 37:
                setDate((prevDate) => prevDate.subtract(1, 'month'));
                break;
            case 39:
                setDate((prevDate) => prevDate.add(1, 'month'));
                break;
            case 40:
                setDate((prevDate) => prevDate.subtract(-1, 'year'));
                break;
            default:
                break;
        }

        return
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <>
            <div className="calendar-title">
                <h1>{year}년 {month}월</h1>
            </div>
            <div className="calendar">
                <CalendarRowBlock year={year} month={month} holidays={holidays} />
            </div>
        </>
    );
};

// 만약 PropTypes를 사용하는 경우, CalendarRowBlock props에 PropTypes를 추가하여 예상되는 props를 문서화할 수 있습니다.

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

export default Calendar;
