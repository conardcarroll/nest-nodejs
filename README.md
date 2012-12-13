# Nest for node.js

## Description

This project provides a library for communicating with the Nest thermostat API.

## Install

npm install nest

## Use

	var nest = require('nest-thermostat').init('username', 'password');
	
	nest.getInfo('serial number', function(data) {
    	console.log('Currently ' + celsiusToFahrenheit(data.current_temperature) + ' degrees fahrenheit');
    	console.log('Target is ' + celsiusToFahrenheit(data.target_temperature) + ' degrees fahrenheit');
	});
	
	function celsiusToFahrenheit(temp) {
	    return Math.round(temp * (9 / 5.0) + 32.0);
	};

## License

(The MIT License)

Copyright (c) 2012 Devon Crouse &lt;devoncrouse@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
