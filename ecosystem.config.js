/**
 * PM2 Ecosystem Configuration
 *
 * Usage:
 *   pm2 start ecosystem.config.js          # Start all services
 *   pm2 start ecosystem.config.js --only features-api,ingress-api,ingress
 *   pm2 status                             # View all processes
 *   pm2 logs                               # Aggregated logs (color-coded)
 *   pm2 logs ingress-api                   # Logs for specific service
 *   pm2 stop all                           # Stop everything
 *   pm2 restart all                        # Restart everything
 *   pm2 delete all                         # Remove all from PM2
 *
 * Tips:
 *   - Start just what you need: pm2 start ecosystem.config.js --only features-api,dashboard
 *   - Save current process list: pm2 save
 *   - Resurrect saved processes: pm2 resurrect
 */

module.exports = {
  apps: [
    // ─────────────────────────────────────────────────────────────────────────
    // BACKENDS (NestJS APIs)
    // ─────────────────────────────────────────────────────────────────────────
    {
      name: 'features-api',
      script: 'npx',
      args: 'nx serve features-api',
      watch: false,
      autorestart: true,
      env: {
        PORT: 3000,
      },
    },
    {
      name: 'ingress-api',
      script: 'npx',
      args: 'nx serve ingress-api',
      watch: false,
      autorestart: true,
      env: {
        PORT: 3100,
      },
    },
    {
      name: 'transformation-api',
      script: 'npx',
      args: 'nx serve transformation-api',
      watch: false,
      autorestart: true,
      env: {
        PORT: 3200,
      },
    },
    {
      name: 'reporting-api',
      script: 'npx',
      args: 'nx serve reporting-api',
      watch: false,
      autorestart: true,
      env: {
        PORT: 3300,
      },
    },
    {
      name: 'export-api',
      script: 'npx',
      args: 'nx serve export-api',
      watch: false,
      autorestart: true,
      env: {
        PORT: 3400,
      },
    },
    {
      name: 'users-api',
      script: 'npx',
      args: 'nx serve users-api',
      watch: false,
      autorestart: true,
      env: {
        PORT: 3500,
      },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // FRONTENDS (Angular Apps)
    // ─────────────────────────────────────────────────────────────────────────
    {
      name: 'dashboard',
      script: 'npx',
      args: 'nx serve dashboard',
      watch: false,
      autorestart: true,
      env: {
        PORT: 4200,
      },
    },
    {
      name: 'users',
      script: 'npx',
      args: 'nx serve users',
      watch: false,
      autorestart: true,
      env: {
        PORT: 4201,
      },
    },
    {
      name: 'ingress',
      script: 'npx',
      args: 'nx serve ingress',
      watch: false,
      autorestart: true,
      env: {
        PORT: 4202,
      },
    },
    {
      name: 'transformation',
      script: 'npx',
      args: 'nx serve transformation',
      watch: false,
      autorestart: true,
      env: {
        PORT: 4203,
      },
    },
    {
      name: 'reporting',
      script: 'npx',
      args: 'nx serve reporting',
      watch: false,
      autorestart: true,
      env: {
        PORT: 4204,
      },
    },
    {
      name: 'export',
      script: 'npx',
      args: 'nx serve export',
      watch: false,
      autorestart: true,
      env: {
        PORT: 4205,
      },
    },

    // ─────────────────────────────────────────────────────────────────────────
    // STANDALONE APPS (optional - not started by default)
    // Start with: pm2 start ecosystem.config.js --only portal
    // ─────────────────────────────────────────────────────────────────────────
    {
      name: 'portal',
      script: 'npx',
      args: 'nx serve portal',
      watch: false,
      autorestart: false,
      autostart: false, // Won't start with `pm2 start ecosystem.config.js`
      env: {
        PORT: 4800,
      },
    },
    {
      name: 'wizard',
      script: 'npx',
      args: 'nx serve wizard',
      watch: false,
      autorestart: false,
      autostart: false,
      env: {
        PORT: 4900,
      },
    },
  ],
};
