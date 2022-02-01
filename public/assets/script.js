const scrollDown = ()=>{
    var messagebody = document.getElementById("messagebody");
    messagebody.scrollTop = messagebody.scrollHeight;
}

const appendMessage = (name, message, time) =>{
    $("#messagebody").append('<div class="d-flex align-items-baseline mb-4"><div class="position-relative"><div class="pe-2"><div class="card card-text d-inline-block p-2 px-3 m-1"><span class="text-muted">'+name+' :</span><br>'+message+'</div><div class="small">'+time+'</div></div></div></div>')
}

const sendMessage=() =>{
    var message = document.getElementById("messagebox").value ; 
    if(message!=''){
        $("#messagebody").append('<div class="d-flex align-items-baseline text-end justify-content-end mb-4"> <div class="pe-2"><div class="card card-text d-inline-block p-2 px-2 m-1">'+message+'</div><div class="small">02:03PM</div></div></div>') 
        document.getElementById("messagebox").value = "";
        console.log(message)
    }
 
 }

 