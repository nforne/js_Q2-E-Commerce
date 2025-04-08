import { fileURLToPath } from 'url';
import path from 'path';

// Get the file URL and convert it to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default __dirname;