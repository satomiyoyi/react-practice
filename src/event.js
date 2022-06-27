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
    let {store} = target;
    updateQueue.isBathingUpdate = true;
    let handler = store['on' + type];
    handler && handler();
    // 清理之前累积的回调方法 并且将批量更新职位false
    updateQueue.batchUpdate();
}