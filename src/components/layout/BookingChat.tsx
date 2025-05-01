import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client"; // Your custom createClient function
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getMessages, sendMessages } from "@/app/actions/chat-actions";

interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  created_at: string;
}

interface BookingChatPageProps {
  bookingId: string;
  userId: string;
  organizerId: string; // Pass the organizer's name
  name: string;
}

export default function BookingChatPage({ bookingId, userId, organizerId, name }: BookingChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId || !organizerId) return;

    async function fetchMessages() {
      const { success, data, error } = await getMessages(bookingId);
      if (success) {
        setMessages(data as ChatMessage[]);
        scrollToBottom();
      } else {
        toast.error("Failed to fetch messages: " + error);
      }
    }

    fetchMessages();

    const supabase = createClient();

    const channel = supabase
      .channel('chat:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const msg: ChatMessage = payload.new as ChatMessage;
        if (
          (msg.sender_id === userId && msg.receiver_id === organizerId) ||
          (msg.sender_id === organizerId && msg.receiver_id === userId)
        ) {
          setMessages((prev) => [...prev, msg]);
          scrollToBottom();
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId, userId, organizerId]);

  function scrollToBottom() {
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 100);
  }

  async function sendMessage() {
    if (!newMessage.trim()) return;
    setLoading(true);

    const { error } = await sendMessages({
      bookingId,
      senderId: userId,
      receiverId: organizerId,
      text: newMessage,
    });

    if (error) {
        console.log(error);
        
      toast.error("Failed to send message");
    } else {
      setNewMessage("");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Chat with {name}</h2>
      <div ref={chatRef} className="h-fit min-h-[50px] max-h-[400px] overflow-y-auto border rounded-md p-4 space-y-2 bg-muted/30">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs px-4 py-2 rounded-md text-sm ${
              msg.sender_id === userId
                ? "border-1 text-black ml-auto text-right"
                : "bg-gray-200 text-black mr-auto text-left"
            }`}
          >
            {/* Display the tag for the sender */}
            <div className="font-semibold mb-1">
              {msg.sender_id === userId ? "You" : "Other"}
            </div>
            <p>{msg.text}</p>
            <span className="text-xs text-muted-foreground block mt-1">
              {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="mt-4 flex gap-2"
      >
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="submit" disabled={loading || !newMessage.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}
