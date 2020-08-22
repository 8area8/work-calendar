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
  it('should show all week days, even if they are not in the current month.', () => {
    Page.open()
    let elem = $('#day-2020-06-31')
    expect(elem).toBeVisible()
  })
  it('should display the correct dates.', () => {
    Page.open()
    setTestDate()
    expect($("#day-2020-06-26")).not.toExist()
    expect($("#day-2020-06-27")).toExist()
    expect($("#day-2020-08-06")).toExist()
    expect($("#day-2020-08-07")).not.toExist()
  })
  it("should show the active day", () => {
    Page.open()
    const now = new Date()
    const id = `day-${now.getFullYear()}-${String(now.getMonth()).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    expect($(`#${id}`)).toHaveClassContaining("--active")
  })
  it("Database limitation: should disable the dates if there is a gap >= 2 months from the current one", () => {
    Page.open()
    const now = new Date()
    $('#month-chevron-left').click()
    $('#month-chevron-left').click()
    const allDates = $$(".c-nodes__node--day")
    let date
    for (elem of allDates) {
      date = new Date(elem.getAttribute("id").slice(5));
      console.log(date, now.getMonth())
      if (Math.abs(now.getMonth() - date.getMonth()) > 1) {
        expect(elem).toHaveClassContaining("--disabled")
        expect(elem).not.toBeClickable()
      }
    }
  })

})

function getMonthName(date) {
  let name = date.toLocaleDateString('fr', {
    month: 'long',
  })
  return name[0].toUpperCase() + name.slice(1)
}

function setTestDate() {
  while (!$('#calendar-month-name=Août')) {
    $('#month-chevron-left').click()
  }
  while (!$('#calendar-year=2020')) {
    $('#year-chevron-left').click()
  }
}
