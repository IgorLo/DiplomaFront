import * as React from "react";
import {useEffect, useState} from 'react';
import { useParams, Link } from "react-router-dom";
import {entities} from "../common/entities";
import Teacher = entities.Teacher;
import teacherById = entities.teacherById;
import { Table, Collapse, Avatar, PageHeader, Modal, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import PlanTask = entities.PlanTask;
import {utils} from "../common/utils";
import compareByAlph = utils.compareByAlph;
import TeacherTaskModal from "./components/TeacherTaskModal";
import allSuitableTeachers = entities.allSuitableTeachers;
import changeTaskTeacher = entities.changeTaskTeacher;
import allPossibleTasks = entities.allPossibleTasks;

const { Panel } = Collapse;

const TeacherPage = () => {

    let { id } = useParams();
    const [teacher, setTeacher] = useState<Teacher>();
    const [modalVisible, setModalVisible] = useState(false);
    const [suitableTeachers, setSuitableTeachers] = useState(new Array<Teacher>());
    const [planTaskId, setPlanTaskId] = useState(-1);
    const [possibleTasks, setPossibleTasks] = useState(new Array<PlanTask>());

    function handleSuitableTeachers(response: any) {
        setSuitableTeachers(response)
    }

    function updateSuitableTeachers(planTaskId: number) {
        setPlanTaskId(planTaskId);
        setSuitableTeachers(new Array<Teacher>());
        allSuitableTeachers(planTaskId, handleSuitableTeachers);
    }

    function updatePossibleTasks(){
        allPossibleTasks(id, handlePossibleTasks);
    }

    function handlePossibleTasks(response: any){
        setPossibleTasks(response);
    }

    function update(){
        teacherById(handleTeacher, id);
        updatePossibleTasks();
    }

    useEffect(() => {
        update();
    }, [])

    function handleTeacher(response: any) {
        setTeacher(response);
    }

    const firstTasksColumns = [
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
            title: '',
            dataIndex: 'teacherName',
            key: 'changeTeacher',
            render: (value: string, record: PlanTask) => {
                let dropTeacher = () => {
                    changeTaskTeacher(record.key, -1, () => {
                        update();
                    });
                }
                return <Button onClick={dropTeacher} danger={true}>Снять</Button>
            }
        }
    ]

    const secondTasksColumns = [
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
                    changeTaskTeacher(record.key, id, () => {
                        update();
                    })
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
                return <Button type="primary" onClick={onClick}>Назначить</Button>
            }
        }
    ]

    const teacherColumns = [
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            render: (value: number, record: Teacher) => {
                // return <Link to={"/teachers/" + record.key}>{value}</Link>
                return <div>{value}</div>
            }
        },
        {
            title: 'Школа',
            dataIndex: 'schoolName',
            key: 'schoolName'
        },
        {
            title: 'Ставка',
            dataIndex: 'rate',
            key: 'rate'
        },
        {
            title: 'Мин. (ч)',
            dataIndex: 'fromHours',
            key: 'fromHours',
            width: '5%'
        },
        {
            title: 'Макс. (ч)',
            dataIndex: 'toHours',
            key: 'toHours',
            width: '5%'
        },
        {
            title: 'Текущее (ч)',
            dataIndex: 'currentHours',
            key: 'currentHours',
            width: '5%'
        },
        {
            title: 'Загрузка (%)',
            dataIndex: 'currentHours',
            key: 'load',
            render: (value: number, record: Teacher) => {
                let busyness = value / record.toHours;
                let displayBusyness = busyness * 100;
                let color = '#84d65e'; //green
                let textColour = '#000000';
                if (busyness > 1.0) {
                    busyness = 1.0;
                }
                if (record.currentHours < record.fromHours) {
                    color = '#f5d742'; //yellow
                }
                if (record.currentHours > record.toHours) {
                    color = '#e66153'; //red
                    textColour = '#FFFFFF';
                }
                busyness = busyness * 100;
                return (
                    <div className="teacherCurrentBar" style={{
                        width: busyness + "%",
                        background: color,
                        color: textColour,
                        padding: '3px',
                        overflow: 'hidden'
                    }}>
                        <span>{Math.round(displayBusyness) + '%'}</span>
                    </div>
                )
            },
            width: '20%'
        }
    ]

    function defineClass(record: Teacher, index: number): string {
        if (record.currentHours > record.toHours) {
            return 'teacher__overload'
        } else if (record.currentHours < record.fromHours) {
            return 'teacher__notLoaded'
        } else {
            return 'teacher__okLoad'
        }
    }

    function defineTaskClass(record: PlanTask, index: number): string {
        if ((typeof record.teacherName) == 'undefined') {
            return "task_without_teacher";
        } else if (record.teacherName.length == 0) {
            return "task_without_teacher";
        } else {
            return "";
        }
    }

    if (typeof teacher == 'undefined'){
        return <h1>Загрузка...</h1>
    } else {
        return (
            <div>
                <PageHeader
                    className="site-page-header"
                    onBack={() => window.history.back()}
                    title="Назад"
                />
                <div className="teacherCard">
                    <Avatar size={128} icon={<UserOutlined />} />
                    <span>{teacher.name}</span>
                </div>
                <Collapse>
                    <Panel header="Общая информация" key="1">
                        <Table
                            columns={teacherColumns}
                            dataSource={[teacher]}
                            rowClassName={defineClass}
                            // expandable={{
                            //     expandedRowRender: (record: Teacher) => {
                            //         return (
                            //             <Table
                            //                 columns={tasksColumns}
                            //                 style={{margin: 0}}
                            //                 dataSource={record.tasks}
                            //                 bordered
                            //                 pagination={false}
                            //                 size="small"
                            //             />
                            //         )
                            //     }
                            // }}
                            bordered
                            size='small'
                            loading={false}
                            // @ts-ignore
                            pagination={null}
                            // scroll={{ y: 700 }}
                        />
                    </Panel>
                    <Panel header="Назначенные занятия" key="2">
                        <Table
                            columns={firstTasksColumns}
                            dataSource={teacher.tasks}
                            bordered
                            size='small'
                            rowClassName={defineTaskClass}
                            // @ts-ignore
                            pagination={{position: ['none', 'bottomCenter'], pageSize: 17}}
                            // scroll={{ y: 700 }}
                        />
                    </Panel>
                    <Panel header="Возможные назначения" key="3">
                        <Table
                            columns={secondTasksColumns}
                            dataSource={possibleTasks}
                            bordered
                            size='small'
                            rowClassName={defineTaskClass}
                            // @ts-ignore
                            pagination={{position: ['none', 'bottomCenter'], pageSize: 17}}
                            // scroll={{ y: 700 }}
                        />
                    </Panel>
                </Collapse>
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
                            update();
                        }}
                        teachers={suitableTeachers}
                        planTaskId={planTaskId}
                    />
                </Modal>
            </div>
        )
    }
}

export default TeacherPage;
