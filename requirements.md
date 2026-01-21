# Requirements

## User stories

- User must be able to write text in a contenteditable div (editor)
- log must show current line
- Ctrl+RightBracket must indent a line
- Ctrl+LeftBracket must dedent a line
- Indent behavior is limited to incrementing the whole line
  - "\tThis is okay"
  - "This is not okay \t"
- dedenting is similar in that it should move the whole line back
  - "\tThis is okay" becomes "This is okay"

## App Architecture

## Notes

```js
function getLines(event) {
	// plan - check children?
	console.log(event);
}
/*
  Type "hi\n" (replace \n with an actual new line... i.e press Enter)
  Look through event instance for target and then scroll down for childNodes and children
  Note the firstChild is a text node, but the firstElementChild is a div.
*/
```

![Log containing child nodes and children](./images/newLineDemo2.png)
![Log showing text node and then div in childNodes](./images/newLineDemo3.png)

```js
function getLines(event) {
	// plan - check children?
	console.dir(event.target);
}

/*
 Type "hi\n" (replace \n with an actual new line... i.e press Enter)
*/
```

![Image demonstrating text node on first line and an empty new line](./images/newLineDemo1.png)

### Observations

#### Basic HTML Structure

The key thing to note is that we want to work with childNodes, this allows us to move and track our cursor through different HTML elements. At the simplest demo we see that a new line can take two formats.

```html
<div><br /></div>
<!-- or -->
<div>content</div>
```

The examples above demonstrate the typical HTML structure of a new line.

Let's use the following example "\n\n". Replace each "\n" with a carriage return i.e. enter. The html looks like this.

```html
<br />
<div><br /></div>
<div><br /></div>
<!-- notice an extra line hear. Browsers typically add an extra line at the end -->
```

Let's now use the example "\nhi"

```html
<br />
<div>hi</div>
<!-- Technically "hi" is a child node of the div of the type text -->
```

We can recurse through each element and check it's nodes by type with:

```js
const node = el.childNodes[0]l
  if (node === Node.TEXT_NODE) {
    // do thing for text
  }
  if (node === Node.ELEMENT_NODE) {
    // do thing for element
  }
```

#### More Advanced HTML Structure

Sometimes there may be a reason to add special text elements inside a line. A line is marked always by the <div></div> elements.

Child nodes are either simply <br> meaning no content whatsover or they can be an array of childNodes like [text node, span]

### Code History

#### Finding the current line index

This challenge proved difficult. Here was the first iteration of something that was close to working.

```js
function getCurrentLineIndex(editor, range) {
  const node = range.startContainer
  const childNodes = editor.childNodes;
  return Array.from(childNodes).findIndex(el => el === node)
}
```

The problem with this is that when the startContainer moves to a text node within the div, this code breaks!