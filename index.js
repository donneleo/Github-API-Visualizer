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
    for(var q of Object.entries(x)){
      languages.push(q);
    }
  }

  for(var i = 0; i <languages.length; i++){
    for(var j = i+1; j < languages.length; j++){
        if(languages[i][0] == languages[j][0]){
            languages[i][1] = languages[i][1]+languages[j][1];
            languages.splice(j, 1);
        }
    }
  }

  drawLanguageChart(languages);
}

/*
[
 languages[0] = ["Language", "Frequency"],
 languages[1] = ["Java", 32349],
 languages[2] = ["Java", 7477],
 languages[3] = ["Go", 3725],
 languages[4] = ["Prolog", 2151],
 languages[5] = ["Python", 863],
 languages[6] = ["Python", 2508].
 languages[7] = ["CSS", 74803],
 languages[8] = ["SCSS", 54536],
 languages[9] = ["Javascript", 12809],
 languages[10] = ["HTML", 6717],
 languages[11] = ["Python", 4819],
 languages[12] = ["JavaScript", 2367],
 languages[13] = ["HTML", 1906],
 languages[14] = ["Processing", 68140],
 languages[15] = ["Java", 42470],
 languages[16] = ["C", 13802]
]

*/

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
    title: 'Commits By Number',
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
    title: "Languages By Bytes Written",
    is3D: true,
  };

  var chart = new google.visualization.PieChart(document.getElementById("language_chart"));
  chart.draw(data, options);
};