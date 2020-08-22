const Page = require('../pageObjects/main.page')

describe('Example test', () => {
  it('should open correct app', () => {
    Page.open()
    expect(browser).toHaveTitle('front')
  })
})

describe('Calendar component', () => {
  it('should show a calendar', () => {
    Page.open()
    const elem = $('#work-calendar')
    expect(elem).toBeVisible()
  })
  it('should show the current year and the current month by default', () => {
    Page.open()
    const now = new Date()

    let elem = $('#calendar-month-name')
    expect(elem).toHaveText(getMonthName(now))
    elem = $('#calendar-year')
    expect(elem).toHaveText(String(now.getFullYear()))
  })
  it('should switch to the next or the last month clicking on the month chevrons', () => {
    date = new Date()
    Page.open()
    let elem = $('#month-chevron-left')
    elem.click()
    date.setMonth(date.getMonth() - 1)
    expect($('#calendar-month-name')).toHaveText(getMonthName(date))

    elem = $('#month-chevron-right')
    elem.click()
    elem.click()
    date.setMonth(date.getMonth() + 2)
    expect($('#calendar-month-name')).toHaveText(getMonthName(date))
  })
})

function getMonthName(date) {
  let name = date.toLocaleDateString('fr', {
    month: 'long',
  })
  return name[0].toUpperCase() + name.slice(1)
}
