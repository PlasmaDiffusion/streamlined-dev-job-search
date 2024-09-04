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

//Applications to be saved into a table
export interface JobApplication {
  user: string;
  dateApplied?: string;


  jobTitle: string;
  company: string;

  linkToPosting: string;
  sitePostingCameFrom?: string;
  jobDescription: string;
  tags?: string[];

  applied: boolean;
  coverLetter?: string;
}

export enum ApplicationFetchMethod {
  NONE,
  THIS_MONTH,
  THIS_YEAR,
  ALL_TIME,
}
