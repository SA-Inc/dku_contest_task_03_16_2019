'use strict';

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
let innerPoints = [];
let innerPointCenter = null;

// Points with minimal and maximal X and Y.
let minimalPoint = null;
let maximalPoint = null;
let strangePoint = null;



const getRandomPoint = (xMin = 0, xMax = 800, yMin = 0, yMax = 600) => {
   const x = Math.floor(Math.random() * (Math.floor(xMax) - Math.ceil(xMin) + 1)) + Math.ceil(xMin);
   const y = Math.floor(Math.random() * (Math.floor(yMax) - Math.ceil(yMin) + 1)) + Math.ceil(yMin);

   return {x, y};
};

const getMinIdx = (points) => {
   let minPointDist = Number.MAX_SAFE_INTEGER;
   let minPointIdx = null;

   for (let i = 0; i < points.length; i++) {
      let distance = Math.sqrt(Math.pow(points[i].x, 2) + Math.pow(points[i].y, 2));

      if (distance < minPointDist) {
         minPointDist = distance;
         minPointIdx = points[i].id;
      }
   }

   return minPointIdx;
};

const getMaxIdx = (points) => {
   let maxPointDist = Number.MIN_SAFE_INTEGER;
   let maxPointIdx = null;

   for (let i = 0; i < points.length; i++) {
      let distance = Math.sqrt((points[i].x ** 2) + (points[i].y ** 2));

      if (distance > maxPointDist) {
         maxPointDist = distance;
         maxPointIdx = points[i].id;
      }
   }

   return maxPointIdx;
};

const getStrangePoint = (points) => {
   let minAngle = Number.MAX_SAFE_INTEGER;
   let maxRadius = Number.MIN_SAFE_INTEGER;
   let minAngleIdx = null;
   let maxRadiusIdx = null;

   let strangePointIdx = null;

   for (let i = 0; i < points.length; i++) {
      let angle = Math.atan2(points[i].y - 0, points[i].x - 0) * 180 / Math.PI;
      let radius = Math.sqrt((points[i].x ** 2) + (points[i].y ** 2));

      if (angle < minAngle && radius > maxRadius) {
         minAngle = angle;
         // minAngleIdx = points[i].id;
         maxRadius = radius;
         strangePointIdx = points[i].id;
      }



      // if (angle < minAngle) {
      //    minAngle = angle;
      //    minAngleIdx = points[i].id;
      // }

      // if (radius > maxRadius) {
      //    maxRadius = radius;
      //    maxRadiusIdx = points[i].id;
      // }
   }

   // return {minAngleIdx, maxRadiusIdx};
   return strangePointIdx;
};

const drawTriangle = (points, minimalPoint, maximalPoint, strangePoint) => {
   let lineBetweenMinimalPointAndMaximalPoint = null;
   let lineBetweenMinimalPointAndStrangePoint = null;
   let lineBetweenMaximalPointAndStrangePoint = null;

   for (let i = 0; i < 3; i++) {
      switch (i) {
         case 0: {
            lineBetweenMinimalPointAndMaximalPoint = {x1: points[minimalPoint].x, y1: points[minimalPoint].y, x2: points[maximalPoint].x, y2: points[maximalPoint].y};
            line(lineBetweenMinimalPointAndMaximalPoint.x1, lineBetweenMinimalPointAndMaximalPoint.y1, lineBetweenMinimalPointAndMaximalPoint.x2, lineBetweenMinimalPointAndMaximalPoint.y2);
            break;
         }
         case 1: {
            lineBetweenMinimalPointAndStrangePoint = {x1: points[minimalPoint].x, y1: points[minimalPoint].y, x2: points[strangePoint].x, y2: points[strangePoint].y};
            line(lineBetweenMinimalPointAndStrangePoint.x1, lineBetweenMinimalPointAndStrangePoint.y1, lineBetweenMinimalPointAndStrangePoint.x2, lineBetweenMinimalPointAndStrangePoint.y2);
            break;
         }
         case 2: {
            lineBetweenMaximalPointAndStrangePoint = {x1: points[maximalPoint].x, y1: points[maximalPoint].y, x2: points[strangePoint].x, y2: points[strangePoint].y};
            line(lineBetweenMaximalPointAndStrangePoint.x1, lineBetweenMaximalPointAndStrangePoint.y1, lineBetweenMaximalPointAndStrangePoint.x2, lineBetweenMaximalPointAndStrangePoint.y2);
            break;
         }
      }
   }

   return {lineBetweenMinimalPointAndMaximalPoint, lineBetweenMinimalPointAndStrangePoint, lineBetweenMaximalPointAndStrangePoint};
}

