let LocalStore = {};

LocalStore.write = (key, data) => {
  if(typeof(Storage) !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  } else {
    console.log('Sorry! No Web Storage support..');
  }
}

LocalStore.read = (key) => {
  if(typeof(Storage) !== "undefined") {
    return JSON.parse(localStorage.getItem(key));
  } else {
    console.log('Sorry! No Web Storage support..');
    return null
  }
}

LocalStore.remove = (key) => {
  if(typeof(Storage) !== "undefined") {
    localStorage.removeItem(key);
  } else {
    console.log('Sorry! No Web Storage support..');
  }
}

export default LocalStore;
