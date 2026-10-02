# @umts/stimulus

Stimulus controllers for UMTS rails apps.

Documentation and usage instructions are hosted on [github pages](https://umts.github.io/stimulus/).

## Contributing

Bug reports and pull requests are welcome on [GitHub][github].

Due to automatic version detection in our release process, **all commits to the master branch must follow
[conventional commits][conventional-commits] formatting.** Pay close attention to this when squashing your PRs and
setting your commit messages on the main branch.

## Development

- controllers are located in `lib/`

### Requirements

- node.js

### Scripts

```bash
npm run dev       # run local demo server
npm run build     # build distribution files and types
npm run docs      # build and serve documentation locally
npm run fmt       # formatter
npm run fmt:check # formatter (without corrections)
npm run lint      # javascript linter
npm run test      # run tests
```

## Release

Releases are (mostly) automated using [semantic-release][semantic-release]. It can be run using the `release.yml` github
action, which has a manual `workflow_dispatch` trigger.

Again, **all commits to the master branch must follow [conventional commits][conventional-commits] format.** Verify
that all commits since the last release adhere to the standard before triggering a release.

## License

The application is available as open source under the terms of the [MIT License](license).

[conventional-commits]: https://www.conventionalcommits.org/en/v1.0.0/#summary
[github]: https://github.com/umts/stimulus
[license]: https://opensource.org/licenses/MIT
[semantic-release]: https://github.com/semantic-release/semantic-release
