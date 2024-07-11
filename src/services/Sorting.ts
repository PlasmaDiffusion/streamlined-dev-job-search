import { JobBoardLink } from "./DataToSave";

export function sortLinksByCategory(links : JobBoardLink[])
{
    links.sort(function(a, b) {
        var textA = a.category.toUpperCase();
        var textB = b.category.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });

    return links;
}