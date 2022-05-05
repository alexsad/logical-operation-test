onmessage = function (evt) {
  evt.preventDefault();
  // console.log('Worker: Message received from main script');
  const timeToExp = Number(evt.data[0]);
  if (isNaN(timeToExp)) {
    self.postMessage('Please, put millisecond');
  } else {
    setTimeout(() => {
      self.postMessage(timeToExp);
    }, timeToExp);
  }
}