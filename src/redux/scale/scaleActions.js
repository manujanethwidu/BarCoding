import axios from 'axios';
import scalConnection from '../../apis/scalConnection'
import { SCALE_READING_FAIL, SCALE_READING_REQUEST, SCALE_READING_SUCCESS } from './scaleConstants';

const scaleReading = () => async (dispatch) => {
     try {
          dispatch({ type: SCALE_READING_REQUEST });
          const {data} = await scalConnection.get(`/sc`)
          dispatch({type:SCALE_READING_SUCCESS,payload:data})
     } catch (error) {
          dispatch({ type: SCALE_READING_FAIL, payload: error.message });
     }
}
export { scaleReading }