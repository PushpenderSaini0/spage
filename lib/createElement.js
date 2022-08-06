// type, props, ...children
const createElement = (type, props, ...children) => {
    if (typeof type == "string") {
        if (type == "Fragment") {
            return createTextElement(type, props, children[0]);
        } else {
            return createTextElement(type, props, children);
        }
    } else {
        return type(props, children);
    }
}

const getChildAsString = (children) => {
    if (typeof children == "string") {
        return children;
    } else {
        let childString = "";
        for (let i = 0; i < children.length; i++) {
            childString += getChildAsString(children[i]);
        }
        return childString;
    }

}

const createTextElement = (type, props, children) => {
    let elementDomString = "";
    let propsStr = "";
    for (const prop in props) {
        if (prop == "className") {
            propsStr += ` class="${props[prop]}"`;
        } else {
            propsStr += ` ${prop}="${props[prop]}"`;
        }
    }
    if(type != "Fragment") elementDomString += `<${type}${propsStr}>`;
    elementDomString += getChildAsString(children);
    if(type != "Fragment") elementDomString += `</${type}>`;
    return elementDomString;
}

module.exports = createElement