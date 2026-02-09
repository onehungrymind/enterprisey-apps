/**
 * Centralized selectors for E2E tests
 * Using data-testid pattern where possible, with fallbacks to semantic selectors
 */

export const SELECTORS = {
  // Common
  common: {
    loadingSpinner: '[data-testid="loading-spinner"], .spinner, .loading',
    errorMessage: '[data-testid="error-message"], .error-message, [role="alert"]',
    successMessage: '[data-testid="success-message"], .success-message',
    modal: '[data-testid="modal"], .dialog, [role="dialog"]',
    modalClose: '[data-testid="modal-close"], .close-btn, button:has-text("Close")',
    confirmButton: 'button:has-text("Confirm"), button:has-text("Yes"), button:has-text("OK")',
    cancelButton: 'button:has-text("Cancel"), button:has-text("No")',
    saveButton: 'button:has-text("Save")',
    deleteButton: 'button:has-text("Delete")',
    editButton: 'button:has-text("Edit"), button:has-text("Configure")',
  },

  // Login page
  login: {
    emailInput: 'input[type="email"], input[name="email"], #email',
    passwordInput: 'input[type="password"], input[name="password"], #password',
    submitButton: 'button[type="submit"], button:has-text("Sign In"), button:has-text("Login")',
    errorMessage: '.error-message, [role="alert"]',
    forgotPassword: 'a:has-text("Forgot")',
  },

  // Header
  header: {
    logo: '[data-testid="logo"], .logo',
    userMenu: '[data-testid="user-menu"], .user-menu',
    logoutButton: 'button:has-text("Logout"), button:has-text("Sign Out")',
    themeToggle: '[data-testid="theme-toggle"], ui-theme-toggle',
  },

  // Navigation
  nav: {
    sidebar: '[data-testid="sidebar"], .sidebar, aside',
    menuItem: (name: string) => `[data-testid="nav-${name}"], a:has-text("${name}")`,
  },

  // Filter chips
  filters: {
    chip: (label: string) => `[data-testid="filter-${label}"], ui-filter-chip:has-text("${label}")`,
    activeChip: '.active, [data-active="true"]',
  },

  // Lists
  list: {
    container: '[data-testid="list"], .list, ul',
    item: (name: string) => `[data-testid="list-item-${name}"], li:has-text("${name}")`,
    emptyState: '[data-testid="empty-state"], .empty-state',
  },

  // Forms
  form: {
    field: (label: string) => `input[aria-label="${label}"], input[placeholder*="${label}"], label:has-text("${label}") + input`,
    select: (label: string) => `select[aria-label="${label}"], label:has-text("${label}") + select`,
    textarea: (label: string) => `textarea[aria-label="${label}"], label:has-text("${label}") + textarea`,
    checkbox: (label: string) => `input[type="checkbox"][aria-label="${label}"], label:has-text("${label}") input[type="checkbox"]`,
  },

  // Ingress specific
  ingress: {
    sourceList: '[data-testid="source-list"], .source-list',
    sourceCard: (name: string) => `[data-testid="source-${name}"], .source-card:has-text("${name}")`,
    newSourceButton: 'button:has-text("New Data Source"), button:has-text("Add Source")',
    testConnectionButton: 'button:has-text("Test Connection")',
    syncButton: 'button:has-text("Sync")',
    statusBadge: '[data-testid="status-badge"], .status-badge',
  },

  // Transformation specific
  transformation: {
    pipelineList: '[data-testid="pipeline-list"], .pipeline-list',
    pipelineCard: (name: string) => `[data-testid="pipeline-${name}"], .pipeline-card:has-text("${name}")`,
    newPipelineButton: 'button:has-text("New Pipeline")',
    addStepButton: 'button:has-text("Add Step")',
    runButton: 'button:has-text("Run")',
    previewButton: 'button:has-text("Preview")',
    stepCanvas: '[data-testid="step-canvas"], .canvas',
    stepCard: (name: string) => `[data-testid="step-${name}"], .step-card:has-text("${name}")`,
  },

  // Reporting specific
  reporting: {
    dashboardList: '[data-testid="dashboard-list"], .sidebar',
    dashboardItem: (name: string) => `[data-testid="dashboard-${name}"], .dashboard-item:has-text("${name}")`,
    newDashboardButton: 'button:has-text("New Dashboard")',
    widgetGrid: '[data-testid="widget-grid"], .widget-grid',
    widget: (title: string) => `[data-testid="widget-${title}"], ui-widget:has-text("${title}")`,
    metricCard: '[data-testid="metric-card"], ui-metric-card',
    chart: '[data-testid="chart"], canvas, svg',
  },

  // Export specific
  export: {
    activeJobs: '[data-testid="active-jobs"], .active-jobs',
    jobHistory: '[data-testid="job-history"], .job-history',
    newJobButton: 'button:has-text("New Export"), button:has-text("Create Export")',
    jobCard: (name: string) => `[data-testid="job-${name}"], .job-card:has-text("${name}")`,
    downloadButton: 'button:has-text("Download")',
    cancelButton: 'button:has-text("Cancel")',
    progressBar: '[data-testid="progress-bar"], .progress-bar, progress',
  },

  // Users specific
  users: {
    userList: '[data-testid="user-list"], .user-list',
    userRow: (name: string) => `[data-testid="user-${name}"], tr:has-text("${name}")`,
    inviteButton: 'button:has-text("Invite User")',
    companyTab: 'button:has-text("Companies"), a:has-text("Companies")',
    companyList: '[data-testid="company-list"], .company-list',
    companyRow: (name: string) => `[data-testid="company-${name}"], tr:has-text("${name}")`,
    addCompanyButton: 'button:has-text("Add Company")',
  },

  // Portal specific
  portal: {
    healthGrid: '[data-testid="health-grid"], .health-grid',
    serviceCard: (name: string) => `[data-testid="service-${name}"], .service-card:has-text("${name}")`,
    featureCard: (name: string) => `[data-testid="feature-${name}"], .feature-card:has-text("${name}")`,
    refreshButton: 'button:has-text("Refresh")',
    statusIndicator: '[data-testid="status-indicator"], .status-indicator',
  },
} as const;
