/**
 * @Author : Mr.Thang (Zemi)
 * @Email: ngothangit@gmail.com
 * @Skype: zemi6886
 */
var viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var workspace_width = 0;
$(document).ready(function () {
    widthHeight_init();
    
    $(window).resize(function () {
        setTimeout(widthHeight_init(), 800);
    });
    
    $('[data-toggle="tooltip"]').tooltip();
    
    /**
     * Show/Hide playlist
     */
    $(".playlist .toggle").click(function () {
        if($(".playlist").hasClass('open')){
            $(".playlist").removeClass('open');
            $(this).find('.fa').removeClass('fa-caret-left').addClass('fa-caret-right');
            $('.workspace').width($(window).width() - 33);
        } else {
            $(".playlist").addClass('open');
            $(this).find('.fa').removeClass('fa-caret-right').addClass('fa-caret-left');
            $('.workspace').width(workspace_width);
        }
    });
    
    /**
     * Fetch video list
     */
    $.ajax({
        url: "/video",
        method: 'GET',
        cache: true
    }).done(function (result) {
        let data = $.parseJSON(result);
        // get DOM node to be parent of child list nodes
        var $videos = $('#videos');
        // iterate through each object in JSON array
        var divChild = '';
        $.each(data, function (i, item) {
            divChild += `<div class="video" data-source="${item.url}" data-type="video/mp4" data-toggle="modal" data-target="#videoModal">
                            <span class="video-title">${item.name}</span>
                            <video width="100%">
                                <source src="${item.url}#t=9" type="video/mp4">
                            </video>
                            <div class="overlay"><span class="play"></span></div>
                        </div>`;
        });
        $videos.html(divChild);
        
        // Popup video player
        $(".playlist .videos .video").click(function (e) {
            e.preventDefault();
            var videoTitle = $(this).find('.video-title').text();
            var videoSource = $(this).data('source');
            var videoType = $(this).data('type');
            var videoHeight = $(window).height() - 60 - 47;
            var videoCode = `<video width="100%" height="${videoHeight}" controls autoplay>
                                <source src="${videoSource}" type="${videoType}">
                                Your browser does not support the video tag.
                            </video>`;
            $("#videoModal .modal-dialog").css({
                width: ($(window).height() - 60) * 16 / 9,
                height: $(window).height() - 60
            });
            $("#videoModal .modal-title").text(videoTitle);
            $("#videoModal .modal-body").html(videoCode);
        });
    }).fail(function (error) {
        console.error(error);
    });
    $("#videoModal").on("hidden.bs.modal", function () {
        $("#videoModal .modal-body").html('');
    });
    $(".modal").on("hidden.bs.modal", function () {
        $("body").css('padding-right', 0);
    });
    
    /**
     * Fullscreen / Exit
     */
    $(".fullscreen").click(function () {
        if (document.documentElement.requestFullScreen) {
            document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    });
    $(".exit-fullscreen").click(function () {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    });
    
    /**
     * Summary
     */
    $(".summary .summary-title .arrow .fa").click(function () {
        if($(this).hasClass('fa-caret-up')){
            $(this).removeClass('fa-caret-up').addClass('fa-caret-down');
            $(".summary .summary-body").height(333);
            $(".workspace .canvas .canvas-drawer").css('height', 'calc(100% - 375px)');
        } else {
            $(this).addClass('fa-caret-up').removeClass('fa-caret-down');
            $(".summary .summary-body").height(0);
            $(".workspace .canvas .canvas-drawer").css('height', 'calc(100% - 42px)');
        }
    });
    $(".summary .summary-title .btn-report").click(function () {
        console.log('report button clicked');
        // report here
    });
    
    /**
     * Toolbar controls
     */
    $(".toolbar>.controls>.control .control__input").click(function (e) {
        e.preventDefault();
        var inputValue = $(this).val();
        console.log(inputValue);
        // code here
    });
    
    /**
     * Switch Control
     */
    $(".toolbar .control-switch .prev").click(function (e) {
        console.log('switch prev clicked');
        // code here
    });
    $(".toolbar .control-switch .next").click(function (e) {
        console.log('switch next clicked');
        // code here
    });
    
    /**
     * Draw Save
     */
    $(".workspace .logged_in .draw-save").click(function () {
        console.log('save button clicked');
        $.ajax({
            type: "POST",
            url: "/drawing",
            data: { data: "data", name: "long1ss" },
            encode: true,
            success: function (data) {
                alert("Success");
            },
            error: function (data) {
                console.log(data);
                alert("Has error " + data.responseText);
            }
        });
    });
    
    /**
     * Login
     */
    $("form#login_with_username").submit(function () {
        var $form = $(this);
        $.ajax({
            type: "POST",
            url: "/login",
            data: $form.serialize(),
            encode: true,
            cache: false,
            success: function (data) {
                $('#accountMenu').text($('#login_username').val()).show();
                $('#logoutMenu').show();
                $('#loginMenu').hide();
                $('#loginModal').modal("hide");
                alert("Login Success");
            },
            error: function (data) {
                console.log(data);
                alert("Wrong user or password");
            }
        });
        return false;
    });
    $("form#login_with_email").submit(function () {
        var formData = {
            username: $('#login_email').val(),
            password: $('#login_password').val()
        };
        $.ajax({
            type: "POST",
            url: "/login",
            data: formData,
            encode: true,
            cache: false,
            success: function (data) {
                alert("Login Success");
                $('#accountMenu').text(formData.username).show();
                $('#logoutMenu').show();
                $('#loginMenu').hide();
                $('#loginModal').modal("hide");
            },
            error: function (data) {
                alert("Wrong user or password");
            }
        });
        return false;
    });
    //logout
    $('#logoutMenu').click(function (e) {
        e.preventDefault();
        var formData = {
            username: $('#accountMenu').text()
        };
        $.ajax({
            type: "GET",
            url: "/logout",
            data: formData,
            encode: true,
            cache: false,
            success: function (data) {
                $('#accountMenu').hide();
                $('#logoutMenu').hide();
                $('#loginMenu').show();
            },
            error: function (data) {
                console.log(data);
                alert("Has error");
            }
        });
        return false;
    });
    // Signup
    $("form#signup_form").submit(function (e) {
        e.preventDefault();
        var formData = {
            username: $('#signup_username').val(),
            password: $('#signup_password').val(),
            confirmPassword: $("#confirm_password").val(),
            email: $('#signup_email').val(),
            name: $('#signup_firstname').val(),
            middleName: $('#signup_middlename').val(),
            lastName: $('#signup_lastname').val(),
            phone: $('#signup_cellnumber').val(),
            professional: $('#signup_profession').val(),
            license: $('#signup_license').val()
        };
        $.ajax({
            type: "POST",
            url: "/signup",
            data: formData,
            encode: true,
            cache: false
        }).done(function (data) {
            alert("Register Success");
            $('#loginMenu').text(formData.username);
            $('#signupModal').modal("hide");
        }).fail(function (error) {
            alert("Error " + error.responseText);
        });
        return false;
    });
    
});

function widthHeight_init() {
    var h = jQuery("#header");
    var f = jQuery("#footer");
    var toolbar = jQuery(".workspace .toolbar");
    //var win_height = ($(window).height() > 600) ? $(window).height() : 600;
    var win_height = $(window).height();
    var sum = win_height - h.outerHeight(true) - f.outerHeight(true) - 35;
    sum = (sum > toolbar.outerHeight(true)) ? sum : toolbar.outerHeight(true);
    $('.playlist, .workspace').css('height', sum);
    
    var toolbar_width = $(".workspace .toolbar>ul>li.control-32 .text").width() + 75;
    //var toolbar_item_height = ($(".workspace .toolbar>ul").outerHeight(true) - 30)/32;
    var toolbar_item_height = (sum - 50)/32;
    toolbar.width(toolbar_width - 1);
    $(".workspace .canvas").css('width', 'calc(100% - '+toolbar_width+'px)');
    $(".workspace .logged_in").css('min-width', toolbar_width+'px');
    $(".workspace .toolbar>ul>li").css('height', toolbar_item_height );
    $(".workspace .toolbar>ul>li.control-switch>.text").css('line-height', toolbar_item_height + 'px');
    
    var main_width = $(window).outerWidth(true);
    //var playlist_width = (main_width * 0.5 > 285) ? 285 : main_width * 0.3;
    var playlist_width = toolbar_width * 2.6;
    workspace_width = main_width - playlist_width - 60;
    $('.playlist').css({
        width: playlist_width,
        marginLeft: -playlist_width - 15
    });
    if($(".playlist").hasClass('open')){
        $('.workspace').width(workspace_width);
    } else {
        $('.workspace').width(main_width - 33);
    }
}

let loginForm = `<!--POPUP LOGIN-->
<div id="loginModal" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">LOGIN</h4>
            </div>
            <div class="modal-body">
                <div class="login_result" style="margin-bottom: 5px;color: red;"></div>
                <form class="mb40" id="login_with_username" method="post" action="">
                    <div class="row form-group">
                        <div class="col-sm-5">
                            <label for="login_username">Username<span class="t_red">*</span></label>
                        </div>
                        <div class="col-sm-7">
                            <input type="text" class="form-control" value="" name="username" id="login_username" required />
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-sm-5">
                            <label for="login_password">Password<span class="t_red">*</span></label><br/>
                        </div>
                        <div class="col-sm-7">
                            <input type="password" class="form-control" value="" name="password" id="login_password" required />
                        </div>
                        <div class="clearfix"></div>
                        <div class="col-sm-12">
                            <small style="font-size:10px;line-height:1">* At least 8 characters long, and include at least an upper case and a lower case letter, at least a number, and at least a special character.</small>
                        </div>
                    </div>
                    <div class="submit_section text-right">
                        <button type="submit" class="btn btn-primary">GO</button>
                    </div>
                </form>
                <form id="login_with_email" method="post" action="">
                    <div class="row form-group">
                        <div class="col-sm-5">
                            <label for="login_email">Enter your email<span class="t_red">*</span></label>
                        </div>
                        <div class="col-sm-7">
                            <input type="email" class="form-control" value="" name="email" id="login_email" required />
                        </div>
                    </div>
                    <div class="submit_section text-right">
                        <button type="submit" class="btn btn-primary">GO</button>
                    </div>
                </form>
            </div>
            <div class="modal-footer text-center">
                <div data-dismiss="modal" data-toggle="modal" data-target="#signupModal">
                    Don't have an account? <strong style="cursor:pointer">Create New Account</strong>
                </div>
            </div>
        </div>

    </div>
</div>`;
let signupForm = `<!--POPUP SIGNUP-->
<div id="signupModal" class="modal fade" role="dialog">
    <div class="modal-dialog">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">CREATE ACCOUNT</h4>
            </div>
            <div class="modal-body">
                <div class="signup_result" style="margin-bottom: 5px;color: red;"></div>
                <form id="signup_form" method="post" action="">
                    <div class="row form-group">
                        <div class="col-sm-5">
                            <label for="signup_firstname">First Name<span class="t_red">*</span></label>
                        </div>
                        <div class="col-sm-7">
                            <input type="text" class="form-control" value="" name="firstname" id="signup_firstname" required />
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-sm-5">
                            <label for="signup_middlename">Middle Name</label>
                        </div>
                        <div class="col-sm-7">
                            <input type="text" class="form-control" value="" name="middlename" id="signup_middlename" />
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-sm-5">
                            <label for="signup_lastname">Last Name<span class="t_red">*</span></label>
                        </div>
                        <div class="col-sm-7">
                            <input type="text" class="form-control" value="" name="lastname" id="signup_lastname" required />
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-sm-5">
                            <label for="signup_email">Email Address<span class="t_red">*</span></label>
                        </div>
                        <div class="col-sm-7">
                            <input type="email" class="form-control" value="" name="email" id="signup_email" required />
                        </div>
                    </div>
                    <div class="row form-group mb40">
                        <div class="col-sm-5">
                            <label for="signup_cellnumber">Cell Number<span class="t_red">*</span></label>
                        </div>
                        <div class="col-sm-7">
                            <input type="text" class="form-control" value="" name="cellnumber" id="signup_cellnumber" required />
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-sm-5">
                            <label for="signup_profession">Profession<span class="t_red">*</span></label>
                        </div>
                        <div class="col-sm-7">
                            <select class="form-control" name="profession" id="signup_profession" required>
                                <option value="1">Profession 1</option>
                                <option value="2">Profession 2</option>
                                <option value="3">Profession 3</option>
                                <option value="4">Profession 4</option>
                                <option value="5">Profession 5</option>
                                <option value="6">Profession 6</option>
                            </select>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-sm-5">
                            <label for="signup_license">License Number<span class="t_red">*</span></label>
                        </div>
                        <div class="col-sm-7">
                            <input type="text" class="form-control" value="" name="license" id="signup_license" required />
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-sm-5">
                            <label for="signup_username">Username<span class="t_red">*</span></label>
                        </div>
                        <div class="col-sm-7">
                            <input type="text" class="form-control" value="" name="username" id="signup_username" required />
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-sm-5">
                            <label for="signup_password">Password<span class="t_red">*</span></label><br/>
                        </div>
                        <div class="col-sm-7">
                            <input type="password" class="form-control" value="" name="password" id="signup_password" required />
                        </div>
                        <div class="clearfix"></div>
                        <div class="col-sm-12">
                            <small style="font-size:10px;line-height:1">* At least 8 characters long, and include at least an upper case and a lower case letter, at least a number, and at least a special character.</small>
                        </div>
                    </div>
                    <div class="row form-group">
                        <div class="col-sm-5">
                            <label for="confirm_password">Re-enter Password<span class="t_red">*</span></label>
                        </div>
                        <div class="col-sm-7">
                            <input type="password" class="form-control" value="" name="confirm_password" id="confirm_password" required />
                        </div>
                    </div>
                    <div class="submit_section text-right">
                        <button type="submit" class="btn btn-primary">Create</button>
                    </div>
                </form>
            </div>
            <div class="modal-footer text-center">
                <div data-dismiss="modal" data-toggle="modal" data-target="#loginModal">
                    Already have an account? <strong style="cursor:pointer">Login</strong>
                </div>
            </div>
        </div>

    </div>
</div>`;

document.querySelector('.template').innerHTML = loginForm + signupForm;