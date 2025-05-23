
    // ---------- Global State & Data Persistence ----------
    let profile = JSON.parse(localStorage.getItem("studentProfile")) || null;
    let connections = JSON.parse(localStorage.getItem("connections")) || [];
    let pendingConnectionId = null;


    const mockStudents = [
      {
        id: "S001",
        name: "Aman Kumar",
        year: "Second Year",
        department: "Computer Science",
        picture: "https://randomuser.me/api/portraits/men/1.jpg",
        skills: "JavaScript, HTML, CSS",
        projectAreas: "Web Development, Mobile Apps",
      },
      {
        id: "S002",
        name: "Priya Sharma",
        year: "Third Year",
        department: "Electrical Engineering",
        picture: "https://randomuser.me/api/portraits/women/1.jpg",
        skills: "Python, Data Science",
        projectAreas: "Robotics, Embedded Systems",
      },
      {
        id: "S003",
        name: "Rahul Verma",
        year: "Fourth Year",
        department: "Mechanical Engineering",
        picture: "https://randomuser.me/api/portraits/men/2.jpg",
        skills: "C++, CAD, Simulation",
        projectAreas: "Product Design, Automotive",
      },
      {
        id: "S004",
        name: "Shruti Desai",
        year: "Second Year",
        department: "Information Technology",
        picture: "https://randomuser.me/api/portraits/women/2.jpg",
        skills: "Cybersecurity, Cloud Computing",
        projectAreas: "AI & ML, Data Science",
      },
    ];

    // ---------- Utility Functions ----------
    function saveToLocalStorage() {
      localStorage.setItem("studentProfile", JSON.stringify(profile));
      localStorage.setItem("connections", JSON.stringify(connections));
    }

    function showToast(message, type = "success") {
      const container = document.getElementById("toast-container");
      const toastEl = document.createElement("div");
      toastEl.className = "toast align-items-center text-bg-" + type + " border-0 mb-2";
      toastEl.setAttribute("role", "alert");
      toastEl.setAttribute("aria-live", "assertive");
      toastEl.setAttribute("aria-atomic", "true");
      toastEl.innerHTML = `
        <div class="d-flex">
          <div class="toast-body">${message}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      `;
      container.appendChild(toastEl);
      const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
      toast.show();
      toastEl.addEventListener("hidden.bs.toast", () => { toastEl.remove(); });
    }

    function getProfileImage(picture) {
      return picture ? picture : "https://randomuser.me/api/portraits/lego/1.jpg";
    }

    // Trigger confetti burst.
    function triggerConfetti() {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    // ---------- Profile Completion Meter ----------
    function computeProfileCompletion() {
      let required = 4, optional = 3, filledRequired = 0, filledOptional = 0;
      if (profile) {
        if (profile.name) filledRequired++;
        if (profile.collegeId) filledRequired++;
        if (profile.year) filledRequired++;
        if (profile.department) filledRequired++;
        if (profile.picture) filledOptional++;
        if (profile.skills) filledOptional++;
        if (profile.projectAreas) filledOptional++;
      }
      const percent = ((filledRequired / required) * 60 + (filledOptional / optional) * 40) | 0;
      return percent;
    }

    function updateProgressBar() {
      const percent = computeProfileCompletion();
      return `
        <div class="progress mt-3">
          <div class="progress-bar bg-success" role="progressbar" style="width: ${percent}%"
               aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
            ${percent}% Complete
          </div>
        </div>
      `;
    }

    // ---------- Navigation & Dark Mode ----------
    const viewProfile = document.getElementById("view-profile");
    const viewBrowse = document.getElementById("view-browse");
    const viewConnections = document.getElementById("view-connections");
    const navProfile = document.getElementById("nav-profile");
    const navBrowse = document.getElementById("nav-browse");
    const navConnections = document.getElementById("nav-connections");
    const connectionCountEl = document.getElementById("connection-count");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const resetApp = document.getElementById("reset-app");

    function updateNavHighlight(activeNav) {
      [navProfile, navBrowse, navConnections].forEach((nav) =>
        nav.classList.remove("active")
      );
      activeNav.classList.add("active");
    }

    function showSection(section) {
      [viewProfile, viewBrowse, viewConnections].forEach((sec) => {
        sec.classList.remove("animate__animated", "animate__fadeIn");
        sec.classList.add("d-none");
      });
      section.classList.remove("d-none");
      section.classList.add("d-block", "animate__animated", "animate__fadeIn");
    }

    darkModeToggle.addEventListener("change", () => {
      document.body.classList.toggle("dark-mode", darkModeToggle.checked);
    });

    resetApp.addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Are you sure you want to clear all data?")) {
        localStorage.clear();
        profile = null;
        connections = [];
        updateConnectionCount();
        renderProfileView();
        showToast("Application reset.", "info");
      }
    });

    function updateConnectionCount() {
      connectionCountEl.textContent = connections.length;
    }

    // ---------- Profile Handling ----------
    function renderProfileView() {
      viewProfile.innerHTML = "";
      if (!profile) {
        // Create Profile Form with dropdowns and multi-selects.
        const formContainer = document.createElement("div");
        formContainer.innerHTML = `
          <h3 class="mb-4">Create Your Profile</h3>
          <form id="profile-form" class="profile-form" novalidate>
            <div class="mb-3">
              <label for="name" class="form-label">Name *</label>
              <input type="text" class="form-control" id="name" required>
            </div>
            <div class="mb-3">
              <label for="collegeId" class="form-label">College Name *</label>
              <input type="text" class="form-control" id="collegeId" required>
            </div>
            <!-- Year Dropdown -->
            <div class="mb-3">
              <label for="year" class="form-label">Year *</label>
              <select class="form-select" id="year" required>
                <option value="">Select Year</option>
                <option value="First Year">First Year</option>
                <option value="Second Year">Second Year</option>
                <option value="Third Year">Third Year</option>
                <option value="Fourth Year">Fourth Year</option>
              </select>
            </div>
            <!-- Department Dropdown -->
            <div class="mb-3">
              <label for="department" class="form-label">Department *</label>
              <select class="form-select" id="department" required>
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <!-- Skills Multi-select Dropdown -->
            <div class="mb-3">
              <label for="skills" class="form-label">Skills / Interests</label>
              <select class="form-select" id="skills" multiple>
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="C++">C++</option>
                <option value="Data Science">Data Science</option>
                <option value="Web Development">Web Development</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="React">React</option>
                <option value="Angular">Angular</option>
                <option value="Node.js">Node.js</option>
              </select>
            </div>
            <!-- Project Areas Multi-select Dropdown -->
            <div class="mb-3">
              <label for="projectAreas" class="form-label">Project Areas</label>
              <select class="form-select" id="projectAreas" multiple>
                <option value="Web Development">Web Development</option>
                <option value="Mobile Apps">Mobile Apps</option>
                <option value="AI & ML">AI & ML</option>
                <option value="Data Science">Data Science</option>
                <option value="Robotics">Robotics</option>
                <option value="Embedded Systems">Embedded Systems</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="Game Development">Game Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
              </select>
            </div>
            <div class="mb-3">
              <label for="picture" class="form-label">Profile Picture (optional)</label>
              <input type="file" class="form-control" id="picture" accept="image/*">
            </div>
            <button type="submit" class="btn btn-primary">Create Profile</button>
          </form>
          <div id="profile-preview-container" class="mt-4"></div>
        `;
        viewProfile.appendChild(formContainer);
        addProfileFormListener(document.getElementById("profile-form"));
      } else {
        // Show Profile Summary
        viewProfile.innerHTML = `
          <h3 class="mb-4">My Profile</h3>
          <div class="card shadow-sm mb-3 neumo">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <img src="${getProfileImage(profile.picture)}" alt="${profile.name}'s photo" id="profile-preview" class="me-3">
                <div>
                  <h4 class="card-title mb-0">${profile.name}</h4>
                  <small>College: ${profile.collegeId}</small>
                </div>
              </div>
              <p class="mb-1"><strong>Year:</strong> ${profile.year}</p>
              <p class="mb-1"><strong>Department:</strong> ${profile.department}</p>
              <p class="mb-1"><strong>Skills / Interests:</strong> ${profile.skills || "N/A"}</p>
              <p class="mb-1"><strong>Project Areas:</strong> ${profile.projectAreas || "N/A"}</p>
            </div>
          </div>
          ${updateProgressBar()}
          ${connections.length >= 3 ? `<div class="mt-2"><span class="badge bg-success">Super Connector</span></div>` : ""}
          <button id="edit-profile-btn" class="btn btn-secondary mt-3">Edit Profile</button>
        `;
        document.getElementById("edit-profile-btn").addEventListener("click", openProfileEditor);
      }
    }

    function addProfileFormListener(form) {
      const pictureInput = document.getElementById("picture");
      const previewContainer = document.getElementById("profile-preview-container");
      pictureInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(event) {
            previewContainer.innerHTML = `<img src="${event.target.result}" id="profile-preview" alt="Profile Preview">`;
          };
          reader.readAsDataURL(file);
        } else {
          previewContainer.innerHTML = "";
        }
      });
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        try {
          const name = document.getElementById("name").value.trim();
          const collegeId = document.getElementById("collegeId").value.trim();
          const year = document.getElementById("year").value;
          const department = document.getElementById("department").value;
          let skillsSelect = document.getElementById("skills");
          let skills = Array.from(skillsSelect.selectedOptions).map(o => o.value).join(", ");
          let projectsSelect = document.getElementById("projectAreas");
          let projectAreas = Array.from(projectsSelect.selectedOptions).map(o => o.value).join(", ");
          const picture = pictureInput.files.length > 0 ? document.getElementById("profile-preview")?.src || "" : "";
          if (!name || !collegeId || !year || !department) {
            showToast("Please fill in all required fields.", "danger");
            return;
          }
          profile = { name, collegeId, year, department, picture, skills, projectAreas };
          saveToLocalStorage();
          showToast("Profile created successfully!");
          triggerConfetti();
          renderProfileView();
        } catch (error) {
          console.error("Error creating profile:", error);
          showToast("An error occurred. Please try again.", "danger");
        }
      });
    }

    // ---------- Offcanvas Profile Editor (Auto-Save) ----------
    function openProfileEditor() {
      const offcanvasContainer = document.getElementById("offcanvas-form-container");
      offcanvasContainer.innerHTML = `
        <form id="profile-edit-form" class="profile-form" novalidate>
          <div class="mb-3">
            <label for="edit-name" class="form-label">Name *</label>
            <input type="text" class="form-control" id="edit-name" value="${profile.name}" required>
          </div>
          <div class="mb-3">
            <label for="edit-collegeId" class="form-label">College ID *</label>
            <input type="text" class="form-control" id="edit-collegeId" value="${profile.collegeId}" required>
          </div>
          <!-- Year Dropdown -->
          <div class="mb-3">
            <label for="edit-year" class="form-label">Year *</label>
            <select class="form-select" id="edit-year" required>
              <option value="">Select Year</option>
              <option value="First Year" ${profile.year === "First Year" ? "selected" : ""}>First Year</option>
              <option value="Second Year" ${profile.year === "Second Year" ? "selected" : ""}>Second Year</option>
              <option value="Third Year" ${profile.year === "Third Year" ? "selected" : ""}>Third Year</option>
              <option value="Fourth Year" ${profile.year === "Fourth Year" ? "selected" : ""}>Fourth Year</option>
            </select>
          </div>
          <!-- Department Dropdown -->
          <div class="mb-3">
            <label for="edit-department" class="form-label">Department *</label>
            <select class="form-select" id="edit-department" required>
              <option value="">Select Department</option>
              <option value="Computer Science" ${profile.department === "Computer Science" ? "selected" : ""}>Computer Science</option>
              <option value="Electrical Engineering" ${profile.department === "Electrical Engineering" ? "selected" : ""}>Electrical Engineering</option>
              <option value="Mechanical Engineering" ${profile.department === "Mechanical Engineering" ? "selected" : ""}>Mechanical Engineering</option>
              <option value="Information Technology" ${profile.department === "Information Technology" ? "selected" : ""}>Information Technology</option>
              <option value="Other" ${profile.department === "Other" ? "selected" : ""}>Other</option>
            </select>
          </div>
          <!-- Skills Multi-select Dropdown -->
          <div class="mb-3">
            <label for="edit-skills" class="form-label">Skills / Interests</label>
            <select class="form-select" id="edit-skills" multiple>
              <option value="JavaScript" ${profile.skills && profile.skills.includes("JavaScript") ? "selected" : ""}>JavaScript</option>
              <option value="Python" ${profile.skills && profile.skills.includes("Python") ? "selected" : ""}>Python</option>
              <option value="C++" ${profile.skills && profile.skills.includes("C++") ? "selected" : ""}>C++</option>
              <option value="Data Science" ${profile.skills && profile.skills.includes("Data Science") ? "selected" : ""}>Data Science</option>
              <option value="Web Development" ${profile.skills && profile.skills.includes("Web Development") ? "selected" : ""}>Web Development</option>
              <option value="Machine Learning" ${profile.skills && profile.skills.includes("Machine Learning") ? "selected" : ""}>Machine Learning</option>
              <option value="Cybersecurity" ${profile.skills && profile.skills.includes("Cybersecurity") ? "selected" : ""}>Cybersecurity</option>
              <option value="React" ${profile.skills && profile.skills.includes("React") ? "selected" : ""}>React</option>
              <option value="Angular" ${profile.skills && profile.skills.includes("Angular") ? "selected" : ""}>Angular</option>
              <option value="Node.js" ${profile.skills && profile.skills.includes("Node.js") ? "selected" : ""}>Node.js</option>
            </select>
          </div>
          <!-- Project Areas Multi-select Dropdown -->
          <div class="mb-3">
            <label for="edit-projectAreas" class="form-label">Project Areas</label>
            <select class="form-select" id="edit-projectAreas" multiple>
              <option value="Web Development" ${profile.projectAreas && profile.projectAreas.includes("Web Development") ? "selected" : ""}>Web Development</option>
              <option value="Mobile Apps" ${profile.projectAreas && profile.projectAreas.includes("Mobile Apps") ? "selected" : ""}>Mobile Apps</option>
              <option value="AI & ML" ${profile.projectAreas && profile.projectAreas.includes("AI & ML") ? "selected" : ""}>AI & ML</option>
              <option value="Data Science" ${profile.projectAreas && profile.projectAreas.includes("Data Science") ? "selected" : ""}>Data Science</option>
              <option value="Robotics" ${profile.projectAreas && profile.projectAreas.includes("Robotics") ? "selected" : ""}>Robotics</option>
              <option value="Embedded Systems" ${profile.projectAreas && profile.projectAreas.includes("Embedded Systems") ? "selected" : ""}>Embedded Systems</option>
              <option value="Cybersecurity" ${profile.projectAreas && profile.projectAreas.includes("Cybersecurity") ? "selected" : ""}>Cybersecurity</option>
              <option value="Cloud Computing" ${profile.projectAreas && profile.projectAreas.includes("Cloud Computing") ? "selected" : ""}>Cloud Computing</option>
              <option value="Game Development" ${profile.projectAreas && profile.projectAreas.includes("Game Development") ? "selected" : ""}>Game Development</option>
              <option value="UI/UX Design" ${profile.projectAreas && profile.projectAreas.includes("UI/UX Design") ? "selected" : ""}>UI/UX Design</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="edit-picture" class="form-label">Profile Picture (optional)</label>
            <input type="file" class="form-control" id="edit-picture" accept="image/*">
          </div>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
        <div id="edit-preview-container" class="mt-3"></div>
      `;
      const editPicture = document.getElementById("edit-picture");
      const editPreview = document.getElementById("edit-preview-container");
      editPicture.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (event) {
            editPreview.innerHTML = `<img src="${event.target.result}" id="edit-profile-preview" alt="Profile Preview">`;
          };
          reader.readAsDataURL(file);
        } else {
          editPreview.innerHTML = "";
        }
      });
      document.getElementById("profile-edit-form").addEventListener("submit", (e) => {
        e.preventDefault();
        try {
          const name = document.getElementById("edit-name").value.trim();
          const collegeId = document.getElementById("edit-collegeId").value.trim();
          const year = document.getElementById("edit-year").value;
          const department = document.getElementById("edit-department").value;
          let skillsSelect = document.getElementById("edit-skills");
          let skills = Array.from(skillsSelect.selectedOptions).map(o => o.value).join(", ");
          let projectsSelect = document.getElementById("edit-projectAreas");
          let projectAreas = Array.from(projectsSelect.selectedOptions).map(o => o.value).join(", ");
          let picture = profile.picture;
          if (editPicture.files.length > 0) {
            picture = document.getElementById("edit-profile-preview")?.src || "";
          }
          if (!name || !collegeId || !year || !department) {
            showToast("Please fill in all required fields.", "danger");
            return;
          }
          profile = { name, collegeId, year, department, picture, skills, projectAreas };
          saveToLocalStorage();
          showToast("Profile updated successfully!");
          triggerConfetti();
          renderProfileView();
          const offcanvasEditor = bootstrap.Offcanvas.getInstance(document.getElementById("profileEditor"));
          offcanvasEditor.hide();
        } catch (error) {
          console.error("Error updating profile:", error);
          showToast("An error occurred. Please try again.", "danger");
        }
      });
      const offcanvasEditor = new bootstrap.Offcanvas(document.getElementById("profileEditor"));
      offcanvasEditor.show();
    }

    // ---------- Advanced Filtering & Simulated Async Loading ----------
    function advancedFilter() {
      const spinner = document.getElementById("browse-spinner");
      spinner.classList.remove("d-none");
      setTimeout(() => {
        const searchQuery = document.getElementById("search-input").value.toLowerCase();
        const deptFilter = document.getElementById("department-filter").value;
        const yearFilter = document.getElementById("year-filter").value;
        const filtered = mockStudents.filter((student) => {
          const matchesSearch =
            student.name.toLowerCase().includes(searchQuery) ||
            (student.skills && student.skills.toLowerCase().includes(searchQuery)) ||
            (student.projectAreas && student.projectAreas.toLowerCase().includes(searchQuery));
          const matchesDept = deptFilter ? student.department === deptFilter : true;
          const matchesYear = yearFilter ? student.year === yearFilter : true;
          return matchesSearch && matchesDept && matchesYear;
        });
        renderStudents(filtered);
        spinner.classList.add("d-none");
      }, 500);
    }
    document.getElementById("search-input").addEventListener("input", debounce(advancedFilter, 300));
    document.getElementById("department-filter").addEventListener("change", advancedFilter);
    document.getElementById("year-filter").addEventListener("change", advancedFilter);

    // Simple debounce function.
    function debounce(func, wait) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      };
    }

    // ---------- Rendering Student Cards & Floating Previews ----------
    function renderStudents(students) {
      const container = document.getElementById("students-container");
      container.innerHTML = "";
      if (!students.length) {
        container.innerHTML = "<p class='text-center'>No student profiles found.</p>";
        return;
      }
      students.forEach((student) => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4 position-relative";
        col.innerHTML = `
          <div class="card h-100 shadow-sm neumo">
            <img src="${getProfileImage(student.picture)}" class="card-img-top view-details-btn" alt="${student.name}'s picture" data-id="${student.id}" style="cursor:pointer">
            <div class="card-body">
              <h5 class="card-title">${student.name}</h5>
              <p class="card-text mb-1"><strong>${student.year}</strong> – ${student.department}</p>
              <p class="card-text"><small>Interests: ${student.skills}</small></p>
            </div>
            <div class="card-footer bg-transparent border-top-0">
              <button class="btn btn-outline-primary w-100 connect-btn" data-id="${student.id}">Connect</button>
            </div>
          </div>
          <div class="preview-float" id="preview-${student.id}"></div>
        `;
        container.appendChild(col);
      });
      // Connection button event.
      document.querySelectorAll(".connect-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          pendingConnectionId = btn.getAttribute("data-id");
          const student = mockStudents.find((s) => s.id === pendingConnectionId);
          if (student) {
            document.getElementById("connName").textContent = student.name;
            const confirmModal = new bootstrap.Modal(document.getElementById("confirmModal"));
            confirmModal.show();
          }
        });
      });
      // Floating preview on image hover.
      document.querySelectorAll(".view-details-btn").forEach((img) => {
        img.addEventListener("mouseover", (e) => {
          const studentId = img.getAttribute("data-id");
          const student = mockStudents.find((s) => s.id === studentId);
          const previewDiv = document.getElementById("preview-" + studentId);
          if (student) {
            previewDiv.innerHTML = `
              <div class="card p-2" style="width: 14rem;">
                <img src="${getProfileImage(student.picture)}" class="card-img-top" alt="${student.name}">
                <div class="card-body p-2">
                  <h6 class="card-title mb-0">${student.name}</h6>
                </div>
              </div>
            `;
            previewDiv.style.top = e.offsetY + 20 + "px";
            previewDiv.style.left = e.offsetX + "px";
            previewDiv.style.opacity = 1;
          }
        });
        img.addEventListener("mouseout", (e) => {
          const studentId = img.getAttribute("data-id");
          const previewDiv = document.getElementById("preview-" + studentId);
          previewDiv.style.opacity = 0;
        });
        // On click, show detailed modal.
        img.addEventListener("click", () => {
          const studentId = img.getAttribute("data-id");
          const student = mockStudents.find((s) => s.id === studentId);
          if (student) showDetailedModal(student);
        });
      });
    }

    // ---------- Detailed Student Modal ----------
    function showDetailedModal(student) {
      document.getElementById("detailedModalLabel").textContent = student.name;
      document.getElementById("detailedModalBody").innerHTML = `
        <div class="row">
          <div class="col-md-5">
            <img src="${getProfileImage(student.picture)}" class="img-fluid rounded" alt="${student.name}">
          </div>
          <div class="col-md-7">
            <p><strong>Year:</strong> ${student.year}</p>
            <p><strong>Department:</strong> ${student.department}</p>
            <p><strong>Skills/Interests:</strong> ${student.skills}</p>
            <p><strong>Project Areas:</strong> ${student.projectAreas}</p>
            <button class="btn btn-outline-primary connect-btn mt-2" data-id="${student.id}">Connect</button>
          </div>
        </div>
      `;
      const modalConnectBtn = document.querySelector("#detailedModalBody .connect-btn");
      modalConnectBtn.addEventListener("click", () => {
        pendingConnectionId = modalConnectBtn.getAttribute("data-id");
        document.getElementById("connName").textContent = student.name;
        const confirmModal = new bootstrap.Modal(document.getElementById("confirmModal"));
        confirmModal.show();
        const detailedModal = bootstrap.Modal.getInstance(document.getElementById("detailedModal"));
        detailedModal.hide();
      });
      const detailedModal = new bootstrap.Modal(document.getElementById("detailedModal"));
      detailedModal.show();
    }

    // ---------- Connection Handling ----------
    function handleConnectConfirmed() {
      if (!pendingConnectionId) return;
      const student = mockStudents.find(s => s.id === pendingConnectionId);
      if (!student) return;
      if (connections.find(s => s.id === pendingConnectionId)) {
        showToast("Already connected with this student.", "warning");
        pendingConnectionId = null;
        return;
      }
      connections.push(student);
      saveToLocalStorage();
      updateConnectionCount();
      showToast("Connection request sent!");
      triggerConfetti();
      pendingConnectionId = null;
    }
    document.getElementById("confirm-btn").addEventListener("click", () => {
      handleConnectConfirmed();
      const confirmModal = bootstrap.Modal.getInstance(document.getElementById("confirmModal"));
      confirmModal.hide();
    });

    // ---------- Render Connections ----------
    function renderConnections() {
      const container = document.getElementById("connections-container");
      container.innerHTML = "";
      if (connections.length === 0) {
        container.innerHTML = "<p class='text-center'>No connections yet.</p>";
        return;
      }
      connections.forEach((student) => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";
        col.innerHTML = `
          <div class="card h-100 shadow-sm neumo">
            <img src="${getProfileImage(student.picture)}" class="card-img-top" alt="${student.name}'s picture">
            <div class="card-body">
              <h5 class="card-title">${student.name}</h5>
              <p class="card-text mb-1"><strong>${student.year}</strong> – ${student.department}</p>
              <p class="card-text"><small>Interests: ${student.skills}</small></p>
            </div>
          </div>
        `;
        container.appendChild(col);
      });
    }

    // ---------- (Simulated) AI-Powered Recommended Connections ----------
    function getRecommendedConnections() {
      return mockStudents.filter(s => !connections.find(c => c.id === s.id)).sort((a, b) => {
        const aScore = (profile && profile.skills && a.skills.includes(profile.skills.split(",")[0].trim())) ? 1 : 0;
        const bScore = (profile && profile.skills && b.skills.includes(profile.skills.split(",")[0].trim())) ? 1 : 0;
        return bScore - aScore;
      });
    }

    // ---------- Navigation Listeners ----------
    navProfile.addEventListener("click", (e) => {
      e.preventDefault();
      updateNavHighlight(navProfile);
      showSection(viewProfile);
      renderProfileView();
    });
    navBrowse.addEventListener("click", (e) => {
      e.preventDefault();
      updateNavHighlight(navBrowse);
      showSection(viewBrowse);
      advancedFilter();
    });
    navConnections.addEventListener("click", (e) => {
      e.preventDefault();
      updateNavHighlight(navConnections);
      showSection(viewConnections);
      renderConnections();
    });

    // ---------- Initial Load ----------
    updateConnectionCount();
    renderProfileView();

    // ---------- Global Error Handler ----------
    window.onerror = function (msg, url, lineNo, columnNo, error) {
      console.error("Error:", msg);
      showToast("An unexpected error occurred.", "danger");
      return false;
    };

    // (Optional) Simulate real-time "Active" status indicators on Browse view.
    setInterval(() => {
      document.querySelectorAll(".card").forEach(card => {
        if (Math.random() < 0.1) {
          if (!card.querySelector(".online-indicator")) {
            const indicator = document.createElement("span");
            indicator.className = "badge bg-success online-indicator";
            indicator.style.position = "absolute";
            indicator.style.top = "10px";
            indicator.style.right = "10px";
            indicator.innerText = "Active";
            card.appendChild(indicator);
          }
        } else {
          const indi = card.querySelector(".online-indicator");
          if (indi) indi.remove();
        }
      });
    }, 3000);