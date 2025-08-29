export function showAlert(msg, type='danger') {
  const area = document.getElementById("alert-area");
  area.innerHTML = `<div class="alert alert-${type}" role="alert">${msg}</div>`;
  setTimeout(() => area.innerHTML = "", 4000);
}