const options = {}

const bodyParser    = require('body-parser');
const express       = require('express');
const app           = express();
var server          = require('http').Server(options, app);
var mysql2           = require('mysql2');
var bcrypt          = require('bcryptjs')
const Sequelize     = require('sequelize')
var cookieParser    = require('cookie-parser');
var uuid            = require('uuid');
const randomInt     =  require('random-int')
var mailer          = require("nodemailer");
var secretpasswd = "xxx"
const Op = Sequelize.Op
const sequelize = new Sequelize('projektpai', 'tennisportal', secretpasswd, {
    host: 'localhost',
    dialect: 'mysql'
  });

var smtpTransport = mailer.createTransport({
    service: "Gmail",
    auth: {
        user: secretpasswd,
        pass: secretpasswd
    }
});

const User = sequelize.define('user', {
    firstname: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastname: {
      type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    license:{
        type: Sequelize.INTEGER
    },
    password:{
        type: Sequelize.STRING
    },
    active:{
        type:Sequelize.BOOLEAN
    },
    token:{
        type: Sequelize.STRING
    },
    activation:{
      type: Sequelize.STRING
    },
    passchange:{
      type: Sequelize.STRING
    }
  }, {
    timestamps: false
  });

const Tournament = sequelize.define('tournament', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    discipline: {
      type: Sequelize.STRING
    },
    host: {
        type: Sequelize.STRING
    },
    maxentries:{
        type: Sequelize.INTEGER
    },
    date:{
        type: Sequelize.DATE
    },
    deadline:{
        type:Sequelize.DATE
    },
    numseeded:{
        type: Sequelize.INTEGER
    },
    numpart:{
        type: Sequelize.INTEGER
    },
    active:{
        type: Sequelize.BOOLEAN
    }
  }, {
    timestamps: false
  });

const Sponsorship = sequelize.define('sponsorship', {
    sponsor_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    tournament_name: {
      type: Sequelize.STRING
    }
  }, {
    timestamps: false
  });

const Sponsor = sequelize.define('sponsor', {
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

const Match = sequelize.define('match', {
    part1_license: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    part2_license: {
      type: Sequelize.INTEGER
    },
    tournament_name:{
        type: Sequelize.STRING
    },
    round:{
        type: Sequelize.INTEGER
    },
    winner:{
        type: Sequelize.INTEGER
    },
    number:{
      type: Sequelize.INTEGER
    },
    winner2: {
      type: Sequelize.INTEGER
    },
    whodec: {
      type: Sequelize.INTEGER
    }
  }, {
    timestamps: false
  });

  const Entry = sequelize.define('entry', {
    participant_license: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    rank: {
      type: Sequelize.INTEGER
    },
    tournament_name:{
        type: Sequelize.STRING
    },
    date:{
      type: Sequelize.DATE
    }
  }, {
    timestamps: false
  });

app.use(express.static('public'));
app.use(bodyParser.json());                                         
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));       
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());                       
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

server.listen(80)

app.post('/logout', function(request, response){
    if(request.cookies.token == undefined){
        response.send(403, "The user is not logged in")
        return
    }
    else{
        User.update({ token: null }, {
            where: {
              token: request.cookies.token
            }
        });
        response.send(200, "The user has been logged out successfully")
        return
    }  
})

app.post('/login', function(request, response){
    User.removeAttribute('id');
    User.findAll({
        where:{email: request.body.mail, active: 1}
    }).then((result) => {             
        if(result.length == 0){
            response.send(403, "Given credentials are invalid")
            return
        }
        pass = result[0].password
        var pass_result = bcrypt.compareSync(request.body.passwd, pass)
        if(pass_result){
            var tokenn = uuid.v4()
            User.update({ token: tokenn }, {
                where: {
                  email: request.body.mail
                }
            });
            response.send(200, tokenn)
            return
        }
        else{
            response.send(403, "Given credentials are invalid")
            return
        }
    })
})

