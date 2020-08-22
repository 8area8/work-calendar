const Page = require('../pageObjects/workers.page')

describe('Workers testing', () => {
  it('should show a list of morning workers', () => {
    Page.open()
    const elem = $("ul#morning-workers")
    expect(elem).toExist()
  })
  it('should show a list of evening workers', () => {
    Page.open()
    const elem = $("ul#evening-workers")
    expect(elem).toExist()
  })
  it('should show a create worker button', () => {
    Page.open()
    const elem = $(".button#create-worker")
    expect(elem).toExist()
  })
})
