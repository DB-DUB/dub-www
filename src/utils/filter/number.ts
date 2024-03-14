/**
 * Common number format
 * @param num
 * @returns formatted num
 */
export function commonNumberFormat(num: number, precision: number = 1) {
  if (!num) return 0
  const tmpNumber = Math.pow(10, precision)
  const roundedNum = Math.round(num * tmpNumber) / tmpNumber
  const options = { minimumFractionDigits: precision, maximumFractionDigits: precision }
  const returnStr = roundedNum.toLocaleString('en-US', options)
  return returnStr.replace(/\.0+$/g, '')
}

/**
 * Common Money format
 * @param money
 * @param precision
 * @param mathFun  round |  ceil |  floor
 * @param moneySymbol
 * @returns formatted money
 */
export function commonMoneyFormat(
  money: number,
  precision: number = 2,
  mathFun: 'round' | 'ceil' | 'floor' = 'round',
  moneySymbol: string = '$'
) {
  if (!money) return moneySymbol + 0
  let roundedMoney
  const tmpNumber = Math.pow(10, precision)
  switch (mathFun) {
    case 'ceil':
      roundedMoney = Math.ceil(money * tmpNumber) / tmpNumber
      break
    case 'floor':
      roundedMoney = Math.floor(money * tmpNumber) / tmpNumber
      break
    default:
      roundedMoney = Math.round(money * tmpNumber) / tmpNumber
      break
  }
  const options = { minimumFractionDigits: precision, maximumFractionDigits: precision }
  const returnStr = moneySymbol + roundedMoney.toLocaleString('en-US', options)
  return returnStr.replace(/\.0+$/g, '')
}

/**
 * Common short number format
 * @param num
 */
export function commonShortNumberFormat(num: number, precision: number = 1) {
  if (!num) return 0
  if (num > 1000000) {
    // 7 digits and above
    return (num / 1000000).toFixed(1) + 'm'
  } else if (num > 1000) {
    // 4 to 6 digits
    return (num / 1000).toFixed(1) + 'k'
  } else {
    return num.toFixed(precision)
  }
}
