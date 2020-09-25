import { httpClient, IError } from "../common/base_api";
import { IWork, IWorkDate } from "../entities/calendar";
import { verifyAuth } from "../services/auth";

export interface IWorkService {
  getWorks: (id: number) => Promise<IWork[] | IError>;
  addWork: (work: IWork) => Promise<IWork | IError>;
  modifyWork: (work: IWork) => Promise<IWork | IError>;
  deleteWork: (id: number | null) => Promise<IWork | IError>;
}

export class WorkService implements IWorkService {
  @verifyAuth
  public async getWorks(id: number) {
    const response = await httpClient.get<IWork[]>(
      `/work/workdays_from_day/${id}/`
    );
    return response;
  }

  @verifyAuth
  public async addWork(work: IWork) {
    const response = await httpClient.post<IWork>("/work/workdays/", work);
    return response;
  }

  @verifyAuth
  public async modifyWork(work: IWork) {
    const response = await httpClient.patch<IWork>(
      `/work/workdays/${work.id}/`,
      work
    );
    return response;
  }

  @verifyAuth
  public async deleteWork(id: number | null) {
    const response = await httpClient.delete<IWork>(`/work/workdays/${id}/`);
    return response;
  }
}
