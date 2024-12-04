import path from 'path';
import { promises as fs } from 'fs';
import { NormalizedOutputOptions, OutputBundle } from 'rollup';

let bundlerNames: string[] = [];
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

      try {
        const sourceContent = await fs.readFile(sourceFilePath, 'utf-8');
        const str = bundlerNames
          .filter(chunk => !chunk.includes('.map'))
          .reduce((pre, cur) => {
            pre += `'${cur}', `;
            return pre;
          }, '');

        await fs.writeFile(
          `${targetFilePath}/service-worker.js`,
          sourceContent.replace(/'{bundlers}'/g, str)
        );
      } catch (e) {
        console.error('e-->', e);
      }
    },
  };
}
