import React from 'react'
import {InputNumber} from 'antd'
import { useNavigate } from "react-router-dom"

function ParamBox (props) {
    const { handleUserNum, handleMemberNum, handleMaxRank, handleMaxSum} = props;

    let navigate = useNavigate();

    const submitParam = () => {
        handleUserNum(parseInt(document.getElementById("user_num").value));
        handleMemberNum(parseInt(document.getElementById("member_num").value));
        handleMaxRank(parseInt(document.getElementById("max_rank").value));
        handleMaxSum(parseInt(document.getElementById("max_sum").value));
        navigate('/input');
    }

    return (
        <div className="param-box">
            <div className="input-boxes">
                <InputNumber
                    defaultValue={0}
                    controls={false}
                    addonBefore="User Number"
                    id="user_num"
                    className="number_input"
                />
            </div>
            <div className="input-boxes">
                <InputNumber
                    defaultValue={0}
                    controls={false}
                    addonBefore="Member Number"
                    id="member_num"
                    className="number_input"
                />
            </div>
            <div className="input-boxes">
                <InputNumber
                    defaultValue={0}
                    controls={false}
                    addonBefore="Maximum Rank"
                    id="max_rank"
                    className="number_input"
                />
            </div>
            <div className="input-boxes">
                <InputNumber
                    defaultValue={0}
                    controls={false}
                    addonBefore="Maximum Sum"
                    id="max_sum"
                    className="number_input"
                />
            </div>
            <div className="input-boxes">
                <button
                    onClick={submitParam}
                    className="param-btn">
                    Submit
                </button>
            </div>
        </div>
    )
}

export default ParamBox;