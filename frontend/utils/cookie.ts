/**
 * 任意の名称と値、有効期限（分）を持つcookieを設定します.
 * @param {string} name - cookieの名前.
 * @param {string} value - cookieの値.
 * @param {number} minutes - cookieが失効するまでの有効期限（分）.
 */
export const setCookie = (name: string, value: string, minutes: number) => {
  const date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}; ${expires}; path=/`;
};

/**
 * 任意の名称に対応するcookieの値を取得します.
 * @param {string} name - cookieの名前.
 * @returns {string|null} cookieの値, 対応する値がない場合はnullを返す.
 */
export const getCookie = (name: string): string | null => {
  const cookieName = `${name}=`;
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.startsWith(cookieName)) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return null;
};

/**
 * 任意の名称に対応するcookieを削除します.
 * @param {string} name - 削除するcookieの名前.
 */
export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};
