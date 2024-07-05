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

export function removeLinkAtIndex(indexToDelete: number) {
  const links = loadLinks();
  links.splice(indexToDelete, 1);


  for (let i = 0; i < links.length; i++) {
    links[i].id = i;
  }

  console.log("Deleted a link. Remaining links:", links);
  setCookie("Links", JSON.stringify(links));
  return links;

  // const newArray: JobBoardLink[] = [];

  // for (let i = 0; i < links.length; i++) {
  //   if (i !== indexNeeded) {
  //     newArray.push(links[i]);
  //   }
  // }

  // console.log("Deleted a link. Remaining links:", newArray);
  // console
  // setCookie("Links", JSON.stringify(newArray));
  // return newArray;

  // const newArray: JobBoardLink[] = [];

  // for (let i = 0; i < links.length; i++) {
  //   if (i !== indexNeeded) {
  //     newArray.push(links[i]);
  //   }
  // }

  // console.log("Deleted a link. Remaining links:", newArray);
  // console
  // setCookie("Links", JSON.stringify(newArray));
  // return newArray;
}
