import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold text-blue-600">Event Planner</Link>
                    <nav>
                        <ul className="flex space-x-6">
                            <li>
                                <Link to="/events" className="text-gray-700 hover:text-blue-600">My Events</Link>
                            </li>
                            <li>
                                <Link to="/events/create" className="text-gray-700 hover:text-blue-600">Create Event</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white shadow-inner mt-auto">
                <div className="container mx-auto px-4 py-4 text-center text-gray-500">
                    &copy; {new Date().getFullYear()} Event Planner. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Layout;