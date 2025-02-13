export default class CustomPlugin {
  name = 'CustomPlugin';
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.compile.tap(this.name, () => {
      console.log('编译开始---->');
    });
    compiler.hooks.emit.tap(this.name, compilation => {});
    compiler.hooks.done.tap(this.name, stats => {
      console.log('编译完成!');
    });
    compiler.hooks.afterDone.tap(this.name, res => {
      console.log('res.assets--->', res.compilation.assets);
    });
  }
}
