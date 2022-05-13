let db;

const request = indexedDB.open("budget_bucket", 1);

// Setting up db store or ignoring if already created
request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("new_funds", { autoIncrement: true });
};

//successful save
request.onsuccess = function (event) {
  db = event.target.result;
  if (navigator.onLine) {
    uploadFunds();
  }
};
//on error
request.onerror = function (event) {
  console.log(event.target.errorCode);
};

//holds transaction when no internet
function saveRecord(record) {
  const transaction = db.transaction(["new_funds"], "readwrite");

  const moneyStore = transaction.objectStore("new_funds");

  moneyStore.add(record);
}

function uploadFunds() {
  const transaction = db.transaction(["new_funds"], "readwrite");

  const moneyStore = transaction.objectStore("new_funds");

  const getAll = moneyStore.getAll();

  getAll.onsuccess = function () {
    // if there was data in indexedDb's store, let's send it to the api server
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(["new_funds"], "readwrite");
          // access the new_pizza object store
          const moneyStore = transaction.objectStore("new_funds");
          // clear all items in your store
          moneyStore.clear();

          alert("All saved transactions have been submitted!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

//listen for app coming back online
window.addEventListener("online", uploadFunds);
