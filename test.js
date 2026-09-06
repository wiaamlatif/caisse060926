

var currentTable = null;

var table_name = ['',//0
                 'users',//1
                 'categories',//2
                 'tickets',//3
                 'lignes_ticket',//4
                 'products'
                ];//5

var idFirstTrProduct = null;

//var currentTable = 'users';
var currentSelected = {
            users: null,
          tickets: null,
    lignes_ticket: null,
       categories: null,
         products: null
};

var mode = {
       connected: null,
    consultation: null,
            edit: null,
           vente: null,
          etat_x: null,
          etat_z: null,
     radioButton: null,
   scrollTickets: null      
};

var             currentTicketId = null;
var              productToAddId = null;
var             newProductAdeed = null; 


function  initKeyboardNavigation(){
    
    document.addEventListener('keydown', (event) => {

        if (event.target && ['INPUT','TEXTAREA','SELECT'].includes(event.target.tagName)) {
        return; }

        console.log("event  : "+event.key);

        switch (event.key) { 

            case 'Home'://idTable4 "lignes_ticket"
              event.preventDefault();              
              window.location = "http://localhost:8000/createTicket.php";              

              mode['scrollTickets'] = true;
              mode['vente'] = false;

              displayTicket(currentTicketId);            

              console.log('Home'+' >> :'+currentTable);              
            break;

            case 'Insert':  
              event.preventDefault();
              window.location = "http://localhost:8000/changeTicket.php";
              currentTable = table_name[5]; 
              displayTicket(currentTicketId);
              document.querySelector('#trHeadTicket').classList.remove('bg-danger');                               
              console.log('Insert'+' >> '+currentTable);
            break;            

            case 'Delete':  
                event.preventDefault();
                if(currentTable == table_name[4] && findSelectedLineTicketId() !== null && currentTicketId !== null ){  
                deleteItemTicket(currentTicketId,findSelectedLineTicketId())
                } else {
                  console.log('No item selected to delete');
                  document.querySelector('#captionLineTicket').classList.textContent = 'Selectionner le ticket et la ligne à supprimer';
                  document.getElementById('captionLineTicket').innerHTML = `<div class="text text-center fs-6 fw-bold">
                  <span class="text-bg-danger fs-6 rounded-pill nowrap px-3 py-2">Selectionner le ticket et la ligne à supprimer</span>
                 </div>`;
                } 

            break;                              

            case 'End':  
                event.preventDefault(); 
                if(currentTable == table_name[4] && currentTicketId !== null && findSelectedLineTicketId() !== null){
                deleteLinesTicket(currentTicketId)                    
                } else {
                  console.log('No ticket selected to delete all lines');
                } 
            break;                  

            case 'Escape':
                event.preventDefault();
                venteProducts() 
            break;

            case 'PageUp':          
                event.preventDefault();
                currentTable = table_name[4];
                moveSelection(-1);
            break;

            case 'PageDown':
                event.preventDefault();
                currentTable = table_name[4];
                moveSelection(1);
            break;  
            
            case 'ArrowUp':
                event.preventDefault();
                if(currentTable == table_name[3]) {
                  moveTicketsSelection(-1);
                } else if(currentTable == table_name[4]) {  
                  moveSelection(-1);
                } else if(currentTable == table_name[5]) {
                  moveProductSelection(-4);
                } 
               
            break;

            case 'ArrowDown':      
                event.preventDefault();
                if(currentTable == table_name[3]) {
                  moveTicketsSelection(1);
                } else if(currentTable == table_name[4]) {                                 
                  moveSelection(1);
                } else if(currentTable == table_name[5]) {
                  moveProductSelection(4);
                }   
            
            break;

            case 'ArrowRight':
              event.preventDefault();

              if(currentTable == table_name[4]) {

                    getQuantity(currentTicketId,findSelectedLineTicketId(),1)                         
          
              } else if(currentTable == table_name[5]) {
                moveProductSelection(1);
              } 

            break;             

            case 'ArrowLeft':
              event.preventDefault();
               
              if(currentTable == table_name[4]) {

                console.log('RowTicketId :',findSelectedLineTicketId());
                getQuantity(currentTicketId,findSelectedLineTicketId(),0)                         

              } else if(currentTable == table_name[5]) {
                 moveProductSelection(-1);
              } 

            break;
            
            case 'Enter':                  
                event.preventDefault();//idTable5                             
                switch (currentTable) { 

                  case table_name[3]:
                    event.preventDefault();
                    const tbodyTicketsEl = document.getElementById("tbodyTickets");
                    const classesTickets = Array.from(tbodyTicketsEl.querySelectorAll('tr'))
                    const indexGreenTickets = classesTickets.findIndex(element => element.classList.contains("bg-success")); 
                    const RowTickets = document.querySelectorAll('#tbodyTickets tr')[indexGreenTickets];                                  
                    const RowTicketsId = RowTickets.cells[0].textContent;
                    currentSelected[table_name[3]] =Number(RowTicketsId);
                  break;                  


                  case table_name[4]:
                    event.preventDefault();
                    const tbodyTicketEl = document.getElementById("tbodyTicket");
                    const classesTicket = Array.from(tbodyTicketEl.querySelectorAll('tr'))
                    const indexGreenTicket = classesTicket.findIndex(element => element.classList.contains("bg-success")); 
                    const RowTicket = document.querySelectorAll('#tbodyTicket tr')[indexGreenTicket];
             //       const RowTicketId = RowTicket.firstElementChild.textContent;
                    const RowTicketId = RowTicket.cells[0].textContent;
                    currentSelected[table_name[4]] = RowTicketId;                  
                  break;                  

                  //List products
                  case table_name[5]:
                    event.preventDefault();                                        
                    mode['vente'] = true;                     
                    if(mode['vente']){

                    const rows = document.querySelectorAll('#tbodyProducts .product-card');

                    rows.forEach(row => {
                      if(row.classList.contains("bg-success")){
                        productToAddId = row.dataset.idproduct ;  
                        newProductAdeed = true;                     
                      }                      
                    })  
                  
                    
                    ChangeQuantityOrAddProduct(productToAddId,currentTicketId);
                    
                    console.log('productToAddId :',productToAddId);
                    console.log('currentTicketId :',currentTicketId);

                    }//mode['vente']

                  break;

                 }

            break;//Enter      

            case 'F1':
              event.preventDefault();

              mode['vente'] = true;
              currentTable = table_name[4];              
              currentSelected[currentTable] = 3;
              currentTicketId = 3;
              displayTicket(currentTicketId);                           
            
            break;

            case 'F2':
              event.preventDefault();

              mode['consultation'] = true;
              mode['vente'] = true;                        
              currentTable = table_name[5];
              colorFirstRowProduct();                
            break;

            case 'F3':
              event.preventDefault();
              mode['consultation'] = true;
              mode['vente'] = false;                        
              currentTable = table_name[5];
              colorFirstRowProduct();
            break;

            case 'F4':
                event.preventDefault();                

            break;

            case 'F5':
                event.preventDefault();

            break;

            case 'F6':
                event.preventDefault();
                
            break;                
        
        }//switch                

    });//addEventListener()

    // Handle Mouse Pointer
    // Only rows with the green highlight use the pointer cursor on hover.
    document.addEventListener('mouseover', function(event) {
    var row = event.target.closest('tr');
    if (!row || !row.closest('tbody')) return;
    row.style.cursor = row.classList.contains('bg-success') ? 'pointer' : 'default';
    });

    document.addEventListener('mouseout', function(event) {
    var row = event.target.closest('tr');
    if (!row || !row.closest('tbody')) return;
    row.style.cursor = 'default';
    });

} //initKeyboardNigation()

