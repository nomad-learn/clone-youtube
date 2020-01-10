// import axios from "axios";

// const addCommentForm = document.getElementById("jsAddComment");
// const commentList = document.getElementById("jsCommentList");
// const commentNumber = document.getElementById("jsFakeComment");
// const delComment = document.querySelectorAll(".jsDelBtn");

// function reduceNum() {
//   commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
// }

// function deleteComment(eventLi) {
//   commentList.removeChild(eventLi);
//   reduceNum();
// }

// async function handleDelete(e) {
//   const eventLi = e.target.parentNode;
//   const postCommentId = eventLi.dataset.id;
//   const commentId = window.location.href.split("/videos/")[1];
//   const response = await axios({
//     url: `/api/${commentId}/delete-comment`,
//     method: "POST",
//     data: { postCommentId }
//   });
//   if (response.status === 200) {
//     deleteComment(eventLi);
//   }
// }

// function init() {
//   for (let i = 0; i < delComment.length; i += 1) {
//     delComment[i].addEventListener("click", handleDelete);
//   }
// }

// if (addCommentForm) {
//   init();
// }
