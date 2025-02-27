<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Mail\EventInvitation;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class ParticipantController extends Controller
{
    public function index(Event $event): JsonResponse
    {
        // Check if the user owns this event
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($event->participants);
    }

    public function store(Request $request, Event $event): JsonResponse
    {
        // Check if the user owns this event
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'email' => 'required|email',
            'name' => 'required|string|max:255',
        ]);

        $participant = $event->participants()->create($validated);

        return response()->json($participant, 201);
    }

    public function invite(Request $request, Event $event): JsonResponse
    {
        // Check if the user owns this event
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'emails' => 'required|array',
            'emails.*' => 'email',
            'names' => 'required|array',
            'names.*' => 'string|max:255',
        ]);

        $participants = [];

        for ($i = 0; $i < count($validated['emails']); $i++) {
            $email = $validated['emails'][$i];
            $name = $validated['names'][$i];

            // Create participant
            $participant = $event->participants()->create([
                'email' => $email,
                'name' => $name,
                'status' => 'invited',
            ]);
            
            $participants[] = $participant;

            // Send invitation email
            Mail::to($email)->send(new EventInvitation($event, $participant));
        }

        return response()->json($participants, 201);
    }

    public function update(Request $request, Participant $participant): JsonResponse
    {
        // Check if the user owns the event for this participant
        $event = $participant->event;
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'sometimes|in:invited,confirmed,declined,attended',
        ]);

        $participant->update($validated);

        return response()->json($participant);
    }

    public function destroy(Participant $participant): JsonResponse
    {
        // Check if the user owns the event for this participant
        $event = $participant->event;
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $participant->delete();

        return response()->json(null, 204);
    }
}