function getTableRows(tableName) {
  switch (tableName) {
    case 'users':
      return document.querySelectorAll('#tbodyUsers tr');
    case 'tickets':
      return document.querySelectorAll('#tbodyTickets tr');
    case 'lignes_ticket':
      return document.querySelectorAll('#tbodyTicket tr');
    case 'categories':
      return document.querySelectorAll('#tbodyCategories tr');
    case 'products':
      return document.querySelectorAll('#tbodyProducts .product-card');
    default:
      return [];
  }
}

function getRowId(row, tableName) {
  if (!row) return null;
  switch (tableName) {
    case 'users':
      return row.dataset.iduser ;
    case 'tickets':
      return row.dataset.idticket;
    case 'lignes_ticket':
      currentSelected['tickets'] = row.dataset.idticket;
      return row.dataset.idligneticket;
    case 'categories':
      return row.dataset.idcategory;
    case 'products':
      return row.dataset.idproduct;
    default:
      return null;
  }
}

function highlightRow(tableName, id) {
  var rows = getTableRows(tableName);
  rows.forEach(function(row) {
    row.classList.remove('bg-success');
  });
  var selector = '';
  switch (tableName) {
    case 'users':
      selector = '#tbodyUsers tr[data-iduser="' + id + '"]';
      break;
    case 'tickets':                
      selector = '#tbodyTickets tr[data-idticket="' + id + '"]';
      break;
    case 'lignes_ticket':
      selector = '#tbodyTicket tr[data-idligneticket="' + id + '"]';
      break;
    case 'categories':
      selector = '#tbodyCategories tr[data-idcategory="' + id + '"]';
      break;
    case 'products':
      selector = '#tbodyProducts .product-card[data-idproduct="' + id + '"]';
      break;
  }
  var row = document.querySelector(selector);
  if (row) {
    row.classList.add('bg-success');
    row.focus();
  }
}

function selectRow(tableName, id, activate) {
  if (activate === undefined) activate = false;
  currentTable = tableName;
  currentSelected[tableName] = id;
  highlightRow(tableName, id);
  switch (tableName) {
    case 'users':
      if (activate) { displayUsers(id); }
      break;
    case 'tickets':
      if (activate) { displayTickets(id); }
      break;
    case 'lignes_ticket':
      if (activate) { displayTicket(id); }
      break;      
    case 'categories':
      if (activate) { displayCategories(id); }
      break;
    case 'products':
      if (activate) { displayProducts(id); }
      break;
    case '':
      break;
  }
}

