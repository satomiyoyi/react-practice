import ReactDOM from './react-dom';
import React from './react';
class CComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            number: 0
        };
    }
    handleClick() {
        this.setState({
            number: this.state.number + 1
        });
        console.log(this.state.number);
        this.setState({
            number: this.state.number + 1
        });
        console.log(this.state.number);
    }
    render() {
        return (
            <div onClick={() => {console.log('divclick')}}>
                <p>{this.state.number}</p>
                <button onClick={() => this.handleClick()}>add</button>
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
