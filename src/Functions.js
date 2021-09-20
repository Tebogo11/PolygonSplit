/**
 * This function takes an array of plot points that creatse a polyon and changes the array to a string
 * to be used in the polygon component in App.js
 * @param {Array.<object>} points
 * @returns {string} stringfied array of plot points
 */
export const StringifyPoints = (points) => {
  const plotPoints = points.map((item) => {
    return item.x + " " + item.y;
  });

  return plotPoints.join(",");
};

/**
 * This is a formulor that returns the plot points intersection
 * based on two lines coordinates
 * @param {...num} x1,y1...x4,y4
 * @returns {object} The new created plot point, from where the line interesects
 */
export const formaler = (x1, y1, x2, y2, x3, y3, x4, y4) => {
  const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  const pX =
    ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / d;
  const pY =
    ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / d;
  return { pX, pY };
};
