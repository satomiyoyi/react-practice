import { REACT_TEXT } from './element';
import {wrapVdom} from './tool';
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
            dom[key.toLowerCase()] = props[key];
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
    //     type: "h1"
    //     _owner: null
    //     _store: {validated: false}
    //     _self: undefined
    //     _source: {fileName: '/Users/xulin06/Project/learnReact/my-practice/src/index.js', lineNumber: 4, columnNumber: 15}
    //     [[Prototype]]: Object
    // }
    let { type, props } = vdom;
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
            return mountClassComponent(type, props);
        }
        // 函数组件
        return mountFunctionComponent(type, props);
        
    }
    if (props) {
        updateProps(dom, props);
        // number 0情况
        if (props.children !== undefined) {
            addChildrenDom(dom, props.children);
        }
    }
    return dom;
}
function mountFunctionComponent(fnComponent, props) {
    let vdom = fnComponent(props);
    return createDom(vdom);

}
function mountClassComponent (CComponent, props) {
    var instance = new CComponent(props);
    var vdom = instance.render();
    return createDom(vdom);
}
function render(vdom, container) {
    mounted(vdom, container);
}
function mounted(vdom, container) {
    container.appendChild(createDom(vdom));
}
const ReactDOM = {
    render,
};
export default ReactDOM;
