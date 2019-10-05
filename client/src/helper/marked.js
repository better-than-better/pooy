import Marked from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-http';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-less';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-perl';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-wiki';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-http';
import 'prismjs/components/prism-nginx';
import 'prismjs/components/prism-coffeescript';
import 'prismjs/components/prism-git';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-io';
import 'prismjs/components/prism-pure';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-regex';
import 'prismjs/components/prism-scheme';
import 'prismjs/components/prism-stylus';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-wiki';
import 'prismjs/components/prism-makefile';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-matlab';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-ejs';
import 'prismjs/components/prism-basic';

/**
 * Function mark 解析 markdown
 * @param {String} str: markdown string
 * @param {Boolean} target: 是否需要标题钩子
 * @returns {String}
 */
function mark (str = '', target) {
  Marked.setOptions({
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    renderer: (() => {
      const renderer = new Marked.Renderer();

      // renderer.code = (text, lang, escaped) => {
      //   console.log('escaped', escaped)
      //   return `<pre class="line-numbers"><code class="language-${lang}">${text}</code></pre>`
      // }

      return renderer;
    })(),
    highlight: (code, type) => {
      const lan = Prism.languages;

      if (!Object.keys(lan).includes(type)) {
        type = 'markup';
      }

      return Prism.highlight(code, lan[type], type);
    }
  });

  return Marked(str);
}

export default mark;