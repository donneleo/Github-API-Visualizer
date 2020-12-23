google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChart);

const token = "****************************";

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
  document.getElementById("loader").innerHTML = "ONE MOMENT. THERE'S A LOT OF DATA HERE";
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
  recentWork(user)
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
    while(page <= 5){  
      let a = await GetRequest(`https://api.github.com/repos/${user}/${repo}/commits?page=${page}&per_page=50`).catch((error) => console.error(error));
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

async function recentWork(user) {
  let events = [["Repo Name", "Number of Events", { role: 'style' }]];
  let nextEvent = await GetRequest(`https://api.github.com/users/${user}/events?per_page=50`).catch((error) => console.error(error));
  let i = 0;

  for(repo in nextEvent){
    let colour = getRandomColor();
    let nextInput = [nextEvent[i].repo.name, 1, colour];
    events.push(nextInput);
    i++;
  }

  for(var x = 0; x < events.length; x++){
    for(var j = x+1; j < events.length; j++){
        if(events[x][0] == events[j][0]){
          events[x][1] = events[x][1]+ events[j][1];
          events.splice(j, 1);
            j--;
        }
    }
  }

  drawEventChart(events);
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return(color);
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


async function drawEventChart(myData){
  var data = google.visualization.arrayToDataTable(
    myData
  );

  var options = {
    title: "Breakdown of most recent events",
    hAxis: {
      title: "Repo Name"
    },
    vAxis: {
      title: "Number of Activities per Repo"
    }
  };

  var chart = new google.visualization.ColumnChart(document.getElementById("event_chart"));
  chart.draw(data, options);
};