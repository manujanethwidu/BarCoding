import React, { useEffect, useState } from 'react'
import FtrComp from '../components/fi/FtrComp'
import SLTLDBConnection from '../apis/SLTLDBConnection'

//Toastify
import { notifyInfo, notifyWarning, notifyError, notifySuccess } from '../utils/toastify'

const FTRScreen = ({ match }) => {
     const [tireDetails, setTireDeatails] = useState([])
     const sn = match.params.sn
     //Fetch data of sn

     useEffect(() => {
          if (sn) {
               const fetchDataSN = async () => {
                    try {
                         const response = await SLTLDBConnection.get(`/get_tiredetails_filterd_sntext/${sn}`)
                         setTireDeatails(response.data.data[0])
                    } catch (err) {
                         console.error(err.message)
                         notifyError(err.message)
                    }
               }
               fetchDataSN()
          }
     }, [sn])
     return (
          <div>
               <FtrComp tireDetails={tireDetails} />
          </div>
     )
}

export default FTRScreen
