// import { NumberFormat } from 'intl';
const CommonFun = {
    FloatVal: (argVal) => {
        let cVal = parseFloat(argVal);
        if (isNaN(cVal)) cVal = 0;
        return cVal;
    },
    IntVal: (argVal) => {
        let cVal = parseInt(argVal);
        if (isNaN(cVal)) cVal = 0;
        return cVal;
    },
    numberFormat: (argValue) => {
        let formatValue = new Intl.NumberFormat('en-IN', {
            // style: 'currency',
            // currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            //   maximumSignificantDigits: 3,
            //   minimumFractionDigits: 2
        }).format(argValue);
        return formatValue;
    },
    numberDigit: (argValue,argDigit) => {
        let formatValue = new Intl.NumberFormat('en-IN', {
            // style: 'currency',
            // currency: 'INR',
            minimumFractionDigits: argDigit,
            maximumFractionDigits: argDigit,
            //   maximumSignificantDigits: 3,
            //   minimumFractionDigits: 2
        }).format(argValue);
        return formatValue;
    },
}
export default CommonFun;