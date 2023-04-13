import * as prodKeys from './keys.prod';
import * as devKeys from './keys.dev';

const keys = process.env.NODE_ENV === 'production' ? prodKeys : devKeys;
export default keys;
