import {writeFileSync} from 'fs';
import {dirname, resolve} from 'path';
import {fileURLToPath} from 'url';

import keys from './keys.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

writeFileSync(resolve(__dirname, 'keys.json'), JSON.stringify(keys, null, 3), {encoding: 'utf-8'});
