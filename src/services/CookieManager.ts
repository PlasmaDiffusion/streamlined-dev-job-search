export function setCookie(cName: string, cValue: any, exdays: number = 400) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cName + "=" + cValue + ";" + expires + ";path=/";
}

export function getCookie(cname: string) {
  let name = cname + "=";
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

export function checkCookie(cName : string) {
  let user = getCookie(cName);
  if (user != "") {
    alert("Welcome again " + user);
  } else {
    const user = prompt("Please enter your name:", "");
    if (user != "" && user != null) {
      setCookie(cName, user, 365);
    }
  }
}
