import { Plugin } from 'vite';
import path from 'path';
import { promises as fs } from 'fs';

export default function CustomPlugin(): Plugin {
  return {
    name: 'vite-custom-plugin',
    apply: 'build',
    buildStart() {
      console.log('\n编译开始---->');
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transform(src: any, id: any) {
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

    async closeBundle() {
      console.log('\n打包结束---->');
      const sourceFilePath = path.join(__dirname, '../src/service-worker.js');
      const targetFilePath = path.join(__dirname, '../dist');

      try {
        const sourceContent = await fs.readFile(sourceFilePath, 'utf-8');
        await fs.writeFile(
          `${targetFilePath}/service-worker.js`,
          sourceContent
        );
      } catch (e) {
        console.error('e-->', e);
      }
    },
  };
}
