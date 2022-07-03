exports.erbTagSwitcher = async function(editor) {
  if (nova.inDevMode()) {
    console.log("———— ERB TAG SWITCHER ————")
  }

  let selectedRanges = editor.selectedRanges
  const originalSelection = selectedRanges

  const brackets = [
    ["<%= ", " %>"],
    ["<% ", " %>"],
    ["<%# ", " %>"],
  ]

  var last_tag_repacement
  var bracketsToUseIndex = 0
  var bracketsToUse = []
  var hasSelection = []
  var entireLineRanges = []
  var linePositions = []

  // Selects the whole line for all "empty" ranges (ranges without selection, only a cursor position)
  // selectedRanges = selectedRanges.map((r) =>
  //   // r.empty ? editor.getLineRangeForRange(r) : r
  // )

  selectedRanges = selectedRanges.map(function (r, index) {
    if (r.empty) {
      hasSelection[index] = false
      entireLineRanges[index] = editor.getLineRangeForRange(r)
      if (entireLineRanges) {
        selectedRanges.map(function (r, index) {
          linePositions[index] = r.start - entireLineRanges[index].start
        })
      }
    } else {
      hasSelection[index] = true
    }
    return r
  })

  if (nova.inDevMode()) {
    console.log("(ERB TAG) hasSelection:", hasSelection)
    console.log("(ERB TAG) selectedRanges:", selectedRanges)
    console.log("(ERB TAG) entireLineRanges:", entireLineRanges)
    console.log("(ERB TAG) linePositions:", linePositions)
  }

  const lengths = selectedRanges.map((r) => r.length)
  let newSelection = []
  await editor.edit(function (e) {
    for (const [index, range] of selectedRanges.entries()) {
      var existingBrackets = []
      var cursorMove = 0
      // const beforeCursorRange = new Range(entireLineRanges[index].start, entireLineRanges[index].start + linePositions[index])
      const beforeCursorRange = new Range(0, selectedRanges[index].start)
      const textBeforeCursor = editor.getTextInRange(beforeCursorRange)
      const text = editor.getTextInRange(range)

      if (nova.inDevMode()) {
        console.log("(ERB TAG) beforeCursorRange:", beforeCursorRange)
        console.log("(ERB TAG) selected text:", text)
        console.log("(ERB TAG) selected text length:", text.length)
      }

      const openingTagsToTheLeft = textBeforeCursor.match(/<%.?/g) || []
      const openingTagsToTheLeftCount = openingTagsToTheLeft.length
      const lastOpeningTagBeforeCursor = openingTagsToTheLeft.pop()
      const closingTagsToTheLeftCount = (textBeforeCursor.match(/%>/g) || []).length

      if (nova.inDevMode()) {
        console.log("(ERB TAG) <% occurence", openingTagsToTheLeftCount)
        console.log("(ERB TAG) %> occurence", closingTagsToTheLeftCount)
      }

      if (hasSelection[index] == false) {
        if (nova.inDevMode()) {
          console.log("(ERB TAG) no selection")
        }

        if (openingTagsToTheLeftCount != closingTagsToTheLeftCount) {
          if (nova.inDevMode()) {
            console.log("(ERB TAG) it's inside another tag")
            console.log("(ERB TAG) lastOpeningTagBeforeCursor:", lastOpeningTagBeforeCursor)
          }

          for (var i = 0; i < brackets.length; i++) {
            if ((lastOpeningTagBeforeCursor + " ").includes(brackets[i][0])) {
              existingBrackets = [brackets[i][0], brackets[i][1]]
              bracketsToUseIndex = i + 1
              if (bracketsToUseIndex + 1 > brackets.length) {
                bracketsToUseIndex = 0
              }
              cursorMove = brackets[bracketsToUseIndex][0].length - existingBrackets[0].length

              if (nova.inDevMode()) {
                console.log("(ERB TAG) changing bracket:", bracketsToUseIndex)
              }
            }
          }
        } else {
          if (nova.inDevMode()) {
            console.log("(ERB TAG) not inside a tag")
          }
        }
        // e.replace(originalRange, bracketsToUse[0] + text + bracketsToUse[1])
        // cursorMove = bracketsToUse[0].length + text.length
      } else {
        if (nova.inDevMode()) {
          console.log("(ERB TAG) has selection")
        }
      }

      if (nova.inDevMode()) {
        console.log("(ERB TAG) bracketsToUseIndex:", bracketsToUseIndex)
      }

      bracketsToUse = brackets[bracketsToUseIndex]
      const originalRange = originalSelection[index]

      if (existingBrackets.length > 0) {
        // TODO: has to know what "var text" to replace
        // var new_text = text.replace(existingBrackets[0], bracketsToUse[0])

        var fromLastTagToCursor = (textBeforeCursor.match(/<%([^<%]*)$/) || [])[0]

        if (nova.inDevMode()) {
          console.log("(ERB TAG) editor range:", range)
          console.log("(ERB TAG) textBeforeCursor:", textBeforeCursor)
          console.log("(ERB TAG) fromLastTagToCursor:", fromLastTagToCursor)
        }

        if (fromLastTagToCursor == undefined) {
          if (nova.inDevMode()) {
            console.error("(ERB TAG) ERB tags error: FROM LAST TAG TO CURSOR")
          }
          return
        }
        last_tag_repacement = fromLastTagToCursor.replace(
          existingBrackets[0].replace(" ", ""),
          bracketsToUse[0].replace(" ", "")
        )
        var new_text = textBeforeCursor.replace(/<%([^<%]*)$/, last_tag_repacement)

        if (nova.inDevMode()) {
          console.log("(ERB TAG) new text:", new_text)
          console.log("(ERB TAG) new text length:", new_text.length)
          console.log("(ERB TAG) textBeforeCursor length:", textBeforeCursor.length)
        }

        e.replace(beforeCursorRange, new_text)
      } else {
        if (nova.inDevMode()) {
          console.log("(ERB TAG) original range length:", originalRange.length)
        }

        if (originalRange.length > 0) {
          e.replace(originalRange, bracketsToUse[0] + text + bracketsToUse[1])
          cursorMove = bracketsToUse[0].length + text.length
        } else {
          e.replace(originalRange, bracketsToUse[0] + "" + bracketsToUse[1])
          cursorMove = bracketsToUse[0].length
        }
      }

      newSelection.push(new Range(originalRange.start + cursorMove, originalRange.start + cursorMove))
    }
  })

  editor.selectedRanges = newSelection
}
