/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react'
import ListView from '../components/fi/ListView';
import SLTLDBConnection from '../apis/SLTLDBConnection'
const FIScreen = () => {

     //Slide Bar////////////////////////
     const closeMenu = () => {
          document.querySelector('.sidebar').classList.remove('open');
     };
     useEffect(() => {
          closeMenu()
     }, [])
     //////////////////////////////////////////////////

     const [val, setVal] = useState("");
     const [tireDetails, setTireDeatails] = useState([])

     //getFilterdSn List
     const fetchDataSN = async () => {
          try {
               const response = await SLTLDBConnection.get(`/get_tiredetails_filterd_sntext/${val}`)
               setTireDeatails(response.data.data)
          } catch (err) {
               console.error(err.message)
          }
     }

     //Get last day produciton
     const fetchDataLastDay = async () => {
          try {
               const response = await SLTLDBConnection.get(`/get_tiredetails_of_given_noof_dates_back_frm_mfg_tbl/300`)
               setTireDeatails(response.data.data)
          } catch (err) {
               console.error(err.message)
          }
     }

     useEffect(() => {
          //if input is empty call initial Fetching. Otherwise call sn Filtering fetching
          if (val == "") {
               fetchDataLastDay()
          } else {
               fetchDataSN()
          }
        
     }, [val])


     function handleChange(newValue) {
          setVal(newValue);
     }
     return (
          <div>
               <ListView handleChange={handleChange} val={val} tireDetails={tireDetails} />
          </div>
     )
}

export default FIScreen
