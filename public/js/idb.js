//Create a variable to hold db connection
let db;

//establish connection to IndexedDB database called budget
const request = indexedDB.open('budget', 1)
request.onupgradeneeded = function (event) {

    const db = event.target.result;
    db.createObjectStore('new_budget', { autoIncrement: true });

    request.onsuccess - function (event) {
        db = event.target.result;
    }

    if (navigator.online) {
        uploadBudget()
    }
};
request.onerror = function (event) {
    console.log(event.target.errorCode);
}

function saveRecord(record) {
    const transaction = db.transaction(['new_budget'], "readwrite")
    const budgetObjectStore = transaction.objectStore('new_budget')

    budgetObjectStore.add(record);
}

function uploadBudget() {
    const transaction = db.transaction(['new_budget'], 'readwrite')
    const budgetObjectStore = transaction.objectStore('new_budget')
    const getAll = budgetObjectStore.getAll()
    // upon a successful .getAll() execution, run this function
    getAll.onsuccess = function () {
        // if there was data in indexedDb's store, let's send it to the api server
        if (getAll.result.length > 0) {
            fetch('/api/budget', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    // open one more transaction
                    const transaction = db.transaction(['new_budget'], 'readwrite');
                    // access the new_budget object store
                    const budgetObjectStore = transaction.objectStore('new_budget');
                    // clear all items in your store
                    budgetObjectStore.clear();

                    alert('All saved budget has been submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };
}

window.addEventListener('online', uploadBudget);