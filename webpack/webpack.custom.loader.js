export default function CustomLoader(content, map, mate) {
  const modifyContent = content.replace(/{name}/g, 'Nie Wang');

  console.log('modifyContent-->', modifyContent);

  this.callback(null, modifyContent, map, mate);

  return modifyContent;
}
