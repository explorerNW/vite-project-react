export default function CustomPlugin() {
  return {
    name: 'vite-custom-plugin',
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
  };
}
