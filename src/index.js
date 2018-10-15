import css from'./style.css';

console.log('***css***', css);
// [
//   [3,"body {\n  background-color: aqua;\n}\n",""],
//   [0,"div {\n  color: red;\n}\n",""]
// ]

console.log('***css***', css.toString());
// "body {\n  background-color: aqua;\n}\n  div {\n  color: red;\n}\n"

function component() {
  const element = document.createElement('div');
  element.innerHTML = 'Hello World';
  return element;
}

document.body.appendChild(component());
