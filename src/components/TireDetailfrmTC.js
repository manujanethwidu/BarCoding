import React from 'react'
import '../css/TireDetailFrmTC.css';

const TireDetailfrmTC = ({ tireDetail }) => {
     const { tirecode,
          pid,
          tiresizebasic,
          config,
          color,
          lugtype,
          rimsize,
          brand,
          swmsg,
          moldno,
          tiretype } = tireDetail
     return (
          <div className="tiredetail-container">
               <div><h4>{tiresizebasic} {lugtype} {config}</h4></div>
               <div><h4>{rimsize}</h4></div>

               <div><h4>{brand} / {swmsg}</h4></div>
               <div><h4>{tiretype}</h4></div>
               <div><h4>Mold No:-{moldno}</h4></div>
              {color!=="NotAPW"? <div><h4>{color}</h4></div>:""} 
          </div>
     )
}

export default TireDetailfrmTC
