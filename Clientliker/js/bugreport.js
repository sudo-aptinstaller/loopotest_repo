const $ = require('jquery');
const fs = require('fs');
const path = require('path');
const {remote, app} = require('electron');
const { ajax } = require('jquery');
var appId;  

$(document).ready(function (e) {
  //add fs get file here 
  fs.readFile(remote.app.getPath('userData')+'/applicationData/user.joel', (error,data) =>{
    if(!error){
      appId = data;
    }
  });
      $('#reportForm').on('submit',(function(e) {
          e.preventDefault();
          var formData = new FormData(this);
          $('#reportForm').hide();
          console.log(formData);
          $.ajax({
              type:'POST',
              url: $(this).attr('action')+'/'+appId,
              data:formData,
              cache:false,
              contentType: false,
              processData: false,
              success:function(response){
                  $('#reportForm').html('<h3 class="nerko" style="color:#fff" >Thank you for the feedback.</h3>');
                  $('#reportForm').show();
                  setTimeout(()=>{
                    remote.app.quit();
                  },5000);
              },
              error: function(data){
                  console.log('Error : ',data);
              }
          });
      }));
  });