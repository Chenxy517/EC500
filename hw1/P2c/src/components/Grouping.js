import { message } from 'antd';
import React, { useState } from 'react';
import axios from 'axios';
import MD5 from "./md5_lib"
import GroupMatch from './GroupMatch';
import { REDIS_URL, SALT, PASSWORD } from "../constants";

function Grouping (props) {
    const { user_num, member_num } = props;

    const data = [];
    for (let i = 0; i < user_num; i++) {
        let obj = {
            user: 'Git' + i
        }
        for (let j = 0; j < user_num; j++) {
            obj['git' + j] = 0;
        }
        data.push(obj);
    }
    console.log(data)

    const groupUp = async () => {
        const new_md5 = new MD5(SALT + PASSWORD);
        const hash = new_md5.md5;
        for (let i = 0; i < user_num; i++) {
            for (let j = 0; j < user_num; j++) {
                const command = 'HGET user:git' + i + ' git' + j;
                const opt = {
                    method: 'GET',
                    url: REDIS_URL + '?salt=' + SALT + '&hash=' + hash + '&message=' + command,
                    headers: {'content-type': 'application/json'}
                };
                let score;
                await axios(opt)
                    .then(response => {
                        // console.log('Request sent to Redis: ', opt);
                        score = response.data.toLocaleString().slice(43);
                    })
                    .catch(error => {
                        console.log(error.message);
                        message.error('Data Fetch Failed!');
                    })
                data[i]['git' + j] = parseInt(score);

            }
        }

        const group_match = new GroupMatch(data, member_num);
        const best_match = group_match.best_match;
        console.log(best_match);

        let display = "";
        for (let i = 0; i < best_match.length; i++) {
            display += '<br/>Group' + i + ': ';
            for (let j = 0; j < best_match[i].length; j++) {
                console.log(best_match[i][j]);
                display += 'Git' + best_match[i][j] + '.  ';
            }
        };
        console.log(display);
        document.getElementById("display").innerHTML = display;
    }

    return (
        <div className="group-area">
            <div>
                <button
                    onClick={groupUp}
                    className="group-btn">
                    Grouping
                </button>
            </div>
            <div className="return-box">
                Grouping Result:
                <div 
                    id="display"
                    className="display">
                </div>
            </div>
        </div>   
    );
};

export default Grouping;