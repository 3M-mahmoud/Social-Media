baseUrl = "https://tarmeezacademy.com/api/v1";
function loginBtnClick() {
    const url = `${baseUrl}/login`;
    const us = document.getElementById("input-username").value;
    let password = document.getElementById("input-Password").value;
    const data = {
      "username" : us,
      "password" : password
    }
    axios.post(url, data).then((response) => {
      sessionStorage.setItem("token", response.data.token)
      sessionStorage.setItem("user", JSON.stringify(response.data.user))
  
      const modal = document.getElementById("login-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
        if (typeof defaultPosts === "function") {
          defaultPosts();
        }
        if (typeof showInfo === "function") {
          const urlParams = new URLSearchParams(window.location.search);
          let id = urlParams.get("userId");
          let info = JSON.parse(sessionStorage.getItem("user"));
          if (id === null || id === undefined) {
            id = info.id;
          } 
          showInfo(id);
          }
        if (typeof getUserPosts === "function") {
          const urlParams = new URLSearchParams(window.location.search);
          let id = urlParams.get("userId");
          let info = JSON.parse(sessionStorage.getItem("user"));
          if (id === null || id === undefined) {
            id = info.id;
          } 
          getUserPosts(id);
          }
      setupUI();
      loginData(JSON.parse(sessionStorage.getItem("user")));
      showAlert("Logged in successfully");
    }).catch(error => {
      showAlert(error.response.data.message, "error");
    })
  }
  
  function registerBtnClick() {
    const url = `${baseUrl}/register`;
    let name = document.getElementById("register-input-name").value;
    const us = document.getElementById("register-input-username").value;
    let password = document.getElementById("register-input-Password").value;
    let image = document.getElementById("register-input-image").files[0];
  
    let formData = new FormData();
    formData.append("name", name);
    formData.append("username", us);
    formData.append("password", password);
    formData.append("image", image);
  
    const config = {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  
    axios.post(url, formData, config).then((response) => {
      sessionStorage.setItem("token", response.data.token)
      sessionStorage.setItem("user", JSON.stringify(response.data.user))
  
      const modal = document.getElementById("register-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      if (typeof defaultPosts === "function") {
        defaultPosts();
        }
        if (typeof showInfo === "function") {
          const urlParams = new URLSearchParams(window.location.search);
          let id = urlParams.get("userId");
          let info = JSON.parse(sessionStorage.getItem("user"));
          if (id === null || id === undefined) {
            id = info.id;
          } 
          showInfo(id);
          }
      setupUI();
      loginData(JSON.parse(sessionStorage.getItem("user")));
      showAlert("Register a new user success");
    }).catch(error => {
      showAlert(error.response.data.message, "error");
    })
  }
  
  
  function logoutBtnClick() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setupUI();
    showAlert("Logged out successfully");
  }
  
  function showTags(tags) {
    let content = "";
    tags.forEach((e) => {
      let btn = `
      <button type="button" class="btn btn-sm btn-secondary rounded-5">${e.name}</button>`;
      content += btn;
    })
    return content;
  }
  
  function setupUI() {
    let loginDiv = document.querySelector(".loginDiv")
    let logoutDiv = document.querySelector(".logoutDiv") 
    let addPost = document.getElementById("addPost");
    if(sessionStorage.getItem("token")) {
      loginDiv.style.setProperty("display", "none", "important");
      logoutDiv.style.setProperty("display", "flex", "important");
      if (addPost != null) {
        addPost.style.setProperty("display", "flex", "important");
      }
      loginData(JSON.parse(sessionStorage.getItem("user")))
      ;
    } else {
      loginDiv.style.setProperty("display", "flex", "important");
      logoutDiv.style.setProperty("display", "none", "important");
      if (addPost != null) {
        addPost.style.setProperty("display", "none", "important");
      }
      
    }
  }
  setupUI();
  
  function showAlert(title, type="success") {
    Swal.fire({
      title: title,
      text: "You clicked the button!",
      icon: type
    });
  }
  
  function loginData(user) {
    let info = document.querySelector(".info");
    info.innerHTML = "";
    let content = `
    <div class="card-header d-flex align-items-center me-2 flex-sm-column">
    <div
      class="image me-2 rounded-circle border border-2"
      style="width: 50px; height: 50px; cursor: pointer">
      <img
        class="img-fluid rounded-circle"
        src="${
          typeof user.profile_image === "object"
            ? "http://tarmeezacademy.com/images/users/kbkbvnhMDA0Kxhd.jpg"
            : user.profile_image
        }" alt=""
      />
    </div>
    <h4 class="text-black-50" style="font-size: 16px; cursor: pointer">
      ${user.username}
    </h4>
  </div>`
  info.innerHTML += content;
  }

  function currentUser() {
    let user = null;
    if (sessionStorage.getItem("user")) {
      user = JSON.parse(sessionStorage.getItem("user"));
    }
    return user;
  }

  function openProfilePage() {
    let profilePage = document.getElementById("profile-link");
    profilePage.onclick = (e) => {
      let check = false;
      if (sessionStorage.getItem("token")) {
        check = true;
      } else {
        const modal = document.getElementById("login-modal");
        const loginModal = new bootstrap.Modal(modal, {});
        loginModal.toggle();
      }
      if (check === false) {
        e.preventDefault();
      }
    }
  }

function deleteBtnClick(e) {
  object = JSON.parse(decodeURIComponent(e));
  document.getElementById("post-id-value").value = object.id;
  document.getElementById("delete-post-title").innerHTML = object.title;
}

function conformDeletePost() {
  let id = document.getElementById("post-id-value").value;
  const url = `${baseUrl}/posts/${id}`;
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${sessionStorage.getItem('token')}`
    }
  }
  axios.delete(url, config).then(() => {
    showAlert("Deleted Post success");
    if (typeof defaultPosts === "function") {
      defaultPosts();
    }
    if (typeof showInfo === "function") {
      const urlParams = new URLSearchParams(window.location.search);
      let id = urlParams.get("userId");
      let info = JSON.parse(sessionStorage.getItem("user"));
      if (id === null || id === undefined) {
        id = info.id;
      } 
      showInfo(id);
      }
    if (typeof getUserPosts === "function") {
      const urlParams = new URLSearchParams(window.location.search);
      let id = urlParams.get("userId");
      let info = JSON.parse(sessionStorage.getItem("user"));
      if (id === null || id === undefined) {
        id = info.id;
      } 
      getUserPosts(id);
      }
    const modal = document.getElementById("delete-post-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
  }).catch(error => {
    showAlert(error.response.data.message, "error");
  })
}

function editPostClick() {
  let postId = document.getElementById("post-id-value").value;
  const url = `${baseUrl}/posts/${postId}`;
  const title = document.getElementById("input-title-edit-post").value;
  let body = document.getElementById("input-body-edit-post").value;
  let image = document.getElementById("input-image-edit-post").files[0];
  let formData = new FormData();
  formData.append("body", body);
  formData.append("title", title);
  formData.append("image", image);
  formData.append("_method", "put");
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${sessionStorage.getItem('token')}`
    }
  }
  axios.post(url, formData, config).then(() => {
    const modal = document.getElementById("edit-post-modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();
    showAlert("Edit Post success");
    if (typeof defaultPosts === "function") {
      defaultPosts();
    }
    if (typeof getUserPosts === "function") {
      const urlParams = new URLSearchParams(window.location.search);
      let id = urlParams.get("userId");
      let info = JSON.parse(sessionStorage.getItem("user"));
      if (id === null || id === undefined) {
        id = info.id;
      } 
      getUserPosts(id);
      }
  }).catch(error => {
    showAlert(error.response.data.message, "error");
  })
}

