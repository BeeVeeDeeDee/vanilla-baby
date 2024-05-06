export const Elements = {
	DIV: (parent, cssClass, cssText, innerHTML, onClick, id) =>
		Elements.createElement("div", parent, cssClass, cssText, innerHTML, onClick, id),
	ICON: (parent, iconName, cssClass, cssText, innerHTML, onClick, id) => {
		let el = Elements.createElement("span", parent, cssClass, cssText, innerHTML, onClick, id);
		el.classList.add("material-symbols-outlined");
		el.innerText = iconName;
		return el;
	},
	IMG: (parent, src, cssClass, cssText, onClick, alt, id) => {
		let el = Elements.createElement("img", parent, cssClass, cssText, null, onClick, id);
		el.ondragstart = (e) => { return false; };
		src && (el.src = src);
		alt && (el.alt = alt);
		return el;
	},
	CANVAS: (parent, cssClass, width, height) => {
		let el = Elements.createElement("canvas", parent, cssClass);
		el.width = width;
		el.height = height;
		return el;
	},
	P: (parent, cssClass, cssText, innerHTML, onClick, id) =>
		Elements.createElement("p", parent, cssClass, cssText, innerHTML, onClick, id),
	Heading: (parent, Number, cssClass, cssText, innerHTML, onClick, id) =>
		Elements.createElement("h" + Number, parent, cssClass, cssText, innerHTML, onClick, null, id),
	Label: (parent, innerHTML, cssClass, cssText, forId, id) => {
		let element = Elements.createElement("label", parent, cssClass, cssText, innerHTML, null, null, id);
		forId && element.setAttribute("for", forId);
		return element;
	},
	OL: (parent, cssClass, cssText, id) =>
		Elements.createElement("ol", parent, cssClass, cssText, null, null, id),
	UL: (parent, cssClass, cssText, id) =>
		Elements.createElement("ul", parent, cssClass, cssText, null, null, id),
	LI: (parent, innerHTML, cssClass) =>
		Elements.createElement("li", parent, cssClass, null, innerHTML),
	Radio: (parent, value, cssClass, cssText, name, id, onClick, onChange) =>
		Elements.createInput(parent, "radio", cssClass, cssText, null, value, onClick, onChange, name, id),
	Button: (parent, value, onClick, disabled = false, classNames = "", cssText, id) => {
		let cssClass = classNames.split(" ");
		disabled && cssClass.push("disabled");
		let el = Elements.createElement("button", parent, cssClass.join(" "), cssText, value, onClick, id);
		return el;
	},
	createElement: (elementType, parent, cssClass, cssText, innerHTML, onClick, id, name) => {
		let element = document.createElement(elementType);
		cssClass && (element.className = cssClass);
		cssText && (element.style.cssText = cssText);
		innerHTML && (element.innerHTML = innerHTML);
		onClick && element.addEventListener("click", onClick);
		id && (element.id = id);
		name && (element.name = name);
		parent && parent.appendChild(element);
		return element;
	},
	createInput: (parent, type, cssClass, cssText, placeholder, value, onClick, onChange, name, id, autoCapitalize) => {
		let element = Elements.createElement("input", parent, cssClass, cssText, null, onClick, id, name);
		element.type = type;
		value && (element.value = value);
		placeholder && (element.placeholder = placeholder);
		autoCapitalize && element.setAttribute("autocapitalize", autoCapitalize);
		onChange && ((element.onchange = onChange), (element.onkeyup = onChange));
		return element;
	},
};