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
export async function fetchLinks() {
  const response = await axios
    .get(`${import.meta.env.VITE_API_URL}/JobSearchLinks`)
    .catch((e) => console.log(e));
  return response;
}

//GET /api/JobSearchLinks/CompanySite

//GET /api/JobSearchLinks/NonCompanySite

//POST /api/JobSearchLinks

//PUT /api/JobSearchLinks

export async function markLinkAsClicked(linkClicked: JobBoardLink) {
  linkClicked.timesClicked += 1;
  const response = await axios
    .patch(
      `${import.meta.env.VITE_API_URL}/JobSearchLinks/updateLastClickedDate`,
      linkClicked
    )
    .catch((e) => console.log(e));
  return response;
}

//GET /api/JobApplications/{id}

//GET /api/JobApplications

//GET /api/JobApplications/CurrentMonth
export async function fetchCurrentMonthApplications() {
  const response = await axios
    .get(`${import.meta.env.VITE_API_URL}/JobApplications/currentMonth`)
    .catch((e) => console.log(e));
  console.log(response);

  return response;
}

//GET /api/JobSearchLinks/NonCompanySite

//POST /api/JobSearchLinks

//PUT /api/JobSearchLinks
