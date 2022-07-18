import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'


const ListView = ({ handleChange, val, tireDetails }) => {
    const [symbolsArr] = useState(["e", "E", "+", "-", "."]);
    let history = useHistory()

    //SN onChange Handler
    const snHndler = (e) => {
        handleChange(e.target.value)
    }
    //SN onKey Handler
    const snKeyHandler = (e) => {
         symbolsArr.includes(e.key) && e.preventDefault()
    }


    //Handlers----------------------------
    //Click row then go to edit-spec-page
    const handleSelectRow = (sn, specid) => {
        // fetchTireDetails(sn)
        history.push(`/ftr/${sn}`)
    }
    //-------------------------------------

    return (
        <>
            <div className="">
                <table className="table-responsive{-sm-md|-lg|-xl} table mt-2 text-left table-hover table-sm">
                    <thead>
                        <tr>
                            <th >
                                <label className="text-primary" htmlFor="sn">SN</label>

                                <input className="form-control input-sm w-70"
                                    id="sn"
                                    type="number"
                                    value={val}
                                    onChange={(e) => snHndler(e)}
                                    onKeyDown={e => snKeyHandler(e)}
                                />
                            </th>

                            <th className="text-primary">TireSize</th>
                            <th className="text-primary">Type</th>
                            <th className="text-primary">Rim</th>
                            <th className="text-primary">Brand/SWMsg</th>
                            <th className="text-primary">M-No</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tireDetails && tireDetails.map(el => (
                                <tr onClick={() => handleSelectRow(el.sn, el.specid)} key={el.sn} >
                                    <td className="text-primary">{el.sn}</td>
                                    <td >{el.tiresizebasic}   {el.lugtype} {el.config} {el.rimsize}</td>
                                    <td> {el.tiretypecap}</td>
                                    <td>{el.brand}/{el.swmsg}</td>
                                    <td>{el.pid}</td>
                                    <td>{el.moldno}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}




export default ListView
