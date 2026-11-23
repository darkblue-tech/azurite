export type CodeLanguage =
  | 'tsx'
  | 'ts'
  | 'typescript'
  | 'jsx'
  | 'js'
  | 'javascript'
  | 'css'
  | 'html'
  | 'xml'
  | 'json'
  | 'bash'
  | 'sh'
  | 'shell'
  | 'python'
  | 'py'
  | 'sql'
  | 'yaml'
  | 'yml'
  | 'markdown'
  | 'md'
  | 'text'
  | 'plain'
  | (string & {});

export type SyntaxTokenType =
  | 'plain'
  | 'comment'
  | 'string'
  | 'number'
  | 'keyword'
  | 'operator'
  | 'punctuation'
  | 'function'
  | 'type'
  | 'tag'
  | 'attr'
  | 'property'
  | 'variable'
  | 'boolean';

export interface SyntaxToken {
  type: SyntaxTokenType;
  value: string;
}

const LANGUAGE_ALIASES: Record<string, string> = {
  tsx: 'tsx',
  ts: 'typescript',
  typescript: 'typescript',
  jsx: 'jsx',
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  javascript: 'javascript',
  css: 'css',
  scss: 'css',
  html: 'html',
  htm: 'html',
  xml: 'html',
  svg: 'html',
  json: 'json',
  jsonc: 'json',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  cli: 'bash',
  py: 'python',
  python: 'python',
  sql: 'sql',
  yaml: 'yaml',
  yml: 'yaml',
  md: 'markdown',
  mdx: 'markdown',
  markdown: 'markdown',
  txt: 'text',
  text: 'text',
  plain: 'text',
};

const LANGUAGE_LABELS: Record<string, string> = {
  tsx: 'TSX',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  jsx: 'JSX',
  js: 'JavaScript',
  mjs: 'JavaScript',
  cjs: 'JavaScript',
  javascript: 'JavaScript',
  css: 'CSS',
  scss: 'CSS',
  html: 'HTML',
  htm: 'HTML',
  xml: 'XML',
  svg: 'SVG',
  json: 'JSON',
  jsonc: 'JSON',
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  zsh: 'Zsh',
  cli: 'CLI',
  py: 'Python',
  python: 'Python',
  sql: 'SQL',
  yaml: 'YAML',
  yml: 'YAML',
  md: 'Markdown',
  mdx: 'MDX',
  markdown: 'Markdown',
  txt: 'Plain Text',
  text: 'Plain Text',
  plain: 'Plain Text',
};

export function normalizeLanguage(language?: string): string {
  if (!language) return 'text';
  const key = language.trim().toLowerCase();
  return LANGUAGE_ALIASES[key] ?? 'text';
}

export function getLanguageLabel(language?: string): string {
  if (!language) return 'Plain Text';
  const key = language.trim().toLowerCase();
  return LANGUAGE_LABELS[key] ?? language.toUpperCase();
}

function pushToken(out: SyntaxToken[], type: SyntaxTokenType, value: string): void {
  if (!value) return;
  const last = out[out.length - 1];
  if (last && last.type === type) {
    last.value += value;
  } else {
    out.push({ type, value });
  }
}

function splitTokensByLine(tokens: SyntaxToken[]): SyntaxToken[][] {
  const lines: SyntaxToken[][] = [[]];
  for (const token of tokens) {
    if (!token.value.includes('\n')) {
      pushToken(lines[lines.length - 1], token.type, token.value);
      continue;
    }
    const parts = token.value.split('\n');
    for (let p = 0; p < parts.length; p++) {
      if (p > 0) lines.push([]);
      if (parts[p].length > 0) {
        pushToken(lines[lines.length - 1], token.type, parts[p]);
      }
    }
  }
  return lines;
}

const SCRIPT_KEYWORDS = new Set([
  'import',
  'from',
  'export',
  'default',
  'function',
  'const',
  'let',
  'var',
  'return',
  'if',
  'else',
  'switch',
  'case',
  'break',
  'continue',
  'for',
  'of',
  'in',
  'while',
  'do',
  'try',
  'catch',
  'finally',
  'throw',
  'new',
  'typeof',
  'instanceof',
  'void',
  'delete',
  'await',
  'async',
  'yield',
  'class',
  'extends',
  'implements',
  'interface',
  'type',
  'enum',
  'namespace',
  'as',
  'is',
  'keyof',
  'readonly',
  'declare',
  'public',
  'private',
  'protected',
  'static',
  'abstract',
  'satisfies',
  'infer',
  'this',
  'super',
]);

const SCRIPT_BOOLEANS = new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity']);

const SCRIPT_TYPES = new Set([
  'string',
  'number',
  'boolean',
  'unknown',
  'never',
  'any',
  'object',
  'symbol',
  'bigint',
  'ReactNode',
  'ElementType',
  'CSSProperties',
  'Record',
  'Partial',
  'Required',
  'Readonly',
  'Pick',
  'Omit',
  'Promise',
  'Array',
  'Map',
  'Set',
]);

function isIdentStart(ch: string): boolean {
  return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '_' || ch === '$';
}

