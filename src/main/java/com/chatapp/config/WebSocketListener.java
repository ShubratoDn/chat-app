package com.chatapp.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.chatapp.model.ChatMessage;
import com.chatapp.model.ChatMessage.MessageType;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j //logger field banay 
public class WebSocketListener {
	
		@Autowired
		private SimpMessageSendingOperations messagingTemplates;
	
		//user connect hoile
	    @EventListener
	    public void handleWebSocketConnectListener(SessionConnectedEvent event) {			
	        log.info("Received a new web socket connection");
	        System.out.println("User connected" );
	    }
	
		
		//user disconnect hoile
		@EventListener
		public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
			//session event theke message ta header e antechi
			StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
			
			
			//username ta session theke ber kortechi jeita Controller a define kora ache
			String username =(String) headerAccessor.getSessionAttributes().get("username");
			
			if(username != null) {
				log.info("User Disconnected : {}"+ username);
				System.out.println("User Disconnected");

				
//				ChatMessage msg = new ChatMessage();
//				msg.setType(ChatMessage.MessageType.LEAVE);
//				msg.setSender(username);
				//same kaj korbe
				var msg = ChatMessage.builder()
							.type(MessageType.LEAVE)
							.sender(username)
							.build();
						
				
				
				//message send korar jonno
				//								  //ei path a msg send hobe
				messagingTemplates.convertAndSend("/topic/public", msg);
			}
			
		}
	
}
