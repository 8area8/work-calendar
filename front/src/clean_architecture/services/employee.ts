import { httpClient, IError } from "../common/base_api";
import { ISalaryWorker } from "../entities/worker";
import { verifyAuth } from "../services/auth";

export interface IEmployeeService {
  getEmployees: () => Promise<ISalaryWorker[] | IError>;
  addEmployee: (employee: ISalaryWorker) => Promise<ISalaryWorker | IError>;
  modifyEmployee: (employee: ISalaryWorker) => Promise<ISalaryWorker | IError>;
  deleteEmployee: (id: number | null) => Promise<ISalaryWorker | IError>;
}

export class EmployeeService implements IEmployeeService {
  @verifyAuth
  public async getEmployees() {
    const response = await httpClient.get<ISalaryWorker[]>("/work/employees/");
    return response;
  }

  @verifyAuth
  public async addEmployee(employee: ISalaryWorker) {
    const response = await httpClient.post<ISalaryWorker>(
      "/work/employees/",
      employee
    );
    return response;
  }

  @verifyAuth
  public async modifyEmployee(employee: ISalaryWorker) {
    const response = await httpClient.patch<ISalaryWorker>(
      `/work/employees/${employee.id}/`,
      employee
    );
    return response;
  }

  @verifyAuth
  public async deleteEmployee(id: number | null) {
    const response = await httpClient.delete<ISalaryWorker>(
      `/work/employees/${id}/`
    );
    return response;
  }
}
