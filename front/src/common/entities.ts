import {http} from "./http";

export module entities {

    import contentOfGetRequest = http.contentOfGetRequest;
    import contentOfPostRequest = http.contentOfPostRequest;

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

    export class Activity {

        constructor(key: number, subjectName: string, activityType: string) {
            this.key = key;
            this.subjectName = subjectName;
            this.activityType = activityType;
        }

        key: number;
        subjectName: string;
        activityType: string;
    }

    export class School {
        constructor(key: number, name: string) {
            this.key = key;
            this.name = name;
        }
        key: number;
        name: string;
    }

    export class Teacher {


        constructor(key: number, name: string, fromHours: number, toHours: number, rate: number, school: entities.School, schoolName: string, tasks: Array<entities.PlanTask>, currentHours: number, activities: Array<entities.Activity>) {
            this.key = key;
            this.name = name;
            this.fromHours = fromHours;
            this.toHours = toHours;
            this.rate = rate;
            this.school = school;
            this.schoolName = schoolName;
            this.tasks = tasks;
            this.currentHours = currentHours;
            this.activities = activities;
        }

        key: number;
        name: string;
        fromHours: number;
        toHours: number;
        rate: number;
        school: School;
        schoolName: string;
        tasks: Array<PlanTask>;
        currentHours: number;
        activities: Array<Activity>;
    }

    export class PlanTask {
        constructor(key: number, activityType: string, discipline: string, groupId: number, groupName: string, hours: number, planId: number, planName: string, teacherName: string, teacherId: number) {
            this.key = key;
            this.activityType = activityType;
            this.discipline = discipline;
            this.groupId = groupId;
            this.groupName = groupName;
            this.hours = hours;
            this.planId = planId;
            this.planName = planName;
            this.teacherName = teacherName;
            this.teacherId = teacherId;
        }
        key: number;
        activityType: string;
        discipline: string;
        groupId: number;
        groupName: string;
        hours: number;
        planId: number;
        planName: string;
        teacherName: string;
        teacherId: number;
    }

    export function allStudents(handler: Function) {
        contentOfGetRequest("/students", false, handler)
    }

    export function allGroups(handler: Function) {
        contentOfGetRequest("/groups", false, handler)
    }

    export function allSets(handler: Function) {
        contentOfGetRequest("/sets", false, handler)
    }

    export function allPlanTasks(handler: Function) {
        contentOfGetRequest("/tasks", false, handler)
    }

    export function allTeachers(handler: Function) {
        contentOfGetRequest("/teachers", false, handler)
    }

    export function createNewSet(name: string, studentIds: Array<number>, handler: Function) {
        let data = {
            name: name,
            studentIds: studentIds,
            groupIds: Array<number>()
        }
        contentOfPostRequest("/sets", JSON.stringify(data), false, handler);
    }

    export function changeTaskTeacher(taskId: number, teacherId: number, handler: Function) {
        let data = {
            taskId: taskId,
            teacherId: teacherId
        }
        contentOfPostRequest("/changeTask", JSON.stringify(data), false, handler);
    }

    export function allSuitableTeachers(taskId: number, handler: Function) {
        contentOfGetRequest("/suitableTeachers/" + taskId, false, handler);
    }

}
