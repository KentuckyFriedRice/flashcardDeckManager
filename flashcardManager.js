const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');

// Directory where the JSON decks will be stored
const decksDirectory = './decks';

// Create directory if it doesn't exist
if (!fs.existsSync(decksDirectory)) {
    fs.mkdirSync(decksDirectory);
}

// Helper function to load existing decks
function loadDeck(deckFile) {
    const filePath = path.join(decksDirectory, deckFile);
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } else {
        console.log('Deck not found!');
        return null;
    }
}

// Function to create a new deck
function createNewDeck() {
    const deckName = readlineSync.question('Enter the name for the new deck: ') + '.json';
    const questions = [];
    let addMore = true;

    while (addMore) {
        const question = readlineSync.question('Enter the flashcard question: ');
        const answer = readlineSync.question('Enter the flashcard answer: ');
        questions.push({ question, answer });

        addMore = readlineSync.keyInYNStrict('Do you want to add another flashcard? ');
    }

    const deckData = JSON.stringify(questions, null, 2);
    fs.writeFileSync(path.join(decksDirectory, deckName), deckData);
    console.log(`New deck '${deckName}' created!`);
}

// Function to edit an existing deck
function editDeck() {
    const deckList = fs.readdirSync(decksDirectory);
    if (deckList.length === 0) {
        console.log('No decks available to edit.');
        return;
    }

    const deckChoice = readlineSync.keyInSelect(deckList, 'Select a deck to edit:');
    if (deckChoice === -1) return;

    const deckFile = deckList[deckChoice];
    let deck = loadDeck(deckFile);

    let addMore = true;
    while (addMore) {
        const question = readlineSync.question('Enter a new flashcard question: ');
        const answer = readlineSync.question('Enter the flashcard answer: ');
        deck.push({ question, answer });

        addMore = readlineSync.keyInYNStrict('Do you want to add another flashcard? ');
    }

    const updatedDeckData = JSON.stringify(deck, null, 2);
    fs.writeFileSync(path.join(decksDirectory, deckFile), updatedDeckData);
    console.log(`Deck '${deckFile}' has been updated!`);
}

// Function to list all available decks
function listDecks() {
    const deckList = fs.readdirSync(decksDirectory);
    if (deckList.length === 0) {
        console.log('No decks available.');
        return;
    }

    console.log('Available Decks:');
    deckList.forEach((deck, index) => {
        console.log(`${index + 1}. ${deck}`);
    });
}

// Main menu function
function mainMenu() {
    console.log('Flashcard Deck Manager');
    const options = ['Create New Deck', 'Edit Existing Deck', 'List All Decks', 'Exit'];
    let choice = readlineSync.keyInSelect(options, 'Choose an option:');

    switch (choice) {
        case 0:
            createNewDeck();
            break;
        case 1:
            editDeck();
            break;
        case 2:
            listDecks();
            break;
        case 3:
        default:
            console.log('Exiting...');
            process.exit();
    }
}

// Start the program
mainMenu();
