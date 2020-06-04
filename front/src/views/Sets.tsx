import * as React from "react";
import {http} from "../common/http";
import {useEffect, useState} from 'react';
import contentOfGetRequest = http.contentOfGetRequest;
import {entities} from "../common/entities";
import {Table, Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {utils} from "../common/utils";
import compareByAlph = utils.compareByAlph;
import StudentSet = entities.StudentSet;
import Student = entities.Student;
import "./Sets.css"
import allSets = entities.allSets;
import Modal from "antd/lib/modal/Modal";
import NewSetModal from "./components/NewSetModal";

const Sets = () => {

    const [studentSets, setStudentSets] = useState(new Array<StudentSet>())
    const [rawData, setRawData] = useState(new Array<any>())
    const [searchState, setSearchState] = useState(
        {
            searchText: '',
            searchColumn: ''
        }
    )
    const [modalVisible, setModalVisible] = useState(false)

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
            width: "25%"
        },
        {
            title: 'Студенты',
            dataIndex: 'students',
            key: 'students',
            render: (students: Array<Student>) => <span>{students.length}</span>
        }
    ]
    // const rowSelection = {
    //     selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT]
    // }

    useEffect(() => {
        allSets(handleStudentSets)
    }, [])

    function handleStudentSets(response: any) {
        setStudentSets(response)
        setRawData(response)
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
                    expandedRowRender: record => <p style={{margin: 0}}>{record.students.map((student: Student) =>
                        <span>{student.name + ", "}</span>)}</p>,
                    rowExpandable: record => record.name !== 'Not Expandable',
                }}
                loading={studentSets.length == 0}
                // @ts-ignore
                pagination={{position: ['none', 'bottomCenter']}}
                // pagination={{ pageSize: 50 }}
                // scroll={{ y: 240 }}
            />
            <Button
                type="primary"
                icon={<PlusOutlined/>}
                onClick={() => setModalVisible(true)}>
                Создать новое
            </Button>

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