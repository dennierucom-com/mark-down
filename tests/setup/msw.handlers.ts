import { http, HttpResponse } from 'msw';

export const handlers = [
  // Example: Mock an API call that the SW might cache
  http.get('https://api.github.com/repos/dennierucom-com/mark-down', () => {
    return HttpResponse.json({ 
      stargazers_count: 42,
      description: 'Mocked Repository Data' 
    });
  }),
  
  // Example: Mocking a local asset fetch for service worker tests
  http.get('/manifest.webmanifest', () => {
    return HttpResponse.json({
        name: 'Markdowner',
        short_name: 'Markdowner',
        start_url: '/',
        display: 'standalone'
    });
  })
];
