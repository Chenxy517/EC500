import React from "react";
import { Form, Input, message, InputNumber } from 'antd';
import axios from 'axios';
import PubSub from "pubsub-js"
import MD5 from "./md5_lib"
import { REDIS_URL } from "../constants";
import { PASSWORD } from '../constants';
import { SALT } from '../constants';

function InputBox() {
    var md5 = new MD5(SALT + PASSWORD);
    const hash = md5.md5;

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
        var name = document.getElementById("wiki-name");
        var command = 'HMSET user:' + name.value;
        for (var i = 0; i < 5; i++) {
            var score = document.getElementById("git" + i).value;
            console.log(score);
            command += ' git' + i + ' ' + score;
        }
        console.log(command)

        const opt = {
            method: 'GET',
            url: REDIS_URL + '?salt=' + SALT + '&hash=' + hash + '&message=' + command,
            headers: { 'content-type': 'application/json'}
        };

        axios(opt)
            .then( response => {
                console.log('Request sent to Redis: ', opt)
                console.log(response.data)
                if(response.status === 200) {
                    if (!response.data || response.data.length === 0) {
                        message.error('Submit Fail');
                    }
                    else {
                        message.success('Submit Succeed');
                    }

                }
            })
            .catch( error => {
                console.log(error.message);
                message.error('Submit Fail');
            })
    }

    const ViewData = async() => {
        var name = document.getElementById("wiki-name");
        let flag = 0;
        let sum = 0;
        for (var i = 0; i < 5; i++) {
            var command = 'HGET user:' + name.value + ' git' + i;
            const opt = {
                method: 'GET',
                url: REDIS_URL + '?salt=' + SALT + '&hash=' + hash + '&message=' + command,
                headers: { 'content-type': 'application/json'}
            };
            let score;
            await axios(opt)
                .then( response => {
                    console.log('Request sent to Redis: ', opt)
                    score = response.data.toLocaleString().slice(-2)
                    if(response.status === 200) {
                        if (response.data && response.data.length !== 0) {
                            flag++;
                        }
                    }
                })
                .catch( error => {
                    console.log(error.message);
                    message.error('View Request Fail');
                })
            console.log(score)
            document.getElementById("git" + i).value = score;
            sum += parseInt(score);
        }
        if (flag == 5) {
            message.success("View Request Succeed")
            document.getElementById("sum").value = sum;
        }
        else {
            message.error("View Request Fail")
        }
    }

    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="Input Wikiname"
                    id="wiki-name"
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