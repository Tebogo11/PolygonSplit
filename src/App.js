import "./App.css";
import { StringifyPoints, formaler } from "./Functions";
import { useState } from "react";
function App() {
  /**
   * Holds plot points of the original polygon
   * @type {Array.<object>}
   */
  const points = [
    { x: 100, y: 100 },
    { x: 200, y: 50 },
    { x: 300, y: 50 },
    { x: 400, y: 200 },
    { x: 350, y: 250 },
    { x: 200, y: 300 },
    { x: 150, y: 300 },
  ];

  //useState variables
  /**
   * Holds the two points that create the line the user drawes.
   * @type {object}
   */
  const [linePoints, setlinePoints] = useState({
    point1: { x: null, y: null },
    point2: { x: null, y: null },
  });

  /**
   * Holds true or false based on if the user is still dragging a line.
   * @type {boolean}
   */
  const [dragging, setDragging] = useState(false);

  /**
   * Holds stringfied array of the first polygons plot points.
   * @type {string}
   */
  const [firstPolygon, setFirstPolygon] = useState("");

  /**
   * Holds stringfied array of the first polygons plot points.
   * @type {string}
   */
  const [secondPolygon, setSecondPolygon] = useState("");

  /**
   * Holds plot points of the original polygon in a stringfied version
   * @type {string}
   */
  const plotPoints = StringifyPoints(points);

  /**
   * This function retrives the current clicked location and when clicked twice it
   * defines the line created by the user.
   * @param {event} evt Event listner
   * @returns {void}
   */
  const getLinePoints = (evt) => {
    //Collecting the x axis value
    var x = evt.pageX;
    //Collecting the y axis value
    var y = evt.pageY;
    //This checks if the first coordinate has being state and if it has it will set the second coordinate
    //which finially creates a line
    if (linePoints.point1.x === null) {
      setlinePoints({ ...linePoints, point1: { x: x, y: y } });
    } else {
      setlinePoints({ ...linePoints, point2: { x: x, y: y } });
    }

    console.log(linePoints.point1);
    console.log(linePoints.point2);
  };

  /**
   * This functions returns the plot points of the new polygons split by
   * the line created by the user
   * @returns {void}
   */
  const loop = () => {
    //This is the point points of the line created by the user
    const x3 = linePoints.point1.x;
    const y3 = linePoints.point1.y;
    const x4 = linePoints.point2.x;
    const y4 = linePoints.point2.y;

    //count to keep track of which plot point we are on
    let count = 1;

    //this counts how many new plot points we have create by checking if they intersect
    //max 2
    let newPlotCount = 0;

    //Array for the first polygon plot points
    const firstPolygon = [];
    //Array for the second polygon plot points
    const secondPolygon = [];

    //ForEach loop to go through each line in the oringinally created shape
    //and checks if the intersect. It then splits the lines that create the oringial shape in to two
    points.forEach((item) => {
      //Plot points of the current line we are checking for intersection
      let x1 = item.x;
      let y1 = item.y;
      let x2 = points[count].x;
      let y2 = points[count].y;

      //This functions returns a new plot point and stores it in a varible
      const cor = formaler(x1, y1, x2, y2, x3, y3, x4, y4);

      //This if operation checks weather the polygon count has being set to one
      //if it has has being, it stores the current plot point in to the first polygon array
      if (newPlotCount === 1) {
        firstPolygon.push(item);
      } // else it stores the values in the second polygon array if its below or over 1
      else {
        secondPolygon.push(item);
      }

      //This if functions checks weather the new plot point intersects with the current line of the shape
      //iF it does it stores the value in the first polygon array then the second polygon array,
      //then raises the plot count by 1, so the foreach loop know weather to store data in the first polygon array
      //or second polygon array.
      if ((x1 < cor.pX && cor.pX < x2) || (y1 < cor.pY && cor.pY < y2)) {
        newPlotCount++;
        firstPolygon.push({ x: cor.pX, y: cor.pY });
        secondPolygon.push({ x: cor.pX, y: cor.pY });
      } else if ((x2 < cor.pX && cor.pX < x1) || (y2 < cor.pY && cor.pY < y1)) {
        newPlotCount++;
        firstPolygon.push({ x: cor.pX, y: cor.pY });
        secondPolygon.push({ x: cor.pX, y: cor.pY });
      }
      //First polygon: This is created by the first new plot being called and stored and all
      //the values that follow, before the second new plot point is called making the second new plot called, the end plot point of the shape

      //Second polygon: This is create by storing all the plot points called before the plot count changes to 1.
      //then it stores the first new plot coordinate, then waits until the second new plot point is called before storing plots again.

      //This increase the count by 1 every iteration of the loop
      count++;

      //If the count has reached max value it means we have reached the last plot point and need to measusre the line
      //thats connected by the first plot point and the last plot point. Thats why count is set to 0 to represent the last plot point
      if (count === 7) {
        count = 0;
      }
    });

    //Set the first polygon values as a string
    setFirstPolygon(StringifyPoints(firstPolygon));
    //Set the second polygon values as a string
    setSecondPolygon(StringifyPoints(secondPolygon));
    //reset the line created by the user to null
    setlinePoints({
      ...linePoints,
      point1: { x: null, y: null },
      point2: { x: null, y: null },
    });
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <svg
        style={{
          width: 500,
          height: 500,
          borderWidth: 2,
          border: "solid",
        }}
        onMouseDown={(event) => {
          setDragging(true);
          getLinePoints(event);
        }}
        onMouseMove={(event) => (dragging ? getLinePoints(event) : null)}
        onMouseUp={() => {
          setDragging(false);
          loop();
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g width={500} height={500} fill="white" stroke="green" strokeWidth="1">
          {!firstPolygon.length && !secondPolygon.length && (
            <polygon
              points={plotPoints}
              fill="none"
              stroke="black"
              className="polygon"
            />
          )}
          {firstPolygon && (
            <polygon
              points={firstPolygon}
              fill="none"
              stroke="green"
              className="polygon"
            />
          )}
          {secondPolygon && (
            <polygon
              points={secondPolygon}
              fill="none"
              stroke="blue"
              className="polygon"
            />
          )}
          {linePoints.point1.x && linePoints.point2.x && (
            <line
              x1={linePoints.point1.x}
              y1={linePoints.point1.y}
              x2={linePoints.point2.x}
              y2={linePoints.point2.y}
              stroke="red"
              width="100%"
              height="100%"
            />
          )}
        </g>
      </svg>
      <h2 style={{ marginBottom: -15 }}>Split the polygon in half </h2>
      <h4>
        Click and hold then drag to create your line then release click when
        your satisfied
      </h4>
    </div>
  );
}

export default App;
