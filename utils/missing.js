const fs = require('fs')
const parse = require('csv-parse/lib/sync')
const testLabels = parse ( fs.readFileSync('./data/test-labels.csv') )
const trainLabels = parse ( fs.readFileSync('./data/train-labels.csv') )
const csv = testLabels.concat(trainLabels)

fileNames = [...new Set(csv.map(row => row[0]))];

const missing = fileNames.filter(file => {
  if(!fs.existsSync(`./images/resized/${file}`)) return file
  //fs.renameSync(`./images/original/${file}.jpg`, `./images/realDeal/${file}.jpg`)
});

if(missing.length > 0) {
  console.log("writting missing...")
  fs.writeFileSync("./data/missing.txt", missing.join("\n"))
}