app.post('/register', function(request, response){
    User.removeAttribute('id');
    User.findAll({
      where: {email: request.body.mail}
    }).then((result) => {
      if(result.length != 0){
        response.send(403)
        return
      }
      else{
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(request.body.pass, salt);
        var lic = randomInt(2000000000)
        var act = uuid.v4()
        var acturl ='http://localhost/confirm?act=' + act
        var email = {
          from: "Marek Marek <secretpasswd>",
          to: request.body.mail,
          subject: "Confirmation Link",
          html: '<a href="' + acturl + '">link text</a>'
        }
        smtpTransport.sendMail(email, function(error, response){
          if(error){
              console.log(error);
          }else{
              console.log("Message sent: " + response.message);
          }
      
          smtpTransport.close();
        });
        User.create({email: request.body.mail, firstname: request.body.first, lastname: request.body.last, password: hash, license: lic, active: 0, activation: act})
        response.send(200)
        return
      }
    })
})

app.get('/confirm', function(request, response){
  User.update({ activation: null, active: 1 }, {
    where: {
      activation: request.query.act
    }
  });
  response.send("The account has been activated")
  return
})

app.get('/changep', function(request,  response){
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(request.query.pass, salt);
  User.update({ password: hash }, {
    where: {
      passchange: request.query.passtok
    }
  });
  response.send("The password has been changed.")
  return
})

app.post('/changepass', function(request, response){
  var passtok = uuid.v4()
  User.update({ passchange: passtok }, {
    where: {
      email: request.body.mail
    }
  });
  var chanurl = 'localhost/changep?passtok=' + passtok + '&pass='
  var email = {
    from: "Marek Marek <secretpasswd",
    to: request.body.mail,
    subject: "Password change",
    html: 'Aby zmienić hasło prosimy o skopiowanie i wklejenie w przeglądarce poniższego linku oraz dopisanie na jego końcu nowego hasła: <br> ' + chanurl 
  }
  smtpTransport.sendMail(email, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }

    smtpTransport.close();
  });
  response.send(200)
  return
})

app.post('/crtou', function(request, response){
  Sponsorship.removeAttribute('id')
  User.removeAttribute('id');
  Tournament.removeAttribute('id');
  var tour_name = request.body.name.replace(" ", "_")
  Tournament.findAll({
    where: {name: tour_name}
  }).then((result2) => {
    if(result2.length != 0){
      response.send(403, "Tournament name already exists.")
      return
    }
    User.findAll({
        where: {token: request.cookies.token}
    }).then((result) => {
        var seed = request.body.ent/4
        Tournament.create({
          name: tour_name, discipline: request.body.disc, host: result[0].email, date: request.body.dat, maxentries: request.body.ent, active: 1, deadline: request.body.reg, numseeded: seed
        }).then((result2)=>{
          if(request.body.spon1 != ""){
            Sponsorship.create({sponsor_name: request.body.spon1, tournament_name: request.body.name.replace(' ', '_')})
          }
          if(request.body.spon2 != ""){
            Sponsorship.create({sponsor_name: request.body.spon2, tournament_name: request.body.name.replace(' ', '_')})
          }
          if(request.body.spon3 != ""){
            Sponsorship.create({sponsor_name: request.body.spon3, tournament_name: request.body.name.replace(' ', '_')})
          }
          if(request.body.spon4 != ""){
            Sponsorship.create({sponsor_name: request.body.spon4, tournament_name: request.body.name.replace(' ', '_')})
          }
          if(request.body.spon5 != ""){
            Sponsorship.create({sponsor_name: request.body.spon5, tournament_name: request.body.name.replace(' ', '_')})
          }
          response.send(200)
          return
        }).catch((result5) =>{
          response.send(403, "The date is in invalid format")
          return
        })
      })
  })  
})

app.post('/mod', function(request, response){
  Sponsorship.removeAttribute('id')
  Tournament.removeAttribute('id')
  Tournament.update(
    {discipline: request.body.disc, date: request.body.dat, deadline: request.body.reg}, {where: {name: request.body.name}}
  ).then((result6)=>{
    Sponsorship.destroy({
      where: {tournament_name: request.body.name}
    }).then((result) =>{
      if(request.body.spon1 != ""){
        Sponsorship.create({sponsor_name: request.body.spon1, tournament_name: request.body.name.replace(' ', '_')})
      }
      if(request.body.spon2 != ""){
        Sponsorship.create({sponsor_name: request.body.spon2, tournament_name: request.body.name.replace(' ', '_')})
      }
      if(request.body.spon3 != ""){
        Sponsorship.create({sponsor_name: request.body.spon3, tournament_name: request.body.name.replace(' ', '_')})
      }
      if(request.body.spon4 != ""){
        Sponsorship.create({sponsor_name: request.body.spon4, tournament_name: request.body.name.replace(' ', '_')})
      }
      if(request.body.spon5 != ""){
        Sponsorship.create({sponsor_name: request.body.spon5, tournament_name: request.body.name.replace(' ', '_')})
      }
      
      response.send(200)
      return
    })
  }).catch((result7)=>{
    response.send(403, "The date is in invalid format.")
    return
  })
})

