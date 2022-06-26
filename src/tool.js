import {REACT_TEXT} from './element';
export function wrapVdom (vdom) {
    // 方便后续数据对比 这里跟源码不同 string和number 包裹了一层
    if (typeof vdom === 'string' || typeof vdom === 'number') {
        return {
            type: REACT_TEXT,
            props: vdom
        }
    }
    return vdom;
}