function moveSelection(direction) {
  var allTrBody = document.querySelectorAll('#tbodyTicket tr');  //getTableRows(currentTable);
  var rows = Array.from(allTrBody);
  if (rows.length === 0) return;
  var currentId = currentSelected[currentTable];
  var index = rows.findIndex(row => String(getRowId(row,currentTable)) === String(currentId));
  if (index === -1) { index = 0; }
  var newIndex = index + direction;
  if (newIndex < 0) newIndex = 0;
  if (newIndex >= rows.length) newIndex = rows.length - 1;
  var newId = getRowId(rows[newIndex], currentTable);
  if (newId != null) {
    selectRow(currentTable, Number(newId), false);
  }
}

function moveTicketsSelection(direction) {
  var allTrBody = document.querySelectorAll('#tbodyTickets tr');  //getTableRows(currentTable);
  var rows = Array.from(allTrBody);
  if (rows.length === 0) return;
  var currentId = currentSelected[currentTable];
  var index = rows.findIndex(row => String(getRowId(row,currentTable)) === String(currentId));
  if (index === -1) { index = 0; }
  var newIndex = index + direction;
  if (newIndex < 0) newIndex = 0;
  if (newIndex >= rows.length) newIndex = rows.length - 1;
  var newId = getRowId(rows[newIndex], currentTable);
  if (newId != null) {
    selectRow(currentTable, Number(newId), false);
  }
}



function moveProductSelection(direction) {
  if (currentTable !== table_name[5]) {
    moveSelection(direction);
    return;
  }

  var cards = Array.from(getTableRows('products'));
  if (cards.length === 0) return;

  var currentId = currentSelected.products;
  var index = cards.findIndex(card => String(card.dataset.idproduct) === String(currentId));
  if (index === -1) index = 0;

  var newIndex = Math.max(0, Math.min(cards.length - 1, index + direction));
  selectRow('products', Number(cards[newIndex].dataset.idproduct), false);
}

//=========================(Init Light Row displayTickets)================================
function colorFirstRowTickets(){
  if(document.querySelector("#tbodyTickets tr")){

    var rows = document.querySelectorAll('#tbodyTickets tr');
    rows.forEach(row => {row.classList.remove('bg-success')});

    var firstRowId = document.querySelector("#tbodyTickets tr").dataset.idticket;
    var selector = '#trTicket'+String(firstRowId);
    document.querySelector(selector).classList.add('bg-success');   
    currentSelected[table_name[3]]=firstRowId;
    currentTicketId = firstRowId;
  }  
}

function colorFirstRowTicket(){
  if(document.querySelector("#tbodyTicket tr")){

    var rows = document.querySelectorAll('#tbodyTicket tr');
    rows.forEach(row => {row.classList.remove('bg-success')});

    var firstRowId = document.querySelector("#tbodyTicket tr").dataset.idligneticket;
    var selector = '#trDetailTicket'+String(firstRowId);
    document.querySelector(selector).classList.add('bg-success');
    currentSelected[table_name[4]]=firstRowId;  
  }  
}

function colorFirstRowProduct(){

  if(document.querySelector("#tbodyProducts .product-card")){

    var rows = document.querySelectorAll('#tbodyProducts .product-card');
    rows.forEach(row => {row.classList.remove('bg-success')});

    var firstRowId = document.querySelector("#tbodyProducts .product-card").dataset.idproduct;
    var selector = '#productCard'+String(firstRowId);
    document.querySelector(selector).classList.add('bg-success');
    currentSelected[table_name[5]]=firstRowId;   
  }  
}

function displayProducts(){
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'loadDataProducts.php', true);

  xhr.onload = function(){
    if(xhr.status !== 200) return;

    var data = JSON.parse(xhr.responseText);
    var table = document.getElementById('idTable5');
    if(!table) return;

    var html = '<caption class="products-caption">All products</caption>';
    html += '<tbody id="tbodyProducts" class="products-grid">';
    var productIndex = 0;
    var currentCategory = null;
    var cardsInRow = 0;

   // console.log('data products :',data)

    data.forEach( product => {
      if(product.name_category !== currentCategory){
        if(cardsInRow){ html += '</tr>'; cardsInRow = 0; }
        currentCategory = product.name_category;
        html += '<tr class="category-row"><th colspan="4">' + currentCategory + '</th></tr>';
      }

      if(cardsInRow === 0){
        html += '<tr id="rowsingleproduct" class="product-row">';
      }

      productIndex += 1;

      

      var image = product.imgSrc || 'default_product.png';
      var selected = productIndex === 1 ? ' bg-success' : '';
      html += '<td id="productCard' + product.id_product + '" class="product-card' + selected + '"' +
        ' data-idproduct="' + product.id_product + '" tabindex="0" onclick="selectRow(\'products\', ' + product.id_product + ')">' +
        '<div class="product-card-content">' +  

        '<div class="d-flex flex-column justify-content-center align-items-center gap-0 mt-0">'+
        '<img src="/uploads/products/' + image + '" alt="' + product.name_product + '">' +
        '<h5 class="card-title text-nowrap"><span class="text fw-bold px-3">' + product.name_product + '</span></h5>' +
        '<h4 class="card-text"><span class="product-price badge text-bg-dark rounded-pill fs-5">' + product.price + '</span></h4>' +

        '<h4 class="card-text rounded-pill w-100"><span id="idSpanIndexProduct" class="product-index text fw-bold fs-5"></span></h4>' +        

        '</div>' +               
        '</div></td>';
      cardsInRow += 1;
      if(cardsInRow === 4){
        html += '</tr>';
        cardsInRow = 0;
      }
    });

    if(cardsInRow){ html += '</tr>'; }
    html += '</tbody>';
    table.innerHTML = html;
    colorFirstRowProduct();

   // testfunction();        

  };//onload

  xhr.send();
}//displayProducts

