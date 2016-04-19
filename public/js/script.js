
var socket = io()
var manchester = 'https://www.betbrain.com/football/south-america/copa-libertadores/atletico-nacional-de-medellin-v-atletico-huracan/1x2/full-time-excluding-overtime/?only=true&_=1461093755063'
$('.manchester').click(function(){
    socket.emit('refreReq', manchester)
    console.log('clicked');
})
var count

//when i click on manchester its sends the variable with link
socket.on('refreRes',function(data){
var done = data.done
  if(done === 'done'){
    var output =   $.getJSON( './clicked.json', function(data){
      var items = [];

      $.each( data, function( key, val ) {
        if (key === 'count') {
          count = val
        }else if(key.substring(0,7)=== "website"){
          $(".dates").append('<li class="'+key+'">'+val+'</li>');
        }else if(key.substring(0,4)=== "asso"){
          $(".dates").append('<li class="'+key+'">'+val+'</li>');
        }else if(key.substring(0,2)=== "xi"){
          $(".dates").append('<li class="'+key+'">'+val+'</li>');
        }else if(key.substring(0,5)=== "diplo"){
          $(".dates").append('<li class="'+key+'">'+val+'</li>');
        }
      //   }else{
      // $(".dates").append('<li class="'+key+'">'+val+'</li>');
      // }
      });
      setInterval(function(){
        socket.emit('refreshingPending',manchester)
      },3000)
    })
  }
})


/*green  #68B118*/
/*red    #C60018*/

socket.on('refreshingDone',function(data){
  var output =   $.getJSON( './refreshed.json', function(data){
    var childsLi = $('.dates li').length
    var items = [];
    var countR;
    $.each( data, function( key, val ) {
      if ((countR > count) || (countR < count)) {
        $.each(data,function(key, val){
          var newL = key.substring(0,6)
          if (($('.'+key).val()) !== val) {
            var newL = key.substring(7)
            var assoNl = 'asso' + newL
            var diploNl = 'diplo' + newL
            var xiNl = 'xi' + newL
            $(".dates").append('<li class=website"'+(countR + 1) +'">'+val+'</li>');
            $(".dates").append('<li class=asso"'+(countR + 1) +'">'+data[assoNl]+'</li>');
            $(".dates").append('<li class=xi"'+(countR + 1) +'">'+data[xiNl]+'</li>');
            $(".dates").append('<li class=diplo"'+(countR + 1) +'">'+data[diploNl]+'</li>');
          }
        })
      }else{
       if(key.substring(0,5) === 'count'){
        countR = val
      }else if($('.'+key).text() > val){
        $("."+key).css('background','#C60018')
        $("."+key).text(val)
      }else if($('.'+key).text() < val){
        $("."+key).css('background','#68B118')
        $("."+key).text(val)
      }else if (key.substring(0,7)=== "website"){
        $("."+key).text(val)
      }else{
        $("."+key).text(val)
      }
    }
  })
})

})
