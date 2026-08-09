/**
 * Marks the document as JavaScript-capable before first paint.
 *
 * Reveal animations hide their content in the initial state. Without this flag
 * a reader with JS disabled — or with JS still loading — would see an empty
 * page. Gating the hidden state on [data-js] means no-JS degrades to fully
 * visible content, which is the requirement in D-05.
 *
 * Inlined and synchronous on purpose: it must run before the first paint, or
 * content flashes visible and then hides.
 */
export function JsBootstrap() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.setAttribute("data-js","")`,
      }}
    />
  );
}
