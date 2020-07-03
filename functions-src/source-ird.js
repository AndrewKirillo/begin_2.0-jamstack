/**
 * @callback netlifyCallback
 */

const config = require("../config")
const _ = require("lodash")
const axios = require("axios")
const moment = require("moment")
const { v4: uuidv4 } = require("uuid")

const { GithubAPI } = require("./github")

/**
 * Pulls in resources from the Innovation Resources Database {@link https://innovationresourcedatabase.herokuapp.com/},
 * saves the source, id, tags title, url, description, and date of each item in a JSON, and pushes
 * these JSONs as files to Github, where they are recognized by Netlify CMS.
 * @async
 * @param {Object} event: Provided by Netlify, this is similar to the event object received from the AWS API Gateway.
 * @param {Object} context: Provided by Netlify if Identity is enabled, contains a `clientContext` object with `identity` and `user` properties.
 * @param {netlifyCallback} callback: Defined like callback in an AWS Lambda function, used to return either an error, or a response object.
 */
const sourceIRD = (_event, context, callback) => {
  if (context.clientContext) {
    // TODO: Look into using the context object for auth.
    // const { identity, user } = context.clientContext;
    let gh = new GithubAPI({
      token: config.gitHubToken,
    })

    gh.init()
      .then(() => {
        axios
          .get(
            `https://berkeley-innovation-resources.herokuapp.com/resources?api_key=${config.irdApiKey}`
          )
          .then(resourcesResponse => {
            const filesToPush = []
            const tagFields = [
              "types",
              "audiences",
              "population_focuses",
              "availabilities",
              "innovation_stages",
              "topics",
              "technologies",
            ]

            resourcesResponse.data.forEach(resource => {
              const id = uuidv4()
              const date = moment().format("YYYY-MM-DD")
              const tags = _.flatMap(tagFields, field =>
                _.map(
                  _.filter(resource[field], tag => tag.val),
                  tag => tag.val
                )
              )

              filesToPush.push({
                content: JSON.stringify({
                  templateKey: "ird-resource",
                  source: "ird",
                  id,
                  tags,
                  title: resource.title,
                  url: resource.url,
                  description: resource.desc,
                  date,
                }),
                path: `src/data/ird/ird-${date}-${id}.json`,
              })
            })

            gh.pushFiles(
              "Testing IRD content pushing to the proper folder with id",
              filesToPush
            ).then(() => {
              callback(null, {
                statusCode: 200,
                body: JSON.stringify(filesToPush),
              })
            })
          })
      })
      .catch(err => {
        callback(err)
      })
  }
}

module.exports.handler = sourceIRD