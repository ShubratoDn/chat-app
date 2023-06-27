package com.chatapp.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {

	private String content;
	private String sender;
	private MessageType type;
	
	//enum hocche a varible that store a set of pre-defined data
	public enum MessageType{
		CHAT,
		JOIN,
		LEAVE,
	}
	                           
}
