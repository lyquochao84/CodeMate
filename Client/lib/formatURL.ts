// Utility function to convert URL param to database format
export const formatURL = (list: string): string => {
  return list
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    // .replace(/'/g, "");
};
