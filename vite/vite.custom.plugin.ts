import path from 'path';
import { promises as fs } from 'fs';
import { NormalizedOutputOptions, OutputBundle } from 'rollup';

let bundlerNames: string[] = [];
let serviceWorkerFileName = '';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CustomPlugin(): any {
  return {
    name: 'vite-custom-plugin',
    apply: 'build',
    buildStart() {
      console.log('\n编译开始---->');
    },
    transform(src: string, id: string) {
      if (id.includes('temp/temp.txt')) {
        // 提取 Base64 编码的数据部分
        const base64Data = src.replace(/"/g, '').split(',')[1];

        // 将 Base64 编码的数据转换为 Uint8Array
        const binaryData = Uint8Array.from(atob(base64Data), c =>
          c.charCodeAt(0)
        );

        // 使用 TextDecoder 解码 Uint8Array 为字符串
        const decoder = new TextDecoder('utf-8');
        const decodedString = decoder.decode(binaryData);
        return `export default "${decodedString.replace('{name}', '聂旺')}"`;
      }

      if (id.includes('src/main.ts')) {
        serviceWorkerFileName = `service-worker-${new Date().toISOString()}`;
        src = src.replace('{service-worker}', `/${serviceWorkerFileName}.js`);
      }

      return src;
    },

    buildEnd() {
      console.log('\n编译结束---->');
    },

    writeBundle(options: NormalizedOutputOptions, bundle: OutputBundle) {
      options.sourcemap = false;
      bundlerNames = Object.keys(bundle);
    },

    async closeBundle() {
      console.log('\n打包结束---->');
      const sourceFilePath = path.join(__dirname, '../src/service-worker.js');
      const targetFilePath = path.join(__dirname, '../dist');
      const manifestSourceFilePath = path.join(
        __dirname,
        '../src/manifest.json'
      );

      try {
        const sourceContent = await fs.readFile(sourceFilePath, 'utf-8');
        const str = bundlerNames
          .filter(chunk => !chunk.includes('.map'))
          .reduce((pre, cur) => {
            pre += `'${cur}', `;
            return pre;
          }, '');

        await fs.writeFile(
          `${targetFilePath}/${serviceWorkerFileName}.js`,
          sourceContent.replace(/'{bundlers}'/g, str)
        );

        const manifestSourceContent = await fs.readFile(
          manifestSourceFilePath,
          'utf-8'
        );
        await fs.writeFile(
          `${targetFilePath}/manifest.json`,
          manifestSourceContent
        );
      } catch (e) {
        console.error('e-->', e);
      }
    },
  };
}