function colortRowTicket(idProduct){

  const rows = document.querySelectorAll("#tbodyTicket tr");

  // console.log("rows Edited ticket:",rows);

  if(rows){

    rows.forEach(row => {row.classList.remove('bg-success')});
    rows.forEach( row => {

      if(row.dataset.idproduct === String(idProduct) ){

        row.classList.add('bg-success')
      }

    });

      
  }  

}//colortRowTicket

// 'tickets',[3]
//
function displayTickets(idUser){

  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/loadDataTickets.php?idUser='+idUser,true);

  xhr.onload = function() {

    //==================( table-3)========================//     
    if(xhr.status==200){

      document.getElementById('divTab3').classList.add("border");
      document.getElementById('divTab3').classList.add("border-secondary");
      
      var  data =  JSON.parse(this.response);

//      // console.log(data);

       //Caption List tickets
      var nameUser = "List tickets "+data[0].first_name;

      htmlTable3 = ` <caption class="fw-bold fs-6 mx-1">
                        <div class="text text-center fs-6 fw-bold">                                         
                         <span class="text-bg-primary fs-6 rounded-pill nowrap px-3 py-2">`+nameUser+`</span>
                        </div>               
                      </caption> 
                      <thead id="theadTickets">
                      </thead>
                      <tbody id="tbodyTickets">
                      </tbody>
                      <tfoot id="tfootTickets">
                      </tfoot>                        
                    `;
      document.getElementById("idTable3").innerHTML = htmlTable3;
                 
      //===========( Heads Tickets table)========================//
                          
      var htmlTheadTickets =`
                              <tr class="border border-danger border-1 fw-bold fs-5 w-100">
                                      <th scope="col" class="col-6 text text-center border border-dark border-1">IdTk</th>                
                                      <th scope="col" class="col-12 text text-center border border-dark border-1">NrTk</th>
                                      <th scope="col" class="col-6 text text-center border border-dark border-1">Total</th>
                                      <th scope="col" class="col-6 text text-center border border-dark border-1">Action</th>
                              </tr>
                            `;

      document.getElementById('theadTickets').innerHTML= htmlTheadTickets ;


      //===========(show Detail Ticket table)========================
      
      //calculate total tickets
      var somTickets = 0; 

      document.getElementById('tbodyTickets').innerHTML=""; 

      data.forEach(element => { 
     
        var       idTicket = element.id_ticket  ;
                  currentSelected[table_name[3]] = idTicket;

        var       nrTicket = element.nr_ticket ;
        var    totalTicket = element.total_ticket;        
        
          var htmlTbodyTickets =  `
                                    <tr id="trTicket`+idTicket+`" class="border border-dark border-1 w-100"
                                        data-idticket="`+idTicket+`" tabindex="0">

                                      <td class="text text-center border border-dark fw-bold">`+idTicket+`</th>
                                      <td class="text text-center border border-dark fw-bold">`+nrTicket+`</th>
                                      <td class="text text-center border border-dark fw-bold">`+totalTicket+`</td>
                                      <td class="text text-center border border-dark fw-bold">
                                          <button class="btn btn-success btn-sm me-1"
                                            onclick="">
                                            <i class="fa-solid fa-pencil"></i>
                                          </button>
                                      </td>
                                        
                                    </tr>                      
                                  `;

        document.getElementById('tbodyTickets').innerHTML+=htmlTbodyTickets;
        somTickets += parseInt(totalTicket);

      });//forEach  
      
      dataFoot = `
              <tr>
                  <td class="text text-center border border-dark">
                    <span class="badge text-bg-dark fw-bold fs-6"></span>
                  </td>

                  <td class="text text-center border border-dark">
                    <span class="badge text-bg-dark fw-bold fs-6">Total</span>
                  </td>

                  <td class="text text-center border border-dark">
                    <span class="text text-center text-dark fw-bold fs-6">`+somTickets.toFixed(2)+`</span>
                  </td>        
                  
                  <td class="text text-center border border-dark fw-bold">
                      <button class="btn btn-success btn-sm me-1"
                        onclick="ajouterTicket()">
                        <i class="fa-solid fa-plus"></i>
                      </button>
                  </td>                  

              </tr>      
             `;

      var tfootTicketsEl = document.getElementById('tfootTickets') ;

      if(tfootTicketsEl != null){
        tfootTicketsEl.innerHTML=dataFoot; 
      }

      
      colorFirstRowTickets();
      

    }//status==200
  
  }//xhr.onload 

  xhr.send();

}//displayTickets  

