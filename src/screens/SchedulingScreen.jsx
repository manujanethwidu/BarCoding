import React, { useEffect } from 'react'

const SchedulingScreen = () => {
     const closeMenu = () => {
          document.querySelector('.sidebar').classList.remove('open');
     };
     useEffect(() => {
          closeMenu()
     }, [])
     return (
          <div>
               Scheduling Screeen
          </div>
     )
}

export default SchedulingScreen
