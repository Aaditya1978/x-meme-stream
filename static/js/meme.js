// Runs the script when document is properly loaded

$(document).ready(function() {

    // hidding all error messages
    $("#message").hide();
    $("#message_fail").hide();
    $("#stream_fail").hide();
    $("#message_duplicate").hide();

    // Input Form Validation
    validator = $('#form').validate({
        rules: {
            user_name : {
                required: true,
            },
            caption: {
                required: true,
            },
            image_url: {
                required: true,
                url: true
            },
        },
        // Error messages for wrong Input if given
        messages : {
            user_name: {
                required: "Please Enter your name"
            },
            caption: {
                required: "Please enter your age",
            },
            image_url: {
                required: "Emter Image URL"
            },
        },

        // Handling Submit of form, It sends data to Flask App by POST Method
        submitHandler: function(form) {
            $.ajax({
                data :JSON.stringify({
                    name : $('#user_name').val(),
                    caption : $('#caption').val(),
                    url : $('#image_url').val()
                }),
                type : 'POST',
                url : '/memes',
                dataType : 'json',
                contentType: 'application/json; charset=utf-8'
            })

            // When data is successfully stored we display the meme dynamically
            .done(function(data,xhr) {
                $('#message').show().delay(5000).fadeOut();
                $( '#form' ).each(function(){
                    this.reset();
                });
                $('#meme_display').prepend(
                    "<li class='col-md-3 mb-3 memedata'>\
                    <div class='name'>"
                    +data.memes.name+
                    "<div class='dtime'>"
                    +data.memes.date_time.substring(0,10)+" ,"+data.memes.date_time.substring(11,19)+
                    "</div>\
                    </div>\
                    <p class='caption'>"+data.memes.caption+"</p>\
                    <img class='img' src='"+data.memes.url+"'\onerror=\"this.onerror=null;this.src='https://thumbs.dreamstime.com/b/no-found-symbol-unsuccessful-search-suitable-results-oops-page-failure-concept-flat-outline-vector-illustration-loupe-122872462.jpg';\">\
                    </li>"
                );
                $('#meme_stream').show();
                return xhr
            })
            // When backend fails to save data or respond correctly
            .fail(function(xhr) {
                if(xhr.status==409){
                    $('#message_duplicate').show().delay(5000).fadeOut();
                    $( '#form' ).each(function(){
                        this.reset();
                    });
                }
                else{
                    $('#message_fail').show().delay(5000).fadeOut();
                    $( '#form' ).each(function(){
                    this.reset();
                });
                }
                return xhr;
            });
        }
    });



    // Get Method to fetch all the memes dynamically using ajax calls
    $.ajax({
        type : 'GET',
        url : '/memes'
    })

    // IF memes are fetched successfully display them
    .done(function(data) {
        $.each(data.memes,function(index,value){
            $('#meme_display').append(
                "<li class='col-md-3 mb-3 memedata'>\
                    <div class='name'>"
                    +value.name+
                    "<div class='dtime'>"
                    +value.date_time.substring(0,10)+" ,"+value.date_time.substring(11,19)+
                    "</div>\
                    </div>\
                    <p class='caption'>"+value.caption+"</p>\
                    <img class='img' src='"+value.url+"'\onerror=\"this.onerror=null;this.src='https://thumbs.dreamstime.com/b/no-found-symbol-unsuccessful-search-suitable-results-oops-page-failure-concept-flat-outline-vector-illustration-loupe-122872462.jpg';\">\
                    </li>"
            );
        });
        $('#meme_stream').show();
        return data.memes;
    })
    // When backend fails to save data or respond correctly
    .fail(function(xhr) {
        $('#stream_fail').show().delay(5000).fadeOut();
        return xhr
    });
});