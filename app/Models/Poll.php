<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Poll extends Model
{
    use HasFactory;

    protected $casts = [
        'end_date' => 'datetime',
    ];

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'description',
        'end_date',
        'question',
    ];

    public function users(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(PollAnswer::class, 'poll_id');
    }

    public function votes(): HasMany
    {
        return $this->hasMany(PollUserVote::class, 'poll_id');
    }
}
