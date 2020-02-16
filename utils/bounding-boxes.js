const fs = require('fs')
const jimp = require('jimp');
const borderColor = jimp.cssColorToHex("#10f12b"); 
const labelBackground = jimp.cssColorToHex("#000"); 
const parse = require('csv-parse/lib/sync')
const testLabels = parse ( fs.readFileSync('./data/test-labels.csv') )
const trainLabels = parse ( fs.readFileSync('./data/train-labels.csv') )
const csv = testLabels.concat(trainLabels)

csv.forEach((row, index) => {
  drawBoundingBox(row, index)
})

function makeIteratorThatFillsWithColor(color) {
  return function (x, y, offset) {
    this.bitmap.data.writeUInt32BE(color, offset, true);
  }
};

function convertPoint(dimension, size){
  return Math.floor(dimension * size)
}


function drawBoundingBox([imagePath, width, height, label, xmin, ymin, xmax, ymax], index) {
  xmin = parseInt(xmin)
  ymin = parseInt(ymin)
  xmax = parseInt(xmax)
  ymax = parseInt(ymax)

  jimp.read(`./images/resized/${imagePath}`)
    .then(image => {
      jimp.loadFont(jimp.FONT_SANS_32_WHITE).then(font => {
        const boundingBox = {
          width: xmax - xmin,
          height: ymax - ymin
        }
        return image
        .scan(0, 0, 66, 46, makeIteratorThatFillsWithColor(labelBackground))
        .print(font, 5, 5, label)
        .scan(xmin, ymax, boundingBox.width, 2, makeIteratorThatFillsWithColor(borderColor)) //bottom border
        .scan(xmin, ymin, boundingBox.width, 2, makeIteratorThatFillsWithColor(borderColor)) //top border
        .scan(xmin, ymin, 2, boundingBox.height, makeIteratorThatFillsWithColor(borderColor)) //right border
        .scan(xmax, ymin, 2, boundingBox.height, makeIteratorThatFillsWithColor(borderColor)) //left border
        .write(`./images/bounding-boxes/${imagePath.replace(".jpg", `-${label}.jpg`)}`); // save
      });
      giveStatus(index)
  }).catch(error => {console.log(error.message)})
}

function giveStatus(index){
  const percentage = Math.floor((index/csv.length) * 100)
  if(percentage <= 0) return
  if(index == csv.length - 1) {
    process.stdout.write(`\nDone! I have processed ${csv.length} files\n`);
    return
  }
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`${percentage}%`);
}