function isIdentChar(ch: string): boolean {
  return isIdentStart(ch) || (ch >= '0' && ch <= '9');
}

function isDigit(ch: string): boolean {
  return ch >= '0' && ch <= '9';
}

function isWhitespace(ch: string): boolean {
  return ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r';
}

function readQuoted(src: string, start: number, quote: string): number {
  let i = start + 1;
  while (i < src.length) {
    const ch = src[i];
    if (ch === '\\') {
      i += 2;
      continue;
    }
    if (ch === quote) {
      return i + 1;
    }
    if (ch === '\n' && quote !== '`') {
      return i;
    }
    i++;
  }
  return src.length;
}

function skipWs(src: string, i: number): number {
  while (i < src.length && (src[i] === ' ' || src[i] === '\t' || src[i] === '\n')) {
    i++;
  }
  return i;
}

function isLikelyJsxTagStart(src: string, ltIndex: number, prevSigToken: SyntaxToken | undefined): boolean {
  const afterLt = src.slice(ltIndex + 1);
  if (afterLt.startsWith('/')) {
    return /^\/[A-Za-z][\w$.-]*\s*>/.test(afterLt);
  }
  const tagMatch = /^([A-Za-z][\w$.-]*)/.exec(afterLt);
  if (!tagMatch) return false;
  const ident = tagMatch[1];
  const restIdx = ltIndex + 1 + ident.length;
  const nextCh = src[restIdx] ?? '';
  if (nextCh === '<' || nextCh === '(' || nextCh === ',' || nextCh === '|' || nextCh === '&') {
    return false;
  }
  if (/^\s+extends\b/.test(src.slice(restIdx))) {
    return false;
  }
  // Avoid matching `a < b` comparison unless preceded by expression context or PascalCase/HTML opening
  if (prevSigToken) {
    const pv = prevSigToken.value;
    if (
      prevSigToken.type === 'number' ||
      (prevSigToken.type === 'plain' && prevSigToken.value !== 'return') ||
      pv === ')' ||
      pv === ']'
    ) {
      // Could be JSX after `return` or `=>`, otherwise check if immediately `>` or attribute follows
      if (!/^(\s+[A-Za-z_:][\w:-]*\s*=|\s*\/?>)/.test(src.slice(restIdx))) {
        return false;
      }
    }
  }
  return nextCh === '>' || nextCh === '/' || isWhitespace(nextCh);
}

