import { Faculty } from "./Faculty";

export interface User {
    id: string,
    userName: string,
    firstName: string,
    lastName: string,
    email: string,
    faculty?: Faculty,
    // roles: Role[]
    token?: string
}

export interface LoginFormValues {
    userName: string,
    password: string
}

export interface RegisterFormValues {
    userName: string,
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    facultyId?: string
}

export class ChangePasswordFormValues {
    password: string = ''
    newPassword: string = ''
}