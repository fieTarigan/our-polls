<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PollAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'poll_id',
        'answer',
    ];

    public function polls(): BelongsTo
    {
        return $this->belongsTo(Poll::class, 'poll_id');
    }

    public function votes(): HasMany
    {
        return $this->hasMany(PollUserVote::class, 'answer_id');
    }
}
