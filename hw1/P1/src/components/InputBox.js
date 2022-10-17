import React from "react";
import { Form, Input, message, InputNumber } from 'antd';
import axios from 'axios';
import MD5 from "./md5_lib"
import { REDIS_URL } from "../constants";
import { PASSWORD } from '../constants';
import { SALT } from '../constants';

function InputBox() {
    //Generate hashcode with salt and password imported from constant.js
    var md5 = new MD5(SALT + PASSWORD);
    const hash = md5.md5;

    //update sum of scores everytime number is changed
    const UpdateSum = () => {
        //get sum of scores
        var sum = 0;
        for (var i = 0; i < 5; i++) {
            var score = document.getElementById("git" + i).value;
            if (score == '') {
                score = 0;
            }
            sum += parseInt(score);
        }

        //set submit-button availability
        var submitbtn = document.getElementById("submit-btn");
        if (sum > 100 || sum < 0) {
            submitbtn.disabled = true;
            message.error("Total score must be smaller than 100!")
            document.getElementById("sum").value = "Check Score";
        } else {
            submitbtn.disabled = false;
            document.getElementById("sum").value = sum;
        }
    }

    //submit function
    const Submit = () => {
        //generate message with scores and wiki-name
        var name = document.getElementById("wiki-name");
        var command = 'HMSET user:' + name.value;
        for (var i = 0; i < 5; i++) {
            var score = document.getElementById("git" + i).value;
            if (score == '') {
                score = 0;
            }
            console.log(score);
            command += ' git' + i + ' ' + score;
        }
        console.log(command)

        //interaction with redis backend
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

    //view data function
    //use async..await structure to pass value out from axios
    const ViewData = async() => {
        var name = document.getElementById("wiki-name");
        //add 1 to flag everytime data is returned successfully
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
                    score = response.data.toLocaleString().slice(43)
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