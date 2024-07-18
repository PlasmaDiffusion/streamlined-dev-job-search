import { getCookie, setCookie } from "./CookieManager";

//Applications to be saved into a table
export interface Application {
  jobTitle: string;
  company: string;
  date: string;
  id: number;

  linkOfPosting: string;
  sitePostingCameFrom?: string;
  posting: string;
  tags?: string[];

  applied: boolean;
  coverLetter?: string;
}

//Quick links for searching that will appear in the right sidebar of this site
export interface JobBoardLink {
  link: string;
  displayName: string;
  timesClicked: number;
  lastClicked: { day: number; month: number; year: number };
  id: number;

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
  return linkArray;
}

export function loadApplications() {
  const previousApplications = getCookie("Applications");

  if (!previousApplications) {
    return [];
  }

  const linkArray: Application[] = JSON.parse(previousApplications);
  return linkArray;
}

export function removeLinkAtIndex(idToDelete: number) {
  const links = loadLinks();

  const indexToDelete = links.findIndex((link)=>{link.id === idToDelete});

  links.splice(indexToDelete, 1);

  for (let i = 0; i < links.length; i++) {
    links[i].id = i;
  }

  console.log("Deleted a link. Remaining links:", links);
  setCookie("Links", JSON.stringify(links));
  return links;
}

export function removeApplicationsAtIndex(indexToDelete: number) {
  const applications = loadApplications();
  applications.splice(indexToDelete, 1);

  for (let i = 0; i < applications.length; i++) {
    applications[i].id = i;
  }

  console.log("Deleted an application. Remaining applications:", applications);
  setCookie("Applications", JSON.stringify(applications));
  return applications;
}
