import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import TeacherTaskModal from "./components/TeacherTaskModal";
import { useState, useEffect } from 'react';
import {entities} from "../common/entities";
import Teacher = entities.Teacher;
import allSuitableTeachers = entities.allSuitableTeachers;
import PlanTask = entities.PlanTask;
import {utils} from "../common/utils";
import compareByAlph = utils.compareByAlph;
import changeTaskTeacher = entities.changeTaskTeacher;
import planById = entities.planById;
import { Button, Space, Table, Modal } from 'antd';
import Plan = entities.Plan;


const PlanPage = () => {

    let { id } = useParams();

    const [plan, setPlan] = useState<Plan>();
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
            title: 'Преподаватель',
            dataIndex: 'teacherName',
            key: 'teacherName',
            sorter: (a: PlanTask, b: PlanTask) => compareByAlph(a.teacherName, b.teacherName),
            render: (name: string, record: PlanTask) => {
                if (typeof name == 'undefined') {
                    return <div></div>
                }
                if (name.length == 0) {
                    return <div></div>
                }
                return <div>
                    <Link to={"/teachers/" + record.teacherId}>{name}</Link>
                </div>
            }
        },
        {
            title: '',
            dataIndex: 'teacherName',
            key: 'action',
            width: '10%',
            render: (name: string, record: PlanTask) => {
                let onClick = () => {
                    updateSuitableTeachers(record.key);
                    setModalVisible(true);
                }
                let dropTeacher = () => {
                    setLoading(true);
                    changeTaskTeacher(record.key, -1, () => {
                        planById(handlePlan, id);
                    });
                }
                if (typeof name == 'undefined') {
                    return (
                        <div>
                            <Button type="primary" onClick={onClick}>Назначить</Button>
                        </div>
                    )
                }
                if (name.length == 0) {
                    return (
                        <Button type="primary" onClick={onClick}>Назначить</Button>
                    )
                }
                return <Space>
                    <Button onClick={onClick}>Изменить</Button>
                    <Button danger={true} onClick={dropTeacher}>Убрать</Button>
                </Space>
            }
        }
    ]
    // const rowSelection = {
    //     selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT]
    // }

    useEffect(() => {
        planById(handlePlan, id)
    }, [])

    function handlePlan(response: any) {
        setLoading(false);
        setPlan(response);
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
            <h2>{
                (typeof plan == 'undefined') ? "" : plan.name
            }</h2>
            {/*<button onClick={allStudents}>Студенты</button>*/}
            {/*<Table rowSelection={rowSelection} columns={columns} dataSource={rawData}/>*/}
            <Table
                columns={columns}
                dataSource={
                    (typeof plan == 'undefined') ? [] : plan.tasks
                }
                bordered
                size='small'
                loading={loading}
                rowClassName={defineClass}
                // @ts-ignore
                pagination={{position: ['none', 'bottomCenter'], pageSize: 17}}
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
                        planById(handlePlan, id);
                    }}
                    teachers={suitableTeachers}
                    planTaskId={planTaskId}
                />
            </Modal>
        </div>
    )

}

export default PlanPage;