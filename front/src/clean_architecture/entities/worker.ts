/**
 * Worker model.
 */
interface IEmployee {
  id: null | number;
  name: string;
  preference: IPreference;
  salary: number;
  off: string[];
}

/**
 * Work preference: can be morning or evening.
 */
enum IPreference {
  Morning = "morning",
  Evening = "evening",
}

// eslint-disable-next-line no-undef
export { IEmployee, IPreference };
