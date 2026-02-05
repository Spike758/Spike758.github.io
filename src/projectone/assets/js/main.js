let burgerInfo = document.getElementById('burger-info');
let shadow = document.getElementById('shadowBack');
let btnBurger = document.getElementById('closeBurger');
document.addEventListener("DOMContentLoaded", function() {
  animateElementOnScroll();
  warningMessage.classList.remove('active')
});
const menu = () => {
    burgerInfo.classList.add('active');
    burgerInfo.classList.add('show');
    shadow.classList.add('active');
  }
  
  const closeMenu = () => {
    burgerInfo.classList.remove('active');
    shadow.classList.remove('active');
  }
  function animateElementOnScroll() {
    let mainH2 = document.getElementById("mainH2");
    let mainH1 = document.getElementById("mainH1");
    let servH1 = document.getElementById("servH1");
    let aboutH2 = document.getElementById("aboutH2");
    let bigElements = document.querySelectorAll("#big");
    let circle = document.querySelectorAll(".circle");
  
    function checkVisibility() {
      let mainH2Position = mainH2.getBoundingClientRect();
      let mainH1Position = mainH1.getBoundingClientRect();
      let servH1Position = servH1.getBoundingClientRect();
      let aboutH2Position = aboutH2.getBoundingClientRect();
      let windowHeight = window.innerHeight;
  
      
      if (mainH2Position.top < windowHeight && mainH2Position.bottom >= 0) {
        setTimeout(function() {
          mainH2.style.left = "0";
          mainH2.style.opacity = "1";
        }, 100); 
      }
  
      
      if (mainH1Position.top < windowHeight && mainH1Position.bottom >= 0) {
        setTimeout(function() {
          mainH1.style.left = "0";
          mainH1.style.opacity = "1";
        }, 100); 
      }
  
     
      if (servH1Position.top < windowHeight && servH1Position.bottom >= 0) {
        setTimeout(function() {
          animateServH1();
        }, 100); 
      }
  
      
      if (aboutH2Position.top < windowHeight && aboutH2Position.bottom >= 0) {
        setTimeout(function() {
          animateAbout();
        }, 100); 
      }
  
      bigElements.forEach(function(element) {
        let position = element.getBoundingClientRect();
  
       
        if (position.top < windowHeight && position.bottom >= 0) {
          setTimeout(function() {
            element.classList.add("bounceIn");
          }, 100); 
        }
      });
  
      circle.forEach(function(element) {
        let position = element.getBoundingClientRect();
  
       
        if (position.top < windowHeight && position.bottom >= 0) {
          setTimeout(function() {
            element.classList.add("circle-animation");
          }, 100); 
        }
      });
    }
  
   
    window.addEventListener("load", checkVisibility);
  
 
    window.addEventListener("scroll", checkVisibility);
  }
  
  
  function animateServH1() {
    let servH1 = document.getElementById("servH1");
    let title = document.getElementById("title");
    
    servH1.style.left = "0";
    servH1.style.opacity = "1";
    title.style.left = "0";
    title.style.opacity = "1";
  }
  

  function animateAbout() {
    let aboutH2 = document.getElementById("aboutH2");
    let descFirst = document.getElementById("descFirst");
    aboutH2.style.left = "0";
    aboutH2.style.opacity = "1";
    descFirst.style.left = "0";
    descFirst.style.opacity = "1";
  }
  

  const sendRequest = () => {
    let modalWindow = document.getElementById('modal');
    let phoneModal = document.getElementById('modalTel');
    let inputName = document.getElementById('nameMask');
    let warningMessage = document.getElementById('warningMessage');
  
    if (phoneModal.value.length === 16 && inputName.value.length > 1) {

      modalWindow.innerHTML = `
        <input type="button" value="X" class="btn" id="modal-btn-close" onclick="modalClose()">
        <h4>Спасибо!</h4>
        <p>Ваша заявка отправлена!</p>
      `;
      modalWindow.style = 'width: 200px; height: 130px; text-align:center;';
      let modalCloseButton = document.getElementById('modal-btn-close');
      modalCloseButton.style = 'bottom: 91%; left: 91%;';
    } else {

      warningMessage.style.display = 'block';
      warningMessage.textContent = 'Пожалуйста, введите все необходимые данные.';
    }
  }
  
  const modalOpen = () => {
    let modalWindow = document.getElementById('modal');
    let warningMessage = document.getElementById('warningMessage');
    modalUpdate();
    modalWindow.innerHTML += `
      <input type="button" value="X" class="btn" id="modal-btn-close" onclick="modalClose()">
      <h4>Остались вопросы?</h4>
      <p>Получите консультацию по телефону или напишите нам</p>
      <input type="text" placeholder="Ваше имя" id="nameMask" onkeypress="noDigits(event)" required">
      <input type="tel" name="" placeholder="Телефон" class="phoneMask" id="modalTel" required>
      <button id="btnCloseAdaptive" class="btn" onclick="sendMail()" >Отправить</button>
      <p id="warningMessage" style="display: none; color: red;"></p>
    `;
    modalWindow.style = 'max-width: 350px; min-width: 230px; height: 400px;';
    modalWindow.classList.add('active');
    shadow.classList.add('active');
    const phoneModal = document.getElementById('modalTel');
    const mask = new IMask(phoneModal, {
      mask: "+{7}(000)000-00-00"
    });
  };
  
  const modalClose = () => {
    let modalWindow = document.getElementById('modal');
    let warningMessage = document.getElementById('warningMessage');
  
    modalWindow.classList.remove('active');
    shadow.classList.remove('active');
    warningMessage.style = 'display: none';
  };
