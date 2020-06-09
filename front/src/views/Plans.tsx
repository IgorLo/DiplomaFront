import * as React from 'react';
import { useState, useEffect } from 'react';
import {entities} from "../common/entities";
import Plan = entities.Plan;
import allPlans = entities.allPlans;
import TeacherTaskModal from "./components/TeacherTaskModal";
import { Table } from 'antd';
import {utils} from "../common/utils";
import compareByAlph = utils.compareByAlph;
import { Link } from 'react-router-dom';
import PlanTask = entities.PlanTask;


const Plans = () => {

    const [plans, setPlans] = useState(new Array<Plan>());
    const [rawData, setRawData] = useState(new Array<any>());

    function handlePlans(response: any) {
        setRawData(response);
        setPlans(response);
    }

    useEffect(() => {
        allPlans(handlePlans)
    }, [])

    const planColumns = [
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: Plan, b: Plan) => compareByAlph(a.name, b.name),
            render: (value: number, record: Plan) => {
                return <Link
                    to={"/plans/" + record.key}
                    style ={{
                        fontSize: '12pt'
                    }}
                >
                    {value}
                </Link>
            },
            width: '10%'
        },
        {
            title: 'Школа',
            dataIndex: 'schoolName',
            key: 'schoolName',
            sorter: (a: Plan, b: Plan) => compareByAlph(a.schoolName, b.schoolName)
        },
        {
            title: 'Назначений',
            dataIndex: 'tasks',
            key: 'tasks',
            sorter: (a: Plan, b: Plan) => a.tasks.length - b.tasks.length,
            render: (value: Array<PlanTask>, record: Plan) => {
                return <span>{value.length}</span>
            }
        },
        {
            title: 'Всего часов',
            dataIndex: 'totalHours',
            key: 'totalHours',
            sorter: (a: Plan, b: Plan) => a.totalHours - b.totalHours,
            width: '5%'
        },
        {
            title: 'Назначено часов',
            dataIndex: 'currentHours',
            key: 'currentHours',
            sorter: (a: Plan, b: Plan) => a.currentHours - b.currentHours,
            width: '5%'
        },
        {
            title: 'Готовность (%)',
            dataIndex: 'currentHours',
            key: 'load',
            render: (value: number, record: Plan) => {
                let readyness = record.currentHours / record.totalHours;
                let displayReadyness = readyness * 100;
                let color = '#84d65e'; //green
                let textColour = '#000000';
                if (readyness < 0.99 && readyness > 0.6) {
                    color = '#f5d742'; //yellow
                }
                if (readyness <= 0.6) {
                    color = '#e66153'; //red
                    textColour = '#FFFFFF';
                }
                readyness = readyness * 100;
                return (
                    <div className="planCurrentBar" style={{
                        width: readyness + "%",
                        background: color,
                        color: textColour,
                        padding: '3px',
                        overflow: 'hidden'
                    }}>
                        <span>{Math.round(displayReadyness) + '%'}</span>
                    </div>
                )
            },
            sorter: (a: Plan, b: Plan) => (a.currentHours / a.totalHours) - (b.currentHours / b.totalHours),
            width: '20%'
        }
    ]

    function defineClass(record: Plan, index: number): string {
        let readyness = record.currentHours / record.totalHours;
        if (readyness < 0.99 && readyness > 0.6) {
            return 'teacher__notLoaded';
        }
        if (readyness <= 0.6) {
            return 'teacher__overload';
        }
        return 'teacher__okLoad';
    }

    return (
        <div>
            {/*<button onClick={allStudents}>Студенты</button>*/}
            {/*<Table rowSelection={rowSelection} columns={columns} dataSource={rawData}/>*/}
            <Table
                columns={planColumns}
                dataSource={rawData}
                rowClassName={defineClass}
                bordered
                size='large'
                loading={plans.length == 0}
                // @ts-ignore
                pagination={{position: ['none', 'bottomCenter'], pageSize: 15}}
                // scroll={{ y: 700 }}
            />
        </div>
    )

}

export default Plans;