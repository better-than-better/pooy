import prettier from "prettier/standalone";
import parserHTML from "prettier/parser-html";
import parserCSS from "prettier/parser-postcss";
import parserFlow from "prettier/parser-flow";
import marked from '@helper/marked';

const parserEnum = {
  js: 'flow'
};

function pretty({ str, language }) {
  try {
    str = prettier.format(str, { parser: parserEnum[language] || language, plugins: [parserFlow, parserHTML, parserCSS, ] });
  } catch (err) {}

  str = marked('```' + `${language}\n` + str + '\n```');

  return str;
}

self.addEventListener('message', (e) => {
  self.postMessage(pretty(e.data));
});
