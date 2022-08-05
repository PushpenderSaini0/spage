// type, props, ...children
const createElement = (type, props, ...children) => {
    if (typeof type == "string") {
        return createTextElement(type, props, children)
    }
    else {
        return type(props);
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
    elementDomString += `<${type}${propsStr}>`;
    elementDomString += getChildAsString(children);
    elementDomString += `</${type}>`;
    return elementDomString;
}

module.exports = createElement