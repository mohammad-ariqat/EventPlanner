<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Feedback;
use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Mail\FeedbackRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class FeedbackController extends Controller
{
    public function index(Event $event): JsonResponse
    {
        // Check if the user owns this event
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($event->feedback);
    }

    public function store(Request $request, Event $event): JsonResponse
    {
        // Validate the participant exists
        $validated = $request->validate([
            'participant_id' => 'required|exists:participants,id',
            'rating' => 'nullable|integer|min:1|max:5',
            'comments' => 'nullable|string',
        ]);

        // Ensure at least one of rating or comments is provided
        if (is_null($validated['rating']) && (is_null($validated['comments']) || empty($validated['comments']))) {
            return response()->json(['message' => 'Either rating or comments must be provided'], 422);
        }

        // Check if feedback already exists for this participant
        $existingFeedback = Feedback::where('event_id', $event->id)
            ->where('participant_id', $validated['participant_id'])
            ->first();

        if ($existingFeedback) {
            $existingFeedback->update($validated);
            return response()->json($existingFeedback);
        }

        // Create new feedback
        $feedback = $event->feedback()->create($validated);

        return response()->json($feedback, 201);
    }

    public function request(Event $event): JsonResponse
    {
        // Check if the user owns this event
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Get all confirmed or attended participants
        $participants = $event->participants()
            ->whereIn('status', ['confirmed', 'attended'])
            ->get();

        foreach ($participants as $participant) {
            // Send feedback request email
            Mail::to($participant->email)->send(new FeedbackRequest($event, $participant));
        }

        return response()->json(['message' => 'Feedback requests sent successfully']);
    }
}