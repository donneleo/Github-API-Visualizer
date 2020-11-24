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
  let commits = [['Repo', 'Number of commits']];
  for (let i = 0; i < userReposData.length; i++) 
  {
    const repo = userReposData[i].name;
    let a = await GetRequest(`https://api.github.com/repos/${user}/${repo}/commits`).catch((error) => console.error(error));
    let b = [repo, a.length];
    //b=[1st-year-workspace, 9]
    commits.push(b);
    //commits = [['Repo', 'Number of commits'],['1st-year-workspace', 9], ['3rd-Year-College-Work', 30], etc....]
  }
  drawChart(commits);
}

async function drawChart(myData){
  var data = google.visualization.arrayToDataTable(
    myData
  );

  var options = {
    title: 'Commits',
    is3D: true,
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
  chart.draw(data, options);
};



