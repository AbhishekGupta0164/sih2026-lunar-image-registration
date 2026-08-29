export type WorkbenchView =
  | 'dashboard'
  | 'upload'
  | 'register'
  | 'results'
  | 'matches'
  | 'metrics'
  | 'exports'
  | 'logs'
  | 'settings'
  | 'about';

export type MatcherType = 'auto' | 'lightglue' | 'crater_graph' | 'phase_corr' | 'mutual_info';

export interface ImageMetadata {
  name: string;
  size: number;
  type: string;
  sensor: string;
  gsd: string;
  sunAngle: string;
  previewUrl: string;
  file: File;
}

export interface ImagePairState {
  reference: ImageMetadata | null;
  source: ImageMetadata | null;
  sourceSensor: string;
}

export interface PipelineStageInfo {
  id: string;
  name: string;
  sub: string;
}

export interface RegistrationResults {
  rmse: number;
  raw: number;
  inliers: number;
  ratio: number;
  ce90: number;
  nni: number;
  coverage: number;
  time: string;
  method: string;
  matcherUsed: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error';
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

export interface SettingsConfig {
  defaultGsdStrategy: string;
  defaultMatcher: string;
  heatmapOpacity: number;
  coordinateSystem: string;
  apiUrl: string;
  autoSave: boolean;
}
