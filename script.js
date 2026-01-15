document.querySelectorAll("details").forEach(d => {
  d.addEventListener("toggle", () => {
    if (d.open) {
      console.log("Opened:", d.querySelector("summary").innerText);
    }
  });
});
