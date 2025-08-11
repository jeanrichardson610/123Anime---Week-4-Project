let isModalOpen = false;

function toggleModal() {
  if (isModalOpen) {
    isModalOpen = false;
    return document.body.classList.remove("modal--open");
  }
  isModalOpen = !isModalOpen;
  document.body.classList += " modal--open";
}

async function fetchAndDisplayAnime(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const jsonResponse = await response.json();
      displayResults(jsonResponse.data);
    } else {
      console.error("Failed to fetch anime data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function fetchAndDisplayAnimeSortByScore(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const jsonResponse = await response.json();
      const sortedAnime = jsonResponse.data.sort(
        (animeA, animeB) => animeB.score - animeA.score
      );
      displayResults(sortedAnime);
    } else {
      console.error("Failed to fetch anime data:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

document.getElementById("topAnimeBtn").addEventListener("click", () => {
  fetchAndDisplayAnime("https://api.jikan.moe/v4/top/anime");
});

document.getElementById("currentSeasonBtn").addEventListener("click", () => {
  fetchAndDisplayAnime("https://api.jikan.moe/v4/seasons/now");
});

document
  .getElementById("searchInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      const query = document.getElementById("searchInput").value.trim();
      if (query) {
        fetchAndDisplayAnime(`https://api.jikan.moe/v4/anime?q=${query}`);
      }
    }
  });

document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.trim();
  if (query) {
    fetchAndDisplayAnime(`https://api.jikan.moe/v4/anime?q=${query}`);
  }
});

function displayResults(animes) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = ""; // Clear previous results

  // Limit the results to the first 10 items
  const limitedAnimes = animes.slice(0, 12);

  limitedAnimes.forEach((anime) => {
    const animeCard = document.createElement("div");
    animeCard.classList.add("anime-card");

    const animeImage = document.createElement("img");
    animeImage.src = anime.images.jpg.image_url; // using the jpg image url
    animeImage.alt = anime.title;

    const animeTitle = document.createElement("h3");
    animeTitle.textContent = anime.title;

    const animeType = document.createElement("p");
    animeType.textContent = `Type: ${anime.type}`;

    const animeScore = document.createElement("p");
    animeScore.textContent = `Score: ${anime.score}`;

    const animeAirYear = document.createElement("p");
    if (
      anime.aired &&
      anime.aired.prop &&
      anime.aired.prop.from &&
      anime.aired.prop.from.year
    ) {
      animeAirYear.textContent = `Aired: ${anime.aired.prop.from.year}`;
    } else {
      animeAirYear.textContent = "Aired: N/A"; // in case the year is not available
    }

    animeCard.appendChild(animeImage);
    animeCard.appendChild(animeTitle);
    animeCard.appendChild(animeType);
    animeCard.appendChild(animeScore);
    animeCard.appendChild(animeAirYear); // Add the air year to the card
    resultsContainer.appendChild(animeCard);
  });
}

fetchAndDisplayAnime("https://api.jikan.moe/v4/seasons/now");
