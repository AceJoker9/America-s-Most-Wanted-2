
function app(people) {
    displayWelcome();
    runSearchAndMenu(people);
    return exitOrRestart(people);
}

function displayWelcome() {
    alert('Hello and welcome to the Most Wanted search application!');
}

function runSearchAndMenu(people) {
    const searchResults = searchPeopleDataSet(people);

    if (searchResults.length > 1) {
        displayPeople('Search Results', searchResults);
    }
    else if (searchResults.length === 1) {
        const person = searchResults[0];
        mainMenu(person, people);
    }
    else {
        alert('No one was found in the search.');
    }
}

function searchByTraits(people) {


    const searchCriteria = validatedPromptForTraits();
    let outcome = people;
    for (let i = 0; i < searchCriteria.length; i++) {
        const trait = searchCriteria[i].trait;
        const value = searchCriteria[i].value;
        if(trait === 'name') {
            outcome = outcome.filter(person => {
                const fullName = '${person.firstName} ${person.lastName}';
                return fullName.toLowerCase().includes(value.toLowerCase());
            });
        } else {
            outcome = outcome.filter(person => {
                return person[trait].toLowerCase().includes(value.toLowerCase());
            });
        }
    }

    if (outcome.length > 1) {
        const furtherFilerChoice = validatedPrompt('Would you like to further filter down the results?',
        ['yes', 'no']
        );
        if (furtherFilerChoice === 'yes') {
            outcome = searchByTraits(outcome);
        }
    }

    return outcome;




    const traitChoice = validatedPrompt('Please enter in which trait you would like to search by.',['height', 'weight', 'eye color', 'occupation']);
    let traitValue;
    switch (traitChoice) {
        case 'Height':
            traitValue = validatedPrompt('Please enter in the height to search by (in inches).', [], 'number');
            break;
        case 'weight':
            traitValue = validatedPrompt('Please enter in the weight to search by (in pounds).', [], 'numnber');
            break;
        case 'eye color':
            traitValue = validatedPrompt('Pleas enter in the eye color to search by,', ['Brown','blue', 'green','hazel','amber']);
            break;
        case 'occupation':
            traitValue = validatedPrompt('Please enterin the occupation to search by.', [], 'string');
            break; 
            default:
                return searchByTraits(people);
    }

    const results = people.filter(person => {
        switch (traitChoice) {
            case 'height':
                return person.height === traitValue;
            case 'weight':
                return person.weight === traitValue;
            case 'eye color':
                return person.eyeColor === traitValue
                case 'occupation':
                    return person.occupation.toLowerCase().includes(traitValue.toLowerCase());
        }
    });

    if(results.length === 0) {
        alert('No people found with ${traitChoice} of ${traitValue}.');
    } else {
        console.log('People found with ${traitChoice} of ${traitValue}:');
        results.forEach(person => console.log('${person.firstName}${person.lastName}'));
    }

    return results;

}


function displayFamily(people, person) {
    const {parents, currentSpouse} = person;
    const siblings = findSiblings(people, person);
    const family = [];

    // Add Parents to family array
    parents.forEach(parentId => {
        const parent = findById(people, parentId);
        family.push({ name: '${parent.firstName} ${parent.lastName}', relation: 'parent'});
    });

    // Add spouse to family array
    if(currentSpouse) {
        const spouse = findById(pepople, currentSpouse);
        family.push({ name: '${spouse.firstName} ${spouse.lastName}', relation: 'parent'});
    }

    // Add Siblings to family array
    siblings.forEach(sibling => {
        family.push({ name: '${sibling.firstName} ${sibling.lastName}', relation: 'sibling'});
    });

    //Display family members
    console.log('Family members of ${person.firstName} ${person.lastName}:');
    family.forEach(member => {
        console.log('${member.relation}: ${member.name}');
    });


}



function getDescendants(person, people) {
    const descendants = [];
    if (person.children.length === 0) {
        return descendants;
    }
    for (let childId of person.children) {
        const child = people.find(p => p.id === childId);
        const childDescendants = getDescendants(child, people);
        descendants.push(...childDescendants, child.firstName + ' ' + child.lastName);
    }

    return descendants
}




