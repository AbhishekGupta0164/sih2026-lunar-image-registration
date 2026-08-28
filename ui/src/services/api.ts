import { MatcherType, RegistrationResults } from '../types';

export const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface PipelineStepCallback {
  (stepIndex: number, message: string, percent: number): void;
}

export class SeleneApiService {
  private static instance: SeleneApiService;
  private baseUrl: string = API_BASE_URL;

  public static getInstance(): SeleneApiService {
    if (!SeleneApiService.instance) {
      SeleneApiService.instance = new SeleneApiService();
    }
    return SeleneApiService.instance;
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  public async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, { method: 'GET' });
      return response.ok;
    } catch {
      return false;
    }
  }

  public async runRegistrationSimulation(
    matcher: MatcherType,
    sensor: string,
    onStep: PipelineStepCallback
  ): Promise<RegistrationResults> {
    const selectedMatcher = this.resolveMatcher(matcher, sensor);

    const steps = [
      { msg: 'Reading PDS3/PDS4/JSON labels and raster metadata...', delay: 650 },
      { msg: 'Building common-GSD pyramid and resampling both images...', delay: 700 },
      { msg: 'Preparing illumination-invariant representation and shadow masks...', delay: 800 },
      { msg: `Gate selected ${this.getMatcherLabel(selectedMatcher)} from sensor / Sun-angle metadata.`, delay: 650 },
      { msg: 'Generating candidate correspondences...', delay: 900 },
      { msg: 'Running USAC_MAGSAC++ robust geometry fit and removing outliers...', delay: 850 },
      { msg: 'Upscaling coordinates and refining GCPs with IC-LK...', delay: 800 },
      { msg: 'Sampling uniform GCPs across the 8×8 overlap grid...', delay: 650 },
      { msg: 'Warping source and generating registered.tif, matches.csv and report...', delay: 700 },
    ];

    const startTime = performance.now();

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const percent = Math.round(((i + 1) / steps.length) * 100);
      onStep(i, step.msg, percent);
      await new Promise((resolve) => setTimeout(resolve, step.delay));
    }

    const duration = ((performance.now() - startTime) / 1000).toFixed(2);

    return {
      rmse: 0.68,
      raw: 21389,
      inliers: 18742,
      ratio: 87.6,
      ce90: 0.91,
      nni: 0.84,
      coverage: 81,
      time: duration,
      method: `${this.getMatcherLabel(selectedMatcher)} + Phase Congruency`,
      matcherUsed: selectedMatcher,
    };
  }

  public resolveMatcher(matcher: MatcherType, sensor: string): string {
    if (matcher !== 'auto') return matcher;
    if (sensor.includes('IIRS')) return 'mutual_info';
    return 'lightglue';
  }

  public getMatcherLabel(matcherKey: string): string {
    const labels: Record<string, string> = {
      lightglue: 'LightGlue',
      crater_graph: 'Crater Graph',
      phase_corr: 'Phase Correlation',
      mutual_info: 'Mutual Information',
      auto: 'Auto — Gate Routing',
    };
    return labels[matcherKey] || matcherKey;
  }
}

export const seleneApi = SeleneApiService.getInstance();
