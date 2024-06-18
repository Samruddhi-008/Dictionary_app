document.getElementById('searchButton').addEventListener('click', () => {
    const word = document.getElementById('wordInput').value;
    if (word) {
        fetchDefinition(word);
    } else {
        alert('Please enter a word');
    }
});

document.getElementById('wordInput').addEventListener('input', async () => {
    const query = document.getElementById('wordInput').value;
    if (query.length > 0) {
        const suggestions = await fetchSuggestions(query);
        displaySuggestions(suggestions);
    } else {
        document.getElementById('suggestions').style.display = 'none';
    }
});

document.getElementById('suggestions').addEventListener('click', (event) => {
    if (event.target.tagName === 'DIV') {
        const word = event.target.textContent;
        document.getElementById('wordInput').value = word;
        document.getElementById('suggestions').style.display = 'none';
        fetchDefinition(word);
    }
});

async function fetchDefinition(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error('Word not found');
        }
        const data = await response.json();
        displayResult(data);
    } catch (error) {
        document.getElementById('result').innerHTML = '<p>Sorry, no results found.</p>';
    }
}

async function fetchSuggestions(query) {
    try {
        const response = await fetch(`https://api.datamuse.com/sug?s=${query}`);
        if (!response.ok) {
            throw new Error('Error fetching suggestions');
        }
        const data = await response.json();
        return data.map(item => item.word);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return [];
    }
}

function displaySuggestions(suggestions) {
    const suggestionsContainer = document.getElementById('suggestions');
    if (suggestions.length > 0) {
        suggestionsContainer.innerHTML = suggestions.map(suggestion => `<div>${suggestion}</div>`).join('');
        suggestionsContainer.style.display = 'block';
    } else {
        suggestionsContainer.style.display = 'none';
    }
}

function displayResult(data) {
    if (data.title === 'No Definitions Found') {
        document.getElementById('result').innerHTML = `<p>No definitions found for "${data.word}".</p>`;
        return;
    }

    const definition = data[0];
    const phonetics = definition.phonetics.map(phonetic => phonetic.text).join(', ');
    const meanings = definition.meanings.map(meaning => {
        const definitions = meaning.definitions.map(def => `<li>${def.definition}</li>`).join('');
        return `<h3>${meaning.partOfSpeech}</h3><ul>${definitions}</ul>`;
    }).join('');

    document.getElementById('result').innerHTML = `
        <h2>${definition.word}</h2>
        <p><strong>Phonetics:</strong> ${phonetics}</p>
        ${meanings}
    `;
}
