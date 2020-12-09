google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);

const token = "a467071ff0e79f00c19c4b20e0d2e584464c93f3";

const headers = {
  "Authorization" : "Token " + token
}
const settings = {
  "method" : "GET",
  "headers" : headers
}

function handleInput()
{
  var x = document.getElementById("fname").value;
  main(x);
}

async function GetRequest(url) 
{
  const response = await fetch(url, settings);
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
 // let data = [["Language", "Frequency"]];
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

  for(var i = 0; i < languages.length; i++){
    for(var j = i+1; j < languages.length; j++){
        if(languages[i][0] === languages[j][0]){
           languages[i][1] = languages[i][1]+languages[j][1];
           languages.splice(j, 1);
           j--;
        }
    }
  }

  drawLanguageChart(languages);
}

async function commitsPerRepo(userReposData, user) {
  let commits = [['Repo', 'Number of commits']];
  for (let i = 0; i < userReposData.length; i++) 
  {
    let page = 1;
    const repo = userReposData[i].name;
    while(page <= 10){  
      let a = await GetRequest(`https://api.github.com/repos/${user}/${repo}/commits?page=${page}`).catch((error) => console.error(error));
        if(a.length > 0){
          let b = [repo, a.length];
          commits.push(b);
        }
        page = page + 1;
    }
  }

  for(var x = 0; x <commits.length; x++){
    for(var j = x+1; j < commits.length; j++){
        if(commits[x][0] == commits[j][0]){
            commits[x][1] = commits[x][1]+commits[j][1];
            commits.splice(j, 1);
            j--;
        }
    }
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
    pieHole: 0.4
  };

  var chart = new google.visualization.PieChart(document.getElementById("language_chart"));
  chart.draw(data, options);
};