import React, { createContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { notifyError, notifySuccessQk, notifyWarning } from '../../utils/toastify'
import SLTLDBConnection from '../../apis/SLTLDBConnection'
import printerHost from '../../apis/printerHost'
import CreateTxtFile from '../../utils/createTxtFile'
import TodayDateFormatter from '../../utils/todayDateFormat'


const SnComponent = ({ pidNewState, filterBarHideSetter, inputRefFocus, inputRef }) => {
    //States
    const [snOrigState, setSnOrigState] = useState("")
    const [sizeFullOrigStage, setSizeFullOrigStage] = useState("")
    const [pidOrigState, setPidOrigState] = useState()
    const [qgOrigState, setQgOrigState] = useState()

    const [tireDetailState, setTireDetailState] = useState({})

    //New States 
    const [snNewState, setSnNewState] = useState("")
    const [sizeFullNewState, setSizeFullNewState] = useState("")
    const [pidNewLocalState, setPidNewLocalState] = useState()
    const [qgNewState, setQgNewState] = useState("A")


    //Disable state
    const [disbleNeSn, setDisbleNeSn] = useState(false)
    const [disbleOriSn, setDisbleOriSn] = useState(false)

    const [hideEnterState, setHideEnterState] = useState(true)


    //--------------------------------Effects---------------------------------------------
    //pidchange from filter Bar
    useEffect(() => {
        if (pidNewState) {
            setPidNewLocalState(pidNewState)

            //Get new pid details
            const fetchData = async () => {
                try {
                    const pidData = await
                        SLTLDBConnection.get(`/pid/pid-detail/${(Number(pidNewState))}`)
                    //Not a valied SN
                    const { tiresizebasic, lugtypecap, config, rimsize, tiretypecap, brand, swmsg, pid } = pidData?.data?.pid_detail
                    setSizeFullNewState(tiresizebasic + " " + lugtypecap + " " + config + " " + tiretypecap + " " + rimsize + " " + brand + " " + swmsg)
                    //Individual Tire Detail 
                    setTireDetailSetter(tiresizebasic, lugtypecap, config, tiretypecap, rimsize, brand, swmsg)


                }
                catch (err) {
                    console.log(err);
                    notifyError(err)
                }
            }
            //Try Fetch Data
            fetchData()


        }
    }, [pidNewState])
    //Original Sn Handling f
    useEffect(() => {
        if (snOrigState?.toString().length == 9) {
            //set new SN State
            filterBarHideSetter(false)
            const fetchData = async () => {
                try {
                    const pidDetail = await
                        SLTLDBConnection.get(`/stk/getallpiddetail/${(snOrigState)}`)
                    //Not a valied SN
                    if (pidDetail.data.data.rows.length == 0) {
                        setSnOrigState("")
                    }
                    console.log(pidDetail.data.data.rows[0]);
                    const { tiresizebasic, lugtypecap, config, rimsize, tiretypecap, brand, swmsg, pid, avl, qg } = pidDetail?.data?.data?.rows[0]
                    console.log(brand);
                    setSizeFullOrigStage(tiresizebasic + " " + lugtypecap + " " + config + " " + tiretypecap + " " + rimsize + " " + brand + " " + swmsg)
                    setPidOrigState(pid)
                    setSnNewState(snOrigState)
                    setSizeFullNewState(tiresizebasic + " " + lugtypecap + " " + config + " " + tiretypecap + " " + rimsize + " " + brand + " " + swmsg)

                    //Individual Tire Detail 
                    setTireDetailSetter(tiresizebasic, lugtypecap, config, tiretypecap, rimsize, brand, swmsg)

                    setDisbleNeSn(true)
                    setPidNewLocalState(pid)
                    setQgOrigState(qg.toUpperCase())
                    setQgNewState(qg.toUpperCase())

                }
                catch (err) {
                    console.log(err);
                    return notifyError(err)
                }
            }


            //Try Fetch Data 
            fetchData()
        } else {
            if (snNewState.toString().length !== 9)
                filterBarHideSetter(true)
        }
        //lenth is smaller than 9
        //Resetting
        setSizeFullOrigStage('')
        setSnNewState('')
        setSizeFullNewState('')
        setPidOrigState("")
        setPidNewLocalState("")
        setQgOrigState("")
        setQgNewState("")
        setTireDetailSetter("")
        //Controll new SN typeing.
        //When old Sn is not typed only new SN can be enterd
        if (snOrigState.toString().length == 0) {
            setDisbleNeSn(false)
        } else {
            setDisbleNeSn(true)
        }
    }, [snOrigState])

    //New Sn Handling
    useEffect(() => {
        if (snNewState?.toString().length == 9) {
            filterBarHideSetter(false)
            const fetchData = async () => {
                try {
                    const pidDetail = await
                        SLTLDBConnection.get(`/stk/getallpiddetail/${(snNewState)}`)
                    //Not a valied SN
                    if (pidDetail.data.data.rows.length == 0) {
                        notifySuccessQk('අලුත් සීරියල් නොම්බරයකි')
                    } else {//SN is available
                        console.log(pidDetail.data.data.rows[0]);
                        const { tiresizebasic, lugtypecap, config, rimsize, tiretypecap, brand, swmsg, pid } = pidDetail?.data?.data?.rows[0]

                        //Individual Tire Detail 
                        setTireDetailSetter(tiresizebasic, lugtypecap, config, tiretypecap, rimsize, brand, swmsg)

                        return setSnOrigState(snNewState)
                    }
                }
                catch (err) {
                    console.log(err);
                    return notifyError(err)
                }
            }
            //Try Fetch Data  s
            fetchData()
        } else {
            if (snOrigState.toString().length !== 9) filterBarHideSetter(true)
            setQgNewState("")
        }
        //lenth is smaller than 9
        //Resetting
        setPidNewLocalState('')
        setSizeFullNewState('')
        setTireDetailSetter("")

        //Controll Original SN typeing.
        //When new Sn is not typed only new Origianl can be  enterd
        if (snOrigState.toString().length == 0) {
            setDisbleOriSn(false)
        } else {
            setDisbleOriSn(true)
        }
    }, [snNewState])

    //Enter Button show and hide setting
    useEffect(() => {
        if (snNewState?.toString().length != 0 && qgNewState?.toString().length != 0 && pidNewLocalState?.toString().length != 0) {
            setHideEnterState(false)
        } else {
            setHideEnterState(true)
        }
    }, [snNewState, qgNewState, pidNewLocalState])

    //------------------------------------Handlers---------------------------------------------

    //Input text Fields----------------------
    const inputChangeHandler = (e) => {
        switch (e.target.name) {
            case 'snOrigInput':
                if (e.target.value.toString().length < 10) {
                    setSnOrigState(e.target.value);
                }
            case 'snNewInput':
                if (e.target.value.toString().length < 10) {
                    setSnNewState(e.target.value)
                }

                return
        }
    }


    //Radio option button change-----------------
    const onValueChange = (e) => {
        setQgNewState(e.target.value)
    }


    //Enter click hander------------------------
    const enterClickHandler = async () => {
        //Create ZPL Command
        //Correct PID for barcoding

        var pidFinal = pidNewLocalState.toString()
        var firstLetter = pidFinal.charAt(0)
        if (firstLetter == "2") {
            pidFinal = pidFinal.replace('2', '0')
        }
        const barcode = "P-" + pidFinal + "L" + snNewState + qgNewState

        const w = 0
        var zpl = "^XA" +
        "^FO" + (w + 50) + ",0^BY2 ^BCN,85,N,N,S^FD" + barcode
        + "^FS^CF0,40^FO" + (w + 100) + ",90^FD" + barcode + "^FS^XZ";
        // var zpl = "^XA" +
        //     "^FO" + (w + 170) + ",0^BY2 ^BCN,80,N,N,S^FD" + barcode
        //     + "^FS^CF0,40^FO" + (w + 200) + ",100^FD" + barcode + "^FS^XZ";
        // console.log(zpl);

        const txtFileData = {
            sn: snNewState,
            barcode,
            dom: TodayDateFormatter(),
        }

        if (snNewState != snOrigState) {
            //New SN
            //router.post('/insert', insertSN)  //req.body({ sn, pid, tc })
            //Data base
            try {
                //Update Stock Table
                const updateStockTbl = await SLTLDBConnection.post(`/stk/insert`, {
                    sn: snNewState,
                    qg: qgNewState,
                    pid: pidNewLocalState,
                    avl: 2
                });

                if (updateStockTbl.data.error) {
                    return notifyError(updateStockTbl.data.error)
                }

               
            } catch (err) {
                notifyError(err.message)
            }
        } else {
            //Data base
            try {
                //Update Stock Table
                const updateStockTbl = await SLTLDBConnection.put(`/stk/stockbarcode/${snOrigState}`, {
                    qg: qgNewState,
                    pid: pidNewLocalState,
                    avl: 2
                });
                if (updateStockTbl.data.error) {
                    return notifyError(updateStockTbl.data.error)
                }
            } catch (err) {
                notifyError(err.message)
            }
        }
        //Update TTS(create Text File)
        CreateTxtFile(txtFileData)
        //Print the barcode
        const updateBarCode = await printerHost.put(`/bc`, { zpl, bcprinter: 1 })
        //Error in server
        if (updateBarCode.data.error) {
            return notifyError(updateBarCode.data.error + ' insert temp. barcode table')
        }
        //row count in inserted result is not equal to 1
        if (updateBarCode.data.data !== 1) {
            return notifyError('Not Inserted in temp barcode table')
        }



        //Resetting and forcusing again
        inputRefFocus()
        setSnOrigState("")
        setSnNewState("")
        notifySuccessQk('updated')
    }
    //----------------------------------------Methods----------------------------------------------
    //Focus after enter button
    const focusHandle = () => {
        inputRefFocus()
    }
    //Tire detail state setter
    const setTireDetailSetter = (tiresizebasic, lugtypecap, config, tiretypecap, rimsize, brand, swmsg) => {

        setTireDetailState({
            tiresizebasic: tiresizebasic?.toUpperCase(),
            lugtypecap: lugtypecap?.toUpperCase(),
            config: config?.toUpperCase(),
            tiretypecap: tiretypecap?.toUpperCase(),
            rimsize: rimsize?.toUpperCase(),
            brand: brand?.toUpperCase(),
            swmsg: swmsg?.toUpperCase()
        })
    }
    return (
        <div className='container-fluid m-auto' >
            <div className="row mt-3  ">
                {/* Tire Size ---------------------------*/}
                <div className="col-6 alert alert-primary ml-1">
                    <h3 className='text-primary'>පැරණි විස්තර හා වෙනස්කම්</h3> 
                    <hr />
                    <form>
                        <div>
                            <div className="form-group row">
                                <label for="inputEmail3" className="col-sm-2 col-form-label">පැරණි SN & PID</label>
                                <div className="col-sm-6">
                                    <input type="number" ref={inputRef} className="form-control" name="snOrigInput" placeholder="Serial No" onChange={e => inputChangeHandler(e)} value={snOrigState} maxLength={9} />
                                </div>
                                <div className="col-sm-3">
                                    <input type="number" className="form-control" placeholder="PID" value={pidOrigState} disabled />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label for="inputEmail4" className="col-sm-2 col-form-label"> පැරණි ටයරය</label>
                                <div className="col-sm-10">
                                    <input readOnly type="email" className="form-control" id="inputEmail4" placeholder="" value={sizeFullOrigStage} />
                                </div>
                            </div>
                        </div>
                        <hr />
                        {disbleNeSn ? "" : <div className="form-group row">
                            <label for="inputEmail5" className="col-sm-2 col-form-label">අලුත් SN & PID</label>
                            <div className="col-sm-6">
                                <input id='inputEmail5' type="email" className="form-control" name="snNewInput"
                                    placeholder="නව SN type කරන්න"
                                    onChange={e => inputChangeHandler(e)} value={snNewState}
                                    disabled={disbleNeSn}
                                />
                            </div>
                            <div className="col-sm-3">
                                <input type="number" value={pidNewLocalState} className="form-control" placeholder="New PID" disabled />
                            </div>

                        </div>}
                        {disbleNeSn ? "" : <hr />}

                        <fieldset className="form-group">
                            <div className="row">
                                <legend className="col-form-label col-sm-2 pt-0"> අලුත් QG</legend>
                                <div className="rounded-circle form-check form-check-inline bg-primary p-3 text-white">
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="A" onChange={e => { onValueChange(e) }} checked={qgNewState == "A"} />
                                    <label className="form-check-label" for="inlineRadio1">A</label>
                                </div>
                                <div className="rounded-circle form-check form-check-inline bg-success p-3  text-white">
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="B" onChange={e => { onValueChange(e) }} checked={qgNewState == "B"} />
                                    <label className="form-check-label" for="inlineRadio2">B</label>
                                </div>
                                <div className="rounded-circle form-check form-check-inline bg-warning p-3  text-white">
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="C" onChange={e => { onValueChange(e) }} checked={qgNewState == "C"} />
                                    <label className="form-check-label" for="inlineRadio3">C</label>
                                </div>
                                <div className="rounded-circle form-check form-check-inline bg-info p-3  text-white">
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="E" onChange={e => { onValueChange(e) }} checked={qgNewState == "E"} />
                                    <label className="form-check-label" for="inlineRadio3">E</label>
                                </div>
                                <div className="rounded-circle form-check form-check-inline bg-danger p-3 text-white">
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="R" onChange={e => { onValueChange(e) }} checked={qgNewState == "R"} />
                                    <label className="form-check-label" for="inlineRadio3">R</label>
                                </div>
                                <div className="rounded-circle form-check form-check-inline bg-secondary p-3 text-white">
                                    <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio3" value="L" onChange={e => { onValueChange(e) }} checked={qgNewState == "L"} />
                                    <label className="form-check-label" for="inlineRadio3">L</label>
                                </div>
                            </div>
                        </fieldset>

                    </form>
                </div>
                <div className="col-5 alert alert-success ml-2">
                    <form>
                        <h3 className='text-primary'>නව බාර්කෝඩ් දත්ත</h3>
                        <hr />
                        <div className="form-group row">
                            <label for="staticEmail" className="col-sm-2 col-form-label">SN & PID</label>
                            <div className="col-sm-6">
                                <input type="text" readOnly className="form-control" id="staticEmail" value={snNewState} />
                            </div>
                            <div className="col-sm-3">
                                <input type="text" readOnly className="form-control" id="staticEmail" value={pidNewLocalState} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="inputPassword" className="col-sm-2 col-form-label">ටයරය</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="inputPassword" disabled value={sizeFullNewState} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label for="inputPassword" className="col-sm-2 col-form-label">QG</label>
                            <div className="col-sm-2">
                                <input type="text" className="form-control" id="inputPassword" disabled value={qgNewState} />
                            </div>
                        </div>
                        <button type="button" class="btn btn-primary btn-lg btn-block mt-5" onClick={enterClickHandler} hidden={hideEnterState}>Enter</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SnComponent
