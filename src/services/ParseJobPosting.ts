export function parseJobPosting(msg: string) {
  const possibleTitle = checkForJobTitle(msg);
  const possibleCompany = checkForCompanyTitle(msg);

  return {
    possibleTitle,
    possibleCompany,
  };
}

const jobTitleTags = [
  "Software Developer",
  "Software Engineer",
  "Frontend Developer",
  "Front End Developer",
  "Frontend Engineer",
  "Front End Engineer",
  "Backend Developer",
  "Back End Developer",
  "Backend Engineer",
  "Back End Engineer",
  "Fullstack Developer",
  "Full Stack Developer",
  "Fullstack Engineer",
  "Full Stack Engineer",
  "React Developer",
  "React.js Developer",
  "React Engineer",
  "Angular Developer",
  "Angular Engineer",
  "Angular.js Developer",
  "Vue Developer",
  "Vue Engineer",
  "Vue.js Developer",
  "Web Developer",
];

function checkForJobTitle(msg: string): string {
  const earlyPartsOfMessage = msg.substring(0, 100);

  //Look for a bunch of potential titles here. Add more to the array if needed.
  return returnNameIfFound(jobTitleTags, earlyPartsOfMessage);
}

function checkForCompanyTitle(msg: string): string {
  const earlyPartsOfMessage = msg.substring(0, 100);

  const earlyWordsOfMessage = earlyPartsOfMessage.split(" ");

  let endIndexOfPossibleCompanyTitle = 0;

  for (let i = 0; i < jobTitleTags.length; i++) {
    const index = earlyWordsOfMessage.indexOf(jobTitleTags[i]);
    if (index > -1) {
      endIndexOfPossibleCompanyTitle = index - 1;
      break;
    }
  }

  //Assume the first words before the title is the company name
  if (earlyPartsOfMessage) {
    return earlyPartsOfMessage.substring(0, endIndexOfPossibleCompanyTitle);
  } else return "";
}

//Return whatever array element is found
function returnNameIfFound(namesToSearchFor: string[], msg: string): string {

  let name = '';

  namesToSearchFor.forEach((value) => {
    if (msg.includes(value)) {
      name = value;
    }
  });

  return name;
}
