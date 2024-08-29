import axios, { AxiosResponse } from "axios";
import { JobApplication } from "../../interfaces";


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
  let response: AxiosResponse<any, any> | undefined = undefined;

  //Add a new link, or edit an old one. -1 will mean it's a new one needing an id.
  if (
    applicationToAddOrEdit.id === -1 ||
    applicationToAddOrEdit.id === undefined
  ) {
    applicationToAddOrEdit.id = Math.floor(Date.now() / 1000);

    response = await axios.post(
      `${import.meta.env.VITE_API_URL}/JobApplications`,
      applicationToAddOrEdit
    );
    console.log(response);
  } else if (applicationToAddOrEdit.id) {
    response = await axios.patch(
      `${import.meta.env.VITE_API_URL}/JobApplications`,
      applicationToAddOrEdit
    );
    console.log(response);
  }

  if (response?.status !== 200) {
    alert("Couldn't add or modify link");
    console.warn(response);
  } else {
    location.reload();
  }
}

//DELETE /api/JobSearchLinks/{id}
export async function removeApplicationById(
  links: JobApplication[],
  idToDelete: number
) {
  const response = await axios.delete(
    `${import.meta.env.VITE_API_URL}/JobSearchApplications/${idToDelete}`
  );

  if (response.status === 204) {
    const indexToDelete = links.findIndex(
      (linkObj) => linkObj.id === idToDelete
    );

    links.splice(indexToDelete, 1);

    return links;
  }
}
