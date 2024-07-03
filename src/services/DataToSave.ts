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
    timesClicked: number;
    category: string;
}
  