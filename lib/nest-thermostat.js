var get, getInfo, https, init, login, merge, password, post, queryString, session, url, userAgent, username, util,
  __hasProp = {}.hasOwnProperty;

https = require('https');

queryString = require('querystring');

url = require('url');

util = require('util');

userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1309.0 Safari/537.17';

session = {};

username = null;

password = null;

merge = function(obj1, obj2) {
  var attr;
  obj1 = obj1 || {};
  if (obj2 != null) {
    return obj1;
  }
  for (attr in obj2) {
    if (!__hasProp.call(obj2, attr)) continue;
    obj1[attr] = obj2[attr];
  }
  return obj1;
};

init = function(user, pass) {
  username = user;
  password = pass;
  return this;
};

post = function(settings, callback) {
  var allData, body, contentType, hostname, options, path, port, post_data, request;
  allData = [];
  if (typeof settings === 'function') {
    settings = settings();
  }
  if ((settings != null) && typeof settings === 'object') {
    hostname = settings.hostname || session.urls.transport_url.hostname;
    port = settings.port || session.urls.transport_url.port;
    path = settings.path;
    body = settings.body || null;
  } else {
    throw new Error('Invalid settings');
  }
  if (typeof body === 'string') {
    post_data = body;
    contentType = 'application/json';
  } else {
    post_data = queryString.stringify(body);
    contentType = 'application/x-www-form-urlencoded; charset=utf-8';
  }
  options = {
    host: hostname,
    port: port,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': contentType,
      'User-Agent': userAgent,
      'Content-Length': post_data.length
    }
  };
  if (session && session.access_token) {
    options.headers = merge(options.headers, {
      'X-nl-user-id': session.userid,
      'X-nl-protocol-version': '1',
      'Accept-Language': 'en-us',
      'Authorization': "Basic " + session.access_token
    });
  }
  request = https.request(options, function(response) {
    response.setEncoding('utf8');
    response.on('data', function(data) {
      return allData.push(data);
    });
    response.on('error', function() {
      if (callback) {
        return callback(null, response.headers || {});
      }
    });
    return response.on('end', function() {
      allData = allData.join('');
      if ((allData != null) && typeof allData === 'string') {
        allData = JSON.parse(allData);
      }
      if (callback != null) {
        return callback(allData, response.headers || {});
      }
    });
  });
  request.write(post_data);
  return request.end();
};

login = function(callback) {
  return post({
    hostname: 'home.nest.com',
    port: 443,
    path: '/user/login',
    body: {
      'username': username,
      'password': password
    }
  }, function(data) {
    if (data.error != null) {
      console.log("Error authenticating: " + data.error + " (" + data.error_description + ")");
      return;
    }
    session = data;
    session.urls.transport_url = url.parse(session.urls.transport_url);
    if (callback != null) {
      return callback(data);
    }
  });
};

get = function(callback) {
  var allData, options, path, request;
  path = "/v2/mobile/" + session.user;
  allData = [];
  options = {
    host: session.urls.transport_url.hostname,
    port: session.urls.transport_url.port,
    path: path,
    method: 'GET',
    headers: {
      'User-Agent': userAgent,
      'X-nl-user-id': session.userid,
      'X-nl-protocol-version': '1',
      'Accept-Language': 'en-us',
      'Authorization': "Basic " + session.access_token
    }
  };
  request = https.request(options, function(response) {
    response.setEncoding('utf8');
    response.on('data', function(data) {
      return allData.push(data);
    });
    return response.on('end', function() {
      allData = allData.join('');
      if (allData && typeof allData === 'string' && allData.length > 0) {
        allData = JSON.parse(allData);
      } else {
        allData = null;
      }
      if (callback != null) {
        return callback(allData);
      }
    });
  });
  return request.end();
};

getInfo = function(serialNumber, callback) {
  return login(function() {
    return get(function(data) {
      if ((data.device[serialNumber] != null) || (data.shared[serialNumber] != null)) {
        return callback(merge(data.device[serialNumber], data.shared[serialNumber]));
      }
    });
  });
};

exports.init = init;

exports.getInfo = getInfo;
