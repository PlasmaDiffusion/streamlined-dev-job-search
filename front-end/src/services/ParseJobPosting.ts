export function parseJobPosting(msg: string) {
  const possibleTitle = checkForJobTitle(msg);
  const possibleCompany = checkForCompanyTitle(msg, possibleTitle);
  const possibleTags = checkForTags(msg);

  return {
    possibleTitle,
    possibleCompany,
    possibleTags,
  };
}

const jobTitleTags = [
  "Software Developer",
  "Software Engineer",
  "Frontend Developer",
  "Front End Developer",
  "Front-End Developer",
  "Frontend Engineer",
  "Front End Engineer",
  "Front-End Engineer",
  "Backend Developer",
  "Back End Developer",
  "Back-End Developer",
  "Backend Engineer",
  "Back End Engineer",
  "Back-End Engineer",
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
  "Javascript Developer"
];

function checkForJobTitle(msg: string): string {
  const earlyPartsOfMessage = msg.substring(0, 100);

  //Look for a bunch of potential titles here. Add more to the array if needed.
  return returnNameIfFound(jobTitleTags, earlyPartsOfMessage);
}

function checkForCompanyTitle(msg: string, jobTitleToIgnore: string): string {
  const earlyPartsOfMessage = msg.substring(0, 50);

  const earlyWordsOfMessageMinusTitle =
    earlyPartsOfMessage.split(jobTitleToIgnore);

  const potentialCompanyTitle = earlyWordsOfMessageMinusTitle
    .toString()
    .replaceAll(",", " ");

  // for (let i = 0; i < jobTitleTags.length; i++) {
  //   const index = earlyWordsOfMessage.indexOf(jobTitleTags[i]);
  //   if (index > -1) {
  //     endIndexOfPossibleCompanyTitle = index - 1;
  //     break;
  //   }
  // }

  //Assume the first words before the title is the company name
  if (jobTitleToIgnore && potentialCompanyTitle) {
    return potentialCompanyTitle;
  } else return earlyPartsOfMessage;
}

//Return whatever array element is found
function returnNameIfFound(namesToSearchFor: string[], msg: string): string {
  let name = "";

  namesToSearchFor.forEach((value) => {
    if (msg.includes(value)) {
      name = value;
    }
  });

  return name;
}

function checkForTags(msg: string) {
  let tags: string[] = [];

  //Front End / Back End / Full Stack / etc.
  if (msg.includes("Frontend") || msg.includes("Front End")) {
    tags.push("Front End");
  }
  if (msg.includes("Backend") || msg.includes("Back End")) {
    tags.push("Back End");
  }
  if (msg.includes("Fullstack") || msg.includes("Full Stack")) {
    tags.push("Full Stack");
  }
  if (
    msg.includes("Mobile") ||
    msg.includes("Android") ||
    msg.includes("iOS")
  ) {
    tags.push("Mobile");
  }
  if (msg.includes("Embedded")) {
    tags.push("Embedded Systems");
  }

  //Seniority Level
  if (
    (msg.includes("Intern") || msg.includes("Internship")) &&
    !msg.includes("Internal")
  ) {
    tags.push("Intern");
  }

  if (
    (msg.includes("Jr") ||
      msg.includes("Junior") ||
      msg.includes("Entry Level") ||
      msg.includes("Entry-Level")) &&
    !msg.includes("mentor")
  ) {
    tags.push("Junior");
  }

  if (
    msg.includes("Mid Level") ||
    msg.includes("Mid-Level") ||
    msg.includes("Intermediate")
  ) {
    tags.push("Mid Level");
  }
  //Work location
  if (msg.includes("Remote") && !msg.includes("Hybrid")) {
    tags.push("Remote");
  } else if (msg.includes("Hybrid")) {
    tags.push("Hybrid");
  } else if (
    msg.includes("On Site") ||
    msg.includes("Onsite") ||
    msg.includes("On-Site")
  ) {
    tags.push("On Site");
  }

  //Frameworks
  const allTags = tags.concat(
    checkForSpecificFrameworksOrLanguages(msg, [
      "React",
      "NextJS || Next.JS", //The or can be used here to return only one of the two tags
      "Angular",
      "Vue",
      "Node.JS || Express",
      "Bootstrap",
      "Tailwind",
      "MongoDB",
      "Ruby",
      "Typescript",
      "Python",
      "C# || .NET",
      "Java ", //Try a space to prevent "Javascript" from being detected
      "Jest",
      "React Testing Library",
      "Docker",
      "Apollo",
      "GraphQL",
      "WordPress"
    ])
  );

  return allTags.toString();
}

function checkForSpecificFrameworksOrLanguages(
  msg: string,
  frameworks: string[]
) {
  let tagsToAdd: string[] = [];

  frameworks.forEach((framework) => {
    const keywordsToCheck = framework.split(" || ");
    const keywordToCheck = keywordsToCheck[0];
    const altKeywordToCheck =
      keywordsToCheck.length > 1 ? keywordsToCheck[1] : undefined;

    if (keywordToCheck && msg.includes(keywordToCheck))
      tagsToAdd.push(keywordToCheck);
    else if (altKeywordToCheck && msg.includes(altKeywordToCheck))
      tagsToAdd.push(keywordToCheck);
  });

  return tagsToAdd;
}
