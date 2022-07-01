import {compareTwoVdom, findDom}from './react-dom';
// 批量更新 要有标识标记当前更新操作执行之前
// 所有的setState操作回调进行累加
export let updateQueue = {
    isBathingUpdate: false,
    updater: new Set(),
    batchUpdate() {
        // 批量存储后的最终触发
        updateQueue.isBathingUpdate = false;
        for (let updater of updateQueue.updater) {
            updater.updateComponent();
        }
        updateQueue.updater.clear();
    }
};
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
        // this.updateComponent();
        // 批量更新
        if (updateQueue.isBathingUpdate) {
            // 存储当前实例 在setState中不进行真正的更新操作
            updateQueue.updater.add(this);
        }
        else {
            this.updateComponent();
        }
    }
    getState() {
        let { classInstance, penddingStates } = this;
        let { state } = classInstance;
        penddingStates.forEach((item) => {
            state = { ...state, ...item };
        });
        penddingStates.length = 0;
        return state;
    }
    updateComponent() {
        let { classInstance, penddingStates } = this;
        // 优先判断是否存在新传入的属性 有新内容再更新
        if (penddingStates.length > 0) {
            // getState获取融合后的新属性和classInstance里的旧属性进行替换
            this.shouldUpdate(classInstance, this.getState());
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
        // 真实dom 更新需要从实例上获取到真实dom
        let oldRenderVdom = this.oldRenderVdom;
        let oldDom = findDom(oldRenderVdom);
        let newRenderVdom = this.render();
        compareTwoVdom(oldDom.parentNode, oldRenderVdom, newRenderVdom);
        this.oldRenderVdom = newRenderVdom;
    }
}
