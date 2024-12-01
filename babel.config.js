export default {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    ['import', { libraryName: 'antd', libraryDirectory: 'lib' }, 'antd'],
  ],
};
