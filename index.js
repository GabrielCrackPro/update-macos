#! /usr/bin/env node
const os = require("os");
const fs = require("fs");
const inquirer = require("inquirer");
const { execSync } = require("child_process");

const updateNotifier = require("update-notifier");
const pkg = require("./package.json");

updateNotifier({ pkg }).notify();

const platform = os.platform();

const main = async () => {
  console.log("💻 Checking your system...");
  await wait(1000);
  console.log("\n💻 Your system is: " + platform);

  if (platform === "darwin") {
    console.log("\n💻 System update script");
    console.log("\n💻 Updating system...");
    execSync("sudo softwareupdate -i -a");
    if (isInstalled("/opt/homebrew/", "homebrew")) {
      console.log("\n\n🍺 Updating homebrew...");
      execSync("brew update");
      console.log("\n🍺 Updating homebrew packages...");
      execSync("brew upgrade");
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
            execSync("brew cleanup");
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
              execSync("python ./deletedsstore.py");
              wait(1000);
              console.log("\n🗑 .DS_Store files deleted.");
            } else {
              console.log("🚫 .DS_Store deleter not found 🚫");
              console.log("🌎 Downloading .DS_Store deleter...");
              execSync(
                "wget -q https://raw.githubusercontent.com/GabrielCrackPro/Setup/main/Scripts/delete-dsstore.py"
              );
              wait(1000);
              console.log("🗑 Deleting .DS_Store files...");
              execSync("python delete-dsstore.py");
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
            execSync("sudo killall -HUP mDNSResponder");
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
            execSync("npm update node");
            console.log("⭐️ NodeJS updated.");
            console.log("⭐️ Updating NPM...");
            execSync("npm update");
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
            if (isInstalled("/opt/homebrew/bin/mas", "mas")) {
              console.log("💻 Updating App Store apps...");
              execSync("mas upgrade");
              console.log("💻 App Store apps updated.");
            } else {
              console.log("🚫 mas module not found 🚫");
              console.log("🌎 Downloading mas module...");
              execSync("brew install mas");
              wait(1000);
              console.log("💻 Updating App Store apps...");
              execSync("mas upgrade");
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
            execSync(
              '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
            );
            console.log("🍺 Updating homebrew...");
            execSync("brew update");
            console.log("Updating homebrew packages...");
            execSync("brew upgrade");
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
