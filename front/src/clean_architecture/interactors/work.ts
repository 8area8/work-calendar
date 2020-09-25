import { IWork, IWorkDate } from "../entities/calendar";
import { WorkService } from "../services/work";
import { isError, IError } from "../common/base_api";

export interface IWorkInteractor {
  works: IWork[];
  get: (dayId: number) => Promise<IWork[]>;
  add: (work: IWorkDate) => Promise<IWork[]>;
  modify: (work: IWorkDate) => Promise<IWork[]>;
  delete_: (work: IWork) => Promise<IWork[]>;
}

export class WorkInteractor implements IWorkInteractor {
  private service = new WorkService();
  public works: IWork[] = [];

  async get(dayId: number) {
    const result = await this.service.getWorks(dayId);
    if (isError(result)) {
      return [];
    }
    for (const work of result) {
      work.start = new Date(work.start);
      work.end = new Date(work.end);
    }
    this.works = result;
    return result;
  }

  async add(work: IWorkDate) {
    await this.service.addWork(work);
    return await this.get(work.day);
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
    return await this.get(work.day);
  }

  async delete_(work: IWork) {
    await this.service.deleteWork(work.id);
    return await this.get(work.day);
  }
}