function tokenizeScript(src: string, isJsx: boolean): SyntaxToken[] {
  const tokens: SyntaxToken[] = [];
  const n = src.length;
  let i = 0;
  let prevSig: SyntaxToken | undefined;

  const emit = (type: SyntaxTokenType, val: string) => {
    pushToken(tokens, type, val);
    if (type !== 'comment' && val.trim().length > 0) {
      prevSig = { type, value: val.trim() };
    }
  };

  while (i < n) {
    const start = i;
    const ch = src[i];

    // Whitespace
    if (isWhitespace(ch)) {
      let j = i + 1;
      while (j < n && isWhitespace(src[j])) j++;
      pushToken(tokens, 'plain', src.slice(i, j));
      i = j;
      continue;
    }

    // Comments
    if (ch === '/' && src[i + 1] === '/') {
      const nl = src.indexOf('\n', i);
      const end = nl === -1 ? n : nl;
      emit('comment', src.slice(i, end));
      i = end;
      continue;
    }
    if (ch === '/' && src[i + 1] === '*') {
      const endIdx = src.indexOf('*/', i + 2);
      const end = endIdx === -1 ? n : endIdx + 2;
      emit('comment', src.slice(i, end));
      i = end;
      continue;
    }

    // Single/double quoted strings
    if (ch === '"' || ch === "'") {
      const end = readQuoted(src, i, ch);
      emit('string', src.slice(i, end));
      i = end;
      continue;
    }

    // Template literal with ${expr} interpolation
    if (ch === '`') {
      let strStart = i;
      i++;
      while (i < n) {
        if (src[i] === '\\') {
          i += 2;
          continue;
        }
        if (src[i] === '`') {
          i++;
          emit('string', src.slice(strStart, i));
          break;
        }
        if (src[i] === '$' && src[i + 1] === '{') {
          emit('string', src.slice(strStart, i));
          emit('punctuation', '${');
          i += 2;
          const exprStart = i;
          let depth = 1;
          while (i < n && depth > 0) {
            const c = src[i];
            if (c === '"' || c === "'" || c === '`') {
              i = readQuoted(src, i, c);
              continue;
            }
            if (c === '{') depth++;
            else if (c === '}') {
              depth--;
              if (depth === 0) break;
            }
            i++;
          }
          const inner = tokenizeScript(src.slice(exprStart, i), isJsx);
          for (const t of inner) emit(t.type, t.value);
          if (i < n && src[i] === '}') {
            emit('punctuation', '}');
            i++;
          }
          strStart = i;
          continue;
        }
        i++;
      }
      if (i >= n && strStart < n && src[i - 1] !== '`') {
        emit('string', src.slice(strStart, n));
      }
      continue;
    }

    // JSX tags
    if (isJsx && ch === '<' && isLikelyJsxTagStart(src, i, prevSig)) {
      if (src[i + 1] === '/') {
        emit('punctuation', '</');
        i += 2;
        const nameStart = i;
        while (i < n && /[\w$.-]/.test(src[i])) i++;
        emit('tag', src.slice(nameStart, i));
        const ws = skipWs(src, i);
        if (ws > i) {
          pushToken(tokens, 'plain', src.slice(i, ws));
          i = ws;
        }
        if (src[i] === '>') {
          emit('punctuation', '>');
          i++;
        }
        continue;
      }

      emit('punctuation', '<');
      i++;
      const nameStart = i;
      while (i < n && /[\w$.-]/.test(src[i])) i++;
      emit('tag', src.slice(nameStart, i));

      // Scan attributes inside opening JSX tag
      while (i < n) {
        const ws = skipWs(src, i);
        if (ws > i) {
          pushToken(tokens, 'plain', src.slice(i, ws));
          i = ws;
        }
        if (i >= n) break;
        if (src[i] === '/' && src[i + 1] === '>') {
          emit('punctuation', '/>');
          i += 2;
          break;
        }
        if (src[i] === '>') {
          emit('punctuation', '>');
          i++;
          break;
        }
        if (src[i] === '{') {
          emit('punctuation', '{');
          i++;
          const exprStart = i;
          let depth = 1;
          while (i < n && depth > 0) {
            const c = src[i];
            if (c === '"' || c === "'" || c === '`') {
              i = readQuoted(src, i, c);
              continue;
            }
            if (c === '/' && src[i + 1] === '/') {
              const nl = src.indexOf('\n', i);
              i = nl === -1 ? n : nl;
              continue;
            }
            if (c === '/' && src[i + 1] === '*') {
              const endC = src.indexOf('*/', i + 2);
              i = endC === -1 ? n : endC + 2;
              continue;
            }
            if (c === '{') depth++;
            else if (c === '}') {
              depth--;
              if (depth === 0) break;
            }
            i++;
          }
          const inner = tokenizeScript(src.slice(exprStart, i), isJsx);
          for (const t of inner) emit(t.type, t.value);
          if (i < n && src[i] === '}') {
            emit('punctuation', '}');
            i++;
          }
          continue;
        }
        if (/[A-Za-z_:]/.test(src[i])) {
          const attrStart = i;
          while (i < n && /[\w:-]/.test(src[i])) i++;
          emit('attr', src.slice(attrStart, i));
          const afterAttr = skipWs(src, i);
          if (afterAttr > i) {
            pushToken(tokens, 'plain', src.slice(i, afterAttr));
            i = afterAttr;
          }
          if (src[i] === '=') {
            emit('operator', '=');
            i++;
            const afterEq = skipWs(src, i);
            if (afterEq > i) {
              pushToken(tokens, 'plain', src.slice(i, afterEq));
              i = afterEq;
            }
            if (src[i] === '"' || src[i] === "'") {
              const end = readQuoted(src, i, src[i]);
              emit('string', src.slice(i, end));
              i = end;
            }
          }
          continue;
        }
        emit('plain', src[i]);
        i++;
      }
      continue;
    }

    // Numbers
    if (isDigit(ch) || (ch === '.' && i + 1 < n && isDigit(src[i + 1]))) {
      const m = /^(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|\d[\d_]*(?:\.[\d_]+)?(?:[eE][+-]?\d+)?n?|\.\d[\d_]*(?:[eE][+-]?\d+)?)/.exec(
        src.slice(i),
      );
      if (m) {
        emit('number', m[0]);
        i += m[0].length;
        continue;
      }
    }

    // Identifiers
    if (isIdentStart(ch)) {
      let j = i + 1;
      while (j < n && isIdentChar(src[j])) j++;
      const word = src.slice(i, j);
      const afterWs = skipWs(src, j);
      const isCall = src[afterWs] === '(';
      const isMember = prevSig?.type === 'punctuation' && prevSig.value === '.';

      if (SCRIPT_KEYWORDS.has(word)) {
        emit('keyword', word);
      } else if (SCRIPT_BOOLEANS.has(word)) {
        emit('boolean', word);
      } else if (SCRIPT_TYPES.has(word)) {
        emit('type', word);
      } else if (isMember) {
        emit(isCall ? 'function' : 'property', word);
      } else if (isCall) {
        emit('function', word);
      } else if (/^[A-Z][A-Za-z0-9_]*$/.test(word) && /[a-z]/.test(word)) {
        emit('type', word);
      } else {
        emit('plain', word);
      }
      i = j;
      continue;
    }

    // Multi-char operators
    const three = src.slice(i, i + 3);
    if (three === '===' || three === '!==' || three === '...' || three === '??=') {
      emit('operator', three);
      i += 3;
      continue;
    }
    const two = src.slice(i, i + 2);
    if (
      two === '=>' ||
      two === '==' ||
      two === '!=' ||
      two === '<=' ||
      two === '>=' ||
      two === '&&' ||
      two === '||' ||
      two === '??' ||
      two === '?.' ||
      two === '++' ||
      two === '--' ||
      two === '+=' ||
      two === '-=' ||
      two === '*=' ||
      two === '/='
    ) {
      emit('operator', two);
      i += 2;
      continue;
    }

    if ('+-*/%=<>!&|^~?:'.includes(ch)) {
      emit('operator', ch);
      i++;
      continue;
    }

    if ('{}()[],;.'.includes(ch)) {
      emit('punctuation', ch);
      i++;
      continue;
    }

    emit('plain', ch);
    i++;
    if (i === start) i++;
  }

  return tokens;
}

