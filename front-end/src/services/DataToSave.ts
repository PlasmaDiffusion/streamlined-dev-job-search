import { getCookie, setCookie } from "./CookieManager";

//Applications to be saved into a table
export interface JobApplication {
  jobTitle: string;
  company: string;
  date: string;
  id: number;

  linkToPosting: string;
  sitePostingCameFrom?: string;
  jobDescription: string;
  tags?: string[];

  applied: boolean;
  coverLetter?: string;
}

//Quick links for searching that will appear in the right sidebar of this site
export interface JobBoardLink {
  id: number;
  user: string;

  link: string;
  displayName: string;
  timesClicked: number;
  lastClicked?: Date;

  category: string;
  colour: string;
  isCompanySite: boolean;
}

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
