<?php

namespace App\GraphQL\Mutations;

use App\Models\Message;
use Illuminate\Support\Facades\Auth;
use App\Events\MessageSent;
use App\Models\Notification;
use App\Models\Ticket;
class SendMessage
{
   public function __invoke($_, array $args)
{
    $user = Auth::user();

    $input = $args['input'];

    $message = Message::create([
        'ticket_id' => $input['ticket_id'],
        'body' => $input['body'],
        'sender_id' => $user->id,
    ]);

    // ✅ تحميل علاقة sender
    $message->load('sender');

    // ✅ إرسال الحدث (البث المباشر)
    event(new MessageSent($message));

    $ticket = Ticket::find($input['ticket_id']);
            Notification::create([
                'user_id' => $ticket->user_id,
                'message' => "You have a new message on ticket #{$ticket->number} from {$user->username}",
            ]);
    // ✅ إرجاع الرسالة كاملة
    return $message;
}

}