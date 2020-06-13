var page = 0
act_tour = ""
$(function(){
    $("#start").show()
    axios.post('/tourlist', {
        page: page
    })
    .then(function(response){
        $("#tourlist").html(response.data)
    })
    .catch(function(error){
    })
})

function nextpag(){
    page += 1
    axios.post('/tourlist',{
        page: page
    })
    .then(function(response){
        $("#tourlist").html(response.data)
    })
    .catch(function(error){
        page -= 1
    })
}

function prevpag(){
    page -= 1
    axios.post('/tourlist', {
        page: page
    })
    .then(function(response){
        $("#tourlist").html(response.data)
    })
    .catch(function(error){
        page += 1
    })
}

function searchtour(){
    axios.post('/searchtour', {
        name: $("#searchtour").val()
    })
    .then(function(response){
        $("#tourlist").html(response.data)
    })
}

function backtour(){
    axios.post('/tourlist', {
        page: page
    })
    .then(function(response){
        $("#tourlist").html(response.data)
    })
}

function dettour(tour_name){
    $("#start").hide()
    $("#dettour").show()
    act_tour = tour_name
    axios.post('/dettour', {
        name: tour_name
    })
    .then(function(response){
        $("#detres").html(response.data)
    })
}

function dethide(){
    $("#detmsg").text("")
    $("#detmsg").removeClass("alert alert-success")
    $("#detmsg").removeClass("alert alert-danger")
    axios.post('/tourlist', {
        page: page
    })
    .then(function(response){
        $("#tourlist").html(response.data)
        $("#dettour").hide()
        $("#start").show()
    })
    .catch(function(error){
    })
}

function registershow(){
    $("#start").hide()
    $("#registration").show()
}

function registerhide(){
    $("#start").show()
    $("#registration").hide()
    $("#firstname").val("")
    $("#lastname").val("")
    $("#mail").val("")
    $("#pass").val("")
    $("#pass2").val("")
    $("#regmsg").text("")
    $("#regmsg").removeClass("alert alert-success")
    $("#regmsg").removeClass("alert alert-danger")
}

function loginhide(){
    $("#login").hide()
    $(".over").hide()
    $("#logmail").val("")
    $("#logpass").val("")
    $("#loginmsg").text("")
    $("#loginmsg").removeClass("alert alert-success")
    $("#loginmsg").removeClass("alert alert-danger")
}

function logoutshow(){
    if(Cookies.get('token') !=  undefined){
        $("#start").hide()
        $("#logout").show()
    }
    else{
        $("#startmsg").removeClass("alert alert-success")
        $("#startmsg").addClass("alert alert-danger")
        $("#startmsg").text("User is not logged in")
        setTimeout(function(){
            $("#startmsg").removeClass("alert alert-success")
            $("#startmsg").removeClass("alert alert-danger")
            $("#startmsg").text("")
          }, 2000)
    }
}

function evchoosehide(){
    $("#evchoose").hide()
    $("#start").show()
}

function mymahide(){
    $("#myma").hide()
    $("#start").show()
}

function myturhide(){
    $("#mytur").hide()
    $("#start").show()
}

function evshow(){
    if(Cookies.get('token') !=  undefined){
        $("#start").hide()
        $("#evchoose").show()
    }
    else{
        $("#startmsg").removeClass("alert alert-success")
        $("#startmsg").addClass("alert alert-danger")
        $("#startmsg").text("User is not logged in")
        setTimeout(function(){
            $("#startmsg").removeClass("alert alert-success")
            $("#startmsg").removeClass("alert alert-danger")
            $("#startmsg").text("")
          }, 2000)
    }
}

function mytur(){
    $("#evchoose").hide()
    $("#mytur").show()
    axios.post('/mytur',{   
    })
    .then(function(response){
        $("#myturres").html(response.data)
    })
}

function myma(){
    $("#evchoose").hide()
    $("#myma").show()
    axios.post('/myma',{   
    })
    .then(function(response){
        $("#mymares").html(response.data)
    })
}

