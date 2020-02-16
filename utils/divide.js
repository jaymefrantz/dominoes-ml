const parse = require('csv-parse/lib/sync')
const fs = require('fs')
const stringify = require('csv-stringify/lib/sync')
const csv = JSON.parse(fs.readFileSync('./data/bounding-boxes.json'))
let labels = getAllLabels()
let trainingLabels = []
let testingLabels = []

labels.map((label, index) => {
  const matches = shuffle(csv.filter(row => {
    const [,,,rowLabel] = row
    return label == rowLabel
  }))

  const testing = matches.splice(0, Math.floor(0.2 * matches.length))
  trainingLabels.push(matches.join("\n"))
  testingLabels.push(testing.join("\n"))

  if(index === labels.length - 1) {
    fs.writeFileSync('./data/train-labels.csv', trainingLabels.join("\n"))
    fs.writeFileSync('./data/test-labels.csv', testingLabels.join("\n"))
  } 
})


function getAllLabels(){
  const array = []

  for(let firstNumber = 0; firstNumber <= 9; firstNumber++){
      for(let secondNumber = firstNumber; secondNumber <= 9; secondNumber++){
          array.push(`${firstNumber}_${secondNumber}`)
      }
  }

  return array;
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
