<?php

namespace App\GraphQL\Resolvers;

use App\Models\User;

class UserResolver
{
    public function resolveRole(User $user): ?string
    {
        return $user->role?->value ?? null; // safely get string from enum
    }
}