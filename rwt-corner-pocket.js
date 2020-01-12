//=============================================================================
//
// File:         /node_modules/rwt-corner-pocket/rwt-corner-pocket.js
// Language:     ECMAScript 2015
// Copyright:    Read Write Tools © 2020
// License:      MIT
// Initial date: Jan 7, 2020
// Purpose:      Lower left corner-pocket popup menu
//
//=============================================================================

export default class RwtCornerPocket extends HTMLElement {

	// The elementInstance is used to distinguish between multiple instances of this custom element
	static elementInstance = 0;

	constructor() {
		super();
		
		// child elements
		this.panel = null;
		this.caption = null;
		this.container = null;

		// properties
		this.shortcutKey = null;
		this.corner = null;
		RwtCornerPocket.elementInstance++;
		this.collapseSender = `RwtCornerPocket ${RwtCornerPocket.elementInstance}`;

		// select and scroll to this document's menu item
		this.activeElement = null;
		this.thisURL = '';
		
		Object.seal(this);
	}
	
	//-------------------------------------------------------------------------
	// customElement life cycle callbacks
	//-------------------------------------------------------------------------
	async connectedCallback() {		
		// guard against possible call after this has been disconnected
		if (!this.isConnected)
			return;
		
		var htmlFragment = await this.fetchTemplate();
		if (htmlFragment == null)
			return;
		
		var styleElement = await this.fetchCSS();
		if (styleElement == null)
			return;

		var menuElement = await this.fetchMenu();
		if (menuElement != null) {
			var elContainer = htmlFragment.getElementById('container');
			elContainer.appendChild(menuElement);
		}
		
		// append the HTML and CSS to the custom element's shadow root
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(htmlFragment); 
		this.shadowRoot.appendChild(styleElement); 
		
		this.identifyChildren();
		this.registerEventListeners();
		this.initializeCaption();
		this.initializeShortcutKey();
		this.highlightActiveElement();
		this.determineCorner();
	}
	
	//-------------------------------------------------------------------------
	// initialization
	//-------------------------------------------------------------------------

	//^ Fetch the user-specified menu items from the file specified in
	//  the custom element's sourceref attribute, which is a URL.
	//
	//  That file should contain HTML with <a> and <img> items like this:
	//		a `https://readwritetools.com` *tabindex=301 *title='Smart tech for people who type' {
	//			p <<.thin READ WRITE>> <<.heavy TOOLS>>
	//			img `/corner-pocket/img/rwtools.png`
	//		}
	//
	//< returns a document-fragment suitable for appending to the container element
	//< returns null if the user has not specified a sourceref attribute or
	//  if the server does not respond with 200 or 304
	async fetchMenu() {
		if (this.hasAttribute('sourceref') == false)
			return null;
		
		var sourceref = this.getAttribute('sourceref');

		var response = await fetch(sourceref, {cache: "no-cache", referrerPolicy: 'no-referrer'});		// send conditional request to server with ETag and If-None-Match
		if (response.status != 200 && response.status != 304)
			return null;
		var templateText = await response.text();
		
		// create a template and turn its content into a document fragment
		var template = document.createElement('template');
		template.innerHTML = templateText;
		return template.content;
	}

	//^ Fetch the HTML template
	//< returns a document-fragment suitable for appending to shadowRoot
	//< returns null if server does not respond with 200 or 304
	async fetchTemplate() {
		var response = await fetch('/node_modules/rwt-corner-pocket/rwt-corner-pocket.blue', {cache: "no-cache", referrerPolicy: 'no-referrer'});
		if (response.status != 200 && response.status != 304)
			return null;
		var templateText = await response.text();
		
		// create a template and turn its content into a document fragment
		var template = document.createElement('template');
		template.innerHTML = templateText;
		return template.content;
	}
	
	//^ Fetch the CSS styles and turn it into a style element
	//< returns an style element suitable for appending to shadowRoot
	//< returns null if server does not respond with 200 or 304
	async fetchCSS() {
		var response = await fetch('/node_modules/rwt-corner-pocket/rwt-corner-pocket.css', {cache: "no-cache", referrerPolicy: 'no-referrer'});
		if (response.status != 200 && response.status != 304)
			return null;
		var css = await response.text();

		var styleElement = document.createElement('style');
		styleElement.innerHTML = css;
		return styleElement;
	}
	
	//^ Identify this component's children
	identifyChildren() {
		this.panel = this.shadowRoot.getElementById('panel');
		this.caption = this.shadowRoot.getElementById('caption');
		this.container = this.shadowRoot.getElementById('container');
	}		