app.post('/spons', function(request, response){
  Sponsor.removeAttribute('id');
  Sponsor.findAll().then((result) => {
    var resp = '<option value=""></option>'
    for(var i=0; i<result.length; i++){
      resp += '<option value="' + result[i].name + '">' + result[i].name + '</option>'
    }
    response.send(200, resp)
    return
  })
})

app.post('/mytur', function(request, response){
  User.removeAttribute('id')
  Entry.removeAttribute('id')
  User.findAll({
    where: {token: request.cookies.token}
  }).then((result) => {
    var lic = result[0].license
    Entry.findAll({
      where: {participant_license: lic}
    }).then((result2) => {
      var tabdata = "<table><tr><th>Tournament name</th><th>Date</th></tr>"
      for(var i = 0; i<result2.length; i++){
        tabdata += "<tr><td>" + result2[i].tournament_name.replace('_', ' ') + "</td><td>" + result2[i].date + "</td></tr>"
      }
      tabdata += "</table>"
      response.send(200, tabdata)
      return
    })
  })
})

app.post('/myma', function(request, response){
  User.removeAttribute('id')
  Match.removeAttribute('id')
  User.findAll({
    where: {token: request.cookies.token}
  }).then((result) => {
    var lic = result[0].license
    Match.findAll({
    }).then((result2) => {
      User.findAll(
      ).then((result3)=>{
        var tabdata = "<table><tr><th>Player 1</th><th>Player 2</th><th>Tournament name</th></tr>"
        for(var i = 0; i<result2.length; i++){
          var name1 = ""
          var name2 = ""
          if(result2[i].part1_license != lic && result2[i].part2_license != lic){
            continue
          }
          for(var j = 0; j < result3.length; j++){
            if(result3[j].license == result2[i].part1_license){
              name1 = result3[j].firstname + ' ' + result3[j].lastname
            }
            if(result3[j].license == result2[i].part2_license){
              name2 = result3[j].firstname + ' ' + result3[j].lastname
            }
          }
          tabdata += "<tr><td>" + name1 + "</td><td>" + name2 + "</td><td>" + result2[i].tournament_name +"</td></tr>"
        }
        tabdata += "</table>"
        response.send(200, tabdata)
        return
      })
    })
  })
})

app.post('/tourlist', function(request, response){
  Tournament.removeAttribute('id')
  var start = request.body.page * 10
  var stop = start + 10
  Tournament.findAll({
    where: {active: 1},
    order: [['name', 'ASC']]
  }).then((result) =>{
    if(start >= result.length || start < 0){
      response.send(403)
      return
    }
    var res = "<table><tr><th>Tournament name</th><th>See details</th><th>Modify</th></tr>"
    for(var i = start; i < stop; i++){
      if(result[i] == undefined){
        break
      }
      res += "<tr><td>" + result[i].name.replace('_', ' ') + "</td><td><button onclick=dettour('" + result[i].name + "') type='button' class='btn btn-light'>Details</button></td>" 
      res += "<td><button onclick=modtour('" + result[i].name + "') type='button' class='btn btn-light'>Modify</button></td>"
    }
    res += "</table>"
    response.send(200, res)
    return
  })
})

app.post('/searchtour', function(request, response){
  Tournament.removeAttribute('id')
  Tournament.findAll({
    where: {name: request.body.name.replace(' ', '_')}
  }).then((result) =>{
    var res = "<table><tr><th>Tournament name</th><th>See details</th><th>Modify</th></tr>"
    if(result[0] != undefined){
      res += "<tr><td>" + result[0].name.replace('_', ' ') + "</td><td><button onclick=dettour('" + result[0].name + "') type='button' class='btn btn-light'>Details</button></td>" 
      res += "<td><button onclick=modtour('" + result[0].name + "') type='button' class='btn btn-light'>Modify</button></td>"
    }
    res += "</table>"
    response.send(200, res)
    return
  })
})

