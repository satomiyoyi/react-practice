class Updater {
    constructor(classInstance) {
        this.classInstance = classInstance;
        this.penddingStates = [];
    }
    addState(partialState) {
        this.penddingStates.push(partialState);
        // 触发数据更新
        this.emitUpdate(partialState);
    }
    emitUpdate() {
        // 触发组件更新
        this.updateComponent();
    }
    getState() {
        let {classInstance, penddingStates} = this;
        let {state} = classInstance;
        penddingStates.forEach(item => {
            state = {...state, ...item};
        });
        penddingStates.length = 0;
        return state;
    }
    updateComponent() {
        let {classInstance, penddingStates} = this;
        // 优先判断是否存在新传入的属性 有新内容再更新
        if (penddingStates.length > 0) {
            // getState获取融合后的新属性和classInstance里的旧属性进行替换
            this.shouldUpdate(classInstance, this.getState())
        }
    }
    shouldUpdate(classInstance, newState) {
        classInstance.state = newState;
        // 触发实例的forceUpdate方法进行dom更新
        classInstance.forceUpdate();
    }
}
export class Component {
    // type 都为function组件做区分 typeof class A {} === 'function'
    static isReactComponent = true;
    constructor(props) {
        this.props = props;
        this.state = {};
        // 这里的this指向继承Component的实例
        // 更新逻辑都交个额外的class updater进行处理
        this.updater = new Updater(this);
    }
    setState(partialState) {
        this.updater.addState(partialState);
    }
    forceUpdate() {
        console.log(this.state);
    }
}