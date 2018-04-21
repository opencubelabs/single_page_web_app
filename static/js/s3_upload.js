var albumBucketName = 'toteyes-media';
var bucketRegion = 'us-east-1';
var IdentityPoolId = 'us-east-1:2ff7a961-c8a6-45ff-be75-9b3f85413525';

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});

var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: albumBucketName}
});

function isImage(file_type) {
    
    switch (file_type.toLowerCase()) {
    	case 'image/jpg':
    	case 'image/jpeg':
    	case 'image/png':
    	case 'image/svg':
      case 'image/svg+xml':
    	case 'image/gif':
        	return true;
    }
    return false;
}

function isVideo(file_type) {
    
    switch (file_type.toLowerCase()) {
    	case 'video/mp4':
    	case 'video/webm':
    	case 'video/ogg':
        	return true;
    }
    return false;
}

function uploadFile(key, body, type){
	s3.upload({
		Key: key,
		Body: body,
		ACL: 'public-read'
		}, function(err, data) {
		if (err) {
		  console.log('NA1');
		}else{
			//document.getElementById("status").style.display = "none";
			//alert('Successfully uploaded file.');
      console.log('Success!! | ' + type)
      var post_data = {
        "data": {
          "text": "",
          "media": {
            "type": "",
            "link": ""
          }
        },
        "class_sno": "",
        "activity": "",
        "kid_tags": []
      }
      var contenteditable = document.querySelector('[contenteditable]');
      var e = document.getElementById("activities");

      post_data.data.text = contenteditable.textContent;
      post_data.class_sno = get_class_id();
      post_data.activity = e.options[e.selectedIndex].value;
      post_data.kid_tags = get_kid_tags();
      post_data.data.media.type = type;
      post_data.data.media.link = 'https://s3.amazonaws.com/toteyes-media/' + key

      console.log(post_data)
		}
	});
}

function checkFile(sent_file) {
  
  /*var files = document.getElementById('fileUpload').files;
  if (!files.length) {
    return alert('Please choose a file to upload first.');
  }
  var file = files[0];*/
  var file = sent_file;
  var fileName = file.name;
  var fileType = file.type;
  var folder = '';

  /*console.log('File Type: ' + fileType)
  console.log(isImage(fileType))*/

  if(isImage(fileType)){
  	folder = 'images';
  	//document.getElementById("status").style.display = "block";
  	var fileKey = encodeURIComponent(folder) + '/';

  	var docKey = fileKey + Date.now() + '-' + fileName;


  	
  	uploadFile(docKey, file, 'image');

    /*if(res == 1){
      return {'type': 'image', 'link': 'https://s3.amazonaws.com/toteyes-media/'+docKey}
    }else{
      return 'NA1'
    }*/

    

  }else if(isVideo(fileType)){
  	folder = 'videos';
  	//document.getElementById("status").style.display = "block";
  	var fileKey = encodeURIComponent(folder) + '/';

  	var docKey = fileKey + Date.now() + '-' + fileName;

    uploadFile(docKey, file, 'video');
  	
  	/*var res = uploadFile(docKey, file);

    if(res == 1){
      return {'type': 'video', 'link': 'https://s3.amazonaws.com/toteyes-media/'+docKey}
    }else{
      return 'NA'
    }*/
	
  }else{
  	console.log('Invalid type :(')
    return 'NA'
  }
  
}

function readURL(input) {

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    //console.log(input.files[0])

    reader.onload = function(e) {
      if(isImage(input.files[0].type)){
        document.getElementById("media_video").style.display = "none";
        document.getElementById("media_image").style.display = "block";
        document.getElementById("media_image").src=e.target.result;        
      }else if(isVideo(input.files[0].type)){
        document.getElementById("media_image").style.display = "none";
        document.getElementById("media_video").style.display = "block";
        document.getElementById("media_video").src=e.target.result;
      }else{
        console.log('Invalid media: '+input.files[0].type)
      }
    }

    reader.readAsDataURL(input.files[0]);
  }
}