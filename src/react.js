
import {REACT_ELEMENT} from './element';
import {wrapVdom} from './tool';
import {Component} from './component';
function createElement(type, config, children) {
    let ref = null;
    let key = null;
    // 没有额外处理config 估计后面会有config的内容处理
    let props = {...config};
    if (arguments.length > 3) {
        // 有多个child
        props.children = Array.prototype.slice.call(arguments, 2).map(wrapVdom);
    }
    else {
        props.children = wrapVdom(children);
    }
    return {
        type,
        $$typeof: REACT_ELEMENT,
        ref,
        key,
        props
    }
    
}
const React = {
    createElement,
    Component
};
export default React;