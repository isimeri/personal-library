  let  items = [];
  let  itemsRaw = [];
  const display = document.getElementById("display");
  
  fetch('/api/books').then(res => res.json())
  .then((data) => {
    //let  items = [];
    itemsRaw = data;
    $.each(data, function(i, val) {
      items.push('<li class="bookItem" id="' + i + '">' + val.title + ' - ' + val.commentcount + ' comments</li>');
      return ( i !== 14 );
    });
    if (items.length >= 15) {
      items.push('<p>...and '+ (data.length - 15)+' more!</p>');
    }
    $('<ul/>', {
      'class': 'listWrapper',
      html: items.join('')
      }).appendTo('#display');
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
        comments.push('<br><form id="newCommentForm"><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></form>');
        comments.push(`<br><button class="btn btn-info addComment" id="${data._id}">Add Comment</button>`);
        comments.push(`<button class="btn btn-danger deleteBook" id="${data._id}">Delete Book</button>`);
        detailComments.innerHTML = comments.join('');
      }).catch(err => console.error(err));
    }
  });
  
  const bookDetail = document.getElementById('bookDetail');
  bookDetail.addEventListener('click', e => {
    if(e.target.classList.contains("deleteBook")){
      const url = `/api/books/${e.target.id}`;

      fetch(url, {method: "delete"})
      .then(res => res.json())
      .then(data => {
        detailComments.innerHTML = `<p style="color: red;">${data.result}<p><p>Refresh the page</p>`;
      }).catch(err => console.error(err));
    }
  });  
  
  bookDetail.addEventListener('click', e => {
    if(e.target.classList.contains("addComment")){

      let  newComment = document.querySelector('#commentToAdd').value;
      const url = `/api/books/${e.target.id}`;

      fetch(url, {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({comment: newComment})
      }).then(res => res.json())
      .then(data => {
        comments.unshift(newComment);
        detailComments.innerHTML = comments.join("");
      }).catch(err => console.error(err));
    }
  });
  
  $('#newBook').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        //update list
      }
    });
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
  }); 
  