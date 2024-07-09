export const stripHtml = (html: string): string => {
  return html
    .toString()
    .replace(/\<br\>/g, "\n")
    .replace(/(<([^>]+)>)/gi, "");
};
