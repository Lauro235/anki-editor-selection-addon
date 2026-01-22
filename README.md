# Indent Addon for Anki app

## What will this do?

This software intends to extend the Anki editor functionality to include indents and dedents, with additional behaviour possible later on down the line.

## What problem does it solve?

Anki has a rich ecosystem of addons, however the ability to add programming-language-based cards is difficult and so far, I haven't had much luck with other addons out there.

One of the big problems for developers that want to make Anki cards is the lack of an indentation/dedentation feature.

Part of the reason for the reluctance to build out an indentation feature is due to Anki's reliance of the document.execCommand() which is deprecated (but has no viable replacement) and handled differently from browser to browser.

Fortunately, because Anki has an addon ecosystem, developers can add features that they think will help the community.

## Who it could benefit?

I hope this can be used by students learning to program and other users in the Anki community that want to improve their editing user experience.

## Scope

Currently the scope is only interested in indentation and dedentation, however the cool thing about this project is that it can be expanded. More features can be added later, although it will be worth taking care to make the project usable and maintainable.

This repo is currently only concerned with the behaviour of the Selection and Range API's.

My intention is to use Python to hook into the functionality exposed by aqt hooks and then inject JavaScript to interact with the editor via the Selection and Range api's, but Python will be added later once the core JS functionality has been built.

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
