const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const filterButtons = document.querySelectorAll(".filter-btn");
const workCards = document.querySelectorAll(".work-card");
const workVideos = document.querySelectorAll(".work-video video");
const videoTriggers = document.querySelectorAll(".video-trigger");
const videoDialog = document.querySelector("#video-dialog");
const videoTitle = document.querySelector("#video-title");
const videoFrame = document.querySelector("#video-frame");
const dialogClose = document.querySelector(".dialog-close");
const year = document.querySelector("#year");

let lastVideoTrigger = null;

if (year) {
  year.textContent = new Date().getFullYear();
}

function closeNav() {
  if (!navToggle || !siteNav) return;
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
  siteNav.classList.remove("is-open");
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeNav();
    } else {
      navToggle.setAttribute("aria-expanded", "true");
      navToggle.setAttribute("aria-label", "Close navigation");
      siteNav.classList.add("is-open");
    }
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeNav();
  });

  document.addEventListener("click", (event) => {
    if (!navToggle.contains(event.target) && !siteNav.contains(event.target)) closeNav();
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    workCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
      if (card.hidden) {
        card.querySelectorAll("video").forEach((video) => video.pause());
      }
    });
  });
});

workVideos.forEach((video) => {
  video.addEventListener("play", () => {
    workVideos.forEach((otherVideo) => {
      if (otherVideo !== video) otherVideo.pause();
    });
  });
});

function openVideo(trigger) {
  if (!videoDialog || !videoTitle || !videoFrame) return;

  const embed = trigger.dataset.embed;
  if (!embed) return;

  workVideos.forEach((video) => video.pause());

  lastVideoTrigger = trigger;
  videoTitle.textContent = trigger.dataset.title || "Video";
  videoFrame.replaceChildren();

  const iframe = document.createElement("iframe");
  iframe.src = embed;
  iframe.title = videoTitle.textContent;
  iframe.loading = "lazy";
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  videoFrame.append(iframe);

  if (typeof videoDialog.showModal === "function") {
    videoDialog.showModal();
  } else {
    videoDialog.setAttribute("open", "");
  }
}

function closeVideo() {
  if (!videoDialog) return;

  if (typeof videoDialog.close === "function" && videoDialog.open) {
    videoDialog.close();
  } else {
    videoDialog.removeAttribute("open");
    if (videoFrame) videoFrame.replaceChildren();
    if (lastVideoTrigger) lastVideoTrigger.focus();
  }
}

videoTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => openVideo(trigger));
});

if (dialogClose) {
  dialogClose.addEventListener("click", closeVideo);
}

if (videoDialog) {
  videoDialog.addEventListener("click", (event) => {
    if (event.target === videoDialog) closeVideo();
  });

  videoDialog.addEventListener("close", () => {
    if (videoFrame) videoFrame.replaceChildren();
    if (lastVideoTrigger) lastVideoTrigger.focus();
    lastVideoTrigger = null;
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeNav();
  if (videoDialog && videoDialog.hasAttribute("open") && typeof videoDialog.close !== "function") closeVideo();
});
