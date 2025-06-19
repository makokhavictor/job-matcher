import { isServerSide, InMemoryStorage } from '../utils';

// Metric types
export type PerformanceMetrics = {
  apiResponseTime: number;
  parseTime: number;
  analysisTime: number;
  dbQueryTime: number;
  uploadTime: number;
};

export type ErrorMetrics = {
  analysisErrors: number;
  uploadErrors: number;
  parseErrors: number;
  timeoutErrors: number;
  dbErrors: number;
};

export type UsageMetrics = {
  totalAnalyses: number;
  cvUploads: number;
  jobDescriptionUploads: number;
  concurrentUsers: number;
  peakUsagePeriod: Date;
};

export type AnalysisMetrics = {
  averageScore: number;
  scoreDistribution: Map<string, number>; // Range -> Count
  commonMissingSkills: Map<string, number>; // Skill -> Count
  requestedSkills: Map<string, number>; // Skill -> Count
  skillGaps: Map<string, number>; // Gap -> Count
  averageSuggestions: number;
};

export type UserEngagementMetrics = {
  returnRate: number;
  averageTimeSpent: number;
  uploadsPerSession: number;
  analysisCompletionRate: number;
  recentAnalysesViewRate: number;
};

export type DocumentMetrics = {
  averageSize: number;
  formatDistribution: Map<string, number>; // Format -> Count
  parseSuccessRate: number;
  contentQualityScore: number;
};

export class MetricsService {
  private static instance: MetricsService;
  private performanceMetrics!: PerformanceMetrics;
  private errorMetrics!: ErrorMetrics;
  private usageMetrics!: UsageMetrics;
  private analysisMetrics!: AnalysisMetrics;
  private userEngagementMetrics!: UserEngagementMetrics;
  private documentMetrics!: DocumentMetrics;

  private readonly STORAGE_KEY = 'cv_matcher_metrics';
  private readonly METRICS_TTL = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds

  private storage: Storage | InMemoryStorage;

  private constructor() {
    this.storage = isServerSide() ? new InMemoryStorage() : window.localStorage;
    this.loadMetrics();
  }

  public static getInstance(): MetricsService {
    if (!MetricsService.instance) {
      MetricsService.instance = new MetricsService();
    }
    return MetricsService.instance;
  }

  private isLocalStorageAvailable(): boolean {
    try {
      return !isServerSide() && 'localStorage' in window && window.localStorage !== null;
    } catch {
      return false;
    }
  }

  private loadMetrics() {
    if (!this.isLocalStorageAvailable() && isServerSide()) {
      console.warn('localStorage is not available. Metrics will not be persisted.');
      this.resetMetrics();
      return;
    }

    try {
      const stored = this.storage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const timestamp = parsed._timestamp;

        // Check if metrics are still valid (within 90 days)
        if (timestamp && Date.now() - timestamp < this.METRICS_TTL) {
          this.performanceMetrics = parsed.performanceMetrics;
          this.errorMetrics = parsed.errorMetrics;
          this.usageMetrics = parsed.usageMetrics;
          this.analysisMetrics = {
            ...parsed.analysisMetrics,
            scoreDistribution: new Map(Object.entries(parsed.analysisMetrics.scoreDistribution)),
            commonMissingSkills: new Map(Object.entries(parsed.analysisMetrics.commonMissingSkills)),
            requestedSkills: new Map(Object.entries(parsed.analysisMetrics.requestedSkills)),
            skillGaps: new Map(Object.entries(parsed.analysisMetrics.skillGaps)),
          };
          this.userEngagementMetrics = parsed.userEngagementMetrics;
          this.documentMetrics = {
            ...parsed.documentMetrics,
            formatDistribution: new Map(Object.entries(parsed.documentMetrics.formatDistribution)),
          };
          return;
        }
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    }

    // If loading fails or metrics are expired, initialize new metrics
    this.resetMetrics();
  }