function tokenizeJson(src: string): SyntaxToken[] {
  const tokens: SyntaxToken[] = [];
  const n = src.length;
  let i = 0;

  while (i < n) {
    const ch = src[i];
    if (isWhitespace(ch)) {
      let j = i + 1;
      while (j < n && isWhitespace(src[j])) j++;
      pushToken(tokens, 'plain', src.slice(i, j));
      i = j;
      continue;
    }
    if (ch === '/' && src[i + 1] === '/') {
      const nl = src.indexOf('\n', i);
      const end = nl === -1 ? n : nl;
      pushToken(tokens, 'comment', src.slice(i, end));
      i = end;
      continue;
    }
    if (ch === '/' && src[i + 1] === '*') {
      const endIdx = src.indexOf('*/', i + 2);
      const end = endIdx === -1 ? n : endIdx + 2;
      pushToken(tokens, 'comment', src.slice(i, end));
      i = end;
      continue;
    }
    if (ch === '"') {
      const end = readQuoted(src, i, '"');
      const after = skipWs(src, end);
      pushToken(tokens, src[after] === ':' ? 'property' : 'string', src.slice(i, end));
      i = end;
      continue;
    }
    const numMatch = /^-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(src.slice(i));
    if (numMatch) {
      pushToken(tokens, 'number', numMatch[0]);
      i += numMatch[0].length;
      continue;
    }
    const boolMatch = /^(?:true|false|null)\b/.exec(src.slice(i));
    if (boolMatch) {
      pushToken(tokens, 'boolean', boolMatch[0]);
      i += boolMatch[0].length;
      continue;
    }
    if ('{}[]:,'.includes(ch)) {
      pushToken(tokens, 'punctuation', ch);
      i++;
      continue;
    }
    pushToken(tokens, 'plain', ch);
    i++;
  }

  return tokens;
}

