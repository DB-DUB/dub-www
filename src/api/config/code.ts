/**
 * @description Special Server Codes
 */
const codes: {
  [propName: string]: string
} = {
  10005: 'You have been logged out.', // Invalid token, should logout
  500: 'Network exception, please try again later.',
  90000: 'Network exception, please try again later.'
}

export default codes
