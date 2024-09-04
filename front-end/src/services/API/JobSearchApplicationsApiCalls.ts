import axios, { AxiosResponse } from "axios";
import { JobApplication } from "../../Interfaces";

//GET /api/JobApplications/{id}

//GET /api/JobApplications
export async function fetchAllApplications() {
  const response = await axios
    .get(`${import.meta.env.VITE_API_URL}/JobApplications`)
    .catch((e) => console.log(e));
  console.log(response);

  return response;
}

//GET /api/JobApplications/CurrentMonth
export async function fetchCurrentMonthApplications() {
  const response = await axios
    .get(`${import.meta.env.VITE_API_URL}/JobApplications/currentMonth`)
    .catch((e) => console.log(e));
  console.log(response);

  return response;
}

//POST /api/JobApplications
export async function createOrUpdateApplication(
  applicationToAddOrEdit: JobApplication
) {
  //Add a new link, or edit an old one. -1 will mean it's a new one needing an id.
  if (!applicationToAddOrEdit.dateApplied) {
    console.log("Submitting", applicationToAddOrEdit);

    await axios
      .post(
        `${import.meta.env.VITE_API_URL}/JobSearchApplications`,
        applicationToAddOrEdit
      )
      .then((res) => checkResponse(res, true))
      .catch((e) => console.warn(e));
  } else if (applicationToAddOrEdit.dateApplied) {
    await axios
      .patch(
        `${import.meta.env.VITE_API_URL}/JobSearchApplications`,
        applicationToAddOrEdit
      )
      .then((res) => checkResponse(res, true))
      .catch((e) => console.warn(e));
  }
}

//DELETE /api/JobSearchLinks/{id}
export async function removeApplicationById(
  links: JobApplication[],
  dateApplied: string
) {
  const response = await axios.delete(
    `${import.meta.env.VITE_API_URL}/JobSearchApplications/guest/${dateApplied}`
  );

  if (response.status === 204) {
    const indexToDelete = links.findIndex(
      (linkObj) => linkObj.dateApplied === dateApplied
    );

    links.splice(indexToDelete, 1);

    return links;
  }
}

function checkResponse(
  response: AxiosResponse<any, any>,
  reloadPageIfSuccessful: boolean
) {
  if (response?.status !== 200) {
    console.warn(response);
  } else if (reloadPageIfSuccessful) {
    location.reload();
  }
}
