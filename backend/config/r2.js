const crypto = require('crypto')
const path = require('path')
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')

let client = null

function isConfigured() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET &&
      process.env.R2_PUBLIC_BASE_URL
  )
}

function getClient() {
  if (!isConfigured()) {
    throw new Error('Cloudflare R2 is not configured. Fill the R2_* values in backend/.env')
  }
  if (!client) {
    client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
      }
    })
  }
  return client
}

function buildKey(originalName, folder = 'courses') {
  const ext = path.extname(originalName || '').toLowerCase() || '.bin'
  const stamp = Date.now()
  const rand = crypto.randomBytes(6).toString('hex')
  return `${folder}/${stamp}-${rand}${ext}`
}

function publicUrl(key) {
  return `${process.env.R2_PUBLIC_BASE_URL.replace(/\/+$/, '')}/${key}`
}

async function uploadBuffer({ buffer, originalName, contentType, folder }) {
  const key = buildKey(originalName, folder)
  await getClient().send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType || 'application/octet-stream',
      CacheControl: 'public, max-age=31536000, immutable'
    })
  )
  return { key, url: publicUrl(key) }
}

async function deleteObject(key) {
  if (!key) return
  await getClient().send(
    new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key })
  )
}

module.exports = { isConfigured, uploadBuffer, deleteObject, publicUrl }
