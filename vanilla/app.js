const baseUrl = "http://localhost:4000/api";

// create comment
const errorDiv = document.getElementById("error");
const successDiv = document.getElementById("success");
const commentsDiv = document.querySelector(".comments");
const inputBox = document.querySelector(".input_form--text");
const inputButton = document.querySelector(".input_form--btn");
const upvoteButtons = document.querySelectorAll(
  ".comments_card--body_ctas-upvote"
);

inputButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const inputValue = inputBox.value;
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

    inputBox.value = ""
  } catch (err) {
    // handle error
    console.log(err);
    showError(err);
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

  const cardBodyHeader = document.createElement("div");
  cardBodyHeader.className = "comments_card--body_header";

  const cardBodyName = document.createElement("h3");
  cardBodyName.className = "comments_card--body_header-name";
  cardBodyName.innerText = data.author.fullName;

  const cardBodyTime = document.createElement("span");
  cardBodyTime.className = "comments_card--body_header-time";
  cardBodyTime.innerText = timeSince(new Date(data.time * 1000));

  cardBodyHeader.appendChild(cardBodyName);
  cardBodyHeader.appendChild(cardBodyTime);

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

  cardBody.appendChild(cardBodyHeader);
  cardBody.appendChild(cardBodyText);
  cardBody.appendChild(ctas);

  // append user to card
  card.appendChild(cardUser);
  card.appendChild(cardBody);

  // append to comments div
  // commentsDiv.appendChild(card);
  commentsDiv.prepend(card)
};

const showError = (err) => {
  errorDiv.textContent =
    err.response && err.response.data.message
      ? err.response.data.message
      : err.message;
  errorDiv.style.display = "flex";
  setTimeout(() => {
    errorDiv.style.display = "none";
    errorDiv.textContent = "";
  }, 4000);
};

const showSuccess = (message) => {
  successDiv.textContent = message;
  successDiv.style.display = "flex";
  setTimeout(() => {
    successDiv.style.display = "none";
    successDiv.textContent = "";
  }, 4000);
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
    if (data.message === "liked") {
      showSuccess("Liked Comment");
      this.innerText = "Downvote";
    } else {
      showSuccess("Unliked Comment");
      this.innerText = "Upvote";
    }
  } catch (err) {
    console.log(err);
    showError(err);
  }
};

Array.from(upvoteButtons).forEach((button) => {
  button.addEventListener("click", upVoteFn);
});

const getComments = async () => {
  try {
    const res = await fetch(`${baseUrl}/comments/`);

    const data = await res.json();
    data.forEach((comment) => createCard(comment));
  } catch (err) {
    showError(err);
  }
};

getComments();

const timeSince = (date) => {
  if (typeof date !== "object") {
    date = new Date(date);
  }

  var seconds = Math.floor((new Date() - date) / 1000);
  var intervalType;

  var interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    intervalType = "year";
  } else {
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      intervalType = "month";
    } else {
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        intervalType = "day";
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          intervalType = "hour";
        } else {
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            intervalType = "minute";
          } else {
            interval = seconds;
            intervalType = "second";
          }
        }
      }
    }
  }

  if (interval > 1 || interval === 0) {
    intervalType += "s ago";
  }

  return interval + " " + intervalType;
};
