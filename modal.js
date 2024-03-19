function modal() {
  const modal = document.getElementById('modal')
  if (modal.style.display === 'block') {
    modal.style.display = 'none'
  } else {
    modal.style.display = 'block'
  }
}

window.onclick = function (event) {
  const modal = document.getElementById('modal')
  if (event.target == modal) {
    modal.style.display = 'none'
  }
}
