import { Form, InputNumber, Pagination, Table, Typography } from 'antd';
import React, { useState } from 'react';

function InputTable (props) {
    const { user_num, max_rank, max_sum } = props;

    const originData = [];
    for (let i = 0; i < user_num; i++) {
        var obj = {key: i.toString()}
        for (let j = 0; j < user_num; j++) {
            obj['git' + j] = 0;
        }
        originData.push(obj);
    }
    console.log(originData);

    const EditableCell = ({
                              editing,
                              dataIndex,
                              title,
                              inputType,
                              record,
                              index,
                              children,
                              ...restProps
                          }) => {

        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: `Can't be Empty!`,
                            },
                        ]}
                    >
                        <InputNumber
                            min={0}
                            max={max_rank}
                        />
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const [form] = Form.useForm();
    const [data, setData] = useState(originData);
    const [editingKey, setEditingKey] = useState('');
    const [sumValid, setSumValid] = useState(0);
    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            age: '',
            address: '',
            ...record,
        });
        setEditingKey(record.key);
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [];
    columns.push( {
        title: 'Users',
        dataIndex: 'users',
        width: '3%',
        render: (index) => {
            return (
                <h>Git{index}</h>
            )
        }
    })

    for (let i = 0; i < user_num; i++) {
        columns.push({
            title: 'Git' + i,
            dataIndex: 'git' + i,
            width: '3%',
            editable: true,
        });
    }

    columns.push({
        title: 'Operation',
        dataIndex: 'operation',
        render: (_, record) => {
            const editable = isEditing(record);
            return editable ? (
                <span>
                    <Typography.Link
                        onClick={() => save(record.key)}
                        style={{
                            marginRight: 8,
                        }}
                    >
                        Save
                    </Typography.Link>
                </span>
            ) : (
                <Typography.Link
                    disabled={editingKey !== ''}
                    onClick={() => edit(record)}
                >
                    Edit
                </Typography.Link>
            );
        },
    })


    const mergeColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: 'number',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <div>
            <div>
                <Form
                    form={form}
                    component={false}
                >
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        dataSource={data}
                        columns={mergeColumns}
                        rowClassName="editable-row"
                    />
                </Form>
            </div>
            <div>
                <button
                    // onClick={}
                    disabled={false}
                    id="submit-btn"
                    className="submit-btn">
                    Submit
                </button>
            </div>
        </div>
    );
};

export default InputTable;