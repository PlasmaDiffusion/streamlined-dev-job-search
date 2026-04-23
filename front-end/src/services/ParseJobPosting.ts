export function parseJobPostingTags(msg: string): string {
  return checkForTags(msg);
}

function checkForTags(msg: string) {
  let tags: string[] = [];

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

  const allTags = tags.concat(
    checkForSpecificFrameworksOrLanguages(msg, [
      "React",
      "NextJS || Next.JS",
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
      "WordPress",
      "D3.js",
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
