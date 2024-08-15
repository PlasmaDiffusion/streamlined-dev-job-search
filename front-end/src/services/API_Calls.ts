import { JobBoardLink } from "./DataToSave";

export interface FetchedLinksResponse {
  companySiteLinks: JobBoardLink[],
  jobBoardLinks: JobBoardLink[],
}

//GET /api/JobSearchLinks/{id}

//GET /api/JobSearchLinks

//GET /api/JobSearchLinks/CompanySite

//GET /api/JobSearchLinks/NonCompanySite

//POST /api/JobSearchLinks

//PUT /api/JobSearchLinks

//DELETE /api/JobSearchLinks/{id}
