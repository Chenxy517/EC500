import Grouping from "./Grouping"
import ParamBox from './ParamBox'

import React, {useState} from 'react'
import {Routes, Route, BrowserRouter} from "react-router-dom";

function Main() {

    const [user_num, setUserNum] = useState(0);
    const [member_num, setMemberNum] = useState(0);
    const [max_rank, setMaxRank] = useState(0);
    const [max_sum, setMaxSum] = useState(0);

    const handleUserNum = (value) => {
        setUserNum(value);
    }
    const handleMemberNum = (value) => {
        setMemberNum(value);
    }
    const handleMaxRank = (value) => {
        setMaxRank(value);
    }
    const handleMaxSum = (value) => {
        setMaxSum(value);
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ParamBox handleUserNum={handleUserNum} handleMemberNum={handleMemberNum} handleMaxRank={handleMaxRank} handleMaxSum={handleMaxSum} />}/>
                <Route path="/show" element={<ParamBox handleUserNum={handleUserNum} handleMemberNum={handleMemberNum} handleMaxRank={handleMaxRank} handleMaxSum={handleMaxSum} />}/>
                <Route path="/input" element={<Grouping user_num={user_num} member_num={member_num} max_rank={max_rank} max_sum={max_sum}/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Main