function crtoushow(){
    if(Cookies.get('token') !=  undefined){
        $("#start").hide()
        $("#crtou").show()
    }
    else{
        $("#startmsg").removeClass("alert alert-success")
        $("#startmsg").addClass("alert alert-danger")
        $("#startmsg").text("User is not logged in")
        setTimeout(function(){
            $("#startmsg").removeClass("alert alert-success")
            $("#startmsg").removeClass("alert alert-danger")
            $("#startmsg").text("")
          }, 2000)
        return
    }
    axios.post('/spons', {
    })
    .then(function(response){
        $("#spon1").html(response.data)
        $("#spon2").html(response.data)
        $("#spon3").html(response.data)
        $("#spon4").html(response.data)
        $("#spon5").html(response.data)
    })
}

function logouthide(){
    $("#start").show()
    $("#logout").hide()
}

function regtour(){
    if(Cookies.get('token') == undefined){
        loginshow()
    }
    else{
        $("#regtourrank").show()
    }
}

function confreg(){
    if($("#tourrank").val() == ""){
        $("#rankmsg").text("Please fill in all fields")
        $("#rankmsg").removeClass("alert alert-success")
        $("#rankmsg").addClass("alert alert-danger")
        return
    }
    axios.post('/regtour', {
       rank: $("#tourrank").val(),
       name: act_tour
    })
    .then(function(response){
        $("#regtourrank").hide()
        $("#detmsg").text("The user has been registered successfully")
        $("#detmsg").addClass("alert alert-success")
        $("#detmsg").removeClass("alert alert-danger")
        $("#rankmsg").text("")
        $("#rankmsg").removeClass("alert alert-success")
        $("#rankmsg").removeClass("alert alert-danger")
    })
    .catch(function(error){
        $("#rankmsg").text(error.response.data)
        $("#rankmsg").removeClass("alert alert-success")
        $("#rankmsg").addClass("alert alert-danger")
    })
}

function reghide(){
    $("#regtourrank").hide()
    $("#rankmsg").text("")
    $("#rankmsg").removeClass("alert alert-success")
    $("#rankmsg").removeClass("alert alert-danger")
}

function loginshow(){
    if(Cookies.get('token') ==  undefined){
        $("#login").show()
        $(".over").show()
    }
    else{
        $("#startmsg").removeClass("alert alert-success")
        $("#startmsg").addClass("alert alert-danger")
        $("#startmsg").text("User is already logged in")
        setTimeout(function(){
            $("#startmsg").removeClass("alert alert-success")
            $("#startmsg").removeClass("alert alert-danger")
            $("#startmsg").text("")
          }, 2000)
    }
}

function logout(){
    axios.post('/logout', {
    })
    .then(function (response) {
        $("#startmsg").addClass("alert alert-success")
        $("#startmsg").removeClass("alert alert-danger")
        Cookies.remove('token')
        $("#startmsg").text(response.data)
        $("#start").show()
        $("#logout").hide()
        setTimeout(function(){
            $("#startmsg").removeClass("alert alert-success")
            $("#startmsg").removeClass("alert alert-danger")
            $("#startmsg").text("")
          }, 2000)
    })
    .catch(function (error) {
        $("#startmsg").removeClass("alert alert-success")
        $("#startmsg").addClass("alert alert-danger")
        $("#startmsg").text(error.response.data)
        setTimeout(function(){
            $("#startmsg").removeClass("alert alert-success")
            $("#startmsg").removeClass("alert alert-danger")
            $("#startmsg").text("")
          }, 2000)
    })
}

function login(){
    if($("#logmail").val() == "" || $("#logpass").val() == ""){
        $("#loginmsg").removeClass("alert alert-success")
        $("#loginmsg").addClass("alert alert-danger")
        $("#loginmsg").text("Please fill in all fields")
        return
    }
    axios.post('/login', {
        mail: $("#logmail").val(),
        passwd: $("#logpass").val()
    })
    .then(function(response){
        $("#login").hide()
        $(".over").hide()
        $("#logmail").val("")
        $("#logpass").val("")
        $("#startmsg").addClass("alert alert-success")
        $("#startmsg").removeClass("alert alert-danger")
        $("#startmsg").text("The user has been logged in successfully")
        Cookies.set('token', response.data, {expires: 365})
        $("#loginmsg").text("")
        $("#loginmsg").removeClass("alert alert-success")
        $("#loginmsg").removeClass("alert alert-danger")
        setTimeout(function(){
            $("#startmsg").removeClass("alert alert-success")
            $("#startmsg").removeClass("alert alert-danger")
            $("#startmsg").text("")
          }, 2000)
    })
    .catch(function(error){
        $("#loginmsg").removeClass("alert alert-success")
        $("#loginmsg").addClass("alert alert-danger")
        $("#loginmsg").text(error.response.data)
    })
}