app.post('/dettour', function(request, response){
  Tournament.removeAttribute('id')
  User.removeAttribute('id')
  Sponsorship.removeAttribute('id')
  Tournament.findAll({
    where: {name: request.body.name}
  }).then((result) =>{
    var name = result[0].name
    var discipline = result[0].discipline
    var maxentries = result[0].maxentries
    var date1 = result[0].date
    var date2 = result[0].deadline
    var host = result[0].host
    User.findAll({
      where: {email: host}
    }).then((result2) =>{
      var host2 = result2[0].firstname + " " + result2[0].lastname
      var res = "<table><tr><td>Tournament name</td><td>" + name.replace('_', ' ') + "</td></tr><tr><td>Discipline</td><td>" + discipline + "</td></tr>" +
      "<tr><td>Date</td><td>" + date1 + "</td></tr><tr><td>Registration deadline</td><td>" + date2 + "</td></tr><tr><td>Host</td><td>" + host2 + "</td></tr>" +
      "<tr><td>Maximum entries</td><td>" + maxentries + "</td></tr></table><br>"
      Sponsorship.findAll({
        where: {tournament_name: name}
      }).then((result3)=>{
        for(var i=0; i<result3.length; i++){
          res += '<img src="' + result3[i].sponsor_name + '.jpg" width="100" height="100"></img>'
        }
        res += "<br>"
        response.send(200, res)
        return
      })
    }) 
  })
})

app.post('/checkprop', function(request, response){
  Tournament.removeAttribute('id')
  User.removeAttribute('id')
  var res = 0
  User.findAll({
    where: {token: request.cookies.token}
  }).then((result) =>{
    Tournament.findAll({
      where: {
        host: result[0].email,
        name: request.body.name
      }
    }).then((result2) =>{
      if(result2.length == 0){
        response.send(200, res)
        return
      }
      else{
        res = 1
        response.send(200, res)
        return
      }
    })
  })
})

app.post('/regtour', function(request, response){
  User.removeAttribute('id')
  Entry.removeAttribute('id')
  Tournament.removeAttribute('id')
  User.findAll({
    where: {token: request.cookies.token}
  }).then((result)=>{
    var lic = result[0].license
    Entry.findAll({
      where: {participant_license: lic, tournament_name: request.body.name}
    }).then((result2)=>{
      if(result2.length != 0){
        response.send(403, "The user is already registered in this tournament")
        return
      }
      Entry.findAll({
        where: {tournament_name: request.body.name, rank: request.body.rank}
      }).then((result3)=>{
        if(result3.length != 0){
          response.send(403, "Given rank exists in this tournament")
          return
        }
        Tournament.findAll({
          where: {name: request.body.name}
        }).then((result4)=>{
          var maxent = result4[0].maxentries
          var dat = result4[0].deadline
          var start_date = result4[0].date
          Entry.findAll({
            where: {tournament_name: request.body.name}
          }).then((result5)=>{
            if(result5.length == maxent){
              response.send(403, "You can no longer register in this tournament")
              return
            }
            var date = new Date().toISOString().slice(0,10);
            if(parseInt(date.slice(0,4)) > parseInt(dat.slice(0,4))){
              response.send(403, "You can no longer register in this tournament")
              return
            }
            else if(parseInt(date.slice(0,4)) == parseInt(dat.slice(0,4))){
              if(parseInt(date.slice(5,7)) > parseInt(dat.slice(5,7))){
                response.send(403, "You can no longer register in this tournament")
                return
              }
              else if(parseInt(date.slice(5,7)) == parseInt(dat.slice(5,7))){
                  if(parseInt(date.slice(8,10)) > parseInt(dat.slice(8,10))){
                      response.send(403, "You can no longer register in this tournament")
                      return
                  }
              }
            }
            Entry.create(
              {tournament_name: request.body.name, participant_license: lic, rank: request.body.rank, date: start_date}
            ).then((result10) =>{
              response.send(200)
              return
            }).catch((result11) =>{
              response.send(404, "Your rank must be a number value")
              return
            })
          })
        })
      })
    })
  })
})

