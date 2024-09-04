import { JobBoardLink } from "../Interfaces";

export function sortLinksByCategory(links: JobBoardLink[]) {
  links.sort(function (a, b) {
    var textA = a.category.toUpperCase();
    var textB = b.category.toUpperCase();
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });

  return sortLinksByTotalClicksInCategory(links);
}

interface CategoryToSort {
  category: string;
  clicks: number;
}

function sortLinksByTotalClicksInCategory(links: JobBoardLink[]) {
  //Tally up the links in categories
  const clicksInCategories: CategoryToSort[] = [];

  links.forEach((link) => {
    const indexOfExistingCategory = clicksInCategories.findIndex(
      (linkObj) => linkObj.category === link.category
    );
    if (indexOfExistingCategory !== -1) {
      clicksInCategories[indexOfExistingCategory].clicks += link.timesClicked;
    } else {
      clicksInCategories.push({
        category: link.category,
        clicks: link.timesClicked,
      });
    }
  });

  //Sort categories by number of clicks, with the highest showing up first
  clicksInCategories.sort((a, b) => {
    return a.clicks > b.clicks ? -1 : a.clicks < b.clicks ? 1 : 0;
  });

  //Now make a new link array with the better categories showing up first.
  const categoryAndClickSortedArray: JobBoardLink[] = [];

  clicksInCategories.forEach((clickedCategoryObj) => {
    links.forEach((link) => {
      if (
        link.category === clickedCategoryObj.category &&
        !categoryAndClickSortedArray.includes(link)
      ) {
        categoryAndClickSortedArray.push(link);
      }
    });
  });

  return categoryAndClickSortedArray;
}
