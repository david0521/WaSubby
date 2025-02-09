# Server – ExpressJS Backend

This [ExpressJS](https://expressjs.com/) template provides the basic infrastructure for a JSON API with MongoDB persistency with [Mongoose](https://mongoosejs.com/).

## Server Structure

| File                                                                         | Purpose                                                                                 | What you do?                                       |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------- |
| [README.md](./README.md)                                                     | Everything about the server                                                             | **READ ME** carefully!                             |
| [app.js](./app.js)                                                           | JavaScript entry point for Express application                                          | Import new routes/controllers                      |
| `routes/`                                                                    | Implementation of Express endpoints                                                     | Define new route handlers                          |
| `models/`                                                                    | [Mongoose](https://mongoosejs.com/) models                                              | Define data schema                                 |
| [tests/server.postman_collection.json](tests/server.postman_collection.json) | [Postman test scripts](https://learning.postman.com/docs/postman/scripts/test-scripts/) | Replace with your exported Postman test collection |
| [docs/FAQ.md](docs/FAQ.md)                                                   | List of FAQs                                                                            | Find answers to common questions                   |
| [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)                           | List of problems and solutions                                                          | Find solutions for common error messages           |
| [package.json](package.json)                                                 | Project meta-information                                                                | —                                                  |

> NOTE: The (mandatory) exercises are essential for understanding this template and will _save_ you time!

Optional: Learn how to create such a project template in this [tutorial](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/skeleton_website).

## Requirements

- [Node.js](https://nodejs.org/en/download/) (v18) => installation instructions for [Linux](https://github.com/nodesource/distributions), use installers for macOS and Windows (don't forget to restart your Bash shell)
- [MongoDB](https://www.mongodb.com/download-center/community?jmp=nav) (>=v4.4) must be running locally on port 27017 => installation instructions for [macOS](https://github.com/joe4dev/dit032-setup/blob/master/macOS.md#mongodb), [Windows](https://github.com/joe4dev/dit032-setup/blob/master/Windows.md#mongodb), [Linux](https://github.com/joe4dev/dit032-setup/blob/master/Linux.md#mongodb)
- [Postman](https://www.getpostman.com/downloads/) (>=v8) for API testing
- [whisper-ctranslate2](https://github.com/Softcatala/whisper-ctranslate2) for subtitle generation

## Project setup

You need [whisper-ctranslate2](https://github.com/Softcatala/whisper-ctranslate2) installed.

Otherwise, you can also install another whisper cli with the same functionality.
The CI, for example, uses whisper. If you decide not to use whisper-ctranslate2,
then make sure to set the `WHISPER_COMMAND` environment variable to the whisper command.

The first video transcription will take longer, as the language model needs to be downloaded.

Then, make **sure** you are in the server directory `cd server`

Installs all project dependencies specified in [package.json](./package.json).

```bash
npm install
```

## Start the server with auto-restarts for development

Automatically restarts your server if you save any changes to local files.

```bash
npm run dev
```

Or use `npm run fast-dev` to use a faster (but less accurate) whisper model.

## Start the server

```bash
npm start
```

## Run the Postman Tests

Starts a new server on another port (default `3001`) and runs the `server` postman test collection against a test database (default `serverTestDB`).

```bash
npm test
```

`npm test` will use `whisper-ctranslate2` (which we recommend) per default,
and `npm run ci-test` will use `whisper` (intended for the CI)

## Postman Tests

We use the API testing tool Postman to define example HTTP requests and test assertions. Your tests will be automatically executed in GitLab pipelines whenever you push to the `master` branch. Try to do that as often as possible.

- [Set up Postman for your project](./docs/POSTMAN.md)

> Remember to **export and commit** any test changes back to `tests/server.postman_collection.json` and make sure `npm test` succeeds for your final submission!

## Building and pushing the Docker image

This is not required for running, only for the CI.

This builds the image for amd64 (you might use arm etc.) architecture, which is the architecture of the
GitLab runners, and pushes it into the GitLab registry.

```bash
docker buildx build --platform linux/amd64 -t registry.git.chalmers.se/courses/dit342/2023/group-22-web --no-cache .
docker push registry.git.chalmers.se/courses/dit342/2023/group-22-web
```

## Error Handling

- [Error Handling in Node.js](https://www.joyent.com/node-js/production/design/errors)
- [Error Handling in Express.js](https://expressjs.com/en/guide/error-handling.html)

## Debugging with VSCode

1. Set a breakpoint by clicking on the left side of a line number
2. Click _Run > Start Debugging_ (Choose the "Debug Server" config if you opened the combined workspace)

> Learn more in the [VSCode Debugging Docs](https://code.visualstudio.com/docs/editor/debugging).
