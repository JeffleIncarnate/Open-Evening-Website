function GetData() {
  const userName = document.getElementById("UserName").value;
  const password = document.getElementById("Password").value;

  if (CheckingForRightTypeUserName(userName) == true) {
    alert("Username must not contain a number.");
  }
}

function CheckingForRightTypeUserName(userName) {
  var hasNumber = /\d/;
  return hasNumber.test(userName);
}
