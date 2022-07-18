import React, { useEffect, useRef, useState } from 'react'

const LolScreen = () => {
     const closeMenu = () => {
          document.querySelector('.sidebar').classList.remove('open');
     };
     useEffect(() => {
          closeMenu()
     }, [])

     let [timerCount, setTimer] = useState(0)
     const intervalRef = useRef(null)



     function stopHandler() {
          clearInterval(intervalRef.current)
          intervalRef.current = null
      
     }

     function ResetHandler() {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          setTimer(0)
     }
     function statHandler() {
          intervalRef.current = setInterval(() => {
               setTimer(prevState => prevState + 1)
          }, 1000)
          return () => clearInterval(intervalRef.current)
     }

     function ReStartHandler() {
          ResetHandler()
          intervalRef.current = setInterval(() => {
               setTimer(prevState => prevState + 1)
          }, 1000)
          return () => clearInterval(intervalRef.current)
     }



     return (
          <div className="parent">


               {timerCount}
               <div>
                    <button onClick={statHandler}>Stat</button>
                    <button onClick={stopHandler}>Stop</button>
                    <button onClick={ResetHandler}>Reset</button>
                    <button onClick={ReStartHandler}>Restart</button>
               </div>
          </div>
     )
}

export default LolScreen
