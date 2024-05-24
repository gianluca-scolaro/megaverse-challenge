import {drawPolyanetCross} from "./phases/draw-polyanet-cross.js";
import {clearMap} from "./clear-map.js";
import {drawLogo} from "./phases/draw-logo.js";
import readline from "node:readline";

// Create an interface for reading input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to display the menu and handle user input
function displayMenu() {
  console.log('\nPlease select an option:');
  console.log('1. Draw Polyanet Cross');
  console.log('2. Draw Logo');
  console.log('3. Clear Map');
  console.log('4. Exit');

  rl.question('Enter your choice: ', (answer) => {
    switch (answer) {
      case '1':
        console.log("Started drawing polyanet cross!")
        drawPolyanetCross(3)
          .then(() => console.log("Finished drawing polyanet cross!"))
          .then(() => rl.close());
        break;
      case '2':
        console.log("Started drawing logo!")
        drawLogo()
          .then(() => console.log("Finished drawing logo!"))
          .then(() => rl.close());
        break;
      case '3':
        console.log("Started cleaning Map!")
        clearMap()
          .then(() => console.log("Finished cleaning Map!"))
          .then(() => rl.close());
        break;
      case '4':
        console.log('Exiting...');
        rl.close();
        return;
      default:
        console.log('Invalid choice, please try again.');
        rl.close();
    }
  });
}

// Display the menu
displayMenu();