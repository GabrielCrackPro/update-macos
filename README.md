# Update MacOS

[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/GabrielCrackPro/update-macos/master/LICENSE)

A script to update system and apps

## Install

<code>
npm install -g update-macos
</code>

## Run without installing

<code>
npx update-macos
</code>

## Usage

<code>
update-macos
</code>

## What it does?

### Updates

- System using <code>softwareupdate</code> command
- Homebrew packages using [Homebrew](https://brew.sh/)
- Node packages using <code>npm upgrade</code> command
- Mac App Store apps using [mas](https://github.com/mas-cli/mas) command

### Cleanup

- Homebrew packages using [Homebrew](https://brew.sh/)
- .DS_Store files using <a href="https://github.com/GabrielCrackPro/Setup/blob/main/Scripts/delete-dsstore.py">this custom script</a>

## More things to come...
