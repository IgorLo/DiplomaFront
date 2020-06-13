import * as React from "react";
import {Button, Tree, Input, Space, Table} from "antd";
import {useState, useEffect, ChangeEvent} from "react";
import {entities} from "../../common/entities";
import allGroups = entities.allGroups;
import Student = entities.Student;
import Group = entities.Group;
import createNewSet = entities.createNewSet;
import Teacher = entities.Teacher;
import {utils} from "../../common/utils";
import compareByAlph = utils.compareByAlph;
import PlanTask = entities.PlanTask;
import changeTaskTeacher = entities.changeTaskTeacher;
import allSuitableTeachers = entities.allSuitableTeachers;

const {Search} = Input;

const TeacherTaskModal = (props: any) => {
    const [searchValue, setSearchValue] = useState<string>("");

    const onSearch = (value: string) => {
        setSearchValue(value);
    }

    function changeTaskHandler(response: any) {
        props.update();
        setSearchValue('');
        props.setVisible(false);
    }

    const teacherColumns = [
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: Teacher, b: Teacher) => compareByAlph(a.name, b.name)
        },
        {
            title: 'Школа',
            dataIndex: 'schoolName',
            key: 'schoolName',
            sorter: (a: Teacher, b: Teacher) => compareByAlph(a.schoolName, b.schoolName)
        },
        {
            title: 'Ставка',
            dataIndex: 'rate',
            key: 'rate',
            sorter: (a: Teacher, b: Teacher) => a.rate - b.rate
        },
        {
            title: 'Мин. (ч)',
            dataIndex: 'fromHours',
            key: 'fromHours',
            sorter: (a: Teacher, b: Teacher) => a.fromHours - b.fromHours,
            width: '5%'
        },
        {
            title: 'Макс. (ч)',
            dataIndex: 'toHours',
            key: 'toHours',
            sorter: (a: Teacher, b: Teacher) => a.toHours - b.toHours,
            width: '5%'
        },
        {
            title: 'Текущее (ч)',
            dataIndex: 'currentHours',
            key: 'currentHours',
            sorter: (a: Teacher, b: Teacher) => a.currentHours - b.currentHours,
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
                if (busyness > 1.0){
                    busyness = 1.0;
                }
                if (record.currentHours < record.fromHours){
                    color = '#f5d742'; //yellow
                }
                if (record.currentHours > record.toHours){
                    color = '#e66153'; //red
                    textColour = '#FFFFFF';
                }
                busyness = busyness * 100;
                return (
                    <div className="teacherCurrentBar" style={{
                        width: busyness+"%",
                        background: color,
                        color: textColour,
                        padding: '3px',
                        overflow: 'hidden'
                    }}>
                        <span>{Math.round(displayBusyness) + '%'}</span>
                    </div>
                )
            },
            sorter: (a: Teacher, b: Teacher) => (a.currentHours/a.toHours) - (b.currentHours/b.toHours),
            width: '20%'
        },
        {
            title: '',
            dataIndex: 'currentHours',
            key: 'setTeacher',
            render: (value: number, record: Teacher) => {
                let onClick = () => {
                    changeTaskTeacher(props.planTaskId, record.key, changeTaskHandler);
                }
                return <Button onClick={onClick}>Назначить</Button>
            }
        }
    ];

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

    return (
        <div>
            <h2>Назначить преподавателя</h2>
            <Search
                placeholder="Преподаватель"
                onSearch={onSearch}
                style={{marginBottom: 8}}
            />
            <Table
                columns={teacherColumns}
                dataSource={props.teachers.filter((teacher: Teacher) => teacher.name.includes(searchValue))}
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
                size='small'
                loading={props.teachers.length == 0}
                // @ts-ignore
                pagination={{position: ['none', 'none'], pageSize: 10}}
                // scroll={{ y: 700 }}
            />
            <Button
                type="primary"
                danger={true}
                onClick={() => {
                    props.setVisible(false);
                }}>
                Закрыть
            </Button>
        </div>
    )

}

export default TeacherTaskModal