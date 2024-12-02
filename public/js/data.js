const dropDatabaseBtn = document.getElementById("dropDatabaseBtn");
const responseMessage = document.getElementById("responseMessage");

dropDatabaseBtn.addEventListener("click", async () => {
  if (
    confirm(
      "Are you sure you want to drop the entire database? This action cannot be undone."
    )
  ) {
    try {
      const response = await fetch("/drop-database", {
        method: "POST",
      });
      const data = await response.json();
      responseMessage.textContent = data.message || data.error;
      responseMessage.style.color = data.error ? "red" : "green";
    } catch (error) {
      responseMessage.textContent =
        "An error occurred while dropping the database.";
      responseMessage.style.color = "red";
    }
  }
});

// Adding event listeners for delete buttons
document.querySelectorAll(".delete-btn").forEach((button) => {
  button.addEventListener("click", async (event) => {
    const recordId = event.target.getAttribute("data-id");

    if (confirm("Are you sure you want to delete this record?")) {
      try {
        // Send a DELETE request to the server
        const response = await fetch(`/delete-record/${recordId}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (data.success) {
          alert("Record deleted successfully.");
          location.reload(); // Reload the page to reflect the changes
        } else {
          alert(data.error || "Failed to delete the record.");
        }
      } catch (error) {
        alert("An error occurred while deleting the record.");
      }
    }
  });
});
