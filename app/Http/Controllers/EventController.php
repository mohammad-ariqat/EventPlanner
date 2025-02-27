<?php

namespace App\Http\Controllers;

use App\Models\Event;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    public function index(): JsonResponse
    {
        $events = Event::where('user_id', Auth::id())->latest()->get();
        return response()->json($events);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $event = Event::create([
            ...$validated,
            'user_id' => Auth::id(),
        ]);

        return response()->json($event, 201);
    }

    public function show(Event $event): JsonResponse
    {
        // Check if the user owns this event
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($event->load(['participants', 'materials']));
    }

    public function update(Request $request, Event $event): JsonResponse
    {
        // Check if the user owns this event
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
        ]);

        $event->update($validated);

        return response()->json($event);
    }

    public function destroy(Event $event): JsonResponse
    {
        // Check if the user owns this event
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event->delete();

        return response()->json(null, 204);
    }
}