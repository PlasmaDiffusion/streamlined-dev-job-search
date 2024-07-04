import { getCookie } from "./CookieManager";

//Applications to be saved into a table
export interface Application {
  jobTitle: string;
  company: string;
  date: string;

  linkOfPosting: string;
  sitePostingCameFrom:string;
  posting: string;

  applied?: boolean;
  coverLetter?: string;
}
  
//Quick links for searching that will appear in the right sidebar of this site
export interface JobBoardLink {
    link: string;
    displayName: string;
    timesClicked: number;
    
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
  console.log("loaded Links:", linkArray);
  return linkArray;
}