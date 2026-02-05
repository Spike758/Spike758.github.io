let modalProducts = document.getElementById("modalFormProducts");
let shadow = document.getElementById("shadowBack");
let delete_button = document.getElementById("table_delete");
let edit = document.getElementById('table_edit_products');
const modalClose = () => {
    modalProducts.classList.remove("active");
    shadow.classList.remove("active");
    delete_button.classList.remove("active");
    edit.classList.remove('active')
  };
  
  const modalUpdate = () => {
    modalProducts.innerHTML = "";
  };

const products_modalOpen = () =>{
    modalUpdate();
    modalProducts.innerHTML = `
      <div class="top">
                <h3>Добавить товар</h3>
                
                <input type="text" id="tariff_title" placeholder="Название продукта" />
                <input type="text" id="tariff_price" oninput="validateInput(this)" placeholder="Цена " />
              </div>
              <div class="bot">
                <input type="button" value="Отменить" class="btn dark" onclick="modalClose()" />
                <input type="button" value="Добавить" class="btn main" onclick="products_addTariff()" />
              </div>
      `;
    
    modalProducts.classList.add("active");
    shadow.classList.add("active");
  }

  function validateInput(input) {
    input.value = input.value.replace(/\D/g, "");
  }
  const products_addTariff = () => {
    let products_title = document.getElementById("tariff_title").value;
    let products_price = document.getElementById("tariff_price").value;
    if (products_title && products_price) {
      let table = document.querySelector(".table-container");
      
      let table_tariff = [
        {
          title: products_title,
          price: products_price
        },
      ];
      table_tariff.forEach((item) => {
        let new_row = `
          <div class="row">
            <div class="col name"><h3>${item.title}</h3></div>
            <div class="col price"><h3>${item.price}₸</h3></div>
            <div class="col bd-r action">
              <div class="square pen" onclick="openEdit(this)">
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2038 7.79595L15.9998 5.99994C16.545 5.45469 16.8176 5.18207 16.9634 4.88797C17.2407 4.32842 17.2407 3.67146 16.9634 3.11191C16.8176 2.81782 16.545 2.54519 15.9998 1.99994C15.4545 1.45469 15.1819 1.18207 14.8878 1.03633C14.3282 0.759048 13.6713 0.759048 13.1117 1.03633C12.8176 1.18207 12.545 1.45469 11.9998 1.99994L10.1811 3.8186C11.145 5.4692 12.5311 6.84476 14.2038 7.79595ZM8.72666 5.27305L1.85615 12.1436C1.43109 12.5686 1.21856 12.7812 1.07883 13.0422C0.939091 13.3033 0.880146 13.5981 0.762256 14.1875L0.14686 17.2645C0.0803376 17.5971 0.0470765 17.7634 0.141684 17.858C0.236293 17.9526 0.402598 17.9194 0.735208 17.8529L3.81219 17.2375C4.40164 17.1196 4.69637 17.0606 4.95746 16.9209C5.21856 16.7812 5.43109 16.5686 5.85615 16.1436L12.7456 9.25416C11.1239 8.23851 9.7522 6.87622 8.72666 5.27305Z" />
                </svg>
              </div>
              <div class="square trash" onclick="tableDelete(this)">
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M21 6H3V9C4.10457 9 5 9.89543 5 11V15C5 17.8284 5 19.2426 5.87868 20.1213C6.75736 21 8.17157 21 11 21H13C15.8284 21 17.2426 21 18.1213 20.1213C19 19.2426 19 17.8284 19 15V11C19 9.89543 19.8954 9 21 9V6ZM10.5 11C10.5 10.4477 10.0523 10 9.5 10C8.94772 10 8.5 10.4477 8.5 11V16C8.5 16.5523 8.94772 17 9.5 17C10.0523 17 10.5 16.5523 10.5 16V11ZM15.5 11C15.5 10.4477 15.0523 10 14.5 10C13.9477 10 13.5 10.4477 13.5 11V16C13.5 16.5523 13.9477 17 14.5 17C15.0523 17 15.5 16.5523 15.5 16V11Z" />
                  <path d="M10.0681 3.37059C10.1821 3.26427 10.4332 3.17033 10.7825 3.10332C11.1318 3.03632 11.5597 3 12 3C12.4403 3 12.8682 3.03632 13.2175 3.10332C13.5668 3.17033 13.8179 3.26427 13.9319 3.37059" stroke-width="2" stroke-linecap="round" />
                </svg>
              </div>
            </div>
          </div>
        `;
        
        table.innerHTML += new_row;
      });
  
      modalProducts.classList.remove("active");
      shadow.classList.remove("active");
    }
    }
    let tempDelete;

    const tableDelete = (element) => {
      tempDelete = element.parentNode.parentNode;
      let col_name =
        element.parentNode.parentNode.querySelector(".col.name h3").innerHTML;
      delete_button.innerHTML = `
        <div class="top">
          <h3>Удалить товар "${col_name}"?</h3>
        </div>
        <div class="bot">
          <input type="button" value="Закрыть" class="btn dark" onclick="modalClose()" />
          <input type="button" value="Удалить" class="btn main" onclick="deleteRow(this)" />
        </div>
      `;
    
      delete_button.classList.add("active");
      shadow.classList.add("active");
    };
    const deleteRow = (e) => {
      tempDelete.remove();
      modalClose();
    };

    let current_row;


