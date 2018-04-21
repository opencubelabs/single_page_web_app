function post_data(){
	console.log('Post data!!')
}

function readURL(input) {

  /* Changes src of image or video on change of data */

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
        document.getElementById("media_image").src=e.target.result;
    }

    reader.readAsDataURL(input.files[0]);
  }
}