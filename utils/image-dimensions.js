const fs = require('fs')
const jimp = require('jimp')
const dimensions = []

const images = fs.readdirSync('images/resized')

images.map((fileName, index) => {
  jimp.read(`images/resized/${fileName}`).then(image => {
    dimensions.push(
      {
        fileName: fileName,
        width: image.bitmap.width,
        height: image.bitmap.height
      }
    )

    giveStatus(index)
    if(index == images.length - 1){
      fs.writeFileSync('./data/image-dimensions.json', JSON.stringify(dimensions, null, 2))
    } 
  }).catch(error => error.message)
})

function giveStatus(index){
  const percentage = Math.floor((index/images.length) * 100)
  if(percentage <= 0) return
  if(index == images.length - 1) {
    process.stdout.write(`\nDone! I have processed ${images.length} files\n`);
    return
  }
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`${percentage}%`);
}