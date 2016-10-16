#!/usr/bin/env node
'use strict';

const program = require('commander');

program
.version('1.7')
.option('-v, --verbose', 'Enable verbose mode', false)
.option('-u, --user <user>', 'Set user', undefined)
.option('-b, --baseurl <url>', 'Set baseurl', 'https://blih.epitech.eu/')
.option('-t, --token <token>', 'Set token', undefined)
.option('-U, --useragent <agent>', 'Set useragent', 'blih-' + program.version);

program
.command('repository [params...]')
.description('Manages repositories')
.action(function (params) {
	const repository = require('commander');
	console.log(process.argv);
	repository
	.version('1.7')
	.command('list')
	.description('List the repositories created')
	.action(function () {
		console.log('list');
	});
	repository.parse(params);
});

program
.command('sshkey')
.description('Manages SSH keys')
.action();

program
.command('whoami')
.description('Ask who you are')
.action();

program.parse(process.argv);
