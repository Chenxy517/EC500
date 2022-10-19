import React from "react";
import { Input, message, InputNumber } from 'antd';
import axios from 'axios';
import MD5 from "./md5_lib"
import { REDIS_URL } from "../constants";
import { SALT } from '../constants';

function InputBox() {

    /** 
     * Initialize View and Submit Button as disabled: 
     * When verify_status is: FALSE, 
     * and disable the Submit and View of the Action Rank;
     */ 
    var verify_status;
    var sum_status;
    var func = function() {       
        
        verify_status = false;
        sum_status = false;
        console.log("Verify status initialized as:", verify_status);
        console.log("Sum status initialized as:", sum_status);
        func = function(){};
    }
    func();

    // Update sum of scores everytime number is changed, 
    // and Get sum of scores depends on the Input.
    const UpdateSum = () => {
        var sum = 0;
        for (var i = 0; i < 5; i++) {
            var score = document.getElementById("git" + i).value;
            if (score === '') {
                score = 0;
            }
            sum += parseInt(score);
        }

        // Set submit-button availability: 
        if (sum > 100 || sum < 0){
            message.error("Total score must be smaller than 100!");
            document.getElementById("sum").value = "Check Score";
            sum_status = false;
        } 
        else {
            // For User friendly, without Raised an error when Sum != 100.
            if (sum === 100){
                sum_status = true;
            } 
            else {
                sum_status = false;
            }
            console.log(sum);
            document.getElementById("sum").value = sum;
            
        }
    }
    
    // Verify that if the user has the authenticate to view and edit the Auction Rank;
    const Verify = async() => {

        const password = document.getElementById("password").value;
        var new_md5 = new MD5(SALT + password);
        const hash_verify = new_md5.md5;
    
        //interaction with redis backend
        const opt = {
            method: 'GET',
            url: REDIS_URL + '?salt=' + SALT + '&hash=' + hash_verify + '&message=' + 'GET server:name',
            headers: { 'content-type': 'application/json'}
        };
    
        await axios(opt)
            .then( response => {
                console.log('Request sent to Redis: ', opt)
                console.log(response.data)
                if(response.status === 200) {
                    
                    if (!response.data || response.data.length === 0) {
                        message.error('Password Incorrect');
                        verify_status = false;
                    }
                    else {
                        message.success('Verify succeseed, Now you could edit your table!');
                        localStorage.setItem("hash_pass", hash_verify);
                        verify_status = true;
                    }
                }
            })
            .catch( error => {
                console.log(error.message);
            })

    };


    const Submit = async() => {
        
        console.log("Sum status:", sum_status);

        if (verify_status === true && sum_status === true) {

            var name = document.getElementById("wiki-name");
            const hash = localStorage.getItem("hash_pass");

            if (name.value === '') {
                message.error("Name must not be empty!");
            } 
            else {
                //generate message with scores and wiki-name
                var command = 'HMSET user:' + name.value;

                for (var i = 0; i < 5; i++) {
                    var score = document.getElementById("git" + i).value;
                    if (score === '') {
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
                
                await axios(opt)
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
        } 
        else {
            message.error("Invalid Password OR Total Score Is Invalid");
        }
    };

    // View data function
    // Use async..await structure to enable passing the value out from axios.
    const ViewData = async() => {

        if (verify_status === true) {

            var name = document.getElementById("wiki-name");
            
            const hash = localStorage.getItem("hash_pass");

            if (name.value === '') {
                message.error("Name must not be empty!");
            } else {
                // Add 1 to flag everytime data is returned successfully
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
                if (flag === 5) {
                    message.success("View Request Succeed")
                    document.getElementById("sum").value = sum;
                }
                else {
                    message.error("View Request Fail")
                }
            }

        }
        else {
            message.error("Invalid Password OR Total Score Is Invalid");
        }
       
    }
    
    return (
        <div>             
            <div>
              <Input.Password
                placeholder="Your Password" 
                name="password"
                id="password"
                label="Password"
                className="pass-word"
                rules={[
                    {
                        required: true,
                        message: 'Please input your password',
                    },
                ]}/>
            </div>          

            <div>
                <button
                    onClick={Verify}
                    id="verity-btn"
                    className="verify-btn">
                    Verify
                </button>
            </div>
            <div>
                <h1>Auction Rank: </h1>
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Enter Auction's name"
                    id="wiki-name"
                    className="wiki-name"
                />
            </div>
            <div>
                <InputNumber
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
                    id="view-btn"
                    className="view-btn">
                    View
                </button>
            </div>
            
        </div>
    );
}

export default InputBox;