<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Material;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class MaterialController extends Controller
{
    public function index(Event $event): JsonResponse
    {
        // Check if the user owns this event
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($event->materials);
    }

    public function store(Request $request, Event $event): JsonResponse
    {
        // Check if the user owns this event
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        $file = $request->file('file');
        $path = $file->store('materials/' . $event->id);

        $material = $event->materials()->create([
            'name' => $validated['name'],
            'file_path' => $path,
            'file_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
        ]);

        return response()->json($material, 201);
    }

    public function destroy(Material $material): JsonResponse
    {
        // Check if the user owns the event for this material
        $event = $material->event;
        if ($event->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete the file
        Storage::delete($material->file_path);

        // Delete the record
        $material->delete();

        return response()->json(null, 204);
    }

    public function download(Material $material)
    {
        // Check if the user owns the event or is a participant
        $event = $material->event;
        $isParticipant = $event->participants()->where('email', Auth::user()->email)->exists();
        
        if ($event->user_id !== Auth::id() && !$isParticipant) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!Storage::exists($material->file_path)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return Storage::download($material->file_path, $material->name);
    }
}