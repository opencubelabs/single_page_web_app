$(document).ready(function(){

  

  route('/', 'home', function(){

    //this.nav = '<p class="" style="float: left; font-size: 20px;">TotEyes</p><div style="float: right;"><a href="#/post" style="color: #fff;"><i class="fa fa-plus" style="font-size: 25px; margin-right: 25px;"></i></a><i class="fa fa-ellipsis-v" style="font-size: 25px;" id="menu" onclick="toggle_menu();"></i></div>';

    
  })

  route('/post', 'post', function(){

    //this.nav = '<a href="/" style="color: #fff;"><i class="fa fa-arrow-left" style="float: left; font-size: 25px;"></i></a><p class="" style="float: right; font-size: 20px;" onclick="post_data()">Post</p>';
    
    
  })

  
  
  route('/logout', 'logout', function(){
    $.get('/logout', function(data){
      window.location.replace("/#/login");
      
    });
  })

  route('*', 'error404', function () {});
})