const getPointsInTriangle = (lineBetweenMinimalPointAndMaximalPoint, lineBetweenMinimalPointAndStrangePoint, lineBetweenMaximalPointAndStrangePoint, point) => {
   let point1 = ((((lineBetweenMinimalPointAndMaximalPoint.y2 - lineBetweenMinimalPointAndMaximalPoint.y1) * point.x) - ((lineBetweenMinimalPointAndMaximalPoint.x2 - lineBetweenMinimalPointAndMaximalPoint.x1) * point.y) + lineBetweenMinimalPointAndMaximalPoint.x2 * lineBetweenMinimalPointAndMaximalPoint.y1 - lineBetweenMinimalPointAndMaximalPoint.y2 * lineBetweenMinimalPointAndMaximalPoint.x1) / Math.sqrt(((lineBetweenMinimalPointAndMaximalPoint.y2 - lineBetweenMinimalPointAndMaximalPoint.y1) ** 2) + ((lineBetweenMinimalPointAndMaximalPoint.x2 - lineBetweenMinimalPointAndMaximalPoint.x1) ** 2))) > 0 ? true : false;
   let point2 = ((((lineBetweenMinimalPointAndStrangePoint.y2 - lineBetweenMinimalPointAndStrangePoint.y1) * point.x) - ((lineBetweenMinimalPointAndStrangePoint.x2 - lineBetweenMinimalPointAndStrangePoint.x1) * point.y) + lineBetweenMinimalPointAndStrangePoint.x2 * lineBetweenMinimalPointAndStrangePoint.y1 - lineBetweenMinimalPointAndStrangePoint.y2 * lineBetweenMinimalPointAndStrangePoint.x1) / Math.sqrt(((lineBetweenMinimalPointAndStrangePoint.y2 - lineBetweenMinimalPointAndStrangePoint.y1) ** 2) + ((lineBetweenMinimalPointAndStrangePoint.x2 - lineBetweenMinimalPointAndStrangePoint.x1) ** 2))) < 0 ? true : false;
   let point3 = ((((lineBetweenMaximalPointAndStrangePoint.y2 - lineBetweenMaximalPointAndStrangePoint.y1) * point.x) - ((lineBetweenMaximalPointAndStrangePoint.x2 - lineBetweenMaximalPointAndStrangePoint.x1) * point.y) + lineBetweenMaximalPointAndStrangePoint.x2 * lineBetweenMaximalPointAndStrangePoint.y1 - lineBetweenMaximalPointAndStrangePoint.y2 * lineBetweenMaximalPointAndStrangePoint.x1) / Math.sqrt(((lineBetweenMaximalPointAndStrangePoint.y2 - lineBetweenMaximalPointAndStrangePoint.y1) ** 2) + ((lineBetweenMaximalPointAndStrangePoint.x2 - lineBetweenMaximalPointAndStrangePoint.x1) ** 2))) > 0 ? true : false;

   if (point1 && point2 && point3) {
      return point.id;
   }
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



function setup() {
	const canvas = createCanvas(800, 600);
   background(black);

   // Random 40 Points.
   for (let i = 0; i < pointsCount; i++) {
      let currentPoint = getRandomPoint();

      points[i] = {id: i, x: currentPoint.x, y: currentPoint.y};

      strokeWeight(12);
      stroke(grey);
      point(points[i].x, points[i].y);
   }

   stroke(red);
   minimalPoint = getMinIdx(points);
   point(points[minimalPoint].x, points[minimalPoint].y);

   stroke(green);
   maximalPoint = getMaxIdx(points);
   point(points[maximalPoint].x, points[maximalPoint].y);

   stroke(blue);
   strangePoint = getStrangePoint(points);
   point(points[strangePoint].x, points[strangePoint].y);

   strokeWeight(2);
   stroke(yellow);
   let {lineBetweenMinimalPointAndMaximalPoint, lineBetweenMinimalPointAndStrangePoint, lineBetweenMaximalPointAndStrangePoint} = drawTriangle(points, minimalPoint, maximalPoint, strangePoint);

   strokeWeight(12);
   stroke(orange);
   for (let i = 0; i < points.length; i++) {
      let innerPoint = getPointsInTriangle(lineBetweenMinimalPointAndMaximalPoint, lineBetweenMinimalPointAndStrangePoint, lineBetweenMaximalPointAndStrangePoint, points[i]);
      
      if (innerPoint !== undefined) {
         point(points[innerPoint].x, points[innerPoint].y);
         innerPoints.push({id: i, x: points[innerPoint].x, y: points[innerPoint].y});
      }
   }

   innerPointCenter = getPointsCenter(innerPoints);
   stroke(purple);
   point(innerPointCenter.x, innerPointCenter.y);
}