function editBtnPost(e) {
  object = JSON.parse(decodeURIComponent(e));
  document.getElementById("post-id-value").value = object.id;
  document.getElementById("input-title-edit-post").value = object.title;
  document.getElementById("input-body-edit-post").value = object.body;
}

function profileBtn(id) {
  if (id === undefined) {
    const info = JSON.parse(sessionStorage.getItem("user"));
    id = info.id;
  }
  if (sessionStorage.getItem("token")) {
    window.location = `profile.html?userId=${id}`;
  } else 
  showAlert("You Must Register or Login", "error");
}
openProfilePage();

function postClicked(id) {
  if (sessionStorage.getItem("token")) {
    window.location = `postDetails.html?postId=${id}`
  } else {
    showAlert("You must Register or Login", "error");
  }
}

function createNewPostClick() {
  const url = `${baseUrl}/posts`;
  const title = document.getElementById("input-title-post").value;
  let body = document.getElementById("input-body-post").value;
  let image = document.getElementById("input-image-post").files[0];
  let formData = new FormData();
  formData.append("body", body);
  formData.append("title", title);
  formData.append("image", image);
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
  };
  axios
    .post(url, formData, config)
    .then(() => {
      const modal = document.getElementById("create-post-modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      showAlert("Create a new Post success");
      if (typeof defaultPosts === "function") {
        defaultPosts();
      }
      if (typeof showInfo === "function") {
        const urlParams = new URLSearchParams(window.location.search);
        let id = urlParams.get("userId");
        let info = JSON.parse(sessionStorage.getItem("user"));
        if (id === null || id === undefined) {
          id = info.id;
        } 
        showInfo(id);
        }
      if (typeof getUserPosts === "function") {
        const urlParams = new URLSearchParams(window.location.search);
        let id = urlParams.get("userId");
        let info = JSON.parse(sessionStorage.getItem("user"));
        if (id === null || id === undefined) {
          id = info.id;
        } 
        getUserPosts(id);
        }
    })
    .catch((error) => {
      showAlert(error.response.data.message, "error");
    });
}