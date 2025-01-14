function validateForm(event) {
    // Get all the form fields
    const image = document.getElementsByName("image")[0].value;
    const name = document.getElementsByName("name")[0].value;
    const code = document.getElementsByName("code")[0].value;
    const credit = document.getElementsByName("credit")[0].value;
    const description = document.getElementsByName("Description")[0].value;

    // Check if any field is empty
    if (!image || !name || !code || !credit || !description) {
      alert("Please fill in all the required fields.");
      event.preventDefault(); // Prevent form submission
    }
  }