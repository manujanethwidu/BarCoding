import React, { useEffect } from 'react'
import ManualBarCode from '../components/manualBarCode';

const PpcScreen = () => {
     const closeMenu = () => {
          document.querySelector('.sidebar').classList.remove('open');
     };
     useEffect(() => {
          closeMenu()
     }, [])
     return (
          <div>
              <ManualBarCode/>
          </div>
     )
}
export default PpcScreen
