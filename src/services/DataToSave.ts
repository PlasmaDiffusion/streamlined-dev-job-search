import { getCookie, setCookie } from "./CookieManager";

//Applications to be saved into a table
export interface Application {
  jobTitle: string;
  company: string;
  date: string;
  id: number;

  linkOfPosting: string;
  sitePostingCameFrom: string;
  posting: string;

  applied?: boolean;
  coverLetter?: string;
}

//Quick links for searching that will appear in the right sidebar of this site
export interface JobBoardLink {
  link: string;
  displayName: string;
  timesClicked: number;
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

export function removeLinkAtIndex(links: JobBoardLink[], index: number) {

  links.splice(index, 1);

  links.forEach((link, index) => {
    link.id = index;
  });

  console.log("Deleted a link. Remaining links:", links);
  setCookie('links', JSON.stringify(links));
  return links;
}
