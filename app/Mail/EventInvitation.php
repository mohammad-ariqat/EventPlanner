<?php

namespace App\Mail;

use App\Models\Event;
use App\Models\Participant;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EventInvitation extends Mailable
{
    use Queueable, SerializesModels;

    public Event $event;
    public Participant $participant;

    /**
     * Create a new message instance.
     */
    public function __construct(Event $event, Participant $participant)
    {
        $this->event = $event;
        $this->participant = $participant;
    }


    public function build()
    {
        return $this->subject('Invitation: ' . $this->event->title)
                    ->markdown('emails.event-invitation');
    }
    
    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Event Invitation',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'view.name',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
