  let  items = [];
  let  itemsRaw = [];
  const display = document.getElementById("display");
  const bookList = document.querySelector(".listWrapper");
  
  fetch('/api/books').then(res => res.json())
  .then((data) => {
    //let  items = [];
    itemsRaw = data;
    if(itemsRaw.length === 0){
      bookList.textContent = "There are no books in this library yet.";
    } else {

      $.each(data, function(i, val) {
        items.push({key: i, val: `<li class="bookItem" id="${i}">${val.title} - ${val.commentcount} comments</li>`});
        return ( i !== 14 );
      });
      if (items.length >= 15) {
        items.push({key: items.length, val: '<p>...and '+ (data.length - 15)+' more!</p>'});
      }
      bookList.innerHTML = items.reduce((acc, curr) => { return acc+=curr.val; }, "");
    }
  }).catch(err => console.error(err));
  
  let  comments = [];
  const detailTitle = document.getElementById("detailTitle");
  const detailComments = document.getElementById("detailComments");

  display.addEventListener('click', function(e) {
    if(e.target.classList.contains("bookItem")){
      
      detailTitle.innerHTML = `<b>${itemsRaw[e.target.id].title} </b> id: ${itemsRaw[e.target.id]._id}`;
      fetch('/api/books/'+itemsRaw[e.target.id]._id).then(res => res.json())
      .then(data => {
        comments = [];
        data.comments.forEach((val) => {
          comments.push('<li>' +val+ '</li>');
        });
        comments.push('<br><form id="newCommentForm"><input type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></form>');
        comments.push(`<br><button class="btn btn-info addComment" id="${data._id}">Add Comment</button>`);
        comments.push(`<button class="btn btn-danger deleteBook" id="${data._id}" data-order="${e.target.id}">Delete Book</button>`);
        detailComments.innerHTML = comments.join('');
      }).catch(err => console.error(err));
    }
  });
  
  const bookDetail = document.getElementById('bookDetail');
  bookDetail.addEventListener('click', e => {
    if(e.target.classList.contains("deleteBook")){
      const url = `/api/books/${e.target.id}`;

      fetch(url, {method: "delete"})
      .then(res => res.text())
      .then(data => {
        
        for(let i=0; i<items.length; i++){
          if(items[i].key === parseInt(e.target.dataset.order)){
            items.splice(i, 1);
          }
        }
        // itemsRaw.splice(e.target.id, 1);       //id la carti nu se upd, dar ne trebuie id pt indexare items. poate ar fi mai bine de facut items ca obj
        bookList.innerHTML = items.reduce((acc, curr) => { return acc+=curr.val; }, "");
        detailComments.innerHTML = `<p>${data}<p><p>Refresh the page</p>`;
      }).catch(err => console.error(err));
    }
  });  
  
  bookDetail.addEventListener('click', e => {
    if(e.target.classList.contains("addComment")){

      let  newCommentInput = document.querySelector('#commentToAdd');
      let  newComment = newCommentInput.value;
      const url = `/api/books/${e.target.id}`;

      fetch(url, {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({comment: newComment})
      }).then(res => res.json())
      .then(data => {
        newCommentInput.value = '';
        comments = [];
        data.comments.forEach((val) => {
          comments.push('<li>' +val+ '</li>');
        });
        comments.push('<br><form id="newCommentForm"><input type="text" id="commentToAdd" name="comment" placeholder="New Comment"></form>');
        comments.push(`<br><button class="btn addComment" id="${data._id}">Add Comment</button>`);
        comments.push(`<button class="btn deleteBook" id="${data._id}">Delete Book</button>`);
        detailComments.innerHTML = comments.join("");
      }).catch(err => console.error(err));
    }
  });
  
  const newBookForm = document.querySelector("#newBookForm");
  const bookTitleInput = document.querySelector("#bookTitleToAdd");

  newBookForm.addEventListener("submit", e => {
    // $.ajax({
    //   url: '/api/books',
    //   type: 'post',
    //   dataType: 'json',
    //   data: $('#newBookForm').serialize(),
    //   success: function(data) {
    //     //update list
    //   }
    // });
    e.preventDefault();
    const formData = new FormData(newBookForm);
    const newBookBody = {};

    formData.forEach((val, key) => {
      newBookBody[key] = val;
    });

    // console.log(newBookBody);
    

    fetch('/api/books', {
      method: "post",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(newBookBody)
    }).then(res => res.json())
    .then(data => {
      bookTitleInput.value = '';
      items.push({key: items.length, val: `<li class="bookItem" id="${items.length}">${data.title} - 0 comments</li>`});
      itemsRaw.push(data);
      // const newLi = document.createElement("li");
      // newLi.classList.add('bookItem');
      // newLi.id = items.length;
      // newLi.textContent = `${data.title} - 0 comments`;

      // bookList.append(newLi);
      bookList.innerHTML = items.reduce((acc, curr) => { return acc+=curr.val; }, "");
    }).catch(err => console.error(err));
  });
  
  $('#deleteAllBooks').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'delete',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list
      }
    });
    fetch('/api/books', {
      method: 'delete'
    }).then(res => res.text())
    .then(data => {
      items = [];
      itemsRaw = [];
      bookList.innerHTML = "There are no books in this library yet.";
    });
  }); 
  