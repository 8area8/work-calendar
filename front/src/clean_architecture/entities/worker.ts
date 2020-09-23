/**
 * Worker model.
 */
interface ISalaryWorker {
  id: null | number;
  name: string;
  preference: IPreference;
  salary: number;
  employee_id: number | null;
}

/**
 * Work preference: can be morning or evening.
 */
enum IPreference {
  Morning = "morning",
  Evening = "evening",
}

// eslint-disable-next-line no-undef
export { ISalaryWorker, IPreference };
