export default class CustomPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.compile.tap('CustomPlugin', () => {
      console.log('编译开始---->');
    });
    compiler.hooks.emit.tap('CustomPlugin', compilation => {});
    compiler.hooks.done.tap('CustomPlugin', stats => {
      console.log('编译完成!');
    });
  }
}
