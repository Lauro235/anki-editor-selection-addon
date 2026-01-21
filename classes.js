class Line {
  constructor(text = "", lineNumber = 1, indentLevel = 0) {
    this.text = text;
    this.indentLevel = indentLevel; // Future implementation for indentation level
    this.lineNumber = lineNumber; // Future implementation for line numbering
  }
  setIndentLevel() {
    this.indentLevel++;
    return;
  }
  setText(newText) {
    this.text = newText;
    return;
  }
}

export default Line;