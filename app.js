var fs      = require('fs')
var request = require('request')
var cheerio = require('cheerio')
var socket =  require('module')
var app = require('express')()
var express = require('express')
var http = require('http').Server(app)
var io = require('socket.io')(http)
var colors  = require('colors')


var refri = function(sait){
request({
  url: sait,
  jar:  true
}, function(error, response, html){
  if(!error){
    var $ = cheerio.load(html)
    var website,asso,xi,diplo;
    var json = {}
    $('#paramGroup-rtf_m999d888').filter(function(){
      var count =  $('ul[id*="rtf_m999d888_1_300"]').length
      console.log(count);
      json['count'] = count
      for (var i = 1; i < count+1; i++) {
        website = $('#paramGroup-rtf_m999d888 ul:nth-child('+i+') .OTBookies .OTBH .OTBookieLink .OTBookie').text()
        var webNum   = 'website'+ i
        var assoNum  = 'asso'+ i
        var xiNum    = 'xi'+ i
        var diploNum = 'diplo'+ i
        json[webNum] = website;
        asso = $('#paramGroup-rtf_m999d888 ul:nth-child('+i+') .OTCol1 a').text()
        asso = asso.replace(/[^0-9.-]/g, '')
        json[assoNum] = asso
        xi = $('#paramGroup-rtf_m999d888 ul:nth-child('+i+') .OTCol2 a').text()
        xi = xi.replace(/[^0-9.-]/g, '')
        json[xiNum] = xi
        diplo = $('#paramGroup-rtf_m999d888 ul:nth-child('+i+') .OTCol3 a').text()
        diplo = diplo.replace(/[^0-9.-]/g, '')
        json[diploNum] = diplo
      }
    })
  }
  fs.writeFile('public/clicked.json', JSON.stringify(json, null, 4), function(err){
      console.log(' File successfuly written!');
      io.emit('refreRes', {done:'done'})
    })
  })
}


// REFRESH
var refreshing = function(sait){
request({
  url: sait,
  jar:  true
}, function(error, response, html){
  if(!error){
    var $ = cheerio.load(html)
    var website,asso,xi,diplo;
    var json = {}
    $('#paramGroup-rtf_m999d888').filter(function(){
      var count =  $('ul[id*="rtf_m999d888_1_300"]').length
      console.log(count);
      json['count'] = count
      for (var i = 1; i < count+1; i++) {
        website = $('#paramGroup-rtf_m999d888 ul:nth-child('+i+') .OTBookies .OTBH .OTBookieLink .OTBookie').text()
        var webNum   = 'website'+ i
        var assoNum  = 'asso'+ i
        var xiNum    = 'xi'+ i
        var diploNum = 'diplo'+ i
        json[webNum] = website;
        asso = $('#paramGroup-rtf_m999d888 ul:nth-child('+i+') .OTCol1 a').text()
        asso = asso.replace(/[^0-9.-]/g, '')
        json[assoNum] = asso
        xi = $('#paramGroup-rtf_m999d888 ul:nth-child('+i+') .OTCol2 a').text()
        xi = xi.replace(/[^0-9.-]/g, '')
        json[xiNum] = xi
        diplo = $('#paramGroup-rtf_m999d888 ul:nth-child('+i+') .OTCol3 a').text()
        diplo = diplo.replace(/[^0-9.-]/g, '')
        json[diploNum] = diplo
      }
    })
  }
  fs.writeFile('public/refreshed.json', JSON.stringify(json, null, 4), function(err){
      console.log(' File successfuly written!');
      io.emit('refreshingDone', {done:'done'})
    })
  })
}
// REFRESH FINISH
app.use(express.static(__dirname + '/public'));
app.get('/',function(req, res){
 res.sendFile(__dirname + '/views/index.html')
})

io.on('connection',function(socket){
  socket.on('refreReq', function(site){
    refri(site)
  })
  socket.on('refreshingPending', function(site){
    refreshing(site)
  })
})

http.listen(8123, function(){
  console.log('8123 done');
})