app.post('/nummat', function(request, response){
  Match.removeAttribute('id')
  Tournament.removeAttribute('id')
  var date = new Date().toISOString().slice(0,10);
  Tournament.findAll({
    where: {name: request.body.name}
  }).then((result)=>{
    var deadline = result[0].deadline
    if(parseInt(deadline.slice(0,4)) > parseInt(date.slice(0,4))){
      response.send(200, 0)
      return
    }
    else if(parseInt(deadline.slice(0,4)) == parseInt(date.slice(0,4))){
      if(parseInt(deadline.slice(5,7)) > parseInt(date.slice(5,7))){
        response.send(200, 0)
        return
      }
      else if(parseInt(deadline.slice(5,7)) == parseInt(date.slice(5,7))){
          if(parseInt(deadline.slice(8,10)) > parseInt(date.slice(8,10))){
              response.send(200, 0)
              return
          }
      }
    }
    Match.findAll({
      where: {tournament_name: request.body.name}
    }).then((result2)=>{
      if(result2.length == 0){
        response.send(200, 1)
        return
      }
      else{
        response.send(200, 0)
        return
      }
    })
  })
})

app.post('/losowanie', function(request, response){
  Entry.removeAttribute('id')
  Tournament.removeAttribute('id')
  Match.removeAttribute('id')
  Entry.findAll({
    where: {tournament_name: request.body.name},
    order: [['rank', 'ASC']]
  }).then((result)=>{
    if(result.length < 4){
      Tournament.update({ active: 0 }, {
        where: {
          name: request.body.name
        }
      }).then((ress)=>{
        Entry.destroy({
          where: {tournament_name: request.body.name}
        })
      })
      response.send(200)
      return
    }
    if(result.length < 8){
      CutEnt(result[3].rank, 4, request.body.name)
    }
    else if(result.length < 16){
      CutEnt(result[7].rank, 8, request.body.name)
    }
    else if(result.length < 32){
      CutEnt(result[15].rank, 16, request.body.name)
    }
    else if(result.length < 64){
      CutEnt(result[31].rank, 32, request.body.name)
    }
    else if(result.length < 128){
      CutEnt(result[63].rank, 64, request.body.name)
    }
    else{
      CutEnt(result[127].rank, 128, request.body.name)
    }
    setTimeout(function(){
      Entry.findAll({
        where: {tournament_name: request.body.name},
        order: [['rank', 'ASC']]
      }).then((result2)=>{
        Tournament.findAll({
          where: {name: request.body.name}
        }).then((result3)=>{
          for(var i = 0; i < result2.length/2; i++){
            Match.create({part1_license: result2[i].participant_license, part2_license: result2[result2.length-1-i].participant_license, tournament_name: request.body.name, round: 1, number: i+1})
  
          }
        })
        response.send(200)
        return
      })
    }, 1000)
  })
})

function CutEnt(rank, part_num, name){
  Tournament.removeAttribute('id')
  Entry.removeAttribute('id')
  Tournament.update({numpart: part_num}, {where: {name: name}})
  Entry.destroy({where: {tournament_name: name, rank:{[Op.gt]: rank}}})
}

