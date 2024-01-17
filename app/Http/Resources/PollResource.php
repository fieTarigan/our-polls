<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PollResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'question' => $this->question,
            'end_date' => (new \DateTime($this->end_date))->format('Y-m-d'),
            'created_at' => $this->created_at->format('d/M/Y H:i:s'),
            'updated_at' => $this->updated_at->format('d/M/Y H:i:s'),
            'answer' => AnswerResource::collection($this->answers)
        ];
    }
}
