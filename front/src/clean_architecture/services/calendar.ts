import { httpClient } from "../common/base_api";
import { IDay, IWork } from "../entities/calendar";

export interface IMonthService {
  getDays: (year: number, month: number) => Promise<IDay[]>;
  addEmployee: (work: IWork) => Promise<IWork>;
  modifyEmployee: (work: IWork) => Promise<IWork>;
  deleteEmployee: (work: IWork) => Promise<IWork>;
}

export class MonthService implements IMonthService {
  public async getDays(year: number, month: number): Promise<IDay[]> {
    const response = await httpClient.get<IDay[]>("/months/", {
      params: { year, month }
    });
    return response;
  }

  public async getDay(id: number): Promise<IDay> {
    const response = await httpClient.get<IDay>(`/days/${id}`);
    return response;
  }

  public async addEmployee(work: IWork): Promise<IWork> {
    const response = await httpClient.post<IWork>(`/works/`, work);
    if (response) {
      await this.getDay(work.dayId);
    }
    return response;
  }

  public async modifyEmployee(work: IWork): Promise<IWork> {
    const response = await httpClient.patch<IWork>(`/works/${work.id}`, work);
    if (response) {
      await this.getDay(work.dayId);
    }
    return response;
  }

  public async deleteEmployee(work: IWork): Promise<IWork> {
    const response = await httpClient.delete<IWork>(`/works/${work.id}`);
    if (response) {
      await this.getDay(work.dayId);
    }
    return response;
  }
}
