import { cp, copyFile, mkdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const source = 'public';
const target = 'dist';
const phaserPath = join('node_modules', 'phaser', 'dist', 'phaser.min.js');
const info = await stat(phaserPath).catch(() => null);
if (!info || info.size < 500_000) {
  throw new Error(`No se encontró el runtime real de Phaser 4.2.1 (${phaserPath}). Ejecuta npm install.`);
}
const pkg = JSON.parse(await readFile('node_modules/phaser/package.json', 'utf8'));
if (pkg.version !== '4.2.1') throw new Error(`Versión Phaser inesperada: ${pkg.version}`);
await cp(source, target, { recursive: true, force: true });
await mkdir(join(target, 'dependencias'), { recursive: true });
await copyFile(phaserPath, join(target, 'dependencias', 'phaser.min.js'));
console.log(`Build aislado creado: ${target}/. Phaser ${pkg.version}, ${info.size} bytes incluidos localmente.`);
