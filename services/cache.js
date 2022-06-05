const mongoose = require('mongoose')
const redis = require('redis')
const util = require('util')
const redisUrl = 'redis://127.0.0.1:6379'
const client = redis.createClient(redisUrl)
client.hget = util.promisify(client.hget)

const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.cache = function (options = {}) {
  this._cache = true
  this.hashKey = JSON.stringify(options.key || '')
  return this
}

mongoose.Query.prototype.exec = async function () {
  if (!this._cache) return exec.apply(this, arguments)
  const key = JSON.stringify(Object.assign({}, this.getQuery(), { collection: this.mongooseCollection.name }))
  const cachedValue = await client.hget(this.hashKey, key)
  if (cachedValue) {
    console.log('cache')
    return JSON.parse(cachedValue)
  }
  const res = await exec.apply(this, arguments)
  console.log('mongo')
  client.hset(this.hashKey, key, JSON.stringify(res))
  return res
}

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey))
  }
}
