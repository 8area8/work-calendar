import { IDay, Calendar } from "../entities/calendar";
import { MonthService } from "../services/calendar";

interface ICalendarInteractor {}

export default class CalendarInteractor implements ICalendarInteractor {
  calendar: Calendar = new Calendar();
  client: MonthService = new MonthService();

  getStringDate(day: IDay): string {
    return `day-${day.year}-${String(day.month).padStart(2, "0")}-${String(
      day.number
    ).padStart(2, "0")}`; // day-YYYY-MM-DD
  }

  isActiveDay(day: IDay): boolean {
    return (
      day.number === this.calendar.now.getDate() &&
      day.year === this.calendar.now.getFullYear() &&
      day.month === this.calendar.now.getMonth()
    );
  }

  isInMonth(day: IDay): boolean {
    return day.month === this.calendar.selector.getMonth();
  }

  isOverDatabaseLimit(day: IDay): boolean {
    const monthDiff = day.month - this.calendar.now.getMonth();
    return (
      Math.abs(monthDiff) >= 2 || day.year !== this.calendar.now.getFullYear()
    );
  }

  isInvisible(): boolean {
    return (
      Math.abs(
        this.calendar.selector.getMonth() - this.calendar.now.getMonth()
      ) <= 1 &&
      this.calendar.selector.getFullYear() === this.calendar.now.getFullYear()
    );
  }

  getDays(): IDay[] {
    const year = this.calendar.selector.getFullYear();
    const month = this.calendar.selector.getMonth();
    // const days = this.client.getDays(year, month);
    return this.calendar.days;
  }
}
