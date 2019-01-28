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
  layerStyles.forEach((style, i) => {

    let styleName = style.name
    let splittedName
    let fills = style.style.fills

    // Iterate over fills of styles and find the enabled ones
    fills.forEach((fill, i) => {
      if (fill.enabled === true) {
        if (fill.type == 'Fill') {

        let color = fill.color

        // parse name 
        styleName = styleName.toLowerCase()
        styleName = styleName.split("/")
        splittedName = styleName
        styleName = styleName.length > 1 ? styleName[styleName.length - 1] : styleName

        splittedName.length > 1 && splittedName.pop()
        splittedName = splittedName.join("/")

        let obj = {}
            obj = {
              path: splittedName,
              name: styleName,
              color
            }

        return colors.push(obj), styleName, splittedName
        }
      }
    })
  })

  colors.forEach((d, i) => {
    
    let string = `// ${d.path}\n$${d.name}: ${d.color};\n`
    
    return ColorArray.push(string)
  })

  
  ColorArray.sort()
  ColorArray = ColorArray.toString()
  ColorArray = ColorArray.split(",")
  
  colors.forEach((d, i) => {
    if (ColorArray[i].includes(`// ${d.path}`)) {
      return ColorArray[i].replace(`// ${d.path}`, 'lol')
    }
  })

  ColorArray = ColorArray.join("\n")
  
  let fileContent = ColorArray

  fs.writeFileSync("/Users/marvinbruns/Desktop/fills.scss", fileContent)

  sketch.UI.message("generated scss file. Take a look at your desktop.")
}

function uniq(a) {
  let seen = {}
  return a.filter(function (item) {
    seen.hasOwnProperty(item) ? false : (seen[item] = true)
  })
}