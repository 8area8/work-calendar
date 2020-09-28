import { IEmployee } from "../entities/worker";
import { IWorkDate } from "../entities/calendar";
import { EmployeeService } from "../services/employee";
import { isError, IError } from "../common/base_api";

export interface IEmployeeInteractor {
  employees: IEmployee[];
  names: string[];
  ids: (number | null)[];

  get: () => Promise<IEmployee[]>;
  add: (employee: IEmployee) => Promise<IEmployee[]>;
  modify: (employee: IEmployee) => Promise<IEmployee[]>;
  delete_: (employee: IEmployee) => Promise<IEmployee[]>;

  find: (id: number) => IEmployee | undefined;
  getAvailableEmployees: (
    employees: IEmployee[],
    works: IWorkDate[]
  ) => IEmployee[];
}

export class EmployeeInteractor implements IEmployeeInteractor {
  private service = new EmployeeService();
  public employees: IEmployee[] = [];

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

  async add(employee: IEmployee) {
    await this.service.addEmployee(employee);
    return await this.get();
  }

  async modify(employee: IEmployee) {
    await this.service.modifyEmployee(employee);
    return await this.get();
  }

  async delete_(employee: IEmployee) {
    await this.service.deleteEmployee(employee.id);
    return await this.get();
  }

  get names(): string[] {
    return this.employees.map((employee: IEmployee) => {
      return employee.name;
    });
  }

  get ids(): (number | null)[] {
    return this.employees.map((employee: IEmployee) => {
      return employee.id;
    });
  }

  find(id: number): IEmployee | undefined {
    return this.employees.find((employee: IEmployee) => {
      return employee.id == id;
    });
  }

  /**
   * Returns employees who do not work.
   * @param employees
   * @param works
   */
  getAvailableEmployees(
    employees: IEmployee[],
    works: IWorkDate[]
  ): IEmployee[] {
    return employees.filter((employee: IEmployee) => {
      return !works.find((work: IWorkDate) => {
        return work.employee === employee.id;
      });
    });
  }

  /**
   * Return the availables employees from a given preference.
   * @param employees
   * @param preference
   * @param weekDay
   */
  filterEmployeesFromPreference(
    employees: IEmployee[],
    preference: string,
    weekDay: string
  ): IEmployee[] {
    return employees.filter((employee: IEmployee) => {
      return (
        employee.preference == preference && !employee.off.includes(weekDay)
      );
    });
  }

  /**
   * Returns the Off employees.
   * @param employees
   * @param weekDay
   */
  getOffEmployees(employees: IEmployee[], weekDay: string): IEmployee[] {
    return employees.filter((employee: IEmployee) => {
      return employee.off.includes(weekDay);
    });
  }
}

const employeeHandler = new EmployeeInteractor();
export { employeeHandler };
