function sendMail(mailFrom, mailTo, subject, text, cc = [], bcc = []) {
    const lambda = new AWS.Lambda()

    const payload = {
        mail_from: mailFrom,
        mail_to: mailTo,
        subject: subject,
        text: text,
        mail_cc: cc,
        mail_bcc: bcc,
    }

    const params = {
        FunctionName: LAMBDA_NAME,
        Payload: JSON.stringify(payload),
    }

    return new Promise((resolve, reject) => {
        lambda.invoke(params, function (err, data) {
            if (err) reject(err)
            else {
                try {
                    const payload = JSON.parse(data.Payload)
                    const body = JSON.parse(payload.body)
                    resolve(body.message.Messages[0].To[0].MessageUUID)
                } catch(error) {
                    reject(error)
                }
            }
        })
    })
}

function updateAWSConfig(accessKeyId, secretAccessKey) {
    const region = REGION // XXX no idea why it won't work passing REGION directly to .update()

    AWS.config.update({
        region,
        accessKeyId,
        secretAccessKey,
    })
}

module.exports = {
    sendMail,
    updateAWSConfig,
}
