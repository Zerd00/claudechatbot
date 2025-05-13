import { VALID_FRAME_TYPES } from '../constants/frame_types';

const frameTypeMapping: Record<string, string> = {
  'wooden': 'WOODEN',
  'synthetic': 'SYNTHETIC',
  'aluminium': 'ALUMINIUM',
  'aluminum': 'ALUMINIUM',
  'wood aluminium': 'WOOD_ALUMINIUM',
  'wood-aluminium': 'WOOD_ALUMINIUM',
  'wood_aluminium': 'WOOD_ALUMINIUM',
  'wood synthetic': 'WOOD_SYNTHETIC',
  'wood-synthetic': 'WOOD_SYNTHETIC',
  'wood_synthetic': 'WOOD_SYNTHETIC',
  'unknown': 'UNKNOWN',
};

export const normalizeFrameTypes = (frames: string[] = []) =>
  frames
    .map(f =>
      frameTypeMapping[f.trim().toLowerCase().replace(/[-_]/g, ' ')] ?? f.toUpperCase()
    )
    .filter(f => VALID_FRAME_TYPES.includes(f));
