// @ts-nocheck
const log4js = require('log4js')

log4js.configure({
  appenders: {
    out: {
      type: 'stdout',
      layout: {
        type: 'pattern', // 使用 pattern 布局
        pattern: '%[[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] %c -%] %m' // 自定义日志格式
      },
    }, // 输出到控制台
    app: {
      type: 'file', // 使用 file appender 进行文件输出
      filename: 'logs/app.log', // 日志文件路径（不需要扩展名，自动添加）
      pattern: 'yyyy-MM-dd', // 日志文件轮换的模式，按天轮换
      alwaysIncludePattern: true, // 始终在文件名中添加日期后缀
      daysToKeep: 90, // 保留最近 90 天的日志文件
      compress: true // 启用日志文件压缩（.gz 格式）
    }
  },
  categories: {
    default: { appenders: ['out', 'app'], level: 'trace' }
  }
})

const logger = log4js.getLogger() // js默认的日志记录器
const pwLogger = log4js.getLogger('playwright') // 用于playwright的日志记录器

module.exports = {
  logger,
  pwLogger
}

// logger.trace("Entering cheese testing");
// logger.debug("Got cheese.");
// logger.info("Cheese is Comté.");
// logger.warn("Cheese is quite smelly.");
// logger.error("Cheese is too ripe!"); // 从这里开始写入日志文件
// logger.fatal("Cheese was breeding ground for listeria.");
