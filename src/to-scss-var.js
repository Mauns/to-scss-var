import sketch from 'sketch'

const fs = require('@skpm/fs')

// documentation: https://developer.sketchapp.com/reference/api/

export default function() {  

  const Document = require('sketch/dom').Document
  let   document = Document.getSelectedDocument()
  let   page = document.selectedPage
  let   selection = document.selectedLayers
  let   layerStyles = document.getSharedLayerStyles()

  let   colors = []
  let   ColorArray = []
  let   NameList = []

  // Iterate over Layerstyles
  layerStyles.forEach((style, i, arr) => {

    let styleName = style.name
    let splittedName
    let fills = style.style.fills

    // parse name 
    styleName = styleName.toLowerCase()
    styleName = styleName.split("/")
    splittedName = styleName
    styleName = styleName.length > 1 ? styleName[styleName.length - 1] : styleName

    splittedName.length > 1 && splittedName.pop()
    splittedName = splittedName.join("/")

    // Iterate over fills of styles and find the enabled ones
    fills.forEach((fill, i) => {
      if (fill.enabled === true) {
        if (fill.type == 'Fill') {

        let color = fill.color

        let obj = {}
            obj = {
              key: splittedName,
              name: styleName,
              color
            }

        return colors.push(obj), styleName, splittedName
        }
      }
    })
  })

  colors.forEach((d, i, arr) => {
    
    let string = `// ${d.key}\n$${d.name}: ${d.color};\n`

    return ColorArray.push(string)
  })

  ColorArray.sort()
  ColorArray = ColorArray.toString()
  ColorArray = ColorArray.split(",")
  ColorArray = ColorArray.join("\n")
  
  let fileContent = ColorArray

  try {
    fs.writeFileSync("/Users/marvinbruns/Desktop/fills.scss", fileContent)
    sketch.UI.message("👍 Generated scss file. Saved as „fills.scss“ on your desktop.")
  } catch (err) {
    sketch.UI.message(`👎 ${err}`)  
  }

}