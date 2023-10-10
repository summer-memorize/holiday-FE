import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'react-calendar/dist/Calendar.css'; // CSS import
import '../css/calendar.css';
import BackEndUrl from '../constant';
import FormatIntegerToTwoDigits from '../helper/string_hrlper';
import CalendarRowBlock from './calendar/calendar_row_block';

const Calendar = () => {
    const [date, setDate] = useState(dayjs());
    const [savedDate, setSaveDate] = useState({});
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

export default Calendar;
