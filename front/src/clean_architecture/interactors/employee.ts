import { ISalaryWorker } from "../entities/worker";
import { EmployeeService } from "../services/employee";
import { isError, IError } from "../common/base_api";

export interface IEmployeeInteractor {
  employees: ISalaryWorker[];
  get: () => Promise<ISalaryWorker[]>;
  add: (employee: ISalaryWorker) => Promise<ISalaryWorker[]>;
  modify: (employee: ISalaryWorker) => Promise<ISalaryWorker[]>;
  delete_: (employee: ISalaryWorker) => Promise<ISalaryWorker[]>;
}

export class EmployeeInteractor implements IEmployeeInteractor {
  private service = new EmployeeService();
  public employees: ISalaryWorker[] = [];

  constructor() {
    this.get().then((res) => (this.employees = res));
  }

  async get() {
    const result = await this.service.getEmployees();
    if (isError(result)) {
      return [];
    }
    this.employees = result;
    return result;
  }

  async add(employee: ISalaryWorker) {
    await this.service.addEmployee(employee);
    return await this.get();
  }

  async modify(employee: ISalaryWorker) {
    await this.service.modifyEmployee(employee);
    return await this.get();
  }

  async delete_(employee: ISalaryWorker) {
    await this.service.deleteEmployee(employee.id);
    return await this.get();
  }
}