function deleteLinesTicket(idTicket){

  var xhr = new XMLHttpRequest();
  
  xhr.open('GET','http://localhost:8000/deleteLinesTicket.php?idTicket='+idTicket,true);

  xhr.onload = function() {

    if(xhr.status==200){

//      var  data =  JSON.parse(this.response);
      
    displayTicket(idTicket);
    displayTfootTicket(idTicket,0)

    }//status==200
  
  }//xhr.onload 

  xhr.send();

} //deleteLinesTicket


function deleteItemTicket(idTicket,idLigneTicket){

  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/deleteItemTicket.php?idTicket='+idTicket+'&idLigneTicket='+idLigneTicket,true);

  xhr.onload = function() {

    if(xhr.status==200){

      var  data =  JSON.parse(this.response);

     //console.log(data);

      displayTicket(idTicket);
      displayTfootTicket(idTicket,0);

    }//status==200
  
  }//xhr.onload 

  xhr.send();

}//deleteItemTicket

function findSelectedLineTicketId(){

                    const tbodyTicketEl = document.getElementById("tbodyTicket");
                    const classesTicket = Array.from(tbodyTicketEl.querySelectorAll('tr'))
                    const indexGreenTicket = classesTicket.findIndex(element => element.classList.contains("bg-success")); 
                    const RowTicket = document.querySelectorAll('#tbodyTicket tr')[indexGreenTicket];          
                    const RowTicketId = RowTicket.dataset.idligneticket; 
                    return RowTicketId;
}

function getQuantity(idTicket,idLigneTicket,plusMinus){

  var xhr = new XMLHttpRequest();
    
  xhr.open('GET','http://localhost:8000/getQuantity.php?idTicket='+idTicket+'&idLigneTicket='+idLigneTicket+'&plusMinus='+plusMinus,true);

  xhr.onload = function() {

   if(xhr.status==200){

     var  data =  JSON.parse(this.response); 

     console.log('data getQuantity :',data);

     document.querySelector('#quantity'+idLigneTicket).textContent = data.quantity;

     var totalItem = data.quantity * data.price;

     document.querySelector('#spanTotalItem'+idLigneTicket).textContent = totalItem.toFixed(2);

    if(data.total_ticket !== undefined){
     document.querySelector('#spanTotalTicket').textContent = (data.total_ticket*1).toFixed(2);
    }

     
   }//status==200 
    
  }//xhr.onload 

  xhr.send();
   
}//getQuantity 


function displayTheadTicket(){

      var divTab4El = document.getElementById("divTab4");         
      if(divTab4El != null){      
        divTab4El.classList.add("border");
        divTab4El.classList.add("border-secondary");
      } 

      var htmlTable4 = ` <caption class="fs-6 fw-bold mx-1" id="captionLineTicket">
                            <div class="text text-center fs-6 fw-bold">                     
                              <span>Ticket Nr:
                                <span class="badge text-bg-dark fw-bold fs-6" id="spanNrTicket"></span>
                              </span>                           
                            </div>               
                          </caption>   
                          <thead id="theadTicket">
                          </thead>  
                          <tbody id="tbodyTicket">
                          </tbody>
                          <tfoot id="tfootTicket">
                          </tfoot>      
                        `;

      document.getElementById("idTable4").innerHTML = htmlTable4;      

  //============( theadTicket )================================
      var htmlTheadTicket = `
                              <tr id="trHeadTicket" class="border border-danger border-1 w-100"> <!-- table row--->
                                <th class="col-3 text text-center border border-dark border-1">Id</th>         
                                <th class="col-3 text text-center border border-dark border-1">imgSrc</th>
                                <th class="col-8 text text-center border border-dark border-1">Product</th>          
                                <th class="col-12 text text-center border border-dark border-1">Quantite</th> 
                                <th class="col-10 text text-center border border-dark border-1">Prix</th> 
                                <th class="col-10 text text-center border border-dark border-1">Total</th>                             
                              </tr>                                                  
                              ` ;

      document.getElementById("theadTicket").innerHTML = htmlTheadTicket ;

      
}//displayTheadTicket

function rowSelected(idLigneTicket){

      currentTable = table_name[4];
  
      currentSelected[currentTable] = idLigneTicket;

      const rows = document.querySelectorAll("#tbodyTicket tr");

      if(rows){

        rows.forEach(row => {row.classList.remove('bg-success')});

        var selector = '#tbodyTicket tr[data-idligneticket="' + idLigneTicket + '"]';

        var row = document.querySelector(selector);

        if(row){  row.classList.add('bg-success');
                  row.focus();
                  productToAddId = row.dataset.idproduct;
          }  
          
          console.log("productToAddId >>: " + productToAddId);

      }//rows


}//rowSelected

