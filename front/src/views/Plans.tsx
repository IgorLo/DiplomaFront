import * as React from 'react';
import {useState, useEffect} from 'react';
import {entities} from "../common/entities";
import Plan = entities.Plan;
import allPlans = entities.allPlans;
import TeacherTaskModal from "./components/TeacherTaskModal";
import {Table, Space, Input, Button} from 'antd';
import {utils} from "../common/utils";
import compareByAlph = utils.compareByAlph;
import {Link} from 'react-router-dom';
import PlanTask = entities.PlanTask;
import Highlighter from 'react-highlight-words';
import {SearchOutlined} from '@ant-design/icons';

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

    const planColumns = [
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            sorter: (a: Plan, b: Plan) => compareByAlph(a.name, b.name),
            render: (value: number, record: Plan) => {
                return <Link
                    to={"/plans/" + record.key}
                    style={{
                        fontSize: '12pt'
                    }}
                >
                    {value}
                </Link>
            },
            width: '10%',
            ...getColumnSearchProps('name')
        },
        {
            title: 'Подразделение',
            dataIndex: 'schoolName',
            key: 'schoolName',
            sorter: (a: Plan, b: Plan) => compareByAlph(a.schoolName, b.schoolName),
            ...getColumnSearchProps('schoolName')
        },
        {
            title: 'Направление',
            dataIndex: 'spec',
            key: 'spec',
            sorter: (a: Plan, b: Plan) => compareByAlph(a.spec, b.spec),
            ...getColumnSearchProps('spec')
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