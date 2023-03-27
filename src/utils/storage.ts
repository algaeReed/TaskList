
export function setStorageSync(key: string, value: any) {
  return localStorage.setItem(key, value);
}

export function getStorageSync(key: string) {
  return localStorage.getItem(key);
}

export function removeStorageSync(key: string) {
  return localStorage.removeItem(key);
}
