export class Component {
    // type 都为function组件做区分 typeof class A {} === 'function'
    static isReactComponent = true;
    constructor(props) {
        this.props = props;
    }
}