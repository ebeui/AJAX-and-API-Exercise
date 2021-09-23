/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
    // TODO: Make an ajax request to the searchShows api.  Remove
    // hard coded data.
    const resData = await axios.get(
        `https://api.tvmaze.com/search/shows?q=${query}`
    );
    console.log(resData);

    let shows = resData.data.map(function (result) {
        let show = result.show;
        return {
            id: show.id,
            name: show.name,
            summary: show.summary,
            image: show.image
                ? show.image.medium
                : "https://tinyurl.com/tv-missing",
        };
    });

    console.log(shows);
    return shows;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
    const $showsList = $("#shows-list");
    $showsList.empty();

    for (let show of shows) {
        let $item = $(
            `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
            <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button onclick="handleClickEvent(this)" class="button-list" id ="button">Episodes</button>
           </div>
         </div>
       </div>
      `
        );

        $showsList.append($item);
    }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
    evt.preventDefault();

    let query = $("#search-query").val();
    if (!query) return;

    $("#episodes-area").hide();

    let shows = await searchShows(query);

    populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
    // TODO: get episodes from tvmaze
    //       you can get this by making GET request to
    //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

    const episodeRes = await axios.get(
        `http://api.tvmaze.com/shows/${id}/episodes`
    );

    let episodeList = await episodeRes.data.map(function (episode) {
        return {
            id: episode.id,
            name: episode.name,
            season: episode.season,
            number: episode.number,
        };
    });

    // TODO: return array-of-episode-info, as described in docstring above

    return episodeList;
    // console.log(episodeList);
}

function populateEpisodes(episodes, cardBody) {
    let ul = document.createElement("ul");
    ul.setAttribute("id", "episodes-list");

    for (const episode of episodes) {
        let li = document.createElement("li");
        li.setAttribute("id", "li");

        li.innerText = `${episode.name} (season ${episode.season}, number ${episode.number})`;

        ul.append(li);
    }
    console.log(ul);

    cardBody.append(ul);
}

async function handleClickEvent(button) {
    let id = button.parentElement.parentElement.getAttribute("data-show-id");
    let episodes = await getEpisodes(id);

    console.log(episodes);

    populateEpisodes(episodes, button.parentElement);
}
