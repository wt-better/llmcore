module.exports = {
  apps: [
    {
      name: 'llmcore',
      script: './node_modules/.bin/tsx',
      args: './server.ts',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      // 日志配置
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // 自动重启
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      // 内存限制
      max_memory_restart: '500M',
      // 健康检查
      health_check_grace_period: 30000,
      // 监听文件变化（开发环境）
      watch: false,
      // 忽略的文件
      ignore_watch: ['node_modules', 'logs', 'dist'],
      // 优雅关闭
      kill_timeout: 5000,
      // 启动延迟
      listen_timeout: 10000,
      // 重启延迟
      restart_delay: 3000
    }
  ]
};
