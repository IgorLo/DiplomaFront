import {http} from "./http";

export module entities {

    import contentOfGetRequest = http.contentOfGetRequest;

    export class Student {

        constructor(key: number, name: string, groupId: number, setIds: Array<number>, groupName: string, setNames: Array<string>) {
            this.key = key;
            this.name = name;
            this.groupId = groupId;
            this.setIds = setIds;
            this.groupName = groupName;
            this.setNames = setNames;
        }

        key: number;
        name: string;
        groupId: number;
        setIds: Array<number>;
        groupName: string;
        setNames: Array<string>;
    }

    export class Group {

        constructor(key: number, name: string, students: Array<entities.Student>, setIds: Array<number>) {
            this.key = key;
            this.name = name;
            this.students = students;
            this.setIds = setIds;
        }

        key: number;
        name: string;
        students: Array<Student>;
        setIds: Array<number>;
    }

    export class StudentSet {
        constructor(key: number, name: string, students: Array<entities.Student>) {
            this.key = key;
            this.name = name;
            this.students = students;
        }

        key: number;
        name: string;
        students: Array<Student>;
    }

    export function allStudents(handler: Function) {
        contentOfGetRequest("/students", false, handler)
    }

    export function allSets(handler: Function) {
        contentOfGetRequest("/sets", false, handler)
    }

}
