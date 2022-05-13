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
    //uploadTransaction();
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
