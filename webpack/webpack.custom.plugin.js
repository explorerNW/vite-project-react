export default class CustomPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit('CustomPlugin', compilation => {
      console.log('compilation--->', compilation);
    });
    compiler.hooks.done.tap('CustomPlugin', stats => {
      console.log('编译完成!');
    });
  }
}
