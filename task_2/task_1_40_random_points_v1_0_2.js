'use strict';

// Задание #2
// 1. Сгенерировать 40 точек с координатами х и у. 
// 2. Найти координаты с максимальным и с минимальным у. 
// 3. Провести через них прямую.
// 4. Отметить точки справа и слева от прямой (Право и лево определяете сами). Найти центр точек.

// 1. Соединять все точки самыми минимальными расстояниями. Можно заходить в одну точку много раз (Аналогия с соединением городов) 
// 2. Соединить все точки минимальными расстояниями, не заходя в одну точку более одного раза.
// Задачи под номером 2 сопроводить картиночками.

// Colors.
const red = '#F07D71';
const orange = '#F5BD67';
const yellow = '#FBE772';
const green = '#99FC8B';
const blue = '#67A3F9';
const purple = '#CC89F9';
const grey = '#B5B5B8';
const black = '#454346';

// Random Points.
let pointsCount = 40;
let points = [];
let leftPoints = [];
let rightPoints = [];

// Y.
let minPointY = null;
let maxPointY = null;
let lineBetweenMinAndMaxY = null;

// Centers.
let rightPointsCenter = null;
let leftPointsCenter = null;



const getRandomPoint = (xMin = 0, xMax = 1000, yMin = 0, yMax = 1000) => {
   const x = Math.floor(Math.random() * (Math.floor(xMax) - Math.ceil(xMin) + 1)) + Math.ceil(xMin);
   const y = Math.floor(Math.random() * (Math.floor(yMax) - Math.ceil(yMin) + 1)) + Math.ceil(yMin);

   return {x, y};
};

// Return the ids of Points.
const getMinIdxY = (points) => points.reduce((acc, cur) => acc.y < cur.y ? acc : cur).id;
const getMaxIdxY = (points) => points.reduce((acc, cur) => acc.y > cur.y ? acc : cur).id;

// I have not any Idea, how to do It now =).
// const drawLineThroughPoints = (lineBetweenPoints) => {
//    const {x1, y1, x2, y2} = lineBetweenPoints;

//    let distance = Math.ceil(Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)));
//    let angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
//    let xShift = distance - Math.abs(x2 - x1);
//    let yShift = Math.abs(y1 - y2) / 2;

//    console.log(distance, angle, xShift, yShift);
// };

const pointClassification = (lineBetweenMinAndMaxY, currentPoint) => {
   const x0 = currentPoint.x, y0 = currentPoint.y;
   const x1 = lineBetweenMinAndMaxY.x1, y1 = lineBetweenMinAndMaxY.y1;
   const x2 = lineBetweenMinAndMaxY.x2, y2 = lineBetweenMinAndMaxY.y2;

   // The Formula of 'Distance between Point and Line'. In original was Abs (Absolute Value of a Number) in Numerator (above).
   return ((((y2 -y1) * x0) - ((x2 - x1) * y0) + x2 * y1 - y2 * x1) / Math.sqrt(((y2 - y1) ** 2) + ((x2 - x1) ** 2))) > 0 ? true : false;
};

const getPointsCenter = (points) => {
   let center = {x: 0, y: 0};

   for(let i = 0; i < points.length; i++) {
      center.x += points[i].x;
      center.y += points[i].y;
   }

   center.x /= points.length;
   center.y /= points.length;

   return center;
};

const drawMinimumSpanningTree = (vertices) => {
   // Prim's Algorithm.

   let reached = [];
   let unreached = [...vertices];

   // Set Initial Node.
   reached.push(unreached[0]);
   unreached.splice(0, 1);

   // Loop until there are unreached Nodes.
   while (unreached.length > 0) {
      let record = Number.MAX_SAFE_INTEGER;
      let reachedIndex;
      let unreachedIndex;

      for (let i = 0; i < reached.length; i++) {
         for (let j = 0; j < unreached.length; j++) {
            // Search two Nodes with minimal Distance.
            let node1 = reached[i];
            let node2 = unreached[j];

            let distance = dist(node1.x, node1.y, node2.x, node2.y);

            if (distance < record) {
               record = distance;
               reachedIndex = i;
               unreachedIndex = j;
            }
         }
      }

      line(reached[reachedIndex].x, reached[reachedIndex].y, unreached[unreachedIndex].x, unreached[unreachedIndex].y);

      reached.push(unreached[unreachedIndex]);
      unreached.splice(unreachedIndex, 1);
   }
};



function setup() {
   const canvas = createCanvas(1000, 1000);
   background(black);

   // Random 40 Points.
   for (let i = 0; i < pointsCount; i++) {
      let currentPoint = getRandomPoint();

      points[i] = {id: i, x: currentPoint.x, y: currentPoint.y};

      strokeWeight(12);
      stroke(grey);
      point(points[i].x, points[i].y);
   }

   // Get Min and Max Points by Y.
   minPointY = getMinIdxY(points);
   maxPointY = getMaxIdxY(points);
   lineBetweenMinAndMaxY = {x1: points[minPointY].x, y1: points[minPointY].y, x2: points[maxPointY].x, y2: points[maxPointY].y};

   // Draw the two Points and Line between them.
   stroke(red);
   point(points[minPointY].x, points[minPointY].y);
   point(points[maxPointY].x, points[maxPointY].y);

   strokeWeight(2);
   stroke(green);
   line(lineBetweenMinAndMaxY.x1, lineBetweenMinAndMaxY.y1, lineBetweenMinAndMaxY.x2, lineBetweenMinAndMaxY.y2);

   // Divide the Points by the Line.
   strokeWeight(12);

   // Case 1 - Ignore Min and Max Points.
   // Case 2 - The Distance is positive.
   // Case 3 - The Distance is negative.
   for (let i = 0; i < pointsCount; i++) {
      if (points[i].id === minPointY || points[i].id === maxPointY) {
         continue;
      } else if (pointClassification(lineBetweenMinAndMaxY, points[i])) {
         stroke(yellow);
         point(points[i].x, points[i].y);
         rightPoints.push({id: i, x: points[i].x, y: points[i].y});
      } else {
         stroke(blue);
         point(points[i].x, points[i].y);
         leftPoints.push({id: i, x: points[i].x, y: points[i].y});
      }
   }

   // Get and Draw the Center Point of the each Side.
   leftPointsCenter = getPointsCenter(leftPoints);
   stroke(orange);
   point(leftPointsCenter.x, leftPointsCenter.y);

   rightPointsCenter = getPointsCenter(rightPoints);
   stroke(purple);
   point(rightPointsCenter.x, rightPointsCenter.y);

   // Draw the Minimum Ppanning Tree.
   leftPoints.push(leftPointsCenter);
   rightPoints.push(rightPointsCenter);

   strokeWeight(2);
   stroke(grey);
   drawMinimumSpanningTree(leftPoints);
   drawMinimumSpanningTree(rightPoints);
}
