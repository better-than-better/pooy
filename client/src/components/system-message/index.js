export default (message) => {
  return new Notification('Pooy', {
    body: message,
    // icon: 'http://note-cdn.hxtao.xyz/images/9e3d584664d0e88cbca58d8b.jpeg'
  });
}
