<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Message;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct(Message $message)
    {
        $this->message = $message->load('sender'); // تحميل العلاقة
    }

    public function broadcastOn()
    {
        return new PrivateChannel('ticket.' . $this->message->ticket_id);
    }

    public function broadcastWith(): array
    {
        \Log::info("Broadcasting message", [
        'message_id' => $this->message->id,
        'sender' => $this->message->sender->toArray(),
    ]);
        return [
            'message' => [
                'id' => $this->message->id,
                'ticket_id' => $this->message->ticket_id,
                'body' => $this->message->body,
                'created_at' => $this->message->created_at->toISOString(),
                'sender' => [
                    'id' => $this->message->sender->id,
                    'username' => $this->message->sender->username,
                    'email' => $this->message->sender->email,
                ],
            ],
        ];
    }
}
