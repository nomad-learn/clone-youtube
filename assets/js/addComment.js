import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const addCommentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsFakeComment");
const headerImg = document.getElementById("jsAvatar");

const addNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addComment = comment => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const div = document.createElement("div");
  const nipple = document.createElement("div");
  const img = document.createElement("img");
  span.innerHTML = comment;
  img.src = headerImg.src;
  img.classList.add("comment-avatar");
  div.classList.add("user__info");
  nipple.classList.add("nipple");
  li.appendChild(span);
  li.appendChild(div);
  div.appendChild(nipple);
  div.appendChild(img);
  addCommentList.prepend(li);
  addNumber();
};

const sendComment = async comment => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment
    }
  });
  if (response.status === 200) {
    addComment(comment);
  }
};

function handleSubmit(e) {
  e.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
}

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
}

if (addCommentForm) {
  init();
}