function register(){
    if($("#firstname").val() == "" || $("#lastname").val() == "" || $("#mail").val() == "" || $("#pass").val() == "" || $("#pass2").val() == ""){
        $("#regmsg").removeClass("alert alert-success")
        $("#regmsg").addClass("alert alert-danger")
        $("#regmsg").text("Please fill in all fields")
        return
    }
    if($("#pass").val() != $("#pass2").val()){
        $("#regmsg").removeClass("alert alert-success")
        $("#regmsg").addClass("alert alert-danger")
        $("#regmsg").text("The passwords are not identical")
        return
    }
    axios.post('/register', {
        first: $("#firstname").val(),
        last: $("#lastname").val(),
        mail: $("#mail").val(),
        pass: $("#pass").val(),
        pass2: $("#pass2").val()
    })
    .then(function(response){
        $("#firstname").val("")
        $("#lastname").val("")
        $("#mail").val("")
        $("#pass").val("")
        $("#pass2").val("")
        $("#startmsg").addClass("alert alert-success")
        $("#startmsg").removeClass("alert alert-danger")
        $("#startmsg").text("Activation link has been sent")
        $("#start").show()
        $("#registration").hide()
        $("#regmsg").text("")
        $("#regmsg").removeClass("alert alert-success")
        $("#regmsg").removeClass("alert alert-danger")
        setTimeout(function(){
            $("#startmsg").removeClass("alert alert-success")
            $("#startmsg").removeClass("alert alert-danger")
            $("#startmsg").text("")
          }, 2000)
    })
    .catch(function(error){
        $("#regmsg").removeClass("alert alert-success")
        $("#regmsg").addClass("alert alert-danger")
        $("#regmsg").text("E-mail address is already used")
    })
}

function changepassshow(){
    $("#login").hide()
    $("#changepass").show()
}

function changepasshide(){
    $("#login").show()
    $("#changepass").hide()
    $("#chanmail").val("")
    $("#chanmsg").text("")
    $("#chanmsg").removeClass("alert alert-success")
    $("#chanmsg").removeClass("alert alert-danger")
}

function changepass(){
    if($("#chanmail").val() == ""){
        $("#chanmsg").removeClass("alert alert-success")
        $("#chanmsg").addClass("alert alert-danger")
        $("#chanmsg").text("Please fill in all fields")
        return
    }
    axios.post('/changepass',{
        mail: $("#chanmail").val()
    })
    .then(function(response){
        $("#login").show()
        $("#changepass").hide()
        $("#chanmail").val("")
        $("#loginmsg").removeClass("alert alert-danger")
        $("#loginmsg").addClass("alert alert-success")
        $("#loginmsg").text("The e-mail has been sent. Please follow the instructions.")
        $("#chanmsg").text("")
        $("#chanmsg").removeClass("alert alert-success")
        $("#chanmsg").removeClass("alert alert-danger")
    })
}

function modtour(name_tour){
    if(Cookies.get('token') ==  undefined){
        $("#startmsg").removeClass("alert alert-success")
        $("#startmsg").addClass("alert alert-danger")
        $("#startmsg").text("User is not logged in")
        setTimeout(function(){
            $("#startmsg").removeClass("alert alert-success")
            $("#startmsg").removeClass("alert alert-danger")
            $("#startmsg").text("")
          }, 2000)
        return
    }
    axios.post('/checkprop', {
        name: name_tour
    })
    .then(function(response){
        if(response.data == 0){
            $("#startmsg").removeClass("alert alert-success")
            $("#startmsg").addClass("alert alert-danger")
            $("#startmsg").text("User is not tournament's host")
            return
        }
        $("#modtour").show()
        act_tour = name_tour
        axios.post('/spons', {
        })
        .then(function(response){
            $("#mspon1").html(response.data)
            $("#mspon2").html(response.data)
            $("#mspon3").html(response.data)
            $("#mspon4").html(response.data)
            $("#mspon5").html(response.data)
        })
    })
}

function modhide(){
    $("#modtour").hide()
    $("#modmsg").text("")
    $("#modmsg").removeClass("alert alert-success")
    $("#modmsg").removeClass("alert alert-danger")
}

