import axios, { AxiosError, AxiosResponse } from "axios";
import { PaginationParams } from "../common/models/paginationPrams";
import {
  ChangePasswordFormValues,
  LoginFormValues,
  RegisterFormValues,
  User,
} from "../models/User";
import { store } from "../stores/store";
import Entity, { BaseEntity, BaseEntityFormValues, EntityFormValues } from "../common/models/Entity";
import {
  BaseEntityHasManyRelationshipResource,
  BaseEntityResource,
  BaseEntityUserResource,
  BaseHasManyRelationshipResource,
  BaseNonEntityHasManyRelationshipResource,
  BaseResource,
  BaseUserResource,
} from "./baseResource";
import { toast } from "react-toastify";
import { router } from "../router/Routes";

axios.defaults.baseURL = process.env.REACT_APP_HUTECH_CLASSROOM_BASE_URL;

axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// const sleep = (delay: number) => {
//   return new Promise((resolve) => {
//     setTimeout(resolve, delay);
//   });
// };

axios.interceptors.response.use(
  async (response) => {
    // console.log(store.commonStore.token)
    // if (process.env.NODE_ENV === "development") await sleep(1000);
    // const pagination = response.headers['pagination']
    // if (pagination) {
    //     response.data = new PaginatedResult(response.data, JSON.parse(pagination))
    //     return response as AxiosResponse<PaginatedResult<any>>
    // }
    return response;
  },
  (error: AxiosError) => {
    const response = error.response as AxiosResponse;
    const data = error.response?.data as any;
    switch (response.status) {
      case 400:
        if (data) break;
        if (
          response.config.method === "get" &&
          Object.keys(data.errors).some((key) =>
            key.toLowerCase().includes("id")
          )
        ) {
          router.navigate("/not-found");
        }
        if (data.errors) {
          const modalStateErrors = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modalStateErrors.push(data.errors[key]);
            }
            throw modalStateErrors.flat();
          }
        } else {
          toast.error(data);
        }
        break;
      case 401:
        if (store.commonStore.appLoaded) toast.error("Xác thực thất bại");
        break;
      case 403:
        toast.error("Bạn không có quyền truy cập!");
        break;
      case 404:
        router.navigate("not-found");
        break;
      case 500:
        if (data) break;
        store.commonStore.setServerError(data);
        router.navigate("/server-error");
        break;
    }
    return Promise.reject(error);
  }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string, params?: PaginationParams) =>
    axios
      .get<T>(url, { params: params?.toUrlSearchParams() })
      .then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string, body: {} = {}) => axios.delete<T>(url, body).then(responseBody),
  patch: <T>(url: string, body: {}) =>
    axios.patch<T>(url, body).then(responseBody),
};

const createResource = <
  TEntity extends Entity,
  TEntityFormValues extends EntityFormValues
>(
  entityName: string
): BaseResource<TEntity, TEntityFormValues> => {
  const resource: BaseResource<TEntity, TEntityFormValues> = {
    list: (params?: PaginationParams) =>
      requests.get<TEntity[]>(`v1/${entityName}`, params),
    details: (id: string) => requests.get<TEntity>(`v1/${entityName}/${id}`),
    create: (formValues: TEntityFormValues) =>
      requests.post<TEntity>(`v1/${entityName}`, formValues),
    update: (id: string, formValues: TEntityFormValues) =>
      requests.put(`v1/${entityName}/${id}`, formValues),
    delete: (id: string) => requests.delete<TEntity>(`v1/${entityName}/${id}`),
  };
  return resource;
};

const createUserResource = <TEntity extends Entity>(entityName: string) => {
  const resource: BaseUserResource<TEntity> = {
    listByUser: (params?: PaginationParams) =>
      requests.get<TEntity[]>(`v1/Users/@me/${entityName}`, params),
  };
  return resource;
};

const createHasManyRelationshipResource = <TManyEntity extends Entity>(
  firstEntityName: String,
  secondEntityName: String
) => {
  const resource: BaseHasManyRelationshipResource<TManyEntity> = {
    listEntities: (id: String, params?: PaginationParams) =>
      requests.get<TManyEntity[]>(
        `v1/${firstEntityName}/${id}/${secondEntityName}`,
        params
      ),
    addEntity: (firstEntityId: string, secondEntityId: string) =>
      requests.post(
        `v1/${firstEntityName}/${firstEntityId}/${secondEntityName}/${secondEntityId}`,
        {}
      ),
    removeEntity: (firstEntityId: string, secondEntityId: string) =>
      requests.delete(
        `v1/${firstEntityName}/${firstEntityId}/${secondEntityName}/${secondEntityId}`
      ),
    addEntities: (firstEntityId: string, secondEntityIds: string[]) =>
      requests.post(
        `v1/${firstEntityName}/${firstEntityId}/${secondEntityName}/add`,
        secondEntityIds
      ),
      removeEntities: (firstEntityId: string, secondEntityIds: string[]) =>
      requests.post(
        `v1/${firstEntityName}/${firstEntityId}/${secondEntityName}/remove`,
        secondEntityIds
      ),
  };
  return resource;
};

const createEntityResource = <
  TId,
  TEntity extends BaseEntity<TId>,
  TEntityFormValues extends BaseEntityFormValues<number>
