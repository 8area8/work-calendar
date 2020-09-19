import { IDay, Calendar } from "../entities/calendar";
import { MonthService } from "../services/calendar";

export interface ICalendarInteractor {
  overLimitMessage: string;
  /**
   * Get the selected year.
   */
  getYear: () => number;
  /**
   * Get the selected month.
   */
  getMonth: () => number;
  /**
   * Set a new year.
   */
  setYear: (diference: number) => void;
  /**
   * Set a new month.
   */
  setMonth: (diference: number) => void;
  /**
   * Get the list of day name, from the current locale.
   *
   * French example : ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
   *
   * @returns {Array<string>} the list of days names.
   */
  getWeekDayNames: () => Array<string>;
  /**
   * Return a string from a given date.
   *
   * Format is "day-YY-MM-DD"
   *
   * @returns {string} the string format
   */
  getStringDate: (day: IDay) => string;
  /**
   * Get the selected month name.
   *
   * @returns {string}
   */
  getMonthName: () => string;
  /**
   * Get the days.
   *
   * @returns {IDay[]} a list of IDays
   */
  getDays: () => Promise<IDay[]>;
}

export class CalendarInteractor implements ICalendarInteractor {
  public overLimitMessage =
    "Il est impossible de remplir des dates trop éloignées.";
  private calendar: Calendar = new Calendar();
  private client: MonthService = new MonthService();

  getYear(): number {
    return this.calendar.selector.getFullYear();
  }

  setYear(difference: number): void {
    return this.calendar.setYear(difference);
  }

  getMonth(): number {
    return this.calendar.selector.getMonth();
  }

  setMonth(difference: number): void {
    return this.calendar.setMonth(difference);
  }

  getWeekDayNames(): Array<string> {
    return this.calendar.getWeekDayNames();
  }

  getMonthName(): string {
    const name = this.calendar.selector.toLocaleDateString("default", {
      month: "long"
    });
    return name[0].toUpperCase() + name.slice(1);
  }

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

  async getDays(): Promise<IDay[]> {
    const month = this.calendar.selector.getMonth();
    const monthDiff = month - this.calendar.now.getMonth();
    const days = await this.client.getDays(monthDiff);
    this.calendar.getDays();

    if ("type" in days) {
      return this.calendar.days;
    }

    days.forEach((day, index) => {
      const baseDay = this.calendar.days.find(item => {
        return (
          item.number == day.number &&
          item.month == day.month - 1 &&
          item.year == day.year
        );
      });
      if (baseDay) {
        baseDay.id = day.id;
        baseDay.employees = day.employees;
      }
    });

    console.log("days are", this.calendar.days);
    return this.calendar.days;
  }
}