  private saveMetrics() {
    try {
      const metricsData = {
        _timestamp: Date.now(),
        performanceMetrics: this.performanceMetrics,
        errorMetrics: this.errorMetrics,
        usageMetrics: this.usageMetrics,
        analysisMetrics: {
          ...this.analysisMetrics,
          scoreDistribution: Object.fromEntries(this.analysisMetrics.scoreDistribution),
          commonMissingSkills: Object.fromEntries(this.analysisMetrics.commonMissingSkills),
          requestedSkills: Object.fromEntries(this.analysisMetrics.requestedSkills),
          skillGaps: Object.fromEntries(this.analysisMetrics.skillGaps),
        },
        userEngagementMetrics: this.userEngagementMetrics,
        documentMetrics: {
          ...this.documentMetrics,
          formatDistribution: Object.fromEntries(this.documentMetrics.formatDistribution),
        },
      };

      this.storage.setItem(this.STORAGE_KEY, JSON.stringify(metricsData));
    } catch (error) {
      console.error('Error saving metrics:', error);
    }
  }

  private resetMetrics() {
    this.performanceMetrics = {
      apiResponseTime: 0,
      parseTime: 0,
      analysisTime: 0,
      dbQueryTime: 0,
      uploadTime: 0,
    };

    this.errorMetrics = {
      analysisErrors: 0,
      uploadErrors: 0,
      parseErrors: 0,
      timeoutErrors: 0,
      dbErrors: 0,
    };

    this.usageMetrics = {
      totalAnalyses: 0,
      cvUploads: 0,
      jobDescriptionUploads: 0,
      concurrentUsers: 0,
      peakUsagePeriod: new Date(),
    };

    this.analysisMetrics = {
      averageScore: 0,
      scoreDistribution: new Map(),
      commonMissingSkills: new Map(),
      requestedSkills: new Map(),
      skillGaps: new Map(),
      averageSuggestions: 0,
    };

    this.userEngagementMetrics = {
      returnRate: 0,
      averageTimeSpent: 0,
      uploadsPerSession: 0,
      analysisCompletionRate: 0,
      recentAnalysesViewRate: 0,
    };

    this.documentMetrics = {
      averageSize: 0,
      formatDistribution: new Map(),
      parseSuccessRate: 0,
      contentQualityScore: 0,
    };
  }

  // Performance tracking
  public trackApiResponse(duration: number) {
    this.performanceMetrics.apiResponseTime = 
      (this.performanceMetrics.apiResponseTime + duration) / 2;
    this.saveMetrics();
  }

  public trackParseTime(duration: number) {
    this.performanceMetrics.parseTime = 
      (this.performanceMetrics.parseTime + duration) / 2;
    this.saveMetrics();
  }

  public trackAnalysisTime(duration: number) {
    this.performanceMetrics.analysisTime = 
      (this.performanceMetrics.analysisTime + duration) / 2;
    this.saveMetrics();
  }

  // Error tracking
  public trackError(type: keyof ErrorMetrics) {
    this.errorMetrics[type]++;
    this.saveMetrics();
  }

  // Usage tracking
  public trackAnalysis() {
    this.usageMetrics.totalAnalyses++;
    this.saveMetrics();
  }

  public trackUpload(type: 'cv' | 'jobDescription') {
    if (type === 'cv') {
      this.usageMetrics.cvUploads++;
    } else {
      this.usageMetrics.jobDescriptionUploads++;
    }
    this.saveMetrics();
  }

  // Analysis metrics tracking
  // public trackAnalysisResult(result: AnalysisResult) {
  //   // Update average score
  //   const prevTotal = this.analysisMetrics.averageScore * (this.usageMetrics.totalAnalyses - 1);
  //   this.analysisMetrics.averageScore = 
  //     (prevTotal + result.score) / this.usageMetrics.totalAnalyses;

  //   // Update score distribution
  //   const scoreRange = `${Math.floor(result.score / 10) * 10}-${Math.floor(result.score / 10) * 10 + 9}`;
  //   this.analysisMetrics.scoreDistribution.set(
  //     scoreRange,
  //     (this.analysisMetrics.scoreDistribution.get(scoreRange) || 0) + 1
  //   );

  //   // Track missing skills
  //   result.missing.skills.forEach(skill => {
  //     this.analysisMetrics.commonMissingSkills.set(
  //       skill,
  //       (this.analysisMetrics.commonMissingSkills.get(skill) || 0) + 1
  //     );
  //   });

  //   // Update average suggestions
  //   const prevSuggTotal = this.analysisMetrics.averageSuggestions * (this.usageMetrics.totalAnalyses - 1);
  //   this.analysisMetrics.averageSuggestions = 
  //     (prevSuggTotal + result.suggestions.length) / this.usageMetrics.totalAnalyses;

