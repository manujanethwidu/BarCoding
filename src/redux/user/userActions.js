import axios from 'axios';
import scalConnection from '../../apis/scalConnection'
import { SCALE_READING_FAIL, SCALE_READING_REQUEST, SCALE_READING_SUCCESS } from './scaleConstants';
import { USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS } from './userConstants';
const scaleReading = () => async (dispatch) => {
     try {
          dispatch({ type: USER_LOGIN_REQUEST });
          const {data} = await scalConnection.put(`/auth/insertuser`)
          dispatch({type:USER_LOGIN_SUCCESS,payload:data})
     } catch (error) {
          dispatch({ type: USER_LOGIN_FAIL, payload: error.message });
     }
}
export { scaleReading }