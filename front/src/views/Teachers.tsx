import * as React from "react";
import {useEffect, useState} from 'react';
import {entities} from "../common/entities";
import {Table, Modal, Button, Space, Input} from "antd"
import "./PlanTasks.css"
import Teacher = entities.Teacher;
import allTeachers = entities.allTeachers;
import PlanTask = entities.PlanTask;
import {utils} from "../common/utils";
import compareByAlph = utils.compareByAlph;
import TeacherTaskModal from "./components/TeacherTaskModal";
import allSuitableTeachers = entities.allSuitableTeachers;
import {Link} from "react-router-dom";
import changeTaskTeacher = entities.changeTaskTeacher;
import { SearchOutlined } from "@ant-design/icons";


const Teachers = () => {

    const [teachers, setTeachers] = useState(new Array<Teacher>());
    const [rawData, setRawData] = useState(new Array<any>());
    const [modalVisible, setModalVisible] = useState(false);
    const [planTaskId, setPlanTaskId] = useState(-1);
    const [suitableTeachers, setSuitableTeachers] = useState(new Array<Teacher>());

    function handleSuitableTeachers(response: any) {
        setSuitableTeachers(response)
    }

    function updateSuitableTeachers(planTaskId: number) {
        setPlanTaskId(planTaskId);
        setSuitableTeachers(new Array<Teacher>());
        allSuitableTeachers(planTaskId, handleSuitableTeachers);
    }

    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");

    //@ts-ignore
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    //@ts-ignore
    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: any) => ({
        //@ts-ignore
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
            <div style={{padding: 8}}>
                <Input
                    ref={node => {
                        //@ts-ignore
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{width: 188, marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Поиск
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{width: 90}}>
                        Сбросить
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: any) => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
        onFilter: (value: string, record: any) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible: any) => {
            if (visible) {
                //@ts-ignore
                setTimeout(() => this.searchInput.select());
            }
        }
    });

    const teacherColumns = [
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: Teacher, b: Teacher) => compareByAlph(a.name, b.name),
            render: (value: number, record: Teacher) => {
                return <Link to={"/teachers/" + record.key}>{value}</Link>
            },
            ...getColumnSearchProps('name')
        },
        {
            title: 'Подразделение',
            dataIndex: 'schoolName',
            key: 'schoolName',
            sorter: (a: Teacher, b: Teacher) => compareByAlph(a.schoolName, b.schoolName),
            ...getColumnSearchProps('schoolName')
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
            sorter: (a: Teacher, b: Teacher) => (a.currentHours / a.toHours) - (b.currentHours / b.toHours),
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
        },
        {
            title: '',
            dataIndex: 'teacherName',
            key: 'changeTeacher',
            render: (value: string, record: PlanTask) => {
                let onClick = () => {
                    setPlanTaskId(record.key);
                    updateSuitableTeachers(record.key);
                    setModalVisible(true);
                }
                let dropTeacher = () => {
                    changeTaskTeacher(record.key, -1, () => {
                        allTeachers(handleTeachers);
                    });
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
        allTeachers(handleTeachers)
    }, [])

    function handleTeachers(response: any) {
        setTeachers(response)
        setRawData(response)
    }

    function defineClass(record: Teacher, index: number): string {
        if (record.currentHours > record.toHours) {
            return 'teacher__overload'
        } else if (record.currentHours < record.fromHours) {
            return 'teacher__notLoaded'
        } else {
            return 'teacher__okLoad'
        }
    }

    return (
        <div>
            {/*<button onClick={allStudents}>Студенты</button>*/}
            {/*<Table rowSelection={rowSelection} columns={columns} dataSource={rawData}/>*/}
            <Table
                columns={teacherColumns}
                dataSource={rawData}
                rowClassName={defineClass}
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
                loading={teachers.length == 0}
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
                    update={() => allTeachers(handleTeachers)}
                    teachers={suitableTeachers}
                    planTaskId={planTaskId}
                />
            </Modal>
        </div>
    )

}

export default Teachers;

