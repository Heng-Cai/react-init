import './style.css';
import Icon from './icon.png';
import _ from 'lodash';

function dynamicImport() {
  return import(/* webpackChunkName: "module" */ './module')
           .then(({ default: log }) => log());
}

function component() {
  const element = document.createElement('div');
  const btnElement = document.createElement('button');
  btnElement.innerHTML = 'Dynamic Import';
  btnElement.onclick = dynamicImport
  const imgElement = new Image();
  imgElement.src = Icon;
  element.innerHTML = _.join(['Hello', 'World'], ' ');
  element.appendChild(imgElement);
  element.appendChild(btnElement);
  return element;
}

document.body.appendChild(component());
