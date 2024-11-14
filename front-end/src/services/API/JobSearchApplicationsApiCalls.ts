import axios, { AxiosResponse } from "axios";
import { ApplicationFetchMethod, JobApplication } from "../../Interfaces";

//GET /api/JobApplications/{id}

//GET /api/JobApplications
export async function fetchApplications(fetchBy: ApplicationFetchMethod) {
  let param = "";

  console.log("fetching by",  fetchBy as ApplicationFetchMethod);

  if (fetchBy === ApplicationFetchMethod.THIS_MONTH) param += "/currentMonth";
  else if (fetchBy === ApplicationFetchMethod.THIS_YEAR) param += "/currentYear";

  const response = await axios
    .get(`${import.meta.env.VITE_API_URL}/JobSearchApplications${param}`)
    .catch((e) => console.log(e));

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
  applications: JobApplication[],
  dateApplied: string
) {
  const response = await axios.delete(
    `${import.meta.env.VITE_API_URL}/JobSearchApplications/guest/${dateApplied}`
  );

  if (response.status === 204) {
    const indexToDelete = applications.findIndex(
      (application) => application.dateApplied === dateApplied
    );

    applications.splice(indexToDelete, 1);

    return applications;
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