function displayTbodyTicket(dataBodyTicket){
        
  var idLigneTicket = dataBodyTicket.idLigneTicket
  var      idTicket = dataBodyTicket.idTicket;
  var     idProduct = dataBodyTicket.idProduct                                   
  var        imgSrc = dataBodyTicket.imgSrc  
  var         index = dataBodyTicket.index;
  var   nameProduct = dataBodyTicket.nameProduct;
  var      quantity = dataBodyTicket.quantity;
  var         price = dataBodyTicket.price;

  var     totalItem = quantity * price;
//============================================
//=============================================
  if(imgSrc===""){
    imgSrc = "default_product.png";
  }

  var htmlTbodyTicket = `<tr  id="trDetailTicket`+idLigneTicket+`" class="border border-dark border-1 w-100"
                                data-idindex="`+index+`"
                                data-idligneticket="`+idLigneTicket+`"
                                data-idproduct="`+idProduct+`"
                                data-idticket="`+idTicket+`"    onclick="rowSelected(`+idLigneTicket+`)" tabindex="0"> 

                                <td class=" text text-center border border-dark border-1 fs-6 fw-bold">`+index+`</td>
                                
                                <td class=" text text-center border border-dark border-1">
                                  <img class="img img-fluid imgProduct"  
                                  src="./uploads/products/`+imgSrc+`"  width="50px">                                            
                                </td>

                                <td class=" text text-center text-nowrap border border-dark border-1 fs-6 fw-bold">`+nameProduct+`</td>

                                <td class=" text text-center border border-dark border-1"><!---Quantity------> 
                    
                                  <div class="d-flex">

                                        <!-- Btn Trash   -->
                                        <button id="supItemCart`+idLigneTicket+`" class="supItemCart btn btn-danger btn-sm mx-1"
                                          onclick="deleteItemTicket(`+idTicket+`,`+idLigneTicket+`)">
                                          <i class="fa-solid fa-trash-can"></i>
                                        </button> 

                                        <!-- Btn minus   -->
                                        <button id="decrementQuantity`+idLigneTicket+`" class="decrementQuantity btn btn-primary"
                                          onclick="getQuantity(`+idTicket+`,`+idLigneTicket+`,`+0+`)">
                                          -
                                        </button>

                                        <!-- Quantity   -->
                                        <span id="quantity`+idLigneTicket+`" class="quantity fs-6 fw-bold py-2 my-1 mx-1">`+quantity+`</span>

                                        <!-- Btn plus   -->
                                        <button id="incrementQuantity`+idLigneTicket+`" class="incrementQuantity btn btn-primary"
                                          onclick="getQuantity(`+idTicket+`,`+idLigneTicket+`,`+1+`)">
                                          +
                                        </button> 

                                    </div>
                                </td>

                                <td class="text text-center border border-dark border-1 fs-6 fw-bold">`+price+`</td>

                                <td class=" text text-center border border-dark border-1 fs-6 fw-bold">
                                <span class="text text-bg-dark fs-6 mx-1" id="spanTotalItem`+idLigneTicket+`">
                                `+totalItem.toFixed(2)+`
                                </span>
                                </td>
                      
                           </tr>`; 
                                                           
                document.getElementById('tbodyTicket').innerHTML += htmlTbodyTicket;

}//displayBodyTicket

function displayTfootTicket(idTicket,totalTicket){
    
  var total =(totalTicket*1).toFixed(2);

  var htmlFootTicket =  ` <tr> 
                              <td class="text text-center border border-dark border-1 fs-6 fw-bold" colspan="3">
                                <div class="d-flex justify-content-center">
                                                      <!-- Btn Trash   -->
                                  <button class="btn btn-danger mx-1"
                                    onclick="deleteLinesTicket(`+idTicket+`)">
                                    <i class="fa-solid fa-trash-can"></i>
                                  </button> 
                                                      <!-- Btn Print   -->
                                  <a class="print btn btn-success mx-1" href="http://localhost:8000/print/tablePrintTicket.php?idTicket=`+idTicket+`">
                                    <i class="fa-solid fa-print"></i>
                                  </a>

                                </div>
                              </td>

                              <td class="text text-center border border-dark border-1 fw-bold" colspan="4">
                                <div class="d-flex flex-row justify-content-center fs-6">
                                <span>TTC</span>
                                <span class="badge text-bg-dark fs-4 mx-1" id="spanTotalTicket">`+total+`</span>
                                </div>
                              </td>                            
                            </tr>`;
            
  document.getElementById('tfootTicket').innerHTML=htmlFootTicket;           
        
}

function displayTicket(idTicket){
 
  var xhr = new XMLHttpRequest();

  
  xhr.open('GET','http://localhost:8000/loadDataTicket.php?idTicket='+idTicket,true);

  xhr.onload = function() {

    if(xhr.status==200){
   
      var  data =  JSON.parse(this.response);

      
      // console.log('Data Ticket :',data)
    
      displayTheadTicket();
                                                        
      var spanNrTicketEl = document.getElementById('spanNrTicket');
      if(spanNrTicketEl != null){
        spanNrTicketEl.textContent = data[0].nrTicket;
      } 

      var totalTicket = data[0].totalTicket;

      data = data.slice(1); // Remove the first element which contains ticket info .

      if(data.length > 0){ 

      data.forEach( element => {

        var dataTicket = {
                        idLigneTicket : element.id_ligne_ticket,
                        idTicket      : element.id_ticket,
                        idProduct     : element.id_product,                              
                        imgSrc        : element.imgSrc,
                        index         : element.indexRowTicket,
                        nameProduct   : element.name_product,
                        quantity      : element.quantity,
                        price         : element.price                 
                        }

      displayTbodyTicket(dataTicket); }); //forEach

      colorFirstRowTicket();

      }else{
        document.getElementById('tbodyTicket').innerHTML = "";
      } 

      displayTfootTicket(idTicket,totalTicket);

      if(mode['vente']){
        removeRedProductsInTable5(idTicket)
        RedProductsInTable5(idTicket);
      } else if(mode['scrollTickets']){
        currentTable = table_name[3];  
      }
    
      
    }//status==200 =================( end status function displayTicket)==================================

  }//xhr.onload 

  xhr.send();

}//displayTicket  


