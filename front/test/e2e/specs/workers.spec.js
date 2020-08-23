const Page = require('../pageObjects/workers.page')

describe('Workers testing', () => {
  it('should show a list of morning workers', () => {
    Page.open()
    const elem = $('ul#morning-workers')
    expect(elem).toExist()
  })
  it('should show a list of evening workers', () => {
    Page.open()
    const elem = $('ul#evening-workers')
    expect(elem).toExist()
  })
  it('should have a create worker line', () => {
    Page.open()
    let elem = $('#name-input')
    expect(elem).toExist()
    elem = $('#preference-input')
    expect(elem).toExist()
    elem = $('#salary-input')
    expect(elem).toExist()
  })
  it('should have a create worker button', () => {
    Page.open()
    const elem = $('.button#create-worker')
    expect(elem).toExist()
  })
  it('should create and return a worker after completing the form', () => {
    $('#name-input').text = 'Jhon Doe'
    $('#preference-input').text = 'morning'
    $('#salary-input').text = '10'
    $('#create-worker').click()
    expect($('#morning-workers div')).toExist()
  })
  it('should not create a worker if some inputs is missing', () => {
    $('#name-input').text = 'Jhon Doe'
    $('#preference-input').text = 'morning'
    $('#salary-input').text = '10'
    $('#create-worker').click()
    expect($('#error-message')).toExist()
  })
})
