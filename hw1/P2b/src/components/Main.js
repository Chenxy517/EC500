import InputTable from "./Table"
import {InputNumber} from 'antd'
import React, {useState} from 'react'

function Main() {
    const [user_num, setNum] = useState(5);
    const [max_rank, setRank] = useState(100);
    const [max_sum, setSum] = useState(100);

    const submitParam = () => {
        setNum(parseInt(document.getElementById("user_num").value));
        setRank(parseInt(document.getElementById("max_rank").value));
        setSum(parseInt(document.getElementById("max_sum").value));
    }

    return (
        <div>
            <div className="input-boxes">
                <InputNumber
                    defaultValue={5}
                    controls={false}
                    addonBefore="User Number"
                    id="user_num"
                    className="number_input"
                />
            </div>
            <div className="input-boxes">
                <InputNumber
                    defaultValue={100}
                    controls={false}
                    addonBefore="Maximum Rank"
                    id="max_rank"
                    className="number_input"
                />
            </div>
            <div className="input-boxes">
                <InputNumber
                    defaultValue={100}
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
                    Generate
                </button>
            </div>
            <div className="main">
                <InputTable user_num={user_num} max_rank={max_rank} max_sum={max_sum}/>
            </div>
        </div>

    )
}

export default Main