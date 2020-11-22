google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);

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

  commitsPerRepo(reposData, user)
}


async function commitsPerRepo(userReposData, user) {
  let commits = [];
  for (let i = 0; i < userReposData.length; i++) 
  {
    const repo = userReposData[i].name;
    let a = await GetRequest(`https://api.github.com/repos/${user}/${repo}/commits`).catch((error) => console.error(error));
    let b = { repo: repo, commits: a.length };
    commits.push(b);
  }
  //drawChart(commits);
}

function drawChart(){
  var data = google.visualization.arrayToDataTable([
    ['Task', 'Hours per Day'],
    ['Work',     11],
    ['Eat',      2],
    ['Commute',  2],
    ['Watch TV', 2],
    ['Sleep',    7]
  ]);

  var options = {
    title: 'Commits',
    is3D: true,
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
  chart.draw(data, options);
};



