import { Calendar } from '../../models/calendar'

test('getDays should return the days of the selected month', () => {
  const calendar = new Calendar()
  const days = calendar.getDays()
  const date = new Date()
  date.setDate(1)
  const currentMonth = date.getMonth()

  while (date.getMonth() === currentMonth) {
    expect(days).toContainEqual({
      year: date.getFullYear(),
      month: date.getMonth(),
      number: date.getDate(),
    })
    date.setDate(date.getDate() + 1)
  }
})

test('getDays can return days of other months if they are part of the weeks of the current month', () => {
  const calendar = new Calendar()
  const date = calendar.selector
  date.setDate(1)
  if (date.getDay() === 1) {
    calendar.setMonth(1)
  }
  let days = calendar.getDays()
  expect(days[0].month).toBe(date.getMonth() - 1)

  date.setDate(calendar.getMonthLen())
  if (date.getDay() === 7) {
    calendar.setMonth(1)
  }
  days = calendar.getDays()
  expect(days.pop()?.month).toBe(date.getMonth() + 1)
})
