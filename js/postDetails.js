const urlParams = new URLSearchParams(window.location.search);
let id = urlParams.get("postId");
getPost();
function getPost() {
  let show;
  if (sessionStorage.getItem("token")) {
    show = true;
  } else {
    show = false;
  }
    axios
    .get(`${baseUrl}/posts/${id}`)
    .then((Response) => {
      let data = Response.data.data;
      let postClick = document.getElementById("postClick");
      if (postClick != null) {
        postClick.innerHTML = "";
        postClick.innerHTML = `
      <h3>
      <span>${data.author.name}</span>
      posts
  </h3>
  <div class="card shadow my-4">
      <div class="card-header d-flex align-items-end">
      <div onclick="profileBtn(${data.author.id})" class="d-flex align-items-center">
        <div class="image me-2 rounded-circle border border-2" style="width: 50px; height: 50px; cursor: pointer">
          <img class="img-fluid rounded-circle" src="${
            typeof data.author.profile_image === "object"
              ? "http://tarmeezacademy.com/images/users/kbkbvnhMDA0Kxhd.jpg"
              : data.author.profile_image
          }" alt="">
        </div>
        <h4 class="text-black-50" style="font-size: 16px; cursor: pointer">
          @${data.author.username}
          </h4>
          </div>
      </div>
      <div class="card-body">
        <img class="w-100" style="cursor: pointer;" src="${typeof data.image === "object"
        ? "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        : data.image}" alt="">
        <h6 class="text-black-50 mt-1">${data.created_at}</h6>
        <h5>${data.title === null ? "" : data.title}</h5>
        <p>
        ${data.body === "undefined" ? "<-- Not Found -->" : data.body}
        </p>
        <hr>
        <div style="cursor: pointer;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"></path>
        </svg>
        <span class="me-3"> (${data.comments_count}) Comments </span>
        ${showTags(data.tags)}
        </div>
      </div>
      <!-- /===/ Comments /===/ -->
      <div id="comments">
        ${showComments(data.comments)}
      </div>
      <!-- /===/ Comments /=== -->
      ${inputComment(show)}  
      </div>`
    }
    });
  }

function inputComment(show) {
  let content = "";
  if (show) {
    content = `
    <div class="input-group mt-3 mb-3">
    <input id = "commentValue" type="text" class="form-control" placeholder="add your comment..." aria-label="add your comment" aria-describedby="button-addon2">
    <button class="btn btn-outline-primary" type="button" id="button-addon2" onclick="sendComment(${id})">Send</button>
    </div>`;
  }
  return content;
}

function showComments(comments) {
  let content = "";
  comments.forEach(c => {
    let comment = `
    <!--  Comment  -->
    <div class="p-3" style="background-color: #ebeaef;">
      <div onclick="profileBtn(${c.author.id})" style="cursor: pointer;">
      <img class="rounded-circle" style="width: 40px; height: 40px;" src="${
        typeof c.author.profile_image === "object"
          ? "http://tarmeezacademy.com/images/users/kbkbvnhMDA0Kxhd.jpg"
          : c.author.profile_image
      }" alt="">
      <b>@${c.author.username}</b>
    </div>
    <div class="text-black-50 mt-2 ps-2" style="font-size: 14px;">
      ${c.body}
    </div>
  </div>
    <!--  Comment  -->`;
    content += comment;
  })
  return content;
}

function sendComment(id) {
  if (sessionStorage.getItem("token")) {
    let commentValue = document.getElementById("commentValue");
    const data = {
      "body": commentValue.value
    }
    const config = {
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem('token')}`
      }
    }
    axios
    .post(`${baseUrl}/posts/${id}/comments`, data, config)
    .then(() => {
      getPost();
    }).catch(error => {
      error = error.response.data.message
      showAlert(error, "error");
    })
    commentValue.value = "";
  } else {
    showAlert("You must Register or Login", "error");
  }
}