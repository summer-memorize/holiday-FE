import dayjs from "dayjs";
import BackEndUrl from "../constant";
import DateHelper from "../helper/date_helper";

const CalendarHolidayFetch = async (saveDate, setSaveDate, year, month, stringMonth) => {
    const queryString = new URLSearchParams({ year, month:  stringMonth }).toString();
    try {
        if(saveDate?.[year]?.[month]) return
        console.log(year, month, saveDate[year]?.[month]);
        const response = await fetch(`${BackEndUrl}/holiday?${queryString}`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
        });
        if (!response.ok) {
            throw new Error('네트워크 응답이 정상이 아닙니다');
        }
        const response_data = await response.json();
        const data = response_data.data;
        data.forEach((holiday) => {
            const holidayDate = dayjs(holiday.date);
            const holidayYear = holidayDate.get('year');
            const holidayMonth = DateHelper.ChangeMonthNumber(holidayDate.get('month'));
            const date = holidayDate.get('date')

            saveDate[year] ||= {[holidayMonth]: { [date]: { dateName: [holiday.dateName], isHoliday: holiday.isHoliday } } };
            if (saveDate?.[holidayYear]?.[holidayMonth]?.[date]){
                saveDate[holidayYear][holidayMonth][date].dateName.push(holiday.dateName);
                saveDate[holidayYear][holidayMonth][date].isHoliday ||= holiday.isHoliday;
            }
            else{
                saveDate[holidayYear][holidayMonth] = { ...saveDate[holidayYear][holidayMonth], [date]: { dateName: [holiday.dateName], isHoliday: holiday.isHoliday } }
            }
        });
        setSaveDate({...saveDate});
    } catch (error) {
        console.error('휴일 가져오기 오류:', error);
    }
};

export default CalendarHolidayFetch;