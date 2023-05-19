import Entity from "../common/models/Entity";
import { Major } from "./Major";

export interface Subject extends Entity {
  code: string;
  title: string;
  totalCredits: number;

  major?: Major;
}

export class Subject implements Subject {
  id: string = "";
  createDate: Date = new Date();
  code: string = "";
  title: string = "";
  totalCredits: number = 0;

  major?: Major = undefined;

  constructor(init?: SubjectFormValues) {
    Object.assign(this, init);
  }
}

export class SubjectFormValues {
  id?: string = "";
  createDate: Date = new Date();
  code: string = "";
  title: string = "";
  totalCredits: number = 0;
  
  majorId?: string = undefined;

  constructor(subject?: Subject) {
    if (subject) {
      this.id = subject.id;
      this.createDate = subject.createDate;
      this.code = subject.code;
      this.title = subject.title;
      this.totalCredits = subject.totalCredits;
    }
  }
}
