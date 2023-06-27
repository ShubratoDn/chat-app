package com.chatapp.contorller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.chatapp.model.ChatMessage;


@Controller
public class ChatController {

	//url that will use to  invoke the sendMessage() method
	@MessageMapping("/chat.sendMessage")
	@SendTo("/topic/public") //websocketConfig class a /topic ta define kora ache
	public ChatMessage sendMessage(@Payload ChatMessage chatMessage) {
		
		return chatMessage;
	}
	
	@MessageMapping("/chat.addUser")
	@SendTo("/topic/public") 	
	public ChatMessage addUser(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor header) {		
		//eta kortesi karon: adding the userName to the websocket session
		header.getSessionAttributes().put("username", chatMessage.getSender());
		System.out.println("User is " + chatMessage.getSender());
		return chatMessage;		
	}
}