	registerEventListeners() {
		// document events
		document.addEventListener('click', this.onClickDocument.bind(this));
		document.addEventListener('keydown', this.onKeydownDocument.bind(this));
		document.addEventListener('collapse-popup', this.onCollapsePopup.bind(this));
		document.addEventListener('toggle-corner-pocket', this.onToggleEvent.bind(this));
		
		// component events
		this.panel.addEventListener('click', this.onClickPanel.bind(this));
	}

	initializeCaption() {
		if (this.hasAttribute('titlebar'))
			this.caption.innerText = this.getAttribute('titlebar');
		else
			this.caption.innerText = "Corner Pocket";
	}

	//^ Get the user-specified shortcut key. This will be used to open the dialog.
	//  Valid values are "F1", "F2", etc., specified with the *shortcut attribute on the custom element
	initializeShortcutKey() {
		if (this.hasAttribute('shortcut'))
			this.shortcutKey = this.getAttribute('shortcut');
	}

	//^ Highlight the anchor element corresponding to this document
	//
	//  For this to work, the document should have a tag like this in its <head>
	//    <meta name='corner-pocket:this-url' content='https://example.com' />
	//
	highlightActiveElement() {
		// the document must self-identify its own URL
		var meta = document.querySelector('meta[name="corner-pocket:this-url"]')
		if (meta != null) {
			this.thisURL = meta.getAttribute('content');
			if (this.thisURL == null)
				this.thisURL = '';
		}
		
		// find the corresponding anchor tag
		if (this.thisURL != '') {
			var selector = `a[href='${this.thisURL}']`;	
			this.activeElement = this.container.querySelector(selector);				//  for elements added to shadow DOM
			if (this.activeElement == null)
				this.activeElement = this.querySelector(selector);						//  for elements added as slot
		}
		if (this.activeElement) {
			this.activeElement.scrollIntoView({block:'center'});
			this.activeElement.classList.add('activename');								//  use CSS to highlight the element
		}
	}

	determineCorner() {
		this.corner = 'bottom-left';

		if (this.hasAttribute('corner')) {
			var attr = this.getAttribute('corner');
			if (attr.indexOf('bottom') != -1 && attr.indexOf('left') != -1)
				this.corner = 'bottom-left';
			else if (attr.indexOf('bottom') != -1 && attr.indexOf('right') != -1)
				this.corner = 'bottom-right';
			else if (attr.indexOf('top') != -1 && attr.indexOf('left') != -1)
				this.corner = 'top-left';
			else if (attr.indexOf('top') != -1 && attr.indexOf('right') != -1)
				this.corner = 'top-right';
		}
	}

	//-------------------------------------------------------------------------
	// document events
	//-------------------------------------------------------------------------
	
	// User has clicked on the document
	onClickDocument(event) {
		this.hideMenu();
		event.stopPropagation();
	}

	// close the dialog when user presses the ESC key
	// toggle the dialog when user presses the assigned shortcutKey
	onKeydownDocument(event) {		
		if (event.key == "Escape") {
			this.hideMenu();
			event.stopPropagation();
		}
		// like 'F1', 'F2', etc
		if (event.key == this.shortcutKey && this.shortcutKey != null) {
			this.toggleMenu(event);
			event.stopPropagation();
			event.preventDefault();
		}
	}

	//^ Send an event to close/hide all other registered popups
	collapseOtherPopups() {
		var collapseSender = this.collapseSender;
		var collapseEvent = new CustomEvent('collapse-popup', {detail: { collapseSender }});
		document.dispatchEvent(collapseEvent);
	}
	
	//^ Listen for an event on the document instructing this component to close/hide
	//  But don't collapse this component, if it was the one that generated it
	onCollapsePopup(event) {
		if (event.detail.sender == this.collapseSender)
			return;
		else
			this.hideMenu();
	}
	
	//^ Anybody can use: document.dispatchEvent(new Event('toggle-corner-pocket'));
	// to open/close this component.
	onToggleEvent(event) {
		event.stopPropagation();
		this.toggleMenu(event);
	}
	
	//-------------------------------------------------------------------------
	// component events
	//-------------------------------------------------------------------------

	// User has clicked in the panel, but not on a hyperlink
	onClickPanel(event) {
		event.stopPropagation();
	}

	//-------------------------------------------------------------------------
	// component methods
	//-------------------------------------------------------------------------
	
	// open/close
	toggleMenu(event) {
		if (this.panel.className == 'hide-menu')
			this.showMenu();
		else
			this.hideMenu();
		event.stopPropagation();
	}

	showMenu() {
		this.collapseOtherPopups();

		this.panel.className = this.corner;		// bottom-left, bottom-right, top-left, top-right
		
		if (this.activeElement != null)
			this.activeElement.focus();
	}

	hideMenu() {
		this.panel.className = 'hide-menu';
	}
}

window.customElements.define('rwt-corner-pocket', RwtCornerPocket);
