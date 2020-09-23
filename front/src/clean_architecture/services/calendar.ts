import { httpClient, IError } from "../common/base_api";
import { IDay, IWork } from "../entities/calendar";
import { verifyAuth } from "../services/auth";

export interface IMonthService {
  getDays: (fromNow: number) => Promise<IDay[] | IError>;
  getDay: (id: number) => Promise<IDay | IError>;
  addEmployee: (work: IWork) => Promise<IWork | IError>;
  modifyEmployee: (work: IWork) => Promise<IWork | IError>;
  deleteEmployee: (work: IWork) => Promise<IWork | IError>;
}

export class MonthService implements IMonthService {
  @verifyAuth
  public async getDays(fromNow: number): Promise<IDay[] | IError> {
    const response = await httpClient.get<IDay[]>(`/work/month/${fromNow}/`);
    return response;
  }

  @verifyAuth
  public async getDay(id: number): Promise<IDay | IError> {
    const response = await httpClient.get<IDay>(`/days/${id}`);
    return response;
  }

  @verifyAuth
  public async addEmployee(work: IWork): Promise<IWork | IError> {
    const response = await httpClient.post<IWork>(`/works/`, work);
    if (response) {
      await this.getDay(work.day);
    }
    return response;
  }

  @verifyAuth
  public async modifyEmployee(work: IWork): Promise<IWork | IError> {
    const response = await httpClient.patch<IWork>(`/works/${work.id}`, work);
    if (response) {
      await this.getDay(work.day);
    }
    return response;
  }

  @verifyAuth
  public async deleteEmployee(work: IWork): Promise<IWork | IError> {
    const response = await httpClient.delete<IWork>(`/works/${work.id}`);
    if (response) {
      await this.getDay(work.day);
    }
    return response;
  }
}
