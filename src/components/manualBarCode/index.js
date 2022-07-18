import React from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import FilterBar from './FilterBar'
import SnComponent from './SnComponent'

const ManualBarCode = () => {
    const inputRef = useRef()
    const inputRefFocus = () => {
        inputRef.current.focus();
    }
    const [pidNewState, setPidNewState] = useState()
    const [filterBarHide, setFilterBarHide] = useState(true)

    const newPidSetter = (val) => {
        setPidNewState(Number(val))
    }

    const filterBarHideSetter = (val) => {
        setFilterBarHide(val)
    }

    return (
        <div>
            <SnComponent pidNewState={pidNewState} filterBarHideSetter={filterBarHideSetter} inputRef={inputRef} inputRefFocus={inputRefFocus} />
            {filterBarHide ? '' : <FilterBar pidNewState={pidNewState} newPidSetter={newPidSetter} />}
        </div>
    )
}

export default ManualBarCode
