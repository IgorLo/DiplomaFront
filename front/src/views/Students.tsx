import * as React from "react";
import {http} from "../common/http";
import {useEffect, useState} from 'react';
import contentOfGetRequest = http.contentOfGetRequest;
import {entities} from "../common/entities";
import Student = entities.Student;
import {Table} from "antd"
import {utils} from "../common/utils";
import compareByAlph = utils.compareByAlph;
import allStudents = entities.allStudents;


const Students = () => {

    const [students, setStudents] = useState(new Array<Student>())
    const [rawData, setRawData] = useState(new Array<any>())
    const [searchState, setSearchState] = useState(
        {
            searchText: '',
            searchColumn: ''
        }
    )

    const columns = [
        {
            title: 'ID',
            dataIndex: 'key',
            filterMultiple: false,
            sorter: (a: Student, b: Student) => a.key - b.key,
            width: "5%"
        },
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            filterMultiple: false,
            sorter: (a: Student, b: Student) => compareByAlph(a.name, b.name),
            width: "25%"
        },
        {
            title: 'Группа',
            dataIndex: 'groupName',
            key: 'groupName',
            filterMultiple: false,
            sorter: (a: Student, b: Student) => compareByAlph(a.groupName, b.groupName),
            width: "25%"
        },
        {
            title: 'Множества',
            dataIndex: 'setNames',
            key: 'setNames',
            render: (setIds: Array<number>) => <span>{setIds.toString()}</span>
        }
    ]
    // const rowSelection = {
    //     selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT]
    // }

    useEffect(() => {
        allStudents(handleStudents)
    }, [])

    function handleStudents(response: any) {
        setStudents(response)
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
                    expandedRowRender: record => <p style={{margin: 0}}>{"Какой-то дополнительный контент"}</p>,
                    rowExpandable: record => record.name !== 'Not Expandable',
                }}
                loading={students.length == 0}
                // @ts-ignore
                pagination={{position : ['none','bottomCenter']}}
                // pagination={{ pageSize: 50 }}
                // scroll={{ y: 240 }}
            />
        </div>
    )

}

export default Students;

