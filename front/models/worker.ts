/**
 * Worker model.
 */
interface SalaryWorker {
  id: null | number
  name: string
  preference: Preference
  salary: number
}

/**
 * Work preference: can be morning or evening.
 */
enum Preference {
  Morning = 'morning',
  Evening = 'evening',
}

// eslint-disable-next-line no-undef
export { SalaryWorker }
