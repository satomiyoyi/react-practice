import { REACT_TEXT,REACT_FORWARD_REF } from './element';
import {wrapVdom} from './tool';
import {addEvent} from './event';
function updateProps(dom, props) {
    for (let key of Object.keys(props)) {
        if (key === 'children') {
            continue;
        } else if (key === 'style') {
            let styleObj = props[key];
            for (let styleKey of Object.keys(styleObj)) {
                dom.style[styleKey] = styleObj[styleKey];
            }
        } else if (/^on[A-Z].*/.test(key)) {
            // onClick 等事件绑定
            // dom[key.toLowerCase()] = props[key];
            // 批量更新时使用事件冒泡绑定到document上
            addEvent(dom, key.toLowerCase(), props[key]);
        }
         else {
            dom[key] = props[key];
        }
    }
}
function addChildrenDom(dom, children) {
    if (Array.isArray(children)) {
        for (var i = 0; i < children.length; i++) {
            mounted(children[i], dom);
        }
    }
    else if (typeof children === 'object' && children.props){
        mounted(children, dom);
    }
    else {
        // 如果是官方react 生成的虚拟dom 文本节点就是字符串or数字，如果想在该代码逻辑中可以处理 需要再包裹一层
       mounted(wrapVdom(children), dom);
    }
}
function createDom(vdom) {
    // vdom{
    //     $$typeof: Symbol(react.element)
    //     key: null
    //     props: {className: 'a', style: {…}, children: 'aaa'}
    //     ref: null
    //     type: "h1" || type: ƒ SubFComponent(props, ref)
    //     _owner: null
    //     _store: {validated: false}
    //     _self: undefined
    //     _source: {fileName: '/Users/xulin06/Project/learnReact/my-practice/src/index.js', lineNumber: 4, columnNumber: 15}
    //     [[Prototype]]: Object
    // }
    let { type, props, ref } = vdom;
    let dom;
    // 我们自己实现的文本节点是额外包裹了一层 {type: REACT_TEXT, props: 'aaa'}
    if (type === REACT_TEXT) {
        dom = document.createTextNode(props);
    } else if (typeof type === 'string') {
        // h1 div...
        dom = document.createElement(type);
    }
    else if (typeof type === 'function') {
        if (type.isReactComponent) {
            // 类组件
            return mountClassComponent(vdom);
        }
        // 函数组件
        return mountFunctionComponent(vdom);
    }
    else if (typeof type === 'object' && type.$$typeof === REACT_FORWARD_REF && type.render) {
        // 这样实现是可以的，因为render是函数确实是走类似函数组件的逻辑
        // 但是分开实现会更好些
        // return mountFunctionComponent({
        //     type: type.render,
        //     props,
        //     ref
        // });
        return mountForwardComponent(vdom);
    }
    if (props) {
        updateProps(dom, props);
        // number 0情况
        if (props.children !== undefined) {
            addChildrenDom(dom, props.children);
        }
    }
    // 为了通过虚拟dom获取真实dom时候可以获取都所以新增dom属性
    vdom.__proto__.dom = dom;
    if (ref) {
        // ref.current 指向真实dom
        ref.current = dom;
    }
    return dom;
}
function mountFunctionComponent(vdom) {
    let {type: fnComponent, props} = vdom;
    let renderVdom = fnComponent(props);
    vdom.__proto__.oldRenderVdom = renderVdom;
    return createDom(renderVdom);

}
function mountForwardComponent(vdom) {
    let {type, props, ref} = vdom;
    let fn = type.render;
    if (!fn) {
        return null;
    }
    let renderVdom = fn(props, ref);
    vdom.__proto__.oldRenderVdom = renderVdom;
    return createDom(renderVdom);
}
function mountClassComponent(vdom) {
    let {type: CComponent, props, ref} = vdom;
    var instance = new CComponent(props);
    var renderVdom = instance.render();
    instance.__proto__.oldRenderVdom = renderVdom;
    vdom.__proto__.classInstance = instance;
    // ref 指向类组件实例
    ref && (ref.current = instance);
    return createDom(renderVdom);
}
function render(vdom, container) {
    mounted(vdom, container);
}
function mounted(vdom, container) {
    container.appendChild(createDom(vdom));
}
// 根据虚拟dom获取真实dom
export function findDom(vdom) {
    if (!vdom) {
        return null;
    }
    if (!vdom.dom) {
        // 类组件和函数组件没有直接绑定真实dom 需要不断向下遍历到正常节点后获取真实dom节点
        vdom = vdom.classInstance ? vdom.classInstance.oldRenderVdom : vdom.oldRenderVdom;
        return findDom(vdom);
    }
    return vdom.dom;
}
export function compareTwoVdom(parentNode, oldVdom, newVdom) {
    let oldDom = findDom(oldVdom);
    let newDom = createDom(newVdom);
    oldDom.parentNode.replaceChild(newDom, oldDom);
}
const ReactDOM = {
    render
};
export default ReactDOM;
