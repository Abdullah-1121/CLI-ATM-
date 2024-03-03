#!/usr/bin/env node
//       I M P O R T I N G     A L L     T H E       P A C K A G E S  
import inquirer from "inquirer";
import chalk from "chalk";
import * as fs from 'fs';
//     W E L C O M I N G    T H E    U S E R
console.log(chalk.green("Welcome to the ATM!"));
let User = [];
let UserfilePath = './data.json';
// function to load user data from the file
function LoaduserData() {
    try {
        let data = fs.readFileSync(UserfilePath, 'utf8');
        const userDataObject = JSON.parse(data);
        // Convert the object of users into an array
        User = Object.values(userDataObject);
    }
    catch {
        console.log('Error , Could not load user data');
        User = [];
    }
}
//function to save user data 
function SaveUserData() {
    try {
        fs.writeFileSync(UserfilePath, JSON.stringify(User));
        // console.log('User Data Saved Successfully');
    }
    catch {
        console.log("Couldn't save the data");
    }
}
//fucntion to register new user and save its data
function RegisterUser(Uname, Pin, Balance) {
    LoaduserData(); // Load existing data
    if (Array.isArray(User)) {
        User.push({ userName: Uname, userPin: Pin, balance: Balance });
        console.log(`User '${Uname}' registered successfully.`);
    }
    else {
        console.log(Array.isArray(User));
    }
    SaveUserData(); // Save updated data
}
// Creating function for depositing 
async function deposit(User, UsName) {
    let userInput = await inquirer.prompt([{
            name: 'amount',
            type: 'number',
            message: 'Enter the amount you want to Deposit'
        }, {
            name: 'confirm',
            type: 'confirm',
            message: 'Are you sure you want to proceed?'
        }]);
    let userInddex = User.findIndex(user => user.userName == UsName);
    if (userInddex !== -1) {
        User[userInddex].balance += userInput.amount;
        console.log(`You have Deposited ${userInput.amount}`);
        console.log(` Success! Your new balance is ${User[userInddex].balance}`);
        SaveUserData();
    }
    else {
        console.log('User Not found');
    }
}
// Function for withdrawing money from an account
async function WithDraw(User, UsName) {
    let userInput = await inquirer.prompt([{
            name: 'amount',
            type: 'number',
            message: 'Enter the amount you want to Withdraw'
        }, {
            name: 'confirm',
            type: 'confirm',
            message: 'Are you sure you want to proceed?'
        }]);
    let userInddex = User.findIndex(user => user.userName == UsName);
    if (userInddex !== -1) {
        if (User[userInddex].balance - userInput.amount > 0) {
            User[userInddex].balance -= userInput.amount;
            console.log(`You have WithDrawn ${userInput.amount}`);
            console.log(` Success! Your new balance is ${User[userInddex].balance}`);
        }
        else {
            console.log(`Insuffiecient Balance = ${User[userInddex].balance}`);
        }
        SaveUserData();
    }
    else {
        console.log('User Not found');
    }
}
//function for transferring money 
async function Transfer(User, UsName) {
    let userInput = await inquirer.prompt([{
            name: 'Name',
            type: 'input',
            message: 'Enter the accountName you want to Transfer to'
        },
        {
            name: 'amount',
            type: 'number',
            message: 'Enter the amount you want to Transfer'
        }, {
            name: 'confirm',
            type: 'confirm',
            message: 'Are you sure you want to proceed?'
        }]);
    let userInddex = User.findIndex(user => user.userName == UsName);
    if (userInddex !== -1) {
        if (User[userInddex].balance - userInput.amount > 0) {
            User[userInddex].balance -= userInput.amount;
            console.log(`You have Transferred ${userInput.amount} to ${userInput.Name}`);
            console.log(` Success! Your new balance is ${User[userInddex].balance}`);
        }
        else {
            console.log(`Insuffiecient Balance = ${User[userInddex].balance}`);
        }
        SaveUserData();
    }
    else {
        console.log('User Not found');
    }
}
// Main : 
//    Perform function to perform all the tasks 
async function Perform() {
    let enter = await inquirer.prompt([{
            name: 'LOS',
            type: 'list',
            choices: ['LogIn', 'SignUp'],
            message: 'If you have an account , Please Login otherwise sign up to create an account'
        }]);
    if (enter.LOS == 'LogIn') {
        let userInput = await inquirer.prompt([{
                name: 'Username',
                type: 'input',
                message: 'Enter your username'
            }, {
                name: 'UserPin',
                type: 'input',
                message: 'Enter your 6 Digits Pin'
            }]);
        LoaduserData();
        let user = User.find(user => user.userName == userInput.Username);
        let p = User.find(user => user.userPin == userInput.UserPin);
        let P = User.find(user => user.balance == userInput);
        if (user) {
            console.log(`${user.userName} is successfully logged in`);
            console.log(`${user.userName}'Balance is = ${user.balance}`);
            // TAKING USER'S INPUT FOR THE OPERATIONS HE/SHE WANT TO PERFORM
            let operation = await inquirer.prompt([{
                    name: 'operations',
                    type: 'list',
                    choices: ['Deposit', 'WithDrawl', 'Transfer'],
                    message: "What would you like to do?"
                }]);
            console.log(operation.operations);
            if (operation.operations == 'Deposit') {
                await deposit(User, user.userName);
            }
            else if (operation.operations == 'WithDrawl') {
                await WithDraw(User, user.userName);
            }
            else if (operation.operations == 'Transfer') {
                await Transfer(User, user.userName);
            }
        }
        else {
            console.log('Invalid Credentials');
        }
    }
    else if (enter.LOS == 'SignUp') {
        let userInput = await inquirer.prompt([{
                name: 'Username',
                type: 'input',
                message: 'Enter your username'
            }, {
                name: 'UserPin',
                type: 'input',
                message: 'Set your 6 Digits Pin'
            }, {
                name: 'UserBalance',
                type: 'number',
                message: "How much money will be deposited initially?",
            }]);
        RegisterUser(userInput.Username, userInput.UserPin, userInput.UserBalance);
        let user = User.find(user => user.userName == userInput.Username);
        let operation = await inquirer.prompt([{
                name: 'operations',
                type: 'list',
                choices: ['Deposit', 'WithDrawl', 'Transfer'],
                message: "What would you like to do?"
            }]);
        if (operation.operations == 'Deposit') {
            await deposit(User, userInput.Username);
        }
        else if (operation.operations == 'WithDrawl') {
            await WithDraw(User, userInput.Username);
        }
        else if (operation.operations) {
            await Transfer(User, userInput.Username);
        }
    }
}
let res;
do {
    await Perform();
    console.log('Do you want to continue ?');
    res = await inquirer.prompt([{
            name: 'continue',
            type: 'input',
            message: 'If you want to continue press y otherwise press any key to exit'
        }]);
} while (res.continue == 'y' || res.continue == 'Y');
