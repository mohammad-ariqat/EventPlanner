import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
export interface Event {
    id: number;
    title: string;
    description: string | null;
    location: string | null;
    start_date: string;
    end_date: string;
    user_id: number;
    created_at: string;
    updated_at: string;
    participants: Participant[];
    materials: Material[];
    feedback: Feedback[];
  }
  
  export interface Participant {
    id: number;
    event_id: number;
    email: string;
    name: string;
    status: 'invited' | 'confirmed' | 'declined' | 'attended';
    created_at: string;
    updated_at: string;
  }
  
  export interface Material {
    id: number;
    event_id: number;
    name: string;
    file_path: string;
    file_type: string | null;
    file_size: number | null;
    created_at: string;
    updated_at: string;
  }
  
  export interface Feedback {
    id: number;
    event_id: number;
    participant_id: number;
    rating: number | null;
    comments: string | null;
    created_at: string;
    updated_at: string;
  }
