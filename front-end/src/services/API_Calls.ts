import axios from "axios";
import { JobBoardLink } from "./DataToSave";

export interface FetchedLinksResponse {
  companySiteLinks: JobBoardLink[];
  jobBoardLinks: JobBoardLink[];
}


//DELETE /api/JobSearchLinks/{id}
export async function removeLinkById(
  links: JobBoardLink[],
  idToDelete: number
) {
  const response = await axios.delete(
    `${import.meta.env.VITE_API_URL}/${idToDelete}`
  );

  if (response.status === 204) {
    const indexToDelete = links.findIndex((linkObj) => {
      linkObj.id === idToDelete;
    });

    links.splice(indexToDelete, 1);

    return links;
  }
}

//GET /api/JobSearchLinks/{id}

//GET /api/JobSearchLinks

//GET /api/JobSearchLinks/CompanySite

//GET /api/JobSearchLinks/NonCompanySite

//POST /api/JobSearchLinks

//PUT /api/JobSearchLinks

