# react-practice
react16版本基本功能自行实现
## day1
1. 实现jsx解析成虚拟dom
2. 虚拟dom解析成真实dom添加到页面
3. 函数组件和类组件的实现和解析
## day2
1. setState 实现数据更新和dom更新
2. 批量更新

## day3
合成事件。需要统一不同浏览器下的事件触发逻辑。需要对事件进行封装。

## day4 ref实现
ref 提供了一种方式 允许访问dom节点或者在render方法中创建react元素
类组件，元素组件 可以直接使用ref属性
函数组件 需要React.forwardRef包裹函数组件，并且以参数形式传递ref，才能在函数组件中使用。所以实现会有些不同
1. 类组件元素组件 ref
2. React.forwardRef方法以及函数组件中ref
