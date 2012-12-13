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