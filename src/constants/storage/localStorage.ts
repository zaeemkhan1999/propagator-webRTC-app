export function saveLocalStorage(
  key: string,
  value: string | Record<string, any> | undefined
) {
  try {
    if (typeof value === "string") {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
  }
}

export function getLocalStorage(key: string, isString = true) {
  try {
    const value = localStorage.getItem(key);

    if (value) {
      if (isString) return value;
      return JSON.parse(value);
    }
  } catch (err) {
  }
}
export function clearLocalStorage(key: string) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
  }
}

export enum SortEnumType {
  Asc = "ASC",
  Desc = "DESC",
}

export enum Gender {
  Custom = "CUSTOM",
  Female = "FEMALE",
  Male = "MALE",
  RatherNotSay = "RATHER_NOT_SAY",
}
