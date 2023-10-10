const ChangeMonthNumber = (month) => {
    if (month === 0) return 12;

    return (month + 1);
}

const ChangeMonthString = (month) => {
    month = ChangeMonthNumber(month);
    return month <= 9 ? '0' + month : month.toString();
}


const DateHelper = { ChangeMonthString, ChangeMonthNumber };

export default DateHelper;
