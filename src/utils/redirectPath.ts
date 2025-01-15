import { BASE_URL } from '@/src/common/apiClient'

const AUTH = '/auth'
const GOOGLE = '/google'
const LINE = '/line'
const SIGNIN = '/signin'
const SIGNUP = '/signup'
const DELETE = '/delete'

const GOOGLE_SIGN_IN = `${BASE_URL}${AUTH}${GOOGLE}${SIGNIN}`
const GOOGLE_SIGN_UP = `${BASE_URL}${AUTH}${GOOGLE}${SIGNUP}`
const GOOGLE_DELETE = `${BASE_URL}${AUTH}${GOOGLE}${DELETE}`
const LINE_SIGN_IN = `${BASE_URL}${AUTH}${LINE}${SIGNIN}`
const LINE_SIGN_UP = `${BASE_URL}${AUTH}${LINE}${SIGNUP}`
const LINE_DELETE = `${BASE_URL}${AUTH}${LINE}${DELETE}`

export {
  GOOGLE_SIGN_IN,
  GOOGLE_SIGN_UP,
  GOOGLE_DELETE,
  LINE_SIGN_IN,
  LINE_SIGN_UP,
  LINE_DELETE,
}
