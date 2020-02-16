const parse = require('csv-parse/lib/sync')
const fs = require('fs')
const stringify = require('csv-stringify/lib/sync')
const csv = parse ( fs.readFileSync('./data/google-bounding-boxes.csv') )
const imageDimensions = JSON.parse(fs.readFileSync('./data/image-dimensions.json'))
let output = []

csv.forEach ( (row, index) => {
  const fileName = `${row[1].replace(/-\d\d\d\d-\d*-\d*T\d*:\d*:(\d|Z|\.)*?.jpg/,'').replace('gs://dominoes/','')}.jpg`
  const {undefined, width, height} = imageDimensions.find(image => image.fileName == fileName)
  let label = row[2]
  let xmin = convertPoint(row[3], width)
  let ymin = convertPoint(row[4], height)
  let xmax = convertPoint(row[7], width)
  let ymax = convertPoint(row[8], height)

  output.push([
      fileName, 
      width,
      height,
      label,
      xmin,
      ymin,
      xmax,
      ymax
  ])
  
  if(index === csv.length - 1) fs.writeFileSync('./data/bounding-boxes.json', JSON.stringify(output, null, 2))
})

function convertPoint(dimension, size){
  return Math.floor(dimension * size)
}