function mod(){
    if($("#moddisc").val() == "" || $("#moddat").val() == "" || $("#modreg").val() == ""){
        $("#modmsg").removeClass("alert alert-success")
        $("#modmsg").addClass("alert alert-danger")
        $("#modmsg").text("Please fill in all fields")
        return
    }
    var data1 = $("#modreg").val()
    var data2 = $("#moddat").val()
    var date = new Date().toISOString().slice(0,10);
    if(parseInt(data1.slice(0,4)) > parseInt(data2.slice(0,4))){
        $("#modmsg").text("Registration has to end before the tournament starts")
        $("#modmsg").addClass("alert alert-danger")
        return
    }
    else if(parseInt(data1.slice(0,4)) == parseInt(data2.slice(0,4))){
        if(parseInt(data1.slice(5,7)) > parseInt(data2.slice(5,7))){
            $("#modmsg").text("Registration has to end before the tournament starts")
            $("#modmsg").addClass("alert alert-danger")
            return
        }
        else if(parseInt(data1.slice(5,7)) == parseInt(data2.slice(5,7))){
            if(parseInt(data1.slice(8,10)) > parseInt(data2.slice(8,10))){
                $("#modmsg").text("Registration has to end before the tournament starts")
                $("#modmsg").addClass("alert alert-danger")
                return
            }
        }
    }
    if(parseInt(date.slice(0,4)) > parseInt(data1.slice(0,4))){
        $("#modmsg").text("Registration deadline has to be in the future")
        $("#modmsg").addClass("alert alert-danger")
        return
    }
    else if(parseInt(date.slice(0,4)) == parseInt(data1.slice(0,4))){
        if(parseInt(date.slice(5,7)) > parseInt(data1.slice(5,7))){
            $("#modmsg").text("Registration deadline has to be in the future")
            $("#modmsg").addClass("alert alert-danger")
            return
        }
        else if(parseInt(date.slice(5,7)) == parseInt(data1.slice(5,7))){
            if(parseInt(date.slice(8,10)) > parseInt(data1.slice(8,10))){
                $("#modmsg").text("Registration deadline has to be in the future")
                $("#modmsg").addClass("alert alert-danger")
                return
            }
        }
    }
    axios.post('/mod', {
        name: act_tour,
        reg: $("#modreg").val(),
        dat: $("#moddat").val(),
        disc: $("#moddisc").val(),
        spon1: $("#mspon1").val(),
        spon2: $("#mspon2").val(),
        spon3: $("#mspon3").val(),
        spon4: $("#mspon4").val(),
        spon5: $("#mspon5").val()
    })
    .then(function(response){
        $("#modtour").hide()
        $("#modmsg").text("")
        $("#modmsg").removeClass("alert alert-success")
        $("#modmsg").removeClass("alert alert-danger")
    }) 
    .catch(function(error){
        $("#modmsg").text(error.response.data)
        $("#modmsg").addClass("alert alert-danger")
    })
}

