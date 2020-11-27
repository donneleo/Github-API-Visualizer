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
  languagesUsed(reposData, user)
}

async function languagesUsed(userData, user){
  let languages = [['Language', 'Frequency']];
  for(let i=0; i<userData.length; i++){
    const repo = userData[i].name;
    let languageList = await GetRequest(`https://api.github.com/repos/${user}/${repo}/languages`).catch((error) => console.error(error));
    //i=0.... languageList == {"Java": 32349}, i=1... languageList == {"Java": 7477, "Go": 3725, "Prolog": 2151}
    let y = JSON.stringify(languageList);
    let x = JSON.parse(y);
    for(var i of Object.entries(x)){
      languages.push(i);
    }
  }
  drawLanguageChart(languages);
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


async function drawLanguageChart(myData){
  var data = google.visualization.arrayToDataTable(
    myData
  );

  var options = {
    title: "Languages",
    is3D: true,
  };

  var chart = new google.visualization.PieChart(document.getElementById("language_chart"));
  chart.draw(data, options);
};