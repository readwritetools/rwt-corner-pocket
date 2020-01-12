







<figure>
	<img src='/img/components/corner-pocket/corner-pocket-pixabay-16723.jpg' width='100%' />
	<figcaption></figcaption>
</figure>

# Corner Pocket

## Website popup menu


<address>
<img src='/img/rwtools.png' width=80 /> by <a href='https://readwritetools.com' title='Read Write Tools'>Read Write Tools</a> <time datetime=2020-01-07>Jan 7, 2020</time></address>



<table>
	<tr><th>Abstract</th></tr>
	<tr><td>The <span class=product>rwt-corner-pocket</span> web component is a popup menu using both text and icons. It is suitable for targeting a small list of external websites.</td></tr>
</table>

### Motivation

A website's main menu guides the visitor to internal documents, but occasionally
there may be a desire to guide visitors to a short list of external websites
that are somehow related.

The <span>rwt-corner-pocket</span> web component is normally kept
hidden until needed, when it slides into the viewport from any one of its four
corners. Visibility of the menu is under control of a separate button that
triggers the component's `toggleMenu` method or its event interface.

The component has these features:

   * The position of the menu is relative to any one of the four viewport corners.
   * The menu has a title bar running vertically along its left edge.
   * Each menu item has both text and icon.
   * The menu item corresponding to the current page is highlighted when the page is
      loaded.
   * The menu has an event interface for showing/hiding itself.
   * The menu emits a custom event to close sibling menus and dialog boxes.
   * Menu items may be kept separate from the web component, allowing the webmaster
      to change its contents in a single centralized place. Alternatively, menu items
      may be slotted directly between the component's opening and closing tags.
   * A keyboard listener is provided to allow a shortcut key to expand/collapse the
      menu.

#### Prerequisites

The <span>rwt-corner-pocket</span> web component works in any
browser that supports modern W3C standards. It has no other prerequisites.
Distribution and installation are done with either NPM or via Github.

#### Installation using NPM

If you are familiar with Node.js and the `package.json` file, you'll be
comfortable installing the component just using this command:

```bash
npm install rwt-corner-pocket
```

If you are a front-end Web developer with no prior experience with NPM, follow
these general steps:

   * Install <a href='https://nodejs.org'>Node.js/NPM</a>
on your development computer.
   * Create a `package.json` file in the root of your web project using the command:
```bash
npm init
```

   * Download and install the web component using the command:
```bash
npm install rwt-corner-pocket
```


Important note: This web component uses Node.js and NPM and `package.json` as a
convenient *distribution and installation* mechanism. The web component itself
does not need them.

#### Installation using Github

If you are more comfortable using Github for installation, follow these steps:

   * Create a directory `node_modules` in the root of your web project.
   * Clone the <span>rwt-corner-pocket</span> web component into it
      using the command:
```bash
git clone https://github.com/readwritetools/rwt-corner-pocket.git
```


### Using the web component

After installation, you need to add four things to your HTML page to make use of
it.

   * Add a `script` tag to load the component's `rwt-corner-pocket.js` file:
```html
<script src='/node_modules/rwt-corner-pocket/rwt-corner-pocket.js' type=module></script>             
```

   * Add the component tag somewhere on the page.

      * For scripting purposes, apply an `id` attribute.
      * Apply a `sourceref` attribute with a reference to an HTML file containing the
         menu's hyperlinks.
      * Apply a `titlebar` attribute with the text that should appear along the left edge
         of the popup panel.
      * Apply a `corner` attribute with one of these values

         * top-left
         * top-right
         * bottom-left
         * bottom-right
      * Optionally, apply a `shortcut` attribute with something like `F3`, `F4`, etc. for
         hotkey access.
      * For WAI-ARIA accessibility apply a `role=navigation` attribute.
      * For simple menus, the `sourceref` may be omitted and the menu hyperlinks may be
         slotted into the web component. Simply place the hyperlinks directly between the
`<rwt-corner-pocket>` and `</rwt-corner-pocket>` tags.
      * Here's an example HTML tag where the menu items are in a separate file:
