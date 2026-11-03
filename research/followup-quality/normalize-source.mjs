// Use the application's actual EXIF/sRGB decode before research transforms.
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {decodeBuffer} from '../../tools/decode.mjs';
const decoded=await decodeBuffer(readFileSync(process.argv[2]));
if(decoded.downsampled)throw new Error('Research source exceeds the frozen full-pixel scope');
const image=await sharp(decoded.rgba,{raw:{width:decoded.width,height:decoded.height,channels:4}})
  .removeAlpha().png().toBuffer();
process.stdout.write(image);
