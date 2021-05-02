export async function erbTagSwitcher(editor) {
    console.log("————————————————————————————————————————————");

    let selectedRanges = editor.selectedRanges;
    const originalSelection = selectedRanges;

    const brackets = [
        ["<%= ", " %>"],
        ["<% ", " %>"],
        ["<%# ", " %>"],
    ];

    var last_tag_repacement;
    var bracketsToUseIndex = 0;
    var bracketsToUse = [];
    var hasSelection = [];
    var entireLineRanges = [];
    var linePositions = [];

    // Selects the whole line for all "empty" ranges (ranges without selection, only a cursor position)
    // selectedRanges = selectedRanges.map((r) =>
    //   // r.empty ? editor.getLineRangeForRange(r) : r
    // );

    // console.log("🎉")
    // console.log(editor.symbolAtPosition())
    // console.log("🎉")

    selectedRanges = selectedRanges.map(function (r, index) {
        if (r.empty) {
            hasSelection[index] = false;
            entireLineRanges[index] = editor.getLineRangeForRange(r);
            if (entireLineRanges) {
                selectedRanges.map(function (r, index) {
                    linePositions[index] =
                        r.start - entireLineRanges[index].start;
                });
            }
        } else {
            hasSelection[index] = true;
        }
        return r;
    });

    console.log("🎉");
    console.log("hasSelection: " + hasSelection);
    console.log("selectedRanges: " + selectedRanges);
    console.log("entireLineRanges: " + entireLineRanges);
    console.log("linePositions: " + linePositions);
    console.log("🎉");

    const lengths = selectedRanges.map((r) => r.length);
    let newSelection = [];
    await editor.edit(function (e) {
        for (const [index, range] of selectedRanges.entries()) {
            var existingBrackets = [];
            var cursorMove = 0;
            // const beforeCursorRange = new Range(entireLineRanges[index].start, entireLineRanges[index].start + linePositions[index])
            const beforeCursorRange = new Range(0, selectedRanges[index].start);
            console.log(beforeCursorRange);
            const textBeforeCursor = editor.getTextInRange(beforeCursorRange);
            const text = editor.getTextInRange(range);
            // console.log("selected text: " + text);
            // console.log("selected text length: " + text.length);
            // console.log("textBeforeCursor: " + textBeforeCursor);

            const openingTagsToTheLeft = textBeforeCursor.match(/<%.?/g) || [];
            const openingTagsToTheLeftCount = openingTagsToTheLeft.length;
            const lastOpeningTagBeforeCursor = openingTagsToTheLeft.pop();
            const closingTagsToTheLeftCount = (
                textBeforeCursor.match(/%>/g) || []
            ).length;
            console.log("<% occurence " + openingTagsToTheLeftCount);
            console.log("%> occurence " + closingTagsToTheLeftCount);

            if (hasSelection[index] == false) {
                console.log("No selection");
                if (openingTagsToTheLeftCount != closingTagsToTheLeftCount) {
                    console.log("It's inside another tag");
                    console.log(
                        "lastOpeningTagBeforeCursor: " +
                            lastOpeningTagBeforeCursor
                    );
                    for (var i = 0; i < brackets.length; i++) {
                        if (
                            (lastOpeningTagBeforeCursor + " ").includes(
                                brackets[i][0]
                            )
                        ) {
                            existingBrackets = [brackets[i][0], brackets[i][1]];
                            bracketsToUseIndex = i + 1;
                            if (bracketsToUseIndex + 1 > brackets.length) {
                                bracketsToUseIndex = 0;
                            }
                            cursorMove =
                                brackets[bracketsToUseIndex][0].length -
                                existingBrackets[0].length;
                            console.log(
                                "changing bracket " + bracketsToUseIndex
                            );
                        }
                    }
                } else {
                    console.log("Not inside a tag");
                }
                // e.replace(originalRange, bracketsToUse[0] + text + bracketsToUse[1]);
                // cursorMove = bracketsToUse[0].length + text.length
            } else {
                console.log("Has selection");
            }

            console.log("bracketsToUseIndex: " + bracketsToUseIndex);
            bracketsToUse = brackets[bracketsToUseIndex];
            const originalRange = originalSelection[index];

            if (existingBrackets.length > 0) {
                console.log("editor range: " + range);
                // todo has to know what "var text" to repalce
                // var new_text = text.replace(existingBrackets[0], bracketsToUse[0]);
                console.log(textBeforeCursor);
                var fromLastTagToCursor = (textBeforeCursor.match(
                    /<%([^<%]*)$/
                ) || [])[0];
                console.log("fromLastTagToCursor: " + fromLastTagToCursor);

                if (fromLastTagToCursor == undefined) {
                    console.log("ERB tags error");
                    return;
                }
                last_tag_repacement = fromLastTagToCursor.replace(
                    existingBrackets[0].replace(" ", ""),
                    bracketsToUse[0].replace(" ", "")
                );
                var new_text = textBeforeCursor.replace(
                    /<%([^<%]*)$/,
                    last_tag_repacement
                );
                // console.log(new_text)
                // console.log("new_text.length "+new_text.length)
                // console.log("textBeforeCursor.length "+textBeforeCursor.length)
                e.replace(beforeCursorRange, new_text);
            } else {
                console.log("🤔originalRange " + originalRange.length);
                if (originalRange.length > 0) {
                    e.replace(
                        originalRange,
                        bracketsToUse[0] + text + bracketsToUse[1]
                    );
                    cursorMove = bracketsToUse[0].length + text.length;
                } else {
                    e.replace(
                        originalRange,
                        bracketsToUse[0] + "" + bracketsToUse[1]
                    );
                    cursorMove = bracketsToUse[0].length;
                }
            }

            newSelection.push(
                new Range(
                    originalRange.start + cursorMove,
                    originalRange.start + cursorMove
                )
            );
        }
    });

    editor.selectedRanges = newSelection;
}
