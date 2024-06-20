<script lang="ts" setup>
// 能正常使用的导入，忽略错误
// eslint-disable-next-line
// @ts-expect-error
import { Editor } from '@bytemd/vue-next'
import type { BytemdPlugin } from 'bytemd'
import gfm from '@bytemd/plugin-gfm'
import frontMatter from '@bytemd/plugin-frontmatter'
import mathSsr from '@bytemd/plugin-math-ssr'
import highlight from '@bytemd/plugin-highlight-ssr'
import mediumZoom from '@bytemd/plugin-medium-zoom'
import emoji from '@bytemd/plugin-gemoji'
import mermaid from '@bytemd/plugin-mermaid'
import 'highlight.js/styles/github.css'
import byteZh from 'bytemd/locales/zh_Hans.json'
import gfmZhHans from '@bytemd/plugin-gfm/locales/zh_Hans.json'
import mermaidZhHans from '@bytemd/plugin-mermaid/locales/zh_Hans.json'
import 'bytemd/dist/index.css'

const plugins: BytemdPlugin[] = [
  gfm({ locale: gfmZhHans }),
  frontMatter(),
  mathSsr({
    locale: {
      inline: '行内公式',
      inlineText: '行内公式',
      block: '块级公式',
      blockText: '块级公式'
    },
    katexOptions: {
      output: 'mathml'
    }
  }),
  highlight(),
  mediumZoom(),
  emoji(),
  mermaid({ locale: mermaidZhHans })
]

const model = defineModel<string>({ default: '' })

const handleChange = (v: string) => {
  model.value = v
}
</script>

<template>
  <Editor :locale="byteZh" :plugins="plugins" :value="model" @change="handleChange" />
</template>

<style lang="scss">
@import 'theme.scss';

// 设置整个编辑器的高度
.bytemd {
  height: calc(100vh - 300px);
}
.bytemd-fullscreen {
  z-index: 60;
}
</style>
