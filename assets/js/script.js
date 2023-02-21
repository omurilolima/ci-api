const API_KEY = 'gW31ZHpU6_f2wsPMlchSrDmaoaU';
const API_URL = 'https://ci-jshint.herokuapp.com/api';
const resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'));

// Event Listeners
document.getElementById('status').addEventListener('click', e => getStatus(e));
document.getElementById('submit').addEventListener('click', e => postForm(e));

// Functions

function processOptions(form) {
    /**
     * Recieves the form and join all the values of options 
     * in one single array separeted by commas.
     */
    let optArray = [];

    for (let entry of form.entries()) {
        if (entry[0] === 'options') {
            optArray.push(entry[1]);
        }
    }

    form.delete('options'); // delete all options in the current form.

    form.append('options', optArray.join()); // creates a new options with the values separeted by commas.

    return form;

}

async function postForm(e) {

    const form = processOptions(new FormData(document.getElementById('checksform')));

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': API_KEY,
        },
        body: form,
    })

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }

}

function displayErrors(data) {

    let heading = `JSHint Results for ${data.file}`;

    if (data.total_erros === 0) {
        results = `<div class='no_errors'>No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class='error_count'>${data.total_erros}</span></div>`
        for (let error of data.error_list) {
            results += `<div>At line <span class='line'>${error.line}</span>, `;
            results += `column <span class='column'>${error.col}</span></div>`;
            results += `<div class='error'>${error.error}</div>`;
        }
    }

    document.getElementById('resultsModalTitle').innerText = heading;
    document.getElementById('results-content').innerHTML = results;

    resultsModal.show();

}

async function getStatus(e) {
    /**
     * Send the API_KEY, recieve the response
     */
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    };
}

function displayStatus(data) {
    /**
     * Revieve data pagameter and display API Key Status in the modal.
     */
    let heading = 'API Key Status';
    let results = `<div>Your key is valid until</div>`;
    results += `<div class='key-status'>${data.expiry}</div>`

    document.getElementById('resultsModalTitle').innerText = heading;
    document.getElementById('results-content').innerHTML = results;

    resultsModal.show();

}

function displayException(data) {

    let heading = `An Exception Occured`;

    results = `<div>The API returnd status code ${data.status_code}</div>`;
    results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
    results += `<div>Error text: <strong>${data.error}</strong></div>`;

    document.getElementById('resultsModalTitle').innerText = heading;
    document.getElementById('results-content').innerHTML = results;

    resultsModal.show();

}
