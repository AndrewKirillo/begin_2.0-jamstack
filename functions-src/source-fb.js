/**
 * @callback netlifyCallback
 */

// Note that `netlify-lambda` only locally emulates Netlify Functions, while `netlify-identity-widget` interacts with a real Netlify Identity instance. This means that `netlify-lambda` doesn't support Netlify Functions + Netlify Identity integration.

var vfile = require('vfile')
var unified = require('unified')
var parseRehype = require('rehype-parse')
var rehype2remark = require('rehype-remark')
const config = require("../config");
var stringify = require('remark-stringify')

const { GithubAPI } = require("./github");

const {FB, FacebookApiException} = require('fb');
FB.setAccessToken(config.apikey) //Re-input

/**
 * Pulls in RSS content in HTML form, transforms it into Markdown, and pushes it to Github.
 * @async
 * @param {Object} event: Provided by Netlify, this is similar to the event object received from the AWS API Gateway.
 * @param {Object} context: Provided by Netlify if Identity is enabled, contains a `clientContext` object with `identity` and `user` properties.
 * @param {netlifyCallback} callback: Defined like callback in an AWS Lambda function, used to return either an error, or a response object.
 */
const sourceFB = (_event, context, callback) => {
  if (context.clientContext) {
    // TODO: Look into using the context object for auth.
    // const { identity, user } = context.clientContext;
    let gh = new GithubAPI({
      username: config.username, //Reinput
      password: config.password,
    });

    gh.setRepo('somaniarushi', 'begin_2.0-jamstack');
    gh.setBranch('master')
      .then(() => {
        FB.api(
            '/techvista18',
            'GET',
            {"fields":"feed"},
            function(response) {
                
                const processor = unified()
                .use(parseRehype, {emitParseErrors: true, duplicateAttribute: false})
                .use(rehype2remark)
                .use(stringify);

                const filesToPush = [];
                const filePromises = [];

                response.feed.data.forEach(item => {
                    filePromises.push(processor.process(vfile(Buffer.from(item.message))));
                  })
                  
                Promise.all(filePromises)
                  .then(files => {
                    files.forEach((file, i)=> {
                      filesToPush.push({ content: file.toString(), path: `src/data/fb/test-fb-${i}.md` })
                    })
                });

                    gh.pushFiles("Testing multiple facebook file push", filesToPush)
                .then(() => {
                  callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(response.feed.data),
                  })
                })
            })
            }).catch(err => {
                    callback(err);
                    })
                    
            }
        };
        
 
module.exports.handler = sourceFB;