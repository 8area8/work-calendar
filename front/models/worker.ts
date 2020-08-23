/**
 * Worker model.
 */
interface SalaryWorker {
  id: number
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
