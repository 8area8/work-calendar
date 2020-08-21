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
    monthName = now.toLocaleDateString('fr', {
      month: 'long'
    }).toLowerCase()

    let elem = $('.work-calendar__month')
    expect(elem).toHaveText(monthName)
    elem = $('.work-calendar__year')
    expect(elem).toHaveText(String(now.getFullYear()))
  })
})
