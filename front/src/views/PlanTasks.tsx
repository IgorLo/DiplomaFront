import * as React from "react";
import {useEffect, useState} from 'react';
import {entities} from "../common/entities";
import {Table, Modal, Button, Space} from "antd"
import PlanTask = entities.PlanTask;
import allPlanTasks = entities.allPlanTasks;
import "./PlanTasks.css"
import {utils} from "../common/utils";
import compareByAlph = utils.compareByAlph;
import TeacherTaskModal from "./components/TeacherTaskModal";
import Teacher = entities.Teacher;
import allSuitableTeachers = entities.allSuitableTeachers;


const PlanTasks = () => {

    const [tasks, setTasks] = useState(new Array<PlanTask>());
    const [rawData, setRawData] = useState(new Array<any>());
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [suitableTeachers, setSuitableTeachers] = useState(new Array<Teacher>());
    const [planTaskId, setPlanTaskId] = useState(-1);

    function handleTeachers(response: any) {
        setSuitableTeachers(response)
    }

    function updateSuitableTeachers(planTaskId: number) {
        setPlanTaskId(planTaskId);
        setSuitableTeachers(new Array<Teacher>());
        allSuitableTeachers(planTaskId, handleTeachers);
    }

    const columns = [
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
        },
        {
            title: 'Преподаватель',
            dataIndex: 'teacherName',
            key: 'teacherName',
            sorter: (a: PlanTask, b: PlanTask) => compareByAlph(a.teacherName, b.teacherName),
            render: (name: string, record: PlanTask) => {
                let onClick = () => {
                    updateSuitableTeachers(record.key);
                    setModalVisible(true);
                }
                if (typeof name == 'undefined') {
                    return (
                        <div>
                            <Button onClick={onClick}>Назначить</Button>
                        </div>
                    )
                }
                if (name.length == 0){
                    return (
                        <Button onClick={onClick}>Назначить</Button>
                    )
                }
                return <Space>
                    {name}
                    <Button onClick={onClick}>Изменить</Button>
                </Space>
            }
        }
    ]
    // const rowSelection = {
    //     selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT]
    // }

    useEffect(() => {
        allPlanTasks(handleTasks)
    }, [])

    function handleTasks(response: any) {
        setLoading(false);
        setTasks(response);
        setRawData(response);
    }

    function defineClass(record: PlanTask, index: number): string {
        if ((typeof record.teacherName) == 'undefined') {
            return "task_without_teacher";
        } else if (record.teacherName.length == 0) {
            return "task_without_teacher";
        } else {
            return "";
        }
    }

    return (
        <div>
            {/*<button onClick={allStudents}>Студенты</button>*/}
            {/*<Table rowSelection={rowSelection} columns={columns} dataSource={rawData}/>*/}
            <Table
                columns={columns}
                dataSource={rawData}
                size='small'
                expandable={{
                    expandedRowRender: record => <p style={{margin: 0}}>{"Какой-то дополнительный контент"}</p>,
                    rowExpandable: record => record.name !== 'Not Expandable',
                }}
                loading={loading}
                rowClassName={defineClass}
                // @ts-ignore
                pagination={{position: ['none', 'bottomCenter'], pageSize: 15}}
                // scroll={{ y: 700 }}
            />
            <Modal
                visible={modalVisible}
                footer={null}
                centered
                closable={false}
                width={1100}
            >
                <TeacherTaskModal
                    setVisible={setModalVisible}
                    update={() => {
                        setLoading(true);
                        allPlanTasks(handleTasks);
                    }}
                    teachers={suitableTeachers}
                    planTaskId={planTaskId}
                />
            </Modal>
        </div>
    )

}

export default PlanTasks;

