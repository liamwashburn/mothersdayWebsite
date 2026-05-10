import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

const familyPhotosVirtualModuleId = 'virtual:family-photos';
const resolvedFamilyPhotosVirtualModuleId = `\0${familyPhotosVirtualModuleId}`;
const imageExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp']);

function toPublicUrl(filePath, publicDir) {
  const relativePath = path.relative(publicDir, filePath).split(path.sep);

  return `/${relativePath.map((part) => encodeURIComponent(part)).join('/')}`;
}

function readImageDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  const extension = path.extname(filePath).toLowerCase();

  if (extension === '.png' && buffer.toString('ascii', 1, 4) === 'PNG') {
    return {
      width: buffer.readUInt32BE(16),
      height: buffer.readUInt32BE(20),
    };
  }

  if (extension === '.gif') {
    return {
      width: buffer.readUInt16LE(6),
      height: buffer.readUInt16LE(8),
    };
  }

  if (extension === '.webp' && buffer.toString('ascii', 0, 4) === 'RIFF') {
    const format = buffer.toString('ascii', 12, 16);

    if (format === 'VP8 ') {
      return {
        width: buffer.readUInt16LE(26) & 0x3fff,
        height: buffer.readUInt16LE(28) & 0x3fff,
      };
    }

    if (format === 'VP8L') {
      const bits = buffer.readUInt32LE(21);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >> 14) & 0x3fff) + 1,
      };
    }

    if (format === 'VP8X') {
      return {
        width: 1 + buffer.readUIntLE(24, 3),
        height: 1 + buffer.readUIntLE(27, 3),
      };
    }
  }

  if (extension === '.jpg' || extension === '.jpeg') {
    let offset = 2;

    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) {
        break;
      }

      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);

      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return {
          width: buffer.readUInt16BE(offset + 7),
          height: buffer.readUInt16BE(offset + 5),
        };
      }

      offset += 2 + length;
    }
  }

  return {
    width: null,
    height: null,
  };
}

function readFamilyPhotos(publicDir) {
  const familyPhotosDir = path.join(publicDir, 'Family-Photos');

  if (!fs.existsSync(familyPhotosDir)) {
    return [];
  }

  const walk = (directory) =>
    fs
      .readdirSync(directory, { withFileTypes: true })
      .flatMap((entry) => {
        const entryPath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
          return walk(entryPath);
        }

        if (!entry.isFile() || !imageExtensions.has(path.extname(entry.name).toLowerCase())) {
          return [];
        }

        const dimensions = readImageDimensions(entryPath);
        const aspectRatio =
          dimensions.width && dimensions.height ? dimensions.width / dimensions.height : null;

        return [
          {
            src: toPublicUrl(entryPath, publicDir),
            label: path.basename(entry.name, path.extname(entry.name)).replace(/[-_]+/g, ' '),
            width: dimensions.width,
            height: dimensions.height,
            aspectRatio,
            orientation: aspectRatio === null ? 'unknown' : aspectRatio < 0.9 ? 'portrait' : 'landscape',
          },
        ];
      });

  return walk(familyPhotosDir).sort((left, right) => left.src.localeCompare(right.src));
}

function familyPhotosPlugin() {
  let publicDir;

  return {
    name: 'family-photos-manifest',
    configResolved(config) {
      publicDir = config.publicDir;
    },
    resolveId(id) {
      if (id === familyPhotosVirtualModuleId) {
        return resolvedFamilyPhotosVirtualModuleId;
      }

      return null;
    },
    load(id) {
      if (id !== resolvedFamilyPhotosVirtualModuleId) {
        return null;
      }

      return `export const familyPhotos = ${JSON.stringify(readFamilyPhotos(publicDir), null, 2)};`;
    },
    configureServer(server) {
      const familyPhotosDir = path.join(publicDir, 'Family-Photos');

      if (!fs.existsSync(familyPhotosDir)) {
        return;
      }

      server.watcher.add(familyPhotosDir);
      server.watcher.on('all', (event, filePath) => {
        if (
          ['add', 'unlink', 'change'].includes(event) &&
          filePath.startsWith(familyPhotosDir) &&
          imageExtensions.has(path.extname(filePath).toLowerCase())
        ) {
          const module = server.moduleGraph.getModuleById(resolvedFamilyPhotosVirtualModuleId);

          if (module) {
            server.moduleGraph.invalidateModule(module);
          }

          server.ws.send({ type: 'full-reload' });
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [familyPhotosPlugin(), react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
