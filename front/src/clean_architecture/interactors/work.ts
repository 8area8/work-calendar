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
    this.works = result;
    this.convertTimeToDate();
    return result;
  }

  convertTimeToDate() {
    for (const work of this.works) {
      work.start = new Date(`2020-01-01 ${work.start}`);
      work.end = new Date(`2020-01-02 ${work.end}`);
    }
  }

  async add(work: IWorkDate) {
    const workSend = {
      id: work.id,
      day: work.day,
      employee: work.employee,
      start: `${work.start.getHours()}h${work.start.getMinutes()}`,
      end: `${work.start.getHours()}h${work.start.getMinutes()}`,
    };
    await this.service.addWork(workSend);
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