const searchCriteria = [
    { trait: 'gender', value: 'female',},
    {trait: 'gender', value: 'male'},
    {trait: 'eyeColor', value: 'black'},
    { trait: 'eyeColor', value: 'brown',},
    {trait: 'eyeColor', value: 'blue'},
    { trait: 'eyeColor', value: 'green'}, 
    { trait: 'eyeColor', value: 'hazel'}, 
    {trait: 'occupation', value: 'doctor'},
    {trait: 'occupation', value: 'landscaper'},
    {trait: 'occupation', value: 'nurse'},
    {trait: 'occupation', value: 'programmer'},
    {trait: 'occupation', value: 'assistant'},
    {trait: 'occupation', value: 'architect'},
    {trait: 'occupation', value: 'politician'},
    {trait: 'occupation', value: 'student'},
]


function searchPeopleDataSet(people) {

    const searchTypeChoice = validatedPrompt(
        'Please enter in what type of search you would like to perform.',
        ['id', 'name', 'traits']
    );

    let results = [];
    switch (searchTypeChoice) {
        case 'id':
            results = searchById(people);
            break;
        case 'name':
            results = searchByName(people);
            break;
        case 'traits':
            
            results = searchByTraits(people);
            break;
        default:
            return searchPeopleDataSet(people);
    }

    


if (results.length === 0) {
    console.log('No results found.');
} else {
    results.forEach(person => {
        console.log('First Name:', person.firstName);
        console.log('Last Name:', person.lastName);
        console.log('Height:', person.height);
        console.log('Weight:', person.weight);
        console.log('Eye Color:', person.eyeColor);
        console.log('Occupation:', person.occupation);
        console.log('Parents:', person.parents);
        console.log('Current Spouse:', person.currentSpouse);
    });
}

return results;
}

function searchById(people) {
    const idToSearchForString = prompt('Please enter the id of the person you are searching for.');
    const idToSearchForInt = parseInt(idToSearchForString);
    const idFilterResults = people.filter(person => person.id === idToSearchForInt);
    return idFilterResults;
}

function searchByName(people) {
    const firstNameToSearchFor = prompt('Please enter the the first name of the person you are searching for.');
    const lastNameToSearchFor = prompt('Please enter the the last name of the person you are searching for.');
    const fullNameSearchResults = people.filter(person => (person.firstName.toLowerCase() === firstNameToSearchFor.toLowerCase() && person.lastName.toLowerCase() === lastNameToSearchFor.toLowerCase()));
    return fullNameSearchResults;
}

function mainMenu(person, people) {

    const mainMenuUserActionChoice = validatedPrompt(
        `Person: ${person.firstName} ${person.lastName}\n\nDo you want to know their full information, family, or descendants?`,
        ['info', 'family', 'descendants', 'quit']
    );

    switch (mainMenuUserActionChoice) {
        case "info":
            //! TODO
            // displayPersonInfo(person);
            break;
        case "family":
            //! TODO
            // let personFamily = findPersonFamily(person, people);
            // displayPeople('Family', personFamily);
            break;
        case "descendants":
            //! TODO
            // let personDescendants = findPersonDescendants(person, people);
            // displayPeople('Descendants', personDescendants);
            break;
        case "quit":
            return;
        default:
            alert('Invalid input. Please try again.');
    }

    return mainMenu(person, people);
}

function displayPeople(displayTitle, peopleToDisplay) {
    const formatedPeopleDisplayText = peopleToDisplay.map(person => `${person.firstName} ${person.lastName}`).join('\n');
    alert(`${displayTitle}\n\n${formatedPeopleDisplayText}`);
}

function validatedPrompt(message, acceptableAnswers) {
    acceptableAnswers = acceptableAnswers.map(aa => aa.toLowerCase());

    const builtPromptWithAcceptableAnswers = `${message} \nAcceptable Answers: ${acceptableAnswers.map(aa => `\n-> ${aa}`).join('')}`;

    const userResponse = prompt(builtPromptWithAcceptableAnswers).toLowerCase();

    if (acceptableAnswers.includes(userResponse)) {
        return userResponse;
    }
    else {
        alert(`"${userResponse}" is not an acceptable response. The acceptable responses include:\n${acceptableAnswers.map(aa => `\n-> ${aa}`).join('')} \n\nPlease try again.`);
        return validatedPrompt(message, acceptableAnswers);
    }
}

function exitOrRestart(people) {
    const userExitOrRestartChoice = validatedPrompt(
        'Would you like to exit or restart?',
        ['exit', 'restart']
    );

    switch (userExitOrRestartChoice) {
        case 'exit':
            return;
        case 'restart':
            return app(people);
        default:
            alert('Invalid input. Please try again.');
            return exitOrRestart(people);
    }

}