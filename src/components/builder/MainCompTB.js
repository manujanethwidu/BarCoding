import React from 'react'
import '../../css/MainCompTB.css'
import TireDetailfrmTC from '../TireDetailfrmTC'

const MainCompTB = ({tireDetail}) => {
     return (
          <div className='main-container'>

               <div className="tire-description">
                   <TireDetailfrmTC tireDetail={tireDetail} />
               </div>
               <div className="order-detail">
                    a
               </div>
               <div className="press-detail">
                    a
               </div>
          </div>
     )
}

export default MainCompTB
