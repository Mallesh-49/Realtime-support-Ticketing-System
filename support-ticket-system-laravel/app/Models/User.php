<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;
use App\Role;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    protected $fillable = [
        'username', 'email', 'google_id', 'phone',
        'password', 'department', 'role', 'email_verified_at',
    ];

    protected $hidden = ['password'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'role' => Role::class, // دا المهم هنا
    ];


    use HasApiTokens, Notifiable;

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function closedTickets(): HasMany
    {
        return $this->hasMany(Ticket::class, 'closed_by_id');
    }

    public function reopenedTickets(): HasMany
    {
        return $this->hasMany(Ticket::class, 'reopened_by_id');
    }
}
