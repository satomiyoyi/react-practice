
import {REACT_ELEMENT, REACT_FORWARD_REF} from './element';
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
// 创建ref
function createRef() {
    return {
        current: null
    };
}
// 函数组件使用ref 必要包裹
function forwardRef(fnComponent) {
    // {
    // $$typeof: Symbol(react.forward_ref)
    // render: ƒ SubFComponent(props, ref)
    // }
    return {
        $$typeof:REACT_FORWARD_REF,
        render: fnComponent
    }
}
const React = {
    createElement,
    Component,
    createRef,
    forwardRef
};
export default React;