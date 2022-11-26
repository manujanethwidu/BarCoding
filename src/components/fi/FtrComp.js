/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef } from 'react'
import '../../css/FtrComp.css'
import { useHistory } from 'react-router-dom'
import SLTLDBConnection from '../../apis/SLTLDBConnection'
import printerHost from '../../apis/printerHost'
import * as fs from 'fs';
//Toastify
import { notifyError, notifySuccessQk } from '../../utils/toastify'
import CreateTxtFile from '../../utils/createTxtFile'
import TodayDateFormatter from '../../utils/todayDateFormat'


function shallowEquall(object1, object2) {
     const keys1 = Object.keys(object1);
     const keys2 = Object.keys(object2);

     if (keys1.length !== keys2.length) {
          return false;
     }

     for (let key of keys1) {
          if (object1[key] != object2[key]) {
               return false;
          }
     }
     return true;
}

const FtrComp = ({ tireDetails }) => {
     //Initial state of useStates
     const initDefSummery = {
          tf: 0,
          mm: 0,
          ld: 0,
          bo: 0,
          bg: 0,
          bfm: 0,
          trfm: 0,
          speu: 0,
          sndp: 0,
          other: 0,
          nmdirty: 0,
     }

     const [hd, setHd] = useState("")
     const [defSummery, setDefSummery] = useState(initDefSummery)
     const [us, setUs] = useState()
     const [isInspected, setIsInspected] = useState(false)
     const [fiTblData, setFiTblData] = useState({})
     const avlRef = useRef(5)
     let history = useHistory()
     const auth_level = localStorage.getItem("auth_level")
     //Destructrue props
     const { tiresizebasic,
          lugtype,
          config,
          rimsize,
          tiretypecap,
          brand,
          swmsg,
          moldno,
          pid,
          moldid,
          sn
     } = tireDetails

     //Destructre states
     const { tf, mm, ld, bo, bg, bfm, trfm, speu, sndp, other, nmdirty } = defSummery

     //Check already inspected tire
     useEffect(() => {
          const fetchData = async () => {
               try {
                    const fiInfo = await SLTLDBConnection.get(`/fi/fi/${sn}`)
                    //for valied sn only
                    if (sn) {
                         console.log(fiInfo);
                         if (fiInfo.data.data) {
                              //Inspected 
                              setIsInspected(true)
                              setFiTblData(fiInfo.data.data)
                              if (auth_level == 2) {
                                   history.push(`/fi`)
                                   notifyError('Already Inspected Tire')
                              }
                         } else {
                              //Not inspected tire and Low Autorization Level(Auth Level 3)
                              //Rederect to list view
                              if (auth_level == 3) {
                                   history.push(`/fi`)
                                   notifyError('Not inspected Tire')
                              }
                         }
                    }
               } catch (err) {
                    notifyError(err.message)
               }
          }
          fetchData()
     }, [tireDetails])
     //If already inpected tire set def summery
     useEffect(() => {
          const fetchData = async () => {
               try {
                    if (fiTblData.sn) {

                         setDefSummery({
                              tf: fiTblData.tf,
                              mm: fiTblData.mm,
                              ld: fiTblData.ld,
                              bo: fiTblData.bo,
                              bg: fiTblData.bg,
                              bfm: fiTblData.bfm,
                              trfm: fiTblData.trfm,
                              speu: fiTblData.speu,
                              sndp: fiTblData.sndp,
                              other: fiTblData.other,
                              nmdirty: fiTblData.nmdirty
                         })
                         setHd(fiTblData.hd)
                         setUs(fiTblData.us)
                    }
               } catch (err) {
                    notifyError(err.message)
               }
          }
          fetchData()
     }, [fiTblData])

     const handleInputChange = (e) => {
          const target = e.target;
          // eslint-disable-next-line default-case
          switch (target.name) {
               case "tf":
                    setDefSummery({ ...defSummery, tf: e.target.value })
                    break
               case "mm":
                    setDefSummery({ ...defSummery, mm: e.target.value })
                    break
               case "ld":
                    setDefSummery({ ...defSummery, ld: e.target.value })
                    break
               case "bo":
                    setDefSummery({ ...defSummery, bo: e.target.value })
                    break
               case "bg":
                    setDefSummery({ ...defSummery, bg: e.target.value })
                    break
               case "bfm":
                    setDefSummery({ ...defSummery, bfm: e.target.value })
                    break
               case "trfm":
                    setDefSummery({ ...defSummery, trfm: e.target.value })
                    break
               case "speu":
                    setDefSummery({ ...defSummery, speu: e.target.value })
                    break
               case "sndp":
                    setDefSummery({ ...defSummery, sndp: e.target.value })
                    break
               case "nmdirty":
                    setDefSummery({ ...defSummery, nmdirty: e.target.value })
                    break
               case "other":
                    setDefSummery({ ...defSummery, other: e.target.value })
                    break
          }
     }

     //ButtonHandlers------------------------
     //Set HD
     const clickHandler = (e) => {
          setHd(e.target.name)
     }


     const btnCheck = async (e) => {
          alert("fuck")
     }
     //Enter data
     const btnTireGradeHandler = async (e) => {
          //Correct Grade

          var grade = e.target.name;
          if (grade == "A+") {
               grade = "A"
               avlRef.current = 2
          }
          //Correct PID for barcoding
          var pidFinal = pid.toString()
          var firstLetter = pidFinal.charAt(0)
          if (firstLetter == "2") {
               pidFinal = pidFinal.replace('2', '0')
          }
          const barcode = "P-" + pidFinal + "L" + sn + grade
          console.log(barcode);
          const w = 0
          var zpl = "^XA" +
               "^FO" + (w + 50) + ",0^BY2 ^BCN,85,N,N,S^FD" + barcode
               + "^FS^CF0,40^FO" + (w + 100) + ",90^FD" + barcode + "^FS^XZ";
          // console.log(zpl);

          // var zpl = "^XA" +
          // "^FO" + (w + 170) + ",0^BY2 ^BCN,80,N,N,S^FD" + barcode
          // + "^FS^CF0,40^FO" + (w + 200) + ",100^FD" + barcode + "^FS^XZ";

          try {
               const updateBarCode = await printerHost.put(`/bc`, { zpl, bcprinter: 1 })
               //Error in server
               if (updateBarCode.data.error) {
                    return notifyError(updateBarCode.data.error + ' insert temp. barcode table')
               }
               //row count in inserted result is not equal to 1
               if (updateBarCode.data.data !== 1) {
                    return notifyError('Not Inserted in temp barcode table')
               }

               //New Entery for final_inspectioin Table
               if (!isInspected) {
                    // final inspection table
                    const insertFITbl = await SLTLDBConnection.put(`/fi/fi/${sn}`, {
                         sn,
                         pid,
                         moldno,
                         moldid,
                         userid: 0,
                         username: localStorage.getItem("user_name"),
                         tf,
                         mm,
                         ld,
                         bo,
                         bg,
                         bfm,
                         trfm,
                         speu,
                         sndp,
                         other,
                         nmdirty,
                         hd,
                         us,
                         grade
                    });
                    //Hide button itself
                    // document.getElementById("btnEnter").style.visibility = 'hidden'

                    //If error in updating
                    if (insertFITbl.data.error) {
                         return notifyError(insertFITbl.data.error)
                    }

               } else {
                    //Alredy inspected tire. Update the final inspection table
                    // final inspection table
                    const updateFITbl = await SLTLDBConnection.post(`/fi/fi/${sn}`, {
                         sn,
                         username: localStorage.getItem("user_name"),
                         tf,
                         mm,
                         ld,
                         bo,
                         bg,
                         bfm,
                         trfm,
                         speu,
                         sndp,
                         other,
                         nmdirty,
                         hd,
                         us,
                         grade
                    });

                    //If error in updating
                    if (updateFITbl.data.error) {
                         return notifyError(updateFITbl.data.error)
                    }

               }
               const avl = avlRef.current
               const updateStockTbl = await SLTLDBConnection.put(`/stk/stockbarcode/${sn}`, {
                    qg: grade,
                    pid,
                    avl
               });

               if (updateStockTbl.data.error) {
                    return notifyError(updateStockTbl.data.error)
               }
               const txtFileData = {
                    sn,
                    barcode,
                    dom: TodayDateFormatter(),
               }
               //Update TTS(create text file)
               CreateTxtFile(txtFileData)
               history.push(`/fi`)
               notifySuccessQk('updated')
          } catch (err) {
               notifyError(err.message)
          }
     }

     const createTxtFile = () => {
          fs.readFile('./tx.txt', 'utf8', (err, eslint) => {
               if (err) {
                    return console.error(err);
               }
               console.log(`async read file: ${eslint.toString()}`);
          })
     }


     const goBackHandler = () => {
          history.push(`/fi`)
     }
     return (
          <div className='fi-container'>
               <div className="row">
                    <div className='tire-detail'>
                         {tiresizebasic} {lugtype} {config} {rimsize} {tiretypecap} {brand} / {swmsg}
                         <br />
                         <p>MoldNo:-{moldno}</p> <p>SN:- {sn}</p>
                    </div>
               </div>
               {/* HD Button Group */}
               <div className="btn-toolbar">
                    <div className="btn-group mr-2" role="group" aria-label="First group">
                         HD:-{hd}
                         {auth_level == 3 ? <></> :
                              <>
                                   <button onClick={e => clickHandler(e)} type="button" className="btn btn-secondary" name='60'>60</button>
                                   <button onClick={e => clickHandler(e)} type="button" className="btn btn-secondary" name='61'>61</button>
                                   <button onClick={e => clickHandler(e)} type="button" className="btn btn-secondary" name='62'>62</button>
                                   <button onClick={e => clickHandler(e)} type="button" className="btn btn-secondary" name='63'>63</button>
                                   <button onClick={e => clickHandler(e)} type="button" className="btn btn-secondary" name='64'>64</button>
                                   <button onClick={e => clickHandler(e)} type="button" className="btn btn-secondary" name='65'>65</button>
                                   <button onClick={e => clickHandler(e)} type="button" className="btn btn-secondary" name='66'>66</button>
                                   <button onClick={e => clickHandler(e)} type="button" className="btn btn-secondary" name='67'>67</button>
                                   <button onClick={e => clickHandler(e)} type="button" className="btn btn-secondary" name='68'>68</button>
                                   <button onClick={e => clickHandler(e)} type="button" className="btn btn-secondary" name='69'>69</button>
                                   <button onClick={e => clickHandler(e)} type="button" className="btn btn-secondary" name='70'>70</button>
                              </>
                         }
                    </div>
               </div>
               {/* Us Reading */}
               <div className='table-containter'>
                    <table className="table-responsive{-sm-md|-lg|-xl} table mt-2 text-left table-hover table-sm">

                         <tbody>
                              <tr className="table-warning">
                                   <td>US Reading</td>
                                   <td><input
                                        value={us}
                                        onChange={e => setUs(e.target.value)}
                                        type='number'
                                        className='form-control ' />
                                   </td>
                                   <td>
                                        <button

                                             onClick={goBackHandler}
                                             className='btn btn-warning form-control'>
                                             &nbsp;&nbsp;&nbsp;&nbsp;Back&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        </button>
                                   </td>
                              </tr>
                         </tbody>
                    </table>
               </div>
               {/* A+ Button */}
               {auth_level == 3 ?
                    // Unautorized access for changes
                    <></>
                    :
                    // Authorized Access for changes
                    <>
                         {shallowEquall(initDefSummery, defSummery) && hd > 0 ?
                              <div>
                                   <button
                                        name="A+"
                                        className='btn btn-primary form-control'
                                        onClick={e => btnTireGradeHandler(e)}>
                                        A+
                                   </button>
                              </div> :
                              <div> </div>}
                    </>
               }
               {/* Defect Table */}
               <div className='table-containter'>
                    <table className="table-responsive{-sm-md|-lg|-xl} table mt-2 text-left table-hover table-sm">
                         <thead>
                              <tr>

                                   <th scope="col-5" className="text-primary">Defect</th>
                                   <th className="text-primary">Scale</th>

                              </tr>
                         </thead>
                         <tbody>
                              {/* TRead...................--------------------------------------------......... */}
                              <tr>

                                   <td>Thick Flash</td>
                                   <td>
                                        <select className="form-control"
                                             name="tf"
                                             value={tf}
                                             onChange={e => handleInputChange(e)}
                                        >
                                             <option value="0">-</option>
                                             <option value="1">3mm</option>
                                             <option value="2">5mm</option>
                                             <option value="3">7mm</option>
                                             <option value="4">10mm</option>
                                        </select>
                                   </td>
                              </tr>
                              <tr>
                                   <td>Mold Mark</td>
                                   <td>
                                        <select className="form-control"
                                             name="mm"
                                             value={mm}
                                             onChange={e => handleInputChange(e)}
                                        >
                                             <option value="0">-</option>
                                             <option value="1">Small</option>
                                             <option value="2">Medium</option>
                                             <option value="3">High</option>
                                        </select>
                                   </td>
                              </tr>
                              <tr>
                                   <td>Back Grinding</td>
                                   <td>
                                        <select className="form-control"
                                             name="bg"
                                             value={bg}
                                             onChange={e => handleInputChange(e)}
                                        >
                                             <option value="0">-</option>
                                             <option value="1">Small</option>
                                             <option value="2">Medium</option>
                                             <option value="3">High</option>
                                        </select>
                                   </td>
                              </tr>
                              <tr>
                                   <td>Lug Damage</td>
                                   <td>
                                        <select className="form-control"
                                             name="ld"
                                             value={ld}
                                             onChange={e => handleInputChange(e)}
                                        >
                                             <option value="0">-</option>
                                             <option value="1">1-3</option>
                                             <option value="2">4-6</option>
                                             <option value="3">7-10</option>
                                             <option value="4">10+</option>
                                        </select>
                                   </td>
                              </tr>
                              <tr>
                                   <td>Tr Flow Mark</td>
                                   <td>
                                        <select className="form-control"
                                             name="trfm"
                                             value={trfm}
                                             onChange={e => handleInputChange(e)}
                                        >
                                             <option value="0">-</option>
                                             <option value="1">Small</option>
                                             <option value="2">Medium</option>
                                             <option value="3">High</option>
                                        </select>
                                   </td>
                              </tr>
                              <tr>
                                   <td>Speu Particles</td>
                                   <td>
                                        <select className="form-control"
                                             name="speu"
                                             value={speu}
                                             onChange={e => handleInputChange(e)}
                                        >
                                             <option value="0">-</option>
                                             <option value="1">Miner</option>
                                             <option value="2">Medium</option>
                                             <option value="3">High</option>
                                        </select>
                                   </td>
                              </tr>
                              <tr>
                                   <td>NM Dirty</td>
                                   <td>
                                        <select className="form-control"
                                             name="nmdirty"
                                             value={nmdirty}
                                             onChange={e => handleInputChange(e)}
                                        >
                                             <option value="0">-</option>
                                             <option value="1">Small</option>
                                             <option value="2">Medium</option>
                                             <option value="3">High</option>
                                        </select>
                                   </td>
                              </tr>

                              {/* Base ---------------------------------------------------------------------------*/}
                              <tr>
                                   <td>Base Flow Mark</td>
                                   <td>
                                        <select className="form-control"
                                             name="bfm"
                                             value={bfm}
                                             onChange={e => handleInputChange(e)}
                                        >
                                             <option value="0">-</option>
                                             <option value="1">Small</option>
                                             <option value="2">Medium</option>
                                             <option value="3">High</option>
                                        </select>
                                   </td>
                              </tr>

                              <tr>
                                   <td>Bead Out</td>
                                   <td>
                                        <select className="form-control"
                                             name="bo"
                                             value={bo}
                                             onChange={e => handleInputChange(e)}
                                        >
                                             <option value="0">-</option>
                                             <option value="1">Small</option>
                                             <option value="2">Medium</option>
                                             <option value="3">High</option>
                                        </select>
                                   </td>
                              </tr>

                              {/* SW ------------------------------------------------------------------- */}
                              <tr>
                                   <td>Stensil No Displacement</td>
                                   <td>
                                        <select className="form-control"
                                             name="sndp"
                                             value={sndp}
                                             onChange={e => handleInputChange(e)}
                                        >
                                             <option value="0">-</option>
                                             <option value="1">Small</option>
                                             <option value="2">Medium</option>
                                             <option value="3">High</option>
                                        </select>
                                   </td>
                              </tr>


                              {/* Others------------------------------ */}
                              <tr>
                                   <td>Others</td>
                                   <td>
                                        <select className="form-control"
                                             name="other"
                                             value={other}
                                             onChange={e => handleInputChange(e)}
                                        >
                                             <option value="0">-</option>
                                             <option value="1">Forign Matters</option>
                                             <option value="2">Appure Dammage</option>
                                             <option value="3">No Type</option>
                                             <option value="4" >Peek</option>
                                             <option value='5'>Plate Dammage</option>
                                             <option value='6'>Lock Dammage</option>
                                             <option value='7'>Mold Slip</option>
                                             <option value='8'>Corrosion</option>
                                             <option value='9'>Short Weight</option>
                                             <option value='10'>Deform</option>
                                             <option value='11'>Turn Mold</option>
                                             <option value='12'>Surface Bead</option>
                                             <option value='13'>Under Cure</option>
                                             <option value='14'>Base Dammage</option>
                                             <option value='15'>Blow Hole</option>
                                             <option value='16'>Other</option>
                                        </select>
                                   </td>
                              </tr>

                         </tbody>
                    </table>

               </div>





               {
                    auth_level == 3 ?
                         <></>
                         :
                         <>
                              {shallowEquall(defSummery, initDefSummery) ?
                                   <></>
                                   :
                                   <>
                                        {hd > 0 ?
                                             <div>
                                                  <div className="button-group">
                                                       <div className='table-containter'>
                                                            <table className="table-responsive{-sm-md|-lg|-xl} table mt-2 text-left table-hover table-sm">

                                                                 <tbody>
                                                                      <tr>
                                                                           <td> <button
                                                                                className='btn btn-primary form-control'
                                                                                name="A"
                                                                                onClick={e => btnTireGradeHandler(e)}>
                                                                                A
                                                                           </button>
                                                                           </td>
                                                                      </tr>
                                                                 </tbody>
                                                            </table>
                                                       </div>
                                                  </div>
                                                  {/* DownGrade Button Group */}
                                                  <div className='table-containter'>
                                                       <table className="table-responsive{-sm-md|-lg|-xl} table mt-2 text-left table-hover table-sm">

                                                            <tbody>
                                                                 <tr>
                                                                      <td> <button name="B"
                                                                           onClick={e => btnTireGradeHandler(e)}
                                                                           className='btn btn-success form-control'>B
                                                                      </button>
                                                                      </td>
                                                                      <td> <button name="C"
                                                                           onClick={e => btnTireGradeHandler(e)}
                                                                           className='btn btn-warning form-control'>C
                                                                      </button>
                                                                      </td>
                                                                      <td> <button name="E"
                                                                           onClick={e => btnTireGradeHandler(e)}
                                                                           className='btn btn-info form-control'>E
                                                                      </button>
                                                                      </td>
                                                                      <td> <button name="R"
                                                                           onClick={e => btnTireGradeHandler(e)}
                                                                           className='btn btn-danger form-control'>R
                                                                      </button>
                                                                      </td>
                                                                      <td> <button name="L"
                                                                           onClick={e => btnTireGradeHandler(e)}
                                                                           className='btn btn-secondary form-control'>L
                                                                      </button>
                                                                      </td>
                                                                 </tr>

                                                            </tbody>
                                                       </table>
                                                  </div>
                                             </div>
                                             :
                                             <></>
                                        }
                                   </>

                              }
                              <button name="L"
                                   onClick={e => btnCheck(e)}
                                   className='btn btn-secondary form-control'>L
                              </button>
                         </>
               }
          </div>
     )
}

export default FtrComp
