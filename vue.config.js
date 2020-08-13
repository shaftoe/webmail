const version = require('child_process')
    .execSync('git rev-parse HEAD')
    .toString().trim()
const vars = {
    LAMBDA_NAME: "notifications-notificationslambdamailjetF3B685B6-1979LDYKMT4WK",
    LAST_UPDATE: new Date().toISOString(),
    REGION: "us-east-2",
    VERSION_COMMIT: `https://github.com/shaftoe/webmail/commit/${version}`,
    VERSION: version,
}

module.exports = {
    chainWebpack: config => {
        config
        .plugin('define')
        .tap(() => {
            const out = {}
            Object.entries(vars).forEach(entry => out[entry[0]] = JSON.stringify(entry[1]))
            return [out]
        })
    }
}