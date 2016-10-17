#!/usr/bin/env node
'use strict';

const program = require('commander');
const prompt = require('prompt-sync')();
const utf8 = require('utf8');
const crypto = require('crypto');
const request = require('request');
const stringify = require('json-stable-stringify')

class Blih {
    constructor(options) {
        this.options = options;
        this._baseUrl = options.baseurl || 'https://blih.epitech.eu/';
        this._user = options.user || this.get_user();
        this._token = options.token || this.token_calc();
        this._verbose = options.verbose || false;
        this._userAgent = options.useragent || 'blih-' + program.version;
    }

    sign_data(data) {
        const sign = crypto.createHmac('sha512', this._token);
        return {
            user: this._user,
            signature: sign.update(this._user + stringify(data, {space: "    "})).digest('hex'),
            data: data
        };
    }

    request(options) {
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
            if (err)
              return console.error('request failed:', err);
            return console.log(body);
        });
    }

    get_user() {
        return this.options.user || process.env.LOGNAME || process.env.USER ||
            process.env.LNAME || process.env.USERNAME;
    }

    token_calc() {
        return crypto.createHash('sha512').update(prompt('Password: ', {echo: '*'})).digest('hex');
    }

    repo_create(name, type, description) {
        var data = { name, type: type || 'git' };
        if (description)
            data['description'] = description;
        return this.request({ path: '/repositories', method:'POST', data: data });
    }
}

class subcommand {
    constructor(options) {
        this.options = options;
    }
}

class Repository extends subcommand {
    create(params) {
        if (params.length < 1)
            return this.usage()
        const blih = new Blih(this.options)
        blih.repo_create(params[0]);
    }

    list() {
        console.log(process.argv);
    }

    info() {
        console.log(process.argv);
    }

    delete() {
        console.log(process.argv);
    }

    setacl() {
        console.log(process.argv);
    }

    getacl() {
        console.log(process.argv);
    }

    usage() {
        console.log('Usage: ' + process.argv[1] + ' [options] repository command ...')
        console.log()
        console.log('Commands :')
        console.log('\tcreate repo\t\t\t-- Create a repository named "repo"')
        console.log('\tinfo repo\t\t\t-- Get the repository metadata')
        console.log('\tgetacl repo\t\t\t-- Get the acls set for the repository')
        console.log('\tlist\t\t\t\t-- List the repositories created')
        console.log('\tsetacl repo user [acl]\t\t-- Set (or remove) an acl for "user" on "repo"')
        console.log('\t\t\t\t\tACL format:')
        console.log('\t\t\t\t\tr for read')
        console.log('\t\t\t\t\tw for write')
        console.log('\t\t\t\t\ta for admin')
    }
}

class sshkey extends subcommand {
    list() {

    }

    upload() {

    }

    delete() {

    }

    usage() {

    }
}


program
.version('1.7')
.option('-v, --verbose', 'Enable verbose mode')
.option('-u, --user <user>', 'Set user')
.option('-b, --baseurl <url>', 'Set baseurl')
.option('-t, --token <token>', 'Set token')
.option('-U, --useragent <agent>', 'Set useragent');

program
.command('repository [params...]')
.description('Manages repositories')
.action(function (params) {
    const action = params.shift();
    var repo = new Repository(program);
    if (typeof repo[action] === 'function')
        repo[action](params);
    else
        repo.usage();
});

program
.command('sshkey')
.description('Manages SSH keys')
.action(function (params) {
    const action = params.unshift();
    var sshkeys= new sshkey(program);
    if (typeof sshkeys[action] === 'function')
        sshkeys[action]();
    else
        sshkeys.usage();
});

program
.command('whoami')
.description('Ask who you are')
.action(function() {
    console.log('whoami');
});

program.parse(process.argv);

if (program.args.length === 0)
  program.help();