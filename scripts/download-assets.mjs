// Downloads original Tilda assets (real URLs) into public/assets under unique local names.
import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import path from 'node:path';

const pairs = JSON.parse(await readFile(new URL('./assets.json', import.meta.url)));
const outDir = path.resolve('public/assets');
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

let ok = 0, fail = 0;
const manifest = {};
await Promise.all(pairs.map(async ([url, name]) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(path.join(outDir, name), buf);
    manifest[name] = url;
    ok++;
  } catch (e) {
    console.error('FAIL', name, e.message);
    fail++;
  }
}));
await writeFile(path.join(outDir, '_manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Done: ${ok} ok, ${fail} failed -> ${outDir}`);
