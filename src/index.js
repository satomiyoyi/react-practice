import ReactDOM from './react-dom';
import React from './react';
class SubCComponent extends React.Component {
    constructor(props) {
        super(props);
        this.input = React.createRef();
    }
    onFocusCallback() {
        this.input.current.focus();
    }

    render() {
        return (<input type="text" ref={this.input}/>);
    }
    
}
function SubFComponent(props, ref) {
    return <input ref={ref} type="text"/>
}
let FnComponentForward = React.forwardRef(SubFComponent);
// console.log(FnComponentForward);
// console.log(<FnComponentForward></FnComponentForward>);
// console.log(<SubFComponent></SubFComponent>)

class CComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            number: 0
        };
        this.inputRef = React.createRef();
    }
    handleClick() {
        // this.inputRef.current.focus();
        // this.inputRef.current指向sub类组件实例 调用该实例上的方法
        // this.inputRef.current.onFocusCallback();
        // this.inputRef 通过foward的形式直接获取到 函数组件dom本身
        this.inputRef.current.focus();
    }
    
    render() {
        return (
            <div>
                {/* <input type="text" ref={this.inputRef}></input> */}
                {/* <SubCComponent ref={this.inputRef}></SubCComponent> */}
                <FnComponentForward ref={this.inputRef}></FnComponentForward>
                <button onClick={() => this.handleClick()}>focus</button>
            </div>
        );
    }
}

// import React from './react';
// import ReactDOM from './react-dom';
// let element = <h1 className='a' style={{color: 'red'}}>aaa<span>ccc</span></h1>
// ReactDOM.render(element, document.getElementById('root'));
// 普通组件element1
// let element1 = React.createElement("h1", {
//   className: "title",
//   style: {
//     color: 'red'
//   },
//   name: "bbb"
// }, "aaa", React.createElement("span", null, "ccc"));
// 函数组件 element2
// function FComponent (props) {
//   return <h2 style={props.style}>{props.name}</h2>
// }
// let element2 = <FComponent style={{color: 'red'}} name="bbb"></FComponent>
// let element2 = React.createElement(FComponent, {
//   style: {
//     color: 'red'
//   },
//   name: "bbb"
// });
// let element3 = <CComponent></CComponent>;
let element3 = React.createElement(CComponent, null);
ReactDOM.render(element3, document.getElementById('root'));
// 这里的实现是将babel转化成的React.createElement后的逻辑进行实现。
// 输入
// React.createElement('h1', {
//     className: 'title',
//     style: {
//         color: 'red',
//     },
//     name: 'bbb',
// }, "aaa");
// 输出
// {
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
