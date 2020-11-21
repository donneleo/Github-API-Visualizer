function handleInput()
{
  var x = document.getElementById("fname").value;
  main(x);
}

async function GetRequest(url) 
{
  const response = await fetch(url);
  let data = await response.json();
  return data;
}


async function main(user) {
  
  let url = `https://api.github.com/users/${user}/repos`;
  let reposData = await GetRequest(url).catch(error => console.error(error));
 
}
