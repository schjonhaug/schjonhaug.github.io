# schjonhaug.dev

Source of the Jekyll blog at <schjonhaug.dev>.

## Initial setup

### Prerequisites

- [Homebrew](https://brew.sh)
- Ruby via Homebrew. macOS system Ruby is too old for this repo's Bundler/Jekyll toolchain.

### Setup

Install Ruby and make sure the Homebrew version is first on `PATH`:

```shell
brew install ruby
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

Verify that the active Ruby is the Homebrew one:

```shell
ruby -v
bundle -v
```

Then install the project dependencies:

```shell
bundle install
```

If Bundler reports that the lockfile requires a newer Bundler version, install the version it asks for and retry:

```shell
gem install bundler
bundle install
```

### Run locally with drafts

```shell
bundle exec jekyll serve --draft
```

### Check for updates

```shell
bundle outdated
```

and then, in case of updates

```shell
bundle update
```
