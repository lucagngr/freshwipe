document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.dropdown').forEach(drop => {
    drop.addEventListener('click', function (e) {
      e.stopPropagation();
      drop.classList.toggle('open');
      document.querySelectorAll('.dropdown').forEach(other => {
        if (other !== drop) other.classList.remove('open');
      });
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown').forEach(drop => drop.classList.remove('open'));
  });
});