>(
  entityName: string
): BaseEntityResource<TId, TEntity, TEntityFormValues> => {
  const resource: BaseEntityResource<TId, TEntity, TEntityFormValues> = {
    list: (params?: PaginationParams) =>
      requests.get<TEntity[]>(`v1/${entityName}`, params),
    details: (id: TId) => requests.get<TEntity>(`v1/${entityName}/${id}`),
    create: (formValues: TEntityFormValues) =>
      requests.post<TEntity>(`v1/${entityName}`, formValues),
    update: (id: TId, formValues: TEntityFormValues) =>
      requests.put(`v1/${entityName}/${id}`, formValues),
    delete: (id: TId) => requests.delete<TEntity>(`v1/${entityName}/${id}`),
  };
  return resource;
};

const createEntityUserResource = <TId, TEntity extends BaseEntity<TId>>(entityName: string) => {
  const resource: BaseEntityUserResource<TId, TEntity> = {
    listByUser: (params?: PaginationParams) =>
      requests.get<TEntity[]>(`v1/Users/@me/${entityName}`, params),
  };
  return resource;
};

const createEntityHasManyRelationshipResource = <TFirstId, TSecondId, TManyEntity extends BaseEntity<TSecondId>>(
  firstEntityName: String,
  secondEntityName: String
) => {
  const resource: BaseEntityHasManyRelationshipResource<TFirstId, TSecondId, TManyEntity> = {
    listEntities: (id: TFirstId, params?: PaginationParams) =>
      requests.get<TManyEntity[]>(
        `v1/${firstEntityName}/${id}/${secondEntityName}`,
        params
      ),
    addEntity: (firstEntityId: TFirstId, secondEntityId: TSecondId) =>
      requests.post(
        `v1/${firstEntityName}/${firstEntityId}/${secondEntityName}/${secondEntityId}`,
        {}
      ),
    removeEntity: (firstEntityId: TFirstId, secondEntityId: TSecondId) =>
      requests.delete(
        `v1/${firstEntityName}/${firstEntityId}/${secondEntityName}/${secondEntityId}`
      ),
    addEntities: (firstEntityId: TFirstId, secondEntityIds: TSecondId[]) =>
      requests.post(
        `v1/${firstEntityName}/${firstEntityId}/${secondEntityName}/add`,
        secondEntityIds
      ),
      removeEntities: (firstEntityId: TFirstId, secondEntityIds: TSecondId[]) =>
      requests.post(
        `v1/${firstEntityName}/${firstEntityId}/${secondEntityName}/remove`,
        secondEntityIds
      ),
  };
  return resource;
};

const createNonEntityHasManyRelationshipResource = <TFirstId, TSecondId, TResponse>(
  firstEntityName: String,
  secondEntityName: String
) => {
  const resource: BaseNonEntityHasManyRelationshipResource<TFirstId, TSecondId, TResponse> = {
    listNonEntities: (id: TFirstId, params?: PaginationParams) =>
      requests.get<TResponse[]>(
        `v1/${firstEntityName}/${id}/${secondEntityName}`,
        params
      ),
    addNonEntity: (firstEntityId: TFirstId, secondEntityId: TSecondId) =>
      requests.post(
        `v1/${firstEntityName}/${firstEntityId}/${secondEntityName}/${secondEntityId}`,
        {}
      ),
    removeNonEntity: (firstEntityId: TFirstId, secondEntityId: TSecondId) =>
      requests.delete(
        `v1/${firstEntityName}/${firstEntityId}/${secondEntityName}/${secondEntityId}`
      ),
    addNonEntities: (firstEntityId: TFirstId, secondEntityIds: TSecondId[]) =>
      requests.post(
        `v1/${firstEntityName}/${firstEntityId}/${secondEntityName}/add`,
        secondEntityIds
      ),
      removeNonEntities: (firstEntityId: TFirstId, secondEntityIds: TSecondId[]) =>
      requests.post(
        `v1/${firstEntityName}/${firstEntityId}/${secondEntityName}/remove`,
        secondEntityIds
      ),
  };
  return resource;
};

const Groups = {
  addLeader: (groupId: string, userId: string) => requests.post(`v1/Groups/${groupId}/add-leader/${userId}`, {})
}

const Account = {
  login: (credentials: LoginFormValues) =>
    requests.post<User>("v1/Account/login", credentials),
  register: (credentials: RegisterFormValues) =>
    requests.post<User>("v1/Account/register", credentials),
  current: () => requests.get<User>("v1/Users/@me"),
  changePassword: (credentials: ChangePasswordFormValues) =>
    requests.patch("v1/Account/change-password", credentials),
};

const Results = {
  notFound: () => requests.get("v1/Results/not-found"),
  ok: () => requests.get("v1/Results/ok"),
  badRequest: () => requests.get("v1/Results/bad-request"),
  noContent: () => requests.get("v1/Results/no-content"),
  unauthorized: () => requests.get("v1/Results/unauthorized"),
  conflict: () => requests.get("v1/Results/conflict"),
  forbid: () => requests.get("v1/Results/forbid"),
  internalServerError: () => requests.get("v1/Results/internal-server-error"),
};

const agent = {
  Account,
  Results,
  Groups,
  createResource,
  createUserResource,
  createHasManyRelationshipResource,
  createEntityResource,
  createEntityUserResource,
  createEntityHasManyRelationshipResource,
  createNonEntityHasManyRelationshipResource
};

export default agent;
