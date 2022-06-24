import {REACT_TEXT} from './element';
export function wrapVdom (vdom) {
    if (typeof vdom === 'string' || typeof vdom === 'number') {
        return {
            type: REACT_TEXT,
            props: vdom
        }
    }
    return vdom;
}