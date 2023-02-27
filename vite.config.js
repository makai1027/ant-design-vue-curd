import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
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

  build: {
    minify: true,
  },

  plugins: [
    vue(),
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
