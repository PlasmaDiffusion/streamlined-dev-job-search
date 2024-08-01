/**
 * @param cName Case sensitive name of the cookie!
 * @param cValue Value you are going to overwrite/save a cookie with.
 * @param exDays How many does until this expires. Beware browser limits.
 */
export function setCookie(cName: string, cValue: any, exDays: number = 400) {
  const d = new Date();
  d.setTime(d.getTime() + exDays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cName + "=" + cValue + ";" + expires + ";path=/";
  console.log("*value to save", cName + "=" + cValue + ";" + expires + ";path=/");
  console.log("*cookie", document.cookie);

}

export function getCookie(cName: string) {
  let name = cName + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function checkIfCookieExists(cName : string) {
  let cookie = getCookie(cName);
  if (cookie != "") {
    return true;
  } else {
    return false;
  }
}
