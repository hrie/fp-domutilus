'use strict';
// v2
const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);
const _curry = (f, arr=[]) => (...args) => (a => a.length === f.length ? f(...a) : _curry(f, a))([...arr, ...args]);

/**
 * Curried function to create a HTMLElement.
 * @return {Function}
 */
const createElement = _curry(
	(tagName, className, attrs) => {
		const elem = document.createElement(tagName);

		attrs = Object(attrs);
		className = String(className);
		
		if ('text' in attrs) {
			elem.textContent = attrs.text;
			delete attrs.text;
		}

		if ('html' in attrs) {
			elem.innerHTML = attrs.html;
			delete attrs.html;
		}

		if ('on' in attrs) {
			for (let key in attrs.on) {
				elem.addEventListener(key, attrs.on[key]);
			}
			delete attrs.on;
		}
		
		_setAttrs(elem, attrs);
		className && (elem.className = className.trim());
		
		return elem;
	}
);

/**
 * Creates document.createTextNode
 * @param {string} text - text.
 * @return {Text}
 */
const createText = (text) => document.createTextNode(text);

/**
 * Set attributes to element
 * @param {HTMLElement} elem
 * @param {Object} attrsObj
 * @return {boolean}
 */
const _setAttrs = (elem, attrsObj) => {
	if ('[object Object]' !== attrsObj.toString()) {
		return true;
	}

	for (let name in attrsObj) {
		if ('data' === name) {
			for (let data in attrsObj.data) {
				elem.dataset[data] = attrsObj.data[data];
			}
		} else {
			elem.setAttribute(name, attrsObj[name]);
		}
	}
	
	return true;
};

/**
 * Curried function to append element (array of elements) to some other element.
 * @return {Function}
 * @param {HTMLElement} to - parent element
 * @param {HTMLElement|[HTMLElement]} children - elements to append
 * @return {HTMLElement} to
 */
const appendTo = _curry(
	(to, children) => (
		to.appendChild(_appendElems(children)), 
		to
	)
);

/**
 * Appends array of elements to DocumentFragment
 * @param {HTMLElement|[HTMLElement]} elems - elements to be appended
 * @return {HTMLDocumentFragment}
 */
const _appendElems = (elems) => {
	const fragment = document.createDocumentFragment();
	Array.prototype.concat(elems).forEach(el => el && fragment.appendChild(el));

	return fragment;
};

/**
 * Returns element from param. If param is null then creates and returns empty div.
 * Sugar for expressions like:
 *      const elem = document.getElementById('some');
 *      elem && elem.dataset.id = 8;
 * ---
 *      elemById('some').dataset.id = 8;
 * 
 * @param {HTMLElement | null} elem 
 * @return {HTMLElement}
 */
const _returnElement = (elem) => elem || createDiv('', {});

/**
 * Wrapper above document.getElementById. 
 * Searches for element that matches ID-selector. If match fails returns empty div.
 * @param {string} selector - any valid ID-selector
 * @return {HTMLElement}
 */
const elemById = selector => _returnElement(document.getElementById(selector));
/**
 * Wrapper above querySelector. 
 * Searches for element that matches selector. If match fails returns empty div.
 * @param {string} selector - any valid selector: .class-selector or [href="/index"] etc
 * @param {HTMLElement} [parent=document] - where to search
 * @return {HTMLElement}
 */
const elemByClass = (selector, parent=document) => _returnElement(parent.querySelector(selector));

/**
 * Removes a element
 * @param {HTMLElement} elem
 * @return {void}
 */
const remove = (elem) => elem && ('remove' in elem ? elem.remove() : elem.parentNode.removeChild(elem));

/**
 * Append element (array of elements) to document.body after check if body exists 
 * @param {HTMLElement|[HTMLElement]} elems
 * @return {boolean}
 */
const appendToBody = (elems) => {
	if (document.body) {
		appendTo(document.body, elems);
	} else {
		let interval = setInterval(() => {
			if (document.body) {
				appendTo(document.body, elems);
				clearInterval(interval);
			}
		}, 200);
	}
	
	return true;
};

/**
 * Returns curried function for creating div 
 * @return {Function}
 */
const createDiv = createElement('div');

export {
	createElement,
	createText,
	createDiv,
	appendTo,
	appendToBody,
	compose,
	elemByClass,
	elemById,
	remove,
};