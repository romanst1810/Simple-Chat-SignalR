using Microsoft.AspNet.SignalR;
using SampleChat.Models;

namespace SampleChat.Hubs
{
    public class ChatHub : Hub
    {
        public void SendMessage(ChatMessage chatMessage)
        {
            Clients.All.broadcastMessage(chatMessage.Group, chatMessage.Name, chatMessage.Message);
        }
    }
}
