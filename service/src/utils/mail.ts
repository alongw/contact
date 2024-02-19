import { createTransport } from 'nodemailer'

import config from '@/utils/config'

import type SMTPTransport from 'nodemailer/lib/smtp-transport'

export const isMail = (mail: string) => {
    return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(mail)
}

const transport = createTransport(config.email)

export const sendMail = (
    subject: string,
    html: string
): Promise<SMTPTransport.SentMessageInfo> => {
    return new Promise((resolve, reject) => {
        transport.sendMail(
            {
                from: config.email.from,
                to: config.email.to,
                subject: subject,
                html: html
            },
            (err, info) => {
                if (err) {
                    return reject(err)
                }
                resolve(info)
            }
        )
    })
}
