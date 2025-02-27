<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\FeedbackController;
use Illuminate\Support\Facades\Route;

// Event routes
Route::apiResource('events', EventController::class);

// Participant routes
Route::get('events/{event}/participants', [ParticipantController::class, 'index']);
Route::post('events/{event}/participants', [ParticipantController::class, 'store']);
Route::post('events/{event}/participants/invite', [ParticipantController::class, 'invite']);
Route::put('participants/{participant}', [ParticipantController::class, 'update']);
Route::delete('participants/{participant}', [ParticipantController::class, 'destroy']);

// Materials routes
Route::get('events/{event}/materials', [MaterialController::class, 'index']);
Route::post('events/{event}/materials', [MaterialController::class, 'store']);
Route::delete('materials/{material}', [MaterialController::class, 'destroy']);
Route::get('materials/{material}/download', [MaterialController::class, 'download']);

// Feedback routes
Route::get('events/{event}/feedback', [FeedbackController::class, 'index']);
Route::post('events/{event}/feedback', [FeedbackController::class, 'store']);
