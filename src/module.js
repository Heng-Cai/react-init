import './style.css';
import Icon from './icon.png';

function component() {
  const element = document.createElement('div');
  const imgElement = new Image();
  imgElement.src = Icon;
  element.innerHTML = 'module';
  element.appendChild(imgElement);
  return element;
}

document.body.appendChild(component());