const phoneInput = document.querySelector(".phoneMask")
  const mask = new IMask(phoneInput, {
    mask: "+{7}(000)000-00-00"
  })
  
  const footerRequest = () => {
    let f1 = document.querySelector('.send_request input[type=text]');
    let f2 = document.querySelector('.send_request input[type=tel]');

    var params = {
      name: f1.value,
      email: f2.value,
    };
  
    const serviceID = "service_n3fvhtp";
    const templateID = "template_0xs5578";
    let modalWindow = document.getElementById('modal');
    let warningMessage = document.getElementById('warningMessage1');
    if (f2.value.length === 16 && f1.value.length > 1) {
    modalWindow.classList.add('active');
    emailjs.send(serviceID, templateID, params)
    .then(res=>{
        document.getElementById("nameMask").value = "";
        document.getElementById("modalTel").value = "";
        console.log(res);
    })
    modalWindow.innerHTML = `
        <input type="button" value="X" class="btn" id="modal-btn-close" onclick="modalClose()">
        <h4>Спасибо!</h4>
        <p>Ваша заявка отправлена!</p>
    `;
    let modalCloseButton = document.getElementById('modal-btn-close');
    modalCloseButton.style = 'bottom: 91%; left: 91%;';
    modalWindow.style = 'width: 200px; height: 130px; text-align:center;';

    shadow.classList.add('active'); 
    f2.value = ''
    f1.value = ''
    warningMessage.classList.remove('active')
    } 
    else {
      warningMessage.classList.add('active')
    }
}


  
  
  



function noDigits(event) {
  if ("1234567890".indexOf(event.key) != -1)
    event.preventDefault();
}
const modalUpdate = () => {
  let modalWindow = document.getElementById('modal');
  modalWindow.innerHTML = '';

}
function sendMail() {
  var params = {
    name: document.getElementById("nameMask").value,
    email: document.getElementById("modalTel").value,
  };

  const serviceID = "service_n3fvhtp";
  const templateID = "template_0xs5578";

  let modalWindow = document.getElementById('modal');
  let phoneModal = document.getElementById('modalTel');
  let inputName = document.getElementById('nameMask');
  let warningMessage = document.getElementById('warningMessage');

  if (phoneModal.value.length === 16 && inputName.value.length > 1) {
    emailjs.send(serviceID, templateID, params)
    .then(res=>{
        document.getElementById("nameMask").value = "";
        document.getElementById("modalTel").value = "";
        console.log(res);
    })
    .catch(err=>console.log(err));
    modalWindow.innerHTML = `
      <input type="button" value="X" class="btn" id="modal-btn-close" onclick="modalClose()">
      <h4>Спасибо!</h4>
      <p>Ваша заявка отправлена!</p>
    `;
    modalWindow.style = 'width: 200px; height: 130px; text-align:center;';
    let modalCloseButton = document.getElementById('modal-btn-close');
    modalCloseButton.style = 'bottom: 91%; left: 91%;';
  } else {
    // Отображение предупреждающего сообщения
    warningMessage.style.display = 'block';
    warningMessage.textContent = 'Пожалуйста, введите все необходимые данные.';
  }
    

}
