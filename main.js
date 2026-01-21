import Line from "./classes.js";
import { NOT } from "./gates.js";
// import config from "./config.json" with { type: "json"};

const editor = document.getElementById("editor");

// log elements (getElementById))

const textElement = document.getElementById("text-output");
const lineElement = document.getElementById("line-output");
const selectionElement = document.getElementById("selection-output");
const rangeElement = document.getElementById("range-output");


/**
 * Sets the text content of an HTML element with user input.
 * Used for display and logging purposes in the editor.
 * 
 * @param {string} text - The text content to set
 * @param {HTMLElement} tag - The HTML element to update
 * @returns {void}
 */
function textToElement(text, tag) {
  tag.textContent = text;
}

/**
 * Displays an object's properties as formatted JSON in an HTML element.
 * Copies object properties to filter out non-serializable values (e.g., Symbols)
 * that would cause JSON.stringify to fail or be ignored.
 * 
 * @param {Object} obj - The object to display
 * @param {HTMLElement} el - The HTML element to update with formatted JSON
 * @returns {void}
 */
function objectToHtml(obj, el) {
  const result = {}
  for (const key in obj) {
    result[key] = obj[key];
  }
  const htmlString = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
  el.innerHTML = htmlString;
}

/**
 * Extracts the active range from a Selection object and creates a mutable Range for DOM manipulation.
 * 
 * Note: Currently safe only for keyup event handlers where selection is guaranteed.
 * Will throw TypeError if selection has no composed ranges (e.g., unfocused editor).
 * Future: 
 *  - Add null checks before expanding to toolbar buttons or programmatic operations.
 * 
 * @param {Selection} selection - The Selection object from a focused editor
 * @returns {Range} A mutable Range object for DOM manipulation
 */
function createAndSetRange(selection) {

  // Use getComposedRanges to find all ranges in document including in shadow dom
  // composedRanges[0] finds current active range
  // getComposedRanges returns static range objects without DOM manipulation methods
  const composedRanges = selection.getComposedRanges(editor);

  const rangeInfo = composedRanges.length > 0 ? composedRanges[0] : null;
  const startOffset = rangeInfo ? rangeInfo.startOffset : 0;
  const endOffset = rangeInfo ? rangeInfo.endOffset : 0;

  // create a range for the Range prototype methods that allow for inserting and deleting nodes etc.
  const range = document.createRange();
  range.setStart(rangeInfo.startContainer, startOffset)
  range.setEnd(rangeInfo.endContainer, endOffset)

  return range

}


/**
 * Returns the HTML content of the editor.
 * Uses innerHTML to preserve markup for formatting and line tracking purposes.
 * 
 * @param {HTMLElement} editor - The contentEditable editor element
 * @returns {string} The HTML content including all markup and formatting
 */
function getEditorHTML(editor) {
  return editor.innerHTML
}


/**
 * Returns text in current startContainer
 * 
 * Note: Currently only displays content of current startContainer which by default is whole line
 * Future:
 *  - Ensure all nodes within div (editor.childNodes[1] / or line) are returned.
 * 
 * @param {Range} range - The range object which contains startContainer, where the text content comes from.
 * @returns {string} The text content which is displaying in the current startContainer.
*/
function getCurrentLine(range) {
  return range.startContainer.textContent;
}


/**
 * Returns current line index
 * 
 * Note: editor.childNodes lists each line. By default presents as [text, div, div, div...]
 * We know that when node.parentNode is equal to editor we can use editor.childNodes to find the index which contains the original startContainer 
 * 
 * @param {HTMLElement} editor 
 * @param {Range} range 
 * @returns {number} The index of the line number that the startContainer belongs to. 
 */
function getCurrentLineIndex(editor, range) {

  // keep helper encapsulated for now
  function findCurrentEditorChild(editor, node) {
    // if node parent is not div editor, set node to parent - repeat. when node parent is editor, then return node
    while (NOT(node.parentNode === editor)) {
      node = node.parentNode;
    }
    return node;
  }

  const node = range.startContainer
  if (node === editor) {
    return 0;
  }
  const currentEditorChild = findCurrentEditorChild(editor, node)
  return Array.from(editor.childNodes).findIndex(node => node === currentEditorChild)

}

/*

WORK ON

==================================================================

*/

/**
 * Update line meta information to include up-to-date increment level. Adds this to proceeding lines.
 * 
 * Behaviour must include
 * - Ability to increment current line
 * - subsequent lines must be incremented
 * 
 * Currently only current lines and EXISTING subsequent lines are incremented. This is not correct.
 * 
 * correct
 * line 1 - 0
 * line 2 - |1
 * line 3 - 0 : this line exists and should stay at 0
 * 
 * wrong
 * line 1 - 0
 * line 2 - |1
 * line 3 - 1 : this line exists and should not be incremented unless explicitly part of selection
 * 
 * @param {Array<Line>} lines 
 * @param {number} currentLineIndex 
 * @returns {void}
 */
function addIndentMetaToLines(lines, currentLineIndex) {
  lines.forEach((line, i) => {
    if (i >= currentLineIndex) {
      line.indentLevel += 1;
    }
  })
}

function addNewLine(lines, currentLineIndex) {
  // get indentLevel for previous line
  const prevIndent = lines[currentLineIndex - 1].indentLevel
  lines.push(new Line("", currentLineIndex + 1, prevIndent));
}

/*

==================================================================

WORK ENDS

*/

function addTextMetaToLines(lines, currentLine, currentLineIndex) {
  lines[currentLineIndex].text = currentLine;
}

const lines = [new Line()]
let lineIndex = 0; // starting index. Controlled and determined by range somehow

editor.addEventListener("keyup", (event) => {

  // on each keypress log the selection details with JSON.stringify
  const selection = window.getSelection();
  objectToHtml(selection, selectionElement);

  // log the range details
  const range = createAndSetRange(selection)
  objectToHtml(range, rangeElement);

  // get all text
  const editorHTML = getEditorHTML(editor);
  textToElement(editorHTML, textElement);

  // will display whole line if multiple nodes in div, but fine for now.
  const currentLineText = getCurrentLine(range)

  const currentLineIndex = getCurrentLineIndex(editor, range);

  if (event.code === "Enter") {
    addNewLine(lines, currentLineIndex)
  }

  // Update line text
  addTextMetaToLines(lines, currentLineText, currentLineIndex);

  console.log(lines[currentLineIndex])



  if (event.ctrlKey && event.code === "BracketRight") {
    addIndentMetaToLines(lines, currentLineIndex);
    console.log(lines.forEach(line => console.log(line)));
  }




});