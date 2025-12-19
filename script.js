// Login functionality
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");
const loginContainer = document.getElementById("loginContainer");
const mainContainer = document.getElementById("mainContainer");

// Check if user is already logged in
if (localStorage.getItem("isLoggedIn") === "true") {
  showMainApp();
}

loginForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const userId = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  console.log("User ID entered:", userId);
  console.log("Password entered:", password);

  // Authentication with specific credentials
  if (userId === "chiru@0" && password === "chiru@0") {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userRole", "manager");
    showMainApp();
  } else {
    console.log("Login failed - credentials don't match");
    loginError.textContent = "Invalid user ID or password";
    loginError.style.display = "block";
  }
});

function showMainApp() {
  loginContainer.style.display = "none";
  mainContainer.style.display = "block";
  showSection('home');
}

function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userRole");
  loginContainer.style.display = "flex";
  mainContainer.style.display = "none";
  loginForm.reset();
  loginError.style.display = "none";
}

function showSection(sectionName) {
  // Hide all sections
  document.getElementById("homeSection").style.display = "none";
  document.getElementById("managerSection").style.display = "none";

  // Remove active class from all nav buttons
  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.remove("active"));

  // Show selected section
  if (sectionName === 'home') {
    document.getElementById("homeSection").style.display = "block";
    document.querySelector('.nav-btn:first-child').classList.add("active");
  } else if (sectionName === 'manager') {
    // Check if user is manager
    if (localStorage.getItem("userRole") === "manager") {
      document.getElementById("managerSection").style.display = "block";
      document.querySelector('.nav-btn:nth-child(2)').classList.add("active");
    } else {
      alert("Access denied. Manager privileges required.");
      showSection('home');
    }
  }
}

// Review form functionality
const form = document.getElementById("reviewForm");
const successMsg = document.getElementById("successMsg");

form.addEventListener("submit", function(e) {
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

  const reviewData = {
    name: empName.value,
    dept: empDept.value,
    feedback: empFeedback.value,
    rating: empRating.value,
    date: new Date().toLocaleDateString(),
    id: Date.now()
  };

  setTimeout(() => {
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    reviews.push(reviewData);
    localStorage.setItem("reviews", JSON.stringify(reviews));

    successMsg.textContent = "Review submitted successfully!";
    successMsg.style.display = "block";
    form.reset();

    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Submit Review';

    setTimeout(() => {
      successMsg.style.display = "none";
    }, 3000);
  }, 1000);
});

function loadReviews() {
  const container = document.getElementById("reviewContainer");
  container.innerHTML = "";

  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

  if (reviews.length === 0) {
    container.innerHTML = "<p style='text-align: center; color: #666; font-style: italic;'>No reviews submitted yet.</p>";
    return;
  }

  reviews.forEach((r, index) => {
    const div = document.createElement("div");
    div.className = "reviewBox";
    div.style.animationDelay = `${index * 0.1}s`;
    div.innerHTML = `
      <strong>${r.name}</strong> (${r.dept})<br>
      <small>${r.date}</small><br><br>
      <b>Rating:</b> ${r.rating}<br>
      ${r.feedback}
    `;
    container.appendChild(div);
  });
}

function clearReviews() {
  if (confirm("Are you sure you want to clear all reviews? This action cannot be undone.")) {
    localStorage.removeItem("reviews");
    loadReviews();
  }
}
