const openPanel = () => {
    let panel = document.querySelector('.panel');
    if (panel.classList.contains('active')) {
      panel.classList.remove('active');
    } else {
      panel.classList.add('active');
    }
  };
  