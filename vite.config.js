import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import vue2Jsx from '@vitejs/plugin-vue2-jsx'
import WindiCSS from 'vite-plugin-windicss'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import visualizer from 'rollup-plugin-visualizer'
import { viteMockServe } from 'vite-plugin-mock'

const config = defineConfig({
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}`,
      '@views': `${path.resolve(__dirname, 'src/views')}`,
      '#': `${path.resolve(__dirname, 'types')}`,
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          'namespace': 'curd-tool',
          'primary-color': '#1890ff',
          'text-color': '#c9d1d9',
          'primary-1': 'rgb(255 255 255 / 8%)',
          'text-color-base': '#c9d1d9',
          'component-background': '#151515',
          'heading-color': 'rgb(255 255 255 / 65%)',
          // black: '#0e1117',
          // #8b949e
          'text-color-secondary': '#8b949e',
          'border-color-base': '#303030',
          // 'border-color-split': '#30363d',
          'item-active-bg': '#111b26',
          'app-content-background': '#1e1e1e',
          'tree-node-selected-bg': '#11263c',

          'alert-success-border-color': '#274916',
          'alert-success-bg-color': '#162312',
          'alert-success-icon-color': '#49aa19',
          'alert-info-border-color': '#153450',
          'alert-info-bg-color': '#111b26',
          'alert-info-icon-color': '#177ddc',
          'alert-warning-border-color': '#594214',
          'alert-warning-bg-color': '#2b2111',
          'alert-warning-icon-color': '#d89614',
          'alert-error-border-color': '#58181c',
          'alert-error-bg-color': '#2a1215',
          'alert-error-icon-color': '#a61d24',
        },
        javascriptEnabled: true,
      },
    },
  },
  build: {
    minify: true,
    cssCodeSplit: false,
    rollupOptions: {
      external: ['vue', 'ant-design-vue', 'lodash-es'],
      output: {
        globals: {
          'vue': 'Vue',
          'ant-design-vue': 'antd',
          'lodash-es': 'lodash-es',
        },
      },
    },
    lib: {
      entry: path.resolve(__dirname, './src/components/Form/index.ts'),
      name: 'lib',
      // formats: ['es', 'cjs', 'umd', 'iife'],
      fileName: format => `lib.${format}.js`,
    },
  },
  esbuild: {
    // jsxInject: "import { h } from 'vue';",
    // jsxFactory: "h",
    // jsxFragment: "Fragment",
  },
  plugins: [
    vue({
      jsx: true,
      vueTemplateOptions: { compilerOptions: { whitespace: 'condense' } },
      jsxOptions: { compositionAPI: true },
    }),
    vue2Jsx(),
    WindiCSS(),
    visualizer({
      filename: './stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
    viteMockServe({
      ignore: /^\_/,
      mockPath: './mock',
      localEnabled: true,
      injectCode: `
        import { setupProdMockServer } from '../mock/_createProductionServer';
  
        setupProdMockServer();
        `,
    }),
    Components({
      resolvers: [
        IconsResolver({
          componentPrefix: '',
        }),
      ],
      dts: 'types/components.d.ts',
    }),
    Icons(),
    AutoImport({
      imports: ['@vueuse/core'],
      dts: 'types/auto-imports.d.ts',
    }),
  ],

  server: {
    port: 3333,
  },
})

export default config