//'products',[5]
// 655 tbodyProducts
function displayProduits(idCategory){

  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/loadDataProducts.php?idCategory='+idCategory,true);
  
  xhr.onload = function() {

    if(xhr.status==200){

      document.getElementById('divTab5').classList.add("border");
      document.getElementById('divTab5').classList.add("border-secondary");

      var  data =  JSON.parse(this.response); 
      
 //     // console.log("data Products :",data);

      var nameCategory = data[0].name_category;

      htmlTable5 =  `
                      <caption class="fs-6 fw-bold mx-1" id="captionListProducts">Products :<span>`+nameCategory+`</span></caption>
                      <thead id="theadProducts1">
                      </thead>                
                      <tbody id="tbodyProducts1" class="tbodyProducts1">
                      </tbody>
                      <tfoot id="tfootProducts1">
                      </tfoot>      
                    `;
      document.getElementById("idTable5").innerHTML = htmlTable5;      
 
      //----------(Head Product)----------------

          var headProduct=`
                            <tr class="border border-danger border-1 w-100">
                              <th class="col-1 text text-center border border-dark border-1">Nr</th>         
                              <th class="col-4 text text-center border border-dark border-1">imgSrc</th>
                              <th class="col-11 text text-center border border-dark border-1">Product</th>    
                              <th class="col-9 text text-center border border-dark border-1">price</th>           
                            </tr>
                          `;

          document.getElementById('theadProducts1').innerHTML = headProduct; 

          //----------(List products category)---------------- 

          
          var index=0;
          document.getElementById('tbodyProducts1').innerHTML="";           
          data.forEach(element => {

          var     colored = Number(element.colored);
            
          var   idProduct = element.id_product; 

          var      imgSrc = element.imgSrc 

          if(imgSrc===""){
          imgSrc = "default_product.png";
            }

          var nameProduct = element.name_product
          var       price = element.price         
          var classDanger = (colored === 1) ? "bg-danger" : ""; 
         
          var htmltbodyProducts1=` <tr id="trDetailProduct`+idProduct+`" class="border border-dark fw-bold" 
                                  data-idproduct="`+idProduct+`" onclick="">
                                  
                                  <td id="productId`+idProduct+`" class="text text-center border border-dark border-1 fs-6 fw-bold" ></td>                               

                                  <td class=" text text-center border border-dark border-1">            
                                    <img class="img img-fluid imgProduct"  
                                    src="/uploads/products/`+imgSrc+`"
                                    width="70px">
                                  </td>

                                  <td class=" text text-center border border-dark border-1">`+nameProduct+`</td>
                                  <td class=" text text-center border border-dark border-1">`+price+`</td>            
                                </tr>            
                              `
          var htmltbodyProducts = ` <tr id="trDetailProduct`+idProduct+`" class="border border-dark fw-bold" 
                                        data-idproduct="`+idProduct+`" onclick="">
                                    
                                        <td id="productId`+idProduct+`" class="text text-center border border-dark border-1 fs-6 fw-bold" >
<!------>
<div class="card" style="width: 7rem;">
  <img src="/uploads/products/`+imgSrc+`" class="card-img-top" alt="...">
  <div class="card-body">
    
    <p class="card-title fs-6 fw-bold nowrap w-50">`+nameProduct+`</p>

    <span class="badge text-bg-dark fs-6 mx-1" id="spanTotalTicket">`+price+`</span>        
  </div>
</div>
<!------>
                                        


                                        </td>
                                     
                                    </tr>                                                    
                                  `;
          

          document.getElementById('tbodyProducts1').innerHTML+=htmltbodyProducts;

          })//data.forEach
                
      colorFirstRowProduct();

    }//status==200  

  }//xhr.onload

  xhr.send();   

}//displayProduits 


function addSingleProductInTicket(idProduct,idTicket){


  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/addProductToTicket.php?idProduct='+idProduct+'&idTicket='+idTicket,true);
  
  xhr.onload = function() {

    if(xhr.status==200){

      var  data =  JSON.parse(this.response);

      console.log("data addProductToTicket :",data);

      displayTicket(idTicket);

      
    }//200

  }//onload

   xhr.send();   
  
}//addSingleProductInTicket


