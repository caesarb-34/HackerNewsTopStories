import {BuildInfo} from '../src/app/shared/models/build-info.model';

declare const require: any;
export const buildInfo: BuildInfo = {
timestamp: '03-29-2023 02:50:23 PDT',
version: require('../package.json').version
};
