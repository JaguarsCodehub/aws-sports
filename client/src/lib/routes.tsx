// Add these routes to your Next.js app
const routes = {
    auth: {
        login: '/auth',
        adminLogin: '/admin-login',
        signup: '/auth/signup',
        organizer: '/auth/organizer'
    },
    admin: {
        createEvent: '/admin/create-events',
        eventsList: '/admin/events'
    },
    events: {
        list: '/admin/events',
        participantList: '/events',
        detail: (id: string) => `/events/${id}`
    }
};

export default routes;