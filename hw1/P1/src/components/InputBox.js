import React from "react";
import { Form, Input, message, InputNumber } from 'antd';
import axios from 'axios';
import PubSub from "pubsub-js"
import MD5 from "./md5_lib"
import { REDIS_URL } from "../constants";
import { PASSWORD } from '../constants';
import { SALT } from '../constants';

function InputBox() {

    const UpdateSum = () => {
        var g0 = document.getElementById("git0");
        var g1 = document.getElementById("git1");
        var g2 = document.getElementById("git2");
        var g3 = document.getElementById("git3");
        var g4 = document.getElementById("git4");
        var sum = parseInt(g0.value) + parseInt(g1.value) + parseInt(g2.value) + parseInt(g3.value) + parseInt(g4.value)
        document.getElementById("sum").value = sum;
        var submitbtn = document.getElementById("submit-btn");
        if (sum > 100 || sum < 0) {
            submitbtn.disabled = true;
            message.error("Total score must be smaller than 100!")
        } else {
            submitbtn.disabled = false;
        }
    }

    const Submit = () => {
        console.log("submit")
    }

    const ViewData = () => {
        console.log("view")
    }

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="Input Wikiname"
                    className="wiki-name"
                />
            </div>
            <div>
                <InputNumber
                    // min={0}
                    // max={100}
                    defaultValue={0}
                    readOnly={true}
                    addonBefore="Sum"
                    id="sum"
                    className="sum"
                />
            </div>
            <div>
                <InputNumber
                    min={0}
                    max={99}
                    defaultValue={0}
                    controls={false}
                    addonBefore="Git0"
                    id="git0"
                    onChange={UpdateSum}
                    className="rank-table"
                />
            </div>
            <div>
                <InputNumber
                    min={0}
                    max={99}
                    defaultValue={0}
                    controls={false}
                    addonBefore="Git1"
                    id="git1"
                    onChange={UpdateSum}
                    className="rank-table"
                />
            </div>
            <div>
                <InputNumber
                    min={0}
                    max={99}
                    defaultValue={0}
                    controls={false}
                    addonBefore="Git2"
                    id="git2"
                    onChange={UpdateSum}
                    className="rank-table"
                    label="123"
                />
            </div>
            <div>
                <InputNumber
                    min={0}
                    max={99}
                    defaultValue={0}
                    controls={false}
                    addonBefore="Git3"
                    id="git3"
                    onChange={UpdateSum}
                    className="rank-table"
                />
            </div>
            <div>
                <InputNumber
                    min={0}
                    max={99}
                    defaultValue={0}
                    controls={false}
                    addonBefore="Git4"
                    id="git4"
                    onChange={UpdateSum}
                    className="rank-table"
                />
            </div>
            <div>
                <button
                    onClick={Submit}
                    id="submit-btn"
                    className="submit-btn">
                    Submit
                </button>
            </div>
            <div>
                <button
                    onClick={ViewData}
                    className="view-btn">
                    View
                </button>
            </div>

        </div>
    );
}

export default InputBox;