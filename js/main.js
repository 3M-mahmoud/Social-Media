// ===== // INFINITY // ===== //
let currentPage = 1;
let lastPage = 1;
window.addEventListener("scroll", () => {
  let endPage =
    window.scrollY + window.innerHeight + 1 >=
    document.documentElement.scrollHeight;
  if (endPage && currentPage <= lastPage) {
    currentPage++;
    getPosts(currentPage);
  }
});
// ===== // INFINITY // ===== //
let posts = document.getElementById("posts");
const baseUrl = "https://tarmeezacademy.com/api/v1";

function defaultPosts() {
  showLoad(true);
  axios.get(`${baseUrl}/posts?limit=50`).then((Response) => {
    showLoad(false);
    let data = Response.data.data;
    lastPage = Response.data.meta.last_page;
    showPosts(data);
  });
}
defaultPosts();

function getPosts(page = 1) {
  axios.get(`${baseUrl}/posts?limit=50&page=${page}`).then((Response) => {
    let data = Response.data.data;
    lastPage = Response.data.meta.last_page;
    showPosts(data, false);
  });
}

function showLoad(show = true) {
  let loader = document.querySelector(".loader");
  if (show) {
    document.body.style.overflow = "hidden";
  } else {
    if (loader != null) {
      loader.remove();
      document.body.style.overflow = "auto";
    }
  }
}

function showPosts(data, reload = true) {
  if (posts != null && reload) posts.innerHTML = "";
  let user = currentUser();
  if (user === null) {
    user = "";
  } else {
    user = currentUser();
  }
  let btnEdit = "";
  data.forEach((e) => {
    if (e.author.id === user.id) {
      btnEdit = `
      <div class="float-end ms-auto">
      <button
      class="btn btn-outline-primary"
      data-bs-toggle="modal"
      data-bs-target="#edit-post-modal"
      onclick="editBtnPost('${encodeURIComponent(JSON.stringify(e))}')">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
      <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
      </svg>
      </button>
      <button
      class="btn btn-outline-danger"
      data-bs-toggle="modal"
      data-bs-target="#delete-post-modal"
      onclick="deleteBtnClick('${encodeURIComponent(JSON.stringify(e))}')">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
      </svg>
      </button>
      </div>`;
    } else {
      btnEdit = "";
    }
    let content = `
        <!-- post -->
        <div class="card shadow my-4">
        <div class="card-header d-flex justify-content-between flex-column flex-md-row">
          <div onclick="profileBtn(${
            e.author.id
          })" class="d-flex align-items-end">
            <div
              class="image me-2 rounded-circle border border-2"
              style="width: 50px; height: 50px; cursor: pointer"
              >
              <img
                class="img-fluid rounded-circle"
                src="${
                  typeof e.author.profile_image === "object"
                    ? "http://tarmeezacademy.com/images/users/kbkbvnhMDA0Kxhd.jpg"
                    : e.author.profile_image
                }"
                alt=""
                />
                </div>
                <h4
                class="text-black-50"
                style="font-size: 16px; cursor: pointer"
                >
                @${e.author.username === null ? "UnKnown" : e.author.username}
                </h4>
                </div>
                ${btnEdit}
                </div>
          <div class="card-body">
            <img
              onclick="postClicked(${e.id})"
              class="w-100"
              style="cursor: pointer;"
              src="${
                typeof e.image === "object"
                  ? "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  : e.image
              }"
              alt=""
              />
            <h6 class="text-black-50 mt-1">${
              e.created_at === null ? "0 min ago" : e.created_at
            }</h6>
            <h5>${e.title === null ? "" : e.title}</h5>
            <p>
              ${e.body === "undefined" ? "<-- Not Found -->" : e.body}
            </p>
            <hr />
            <div style="cursor: pointer;" onclick="postClicked(${e.id})">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-pen"
                viewBox="0 0 16 16"
              >
              <path
                  d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"
                />
                </svg>
              <span class="me-3"> (${
                e.comments_count === null ? "0" : e.comments_count
              }) Comments </span>
              ${showTags(e.tags)}
              </div>
              </div>
        </div>`;
    if (posts != null) posts.innerHTML += content;
  });
}

if (window.innerWidth <= 600) {
  document.querySelector("#addPost button").innerHTML = "+";
}
