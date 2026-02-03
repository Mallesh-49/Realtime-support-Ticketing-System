<?php

// app/GraphQL/Mutations/TicketMutator.php

namespace App\GraphQL\Mutations;

use App\Models\Ticket;
use App\Models\Message;
use App\Models\User;
use App\Models\Notification;
use App\Events\TicketMessageSent;
use App\Mail\TicketStatusChanged;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;


class TicketMutator
{
    public function create($_, array $args)
    {
        $user = Auth::user();

        return Ticket::create([
            'title' => $args['input']['title'],
            'description' => $args['input']['description'],
            'user_id' => $user->id,
        ]);
    }

    public function close($_, array $args)
{
    $ticket = Ticket::findOrFail($args['id']);
    $ticket->update([
        'status' => 'closed',
        'closed_at' => now(),
        'closed_by_id' => Auth::id(),
    ]);

    $authUser = Auth::user();

    // ✅ لو اللي قفل مش هو صاحب التذكرة → ابعتله إشعار
   
        Notification::create([
            'user_id' => $ticket->user_id,
            'message' => "Ticket #{$ticket->number} has been closed",
        ]);
    

    // ✅ إشعار لكل الأدمنات ما عدا اللي نفذ
    User::where('role', 'admin')
        ->where('id', '!=', $authUser->id)
        ->get()
        ->each(function ($admin) use ($ticket) {
            Notification::create([
                'user_id' => $admin->id,
                'message' => "Ticket #{$ticket->number} has been closed.",
            ]);
        });

    // ✅ إرسال بريد
    Mail::to($ticket->user->email)->send(new TicketStatusChanged($ticket));

    return $ticket;
}

public function open($_, array $args)
{
    $ticket = Ticket::findOrFail($args['id']);
    $ticket->update([
        'status' => 'open',
        'reopened_at' => now(),
        'reopened_by_id' => Auth::id(),
    ]);

    $authUser = Auth::user();

    // ✅ لو اللي فتح مش هو صاحب التذكرة → ابعتله إشعار
        Notification::create([
            'user_id' => $ticket->user_id,
            'message' => "Ticket #{$ticket->number} has been reopened.",
        ]);

    // ✅ إشعار لكل الأدمنات ما عدا اللي نفذ
    User::where('role', 'admin')
        ->where('id', '!=', $authUser->id)
        ->get()
        ->each(function ($admin) use ($ticket) {
            Notification::create([
                'user_id' => $admin->id,
                'message' => "Ticket #{$ticket->number} has been reopened.",
            ]);
        });

    // ✅ إرسال بريد
    Mail::to($ticket->user->email)->send(new TicketStatusChanged($ticket));

    return $ticket;
}


}