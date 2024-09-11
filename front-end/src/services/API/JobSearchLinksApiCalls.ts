import axios, { AxiosResponse } from "axios";
import { JobBoardLink } from "../../Interfaces";

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
    `${import.meta.env.VITE_API_URL}/JobSearchLinks/${idToDelete}`
  );

  if (response.status === 204) {
    const indexToDelete = links.findIndex(
      (linkObj) => linkObj.id === idToDelete
    );

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

//POST /api/JobSearchLinks
export async function createOrUpdateLink(
  linkToAddOrEdit: JobBoardLink,
  updateLastClickedDate?: boolean
) {
  let response: AxiosResponse<any, any> | undefined = undefined;

  //Add a new link, or edit an old one. -1 will mean it's a new one needing an id.
  if (linkToAddOrEdit.id === -1 || linkToAddOrEdit.id === undefined) {
    linkToAddOrEdit.id = Math.floor(Date.now() / 1000);

    response = await axios.post(
      `${import.meta.env.VITE_API_URL}/JobSearchLinks`,
      linkToAddOrEdit
    );
    console.log(response);
  } else if (linkToAddOrEdit.id) {
    response = await axios.patch(
      `${import.meta.env.VITE_API_URL}/JobSearchLinks/${
        updateLastClickedDate && "updateLastClickedDate"
      }`,
      linkToAddOrEdit
    );
    console.log(response);
  }

  if (response?.status !== 200) {
    alert("Couldn't add or modify link");
    console.warn(response);
  } else if (!updateLastClickedDate) {
    location.reload();
  }
}

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
