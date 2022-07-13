function GetData() {
  const userName = document.getElementById("UserName").value;
  const password = document.getElementById("Password").value;

  if (CheckingForRightTypeUserName(userName) == true) {
    alert("Username must not contain a number.");
  } else {
    CheckIfUserInDatabase(userName, password);
  }
}

function CheckingForRightTypeUserName(userName) {
  var hasNumber = /\d/;
  return hasNumber.test(userName);
}

function CheckIfUserInDatabase(userName, password) {
  const url = "http://localhost:3000/userInDatabase/" + userName;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.result == true) {
        CheckPasswordForUser(userName, password);
      } else {
        console.log("false");
      }
    });
}

function CheckPasswordForUser(userName, password) {
  const url = "http://localhost:3000/getUserData/" + userName;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (data.password === password) {
        alert("Logged in!");
      } else {
        alert("Wrong and Stupid");
      }
    });
}
