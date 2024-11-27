export default function (content, map, mate) {
  const modifyContent = content.replace(/{name}/g, '~Nie Wang');

  this.callback(null, modifyContent, map, mate);
}