app.post('/showmat', function(request, response){
  Match.removeAttribute('id')
  Match.findAll({
    where: {tournament_name: request.body.name},
    order: [['round', 'ASC'], ['number', 'ASC']]
  }).then((result)=>{
    User.findAll(
    ).then((result2)=>{
      var round = 0
      var res = []
      var str_html = "<table>"
      for(var i = 0; i < result.length; i++){
        var name1 = ""
        var name2 = ""
        for(var el of result2){
          if(el.license == result[i].part1_license){
            name1 = el.firstname + ' ' + el.lastname
          } 
          if(el.license == result[i].part2_license){
            name2 = el.firstname + ' ' + el.lastname
          }
        }
        if(result[i].round == round){
          str_html += "<tr><td>" + name1 + "</td><td>" + "<button onclick=decres('" + result[i].part1_license + "','" + result[i].number + "') type='button' class='btn btn-light'>Winner</button></td></tr>"
          str_html += "<tr><td>" + name2 + "</td><td>" + "<button onclick=decres('" + result[i].part2_license + "','" + result[i].number + "') type='button' class='btn btn-light'>Winner</button></td></tr>"
          str_html += "<tr><td>---------------</td><td>---------------</td></tr>"
        }
        else{
          str_html += "</table>"
          res[round] = str_html
          round = result[i].round
          str_html = "<table>"
          str_html += "<tr><td>" + name1 + "</td><td>" + "<button onclick=decres('" + result[i].part1_license + "','" + result[i].number + "') type='button' class='btn btn-light'>Winner</button></td></tr>"
          str_html += "<tr><td>" + name2 + "</td><td>" + "<button onclick=decres('" + result[i].part2_license + "','" + result[i].number + "') type='button' class='btn btn-light'>Winner</button></td></tr>"
          str_html += "<tr><td>---------------</td><td>---------------</td></tr>"
        }
      }
      str_html += "</table>"
      res[round] = str_html
      response.send(200, res)
      return
    })
  })
})

app.post('/decres', function(request, response){
  Match.removeAttribute('id')
  User.removeAttribute('id')
  Tournament.removeAttribute('id')
  Tournament.findAll({
    where: {name: request.body.name}
  }).then((result6)=>{
    var date = new Date().toISOString().slice(0,10);
    var date2 = result6[0].date
    if(parseInt(date2.slice(0,4)) > parseInt(date.slice(0,4))){
      response.send(403, "The tournament has not started yet.")
      return
    }
    else if(parseInt(date2.slice(0,4)) == parseInt(date.slice(0,4))){
      if(parseInt(date2.slice(5,7)) > parseInt(date.slice(5,7))){
        response.send(403, "The tournament has not started yet.")
        return
      }
      else if(parseInt(date2.slice(5,7)) == parseInt(date.slice(5,7))){
          if(parseInt(date2.slice(8,10)) > parseInt(date.slice(8,10))){
              response.send(403, "The tournament has not started yet.")
              return
          }
      }
    }
    Match.findAll({
      where: {number: request.body.num, tournament_name: request.body.name}
    }).then((result) =>{
      if(result[0].whodec == request.cookies.token){
        response.send(403, "You have already declared the result of this match")
        return
      }
      if(result[0].winner != null && result[0].winner2 != null){
        response.send(403, "Result of this match has been already declared")
        return
      }
      User.findAll({
        where: {token: request.cookies.token}
      }).then((result2)=>{
        if(result2[0].license != result[0].part1_license && result2[0].license != result[0].part2_license){
          response.send(403, "You are not allowed to declare the result of this match")
          return
        }
        if(result[0].winner == null){
          Match.update({ winner: request.body.lic, whodec: request.cookies.token }, {
            where: {
              tournament_name: request.body.name,
              number: request.body.num
            }
          })
          response.send(403, "The result has been declared")
          return
        }
        else if(result[0].winner != request.body.lic){
          Match.update({ winner: null, whodec: null }, {
            where: {
              tournament_name: request.body.name,
              number: request.body.num
            }
          })
          response.send(403, "The participant declared different winners")
          return
        }
        else{
          Match.update({ winner2: request.body.lic }, {
            where: {
              tournament_name: request.body.name,
              number: request.body.num
            }
          }).then((result3)=>{
            Tournament.findAll({
              where: {name: request.body.name}
            }).then((result4)=>{
              var numb = parseInt(request.body.num) + parseInt(result4[0].numpart)/2 - Math.floor(parseInt(request.body.num)/2)
              if(request.body.num == result4[0].numpart-1){
                Tournament.update({active: 0}, {
                  where: {name: request.body.name}
                })
                response.send(403, "The tournament has been ended.")
                return
              }
              Match.findAll({
                where: {tournament_name: request.body.name, number: numb}
              }).then((result5)=>{
                if(result5.length == 0){
                  Match.create({part1_license: request.body.lic, tournament_name: request.body.name, round: result[0].round+1, number: numb})
                }
                else{
                  Match.update({ part2_license: request.body.lic }, {
                    where: {
                      number: numb
                    }
                  })
                }
                setTimeout(function(){
                  response.send(200)
                  return
                }, 500)
              })
            }) 
          })
        }
      })
    })
  })
  
})