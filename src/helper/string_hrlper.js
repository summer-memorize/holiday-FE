const FormatIntegerToTwoDigits = (integer) => {
    return integer < 10 ? `0${integer}` : `${integer}`;
}

export default FormatIntegerToTwoDigits;