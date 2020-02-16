const parse = require('csv-parse/lib/sync')
const fs = require('fs')
const stringify = require('csv-stringify/lib/sync')
const csv = parse ( fs.readFileSync('./data/bounding-boxes.json') )
let output = []

labels = getAllLabels()

labels.map(label => {
  const matches = csv.filter(row => {
    const [,,,rowLabel] = row
    return label == rowLabel
  })

  output.push({label: label, matches: matches.length})
})


//this is ordering from most to fewest
console.log(output.sort((a, b) => b.matches - a.matches))
console.log("\n\n")
console.log(output.sort((a, b) => a.matches - b.matches).slice(0, 6).map(item => item.label).join(", "))



function getAllLabels(){
  const array = []

  for(let firstNumber = 0; firstNumber <= 9; firstNumber++){
      for(let secondNumber = firstNumber; secondNumber <= 9; secondNumber++){
          array.push(`${firstNumber}_${secondNumber}`)
      }
  }

  return array;
}

