import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'react-calendar/dist/Calendar.css'; // CSS import
import '../css/calendar.css';
import fetchData from '../fetchs/calendar_holiday_fetch';
import CalendarRowBlock from './calendar/calendar_row_block';
import DateHelper from '../helper/date_helper';

const Calendar = () => {
    const [date, setDate] = useState(dayjs());
    const year = date.year();
    const month = DateHelper.ChangeMonthNumber(date.month());
    const stringMonth = DateHelper.ChangeMonthString(date.month());
    const [saveDate, setSaveDate] = useState({});

    useEffect(() => {
        fetchData(saveDate, setSaveDate, year, month, stringMonth);
        return () => null;
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
                setDate((prevDate) => prevDate.subtract(1, 'year'));
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
                <h1>{year}년 {stringMonth}월</h1>
            </div>
            <div className="calendar">
                <CalendarRowBlock year={year} month={month} saveDate={saveDate}/>
            </div>
        </>
    );
};

export default Calendar;