function tokenizeCss(src: string): SyntaxToken[] {
  const tokens: SyntaxToken[] = [];
  const n = src.length;
  let i = 0;
  let braceDepth = 0;

  while (i < n) {
    const ch = src[i];
    if (isWhitespace(ch)) {
      let j = i + 1;
      while (j < n && isWhitespace(src[j])) j++;
      pushToken(tokens, 'plain', src.slice(i, j));
      i = j;
      continue;
    }
    if (ch === '/' && src[i + 1] === '*') {
      const endIdx = src.indexOf('*/', i + 2);
      const end = endIdx === -1 ? n : endIdx + 2;
      pushToken(tokens, 'comment', src.slice(i, end));
      i = end;
      continue;
    }
    if (ch === '"' || ch === "'") {
      const end = readQuoted(src, i, ch);
      pushToken(tokens, 'string', src.slice(i, end));
      i = end;
      continue;
    }
    if (ch === '@') {
      const m = /^@[a-zA-Z-]+/.exec(src.slice(i));
      if (m) {
        pushToken(tokens, 'keyword', m[0]);
        i += m[0].length;
        continue;
      }
    }
    if (ch === '-' && src[i + 1] === '-') {
      const m = /^--[a-zA-Z0-9_-]+/.exec(src.slice(i));
      if (m) {
        pushToken(tokens, 'variable', m[0]);
        i += m[0].length;
        continue;
      }
    }
    if (ch === '!' && /^!important\b/.test(src.slice(i))) {
      pushToken(tokens, 'keyword', '!important');
      i += 10;
      continue;
    }
    if (ch === '#' && /^#[0-9a-fA-F]{3,8}\b/.test(src.slice(i)) && braceDepth > 0) {
      const m = /^#[0-9a-fA-F]{3,8}/.exec(src.slice(i))!;
      pushToken(tokens, 'number', m[0]);
      i += m[0].length;
      continue;
    }
    if ((isDigit(ch) || (ch === '.' && i + 1 < n && isDigit(src[i + 1])) || (ch === '-' && isDigit(src[i + 1] ?? ''))) && braceDepth > 0) {
      const m = /^-?(?:\d+(?:\.\d+)?|\.\d+)(?:%|px|rem|em|vh|vw|vmin|vmax|deg|rad|ms|s|fr)?/.exec(
        src.slice(i),
      );
      if (m) {
        pushToken(tokens, 'number', m[0]);
        i += m[0].length;
        continue;
      }
    }
    if (ch === '{') {
      braceDepth++;
      pushToken(tokens, 'punctuation', '{');
      i++;
      continue;
    }
    if (ch === '}') {
      braceDepth = Math.max(0, braceDepth - 1);
      pushToken(tokens, 'punctuation', '}');
      i++;
      continue;
    }
    if ('();:,'.includes(ch)) {
      pushToken(tokens, 'punctuation', ch);
      i++;
      continue;
    }

    if (braceDepth === 0) {
      const selMatch = /^[.#:]?[a-zA-Z_*][a-zA-Z0-9_-]*/.exec(src.slice(i));
      if (selMatch) {
        pushToken(tokens, 'tag', selMatch[0]);
        i += selMatch[0].length;
        continue;
      }
    } else {
      const identMatch = /^[a-zA-Z_][a-zA-Z0-9_-]*/.exec(src.slice(i));
      if (identMatch) {
        const after = skipWs(src, i + identMatch[0].length);
        if (src[after] === ':') {
          pushToken(tokens, 'property', identMatch[0]);
        } else if (src[after] === '(') {
          pushToken(tokens, 'function', identMatch[0]);
        } else {
          pushToken(tokens, 'plain', identMatch[0]);
        }
        i += identMatch[0].length;
        continue;
      }
    }

    pushToken(tokens, 'plain', ch);
    i++;
  }

  return tokens;
}

function tokenizeHtml(src: string): SyntaxToken[] {
  const tokens: SyntaxToken[] = [];
  const n = src.length;
  let i = 0;

  while (i < n) {
    if (src.startsWith('<!--', i)) {
      const endIdx = src.indexOf('-->', i + 4);
      const end = endIdx === -1 ? n : endIdx + 3;
      pushToken(tokens, 'comment', src.slice(i, end));
      i = end;
      continue;
    }
    if (src[i] === '<') {
      const doctype = /^<!DOCTYPE[^>]*>/i.exec(src.slice(i));
      if (doctype) {
        pushToken(tokens, 'keyword', doctype[0]);
        i += doctype[0].length;
        continue;
      }
      const isClosing = src[i + 1] === '/';
      pushToken(tokens, 'punctuation', isClosing ? '</' : '<');
      i += isClosing ? 2 : 1;
      const tagMatch = /^[A-Za-z][\w:-]*/.exec(src.slice(i));
      if (tagMatch) {
        pushToken(tokens, 'tag', tagMatch[0]);
        i += tagMatch[0].length;
      }
      while (i < n) {
        if (isWhitespace(src[i])) {
          let j = i + 1;
          while (j < n && isWhitespace(src[j])) j++;
          pushToken(tokens, 'plain', src.slice(i, j));
          i = j;
          continue;
        }
        if (src[i] === '/' && src[i + 1] === '>') {
          pushToken(tokens, 'punctuation', '/>');
          i += 2;
          break;
        }
        if (src[i] === '>') {
          pushToken(tokens, 'punctuation', '>');
          i++;
          break;
        }
        if (src[i] === '=') {
          pushToken(tokens, 'operator', '=');
          i++;
          continue;
        }
        if (src[i] === '"' || src[i] === "'") {
          const end = readQuoted(src, i, src[i]);
          pushToken(tokens, 'string', src.slice(i, end));
          i = end;
          continue;
        }
        const attrMatch = /^[A-Za-z_:][\w:.-]*/.exec(src.slice(i));
        if (attrMatch) {
          pushToken(tokens, 'attr', attrMatch[0]);
          i += attrMatch[0].length;
          continue;
        }
        pushToken(tokens, 'plain', src[i]);
        i++;
      }
      continue;
    }
    if (src[i] === '&') {
      const ent = /^&[a-zA-Z0-9#]+;/.exec(src.slice(i));
      if (ent) {
        pushToken(tokens, 'boolean', ent[0]);
        i += ent[0].length;
        continue;
      }
    }
    let j = i + 1;
    while (j < n && src[j] !== '<' && src[j] !== '&') j++;
    pushToken(tokens, 'plain', src.slice(i, j));
    i = j;
  }

  return tokens;
}

const BASH_KEYWORDS = new Set([
  'if',
  'then',
  'elif',
  'else',
  'fi',
  'for',
  'in',
  'do',
  'done',
  'case',
  'esac',
  'while',
  'until',
  'function',
  'export',
  'local',
  'readonly',
  'return',
  'exit',
  'set',
  'unset',
  'true',
  'false',
]);

const BASH_COMMANDS = new Set([
  'npm',
  'npx',
  'pnpm',
  'yarn',
  'bun',
  'node',
  'deno',
  'git',
  'mkdir',
  'ln',
  'cp',
  'mv',
  'rm',
  'cd',
  'ls',
  'cat',
  'echo',
  'printf',
  'grep',
  'rg',
  'find',
  'curl',
  'wget',
  'claude',
  'docker',
  'python',
  'python3',
  'pip',
  'sudo',
  'chmod',
  'touch',
  'head',
  'tail',
  'jq',
  'azurite',
  'graphify',
]);

function tokenizeBash(src: string): SyntaxToken[] {
  const tokens: SyntaxToken[] = [];
  const n = src.length;
  let i = 0;
  let atCmdPos = true;

  while (i < n) {
    const ch = src[i];
    if (ch === '\n') {
      pushToken(tokens, 'plain', '\n');
      atCmdPos = true;
      i++;
      continue;
    }
    if (ch === ' ' || ch === '\t' || ch === '\r') {
      let j = i + 1;
      while (j < n && (src[j] === ' ' || src[j] === '\t' || src[j] === '\r')) j++;
      pushToken(tokens, 'plain', src.slice(i, j));
      i = j;
      continue;
    }
    if (ch === '#') {
      const nl = src.indexOf('\n', i);
      const end = nl === -1 ? n : nl;
      pushToken(tokens, 'comment', src.slice(i, end));
      i = end;
      continue;
    }
    if (ch === '"' || ch === "'") {
      const end = readQuoted(src, i, ch);
      pushToken(tokens, 'string', src.slice(i, end));
      atCmdPos = false;
      i = end;
      continue;
    }
    if (ch === '$') {
      const m = /^(?:\$\{[^}]+\}|\$[A-Za-z0-9_?@#*]+)/.exec(src.slice(i));
      if (m) {
        pushToken(tokens, 'variable', m[0]);
        atCmdPos = false;
        i += m[0].length;
        continue;
      }
    }
    if (ch === '-' && (i === 0 || /\s/.test(src[i - 1]))) {
      const m = /^--?[a-zA-Z0-9_-]+/.exec(src.slice(i));
      if (m) {
        pushToken(tokens, 'attr', m[0]);
        atCmdPos = false;
        i += m[0].length;
        continue;
      }
    }
    const two = src.slice(i, i + 2);
    if (two === '&&' || two === '||' || two === '>>' || two === '<<') {
      pushToken(tokens, 'operator', two);
      atCmdPos = true;
      i += 2;
      continue;
    }
    if ('|;&><='.includes(ch)) {
      pushToken(tokens, 'operator', ch);
      atCmdPos = ch !== '=' && ch !== '>' && ch !== '<';
      i++;
      continue;
    }
    const wordMatch = /^[A-Za-z_@/.~-][\w@/.:~-]*/.exec(src.slice(i));
    if (wordMatch) {
      const w = wordMatch[0];
      if (BASH_KEYWORDS.has(w)) {
        pushToken(tokens, 'keyword', w);
      } else if (atCmdPos || BASH_COMMANDS.has(w)) {
        pushToken(tokens, 'function', w);
      } else if (/^\d+$/.test(w)) {
        pushToken(tokens, 'number', w);
      } else {
        pushToken(tokens, 'plain', w);
      }
      atCmdPos = false;
      i += w.length;
      continue;
    }
    if (isDigit(ch)) {
      const m = /^\d+/.exec(src.slice(i))!;
      pushToken(tokens, 'number', m[0]);
      atCmdPos = false;
      i += m[0].length;
      continue;
    }
    pushToken(tokens, 'plain', ch);
    atCmdPos = false;
    i++;
  }

  return tokens;
}

const PY_KEYWORDS = new Set([
  'False',
  'None',
  'True',
  'and',
  'as',
  'assert',
  'async',
  'await',
  'break',
  'class',
  'continue',
  'def',
  'del',
  'elif',
  'else',
  'except',
  'finally',
  'for',
  'from',
  'global',
  'if',
  'import',
  'in',
  'is',
  'lambda',
  'nonlocal',
  'not',
  'or',
  'pass',
  'raise',
  'return',
  'try',
  'while',
  'with',
  'yield',
  'match',
  'case',
  'self',
]);

function tokenizePython(src: string): SyntaxToken[] {
  const tokens: SyntaxToken[] = [];
  const n = src.length;
  let i = 0;
  let prevChar = '';

  while (i < n) {
    const ch = src[i];
    if (isWhitespace(ch)) {
      let j = i + 1;
      while (j < n && isWhitespace(src[j])) j++;
      pushToken(tokens, 'plain', src.slice(i, j));
      i = j;
      continue;
    }
    if (ch === '#') {
      const nl = src.indexOf('\n', i);
      const end = nl === -1 ? n : nl;
      pushToken(tokens, 'comment', src.slice(i, end));
      i = end;
      continue;
    }
    // Prefixed or triple strings
    const strPrefix = /^[frbuFRBU]{0,2}("""|'''|"|')/.exec(src.slice(i));
    if (strPrefix) {
      const delim = strPrefix[1];
      let end = i + strPrefix[0].length;
      if (delim.length === 3) {
        const closeIdx = src.indexOf(delim, end);
        end = closeIdx === -1 ? n : closeIdx + 3;
      } else {
        end = readQuoted(src, i + strPrefix[0].length - 1, delim);
      }
      pushToken(tokens, 'string', src.slice(i, end));
      prevChar = delim[0];
      i = end;
      continue;
    }
    if (ch === '@') {
      const dec = /^@[A-Za-z_][\w.]*/.exec(src.slice(i));
      if (dec) {
        pushToken(tokens, 'attr', dec[0]);
        prevChar = 'd';
        i += dec[0].length;
        continue;
      }
    }
    if (isDigit(ch)) {
      const m = /^(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|\d[\d_]*(?:\.[\d_]+)?(?:[eE][+-]?\d+)?)/.exec(
        src.slice(i),
      );
      if (m) {
        pushToken(tokens, 'number', m[0]);
        prevChar = '0';
        i += m[0].length;
        continue;
      }
    }
    if (isIdentStart(ch) && ch !== '$') {
      let j = i + 1;
      while (j < n && isIdentChar(src[j]) && src[j] !== '$') j++;
      const word = src.slice(i, j);
      const after = skipWs(src, j);
      if (word === 'True' || word === 'False' || word === 'None') {
        pushToken(tokens, 'boolean', word);
      } else if (PY_KEYWORDS.has(word)) {
        pushToken(tokens, 'keyword', word);
      } else if (prevChar === '.') {
        pushToken(tokens, src[after] === '(' ? 'function' : 'property', word);
      } else if (src[after] === '(') {
        pushToken(tokens, 'function', word);
      } else if (/^[A-Z][A-Za-z0-9_]*$/.test(word) && /[a-z]/.test(word)) {
        pushToken(tokens, 'type', word);
      } else {
        pushToken(tokens, 'plain', word);
      }
      prevChar = 'w';
      i = j;
      continue;
    }
    if ('{}()[],.:'.includes(ch)) {
      pushToken(tokens, 'punctuation', ch);
      prevChar = ch;
      i++;
      continue;
    }
    if ('+-*/%=<>!&|^~'.includes(ch)) {
      pushToken(tokens, 'operator', ch);
      prevChar = ch;
      i++;
      continue;
    }
    pushToken(tokens, 'plain', ch);
    prevChar = ch;
    i++;
  }

  return tokens;
}

const SQL_KEYWORDS = new Set([
  'SELECT',
  'FROM',
  'WHERE',
  'JOIN',
  'LEFT',
  'RIGHT',
  'INNER',
  'OUTER',
  'FULL',
  'CROSS',
  'ON',
  'GROUP',
  'BY',
  'ORDER',
  'ASC',
  'DESC',
  'LIMIT',
  'OFFSET',
  'INSERT',
  'INTO',
  'VALUES',
  'UPDATE',
  'SET',
  'DELETE',
  'CREATE',
  'ALTER',
  'DROP',
  'TABLE',
  'VIEW',
  'INDEX',
  'IF',
  'EXISTS',
  'PRIMARY',
  'KEY',
  'REFERENCES',
  'AS',
  'AND',
  'OR',
  'NOT',
  'IN',
  'IS',
  'NULL',
  'TRUE',
  'FALSE',
  'DISTINCT',
  'HAVING',
  'UNION',
  'ALL',
  'CASE',
  'WHEN',
  'THEN',
  'ELSE',
  'END',
  'WITH',
  'RETURNING',
  'BETWEEN',
  'LIKE',
]);

const SQL_FUNCTIONS = new Set([
  'COUNT',
  'SUM',
  'AVG',
  'MIN',
  'MAX',
  'COALESCE',
  'NOW',
  'LOWER',
  'UPPER',
  'DATE_TRUNC',
  'CAST',
  'ROUND',
  'LENGTH',
  'TRIM',
]);

function tokenizeSql(src: string): SyntaxToken[] {
  const tokens: SyntaxToken[] = [];
  const n = src.length;
  let i = 0;

  while (i < n) {
    const ch = src[i];
    if (isWhitespace(ch)) {
      let j = i + 1;
      while (j < n && isWhitespace(src[j])) j++;
      pushToken(tokens, 'plain', src.slice(i, j));
      i = j;
      continue;
    }
    if (ch === '-' && src[i + 1] === '-') {
      const nl = src.indexOf('\n', i);
      const end = nl === -1 ? n : nl;
      pushToken(tokens, 'comment', src.slice(i, end));
      i = end;
      continue;
    }
    if (ch === '/' && src[i + 1] === '*') {
      const endIdx = src.indexOf('*/', i + 2);
      const end = endIdx === -1 ? n : endIdx + 2;
      pushToken(tokens, 'comment', src.slice(i, end));
      i = end;
      continue;
    }
    if (ch === "'") {
      const end = readQuoted(src, i, "'");
      pushToken(tokens, 'string', src.slice(i, end));
      i = end;
      continue;
    }
    if (ch === '"' || ch === '`') {
      const end = readQuoted(src, i, ch);
      pushToken(tokens, 'property', src.slice(i, end));
      i = end;
      continue;
    }
    if (isDigit(ch)) {
      const m = /^\d+(?:\.\d+)?/.exec(src.slice(i))!;
      pushToken(tokens, 'number', m[0]);
      i += m[0].length;
      continue;
    }
    if (isIdentStart(ch) && ch !== '$') {
      let j = i + 1;
      while (j < n && isIdentChar(src[j]) && src[j] !== '$') j++;
      const word = src.slice(i, j);
      const upper = word.toUpperCase();
      if (upper === 'TRUE' || upper === 'FALSE' || upper === 'NULL') {
        pushToken(tokens, 'boolean', word);
      } else if (SQL_KEYWORDS.has(upper)) {
        pushToken(tokens, 'keyword', word);
      } else if (SQL_FUNCTIONS.has(upper) && src[skipWs(src, j)] === '(') {
        pushToken(tokens, 'function', word);
      } else {
        pushToken(tokens, 'plain', word);
      }
      i = j;
      continue;
    }
    if ('(),.;'.includes(ch)) {
      pushToken(tokens, 'punctuation', ch);
      i++;
      continue;
    }
    if ('=<>!+-*/'.includes(ch)) {
      pushToken(tokens, 'operator', ch);
      i++;
      continue;
    }
    pushToken(tokens, 'plain', ch);
    i++;
  }

  return tokens;
}

function tokenizeYaml(src: string): SyntaxToken[][] {
  return src.split('\n').map((line) => {
    const out: SyntaxToken[] = [];
    let rest = line;
    const indent = /^(\s+)/.exec(rest);
    if (indent) {
      pushToken(out, 'plain', indent[1]);
      rest = rest.slice(indent[1].length);
    }
    if (rest.startsWith('#')) {
      pushToken(out, 'comment', rest);
      return out;
    }
    if (rest.startsWith('- ')) {
      pushToken(out, 'operator', '- ');
      rest = rest.slice(2);
    }
    const keyVal = /^([A-Za-z0-9_.-]+)(:\s*)(.*)$/.exec(rest);
    if (keyVal) {
      pushToken(out, 'property', keyVal[1]);
      pushToken(out, 'punctuation', keyVal[2]);
      rest = keyVal[3];
    }
    if (rest.length > 0) {
      const commentSplit = /^([^#"']*(?:"[^"]*"|'[^']*')[^#]*?)(\s+#.*)$|^([^#"']+?)(\s+#.*)$/.exec(
        rest,
      );
      const valuePart = commentSplit ? (commentSplit[1] ?? commentSplit[3] ?? '') : rest;
      const commentPart = commentSplit ? (commentSplit[2] ?? commentSplit[4] ?? '') : '';
      const trimmed = valuePart.trim();
      if (
        (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
        (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ) {
        pushToken(out, 'string', valuePart);
      } else if (/^(?:true|false|null|yes|no|on|off|~)$/i.test(trimmed)) {
        pushToken(out, 'boolean', valuePart);
      } else if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
        pushToken(out, 'number', valuePart);
      } else {
        pushToken(out, 'string', valuePart);
      }
      if (commentPart) pushToken(out, 'comment', commentPart);
    }
    return out;
  });
}

function tokenizeMarkdown(src: string): SyntaxToken[][] {
  return src.split('\n').map((line) => {
    const out: SyntaxToken[] = [];
    if (/^#{1,6}\s/.test(line) || /^```/.test(line)) {
      pushToken(out, 'keyword', line);
      return out;
    }
    if (/^>\s/.test(line)) {
      pushToken(out, 'operator', '> ');
      pushToken(out, 'comment', line.slice(2));
      return out;
    }
    let i = 0;
    const listMatch = /^(\s*(?:[-*+]|\d+\.)\s+)/.exec(line);
    if (listMatch) {
      pushToken(out, 'operator', listMatch[1]);
      i = listMatch[1].length;
    }
    while (i < line.length) {
      if (line[i] === '`') {
        const end = line.indexOf('`', i + 1);
        if (end !== -1) {
          pushToken(out, 'string', line.slice(i, end + 1));
          i = end + 1;
          continue;
        }
      }
      if (line[i] === '[') {
        const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)/.exec(line.slice(i));
        if (linkMatch) {
          pushToken(out, 'attr', `[${linkMatch[1]}]`);
          pushToken(out, 'punctuation', '(');
          pushToken(out, 'string', linkMatch[2]);
          pushToken(out, 'punctuation', ')');
          i += linkMatch[0].length;
          continue;
        }
      }
      if (line[i] === '*' && line[i + 1] === '*') {
        const end = line.indexOf('**', i + 2);
        if (end !== -1) {
          pushToken(out, 'type', line.slice(i, end + 2));
          i = end + 2;
          continue;
        }
      }
      pushToken(out, 'plain', line[i]);
      i++;
    }
    return out;
  });
}

/**
 * Synchronous zero-dependency syntax tokenizer splitting source into per-line
 * token arrays so multiline comments and template literals stay intact per line.
 */
export function tokenizeCode(code: string, language?: CodeLanguage): SyntaxToken[][] {
  const normalized = code.replace(/\r\n?/g, '\n');
  const lang = normalizeLanguage(language);

  switch (lang) {
    case 'tsx':
    case 'jsx':
      return splitTokensByLine(tokenizeScript(normalized, true));
    case 'typescript':
    case 'javascript':
      return splitTokensByLine(tokenizeScript(normalized, false));
    case 'json':
      return splitTokensByLine(tokenizeJson(normalized));
    case 'css':
      return splitTokensByLine(tokenizeCss(normalized));
    case 'html':
      return splitTokensByLine(tokenizeHtml(normalized));
    case 'bash':
      return splitTokensByLine(tokenizeBash(normalized));
    case 'python':
      return splitTokensByLine(tokenizePython(normalized));
    case 'sql':
      return splitTokensByLine(tokenizeSql(normalized));
    case 'yaml':
      return tokenizeYaml(normalized);
    case 'markdown':
      return tokenizeMarkdown(normalized);
    case 'text':
    default:
      return normalized.split('\n').map((line) => (line ? [{ type: 'plain', value: line }] : []));
  }
}

