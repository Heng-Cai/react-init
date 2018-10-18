import './style.css';
import BackgroundImage from './bg.png';

console.log('***BackgroundImage***', BackgroundImage);

function component() {
  const element = document.createElement('div');
  const imgElement = new Image();
  imgElement.src = BackgroundImage;
  element.innerHTML = 'Hello World';
  element.appendChild(imgElement);
  return element;
}

document.body.appendChild(component());
