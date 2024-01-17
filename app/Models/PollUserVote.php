<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PollUserVote extends Model
{
    use HasFactory;

    protected $fillable = [
        'poll_id',
        'answer_id',
        'user_id',
    ];

    public function users(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function polls(): BelongsTo
    {
        return $this->belongsTo(Poll::class, 'poll_id');
    }

    public function answers(): BelongsTo
    {
        return $this->belongsTo(PollAnswer::class, 'answer_id');
    }
}
