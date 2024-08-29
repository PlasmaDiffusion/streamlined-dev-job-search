import { getCookie, setCookie } from "./CookieManager";

export function loadLinks() {
  const previousLinks = getCookie("Links");

  if (!previousLinks) {
    return [];
  }

  const linkArray: JobBoardLink[] = JSON.parse(previousLinks);
  linkArray.forEach((link) => {
    console.log(link.displayName);
  });
  return linkArray;
}

export function loadApplications() {
  const previousApplications = getCookie("Applications");

  if (!previousApplications) {
    return [];
  }

  const linkArray: JobApplication[] = JSON.parse(previousApplications);
  return linkArray;
}

export function removeApplicationsAtIndex(indexToDelete: number) {
  const applications = loadApplications();
  applications.splice(indexToDelete, 1);

  setCookie("Applications", JSON.stringify(applications));
  return applications;
}
