#!/usr/bin/env node
'use strict';

const program = require('commander');
const prompt = require('prompt-sync')();
const utf8 = require('utf8');
const crypto = require('crypto');
const request = require('request');
const stringify = require('json-stable-stringify');
const fs = require('fs');

class Blih {
	constructor(options) {
		this.options = options;
		this._baseUrl = options.baseurl || 'https://blih.epitech.eu/';
		this._user = options.user || this.get_user();
		this._token = options.token || this.token_calc();
		this._verbose = options.verbose || false;
		this._userAgent = options.useragent || 'blih-' + program.version();
	}

	sign_data(data) {
		const sign = crypto.createHmac('sha512', this._token);
		sign.update(this._user);
		if (data)
			sign.update(stringify(data, {space: "    "}));
		return {
			user: this._user,
			signature: sign.digest('hex'),
			data: data
		};
	}

	request(options, cb) {
		cb = cb || ((res) => { console.log(res.message); });
		const signed_data = this.sign_data(options.data);
		request({
			url: options.path,
			baseUrl: this._baseUrl,
			method: options.method || 'GET',
			body: JSON.stringify(signed_data),
			headers: {
				'Content-Type': options.contentType || 'application/json',
				'User-Agent': this._userAgent
			}
		}, function (err, res, body) {
			body = JSON.parse(body);
			if (body.error) {
				console.error(`HTTP Error ${res.statusCode}\nError message: '${body.error}'`);
				process.exit(0);
			}
			cb(body);
		});
	}

	get_user() {
		return this.options.user || process.env.LOGNAME || process.env.USER ||
			process.env.LNAME || process.env.USERNAME;
	}

	token_calc() {
		return crypto.createHash('sha512').update(prompt(`${this._user}'s password: `, {echo: ''}) || process.exit(1)).digest('hex');
	}
}

class Subcommand {
	constructor(options) {
		this.options = options;
		this.usage_message = '';
	}

	usage() {
		console.log(this.usage_message);
	}
}

class Repository extends Subcommand {
	constructor(options) {
		super(options);
		this.usage_message =`
		Usage: ${process.argv[1]} [options] repository command ...
		
		Commands:
		    create repo\t\t\tCreate a repository named "repo"
		    info repo\t\t\t\tGet the repository metadata
		    getacl repo\t\t\tGet the acls set for the repository
		    list\t\t\t\tList the repositories created
		    setacl repo user [user...] [acl]\tSet (or remove) an acl for each "user" on "repo"
		    \t\t\t\t\tACL format:
		    \t\t\t\t\t\tr for read
		    \t\t\t\t\t\tw for write
		    \t\t\t\t\t\ta for admin
		`;
		this.usage_message = '\n  ' + this.usage_message.substr(3).replace(/\n\t\t/g, '\n  ');
	}

	create(params) {
		if (params.length < 1)
			return this.usage();
		const blih = new Blih(this.options);
		blih.request({ path: '/repositories', method:'POST', data: {
			name: params[0],
			type: 'git',
			description: ''
		}});
	}

	list() {
		const blih = new Blih(this.options);
		blih.request({ path: '/repositories' }, (res) => {
			if (res.hasOwnProperty("repositories"))
				for (let repo in res.repositories)
					console.log(repo);
		});
	}

	info(params) {
		if (params.length < 1)
			return this.usage();
		const blih = new Blih(this.options);
		blih.request({ path: `/repository/${params[0]}` }, (res) => {
			console.log('Repository info :');
			console.log(`name : ${params[0]}`);
			if (res.hasOwnProperty("message"))
				for (let info in res.message)
					console.log(`${info} : ${res.message[info]}`);
		});
	}

	delete(params) {
		if (params.length < 1)
			return this.usage();
		const blih = new Blih(this.options);
		blih.request({ path: `/repository/${params[0]}`, method:'DELETE' });
	}

	setacl(params) {
		if (params.length < 2)
			return this.usage();
		const blih = new Blih(this.options);
		const repo = params.shift();
		const rights = params.pop();
		var users = params;
		for (let user of users) {
			blih.request({ 
				path: `/repository/${repo}/acls`,
				method:'POST', data: {
					user: user,
					acl: rights || ''
				}
			});
		}
	}

	getacl(params) {
		if (params.length < 1)
			return this.usage();
		const blih = new Blih(this.options);
		blih.request({ path: `/repository/${params[0]}/acls` }, (res) => {
			for (let info in res)
				console.log(`${info}:${res[info]}`);
		});
	}
}

class SSHKey extends Subcommand {
	constructor(options) {
		super(options);
		this.usage_message = `
		Usage: ${process.argv[1]} [options] sshkey command ...
		
		Commands :
		    upload [file]\t\t\tUpload a new ssh-key
		    list\t\t\t\tList the ssh-keys
		    delete [sshkey]\t\t\tDelete the sshkey with comment [sshkey]
		`;
		this.usage_message = '\n  ' + this.usage_message.substr(3).replace(/\n\t\t/g, '\n  ');
	}

	list() {
		const blih = new Blih(this.options);
		blih.request({ path: '/sshkeys' }, (res) => {
			console.log();
			for (let info in res)
				console.log(`${info}:\n${res[info]}\n`);
		});
	}

	upload(params) {
		if (params.length < 1)
			return this.usage();
		const file = params[0];
		const blih = new Blih(this.options);
		fs.readFile(file, 'utf8', (err, data) => {
			if (err) {
				console.error(`Can't open file : ${file}`);
				process.exit(1);
			}
			blih.request({ path: '/sshkeys', method: 'POST', data: { sshkey: data.trim() } });
		});
	}

	delete(params) {
		if (params.length < 1)
			return this.usage();
		const blih = new Blih(this.options);
		blih.request({ path: `/sshkey/${params[0]}`, method: 'DELETE' });
	}
}

program.version('1.7')
	   .option('-v, --verbose', 'Enable verbose mode [ actually no difference ]')
	   .option('-u, --user <user>', 'Set user')
	   .option('-b, --baseurl <url>', 'Set baseurl')
	   .option('-t, --token <token>', 'Set token')
	   .option('-U, --useragent <agent>', 'Set useragent');

program.command('repository [params...]')
	   .description('Manages repositories')
	   .action(function (params) {
		   var action = params.shift();
		   const repo = new Repository(program);
		   if (typeof repo[action] !== 'function')
			   action = 'usage';
		   repo[action](params);
	   });

program.command('sshkey [params...]')
	   .description('Manages SSH keys')
	   .action(function (params) {
		   var action = params.shift();
		   const sshkeys = new SSHKey(program);
		   if (typeof sshkeys[action] !== 'function')
			   action = 'usage';
		   sshkeys[action](params);
	   });

program.command('whoami')
	   .description('Ask who you are')
	   .action(function() {
		   const blih = new Blih(program);
		   blih.request({ path: "/whoami" });
	   });

program.parse(process.argv);

if (program.args.length === 0 || !(program.args[0] instanceof program.Command))
	program.help();
