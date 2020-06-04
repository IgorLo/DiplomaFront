import * as React from "react";
import {useEffect, useState} from 'react';
import {entities} from "../common/entities";
import {Table, Modal, Button} from "antd"
import "./PlanTasks.css"
import Teacher = entities.Teacher;
import allTeachers = entities.allTeachers;
import PlanTask = entities.PlanTask;
import {utils} from "../common/utils";
import compareByAlph = utils.compareByAlph;


const Teachers = () => {

    const [teachers, setTeachers] = useState(new Array<Teacher>());
    const [rawData, setRawData] = useState(new Array<any>());

    const teacherColumns = [
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'fromHours',
            dataIndex: 'fromHours',
            key: 'fromHours'
        },
        {
            title: 'toHours',
            dataIndex: 'toHours',
            key: 'toHours'
        },
        {
            title: 'rate',
            dataIndex: 'rate',
            key: 'rate'
        },
        {
            title: 'schoolName',
            dataIndex: 'schoolName',
            key: 'schoolName'
        },
        {
            title: 'currentHours',
            dataIndex: 'currentHours',
            key: 'currentHours'
        },
        {
            title: 'Загрузка',
            dataIndex: 'currentHours',
            key: 'currentHours',
            render: (value: number, record: Teacher) => {
                let busyness = value / record.toHours;
                let color = '#84d65e'; //green
                if (busyness > 1.0){
                    busyness = 1.0
                }
                if (record.currentHours < record.fromHours){
                    color = '#f5d742' //yellow
                }
                if (record.currentHours > record.toHours){
                    color = '#e66153' //red
                }
                busyness = busyness * 100;
                return (
                    <div className="teacherCurrentBar" style={{
                        width: busyness+"%",
                        background: color
                    }}>

                    </div>
                )
            },
            width: '20%'
        }
    ]

    const tasksColumns = [
        {
            title: 'Дисциплина',
            dataIndex: 'discipline',
            key: 'discipline',
            sorter: (a: PlanTask, b: PlanTask) => compareByAlph(a.discipline, b.discipline)
        },
        {
            title: 'Вид работ',
            dataIndex: 'activityType',
            key: 'activityType',
            filterMultiple: true,
            filters: [
                {
                    text: 'Практика',
                    value: 'Практика'
                },
                {
                    text: 'Курс. работа',
                    value: 'Курс. работа'
                },
                {
                    text: 'Лекции',
                    value: 'Лекции'
                },
                {
                    text: 'Лабораторные',
                    value: 'Лабораторные'
                }
            ],
            onFilter: (value: string, record: PlanTask) => record.activityType.indexOf(value) === 0,
            sorter: (a: PlanTask, b: PlanTask) => compareByAlph(a.activityType, b.activityType)
        },
        {
            title: 'Множество',
            dataIndex: 'groupName',
            key: 'groupName',
            sorter: (a: PlanTask, b: PlanTask) => compareByAlph(a.groupName, b.groupName)
        },
        {
            title: 'Часы',
            dataIndex: 'hours',
            key: 'hours',
            sorter: (a: PlanTask, b: PlanTask) => a.hours - b.hours
        },
        {
            title: 'План',
            dataIndex: 'planName',
            key: 'planName',
            sorter: (a: PlanTask, b: PlanTask) => compareByAlph(a.planName, b.planName)
        }
    ]
    // const rowSelection = {
    //     selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT]
    // }

    useEffect(() => {
        allTeachers(handleTeachers)
    }, [])

    function handleTeachers(response: any) {
        setTeachers(response)
        setRawData(response)
    }

    return (
        <div>
            {/*<button onClick={allStudents}>Студенты</button>*/}
            {/*<Table rowSelection={rowSelection} columns={columns} dataSource={rawData}/>*/}
            <Table
                columns={teacherColumns}
                dataSource={rawData}
                expandable={{
                    expandedRowRender: (record: Teacher) => {
                        return (
                            <Table
                                columns={tasksColumns}
                                style={{margin: 0}}
                                dataSource={record.tasks}
                                bordered
                                pagination={false}
                                size="small"
                            />
                        )
                    }
                }}
                bordered
                loading={teachers.length == 0}
                // @ts-ignore
                pagination={{position: ['none', 'bottomCenter'], pageSize: 15}}
                // scroll={{ y: 700 }}
            />
        </div>
    )

}

export default Teachers;