```html
<rwt-corner-pocket id=corner-pocket sourceref='/menu.html' corner='bottom-left' titlebar='Find It Here' shortcut=F3 role=navigation></rwt-corner-pocket>
```

   * Add a button for the visitor to click to show the dialog:
```html
<a id=corner-pocket-button title='Find It Here (F3)'>⋮</a>
```

   * Add a listener to respond to the click event:
```html
<script type=module>
    document.getElementById('corner-pocket-button').addEventListener('click', (e) => {
        document.getElementById('corner-pocket').toggleDialog(e);
    });
</script>
```


#### Menu template

The content and format of the each menu item should follow this pattern, which
uses an anchor `<a>` that encloses a paragraph `<p>` and an image `<img>`.

```html
<a sourceref='https://example.com' tabindex=301 title='Example website'>
    <p>Example Website</p>
    <img src='/img/example-logo.png' />
</a>
```

#### Self identification

The menu item corresponding to the current page can be highlighted when it
identifies itself to the menu. This is accomplished by adding a `meta` tag to the
page where the `content` attribute specifies the URL of the menuitem to highlight,
like this:

```html
<meta name='corner-pocket:this-url' content='https://example.com' />
```

### Customization

#### Menu items and sidebar sizing

The images that you provide should be square. They will be resized using the
value you specify with the CSS `--icon-size` variable.

The height of each menuitem is specified with the `--item-height` variable. You
must also specify how many menu items there are, using the `--num-items` variable.
The overall height of the menu will be calculated by multiplying these two
values. Vertical scroll bars are never shown.

The overall width of the popup panel is specified with the `--width` variable. The
width of the sidebar title is specified with `--sidebar-width`, and the remainder
is allocated to the menuitem's text and icon.

The position of the panel's offset from the chosen corner is set with the `--top`,
`--left`, `--bottom`, and `--right` variables. (Only the two variables corresponding
to the chosen corner are needed.)

```css
rwt-corner-pocket {
    --icon-size: 2rem;
    --item-height: 4rem;
    --num-items: 7;
    --sidebar-width: 2rem;
    --width: 20rem;
    --bottom: 30px;
    --left: 30px;
}
```

#### Menu color scheme

The default color palette for the menu uses a dark mode theme. You can use CSS
to override the variables' defaults:

```css
rwt-corner-pocket {
    --color: var(--white);
    --accent-color1: var(--yellow);
    --accent-color2: var(--gray);
    --background: var(--nav-black);
    --accent-background1: var(--light-black);
    --accent-background2: var(--medium-black);
    --accent-background3: var(--pure-black);
}
```

### Event interface

The menu can be controlled with its event interface.

The component listens on DOM `document` for `toggle-corner-pocket` messages. Upon
receipt it will expand or collapse the menu.

The component listens on DOM `document` for `keydown` messages. If the user presses
the configured shortcut key (<kbd>F9</kbd>, <kbd>F10</kbd>, etc) it will
collapse/expand the menu. The <kbd>Esc</kbd> key collapses the menu.

The component listens on DOM `document` for `collapse-popup` messages, which are
sent by sibling menus or dialog boxes. Upon receipt it will collapse itself.

The component listens on DOM `document` for `click` messages. When the user clicks
anywhere outside the menu, it collapses itself.

### License

The <span>rwt-corner-pocket</span> web component is licensed under
the MIT License.

<img src='/img/blue-seal-mit.png' width=80 align=right />

<details>
	<summary>MIT License</summary>
	<p>Copyright © 2020 Read Write Tools.</p>
	<p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
	<p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
	<p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
</details>

### Availability


<table>
	<tr><td>Source code</td> 			<td><a href='https://github.com/readwritetools/rwt-corner-pocket'>github</a></td></tr>
	<tr><td>Package installation</td> <td><a href='https://www.npmjs.com/package/rwt-corner-pocket'>NPM</a></td></tr>
	<tr><td>Documentation</td> 		<td><a href='https://hub.readwritetools.com/components/corner-pocket.blue'>Read Write Hub</a></td></tr>
</table>

