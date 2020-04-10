import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsFakeComment");
const headerImg = document.getElementById("jsAvatar");
const delComment = document.querySelectorAll(".jsDelBtn");

//  Del Comment

function reduceNum() {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
}

function deleteComment(eventLi) {
  commentList.removeChild(eventLi);
  reduceNum();
}

async function handleDelete(e) {
  const eventLi = e.target.parentNode;
  const postCommentId = eventLi.dataset.id;
  const commentId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${commentId}/delete-comment`,
    method: "POST",
    data: { postCommentId },
  });
  if (response.status === 200) {
    deleteComment(eventLi);
  }
}

async function realTimeDel(e) {
  const targetLi = e.target.parentNode;
  const realTimeText = targetLi.children[1].innerHTML;
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/realtime-comment`,
    method: "POST",
    data: {
      realTimeText,
    },
  });
  if (response.status === 200) {
    deleteComment(targetLi);
  }
}

//  Add Comment

const addNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const addComment = (comment) => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const div = document.createElement("div");
  const nipple = document.createElement("div");
  const delBtn = document.createElement("button");
  const img = document.createElement("img");
  delBtn.classList.add("jsDelBtn");
  img.classList.add("comment-avatar");
  div.classList.add("user__info");
  nipple.classList.add("nipple");
  span.innerHTML = comment;
  delBtn.innerHTML = "❌";
  img.src = headerImg.src;
  li.appendChild(delBtn);
  li.appendChild(span);
  li.appendChild(div);
  div.appendChild(nipple);
  div.appendChild(img);
  commentList.prepend(li);
  delBtn.addEventListener("click", realTimeDel);
  addNumber();
};

const sendComment = async (comment) => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment,
    },
  });
  if (response.status === 200) {
    addComment(comment);
  }
};

function handleSubmit(e) {
  e.preventDefault();
  const commentInput = document.getElementById("jsAddInput");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
}

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
  for (let i = 0; i < delComment.length; i += 1) {
    delComment[i].addEventListener("click", handleDelete);
  }
}

if (addCommentForm) {
  init();
}
