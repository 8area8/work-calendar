import { IWork, IWorkDate, IDay } from "../entities/calendar";
import { WorkService } from "../services/work";
import { isError, IError } from "../common/base_api";
import { IEmployee } from "../entities/worker";

export interface ITime {
  hours: number;
  minutes: number;
}

export interface IWorkInteractor {
  works: IWork[];

  get: (dayId: number) => Promise<IWorkDate[]>;
  add: (work: IWorkDate) => Promise<IWorkDate[]>;
  modify: (work: IWorkDate) => Promise<IWorkDate[]>;
  delete_: (work: IWork) => Promise<IWorkDate[]>;

  getReadableTime: (date: Date) => string;
  getWorkingTime: (start: Date, end: Date) => string;
  getTotalHours: (start: Date, end: Date) => string;
  getWorksHours: (works: IWorkDate[]) => ITime;
  getReadableWorksHours: (works: IWorkDate[]) => string;

  getWorksPreference: (works: IWorkDate[], preference: string) => IWorkDate[];
  getEmployeeWorks: (employeeId: number, works: IWorkDate[]) => IWorkDate[];
  getEmployeeWork: (
    works: IWorkDate[],
    employeeID: number
  ) => IWorkDate | undefined;

  getSalary: (works: IWorkDate[], employee: IEmployee) => string;
}

export class WorkInteractor implements IWorkInteractor {
  private service = new WorkService();
  public works: IWorkDate[] = [];

  async get(dayId: number) {
    const result = await this.service.getWorks(dayId);
    if (isError(result)) {
      return [];
    }
    const workDates: IWorkDate[] = [];
    for (const work of result) {
      workDates.push({
        id: work.id,
        employee: work.employee,
        day: work.day,
        start: new Date(work.start),
        end: new Date(work.end),
      });
    }
    this.works = workDates;
    return workDates;
  }

  async add(work: IWorkDate) {
    await this.service.addWork(work);
    return await this.get(work.day || -1);
  }

  async modify(work: IWorkDate) {
    const workSend = {
      id: work.id,
      day: work.day,
      employee: work.employee,
      start: work.start.toISOString(),
      end: work.end.toISOString(),
    };
    await this.service.modifyWork(workSend);
    return await this.get(work.day || -1);
  }

  async delete_(work: IWork) {
    await this.service.deleteWork(work.id);
    return await this.get(work.day || -1);
  }

  /**
   * Get a readable time from a date, following the pattern "hhHmm"
   */
  getReadableTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const twoDigits = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}H${twoDigits}`;
  }

  /**
   * Get the start time and the end time, following the pattern "hhHmm - hhHmm"
   */
  getWorkingTime(start: Date, end: Date): string {
    return `${this.getReadableTime(start)} - ${this.getReadableTime(end)}`;
  }

  /**
   * Get the difference between two dates
   * @param start start Date
   * @param end end Date
   * @returns string : format like "hhHmm"
   */
  public getTotalHours(start: Date, end: Date): string {
    if (end.getHours() > 6) {
      end.setDate(start.getDate());
    } else if (end.getHours() < 6) {
      end.setDate(start.getDate() + 1);
    }

    let milliseconds = end.getTime() - start.getTime();

    const hours = Math.floor(milliseconds / 1000 / 60 / 60);
    milliseconds -= hours * 1000 * 60 * 60;

    const minutes = Math.floor(milliseconds / 1000 / 60);
    const twoDigits = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}H${twoDigits}`;
  }

  /**
   * Filter the works from a given preference.
   * @param works works list
   * @param preference preference (morning or evening)
   */
  getWorksPreference(works: IWorkDate[], preference: string): IWorkDate[] {
    return works.filter((work: IWorkDate) => {
      const startHour = work.start.getHours();
      const dayHours = [8, 9, 10, 11, 12, 13, 14, 15, 16];
      const nightHours = [17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4];
      return preference == "morning"
        ? dayHours.includes(startHour)
        : nightHours.includes(startHour);
    });
  }

  /**
   * Find the work of a given employee.
   * @param works works list
   * @param employeeID employee ID
   */
  getEmployeeWork(
    works: IWorkDate[],
    employeeID: number
  ): IWorkDate | undefined {
    return works.find((work: IWorkDate) => {
      return work.employee == employeeID;
    });
  }

  /**
   * Filter the works from a given employee.
   * @param employeeId employee ID.
   * @param works works list.
   */
  getEmployeeWorks(employeeId: number, works: IWorkDate[]): IWorkDate[] {
    const employeeWorks = works.filter((work: IWorkDate) => {
      return work.employee == employeeId;
    });
    return employeeWorks;
  }

  /**
   * Get the total horus and minutes of all works.
   * @param works works list.
   */
  getWorksHours(works: IWorkDate[]) {
    let seconds = 0;
    let hours = 0;
    let minutes = 0;

    for (const work of works) {
      seconds = (work.end.getTime() - work.start.getTime()) / 1000;
      minutes += seconds / 60;
    }
    hours = Math.floor(minutes / 60);
    minutes -= Math.floor(hours * 60);

    return { minutes, hours };
  }

  /**
   * Get the readable format of getWorksHours.
   * @param works works list
   */
  getReadableWorksHours(works: IWorkDate[]): string {
    const time = this.getWorksHours(works);
    const twoDigits = time.minutes < 10 ? "0" + time.minutes : time.minutes;
    return `${time.hours}H${twoDigits}`;
  }

  /**
   * Get the month salary of a given employee. Note: We need his works.
   * @param works works list
   * @param employee given employee
   */
  getSalary(works: IWorkDate[], employee: IEmployee): string {
    let salary = 0;
    const time = this.getWorksHours(works);

    salary = employee.salary * time.hours;
    salary += (employee.salary * time.minutes) / 60;
    const salaryOrZero = salary > 0 ? salary : 0;
    return salaryOrZero.toFixed(2);
  }

  /**
   * Get the current month work, grouped by weeks.
   * @param month
   * @param days
   * @param employeeID
   */
  getWeeks(month: number, days: IDay[], employeeID: number): IWorkDate[][] {
    const weeks: IWorkDate[][] = [];

    days.forEach((day: IDay, index: number) => {
      if (index % 7 == 0) {
        weeks.push([]);
      }
      if (day.month === month) {
        const work = day.works.find((work: IWorkDate) => {
          return work.employee === employeeID;
        });
        if (work) {
          weeks.slice(-1)[0].push(work);
        }
      }
    });
    return weeks;
  }
}

const workHandler = new WorkInteractor();
export { workHandler };
