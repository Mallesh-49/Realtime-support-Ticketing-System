<?php

namespace App\GraphQL\Queries;

use App\Models\Ticket;

class ViewTicketQuery
{
    public function __invoke($_, array $args)
    {
        return Ticket::with(['user', 'messages'])->findOrFail($args['id']);
    }
}