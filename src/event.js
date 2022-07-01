import { updateQueue } from "./component";
export function addEvent(dom, eventType, handler) {
    let store = dom.store || (dom.store = {});
    store[eventType] = handler;
    if (!document[eventType]) {
        document[eventType] = dispatchEvent;
    }
}
function dispatchEvent(event) {
    let {target, type} = event;
    updateQueue.isBathingUpdate = true;
    let currentTarget = target;
    let syntheticEvent = createSyntheticEvent(event);
    while (currentTarget) {
        let {store} = currentTarget;
        let handler = store && store['on' + type];
        handler && handler(syntheticEvent);
        if (syntheticEvent.isStopPropagation) {
            break;
        }
        currentTarget = currentTarget.parentNode
    }
    // 清理之前累积的回调方法 并且将批量更新职位false
    updateQueue.batchUpdate();
}
function createSyntheticEvent(nativeEvent) {
    let syntheticEvent = {};
    syntheticEvent.nativeEvent = nativeEvent;
    for (let key in nativeEvent) {
        let value = nativeEvent[key];
        if (typeof value === 'function') {
            syntheticEvent[key] = value;
        }
    }
    syntheticEvent.isPreventDefault = false;
    syntheticEvent.preventDefault = preventDefault;
    syntheticEvent.isStopPropagation = false;
    syntheticEvent.stopPropagation = stopPropagation;
    return syntheticEvent;
}
function preventDefault() {
    let nativeEvent = this.nativeEvent;
    if (nativeEvent.preventDefault) {
        nativeEvent.preventDefault();
    }
    this.isPreventDefault = true;
}
function stopPropagation() {
    let nativeEvent = this.nativeEvent;
    if (nativeEvent.stopPropagation) {
        nativeEvent.stopPropagation();
    }
    this.isStopPropagation = true;
}