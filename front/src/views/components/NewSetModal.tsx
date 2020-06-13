import * as React from "react";
import {Button, Tree, Input, Space} from "antd";
import {useState, useEffect, ChangeEvent} from "react";
import {entities} from "../../common/entities";
import allGroups = entities.allGroups;
import Student = entities.Student;
import Group = entities.Group;
import createNewSet = entities.createNewSet;

const {Search} = Input;

const NewSetModal = (props: any) => {

    const [groups, setGroups] = useState(new Array<any>())
    const [expandedKeys, setExpandedKeys] = useState<number[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<number[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>("");
    const [setName, setSetName] = useState<string>("");
    useEffect(() => {
        allGroups(setGroups)
    }, [])

    function getStudentTree(): Array<any> {
        let tree = Array<any>();
        groups.forEach((group: Group) => {
            if (!group.name.includes(searchValue)) {
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

    const onExpand = (expandedKeys: Array<number>) => {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(false);
    };

    const onCheck = (checkedKeys: Array<number>) => {
        console.log('onCheck', checkedKeys);
        setCheckedKeys(checkedKeys);
    };

    const onSearch = (value: string) => {
        setSearchValue(value);
    }

    const changeName = (event: ChangeEvent<HTMLInputElement>) => {
        setSetName(event.currentTarget.value);
    }

    function newSetHandler(response: any) {
        props.setVisible(false);
        props.update();
        setCheckedKeys([]);
    }

    return (
        <div>
            <h2>Новое множество</h2>
            <Input
                placeholder="Название"
                size="large"
                onChange={changeName}
                style={{marginBottom: 8}}
            />
            <Search
                placeholder="Номер группы"
                onSearch={onSearch}
                style={{marginBottom: 8}}
            />
            <Tree
                checkable
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                treeData={getStudentTree()}
                height={450}
                style={{height: 450, marginBottom: 8}}
            />
            <div className="new_set_buttons_div">
                <Space direction="horizontal" size="small">
                    <Button
                        type="primary"
                        danger={true}
                        onClick={() => {
                            props.setVisible(false);
                            props.update();
                        }}>
                        Закрыть
                    </Button>
                    <Button
                        type="primary"
                        disabled={checkedKeys.length == 0 || setName.length == 0}
                        onClick={() => {
                            createNewSet(setName, checkedKeys, newSetHandler);
                        }}>
                        Создать
                    </Button>
                </Space>
            </div>
        </div>
    )

}

export default NewSetModal