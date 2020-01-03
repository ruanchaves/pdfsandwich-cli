// node pdfsandwich.js /run/media/user/DADOS1/tmp/out.pdf ./test.pdf

const fs = require('fs')
const request = require('request');
const Axios = require('axios')
const querystring = require('querystring');
const yaml = require('js-yaml');
const config = yaml.safeLoad(fs.readFileSync('./config.yml', 'utf8'))

var args = process.argv.slice(2);
var address_prefix = ''
if (config.HTTPS == true ) {
    address_prefix = 'https://'
} else {
    address_prefix = 'http://'
}
var host = address_prefix + config.host + ':' + config.port.toString() + '/'
console.log(host)

const writeFile = async (file_url, target) => {
    return Axios({
        method: "get",
        url: file_url,
        responseType: "stream"
    }).then(function (response) {
        response.data.pipe(fs.createWriteStream(target));
    });
}

const uploadFile = async (file_url, unique_id, languages, source) => {
    return new Promise(function (resolve, reject) {
        request.post({
            url: file_url,
            formData: {
                unique_id: unique_id,
                languages: languages,
                pdf: fs.createReadStream(source)
            },
        }, function (err, res, body) {
            if (err) {
                reject(err)
            }
            resolve(body)
        });
    });
}

const getLink = async (key, url) => {
    return new Promise(function (resolve, reject) {
        var form = {
            unique_id: key
        };
        var formData = querystring.stringify(form);
        var contentLength = formData.length;
        request({
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            uri: url,
            body: formData,
            method: 'POST'
        }, function (err, res, body) {
            if (err) {
                reject(err)
            }
            resolve(body)
        });
    });
}

const downloadFile = async (key, url, target) => {
    return new Promise(function (resolve, reject) {
        var form = {
            url: key
        };
        var formData = querystring.stringify(form);
        var contentLength = formData.length;
        request({
            headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            uri: url,
            body: formData,
            method: 'POST'
        }, async (err, res, body) => {
            let response = await writeFile(body.replace(/['"]+/g, ''), target)
            if (err) {
                reject(err)
            }
            resolve(response)
        });
    });
}


const run = async (source) => {
    let target = args[1]
    let upload_url = host + config.upload_route
    let link_url = host + config.link_route
    let download_url = host + config.download_route
    let unique_id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    await uploadFile(upload_url, unique_id, config.languages, source)
    let link = await getLink(unique_id, link_url)
    console.log(' link :' + link)
    await downloadFile(link.replace(/['"]+/g, ''), download_url, target)
}

run(args[0])