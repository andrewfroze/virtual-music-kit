function dispatchKeyDownEvent(keyElement) {
  keyElement.dispatchEvent(new MouseEvent('click'));
  keyElement.classList.add('active');
}

function dispatchKeyUpEvent(keyElement) {
  keyElement.classList.remove('active');
}

export { dispatchKeyDownEvent, dispatchKeyUpEvent }