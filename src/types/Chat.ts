export interface ChatUser {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  time: string;
}

export interface Message {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
}
