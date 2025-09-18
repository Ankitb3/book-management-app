import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router';
import { BooksProvider } from './context/BooksContext';
const queryClient = new QueryClient();
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
      <BooksProvider>

        <ClerkProvider redirectUrl={'/dashboard'} publishableKey={clerkPubKey}>
          <QueryClientProvider client={queryClient}>
                    <App />
          </QueryClientProvider>
        </ClerkProvider> </BooksProvider></BrowserRouter>



  </>
);