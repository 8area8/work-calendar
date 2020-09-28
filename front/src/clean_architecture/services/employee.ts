import { httpClient, IError } from "../common/base_api";
import { IEmployee } from "../entities/worker";
import { verifyAuth } from "../services/auth";

export interface IEmployeeService {
  getEmployees: () => Promise<IEmployee[] | IError>;
  addEmployee: (employee: IEmployee) => Promise<IEmployee | IError>;
  modifyEmployee: (employee: IEmployee) => Promise<IEmployee | IError>;
  deleteEmployee: (id: number | null) => Promise<IEmployee | IError>;
}

export class EmployeeService implements IEmployeeService {
  @verifyAuth
  public async getEmployees() {
    const response = await httpClient.get<IEmployee[]>("/work/employees/");
    return response;
  }

  @verifyAuth
  public async addEmployee(employee: IEmployee) {
    const response = await httpClient.post<IEmployee>(
      "/work/employees/",
      employee
    );
    return response;
  }

  @verifyAuth
  public async modifyEmployee(employee: IEmployee) {
    const response = await httpClient.patch<IEmployee>(
      `/work/employees/${employee.id}/`,
      employee
    );
    return response;
  }

  @verifyAuth
  public async deleteEmployee(id: number | null) {
    const response = await httpClient.delete<IEmployee>(
      `/work/employees/${id}/`
    );
    return response;
  }
}
