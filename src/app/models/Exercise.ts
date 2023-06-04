import dayjs, { Dayjs } from "dayjs";
import Entity, { Auditable } from "../common/models/Entity";
import { Classroom } from "./Classroom";

export interface Exercise extends Entity, Auditable {
    id: string;
    createDate: Date;
    title: string;
    instruction: string;
    link: string;
    totalScore: number;
    deadline: Dayjs;
    topic: string;
    criteria: string;
    classroom?: Classroom;
}

export class Exercise implements Exercise {
    id = "";
    createDate = new Date();
    title = "";
    instruction = "";
    link = "";
    totalScore = 0;
    deadline = dayjs.utc();
    topic = "";
    criteria = "";
    classroom?: Classroom = undefined;

    constructor(init?: ExerciseFormValues) {
        Object.assign(this, init);
    }
}

export class ExerciseFormValues {
    id?: string = "";
    title: string = "";
    topic: string = "";
    instruction: string = "";
    link: string = "";
    deadline: Dayjs = dayjs.utc();
    totalScore: number = 0;
    criteria: string = "";
    classroomId?: string = "";

    constructor(exercise?: Exercise) {
        if (exercise) {
            const { classroom, createDate, ...rest } = exercise;
            Object.assign(this, { ...rest });
        }
    }
}
