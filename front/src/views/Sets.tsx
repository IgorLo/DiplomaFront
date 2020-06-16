import * as React from "react";
import {http} from "../common/http";
import {useEffect, useState} from 'react';
import contentOfGetRequest = http.contentOfGetRequest;
import {entities} from "../common/entities";
import {Table, Button, Space, Input, Tree} from "antd";
import {PlusOutlined, SearchOutlined} from "@ant-design/icons";
import {utils} from "../common/utils";
import compareByAlph = utils.compareByAlph;
import StudentSet = entities.StudentSet;
import Student = entities.Student;
import "./Sets.css"
import allSets = entities.allSets;
import Modal from "antd/lib/modal/Modal";
import NewSetModal from "./components/NewSetModal";
import allGroups = entities.allGroups;
import Group = entities.Group;

const Sets = () => {

    const [studentSets, setStudentSets] = useState(new Array<StudentSet>())
    const [rawData, setRawData] = useState(new Array<any>())
    const [modalVisible, setModalVisible] = useState(false)

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
            title: 'ID',
            dataIndex: 'key',
            filterMultiple: false,
            sorter: (a: StudentSet, b: StudentSet) => a.key - b.key,
            width: "5%"
        },
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            filterMultiple: false,
            sorter: (a: StudentSet, b: StudentSet) => compareByAlph(a.name, b.name),
            width: "25%",
            ...getColumnSearchProps('name')
        },
        {
            title: 'Студенты',
            dataIndex: 'students',
            key: 'students',
            render: (students: Array<Student>) => <span>{students.length}</span>
        },
        {
            title: 'Группы',
            dataIndex: 'groupNames',
            key: 'groupNames',
            ...getColumnSearchProps('groupNames')
        }
    ]
    // const rowSelection = {
    //     selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT]
    // }

    const [groups, setGroups] = useState(new Array<any>())

    useEffect(() => {
        allSets(handleStudentSets)
        allGroups(setGroups)
    }, [])

    function handleStudentSets(response: any) {
        setStudentSets(response)
        setRawData(response)
    }



    function getStudentTree(currentGroups: string): Array<any> {
        let tree = Array<any>();
        groups.forEach((group: Group) => {
            if (!currentGroups.includes(group.name)) {
                return
            }
            let children = Array<any>();
            group.students.forEach((student: Student) => {
                children.push({
                    title: student.name,
                    key: student.key,
                    children: []
                })
            })
            tree.push({
                title: group.name,
                key: group.key,
                children: children
            })
        });
        return tree;
    }

    return (
        <div>
            {/*<button onClick={allStudents}>Студенты</button>*/}
            {/*<Table rowSelection={rowSelection} columns={columns} dataSource={rawData}/>*/}
            <Table
                columns={columns}
                dataSource={rawData}
                size="large"
                bordered
                expandable={{
                    expandedRowRender: (record: StudentSet) => {
                        return <Tree
                            autoExpandParent={false}
                            treeData={getStudentTree(record.groupNames)}
                            height={350}
                            style={{height: 350}}
                        />
                    },
                    rowExpandable: record => record.name !== 'Not Expandable',
                }}
                loading={studentSets.length == 0}
                // @ts-ignore
                pagination={{position: ['none', 'bottomCenter'], pageSize: 14}}
                // scroll={{ y: 240 }}
            />
            <div className="new_set_addNewButton_div">
                <Button
                    type="primary"
                    icon={<PlusOutlined/>}
                    size="large"
                    onClick={() => setModalVisible(true)}>
                    Создать новое
                </Button>
            </div>

            <Modal
                visible={modalVisible}
                footer={null}
                centered
                closable={false}
                width={800}
                >
                <NewSetModal
                    setVisible={setModalVisible}
                    update={() => allSets(handleStudentSets)}
                />
            </Modal>
        </div>
    )

};

export default Sets;