function crtou(){
    if($("#ent").val() == "" || $("#regdead").val() == "" || $("#disc").val() == "" || $("#tourdat").val() == "" || $("#tourname").val() == ""){
        $("#crtoumsg").removeClass("alert alert-success")
        $("#crtoumsg").addClass("alert alert-danger")
        $("#crtoumsg").text("Please fill in all fields")
        return
    }
    var data1 = $("#regdead").val()
    var data2 = $("#tourdat").val()
    var date = new Date().toISOString().slice(0,10);
    if(parseInt(data1.slice(0,4)) > parseInt(data2.slice(0,4))){
        $("#crtoumsg").text("Registration has to end before the tournament starts")
        $("#crtoumsg").addClass("alert alert-danger")
        return
    }
    else if(parseInt(data1.slice(0,4)) == parseInt(data2.slice(0,4))){
        if(parseInt(data1.slice(5,7)) > parseInt(data2.slice(5,7))){
            $("#crtoumsg").text("Registration has to end before the tournament starts")
            $("#crtoumsg").addClass("alert alert-danger")
            return
        }
        else if(parseInt(data1.slice(5,7)) == parseInt(data2.slice(5,7))){
            if(parseInt(data1.slice(8,10)) > parseInt(data2.slice(8,10))){
                $("#crtoumsg").text("Registration has to end before the tournament starts")
                $("#crtoumsg").addClass("alert alert-danger")
                return
            }
        }
    }
    if(parseInt(date.slice(0,4)) > parseInt(data1.slice(0,4))){
        $("#crtoumsg").text("Registration deadline has to be in the future")
        $("#crtoumsg").addClass("alert alert-danger")
        return
    }
    else if(parseInt(date.slice(0,4)) == parseInt(data1.slice(0,4))){
        if(parseInt(date.slice(5,7)) > parseInt(data1.slice(5,7))){
            $("#crtoumsg").text("Registration deadline has to be in the future")
            $("#crtoumsg").addClass("alert alert-danger")
            return
        }
        else if(parseInt(date.slice(5,7)) == parseInt(data1.slice(5,7))){
            if(parseInt(date.slice(8,10)) > parseInt(data1.slice(8,10))){
                $("#crtoumsg").text("Registration deadlinee has to be in the future")
                $("#crtoumsg").addClass("alert alert-danger")
                return
            }
        }
    }
    axios.post('/crtou',{
        ent: $("#ent").val(),
        reg: $("#regdead").val(),
        disc: $("#disc").val(),
        dat: $("#tourdat").val(),
        name: $("#tourname").val(),
        spon1: $("#spon1").val(),
        spon2: $("#spon2").val(),
        spon3: $("#spon3").val(),
        spon4: $("#spon4").val(),
        spon5: $("#spon5").val()
    })
    .then(function(response){
        axios.post('/tourlist', {
            page: page
        })
        .then(function(response){
            $("#tourlist").html(response.data)
            $("#crtou").hide()
            $("#start").show()
            $("#ent").val("")
            $("#regdead").val("")
            $("#disc").val("")
            $("#tourdat").val("")
            $("#tourname").val("")
            $("#crtoumsg").text("")
            $("#crtoumsg").removeClass("alert alert-success")
            $("#crtoumsg").removeClass("alert alert-danger")
        })
        .catch(function(error){
        })
    })
    .catch(function(error){
        $("#crtoumsg").text(error.response.data)
        $("#crtoumsg").addClass("alert alert-danger")
    })
}

function crtouhide(){
    $("#crtou").hide()
    $("#start").show()
    $("#ent").val("")
    $("#regdead").val("")
    $("#disc").val("")
    $("#tourdat").val("")
    $("#tourname").val("")
    $("#crtoumsg").text("")
    $("#crtoumsg").removeClass("alert alert-success")
    $("#crtoumsg").removeClass("alert alert-danger")
}

function matcheshide(){
    $("#matches").hide()
    $("#dettour").show()
    $("#resmsg").text("")
}

function tomat(){
    axios.post('/nummat', {
        name: act_tour
    })
    .then(function(response){
        if(response.data == 1){
            axios.post('/losowanie',{
                name: act_tour
            })
            .then(function(response){
                axios.post('/showmat',{
                    name: act_tour
                })
                .then(function(response){
                    $("#matches").show()
                    $("#dettour").hide()
                    $("#res1").html(response.data[1])
                    $("#res2").html(response.data[2])
                    $("#res3").html(response.data[3])
                    $("#res4").html(response.data[4])
                    $("#res5").html(response.data[5])
                    $("#res6").html(response.data[6])
                    $("#res7").html(response.data[7])
                })
            })
        }
        else{
            axios.post('/showmat',{
                name: act_tour
            })
            .then(function(response){
                $("#matches").show()
                $("#dettour").hide()
                $("#res1").html(response.data[1])
                $("#res2").html(response.data[2])
                $("#res3").html(response.data[3])
                $("#res4").html(response.data[4])
                $("#res5").html(response.data[5])
                $("#res6").html(response.data[6])
                $("#res7").html(response.data[7])
            })
        }
    })
}

function decres(lic, num){
    axios.post('/decres', {
        lic: lic,
        num: num,
        name: act_tour
    })
    .then(function(response){
        $("#resmsg").text("The result has been declared")
        axios.post('/showmat',{
            name: act_tour
        })
        .then(function(response){
            $("#res1").html(response.data[1])
            $("#res2").html(response.data[2])
            $("#res3").html(response.data[3])
            $("#res4").html(response.data[4])
            $("#res5").html(response.data[5])
            $("#res6").html(response.data[6])
            $("#res7").html(response.data[7])
        })
    })
    .catch(function(error){
        $("#resmsg").text(error.response.data)
    })
}