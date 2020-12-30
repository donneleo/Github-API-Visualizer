# Github-API-Visualizer

Visualizer for data taken from the Github API. This could take some work....

### Important Note and Limitations

This version is incorporating non-authorised requests, and therefore the number of requests which can be made are limited <br>

Due to the nature of the code, and in the interest of having load times shorter than Titanic, the commits per repo are capped at 250.

The visualizer cuurently displays three graphs for the entered user:

* The number of commits in each repo the user has on their profile
* The breakdown of languages by bytes written for their repos combined
* A breakdown of the 50 most recent events by repo for the user


### How to run

To run this project, you will need to have Dokcer installed.

Then:

1. Clone the code in this repo
2. Copy this into your terminal `docker build -t eoin-visualizer .`
3. Then type this into your terminal `docker run -d -p 80:80 eoin-visualizer`
4. Finally, open your localhost port 8080 by using `http://localhost/8080` or `localhost:8080` in your browser

