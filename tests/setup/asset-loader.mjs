const ASSET = /\.(jpe?g|png|webp|avif|gif|svg|css)(\?.*)?$/;

export async function load(url, context, nextLoad) {
  if (ASSET.test(url)) {
    return { format: 'module', shortCircuit: true, source: `export default ${JSON.stringify(url)};` };
  }
  return nextLoad(url, context);
}
