
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




function searchByTraits(people, trait) {
  
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

        const  searchCriteria = validatedPromptForTraits();
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
        
            return outcome
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
            const traitChoice = validatedPrompt('Please enter in which trait you would like to search by.',['height', 'weight', 'eye color', 'occupation']);
            let traitValue;
            switch (traitChoice) {
                case 'Height':
                    traitValue = validatedPrompt('Please enter in the height to search by (in inches).', ['58', '59', '61','62','63', '65', '66','67', '69', '70', '71', '72','74,']);
                    break;
                case 'weight':
                    traitValue = validatedPrompt('Please enter in the weight to search by (in pounds).', ['100', '110','112', '115','118', '137', '156','162', '170', '175', '179', '184', '187', '199', '205', '207', '235',  '241', '249', '250', '256' ]);
                    break;
                case 'eye color':
                    traitValue = validatedPrompt('Pleas enter in the eye color to search by,', ['Brown','blue', 'green','hazel','amber']);
                    break;
                case 'occupation':
                    traitValue = validatedPrompt('Please enterin the occupation to search by.', ['programmer', 'assistant', 'landscaper', 'nurse', 'student', 'architect', 'doctor', 'politician']);
                    break; 


                    default:
                        return searchPeopleDataSet(people);
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
                })
            }

        
        
        
                const  searchCriteria = validatedPromptForTraits();
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


            if (outcome.length === 0) {
                console.log('No results found.');
            } else {
                outcome.forEach(person => {
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
        case "search":
            const searchResults = searchForPerson(people);
            if (searchResults.length === 0) {
                alert('No results found.');
                break;
            }
            let filteredResults = searchResults;
            let filterCriteria = '';
            while (filterCriteria !== 'quit'){
                filterCriteria = validatedPrompt('Found ${filteredResults.length} results. Would you like to filter down the results by eye color, gender, occupation, or quit?'
                ['eye color', 'gender', 'occupation', 'quit']
                );
                switch (filterCriteria) {
                    case 'eye color':
                        const eyeColor = validatedPrompt('Enter eye color:', ['brown','blue', 'green']);
                        filteredResults = filteredResults.filter(person => person.eyeColor === eyeColor);
                        break;
                        case 'gender':
                            const gender = validatedPrompt('Enter gender:',['male', 'female']);
                            filteredResults = filteredResults.filter(person => person.gender === gender);
                            break;
                            case 'occupation':
                                const occupation = validatedPrompt('Enter occupation:');
                                filteredResults = filteredResults.filter(person => person.occupation === occupation);
                                break;
                                case 'quit':
                                    break;
                                    default:
                                        alert('Invalid input. Please try again.');
                
                    }
                }
                displayPeople('Search Results', filteredResults);
                break;
            case "info":
             
             displayPersonInfo(person);
            break;
        case "family":
            let personFamily = findPersonFamily(person, people);
            displayPeople('Family', personFamily);
            break;
            case "descendants":
                let personDescendants = personDescendants(person, people);
                displayPeople('Descendants', personDescendants);
                break;
                case 'quit':
                    return;
                    default:
                        alert('Invalid input. Please try again');
            }

            return mainMenu(person, people);
        }





           
           function findPersonFamily(person, people) {
            let immediateFamily = [];
            
            //Add spouse, if they have one
            if(person.currentSpouse) {
                const spouse = people.find(p => p.id === person.currentSpouse);
                if (spouse) {
                    const relation = spouse.gender === 'male' ? 'Husband': 'Wife';
                    immediateFamily.push({
                        id: spouse.id,
                        firstName: spouse.firstName,
                        lastName: spouse.lastName,
                        relation
                    });
                }
            }

            // Add parents, if they have any 
            for(let parentId of person.parens) {
                const parent = people.find(p => p.id === parentId);
                if (parent) {
                    const relation = parent.gender === 'male' ? 'Father' : 'Mother';
                    immediateFamily.push({
                        id: parentId,
                        firstName: parent.firstName,
                        lastName: parent.lastName,
                        relation});
                    }
                }

                // Add Siblings
                for(let sibling of people) {
                    if (sibling.id !== person.id && sibling.parents.includes(person.id)) {
                        const relation = sibling.gender === 'male' ? 'Brother' : 'Sister';
                        immediateFamily.push({
                            id: sibling.id,
                            firstName: sibling.firstName,
                            lastName: sibling.lastName,
                            relation})
                        }
                    }

                    return immediateFamily;
                }



                        
                    
                

                    
                
            

                    
                
            

           
           
           
           
           
           
            //const rightFammily = findPersonFamily(person, people);
            //if (findPersonFamily.length === 0) {
                //alert('This person has no immediate family members');
            //} else {
                //let familyDisplay = '';
                //for (let memeber of findPersonFamily) {
                    //familyDisplay += '${member.relation}: ${member.firstName} ${member.lastName}\n';
                //}
                //alert(familyDisplay);
            //}
             
             // leaving these functions here for a refernce guide   let personFamily = findPersonFamily(person, people);
             //  displayPeople('Family', personFamily);
            //break;
        //case "descendants":
            //let descendants = findDescendants(person, people);
            //let descendantNames = descendants.map(descendant => '${descendant.firstName }${descendant.lastName}');
            //alert('Descendants: ${descendantNames.join(',')}');

            
            //let personDescendants = findPersonDescendants(person, people);
            //displayPeople('Descendants', personDescendants);
           //break;
        //case "quit":
            //return;
        //default:
            //alert('Invalid input. Please try again.');
    //}

    //return mainMenu(person, people);
//}







function displayPersonInfo(person) {
    console.log('ID: ${person.id}');
    console.log('Name:${person.firstName} ${person.lastName}');
    console.log('Gender: ${person.gender}');
    console.log('Date of Birth: ${person.dob}');
    console.log('Height: ${person.height} inches');
    console.log('Weight: ${person.weight} lbs');
    console.log('Eye Color: ${person.eyeColor}');
    console.log('Occupation: ${person.occupation}');
    console.log('Parent: ${person.parents.length > 0 ? person.parents.join(",") : "Unknown"}');
    console.log('Spouse: ${person.currentSpouse ? person.currentSpouse : "None"}');
}


   function findDescendants(person, people) {
    let descendants = [];

    //recursively search for children and add them to the descendants array

    for(let i = 0; i < people.length; i++) {
        if(person.id === people[i].parents[0] || person.id === people[i].parents[1]) {
            descendants.push(people[i]);
            descendants = descendants.concat(findDescendants(people[i], people));
        }
    }

    return descendants
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