function ChangeQuantityOrAddProduct(idProduct,idTicket){
 
  var xhr = new XMLHttpRequest();
                         
  xhr.open('GET','',true);

  xhr.onload = function() {

    if(xhr.status==200){

    //var  data =  JSON.parse(this.response);

    const redProducts = [];//empty object

    const rows = document.querySelectorAll('#tbodyTicket tr');

    // Load all index and id product existing already in the current ticket
    // index and id as an object
    rows.forEach(row => {

          redProducts.push({     index: row.dataset.idindex, 
                             productId: row.dataset.idproduct });

    });//forEach

    //==============( New product ?)=================================

    const exists = redProducts.some(element => element.productId === String(idProduct));
    
    if(exists) {
      
     // alert('product exist !');
      colortRowTicket(idProduct)
  
    } else {

      //alert("Le produit id = "+idProduct+"est nouveau");
       addSingleProductInTicket(idProduct,idTicket);
        
    }//else
        
    }//status==200

  }//function

  xhr.send();
   
}//addProductToTicket


function removeRedProductsInTable5(idTicket){

  const rows = document.querySelectorAll("#idSpanIndexProduct")

  rows.forEach(row => {

    row.textContent = "";

    row.textContent = "";
    var classListSpan = row.classList;
    classListSpan.remove("bg-danger");

    var parentSpan = row.parentElement.classList ;
    parentSpan.remove("bg-danger");


    console.log('=============================')
    console.log('classListSpan :>'+classListSpan);
    console.log('parentSpan :>'+parentSpan);
    console.log('=============================')
  
  });

  
  
}//removeRedProductsInTable5

function RedProductsInTable5(idTicket){

  var xhr = new XMLHttpRequest();
  xhr.open('GET','',true);

  xhr.onload = function() {
    
    if(xhr.status==200){

    const redProducts = [];//empty object

    const rows = document.querySelectorAll('#tbodyTicket tr');

    const rowsProducts = document.querySelectorAll("#productCard")   //getElementById("tbodyProducts");

    rowsProducts.forEach(row => {

      console.log('rowsProducts :',row);

    });

    

    // Load all index and id product existing already in the current ticket
    // index and id in an object
    rows.forEach(row => {

          //console.log('row Ligne Ticket :',row,"index :",row.dataset.idindex,"productId :",row.dataset.idproduct);

          redProducts.push({     index: row.dataset.idindex, 
                             productId: row.dataset.idproduct });

    });//forEach

  //  console.log('redProducts :',redProducts);

    redProducts.forEach( element => {

      var productCard = document.querySelector("#productCard"+String(element.productId)+" > div > div > h4.card-text.rounded-pill.w-100 > span")

      if(!productCard) return;

      productCard.textContent = element.index;
      productCard.classList.add("bg-danger");
      productCard.parentElement.classList.add("bg-danger");


    //  console.log('parentElement :',productCard.parentElement.classList.add("bg-danger")) ;
   
    })//forEach
    
    }//status==200 =========

  }//xhr.onload 

  xhr.send();

}//RedProductsInTable5

function productsInTicket(idTicket){

  var xhr = new XMLHttpRequest();
                                      
  xhr.open('GET','http://localhost:8000/loadProductsInTicket.php?idTicket='+idTicket,true);
  
  xhr.onloadend = function() {

    if(xhr.status==200){

      var  data =  JSON.parse(this.response);
      
 //     // console.log("data :",data);

      var firstTds = document.querySelectorAll("#tbodyProducts tr td:first-child")

      Array.from(firstTds).map(td =>
        {
          data.forEach( element => {
            if(td.parentElement.dataset.idproduct == element.id_product ){

              td.textContent = element.indexRowTicket;
              td.classList.add('bg-danger')

            }
           
          })
          
        });
     
    }//200

  }//onload

  xhr.send();

}//productsInTicket


//products [5]
function changeTicket(){
  mode['vente'] = true;
  currentTable = table_name[5];
  currentTicketId = 2;
  currentSelected[table_name[3]] =3;//The selected ticket 
  displayTicket(currentTicketId);                           
  displayProducts();
}

function createTicket(){
  mode['vente'] = true;
  currentTable = table_name[3]; 
  currentSelected[table_name[3]] =3;//The selected ticket 
  currentTicketId = 3 ;
  displayTickets(2);                           
  displayTicket(currentTicketId);
}

function modelRequest(idArgument){

  var xhr = new XMLHttpRequest();

  xhr.open('GET','http://localhost:8000/modelRequest.php?idArgument='+idArgument,true);
  
  xhr.onload = function() {

    if(xhr.status==200){

      var  data =  JSON.parse(this.response);      
      //console.log('data :' + JSON.stringify(data));

      //>
      //>
      //>
      //>      
    }//200
  }//onload
   xhr.send();   
}//modelRaquest

/////////////////////( test function )///////////////////////////////////////////////////:
function testfunction(){

  const rows = document.querySelectorAll("#idSpanIndexProduct")

  rows.forEach(row => {

    row.textContent = "";

    var classListSpan = row.classList

    var parentSpan = row.parentElement.classList ;


    console.log('=============================')
    console.log('classListSpan :>'+classListSpan);
    console.log('parentSpan :>'+parentSpan);
    console.log('=============================')
  
  });


     
}//testfunction