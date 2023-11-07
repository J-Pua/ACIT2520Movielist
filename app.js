// Add DOM selectors to target input and UL movie list
const inp = document.querySelector("#movieadd");
const MovieList = document.querySelector("#movielist");
const FilterField = document.querySelector("#filter");
const MovieHistory = document.querySelector("#movieHistoryCard");
let HistoryTable = document.querySelector("table");
let HistoryDict = {};
// Example of a simple function that clears the input after a user types something in
const clearInput = () => {
    inp.value = "";
};
const initHistory = () => {
    if (!MovieHistory.querySelector("table")) {
        HistoryTable = document.createElement("table");
        HistoryTable.innerHTML =
            "<tr><th>Movie Title</th><th>Watch Count</th></tr>";
        HistoryTable.style.width = "100%";
        MovieHistory.appendChild(HistoryTable);
    }
};
const clearFilter = () => {
    FilterField.value = "";
};
const clearMovies = () => {
    // To delete all children of the <ul></ul> (meaning all <li>'s)..we can wipe out the <ul>'s innerHTML
    MovieList.innerHTML = "";
    saveMovieList();
};
// This function is executed when the user clicks [ADD MOVIE] button.
const addMovie = () => {
    // Step 1: Get value of input
    const userTypedText = inp.value;
    const currentmovies = Array.from(MovieList.querySelectorAll("li")).map(
        (entry) => {
            return entry.innerHTML.toLowerCase();
        }
    );
    if (userTypedText === "") {
        alert("Error. Cannot add a blank name to the movie list");
        return;
    } else if (!currentmovies.includes(userTypedText.toLowerCase())) {
        AddListEntry(userTypedText);
        filterMovies();
        saveMovieList();
        clearInput();
    }
    addMovieHistory(userTypedText);

    // Step 6: Call the clearInput function to clear the input field
    clearInput();

    return;
};
const AddListEntry = (inputtext) => {
    // Step 2: Create an empty <li></li>
    const li = document.createElement("li"); // <li></li>

    // Step 3: Prepare the text we will insert INTO that li ^...example: Harry Potter
    const textToInsert = document.createTextNode(inputtext);

    // Step 4: Insert text into li
    // <li>Harry Potter </li>
    li.appendChild(textToInsert);

    // Step 5: Insert the <li>Harry Potter</li> INTO the <ul>
    MovieList.appendChild(li);
};
const filterMovies = () => {
    let Filter = FilterField.value.trim().toLowerCase();
    const uflist = Array.from(MovieList.children);
    for (child of uflist) {
        const movieName = child.innerHTML.trim().toLowerCase();
        if (!movieName.includes(Filter)) {
            child.style.visibility = "hidden";
        } else if (movieName.includes(Filter)) {
            child.style.visibility = "";
        }
    }
};
const addMovieHistory = (MovieName) => {
    const sanitName = MovieName.toLowerCase();
    if (!Object.keys(HistoryDict).includes(sanitName)) {
        HistoryDict[sanitName] = 1;
        addHistoryEntry(MovieName, HistoryDict[sanitName]);
    } else {
        HistoryDict[sanitName] = HistoryDict[sanitName] + 1;
        const rows = HistoryTable.getElementsByTagName("tr");
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const cells = row.getElementsByTagName("td");
            if (cells.length >= 2) {
                const nameCell = cells[0];
                if (nameCell.innerText.toLowerCase() === sanitName) {
                    const timesCell = cells[1];
                    timesCell.innerText = HistoryDict[sanitName];
                    break;
                }
            }
        }
    }

    saveMovieHistory();
};
const addHistoryEntry = (Name, Times) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `<td>${Name}</td><td>${Times}</td>`;
    HistoryTable.appendChild(newRow);
};
const saveMovieList = () => {
    const CurrentList = Array.from(MovieList.querySelectorAll("li")).map(
        (entry) => {
            return entry.innerHTML;
        }
    );
    localStorage.setItem("movieList", JSON.stringify(CurrentList));
};
const saveMovieHistory = () => {
    localStorage.setItem("movieHistory", JSON.stringify(HistoryDict));
};
const loadMovieList = () => {
    const loadedList = localStorage.getItem("movieList");
    if (loadedList) {
        JSON.parse(loadedList).forEach((name) => {
            AddListEntry(name);
        });
    }
};
const loadMovieHistory = () => {
    if (localStorage.getItem("movieHistory")) {
        HistoryDict = JSON.parse(localStorage.getItem("movieHistory"));
        for (const name in HistoryDict) {
            addHistoryEntry(name, HistoryDict[name]);
        }
    }
};

FilterField.addEventListener("input", filterMovies);

window.addEventListener("load", () => {
    clearFilter();
    clearInput();
    initHistory();
    loadMovieList();
    loadMovieHistory();
});
