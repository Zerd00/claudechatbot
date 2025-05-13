import * as scanWebsite from './tools/scan-website/index';
import * as scanCarWebsite from './tools/scan-car-website/index';
import * as filterProperties from './tools/filter-properties/index';
import getPropertyDetails from './tools/details/get-property-details';

import { Tool } from './types';

export const tools: Tool[] = [
  scanWebsite as Tool,
  scanCarWebsite as Tool,
  filterProperties as Tool,
  getPropertyDetails as Tool,
];