  //   this.saveMetrics();
  // }

  // Document metrics tracking
  public trackDocument(size: number, format: string, parseSuccess: boolean) {
    // Update average size
    const totalDocs = this.usageMetrics.cvUploads + this.usageMetrics.jobDescriptionUploads;
    const prevTotal = this.documentMetrics.averageSize * (totalDocs - 1);
    this.documentMetrics.averageSize = (prevTotal + size) / totalDocs;

    // Update format distribution
    this.documentMetrics.formatDistribution.set(
      format,
      (this.documentMetrics.formatDistribution.get(format) || 0) + 1
    );

    // Update parse success rate
    this.documentMetrics.parseSuccessRate = 
      (this.documentMetrics.parseSuccessRate * (totalDocs - 1) + (parseSuccess ? 1 : 0)) / totalDocs;

    this.saveMetrics();
  }

  // Getters for metrics
  public getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }

  public getErrorMetrics(): ErrorMetrics {
    return { ...this.errorMetrics };
  }

  public getUsageMetrics(): UsageMetrics {
    return { ...this.usageMetrics };
  }

  public getAnalysisMetrics(): AnalysisMetrics {
    return {
      ...this.analysisMetrics,
      scoreDistribution: new Map(this.analysisMetrics.scoreDistribution),
      commonMissingSkills: new Map(this.analysisMetrics.commonMissingSkills),
      requestedSkills: new Map(this.analysisMetrics.requestedSkills),
      skillGaps: new Map(this.analysisMetrics.skillGaps),
    };
  }

  public getUserEngagementMetrics(): UserEngagementMetrics {
    return { ...this.userEngagementMetrics };
  }

  public getDocumentMetrics(): DocumentMetrics {
    return {
      ...this.documentMetrics,
      formatDistribution: new Map(this.documentMetrics.formatDistribution),
    };
  }

  // Alert thresholds
  private readonly THRESHOLDS = {
    API_RESPONSE_TIME: 200, // ms
    ANALYSIS_TIME: 5000, // ms
    UPLOAD_TIME: 2000, // ms
    ERROR_RATE: 0.01, // 1%
  };

  public checkAlertConditions(): { alerts: string[], status: 'healthy' | 'degraded' | 'critical' } {
    const alerts: string[] = [];
    let status: 'healthy' | 'degraded' | 'critical' = 'healthy';

    // Check performance thresholds
    if (this.performanceMetrics.apiResponseTime > this.THRESHOLDS.API_RESPONSE_TIME) {
      alerts.push('High API response time detected');
      status = 'degraded';
    }

    if (this.performanceMetrics.analysisTime > this.THRESHOLDS.ANALYSIS_TIME) {
      alerts.push('Analysis processing time exceeds threshold');
      status = 'degraded';
    }

    // Check error rates
    const totalOperations = this.usageMetrics.totalAnalyses;
    const totalErrors = Object.values(this.errorMetrics).reduce((sum, curr) => sum + curr, 0);
    const errorRate = totalErrors / totalOperations;

    if (errorRate > this.THRESHOLDS.ERROR_RATE) {
      alerts.push('Error rate exceeds threshold');
      status = 'critical';
    }

    return { alerts, status };
  }

  // Add method to export metrics for external monitoring systems
  public exportMetrics() {
    return {
      timestamp: new Date().toISOString(),
      performance: this.getPerformanceMetrics(),
      errors: this.getErrorMetrics(),
      usage: this.getUsageMetrics(),
      analysis: {
        ...this.getAnalysisMetrics(),
        scoreDistribution: Object.fromEntries(this.analysisMetrics.scoreDistribution),
        commonMissingSkills: Object.fromEntries(this.analysisMetrics.commonMissingSkills),
        requestedSkills: Object.fromEntries(this.analysisMetrics.requestedSkills),
        skillGaps: Object.fromEntries(this.analysisMetrics.skillGaps),
      },
      userEngagement: this.getUserEngagementMetrics(),
      documents: {
        ...this.getDocumentMetrics(),
        formatDistribution: Object.fromEntries(this.documentMetrics.formatDistribution),
      },
    };
  }
}