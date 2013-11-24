// PeerJS object

function setupCall(localID, ondone) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    navigator.getUserMedia({audio: true, video: true}, function(stream) {
        window.localstream = stream;

        var myVideo = document.querySelector("#outgoing");
        myVideo.src = URL.createObjectURL(stream);
        ondone();
    }, function() {
        console.log("error");
    });

    var peer = new Peer(localID, {
        key: 'lwjd5qra8257b9',
        debug: 3,
        config: {'iceServers': [ { url: 'stun:stun.l.google.com:19302' }]}
    });

    peer.on('open', function (id) {
        console.log('my id is ' + id);
    });

    peer.on('call', function (call) {
        call.answer(window.localstream);

        call.on('stream', function(stream){
            console.log("got stream");
            var theirVideo = document.querySelector("#incoming");
            theirVideo.src = URL.createObjectURL(stream);
        });
    });

    var call;

   return {
        callSomeone: function (otherid) {
            if(call == null){
                call = peer.call(otherid, window.localstream);
                call.on('stream', function(stream){
                    var theirVideo = document.querySelector("#incoming");
                    theirVideo.src = URL.createObjectURL(stream);
                });
            }
        },
        endCall: function() {
            call.close();
            call = null;
        }
   };
}


