// Focus the search input field when the page loads
window.onload = function () {
  document.getElementById("searchInput").focus();
};

// Search functionality
document.getElementById("searchInput").addEventListener("input", function () {
  const searchQuery = this.value.toLowerCase();
  const rows = document.querySelectorAll(".data-row");

  let anyVisible = false;

  rows.forEach(function (row) {
    let found = false;
    const cells = row.querySelectorAll("td");

    // Check if any cell matches the search query
    cells.forEach(function (cell) {
      const text = cell.textContent || cell.innerText;
      if (text.toLowerCase().includes(searchQuery)) {
        found = true;
      }
    });

    // Show or hide row based on search query match
    if (found) {
      row.style.display = "";
      anyVisible = true;
    } else {
      row.style.display = "none";
    }
  });

  // Show "No results found" message or keep table visible
  const tableContainer = document.querySelector(".table-container");
  const table = tableContainer.querySelector("table");
  const noResultsMessage = tableContainer.querySelector(".no-results-message");

  if (!anyVisible) {
    // If no rows match, display the "No results found" message
    if (!noResultsMessage) {
      const message = document.createElement("p");
      message.classList.add("no-results-message");
      message.textContent = "No results found.";
      tableContainer.appendChild(message);
    }
  } else {
    // Remove the "No results found" message if there are results
    if (noResultsMessage) {
      noResultsMessage.remove();
    }
  }
});
