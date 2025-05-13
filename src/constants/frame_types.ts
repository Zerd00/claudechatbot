export enum FrameType {
    UNKNOWN = 'UNKNOWN',
    WOODEN = 'WOODEN',
    SYNTHETIC = 'SYNTHETIC',
    ALUMINIUM = 'ALUMINIUM',
    WOOD_ALUMINIUM = 'WOOD_ALUMINIUM',
    WOOD_SYNTHETIC = 'WOOD_SYNTHETIC',
  }
  
  export const VALID_FRAME_TYPES: string[] = Object.values(FrameType);
  
  export const FRAME_TYPE_DESCRIPTIONS: Record<FrameType, string> = {
    [FrameType.UNKNOWN]: 'Unknown frame type',
    [FrameType.WOODEN]: 'Wooden frame',
    [FrameType.SYNTHETIC]: 'Synthetic frame',
    [FrameType.ALUMINIUM]: 'Aluminium frame',
    [FrameType.WOOD_ALUMINIUM]: 'Wood and aluminium combined frame',
    [FrameType.WOOD_SYNTHETIC]: 'Wood and synthetic combined frame',
  };
  