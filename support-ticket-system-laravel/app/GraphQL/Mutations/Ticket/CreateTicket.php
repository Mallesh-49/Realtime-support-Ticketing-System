<?php

namespace App\GraphQL\Mutations\Ticket;

use App\Models\Ticket;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Status;

class CreateTicket
{
    public function __invoke($_, array $args)
    {
        $user = Auth::user();

        return Ticket::create([
            'user_id' => $user->id,
            'number' => strtoupper(Str::random(10)),
            'title' => $args['input']['title'],
            'description' => $args['input']['description'],
            'status' => Status::OPEN->value,
        ]);
    }
}