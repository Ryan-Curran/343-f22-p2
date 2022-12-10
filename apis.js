const queryInputElem = document.getElementById('query');

const formElem = document.getElementById('form');

formElem.addEventListener('submit', (event) => {
    console.log('submitting');
    event.preventDefault();
});

const results = document.getElementById('results');

const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');

queryInputElem.addEventListener('keyup', async function (ev) {
    ev.preventDefault();
    if (ev.key == 'Enter') {
        console.log('Pressed Enter')

        const movieResultsResp = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=85a06165d3d4b3af91dea753904bef27&language=en-US&query=${queryInputElem.value}=&page=1&include_adult=true`
        );
        // console.log(movieResultsResp);
    
        const movieResults = await movieResultsResp.json();
        console.log(movieResults);
    
        const movieResultsJson = await movieResults.results;
    
        const tenMovies = movieResultsJson.slice(0, 10);
        console.log(tenMovies);

        const dates = Array(10);
        for (let i = 0; i < 10; i++) {
            dates[i] = [await tenMovies[i].release_date.slice(5, 7), await tenMovies[i].release_date.slice(8)];
        }
        // console.log(dates);

        const dateInfo = Array(10);

        for (let index = 0; index < 10; index++) {
            const dateResp = await fetch(
            `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/${dates[index][0]}/${dates[index][1]}`
            );
            // console.log(dateResp);

            const dateResults = await dateResp.json();

            const dateResultsJson = await dateResults;
            dateInfo[index] = dateResultsJson.events[0];
        }
        console.log(dateInfo);

        let filteredMovies = tenMovies;
        let filteredEvents = dateInfo;
        // map then await the mapped array of promises
        const allResults = document.createElement("div");
        allResults.id = "all";

        function display() {
            for (let j = 0; j < filteredMovies.length; j++){
                const divElem = document.createElement("div");
                divElem.className = "movie";
                const header = document.createElement("h2");
                const title = document.createTextNode(`Movie Title: ${filteredMovies[j].title}`);
                header.appendChild(title);
                const para1 = document.createElement("p");
                const release = document.createTextNode(`Release Date: ${filteredMovies[j].release_date}`);
                para1.appendChild(release);
                const para2 = document.createElement("p");
                const date = document.createTextNode(`This day in history: ${filteredEvents[j].text}`);
                para2.appendChild(date);
                divElem.appendChild(header);
                divElem.appendChild(para1);
                divElem.appendChild(para2);
                allResults.appendChild(divElem);
            }
            const tryFind = document.getElementById("all");
            if (tryFind != null) {
                results.replaceChild(allResults, tryFind);
            } else {
                results.appendChild(allResults);
            }
            return tenMovies;
        }
        display();
    }

    // button1.addEventListener('click', async function (e) {
    //     e.preventDefault();
    //     let temp = Array();
    //     for (let i = 0; i < tenMovies.length; i++) {
    //          if (tenMovies[i].vote_average >= 5) {
    //              temp.push(tenMovies[i]);
    //          }
    //     }
    //     console.log()
    //     filteredMovies = temp;
    //     display();
    // });
});
