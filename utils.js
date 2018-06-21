
function submitIt(user,amount){
  // Check browser support
  if (typeof(Storage) !== "undefined") {
    var a = localStorage.getItem(user);
    var obj = JSON.parse(a);
    if (!obj)
      obj = [];
    obj.push(amount);
    localStorage.setItem(user, JSON.stringify(obj));
    return 1;
  } else {
    return 0;
  }
}

function retreiveIt(user){
  var a = localStorage.getItem(user);
  var obj = JSON.parse(a);
  return obj;
}

function deleteIt(user){
  if (user){
    localStorage.removeItem(user);
  } else {
    localStorage.clear();
  }
}
