import React from 'react'
import { useEffect } from 'react'
import { notifyError, notifySuccessQk } from '../../utils/toastify'
import SLTLDBConnection from '../../apis/SLTLDBConnection'
import { useState } from 'react'

const FilterBar = ({pidNewState,newPidSetter}) => {

    
    const [pidDetailListState, setPidDetailListState] = useState([])

    const [sbInput, setSbInput] = useState("")
    const [lugInput, setLugInput] = useState('')
    const [confInput, setConfInput] = useState('')
    const [tireTypeInput, setTireTypeInput] = useState('')
    const [rimSizeInput, setRimSizeInput] = useState('')
    const [brandInput, setBrandInput] = useState('')
    const [swMsgInput, setswMsgInput] = useState('')
    var results = []

    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pidDetail] = await Promise.all([
                    SLTLDBConnection.get(`/pid/allpiddetail`),
                ]);

                const pidDetailUpperCase = pidDetail?.data?.rows.map(x => {
                    return {
                        brand: x.brand.toUpperCase(),
                        config: x.config.toUpperCase(),
                        lugtypecap: x.lugtypecap.toUpperCase(),
                        pid: x.pid,
                        rimsize: x.rimsize.toUpperCase(),
                        swmsg: x.swmsg.toUpperCase(),
                        tiresizebasic: x.tiresizebasic.toUpperCase(),
                        tiretypecap: x.tiretypecap.toUpperCase(),
                        color: x.color.toUpperCase()

                    }
                })
                setPidDetailListState(pidDetailUpperCase)
            }
            catch (err) {
                console.log(err)
            }

        }
        fetchData()

    }, [])



    function DataTable() {


        return (
            <table class="table table-striped table-sm">
                <thead>
                    <tr>
                        <th scope="col">PID</th>
                        <th scope="col">Tire Size</th>
                        <th scope="col">Rim Size</th>
                        <th scope="col">Tire Type</th>
                        <th scope="col">Brand</th>
                        <th scope="col">SWMsg</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        results?.map(x => (
                            <tr onClick={()=>clickRowHandle(x)}  key={x.pid}>
                                <td>{x.pid}</td>
                                <td>{x.tiresizebasic} {x.lugtypecap} {x.config}</td>
                                <td>{x.rimsize}</td>
                                <td>{x.tiretypecap}</td>
                                <td>{x.brand}</td>
                                <td>{x.swmsg}</td>
                            </tr>
                        ))
                    }

                </tbody>
            </table>
        )
    }

    const clickRowHandle = (x) => {
        setSbInput(x.tiresizebasic)
        setLugInput(x.lugtypecap)
        setConfInput(x.config)
        setRimSizeInput(x.rimsize)
        setBrandInput(x.brand)
        setswMsgInput(x.swmsg)
        setTireTypeInput(x.tiretypecap)

        newPidSetter(x.pid)
    }
    //Create filtering
    results = pidDetailListState
        .filter(f => (f.tiresizebasic.includes(sbInput)
            && f.lugtypecap.includes(lugInput)
            && f.config.includes(confInput)
            && f.tiretypecap.includes(tireTypeInput)
            && f.rimsize.includes(rimSizeInput)
            && f.brand.includes(brandInput)
            && f.swmsg.includes(swMsgInput)
        ))

    const inputChangeHandler = (e) => {
        switch (e.target.name) {
            case 'sbInput':
                setSbInput(e.target.value.toUpperCase())
                return
            case 'lugInput':
                setLugInput(e.target.value.toUpperCase())
                return
            case 'confInput':
                setConfInput(e.target.value.toUpperCase())
                return
            case 'rimSizeInput':
                setRimSizeInput(e.target.value.toUpperCase())
                return
            case 'brandInput':
                setBrandInput(e.target.value.toUpperCase())
                return
            case 'swMsgInput':
                setswMsgInput(e.target.value.toUpperCase())
                return
            case 'tireTypeInput':
                setTireTypeInput(e.target.value.toUpperCase())
                return
        }
    } 
    return (

        <div className='container-fluid m-auto' >

            <div className="row mt-3  alert alert-warning">
                {/* Tire Size ---------------------------*/}
                <div className="col-6 col-md-2">
                    <input className="form-control" name='sbInput' placeholder="TireSize" value={sbInput} onChange={e => inputChangeHandler(e)} />
                </div>
                <div className="col-6 col-md-1">
                    <input className="form-control" name='lugInput' placeholder="LugType" value={lugInput} onChange={e => { inputChangeHandler(e) }} />
                </div>
                <div className="col-6 col-md-2">
                    <input className="form-control" name='confInput' placeholder="Config" value={confInput} onChange={e => { inputChangeHandler(e) }} />
                </div>
                <div className="col-6 col-md-1">
                    <input className="form-control" name='rimSizeInput' placeholder="Rim" value={rimSizeInput} onChange={e => { inputChangeHandler(e) }} />
                </div>
                <div className="col-6 col-md-1">
                    <input className="form-control" name='tireTypeInput' placeholder="Type" value={tireTypeInput} onChange={e => { inputChangeHandler(e) }} />
                </div>
                <div className="col-6 col-md-2">
                    <input className="form-control" name='brandInput' placeholder="Brand" value={brandInput} onChange={e => { inputChangeHandler(e) }} />
                </div>
                <div className="col-6 col-md-2">
                    <input className="form-control" name='swMsgInput' placeholder="SWMSG" value={swMsgInput} onChange={e => { inputChangeHandler(e) }} />
                </div>
            </div>
            <div className="container">

            </div>
            <div className=' alert-primary'>
                <hr />
                <hr />
            </div>
            <DataTable/>
            {/* ---------------------------------------------- */}
        </div>

    )
}

export default FilterBar
