#! /usr/bin/env node
const os = require("os");
const fs = require("fs");
const inquirer = require("inquirer");
const { execSync } = require("child_process");

const updateNotifier = require("update-notifier");
const pkg = require("./package.json");

const notifier = updateNotifier({ pkg });

const commands = {
  install: {
    homebrew:
      '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
    mas: "brew install mas",
    DsStoreDeleter:
      "wget -q https://raw.githubusercontent.com/GabrielCrackPro/Setup/main/Scripts/delete-dsstore.py",
  },
  update: {
    system: "sudo softwareupdate -i -a",
    homebrew: "brew update",
    homebrewPackages: "brew upgrade",
    npm: "npm update -g",
    node: "npm update -g node",
    storeApps: "mas upgrade",
  },
  cleanup: {
    homebrewCaches: "brew cleanup",
    DNS: "sudo killall -HUP mDNSResponder",
    DSstore: "python ./deletedsstore.py",
  },
};

const paths = {
  homebrew: {
    name: "Homebrew",
    path: "/opt/homebrew/",
  },
  mas: {
    name: "mas",
    path: "/opt/homebrew/bin/mas",
  },
};

const platform = os.platform();

const main = async () => {
  if (notifier.update) {
    notifier.notify();
  }
  console.log("💻 Checking your system...");
  await wait(1000);
  console.log("\n💻 Your system is: " + platform);

  if (platform === "darwin") {
    console.log("\n💻 Updating system...");
    execSync(commands.update.system);
    if (isInstalled(paths.homebrew.path, paths.homebrew.name)) {
      console.log("\n\n🍺 Updating homebrew...");
      execSync(commands.update.homebrew);
      console.log("\n🍺 Updating homebrew packages...");
      execSync(commands.update.homebrewPackages);
      await inquirer
        .prompt({
          type: "confirm",
          name: "cleanup",
          message: "🍺 Do you want to cleanup the homebrew cache?",
          default: true,
        })
        .then((answer) => {
          if (answer.cleanup) {
            console.log("🍺 Cleaning up homebrew cache...");
            execSync(commands.cleanup.homebrewCaches);
            console.log("🍺 Homebrew cache cleaned up.");
          }
        });
      await inquirer
        .prompt({
          type: "confirm",
          name: "deleteDS_Store",
          message: "🗑 Do you want to delete .DS_Store files?",
          default: true,
        })
        .then((answer) => {
          if (answer.deleteDS_Store) {
            if (fs.existsSync("./deletedsstore.py")) {
              console.log("🗑 Deleting .DS_Store files...");
              execSync(commands.cleanup.DSstore);
              wait(1000);
              console.log("\n🗑 .DS_Store files deleted.");
            } else {
              console.log("🚫 .DS_Store deleter not found 🚫");
              console.log("🌎 Downloading .DS_Store deleter...");
              execSync(commands.install.DsStoreDeleter);
              wait(1000);
              console.log("🗑 Deleting .DS_Store files...");
              execSync(commands.cleanup.DSstore);
              wait(1000);
              console.log("\n 🗑.DS_Store files deleted.");
            }
          }
        });
      await inquirer
        .prompt({
          type: "confirm",
          name: "cleanDNS",
          message: "🚀 Do you want to clean DNS Cache?",
          default: true,
        })
        .then((answer) => {
          if (answer.cleanDNS) {
            console.log("🚀 Cleaning DNS Cache...");
            execSync(commands.cleanup.DNS);
          }
        });
      await inquirer
        .prompt({
          type: "confirm",
          name: "updateNode",
          message: "⭐️ Do you want to update Node?",
          default: false,
        })
        .then((answer) => {
          if (answer.updateNode) {
            console.log("⭐️ Updating NodeJS...");
            execSync(commands.update.node);
            console.log("⭐️ NodeJS updated.");
            console.log("⭐️ Updating NPM...");
            execSync(commands.update.npm);
          }
        });
      await inquirer
        .prompt({
          type: "confirm",
          name: "updateAppsStore",
          message: "💻 Do you want to update App Store apps?",
          default: false,
        })
        .then((answer) => {
          if (answer.updateAppsStore) {
            if (isInstalled(paths.mas.path, paths.mas.name)) {
              console.log("💻 Updating App Store apps...");
              execSync(commands.update.storeApps);
              console.log("💻 App Store apps updated.");
            } else {
              console.log("🚫 mas module not found 🚫");
              console.log("🌎 Downloading mas module...");
              execSync(commands.install.mas);
              wait(1000);
              console.log("💻 Updating App Store apps...");
              execSync(commands.update.storeApps);
              console.log("\n💻 App Store apps updated.");
            }
          }
        });
      console.log("\n💻 System updated.");
      process.exit(0);
    } else {
      await inquirer
        .prompt({
          type: "confirm",
          name: "homebrew",
          message: "Homebrew is not installed. Do you want to install it?",
          default: true,
        })
        .then((answers) => {
          if (answers.homebrew) {
            console.log("🍺 Installing homebrew...");
            execSync(commands.install.homebrew);
            console.log("🍺 Updating homebrew...");
            execSync(commands.update.homebrew);
            console.log("Updating homebrew packages...");
            execSync(commands.update.homebrewPackages);
          } else {
            console.log("🍺 You can install homebrew later.");
          }
        });
    }
  } else {
    console.log("🚨🚫 Sorry, this script only works on MacOS. 🚨🚫");
    process.exit(1);
  }

  function isInstalled(path, name) {
    if (fs.existsSync(path)) {
      console.log(`🍺 ${name} is installed.`);
      return true;
    } else {
      console.log(`🚨🚫 ${name} is not installed 🚫🚨`);
      return false;
    }
  }
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main();
