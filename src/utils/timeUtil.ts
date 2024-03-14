import dayjs from "dayjs"

// Time display method
export function showTime(time) {
  const current_year = dayjs().year()
  const currTime = dayjs(time)
  var year = currTime.year()
  var month = currTime.month() + 1
  var day = currTime.date()
  var hours = currTime.hour()
  const hour = Number(hours) > 9 ? hours : `0${hours}`
  var mins = currTime.minute()
  const min = Number(mins) > 9 ? mins : `0${mins}`
  // then
  if (current_year === year) {
    return `${getMonth(month)} ${day} ${hour}:${min}`
  } else {
    return `${year} ${getMonth(month)} ${day} ${hour}:${min}`
  }
}

// Month display in different languages
const getMonth = month => {
  switch (month) {
    case 1:
      return 'Jan'
    case 2:
      return 'Feb'
    case 3:
      return 'Mar'
    case 4:
      return 'Apr'
    case 5:
      return 'May'
    case 6:
      return 'June'
    case 7:
      return 'July'
    case 8:
      return 'Aug'
    case 9:
      return 'Sept'
    case 10:
      return 'Oct'
    case 11:
      return 'Nov'
    case 12:
      return 'Dec'
  }
}
