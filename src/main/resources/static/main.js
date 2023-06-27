var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#main');
var usernameForm = document.querySelector('#usernameForm');
var usernameInput = document.querySelector('#usernameInput');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#messageInput');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');


//step 1
stompClient = null;
username = null;



//step 3
function connect(e){
	e.preventDefault();
	username = usernameInput.value.trim();
	
	if(username){
		usernamePage.classList.add('hidden')
		chatPage.classList.remove('hidden');
		
		//				//bole dicchi j eikhane amar msg send hobe
		var socket = SockJS("/ws");
		stompClient = Stomp.over(socket);		
		stompClient.connect({}, onConnected, onError);	
	}	
}


//step 4
function onConnected(){
	//ekhon ami Endpoint er sathe connect hoichi
	//NOW i have to connect to this specific `channel` using subscribe() function
	stompClient.subscribe("/topic/public", onMessageReceived);
	
	
	//connect hoyar somoy ekta messgae pathacchi j user connect hoiche
	// Tell your username to the server
    stompClient.send("/app/chat.addUser", {}, JSON.stringify({sender:username, type: 'JOIN'}));	
	
	connectingElement.classList.add("hidden");
}


//step 4.2
function onError(){
	connectingElement.classList.remove("hidden");		
	connectingElement.textContent = "Unable to connect";
	connectingElement.style.color = 'red';
}



//step 5
function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);    
	
    var messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        messageElement.classList.add('text-muted');
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style.backgroundColor = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }



    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}




var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

//WHEN chat msg receive hobe 
function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}




//step 7:
function sendMessage(e){
	e.preventDefault();
	
	var messageContent = messageInput.value.trim();
	
	if(messageContent && stompClient){		
		var chatMsg =  {
			sender: username,
			type :"CHAT",
			content:messageContent
		}		
		stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMsg))
		messageInput.value = "";	
	}
	
}



//user Name submit korle connect korte bolbo
//step 2: 
usernameForm.addEventListener('submit', connect);

//step 6
messageForm.addEventListener('submit', sendMessage);

