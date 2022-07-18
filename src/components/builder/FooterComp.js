import React from 'react'
import { msToTime, cssGetter } from '../../utils/footerUtils'
import '../../css/FooterComp.css';

const FooterComp = ({ stblTimeOut, stblTimeOutSetting, tireCode, onChange }) => {

     const stblTimeOutcss = cssGetter(stblTimeOut, stblTimeOutSetting)

     const handleChange = (event) => {
          
               onChange(event.target.value);
        
     }

     return (
          <div className="footer-container">
               <div className="timer-container">
                    <div className={stblTimeOutcss} >
                         <h4 className="timeout-text">{msToTime(stblTimeOut)}</h4>
                    </div>
               </div>
               <div className="tire-code-container">
                    <input
                         id="tire-code"
                         type="text"
                         value={tireCode}
                         onChange={(event) => handleChange(event)}
                         maxLength="6"
                    />
               </div>
          </div>
     )
}

export default FooterComp
