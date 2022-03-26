const baseUrl = "http://localhost:4000/api";

// create comment
const commentsDiv = document.querySelector(".comments");
const inputButton = document.querySelector(".input_form--btn");
const inputBox = document.querySelector(".input_form--text");
const upvoteButtons = document.querySelectorAll(
  ".comments_card--body_ctas-upvote"
);

inputButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const inputValue = inputBox.value;
  console.log({ inputValue });
  try {
    const res = await fetch(`${baseUrl}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: inputValue }),
    });

    const data = await res.json();

    createCard(data);
  } catch (err) {
    // handle error
    alert(err);
  }
});

const createCard = (data) => {
  // create div and append to commentsDiv
  const card = document.createElement("div");
  card.className = "comments_card";

  const cardUser = document.createElement("div");
  cardUser.className = "comments_card--user";

  const userImage = document.createElement("img");
  userImage.src = "./public/avatar.JPG";
  userImage.alt = "avatar";
  userImage.setAttribute("class", "comments_card--user__avatar");

  // append image to user
  cardUser.appendChild(userImage);

  // create card body
  const cardBody = document.createElement("div");
  cardBody.className = "comments_card--body";

  const cardBodyName = document.createElement("h3");
  cardBodyName.className = "comments_card--body_fullName";
  cardBodyName.innerText = data.author.fullName;

  const cardBodyText = document.createElement("div");
  cardBodyText.className = "comments_card--body_text";
  cardBodyText.innerText = data.text;

  const ctas = document.createElement("div");
  ctas.className = "comments_card--body_ctas";

  const upVoteSpan = document.createElement("span");
  upVoteSpan.setAttribute("comment-id", data.id);
  upVoteSpan.addEventListener("click", upVoteFn);
  upVoteSpan.className = "comments_card--body_ctas-upvote";
  upVoteSpan.innerText = "Upvote";

  ctas.appendChild(upVoteSpan);

  cardBody.appendChild(cardBodyName);
  cardBody.appendChild(cardBodyText);
  cardBody.appendChild(ctas);

  // append user to card
  card.appendChild(cardUser);
  card.appendChild(cardBody);

  // append to comments div
  commentsDiv.appendChild(card);
};

const upVoteFn = async function (e) {
  try {
    e.preventDefault();
    const commentId = this.getAttribute("comment-id");

    const res = await fetch(`${baseUrl}/comments/${commentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const data = await res.json();
  } catch (err) {
    console.log(err);
    alert(err.message);
  }
};

Array.from(upvoteButtons).forEach((button) => {
  button.addEventListener("click", upVoteFn);
});

const getComments = async () => {
  const res = await fetch(`${baseUrl}/comments/`);

  const data = await res.json();
  data.forEach((comment) => createCard(comment));
};

getComments();
