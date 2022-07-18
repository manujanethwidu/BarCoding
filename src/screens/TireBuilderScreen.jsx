import { connect } from 'react-redux'
import React, { useState, useEffect } from 'react'


import { useDispatch, useSelector } from 'react-redux'
import { scaleReading } from '../redux/scale/scaleActions'
import FooterComp from '../components/builder/FooterComp'
import ScaleComp from '../components/builder/ScaleComp'
import SLTLDBConnection from '../apis/SLTLDBConnection'
import MainCompTB from '../components/builder/MainCompTB'



const TireBuilderScreen = () => {
     const scale = useSelector(state => state.scaleData)

     const [sWgt, setSWgt] = useState(0)
     const [scaleWgt, setScaleWgt] = useState("No Connection")
     const [finalWgt, setFinalWgt] = useState()
     const [stable, setStable] = useState(false)
     const [stblTimeOut, setStblTimeOut] = useState(0)
     const [stblTimeOutSetting, setStblTimeOutSetting] = useState(500)
     const [tireDetail, setTireDetail] = useState({})
     
     const dispatch = useDispatch()
     var { reading } = scale


     // Tire Code//////

     const [tireCode, setTireCode] = useState("xx1xx");
   

     function handleChange(newValue) {
          setTireCode(newValue);
     }


     useEffect(() => {
          setTireDetail({})
          if (tireCode.length === 5) {
               const fetchData = async () => {
                    const { data, status } = await SLTLDBConnection.get(`/get-tc-details/10520`)

                    if (((data.data.data.length > 0))) {
                         setTireDetail(data.data.data[0])
                    } else {
                         setTireDetail({})
                    }
               }
               fetchData()
               console.log(tireDetail);

          }
     }
          , [tireCode])

     // 
     //Fetch data from redux store
     useEffect(() => {
          try {
               //state Setters
               scale.reading &&
                    scale.reading && setScaleWgt(scale.reading.reading.reading.substring(3, 11))
               scale.reading && setSWgt(Number(scale.reading.reading.reading.substring(4, 9)))
               const lr = JSON.parse(localStorage.getItem("cr"))

               //Timer action
               const sto = { reading: sWgt, time: Date.now() }
               if (lr.reading !== sWgt) {
                    localStorage.setItem("cr", JSON.stringify(sto))
               }
               if ((Date.now() - lr.time) > stblTimeOutSetting) {
                    setStable(true)
               }
               setStblTimeOut((Date.now() - lr.time))

          } catch (error) {

          }
     }, [scale])


     //Fetch from localhost:4000/sc  and store in redux store with timer
     useEffect(() => {

          const timer = setInterval(async () => {
               //  dispatch(scaleReading())
          }, 300);

          return () => {
               clearInterval(timer)
          }
     }, [])

     //Close the slide bar
     useEffect(() => {
          document.querySelector('.sidebar').classList.remove('open');
     }, [])

     return (
          <>
               <div className="grid-container-builder">

                    <header className="header-builder">
                         <ScaleComp scaleWgt={scaleWgt} sWgt={sWgt} />
                    </header>
                    <main className='main-builder'>
                         {tireDetail.tirecode && <MainCompTB tireDetail={tireDetail} />}
                    </main>
                    <footer className='footer-builder'>
                         <FooterComp stblTimeOut={stblTimeOut} stblTimeOutSetting={stblTimeOutSetting}
                              tireCode={tireCode} onChange={handleChange}
                         />

                    </footer>
               </div>
          </>
     )
}

export default TireBuilderScreen
