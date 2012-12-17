https       = require 'https'
queryString = require 'querystring'
url         = require 'url'
util        = require 'util'

userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1309.0 Safari/537.17'
session   = {}
username  = null
password  = null

# Merge the properties of obj2 into obj1.
merge = (obj1, obj2) ->
  obj1 = obj1 || {}
  if obj2?
    return obj1

  for own attr of obj2
    obj1[attr] = obj2[attr]

  return obj1

# Set the unsername and password for this Nest unit.
init = (user, pass) ->
  username = user
  password = pass
  return this

# Post to specified settings to the Nest API then pass the returned
# data to the specified callback.
post = (settings, callback) ->
  allData = []

  settings = settings() if typeof settings is 'function'

  if settings? and typeof settings is 'object'
    hostname = settings.hostname || session.urls.transport_url.hostname
    port = settings.port || session.urls.transport_url.port
    path = settings.path
    body = settings.body || null
  else
    throw new Error 'Invalid settings'

  if typeof body is 'string'
    post_data = body
    contentType = 'application/json'
  else
    post_data = queryString.stringify body
    contentType = 'application/x-www-form-urlencoded; charset=utf-8'

  options =
    host: hostname
    port: port
    path: path
    method: 'POST'
    headers:
      'Content-Type': contentType
      'User-Agent': userAgent
      'Content-Length': post_data.length

  if session and session.access_token
    options.headers = merge options.headers,
      'X-nl-user-id': session.userid,
      'X-nl-protocol-version': '1',
      'Accept-Language': 'en-us',
      'Authorization': "Basic #{session.access_token}"

  request = https.request options, (response) ->
    response.setEncoding 'utf8'

    response.on 'data', (data) ->
      allData.push data

    response.on 'error', () ->
      if (callback)
        callback null, response.headers || {}

    response.on 'end', () ->
      allData = allData.join('')
      if allData? and typeof allData is 'string'
        allData = JSON.parse allData

      callback allData, response.headers || {} if callback?

  request.write(post_data);
  request.end();

# Uses the username and password from initialization to log
# the user and and get the settings required to access the
# Nest unit.
login = (callback) ->
  post {
    hostname : 'home.nest.com',
    port : 443,
    path : '/user/login',
    body : {
      'username' : username,
      'password' : password
      }
    },
    (data) ->
      if data.error?
        console.log "Error authenticating: #{data.error} (#{data.error_description})"
        return

      session = data
      session.urls.transport_url = url.parse session.urls.transport_url

      callback data if callback?

# Get information about the Nest unit then pass the returned data
# to the specified callback.
get = (callback) ->
  path    = "/v2/mobile/#{session.user}"
  allData = []
  options =
    host: session.urls.transport_url.hostname
    port: session.urls.transport_url.port
    path: path
    method: 'GET'
    headers:
      'User-Agent': userAgent
      'X-nl-user-id': session.userid
      'X-nl-protocol-version': '1'
      'Accept-Language': 'en-us'
      'Authorization': "Basic #{session.access_token}"

  request = https.request options, (response) ->
    response.setEncoding('utf8')

    response.on 'data', (data) ->
      allData.push data

    response.on 'end', () ->
      allData = allData.join ''

      if allData and typeof allData is 'string' and allData.length > 0
        allData = JSON.parse allData
      else
        allData = null;

      callback allData if callback?

  request.end();

# Logs the user in the uses the settings returned from
# Nest to get information about the unit.
getInfo = (serialNumber, callback) ->
  login () ->
    get (data) ->
      if data.device[serialNumber]? || data.shared[serialNumber]?
        callback merge(data.device[serialNumber], data.shared[serialNumber])

# Expose the module API.
exports.init = init
exports.getInfo = getInfo
