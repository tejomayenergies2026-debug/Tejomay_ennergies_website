import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copy video background
const videoSrc = "D:/Solar_Tejomay/Solar Panels, Green Energy, Free Stock Footage - vibg (1080p, h264).mp4";
const videoDst = path.resolve(publicDir, 'solar-bg.mp4');
try {
  if (fs.existsSync(videoSrc)) {
    fs.copyFileSync(videoSrc, videoDst);
    console.log('✅ Video copied to public/solar-bg.mp4');
  }
} catch (e) {
  console.error('Error copying video:', e);
}

// Copy sample photo
const photoSrc = "D:/Solar_Tejomay/download (3).jpeg";
const photoDst = path.resolve(publicDir, 'sample-photo.jpg');
try {
  if (fs.existsSync(photoSrc)) {
    fs.copyFileSync(photoSrc, photoDst);
    console.log('✅ Photo copied to public/sample-photo.jpg');
  }
} catch (e) {
  console.error('Error copying photo:', e);
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [react()],
    esbuild: {
      drop: isProd ? ['console', 'debugger'] : [],
    },
    server: {
      port: 5174,
      host: true,
      open: true
    }
  };
});
