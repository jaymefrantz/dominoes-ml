const parse = require('csv-parse/lib/sync')
const fs = require('fs')
let labels = {}
labels.test = parse (fs.readFileSync('./data/test-labels.csv'))
labels.train = parse (fs.readFileSync('./data/train-labels.csv'))
const sampleLabels = ["5_9", "7_8", "1_3"]
createLabelFiles("test")
createLabelFiles("train")


function createLabelFiles(category) {
  let array = []
  labels[category].map((row, index) => {
    const label = row[3]
    if(sampleLabels.includes(row[3])) array.push(row)

      if(index === labels[category].length - 1) {
        fs.writeFileSync(`./data/sample-${category}-labels.csv`, array.join("\n"))
      } 
  })
}