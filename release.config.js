/**
 * @type {import("semantic-release").GlobalConfig}
 */
module.exports = {
  "release": {
    "branches": [ "master" ],
    "repositoryUrl": "https://github.com/krishnamodepalli/video.ts",
    "plugins": [
      "@semantic-release/commit-analyser",
      "@semantic-release/release-notes-generator",
      "@semantic-release/changelog",
      "@semantic-release/github",
    ]
  }
}