const openEdit = (element) => {
  current_row = element.parentNode.parentNode;
  let col_name =
    element.parentNode.parentNode.querySelector(".col.name h3").innerHTML;
    let col_price = 
    element.parentNode.parentNode.querySelector('.col.price h3').innerHTML;
  modalUpdate();
  edit.innerHTML = `
        <div class="top">
        <h3>Изменить товар</h3>
        <textarea id="tariff_title">${col_name}</textarea>
        <input type="text" id="tariff_price" oninput="validateInput(this)" value="${col_price}" />
        </div>
        <div class="bot">
        <input type="button" value="Закрыть" class="btn dark" onclick="modalClose()" />
        <input type="button" value="Изменить" class="btn main" onclick="editRow()" />
        </div>
        `;
  edit.classList.add('active')
  shadow.classList.add('active')
}

const editRow = () => {
  let tariff_title = document.getElementById("tariff_title").value;
  let tariff_price = document.getElementById('tariff_price').value;
  

  let edit_tariff = [{
    title: tariff_title,
    price: tariff_price,
  }]
  let table = document.querySelector(".table-container");

  edit_tariff.forEach((item) => {
    let edit_row = `
        <div class="col name"><h3>${item.title}</h3></div>
        <div class="col price"><h3>${item.price}₸</h3></div>
        <div class="col bd-r action">
          <div class="square pen" onclick="openEdit(this)">
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2038 7.79595L15.9998 5.99994C16.545 5.45469 16.8176 5.18207 16.9634 4.88797C17.2407 4.32842 17.2407 3.67146 16.9634 3.11191C16.8176 2.81782 16.545 2.54519 15.9998 1.99994C15.4545 1.45469 15.1819 1.18207 14.8878 1.03633C14.3282 0.759048 13.6713 0.759048 13.1117 1.03633C12.8176 1.18207 12.545 1.45469 11.9998 1.99994L10.1811 3.8186C11.145 5.4692 12.5311 6.84476 14.2038 7.79595ZM8.72666 5.27305L1.85615 12.1436C1.43109 12.5686 1.21856 12.7812 1.07883 13.0422C0.939091 13.3033 0.880146 13.5981 0.762256 14.1875L0.14686 17.2645C0.0803376 17.5971 0.0470765 17.7634 0.141684 17.858C0.236293 17.9526 0.402598 17.9194 0.735208 17.8529L3.81219 17.2375C4.40164 17.1196 4.69637 17.0606 4.95746 16.9209C5.21856 16.7812 5.43109 16.5686 5.85615 16.1436L12.7456 9.25416C11.1239 8.23851 9.7522 6.87622 8.72666 5.27305Z" />
            </svg>
          </div>
          <div class="square trash" onclick="tableDelete(this)">
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M21 6H3V9C4.10457 9 5 9.89543 5 11V15C5 17.8284 5 19.2426 5.87868 20.1213C6.75736 21 8.17157 21 11 21H13C15.8284 21 17.2426 21 18.1213 20.1213C19 19.2426 19 17.8284 19 15V11C19 9.89543 19.8954 9 21 9V6ZM10.5 11C10.5 10.4477 10.0523 10 9.5 10C8.94772 10 8.5 10.4477 8.5 11V16C8.5 16.5523 8.94772 17 9.5 17C10.0523 17 10.5 16.5523 10.5 16V11ZM15.5 11C15.5 10.4477 15.0523 10 14.5 10C13.9477 10 13.5 10.4477 13.5 11V16C13.5 16.5523 13.9477 17 14.5 17C15.0523 17 15.5 16.5523 15.5 16V11Z" />
              <path d="M10.0681 3.37059C10.1821 3.26427 10.4332 3.17033 10.7825 3.10332C11.1318 3.03632 11.5597 3 12 3C12.4403 3 12.8682 3.03632 13.2175 3.10332C13.5668 3.17033 13.8179 3.26427 13.9319 3.37059" stroke-width="2" stroke-linecap="round" />
            </svg>
          </div>
        </div>
     
    `;

    current_row.innerHTML = edit_row;
  });

  edit.classList.remove('active')
  shadow.classList.remove('active')
}


function searchTable() {
    // Получите значение введенное в input для поиска
    var input = document.getElementById('find');
    var filter = input.value.toUpperCase();
    // Получите таблицу и строки в таблице
    var table = document.getElementsByClassName('table-container')[0];
    var rows = table.getElementsByClassName('row');
    // Пройдитесь по каждой строке таблицы и скройте те, которые не соответствуют введенному тексту
    for (var i = 0; i < rows.length; i++) {
      var name = rows[i].getElementsByClassName('col name')[0];
      if (name) {
        var txtValue = name.textContent || name.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          rows[i].style.display = '';
        } else {
          rows[i].style.display = 'none';
        }
      }
    }
  }
  
  // const openPanel = () => {
  //   let panel = document.querySelector('.panel')
  //   if(panel.classList.contains('active')) {
  //     panel.classList.remove('active')
  //   } else {
  //     panel.classList.add('active')
  //   }
  // }