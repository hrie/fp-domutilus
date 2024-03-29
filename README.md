# fp-domutilus

Tiny fp-wrapper above document.createElement

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save fp-domutilus
```

Or install with [yarn](https://yarnpkg.com/):

```sh
$ yarn add fp-domutilus
```

## API

### Functions list
* [createElement](#createelement)
* [createText](#createtext)
* [appendTo](#appendto)
* [appendToBody](#appendtobody)
* [elemById](#elembyid)
* [elemByClass](#elembyclass)
* [remove](#remove)
* [compose](#compose)

### [createElement](#createelement)

Curried function to create a HTMLElement.

**Params**
* `tagName` **{string}**: elements tag name.
* `className` **{string}**: elements class name.
* `attrs` **{Object}**: attributes to set on element. Except common there are 3 special attributes: *text*, *html*, *on*.

**Returns** **{HTMLElement}**

**Example**

```js
import { createElement } from 'fp-domutilus';

// usage of common attributes
createElement('h1', '', { title: 'Main text', data: { id: 4 } });
//=> <h1 title="Main text" data-id="4"></h1>

// special attribute "text" adds plain text to element (through elem.textContent)
createElement('h1', '', { text: 'Main text' });
//=> <h1>Main text</h1>

// special attribute "html" adds html (through elem.innerHTML)
createElement('h1', '', { html: 'Main header <small>small header</small>' });
//=> <h1>Main header <small>small header</small></h1>

// special attribute "on" adds event listener to element
createElement('input', '', { 
    placeholder: 'Click me', 
    on: { 
        focus: ({ target }) => target.value='then type something',
        input: ({ target }) => target.value=Date.now()
    } 
});
//=> <input placeholder="Click me" />
```

```js
import { createElement } from 'fp-domutilus';

// function is curried, so you can do things like this:
const li = createElement('li');
const middleLi = li('middle');

const children = [
    li('first', { text: 1 }), 
    middleLi({ text: 2 }), 
    middleLi({ text: 3 }), 
    middleLi({ text: 4 }), 
    li('last', { text: 5 })
];
/* =>
    <li class="first">1</li>
    <li class="middle">2</li>
    <li class="middle">3</li>
    <li class="middle">4</li>
    <li class="last">5</li>
*/

// because of curry you must fill-in all arguments. This will not work as expected if you just want to create a HTMLDivElement:
const divElement = createElement('div');
//=> function _curry()

// but this will:
const divElement = createElement('div', '', {});
```

### [createText](#createtext)

Create a textNode.

**Params**

* `text` **{string}**: text.

**Returns** **{Text}**

**Example**

```js
import { createElement, createText } from 'fp-domutilus';

const text = createText('Some text');
//=> #text "Some text"
```

### [appendTo](#appendto)

Curried function to append element (array of elements) to some other element.

**Params**

* `to` **{HTMLElement}**: parent element.
* `children` **{[HTMLElement]}**: elements to append.

**Returns** **{HTMLElement}** parent element

**Example**

```js
import { createElement, appendTo } from 'fp-domutilus';

const li = createElement('li', '');

const list = appendTo(
    createElement('ul', '', {}),
    [ li({ text: 'Element 1' }), li({ text: 'Element 2' }), li({ text: 'Element 3' }) ]
);
/* => 
    <ul>
        <li>Element 1</li>
        <li>Element 2</li>
        <li>Element 3</li>
    </ul>
*/
```

### [appendToBody](#appendtobody)

Append element (array of elements) to **body** after check if body exists.

**Params**

* `elem` **{[HTMLElement]}**: elements to append.

**Returns** **{void}**

**Example**

```js
import { appendToBody } from 'fp-domutilus';

appendToBody(
    createElement('script', '', { src: '/script.js', async: true })
);
/* =>
    <body>
        ...
        <script src="/script.js" async="true></script>
    </body>
*/
```

### [elemById](#elembyid)

Wrapper above document.getElementById. Searches for element that matches ID-selector. If match fails returns empty **div**.

**Params**

* `selector` **{string}**: any valid ID-selector.

**Returns** **{HTMLElement}**

**Example**

```js
import { elemById } from 'fp-domutilus';

elemById('some-id').classList.add('show');
//=> <div id="some-id" class="show">text</div>
// or
//=> <div class="show"></div>
```

### [elemByClass](#elembyclass)

Wrapper above querySelector. Searches for element that matches selector. If match fails returns empty **div**.

**Params**

* `selector` **{string}**: any valid selector: .class-selector or [href="/index"] etc.
* `[parent]` **{HTMLElement}**: where to search (default: document).

**Returns** **{HTMLElement}**

**Example**

```js
import { elemByClass } from 'fp-domutilus';

elemByClass('.some-class').classList.add('show');
//=> <div class="some-class show">text</div>
// or 
//=> <div class="show"></div>
```

### [remove](#remove)

Removes element.

**Params**

* `selector` **{HTMLElement}**: element to remove.

**Returns** **{HTMLElement}**

**Example**

```js
import { remove, elemByClass } from 'fp-domutilus';

remove(elemByClass('.some-class'));
```

### [compose](#compose)

Performs right-to-left function composition.

**Params**

* `fns` **{...Function}**: functions to compose.

**Returns** **{Function}**

**Example**

```js
import { compose, createElement, createText, appendTo, appendToBody } from 'fp-domutilus';

compose(
    appendToBody,
    appendTo(createElement('div', 'wrapper', {})),
    appendTo(createElement('h1', '', {})),
    () => [
        createText('Main header'),
        createElement('small', '', { text: 'Small header' }),
    ]
)();

/* => 
    <body>
        ...
        <div class="wrapper">
            <h1>Main header <small>Small header</small></h1>
        </div>
    </body>
*/
```

### License

Copyright © 2019, [h.rie](https://github.com/hrie).
Released under the [MIT License](LICENSE).
