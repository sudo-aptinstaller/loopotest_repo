const $ = require('jquery');
const fs = require('fs');
const path = require('path');
const {remote} = require('electron');
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
          console.log(formData);
          $.ajax({
              type:'POST',
              url: $(this).attr('action')+'/'+appId,
              data:formData,
              cache:false,
              contentType: false,
              processData: false,
              success:function(response){
                  console.log(response);
              },
              error: function(data){
                  console.log('Error : ',data);
              }
          });
      }));
  });