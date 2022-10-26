import Grouping from "./Grouping"
import ParamBox from './ParamBox'

import React, {useState} from 'react'
import {Routes, Route, BrowserRouter} from "react-router-dom";

function Main() {

    const [user_num, setUserNum] = useState(0);
    const [member_num, setMemberNum] = useState(0);

    const handleUserNum = (value) => {
        setUserNum(value);
    }
    const handleMemberNum = (value) => {
        setMemberNum(value);
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ParamBox handleUserNum={handleUserNum} handleMemberNum={handleMemberNum} />}/>
                <Route path="/show" element={<ParamBox handleUserNum={handleUserNum} handleMemberNum={handleMemberNum} />}/>
                <Route path="/input" element={<Grouping user_num={user_num} member_num={member_num} />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Main