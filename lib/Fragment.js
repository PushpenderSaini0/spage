const createElement = require('./createElement.js');

const Fragment = (props, children) => {
    return createElement("Fragment", props, children);
}

module.exports = Fragment;