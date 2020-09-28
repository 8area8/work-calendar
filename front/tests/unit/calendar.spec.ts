import { Calendar } from "../../src/clean_architecture/entities/calendar";

test("getDays should return the days of the selected month", () => {
  const calendar = new Calendar();
  const days = calendar.getDays();
  const date = new Date();
  date.setDate(1);
  const currentMonth = date.getMonth();

  while (date.getMonth() === currentMonth) {
    expect(days).toContainEqual({
      id: null,
      year: date.getFullYear(),
      month: date.getMonth(),
      number: date.getDate(),
      works: [],
    });
    date.setDate(date.getDate() + 1);
  }
});

test("getDays can return days of other months if they are part of the weeks of the current month", () => {
  const calendar = new Calendar();
  const date = calendar.selector;
  date.setDate(1);
  if (date.getDay() === 1) {
    calendar.setMonth(1);
  }
  let days = calendar.getDays();
  expect(days[0].month).toBe(date.getMonth() - 1);

  date.setDate(calendar.getLastDayOfTheMonth());
  if (date.getDay() === 7) {
    calendar.setMonth(1);
  }
  days = calendar.getDays();
  expect(days.pop()?.month).toBe(date.getMonth() + 1);
});

// test getDays interactor returns the complete list of IDays
// test get total hours function works properly
// test

// test add employee interactor returns the day updated with the new employee
// test delete employee interactor returns the day updated without the deleted employee
// test modify employee interactir returns the day updated with the modified employee
