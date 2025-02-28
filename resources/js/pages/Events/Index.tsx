import React from 'react';
import EventList from '@/components/Event-List-Component';
import EventForm from '@/components/Event-Form-Component';

const EventsIndex = () => {
  return (
    <div>
      <EventList />
      <EventForm />
    </div>
  );
};

export default EventsIndex;