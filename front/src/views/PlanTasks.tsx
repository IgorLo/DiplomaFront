import * as React from "react";
import {useEffect, useState} from 'react';
import {entities} from "../common/entities";
import {Table, Modal, Button, Space, Input} from "antd"
import PlanTask = entities.PlanTask;
import allPlanTasks = entities.allPlanTasks;
import "./PlanTasks.css"
import {utils} from "../common/utils";
import compareByAlph = utils.compareByAlph;
import TeacherTaskModal from "./components/TeacherTaskModal";
import Teacher = entities.Teacher;
import allSuitableTeachers = entities.allSuitableTeachers;
import changeTaskTeacher = entities.changeTaskTeacher;
import { Link } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";


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

    const columns = [
        {
            title: 'План',
            dataIndex: 'planName',
            key: 'planName',
            sorter: (a: PlanTask, b: PlanTask) => compareByAlph(a.planName, b.planName),
            ...getColumnSearchProps('planName')
        },
        {
            title: 'Дисциплина',
            dataIndex: 'discipline',
            key: 'discipline',
            sorter: (a: PlanTask, b: PlanTask) => compareByAlph(a.discipline, b.discipline),
            ...getColumnSearchProps('discipline')
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
            title: 'Группирование',
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
            },
            ...getColumnSearchProps('teacherName')
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
                        allPlanTasks(handleTasks);
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

