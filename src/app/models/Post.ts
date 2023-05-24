import Entity, { Auditable } from "../common/models/Entity";
import Profile from "../common/models/Profile";
import { Classroom } from "./Classroom";

export interface Post extends Entity, Auditable {
    id: string;
    createDate: Date;
    content: string;
    link: string;

    user?: Profile;
    classroom?: Classroom;
}

export class Post implements Post {
    id = "";
    createDate = new Date();
    content = "";
    link = "";
    user?: Profile = undefined;
    classroom?: Classroom = undefined;

    constructor(init?: PostFormValues) {
        Object.assign(this, init);
    }
}

export class PostFormValues {
    id?: string;
    content: string = "";
    link: string = "";
    userName?: string;
    classroomId?: string;
    createDate: Date = new Date();

    constructor(post?: Post) {
        if (post) {
            const { user, classroom, ...rest } = post;
            Object.assign(this, { ...rest });
        }
    }
}